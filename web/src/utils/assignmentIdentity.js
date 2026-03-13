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

const extractChapterTokenFromTitle = (title = "") => {
  const text = String(title || "").trim();
  if (!text) return "";

  const explicitLevelChapter = text.match(/\b(?:A1|A2|B1|B2|C1|C2)[\s-]+(\d+(?:\.\d+)?)\b/i);
  if (explicitLevelChapter?.[1]) return explicitLevelChapter[1];

  const decimalMatches = text.match(/\b\d+\.\d+\b/g);
  if (decimalMatches?.length) return decimalMatches[decimalMatches.length - 1];

  const chapterHint = text.match(/\b(?:chapter|lektion|lesson|aufgabe)\s*(\d+(?:\.\d+)?)\b/i);
  if (chapterHint?.[1]) return chapterHint[1];

  return "";
};

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

  const explicitLevelChapter = title.match(/\b(A1|A2|B1|B2|C1|C2)-(\d+(?:\.\d+)?)\b/i);
  if (explicitLevelChapter?.[0]) return explicitLevelChapter[0].toUpperCase();

  const chapterToken = extractChapterTokenFromTitle(title);
  if (chapterToken && normalizedLevel) {
    return `${normalizedLevel}-${chapterToken}`;
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
  const normalizedLevel = normalizeLevel(level);
  if (!normalizedLevel) return "";

  const canonicalKey = resolveAssignmentCanonicalKey({
    level: normalizedLevel,
    assignmentId,
    assignmentTitle,
  });

  if (!canonicalKey) return "";

  const chapterMatch = canonicalKey.match(/\b(A1|A2|B1|B2|C1|C2)-(\d+(?:\.\d+)?)\b/i);
  if (chapterMatch?.[2]) {
    return `${normalizedLevel}-${chapterMatch[2]}`;
  }

  const dayMatch = canonicalKey.match(/\bDAY-(\d+)\b/i);
  if (dayMatch?.[1]) {
    return `${normalizedLevel}-DAY-${dayMatch[1]}`;
  }

  return canonicalKey;
};

export const buildAssignmentCatalogForLevel = (level) => {
  const normalizedLevel = normalizeLevel(level);
  const schedule = courseSchedules[normalizedLevel] || [];
  const seenByDay = {};

  return schedule
    .filter(
      (entry) =>
        entry?.assignment ||
        entry?.assignmentId ||
        entry?.assignment_id ||
        entry?.assignmentKey
    )
    .map((entry) => {
      const dayKey = String(entry?.day ?? "");
      seenByDay[dayKey] = (seenByDay[dayKey] || 0) + 1;
      const occurrence = seenByDay[dayKey];

      const rawAssignmentId =
        entry.assignmentId ||
        entry.assignment_id ||
        entry.assignmentKey ||
        entry.chapter ||
        (occurrence > 1 ? `DAY-${entry.day}-TASK-${occurrence}` : `DAY-${entry.day}`);

      const label =
        entry.assignmentTitle ||
        entry.title ||
        (entry.chapter
          ? `Day ${entry.day}: ${entry.chapter} ${entry.topic || "Assignment"}`
          : `Day ${entry.day}: ${entry.topic || "Assignment"}`);

      const canonicalAssignmentId =
        toCanonicalAssignmentId({
          assignmentId: rawAssignmentId,
          level: normalizedLevel,
        }) ||
        getFallbackKeyFromTitle({
          level: normalizedLevel,
          assignmentTitle: label,
        });

      const matchKey = resolveAssignmentMatchKey({
        level: normalizedLevel,
        assignmentId: canonicalAssignmentId || rawAssignmentId,
        assignmentTitle: label,
      });

      return {
        day: entry.day,
        occurrence,
        topic: entry.topic || "",
        chapter: entry.chapter || "",
        label,
        assignmentId: rawAssignmentId,
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
