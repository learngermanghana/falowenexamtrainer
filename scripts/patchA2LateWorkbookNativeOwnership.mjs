import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

await import("./patchA2Day22NativeWorkbook.mjs");

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const guidancePath = path.join(root, "web/src/components/A2B1WorkbookGuidance.js");
const legacyWrapperPath = path.join(root, "web/src/components/A2LegacyStandardWorkbookNavigation.js");
const inlineEnhancementsPath = path.join(root, "web/src/components/WorkbookInlineEnhancements.jsx");
const courseTabPath = path.join(root, "web/src/components/CourseTab.js");

let guidance = fs.readFileSync(guidancePath, "utf8");
let legacyWrapper = fs.readFileSync(legacyWrapperPath, "utf8");
let inlineEnhancements = fs.readFileSync(inlineEnhancementsPath, "utf8");
let courseTab = fs.readFileSync(courseTabPath, "utf8");

const workbookDayBlock = `  const workbookDay = useMemo(() => {
    if (typeof window === "undefined") return null;
    return resolveA2B1WorkbookDayFromLocation(
      workbookLevel,
      \`${"${window.location.pathname || \"\"}"}${"${window.location.search || \"\"}"}\`,
    );
  }, [workbookLevel]);`;
const nativeOwnershipBlock = `${workbookDayBlock}
  const usesNativeLateWorkbook =
    workbookLevel === "A2" && [22, 23, 24, 25, 26, 27, 28].includes(Number(workbookDay));`;

if (!guidance.includes("const usesNativeLateWorkbook =")) {
  const universalComponentIndex = guidance.indexOf("const UniversalA2WorkbookTabs =");
  if (universalComponentIndex < 0) throw new Error("Could not find UniversalA2WorkbookTabs.");
  const workbookDayIndex = guidance.indexOf(workbookDayBlock, universalComponentIndex);
  if (workbookDayIndex < 0) throw new Error("Could not find Universal A2 workbook day resolver.");
  guidance = `${guidance.slice(0, workbookDayIndex)}${nativeOwnershipBlock}${guidance.slice(workbookDayIndex + workbookDayBlock.length)}`;
}

guidance = guidance.replace(
  '[23, 24, 25, 26, 27, 28].includes(Number(workbookDay))',
  '[22, 23, 24, 25, 26, 27, 28].includes(Number(workbookDay))',
);

const workbookLevelGuard = `    if (workbookLevel !== "A2") {
      setShowFallbackTabs(false);
      return undefined;
    }`;
const nativeWorkbookGuard = `${workbookLevelGuard}

    if (usesNativeLateWorkbook) {
      setShowFallbackTabs(false);
      return undefined;
    }`;
if (!guidance.includes("if (usesNativeLateWorkbook)")) {
  const universalComponentIndex = guidance.indexOf("const UniversalA2WorkbookTabs =");
  const guardIndex = guidance.indexOf(workbookLevelGuard, universalComponentIndex);
  if (guardIndex < 0) throw new Error("Could not find Universal A2 workbook fallback guard.");
  guidance = `${guidance.slice(0, guardIndex)}${nativeWorkbookGuard}${guidance.slice(guardIndex + workbookLevelGuard.length)}`;
}

guidance = guidance.replace(
  "  }, [workbookLevel]);\n\n  if (workbookLevel !== \"A2\" || !showFallbackTabs) return null;",
  "  }, [workbookLevel, usesNativeLateWorkbook]);\n\n  if (workbookLevel !== \"A2\" || usesNativeLateWorkbook || !showFallbackTabs) return null;",
);

const currentLegacyPaths = `export const A2_LEGACY_STANDARD_NAV_PATHS = new Set([
  A2_DAY20_PATH,
  ...A2_DAYS_22_TO_26_PATHS,
]);`;
const previousLateOnlyPaths = `export const A2_LEGACY_STANDARD_NAV_PATHS = new Set([
  A2_DAY20_PATH,
]);`;
const retiredNativePaths = "export const A2_LEGACY_STANDARD_NAV_PATHS = new Set([]);";
for (const oldBlock of [currentLegacyPaths, previousLateOnlyPaths]) {
  if (legacyWrapper.includes(oldBlock)) legacyWrapper = legacyWrapper.replace(oldBlock, retiredNativePaths);
}

const cleanupDeclaration = `  const shouldCleanPresentation =
    A2_GOETHE_LISTENING_ONLY_PATHS.has(normalizedPath) ||
    A2_LEGACY_SUBMISSION_CLEANUP_PATHS.has(normalizedPath);`;
const previousCleanupDeclaration = `  const usesNativeLateWorkbook = /\\/a2-day-(?:22|23|24|25|26|27|28)-/.test(normalizedPath);
  const shouldCleanPresentation =
    !usesNativeLateWorkbook &&
    (A2_GOETHE_LISTENING_ONLY_PATHS.has(normalizedPath) ||
      A2_LEGACY_SUBMISSION_CLEANUP_PATHS.has(normalizedPath));`;
const cleanedWorkbookDeclaration = `  const usesCleanStandardWorkbook = /\\/a2-day-(?:20|21|22|23|24|25|26|27|28)-/.test(normalizedPath);
  const shouldCleanPresentation =
    !usesCleanStandardWorkbook &&
    (A2_GOETHE_LISTENING_ONLY_PATHS.has(normalizedPath) ||
      A2_LEGACY_SUBMISSION_CLEANUP_PATHS.has(normalizedPath));`;
if (legacyWrapper.includes(cleanupDeclaration)) {
  legacyWrapper = legacyWrapper.replace(cleanupDeclaration, cleanedWorkbookDeclaration);
} else if (legacyWrapper.includes(previousCleanupDeclaration)) {
  legacyWrapper = legacyWrapper.replace(previousCleanupDeclaration, cleanedWorkbookDeclaration);
}

const panelImport = 'import A2LateWorkbookSubmissionPanel from "./A2LateWorkbookSubmissionPanel";\n';
inlineEnhancements = inlineEnhancements.replace(panelImport, "");
inlineEnhancements = inlineEnhancements.replace(
  '      <A2LateWorkbookSubmissionPanel pathname={activePathname} />\n',
  "",
);

const a1SectionResolver = `const getA1CourseBookSection = (entry) => {
  const day = Number(entry.displayDay ?? entry.day);
  return A1_COURSE_BOOK_SECTIONS.find(({ firstDay, lastDay }) => day >= firstDay && day <= lastDay);
};`;
const a2SectionDefinitions = `${a1SectionResolver}

// Presentation sections within A2. Assignment identities, media, scoring and enrollment remain A2.
const A2_COURSE_BOOK_SECTIONS = [
  { key: "a2-1", title: "A2.1 – Building Independence", days: "Days 1–14", firstDay: 1, lastDay: 14 },
  { key: "a2-2", title: "A2.2 – Independent Communication", days: "Days 15–28", firstDay: 15, lastDay: 28 },
];

const getA2CourseBookSection = (entry) => {
  const day = Number(entry.displayDay ?? entry.day);
  return A2_COURSE_BOOK_SECTIONS.find(({ firstDay, lastDay }) => day >= firstDay && day <= lastDay);
};`;
if (!courseTab.includes("A2_COURSE_BOOK_SECTIONS")) {
  if (!courseTab.includes(a1SectionResolver)) throw new Error("Could not find A1 Course Book section resolver.");
  courseTab = courseTab.replace(a1SectionResolver, a2SectionDefinitions);
}

const levelFlagsBefore = `  const normalizedSelectedCourseLevel = String(selectedCourseLevel || "").toUpperCase();
  const isA1CourseBook = normalizedSelectedCourseLevel === "A1";
  const usesSharedA2B1Design = normalizedSelectedCourseLevel === "A2" || normalizedSelectedCourseLevel === "B1";`;
const levelFlagsAfter = `  const normalizedSelectedCourseLevel = String(selectedCourseLevel || "").toUpperCase();
  const isA1CourseBook = normalizedSelectedCourseLevel === "A1";
  const isA2CourseBook = normalizedSelectedCourseLevel === "A2";
  const usesSharedA2B1Design = normalizedSelectedCourseLevel === "A2" || normalizedSelectedCourseLevel === "B1";`;
if (!courseTab.includes("const isA2CourseBook =")) {
  if (!courseTab.includes(levelFlagsBefore)) throw new Error("Could not find Course Book level flags.");
  courseTab = courseTab.replace(levelFlagsBefore, levelFlagsAfter);
}

const groupingBefore = `  const groupedLessons = useMemo(() => {
    if (!isA1CourseBook) return groupLessonsByWeek(visibleLessons);
    return visibleLessons.reduce((groups, entry) => {
      const section = getA1CourseBookSection(entry);
      const key = section?.key || "Course completion";
      if (!groups[key]) groups[key] = [];
      groups[key].push(entry);
      return groups;
    }, {});
  }, [isA1CourseBook, visibleLessons]);
  const weekEntries = Object.entries(groupedLessons).map(([label, lessons]) => [
    label,
    lessons,
    isA1CourseBook ? A1_COURSE_BOOK_SECTIONS.find(({ key }) => key === label) : null,
  ]);`;
const groupingAfter = `  const groupedLessons = useMemo(() => {
    if (!isA1CourseBook && !isA2CourseBook) return groupLessonsByWeek(visibleLessons);
    return visibleLessons.reduce((groups, entry) => {
      const section = isA1CourseBook ? getA1CourseBookSection(entry) : getA2CourseBookSection(entry);
      const key = section?.key || "Course completion";
      if (!groups[key]) groups[key] = [];
      groups[key].push(entry);
      return groups;
    }, {});
  }, [isA1CourseBook, isA2CourseBook, visibleLessons]);
  const weekEntries = Object.entries(groupedLessons).map(([label, lessons]) => [
    label,
    lessons,
    isA1CourseBook
      ? A1_COURSE_BOOK_SECTIONS.find(({ key }) => key === label)
      : isA2CourseBook
        ? A2_COURSE_BOOK_SECTIONS.find(({ key }) => key === label)
        : null,
  ]);`;
if (!courseTab.includes("getA2CourseBookSection(entry)")) {
  if (!courseTab.includes(groupingBefore)) throw new Error("Could not find Course Book grouping block.");
  courseTab = courseTab.replace(groupingBefore, groupingAfter);
}

const a1Intro = `                  {section?.key === "a1-2" && lessons.some((entry) => Number(getCourseBookDisplayDay(entry)) === 13) ? (
                    <div className="course-book-section-intro">
                      <h4>Welcome to A1.2</h4>
                      <p>
                        Day 13 begins the second half of your A1 course with revision of numbers, time and prices.
                        Build on the foundations from Days 1–12, combine your vocabulary and grammar, and practise
                        communicating more independently as you prepare for the A1 exam and future A2 study.
                      </p>
                      <p>
                        After the final Conjunctions lesson on Day 24, continue in the Exam Room for focused exam preparation.
                      </p>
                    </div>
                  ) : null}`;
const a2Intro = `${a1Intro}
                  {section?.key === "a2-2" && lessons.some((entry) => Number(getCourseBookDisplayDay(entry)) === 15) ? (
                    <div className="course-book-section-intro">
                      <h4>Welcome to A2.2</h4>
                      <p>
                        Day 15 begins the second half of A2 with Mein Lieblingssport. From here, use the grammar and vocabulary
                        you already know more independently in everyday situations such as health, services, complaints,
                        planning, travel, digital communication and talking about the future.
                      </p>
                      <p>
                        Use the grammar notes, workbook practice, speaking tasks and writing tasks to connect ideas in longer,
                        clearer responses as you work toward full A2 readiness.
                      </p>
                    </div>
                  ) : null}`;
if (!courseTab.includes("Welcome to A2.2")) {
  if (!courseTab.includes(a1Intro)) throw new Error("Could not find A1.2 Course Book introduction.");
  courseTab = courseTab.replace(a1Intro, a2Intro);
}

courseTab = courseTab.replace(
  '                  data-a1-course-section={section?.key}\n',
  '                  data-course-section={section?.key}\n',
);

if (!guidance.includes("[22, 23, 24, 25, 26, 27, 28].includes(Number(workbookDay))")) {
  throw new Error("A2 Days 22-28 are not marked as native workbook owners.");
}
if (!guidance.includes("usesNativeLateWorkbook || !showFallbackTabs")) {
  throw new Error("A2 Days 22-28 still depend on UniversalA2WorkbookTabs fallback detection.");
}
if (!legacyWrapper.includes(retiredNativePaths)) {
  throw new Error("Legacy A2 navigation still owns a cleaned Day 20-28 workbook route.");
}
if (!legacyWrapper.includes("usesCleanStandardWorkbook")) {
  throw new Error("Cleaned A2 workbooks are still eligible for legacy presentation cleanup.");
}
if (inlineEnhancements.includes("A2LateWorkbookSubmissionPanel")) {
  throw new Error("The retired late-A2 global submission bridge is still mounted.");
}
if (!courseTab.includes('title: "A2.1 – Building Independence"')) {
  throw new Error("A2.1 Course Book section was not installed.");
}
if (!courseTab.includes('title: "A2.2 – Independent Communication"')) {
  throw new Error("A2.2 Course Book section was not installed.");
}
if (!courseTab.includes("Welcome to A2.2")) {
  throw new Error("A2.2 Course Book introduction was not installed.");
}

fs.writeFileSync(guidancePath, guidance, "utf8");
fs.writeFileSync(legacyWrapperPath, legacyWrapper, "utf8");
fs.writeFileSync(inlineEnhancementsPath, inlineEnhancements, "utf8");
fs.writeFileSync(courseTabPath, courseTab, "utf8");
console.log("A2 Days 20-28 retain native workbook ownership and the A2 Course Book now presents Days 1-14 as A2.1 and Days 15-28 as A2.2 without changing assessment identities or media.");
