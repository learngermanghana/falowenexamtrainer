"use strict";

const MOCK_TITLE = "B1 Final Mock Exam";
const MOCK_ROUTE = "/campus/results";

const SECTION_ORDER = ["lesen", "hoeren", "schreiben", "sprechen"];
const SECTION_LABELS = Object.freeze({
  lesen: "Lesen",
  hoeren: "Hören",
  schreiben: "Schreiben",
  sprechen: "Sprechen",
});

const READING_ANSWER_KEY = Object.freeze({
  "t1-1": "richtig", "t1-2": "richtig", "t1-3": "falsch", "t1-4": "falsch",
  "t1-5": "richtig", "t1-6": "falsch",
  "t2-7": "b", "t2-8": "a", "t2-9": "b",
  "t2-10": "b", "t2-11": "a", "t2-12": "b",
  "t3-13": "b", "t3-14": "e", "t3-15": "a", "t3-16": "0",
  "t3-17": "d", "t3-18": "f", "t3-19": "i",
  "t4-20": "nein", "t4-21": "ja", "t4-22": "nein", "t4-23": "nein",
  "t4-24": "ja", "t4-25": "nein", "t4-26": "ja",
  "t5-27": "b", "t5-28": "b", "t5-29": "b", "t5-30": "a",
});

const LISTENING_ANSWER_KEY = Object.freeze({
  "t1-1": "richtig", "t1-2": "b", "t1-3": "richtig", "t1-4": "c",
  "t1-5": "richtig", "t1-6": "b", "t1-7": "richtig", "t1-8": "b",
  "t1-9": "falsch", "t1-10": "b",
  "t2-11": "b", "t2-12": "b", "t2-13": "a", "t2-14": "c", "t2-15": "c",
  "t3-16": "falsch", "t3-17": "richtig", "t3-18": "richtig", "t3-19": "falsch",
  "t3-20": "falsch", "t3-21": "richtig", "t3-22": "falsch",
  "t4-23": "a", "t4-24": "b", "t4-25": "b", "t4-26": "a",
  "t4-27": "c", "t4-28": "b", "t4-29": "a", "t4-30": "c",
});

const clean = (value = "") => String(value ?? "").trim();
const normalizeObjectiveAnswer = (value) => clean(value).toLowerCase();

const scoreObjectiveAnswers = (answers = {}, answerKey = {}) => {
  const entries = Object.entries(answerKey);
  const correct = entries.reduce(
    (count, [key, expected]) =>
      normalizeObjectiveAnswer(answers?.[key]) === normalizeObjectiveAnswer(expected) ? count + 1 : count,
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
    error.code = "B1_MOCK_SECTION_NOT_VERIFIED";
    error.section = section;
    throw error;
  }
  return Math.max(0, Math.min(25, score));
};

const buildVerifiedB1MockScore = ({ state = {}, verifiedSections = {} } = {}) => {
  const lesen = scoreObjectiveAnswers(state?.lesenAnswers || {}, READING_ANSWER_KEY);
  const hoeren = scoreObjectiveAnswers(state?.hoerenAnswers || {}, LISTENING_ANSWER_KEY);
  const schreiben = verifiedSectionScore(verifiedSections, "schreiben");
  const sprechen = verifiedSectionScore(verifiedSections, "sprechen");
  const sectionScores = { lesen: lesen.score, hoeren: hoeren.score, schreiben, sprechen };
  const overallScore = Number(Object.values(sectionScores).reduce((sum, value) => sum + Number(value || 0), 0).toFixed(1));
  return {
    sectionScores,
    overall: { score: overallScore, maxScore: 100, passed: overallScore >= 60 },
    objective: { lesen, hoeren },
  };
};

const persistVerifiedB1MockSection = async ({ db, admin, uid, attemptId, section, score, source } = {}) => {
  if (!db || !admin) throw new Error("Firestore verification dependencies are unavailable.");
  if (!clean(uid) || !clean(attemptId)) throw new Error("uid and attemptId are required.");
  if (!["schreiben", "sprechen"].includes(section)) throw new Error("Only Schreiben and Sprechen can be verified.");

  const numericScore = Number(score);
  if (!Number.isFinite(numericScore) || numericScore < 0 || numericScore > 25) {
    throw new Error("Verified mock section score must be between 0 and 25.");
  }

  const attemptRef = db.collection("b1MockExamUsers").doc(clean(uid)).collection("attempts").doc(clean(attemptId));
  const snap = await attemptRef.get();
  if (!snap.exists) {
    const error = new Error("Mock attempt not found for verified section.");
    error.code = "B1_MOCK_ATTEMPT_NOT_FOUND";
    throw error;
  }
  const attempt = snap.data() || {};
  if (attempt.uid && attempt.uid !== clean(uid)) {
    const error = new Error("Mock attempt belongs to another account.");
    error.code = "B1_MOCK_ATTEMPT_FORBIDDEN";
    throw error;
  }
  if (attempt.status === "completed") {
    const existing = attempt.verifiedSections?.[section];
    if (existing?.verified && Number.isFinite(Number(existing.score))) return existing;
    const error = new Error("Completed mock attempts cannot receive new verified section scores.");
    error.code = "B1_MOCK_ALREADY_COMPLETED";
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
  clean(value).replace(/[/#?\[\]]+/g, "_").replace(/\s+/g, "_").replace(/_{2,}/g, "_").slice(0, 180);

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
    key, label: SECTION_LABELS[key],
    score: Math.max(0, Math.min(25, Number(sectionScores?.[key]) || 0)),
    maxScore: 25,
  }));

const deriveMockInsights = (sectionScores = {}) => {
  const breakdown = buildSectionBreakdown(sectionScores);
  const sorted = [...breakdown].sort((a, b) => b.score - a.score);
  return { breakdown, strongest: sorted[0]?.label || "", weakest: sorted[sorted.length - 1]?.label || "" };
};

const resolveStudentIdentity = ({ authedUser = {}, studentProfile = null } = {}) => {
  const student = studentProfile?.data || {};
  const studentDocId = clean(studentProfile?.snap?.id || authedUser.uid);
  const studentCode = clean(student.studentCode || student.studentcode) ||
    (studentDocId && studentDocId !== clean(authedUser.uid) ? studentDocId : "") ||
    clean(authedUser.uid);
  const email = clean(student.email || authedUser.email).toLowerCase();
  const name = clean(student.name || student.fullName || student.studentName || student.displayName) ||
    clean(authedUser.name || authedUser.displayName) ||
    (email ? email.split("@")[0] : "Student");
  return { student, studentDocId, studentCode, email, name };
};

const assignmentIdForAttempt = ({ attemptNumber = 1, firstAttempt = false } = {}) => {
  const number = Math.max(1, Number(attemptNumber) || 1);
  return firstAttempt || number === 1 ? "B1-FINAL-MOCK" : `B1-FINAL-MOCK-PRACTICE-${number}`;
};

const buildB1MockCompletionArtifacts = ({
  authedUser = {}, studentProfile = null, attemptId, attemptNumber = 1,
  firstAttempt = false, overall = {}, sectionScores = {}, now = new Date(),
} = {}) => {
  const identity = resolveStudentIdentity({ authedUser, studentProfile });
  const score = scoreNumber(overall?.score);
  const passed = Boolean(overall?.passed ?? score >= 60);
  const { breakdown, strongest, weakest } = deriveMockInsights(sectionScores);
  const assignmentId = assignmentIdForAttempt({ attemptNumber, firstAttempt });
  const attemptLabel = firstAttempt || Number(attemptNumber) === 1 ? "First readiness attempt" : `Practice attempt ${Math.max(1, Number(attemptNumber) || 1)}`;
  const breakdownText = breakdown.map((item) => `${item.label} ${formatScore(item.score)}/25`).join(" · ");
  const statusLabel = passed ? "PASS" : "NEEDS MORE PRACTICE";
  const comments = `${attemptLabel} · ${statusLabel} · ${breakdownText} · Strongest: ${strongest} · Practise next: ${weakest}`;
  const notificationBody = `Overall: ${formatScore(score)}% — ${statusLabel} · ${breakdownText}. Practise next: ${weakest}.`;
  const timestamp = now instanceof Date ? now : new Date(now);
  const iso = Number.isNaN(timestamp.getTime()) ? new Date().toISOString() : timestamp.toISOString();
  const scoreDocId = safeDocId(`b1-final-mock-${identity.studentCode || authedUser.uid}-${attemptId}`);
  const notificationId = safeDocId(`b1-final-mock-result-${identity.studentCode || authedUser.uid}-${attemptId}`);

  const scoreDocument = {
    studentCode: identity.studentCode, studentcode: identity.studentCode, uid: clean(authedUser.uid),
    email: identity.email, name: identity.name, studentName: identity.name, level: "B1",
    assignment: MOCK_TITLE, assignmentId, assignment_id: assignmentId, canonicalAssignmentKey: assignmentId,
    score, finalScore: score, status: passed ? "passed" : "needs_more_practice",
    result: passed ? "passed" : "needs_more_practice", passed, failed: !passed, comments, feedback: comments,
    date: iso, link: "/campus/course/b1-final-mock-exam",
    attempt: Math.max(1, Number(attemptNumber) || 1), firstAttempt: Boolean(firstAttempt),
    attemptLabel, attemptType: firstAttempt || Number(attemptNumber) === 1 ? "readiness" : "practice",
    mockAttemptId: clean(attemptId),
    sectionScores: Object.fromEntries(breakdown.map((item) => [item.key, item.score])),
    scoreBreakdown: breakdown, strongestArea: strongest, practiseNext: weakest,
    source: "b1_final_mock", certificateEligible: false, progressionEligible: false,
  };

  const notificationDocument = {
    type: "Scores", category: "feedback",
    title: firstAttempt ? "Your B1 Final Mock result is ready" : "Your B1 Final Mock practice result is ready",
    body: notificationBody, message: notificationBody, timestamp: timestamp.getTime(), sentAt: iso,
    route: MOCK_ROUTE, source: "b1_final_mock", studentCode: identity.studentCode,
    studentCodeOriginal: identity.studentCode, studentName: identity.name, assignment: MOCK_TITLE,
    assignmentId, level: "B1", score, status: passed ? "passed" : "needs_improvement", read: false,
    data: {
      type: "marked_assignment", attemptLabel,
      attemptType: firstAttempt || Number(attemptNumber) === 1 ? "readiness" : "practice",
      category: "feedback", route: MOCK_ROUTE, assignment: MOCK_TITLE, assignmentId, level: "B1",
      score: String(score), status: passed ? "passed" : "needs_improvement",
      attempt: String(Math.max(1, Number(attemptNumber) || 1)), strongestArea: strongest, practiseNext: weakest,
      lesen: formatScore(sectionScores?.lesen), hoeren: formatScore(sectionScores?.hoeren),
      schreiben: formatScore(sectionScores?.schreiben), sprechen: formatScore(sectionScores?.sprechen),
      notificationId,
    },
  };

  return { identity, scoreDocId, notificationId, scoreDocument, notificationDocument };
};

const syncB1MockCompletion = async ({
  db, admin, authedUser, studentProfile, attemptId, attemptNumber,
  firstAttempt, overall, sectionScores, now,
} = {}) => {
  if (!db || !admin) throw new Error("Firestore sync dependencies are unavailable.");
  if (!clean(attemptId)) throw new Error("attemptId is required for B1 mock completion sync.");

  const artifacts = buildB1MockCompletionArtifacts({
    authedUser, studentProfile, attemptId, attemptNumber, firstAttempt, overall, sectionScores, now,
  });
  const batch = db.batch();
  const serverTimestamp = admin.firestore.FieldValue.serverTimestamp();

  batch.set(db.collection("scores").doc(artifacts.scoreDocId), {
    ...artifacts.scoreDocument, updatedAt: serverTimestamp, createdAt: serverTimestamp,
  }, { merge: true });
  batch.set(db.collection("studentNotifications").doc(artifacts.notificationId), {
    ...artifacts.notificationDocument, updatedAt: serverTimestamp, createdAt: serverTimestamp,
  }, { merge: true });
  if (artifacts.identity.studentDocId) {
    batch.set(
      db.collection("students").doc(artifacts.identity.studentDocId).collection("notifications").doc(artifacts.notificationId),
      { ...artifacts.notificationDocument, updatedAt: serverTimestamp, createdAt: serverTimestamp },
      { merge: true },
    );
  }
  await batch.commit();
  return { ok: true, scoreDocId: artifacts.scoreDocId, notificationId: artifacts.notificationId, studentCode: artifacts.identity.studentCode };
};

module.exports = {
  MOCK_TITLE, READING_ANSWER_KEY, LISTENING_ANSWER_KEY, scoreObjectiveAnswers,
  buildVerifiedB1MockScore, persistVerifiedB1MockSection, buildSectionBreakdown,
  deriveMockInsights, resolveStudentIdentity, assignmentIdForAttempt,
  buildB1MockCompletionArtifacts, syncB1MockCompletion,
};
