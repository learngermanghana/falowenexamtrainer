import { getA2B1LessonProfile } from "../data/a2B1LessonProfile";

export const A2_B1_DEFAULT_SECTION_PROFILE = Object.freeze({
  grammar: false,
  speaking: true,
  writing: true,
  reading: true,
  listening: true,
  part4: "listening",
  part4Submission: "submit",
  references: true,
  submit: true,
});

const TAB_TO_SECTION = Object.freeze({
  grammar: "grammar",
  sprechen: "speaking",
  schreiben: "writing",
  lesen: "reading",
  hoeren: "listening",
  references: "references",
  submit: "submit",
});

export const getA2B1WorkbookSectionProfile = (level, day) => {
  const lesson = getA2B1LessonProfile(level, day);
  if (!lesson) return { ...A2_B1_DEFAULT_SECTION_PROFILE };

  const part4 = lesson.sections.part4;
  return {
    grammar: lesson.sections.grammar.visible,
    speaking: lesson.sections.speaking.visible,
    writing: lesson.sections.writing.visible,
    reading: lesson.sections.reading.visible,
    listening: Boolean(part4.visible && part4.contentType === "listening"),
    part4: part4.visible ? part4.contentType : null,
    part4Submission: !part4.visible
      ? "none"
      : part4.submitRequired
        ? "submit"
        : part4.mode === "self-check"
          ? "self-check"
          : "none",
    references: lesson.sections.references.visible,
    submit: lesson.sections.submit.visible,
    lessonProfileVersion: lesson.version,
  };
};

export const getA2B1WorkbookIncludedSectionLabels = (level, day) => {
  const normalizedLevel = String(level || "").trim().toUpperCase();
  const normalizedDay = Number(day);
  if (!["A2", "B1"].includes(normalizedLevel) || !Number.isInteger(normalizedDay) || normalizedDay < 1 || normalizedDay > 28) {
    return [];
  }

  if ((normalizedLevel === "A2" && normalizedDay === 22) || (normalizedLevel === "B1" && normalizedDay === 23)) return ["Sprechen"];

  const profile = getA2B1WorkbookSectionProfile(normalizedLevel, normalizedDay);
  const labels = [];
  if (profile.grammar) labels.push("Grammar");
  if (profile.speaking) labels.push("Sprechen");
  if (profile.writing) labels.push("Schreiben");
  if (profile.reading) labels.push("Lesen");
  if (profile.part4 === "listening") labels.push("Hören");
  if (profile.part4 === "reading" && !labels.includes("Lesen")) labels.push("Lesen");
  return labels;
};

export const filterA2B1WorkbookTabsByProfile = (tabs = [], profile = {}) =>
  tabs.reduce((visibleTabs, tab) => {
    if (tab?.key === "hoeren" && profile.part4 === "reading" && profile.reading !== false) {
      visibleTabs.push({ ...tab, description: "Lesen" });
      return visibleTabs;
    }

    const section = TAB_TO_SECTION[tab?.key];
    if (!section || profile[section] !== false) visibleTabs.push(tab);
    return visibleTabs;
  }, []);

export const __TESTING__ = {
  tabToSection: TAB_TO_SECTION,
};


const SECTION_HEADER = /^\s*(?:teil|part)\s*([1-4])\b/i;
const SECTION_LABEL_ONLY = /^(?:schreiben|writing|lesen|reading|h[oö]ren|listening)$/i;
const SECTION_PROMPT_ONLY = /^(?:frage|aufgabe|question)\s*\d+\s*[).:：-]?$/i;
const EMPTY_NUMBERED_ANSWER = /^(?:q\s*)?\d{1,2}\s*[).:：-]?$/i;
const VERSION_MARKER_ONLY = /^(?:A2|B1)[-_][A-Z0-9_.-]{4,}$/i;

const hasSubmissionAnswer = (value = "") => String(value || "")
  .split(/\r?\n/)
  .map((line) => line.trim())
  .filter(Boolean)
  .some((line) => !SECTION_LABEL_ONLY.test(line)
    && !SECTION_PROMPT_ONLY.test(line)
    && !EMPTY_NUMBERED_ANSWER.test(line)
    && !VERSION_MARKER_ONLY.test(line));

const extractRequiredAnswer = (tail = "") => {
  let value = String(tail || "").trim();
  value = value.replace(/^[·•—–-]\s*/, "").trim();
  value = value.replace(/^(?:schreiben|writing|lesen|reading|h[oö]ren|listening)\b\s*(?:[:：—–-]\s*)?/i, "").trim();
  value = value.replace(/^[:：—–-]\s*/, "").trim();
  return SECTION_LABEL_ONLY.test(value) ? "" : value;
};

const collectSubmissionSections = (text = "") => {
  const sections = new Map();
  let currentPart = "";
  const normalizedText = String(text || "").replace(/\\r?\\n/g, "\n");
  normalizedText.split(/\r?\n/).forEach((rawLine) => {
    const line = rawLine.trim();
    if (!line) return;
    const headers = [...line.matchAll(/(?:^|\s)(?:teil|part)\s*([1-4])\b/gi)];
    if (headers.length) {
      headers.forEach((heading, index) => {
        currentPart = `teil${Number(heading[1])}`;
        if (!sections.has(currentPart)) sections.set(currentPart, []);
        const start = heading.index + heading[0].length;
        const end = index + 1 < headers.length ? headers[index + 1].index : line.length;
        const answer = extractRequiredAnswer(line.slice(start, end));
        if (answer) sections.get(currentPart).push(answer);
      });
      return;
    }
    if (currentPart) sections.get(currentPart).push(line);
  });
  return sections;
};

export const validateA2B1WorkbookSubmissionSections = ({ level = "", day = null, text = "" } = {}) => {
  const profile = getA2B1LessonProfile(level, day);
  if (!profile) return { ok: true, missingParts: [], message: "" };

  const requiredParts = profile.requiredSubmissionParts || [];
  if (!requiredParts.length) return { ok: true, missingParts: [], message: "" };

  const sections = collectSubmissionSections(text);
  const missingParts = requiredParts.filter((part) => {
    const sectionText = sections.get(part.partId);
    if (sectionText) return !hasSubmissionAnswer(sectionText.join("\n"));
    // A single-part assignment can safely accept a legacy unlabelled response.
    if (requiredParts.length === 1 && sections.size === 0) return !hasSubmissionAnswer(text);
    return true;
  });

  if (!missingParts.length) return { ok: true, missingParts: [], message: "" };

  const labels = missingParts.map((part) => `Teil ${part.number} · ${part.label}`).join("; ");
  return {
    ok: false,
    missingParts: missingParts.map((part) => part.partId),
    message: `Your workbook is incomplete. Add at least one answer under each required part: ${labels}. Use a heading such as “Teil ${missingParts[0].number}”. Your work is still a draft and has not been submitted.`,
  };
};
