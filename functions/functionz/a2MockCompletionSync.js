"use strict";

const MOCK_TITLE = "A2 Final Mock Exam";
const KOMBI_SETS = require("./a2KombiMarkingSets");
const MOCK_04_LISTENING_KEY = require("./a2Mock04HoerenKeys");
const MOCK_05_LISTENING_KEY = require("./a2Mock05HoerenKeys");
const isA2Kombi = id => /^a2-mock-0[4-8]$/.test(String(id || ""));
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


// Mock 2 has its own immutable answer set. Do not reuse Mock 1 keys.
const MOCK_2_READING_ANSWER_KEY = Object.freeze({
  "1": "b",
  "2": "a",
  "3": "b",
  "4": "c",
  "5": "a",
  "6": "b",
  "7": "c",
  "8": "b",
  "9": "c",
  "10": "a",
  "11": "b",
  "12": "a",
  "13": "b",
  "14": "b",
  "15": "a",
  "16": "d",
  "17": "a",
  "18": "c",
  "19": "b",
  "20": "x"
});
const MOCK_2_LISTENING_ANSWER_KEY = Object.freeze({
  "1": "c",
  "2": "b",
  "3": "b",
  "4": "a",
  "5": "b",
  "6": "a",
  "7": "b",
  "8": "c",
  "9": "d",
  "10": "e",
  "11": "c",
  "12": "b",
  "13": "b",
  "14": "b",
  "15": "b",
  "16": "ja",
  "17": "nein",
  "18": "nein",
  "19": "nein",
  "20": "ja"
});
const objectiveKeysForMock = (mockId) =>
  mockId === "a2-mock-02"
    ? { lesen: MOCK_2_READING_ANSWER_KEY, hoeren: MOCK_2_LISTENING_ANSWER_KEY }
    : { lesen: READING_ANSWER_KEY, hoeren: LISTENING_ANSWER_KEY };

const clean = (value = "") => String(value ?? "").trim();

const {scoreObjectiveAnswers,verifiedSectionScore,buildVerifiedFourSkillScore}=require("./verifiedFourSkillMockScore");

const buildVerifiedA2MockScore = ({ state = {}, verifiedSections = {}, mockId = "a2-mock-01" } = {}) => {
  if (isA2Kombi(mockId)) {
    if (state?.mockId && state.mockId !== mockId) throw new Error("Saved A2 Kombiprüfung belongs to another paper.");
    const isFour = ["a2-mock-04","a2-mock-05"].includes(mockId) && state?.assessmentVersion === "four-module-v2";
    if (state?.assessmentVersion && state.assessmentVersion !== "three-module-v1" && !isFour)
      throw new Error("Unsupported A2 Kombiprüfung version.");
    const lesen = scoreObjectiveAnswers(state?.lesenAnswers || {},KOMBI_SETS[mockId].reading,25);
    const hoeren = isFour ? scoreObjectiveAnswers(state?.hoerenAnswers || {},mockId==="a2-mock-05" ? MOCK_05_LISTENING_KEY : MOCK_04_LISTENING_KEY,25) : null;
    const schreiben = verifiedSectionScore(verifiedSections,"schreiben",{errorCode:"A2_MOCK_SECTION_NOT_VERIFIED"});
    const sprechen = verifiedSectionScore(verifiedSections,"sprechen",{errorCode:"A2_MOCK_SECTION_NOT_VERIFIED"});
    const points = Number((lesen.score + (hoeren?.score || 0) + schreiben + sprechen).toFixed(1));
    const maxPoints = isFour ? 100 : 75;
    const score = Number((points / maxPoints * 100).toFixed(1));
    return {
      sectionScores:isFour?{lesen:lesen.score,hoeren:hoeren.score,schreiben,sprechen}:{lesen:lesen.score,schreiben,sprechen},
      overall:{score,maxScore:100,points,maxPoints,assessmentVersion:isFour?"four-module-v2":"three-module-v1",
        sections:isFour?["lesen","hoeren","schreiben","sprechen"]:["lesen","schreiben","sprechen"],passed:score>=60},
      objective:isFour?{lesen,hoeren}:{lesen},
    };
  }
  if (!["a2-mock-01", "a2-mock-02"].includes(mockId)) throw new Error("Unknown A2 mock answer set.");
  const keys = objectiveKeysForMock(mockId);
  return buildVerifiedFourSkillScore({
    level:"A2",state,verifiedSections,
    answerKeys:keys,
  });
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
  if (attempt.mockId && attempt.mockId !== mockId) {
    const error = new Error("This verified grade belongs to a different A2 mock.");
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

const buildSectionBreakdown = (sectionScores = {}, mockId = "", version = "") =>
  (isA2Kombi(mockId) && version !== "four-module-v2" ? ["lesen","schreiben","sprechen"] : SECTION_ORDER).map((key) => ({
    key,
    label: SECTION_LABELS[key],
    score: Math.max(0, Math.min(25, Number(sectionScores?.[key]) || 0)),
    maxScore: 25,
  }));

const deriveMockInsights = (sectionScores = {}, mockId = "", version = "") => {
  const breakdown = buildSectionBreakdown(sectionScores,mockId,version);
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

const assignmentIdForAttempt = ({ attemptNumber = 1, firstAttempt = false, mockId = "a2-mock-01" } = {}) => {
  const number = Math.max(1, Number(attemptNumber) || 1);
  if (isA2Kombi(mockId)) return `A2-MOCK-${mockId.slice(-2)}-ATTEMPT-${number}`;
  if (mockId === "a2-mock-02") return `A2-MOCK-02-ATTEMPT-${number}`;
  return firstAttempt || number === 1
    ? "A2-FINAL-MOCK"
    : `A2-FINAL-MOCK-PRACTICE-${number}`;
};

const buildA2MockCompletionArtifacts = ({
  authedUser = {},
  studentProfile = null,
  attemptId,
  attemptNumber = 1,
  firstAttempt = false,
  overall = {},
  sectionScores = {},
  mockId = "a2-mock-01",
  now = new Date(),
} = {}) => {
  const identity = resolveStudentIdentity({ authedUser, studentProfile });
  const score = scoreNumber(overall?.score);
  const passed = Boolean(overall?.passed ?? score >= 60);
  const { breakdown, strongest, weakest } = deriveMockInsights(sectionScores,mockId,overall?.assessmentVersion);
  const assignmentId = assignmentIdForAttempt({ attemptNumber, firstAttempt, mockId });
  const isSecond = mockId === "a2-mock-02";
  const isKombi = isA2Kombi(mockId);
  const isFourKombi = ["a2-mock-04","a2-mock-05"].includes(mockId) && overall?.assessmentVersion === "four-module-v2";
  const mockTitle = isKombi ? `A2 Mock ${Number(mockId.slice(-2))} · Kombiprüfung` : isSecond ? "A2 Mock 2" : MOCK_TITLE;
  const mockSource = isKombi ? mockId.replace(/-/g,"_") : isSecond ? "a2_mock_02" : "a2_final_mock";
  const mockLink = isKombi ? `/campus/course/a2-kombi-mock-${Number(mockId.slice(-2))}` : isSecond ? "/campus/course/a2-mock-2" : "/campus/course/a2-final-mock-exam";
  const mockDocPrefix = isKombi ? mockId : isSecond ? "a2-mock-02" : "a2-final-mock";
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
  const scoreDocId = safeDocId(`${mockDocPrefix}-${identity.studentCode || authedUser.uid}-${attemptId}`);
  const notificationId = safeDocId(`${mockDocPrefix}-result-${identity.studentCode || authedUser.uid}-${attemptId}`);

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
    ...(isKombi ? {assessmentVersion:isFourKombi?"four-module-v2":"three-module-v1",earnedPoints:Number(overall?.points)||0,
      maxPoints:isFourKombi?100:75,completedSections:isFourKombi?SECTION_ORDER:["lesen","schreiben","sprechen"],hoerenPending:!isFourKombi} : {}),
    status: passed ? "passed" : "needs_more_practice",
    result: passed ? "passed" : "needs_more_practice",
    passed,
    failed: !passed,
    comments,
    feedback: comments,
    date: iso,
    link: mockLink,
    attempt: Math.max(1, Number(attemptNumber) || 1),
    firstAttempt: Boolean(firstAttempt),
    attemptLabel,
    attemptType: firstAttempt || Number(attemptNumber) === 1 ? "readiness" : "practice",
    mockAttemptId: clean(attemptId),
    sectionScores: Object.fromEntries(breakdown.map((item) => [item.key, item.score])),
    scoreBreakdown: breakdown,
    strongestArea: strongest,
    practiseNext: weakest,
    source: mockSource,
    certificateEligible: false,
    progressionEligible: false,
  };

  const notificationTitle = isKombi ? `Your A2 Mock ${Number(mockId.slice(-2))} result is ready` : isSecond ? "Your A2 Mock 2 result is ready" : firstAttempt
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
    route: mockLink,
    source: mockSource,
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
      route: MOCK_ROUTE,
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
  attemptNumber,
  firstAttempt,
  overall,
  sectionScores,
  mockId = "a2-mock-01",
  now,
} = {}) => {
  if (!db || !admin) throw new Error("Firestore sync dependencies are unavailable.");
  if (!clean(attemptId)) throw new Error("attemptId is required for A2 mock completion sync.");

  const artifacts = buildA2MockCompletionArtifacts({
    authedUser,
    studentProfile,
    attemptId,
    attemptNumber,
    firstAttempt,
    overall,
    sectionScores,
    mockId,
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
  MOCK_2_READING_ANSWER_KEY,
  MOCK_2_LISTENING_ANSWER_KEY,
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
