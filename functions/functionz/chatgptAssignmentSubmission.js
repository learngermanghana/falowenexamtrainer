"use strict";

// Official A1 tutor submission from the Falowen MCP server. This deliberately
// uses the SAME top-level submissions/submissionLocks records as Campus.
// It never marks answers, bypasses a lock, or handles timed mock exams.
const crypto = require("crypto");
const { getAssignmentSummary } = require("./routes/scoresSummaryCoursePlan");
const { isA1TimedAssignment, validateA1ChatgptSubmissionCompleteness } = require("./chatgptA1SubmissionSafety");

const LEVELS = new Set(["A1", "A2", "B1", "B2", "C1", "C2"]);
const A1_OBJECTIVE = new Set(["0.1", "0.2", "5", "7", "8", "12.1", "12.2"]);
const A1_LONG = new Set(["12.3", "13", "14.1"]);
const MAX_A1_CHARACTERS = 2500;
const normalize = value => String(value || "").trim();
const idPart = value => normalize(value).toLowerCase().replace(/[^a-z0-9._-]/g, "_").slice(0, 120);
const sha256 = value => crypto.createHash("sha256").update(String(value)).digest("hex");

function germanEnrollment(student) {
  const data = student?.data || {};
  const primary = normalize(data.program || data.languageProgram || "german").toLowerCase();
  const primaryProgram = ["swahili", "kiswahili"].includes(primary) ? "swahili" : primary === "german" ? "german" : "unknown";
  if (primaryProgram === "german") {
    const level = normalize(data.level || data.course).toUpperCase();
    return { primaryProgram, germanLevel: LEVELS.has(level) ? level : "", enrolledInGerman: true };
  }
  const secondary = normalize(data.secondaryProgram).toLowerCase();
  const placement = data.coursePlacements?.german;
  // A retained coursePlacements.german entry alone is not an active enrollment.
  if (secondary === "german" && primaryProgram === "swahili" && placement) {
    const level = normalize(placement.level || placement.levelId).toUpperCase();
    return { primaryProgram, germanLevel: LEVELS.has(level) ? level : "", enrolledInGerman: true };
  }
  return { primaryProgram, germanLevel: "", enrolledInGerman: false };
}

function planA1Submission({ student, uid, email, assignmentId, answerText, requestId, confirmed }) {
  const course = germanEnrollment(student);
  if (!course.enrolledInGerman || !course.germanLevel) {
    return { ok: false, error: "No active German course enrollment is available. Check the language selection in Falowen Campus/Admin." };
  }
  if (course.germanLevel !== "A1") {
    return { ok: false, error: "Official ChatGPT submissions are currently limited to the A1 pilot. Submit A2/B1 work in Campus." };
  }
  if (!normalize(uid) || !normalize(email)) return { ok: false, error: "Verified student identity is required." };
  if (confirmed !== true) return { ok: false, error: "Review the entire response with the student and obtain explicit confirmation before final submission." };
  if (typeof requestId !== "string" || !/^[A-Za-z0-9_-]{8,80}$/.test(requestId)) {
    return { ok: false, error: "A valid unique request ID is required to protect against duplicate submissions." };
  }
  if (typeof answerText !== "string") return { ok: false, error: "Answer text is required." };
  const submittedText = answerText.trim();
  if (submittedText.length < 20 || submittedText.length > MAX_A1_CHARACTERS) {
    return { ok: false, error: "The complete A1 answer must contain 20–2500 characters." };
  }
  const normalizedId = normalize(assignmentId).toUpperCase();
  const { lessons } = getAssignmentSummary("A1");
  const entry = lessons.find(lesson => lesson.submissionRequired &&
    normalize(lesson.assignmentId).toUpperCase() === normalizedId);
  if (!entry || !normalizedId || normalizedId.includes("MOCK")) {
    return { ok: false, error: "This is not a current A1 tutor assignment. Timed exams, mock submissions and archived tasks must remain in Campus." };
  }
  const day = Number(entry.dayNumber);
  const chapter = normalize(entry.displayChapter || entry.chapter);
  if (!Number.isInteger(day) || day < 1 || day > 22) {
    return { ok: false, error: "Only active A1 tutor days 1–22 are eligible; orientation and final exams remain in Campus." };
  }
  // Timed checkpoints and every tutor task from the A1 timed phase stay in
  // Campus, where the attempt clock and auto-submit state are authoritative.
  if (isA1TimedAssignment(normalizedId, day)) {
    return { ok: false, error: "Timed A1 tutor assignments must be submitted in Campus with their real timed-attempt state. Nothing was submitted or locked." };
  }
  // Canonical student-visible section rules are mandatory even when the text
  // satisfies a global word count. Unsupported tasks fail closed.
  const completeness = validateA1ChatgptSubmissionCompleteness({ assignmentId: normalizedId, answerText: submittedText });
  if (!completeness.ok) return { ok: false, error: completeness.error };
  const minWords = A1_LONG.has(chapter) ? 50 : A1_OBJECTIVE.has(chapter) ? 0 : 10;
  const count = submittedText.split(/\s+/u).filter(Boolean).length;
  if (count < minWords) return { ok: false, error: `This A1 task requires at least ${minWords} words; ${count} were supplied.` };
  const studentCode = normalize(student.data.studentCode || student.data.studentcode || student.id);
  const studentName = normalize(student.data.name || student.data.fullName || student.data.displayName) || "Student";
  const chapterKey = chapter ? "chapter-" + idPart(chapter) : "day-" + day;
  const studentScopeKey = [uid, studentCode, email].map(idPart).filter(Boolean).join("__");
  const lockId = [studentScopeKey, "a1", idPart(chapterKey)].join("__");
  const title = `A1 • Day ${day}: ${normalize(entry.title).slice(0, 160)}${chapter ? " • Chapter " + chapter : ""}`;
  const fingerprint = [
    idPart(title), idPart(chapterKey),
    idPart(submittedText.toLowerCase().replace(/\s+/g, " ").slice(0, 240)),
  ].join("::");
  return {
    ok: true, level: "A1", day, assignmentId: normalizedId, chapter,
    chapterKey, lockId, studentScopeKey, studentCode, studentName, title,
    answerText: submittedText, fingerprint, requestId,
    documentId: sha256(uid + ":" + requestId).slice(0, 40),
  };
}

async function submitA1Assignment({ admin, student, uid, email, args }) {
  const plan = planA1Submission({
    student, uid, email, assignmentId: args?.assignmentId, answerText: args?.answerText,
    requestId: args?.requestId, confirmed: args?.confirmed,
  });
  if (!plan.ok) return { submitted: false, error: plan.error };
  if (process.env.FALOWEN_CHATGPT_OFFICIAL_SUBMIT_ENABLED !== "true") {
    return { submitted: false, error: "ChatGPT official submission is not yet enabled for the A1 pilot. No work was saved. Complete this task in Campus." };
  }
  const db = admin.firestore();
  const submissionRef = db.collection("submissions").doc(plan.documentId);
  const lockRef = db.collection("submissionLocks").doc(plan.lockId);
  const at = admin.firestore.FieldValue.serverTimestamp();
  const saved = await db.runTransaction(async tx => {
    const [priorSubmission, lock] = await Promise.all([tx.get(submissionRef), tx.get(lockRef)]);
    if (priorSubmission.exists) {
      const prior = priorSubmission.data() || {};
      return prior.studentId === uid && prior.assignmentId === plan.assignmentId &&
        prior.submissionFingerprint === plan.fingerprint
        ? { submitted: true, alreadyProcessed: true }
        : { submitted: false, error: "Request ID was already used for different work." };
    }
    if (lock.exists) return { submitted: false, error: "This assignment is already submitted and locked. Request a resubmission in Campus if needed." };
    const payload = {
      title: plan.title, assignmentTitle: plan.title, level: plan.level,
      day: plan.day, chapter: plan.chapter,
      assignmentId: plan.assignmentId, assignment_id: plan.assignmentId,
      assignmentKey: plan.assignmentId, canonicalAssignmentKey: plan.assignmentId,
      answerKeySource: null, chapterKey: plan.chapterKey, submissionLink: null,
      submissionText: plan.answerText, answer: plan.answerText, workContent: plan.answerText,
      studentId: uid, studentEmail: email, studentCode: plan.studentCode,
      studentScopeKey: plan.studentScopeKey, studentName: plan.studentName,
      className: normalize(student.data.className),
      submissionFingerprint: plan.fingerprint, status: "submitted",
      attempt: 1, attemptNumber: 1, isResubmission: false, reviewStatus: "pending_review",
      submittedAt: at, createdAt: at, updatedAt: at,
      source: "falowen_chatgpt_confirmed_student_submission",
    };
    tx.create(submissionRef, payload);
    tx.create(lockRef, {
      studentId: uid, studentEmail: email, studentCode: plan.studentCode,
      level: plan.level, lockedAt: at, assignmentTitle: plan.title,
      day: plan.day, chapter: plan.chapter, chapterKey: plan.chapterKey,
    });
    return { submitted: true, alreadyProcessed: false };
  });
  return {
    ...saved, assignmentId: plan.assignmentId, day: plan.day,
    ...(saved.submitted ? { submissionId: plan.documentId, reviewStatus: "pending_review" } : {}),
    clarification: saved.submitted
      ? "Your confirmed assignment was saved in Falowen for the existing tutor review/marking process. No grade has been assigned."
      : "Nothing was submitted. Review the error and use Campus if needed.",
  };
}

module.exports = { germanEnrollment, planA1Submission, submitA1Assignment };
