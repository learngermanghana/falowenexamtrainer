"use strict";

const clean = (value = "") => String(value ?? "").trim();
const upper = (value = "") => clean(value).toUpperCase();

const ALLOWED_LEVELS = new Set(["A1", "A2", "B1", "B2", "C1", "C2"]);
const ALLOWED_SECTIONS = new Set(["lesen", "hoeren", "schreiben", "sprechen", "mixed"]);

const safeDocId = (value = "") =>
  clean(value)
    .replace(/[/#?\[\]]+/g, "_")
    .replace(/\s+/g, "_")
    .replace(/_{2,}/g, "_")
    .slice(0, 180);

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const asNumber = (value, fallback = null) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const sectionLabel = (section = "") => {
  const normalized = clean(section).toLowerCase();
  return {
    lesen: "Lesen",
    hoeren: "Hören",
    schreiben: "Schreiben",
    sprechen: "Sprechen",
    mixed: "Exams Room",
  }[normalized] || "Exams Room";
};

const routeForSection = (section = "") => {
  const normalized = clean(section).toLowerCase();
  return normalized === "mixed" ? "/exams/overview" : `/exams/${normalized || "overview"}`;
};

const resolveStudentIdentity = ({ authedUser = {}, studentProfile = null } = {}) => {
  const student = studentProfile?.data || {};
  const studentDocId = clean(studentProfile?.snap?.id || authedUser.uid);
  const studentCode =
    clean(student.studentCode || student.studentcode) ||
    (studentDocId && studentDocId !== clean(authedUser.uid) ? studentDocId : "") ||
    clean(authedUser.uid);
  const email = clean(student.email || authedUser.email).toLowerCase();
  const name =
    clean(student.name || student.fullName || student.studentName || student.displayName) ||
    clean(authedUser.name || authedUser.displayName) ||
    (email ? email.split("@")[0] : "Student");

  return {
    student,
    studentDocId,
    studentCode,
    email,
    name,
  };
};

const normalizeResultInput = (input = {}) => {
  const level = upper(input.level);
  const section = clean(input.section).toLowerCase();
  const resultType = clean(input.resultType || input.result_type || "practice").toLowerCase();
  const setId = clean(input.setId || input.set_id || input.assignmentId || input.assignment_id);
  const title = clean(input.title || input.assignment);
  const attemptId = clean(input.attemptId || input.attempt_id);
  const attemptNumber = Math.max(1, Math.floor(asNumber(input.attemptNumber || input.attempt, 1)));
  const rawScore = asNumber(input.score, null);
  const total = asNumber(input.total, null);
  const explicitPercent = asNumber(input.percent, null);

  if (!ALLOWED_LEVELS.has(level)) throw new Error("A valid CEFR level is required.");
  if (!ALLOWED_SECTIONS.has(section)) throw new Error("A valid Exams Room section is required.");
  if (!setId) throw new Error("setId is required.");
  if (!attemptId) throw new Error("attemptId is required.");
  if (rawScore === null || rawScore < 0) throw new Error("score must be a non-negative number.");
  if (total === null || total <= 0) throw new Error("total must be greater than zero.");

  const percent = clamp(
    explicitPercent === null ? Math.round((rawScore / total) * 100) : explicitPercent,
    0,
    100,
  );
  const passed = typeof input.passed === "boolean" ? input.passed : percent >= 60;
  const isFinalMock = resultType === "final_mock";
  const source = isFinalMock ? `${level.toLowerCase()}_final_mock` : "exam_room_practice";
  const label = sectionLabel(section);
  const assignment =
    title ||
    (isFinalMock ? `${level} Final Mock Exam` : `${level} ${label} practice`);
  const assignmentId = isFinalMock
    ? `${level}-FINAL-MOCK`
    : `${level}-EXAMS-${section.toUpperCase()}-${safeDocId(setId).toUpperCase()}`;
  const route = clean(input.route || input.link) || (isFinalMock ? "/campus/results" : routeForSection(section));

  const sectionScores =
    input.sectionScores && typeof input.sectionScores === "object" && !Array.isArray(input.sectionScores)
      ? Object.fromEntries(
          Object.entries(input.sectionScores)
            .map(([key, value]) => [clean(key).toLowerCase(), asNumber(value, null)])
            .filter(([, value]) => value !== null),
        )
      : {};

  return {
    level,
    section,
    resultType: isFinalMock ? "final_mock" : "practice",
    setId,
    title: assignment,
    assignmentId,
    attemptId,
    attemptNumber,
    rawScore,
    total,
    percent,
    passed,
    source,
    route,
    sectionScores,
  };
};

const buildExamRoomResultArtifacts = ({
  authedUser = {},
  studentProfile = null,
  input = {},
  now = new Date(),
} = {}) => {
  const normalized = normalizeResultInput(input);
  const identity = resolveStudentIdentity({ authedUser, studentProfile });
  const timestamp = now instanceof Date ? now : new Date(now);
  const iso = Number.isNaN(timestamp.getTime()) ? new Date().toISOString() : timestamp.toISOString();
  const scoreDocId = safeDocId(
    `exam-room-${identity.studentCode || authedUser.uid}-${normalized.setId}-${normalized.attemptId}`,
  );
  const status = normalized.passed ? "passed" : "needs_more_practice";
  const comments = normalized.resultType === "final_mock"
    ? `${normalized.title} · ${normalized.percent}/100 · ${normalized.passed ? "PASS" : "NEEDS MORE PRACTICE"}`
    : `${normalized.title} · ${normalized.rawScore}/${normalized.total} · ${normalized.percent}%`;

  const scoreDocument = {
    studentCode: identity.studentCode,
    studentcode: identity.studentCode,
    uid: clean(authedUser.uid),
    email: identity.email,
    studentEmail: identity.email,
    name: identity.name,
    studentName: identity.name,
    level: normalized.level,
    assignment: normalized.title,
    assignmentText: normalized.title,
    assignmentId: normalized.assignmentId,
    assignment_id: normalized.assignmentId,
    canonicalAssignmentKey: normalized.assignmentId,
    score: normalized.percent,
    finalScore: normalized.percent,
    rawScore: normalized.rawScore,
    total: normalized.total,
    percent: normalized.percent,
    status,
    result: status,
    passed: normalized.passed,
    failed: !normalized.passed,
    comments,
    feedback: comments,
    date: iso,
    link: normalized.route,
    route: normalized.route,
    attempt: normalized.attemptNumber,
    attemptNumber: normalized.attemptNumber,
    examRoomAttemptId: normalized.attemptId,
    setId: normalized.setId,
    examSection: normalized.section,
    resultType: normalized.resultType,
    sectionScores: normalized.sectionScores,
    source: normalized.source,
    certificateEligible: false,
    progressionEligible: false,
  };

  return {
    identity,
    normalized,
    scoreDocId,
    scoreDocument,
  };
};

const syncExamRoomResult = async ({
  db,
  admin,
  authedUser,
  studentProfile,
  input,
  now,
} = {}) => {
  if (!db || !admin) throw new Error("Firestore sync dependencies are unavailable.");
  const artifacts = buildExamRoomResultArtifacts({
    authedUser,
    studentProfile,
    input,
    now,
  });

  const serverTimestamp = admin.firestore.FieldValue.serverTimestamp();
  await db.collection("scores").doc(artifacts.scoreDocId).set(
    {
      ...artifacts.scoreDocument,
      updatedAt: serverTimestamp,
      createdAt: serverTimestamp,
    },
    { merge: true },
  );

  return {
    ok: true,
    scoreDocId: artifacts.scoreDocId,
    studentCode: artifacts.identity.studentCode,
    source: artifacts.normalized.source,
    resultType: artifacts.normalized.resultType,
  };
};

module.exports = {
  ALLOWED_LEVELS,
  ALLOWED_SECTIONS,
  buildExamRoomResultArtifacts,
  normalizeResultInput,
  resolveStudentIdentity,
  syncExamRoomResult,
};
