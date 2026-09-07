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

const readStructuredSectionValue = (value) => {
  if (value === null || value === undefined) return "";
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return String(value).trim();
  }
  if (typeof value !== "object" || Array.isArray(value)) return "";
  return String(
    value.text ?? value.answer ?? value.submissionText ?? value.workContent ?? value.value ?? ""
  ).trim();
};

export const normalizeStructuredSubmissionSections = (sections = null, profile = null) => {
  if (!sections || typeof sections !== "object" || Array.isArray(sections)) return {};
  const byPart = {};
  Object.entries(sections).forEach(([key, value]) => {
    const partId = normalizePartId(key);
    if (!partId || Object.prototype.hasOwnProperty.call(byPart, partId)) return;
    byPart[partId] = readStructuredSectionValue(value);
  });

  if (!profile?.parts?.length) return byPart;
  return profile.parts.reduce((result, part) => {
    result[part.partId] = String(byPart[part.partId] || "").trim();
    return result;
  }, {});
};

export const buildStructuredSubmissionTextFromSections = (profile = null, sections = {}) => {
  if (!profile?.parts?.length) return "";
  const normalized = normalizeStructuredSubmissionSections(sections, profile);
  return profile.parts
    .map((part) => {
      const answer = String(normalized[part.partId] || "").trim();
      return answer ? `${part.heading}\n${answer}` : part.heading;
    })
    .join("\n\n")
    .trim();
};

const inspectHistoricalHeadingShape = (text = "", profile = null) => {
  if (!profile?.parts?.length) return { exact: false, partIds: [] };
  const source = String(text || "").replace(/\r\n/g, "\n");
  const lines = source.split("\n");
  const partIds = [];
  let firstHeadingLine = -1;

  lines.forEach((line, index) => {
    const match = line.match(headingRegex);
    if (!match?.[1]) return;
    if (firstHeadingLine < 0) firstHeadingLine = index;
    partIds.push(`teil${Number(match[1])}`);
  });

  const expected = profile.parts.map((part) => part.partId);
  const prefixIsEmpty = firstHeadingLine >= 0 && lines.slice(0, firstHeadingLine).every((line) => !String(line).trim());
  const exactOrder = partIds.length === expected.length && partIds.every((partId, index) => partId === expected[index]);
  const noDuplicates = new Set(partIds).size === partIds.length;
  return { exact: prefixIsEmpty && exactOrder && noDuplicates, partIds };
};

export const resolveStructuredResubmissionSeed = ({
  profile = null,
  structuredSections = null,
  submissionText = "",
} = {}) => {
  const fallbackText = String(submissionText || "").trim();
  if (!profile?.parts?.length) {
    return { mode: "legacy", confident: false, text: fallbackText, sections: null, parsed: null };
  }

  const normalizedStoredSections = normalizeStructuredSubmissionSections(structuredSections, profile);
  const hasStoredStructure = profile.parts.every(
    (part) => String(normalizedStoredSections[part.partId] || "").trim().length > 0,
  );
  if (hasStoredStructure) {
    const text = buildStructuredSubmissionTextFromSections(profile, normalizedStoredSections);
    return {
      mode: "structured",
      confident: true,
      source: "structuredSections",
      text,
      sections: normalizedStoredSections,
      parsed: parseStructuredSubmissionText(text, profile),
    };
  }

  const headingShape = inspectHistoricalHeadingShape(fallbackText, profile);
  const parsed = parseStructuredSubmissionText(fallbackText, profile);
  if (headingShape.exact && parsed.complete) {
    const text = buildStructuredSubmissionTextFromSections(profile, parsed.sections);
    return {
      mode: "structured",
      confident: true,
      source: "historicalHeadings",
      text,
      sections: parsed.sections,
      parsed: parseStructuredSubmissionText(text, profile),
    };
  }

  return { mode: "legacy", confident: false, source: "legacy", text: fallbackText, sections: null, parsed: null };
};

const normalizeSectionForDiff = (value = "") =>
  String(value || "")
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.replace(/[ \t]+/g, " ").trim())
    .join("\n")
    .trim();

export const compareStructuredSubmissionSections = (previousSections = {}, currentSections = {}, sectionOrder = []) => {
  const order = Array.isArray(sectionOrder) ? sectionOrder.map(normalizePartId).filter(Boolean) : [];
  const changedParts = [];
  const unchangedParts = [];

  order.forEach((partId) => {
    const previous = normalizeSectionForDiff(previousSections?.[partId]);
    const current = normalizeSectionForDiff(currentSections?.[partId]);
    if (previous === current) unchangedParts.push(partId);
    else changedParts.push(partId);
  });

  return {
    changedParts,
    unchangedParts,
    changedCount: changedParts.length,
    hasChanges: changedParts.length > 0,
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
