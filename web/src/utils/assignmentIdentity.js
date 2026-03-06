import { courseSchedules } from "../data/courseSchedule";

const normalizeText = (value) => String(value || "").trim().toLowerCase();

const normalizeLevel = (level) => {
  const token = String(level || "").trim().toUpperCase();
  return /^(A1|A2|B1|B2|C1|C2)$/.test(token) ? token : "";
};

const normalizeAssignmentToken = (value) => String(value || "").trim().replace(/\s+/g, "").replace(/_/g, "-");

const toCanonicalAssignmentId = ({ assignmentId, level }) => {
  const normalizedLevel = normalizeLevel(level);
  const token = normalizeAssignmentToken(assignmentId);
  if (!token) return "";

  if (/^(A1|A2|B1|B2|C1|C2)-/i.test(token)) return token.toUpperCase();
  if (normalizedLevel) return `${normalizedLevel}-${token}`;
  return token;
};

export const buildAssignmentCatalogForLevel = (level) => {
  const normalizedLevel = normalizeLevel(level);
  const schedule = courseSchedules[normalizedLevel] || [];

  return schedule
    .filter((entry) => entry?.assignment || entry?.assignmentId || entry?.assignment_id || entry?.assignmentKey)
    .map((entry) => {
      const rawAssignmentId = entry.assignmentId || entry.assignment_id || entry.assignmentKey || "";
      const canonicalAssignmentId = toCanonicalAssignmentId({ assignmentId: rawAssignmentId, level: normalizedLevel });

      return {
        day: entry.day,
        topic: entry.topic || "",
        chapter: entry.chapter || "",
        label: `Day ${entry.day}: ${entry.topic || "Assignment"}`,
        assignmentId: rawAssignmentId,
        canonicalAssignmentId,
      };
    });
};

export const resolveAssignmentCanonicalKey = ({ level, assignmentId, assignmentTitle }) => {
  const normalizedLevel = normalizeLevel(level);
  const fromId = toCanonicalAssignmentId({ assignmentId, level: normalizedLevel });
  if (fromId) return fromId;

  const title = String(assignmentTitle || "").trim();
  if (!title) return "";

  const fromTitleToken = title.match(/\b(A1|A2|B1|B2|C1|C2)-\d+(?:\.\d+)?\b/i);
  if (fromTitleToken?.[0]) return fromTitleToken[0].toUpperCase();

  const dayMatch = title.match(/\bday\s*(\d+)\b/i);
  if (dayMatch?.[1] && normalizedLevel) return `${normalizedLevel}-DAY-${dayMatch[1]}`;

  return normalizeText(title);
};

