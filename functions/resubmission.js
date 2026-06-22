const { onCall, HttpsError } = require("firebase-functions/v2/https");
const admin = require("firebase-admin");
const { FieldValue, Timestamp } = require("firebase-admin/firestore");

const PASS_THRESHOLD_SCORE = 60;
const MAX_RESUBMISSION_TRIES = 2;
const MAX_TOTAL_SUBMISSION_ATTEMPTS = 1 + MAX_RESUBMISSION_TRIES;
const RESUBMISSION_COOLDOWN_MS = 10 * 60 * 1000;
const ATTEMPT_STATUSES = new Set([
  "submitted",
  "resubmitted",
  "pending_review",
  "pending",
  "awaiting_review",
  "passed",
  "failed",
]);
const PASS_STATUSES = new Set(["approved", "pass", "passed", "complete", "completed"]);
const EXPECTED_HTTPS_CODES = new Set([
  "unauthenticated",
  "invalid-argument",
  "failed-precondition",
  "resource-exhausted",
  "permission-denied",
  "not-found",
  "already-exists",
]);

const getAdmin = () => {
  if (!admin.apps.length) admin.initializeApp();
  return admin;
};

const cleanText = (value, maxLength = 12000) => {
  if (value === null || value === undefined || typeof value === "object") return "";
  return String(value).trim().slice(0, maxLength);
};

const normalize = (value) => cleanText(value, 1000).toLowerCase();
const compact = (value) => normalize(value).replace(/[^a-z0-9]+/g, "");
const normalizeTitle = (value) => normalize(value).replace(/\s+/g, " ");
const unique = (values = []) => [...new Set(values.map((value) => cleanText(value, 400)).filter(Boolean))];

const toFiniteNumber = (value) => {
  if (value === null || value === undefined || cleanText(value) === "") return null;
  if (typeof value === "number") return Number.isFinite(value) ? value : null;
  const match = String(value).match(/-?\d+(?:\.\d+)?/);
  if (!match) return null;
  const parsed = Number(match[0]);
  return Number.isFinite(parsed) ? parsed : null;
};

const toMillis = (value) => {
  if (!value) return 0;
  if (typeof value.toMillis === "function") {
    const millis = value.toMillis();
    return Number.isFinite(millis) ? millis : 0;
  }
  if (typeof value.toDate === "function") {
    const date = value.toDate();
    const millis = date instanceof Date ? date.getTime() : 0;
    return Number.isFinite(millis) ? millis : 0;
  }
  if (typeof value.seconds === "number") {
    return Number(value.seconds) * 1000 + Math.floor(Number(value.nanoseconds || 0) / 1000000);
  }
  if (value instanceof Date) return Number.isFinite(value.getTime()) ? value.getTime() : 0;
  if (typeof value === "number") return value > 100000000000 ? value : value * 1000;
  const parsed = Date.parse(String(value));
  return Number.isFinite(parsed) ? parsed : 0;
};

const submissionMillis = (data = {}) =>
  Math.max(
    toMillis(data.resubmittedAt),
    toMillis(data.submittedAt),
    toMillis(data.createdAt),
    toMillis(data.updatedAt),
    toMillis(data.timestamp),
    toMillis(data.date)
  );

const resultMillis = (data = {}) =>
  Math.max(
    toMillis(data.markedAt),
    toMillis(data.scoredAt),
    toMillis(data.createdAt),
    toMillis(data.updatedAt),
    toMillis(data.timestamp),
    toMillis(data.date),
    toMillis(data.created_at)
  );

const assignmentAliases = (data = {}) =>
  unique([
    data.canonicalAssignmentKey,
    data.assignmentKey,
    data.assignmentId,
    data.assignment_id,
    data.explicitId,
  ]);

const assignmentMatches = (data = {}, context = {}) => {
  const requestedAliases = context.aliases || [];
  const requestedNormalized = new Set(requestedAliases.map(normalize));
  const requestedCompact = new Set(requestedAliases.map(compact).filter(Boolean));
  const existingAliases = assignmentAliases(data);

  if (
    existingAliases.some(
      (alias) => requestedNormalized.has(normalize(alias)) || requestedCompact.has(compact(alias))
    )
  ) {
    return true;
  }

  const existingLevel = normalize(data.level || data.courseLevel);
  const existingDay = toFiniteNumber(data.day || data.assignmentDay);
  const existingTitle = normalizeTitle(data.assignment || data.assignmentTitle || data.title || data.topic);
  const levelMatches = !context.level || !existingLevel || existingLevel === normalize(context.level);
  const dayMatches = !context.day || existingDay === null || existingDay === Number(context.day);
  const titleMatches = context.title && existingTitle && existingTitle === normalizeTitle(context.title);

  return Boolean(levelMatches && dayMatches && titleMatches);
};

const getSubmissionText = (data = {}) =>
  cleanText(data.submissionText || data.answer || data.workContent || data.text, 12000);

const isAttemptDocument = (data = {}) => {
  if (!getSubmissionText(data)) return false;
  const status = normalize(data.status || data.reviewStatus || data.result);
  const attempt = toFiniteNumber(data.attempt || data.attemptNumber);
  return (
    ATTEMPT_STATUSES.has(status) ||
    Boolean(data.isResubmission) ||
    (typeof attempt === "number" && attempt > 0) ||
    submissionMillis(data) > 0
  );
};

const getReviewedScore = (data = {}) =>
  toFiniteNumber(data.score ?? data.finalScore ?? data.percentage ?? data.mark ?? data.grade);

const isPassed = (data = {}) => {
  const score = getReviewedScore(data);
  if (typeof score === "number") return score >= PASS_THRESHOLD_SCORE;
  return PASS_STATUSES.has(normalize(data.reviewStatus || data.result || data.status));
};

const appearsToContainFalowenUiText = (value) => {
  const normalized = normalize(value);
  const phrases = [
    "resubmission unlocked",
    "resubmissions left",
    "first submission is #1",
    "you can resubmit",
    "submitted preview",
    "review details",
  ];
  return phrases.filter((phrase) => normalized.includes(phrase)).length >= 2;
};

const buildAttemptCounterId = ({ studentId, canonicalAssignmentKey }) =>
  `${String(studentId || "").replace(/[^a-zA-Z0-9._-]/g, "_")}__${String(
    canonicalAssignmentKey || ""
  ).replace(/[^a-zA-Z0-9._-]/g, "_")}`.slice(0, 300);

const buildCooldownError = ({ latestSubmissionMillis, nowMillis = Date.now() }) => {
  const nextAllowedMillis = latestSubmissionMillis + RESUBMISSION_COOLDOWN_MS;
  const remainingSeconds = Math.max(0, Math.ceil((nextAllowedMillis - nowMillis) / 1000));
  return new HttpsError("resource-exhausted", "Please wait before submitting again.", {
    success: false,
    code: "RESUBMISSION_COOLDOWN",
    message: "Please wait before submitting again.",
    nextAllowedAt: new Date(nextAllowedMillis).toISOString(),
    remainingSeconds,
  });
};

const loadScoreRows = async ({ db, studentCodes }) => {
  const codes = unique(
    studentCodes.flatMap((code) => [code, String(code).toLowerCase(), String(code).toUpperCase()])
  );
  if (!codes.length) return [];

  const requests = [];
  for (const code of codes) {
    requests.push(db.collection("scores").where("studentcode", "==", code).get());
    requests.push(db.collection("scores").where("studentCode", "==", code).get());
  }

  const settled = await Promise.allSettled(requests);
  const rows = new Map();
  settled.forEach((result) => {
    if (result.status !== "fulfilled") {
      console.warn("submitAssignmentResubmission score lookup failed", {
        code: result.reason?.code,
        message: result.reason?.message,
      });
      return;
    }
    result.value.docs.forEach((docSnap) => rows.set(docSnap.id, { id: docSnap.id, ...docSnap.data() }));
  });
  return [...rows.values()];
};

const preserveExpectedError = (error) => {
  if (error instanceof HttpsError) return error;
  const rawCode = cleanText(error?.code, 80).replace(/^functions\//, "");
  if (EXPECTED_HTTPS_CODES.has(rawCode) && cleanText(error?.message)) {
    return new HttpsError(rawCode, cleanText(error.message, 1000), error?.details || undefined);
  }
  return null;
};

const validatePayload = (data = {}) => {
  const selectedAssignmentId = cleanText(data.assignmentId || data.assignment_id, 160);
  const canonicalAssignmentKey = cleanText(
    data.canonicalAssignmentKey || data.assignmentKey || selectedAssignmentId,
    160
  );
  const correctedText = cleanText(data.submissionText || data.answer || data.workContent, 12000);
  const improvementSummary = cleanText(data.improvementSummary, 2000);
  const previousScore = toFiniteNumber(data.previousScore);
  const day = toFiniteNumber(data.day);
  const level = cleanText(data.level, 20).toUpperCase();

  if (!canonicalAssignmentKey || !selectedAssignmentId) {
    throw new HttpsError("invalid-argument", "Assignment details are missing. Please reopen the assignment and try again.");
  }
  if (!correctedText) throw new HttpsError("invalid-argument", "Corrected text is required.");
  if (appearsToContainFalowenUiText(correctedText)) {
    throw new HttpsError(
      "invalid-argument",
      "Corrected text appears to include page instructions. Submit only the corrected answer text."
    );
  }
  if (correctedText.length < 80) throw new HttpsError("invalid-argument", "Corrected text is too short.");
  if (improvementSummary.length < 25) {
    throw new HttpsError("invalid-argument", "Please explain what you improved in this resubmission.");
  }
  if (previousScore === null) {
    throw new HttpsError("failed-precondition", "A reviewed score is required before resubmitting.");
  }
  if (previousScore >= PASS_THRESHOLD_SCORE) {
    throw new HttpsError("failed-precondition", "This assignment is already passed, so resubmission is disabled.");
  }

  return {
    selectedAssignmentId,
    canonicalAssignmentKey,
    correctedText,
    improvementSummary,
    previousScore,
    day,
    level,
    title: cleanText(data.assignmentTitle || data.title, 500),
    chapter: cleanText(data.chapter, 80),
    chapterKey: cleanText(data.chapterKey, 160),
    className: cleanText(data.className, 200),
  };
};

exports.submitAssignmentResubmission = onCall({ region: "europe-west1" }, async (request) => {
  const authUid = request.auth?.uid || "";
  const data = request.data || {};

  try {
    if (!authUid) throw new HttpsError("unauthenticated", "Please sign in before resubmitting work.");

    const validated = validatePayload(data);
    const db = getAdmin().firestore();
    const submissionsRef = db.collection("submissions");

    // Use one indexed equality filter and match assignment aliases in memory. This
    // supports older submissions that predate canonicalAssignmentKey and avoids a
    // compound-query/index failure inside the transaction.
    const studentSubmissionsSnap = await submissionsRef.where("studentId", "==", authUid).get();
    const context = {
      aliases: unique([
        validated.canonicalAssignmentKey,
        validated.selectedAssignmentId,
        data.assignmentKey,
        data.assignment_id,
      ]),
      level: validated.level,
      day: validated.day,
      title: validated.title,
    };

    const matchingSubmissions = studentSubmissionsSnap.docs
      .map((docSnap) => ({ id: docSnap.id, ...docSnap.data() }))
      .filter((row) => assignmentMatches(row, context));
    const attemptDocuments = matchingSubmissions.filter(isAttemptDocument);

    if (!attemptDocuments.length) {
      throw new HttpsError(
        "failed-precondition",
        "Submit and receive review for this assignment before resubmitting."
      );
    }

    const trustedStudentCodes = unique([
      ...matchingSubmissions.map((row) => row.studentCode || row.studentcode || row.student_code),
      data.studentCode,
    ]);
    const scoreRows = (await loadScoreRows({ db, studentCodes: trustedStudentCodes })).filter((row) =>
      assignmentMatches(row, context)
    );

    const reviewedRows = [...matchingSubmissions, ...scoreRows]
      .map((row) => ({ row, score: getReviewedScore(row), millis: resultMillis(row) }))
      .filter((entry) => typeof entry.score === "number")
      .sort((left, right) => right.millis - left.millis);

    const bestReviewedScore = reviewedRows.length
      ? Math.max(...reviewedRows.map((entry) => entry.score))
      : null;
    const matchingFailedScore = reviewedRows.some(
      (entry) => entry.score < PASS_THRESHOLD_SCORE && Math.abs(entry.score - validated.previousScore) < 0.01
    );
    const hasPassed =
      matchingSubmissions.some(isPassed) ||
      scoreRows.some(isPassed) ||
      (typeof bestReviewedScore === "number" && bestReviewedScore >= PASS_THRESHOLD_SCORE);

    if (hasPassed) {
      throw new HttpsError("failed-precondition", "This assignment is already passed, so resubmission is disabled.");
    }
    if (!matchingFailedScore) {
      throw new HttpsError(
        "failed-precondition",
        "The reviewed score could not be verified for this assignment. Refresh the page and try again."
      );
    }

    const explicitAttemptNumbers = attemptDocuments
      .map((row) => toFiniteNumber(row.attemptNumber || row.attempt))
      .filter((value) => typeof value === "number" && value > 0);
    const explicitAttemptMax = explicitAttemptNumbers.length ? Math.max(...explicitAttemptNumbers) : 0;
    const historicalAttempts = Math.max(1, explicitAttemptMax || attemptDocuments.length);
    const latestSubmissionMillis = Math.max(...attemptDocuments.map(submissionMillis), 0);
    const earliestSubmissionMillis = attemptDocuments.reduce((earliest, row) => {
      const millis = submissionMillis(row);
      if (!millis) return earliest;
      return !earliest || millis < earliest ? millis : earliest;
    }, 0);
    const latestAttempt = attemptDocuments
      .slice()
      .sort((left, right) => submissionMillis(right) - submissionMillis(left))[0];

    const incomingFingerprint = cleanText(data.submissionFingerprint, 400);
    const duplicateInHistory = Boolean(
      incomingFingerprint &&
        matchingSubmissions.some(
          (row) => cleanText(row.submissionFingerprint, 400) === incomingFingerprint
        )
    );
    if (duplicateInHistory) {
      throw new HttpsError(
        "failed-precondition",
        "This corrected text has already been submitted for this assignment."
      );
    }

    const counterRef = db
      .collection("submissionAttemptCounters")
      .doc(
        buildAttemptCounterId({
          studentId: authUid,
          canonicalAssignmentKey: validated.canonicalAssignmentKey,
        })
      );

    return await db.runTransaction(async (transaction) => {
      const counterSnap = await transaction.get(counterRef);
      const counter = counterSnap.data() || {};
      const attempts = Math.max(Number(counter.attempts || 0), historicalAttempts);
      const serverLatestSubmissionMillis = Math.max(
        latestSubmissionMillis,
        toMillis(counter.lastSubmittedAt),
        toMillis(counter.updatedAt)
      );

      if (counter.passed === true) {
        throw new HttpsError("failed-precondition", "This assignment is already passed, so resubmission is disabled.");
      }
      if (
        incomingFingerprint &&
        cleanText(counter.lastSubmissionFingerprint, 400) === incomingFingerprint
      ) {
        throw new HttpsError(
          "failed-precondition",
          "This corrected text has already been submitted for this assignment."
        );
      }
      if (
        serverLatestSubmissionMillis > 0 &&
        Date.now() < serverLatestSubmissionMillis + RESUBMISSION_COOLDOWN_MS
      ) {
        throw buildCooldownError({ latestSubmissionMillis: serverLatestSubmissionMillis });
      }
      if (attempts >= MAX_TOTAL_SUBMISSION_ATTEMPTS) {
        throw new HttpsError(
          "resource-exhausted",
          "You have used all resubmissions for this assignment."
        );
      }

      const nextAttempt = attempts + 1;
      const now = FieldValue.serverTimestamp();
      const submissionRef = submissionsRef.doc();
      const trustedStudentCode = cleanText(trustedStudentCodes[0] || data.studentCode, 120);

      transaction.set(submissionRef, {
        title: validated.title,
        assignmentTitle: validated.title,
        assignmentKey: validated.canonicalAssignmentKey,
        canonicalAssignmentKey: validated.canonicalAssignmentKey,
        assignmentId: validated.selectedAssignmentId,
        assignment_id: validated.selectedAssignmentId,
        chapter: validated.chapter,
        chapterKey: validated.chapterKey,
        day: validated.day,
        level: validated.level,
        className: validated.className,
        studentId: authUid,
        studentEmail: cleanText(data.studentEmail, 320),
        studentCode: trustedStudentCode,
        studentScopeKey: cleanText(data.studentScopeKey, 300),
        studentName: cleanText(data.studentName, 200),
        submissionFingerprint: incomingFingerprint,
        submissionText: validated.correctedText,
        answer: validated.correctedText,
        workContent: validated.correctedText,
        improvementSummary: validated.improvementSummary,
        previousSubmissionText: cleanText(
          data.previousSubmissionText || getSubmissionText(latestAttempt),
          12000
        ),
        previousScore: validated.previousScore,
        originalSubmittedAt: earliestSubmissionMillis
          ? Timestamp.fromMillis(earliestSubmissionMillis)
          : null,
        originalSubmissionId: attemptDocuments
          .slice()
          .sort((left, right) => submissionMillis(left) - submissionMillis(right))[0]?.id || "",
        attempt: nextAttempt,
        attemptNumber: nextAttempt,
        isResubmission: true,
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
          studentId: authUid,
          canonicalAssignmentKey: validated.canonicalAssignmentKey,
          assignmentId: validated.selectedAssignmentId,
          level: validated.level,
          attempts: nextAttempt,
          passed: false,
          lastSubmissionId: submissionRef.id,
          lastSubmissionFingerprint: incomingFingerprint,
          lastSubmittedAt: now,
          updatedAt: now,
          createdAt: counterSnap.exists ? counter.createdAt || now : now,
        },
        { merge: true }
      );

      return {
        success: true,
        submissionId: submissionRef.id,
        attempt: nextAttempt,
        maxAttempts: MAX_TOTAL_SUBMISSION_ATTEMPTS,
      };
    });
  } catch (error) {
    console.error("submitAssignmentResubmission override error", {
      message: error?.message,
      code: error?.code,
      details: error?.details,
      stack: error?.stack,
      studentId: authUid,
      assignmentKey: data?.canonicalAssignmentKey || data?.assignmentKey,
    });

    const expectedError = preserveExpectedError(error);
    if (expectedError) throw expectedError;

    throw new HttpsError("internal", "Could not save your resubmission. Please try again.", {
      success: false,
      code: "RESUBMISSION_SAVE_FAILED",
    });
  }
});

exports._testing = {
  assignmentMatches,
  buildCooldownError,
  getReviewedScore,
  isAttemptDocument,
  submissionMillis,
  toFiniteNumber,
  toMillis,
};
