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
};

const COURSE_BOOK_WEEK_GOAL_LIMIT = 3;

const COURSE_BOOK_WEEK_PURPOSES = {
  A1: {
    1: [
      "greet people, introduce yourself and exchange basic personal information",
      "understand and answer very simple questions about yourself",
      "build short, correct sentences with the basic patterns you have learned",
    ],
    2: [
      "talk about familiar people, interests and everyday preferences",
      "ask and answer simple questions with greater confidence",
      "understand the main information in short everyday exchanges",
    ],
    3: [
      "handle basic time, date and daily-life communication",
      "combine familiar grammar to say what you can, want or need to do",
      "write short messages that communicate the essential information clearly",
    ],
    4: [
      "manage simple everyday situations such as requests, food and directions",
      "choose familiar sentence patterns more independently instead of copying models",
      "connect a few simple ideas when speaking or writing",
    ],
    5: [
      "communicate about common practical situations with less support",
      "combine the main A1 structures in short speaking and writing tasks",
      "complete basic A1-style tasks with clearer and more independent answers",
    ],
  },
  A2: {
    1: [
      "give fuller answers about familiar situations and ask useful follow-up questions",
      "connect simple ideas instead of speaking only in isolated sentences",
      "understand short texts and conversations well enough to respond with relevant detail",
    ],
    2: [
      "describe experiences, people and situations with more detail",
      "compare options and explain simple reasons for your choices",
      "write connected paragraphs rather than separate basic sentences",
    ],
    3: [
      "express preferences, reasons and personal experiences more confidently",
      "use a wider range of sentence patterns while keeping your meaning clear",
      "speak for longer about familiar topics without depending on memorised answers",
    ],
    4: [
      "solve common everyday problems through requests, explanations and practical messages",
      "explain reasons, consequences and simple solutions in a connected way",
      "organise short spoken and written responses so another person can follow them easily",
    ],
    5: [
      "adapt your language to different everyday situations and communication partners",
      "notice and correct common grammar or word-order mistakes in your own work",
      "combine information from reading or listening when giving your own response",
    ],
    6: [
      "communicate more spontaneously about present, past and future situations",
      "produce longer answers with a clear beginning, development and ending",
      "show that you can work independently with the core skills needed to move toward B1",
    ],
  },
  B1: {
    1: [
      "describe experiences, goals and opinions in connected language",
      "develop an answer with an idea, a reason and a relevant example",
      "write a structured personal text that goes beyond short isolated sentences",
    ],
    2: [
      "compare different options and explain advantages or disadvantages",
      "support your opinion with reasons instead of only stating what you think",
      "maintain a connected conversation on familiar everyday topics",
    ],
    3: [
      "discuss everyday issues and explain how they affect people",
      "use connectors and subordinate clauses to organise longer ideas",
      "give a clearer opinion with reasons, examples and consequences",
    ],
    4: [
      "explain causes, problems and possible solutions in a structured way",
      "handle more formal or goal-oriented communication with appropriate language",
      "organise speaking and writing into clear paragraphs or stages",
    ],
    5: [
      "respond to problems, choices and different viewpoints with relevant justification",
      "keep longer answers coherent by linking ideas across sentences",
      "adapt familiar grammar and vocabulary to new situations instead of repeating models",
    ],
    6: [
      "present a balanced viewpoint and respond to another perspective",
      "communicate independently across typical B1 speaking and writing tasks",
      "show exam-ready control of structure, clarity and self-correction",
    ],
  },
  B2: {
    1: [
      "present a detailed viewpoint and support it with convincing reasons and examples",
      "compare perspectives rather than only describing a situation",
      "communicate with greater independence and precision in speaking and writing",
    ],
    2: [
      "analyse a social or everyday issue from more than one perspective",
      "organise an argument so that claims, reasons and examples follow logically",
      "respond meaningfully to opinions that differ from your own",
    ],
    3: [
      "produce coherent opinion, analysis and problem-solving responses",
      "use more advanced linking structures to show contrast, cause and consequence",
      "speak with greater spontaneity while keeping your argument organised",
    ],
    4: [
      "evaluate complex situations and propose well-explained solutions",
      "combine information from different parts of a task into one clear response",
      "identify and correct weaknesses in accuracy, structure and word choice",
    ],
    5: [
      "discuss more abstract or professional issues with relevant detail",
      "adapt tone and register to the situation and intended reader or listener",
      "defend a viewpoint while acknowledging limitations or alternative perspectives",
    ],
    6: [
      "deliver well-organised B2 speaking and writing under exam-style conditions",
      "choose more precise language and sentence structures without losing fluency",
      "review and improve your own work independently before submitting or finishing",
    ],
  },
  C1: {
    1: [
      "express nuanced viewpoints on complex topics with clear reasoning",
      "use precise vocabulary and varied sentence structures to develop an argument",
      "move beyond simple opinion statements into well-supported analysis",
    ],
    2: [
      "analyse abstract social or cultural questions from several perspectives",
      "weigh arguments and qualify claims instead of presenting ideas as absolute",
      "maintain cohesion and an appropriate register across longer responses",
    ],
    3: [
      "produce structured formal or academic-style speaking and writing",
      "integrate examples, evidence and explanation naturally into your argument",
      "self-correct grammar and wording without weakening the flow of your response",
    ],
    4: [
      "respond flexibly to unfamiliar complex topics without relying on memorised language",
      "reformulate, clarify and qualify ideas when greater precision is needed",
      "maintain a coherent line of reasoning even when the task becomes demanding",
    ],
    5: [
      "synthesise ideas, evaluate competing positions and address counterarguments",
      "control register, nuance and precision across extended communication",
      "produce independent responses that sound purposeful rather than formulaic",
    ],
    6: [
      "perform complex exam-style speaking and writing with strong organisation",
      "select precise and natural language while maintaining fluency",
      "edit, refine and strengthen your own response independently before finalising it",
    ],
  },
};

const getCourseBookWeekNumber = (entry = {}) => {
  const day = Number(entry.displayDay ?? entry.day);
  return Number.isFinite(day) && day > 0 ? Math.max(1, Math.ceil(day / 5)) : 0;
};

const getCourseBookWeekPurposeItems = (level, weekNumber) => {
  const outcomes = COURSE_BOOK_WEEK_PURPOSES[level]?.[weekNumber] || [];
  if (outcomes.length) return outcomes.slice(0, COURSE_BOOK_WEEK_GOAL_LIMIT);
  return [
    "use this week's language more independently in your own speaking and writing",
    "connect your ideas clearly instead of relying on isolated model sentences",
    "review your own work and correct important mistakes before moving on",
  ].slice(0, COURSE_BOOK_WEEK_GOAL_LIMIT);
};

const getCourseBookWeekDayRange = (entries = []) => {
  const days = entries
    .map((entry) => Number(entry.displayDay ?? entry.day))
    .filter((day) => Number.isFinite(day) && day > 0)
    .sort((a, b) => a - b);
  if (!days.length) return "";
  const first = days[0];
  const last = days[days.length - 1];
  return first === last ? "Day " + first : "Days " + first + "–" + last;
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

if (!source.includes("data-course-week-goal")) {
  const lessonMapMarker = "                  {lessons.map((entry) => {";
  const lessonMapReplacement = `                  {lessons.map((entry) => {
                    const weekNumber = getCourseBookWeekNumber(entry);
                    const allWeekLessons = weekNumber
                      ? decoratedSchedule.filter((item) => getCourseBookWeekNumber(item) === weekNumber && !item.isMilestone)
                      : [];
                    const visibleWeekLessons = weekNumber
                      ? visibleLessons.filter((item) => getCourseBookWeekNumber(item) === weekNumber && !item.isMilestone)
                      : [];
                    const firstVisibleWeekLesson = visibleWeekLessons[0] || null;
                    const beginsVisibleWeek = Boolean(
                      weekNumber &&
                      usesStructuredCourseBookSections &&
                      !isFrenchProgram &&
                      firstVisibleWeekLesson?.assignmentKey === entry.assignmentKey
                    );
                    const weekOutcomeItems = beginsVisibleWeek
                      ? getCourseBookWeekPurposeItems(normalizedSelectedCourseLevel, weekNumber)
                      : [];
                    const weekDayRange = beginsVisibleWeek ? getCourseBookWeekDayRange(allWeekLessons) : "";`;

  if (!source.includes(lessonMapMarker)) throw new Error("Missing lesson map for weekly goals");
  source = source.replace(lessonMapMarker, lessonMapReplacement);

  const articleMarker = "                      <article className=\"course-book-lesson-card\" key={`day-${entry.day}-occurrence-${entry.occurrence || 1}`} style={{ ...courseBookStyles.lessonCard, ...(isCurrent ? courseBookStyles.lessonCardCurrent : {}) }}>";
  const goalPanel = `${articleMarker}
                        {beginsVisibleWeek && weekOutcomeItems.length ? (
                          <section
                            className="course-book-week-goal"
                            data-course-week-goal={normalizedSelectedCourseLevel + "-week-" + weekNumber}
                            style={{ margin: "0 0 12px", border: "1px solid #dbeafe", borderRadius: 12, background: "#f8fbff", padding: "10px 12px" }}
                          >
                            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "baseline" }}>
                              <strong style={{ color: "#1d4ed8", fontSize: 14 }}>Week {weekNumber} outcome</strong>
                              {weekDayRange ? <span style={{ color: "#64748b", fontSize: 12, fontWeight: 700 }}>{weekDayRange}</span> : null}
                            </div>
                            <p style={{ margin: "5px 0 0", color: "#334155", fontSize: 13, lineHeight: 1.55 }}>
                              <strong>By the end of this week, you should be able to:</strong> {weekOutcomeItems.join(" • ")}.
                            </p>
                          </section>
                        ) : null}`;

  if (!source.includes(articleMarker)) throw new Error("Missing lesson article for weekly goals");
  source = source.replace(articleMarker, goalPanel);
}

for (const label of ["B1.1 – Independent Everyday Communication", "B2.1 – Independent Communication and Analysis", "C1.1 – Advanced Expression and Analysis"]) {
  if (!source.includes(label)) throw new Error("Missing section label");
}
if (!source.includes("data-course-week-goal")) throw new Error("Missing weekly Course Book goal card");
if (!source.includes("COURSE_BOOK_WEEK_GOAL_LIMIT = 3")) throw new Error("Weekly Course Book goal limit is missing");
if (!source.includes("COURSE_BOOK_WEEK_PURPOSES")) throw new Error("Purpose-based weekly outcomes are missing");
if (!source.includes("getCourseBookWeekPurposeItems")) throw new Error("Purpose-based weekly outcome resolver is missing");

fs.writeFileSync(file, source, "utf8");
console.log("Structured A1-C1 Course Book sections and purpose-based weekly outcomes applied.");
