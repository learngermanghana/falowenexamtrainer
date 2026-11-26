const {verifiedOwnerPreview,previewInfo} = require("./chatgptOwnerCourseTesting");
"use strict";

// Falowen ChatGPT learning companion: read-only MCP with OAuth 2.1 + PKCE.
// Opaque hashed Firestore tokens keep private student data out of the URL and logs.
const express = require("express");
const crypto = require("crypto");
const { getAssignmentSummary } = require("./routes/scoresSummaryCoursePlan");
const { getCurriculumEntriesForLevel } = require("../data/curriculumManifest");
const { getScoresForStudent } = require("./scoresSheet");
const { getStudentTimetable } = require("./chatgptClassTimetable");
const { prepareFromTimetable } = require("./chatgptClassPreparation");
const { getExamPractice, listExamPractice } = require("./chatgptExamPractice");
const { getMyExamDictionary } = require("./chatgptExamLibrary");
const { TOOLS: EXAM_TOOLS, isExamOnlyProfile, validExamOnlyProfile, examTool } = require("./chatgptMockReview");
const { germanEnrollment, submitA1Assignment } = require("./chatgptAssignmentSubmission");
const { submitExpandedWorkbook, workbookStatus } = require("./chatgptWorkbookSubmission");
const { TOOLS: REVISION_TOOLS, revisionTool, revisionAccess, permitted } = require("./chatgptPersonalRevision");
const { enrollmentRows, enrollmentDecision } = require("./levelEnrollmentAccess");
const { TOOLS: TUTOR_TOOLS, tutorTool } = require("./chatgptInteractiveTutor");
const { TOOLS: COACH_TOOLS, coachTool } = require("./chatgptSavedRevision");

let GENERATED_COURSE_CONTENT = null;
try {
  // Generated from real Falowen learner-facing data during the web prebuild.
  // Static path lets Vercel include the snapshot in the existing API bundle.
  GENERATED_COURSE_CONTENT = require("../data/chatgptLessonContent.generated.json");
} catch (error) {
  if (error.code !== "MODULE_NOT_FOUND") throw error;
}
const VALID_LESSON_SECTIONS = new Set(["overview", "workbook", "vocabulary", "grammar", "reading", "listening", "speaking", "writing", "review"]);
function contentForLesson(level, day) {
  return GENERATED_COURSE_CONTENT?.levels?.[level]?.[String(day)] || null;
}
function lessonContentResponse(level, day, section = "overview") {
  if (!VALID_LESSON_SECTIONS.has(section)) return { error: "Unsupported lesson section" };
  const content = contentForLesson(level, day);
  if (!content) return {
    level, day, section, available: false,
    clarification: "The full learner-facing material is not exported for this lesson yet. Open Falowen Campus; do not invent or claim to quote its exercises.",
    lessonUrl: lessonUrl(level, { dayNumber: day }),
  };
  const base = {
    level, day, chapter: content.chapter, title: content.title, section,
    source: "Falowen Course Book (learner-facing source data)",
    lessonUrl: lessonUrl(level, { dayNumber: day, displayChapter: content.chapter }),
    ...(level === "C1" ? { readingPracticeUrl: SITE + "/campus/course/c1-self-learning/day-" + day } : {}),
    guidance: "Use only the supplied learner-facing text for claims about Falowen's exact exercises. Do not claim to know answers or completion state. The selected lesson section is a starting point. Keep the last verified programme, level, day and chapter in this conversation. When the learner asks in German or English to switch section or chapter, retrieve the exact requested section of the same lesson or the requested new lesson before teaching. Verify level and day, and chapter if specified. Use the actual workbook part mapping when known; ask briefly if Teil numbering is ambiguous. Do not assume every level or exam has the same numbering. A2 Day 9 Teil 1 is speaking and Teil 2 writing. For previous levels use the authorised revision tools. Do not require a new conversation or a Campus tab change unless the requested source or playback is unavailable. If Voice cannot call tools, retrieve in text in the same chat and resume Voice. No invented exercises or automatic grade.",
    availableSections: [...VALID_LESSON_SECTIONS].filter(key=>key==="overview"||Boolean(content[key])),
    ...(level==="A2"&&day===9?{workbookPartSections:{"1":"speaking","2":"writing","3":"reading",...(content.listening?{"4":"listening"}:{})}}:{}),
  };
  if (section === "overview") return {
    ...base, available: true,
    topic: content.topic, goal: content.goal, grammarFocus: content.grammarFocus,
    skillFocus: content.skillFocus, examPart: content.examPart, campusTabs: content.campusTabs,
    studySequence: [
      ...(level === "B1" && content.reading
        ? ["Read the original Falowen Lesen passage and answer its questions. Do not request a key before attempting them."]
        : ["Read the vocabulary and grammar teaching in Campus."]),
      (content.skillFocus === "lesen" || (level === "B1" && content.reading)) ? "Read the lesson passage and answer the reading questions without a solution key."
        : content.skillFocus === "hoeren" ? "Listen to the audio in Campus and answer the listening questions."
          : content.skillFocus === "write" ? "Follow the assigned writing prompt in Campus and draft your own response."
            : "Complete the speaking or communication task shown in Campus.",
      level === "B1" ? "Finish any required submission in Campus." : "Review the lesson key points and practise your own sentences.",
    ],
    grammarExercise: content.grammar?.task || null,
    workbookChapters: content.workbook?.chapters?.map((chapter) => ({
      chapter: chapter.chapter, title: chapter.title, assignmentId: chapter.assignmentId, sections: chapter.sections, route: chapter.route,
    })) || [],
    grammarNotesUrl: content.grammar?.notesUrl || content.grammar?.noteLinks?.[0]?.url || null,
    fullGrammarExplanationIncluded: content.grammar?.fullExplanationIncluded !== false,
    originalReadingAvailable: Boolean(content.reading?.questions?.length),
    instruction: content.instruction || null,
    readingTitle: content.reading?.title || null,
    writingPrompt: content.writing?.prompt || null,
    clarification: "This study order describes the actual available Course Book sections. The sequence is guidance, not a verified timed assignment or completion record.",
  };
  if (!content[section]) return {
    ...base, available: false,
    clarification: "This section is not included in the exported lesson material; open the relevant Falowen Campus tab. Do not invent missing exercises.",
  };
  return { ...base, available: true, material: content[section] };
}

// One-on-one exam practice is instructed in the ChatGPT conversation itself.
// No extra model request, score write, or transcript disclosure is made here.
const PRACTICE_SKILLS = new Set(["reading", "listening", "speaking", "writing", "grammar"]);
function practiceGuideResponse(level, day, skill = "reading", mode = "exam", language = "de") {
  if (!PRACTICE_SKILLS.has(skill) || !["exam", "study"].includes(mode) ||
      !["de", "en"].includes(language)) {
    return { available: false, error: "Unsupported practice skill, mode or language." };
  }
  const original = lessonContentResponse(level, day, skill);
  if (!original.available) return {
    ...original, practiceMode: mode, language,
    clarification: "The exact learner-facing material for this skill/day is unavailable. Do not invent an exercise, an audio link or an answer key.",
  };
  const rubric = {
    reading: ["Locate the passage evidence", "Explain the author's argument", "Identify counterarguments and inferences", "Use the learner's own words"],
    listening: ["Listen to the actual Campus audio first", "Identify the main point", "Distinguish evidence from opinion", "Confirm key details"],
    speaking: ["Address the actual prompt", "Structure a clear argument", "Use precise level-appropriate German", "Respond to counterarguments"],
    writing: ["Fulfil every prompt point", "Organise and connect arguments", "Use correct, precise German", "Revise grammar and register"],
    grammar: ["Explain the grammatical meaning", "Show a source example", "Invite a learner-created sentence", "Correct form and explain why"],
  };
  const steps = {
    reading: "First display the authentic passage. Ask only one original question at a time and wait for the student's answer. Give feedback with supporting paragraph evidence, then ask the next question. For open-response C1 questions, assess reasoning without inventing an official answer key.",
    listening: "Link the learner to the lesson audio in Falowen Campus where available. Never claim to play an audio file that was not supplied. Ask one original question at a time after listening; do not disclose hidden transcripts.",
    speaking: "Present the original speaking prompt. For an A2 classroom card, use its five original guiding questions one at a time; wait for the learner to answer in German before giving short feedback and continuing. Offer sentence starters only when needed. A newly worded conversational follow-up must be labelled as a teaching example, not a quoted Falowen question. Match the student level; assess pronunciation only when actual audio is available. Never claim an official grade.",
    writing: "Present the original writing task and expected length. Request the learner's own draft, then explain strengths and revisions using the provided rubric; do not claim to mark or submit in Campus.",
    grammar: "Teach the exact course grammar in the requested language, provide short level-appropriate examples, then ask a learner to create one sentence at a time and explain corrections.",
  };
  return {
    ...original, practiceMode: mode, explanationLanguage: language,
    interaction: {
      method: "one_question_at_a_time",
      instructions: steps[skill],
      rubric: rubric[skill],
      studentAnswersRequired: true,
      estimatedScoreIsPracticeOnly: true,
      preserveStudentAnswersOnlyWithinConversation: true,
      summaryInstruction: "At the end, summarise attempted questions, demonstrated strengths and areas to revise. Only report an exact score when the conversation contains sufficient graded evidence. Do not write grades, completion or scores to Falowen Campus.",
      ...(skill === "listening" ? {
        sourceAudioNote: original.material?.audioAvailableInCampus
          ? "Open the authenticated Campus lesson link for audio; no direct audio URL is supplied by this tool."
          : "No verified audio is supplied for this lesson; do not imply that it is playable.",
      } : {}),
    },
  };
}

const SITE = "https://www.falowen.app";
const ISSUER = SITE + "/api/chatgpt";
const RESOURCE = ISSUER + "/mcp";
const SCOPE = "falowen:read";
const PRACTICE_WRITE_SCOPE = "falowen:practice:write";
const ASSIGNMENT_WRITE_SCOPE = "falowen:assignments:write";
const ALLOWED_SCOPES = [SCOPE, PRACTICE_WRITE_SCOPE, ASSIGNMENT_WRITE_SCOPE];
const VALID_SKILLS = new Set(["reading","listening","speaking","writing","grammar","vocabulary"]);
const CLIENT_ID = "https://chatgpt.com/oauth/client.json";
const CALLBACK = "https://chatgpt.com/connector_platform_oauth_redirect";
const AUTH_CODE_MS = 5 * 60 * 1000;
const ACCESS_MS = 60 * 60 * 1000;
const REFRESH_MS = 30 * 24 * 60 * 60 * 1000;
const MAX_RESULT_ROWS = 40;

const sha256 = (v) => crypto.createHash("sha256").update(String(v)).digest("hex");
const randomToken = () => crypto.randomBytes(32).toString("base64url");
const normalize = (v) => String(v || "").trim();
// Keep the student level from the live Falowen record. B2/C1 are self-study courses.
const normalizeLevel = (v) => (normalize(v).toUpperCase().match(/\b(A1|A2|B1|B2|C1|C2)\b/) || [])[1] || "";
const SELF_STUDY_LEVELS = new Set(["B2", "C1", "C2"]);
const numberOrNull = (v) => v === null || v === undefined || v === "" || !Number.isFinite(Number(v)) ? null : Number(v);
const isExpired = (value) => {
  const ms = value && typeof value.toMillis === "function" ? value.toMillis() : new Date(value).getTime();
  return !Number.isFinite(ms) || ms <= Date.now();
};

function oauthParameters(input) {
  const params = {
    response_type: normalize(input.response_type),
    client_id: normalize(input.client_id),
    redirect_uri: normalize(input.redirect_uri),
    code_challenge: normalize(input.code_challenge),
    code_challenge_method: normalize(input.code_challenge_method),
    scope: normalize(input.scope),
    resource: normalize(input.resource),
    state: normalize(input.state),
  };
  if (params.response_type !== "code" || params.client_id !== CLIENT_ID ||
      params.redirect_uri !== CALLBACK || params.code_challenge_method !== "S256" ||
      !/^[A-Za-z0-9_-]{43,128}$/.test(params.code_challenge) ||
      params.resource !== RESOURCE || !params.scope.split(/\s+/).includes(SCOPE) ||
      params.scope.split(/\s+/).some(scope => !ALLOWED_SCOPES.includes(scope)) ||
      !params.state || params.state.length > 1024) {
    return null;
  }
  return params;
}

function safeStudentAccess(student) {
  if (!student || normalize(student.accountType).toLowerCase() === "exam_only") return false;
  const role = normalize(student.role || "student").toLowerCase();
  if (role !== "student" || student.isTutor === true) return false;
  // Match Campus sign-in eligibility: trial-limited learners may connect to the
  // Companion, while still receiving only the permissions they explicitly grant.
  const status = normalize(student.status).toLowerCase();
  if (status && !["active", "paid", "partial", "pending", "enrolled", "registered",
    "ongoing", "current", "trial_active", "trial_expired"].includes(status)) return false;
  const payment = normalize(student.paymentStatus).toLowerCase();
  if (["failed", "overdue", "rejected", "cancelled", "canceled"].includes(payment)) return false;
  if (student.contractEnd && !isNaN(new Date(student.contractEnd.toDate ? student.contractEnd.toDate() : student.contractEnd).getTime()) &&
      isExpired(student.contractEnd)) return false;
  return true;
}

async function studentForIdentity(admin, identity, boundId) {
  const db = admin.firestore();
  const deletion = await db.collection("accountDeletionRequests").doc(identity.uid).get();
  if (["pending", "processing", "completed"].includes(deletion.data()?.status)) return null;
  const students = db.collection("students");
  let snap;
  if (boundId) {
    snap = await students.doc(boundId).get();
  } else {
    const direct = await students.doc(identity.uid).get();
    if (direct.exists) snap = direct;
    if (!snap) {
      const byUid = await students.where("uid", "==", identity.uid).limit(1).get();
      if (!byUid.empty) snap = byUid.docs[0];
    }
    if (!snap && identity.email && identity.email_verified) {
      const byEmail = await students.where("email", "==", identity.email.toLowerCase()).limit(1).get();
      if (!byEmail.empty) snap = byEmail.docs[0];
    }
  }
  if (!snap?.exists) return null;
  const data = snap.data() || {};
  const linkedUid = normalize(data.uid);
  if (linkedUid && linkedUid !== identity.uid) return null;
  if (!linkedUid) {
    const linkedEmail = normalize(data.authEmail || data.loginEmail || data.email).toLowerCase();
    if (!identity.email_verified || !linkedEmail || linkedEmail !== normalize(identity.email).toLowerCase()) return null;
  }
  if (!safeStudentAccess(data) && !validExamOnlyProfile(data)) return null;
  return { id: snap.id, data };
}

function studentView(student) {
  const data = student.data;
  const german = germanEnrollment(student);
  return {
    name: normalize(data.name || data.fullName || data.displayName) || "Student",
    // German exercises must never be derived from a Swahili A1 root level.
    level: german.enrolledInGerman ? german.germanLevel : "",
    campusUrl: SITE + "/campus",
  };
}

function lessonUrl(level, item) {
  const day = Number(item.dayNumber || item.day || item.displayDay);
  if (!Number.isInteger(day) || day < 1 || day > 50) return SITE + "/campus/course";
  const chapter = normalize(item.displayChapter || item.chapter);
  const suffix = chapter ? "?chapter=" + encodeURIComponent(chapter) : "";
  return SITE + "/campus/course/lesson/" + encodeURIComponent(level) + "/" + day + suffix;
}

function scoreRowsForStudent(rows, level) {
  return (Array.isArray(rows) ? rows : []).filter((row) =>
    !normalizeLevel(row.level) || normalizeLevel(row.level) === level
  ).slice(0, 500).map((row) => ({
    assignmentId: normalize(row.assignment_id || row.assignmentId).toUpperCase(),
    assignment: normalize(row.assignment).slice(0, 150),
    score: numberOrNull(row.score),
    feedback: normalize(row.comments).slice(0, 1200),
    date: normalize(row.date).slice(0, 40),
  }));
}

function summarizeStudentAssignments(student, rows) {
  const level = studentView(student).level;
  if (!level) return { error: "No supported course level is assigned to this account.", campusUrl: SITE + "/campus" };

  if (SELF_STUDY_LEVELS.has(level)) {
    // Do not label B2/C1/C2 lessons "missing assignments" or synthesize a tutor score.
    // These courses use learner-led lesson completion, which can be device-local.
    const source = getCurriculumEntriesForLevel(level) || [];
    const days = new Map();
    source.forEach((entry) => {
      const day = Number(entry.day ?? entry.assignmentDay ?? entry.displayDay);
      if (!Number.isInteger(day) || day < 1 || day > 50) return;
      if (!days.has(day) || (entry.progressionEligible && !days.get(day).progressionEligible)) {
        days.set(day, entry);
      }
    });
    // Some advanced self-study days (notably C2) are stored in the canonical
    // Course Book alignment rather than the legacy curriculum manifest.
    // The generated source snapshot fills the missing catalogue days.
    for (const [key, lesson] of Object.entries(GENERATED_COURSE_CONTENT?.levels?.[level] || {})) {
      const day = Number(key);
      if (!days.has(day) && Number.isInteger(day) && day >= 1 && day <= 50) {
        days.set(day, {
          day, lessonTitle: lesson.title, topic: lesson.topic, goal: lesson.goal,
          grammarFocus: lesson.grammarFocus, displayChapter: lesson.chapter,
          progressionEligible: true,
        });
      }
    }
    const lessons = [...days.entries()].sort(([a], [b]) => a - b).map(([day, entry]) => ({
      day,
      title: normalize(entry.lessonTitle || entry.topic || entry.title || "Lesson").slice(0, 180),
      goal: normalize(entry.goal).slice(0, 500),
      grammarFocus: normalize(entry.grammar_topic || entry.grammarFocus).slice(0, 250),
      status: "self_study",
      completionVerified: false,
      lessonUrl: lessonUrl(level, { dayNumber: day, displayChapter: entry.displayChapter || entry.chapter }),
      ...(level === "C1" ? { readingPracticeUrl: SITE + "/campus/course/c1-self-learning/day-" + day } : {}),
    }));
    return {
      level,
      courseMode: "self_study",
      totalCourseItems: lessons.length,
      totalSelfStudyLessons: lessons.length,
      totalTutorAssignments: 0,
      completedCount: null,
      completionAvailable: false,
      clarification: lessons.length
        ? "These are your self-study Course Book lessons, not tutor-submission assignments. ChatGPT cannot verify device-local completion; use Falowen Campus to review actual progress."
        : "The self-study course is recognised, but its lesson catalogue is not yet available to this plugin. Open Falowen Campus for the latest lessons.",
      assignments: lessons,
      campusUrl: SITE + "/campus/course",
    };
  }

  const { lessons, totalCourseItems } = getAssignmentSummary(level);
  const graded = scoreRowsForStudent(rows, level);
  const byId = new Map();
  for (const row of graded) {
    if (!row.assignmentId || row.score === null) continue;
    const prior = byId.get(row.assignmentId);
    if (!prior || row.score > prior.score) byId.set(row.assignmentId, row);
  }
  const required = lessons.filter((lesson) => lesson.submissionRequired && lesson.assignmentId);
  const assignments = required.map((lesson) => {
    const result = byId.get(normalize(lesson.assignmentId).toUpperCase());
    return {
      assignmentId: lesson.assignmentId,
      day: lesson.dayNumber,
      title: lesson.title,
      goal: lesson.goal,
      status: !result ? "no_grade_recorded" : result.score >= 60 ? "passed" : "needs_review",
      bestRecordedScore: result?.score ?? null,
      submissionUrl: lessonUrl(level, lesson),
    };
  });
  const passed = assignments.filter((a) => a.status === "passed").length;
  const needsReview = assignments.filter((a) => a.status === "needs_review").length;
  const noGradeRecorded = assignments.filter((a) => a.status === "no_grade_recorded").length;
  return {
    level, totalCourseItems, totalTutorAssignments: assignments.length,
    passed, needsReview, noGradeRecorded,
    clarification: "No grade recorded does not prove the assignment is unsubmitted. Official submission and marking remain on Falowen Campus.",
    assignments,
  };
}

// Enrolment metadata is not a payment grant. Never infer secondary enrolment
// from a retained placement alone, or derive Kiswahili from German level.
function companionPrograms(student) {
  const data = student.data || {};
  const german = germanEnrollment(student);
  const programs = [];
  if (german.enrolledInGerman && german.germanLevel) programs.push({ program: "german", level: german.germanLevel });
  const secondary = normalize(data.secondaryProgram).toLowerCase();
  const placement = data.coursePlacements?.swahili;
  const swLevel = german.primaryProgram === "swahili"
    ? normalizeLevel(data.level || data.course)
    : german.primaryProgram === "german" && ["swahili", "kiswahili"].includes(secondary) && placement
      ? normalizeLevel(placement.level || placement.levelId) : "";
  if (swLevel) programs.push({ program: "swahili", level: swLevel });
  return programs;
}

function swahiliLessonResponse(student, day, section = "overview") {
  const enrolled = companionPrograms(student).find(p => p.program === "swahili");
  const base = { program: "swahili", level: enrolled?.level || null, day, section,
    campusUrl: SITE + "/campus/course" };
  if (!enrolled || enrolled.level !== "A1") return { ...base, available: false,
    clarification: "An active Kiswahili A1 enrolment is required. Other levels are not exported; use Campus." };
  if (!Number.isInteger(day) || day < 1 || day > 20 ||
      !["overview","grammar","vocabulary","reading","speaking","writing","listening"].includes(section)) {
    return { ...base, available: false, clarification: "Unsupported Kiswahili day or section." };
  }
  const lesson = GENERATED_COURSE_CONTENT?.programs?.swahili?.A1?.[String(day)];
  if (!lesson) return { ...base, available: false, clarification: "This lesson is not exported; do not invent course material." };
  const details = { ...base, title: lesson.title, lessonUrl: SITE + "/campus/course/swahili/day-" + day,
    guidance: "Use the published Kiswahili content. Ask one question at a time; provide unofficial feedback after the learner attempts it. Do not invent audio, grades, completion or answer keys." };
  if (section === "overview") return { ...details, available: true, goal: lesson.goal,
    grammarFocus: lesson.grammarFocus, availableSections: ["grammar","vocabulary","reading","speaking","writing","listening"].filter(k => Boolean(lesson[k])) };
  return lesson[section] ? { ...details, available: true, material: lesson[section] }
    : { ...details, available: false, clarification: "This section is not exported. Open the lesson in Campus." };
}

function revisionEvidence(student, rows) {
  const level = studentView(student).level;
  // Use only explicitly level-labelled records for new analytics, and never
  // mix a dual-enrolled learner's potentially same-level programme scores.
  if (!level || SELF_STUDY_LEVELS.has(level) || companionPrograms(student).length !== 1) {
    return { available: false, level, clarification: "Programme-specific tutor evidence is unavailable for this account. No weaknesses or readiness score can be inferred." };
  }
  const scoped = (Array.isArray(rows) ? rows : []).filter(row =>
    normalizeLevel(row.level) === level &&
    !["swahili","kiswahili"].includes(normalize(row.program || row.languageProgram).toLowerCase()));
  const summary = summarizeStudentAssignments(student, scoped);
  const items = (summary.assignments || []).filter(a => a.status === "needs_review")
    .sort((a,b) => a.bestRecordedScore - b.bestRecordedScore).slice(0, 5);
  return { available: summary.passed + summary.needsReview > 0, level,
    recordedPassed: summary.passed, recordedNeedsReview: summary.needsReview,
    noGradeRecorded: summary.noGradeRecorded, revisionPriorities: items,
    guidance: "Prioritise these real recorded assignments. Tutor scores alone are not skill scores or an exam readiness prediction; do not infer unsubmitted work or promise a pass. Use the actual lesson and ask the learner what they struggled with." };
}

const toolDefinitions = [

  {
    name: "get_my_falowen_profile",
    description: "Identify my connected Falowen student profile and course level without exposing student numbers or private records.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    outputSchema: {
      type: "object", properties: {
        id: { type: "string", minLength: 1, pattern: "\\S" },
        name: { type: "string" },
        nickname: { type: "string" },
        program: { type: "string" },
        germanLevel: { type: "string" },
      },
      required: ["id"], additionalProperties: false,
    },
    _meta: { "openai/profile": true },
  },
  {
    name: "get_my_falowen_access",
    description: "List my recorded German and Kiswahili course enrolments and Campus link. This does not grant payment or previous-level access.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_my_falowen_swahili_lesson",
    description: "Practise the published Kiswahili A1 workbook for my own enrolled programme. Choose a day and section; never substitute German, invent listening audio or expose official answers.",
    inputSchema: { type: "object", properties: {
      day: { type: "integer", minimum: 1, maximum: 20 },
      section: { type: "string", enum: ["overview","grammar","vocabulary","reading","speaking","writing","listening"] },
    }, required: ["day"], additionalProperties: false },
  },
  {
    name: "get_my_falowen_weaknesses",
    description: "Identify German revision priorities from my own explicitly level-labelled tutor assignment scores. Not a skill-level or exam readiness prediction; missing grades are not missing submissions.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name:"get_my_falowen_revision_levels",
    description:"Check my verified current and previous course levels for read-only revision. A trial can only access Day 1. No new submission entitlement.",
    inputSchema:{type:"object",properties:{},additionalProperties:false},
    annotations:{readOnlyHint:true,destructiveHint:false,openWorldHint:false},
  },
  {
    name:"get_my_falowen_revision_lesson",
    description:"Retrieve authorised current or previous-level original German or Kiswahili A1 lesson content for revision only. First check revision levels; no official submission or grading.",
    inputSchema:{type:"object",properties:{program:{type:"string",enum:["german","swahili"]},level:{type:"string",enum:["A1","A2","B1","B2","C1","C2"]},day:{type:"integer",minimum:1,maximum:50},section:{type:"string",enum:["overview","vocabulary","grammar","reading","listening","speaking","writing","review"]}},required:["program","day"],additionalProperties:false},
    annotations:{readOnlyHint:true,destructiveHint:false,openWorldHint:false},
  },
  {
    name:"get_my_falowen_personal_plan",
    description:"Build a personalised 15–120 minute plan from authorised lessons, explicitly scoped tutor assignment marks, or a selected verified mock result. Optional examDate is learner supplied, not an official scheduled date. For a mock-based plan first retrieve my verified attempt ID with mock history. No pass prediction or saved official grades.",
    inputSchema:{type:"object",properties:{program:{type:"string",enum:["german","swahili"]},level:{type:"string",enum:["A1","A2","B1","B2","C1","C2"]},day:{type:"integer",minimum:1,maximum:50},minutes:{type:"integer",minimum:15,maximum:120},mockId:{type:"string",maxLength:80},attemptId:{type:"string",maxLength:150},examDate:{type:"string",maxLength:10}},required:["program"],additionalProperties:false},
    annotations:{readOnlyHint:true,destructiveHint:false,openWorldHint:false},
  },
  {
    name:"get_my_falowen_revision_vocabulary",
    description:"Retrieve bilingual vocabulary from an authorised published lesson (specify day) or the existing level-filtered German Campus dictionary (omit day for full course). Quiz one item at a time, repeat missed words within conversation; no saved spaced-repetition records.",
    inputSchema:{type:"object",properties:{program:{type:"string",enum:["german","swahili"]},level:{type:"string",enum:["A1","A2","B1","B2","C1","C2"]},day:{type:"integer",minimum:1,maximum:50},query:{type:"string",maxLength:100},limit:{type:"integer",minimum:1,maximum:20}},required:["program"],additionalProperties:false},
    annotations:{readOnlyHint:true,destructiveHint:false,openWorldHint:false},
  },
  {
    name: "get_my_falowen_study_plan",
    description: "Suggest a short daily study plan using my own recorded course assignments and learner-safe lesson content. Missing marks are not proof of non-submission; self-study completion cannot be verified.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_my_falowen_vocabulary_practice",
    description: "Retrieve verified vocabulary from a day in my enrolled German Course Book and provide one-question-at-a-time flashcard instructions. Does not save practice results or invent missing words.",
    inputSchema: { type: "object", properties: { day: { type: "integer", minimum: 1, maximum: 50 } }, required: ["day"], additionalProperties: false },
  },
  {
    name: "get_my_falowen_grammar_writing_coach",
    description: "Coach grammar or writing from my real Falowen lesson with feedback on my own answers, without giving official grades or submitting work.",
    inputSchema: { type: "object", properties: { day: { type: "integer", minimum: 1, maximum: 50 }, skill: { type: "string", enum: ["grammar", "writing"] }, language: { type: "string", enum: ["de", "en"] } }, required: ["day", "skill"], additionalProperties: false },
  },
  {
    name:"get_my_falowen_oral_examiner",
    description:"Start interactive oral self-practice using an original authorised Exams Room speaking dictionary card, published mock task or course lesson. In exam mode ask one question at a time and give feedback at the end; coach mode corrects after each turn. No official grade, audio recording or timed exam. Exam-only students may use entitled exam sources, not Course Book.",
    inputSchema:{type:"object",properties:{source:{type:"string",enum:["dictionary","mock","lesson"]},mode:{type:"string",enum:["exam","coach"]},program:{type:"string",enum:["german","swahili"]},level:{type:"string",enum:["A1","A2","B1","B2","C1","C2"]},day:{type:"integer",minimum:1,maximum:50},part:{type:"string",enum:["teil1","teil2","teil3","teil4","teil5"]},mockId:{type:"string",maxLength:80},taskId:{type:"string",maxLength:130},query:{type:"string",maxLength:100}},additionalProperties:false},
    annotations:{readOnlyHint:true,destructiveHint:false,openWorldHint:false},
  },
  {
    name:"get_my_falowen_music_tutor",
    description:"List approved lesson-linked German or Kiswahili songs at an authorised course level, or study a chosen track using its exact bundled recording lyrics, matched English translation and editorial story when available. Returns up to eight lines per request. No R2 keys, drafts, guessed lyrics or timing, playback tracking or official score. Open the original Falowen Music song to listen.",
    inputSchema:{type:"object",properties:{program:{type:"string",enum:["german","swahili"]},level:{type:"string",enum:["A1","A2","B1","B2","C1","C2"]},day:{type:"integer",minimum:1,maximum:50},trackId:{type:"string",maxLength:245},startLine:{type:"integer",minimum:1,maximum:500},lineCount:{type:"integer",minimum:1,maximum:8}},required:["program"],additionalProperties:false},
    annotations:{readOnlyHint:true,destructiveHint:false,openWorldHint:false},
  },
  {
    name: "get_my_falowen_speaking_partner",
    description: "Guide speaking practice using the authentic prompt from my enrolled Falowen lesson. Ask one question at a time; only assess pronunciation when the learner supplies audio.",
    inputSchema: { type: "object", properties: { day: { type: "integer", minimum: 1, maximum: 50 }, language: { type: "string", enum: ["de", "en"] } }, required: ["day"], additionalProperties: false },
  },
  {
    name: "get_my_falowen_music_guide",
    description: "Help me study with Falowen Music and my course lesson. Never claim a specific track is linked to the day unless verified in the course export. Music is optional and ungraded.",
    inputSchema: { type: "object", properties: { day: { type: "integer", minimum: 1, maximum: 50 } }, required: ["day"], additionalProperties: false },
  },
  {
    name: "get_my_falowen_exam_mocks",
    description: "List currently published German Exams Room mock exams for my enrolled course, with real links. The list distinguishes ready mocks from the smaller set of question types exported for ChatGPT practice. Never invent unavailable material.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_my_falowen_exam_dictionary",
    description: "Search the authentic German Exams Room Sprechen or Schreiben dictionary for my enrolled level, with optional Teil, topic search and exact task ID. Return learner-facing prompts, not answers or grades. For Lesen/Hören use get_my_falowen_exam_practice on an available mock.",
    inputSchema: { type: "object", properties: {
      category: { type: "string", enum: ["speaking", "writing"] },
      part: { type: "string", maxLength: 24 },
      query: { type: "string", maxLength: 100 },
      taskId: { type: "string", maxLength: 130 },
      limit: { type: "integer", minimum: 1, maximum: 10 },
    }, required: ["category"], additionalProperties: false },
  },
  {
    name: "get_my_falowen_exam_practice",
    description: "Retrieve one learner-visible original task from a supported published A1–B1 mock, with Campus Practice Mode links for unexported sections. Hören supplies a protected Exams Room listening page link, NOT private audio or a transcript. No official timed attempt, answer key, or score.",
    inputSchema: { type: "object", properties: {
      mockId: { type: "string", pattern: "^[a-z][a-z0-9-]{2,79}$", maxLength: 80, description: "Published mock ID shown by get_my_falowen_exam_mocks; unsupported question sets return unavailable rather than invented tasks." },
      skill: { type: "string", enum: ["writing", "speaking", "reading", "listening"] },
      part: { type: "string", maxLength: 24 },
      questionNumber: { type: "integer", minimum: 1, maximum: 35 },
    }, required: ["mockId", "skill"], additionalProperties: false },
  },
  {
    name:"get_my_falowen_mock_history",
    description:"List my own official Falowen mock attempts for an accessible mock paper. Only verified completed attempts contain official scores. Use its attempt ID to retrieve corrections. No exam attempts are started or modified.",
    inputSchema:{type:"object",properties:{mockId:{type:"string",maxLength:80},cursor:{type:"string",maxLength:150}},required:["mockId"],additionalProperties:false},
    annotations:{readOnlyHint:true,destructiveHint:false,openWorldHint:false},
  },
  {
    name:"get_my_falowen_mock_review",
    description:"Retrieve my own verified mock attempt's numbered Lesen/Hören mistakes, saved Schreiben/Sprechen feedback, recorded section scores and targeted revision priorities. Never infer a pass prediction or use historical corrections to answer an active timed test.",
    inputSchema:{type:"object",properties:{mockId:{type:"string",maxLength:80},attemptId:{type:"string",maxLength:150}},required:["mockId","attemptId"],additionalProperties:false},
    annotations:{readOnlyHint:true,destructiveHint:false,openWorldHint:false},
  },
  {
    name: "save_my_falowen_practice_note",
    description: "With the student's explicit request, save a short, self-reported study note to their own Falowen account. Never save official exam answers, grades, or assignment completion. Requires separately authorized falowen:practice:write scope.",
    inputSchema: { type: "object", properties: {
      day: { type: "integer", minimum: 1, maximum: 50 },
      skill: { type: "string", enum: ["reading","listening","speaking","writing","grammar","vocabulary"] },
      note: { type: "string", minLength: 1, maxLength: 1200 },
      requestId: { type: "string", minLength: 8, maxLength: 80, pattern: "^[A-Za-z0-9_-]+$" },
    }, required: ["day", "skill", "note", "requestId"], additionalProperties: false },
    annotations: { readOnlyHint: false, destructiveHint: false, openWorldHint: false, idempotentHint: true },
    securitySchemes: [{ type: "oauth2", scopes: [SCOPE, PRACTICE_WRITE_SCOPE] }],
  },
  {
    name: "get_my_falowen_submission_status",
    description: "Check my own official workbook submission record, required sections and review status. Use German assignment ID or Kiswahili A1 day. No record does not prove missing work; official grades are separate.",
    inputSchema: { type:"object", properties:{
      program:{type:"string",enum:["german","swahili"]},
      assignmentId:{type:"string",maxLength:48},day:{type:"integer",minimum:1,maximum:20},
    }, required:["program"],additionalProperties:false },
  },
  {
    name: "submit_my_falowen_workbook",
    description: "Submit eligible untimed German A2/B1 or published Kiswahili A1 work for tutor review. First retrieve exact requirements and prompts, show every learner answer and obtain separate explicit confirmation that the work is final. For Kiswahili listening require the student to confirm listening to the real recording or teacher. Never invent answers, submit timed work or overwrite an existing submission. Requires assignment-write OAuth permission.",
    inputSchema:{type:"object",properties:{
      program:{type:"string",enum:["german","swahili"]},
      assignmentId:{type:"string",maxLength:48},
      day:{type:"integer",minimum:1,maximum:20},
      answerText:{type:"string",maxLength:4200},
      writing:{type:"string",maxLength:12000},
      readingAnswers:{type:"object",additionalProperties:{type:"string",maxLength:12000}},
      listeningAnswers:{type:"object",additionalProperties:{type:"string",maxLength:12000}},
      listeningConfirmed:{type:"boolean"},
      requestId:{type:"string",minLength:8,maxLength:80,pattern:"^[A-Za-z0-9_-]+$"},
      confirmed:{type:"boolean",description:"True only after explicit confirmation of the displayed exact final answers."},
    },required:["program","requestId","confirmed"],additionalProperties:false},
    annotations:{readOnlyHint:false,destructiveHint:true,openWorldHint:false,idempotentHint:true},
    securitySchemes:[{type:"oauth2",scopes:[SCOPE,ASSIGNMENT_WRITE_SCOPE]}],
  },
  {
    name: "submit_my_falowen_assignment",
    description: "Submit a COMPLETE A1 tutor assignment as an official Falowen submission. Call only after showing the student the exact assignment, complete answers, and explaining the permanent submission lock, then obtaining explicit student confirmation. Do NOT use for mock exams, timed work, resubmission, A2/B1, or practice. Requires separate official assignment-write OAuth consent; never claim a grade.",
    inputSchema: { type: "object", properties: {
      assignmentId: { type: "string", minLength: 3, maxLength: 48, description: "Canonical A1 tutor assignment ID from get_my_falowen_assignments, not an exam ID." },
      answerText: { type: "string", minLength: 20, maxLength: 2500, description: "Exactly the final full answer reviewed by the learner; do not invent missing sections." },
      requestId: { type: "string", minLength: 8, maxLength: 80, pattern: "^[A-Za-z0-9_-]+$", description: "Unique retry-safe ID for this confirmed submission." },
      confirmed: { type: "boolean", description: "True only AFTER explicit, separate student confirmation of the actual final answer and the irreversible lock." },
    }, required: ["assignmentId", "answerText", "requestId", "confirmed"], additionalProperties: false },
    annotations: { readOnlyHint: false, destructiveHint: true, openWorldHint: false, idempotentHint: true },
    securitySchemes: [{ type: "oauth2", scopes: [SCOPE, ASSIGNMENT_WRITE_SCOPE] }],
  },
  {
    name: "get_my_falowen_assignments",
    description: "List my course work and Campus lesson links. A1–B1 have tutor-marked assignments; B2–C2 show self-study lessons without inventing submission or completion status.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_my_falowen_progress",
    description: "Summarize my recorded A1–B1 tutor-assignment completion; for B2–C2 explain that self-study completion is not verified from this connection.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name:"get_my_falowen_assignment_correction",
    description:"Explain my recorded German A1–B1 tutor assignment feedback or my current reviewed Kiswahili A1 workbook. Ask for my own response before correcting it and create similar retry exercises. Never change marks or invent original answers.",
    inputSchema:{type:"object",properties:{program:{type:"string",enum:["german","swahili"]},level:{type:"string",enum:["A1","A2","B1"]},assignmentId:{type:"string",maxLength:48},day:{type:"integer",minimum:1,maximum:20}},required:["program"],additionalProperties:false},
    annotations:{readOnlyHint:true,destructiveHint:false,openWorldHint:false},
  },
  {
    name:"get_my_falowen_vocabulary_review",
    description:"Get my own due vocabulary flashcards from previously confirmed practice sessions for an authorised course level. Repeat difficult words one at a time; never reveal the meaning before I answer. These are not grades.",
    inputSchema:{type:"object",properties:{program:{type:"string",enum:["german","swahili"]},level:{type:"string",enum:["A1","A2","B1","B2","C1","C2"]},limit:{type:"integer",minimum:1,maximum:20}},required:["program"],additionalProperties:false},
    annotations:{readOnlyHint:true,destructiveHint:false,openWorldHint:false},
  },
  {
    name:"save_my_falowen_vocabulary_review",
    description:"Save up to ten vocabulary review outcomes matching the exact authorised Falowen vocabulary previously retrieved. Show the words and agreed self-reported outcomes, then request explicit confirmation before saving. Requires optional practice-write permission. Use a unique retry ID. Not an official score.",
    inputSchema:{type:"object",properties:{program:{type:"string",enum:["german","swahili"]},level:{type:"string",enum:["A1","A2","B1","B2","C1","C2"]},items:{type:"array",minItems:1,maxItems:10,items:{type:"object",properties:{term:{type:"string",maxLength:180},meaning:{type:"string",maxLength:300},day:{type:"integer",minimum:1,maximum:50},outcome:{type:"string",enum:["again","hard","remembered"]}},required:["term","meaning","outcome"],additionalProperties:false}},requestId:{type:"string",minLength:8,maxLength:80,pattern:"^[A-Za-z0-9_-]+$"},confirmed:{type:"boolean"}},required:["program","items","requestId","confirmed"],additionalProperties:false},
    annotations:{readOnlyHint:false,destructiveHint:false,openWorldHint:false,idempotentHint:true},
    securitySchemes:[{type:"oauth2",scopes:[SCOPE,PRACTICE_WRITE_SCOPE]}],
  },
  {
    name:"get_my_falowen_exam_recommendations",
    description:"Recommend targeted exam revision using my selected verified mock attempt and available authorised practice papers. First use mock history to select an attempt. If none is selected, establish a baseline rather than invent scores. No readiness percentage or pass prediction. Available to entitled exam-only accounts.",
    inputSchema:{type:"object",properties:{mockId:{type:"string",maxLength:80},attemptId:{type:"string",maxLength:150},minutes:{type:"integer",minimum:15,maximum:120}},additionalProperties:false},
    annotations:{readOnlyHint:true,destructiveHint:false,openWorldHint:false},
  },
  {
    name: "get_my_falowen_feedback",
    description: "Retrieve my most recent tutor-marked assignment scores and feedback, not other students' data.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_my_falowen_next_class",
    description: "Find my next live German class from my verified Falowen class assignment and the saved Admin timetable. Show the session time, topic, preparation details and enrolled class Zoom link if configured. Do not invent unrecorded sessions or use other cohorts.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_my_falowen_class_preparation",
    description: "Prepare me interactively for my next Falowen live class. First verify my enrolled class and next session through the real timetable. Use its recorded topic and only trusted lesson-day mapping to return original Course Book reading questions, grammar focus, workbook sections and a 10-minute study plan. Never guess the day, topic, or answers. Ask one question at a time.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_my_falowen_lesson",
    description: "Get my assigned course day and a learner-safe, source-grounded exercise for A1–C2 when exported. Supports older published ChatGPT connections without the practice guide. Ask one question at a time and never fabricate missing exercises or expose answer keys.",
    inputSchema: {
      type: "object", properties: { day: { type: "integer", minimum: 1, maximum: 50, description: "Lesson day in the student's enrolled course." }, level:{type:"string",enum:["A1","A2","B1","B2","C1","C2"],description:"Requested German level; must match the linked current course."} },
      required: ["day"], additionalProperties: false,
    },
  },
  {
    name: "get_my_falowen_practice_guide",
    description: "Start a source-grounded one-question-at-a-time C1/C2 or A1–B2 German course practice. Use the exact enrolled lesson text for Lesen, audio availability for Hören, grammar, speaking or writing; English explanation is optional. No official grading, submission or answer keys.",
    inputSchema: {
      type: "object",
      properties: {
        day: { type: "integer", minimum: 1, maximum: 50 },
        level:{type:"string",enum:["A1","A2","B1","B2","C1","C2"],description:"Requested German level; must match the linked current course."},
        skill: { type: "string", enum: ["reading", "listening", "speaking", "writing", "grammar"] },
        mode: { type: "string", enum: ["exam", "study"] },
        language: { type: "string", enum: ["de", "en"], description: "Language for explanations, not the original German source." },
      },
      required: ["day", "skill"],
      additionalProperties: false,
    },
  },
  {
    name: "get_my_falowen_lesson_content",
    description: "Read actual learner-facing German Course Book material for the linked A1–C2 level, including the upgraded 28-day C1 curriculum. Verify the requested level explicitly; use revision tools for authorised previous levels. Never substitute another level or invent unavailable material.",
    inputSchema: {
      type: "object",
      properties: {
        day: { type: "integer", minimum: 1, maximum: 50, description: "Course Book day" },
        level:{type:"string",enum:["A1","A2","B1","B2","C1","C2"],description:"Requested German level; must match the linked current course."},
        section: {
          type: "string", enum: ["overview", "vocabulary", "grammar", "reading", "listening", "speaking", "writing", "review"],
          description: "Choose one section per call to keep results fast. Default overview.",
        },
      },
      required: ["day"], additionalProperties: false,
    },
  },
].map((tool) => ({
  ...tool,
  // Apply defaults per key, not per object: partial overrides must never
  // remove mandatory explicit boolean hints from the published MCP schema.
  annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false, ...tool.annotations },
  securitySchemes: tool.securitySchemes || [{ type: "oauth2", scopes: [SCOPE] }],
  _meta: { ...(tool._meta || {}) },
}));

// Older installed ChatGPT connectors may only expose get_my_falowen_lesson,
 // not the newer section-specific tool. Include that day's real skill exercise
 // in the legacy result, still restricted to the OAuth student's own level.
 // Source fields come exclusively from the answer-safe generated snapshot.
function featuredLegacyCourseBookSection(level, day) {
  const lesson = contentForLesson(level, day);
  if (!lesson) return null;
  const bySkill = { lesen: "reading", hoeren: "listening", speak: "speaking", write: "writing" };
  let section = bySkill[lesson.skillFocus] ||
    (level === "C1" && lesson.reading ? "reading" : level === "C1" && lesson.writing ? "writing" : null);
  // Older published connectors expose lesson(day), not lesson_content or the
  // new exam guide. Give A1–B1 learners one *existing* source exercise, never
  // fabricate a passage from a heading or send the full workbook/answer key.
  // A2/B1 typically have a reading on each day; A1 only on exported days.
  if (!section && !SELF_STUDY_LEVELS.has(level)) {
    if (lesson.reading?.questions?.length &&
        (lesson.reading.paragraphs?.length || lesson.reading.text)) section = "reading";
    else if (lesson.grammar) section = "grammar";
    else if (lesson.writing?.prompt) section = "writing";
    else if (lesson.listening?.questions?.length) section = "listening";
  }
  if (!section || !lesson[section]) return null;
  const result = lessonContentResponse(level, day, section);
  return result.available ? {
    section,
    material: result.material,
    source: result.source,
    clarification: "Learner-facing Falowen material from the actual Course Book. Ask one question at a time and give feedback only after a student's attempt. Do not claim to record results in Falowen Campus.",
  } : null;
}

async function callTool(name, args, student, admin) {
  if (name === "get_my_falowen_access") return {
    programs: companionPrograms(student), campusUrl: SITE + "/campus/account",
    clarification: "Recorded programme enrolments only. Check Campus for billing, trial, exam and previous-level access."
  };
  if (name === "get_my_falowen_swahili_lesson") return swahiliLessonResponse(student, args?.day, args?.section ?? "overview");
  if (name === "get_my_falowen_weaknesses") {
    const level = studentView(student).level;
    if (!level || SELF_STUDY_LEVELS.has(level) || companionPrograms(student).length !== 1) return revisionEvidence(student, []);
    const code = normalize(student.data.studentCode || student.data.studentcode || student.id);
    return revisionEvidence(student, await getScoresForStudent(code));
  }
  const view = studentView(student);
  const enrollment = germanEnrollment(student);
  const courseReadTools = new Set(["get_my_falowen_lesson","get_my_falowen_lesson_content","get_my_falowen_practice_guide","get_my_falowen_vocabulary_practice","get_my_falowen_grammar_writing_coach","get_my_falowen_speaking_partner","get_my_falowen_music_guide"]);
  if (courseReadTools.has(name) && args?.level !== undefined && normalizeLevel(args.level) !== view.level) {
    return {available:false,requestedLevel:normalizeLevel(args.level)||null,currentLevel:view.level,
      clarification:"The requested level does not match the linked German course. Check get_my_falowen_revision_levels and retrieve an authorised previous level with get_my_falowen_revision_lesson. If the requested level is missing, verify the German enrolment in Falowen Campus or Admin; reconnect if using the wrong account. Do not teach a substituted level.",campusUrl:SITE+"/campus/account"};
  }
  if (courseReadTools.has(name) && view.level && admin?.firestore && Number.isInteger(args?.day)) {
    const db=admin.firestore();
    const [rows,policy]=await Promise.all([enrollmentRows(db.collection("students").doc(student.id)),db.collection("courseAccountAccess").doc(student.data.uid||student.id).get()]);
    const decision=enrollmentDecision(rows,"german");
    const access=revisionAccess(student.data,rows,policy.data()||{});
    const restricted=decision.managed.includes(view.level)||decision.blocked.includes(view.level)||Boolean(student.data.trialStatus)||policy.data()?.examOnly===true;
    if (restricted && !permitted(access,"german",view.level,args.day)) return {available:false,currentLevel:view.level,day:args.day,clarification:"This lesson is not authorised for the linked course. Check your course access in Falowen Campus. Do not substitute another lesson.",campusUrl:SITE+"/campus/account"};
  }
  if (!enrollment.enrolledInGerman && name !== "get_my_falowen_profile") {
    return { available: false, program: enrollment.primaryProgram,
      campusUrl: SITE + "/campus/course",
      clarification: "This account is currently enrolled in Kiswahili rather than German. The Falowen German Course Book, tutor assignments, mock exams and scores are unavailable in ChatGPT until German enrollment is activated." };
  }

  // Kiswahili lessons use a separate teacher-approved source and must not
  // silently fall through to a German A1/A2 course snapshot.
  const isSwahiliStudent = ["swahili", "kiswahili"].includes(
    normalize(student.data.program || student.data.languageProgram || "").toLowerCase());
  if (isSwahiliStudent && (name === "get_my_falowen_study_plan" ||
      name === "get_my_falowen_vocabulary_practice" ||
      name === "get_my_falowen_grammar_writing_coach" ||
      name === "get_my_falowen_speaking_partner" ||
      name === "get_my_falowen_music_guide")) {
    return { available: false, program: "swahili",
      campusUrl: SITE + "/campus/course",
      clarification: "Kiswahili lessons have a separate course book. Its approved content is not yet in this MCP export; open Falowen Campus. German practice material will not be substituted." };
  }
  // New student coaching tools reuse the same student-level-scoped, answer-safe
  // snapshot and existing score summaries. No AI API calls or tracking writes.
  if (["get_my_falowen_vocabulary_practice", "get_my_falowen_grammar_writing_coach",
       "get_my_falowen_speaking_partner", "get_my_falowen_music_guide"].includes(name)) {
    if (!Number.isInteger(args?.day) || args.day < 1 || args.day > 50) {
      throw new Error("day must be an integer between 1 and 50");
    }
    if (!view.level) return { available: false, error: "No supported course level assigned." };
    if (name === "get_my_falowen_vocabulary_practice") {
      const result = lessonContentResponse(view.level, args.day, "vocabulary");
      return { ...result, interaction: result.available ? {
        method: "one_question_at_a_time",
        instructions: "Use only the returned vocabulary. Test one term at a time, wait for the learner's answer, then correct and explain. Rotate German-to-English, English-to-German and an original sentence. Never invent an official score.",
        recordsPractice: false, officialGrade: false,
      } : undefined };
    }
    if (name === "get_my_falowen_grammar_writing_coach") {
      if (!["grammar", "writing"].includes(args?.skill)) throw new Error("skill must be grammar or writing");
      return practiceGuideResponse(view.level, args.day, args.skill, "study", args?.language || "de");
    }
    if (name === "get_my_falowen_speaking_partner") {
      return practiceGuideResponse(view.level, args.day, "speaking", "study", args?.language || "de");
    }
    const overview = lessonContentResponse(view.level, args.day, "overview");
    return {
      level: view.level, day: args.day, available: overview.available,
      lessonUrl: overview.lessonUrl,
      musicLibraryUrl: "https://music.falowen.app",
      lessonTopic: overview.available ? overview.topic : null,
      linkedRecordingVerified: false,
      instructions: "Music listening is optional, ungraded practice. Let the student choose a published song from Falowen Music, then ask them to provide its words or title if needed. Discuss only words actually supplied; do not invent lyrics, recording links, timings or a day-to-song mapping.",
    };
  }
  if (name === "get_my_falowen_study_plan") {
    if (!view.level) return { available: false, error: "No supported course level assigned." };
    let summary;
    if (SELF_STUDY_LEVELS.has(view.level)) {
      summary = summarizeStudentAssignments(student, []);
    } else {
      const studentCode = normalize(student.data.studentCode || student.data.studentcode || student.id);
      let scoreRows;
      try { scoreRows = await getScoresForStudent(studentCode); }
      catch (_error) {
        return { available: false, level: view.level, campusUrl: SITE + "/campus",
          clarification: "Recorded results cannot be checked right now. No lesson completion or submission status is assumed." };
      }
      summary = summarizeStudentAssignments(student, scoreRows);
    }
    const items = summary.assignments || [];
    const review = items.find((item) => item.status === "needs_review");
    const next = items.find((item) => item.status === "no_grade_recorded") || items[0];
    const suggested = review || next;
    const day = Number(suggested?.day);
    const overview = Number.isInteger(day) ? lessonContentResponse(view.level, day, "overview") : null;
    return {
      level: view.level, available: Boolean(suggested), courseMode: summary.courseMode || "tutor_marked",
      recommendedDay: Number.isInteger(day) ? day : null,
      recommendationReason: review ? "A recorded score suggests this assignment needs revision."
        : SELF_STUDY_LEVELS.has(view.level) ? "This is a catalogue starting point, NOT a verified next unfinished lesson."
        : "No grade is recorded for this assignment; it may already have been submitted.",
      lessonUrl: suggested?.lessonUrl || suggested?.submissionUrl || SITE + "/campus/course",
      lesson: overview?.available ? { title: overview.title, topic: overview.topic,
        grammarFocus: overview.grammarFocus, availableSections: overview.availableSections } : null,
      plan: ["5 minutes: review available vocabulary or grammar in Campus.",
        "10 minutes: practise one actual lesson exercise, one question at a time.",
        "5 minutes: write or say three original sentences; review tutor corrections when available."],
      clarification: "This plan is advice, not verified completion, a deadline, a submission or an official result. Continue or submit official work in Falowen Campus.",
    };
  }
  if (name === "get_my_falowen_exam_mocks" || name === "get_my_falowen_exam_dictionary" || name === "get_my_falowen_exam_practice") {
    const enrollment = germanEnrollment(student);
    if (!enrollment.enrolledInGerman || !enrollment.germanLevel) return {
      available: false, program: enrollment.primaryProgram, mocks: [],
      message: "This student is not currently enrolled in a German course. Changing the A1 level alone does not change the course language. Select German or activate a German secondary enrollment in Falowen Admin.",
    };
    if (name === "get_my_falowen_exam_mocks") return listExamPractice(enrollment.germanLevel);
    if (name === "get_my_falowen_exam_dictionary") {
      return getMyExamDictionary(enrollment.germanLevel, args?.category, args);
    }
    return getExamPractice(enrollment.germanLevel, args?.mockId, args?.skill, args?.part, args?.questionNumber);
  }
  if (name === "get_my_falowen_profile") {
    const enrollment = germanEnrollment(student);
    return {
      id: "flw_" + sha256(student.id).slice(0, 32),
      name: view.name,
      nickname: view.level ? "Falowen " + view.level + " student"
        : enrollment.primaryProgram === "swahili" ? "Falowen Swahili student" : "Falowen student",
      program: enrollment.primaryProgram,
      germanLevel: enrollment.enrolledInGerman ? enrollment.germanLevel : "",
    };
  }
  if (name === "get_my_falowen_class_preparation") {
    const timetable = await getStudentTimetable({ db: admin.firestore(), student, now: new Date() });
    return prepareFromTimetable({ timetable, level: view.level, courseContent: contentForLesson });
  }
  if (name === "get_my_falowen_next_class") {
    return getStudentTimetable({ db: admin.firestore(), student, now: new Date() });
  }
  if (name === "get_my_falowen_practice_guide") {
    if (!Number.isInteger(args?.day) || args.day < 1 || args.day > 50) {
      throw new Error("day must be an integer between 1 and 50");
    }
    if (!view.level) return { available: false, error: "No linked student course level." };
    return practiceGuideResponse(view.level, args.day, args?.skill,
      args?.mode || "exam", args?.language || "de");
  }
  if (name === "get_my_falowen_lesson" || name === "get_my_falowen_lesson_content") {
    if (!Number.isInteger(args?.day) || args.day < 1 || args.day > 50) throw new Error("day must be an integer between 1 and 50");
    if (name === "get_my_falowen_lesson_content") {
      const section = args?.section === undefined ? "overview" : String(args.section);
      return lessonContentResponse(view.level, args.day, section);
    }
    if (!view.level) return { error: "Course level is not available." };
    const lessons = getCurriculumEntriesForLevel(view.level) || [];
    const matching = lessons.filter((entry) =>
      Number(entry.day ?? entry.assignmentDay ?? entry.displayDay) === args.day);
    const entry = matching.find((x) => x.assignment === true) || matching[0];
    const exported = contentForLesson(view.level, args.day);
    // Advanced courses may have authentic learner content even when the
    // legacy curriculum manifest lacks that day. Never reject a real day.
    if (!entry && !exported) return { error: "Lesson not found for this course and day.", level: view.level };
    const featured = featuredLegacyCourseBookSection(view.level, args.day);
    return {
      level: view.level, day: args.day,
      title: normalize(exported?.title || entry?.topic || entry?.title).slice(0, 180),
      goal: normalize(exported?.goal || entry?.goal).slice(0, 600),
      grammarFocus: normalize(exported?.grammarFocus || entry?.grammar_topic || entry?.grammarFocus).slice(0, 200),
      lessonUrl: lessonUrl(view.level, { dayNumber: args.day, displayChapter: entry?.displayChapter || entry?.chapter || exported?.chapter }),
      ...(view.level === "C1" ? { readingPracticeUrl: SITE + "/campus/course/c1-self-learning/day-" + args.day } : {}),
      guidance: "Explain concepts and offer short original practice questions. Do not complete graded coursework for the learner.",
      ...(exported
        ? { courseBookContent: lessonContentResponse(view.level, args.day, "overview"),
            ...(featured ? { featuredCourseBookSection: featured } : {}),
            practiceSuggestion: "For source-grounded practice, use featuredCourseBookSection if present. For Lesen, show the real text and ask only one original question at a time, wait for an attempt, then explain the passage evidence. For grammar, explain the supplied focus in German or English and invite one learner sentence. Do not invent missing workbook/audio, claim official scores or write progress to Campus.",
            contentTool: "get_my_falowen_lesson_content",
            exactContentAvailable: true }
        : { exactContentAvailable: false,
            disclaimer: "Only lesson metadata is available here. Do not invent the Campus exercises." }),
    };
  }
  if (!view.level) return { error: "No supported course level is assigned to this account." };

  // Lesson lists and self-study progress should not depend on Google Sheets
  // or incur a scores query for B2/C1/C2.
  if (SELF_STUDY_LEVELS.has(view.level) && name !== "get_my_falowen_feedback") {
    const summary = summarizeStudentAssignments(student, []);
    if (name === "get_my_falowen_progress") {
      const { assignments, ...result } = summary;
      return result;
    }
    if (name === "get_my_falowen_assignments") {
      return { ...summary, assignments: summary.assignments.slice(0, MAX_RESULT_ROWS) };
    }
  }

  const studentCode = normalize(student.data.studentCode || student.data.studentcode || student.id);
  let rows;
  try {
    rows = await getScoresForStudent(studentCode);
  } catch (error) {
    if (!SELF_STUDY_LEVELS.has(view.level)) throw error;
    return {
      level: view.level, recentFeedback: [],
      clarification: "The tutor score sheet is unavailable. This does not mean your self-study lessons are incomplete. Use Falowen Campus for progress.",
      campusUrl: SITE + "/campus",
    };
  }
  if (name === "get_my_falowen_feedback") {
    return {
      level: view.level,
      recentFeedback: scoreRowsForStudent(rows, view.level).reverse().slice(0, 8),
      clarification: "Only officially recorded scores and feedback appear here.",
    };
  }
  const summary = summarizeStudentAssignments(student, rows);
  if (name === "get_my_falowen_progress") {
    const { assignments, ...result } = summary;
    return { ...result, campusUrl: SITE + "/campus" };
  }
  if (name === "get_my_falowen_assignments") return {
    ...summary, assignments: (summary.assignments || []).slice(0, MAX_RESULT_ROWS),
  };
  throw new Error("Unknown tool");
}

function makeRouter(admin) {
  const router = express.Router();
  router.use((_req, res, next) => { res.setHeader("Cache-Control", "no-store"); res.setHeader("X-Content-Type-Options", "nosniff"); next(); });

  router.get("/.well-known/oauth-protected-resource", (_req, res) => res.json({
    resource: RESOURCE, authorization_servers: [ISSUER], scopes_supported: ALLOWED_SCOPES,
    resource_documentation: SITE + "/help",
  }));
  router.get("/.well-known/oauth-authorization-server", (_req, res) => res.json({
    issuer: ISSUER, authorization_endpoint: ISSUER + "/authorize",
    token_endpoint: ISSUER + "/token",
    response_types_supported: ["code"], grant_types_supported: ["authorization_code", "refresh_token"],
    code_challenge_methods_supported: ["S256"], scopes_supported: ALLOWED_SCOPES,
    token_endpoint_auth_methods_supported: ["none"], client_id_metadata_document_supported: true,
    authorization_response_iss_parameter_supported: true,
  }));

  router.get("/authorize", (req, res) => {
    const params = oauthParameters(req.query);
    if (!params) return res.status(400).json({ error: "Invalid OAuth authorization request" });
    const qs = new URLSearchParams(params);
    return res.redirect(302, SITE + "/chatgpt/connect?" + qs.toString());
  });

  router.post("/approve", async (req, res) => {
    const params = oauthParameters(req.body || {});
    const idToken = normalize(req.body?.idToken);
    if (!params || !idToken) return res.status(400).json({ error: "Invalid authorization request" });
    try {
      const user = await admin.auth().verifyIdToken(idToken, true);
      const student = await studentForIdentity(admin, user);
      if (!student) return res.status(403).json({ error: "An active Falowen student account is required." });
      const code = randomToken();
      await admin.firestore().collection("chatgptOauthCodes").doc(sha256(code)).set({
        uid: user.uid, email: normalize(user.email).toLowerCase(),
        emailVerified: user.email_verified === true, studentId: student.id,
        clientId: params.client_id, redirectUri: params.redirect_uri,
        challenge: params.code_challenge, resource: RESOURCE, scope: params.scope,
        expiresAt: new Date(Date.now() + AUTH_CODE_MS),
      });
      const url = new URL(CALLBACK);
      url.searchParams.set("code", code);
      url.searchParams.set("state", params.state);
      url.searchParams.set("iss", ISSUER);
      return res.json({ redirectUrl: url.toString() });
    } catch (_error) {
      return res.status(401).json({ error: "Please sign in to Falowen again." });
    }
  });

  const issueTokens = async (uid, studentId, email, emailVerified, scope = SCOPE) => {
    const accessToken = randomToken();
    const refreshToken = randomToken();
    const db = admin.firestore();
    const now = Date.now();
    const base = {
      uid, studentId, email, emailVerified: emailVerified === true,
      clientId: CLIENT_ID, resource: RESOURCE, scope,
    };
    const batch = db.batch();
    batch.set(db.collection("chatgptOauthAccessTokens").doc(sha256(accessToken)), { ...base, expiresAt: new Date(now + ACCESS_MS) });
    batch.set(db.collection("chatgptOauthRefreshTokens").doc(sha256(refreshToken)), { ...base, expiresAt: new Date(now + REFRESH_MS) });
    await batch.commit();
    return { access_token: accessToken, refresh_token: refreshToken, token_type: "Bearer", expires_in: ACCESS_MS / 1000, scope };
  };

  router.post("/token", express.urlencoded({ extended: false, limit: "16kb" }), async (req, res) => {
    res.setHeader("Pragma", "no-cache");
    const body = req.body || {};
    if (normalize(body.client_id) !== CLIENT_ID || normalize(body.resource) !== RESOURCE) {
      return res.status(400).json({ error: "invalid_client" });
    }
    const grant = normalize(body.grant_type);
    const collection = grant === "authorization_code" ? "chatgptOauthCodes" :
      grant === "refresh_token" ? "chatgptOauthRefreshTokens" : null;
    const secret = normalize(grant === "authorization_code" ? body.code : body.refresh_token);
    if (!collection || !/^[A-Za-z0-9_-]{43}$/.test(secret)) return res.status(400).json({ error: "invalid_grant" });
    if (grant === "authorization_code") {
      const verifier = normalize(body.code_verifier);
      if (!/^[A-Za-z0-9._~-]{43,128}$/.test(verifier) || normalize(body.redirect_uri) !== CALLBACK) {
        return res.status(400).json({ error: "invalid_grant" });
      }
    }
    const db = admin.firestore();
    const ref = db.collection(collection).doc(sha256(secret));
    try {
      const stored = await db.runTransaction(async (tx) => {
        const snap = await tx.get(ref);
        const item = snap.data();
        if (!item || isExpired(item.expiresAt) || item.clientId !== CLIENT_ID ||
          item.resource !== RESOURCE || !item.scope?.split(/\s+/).includes(SCOPE) ||
          item.scope.split(/\s+/).some(scope => !ALLOWED_SCOPES.includes(scope)) ||
          (grant === "authorization_code" && (
            item.redirectUri !== CALLBACK ||
            crypto.createHash("sha256").update(body.code_verifier).digest("base64url") !== item.challenge
          ))) return null;
        tx.delete(ref);
        return item;
      });
      if (!stored) return res.status(400).json({ error: "invalid_grant" });
      const student = await studentForIdentity(admin, {
        uid: stored.uid, email: stored.email, email_verified: stored.emailVerified,
      }, stored.studentId);
      if (!student) return res.status(400).json({ error: "invalid_grant" });
      return res.json(await issueTokens(stored.uid, student.id, stored.email, stored.emailVerified, stored.scope));
    } catch (_error) {
      return res.status(503).json({ error: "temporarily_unavailable" });
    }
  });

  const challenge = (res, id) => {
    const description = 'Bearer resource_metadata="' + ISSUER + '/.well-known/oauth-protected-resource", error="insufficient_scope", error_description="Connect your Falowen student account"';
    res.setHeader("WWW-Authenticate", description);
    return res.json({ jsonrpc: "2.0", id, result: {
      isError: true,
      content: [{ type: "text", text: "Please connect your Falowen student account to ChatGPT." }],
      _meta: { "mcp/www_authenticate": [description] },
    } });
  };

  router.post("/mcp", async (req, res) => {
    const message = req.body;
    if (!message || message.jsonrpc !== "2.0" || typeof message.method !== "string") {
      return res.status(400).json({ jsonrpc: "2.0", id: message?.id ?? null, error: { code: -32600, message: "Invalid Request" } });
    }
    const id = message.id ?? null;
    if (message.method === "notifications/initialized" || (message.method.startsWith("notifications/") && id === null)) return res.status(202).end();
    if (message.method === "initialize") {
      return res.json({ jsonrpc: "2.0", id, result: {
        protocolVersion: "2025-06-18", capabilities: { tools: { listChanged: false } },
        serverInfo: { name: "Falowen Learning Companion", version: "1.3.0" },
        instructions: "Tutoring protocol: If revision_levels returns developerTesting.enabled, the verified owner may explicitly request any listed German test level for read-only Course Book preview. Do not confuse test levels with actual enrolled levels or grant exam, payment, progress or submission rights. Always use the explicit requested level and verify returned material.  The selected lesson section is a starting point. Keep the last verified programme, level, day and chapter in this conversation. When the learner asks in German or English to switch section or chapter, retrieve the exact requested section of the same lesson or the requested new lesson before teaching. Verify level and day, and chapter if specified. Use the actual workbook part mapping when known; ask briefly if Teil numbering is ambiguous. Do not assume every level or exam has the same numbering. A2 Day 9 Teil 1 is speaking and Teil 2 writing. For previous levels use the authorised revision tools. Do not require a new conversation or a Campus tab change unless the requested source or playback is unavailable. If Voice cannot call tools, retrieve in text in the same chat and resume Voice. No invented exercises or automatic grade. First verify the requested German level and actual authorised content. Pass level explicitly to lesson_content or practice_guide; if unavailable, stop and explain access, never substitute the linked level. Use revision_levels and revision_lesson for authorised earlier courses. For C1 use the upgraded academic topic and featured skill.  for assignment correction call get_my_falowen_assignment_correction and use recorded feedback only. For vocabulary revision call get_my_falowen_vocabulary_review, then retrieve new words from get_my_falowen_revision_vocabulary when needed. Save outcomes only after explicit confirmation using save_my_falowen_vocabulary_review and the optional practice-write permission. For targeted exam preparation call get_my_falowen_exam_recommendations with a verified attempt selected from mock history; missing skills are not zero, and never predict a pass. For interactive oral practice prefer get_my_falowen_oral_examiner, follow its exam or coach protocol, present one prompt at a time, allow fictional personal details, and never claim an official result or assess pronunciation from text alone. For song-based lessons prefer get_my_falowen_music_tutor, select an exact catalogue track first and use only matched recording lines; direct the learner to Falowen Music to hear the recording and never invent lyrics or timings. Otherwise prefer get_my_falowen_practice_guide for one-question-at-a-time reading, Hören, speaking, writing or bilingual grammar practice. If a student is connected to an older plugin that exposes only get_my_falowen_lesson, use its featuredCourseBookSection and follow practiceSuggestion. C1 reading passages are new Falowen-authored practice, not official Goethe texts. Do not persist conversation practice scores or report them as Campus grades.  For German Exams Room, start with get_my_falowen_exam_mocks, choose an explicitly supported mock skill for get_my_falowen_exam_practice, or get real Sprechen/Schreiben practice from get_my_falowen_exam_dictionary. For Hören, link the protected recording in Exams Room without copying private audio or transcripts. For Lesen, show the original source passage and one question at a time. Never invent a missing mock. Only help a learner practise their authorised German course and do not expose hidden solutions. For mock review, first call get_my_falowen_mock_history, then get_my_falowen_mock_review on a verified attempt. Practise repeatably using the returned practiceUrl and never create or change an official attempt. Exam-only accounts may use only the entitlement-checked Exams Room tools. For official A1 tutor submissions, show the exact full answer, request explicit separate confirmation, and use submit_my_falowen_assignment only if the student approved a permanent assignment lock and separately granted the assignment-write scope. A2/B1 and exam submissions remain in Campus. For exact exercises and passages, first call get_my_falowen_lesson_content with the correct day and section. Its returned learner-facing content is the source of truth; do not search external websites or add outside images when presenting an official Falowen exercise. If a section is unavailable, or only a reading task (not a passage) is supplied, say so rather than inventing a workbook passage. C2 uses a four-day skill rotation: Lesen is not available on every day. For personalised daily study, prefer get_my_falowen_personal_plan. For previous-level revision first call get_my_falowen_revision_levels, then get_my_falowen_revision_lesson or get_my_falowen_revision_vocabulary. Earlier-level material is read-only and does not grant assignment submission. Use the existing Campus dictionary for level-filtered flashcards, wait before revealing meanings, and repeat missed terms; do not claim persistent spaced-repetition history. Otherwise restrict course material to the linked student level. Guide students without giving hidden answer keys, and direct all official tutor submissions to Falowen Campus. When a learner asks to prepare for their next live class, call get_my_falowen_class_preparation; when asking just for timetable, time, topic or Zoom details, call get_my_falowen_next_class. Never infer a class from course level, invent a session or expose another cohort's meeting details. Scores come from officially recorded results only; never disclose other students' records.",
      } });
    }
    if (message.method === "ping") return res.json({ jsonrpc: "2.0", id, result: {} });
    if (message.method === "tools/list") {
      return res.json({ jsonrpc: "2.0", id, result: { tools: toolDefinitions } });
    }
    if (message.method !== "tools/call") {
      return res.json({ jsonrpc: "2.0", id, error: { code: -32601, message: "Method not found" } });
    }
    const match = normalize(req.headers.authorization).match(/^Bearer\s+([A-Za-z0-9_-]{43})$/i);
    if (!match) return challenge(res, id);
    try {
      const token = await admin.firestore().collection("chatgptOauthAccessTokens").doc(sha256(match[1])).get();
      const session = token.data();
      if (!session || isExpired(session.expiresAt) || !session.scope?.split(/\s+/).includes(SCOPE) ||
          session.scope.split(/\s+/).some(scope => !ALLOWED_SCOPES.includes(scope)) ||
          session.resource !== RESOURCE || session.clientId !== CLIENT_ID) return challenge(res, id);
      const student = await studentForIdentity(admin, {
        uid: session.uid, email: session.email, email_verified: session.emailVerified,
      }, session.studentId);
      if (!student) return challenge(res, id);
      const name = normalize(message.params?.name);
      if (!toolDefinitions.some((tool) => tool.name === name)) {
        return res.json({ jsonrpc: "2.0", id, error: { code: -32602, message: "Unknown tool" } });
      }
      // Exam-only identities may use only the explicit, entitlement-checked exam tools.
      if (EXAM_TOOLS.has(name)) {
        const result = await examTool({name,args:message.params?.arguments||{},student,admin,uid:session.uid});
        return res.json({jsonrpc:"2.0",id,result:{content:[{type:"text",text:JSON.stringify(result)}],structuredContent:result}});
      }
      if (TUTOR_TOOLS.has(name)) {
        // Exam-only users can request oral practice only from authorised exam sources.
        const args=message.params?.arguments||{};
        if(isExamOnlyProfile(student.data)&&(name!=="get_my_falowen_oral_examiner"||args.source==="lesson")){
          return res.json({jsonrpc:"2.0",id,result:{isError:true,content:[{type:"text",text:"This account has exam-only access. Choose an authorised exam speaking task."}]}});
        }
        const result=await tutorTool({name,args,student,admin,uid:session.uid,snapshot:GENERATED_COURSE_CONTENT,lessonContentResponse,swahiliLessonResponse});
        return res.json({jsonrpc:"2.0",id,result:{content:[{type:"text",text:JSON.stringify(result)}],structuredContent:result}});
      }
      if (COACH_TOOLS.has(name)) {
        if(isExamOnlyProfile(student.data)&&name!=="get_my_falowen_exam_recommendations"){
          return res.json({jsonrpc:"2.0",id,result:{isError:true,content:[{type:"text",text:"This account has exam-only access. Course corrections and saved course vocabulary require full-course access."}]}});
        }
        const canWrite=session.scope.split(/\s+/).includes(PRACTICE_WRITE_SCOPE);
        if(name==="save_my_falowen_vocabulary_review"&&!canWrite){
          return res.json({jsonrpc:"2.0",id,result:{isError:true,content:[{type:"text",text:"Reconnect with optional practice-write permission. No vocabulary outcomes saved."}]}});
        }
        const result=await coachTool({name,args:message.params?.arguments||{},student,admin,uid:session.uid,
          snapshot:GENERATED_COURSE_CONTENT,canWrite,dual:companionPrograms(student).length>1,
          loadScores:()=>getScoresForStudent(normalize(student.data.studentCode||student.data.studentcode||student.id))});
        return res.json({jsonrpc:"2.0",id,result:{content:[{type:"text",text:JSON.stringify(result)}],structuredContent:result}});
      }
      if (isExamOnlyProfile(student.data)) {
        return res.json({jsonrpc:"2.0",id,result:{isError:true,content:[{type:"text",text:"This account has exam-only access. Use the Exams Room tools; Course Book and assignment tools require a Full Course account."}]}});
      }
      // Owner preview is deliberately separate from real enrollment permissions.
      // Do not synthesize a student profile, unlock Exams Room or pass this flag to write tools.
      const previewArgs=message.params?.arguments||{};
      const ownerPreview=await verifiedOwnerPreview({session,student,admin,name,args:previewArgs});
      if(ownerPreview && name!=="get_my_falowen_revision_levels"){
        const result=name==="get_my_falowen_practice_guide"
          ? practiceGuideResponse(previewArgs.level,previewArgs.day,previewArgs.skill,previewArgs.mode||"study",previewArgs.language||"en")
          : lessonContentResponse(previewArgs.level,previewArgs.day,previewArgs.section||"overview");
        const preview={...result,developerTesting:true,practiceOnly:true,officialSubmission:false,recordedLevel:studentView(student).level,
          testingNotice:"Owner-only course preview; real enrollment and billing remain unchanged."};
        return res.json({jsonrpc:"2.0",id,result:{content:[{type:"text",text:JSON.stringify(preview)}],structuredContent:preview}});
      }
      if (REVISION_TOOLS.has(name)) {
        const result=await revisionTool({name,args:message.params?.arguments||{},student,admin,uid:session.uid,
          snapshot:GENERATED_COURSE_CONTENT,lessonContentResponse,swahiliLessonResponse,
          loadWeakness:async()=>{
            const level=studentView(student).level;
            if(!level||SELF_STUDY_LEVELS.has(level)||companionPrograms(student).length!==1)return revisionEvidence(student,[]);
            const code=normalize(student.data.studentCode||student.data.studentcode||student.id);
            return revisionEvidence(student,await getScoresForStudent(code));
          }});
        const response=ownerPreview&&name==="get_my_falowen_revision_levels"?{...result,available:true,developerTesting:previewInfo()}:result;
        return res.json({jsonrpc:"2.0",id,result:{content:[{type:"text",text:JSON.stringify(response)}],structuredContent:response}});
      }
      if (name === "save_my_falowen_practice_note") {
        if (!session.scope.split(/\s+/).includes(PRACTICE_WRITE_SCOPE)) {
          return res.json({ jsonrpc: "2.0", id, result: { isError: true,
            content: [{ type: "text", text: "This connection is read-only. Reconnect with explicit Falowen practice-write permission to save notes." }] } });
        }
        const args = message.params?.arguments || {};
        const note = typeof args.note === "string" ? args.note.trim() : "";
        if (!Number.isInteger(args.day) || args.day < 1 || args.day > 50 ||
            !VALID_SKILLS.has(args.skill) || !note || note.length > 1200 ||
            typeof args.requestId !== "string" || !/^[A-Za-z0-9_-]{8,80}$/.test(args.requestId)) {
          return res.json({ jsonrpc: "2.0", id, result: { isError: true,
            content: [{ type: "text", text: "Invalid practice note, skill, day, or request ID." }] } });
        }
        // Student-id-derived immutable record key; idempotent retries do not
        // create repeated writes, and another account cannot choose the owner.
        const ownerUid = session.uid;
        const key = sha256(ownerUid + ":" + args.requestId).slice(0, 40);
        const ref = admin.firestore().collection("chatgptStudentPracticeNotes").doc(key);
        const prior = await ref.get();
        if (!prior.exists) {
          await ref.create({
            ownerUid, studentId: student.id, day: args.day, skill: args.skill,
            note, source: "chatgpt_student_self_report", officialGrade: false,
            createdAt: new Date(), expireAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
          });
        }
        const saved = { saved: true, day: args.day, skill: args.skill,
          clarification: "Saved your optional practice note; no official exam, assignment result or tutor score was changed." };
        return res.json({ jsonrpc: "2.0", id, result: {
          content: [{ type: "text", text: JSON.stringify(saved) }], structuredContent: saved } });
      }
      if (name === "submit_my_falowen_assignment") {
        if (!session.scope.split(/\s+/).includes(ASSIGNMENT_WRITE_SCOPE)) {
          const denied = { submitted: false, error: "This Falowen connection is read-only for official assignments. Reconnect and explicitly approve the assignment-write permission; no work was submitted." };
          return res.json({ jsonrpc: "2.0", id, result: {
            isError: true, content: [{ type: "text", text: JSON.stringify(denied) }], structuredContent: denied,
          } });
        }
        const result = await submitA1Assignment({
          admin, student, uid: session.uid, email: session.email,
          args: message.params?.arguments || {},
        });
        return res.json({ jsonrpc: "2.0", id, result: {
          isError: !result.submitted, content: [{ type: "text", text: JSON.stringify(result) }], structuredContent: result,
        } });
      }
      if (name === "submit_my_falowen_workbook" || name === "get_my_falowen_submission_status") {
        if (name === "submit_my_falowen_workbook" && !session.scope.split(/\s+/).includes(ASSIGNMENT_WRITE_SCOPE)) {
          return res.json({jsonrpc:"2.0",id,result:{isError:true,content:[{type:"text",text:"Reconnect with explicit assignment-write permission. Nothing was submitted."}]}});
        }
        const params = {admin,student,uid:session.uid,email:session.email,
          args:message.params?.arguments || {},rules:GENERATED_COURSE_CONTENT?.officialWorkbookRules};
        const result = name === "submit_my_falowen_workbook"
          ? await submitExpandedWorkbook(params) : await workbookStatus(params);
        return res.json({jsonrpc:"2.0",id,result:{
          ...(name === "submit_my_falowen_workbook" ? {isError:!result.submitted} : {}),
          content:[{type:"text",text:JSON.stringify(result)}],structuredContent:result}});
      }
      const result = await callTool(name, message.params?.arguments || {}, student, admin);
      return res.json({ jsonrpc: "2.0", id, result: {
        content: [{ type: "text", text: JSON.stringify(result) }], structuredContent: result,
      } });
    } catch (error) {
      console.error("Falowen companion tool failed", error?.message || error);
      return res.json({ jsonrpc: "2.0", id, result: {
        isError: true, content: [{ type: "text", text: "Falowen could not retrieve this information right now. Please try again in Campus." }],
      } });
    }
  });

  router.get("/mcp", (_req, res) => res.status(405).set("Allow", "POST").end());
  router.delete("/mcp", (_req, res) => res.status(405).set("Allow", "POST").end());
  return router;
}

module.exports = {
  makeRouter, oauthParameters, safeStudentAccess, scoreRowsForStudent, summarizeStudentAssignments,
  lessonContentResponse, practiceGuideResponse, companionPrograms, swahiliLessonResponse, revisionEvidence,
  constants: { ISSUER, RESOURCE, SCOPE, PRACTICE_WRITE_SCOPE, ASSIGNMENT_WRITE_SCOPE, CLIENT_ID, CALLBACK },
};
