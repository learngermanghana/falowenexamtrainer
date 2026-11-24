"use strict";

const { randomUUID } = require("crypto");
const { calculateSharedPaystackFee } = require("./paystackFeePolicy");
const { publicClass, isOpenPublicClass } = require("./routes/publicClasses");

const PRODUCT = "course_type_enrollment";
const accessRef = (db, uid) => db.collection("courseAccountAccess").doc(uid);
const orderRef = (db, uid) => db.collection("courseTypeOrders").doc(uid);

function ownsStudent(snapshot, user) {
  const student = snapshot?.data();
  if (!student || (student.role && student.role !== "student")) return false;
  if (student.uid) return student.uid === user.uid;
  return user.email_verified === true && !!user.email &&
    String(student.email || "").toLowerCase() === user.email.toLowerCase();
}


async function preserveCourseExamTrial(tx, db, student, uid, canRestoreCourse, now = Date.now()) {
  if (!canRestoreCourse || student.accountType === "exam_only" || student.program === "swahili" ||
      student.secondaryProgram === "swahili" || student.examTrialStartedAt) return;
  const trial = require("./trialExams.json")[student.level];
  const end = require("./entitlementService").courseExpiry(student);
  if (!trial || !Number.isFinite(end) || end <= now) return;
  const ref = db.collection("mockSubscriptions").doc(uid + "_trial");
  const prior = await tx.get(ref);
  if (prior.exists || prior.data()) return; // never restart a used or expired exam trial
  tx.create(ref, { uid, level: student.level, scope: "trial", status: "active",
    expiresAtMs: end, mockIds: [trial.catalogId], source: "preserved_course_trial" });
}

function registerCourseTypeRoutes(app, { admin, getAuthedUser, findStudentByCodeOrEmail, normalizeStudentBilling }) {
  registerAdminCourseTypeRoute(app, { admin, normalizeStudentBilling });
  app.post("/account/course-type", async (req, res) => {
    try {
      const user = await getAuthedUser(req);
      if (!user) return res.status(401).json({ error: "Sign in to change your course type." });
      if (user.admin || user.staff || ["admin", "staff", "tutor"].includes(user.role) ||
          ["moxflex@gmail.com", "staff@falowen.app"].includes(user.email)) {
        return res.status(403).json({ error: "This setting is for student accounts." });
      }
      const { courseType, classId } = req.body || {};
      if (!["full_course", "exam_preparation"].includes(courseType)) {
        return res.status(400).json({ error: "Choose Full course or Exam preparation." });
      }
      const match = await findStudentByCodeOrEmail({ uid: user.uid, email: user.email });
      if (!ownsStudent(match?.snap, user)) return res.status(403).json({ error: "Student account not found." });

      const db = admin.firestore();
      const access = accessRef(db, user.uid);
      const checkout = orderRef(db, user.uid);
      const timestamp = () => admin.firestore.FieldValue.serverTimestamp();
      const result = await db.runTransaction(async (tx) => {
        const snapshot = await tx.get(match.ref);
        const policy = (await tx.get(access)).data();
        if (!ownsStudent(snapshot, user)) return { status: 403, error: "Student account not found." };
        const student = snapshot.data();
        const examOnly = policy?.examOnly ?? (student.accountType === "exam_only" || user.examOnly === true);

        if (courseType === "exam_preparation") {
          const { paidSoFar } = normalizeStudentBilling(student);
          const canRestoreCourse = !examOnly || policy?.canRestoreCourse === true;
          const keepCourse = canRestoreCourse && (paidSoFar > 0 || student.accessType === "complimentary" ||
            student.institutionVerification === "approved" || student.paymentStatus === "paid");
          if (!keepCourse) await preserveCourseExamTrial(tx, db, student, user.uid, canRestoreCourse);
          tx.set(access, { examOnly: !keepCourse, canRestoreCourse });
          tx.update(match.ref, { courseType, accountType: keepCourse ? "course" : "exam_only", courseEnrollmentPreserved: canRestoreCourse, updated_at: timestamp() });
          return { courseType, checkout: "exam" };
        }

        if (!examOnly || policy?.canRestoreCourse === true) {
          tx.set(access, { examOnly: false, canRestoreCourse: true });
          tx.update(match.ref, { courseType, accountType: "course", updated_at: timestamp() });
          return { courseType, checkout: null };
        }

        const billing = normalizeStudentBilling(student);
        if (billing.tuitionFee > 0 || billing.paidSoFar > 0 || billing.explicitBalance > 0) {
          return { status: 409, error: "This account already has a tuition record. Contact admissions to review it before starting a new enrollment." };
        }

        const existingOrder = (await tx.get(checkout)).data();
        if (existingOrder) {
          if (classId && classId !== existingOrder.classId) {
            return { status: 409, error: `Your open checkout is for ${existingOrder.className}. Clear the class selection to resume it.` };
          }
          return { order: existingOrder };
        }
        if (typeof classId !== "string" || !classId || classId.includes("/") || classId.length > 150) {
          return { status: 409, error: "Choose an open German class before starting tuition checkout." };
        }
        const classSnapshot = await tx.get(db.collection("classes").doc(classId));
        const course = classSnapshot.exists ? publicClass(classSnapshot) : null;
        if (!course || course.language !== "German" || !isOpenPublicClass(course) ||
            !["A1", "A2", "B1", "B2", "C1"].includes(course.level) || !(course.tuitionGhs > 0)) {
          return { status: 409, error: "This class is no longer open. Choose another class." };
        }
        if (!process.env.PAYSTACK_SECRET) return { status: 503, error: "Payments are temporarily unavailable." };
        const fee = calculateSharedPaystackFee(course.tuitionGhs);
        const order = {
          uid: user.uid, studentId: snapshot.id, email: user.email.toLowerCase(),
          classId, className: course.title, level: course.level, tuitionFee: course.tuitionGhs,
          checkoutPesewas: Math.round(fee.checkoutAmount * 100), reference: randomUUID(), status: "pending",
        };
        return { order };
      });

      if (result.error) return res.status(result.status).json({ error: result.error });
      if (!result.order) return res.json(result);
      const order = result.order;
      if (order.status === "paid") return res.status(409).json({ error: "Refresh to check your full-course enrollment." });
      if (order.authorizationUrl) return res.json({ checkout: "tuition", authorizationUrl: order.authorizationUrl });
      const callbackOrigin = ["https://exams.falowen.app", "https://falowen.app"].includes(req.headers.origin)
        ? req.headers.origin : "https://www.falowen.app";
      const response = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          email: order.email, currency: "GHS", amount: order.checkoutPesewas, reference: order.reference,
          callback_url: `${callbackOrigin}/mock/account?tuitionReturn=1`,
          metadata: { productType: PRODUCT, uid: user.uid },
        }),
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload.status || payload.data?.reference !== order.reference || !payload.data?.authorization_url) {
        return res.status(502).json({ error: "Could not open tuition checkout. If it is already opening in another tab, use that checkout." });
      }
      const url = new URL(payload.data.authorization_url);
      if (url.origin !== "https://checkout.paystack.com") return res.status(502).json({ error: "Invalid checkout URL." });
      // Only return a checkout whose reference is recorded. Concurrent requests
      // may initialize separate sessions, but only the persisted one is shown.
      const saved = await db.runTransaction(async (tx) => {
        const prior = (await tx.get(checkout)).data();
        if (prior) return prior;
        const latest = await tx.get(match.ref);
        if (!ownsStudent(latest, user) || latest.data().accountType !== "exam_only") return null;
        const candidate = { ...order, authorizationUrl: url.href };
        tx.create(checkout, candidate);
        return candidate;
      });
      if (!saved || saved.status === "paid") return res.status(409).json({ error: "Your enrollment changed. Refresh to check your course type." });
      if (saved.classId !== order.classId) {
        return res.status(409).json({ error: `Your open checkout is for ${saved.className}. Clear the class selection to resume it.` });
      }
      return res.json({ checkout: "tuition", authorizationUrl: saved.authorizationUrl });
    } catch (error) {
      console.error("Course type change failed", error?.code || error?.name);
      return res.status(500).json({ error: "Could not change course type. Please try again." });
    }
  });
}

async function processCourseTypeWebhook({ admin, data, addMonths, normalizeStudentBilling }) {
  const uid = data.metadata?.uid;
  if (typeof uid !== "string" || !uid || uid.includes("/")) return { status: "rejected" };
  const db = admin.firestore();
  return db.runTransaction(async (tx) => {
    const ref = orderRef(db, uid);
    const order = (await tx.get(ref)).data();
    if (!order || order.reference !== data.reference || Number(data.amount) !== order.checkoutPesewas ||
        data.currency !== "GHS" || data.status !== "success" ||
        String(data.customer?.email || "").toLowerCase() !== order.email) return { status: "rejected" };
    if (order.status === "paid") return { status: "duplicate" };
    const studentRef = db.collection("students").doc(order.studentId);
    const student = (await tx.get(studentRef)).data();
    const policy = (await tx.get(accessRef(db, uid))).data();
    if (!student || student.uid !== uid || student.accountType !== "exam_only" || policy?.canRestoreCourse) {
      return { status: "rejected" };
    }
    const billing = normalizeStudentBilling(student);
    if (billing.tuitionFee > 0 || billing.paidSoFar > 0 || billing.explicitBalance > 0) return { status: "rejected" };
    const paidAt = new Date(data.paid_at || data.paidAt || "");
    if (!Number.isFinite(paidAt.getTime())) return { status: "rejected" };

    tx.update(studentRef, {
      accountType: "course", courseType: "full_course", courseEnrollmentPreserved: true,
      level: order.level, className: order.className, classId: order.classId,
      tuitionFee: order.tuitionFee, tuitionCurrency: "GHS", paid: order.tuitionFee,
      initialPaymentAmount: order.tuitionFee, balanceDue: 0, paymentStatus: "paid",
      contractStart: paidAt.toISOString(), contractEnd: addMonths(paidAt, 6).toISOString(),
      contractTermMonths: 6, status: "Active", paystackReference: order.reference,
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    });
    tx.set(accessRef(db, uid), { examOnly: false, canRestoreCourse: true });
    tx.update(ref, { status: "paid" });
    return { status: "synced" };
  });
}


function adminCourseTypeTransition(student, policy, courseType, normalizeStudentBilling) {
  const examOnly = policy?.examOnly ?? (student.accountType === "exam_only");
  const canRestoreCourse = !examOnly || policy?.canRestoreCourse === true;
  if (courseType === "full_course" && !canRestoreCourse) {
    return { status: 409, error: "No preserved course enrollment. Student must use the full-course enrollment checkout." };
  }
  const paid = normalizeStudentBilling(student).paidSoFar > 0;
  const keepCourse = courseType === "full_course" || (canRestoreCourse && (paid ||
    student.accessType === "complimentary" || student.institutionVerification === "approved" ||
    String(student.paymentStatus || "").trim().toLowerCase() === "paid"));
  return {
    updates: { courseType, accountType: keepCourse ? "course" : "exam_only", courseEnrollmentPreserved: canRestoreCourse },
    policy: { examOnly: !keepCourse, canRestoreCourse },
  };
}

function registerAdminCourseTypeRoute(app, { admin, normalizeStudentBilling }) {
  app.post("/students/:studentId/course-type", async (req, res) => {
    try {
      const bearer = String(req.headers?.authorization || "").match(/^Bearer (\S+)$/i);
      if (!bearer) return res.status(401).json({ error: "Sign in to Falowen Admin." });
      let actor;
      try { actor = await admin.auth().verifyIdToken(bearer[1], true); }
      catch { return res.status(401).json({ error: "Sign in again." }); }
      if (actor.email_verified !== true || String(actor.email || "").toLowerCase() !== "moxflex@gmail.com") {
        return res.status(403).json({ error: "Verified owner access required." });
      }
      const id = req.params.studentId;
      const { courseType, expectedCourseType, reason } = req.body || {};
      const types = ["full_course", "exam_preparation"];
      if (typeof id !== "string" || !id || id.length > 200 || id.includes("/") ||
          !types.includes(courseType) || !types.includes(expectedCourseType) || courseType === expectedCourseType ||
          typeof reason !== "string" || !reason.trim() || reason.trim().length > 500) {
        return res.status(400).json({ error: "Valid student, new course type and reason required." });
      }
      const db = admin.firestore();
      const ref = db.collection("students").doc(id);
      const audit = db.collection("studentCourseTypeAudit").doc();
      const result = await db.runTransaction(async tx => {
        const snap = await tx.get(ref);
        if (!snap.exists) return { status: 404, error: "Student not found." };
        const student = snap.data();
        if (student.role && student.role !== "student" ||
            String(student.program || "german").toLowerCase() !== "german" ||
            student.secondaryProgram === "swahili" || student.institutionVerification === "approved" ||
            ["archived", "deleted", "inactive", "withdrawn"].includes(String(student.status || "").toLowerCase())) {
          return { status: 409, error: "This enrollment needs individual review." };
        }
        const uid = student.uid;
        if (typeof uid !== "string" || !uid || uid.includes("/")) return { status: 409, error: "Link the existing student login first." };
        const access = accessRef(db, uid);
        const policy = (await tx.get(access)).data();
        const deletion = (await tx.get(db.collection("accountDeletionRequests").doc(uid))).data();
        const order = (await tx.get(orderRef(db, uid))).data();
        if (["pending", "processing", "completed"].includes(deletion?.status) || order?.status === "pending") {
          return { status: 409, error: "Resolve the pending account deletion or tuition checkout first." };
        }
        const matches = await tx.get(db.collection("students").where("uid", "==", uid).limit(2));
        if (matches.size !== 1 || matches.docs[0].id !== id) return { status: 409, error: "Duplicate or ambiguous login link. Review student identity." };
        const current = student.courseType || ((policy?.examOnly ?? (student.accountType === "exam_only")) ? "exam_preparation" : "full_course");
        if (current !== expectedCourseType) return { status: 409, error: "Course type has changed. Refresh the student profile." };
        const transition = adminCourseTypeTransition(student, policy, courseType, normalizeStudentBilling);
        if (transition.error) return transition;
        const timestamp = admin.firestore.FieldValue.serverTimestamp();
        if (courseType === "exam_preparation" && transition.policy.examOnly) {
          await preserveCourseExamTrial(tx, db, student, uid, transition.policy.canRestoreCourse);
        }
        tx.set(access, transition.policy, { merge: true });
        tx.update(ref, { ...transition.updates, updated_at: timestamp });
        tx.create(audit, { studentId: id, uid, actorUid: actor.uid, previousCourseType: current,
          previousAccountType: student.accountType || "course", ...transition.updates,
          reason: reason.trim(), createdAt: timestamp });
        return { updates: transition.updates, sheetSync: "queued", auditId: audit.id };
      });
      if (result.error) return res.status(result.status).json({ error: result.error });
      return res.json({ ok: true, ...result });
    } catch (error) {
      console.error("Admin course type change failed", error?.code || error?.name);
      return res.status(500).json({ error: "Could not change course type. Refresh before retrying." });
    }
  });
}

module.exports = { PRODUCT, accessRef, registerCourseTypeRoutes, processCourseTypeWebhook, adminCourseTypeTransition, preserveCourseExamTrial };
