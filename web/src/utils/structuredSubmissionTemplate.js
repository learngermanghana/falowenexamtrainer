import { getA1Assignment, getA1AssignmentByChapter } from "../data/a1AssignmentRegistry";
import { getA2B1WorkbookSectionProfile } from "../components/a2B1WorkbookSectionProfile";

export const STRUCTURED_SUBMISSION_VERSION = 1;

const A2_B1_LEVELS = new Set(["A2", "B1"]);
const NON_SUBMISSION_A1_SECTION = /\b(?:reminder|reference|references|supporting materials?)\b/i;

const partNumberFromId = (partId = "") => {
  const match = String(partId || "").toLowerCase().match(/teil[-_ ]?([1-4])/);
  return match?.[1] ? Number(match[1]) : null;
};

const normalizePartId = (value = "") => {
  const match = String(value || "").toLowerCase().match(/(?:teil|part)[-_ ]?([1-4])/);
  if (match?.[1]) return `teil${Number(match[1])}`;
  if (/^[1-4]$/.test(String(value || "").trim())) return `teil${Number(value)}`;
  return "";
};

const makePart = (number, label = "") => Object.freeze({
  partId: `teil${number}`,
  number,
  heading: `TEIL ${number}`,
  label: String(label || "").trim(),
  required: true,
});

const resolveA1Parts = ({ assignmentKey = "", chapter = "" } = {}) => {
  const normalizedKey = String(assignmentKey || "").trim().toUpperCase();
  const assignment = getA1Assignment(normalizedKey) || getA1AssignmentByChapter(chapter);
  if (!assignment?.sections?.length) return [];

  return assignment.sections
    .filter((section) => !NON_SUBMISSION_A1_SECTION.test(String(section?.label || "")))
    .map((section) => makePart(Number(section.number), section.label))
    .filter((part) => Number.isInteger(part.number) && part.number >= 1 && part.number <= 4);
};

const resolveA2B1Parts = ({ level = "", day = 0 } = {}) => {
  const profile = getA2B1WorkbookSectionProfile(level, day);
  const parts = [
    makePart(2, "Schreiben"),
    makePart(3, "Lesen"),
  ];

  if (profile?.part4 && profile?.part4Submission === "submit") {
    parts.push(makePart(4, profile.part4 === "reading" ? "Lesen" : "Hören"));
  }

  return parts;
};

export const getStructuredSubmissionProfile = ({ level = "", day = 0, chapter = "", assignmentKey = "" } = {}) => {
  const normalizedLevel = String(level || "").trim().toUpperCase();
  let parts = [];

  if (normalizedLevel === "A1") {
    parts = resolveA1Parts({ assignmentKey, chapter });
  } else if (A2_B1_LEVELS.has(normalizedLevel)) {
    parts = resolveA2B1Parts({ level: normalizedLevel, day });
  }

  if (!parts.length) return null;

  return Object.freeze({
    version: STRUCTURED_SUBMISSION_VERSION,
    level: normalizedLevel,
    assignmentKey: String(assignmentKey || "").trim(),
    day: Number(day) || null,
    chapter: String(chapter || "").trim(),
    parts: Object.freeze(parts),
  });
};

export const buildStructuredSubmissionTemplate = (profile) => {
  if (!profile?.parts?.length) return "";
  return profile.parts.map((part) => part.heading).join("\n\n");
};

const headingRegex = /^\s*(?:teil|part)\s*([1-4])(?:\s*[:.;|·•–-].*)?\s*$/i;

export const parseStructuredSubmissionText = (text = "", profile = null) => {
  const source = String(text || "").replace(/\r\n/g, "\n");
  const lines = source.split("\n");
  const found = new Map();
  let currentPartId = "";

  lines.forEach((line) => {
    const headingMatch = line.match(headingRegex);
    if (headingMatch?.[1]) {
      currentPartId = `teil${Number(headingMatch[1])}`;
      if (!found.has(currentPartId)) found.set(currentPartId, []);
      return;
    }
    if (currentPartId) found.get(currentPartId).push(line);
  });

  const expectedParts = profile?.parts || [];
  const sections = {};
  expectedParts.forEach((part) => {
    sections[part.partId] = String((found.get(part.partId) || []).join("\n")).trim();
  });

  const missingHeadings = expectedParts
    .filter((part) => !found.has(part.partId))
    .map((part) => part.partId);
  const unansweredParts = expectedParts
    .filter((part) => !String(sections[part.partId] || "").trim())
    .map((part) => part.partId);

  return {
    version: STRUCTURED_SUBMISSION_VERSION,
    sections,
    sectionOrder: expectedParts.map((part) => part.partId),
    missingHeadings,
    unansweredParts,
    complete: missingHeadings.length === 0 && unansweredParts.length === 0,
  };
};

export const getStructuredAnswerText = (parsed = null) => {
  if (!parsed?.sectionOrder?.length) return "";
  return parsed.sectionOrder
    .map((partId) => String(parsed.sections?.[partId] || "").trim())
    .filter(Boolean)
    .join("\n\n")
    .trim();
};

export const formatMissingStructuredParts = (partIds = []) =>
  partIds
    .map((partId) => partNumberFromId(normalizePartId(partId)))
    .filter(Boolean)
    .map((number) => `Teil ${number}`)
    .join(", ");
