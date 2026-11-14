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
const { getExamPractice } = require("./chatgptExamPractice");

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
    guidance: "Use only the supplied learner-facing text for claims about Falowen's exact exercises. Do not claim to know answers or completion state.",
  };
  if (section === "overview") return {
    ...base, available: true,
    topic: content.topic, goal: content.goal, grammarFocus: content.grammarFocus,
    skillFocus: content.skillFocus, campusTabs: content.campusTabs,
    availableSections: VALID_LESSON_SECTIONS.size && [...VALID_LESSON_SECTIONS].filter((key) =>
      key === "overview" || Boolean(content[key])),
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
    speaking: "Present the original discussion prompt, let the learner answer in German, and coach coherence, grammar, vocabulary, pronunciation only when audio is actually available, and counterarguments.",
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
const ALLOWED_SCOPES = [SCOPE, PRACTICE_WRITE_SCOPE];
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
  if (!safeStudentAccess(data)) return null;
  return { id: snap.id, data };
}

function studentView(student) {
  const data = student.data;
  return {
    name: normalize(data.name || data.fullName || data.displayName) || "Student",
    level: normalizeLevel(data.level || data.course),
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
      },
      required: ["id"], additionalProperties: false,
    },
    _meta: { "openai/profile": true },
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
    name: "get_my_falowen_exam_practice",
    description: "Retrieve a safe single writing or speaking prompt from an approved published Falowen mock at my own course level. Not an official exam session or grade; other modules remain in Exams Room.",
    inputSchema: { type: "object", properties: {
      mockId: { type: "string", enum: ["a1-mock-02", "a1-mock-03", "a2-mock-02"] },
      skill: { type: "string", enum: ["writing", "speaking"] },
      part: { type: "string", maxLength: 24 },
    }, required: ["mockId", "skill"], additionalProperties: false },
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
      type: "object", properties: { day: { type: "integer", minimum: 1, maximum: 50, description: "Lesson day in the student's enrolled course." } },
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
    description: "Read learner-facing Course Book content for my enrolled level. C1 now has Falowen-authored passages and questions on all 28 days (not Goethe originals). B2/C2 rotating skill days are preserved. Choose exact day and section; do not expose hidden solutions or invent audio.",
    inputSchema: {
      type: "object",
      properties: {
        day: { type: "integer", minimum: 1, maximum: 50, description: "Course Book day" },
        section: {
          type: "string", enum: ["overview", "vocabulary", "grammar", "reading", "listening", "speaking", "writing", "review"],
          description: "Choose one section per call to keep results fast. Default overview.",
        },
      },
      required: ["day"], additionalProperties: false,
    },
  },
].map((tool) => ({
  ...tool, annotations: tool.annotations || { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
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
  const view = studentView(student);

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
  if (name === "get_my_falowen_exam_practice") {
    const isSwahili = ["swahili","kiswahili"].includes(
      normalize(student.data.program || student.data.languageProgram).toLowerCase());
    if (isSwahili) return { available: false, message: "Kiswahili exams are not yet exported to ChatGPT." };
    return getExamPractice(view.level, args?.mockId, args?.skill, args?.part);
  }
  if (name === "get_my_falowen_profile") return {
    id: "flw_" + sha256(student.id).slice(0, 32),
    name: view.name,
    nickname: view.level ? "Falowen " + view.level + " student" : "Falowen student",
  };
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
      title: normalize(entry?.topic || entry?.title || exported?.title).slice(0, 180),
      goal: normalize(entry?.goal || exported?.goal).slice(0, 600),
      grammarFocus: normalize(entry?.grammar_topic || entry?.grammarFocus || exported?.grammarFocus).slice(0, 200),
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
        serverInfo: { name: "Falowen Learning Companion", version: "1.2.0" },
        instructions: "Tutoring protocol: prefer get_my_falowen_practice_guide for one-question-at-a-time reading, Hören, speaking, writing or bilingual grammar practice. If a student is connected to an older plugin that exposes only get_my_falowen_lesson, use its featuredCourseBookSection and follow practiceSuggestion. C1 reading passages are new Falowen-authored practice, not official Goethe texts. Do not persist conversation practice scores or report them as Campus grades.  For exact exercises and passages, first call get_my_falowen_lesson_content with the correct day and section. Its returned learner-facing content is the source of truth; do not search external websites or add outside images when presenting an official Falowen exercise. If a section is unavailable, or only a reading task (not a passage) is supplied, say so rather than inventing a workbook passage. C2 uses a four-day skill rotation: Lesen is not available on every day. Restrict course material to the linked student level. Guide students without giving hidden answer keys, and direct all official tutor submissions to Falowen Campus. When a learner asks to prepare for their next live class, call get_my_falowen_class_preparation; when asking just for timetable, time, topic or Zoom details, call get_my_falowen_next_class. Never infer a class from course level, invent a session or expose another cohort's meeting details. Scores come from officially recorded results only; never disclose other students' records.",
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
  lessonContentResponse, practiceGuideResponse,
  constants: { ISSUER, RESOURCE, SCOPE, PRACTICE_WRITE_SCOPE, CLIENT_ID, CALLBACK },
};
