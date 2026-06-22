const ROUTE_ENTRIES = [
  [1, "0.1", "/campus/course/basic-greetings-goodbyes-and-how-you-are-day-1"],
  [2, "0.2", "/campus/course/german-alphabet-grammar-notes-day-2"],
  [2, "1.1", "/campus/course/singular-pronouns-verb-conjugation-day-2"],
  [3, "1.2", "/campus/course/a1-day-3-kapitel-1-2-grammar-notes"],
  [4, "2", "/campus/course/german-numbers-1-10-with-pronunciation"],
  [7, "3", "/campus/course/a1-day-7-asking-about-prices-and-preferences"],
  [8, "4", "/campus/course/forming-basic-statements-german-a1-day-8"],
  [9, "5", "/campus/course/a1-day-9-nominative-and-accusative-cases"],
  [10, "6", "/campus/course/objects-and-colors-chapter-6"],
  [11, "7", "/campus/course/the-12-hour-clock-system-in-german-chapter-7"],
  [12, "8", "/campus/course/a1-day-12-the-24-hour-clock-and-dates"],
  [16, "9", "/campus/course/food-and-negation-day-16-9-10"],
  [17, "11", "/campus/course/directions-imperative-11"],
  [18, "12.1", "/campus/course/two-case-prepositions-wechselpraepositionen-day-18"],
  [18, "12.2", "/campus/course/a1-12-2-dative-articles-mit-bei-zu"],
  [21, "13", "/campus/course/weather-perfekt-letter-13"],
  [22, "14.1", "/campus/course/health-and-body-parts-14-1"],
];

export const A1_GRAMMAR_ROUTE_ENTRIES = Object.freeze(
  ROUTE_ENTRIES.map(([day, chapter, route]) => Object.freeze({ day, chapter, route }))
);

const ROUTE_BY_CHAPTER = new Map(
  A1_GRAMMAR_ROUTE_ENTRIES.map((entry) => [`${Number(entry.day)}:${String(entry.chapter).trim()}`, entry.route])
);

const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

export const getA1GrammarRoute = ({ day, chapter } = {}) =>
  ROUTE_BY_CHAPTER.get(`${Number(day)}:${String(chapter || "").trim()}`) || "";

export const applyA1GrammarRouteToLesson = (lesson, day = lesson?.day) => {
  if (!lesson || typeof lesson !== "object") return lesson;
  const resolvedDay = Number(day ?? lesson.day ?? lesson.assignmentDay);
  const rootRoute = getA1GrammarRoute({ day: resolvedDay, chapter: lesson.chapter });
  if (rootRoute) {
    lesson.grammarbook_link = rootRoute;
    lesson.grammar_link = rootRoute;
    lesson.grammarPage = rootRoute;
  }

  [...toArray(lesson.lesen_hören), ...toArray(lesson.schreiben_sprechen)].forEach((resource) => {
    if (!resource || typeof resource !== "object") return;
    const route = getA1GrammarRoute({ day: resolvedDay, chapter: resource.chapter || lesson.chapter });
    if (!route) return;
    resource.grammarbook_link = route;
    resource.grammar_link = route;
    resource.grammarPage = route;
  });

  return lesson;
};
