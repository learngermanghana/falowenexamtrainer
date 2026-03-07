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

  const dayTaskMatch = title.match(/\bday\s*(\d+)\b[^\n\r]*?\btask\s*(\d+)\b/i);
  if (dayTaskMatch?.[1] && dayTaskMatch?.[2] && normalizedLevel) {
    return `${normalizedLevel}-DAY-${dayTaskMatch[1]}-TASK-${dayTaskMatch[2]}`;
  }

  const dayMatch = title.match(/\bday\s*(\d+)\b/i);
  if (dayMatch?.[1] && normalizedLevel) return `${normalizedLevel}-DAY-${dayMatch[1]}`;

  const titleToken = normalizeTitleToken(title);
  if (!titleToken || !normalizedLevel) return "";
  return `${normalizedLevel}-TITLE-${titleToken}`;
};

export const buildAssignmentCatalogForLevel = (level) => {
  const normalizedLevel = normalizeLevel(level);
  const schedule = courseSchedules[normalizedLevel] || [];
  const seenByDay = {};

  return schedule
    .filter((entry) => entry?.assignment || entry?.assignmentId || entry?.assignment_id || entry?.assignmentKey)
    .map((entry) => {
      const dayKey = String(entry?.day ?? "");
      seenByDay[dayKey] = (seenByDay[dayKey] || 0) + 1;
      const occurrence = seenByDay[dayKey];
      const rawAssignmentId = entry.assignmentId || entry.assignment_id || entry.assignmentKey || "";
      const label = `Day ${entry.day}: ${entry.topic || "Assignment"}`;
      const canonicalAssignmentId =
        toCanonicalAssignmentId({ assignmentId: rawAssignmentId, level: normalizedLevel }) ||
        getFallbackKeyFromTitle({ level: normalizedLevel, assignmentTitle: label });

      return {
        day: entry.day,
        occurrence,
        topic: entry.topic || "",
        chapter: entry.chapter || "",
        label,
        assignmentId: rawAssignmentId,
        assignmentKey: canonicalAssignmentId,
        canonicalAssignmentId,
      };
    });
};

export const resolveAssignmentCanonicalKey = ({ level, assignmentId, assignmentTitle }) => {
  const normalizedLevel = normalizeLevel(level);
  const fromId = toCanonicalAssignmentId({ assignmentId, level: normalizedLevel });
  if (fromId) return fromId;
  return getFallbackKeyFromTitle({ level: normalizedLevel, assignmentTitle });
};

export const normalizeAssignmentKey = (value, level) =>
  resolveAssignmentCanonicalKey({ level, assignmentId: value, assignmentTitle: value }) || normalizeText(value);
