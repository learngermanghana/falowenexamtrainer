"use strict";

/**
 * No second Firestore read: this composes the authenticated class timetable
 * with the already-build-time-exported student-facing course content.
 * It never writes assignments or invents an unrecorded class topic/lesson.
 */
const text = (value, max = 500) => String(value ?? "").trim().slice(0, max);
const plainQuestion = (item) => ({
  question: text(item?.question, 400),
  options: (Array.isArray(item?.options) ? item.options : []).slice(0, 5).map((x) => text(x, 220)),
});
const short = (items, limit = 3) => (Array.isArray(items) ? items : [])
  .filter((x) => x && text(x.question)).slice(0, limit).map(plainQuestion);

function prepareFromTimetable({ timetable, level, courseContent }) {
  const base = {
    level, className: timetable.className || null, timezone: timetable.timezone || "Africa/Accra",
    status: timetable.status, campusUrl: timetable.campusUrl,
    purpose: "Guided preparation for my recorded next live class, not official graded assessment.",
  };
  if (timetable.status !== "upcoming_session" || !timetable.nextSession) {
    return {
      ...base, nextSession: null, exactLessonAvailable: false,
      clarification: timetable.clarification || "No verified upcoming live class is available.",
      suggestedNextAction: "Open Falowen Campus to check your assigned class or ask Admin to verify the schedule.",
    };
  }

  const session = timetable.nextSession;
  const verifiedDay = ["explicit_session_day", "assignment_identity"].includes(session.lessonDaySource);
  const day = verifiedDay && Number.isInteger(session.lessonDay) ? session.lessonDay : null;
  const content = day ? courseContent(level, day) : null;
  const baseResponse = {
    ...base,
    classAssigned: true,
    nextSession: {
      startsAt: session.startsAt,
      localStart: session.localStart,
      timezone: session.timezone,
      topic: session.topic,
      topicConfirmed: session.topicConfirmed === true,
      lessonDay: day,
      lessonUrl: day ? session.lessonUrl : null,
    },
    zoomUrl: timetable.zoomUrl || null,
    exactLessonAvailable: Boolean(content),
    lessonMapping: content ? "verified_session_day" : "not_verified",
    preparationMinutes: 10,
    clarification: !day
      ? "The class session has no explicit verified course day. Its saved topic is genuine, but do not assign a workbook day or quote exact lesson exercises."
      : !content
        ? "The class topic and day are confirmed, but detailed teaching material was not exported for this level/day. Use Campus and do not invent exercises."
        : "Prepared from Falowen's stored class topic and learner-facing Course Book text. Tutor-marked submissions remain in Campus.",
  };
  if (!content) return {
    ...baseResponse,
    studyPlan: session.topicConfirmed
      ? [
        "Read the next class topic recorded in the timetable.",
        "Open Falowen Campus to study the related course notes.",
        "Ask ChatGPT for two original warm-up questions, clearly labelled as extra practice.",
      ]
      : ["Check the timetable in Campus; no confirmed class topic is recorded."],
    practiceQuestions: [],
  };

  const questions = short(content.reading?.questions, 2);
  const grammarFocus = text(content.grammarFocus || content.grammar?.focus, 250);
  const chapters = (content.workbook?.chapters || []).slice(0, 4).map((chapter) => ({
    title: text(chapter.title, 200),
    chapter: text(chapter.chapter, 25),
    sections: (chapter.sections || []).slice(0, 7).map((v) => text(v, 100)),
    route: text(chapter.route, 450),
  }));
  const reading = content.reading ? {
    title: text(content.reading.title, 250),
    sampleText: text(content.reading.text || content.reading.paragraphs?.[0], 950),
    fullReadingAvailableVia: "get_my_falowen_lesson_content",
    sampleQuestions: questions,
  } : null;
  const vocabulary = (Array.isArray(content.vocabulary) ? content.vocabulary : []).slice(0, 5)
    .map((term) => ({
      expression: text(term.expression, 180), meaning: text(term.meaning, 180),
    }));
  const grammar = {
    focus: grammarFocus || null,
    notesUrl: text(content.grammar?.notesUrl || content.grammar?.noteLinks?.[0]?.url, 420) || null,
    fullExplanationIncluded: content.grammar?.fullExplanationIncluded !== false
      && Boolean(content.grammar?.sections?.length),
    teaching: (content.grammar?.sections || []).slice(0, 3).map((section) => ({
      title: text(section.title, 180),
      explanation: text(section.explanation, 950),
    })),
  };

  const plan = [
    "Review the confirmed class topic and goal.",
    grammar.focus
      ? "Review the recorded grammar focus and the original Falowen grammar notes."
      : "Open the actual lesson in Campus to review its grammar guidance.",
    vocabulary.length ? "Practise the source vocabulary and write your own sentences."
      : "Review the vocabulary in Campus; none is included in this tool response.",
    reading ? "Read the original text and attempt its comprehension questions without the answer key."
      : chapters.length ? "Open the relevant workbook chapters and read their listed sections."
        : "Review the assigned course material in Campus.",
    "Answer one question at a time in German; ask for corrections, then submit any official work in Campus.",
  ];
  return {
    ...baseResponse,
    lesson: {
      day, title: text(content.title, 240), goal: text(content.goal, 500),
      grammar, workbookChapters: chapters, reading, vocabulary,
      listening: content.listening ? {
        task: text(content.listening.task || content.listening.title, 500),
        audioAvailableInCampus: content.listening.audioAvailableInCampus === true,
        questions: short(content.listening.questions, 1),
      } : null,
      writing: content.writing ? {
        instructions: (content.writing.instructions || []).slice(0, 3).map((v) => text(v, 350)),
        prompt: text(content.writing.prompt, 350) || null,
        requiresCampusSubmission: level === "A1" || level === "A2" || level === "B1",
      } : null,
      contentTool: "get_my_falowen_lesson_content",
      lessonUrl: session.lessonUrl,
    },
    studyPlan: plan,
    practiceQuestions: questions,
    chatInstructions: "Guide this student interactively, one practice question at a time. The supplied questions are original Falowen exercises, not invented. Do not show answer keys, offer unverified completion claims, or submit official assignments. Offer original extra questions only if clearly labelled additional practice.",
  };
}
module.exports = { prepareFromTimetable };
