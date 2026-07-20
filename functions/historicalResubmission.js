const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const { FieldValue } = require("firebase-admin/firestore");
const { _testing: resubmissionHelpers } = require("./resubmission");

const PASS_MARK = 60;
const MAX_ATTEMPTS = 3;
const COOLDOWN_MS = 10 * 60 * 1000;
const PASS_STATUSES = new Set(["approved", "pass", "passed", "complete", "completed"]);

const getAdmin = () => {
  if (!admin.apps.length) admin.initializeApp();
  return admin;
};

const cleanText = (value, maxLength = 12000) => {
  if (value === null || value === undefined || typeof value === "object") return "";
  return String(value).trim().slice(0, maxLength);
};

const normalize = (value) => cleanText(value, 500).toLowerCase();
const unique = (values = []) => [...new Set(values.map((value) => cleanText(value, 400)).filter(Boolean))];
const toNumber = resubmissionHelpers.toFiniteNumber;
const toMillis = resubmissionHelpers.toMillis;
const submissionMillis = resubmissionHelpers.submissionMillis;
const assignmentMatches = resubmissionHelpers.assignmentMatches;
const getReviewedScore = resubmissionHelpers.getReviewedScore;
const isAttemptDocument = resubmissionHelpers.isAttemptDocument;

const isPassed = (row = {}) => {
  const score = getReviewedScore(row);
  if (typeof score === "number") return score >= PASS_MARK;
  return PASS_STATUSES.has(normalize(row.reviewStatus || row.result || row.status));
};

const buildCounterId = ({ studentId, assignmentKey }) =>
  `${cleanText(studentId, 160).replace(/[^a-zA-Z0-9._-]/g, "_")}__${cleanText(
    assignmentKey,
    160,
  ).replace(/[^a-zA-Z0-9._-]/g, "_")}`.slice(0, 300);

const loadStudentProfile = async ({ db, uid, email }) => {
  const students = db.collection("students");
  const requests = [];
  if (uid) {
    requests.push(students.where("uid", "==", uid).limit(1).get());
    requests.push(students.where("userId", "==", uid).limit(1).get());
  }
  unique([email, String(email || "").toLowerCase()]).forEach((candidate) => {
    requests.push(students.where("email", "==", candidate).limit(1).get());
  });

  const settled = await Promise.allSettled(requests);
  for (const result of settled) {
    if (result.status !== "fulfilled" || result.value.empty) continue;
    const hit = result.value.docs[0];
    return { id: hit.id, ...hit.data() };
  }
  return null;
};

const loadScoreRows = async ({ db, studentCodes }) => {
  const scores = db.collection("scores");
  const requests = [];
  unique(studentCodes).forEach((code) => {
    unique([code, String(code).toLowerCase(), String(code).toUpperCase()]).forEach((candidate) => {
      requests.push(scores.where("studentcode", "==", candidate).get());
      requests.push(scores.where("studentCode", "==", candidate).get());
    });
  });

  const settled = await Promise.allSettled(requests);
  const rows = new Map();
  settled.forEach((result) => {
    if (result.status !== "fulfilled") return;
    result.value.docs.forEach((docSnap) => rows.set(docSnap.id, { id: docSnap.id, ...docSnap.data() }));
  });
  return [...rows.values()];
};

const validatePayload = (data = {}) => {
  const assignmentKey = cleanText(
    data.canonicalAssignmentKey || data.assignmentKey || data.assignmentId || data.assignment_id,
    160,
  );
  const correctedText = cleanText(data.submissionText || data.answer || data.workContent, 12000);
  const improvementSummary = cleanText(data.improvementSummary, 2000);
  const previousScore = toNumber(data.previousScore);

  if (!assignmentKey) throw new HttpsError("invalid-argument", "Assignment details are missing.");
  if (correctedText.length < 80) {
    throw new HttpsError("invalid-argument", "Corrected text is too short. Submit the complete corrected task.");
  }
  if (improvementSummary.length < 25) {
    throw new HttpsError("invalid-argument", "Please explain what you improved in this resubmission.");
  }
  if (previousScore === null) {
    throw new HttpsError("failed-precondition", "A reviewed score is required before resubmitting.");
  }
  if (previousScore >= PASS_MARK) {
    throw new HttpsError("failed-precondition", "This assignment is already passed, so resubmission is disabled.");
  }

  return {
    assignmentKey,
    correctedText,
    improvementSummary,
    previousScore,
    title: cleanText(data.assignmentTitle || data.title, 500),
    level: cleanText(data.level, 20).toUpperCase(),
    day: toNumber(data.day),
    chapter: cleanText(data.chapter, 80),
    chapterKey: cleanText(data.chapterKey, 160),
    className: cleanText(data.className, 200),
    fingerprint: cleanText(data.submissionFingerprint, 400),
  };
};

exports.submitHistoricalAssignmentResubmission = onCall(
  { region: "europe-west1" },
  async (request) => {
    const uid = request.auth?.uid || "";
    const authEmail = cleanText(request.auth?.token?.email, 320);
    const data = request.data || {};
    if (!uid) throw new HttpsError("unauthenticated", "Please sign in before resubmitting work.");

    const validated = validatePayload(data);
    const db = getAdmin().firestore();
    const profile = await loadStudentProfile({ db, uid, email: authEmail });
    const trustedStudentCodes = unique([
      profile?.studentCode,
      profile?.studentcode,
      profile?.id,
      !profile ? data.studentCode : "",
    ]);
    if (!trustedStudentCodes.length) {
      throw new HttpsError("failed-precondition", "Your student code could not be verified. Please contact support.");
    }

    const context = {
      aliases: unique([
        validated.assignmentKey,
        data.assignmentId,
        data.assignment_id,
        data.canonicalAssignmentKey,
      ]),
      level: validated.level,
      day: validated.day,
      title: validated.title,
    };

    const scoreRows = (await loadScoreRows({ db, studentCodes: trustedStudentCodes })).filter((row) =>
      assignmentMatches(row, context),
    );
    const reviewedRows = scoreRows
      .map((row) => ({ row, score: getReviewedScore(row), millis: Math.max(
        toMillis(row.markedAt),
        toMillis(row.scoredAt),
        toMillis(row.date),
        toMillis(row.updatedAt),
        toMillis(row.createdAt),
      ) }))
      .filter((entry) => typeof entry.score === "number")
      .sort((left, right) => right.millis - left.millis);

    if (!reviewedRows.length) {
      throw new HttpsError(
        "failed-precondition",
        "The reviewed score could not be verified for this assignment. Refresh the page and try again.",
      );
    }

    const latestReviewed = reviewedRows[0];
    if (latestReviewed.score >= PASS_MARK || scoreRows.some(isPassed)) {
      throw new HttpsError("failed-precondition", "This assignment is already passed, so resubmission is disabled.");
    }
    if (Math.abs(latestReviewed.score - validated.previousScore) > 0.01) {
      throw new HttpsError(
        "failed-precondition",
        "The displayed score is no longer the latest result. Refresh the page and try again.",
      );
    }

    const submissionsRef = db.collection("submissions");
    const submissionSnapshot = await submissionsRef.where("studentId", "==", uid).get();
    const matchingSubmissions = submissionSnapshot.docs
      .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
      .filter((row) => assignmentMatches(row, context));

    if (matchingSubmissions.some(isPassed)) {
      throw new HttpsError("failed-precondition", "This assignment is already passed, so resubmission is disabled.");
    }
    if (
      validated.fingerprint &&
      matchingSubmissions.some((row) => cleanText(row.submissionFingerprint, 400) === validated.fingerprint)
    ) {
      throw new HttpsError("failed-precondition", "This corrected text has already been submitted.");
    }

    const attemptRows = matchingSubmissions.filter(isAttemptDocument);
    const explicitAttempts = attemptRows
      .map((row) => toNumber(row.attemptNumber || row.attempt))
      .filter((value) => typeof value === "number" && value > 0);
    const historicalAttempts = Math.max(
      1,
      explicitAttempts.length ? Math.max(...explicitAttempts) : attemptRows.length || 1,
    );
    const latestSubmissionMillis = Math.max(...attemptRows.map(submissionMillis), 0);
    const earliestSubmissionMillis = attemptRows.reduce((earliest, row) => {
      const millis = submissionMillis(row);
      if (!millis) return earliest;
      return !earliest || millis < earliest ? millis : earliest;
    }, 0);
    const latestAttempt = attemptRows
      .slice()
      .sort((left, right) => submissionMillis(right) - submissionMillis(left))[0] || null;

    const counterRef = db.collection("submissionAttemptCounters").doc(
      buildCounterId({ studentId: uid, assignmentKey: validated.assignmentKey }),
    );

    return db.runTransaction(async (transaction) => {
      const counterSnap = await transaction.get(counterRef);
      const counter = counterSnap.data() || {};
      const attempts = Math.max(Number(counter.attempts || 0), historicalAttempts);
      const serverLatestSubmissionMillis = Math.max(
        latestSubmissionMillis,
        toMillis(counter.lastSubmittedAt),
        toMillis(counter.updatedAt),
      );

      if (counter.passed === true) {
        throw new HttpsError("failed-precondition", "This assignment is already passed, so resubmission is disabled.");
      }
      if (
        validated.fingerprint &&
        cleanText(counter.lastSubmissionFingerprint, 400) === validated.fingerprint
      ) {
        throw new HttpsError("failed-precondition", "This corrected text has already been submitted.");
      }
      if (serverLatestSubmissionMillis && Date.now() < serverLatestSubmissionMillis + COOLDOWN_MS) {
        const nextAllowed = serverLatestSubmissionMillis + COOLDOWN_MS;
        throw new HttpsError("resource-exhausted", "Please wait before submitting again.", {
          code: "RESUBMISSION_COOLDOWN",
          nextAllowedAt: new Date(nextAllowed).toISOString(),
          remainingSeconds: Math.ceil((nextAllowed - Date.now()) / 1000),
        });
      }
      if (attempts >= MAX_ATTEMPTS) {
        throw new HttpsError("resource-exhausted", "You have used all resubmissions for this assignment.");
      }

      const nextAttempt = attempts + 1;
      const now = FieldValue.serverTimestamp();
      const submissionRef = submissionsRef.doc();
      const studentCode = cleanText(trustedStudentCodes[0], 120);
      const studentName = cleanText(profile?.name || profile?.fullName || data.studentName, 200);
      const studentEmail = cleanText(profile?.email || authEmail || data.studentEmail, 320);

      transaction.set(submissionRef, {
        title: validated.title,
        assignmentTitle: validated.title,
        assignmentKey: validated.assignmentKey,
        canonicalAssignmentKey: validated.assignmentKey,
        assignmentId: validated.assignmentKey,
        assignment_id: validated.assignmentKey,
        chapter: validated.chapter,
        chapterKey: validated.chapterKey,
        day: validated.day,
        level: validated.level,
        className: validated.className || cleanText(profile?.className, 200),
        studentId: uid,
        studentEmail,
        studentCode,
        studentName,
        submissionFingerprint: validated.fingerprint,
        submissionText: validated.correctedText,
        answer: validated.correctedText,
        workContent: validated.correctedText,
        improvementSummary: validated.improvementSummary,
        previousSubmissionText: cleanText(
          data.previousSubmissionText || latestAttempt?.submissionText || latestAttempt?.answer,
          12000,
        ),
        previousScore: latestReviewed.score,
        originalSubmittedAt: earliestSubmissionMillis || latestReviewed.millis || null,
        originalSubmissionId: attemptRows
          .slice()
          .sort((left, right) => submissionMillis(left) - submissionMillis(right))[0]?.id || "",
        attempt: nextAttempt,
        attemptNumber: nextAttempt,
        isResubmission: true,
        historicalScoreUnlock: attemptRows.length === 0,
        reviewStatus: "pending_review",
        status: "resubmitted",
        createdAt: now,
        updatedAt: now,
        submittedAt: now,
        resubmittedAt: now,
      });

      transaction.set(
        counterRef,
        {
          studentId: uid,
          canonicalAssignmentKey: validated.assignmentKey,
          assignmentId: validated.assignmentKey,
          level: validated.level,
          attempts: nextAttempt,
          passed: false,
          lastSubmissionId: submissionRef.id,
          lastSubmissionFingerprint: validated.fingerprint,
          lastSubmittedAt: now,
          updatedAt: now,
          createdAt: counterSnap.exists ? counter.createdAt || now : now,
        },
        { merge: true },
      );

      return {
        success: true,
        submissionId: submissionRef.id,
        attempt: nextAttempt,
        maxAttempts: MAX_ATTEMPTS,
      };
    });
  },
);

exports._testing = {
  buildCounterId,
  isPassed,
  validatePayload,
};
