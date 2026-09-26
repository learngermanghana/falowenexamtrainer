import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import { B2_LESSON_CONTENT_ALIGNMENT } from "../web/src/data/b2LessonContentAlignment.js";
import { C1_CANONICAL_TITLES, C1_CANONICAL_GRAMMAR_TITLES } from "../web/src/data/c1ContentRefresh.js";
import { getB2SkillFocus, getB2DayTabs } from "../web/src/data/b2SkillCycle.js";
import { getC2SkillFocus, getC2DayTabs } from "../web/src/data/c2SkillCycle.js";
import { getC2TopicKnowledge } from "../web/src/data/c2TopicKnowledge.js";
import { A1_RADIO_RESOURCES, A1_CHAPTER_RADIO_RESOURCES } from "../web/src/data/a1RadioResources.js";
import { ADDITIONAL_A2_RADIO_ENTRIES } from "../web/src/data/additionalA2RadioEntries.js";
import { B1_FALOWEN_RADIO_FALLBACKS } from "../web/src/data/b1Day5Media.js";
import { B2_C1_LESSON_RADIO_OVERRIDES } from "../web/src/data/b2C1LessonMediaOverrides.js";
import { B2_LISTENING_PRACTICE } from "../web/src/data/b2ListeningPractice.js";
import { B2_READING_PRACTICE } from "../web/src/data/b2ReadingPractice.js";
import { C2_LISTENING_PRACTICE } from "../web/src/data/c2ListeningPractice.js";
import { C2_READING_PRACTICE } from "../web/src/data/c2ReadingPractice.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const WEB = path.join(ROOT, "web");
const PUBLIC = path.join(WEB, "public");

const readText = (relativePath) => fs.readFileSync(path.join(ROOT, relativePath), "utf8");
const readJson = (relativePath) => JSON.parse(readText(relativePath));
const absolute = (route = "") => {
  const value = String(route || "").trim();
  if (!value) return null;
  if (/^https?:\/\//i.test(value)) return value;
  return `https://www.falowen.app${value.startsWith("/") ? value : `/${value}`}`;
};
const withView = (route, view) => {
  if (!route || !view) return route || null;
  const joiner = route.includes("?") ? "&" : "?";
  return `${route}${joiner}view=${encodeURIComponent(view)}`;
};

const extractNamedObjectBody = (source, marker) => {
  const markerIndex = source.indexOf(marker);
  if (markerIndex < 0) return "";
  const start = source.indexOf("{", markerIndex + marker.length);
  if (start < 0) return "";
  let depth = 0;
  let quote = "";
  let escaped = false;
  for (let index = start; index < source.length; index += 1) {
    const char = source[index];
    if (quote) {
      if (escaped) escaped = false;
      else if (char === "\\") escaped = true;
      else if (char === quote) quote = "";
      continue;
    }
    if (char === '"' || char === "'" || char === "`") {
      quote = char;
      continue;
    }
    if (char === "{") depth += 1;
    if (char === "}") {
      depth -= 1;
      if (depth === 0) return source.slice(start + 1, index);
    }
  }
  return "";
};

const numericKeys = (body = "") =>
  new Set([...body.matchAll(/^\s*(\d+)\s*:\s*(?:Object\.freeze\()?\s*\{/gm)].map((match) => Number(match[1])));

const radioDictionarySource = readText("web/src/data/lessonRadioDictionary.js");
const A2_RADIO_DAYS = new Set([
  ...numericKeys(extractNamedObjectBody(radioDictionarySource, "A2:")),
  ...Object.keys(ADDITIONAL_A2_RADIO_ENTRIES).map(Number),
]);
const B1_RADIO_DAYS = new Set([
  ...numericKeys(extractNamedObjectBody(radioDictionarySource, "B1:")),
  ...Object.keys(B1_FALOWEN_RADIO_FALLBACKS).map(Number),
]);
const C1_RADIO_DAYS = new Set([
  ...numericKeys(extractNamedObjectBody(radioDictionarySource, "C1:")),
  ...Object.keys(B2_C1_LESSON_RADIO_OVERRIDES.C1 || {}).map(Number),
]);

const getA1Radio = (day, chapter) => {
  const chapterResource = A1_CHAPTER_RADIO_RESOURCES[`${Number(day)}:${String(chapter || "").trim()}`];
  const dayResource = A1_RADIO_RESOURCES[Number(day)];
  const resource = chapterResource || dayResource || null;
  return resource
    ? { required: true, key: resource.key || null, title: resource.title || null }
    : { required: false, key: null, title: null };
};

const getRadio = (level, day, chapter) => {
  if (level === "A1") return getA1Radio(day, chapter);
  const days = level === "A2" ? A2_RADIO_DAYS : level === "B1" ? B1_RADIO_DAYS : level === "C1" ? C1_RADIO_DAYS : new Set();
  return { required: days.has(Number(day)), key: null, title: null };
};

const canonical = readJson("shared/curriculumCanonical.json");
const inAppRoutes = readJson("web/src/data/inAppWorkbookRoutes.json");
const c2ExamSource = readText("web/src/data/c2ExamStandardContent.js");
const c2Rows = new Map(
  [...c2ExamSource.matchAll(/\[(\d+),"([^"]+)","([^"]+)","([^"]+)",\[/g)]
    .map((match) => [Number(match[1]), { title: match[2], grammarFocus: match[3], topic: match[4] }]),
);
if (c2Rows.size !== 28) {
  throw new Error(`Expected 28 C2 exam-standard rows, found ${c2Rows.size}`);
}

const A2_B1_SECTION_EXCEPTIONS = Object.freeze({
  A2: Object.freeze({ 14: Object.freeze({ listening: false }) }),
  B1: Object.freeze({ 21: Object.freeze({ listening: false }) }),
});

const getStrictWorkbookRoute = (entry) => {
  const level = String(entry.level || "").toUpperCase();
  const day = String(entry.day ?? "");
  const chapter = String(entry.chapter || "").trim();
  const dayMap = inAppRoutes[level]?.[day];
  if (dayMap) return dayMap[chapter] || dayMap["*"] || entry.workbookRoute || null;
  if (["B1", "B2", "C1"].includes(level) && Number(entry.day) > 0) {
    return `/campus/course/lesson/${level}/${Number(entry.day)}`;
  }
  return entry.workbookRoute || null;
};

const a2b1Sections = (level, day, grammarAvailable, submit) => {
  if (Number(day) === 0) return [{ key: "workbook", label: "Workbook" }];
  const listening = A2_B1_SECTION_EXCEPTIONS[level]?.[Number(day)]?.listening !== false;
  return [
    ...(grammarAvailable ? [{ key: "grammar", label: "Grammar", description: "Notes" }] : []),
    { key: "sprechen", label: "Teil 1", description: "Sprechen" },
    { key: "schreiben", label: "Teil 2", description: "Schreiben" },
    { key: "lesen", label: "Teil 3", description: "Lesen" },
    ...(listening ? [{ key: "hoeren", label: "Teil 4", description: "Hören" }] : []),
    { key: "references", label: "Ref", description: "Notes" },
    ...(submit ? [{ key: "submit", label: "Submit", description: "Send work" }] : []),
  ];
};

const buildA1A2B1 = (entry) => {
  const level = String(entry.level || "").toUpperCase();
  const day = Number(entry.day || 0);
  const chapter = String(entry.chapter || "");
  const workbookRoute = getStrictWorkbookRoute(entry);
  const radio = getRadio(level, day, chapter);
  const grammarAvailable = Boolean(String(entry.grammarPage || "").trim());
  let sections;
  if (level === "A1") {
    sections = [
      ...(radio.required ? [{ key: "radio", label: "Falowen Radio" }] : []),
      ...(grammarAvailable ? [{ key: "grammar", label: "Grammar / Learn" }] : []),
      { key: "workbook", label: "Workbook" },
      ...(entry.submissionRequired ? [{ key: "submit", label: "Submit" }] : []),
    ];
  } else {
    sections = [
      ...(radio.required ? [{ key: "radio", label: "Falowen Radio" }] : []),
      ...a2b1Sections(level, day, grammarAvailable, Boolean(entry.submissionRequired)),
    ];
  }

  return {
    id: entry.id,
    level,
    sequence: Number(entry.sequence || 0),
    day,
    chapter: chapter || null,
    title: entry.title || `${level} Day ${day}`,
    contentStatus: entry.contentStatus || "published",
    route: absolute(workbookRoute || `/campus/course/lesson/${level}/${day}`),
    courseBookRoute: "https://www.falowen.app/campus/course",
    grammarRoute: absolute(entry.grammarPage),
    workbookRoute: absolute(workbookRoute),
    availableSections: sections,
    radio,
    submission: {
      required: Boolean(entry.submissionRequired),
      assignmentId: entry.assignmentId || null,
      mode: entry.submissionRequired ? "tutor-marked" : "self-practice",
    },
    lessonPattern: level === "A1" ? "guided / lesson-specific workbook" : day === 0 ? "orientation" : "four-part workbook",
    skillFocus: null,
    media: {
      lessonVideoAvailable: Boolean(String(entry.video || entry.teacherVideo || "").trim()),
      readingPracticeAvailable: level === "A2" || level === "B1" ? day > 0 : /lesen/i.test(String(entry.kind || entry.assignmentType || "")),
      listeningPracticeAvailable: level === "A2" || level === "B1"
        ? day > 0 && A2_B1_SECTION_EXCEPTIONS[level]?.[day]?.listening !== false
        : /hören|hoeren/i.test(String(entry.kind || entry.assignmentType || "")),
      audioAvailable: null,
      transcriptAvailable: null,
    },
    assistantHint: level === "A1"
      ? radio.required
        ? "Open this lesson from Learn → Course Book. Complete Falowen Radio first, then continue to the lesson/workbook."
        : "Open this lesson from Learn → Course Book and use the lesson/workbook sections shown on the page."
      : day === 0
        ? "Open the orientation workbook from Learn → Course Book."
        : "Open the workbook from Learn → Course Book. Use the visible Teil tabs for Sprechen, Schreiben, Lesen and Hören; Hören is absent on documented exception days.",
    aliases: [
      `${level} Day ${day}`,
      chapter ? `${level} ${chapter}` : null,
      entry.title,
      entry.assignmentId,
    ].filter(Boolean),
  };
};

const buildB2 = (entry) => {
  const day = Number(entry.day || 0);
  if (day === 0) {
    return {
      ...buildA1A2B1(entry),
      lessonPattern: "self-learning orientation",
      submission: { required: false, assignmentId: entry.assignmentId || null, mode: "self-learning" },
    };
  }
  const alignment = B2_LESSON_CONTENT_ALIGNMENT[day] || {};
  const chapter = alignment.chapter || entry.chapter || null;
  const baseRoute = `/campus/course/lesson/B2/${day}${chapter ? `?chapter=${encodeURIComponent(chapter)}` : ""}`;
  const tabs = getB2DayTabs(day);
  const skillFocus = getB2SkillFocus(day);
  const reading = B2_READING_PRACTICE[day] || null;
  const listening = B2_LISTENING_PRACTICE[day] || null;
  const listeningTranscript = Array.isArray(listening?.transcript) ? listening.transcript.join(" ") : String(listening?.transcript || "");
  const listeningAudio = String(listening?.audioKey || listening?.audioUrl || "").trim();

  return {
    id: `B2-${chapter || day}`,
    level: "B2",
    sequence: day + 1,
    day,
    chapter,
    title: alignment.title || entry.title || `B2 Day ${day}`,
    topic: alignment.lessonTopic || null,
    grammarFocus: alignment.grammar_topic || null,
    contentStatus: "published",
    route: absolute(baseRoute),
    courseBookRoute: "https://www.falowen.app/campus/course",
    grammarRoute: absolute(baseRoute),
    workbookRoute: absolute(baseRoute),
    sectionRoutes: Object.fromEntries(tabs.map((tab) => [
      tab.key,
      absolute(tab.key === "learn" ? baseRoute : withView(baseRoute, tab.key)),
    ])),
    availableSections: tabs,
    radio: { required: false, key: null, title: null },
    submission: { required: false, assignmentId: null, mode: "self-learning" },
    lessonPattern: "rotating B2 self-learning: Grammar/Learn + one focus skill + Review + Ref",
    skillFocus,
    media: {
      lessonVideoAvailable: false,
      readingPracticeAvailable: Boolean(reading),
      listeningPracticeAvailable: Boolean(listening),
      audioAvailable: Boolean(listeningAudio),
      transcriptAvailable: Boolean(listeningTranscript.trim()),
    },
    assistantHint: `Open B2 Day ${day} from Learn → Course Book. Today’s focus is ${tabs.find((tab) => tab.key === skillFocus)?.label || skillFocus}. B2 supports direct ?view= links for its visible tabs.`,
    aliases: [`B2 Day ${day}`, chapter ? `B2 ${chapter}` : null, alignment.title, entry.title].filter(Boolean),
  };
};

const buildC1 = (entry) => {
  const day = Number(entry.day || 0);
  if (day === 0) {
    return {
      ...buildA1A2B1(entry),
      lessonPattern: "self-learning orientation",
      submission: { required: false, assignmentId: entry.assignmentId || null, mode: "self-learning" },
    };
  }
  const chapter = entry.chapter || null;
  const route = `/campus/course/lesson/C1/${day}`;
  const radio = getRadio("C1", day, chapter);
  const tabs = [
    { key: "learn", label: "Learn", description: "Input" },
    { key: "speak", label: "Speak", description: "Practice" },
    { key: "write", label: "Write", description: "Practice" },
    { key: "finish", label: "Finish", description: "Complete" },
    { key: "references", label: "Ref", description: "Notes" },
  ];

  return {
    id: entry.id || `C1-${chapter || day}`,
    level: "C1",
    sequence: Number(entry.sequence || day + 1),
    day,
    chapter,
    title: C1_CANONICAL_TITLES[day - 1] || entry.title || `C1 Day ${day}`,
    grammarFocus: C1_CANONICAL_GRAMMAR_TITLES[day - 1] || null,
    contentStatus: "published",
    route: absolute(route),
    courseBookRoute: "https://www.falowen.app/campus/course",
    grammarRoute: absolute(route),
    workbookRoute: absolute(route),
    availableSections: [
      ...(radio.required ? [{ key: "radio", label: "Falowen Radio" }] : []),
      ...tabs,
    ],
    radio,
    submission: { required: false, assignmentId: null, mode: "self-learning" },
    lessonPattern: "C1 self-learning: Learn → Speak → Write → Finish → Ref",
    skillFocus: null,
    media: {
      lessonVideoAvailable: Boolean(String(entry.video || "").trim()),
      readingPracticeAvailable: true,
      listeningPracticeAvailable: true,
      audioAvailable: null,
      transcriptAvailable: null,
    },
    assistantHint: "Open the C1 lesson from Learn → Course Book, then choose the visible tab. Current C1 guided pages use in-page tab state, so do not invent ?view= deep links.",
    aliases: [`C1 Day ${day}`, chapter ? `C1 ${chapter}` : null, C1_CANONICAL_TITLES[day - 1], entry.title].filter(Boolean),
  };
};

const buildC2 = (day) => {
  const standard = c2Rows.get(day);
  const knowledge = getC2TopicKnowledge(day);
  const chapter = knowledge?.chapter || null;
  const skillFocus = getC2SkillFocus(day);
  const tabs = getC2DayTabs(day);
  const baseRoute = `/campus/course/lesson/C2/${day}${chapter ? `?chapter=${encodeURIComponent(chapter)}` : ""}`;
  const reading = C2_READING_PRACTICE[day] || null;
  const listening = C2_LISTENING_PRACTICE[day] || null;
  const listeningTranscript = Array.isArray(listening?.transcript) ? listening.transcript.join(" ") : String(listening?.transcript || "");
  const listeningAudio = String(listening?.audioKey || listening?.audioUrl || "").trim();

  return {
    id: `C2-${chapter || day}`,
    level: "C2",
    sequence: day,
    day,
    chapter,
    title: standard.title,
    topic: standard.topic,
    grammarFocus: standard.grammarFocus,
    contentStatus: "published",
    route: absolute(baseRoute),
    courseBookRoute: "https://www.falowen.app/campus/course",
    grammarRoute: absolute(baseRoute),
    workbookRoute: absolute(baseRoute),
    sectionRoutes: Object.fromEntries(tabs.map((tab) => [
      tab.key,
      absolute(tab.key === "learn" ? baseRoute : withView(baseRoute, tab.key)),
    ])),
    availableSections: tabs,
    radio: { required: false, key: null, title: null },
    submission: { required: false, assignmentId: null, mode: "self-learning" },
    lessonPattern: "rotating C2 self-learning: Grammar/Learn + one focus skill + Review + Ref",
    skillFocus,
    media: {
      lessonVideoAvailable: false,
      readingPracticeAvailable: Boolean(reading),
      listeningPracticeAvailable: Boolean(listening),
      audioAvailable: Boolean(listeningAudio),
      transcriptAvailable: Boolean(listeningTranscript.trim()),
    },
    assistantHint: `Open C2 Day ${day} from Learn → Course Book. Today’s focus is ${tabs.find((tab) => tab.key === skillFocus)?.label || skillFocus}. C2 supports direct ?view= links for its visible tabs.`,
    aliases: [`C2 Day ${day}`, chapter ? `C2 ${chapter}` : null, standard.title].filter(Boolean),
  };
};

const lessons = canonical
  .filter((entry) => ["A1", "A2", "B1"].includes(String(entry.level || "").toUpperCase()))
  .map(buildA1A2B1);

canonical
  .filter((entry) => String(entry.level || "").toUpperCase() === "B2")
  .forEach((entry) => lessons.push(buildB2(entry)));
canonical
  .filter((entry) => String(entry.level || "").toUpperCase() === "C1")
  .forEach((entry) => lessons.push(buildC1(entry)));
for (let day = 1; day <= 28; day += 1) lessons.push(buildC2(day));

const levelOrder = { A1: 1, A2: 2, B1: 3, B2: 4, C1: 5, C2: 6 };
lessons.sort((left, right) =>
  (levelOrder[left.level] - levelOrder[right.level]) ||
  (Number(left.sequence) - Number(right.sequence)) ||
  (Number(left.day) - Number(right.day)),
);

for (const level of Object.keys(levelOrder)) {
  const group = lessons.filter((lesson) => lesson.level === level);
  group.forEach((lesson, index) => {
    const previous = group[index - 1] || null;
    const next = group[index + 1] || null;
    lesson.navigation = {
      previous: previous ? { id: previous.id, title: previous.title, route: previous.route } : null,
      next: next ? { id: next.id, title: next.title, route: next.route } : null,
    };
  });
}

const byLevel = Object.fromEntries(
  Object.keys(levelOrder).map((level) => [level, lessons.filter((lesson) => lesson.level === level)]),
);

const output = {
  schemaVersion: 1,
  generatedAt: new Date().toISOString(),
  canonicalBaseUrl: "https://www.falowen.app",
  sourceOfTruth: {
    help: "https://www.falowen.app/falowen-help.md",
    navigation: "https://www.falowen.app/falowen-navigation.json",
    courseMap: "https://www.falowen.app/falowen-course-map.json",
  },
  assistantRules: [
    "Use the exact level/day/chapter entry when a learner names a lesson.",
    "Use availableSections before telling a learner which tab to tap.",
    "Respect radio.required: Falowen Radio comes first when required.",
    "Respect submission.mode: never tell a self-learning or self-practice lesson to submit work.",
    "Use sectionRoutes only when they are present. Do not invent ?view= links for C1.",
    "A false audioAvailable value means the section may exist but the actual listening source has not yet been added.",
  ],
  counts: Object.fromEntries(Object.entries(byLevel).map(([level, entries]) => [level, entries.length])),
  lessons,
  byLevel,
};

fs.mkdirSync(PUBLIC, { recursive: true });
fs.writeFileSync(path.join(PUBLIC, "falowen-course-map.json"), JSON.stringify(output, null, 2) + "\n");
console.log(`Generated falowen-course-map.json with ${lessons.length} lesson entries.`);
