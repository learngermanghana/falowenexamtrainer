import { courseSchedules } from "../data/courseSchedule";

export const getDiscussionLessonId = ({ level, day, chapter, topic }) =>
  `${String(level || "").toUpperCase()}-${day}-${chapter || topic}`;

export const getDiscussionLesson = ({ level, day, chapter, topic }) => {
  const normalizedLevel = String(level || "").toUpperCase();
  const session = (courseSchedules[normalizedLevel] || []).find(
    (entry) => Number(entry.day) === Number(day) && (!chapter || entry.chapter === chapter)
  );
  const lesson = session || { day, chapter, topic };
  return {
    id: getDiscussionLessonId({ level: normalizedLevel, ...lesson }),
    label: `${normalizedLevel} · Tag ${lesson.day}: ${lesson.topic}`,
    level: normalizedLevel,
    ...lesson,
  };
};

export const getDiscussionLessonsForLevel = (level) =>
  (courseSchedules[String(level || "").toUpperCase()] || []).map((lesson) =>
    getDiscussionLesson({ level, ...lesson })
  );
