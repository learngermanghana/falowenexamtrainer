import { getCurriculumEntriesForLevel } from "../data/curriculumManifest";
import { getB2LessonContentAlignment } from "../data/b2LessonContentAlignment";
import { getB2ListeningPractice } from "../data/b2ListeningPractice";
import { getB2ReadingPractice } from "../data/b2ReadingPractice";
import { getB2SkillFocus, getB2SkillLabel } from "../data/b2SkillCycle";
import { getC2LessonContentAlignment } from "../data/c2LessonContentAlignment";
import { getC2ListeningPractice } from "../data/c2ListeningPractice";
import { getC2ReadingPractice } from "../data/c2ReadingPractice";
import { getC2SkillFocus, getC2SkillLabel } from "../data/c2SkillCycle";

const normalizeLevel = (value = "") => {
  const match = String(value || "").trim().toUpperCase().match(/\b(A1|A2|B1|B2|C1|C2)\b/);
  return match ? match[1] : "";
};

const normalizeView = (value = "") => {
  const view = String(value || "").trim().toLowerCase();
  if (view === "finish") return "review";
  if (["learn", "lesen", "hoeren", "speak", "write", "review", "references"].includes(view)) return view;
  return "learn";
};

const parseLessonRoute = ({ pathname = "", search = "" } = {}) => {
  const lessonMatch = String(pathname || "").match(
    /^\/campus\/course\/lesson\/(A1|A2|B1|B2|C1|C2)\/(\d+)\/?$/i,
  );
  const workbookMatch = String(pathname || "").match(
    /^\/campus\/course\/(A1|A2|B1|B2|C1|C2)-day-(\d+)(?:-|\/|$)/i,
  );
  const match = lessonMatch || workbookMatch;
  if (!match) return null;

  const params = new URLSearchParams(search || "");
  return {
    level: normalizeLevel(match[1]),
    day: Number(match[2]),
    chapter: String(params.get("chapter") || "").trim(),
    view: normalizeView(params.get("view") || "learn"),
  };
};

const textOf = (...values) =>
  values
    .flat()
    .map((value) => String(value || "").trim())
    .find(Boolean) || "";

const normalizeVocabularyItem = (item) => {
  if (!item) return "";
  if (typeof item === "string") return item.trim();
  if (Array.isArray(item)) {
    return item.map((value) => String(value || "").trim()).filter(Boolean).join(" – ");
  }
  if (typeof item === "object") {
    const german = textOf(item.de, item.word, item.term, item.expression, item.phrase, item.title);
    const english = textOf(item.en, item.translation, item.meaning);
    if (german && english && german !== english) return `${german} – ${english}`;
    return german || english;
  }
  return String(item).trim();
};

const normalizeVocabulary = (...sources) => {
  const seen = new Set();
  const values = [];
  sources.flat(Infinity).forEach((item) => {
    const value = normalizeVocabularyItem(item);
    const key = value.toLowerCase();
    if (!value || seen.has(key)) return;
    seen.add(key);
    values.push(value);
  });
  return values.slice(0, 12);
};

const safeReadJson = (key) => {
  if (typeof window === "undefined" || !window.localStorage || !key) return {};
  try {
    return JSON.parse(window.localStorage.getItem(key) || "{}") || {};
  } catch (_error) {
    return {};
  }
};

const summarizeProgress = (level, day) => {
  const normalizedLevel = normalizeLevel(level);
  const keys = normalizedLevel === "C2"
    ? [`falowen:c2:day${day}:unified-progress`]
    : [
        `falowen:${normalizedLevel.toLowerCase()}:day${day}:standard-journey:progress-v2`,
        `falowen:${normalizedLevel.toLowerCase()}:day${day}:standard-journey:progress`,
      ];

  const progress = keys
    .map(safeReadJson)
    .find((value) => value && Object.keys(value).length) || {};

  const summary = {};
  [
    "learnDone",
    "lesenDone",
    "hoerenDone",
    "speakDone",
    "writeDone",
    "completed",
    "finishDone",
  ].forEach((key) => {
    if (typeof progress[key] === "boolean") summary[key] = progress[key];
  });

  if (progress.completedAt) summary.completedAt = String(progress.completedAt);
  if (progress.readingAnswers && typeof progress.readingAnswers === "object") {
    summary.readingAnswered = Object.keys(progress.readingAnswers).length;
  }
  if (progress.listeningAnswers && typeof progress.listeningAnswers === "object") {
    summary.listeningAnswered = Object.keys(progress.listeningAnswers).length;
  }
  if (progress.reviewChecks && typeof progress.reviewChecks === "object") {
    summary.reviewChecksCompleted = Object.values(progress.reviewChecks).filter(Boolean).length;
  }

  return summary;
};

const taskItemsFromPractice = (practice) => {
  const questions = Array.isArray(practice?.questions) ? practice.questions : [];
  return questions.slice(0, 8).map((item, index) => ({
    number: index + 1,
    question: String(item?.question || "").trim(),
    options: Array.isArray(item?.options)
      ? item.options.map((option) => String(option || "").trim()).filter(Boolean)
      : [],
  })).filter((item) => item.question);
};

const findCurriculumEntry = ({ level, day, chapter }) => {
  const entries = getCurriculumEntriesForLevel(level) || [];
  const sameDay = entries.filter((entry) => Number(entry?.day ?? entry?.assignmentDay ?? 0) === Number(day));
  if (!sameDay.length) return null;
  if (chapter) {
    const exact = sameDay.find((entry) =>
      String(entry?.chapter || entry?.displayChapter || "").trim() === String(chapter).trim(),
    );
    if (exact) return exact;
  }
  return sameDay.find((entry) => entry?.progressionEligible === true)
    || sameDay.find((entry) => entry?.assignment === true)
    || sameDay[0];
};

const getB2Context = ({ day, view, entry }) => {
  const alignment = getB2LessonContentAlignment(day);
  const listening = view === "hoeren" ? getB2ListeningPractice(day) : null;
  const reading = view === "lesen" ? getB2ReadingPractice(day) : null;
  const practice = listening || reading;

  return {
    title: textOf(alignment?.title, entry?.lessonTitle, entry?.topic, entry?.title),
    topic: textOf(alignment?.lessonTopic, entry?.lessonTopic, entry?.topic),
    goal: textOf(alignment?.goal, entry?.goal),
    grammarFocus: textOf(alignment?.grammar_topic, entry?.grammar_topic, entry?.grammarFocus),
    mainSkillKey: getB2SkillFocus(day) || "",
    mainSkill: getB2SkillLabel(day)?.label || "",
    vocabulary: normalizeVocabulary(
      practice?.vocabulary,
      entry?.vocabulary,
      entry?.keywords,
    ),
    currentTask: practice
      ? {
          type: view,
          title: textOf(practice.title, alignment?.title),
          instruction: view === "hoeren"
            ? "Listen to the current B2 audio and answer the comprehension questions."
            : "Read the current B2 text and answer the comprehension questions.",
          items: taskItemsFromPractice(practice),
        }
      : {
          type: view,
          title: view === "learn" ? "Grammar / Learn" : getB2SkillLabel(day)?.label || "Lesson task",
          instruction: view === "learn"
            ? textOf(alignment?.goal, alignment?.grammar_topic)
            : textOf(entry?.instruction, entry?.writingTopic, entry?.speakingPrompt, alignment?.goal),
          items: [],
        },
  };
};

const getC2Context = ({ day, view, entry }) => {
  const alignment = getC2LessonContentAlignment(day);
  const listening = view === "hoeren" ? getC2ListeningPractice(day) : null;
  const reading = view === "lesen" ? getC2ReadingPractice(day) : null;
  const practice = listening || reading;

  return {
    title: textOf(alignment?.title, entry?.lessonTitle, entry?.topic, entry?.title),
    topic: textOf(alignment?.topic, entry?.lessonTopic, entry?.topic),
    goal: textOf(alignment?.challenge, alignment?.production, entry?.goal),
    grammarFocus: textOf(alignment?.grammarFocus, entry?.grammar_topic, entry?.grammarFocus),
    mainSkillKey: getC2SkillFocus(day) || "",
    mainSkill: getC2SkillLabel(day)?.label || "",
    vocabulary: normalizeVocabulary(
      alignment?.vocabulary,
      alignment?.collocations,
      entry?.vocabulary,
      entry?.keywords,
    ),
    currentTask: practice
      ? {
          type: view,
          title: textOf(practice.title, alignment?.title),
          instruction: view === "hoeren"
            ? "Listen to the current C2 audio and answer the comprehension questions."
            : "Read the current C2 text and answer the comprehension questions.",
          items: taskItemsFromPractice(practice),
        }
      : {
          type: view,
          title: view === "learn" ? "Grammar / Learn" : getC2SkillLabel(day)?.label || "Lesson task",
          instruction: view === "learn"
            ? textOf(alignment?.grammarNotes?.usage, alignment?.grammarFocus)
            : view === "write"
              ? textOf(alignment?.writingExercise?.prompt, alignment?.production)
              : view === "speak"
                ? textOf(alignment?.challenge, alignment?.production)
                : textOf(entry?.instruction, alignment?.goal),
          items: [],
        },
  };
};

const getGenericContext = ({ level, day, view, entry }) => ({
  title: textOf(entry?.lessonTitle, entry?.topic, entry?.title, `${level} Day ${day}`),
  topic: textOf(entry?.lessonTopic, entry?.topic, entry?.description),
  goal: textOf(entry?.goal, entry?.objective, entry?.instruction),
  grammarFocus: textOf(entry?.grammar_topic, entry?.grammarFocus, entry?.grammar),
  mainSkillKey: "",
  mainSkill: "",
  vocabulary: normalizeVocabulary(entry?.vocabulary, entry?.keywords, entry?.wortschatz),
  currentTask: {
    type: view,
    title: textOf(entry?.assignmentTitle, entry?.lessonTitle, entry?.topic, "Current lesson task"),
    instruction: textOf(
      entry?.instruction,
      entry?.writingTopic,
      entry?.speakingPrompt,
      entry?.goal,
    ),
    items: [],
  },
});

export const getStudyBuddyLessonContext = ({
  pathname,
  search,
} = {}) => {
  const browserPathname = pathname ?? (typeof window !== "undefined" ? window.location?.pathname : "");
  const browserSearch = search ?? (typeof window !== "undefined" ? window.location?.search : "");
  const route = parseLessonRoute({ pathname: browserPathname, search: browserSearch });
  if (!route?.level || !route?.day) return {};

  const entry = findCurriculumEntry(route);
  const structured = route.level === "B2"
    ? getB2Context({ ...route, entry })
    : route.level === "C2"
      ? getC2Context({ ...route, entry })
      : getGenericContext({ ...route, entry });

  return {
    source: "structured-course-context",
    level: route.level,
    day: route.day,
    chapter: route.chapter || textOf(entry?.chapter, entry?.displayChapter),
    activeView: route.view,
    ...structured,
    progress: summarizeProgress(route.level, route.day),
  };
};

export {
  parseLessonRoute,
  normalizeVocabulary,
  summarizeProgress,
};

export default getStudyBuddyLessonContext;
