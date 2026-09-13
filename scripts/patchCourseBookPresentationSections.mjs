import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const file = path.join(root, "web/src/components/CourseTab.js");
let source = fs.readFileSync(file, "utf8");

const anchor = `const getA2CourseBookSection = (entry) => {
  const day = Number(entry.displayDay ?? entry.day);
  return A2_COURSE_BOOK_SECTIONS.find(({ firstDay, lastDay }) => day >= firstDay && day <= lastDay);
};`;

const extra = `${anchor}

const B1_COURSE_BOOK_SECTIONS = [
  { key: "orientation", title: "Orientation", days: "Day 0", firstDay: 0, lastDay: 0 },
  { key: "b1-1", title: "B1.1 – Independent Everyday Communication", days: "Days 1–14", firstDay: 1, lastDay: 14, introTitle: "Build independent B1 communication", intro: "Use familiar grammar and vocabulary in longer, connected responses. Give an idea, explain why, add an example and communicate without depending on memorised sentences." },
  { key: "b1-2", title: "B1.2 – Connected Communication and Exam Readiness", days: "Days 15–28", firstDay: 15, lastDay: 28, introTitle: "Move from correct sentences to developed answers", intro: "Combine connectors, reasons, examples and organised writing more confidently as you improve fluency, accuracy and exam-style communication." },
];

const B2_COURSE_BOOK_SECTIONS = [
  { key: "orientation", title: "Orientation", days: "Day 0", firstDay: 0, lastDay: 0 },
  { key: "b2-1", title: "B2.1 – Independent Communication and Analysis", days: "Days 1–14", firstDay: 1, lastDay: 14, introTitle: "Develop independent B2 communication", intro: "Go beyond describing everyday situations. Compare viewpoints, justify opinions and communicate with greater independence and detail." },
  { key: "b2-2", title: "B2.2 – Argumentation, Precision and Readiness", days: "Days 15–28", firstDay: 15, lastDay: 28, introTitle: "Strengthen argumentation and precision", intro: "Use more precise language, clearer paragraph structure and stronger examples while improving your own speaking and writing through active correction." },
];

const C1_COURSE_BOOK_SECTIONS = [
  { key: "orientation", title: "Orientation", days: "Day 0", firstDay: 0, lastDay: 0 },
  { key: "c1-1", title: "C1.1 – Advanced Expression and Analysis", days: "Days 1–14", firstDay: 1, lastDay: 14, introTitle: "Build advanced expression and analytical control", intro: "Work on nuanced opinions, precise vocabulary, complex sentence patterns and well-developed reasoning." },
  { key: "c1-2", title: "C1.2 – Precision, Structure and Exam Readiness", days: "Days 15–28", firstDay: 15, lastDay: 28, introTitle: "Refine precision, structure and independent performance", intro: "Sharpen formal writing, argumentation, speaking depth and self-correction for academic, professional and exam contexts." },
];

const COURSE_BOOK_PRESENTATION_SECTIONS = {
  A1: A1_COURSE_BOOK_SECTIONS,
  A2: A2_COURSE_BOOK_SECTIONS,
  B1: B1_COURSE_BOOK_SECTIONS,
  B2: B2_COURSE_BOOK_SECTIONS,
  C1: C1_COURSE_BOOK_SECTIONS,
};

const getCourseBookPresentationSection = (entry, level) => {
  const day = Number(entry.displayDay ?? entry.day);
  return (COURSE_BOOK_PRESENTATION_SECTIONS[level] || []).find(({ firstDay, lastDay }) => day >= firstDay && day <= lastDay);
};`;

if (!source.includes("COURSE_BOOK_PRESENTATION_SECTIONS")) {
  if (!source.includes(anchor)) throw new Error("Missing A2 section anchor");
  source = source.replace(anchor, extra);
}

const start = source.indexOf("  const groupedLessons = useMemo(() => {");
const end = source.indexOf("  const persistPracticeProgress =", start);
if (start < 0 || end < 0) throw new Error("Missing Course Book grouping block");

const grouping = `  const presentationSections = COURSE_BOOK_PRESENTATION_SECTIONS[normalizedSelectedCourseLevel] || null;
  const usesStructuredCourseBookSections = Boolean(presentationSections);

  const groupedLessons = useMemo(() => {
    if (!usesStructuredCourseBookSections) return groupLessonsByWeek(visibleLessons);
    return visibleLessons.reduce((groups, entry) => {
      const section = getCourseBookPresentationSection(entry, normalizedSelectedCourseLevel);
      const key = section?.key || "Course completion";
      if (!groups[key]) groups[key] = [];
      groups[key].push(entry);
      return groups;
    }, {});
  }, [normalizedSelectedCourseLevel, usesStructuredCourseBookSections, visibleLessons]);

  const weekEntries = Object.entries(groupedLessons).map(([label, lessons]) => [
    label,
    lessons,
    presentationSections?.find(({ key }) => key === label) || null,
  ]);

`;
source = source.slice(0, start) + grouping + source.slice(end);

const marker = "                  {lessons.map((entry) => {";
const intro = `                  {section?.introTitle && section?.intro ? (
                    <div className="course-book-section-intro" data-course-section-intro={section.key}>
                      <h4>{section.introTitle}</h4>
                      <p>{section.intro}</p>
                    </div>
                  ) : null}
`;
if (!source.includes("data-course-section-intro={section.key}")) {
  const index = source.indexOf(marker);
  if (index < 0) throw new Error("Missing lesson render marker");
  source = source.slice(0, index) + intro + source.slice(index);
}

for (const label of ["B1.1 – Independent Everyday Communication", "B2.1 – Independent Communication and Analysis", "C1.1 – Advanced Expression and Analysis"]) {
  if (!source.includes(label)) throw new Error("Missing section label");
}

fs.writeFileSync(file, source, "utf8");
console.log("Structured B1, B2 and C1 Course Book sections applied.");
