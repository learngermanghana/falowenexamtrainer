"use strict";

const MOCK_TITLE = "A1 Final Mock Exam";
const MOCK_ROUTE = "/campus/results";

const SECTION_ORDER = ["lesen", "hoeren", "schreiben", "sprechen"];
const SECTION_LABELS = Object.freeze({
  lesen: "Lesen",
  hoeren: "Hören",
  schreiben: "Schreiben",
  sprechen: "Sprechen",
});

const clean = (value = "") => String(value ?? "").trim();

const safeDocId = (value = "") =>
  clean(value)
    .replace(/[/#?\[\]]+/g, "_")
    .replace(/\s+/g, "_")
    .replace(/_{2,}/g, "_")
    .slice(0, 180);

const scoreNumber = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? Math.max(0, Math.min(100, numeric)) : 0;
};

const formatScore = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "0";
  return Number.isInteger(numeric) ? String(numeric) : numeric.toFixed(1);
};

const buildSectionBreakdown = (sectionScores = {}) =>
  SECTION_ORDER.map((key) => ({
    key,
    label: SECTION_LABELS[key],
    score: Math.max(0, Math.min(25, Number(sectionScores?.[key]) || 0)),
    maxScore: 25,
  }));

const deriveMockInsights = (sectionScores = {}) => {
  const breakdown = buildSectionBreakdown(sectionScores);
  const sorted = [...breakdown].sort((left, right) => right.score - left.score);
  return {
    breakdown,
    strongest: sorted[0]?.label || "",
    weakest: sorted[sorted.length - 1]?.label || "",
  };
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

const assignmentIdForAttempt = ({ attemptNumber = 1, firstAttempt = false } = {}) => {
  const number = Math.max(1, Number(attemptNumber) || 1);
  return firstAttempt || number === 1
    ? "A1-FINAL-MOCK"
    : `A1-FINAL-MOCK-PRACTICE-${number}`;
};

const buildA1MockCompletionArtifacts = ({
  authedUser = {},
  studentProfile = null,
  attemptId,
  attemptNumber = 1,
  firstAttempt = false,
  overall = {},
  sectionScores = {},
  now = new Date(),
} = {}) => {
  const identity = resolveStudentIdentity({ authedUser, studentProfile });
  const score = scoreNumber(overall?.score);
  const passed = Boolean(overall?.passed ?? score >= 60);
  const { breakdown, strongest, weakest } = deriveMockInsights(sectionScores);
  const assignmentId = assignmentIdForAttempt({ attemptNumber, firstAttempt });
  const attemptLabel = firstAttempt || Number(attemptNumber) === 1
    ? "First readiness attempt"
    : `Practice attempt ${Math.max(1, Number(attemptNumber) || 1)}`;
  const breakdownText = breakdown
    .map((item) => `${item.label} ${formatScore(item.score)}/25`)
    .join(" · ");
  const statusLabel = passed ? "PASS" : "NEEDS MORE PRACTICE";
  const comments =
    `${attemptLabel} · ${statusLabel} · ${breakdownText} · Strongest: ${strongest} · Practise next: ${weakest}`;
  const notificationBody =
    `Overall: ${formatScore(score)}% — ${statusLabel} · ${breakdownText}. Practise next: ${weakest}.`;
  const timestamp = now instanceof Date ? now : new Date(now);
  const iso = Number.isNaN(timestamp.getTime()) ? new Date().toISOString() : timestamp.toISOString();
  const scoreDocId = safeDocId(`a1-final-mock-${identity.studentCode || authedUser.uid}-${attemptId}`);
  const notificationId = safeDocId(`a1-final-mock-result-${identity.studentCode || authedUser.uid}-${attemptId}`);

  const scoreDocument = {
    studentCode: identity.studentCode,
    studentcode: identity.studentCode,
    uid: clean(authedUser.uid),
    email: identity.email,
    name: identity.name,
    studentName: identity.name,
    level: "A1",
    assignment: MOCK_TITLE,
    assignmentId,
    assignment_id: assignmentId,
    canonicalAssignmentKey: assignmentId,
    score,
    finalScore: score,
    status: passed ? "passed" : "needs_more_practice",
    result: passed ? "passed" : "needs_more_practice",
    passed,
    failed: !passed,
    comments,
    feedback: comments,
    date: iso,
    link: "/campus/course/a1-final-mock-exam",
    attempt: Math.max(1, Number(attemptNumber) || 1),
    firstAttempt: Boolean(firstAttempt),
    mockAttemptId: clean(attemptId),
    sectionScores: Object.fromEntries(breakdown.map((item) => [item.key, item.score])),
    scoreBreakdown: breakdown,
    strongestArea: strongest,
    practiseNext: weakest,
    source: "a1_final_mock",
    certificateEligible: false,
    progressionEligible: false,
  };

  const notificationTitle = firstAttempt
    ? "Your A1 Final Mock result is ready"
    : "Your A1 Final Mock practice result is ready";

  const notificationDocument = {
    type: "Scores",
    category: "feedback",
    title: notificationTitle,
    body: notificationBody,
    message: notificationBody,
    timestamp: timestamp.getTime(),
    sentAt: iso,
    route: MOCK_ROUTE,
    source: "a1_final_mock",
    studentCode: identity.studentCode,
    studentCodeOriginal: identity.studentCode,
    studentName: identity.name,
    assignment: MOCK_TITLE,
    assignmentId,
    level: "A1",
    score,
    status: passed ? "passed" : "needs_improvement",
    read: false,
    data: {
      type: "marked_assignment",
      category: "feedback",
      route: MOCK_ROUTE,
      assignment: MOCK_TITLE,
      assignmentId,
      level: "A1",
      score: String(score),
      status: passed ? "passed" : "needs_improvement",
      attempt: String(Math.max(1, Number(attemptNumber) || 1)),
      strongestArea: strongest,
      practiseNext: weakest,
      lesen: formatScore(sectionScores?.lesen),
      hoeren: formatScore(sectionScores?.hoeren),
      schreiben: formatScore(sectionScores?.schreiben),
      sprechen: formatScore(sectionScores?.sprechen),
      notificationId,
    },
  };

  return {
    identity,
    scoreDocId,
    notificationId,
    scoreDocument,
    notificationDocument,
  };
};

const syncA1MockCompletion = async ({
  db,
  admin,
  authedUser,
  studentProfile,
  attemptId,
  attemptNumber,
  firstAttempt,
  overall,
  sectionScores,
} = {}) => {
  if (!db || !admin) throw new Error("Firestore sync dependencies are unavailable.");
  if (!clean(attemptId)) throw new Error("attemptId is required for A1 mock completion sync.");

  const artifacts = buildA1MockCompletionArtifacts({
    authedUser,
    studentProfile,
    attemptId,
    attemptNumber,
    firstAttempt,
    overall,
    sectionScores,
  });

  const batch = db.batch();
  const serverTimestamp = admin.firestore.FieldValue.serverTimestamp();

  batch.set(
    db.collection("scores").doc(artifacts.scoreDocId),
    {
      ...artifacts.scoreDocument,
      updatedAt: serverTimestamp,
      createdAt: serverTimestamp,
    },
    { merge: true },
  );

  batch.set(
    db.collection("studentNotifications").doc(artifacts.notificationId),
    {
      ...artifacts.notificationDocument,
      updatedAt: serverTimestamp,
      createdAt: serverTimestamp,
    },
    { merge: true },
  );

  if (artifacts.identity.studentDocId) {
    batch.set(
      db
        .collection("students")
        .doc(artifacts.identity.studentDocId)
        .collection("notifications")
        .doc(artifacts.notificationId),
      {
        ...artifacts.notificationDocument,
        updatedAt: serverTimestamp,
        createdAt: serverTimestamp,
      },
      { merge: true },
    );
  }

  await batch.commit();

  return {
    ok: true,
    scoreDocId: artifacts.scoreDocId,
    notificationId: artifacts.notificationId,
    studentCode: artifacts.identity.studentCode,
  };
};

module.exports = {
  MOCK_TITLE,
  buildSectionBreakdown,
  deriveMockInsights,
  resolveStudentIdentity,
  assignmentIdForAttempt,
  buildA1MockCompletionArtifacts,
  syncA1MockCompletion,
};
