const admin = require("firebase-admin");
const { onCall, HttpsError } = require("firebase-functions/v2/https");
const RECOVERY_MS = 30 * 24 * 60 * 60 * 1000;
const database = () => { if (!admin.apps.length) admin.initializeApp(); return admin.firestore(); };
const isBlocked = (data) => ["pending", "processing", "completed"].includes(data?.status);
const validateRequest = (request, now = Date.now()) => {
  if (!request.auth?.uid) throw new HttpsError("unauthenticated", "Sign in to manage your account.");
  if (!Number.isFinite(request.auth.token?.auth_time) || (now / 1000 - request.auth.token.auth_time > 300 || request.auth.token.auth_time > now / 1000 + 60)) {
    throw new HttpsError("failed-precondition", "Sign in again before changing your deletion request.");
  }
  if (request.auth.token.admin || ["admin", "tutor"].includes(request.auth.token.role) || request.auth.token.email === "moxflex@gmail.com") {
    throw new HttpsError("permission-denied", "Staff accounts must be managed by Falowen support.");
  }
};
async function ownedProfiles(tx, db, auth) {
  const profiles = new Map();
  const direct = await tx.get(db.collection("students").doc(auth.uid));
  if (direct.exists) profiles.set(direct.id, direct);
  const byUid = await tx.get(db.collection("students").where("uid", "==", auth.uid));
  byUid.docs.forEach(profile => profiles.set(profile.id, profile));
  const email = String(auth.token.email || "").trim().toLowerCase();
  if (email) for (const field of ["email", "authEmail", "loginEmail"]) {
    const found = await tx.get(db.collection("students").where(field, "==", email));
    for (const profile of found.docs) if (!profile.data().uid || profile.data().uid === auth.uid) profiles.set(profile.id, profile);
  }
  return [...profiles.values()];
}
const options = { region: "europe-west1", cpu: "gcf_gen1", maxInstances: 2 };
exports.requestAccountDeletion = onCall(options, async (request) => {
  validateRequest(request);
  if (request.data?.confirmation !== "DELETE") throw new HttpsError("invalid-argument", "Type DELETE to confirm.");
  const db = database();
  const ref = db.collection("accountDeletionRequests").doc(request.auth.uid);
  return db.runTransaction(async (tx) => {
    const previous = (await tx.get(ref)).data();
    if (isBlocked(previous)) return { status: previous.status, deleteAt: previous.deleteAt };
    const profiles = await ownedProfiles(tx, db, request.auth);
    if (profiles.some(profile => profile.data().role && String(profile.data().role).toLowerCase() !== "student")) throw new HttpsError("permission-denied", "Staff accounts must be managed by support.");
    const deleteAt = new Date(Date.now() + RECOVERY_MS).toISOString();
    for (const profile of profiles) tx.update(profile.ref, { uid: request.auth.uid, accountDeletionStatus: "pending", notificationsPausedForDeletion: true, messagingToken: null, messagingTokens: [] });
    tx.set(ref, { email: String(request.auth.token.email || "").trim().toLowerCase(), uid: request.auth.uid, status: "pending", requestedAt: new Date().toISOString(), deleteAt });
    return { status: "pending", deleteAt };
  });
});
exports.cancelAccountDeletion = onCall(options, async (request) => {
  validateRequest(request);
  const db = database();
  const ref = db.collection("accountDeletionRequests").doc(request.auth.uid);
  return db.runTransaction(async (tx) => {
    const data = (await tx.get(ref)).data();
    if (!data || data.status === "cancelled") return { status: "cancelled" };
    if (data.status !== "pending" || Date.parse(data.deleteAt) <= Date.now()) throw new HttpsError("failed-precondition", "The recovery period has ended.");
    const profiles = await ownedProfiles(tx, db, request.auth);
    for (const profile of profiles) tx.update(profile.ref, { accountDeletionStatus: "cancelled", notificationsPausedForDeletion: false });
    tx.update(ref, { status: "cancelled", cancelledAt: new Date().toISOString() });
    return { status: "cancelled" };
  });
});

// Explicit ownership queries avoid scanning unrelated students' records. Payment
// ledgers are intentionally excluded; deletion does not cancel a tuition debt.
const COLLECTIONS = ["students", "users", "submissions", "submissionDrafts", "submissionLocks", "submissionAttemptCounters", "scores", "writingSubmissions", "writingProgress", "speakingProgress", "selfLearningProgress", "lessonProgress", "assignmentProgress", "courseCompletionSnapshots", "examTutorReviewQueue", "mockProgressMonitor", "a1MockExamUsers", "a2MockExamUsers", "b1MockExamUsers", "b2MockExamUsers", "c1MockExamUsers", "c2MockExamUsers", "loginSessions", "studentActivityEvents", "studentNotifications", "notifications", "studyBuddyUsage", "usageQuotas", "aiAuditLogs", "qa_posts", "examRoomResults"];
const OWNER_FIELDS = ["uid", "userId", "ownerUid", "authUid", "studentId", "studentCode", "studentcode", "ownerKey"];
async function purgeDueAccounts({ db, auth, purgeSheets, now = Date.now(), storage = admin.storage() }) {
  const requests = await db.collection("accountDeletionRequests").where("status", "in", ["pending", "processing"]).get();
  for (const request of requests.docs) {
    if (!Number.isFinite(Date.parse(request.data().deleteAt)) || Date.parse(request.data().deleteAt) > now) continue;
    const locked = await db.runTransaction(async (tx) => {
      const current = (await tx.get(request.ref)).data();
      if (!isBlocked(current) || Date.parse(current.deleteAt) > now) return false;
      tx.update(request.ref, { status: "processing" }); return true;
    });
    if (!locked) continue;
    try {
      const uid = request.id;
      const profiles = await db.collection("students").where("uid", "==", uid).get();
      const direct = await db.collection("students").doc(uid).get();
      const profileDocs = [...profiles.docs, ...(direct.exists ? [direct] : [])];
      const email = request.data().email;
      if (email) for (const field of ["email", "authEmail", "loginEmail"]) {
        for (const profile of (await db.collection("students").where(field, "==", email).get()).docs) {
          if (!profile.data().uid || profile.data().uid === uid) profileDocs.push(profile);
        }
      }
      const identities = new Set([uid, ...(request.data().identities || [])]);
      for (const profile of profileDocs) {
        const data = profile.data();
        for (const value of [profile.id, data.studentCode, data.studentcode]) if (value) identities.add(String(value));
        await purgeSheets({ studentCode: data.studentCode || data.studentcode || profile.id, uid, email: data.email || data.authEmail || "" });
      }
      await request.ref.update({ identities: [...identities] });
      const refs = new Map();
      // Attendance sessions are shared documents: remove only this student's
      // keyed entries and check-in, never the class session itself.
      for (const classDoc of (await db.collection("attendance").get()).docs) {
        for (const session of (await classDoc.ref.collection("sessions").get()).docs) {
          const changes = {};
          for (const field of ["attendance", "students", "participants"]) {
            const map = session.data()[field];
            if (map && !Array.isArray(map)) {
              const remaining = { ...map };
              for (const identity of identities) delete remaining[identity];
              if (Object.keys(remaining).length !== Object.keys(map).length) changes[field] = remaining;
            }
          }
          if (Object.keys(changes).length) await session.ref.update(changes);
          const checkin = session.ref.collection("checkins").doc(uid);
          if ((await checkin.get()).exists) await db.recursiveDelete(checkin);
        }
      }
      for (const collection of COLLECTIONS) {
        for (const identity of identities) {
          const directDoc = await db.collection(collection).doc(identity).get();
          if (directDoc.exists) refs.set(directDoc.ref.path, directDoc.ref);
          for (const field of OWNER_FIELDS) {
            const found = await db.collection(collection).where(field, "==", identity).get();
            for (const doc of found.docs) refs.set(doc.ref.path, doc.ref);
          }
        }
      }
      // Discussion trees contain shared class containers and private posts.
      // Traverse those containers, deleting only documents with matching ownership.
      const findSharedPosts = async (ref) => {
        const data = (await ref.get()).data() || {};
        if (OWNER_FIELDS.some(field => identities.has(String(data[field] || "")))) {
          refs.set(ref.path, ref); return;
        }
        for (const collection of await ref.listCollections()) {
          for (const child of await collection.listDocuments()) await findSharedPosts(child);
        }
      };
      for (const name of ["class_board", "group_discussion", "qa_posts", "sessions", "archived"]) {
        for (const ref of await db.collection(name).listDocuments()) await findSharedPosts(ref);
      }
      // Collect recording references before removing documents and descendants.
      const files = new Set();
      const collect = (value) => {
        if (typeof value === "string") {
          try { const url = new URL(value); const match = url.pathname.match(/^\/v0\/b\/([^/]+)\/o\/(.+)$/);
            if (url.hostname === "firebasestorage.googleapis.com" && match && decodeURIComponent(match[1]) === storage.bucket().name) files.add(decodeURIComponent(match[2]));
          } catch (_) { /* not a Storage URL */ }
        } else if (value && typeof value === "object") Object.values(value).forEach(collect);
      };
      const walk = async (ref) => {
        collect((await ref.get()).data());
        for (const collection of await ref.listCollections()) for (const child of (await collection.get()).docs) await walk(child.ref);
      };
      for (const ref of refs.values()) await walk(ref);
      for (const file of files) {
        const object = storage.bucket().file(file);
        let metadata;
        try { [metadata] = await object.getMetadata(); } catch (error) { if (Number(error.code) === 404) continue; throw error; }
        const owner = metadata.metadata?.uid || metadata.metadata?.ownerUid;
        const ownedPath = [`users/${uid}/`, `students/${uid}/`, `speech-trainer/${uid}/`].some(prefix => file.startsWith(prefix));
        if (owner !== uid && !ownedPath) {
          await request.ref.update({ reviewRequired: true, reviewReason: "recording_ownership", recordingPaths: [...files] });
          throw Object.assign(new Error("Recording ownership must be reviewed before deletion"), { code: "recording-ownership-review" });
        }
      }
      for (const file of files) await storage.bucket().file(file).delete({ ignoreNotFound: true });
      for (const prefix of [`users/${uid}/`, `students/${uid}/`]) await storage.bucket().deleteFiles({ prefix });
      // Keep Auth until every data operation succeeds so a failure is retryable.
      for (const ref of refs.values()) await db.recursiveDelete(ref);
      try { await auth.deleteUser(uid); } catch (error) { if (error.code !== "auth/user-not-found") throw error; }
      await request.ref.set({ status: "completed" });
    } catch (error) {
      await request.ref.update({ lastFailureAt: new Date().toISOString() });
      console.error("Account deletion failed; daily cleanup will retry", request.id, error.code || "unknown");
    }
  }
}
exports._purgeDueAccounts = purgeDueAccounts;
exports._validateRequest = validateRequest;
exports._isBlocked = isBlocked;
exports._RECOVERY_MS = RECOVERY_MS;

exports._protectedOnCall = (options, handler) => onCall(options, async request => {
  if (request.auth?.uid && isBlocked((await database().collection("accountDeletionRequests").doc(request.auth.uid).get()).data())) {
    throw new HttpsError("permission-denied", "Your account is scheduled for deletion. Cancel deletion to restore access.");
  }
  return handler(request);
});
