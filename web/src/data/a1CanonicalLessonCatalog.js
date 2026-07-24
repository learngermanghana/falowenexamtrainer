import { A1_ASSIGNMENT_REGISTRY } from "./a1AssignmentRegistry";
import {
  buildA1CanonicalChapterLessonRoute,
  buildA1ShortChapterLessonRoute,
  normalizeA1Chapter,
} from "./a1CanonicalLessonRoutes";

const practice = ({ routeKey, chapter, day, title, destination, aliases = [] }) => ({
  routeKey: normalizeA1Chapter(routeKey || chapter),
  chapter: normalizeA1Chapter(chapter),
  day,
  title,
  destination,
  aliases: aliases.map(normalizeA1Chapter),
  assignmentKey: null,
  kind: "practice",
});

const ASSIGNMENT_LESSONS = Object.values(A1_ASSIGNMENT_REGISTRY).map((assignment) => ({
  routeKey: normalizeA1Chapter(assignment.chapter),
  chapter: normalizeA1Chapter(assignment.chapter),
  day: assignment.day,
  title: assignment.title,
  destination: assignment.workbookRoute,
  aliases: [normalizeA1Chapter(assignment.assignmentKey)],
  assignmentKey: assignment.assignmentKey,
  kind: "assignment",
}));

const PRACTICE_LESSONS = [
  practice({
    routeKey: "1.1-practice",
    chapter: "1.1",
    day: 3,
    title: "Personal Information, Articles, Adjectives and W-Questions",
    destination: "/campus/course/a1-day-3-schreiben-sprechen-kapitel-1-1-workbook",
    aliases: ["A1-1.1-PRACTICE"],
  }),
  practice({
    routeKey: "1.2-practice",
    chapter: "1.2",
    day: 3,
    title: "Present-Tense Verb Conjugation Practice",
    destination: "/campus/course/a1-day-3-kapitel-1-2-workbook",
    aliases: ["A1-1.2-PRACTICE"],
  }),
  practice({
    chapter: "1.3",
    day: 5,
    title: "Self-Introduction Practice with Articles",
    destination: "/campus/course/a1-day-5-introducing-yourself-and-articles-workbook",
  }),
  practice({
    chapter: "2.3",
    day: 6,
    title: "Family and Hobbies",
    destination: "/campus/course/a1-day-6-family-and-hobbies-workbook",
  }),
  practice({
    chapter: "3.5",
    day: 13,
    title: "Revision: Numbers, Time and Prices",
    destination: "/campus/course/a1-day-13-revision-numbers-time-and-prices-workbook",
  }),
  practice({
    chapter: "3.6",
    day: 14,
    title: "Modal Verbs",
    destination: "/campus/course/modal-verbs-day-14-3-6",
  }),
  practice({
    chapter: "4.7",
    day: 15,
    title: "Speaking Exams Introduction",
    destination: "/campus/course/speaking-exams-intro-4-7",
  }),
  practice({
    chapter: "5.9",
    day: 19,
    title: "Verboten und erlaubt",
    destination: "/campus/course/verboten-erlaubt-5-9",
  }),
  practice({
    chapter: "14.2",
    day: 23,
    title: "Dative and Accusative Verbs",
    destination: "/campus/course/dative-and-accusative-verbs-14-2",
  }),
  practice({
    chapter: "5.10",
    day: 24,
    title: "Conjunctions",
    destination: "/campus/course/conjunctions-5-10",
  }),
];

const legacyPracticeIdentity = (lesson) => {
  if (lesson.kind !== "practice" || !String(lesson.routeKey || "").endsWith("-practice")) {
    return lesson.chapter;
  }
  return `${lesson.chapter}-PRACTICE`;
};

export const A1_CANONICAL_LESSON_CATALOG = Object.freeze(
  [...ASSIGNMENT_LESSONS, ...PRACTICE_LESSONS].map((lesson) => Object.freeze({
    ...lesson,
    lessonRoute: buildA1CanonicalChapterLessonRoute(lesson.routeKey),
    shortLessonRoute: buildA1ShortChapterLessonRoute(lesson.routeKey),
    legacyLessonRoute: `/campus/course/lesson/A1/${lesson.day}?chapter=${encodeURIComponent(
      legacyPracticeIdentity(lesson),
    )}`,
  })),
);

const lookupTokens = (lesson) => new Set([
  lesson.routeKey,
  lesson.chapter,
  lesson.assignmentKey ? normalizeA1Chapter(lesson.assignmentKey) : "",
  ...(lesson.aliases || []),
].filter(Boolean));

export const getA1CanonicalLesson = (identity = "") => {
  const normalized = normalizeA1Chapter(identity);
  if (!normalized) return null;

  const exactRouteKey = A1_CANONICAL_LESSON_CATALOG.find(
    (lesson) => lesson.routeKey === normalized,
  );
  if (exactRouteKey) return exactRouteKey;

  const matches = A1_CANONICAL_LESSON_CATALOG.filter((lesson) =>
    lookupTokens(lesson).has(normalized),
  );
  return matches.length === 1 ? matches[0] : null;
};

export const getA1CanonicalLessonForLegacyRoute = ({ day, identity } = {}) => {
  const normalized = normalizeA1Chapter(identity);
  const numericDay = Number(day);
  if (!normalized || !Number.isInteger(numericDay)) return null;

  const lessonsForDay = A1_CANONICAL_LESSON_CATALOG.filter(
    (lesson) => Number(lesson.day) === numericDay,
  );
  const exactRouteKey = lessonsForDay.find((lesson) => lesson.routeKey === normalized);
  if (exactRouteKey) return exactRouteKey;

  const dayMatches = lessonsForDay.filter((lesson) => lookupTokens(lesson).has(normalized));
  return dayMatches.length === 1 ? dayMatches[0] : null;
};

export const getA1CanonicalLessonsForChapter = (chapter = "") => {
  const normalized = normalizeA1Chapter(chapter);
  return A1_CANONICAL_LESSON_CATALOG.filter((lesson) => lesson.chapter === normalized);
};

export const __TESTING__ = {
  ASSIGNMENT_LESSONS,
  PRACTICE_LESSONS,
  legacyPracticeIdentity,
  lookupTokens,
};
