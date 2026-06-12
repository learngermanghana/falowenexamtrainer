const { onDocumentCreated, onDocumentWritten } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const { FieldValue, Timestamp } = require("firebase-admin/firestore");

const REGION = "europe-west1";
const PASS_MARK = 60;

const getAdmin = () => {
  if (!admin.apps.length) admin.initializeApp();
  return admin;
};

const db = () => getAdmin().firestore();

const normalizeString = (value) => String(value || "").trim();
const normalizeLower = (value) => normalizeString(value).toLowerCase();
const normalizeLevel = (value) => {
  const match = normalizeString(value).toUpperCase().match(/\b(A1|A2|B1|B2|C1|C2)\b/);
  return match?.[1] || "";
};

const toNumber = (value) => {
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  if (typeof value === "string") {
    const parsed = Number(value.replace(/[^\d.+-]+/g, ""));
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const toMillis = (value) => {
  if (!value) return 0;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value?.toDate === "function") return value.toDate().getTime();
  if (typeof value?.seconds === "number") return value.seconds * 1000;
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number") return value > 100000000000 ? value : value * 1000;
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const toTimestamp = (value) => {
  const millis = toMillis(value) || Date.now();
  return Timestamp.fromMillis(millis);
};

const inferLevelFromText = (value = "") => {
  const match = String(value || "").toUpperCase().match(/\b(A1|A2|B1|B2|C1|C2)\b/);
  return match?.[1] || "";
};

const normalizeAssignmentToken = (value = "") =>
  String(value || "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/_/g, "-")
    .replace(/[^a-z0-9.-]/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toUpperCase();

const resolveLevel = (data = {}, fallbackLevel = "") =>
  normalizeLevel(
    data.level ||
      data.courseLevel ||
      fallbackLevel ||
      inferLevelFromText(data.assignmentKey || data.canonicalAssignmentKey || data.assignmentId || data.assignment_id || data.assignment || data.assignmentTitle)
  );

const resolveAssignmentId = (data = {}, level = "") => {
  const raw =
    data.assignmentKey ||
    data.canonicalAssignmentKey ||
    data.assignmentId ||
    data.assignment_id ||
    data.explicitId ||
    data.assignment ||
    data.assignmentTitle ||
    data.title ||
    "";
  const token = normalizeAssignmentToken(raw);
  if (!token) return "";
  if (/^(A1|A2|B1|B2|C1|C2)-/i.test(token)) return token;
  return level ? `${level}-${token}` : token;
};

const resolveStudentCode = (data = {}, fallback = "") =>
  normalizeString(data.studentCode || data.studentcode || data.student_code || data.code || fallback);

const safeDocId = (value = "") =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "_")
    .replace(/_{2,}/g, "_")
    .replace(/^_|_$/g, "")
    .slice(0, 220);

const buildLessonProgressId = ({ studentCodeKey, level, assignmentId }) =>
  safeDocId([studentCodeKey, level, assignmentId].filter(Boolean).join("__"));

const baseProgressPayload = ({ data = {}, studentCode = "", level = "", assignmentId = "" }) => {
  const studentCodeOriginal = studentCode || resolveStudentCode(data);
  return {
    studentCode: studentCodeOriginal,
    studentCodeKey: normalizeLower(studentCodeOriginal),
    studentEmail: normalizeLower(data.studentEmail || data.email || ""),
    studentId: normalizeString(data.studentId || data.uid || ""),
    studentScopeKey: normalizeString(data.studentScopeKey || data.student_scope_key || ""),
    studentName: normalizeString(data.studentName || data.name || data.fullName || ""),
    className: normalizeString(data.className || data.class || ""),
    level,
    assignmentId,
    assignment_id: assignmentId,
    assignmentKey: assignmentId,
    canonicalAssignmentKey: assignmentId,
    assignmentTitle: normalizeString(data.assignmentTitle || data.assignment || data.title || data.topic || ""),
  };
};

const shouldKeepNewerMarkedStatus = ({ existing = {}, incomingSubmittedAtMs }) => {
  const markedAtMs = toMillis(existing.markedAt || existing.scoredAt || existing.updatedAt);
  const existingStatus = normalizeLower(existing.status);
  return markedAtMs > 0 && markedAtMs >= incomingSubmittedAtMs && ["passed", "failed"].includes(existingStatus);
};

const shouldKeepNewerSubmittedStatus = ({ existing = {}, incomingMarkedAtMs }) => {
  const submittedAtMs = toMillis(existing.submittedAt || existing.resubmittedAt || existing.updatedAt);
  const existingStatus = normalizeLower(existing.status);
  return submittedAtMs > incomingMarkedAtMs && ["submitted", "resubmitted"].includes(existingStatus);
};

const upsertSubmissionProgress = async ({ data = {}, params = {}, submissionId = "" }) => {
  const level = resolveLevel(data, params.level || "");
  const studentCode = resolveStudentCode(data, params.studentCode || params.studentcode || "");
  const assignmentId = resolveAssignmentId(data, level);

  if (!studentCode || !level || !assignmentId) {
    console.warn("lessonProgress submission skipped: missing identity", { submissionId, studentCode, level, assignmentId });
    return null;
  }

  const studentCodeKey = normalizeLower(studentCode);
  const progressId = buildLessonProgressId({ studentCodeKey, level, assignmentId });
  const progressRef = db().collection("lessonProgress").doc(progressId);
  const submittedAtValue = data.resubmittedAt || data.submittedAt || data.createdAt || data.updatedAt || data.date || Date.now();
  const submittedAtMs = toMillis(submittedAtValue) || Date.now();
  const isResubmission = Boolean(
    data.isResubmission ||
      normalizeLower(data.status) === "resubmitted" ||
      Number(data.attempt || data.attemptNumber || 1) > 1
  );
  const pendingStatus = isResubmission ? "resubmitted" : "submitted";

  await db().runTransaction(async (transaction) => {
    const existingSnap = await transaction.get(progressRef);
    const existing = existingSnap.exists ? existingSnap.data() || {} : {};
    const keepMarked = shouldKeepNewerMarkedStatus({ existing, incomingSubmittedAtMs: submittedAtMs });

    transaction.set(
      progressRef,
      {
        ...baseProgressPayload({ data, studentCode, level, assignmentId }),
        status: keepMarked ? existing.status : pendingStatus,
        submitted: true,
        passed: keepMarked ? Boolean(existing.passed) : false,
        failed: keepMarked ? Boolean(existing.failed) : false,
        submittedAt: toTimestamp(submittedAtValue),
        lastSubmissionId: submissionId,
        lastSubmissionPath: data.path || "",
        latestSubmissionStatus: pendingStatus,
        latestSubmissionSource: data.source || "campus_submission",
        updatedAt: FieldValue.serverTimestamp(),
        createdAt: existing.createdAt || FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  });

  return null;
};

const upsertScoreProgress = async ({ data = {}, attemptId = "" }) => {
  const score = toNumber(data.score ?? data.finalScore ?? data.mark ?? data.grade);
  const level = resolveLevel(data);
  const studentCode = resolveStudentCode(data);
  const assignmentId = resolveAssignmentId(data, level);

  if (!studentCode || !level || !assignmentId || typeof score !== "number") {
    console.warn("lessonProgress score skipped: missing identity or score", { attemptId, studentCode, level, assignmentId, score });
    return null;
  }

  const studentCodeKey = normalizeLower(studentCode);
  const progressId = buildLessonProgressId({ studentCodeKey, level, assignmentId });
  const progressRef = db().collection("lessonProgress").doc(progressId);
  const markedAtValue = data.markedAt || data.scoredAt || data.updatedAt || data.createdAt || data.date || Date.now();
  const markedAtMs = toMillis(markedAtValue) || Date.now();
  const passed = score >= PASS_MARK;
  const status = passed ? "passed" : "failed";

  await db().runTransaction(async (transaction) => {
    const existingSnap = await transaction.get(progressRef);
    const existing = existingSnap.exists ? existingSnap.data() || {} : {};
    const keepSubmitted = shouldKeepNewerSubmittedStatus({ existing, incomingMarkedAtMs: markedAtMs });
    const previousBest = toNumber(existing.bestScore);
    const bestScore = typeof previousBest === "number" ? Math.max(previousBest, score) : score;

    transaction.set(
      progressRef,
      {
        ...baseProgressPayload({ data, studentCode, level, assignmentId }),
        status: keepSubmitted ? existing.status : status,
        latestScore: score,
        bestScore,
        passed: keepSubmitted ? Boolean(existing.passed) : passed,
        failed: keepSubmitted ? Boolean(existing.failed) : !passed,
        submitted: true,
        markedAt: toTimestamp(markedAtValue),
        lastScoreId: attemptId,
        feedback: data.feedback || data.comments || data.aiFeedback || "",
        sheetSaved: Boolean(data.sheetSaved),
        sheetMessage: data.sheetMessage || "",
        duplicateSkipped: Boolean(data.duplicateSkipped),
        updatedAt: FieldValue.serverTimestamp(),
        createdAt: existing.createdAt || FieldValue.serverTimestamp(),
      },
      { merge: true }
    );
  });

  return null;
};

exports.onSubmissionCreatedUpdateLessonProgress = onDocumentCreated(
  {
    region: REGION,
    document: "submissions/{submissionId}",
  },
  async (event) => {
    const data = event.data?.data() || {};
    return upsertSubmissionProgress({ data, params: event.params || {}, submissionId: event.params.submissionId || "" });
  }
);

exports.onNestedSubmissionCreatedUpdateLessonProgress = onDocumentCreated(
  {
    region: REGION,
    document: "submissions/{level}/{studentCode}/{submissionId}",
  },
  async (event) => {
    const data = event.data?.data() || {};
    return upsertSubmissionProgress({ data, params: event.params || {}, submissionId: event.params.submissionId || "" });
  }
);

exports.onScoreWrittenUpdateLessonProgress = onDocumentWritten(
  {
    region: REGION,
    document: "scores/{attemptId}",
  },
  async (event) => {
    if (!event.data?.after?.exists) return null;
    const data = event.data.after.data() || {};
    return upsertScoreProgress({ data, attemptId: event.params.attemptId || "" });
  }
);

exports._private = {
  resolveAssignmentId,
  buildLessonProgressId,
};
