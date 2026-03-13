import { courseSchedules } from "../data/courseSchedule";

const normalizeText = (value) => String(value || "").trim().toLowerCase();

const normalizeLevel = (level) => {
  const token = String(level || "").trim().toUpperCase();
  return /^(A1|A2|B1|B2|C1|C2)$/.test(token) ? token : "";
};

const normalizeAssignmentToken = (value) =>
  String(value || "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/_/g, "-")
    .replace(/[^a-z0-9.-]/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toUpperCase();

const normalizeTitleToken = (value) =>
  String(value || "")
    .trim()
    .replace(/[_\s]+/g, "-")
    .replace(/[^a-z0-9-]/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toUpperCase();

export const toCanonicalAssignmentId = ({ assignmentId, level }) => {
  const normalizedLevel = normalizeLevel(level);
  const token = normalizeAssignmentToken(assignmentId);

  if (!token) return "";
  if (/^(A1|A2|B1|B2|C1|C2)-/i.test(token)) return token.toUpperCase();
  if (normalizedLevel) return `${normalizedLevel}-${token}`;
  return token;
};

const getFallbackKeyFromTitle = ({ level, assignmentTitle }) => {
  const normalizedLevel = normalizeLevel(level);
  const title = String(assignmentTitle || "").trim();

  if (!title) return "";

  const fromTitleToken = title.match(/\b(A1|A2|B1|B2|C1|C2)-\d+(?:\.\d+)?\b/i);
  if (fromTitleToken?.[0]) return fromTitleToken[0].toUpperCase();

  const chapterToken = title.match(/\b(\d+(?:\.\d+)?)\b/);
  if (chapterToken?.[1] && normalizedLevel) {
    return `${normalizedLevel}-${chapterToken[1]}`;
  }

  const dayTaskMatch = title.match(/\bday\s*(\d+)\b[^\n\r]*?\btask\s*(\d+)\b/i);
  if (dayTaskMatch?.[1] && dayTaskMatch?.[2] && normalizedLevel) {
    return `${normalizedLevel}-DAY-${dayTaskMatch[1]}-TASK-${dayTaskMatch[2]}`;
  }

  const dayMatch = title.match(/\bday\s*(\d+)\b/i);
  if (dayMatch?.[1] && normalizedLevel) {
    return `${normalizedLevel}-DAY-${dayMatch[1]}`;
  }

  const titleToken = normalizeTitleToken(title);
  if (!titleToken || !normalizedLevel) return "";

  return `${normalizedLevel}-TITLE-${titleToken}`;
};

const extractLessonMatchKey = ({ level, canonicalAssignmentKey, assignmentTitle }) => {
  const normalizedLevel = normalizeLevel(level);
  if (!normalizedLevel) return "";

  const canonical = String(canonicalAssignmentKey || "").toUpperCase();

  const chapterMatch = canonical.match(/\b(A1|A2|B1|B2|C1|C2)-(\d+(?:\.\d+)?)\b/i);
  if (chapterMatch?.[2]) {
    return `${normalizedLevel}-${chapterMatch[2]}`;
  }

  const dayMatch = canonical.match(/\bDAY-(\d+)\b/i);
  if (dayMatch?.[1]) {
    return `${normalizedLevel}-DAY-${dayMatch[1]}`;
  }

  const titleChapter = String(assignmentTitle || "").match(/\b(\d+(?:\.\d+)?)\b/);
  if (titleChapter?.[1]) {
    return `${normalizedLevel}-${titleChapter[1]}`;
  }

  return canonical;
};

export const resolveAssignmentCanonicalKey = ({ level, assignmentId, assignmentTitle }) => {
  const normalizedLevel = normalizeLevel(level);
  const fromId = toCanonicalAssignmentId({ assignmentId, level: normalizedLevel });
  if (fromId) return fromId;

  return getFallbackKeyFromTitle({
    level: normalizedLevel,
    assignmentTitle,
  });
};

export const resolveAssignmentMatchKey = ({ level, assignmentId, assignmentTitle }) => {
  const canonicalAssignmentKey = resolveAssignmentCanonicalKey({
    level,
    assignmentId,
    assignmentTitle,
  });

  if (!canonicalAssignmentKey) return "";

  return extractLessonMatchKey({
    level,
    canonicalAssignmentKey,
    assignmentTitle,
  });
};

export const buildAssignmentCatalogForLevel = (level) => {
  const normalizedLevel = normalizeLevel(level);
  const schedule = courseSchedules[normalizedLevel] || [];
  const seenRawIds = new Map();

  return schedule
    .filter(
      (entry) =>
        entry?.assignment ||
        entry?.assignmentId ||
        entry?.assignment_id ||
        entry?.assignmentKey
    )
    .map((entry) => {
      const chapterOrId =
        entry.assignmentId ||
        entry.assignment_id ||
        entry.assignmentKey ||
        entry.chapter ||
        "";

      const seenCount = (seenRawIds.get(chapterOrId) || 0) + 1;
      seenRawIds.set(chapterOrId, seenCount);

      const generatedId =
        chapterOrId ||
        (entry.day
          ? seenCount > 1
            ? `DAY-${entry.day}-TASK-${seenCount}`
            : `DAY-${entry.day}`
          : "");

      const label =
        entry.assignmentTitle ||
        entry.title ||
        entry.keyAssignment ||
        (entry.chapter && entry.topic
          ? `Day ${entry.day}: ${entry.chapter} ${entry.topic}`
          : entry.topic || generatedId || "Assignment");

      const canonicalAssignmentId =
        toCanonicalAssignmentId({
          assignmentId: generatedId,
          level: normalizedLevel,
        }) ||
        getFallbackKeyFromTitle({
          level: normalizedLevel,
          assignmentTitle: label,
        });

      const matchKey = resolveAssignmentMatchKey({
        level: normalizedLevel,
        assignmentId: canonicalAssignmentId || generatedId,
        assignmentTitle: label,
      });

      return {
        day: entry.day ?? null,
        topic: entry.topic || "",
        chapter: entry.chapter || "",
        label,
        assignmentId: generatedId,
        assignmentKey: canonicalAssignmentId,
        canonicalAssignmentId,
        matchKey,
      };
    });
};

export const normalizeAssignmentKey = (value, level) =>
  resolveAssignmentCanonicalKey({
    level,
    assignmentId: value,
    assignmentTitle: value,
  }) || normalizeText(value);
