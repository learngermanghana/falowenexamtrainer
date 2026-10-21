"use strict";

const MOCK_TITLE = "A2 Final Mock Exam";
const {getA2MockDefinition} = require("./a2MockRegistry");
const MOCK_ROUTE = "/campus/results";

const SECTION_ORDER = ["lesen", "hoeren", "schreiben", "sprechen"];
const SECTION_LABELS = Object.freeze({
  lesen: "Lesen",
  hoeren: "Hören",
  schreiben: "Schreiben",
  sprechen: "Sprechen",
});

const READING_ANSWER_KEY = Object.freeze({
  "t1-1": "b",
  "t1-2": "c",
  "t1-3": "b",
  "t1-4": "a",
  "t1-5": "b",
  "t2-6": "a",
  "t2-7": "b",
  "t2-8": "a",
  "t2-9": "a",
  "t2-10": "c",
  "t3-11": "b",
  "t3-12": "b",
  "t3-13": "a",
  "t3-14": "c",
  "t3-15": "b",
  "t4-16": "e",
  "t4-17": "b",
  "t4-18": "a",
  "t4-19": "d",
  "t4-20": "x",
});

const LISTENING_ANSWER_KEY = Object.freeze({
  "t1-1": "c",
  "t1-2": "b",
  "t1-3": "b",
  "t1-4": "b",
  "t1-5": "b",
  "t2-6": "a",
  "t2-7": "b",
  "t2-8": "c",
  "t2-9": "d",
  "t2-10": "e",
  "t3-11": "a",
  "t3-12": "c",
  "t3-13": "b",
  "t3-14": "a",
  "t3-15": "c",
  "t4-16": "ja",
  "t4-17": "nein",
  "t4-18": "ja",
  "t4-19": "nein",
  "t4-20": "ja",
});

const clean = (value = "") => String(value ?? "").trim();

const normalizeObjectiveAnswer = (value) => clean(value).toLowerCase();

const scoreObjectiveAnswers = (answers = {}, answerKey = {}) => {
  const entries = Object.entries(answerKey);
  const correct = entries.reduce(
    (count, [key, expected]) =>
      normalizeObjectiveAnswer(answers?.[key]) === normalizeObjectiveAnswer(expected)
        ? count + 1
        : count,
    0,
  );
  return {
    correct,
    total: entries.length,
    score: Number(((correct / Math.max(1, entries.length)) * 25).toFixed(1)),
    maxScore: 25,
  };
};

const verifiedSectionScore = (verifiedSections = {}, section) => {
  const record = verifiedSections?.[section];
  const score = Number(record?.score);
  if (!record?.verified || !Number.isFinite(score)) {
    const error = new Error(`Server-verified ${section} score is required before completion.`);
    error.code = "A2_MOCK_SECTION_NOT_VERIFIED";
    error.section = section;
    throw error;
  }
  return Math.max(0, Math.min(25, score));
};

const buildVerifiedA2MockScore = ({ state = {}, verifiedSections = {}, mockId = "a2-mock-01" } = {}) => {
  const config = getA2MockDefinition(mockId);
  if (mockId !== "a2-mock-01" && !config) throw new Error("Unregistered A2 mock cannot be scored.");
  const lesen = scoreObjectiveAnswers(state?.lesenAnswers || {}, config?.lesen || READING_ANSWER_KEY);
  const hoeren = scoreObjectiveAnswers(state?.hoerenAnswers || {}, config?.hoeren || LISTENING_ANSWER_KEY);
  const schreiben = verifiedSectionScore(verifiedSections, "schreiben");
  const sprechen = verifiedSectionScore(verifiedSections, "sprechen");

  const sectionScores = {
    lesen: lesen.score,
    hoeren: hoeren.score,
    schreiben,
    sprechen,
  };
  const overallScore = Number(
    Object.values(sectionScores)
      .reduce((sum, value) => sum + Number(value || 0), 0)
      .toFixed(1),
  );

  return {
    sectionScores,
    overall: {
      score: overallScore,
      maxScore: 100,
      passed: overallScore >= 60,
    },
    objective: { lesen, hoeren },
  };
};

const persistVerifiedA2MockSection = async ({
  db,
  admin,
  uid,
  attemptId,
  section,
  score,
  source,
  mockId = "a2-mock-01",
} = {}) => {
  if (!db || !admin) throw new Error("Firestore verification dependencies are unavailable.");
  if (!clean(uid) || !clean(attemptId)) {
    throw new Error("uid and attemptId are required to persist a verified mock section.");
  }
  if (!["schreiben", "sprechen"].includes(section)) {
    throw new Error("Only Schreiben and Sprechen can be persisted as verified AI sections.");
  }

  const numericScore = Number(score);
  if (!Number.isFinite(numericScore) || numericScore < 0 || numericScore > 25) {
    throw new Error("Verified mock section score must be between 0 and 25.");
  }

  const attemptRef = db
    .collection("a2MockExamUsers")
    .doc(clean(uid))
    .collection("attempts")
    .doc(clean(attemptId));
  const snap = await attemptRef.get();
  if (!snap.exists) {
    const error = new Error("Mock attempt not found for verified section.");
    error.code = "A2_MOCK_ATTEMPT_NOT_FOUND";
    throw error;
  }

  const attempt = snap.data() || {};
  if ((attempt.mockId || "a2-mock-01") !== mockId) {
    const error = new Error("Verified section belongs to a different A2 mock.");
    error.code = "A2_MOCK_ATTEMPT_MISMATCH";
    throw error;
  }
  if (attempt.uid && attempt.uid !== clean(uid)) {
    const error = new Error("Mock attempt belongs to another account.");
    error.code = "A2_MOCK_ATTEMPT_FORBIDDEN";
    throw error;
  }
  if (attempt.status === "completed") {
    const existing = attempt.verifiedSections?.[section];
    if (existing?.verified && Number.isFinite(Number(existing.score))) {
      return existing;
    }
    const error = new Error("Completed mock attempts cannot receive new verified section scores.");
    error.code = "A2_MOCK_ALREADY_COMPLETED";
    throw error;
  }

  const record = {
    verified: true,
    score: Number(numericScore.toFixed(1)),
    maxScore: 25,
    source: clean(source),
    gradedAt: admin.firestore.FieldValue.serverTimestamp(),
  };
  await attemptRef.update({
    [`verifiedSections.${section}`]: record,
    updatedAt: admin.firestore.FieldValue.serverTimestamp(),
  });
  return record;
};

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
    ? "A2-FINAL-MOCK"
    : `A2-FINAL-MOCK-PRACTICE-${number}`;
};

const buildA2MockCompletionArtifacts = ({
  mockId = "a2-mock-01",
  authedUser = {},
  studentProfile = null,
  attemptId,
  attemptNumber = 1,
  firstAttempt = false,
  overall = {},
  sectionScores = {},
  now = new Date(),
} = {}) => {
  const config = getA2MockDefinition(mockId);
  if (mockId !== "a2-mock-01" && !config) throw new Error("Unregistered A2 mock result.");
  const mockTitle = config?.title || MOCK_TITLE;
  const mockRoute = config?.route || "/campus/course/a2-final-mock-exam";
  const identity = resolveStudentIdentity({ authedUser, studentProfile });
  const score = scoreNumber(overall?.score);
  const passed = Boolean(overall?.passed ?? score >= 60);
  const { breakdown, strongest, weakest } = deriveMockInsights(sectionScores);
  const assignmentId = config
    ? (Number(attemptNumber) === 1 ? config.assignmentId : `${config.assignmentId}-PRACTICE-${Math.max(1,Number(attemptNumber)||1)}`)
    : assignmentIdForAttempt({ attemptNumber, firstAttempt });
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
  const scoreDocId = safeDocId(config
    ? `a2-${mockId}-${identity.studentCode || authedUser.uid}-${attemptId}`
    : `a2-final-mock-${identity.studentCode || authedUser.uid}-${attemptId}`);
  const notificationId = safeDocId(config
    ? `a2-${mockId}-result-${identity.studentCode || authedUser.uid}-${attemptId}`
    : `a2-final-mock-result-${identity.studentCode || authedUser.uid}-${attemptId}`);

  const scoreDocument = {
    studentCode: identity.studentCode,
    studentcode: identity.studentCode,
    uid: clean(authedUser.uid),
    email: identity.email,
    name: identity.name,
    studentName: identity.name,
    level: "A2",
    assignment: mockTitle,
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
    link: mockRoute,
    attempt: Math.max(1, Number(attemptNumber) || 1),
    firstAttempt: Boolean(firstAttempt),
    attemptLabel,
    attemptType: firstAttempt || Number(attemptNumber) === 1 ? "readiness" : "practice",
    mockAttemptId: clean(attemptId),
    mockId,
    sectionScores: Object.fromEntries(breakdown.map((item) => [item.key, item.score])),
    scoreBreakdown: breakdown,
    strongestArea: strongest,
    practiseNext: weakest,
    source: "a2_final_mock",
    certificateEligible: false,
    progressionEligible: false,
  };

  const notificationTitle = config ? `Your ${mockTitle} result is ready` : firstAttempt
    ? "Your A2 Final Mock result is ready"
    : "Your A2 Final Mock practice result is ready";

  const notificationDocument = {
    type: "Scores",
    category: "feedback",
    title: notificationTitle,
    body: notificationBody,
    message: notificationBody,
    timestamp: timestamp.getTime(),
    sentAt: iso,
    route: config ? mockRoute : MOCK_ROUTE,
    source: "a2_final_mock",
    studentCode: identity.studentCode,
    studentCodeOriginal: identity.studentCode,
    studentName: identity.name,
    assignment: mockTitle,
    assignmentId,
    level: "A2",
    score,
    status: passed ? "passed" : "needs_improvement",
    read: false,
    data: {
      type: "marked_assignment",
      attemptLabel,
      attemptType: firstAttempt || Number(attemptNumber) === 1 ? "readiness" : "practice",
      category: "feedback",
      route: config ? mockRoute : MOCK_ROUTE,
      assignment: mockTitle,
      assignmentId,
      level: "A2",
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

const syncA2MockCompletion = async ({
  db,
  admin,
  authedUser,
  studentProfile,
  attemptId,
  mockId = "a2-mock-01",
  attemptNumber,
  firstAttempt,
  overall,
  sectionScores,
  now,
} = {}) => {
  if (!db || !admin) throw new Error("Firestore sync dependencies are unavailable.");
  if (!clean(attemptId)) throw new Error("attemptId is required for A2 mock completion sync.");

  const artifacts = buildA2MockCompletionArtifacts({
    mockId,
    authedUser,
    studentProfile,
    attemptId,
    attemptNumber,
    firstAttempt,
    overall,
    sectionScores,
    now,
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
  READING_ANSWER_KEY,
  LISTENING_ANSWER_KEY,
  scoreObjectiveAnswers,
  buildVerifiedA2MockScore,
  persistVerifiedA2MockSection,
  buildSectionBreakdown,
  deriveMockInsights,
  resolveStudentIdentity,
  assignmentIdForAttempt,
  buildA2MockCompletionArtifacts,
  syncA2MockCompletion,
};
