import {
  buildA1CanonicalChapterLessonRoute,
  buildA1ShortChapterLessonRoute,
  normalizeA1Chapter,
} from "./a1CanonicalLessonRoutes";

/**
 * Canonical ownership information for every tutor-marked A1 workbook.
 * Section labels are transcribed from the rendered workbook components and are
 * deliberately not inferred from a day or chapter number.
 */
export const A1_ASSIGNMENT_ORDER = Object.freeze([
  "A1-0.1", "A1-0.2", "A1-1.1", "A1-1.2", "A1-2", "A1-3", "A1-4",
  "A1-5", "A1-6", "A1-7", "A1-8", "A1-9", "A1-10", "A1-11",
  "A1-12.1", "A1-12.2", "A1-12.3", "A1-13", "A1-14.1",
]);

const section = (number, label) => Object.freeze({ key: `teil-${number}`, number, label });

const NATIVE_SHARED_LAYOUT_COMPONENTS = new Set([
  "A1Day1GreetingsWorkbookPage",
  "A1Day3GermanAlphabetReviewingWorkbookPage",
  "A1Day2Kapitel11WorkbookPage",
  "A1Day3PronounsIntroducingYourselfWorkbookPage",
  "A1Day8CountriesAndLanguagesWorkbookPage",
  "A1Day10ObjectsColorsPossessiveArticlesWorkbookPage",
  "A1Day11UnderstandingTimeWorkbookPage",
  "A1Day12TwentyFourHourClockAndDatesWorkbookPage",
  "A1Day16FoodAndDailyLifeWorkbookPage",
  "A1Day20LetterWritingWorkbookPage",
  "A1Day21WeatherWorkbookPage",
]);

const records = [
  ["A1-0.1", 1, "0.1", "Greetings and Asking About Well-being", "/campus/course/a1-day-1-greetings-workbook", "A1Day1GreetingsWorkbookPage", ["Teil 1 · Reading Text", "Teil 2 · Multiple-Choice Questions"]],
  ["A1-0.2", 2, "0.2", "German Alphabet", "/campus/course/a1-day-2-german-alphabet-reviewing-workbook", "A1Day3GermanAlphabetReviewingWorkbookPage", ["Teil 1 · Reading and Writing", "Teil 2 · Questions", "Teil 3 · Hören"]],
  ["A1-1.1", 2, "1.1", "Personal Pronouns and Verb Conjugation", "/campus/course/a1-day-2-kapitel-1-1-workbook", "A1Day2Kapitel11WorkbookPage", ["Teil 1 · Hören", "Teil 2 · Schreiben"]],
  ["A1-1.2", 3, "1.2", "Introducing Yourself", "/campus/course/a1-day-3-pronouns-introducing-yourself-workbook", "A1Day3PronounsIntroducingYourselfWorkbookPage", ["Teil 1 · Lesen", "Teil 2 · Schreiben (Exercise)", "Teil 3 · Hören"]],
  ["A1-2", 4, "2", "Numbers", "/campus/course/a1-day-4-numbers-for-beginners-workbook", "A1Day4NumbersForBeginnersWorkbookPage", ["Teil 1: Reading / Writing", "Teil 2: Questions"]],
  ["A1-3", 7, "3", "Asking About Prices", "/campus/course/a1-chapter-3-asking-about-prices-workbook", "A1Chapter3AskingAboutPricesWorkbookPage", ["Teil 1: Preise und Kosten (Exercise 1)", "Teil 2: Writing About Family (Exercise 2)", "Teil 3: Hobbys (Exercise 3)"]],
  ["A1-4", 8, "4", "Countries and Languages", "/campus/course/a1-day-8-countries-and-languages-workbook", "A1Day8CountriesAndLanguagesWorkbookPage", ["Teil 1 · Countries and Languages Part 1: Translation", "Teil 2 · Essay: Germany's Neighbors", "Teil 3 · Germany's Neighbors (Hören)"]],
  ["A1-5", 9, "5", "German Cases", "/campus/course/a1-chapter-5-german-cases-workbook", "A1Chapter5GermanCasesWorkbookPage", ["Teil 1: Vocabulary Review", "Teil 2: Nominative Case", "Teil 3: Accusative Case"]],
  ["A1-6", 10, "6", "Objects and Colors", "/campus/course/a1-day-10-objects-colors-possessive-articles-workbook", "A1Day10ObjectsColorsPossessiveArticlesWorkbookPage", ["Teil 1: Reading / Writing", "Teil 2: Questions", "Teil 3: Hören"]],
  ["A1-7", 11, "7", "Understanding Time", "/campus/course/a1-day-11-understanding-time-workbook", "A1Day11UnderstandingTimeWorkbookPage", ["Teil 1 (Lesen): 12-Hour Clock, Prepositions of Time, Days of the Week", "Teil 2 (Hören): Listening Questions"]],
  ["A1-8", 12, "8", "24 Hour Clock", "/campus/course/a1-day-12-24-hour-clock-and-dates-workbook", "A1Day12TwentyFourHourClockAndDatesWorkbookPage", ["Teil 1: Lesen · Multiple Choice", "Teil 2: Lesen · Richtig oder Falsch", "Teil 3: Hörverstehen", "Teil 4: Vocabulary reminder"]],
  ["A1-9", 16, "9", "Negation", "/campus/course/a1-day-16-food-and-negation-food-and-daily-life-workbook", "A1Day16FoodAndDailyLifeWorkbookPage", ["Teil 1 · Lesen", "Teil 2 · Fragen zum Lesen", "Teil 3 · Hörverstehen", "Teil 4 · Schreiben"]],
  ["A1-10", 16, "10", "Food", "/campus/course/a1-day-16-food-and-negation-kapitel-10-workbook", "A1Day16FoodAndNegationKapitel10WorkbookPage", ["Teil 1 · Lesen / Schreiben", "Teil 2 · Hören"]],
  ["A1-11", 17, "11", "Instructions", "/campus/course/a1-day-17-instructions-and-directions-kapitel-11-workbook", "A1Day17InstructionsDirectionsKapitel11WorkbookPage", ["Teil 1 · Lesen Essay: Wegbeschreibungen", "Teil 2 · Lesen Essay: Wegbeschreibungen", "Teil 3 · Schreiben Assignment"]],
  ["A1-12.1", 18, "12.1", "Two Case Prepositions", "/campus/course/two-case-prepositions-wechselpraepositionen-day-18?view=workbook", "A1Day18Kapitel121WorkbookPage", ["Teil 1 · Lesen Sie den Aufsatz und wählen Sie die richtige Antwort", "Teil 2 · Lesen Sie die Anzeigen und beantworten Sie die Fragen", "Teil 3 · Hören"]],
  ["A1-12.2", 18, "12.2", "Dative Prepositions", "/campus/course/a1-12-2-dative-articles-mit-bei-zu?view=workbook", "A1Day18Kapitel122WorkbookPage", ["Teil 1 · Lesen Sie den Aufsatz und schreiben Sie die richtige Antwort", "Teil 2 · Lesen Sie die Anzeigen und beantworten Sie die Fragen", "Teil 3 · Hören"]],
  ["A1-12.3", 20, "12.3", "Introduction to Letter Writing", "/campus/course/letter-writing-intro-german-a1-day-12-3", "A1Day20LetterWritingWorkbookPage", ["Teil 1 · Informal letter: Birthday message", "Teil 2 · Formal letter: Enquiry to a language school"]],
  ["A1-13", 21, "13", "Weather", "/campus/course/a1-day-21-weather-workbook", "A1Day21WeatherWorkbookPage", ["Teil 1 · Anzeigen", "Teil 2 · Nachricht", "Teil 3 · Schreiben"]],
  ["A1-14.1", 22, "14.1", "Health", "/campus/course/a1-day-22-health-and-body-parts-workbook", "A1Day22HealthBodyPartsWorkbookPage", ["Teil 1 · Lesen: Anzeigen und Termine", "Teil 2 · Schreiben: E-Mail an Felix", "Teil 3 · Wortschatz: Translate into German"]],
];

const parseRoute = (route) => {
  const parsed = new URL(route, "https://www.falowen.app");
  return { workbookPath: parsed.pathname.replace(/\/+$/, "") || "/", workbookSearch: parsed.search };
};

export const A1_ASSIGNMENT_REGISTRY = Object.freeze(Object.fromEntries(records.map(
  ([assignmentKey, day, chapter, title, workbookRoute, component, labels]) => {
    const routeParts = parseRoute(workbookRoute);
    return [assignmentKey, Object.freeze({
      assignmentKey,
      level: "A1",
      day,
      chapter,
      title,
      lessonRoute: buildA1CanonicalChapterLessonRoute(chapter),
      shortLessonRoute: buildA1ShortChapterLessonRoute(chapter),
      legacyLessonRoute: `/campus/course/lesson/A1/${day}?chapter=${chapter}`,
      workbookRoute,
      ...routeParts,
      component,
      layoutMode: NATIVE_SHARED_LAYOUT_COMPONENTS.has(component) ? "native" : "bridge",
      sections: Object.freeze(labels.map((label, index) => section(index + 1, label))),
      submissionEnabled: true,
    })];
  }
)));

export const getA1Assignment = (assignmentKey) => A1_ASSIGNMENT_REGISTRY[assignmentKey] || null;

export const getA1AssignmentByChapter = (chapter = "") => {
  const normalizedChapter = normalizeA1Chapter(chapter);
  if (!normalizedChapter) return null;
  return Object.values(A1_ASSIGNMENT_REGISTRY).find(
    (entry) => normalizeA1Chapter(entry.chapter) === normalizedChapter,
  ) || null;
};

export const getA1AssignmentByRoute = (pathname, search = "") => {
  const normalizedPath = String(pathname || "").replace(/\/+$/, "") || "/";
  const actualSearch = new URLSearchParams(search || "");
  return Object.values(A1_ASSIGNMENT_REGISTRY).find((entry) => {
    if (entry.workbookPath !== normalizedPath) return false;
    const requiredSearch = new URLSearchParams(entry.workbookSearch || "");
    return Array.from(requiredSearch.entries()).every(([key, value]) => actualSearch.get(key) === value);
  }) || null;
};

export const getA1AssignmentNeighbors = (assignmentKey) => {
  const index = A1_ASSIGNMENT_ORDER.indexOf(assignmentKey);
  return {
    previous: index > 0 ? A1_ASSIGNMENT_REGISTRY[A1_ASSIGNMENT_ORDER[index - 1]] : null,
    next: index >= 0 && index < A1_ASSIGNMENT_ORDER.length - 1
      ? A1_ASSIGNMENT_REGISTRY[A1_ASSIGNMENT_ORDER[index + 1]]
      : null,
  };
};

export const __TESTING__ = { NATIVE_SHARED_LAYOUT_COMPONENTS, parseRoute };
