const admin = require("firebase-admin");

const PASS_MARK = 60;
const TRIAL_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;
const ACTIVE_STATUSES = new Set([
  "active",
  "paid",
  "partial",
  "pending",
  "enrolled",
  "registered",
  "ongoing",
  "current",
  "trial_active",
  "trial_expired",
]);
const BLOCKED_PAYMENT_STATUSES = new Set([
  "failed",
  "overdue",
  "rejected",
  "cancelled",
  "canceled",
]);
const PENDING_REVIEW_STATUSES = new Set([
  "submitted",
  "resubmitted",
  "pending",
  "pending_review",
  "awaiting_review",
]);
const FAILED_STATUSES = new Set([
  "failed",
  "fail",
  "redo_required",
  "needs_correction",
  "needs_improvement",
]);
const PASSED_STATUSES = new Set([
  "passed",
  "pass",
  "approved",
  "complete",
  "completed",
]);

const clean = (value) => String(value ?? "").trim();
const lower = (value) => clean(value).toLowerCase();
const normalizeLevel = (value) => {
  const match = clean(value).toUpperCase().match(/\b(A1|A2|B1|B2|C1|C2)\b/);
  return match ? match[1] : "";
};
const finiteNumber = (value) => {
  if (value === null || value === undefined || clean(value) === "") return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};
const toMillis = (value) => {
  if (!value) return 0;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value?.toDate === "function") {
    const date = value.toDate();
    return Number.isFinite(date?.getTime?.()) ? date.getTime() : 0;
  }
  if (value instanceof Date) return Number.isFinite(value.getTime()) ? value.getTime() : 0;
  if (typeof value === "number") return value > 100000000000 ? value : value * 1000;
  const parsed = Date.parse(String(value));
  return Number.isFinite(parsed) ? parsed : 0;
};
const toIso = (value) => {
  const millis = toMillis(value);
  return millis > 0 ? new Date(millis).toISOString() : null;
};
const docIdPart = (value) =>
  clean(value)
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "_")
    .slice(0, 160);
const firstText = (...values) => values.map(clean).find(Boolean) || "";

const hasPaidAccess = (student = {}) => {
  const paymentStatus = lower(student.paymentStatus);
  if (paymentStatus === "paid" || paymentStatus === "active") return true;

  const tuitionFee = finiteNumber(student.tuitionFee);
  const balanceDue = finiteNumber(student.balanceDue ?? student.balance);
  return tuitionFee !== null && tuitionFee > 0 && balanceDue !== null && balanceDue <= 0;
};

const getTrialEndMillis = (student = {}) => {
  const explicit = toMillis(student.trialEndsAt || student.trialEnd || student.trialExpiresAt);
  if (explicit > 0) return explicit;
  const started = toMillis(student.trialStartedAt || student.trialStart);
  return started > 0 ? started + TRIAL_DAYS * DAY_MS : 0;
};

const resolveLearnerAccess = (student = {}, nowMs = Date.now()) => {
  const status = lower(student.status);
  const paymentStatus = lower(student.paymentStatus);
  const paid = hasPaidAccess(student);
  const trialEndMs = getTrialEndMillis(student);
  const trialActive = !paid && trialEndMs > nowMs;
  const trialExpired = !paid && trialEndMs > 0 && trialEndMs <= nowMs;
  const contractEndMs = toMillis(student.contractEnd);

  if (status && !ACTIVE_STATUSES.has(status)) {
    return {
      allowed: false,
      state: "blocked",
      reason: "inactive_status",
      paymentStatus,
      balanceDue: finiteNumber(student.balanceDue ?? student.balance),
      trialEndsAt: trialEndMs ? new Date(trialEndMs).toISOString() : null,
      contractEnd: contractEndMs ? new Date(contractEndMs).toISOString() : null,
    };
  }

  if (BLOCKED_PAYMENT_STATUSES.has(paymentStatus)) {
    return {
      allowed: false,
      state: "blocked",
      reason: "payment_status",
      paymentStatus,
      balanceDue: finiteNumber(student.balanceDue ?? student.balance),
      trialEndsAt: trialEndMs ? new Date(trialEndMs).toISOString() : null,
      contractEnd: contractEndMs ? new Date(contractEndMs).toISOString() : null,
    };
  }

  if (trialActive) {
    return {
      allowed: true,
      state: "trial-active",
      reason: "trial_access",
      paymentStatus,
      balanceDue: finiteNumber(student.balanceDue ?? student.balance),
      trialEndsAt: new Date(trialEndMs).toISOString(),
      contractEnd: contractEndMs ? new Date(contractEndMs).toISOString() : null,
    };
  }

  if (trialExpired || status === "trial_expired") {
    return {
      allowed: false,
      state: "trial-ended",
      reason: "trial_ended",
      paymentStatus,
      balanceDue: finiteNumber(student.balanceDue ?? student.balance),
      trialEndsAt: trialEndMs ? new Date(trialEndMs).toISOString() : null,
      contractEnd: contractEndMs ? new Date(contractEndMs).toISOString() : null,
    };
  }

  if (paid && contractEndMs > 0 && contractEndMs <= nowMs) {
    return {
      allowed: false,
      state: "contract-ended",
      reason: "contract_ended",
      paymentStatus,
      balanceDue: finiteNumber(student.balanceDue ?? student.balance),
      trialEndsAt: trialEndMs ? new Date(trialEndMs).toISOString() : null,
      contractEnd: new Date(contractEndMs).toISOString(),
    };
  }

  if (paid) {
    return {
      allowed: true,
      state: "paid-active",
      reason: "paid_access",
      paymentStatus,
      balanceDue: finiteNumber(student.balanceDue ?? student.balance),
      trialEndsAt: trialEndMs ? new Date(trialEndMs).toISOString() : null,
      contractEnd: contractEndMs ? new Date(contractEndMs).toISOString() : null,
    };
  }

  return {
    allowed: false,
    state: "payment-required",
    reason: "payment_required",
    paymentStatus,
    balanceDue: finiteNumber(student.balanceDue ?? student.balance),
    trialEndsAt: trialEndMs ? new Date(trialEndMs).toISOString() : null,
    contractEnd: contractEndMs ? new Date(contractEndMs).toISOString() : null,
  };
};

const getAuthenticatedStudent = async (req) => {
  const header = clean(req.headers?.authorization);
  const match = header.match(/^Bearer\s+(.+)$/i);
  if (!match) return null;
  try {
    return await admin.auth().verifyIdToken(match[1]);
  } catch (error) {
    console.warn("learner_support_auth_failed", error?.message || error);
    return null;
  }
};

const findStudent = async (db, user = {}) => {
  const students = db.collection("students");
  const uid = clean(user.uid);
  const email = lower(user.email);

  if (uid) {
    const direct = await students.doc(uid).get();
    if (direct.exists) return { id: direct.id, ref: direct.ref, data: direct.data() || {} };
  }

  const lookups = [];
  if (uid) lookups.push(students.where("uid", "==", uid).limit(1));
  if (email) {
    lookups.push(students.where("email", "==", email).limit(1));
    if (clean(user.email) !== email) lookups.push(students.where("email", "==", clean(user.email)).limit(1));
  }

  for (const query of lookups) {
    const snapshot = await query.get();
    if (!snapshot.empty) {
      const hit = snapshot.docs[0];
      return { id: hit.id, ref: hit.ref, data: hit.data() || {} };
    }
  }
  return null;
};

const normalizeProgressStatus = (row = {}) => {
  const status = lower(row.status || row.state || row.reviewStatus || row.result);
  if (PASSED_STATUSES.has(status) || row.passed === true) return "passed";
  if (FAILED_STATUSES.has(status) || row.failed === true) return "failed";
  if (PENDING_REVIEW_STATUSES.has(status) || row.submitted === true) {
    return status === "resubmitted" ? "resubmitted" : "submitted";
  }
  if (status === "in_progress" || row.inProgress === true) return "in_progress";
  return "not_started";
};

const rowTime = (row = {}) =>
  Math.max(
    toMillis(row.updatedAt),
    toMillis(row.markedAt),
    toMillis(row.scoredAt),
    toMillis(row.resubmittedAt),
    toMillis(row.submittedAt),
    toMillis(row.createdAt),
    toMillis(row.date),
    toMillis(row.timestamp),
  );

const buildLessonRoute = ({ level, day, chapter, route } = {}) => {
  const direct = clean(route);
  if (direct.startsWith("/")) return direct;
  const normalizedLevel = normalizeLevel(level);
  const numericDay = Number(day);
  if (!normalizedLevel || !Number.isInteger(numericDay) || numericDay <= 0) return "/campus/course";
  const params = new URLSearchParams();
  if (clean(chapter)) params.set("chapter", clean(chapter));
  const query = params.toString();
  return `/campus/course/lesson/${normalizedLevel}/${numericDay}${query ? `?${query}` : ""}`;
};

const safeLessonFromRow = (row = {}, fallbackLevel = "") => {
  if (!row || typeof row !== "object") return null;
  const level = normalizeLevel(row.level || row.courseLevel || fallbackLevel);
  const day = finiteNumber(row.day ?? row.assignmentDay ?? row.lessonDay);
  const chapter = clean(row.chapter || row.chapterKey || row.displayChapter);
  const assignmentKey = firstText(
    row.assignmentKey,
    row.canonicalAssignmentKey,
    row.assignmentId,
    row.assignment_id,
  );
  const title = firstText(row.assignmentTitle, row.assignment, row.lessonTitle, row.title, row.topic);
  if (!level && day === null && !assignmentKey && !title) return null;
  return {
    level,
    day,
    chapter: chapter || null,
    assignmentKey: assignmentKey || null,
    title: title || null,
    route: buildLessonRoute({ level, day, chapter, route: row.route }),
  };
};

const loadCompletionSnapshot = async (db, { uid, level } = {}) => {
  if (!uid || !level) return null;
  const collection = db.collection("courseCompletionSnapshots");
  const id = `${docIdPart(uid)}__${docIdPart(level)}`;
  const direct = await collection.doc(id).get();
  if (direct.exists) return { id: direct.id, ...(direct.data() || {}) };

  const snapshot = await collection.where("studentId", "==", uid).limit(20).get();
  const matches = snapshot.docs
    .map((doc) => ({ id: doc.id, ...(doc.data() || {}) }))
    .filter((row) => normalizeLevel(row.level) === level)
    .sort((a, b) => rowTime(b) - rowTime(a));
  return matches[0] || null;
};

const loadLessonProgress = async (db, { studentCode, level } = {}) => {
  if (!studentCode) return [];
  try {
    const snapshot = await db
      .collection("lessonProgress")
      .where("studentCodeKey", "==", lower(studentCode))
      .limit(100)
      .get();
    return snapshot.docs
      .map((doc) => ({ id: doc.id, ...(doc.data() || {}) }))
      .filter((row) => !level || normalizeLevel(row.level || row.courseLevel) === level)
      .sort((a, b) => rowTime(b) - rowTime(a));
  } catch (error) {
    console.warn("learner_support_lesson_progress_failed", error?.message || error);
    return [];
  }
};

const loadSubmissions = async (db, { uid, studentCode } = {}) => {
  const tasks = [];
  if (uid) tasks.push(db.collection("submissions").where("studentId", "==", uid).limit(100).get());
  if (studentCode) {
    tasks.push(db.collection("submissions").where("studentCode", "==", studentCode).limit(100).get());
    const lowerCode = lower(studentCode);
    if (lowerCode && lowerCode !== studentCode) {
      tasks.push(db.collection("submissions").where("studentCode", "==", lowerCode).limit(100).get());
    }
  }
  const settled = await Promise.allSettled(tasks);
  const rows = new Map();
  settled.forEach((result) => {
    if (result.status !== "fulfilled") return;
    result.value.docs.forEach((doc) => rows.set(doc.id, { id: doc.id, ...(doc.data() || {}) }));
  });
  return [...rows.values()].sort((a, b) => rowTime(b) - rowTime(a));
};

const getReviewState = ({ progressRows = [], submissions = [], level = "" } = {}) => {
  const latestProgress = progressRows[0] || null;
  const latestSubmission = submissions
    .filter((row) => !level || !normalizeLevel(row.level || row.courseLevel) || normalizeLevel(row.level || row.courseLevel) === level)
    .sort((a, b) => rowTime(b) - rowTime(a))[0] || null;
  const source = latestProgress || latestSubmission;
  if (!source) {
    return { status: "none", score: null, lesson: null, updatedAt: null };
  }
  const status = normalizeProgressStatus(source);
  const score = finiteNumber(source.latestScore ?? source.bestScore ?? source.score ?? source.finalScore ?? source.mark);
  return {
    status,
    score,
    passed: status === "passed" || (score !== null && score >= PASS_MARK),
    needsImprovement: status === "failed" || (score !== null && score < PASS_MARK),
    pending: status === "submitted" || status === "resubmitted",
    lesson: safeLessonFromRow(source, level),
    updatedAt: toIso(rowTime(source)),
  };
};

const getAttendanceState = (student = {}) => {
  const rate = finiteNumber(
    student.attendanceRate ?? student.attendancePercent ?? student.attendancePercentage,
  );
  const sessions = finiteNumber(
    student.attendanceSessions ?? student.attendance?.sessions,
  );
  if (rate === null && sessions === null) {
    return { available: false, rate: null, sessions: null, status: "not_synced" };
  }
  return {
    available: true,
    rate,
    sessions,
    status: rate === null ? "synced" : rate >= 80 ? "good" : rate >= 70 ? "warning" : "low",
  };
};

const completionNextLesson = (snapshot = null, level = "") => {
  if (!snapshot) return null;
  const day = finiteNumber(snapshot.nextDay);
  const chapter = clean(snapshot.nextChapter);
  const route = buildLessonRoute({
    level: snapshot.level || level,
    day,
    chapter,
    route: snapshot.nextRoute,
  });
  if (!day && route === "/campus/course") return null;
  return {
    level: normalizeLevel(snapshot.level || level),
    day,
    chapter: chapter || null,
    title: clean(snapshot.nextLabel) || null,
    assignmentKey: clean(snapshot.nextAssignmentKey) || null,
    route,
  };
};

const buildNextAction = ({
  access = {},
  completion = null,
  review = {},
  level = "",
} = {}) => {
  if (!access.allowed) {
    if (["trial-ended", "payment-required"].includes(access.state) || access.reason === "payment_status") {
      return {
        type: "complete-payment",
        label: access.state === "trial-ended" ? "Complete payment to continue after your trial" : "Complete payment to continue",
        reason: access.reason,
        url: "/campus/account?tab=billing",
      };
    }
    if (access.state === "contract-ended") {
      return {
        type: "renew-access",
        label: "Renew your Falowen access",
        reason: access.reason,
        url: "/campus/account?tab=billing",
      };
    }
    return {
      type: "contact-support",
      label: "Contact Falowen support about your access",
      reason: access.reason || "access_blocked",
      url: "/help",
    };
  }

  if (review?.needsImprovement && review?.lesson?.route) {
    return {
      type: "review-and-retry",
      label: review.lesson.title ? `Review and improve ${review.lesson.title}` : "Review and improve your failed work",
      reason: "latest_work_needs_improvement",
      url: review.lesson.route,
    };
  }

  const nextLesson = completionNextLesson(completion, level);
  if (nextLesson?.route) {
    const pending = Number(completion?.awaitingReview || 0) > 0 || review?.pending === true;
    return {
      type: "continue-course",
      label: nextLesson.title ? `Continue: ${nextLesson.title}` : `Continue ${nextLesson.level || level} Day ${nextLesson.day || ""}`.trim(),
      reason: pending ? "continue_while_marking_pending" : "next_incomplete_course_item",
      url: nextLesson.route,
    };
  }

  if (completion?.courseWorkCompleted === true) {
    return {
      type: "exam-practice",
      label: "Continue with exam practice",
      reason: "course_work_completed",
      url: "/exams/overview",
    };
  }

  return {
    type: "open-course-book",
    label: level ? `Open your ${level} Course Book` : "Open your Course Book",
    reason: "progress_snapshot_not_available",
    url: "/campus/course",
  };
};

async function learnerSupportStateHandler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  }

  const user = await getAuthenticatedStudent(req);
  if (!user?.uid) {
    return res.status(401).json({ ok: false, error: "Authentication required" });
  }

  try {
    const db = admin.firestore();
    const match = await findStudent(db, user);
    if (!match) {
      return res.status(404).json({
        ok: false,
        error: "Student profile not found",
        nextAction: {
          type: "contact-support",
          label: "Contact Falowen support",
          reason: "profile_not_found",
          url: "/help",
        },
      });
    }

    const student = match.data || {};
    const level = normalizeLevel(student.level || student.course);
    const studentCode = firstText(student.studentCode, student.studentcode, match.id);
    const access = resolveLearnerAccess(student);

    const [completion, progressRows, submissions] = await Promise.all([
      loadCompletionSnapshot(db, { uid: user.uid, level }),
      loadLessonProgress(db, { studentCode, level }),
      loadSubmissions(db, { uid: user.uid, studentCode }),
    ]);

    const review = getReviewState({ progressRows, submissions, level });
    const nextLesson = completionNextLesson(completion, level);
    const lastCompletedRow = progressRows.find((row) => {
      const status = normalizeProgressStatus(row);
      return status === "passed" || status === "submitted" || status === "resubmitted";
    }) || null;
    const lastCompletedLesson = safeLessonFromRow(lastCompletedRow, level);
    const attendance = getAttendanceState(student);
    const nextAction = buildNextAction({ access, completion, review, level });

    return res.json({
      ok: true,
      schemaVersion: 1,
      generatedAt: new Date().toISOString(),
      student: {
        level,
        className: clean(student.className) || null,
        learningMode: clean(student.learningMode) || null,
      },
      access,
      course: {
        completionPercent: finiteNumber(completion?.completionPercent),
        completed: finiteNumber(completion?.completed),
        total: finiteNumber(completion?.total),
        awaitingReview: finiteNumber(completion?.awaitingReview) || 0,
        needsImprovement: finiteNumber(completion?.needsImprovement) || 0,
        courseWorkCompleted: completion?.courseWorkCompleted === true,
        currentLesson: nextLesson,
        nextLesson,
        lastCompletedLesson,
        snapshotUpdatedAt: toIso(completion?.updatedAt),
      },
      review,
      attendance,
      radio: {
        required: null,
        completed: null,
        enforcement: "lesson-route",
        note: "Falowen Radio is enforced by the lesson route when a lesson requires it.",
      },
      nextAction,
      requestContext: {
        route: clean(req.query?.route).slice(0, 500) || null,
      },
    });
  } catch (error) {
    console.error("learner_support_state_failed", error);
    return res.status(500).json({ ok: false, error: "Could not load learner support state" });
  }
}

module.exports = {
  learnerSupportStateHandler,
  resolveLearnerAccess,
  normalizeProgressStatus,
  buildNextAction,
  buildLessonRoute,
  getReviewState,
  completionNextLesson,
};
