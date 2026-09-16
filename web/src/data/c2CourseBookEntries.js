import { C2_LESSON_CONTENT_ALIGNMENT } from "./c2LessonContentAlignment.js";

const C2_COURSE_BOOK_ENTRIES = Object.freeze(
  Object.entries(C2_LESSON_CONTENT_ALIGNMENT)
    .sort(([leftDay], [rightDay]) => Number(leftDay) - Number(rightDay))
    .map(([dayKey, lesson]) => {
      const day = Number(dayKey);

      return Object.freeze({
        level: "C2",
        day,
        assignmentDay: day,
        chapter: lesson.chapter,
        title: lesson.title,
        topic: lesson.title,
        lessonTitle: lesson.title,
        assignmentTitle: lesson.title,
        lessonTopic: lesson.topic,
        grammar_topic: lesson.grammarFocus,
        grammarFocus: lesson.grammarFocus,
        goal: Array.isArray(lesson.objectives) ? lesson.objectives.join(" · ") : lesson.topic,
        instruction: "Work through the C2 mastery lesson, study the matched collocations and grammar notes, then complete the writing task and compare your work with the model.",
        assignment: false,
        submissionRequired: false,
        progressionEligible: true,
        assignmentId: `C2-${lesson.chapter}`,
        assignment_id: `C2-${lesson.chapter}`,
        c2Mastery: lesson,
        collocations: lesson.collocations,
        grammarNotes: lesson.grammarNotes,
        grammarChecks: lesson.grammarChecks,
        writingExercise: lesson.writingExercise,
      });
    }),
);

const mergeCanonicalC2CourseBookEntries = (entries = []) => {
  const source = Array.isArray(entries) ? entries : [];
  const nonC2 = source.filter((entry) => String(entry?.level || "").toUpperCase() !== "C2");
  const existingC2ByDay = new Map(
    source
      .filter((entry) => String(entry?.level || "").toUpperCase() === "C2")
      .map((entry) => [Number(entry.day ?? entry.assignmentDay), entry]),
  );

  const c2 = C2_COURSE_BOOK_ENTRIES.map((canonical) => ({
    ...(existingC2ByDay.get(Number(canonical.day)) || {}),
    ...canonical,
  }));

  return [...nonC2, ...c2];
};

export { C2_COURSE_BOOK_ENTRIES, mergeCanonicalC2CourseBookEntries };
