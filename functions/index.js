const { setGlobalOptions } = require("firebase-functions/v2");
const { onRequest } = require("firebase-functions/v2/https");
const {
  onDocumentCreated,
  onDocumentUpdated,
} = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const { FieldValue, FieldPath } = require("firebase-admin/firestore");

const getAdmin = () => {
  if (!admin.apps.length) {
    admin.initializeApp();
  }
  return admin;
};

setGlobalOptions({ maxInstances: 10 });

const GOOGLE_SERVICE_ACCOUNT_JSON_B64 = defineSecret("GOOGLE_SERVICE_ACCOUNT_JSON_B64");
const STUDENTS_SHEET_ID = defineSecret("STUDENTS_SHEET_ID");
const STUDENTS_SHEET_TAB = defineSecret("STUDENTS_SHEET_TAB");
const RESULTS_SHEET_PUBLISHED_CSV_URL = defineSecret("RESULTS_SHEET_PUBLISHED_CSV_URL");
const ZOOM_WEBHOOK_SECRET = defineSecret("ZOOM_WEBHOOK_SECRET");

let appInstance;
let appendStudentToStudentsSheetSafely;

const getApp = () => {
  if (!appInstance) {
    // Lazy-load the Express app so deployment initialization stays fast.
    appInstance = require("./functionz/app");
  }
  return appInstance;
};

const getStudentAppender = () => {
  if (!appendStudentToStudentsSheetSafely) {
    // Lazy-load the Sheets helper to avoid importing googleapis during cold start.
    ({ appendStudentToStudentsSheetSafely } = require("./functionz/studentsSheet"));
  }
  return appendStudentToStudentsSheetSafely;
};

const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;
const NOTIFICATION_BATCH_SIZE = 500;
const UNPAID_SIGNUP_GRACE_DAYS = 7;
const UNPAID_SIGNUP_GRACE_MS = UNPAID_SIGNUP_GRACE_DAYS * 24 * 60 * 60 * 1000;

const safeTruncate = (text = "", maxLength = 140) => {
  const str = String(text || "").trim();
  if (str.length <= maxLength) return str;
  return `${str.slice(0, Math.max(1, maxLength - 1))}…`;
};

const normalizeValue = (value) => String(value || "").trim().toLowerCase();

const normalizeStudentCode = (value) => String(value || "").trim().toLowerCase();

const toBooleanLike = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value > 0;
  if (typeof value === "string") {
    const normalized = normalizeValue(value);
    if (["present", "p", "yes", "y", "true", "1", "attended", "late"].includes(normalized)) {
      return true;
    }
    if (["absent", "a", "no", "n", "false", "0", "missed"].includes(normalized)) {
      return false;
    }
  }
  if (value && typeof value === "object") {
    if ("present" in value) return toBooleanLike(value.present);
    if ("attended" in value) return toBooleanLike(value.attended);
    if ("status" in value) return toBooleanLike(value.status);
  }
  return false;
};

const extractAttendanceMap = (sessionData = {}) => {
  const map = sessionData.attendance || sessionData.students || sessionData.participants;
  if (!map || typeof map !== "object") return {};
  return map;
};

const getPresentCodesFromAttendanceSession = (sessionData = {}) => {
  const map = extractAttendanceMap(sessionData);
  return new Set(
    Object.entries(map)
      .filter(([, value]) => toBooleanLike(value))
      .map(([studentCode]) => normalizeStudentCode(studentCode))
      .filter(Boolean)
  );
};

const getNewlyPresentCodes = ({ before = {}, after = {} } = {}) => {
  const beforeSet = getPresentCodesFromAttendanceSession(before);
  const afterSet = getPresentCodesFromAttendanceSession(after);
  return Array.from(afterSet).filter((code) => !beforeSet.has(code));
};

const getMillisFromTimestampLike = (value) => {
  if (!value) return Number.NaN;
  if (typeof value?.toMillis === "function") {
    return value.toMillis();
  }
  if (typeof value === "string" || value instanceof Date || typeof value === "number") {
    const parsed = new Date(value).getTime();
    return Number.isFinite(parsed) ? parsed : Number.NaN;
  }
  return Number.NaN;
};

const hasStudentMadePayment = (student = {}) => {
  const paymentStatus = normalizeValue(student.paymentStatus);
  if (["paid", "partial"].includes(paymentStatus)) return true;

  const paidFields = [student.paid, student.paidAmount, student.initialPaymentAmount];
  return paidFields.some((value) => Number(value) > 0);
};

const isStaleUnpaidSignup = (student = {}, cutoffMs) => {
  if (!student || hasStudentMadePayment(student)) return false;

  const joinedAtMs = getMillisFromTimestampLike(student.joined_at);
  if (!Number.isFinite(joinedAtMs)) return false;

  return joinedAtMs < cutoffMs;
};

const buildDiscussionRoute = ({ level = "", className = "", postId = "" } = {}) => {
  const params = new URLSearchParams();
  if (level) params.set("level", level);
  if (className) params.set("className", className);
  if (postId) params.set("postId", postId);
  const query = params.toString();
  return `/campus/discussion${query ? `?${query}` : ""}`;
};

const resolveNotificationRoute = (data = {}) => {
  if (data.route) return data.route;
  const type = String(data.type || "").toLowerCase();
  if (data.postId || type.includes("discussion") || type.includes("class")) {
    return buildDiscussionRoute(data);
  }
  if (type.includes("score") || type.includes("assignment")) {
    return "/campus/results";
  }
  return "/";
};

const getFirestore = () => getAdmin().firestore();

const normalizeTutorReviewStatus = (value) => {
  const normalized = normalizeValue(value);
  if (["approved", "approve", "done", "pass"].includes(normalized)) return "approved";
  if (["needs_improvement", "needs-improvement", "improve", "revision"].includes(normalized)) {
    return "needs_improvement";
  }
  if (["pending", "queued", "new"].includes(normalized)) return "pending";
  return normalized || "pending";
};

const notifyTutorReviewStatusUpdate = async ({ reviewId, beforeData = {}, afterData = {} }) => {
  const beforeStatus = normalizeTutorReviewStatus(beforeData.reviewStatus || beforeData.status);
  const afterStatus = normalizeTutorReviewStatus(afterData.reviewStatus || afterData.status);
  if (!afterStatus || afterStatus === "pending" || afterStatus === beforeStatus) {
    return null;
  }

  const studentCode =
    afterData.studentCode || afterData.studentcode || afterData.ownerKey || beforeData.studentCode || "";

  const tokenInfo = await fetchStudentMessagingToken(studentCode);
  if (!tokenInfo?.tokens?.length) {
    console.log(`notifyTutorReviewStatusUpdate: no messaging token for ${studentCode}`);
    return null;
  }

  const reviewLabel = afterData.promptTitle || afterData.assignmentTitle || "your exam letter";
  const tutorFeedback = afterData.tutorFeedback || afterData.reviewComment || "";
  const notification = {
    title: afterStatus === "approved" ? "Tutor approved your exam letter" : "Tutor requested improvements",
    body: safeTruncate(
      tutorFeedback ||
        (afterStatus === "approved"
          ? `${reviewLabel} is approved. Great work!`
          : `${reviewLabel} has tutor feedback. Please review and revise.`),
      140
    ),
  };

  const data = {
    type: "exam_tutor_review",
    reviewId: reviewId || "",
    reviewStatus: afterStatus,
    studentCode: String(studentCode || ""),
    level: afterData.level || "",
    route: "/exams/writing",
  };

  const tokenOwners = tokenInfo.docId
    ? new Map(tokenInfo.tokens.map((token) => [token, tokenInfo.docId]))
    : new Map();

  await sendNotifications({
    tokens: tokenInfo.tokens,
    notification,
    data,
    tokenOwners,
  });

  return null;
};

const getTokensFromStudentData = (data = {}) => {
  const tokens = new Set();
  if (data.messagingToken) {
    tokens.add(data.messagingToken);
  }
  if (Array.isArray(data.messagingTokens)) {
    data.messagingTokens.forEach((entry) => {
      if (entry?.token) {
        tokens.add(entry.token);
      }
    });
  }
  return Array.from(tokens);
};

const fetchStudentMessagingToken = async (studentCode) => {
  if (!studentCode) return null;

  const db = getFirestore();
  const normalized = String(studentCode).trim();
  const candidates = Array.from(
    new Set([normalized, normalized.toLowerCase(), normalized.toUpperCase()])
  ).filter(Boolean);

  for (const id of candidates) {
    const snap = await db.collection("students").doc(id).get();
    if (!snap.exists) continue;

    const data = snap.data() || {};
    const tokens = getTokensFromStudentData(data);
    if (!tokens.length) continue;

    return { tokens, data, docId: snap.id };
  }

  const lookupFields = ["studentCode", "studentcode", "uid"];

  for (const field of lookupFields) {
    const snapshot = await db
      .collection("students")
      .where(field, "in", candidates)
      .limit(1)
      .get();

    if (snapshot.empty) continue;

    const docSnap = snapshot.docs[0];
    const data = docSnap.data() || {};
    const tokens = getTokensFromStudentData(data);
    if (!tokens.length) continue;

    return { tokens, data, docId: docSnap.id };
  }

  return null;
};

const fetchClassMessagingTokens = async ({ level, className, excludeCodes = new Set() }) => {
  const db = getFirestore();
  const snapshot = await db
    .collection("students")
    .where("level", "==", level)
    .where("className", "==", className)
    .get();

  const tokens = new Set();
  const tokenOwners = new Map();

  snapshot.forEach((docSnap) => {
    const data = docSnap.data() || {};
    const studentCode = String(data.studentcode || docSnap.id || "").toLowerCase();

    if (excludeCodes.has(studentCode)) return;

    const docTokens = getTokensFromStudentData(data);
    docTokens.forEach((token) => {
      if (!token) return;
      tokens.add(token);
      tokenOwners.set(token, docSnap.id);
    });
  });

  return { tokens: Array.from(tokens), tokenOwners };
};

const fetchAnnouncementTokens = async ({ className, program } = {}) => {
  const db = getFirestore();
  const baseRef = db.collection("students");
  const programFields = program ? ["program", "language", "lang"] : [null];
  const snapshots = await Promise.all(
    programFields.map((field) => {
      let queryRef = baseRef;
      if (className) {
        queryRef = queryRef.where("className", "==", className);
      }
      if (program && field) {
        queryRef = queryRef.where(field, "==", program);
      }
      return queryRef.get();
    })
  );

  const tokens = new Set();
  const tokenOwners = new Map();

  snapshots.forEach((snapshot) => {
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() || {};
      const docTokens = getTokensFromStudentData(data);
      docTokens.forEach((token) => {
        if (!token) return;
        tokens.add(token);
        tokenOwners.set(token, docSnap.id);
      });
    });
  });

  return { tokens: Array.from(tokens), tokenOwners };
};

const mergeTokenResults = (current, next) => {
  next.tokens.forEach((token) => {
    current.tokens.add(token);
    if (next.tokenOwners.has(token) && !current.tokenOwners.has(token)) {
      current.tokenOwners.set(token, next.tokenOwners.get(token));
    }
  });
  return current;
};

const getInvalidTokenReason = (code = "") => {
  return [
    "messaging/invalid-registration-token",
    "messaging/registration-token-not-registered",
  ].includes(code)
    ? code
    : null;
};

const cleanupInvalidTokens = async (tokenOwners, invalidTokens) => {
  if (!invalidTokens.length) return null;
  const db = getFirestore();
  const updates = new Map();

  invalidTokens.forEach((token) => {
    const docId = tokenOwners.get(token);
    if (!docId) return;
    if (!updates.has(docId)) {
      updates.set(docId, new Set());
    }
    updates.get(docId).add(token);
  });

  if (!updates.size) return null;

  await Promise.all(
    Array.from(updates.entries()).map(async ([docId, tokensToRemove]) => {
      const docRef = db.collection("students").doc(docId);
      const snap = await docRef.get();
      if (!snap.exists) return;
      const data = snap.data() || {};
      const existing = Array.isArray(data.messagingTokens) ? data.messagingTokens : [];
      const filtered = existing.filter((entry) => !tokensToRemove.has(entry?.token));
      const updatesPayload = { messagingTokens: filtered };
      if (data.messagingToken && tokensToRemove.has(data.messagingToken)) {
        updatesPayload.messagingToken = FieldValue.delete();
      }
      await docRef.set(updatesPayload, { merge: true });
    })
  );

  return null;
};

const sendNotifications = async ({
  tokens = [],
  notification = {},
  data = {},
  tokenOwners = new Map(),
}) => {
  if (!tokens.length) return null;

  const messaging = getAdmin().messaging();
  const chunks = [];
  const invalidTokens = new Set();
  const webpushOptions = {
    headers: {
      TTL: "86400",
      Urgency: "high",
    },
    notification: {
      actions: [{ action: "open", title: "Open" }],
      data: { ...data },
    },
    fcmOptions: data?.route ? { link: data.route } : undefined,
  };

  for (let i = 0; i < tokens.length; i += NOTIFICATION_BATCH_SIZE) {
    chunks.push(tokens.slice(i, i + NOTIFICATION_BATCH_SIZE));
  }

  for (const chunk of chunks) {
    const response = await messaging.sendEachForMulticast({
      tokens: chunk,
      notification,
      data,
      webpush: webpushOptions,
    });
    response.responses.forEach((result, index) => {
      if (result.success) return;
      const reason = getInvalidTokenReason(result.error?.code);
      if (!reason) return;
      invalidTokens.add(chunk[index]);
    });
  }

  if (invalidTokens.size) {
    await cleanupInvalidTokens(tokenOwners, Array.from(invalidTokens));
  }

  return null;
};

const getThreadMetadata = async (threadId) => {
  const db = getFirestore();

  const snapshot = await db
    .collectionGroup("posts")
    .where(FieldPath.documentId(), "==", threadId)
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const docSnap = snapshot.docs[0];
  const data = docSnap.data() || {};
  const classDocRef = docSnap.ref.parent.parent;
  const levelDocRef = classDocRef?.parent?.parent;

  return {
    ...data,
    level: levelDocRef?.id || data.level,
    className: classDocRef?.id || data.className,
  };
};

exports.api = onRequest(
  {
    region: "europe-west1",
    cors: true,
    secrets: [
      "OPENAI_API_KEY",
      GOOGLE_SERVICE_ACCOUNT_JSON_B64,
      "PAYSTACK_SECRET",
      STUDENTS_SHEET_ID,
      STUDENTS_SHEET_TAB,
      RESULTS_SHEET_PUBLISHED_CSV_URL,
      ZOOM_WEBHOOK_SECRET,
    ],
  },
  (req, res) => {
    process.env.RESULTS_SHEET_PUBLISHED_CSV_URL = RESULTS_SHEET_PUBLISHED_CSV_URL.value();
    process.env.SCORES_SHEET_PUBLISHED_CSV_URL = RESULTS_SHEET_PUBLISHED_CSV_URL.value();
    return getApp()(req, res);
  }
);

// When a student doc is created in Firestore, append to Students sheet (safe header-mapped append)
exports.onStudentCreated = onDocumentCreated(
  {
    region: "europe-west1",
    document: "students/{studentCode}",
    secrets: [
      GOOGLE_SERVICE_ACCOUNT_JSON_B64,
      STUDENTS_SHEET_ID,
      STUDENTS_SHEET_TAB,
    ],
  },
  async (event) => {
    console.log("onStudentCreated fired for", event.params.studentCode);

    const snap = event.data;
    if (!snap) return;

    const student = snap.data();
    if (!student) return;

    process.env.GOOGLE_SERVICE_ACCOUNT_JSON_B64 = GOOGLE_SERVICE_ACCOUNT_JSON_B64.value();
    process.env.STUDENTS_SHEET_ID = STUDENTS_SHEET_ID.value();
    process.env.STUDENTS_SHEET_TAB = STUDENTS_SHEET_TAB.value();

    const studentCode = String(student.studentCode || event.params.studentCode || "").trim();

    const result = await getStudentAppender()({
      ...student,
      studentCode,
    });

    console.log("onStudentCreated -> sheet sync result:", result);
  }
);


// Keep Students sheet in sync when student records change (e.g., payment webhooks)
exports.onStudentUpdated = onDocumentUpdated(
  {
    region: "europe-west1",
    document: "students/{studentCode}",
    secrets: [
      GOOGLE_SERVICE_ACCOUNT_JSON_B64,
      STUDENTS_SHEET_ID,
      STUDENTS_SHEET_TAB,
    ],
  },
  async (event) => {
    const after = event.data?.after;
    if (!after?.exists) return;

    const student = after.data();
    if (!student) return;

    process.env.GOOGLE_SERVICE_ACCOUNT_JSON_B64 = GOOGLE_SERVICE_ACCOUNT_JSON_B64.value();
    process.env.STUDENTS_SHEET_ID = STUDENTS_SHEET_ID.value();
    process.env.STUDENTS_SHEET_TAB = STUDENTS_SHEET_TAB.value();

    const studentCode = String(student.studentCode || event.params.studentCode || "").trim();
    const result = await getStudentAppender()({
      ...student,
      studentCode,
    });

    console.log("onStudentUpdated -> sheet sync result:", result);
  }
);

exports.archiveOldThreads = onSchedule(
  {
    region: "europe-west1",
    schedule: "every 24 hours",
    timeZone: "Etc/UTC",
  },
  async () => {
    const db = getFirestore();
    const cutoff = getAdmin().firestore.Timestamp.fromMillis(Date.now() - THIRTY_DAYS_IN_MS);
    const snapshot = await db.collectionGroup("posts").where("createdAt", "<", cutoff).get();

    if (snapshot.empty) {
      console.log("archiveOldThreads: no threads older than cutoff");
      return null;
    }

    const batches = [];
    let batch = db.batch();
    let batchWriteCount = 0;

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const level = data.level;
      const className = data.className;

      if (!level || !className) {
        console.warn(`archiveOldThreads: missing class metadata for post ${docSnap.id}`);
        return;
      }

      const archiveRef = db
        .collection("class_board")
        .doc(level)
        .collection("classes")
        .doc(className)
        .collection("archived")
        .doc(docSnap.id);

      batch.set(archiveRef, {
        ...data,
        status: "archived",
        archivedAt: FieldValue.serverTimestamp(),
      });
      batch.delete(docSnap.ref);
      batchWriteCount += 2;

      if (batchWriteCount >= 400) {
        batches.push(batch.commit());
        batch = db.batch();
        batchWriteCount = 0;
      }
    });

    if (batchWriteCount > 0) {
      batches.push(batch.commit());
    }

    await Promise.all(batches);
    console.log(`archiveOldThreads: archived ${snapshot.size} threads`);

    return null;
  }
);

exports.cleanupStaleUnpaidSignups = onSchedule(
  {
    region: "europe-west1",
    schedule: "every day 02:30",
    timeZone: "Etc/UTC",
  },
  async () => {
    const db = getFirestore();
    const auth = getAdmin().auth();
    const cutoffMs = Date.now() - UNPAID_SIGNUP_GRACE_MS;

    const pendingSnapshot = await db
      .collection("students")
      .where("paymentStatus", "==", "pending")
      .get();

    if (pendingSnapshot.empty) {
      console.log("cleanupStaleUnpaidSignups: no pending signup records found");
      return null;
    }

    const staleDocs = pendingSnapshot.docs.filter((docSnap) =>
      isStaleUnpaidSignup(docSnap.data() || {}, cutoffMs)
    );

    if (!staleDocs.length) {
      console.log("cleanupStaleUnpaidSignups: no stale unpaid signups eligible for deletion");
      return null;
    }

    let deletedDocs = 0;
    let deletedAuthUsers = 0;

    for (const docSnap of staleDocs) {
      const student = docSnap.data() || {};
      const studentCode = String(student.studentCode || student.studentcode || docSnap.id || "");
      const uid = String(student.uid || "").trim();

      if (uid) {
        try {
          await auth.deleteUser(uid);
          deletedAuthUsers += 1;
        } catch (error) {
          if (error?.code !== "auth/user-not-found") {
            console.error("cleanupStaleUnpaidSignups: failed to delete auth user", {
              studentCode,
              uid,
              errorMessage: error?.message,
              code: error?.code,
            });
            continue;
          }
        }
      }

      await docSnap.ref.delete();
      deletedDocs += 1;
    }

    console.log("cleanupStaleUnpaidSignups: completed", {
      scannedPending: pendingSnapshot.size,
      staleCandidates: staleDocs.length,
      deletedDocs,
      deletedAuthUsers,
      graceDays: UNPAID_SIGNUP_GRACE_DAYS,
    });

    return null;
  }
);

const getNewResponses = (beforeData = {}, afterData = {}) => {
  const beforeResponses = Array.isArray(beforeData.responses)
    ? beforeData.responses
    : [];
  const afterResponses = Array.isArray(afterData.responses) ? afterData.responses : [];

  if (afterResponses.length <= beforeResponses.length) {
    return [];
  }

  return afterResponses.slice(beforeResponses.length);
};

const notifyNewReply = async ({ threadId, beforeData = {}, afterData = {} }) => {
  const newResponses = getNewResponses(beforeData, afterData);
  if (!newResponses.length) return null;

  const latest = newResponses[newResponses.length - 1];
  const thread = await getThreadMetadata(threadId);

  if (!thread?.level || !thread?.className) {
    console.warn(`notifyNewReply: missing thread metadata for ${threadId}`);
    return null;
  }

  const excludeCodes = new Set();
  if (latest.responderCode) {
    excludeCodes.add(String(latest.responderCode).toLowerCase());
  }

  const { tokens, tokenOwners } = await fetchClassMessagingTokens({
    level: thread.level,
    className: thread.className,
    excludeCodes,
  });

  if (!tokens.length) {
    console.log(`notifyNewReply: no tokens for ${thread.level}/${thread.className}`);
    return null;
  }

  const notification = {
    title: `New reply from ${latest.responder || "a classmate"}`,
    body:
      safeTruncate(latest.text, 140) ||
      safeTruncate(thread.question || thread.questionTitle || "There's a new reply."),
  };

  const data = {
    level: thread.level || "",
    className: thread.className || "",
    postId: threadId,
    responseId: String(latest.id || latest.responderCode || latest.responder || ""),
  };
  data.route = resolveNotificationRoute(data);

  await sendNotifications({ tokens, notification, data, tokenOwners });
  return null;
};

const notifyAssignmentScore = async ({ attemptId, attempt }) => {
  const studentCode =
    attempt.studentCode || attempt.studentcode || attempt.student_code || attempt.student || "";

  const tokenInfo = await fetchStudentMessagingToken(studentCode);
  if (!tokenInfo?.tokens?.length) {
    console.log(`notifyAssignmentScore: no messaging token for ${studentCode}`);
    return null;
  }

  const assignmentLabel =
    attempt.assignmentText || attempt.assignment || attempt.assignmentId || "your assignment";

  const notification = {
    title: "Your assignment has been marked",
    body: safeTruncate(
      typeof attempt.score === "number"
        ? `${assignmentLabel}: you scored ${attempt.score}`
        : `${assignmentLabel} has new feedback.`,
      140
    ),
  };

  const data = {
    type: "score_update",
    studentCode: String(studentCode || ""),
    assignmentId: String(attempt.assignmentId || ""),
    attemptId: attemptId || "",
    level: attempt.level || "",
  };
  data.route = resolveNotificationRoute(data);

  const tokenOwners = tokenInfo.docId
    ? new Map(tokenInfo.tokens.map((token) => [token, tokenInfo.docId]))
    : new Map();
  await sendNotifications({
    tokens: tokenInfo.tokens,
    notification,
    data,
    tokenOwners,
  });
  return null;
};

exports.onClassBoardPostCreated = onDocumentCreated(
  {
    region: "europe-west1",
    document: "class_board/{level}/classes/{className}/posts/{postId}",
  },
  async (event) => {
    const snap = event.data;
    if (!snap) return null;

    const data = snap.data();
    const { level, className, postId } = event.params;

    if (!data || !level || !className) return null;

    const { tokens, tokenOwners } = await fetchClassMessagingTokens({ level, className });

    if (!tokens.length) {
      console.log(`onClassBoardPostCreated: no tokens for ${level}/${className}`);
      return null;
    }

    const notification = {
      title: data.questionTitle || data.topic || "New class discussion",
      body:
        safeTruncate(data.question, 140) ||
        safeTruncate(data.instructions, 140) ||
        "A new class discussion thread was posted.",
    };

    const payload = {
      level: level || "",
      className: className || "",
      postId: postId || "",
    };
    payload.route = resolveNotificationRoute(payload);

    await sendNotifications({ tokens, notification, data: payload, tokenOwners });
    return null;
  }
);

exports.onAnnouncementCreated = onDocumentCreated(
  {
    region: "europe-west1",
    document: "announcements/{announcementId}",
  },
  async (event) => {
    const snap = event.data;
    if (!snap) return null;

    const data = snap.data() || {};
    const announcementId = event.params.announcementId;

    const audience = normalizeValue(data.audience || data.scope || data.target || "");
    const className =
      data.className || data.class || data.classname || "";
    const language = normalizeValue(data.language || data.program || data.lang || "");
    const languages = Array.isArray(data.languages)
      ? data.languages.map(normalizeValue).filter(Boolean)
      : [];

    const requestedLanguages = [];
    if (language && language !== "all") {
      requestedLanguages.push(language);
    } else if (languages.length) {
      requestedLanguages.push(...languages.filter((value) => value !== "all"));
    }

    const targetClassName = className && audience !== "all" ? className : className || "";

    const tokenResult = { tokens: new Set(), tokenOwners: new Map() };

    if (requestedLanguages.length) {
      for (const program of requestedLanguages) {
        const result = await fetchAnnouncementTokens({
          className: targetClassName,
          program,
        });
        mergeTokenResults(tokenResult, result);
      }
    } else {
      const result = await fetchAnnouncementTokens({
        className: targetClassName,
        program: "",
      });
      mergeTokenResults(tokenResult, result);
    }

    const tokens = Array.from(tokenResult.tokens);
    if (!tokens.length) {
      console.log("onAnnouncementCreated: no messaging tokens found");
      return null;
    }

    const notification = {
      title: data.title || data.headline || "New announcement",
      body:
        safeTruncate(data.message, 140) ||
        safeTruncate(data.body, 140) ||
        safeTruncate(data.description, 140) ||
        "A new announcement is available.",
    };

    const linkUrl = data.linkUrl || data.link || data.url || "";

    const payload = {
      type: "announcement",
      announcementId,
      className: className || "",
      language: language || "",
    };
    if (linkUrl) {
      payload.route = linkUrl;
    }

    await sendNotifications({
      tokens,
      notification,
      data: payload,
      tokenOwners: tokenResult.tokenOwners,
    });
    return null;
  }
);

exports.onQaPostCreated = onDocumentCreated(
  {
    region: "europe-west1",
    document: "qa_posts/{threadId}",
  },
  async (event) => {
    const afterData = event.data?.data() || {};
    await notifyNewReply({ threadId: event.params.threadId, beforeData: {}, afterData });
  }
);

exports.onQaPostUpdated = onDocumentUpdated(
  {
    region: "europe-west1",
    document: "qa_posts/{threadId}",
  },
  async (event) => {
    const beforeData = event.data?.before?.data() || {};
    const afterData = event.data?.after?.data() || {};

    await notifyNewReply({ threadId: event.params.threadId, beforeData, afterData });
  }
);

exports.onScoreCreated = onDocumentCreated(
  {
    region: "europe-west1",
    document: "scores/{attemptId}",
  },
  async (event) => {
    const snap = event.data;
    if (!snap) return null;

    const attempt = snap.data() || {};
    await notifyAssignmentScore({ attemptId: event.params.attemptId, attempt });
  }
);

exports.onAttendanceSessionUpdated = onDocumentUpdated(
  {
    region: "europe-west1",
    document: "attendance/{className}/sessions/{sessionId}",
  },
  async (event) => {
    const beforeData = event.data?.before?.data() || {};
    const afterData = event.data?.after?.data() || {};
    const newlyPresentCodes = getNewlyPresentCodes({ before: beforeData, after: afterData });

    if (!newlyPresentCodes.length) return null;

    const { className = "", sessionId = "" } = event.params;
    const level = afterData.level || beforeData.level || "";
    const topic =
      afterData.topic ||
      afterData.title ||
      afterData.chapter ||
      beforeData.topic ||
      beforeData.title ||
      beforeData.chapter ||
      "Class session";

    await Promise.all(
      newlyPresentCodes.map(async (studentCode) => {
        const tokenInfo = await fetchStudentMessagingToken(studentCode);
        if (!tokenInfo?.tokens?.length) return null;

        const notification = {
          title: "Attendance updated",
          body: safeTruncate(`You were marked present for ${topic}.`, 140),
        };

        const data = {
          type: "attendance_update",
          status: "present",
          studentCode,
          className,
          level,
          sessionId,
          topic,
          route: "/campus",
        };

        const tokenOwners = tokenInfo.docId
          ? new Map(tokenInfo.tokens.map((token) => [token, tokenInfo.docId]))
          : new Map();

        await sendNotifications({
          tokens: tokenInfo.tokens,
          notification,
          data,
          tokenOwners,
        });
        return null;
      })
    );

    return null;
  }
);


exports.onExamTutorReviewUpdated = onDocumentUpdated(
  {
    region: "europe-west1",
    document: "examTutorReviewQueue/{reviewId}",
  },
  async (event) => {
    const beforeData = event.data?.before?.data() || {};
    const afterData = event.data?.after?.data() || {};
    await notifyTutorReviewStatusUpdate({
      reviewId: event.params.reviewId,
      beforeData,
      afterData,
    });
    return null;
  }
);
