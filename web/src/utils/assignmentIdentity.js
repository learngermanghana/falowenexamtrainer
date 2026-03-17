import { courseSchedules } from "../data/courseSchedule";
import { CURRICULUM_BY_LEVEL, normalizeLevel as normalizeManifestLevel } from "../data/curriculumManifest";

const normalizeText = (value) => String(value || "").trim().toLowerCase();

const normalizeLevel = (level) => normalizeManifestLevel(level);

const normalizeAssignmentToken = (value) =>
  String(value || "")
    .trim()
    .replace(/\s+/g, "")
    .replace(/_/g, "-")
    .replace(/[^a-z0-9.-]/gi, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toUpperCase();

const getValidCanonicalIdsForLevel = (level) =>
  new Set((CURRICULUM_BY_LEVEL[level] || []).map((entry) => entry.canonicalAssignmentId));

const collectCandidateChapterTokens = (value = "") => {
  const text = String(value || "").trim();
  if (!text) return [];

  const out = [];
  const add = (token) => {
    if (!token) return;
    const normalized = String(token).trim();
    if (!normalized || out.includes(normalized)) return;
    out.push(normalized);
  };

  const levelExplicit = text.match(/\b(?:A1|A2|B1|B2|C1|C2)[\s-]*(\d+(?:\.\d+)?)\b/gi) || [];
  levelExplicit.forEach((match) => add(match.match(/(\d+(?:\.\d+)?)/)?.[1] || ""));

  const chapterExplicit = text.match(/\b(?:chapter|lektion|lesson|aufgabe|assignment|kapitel|id)\s*#?\s*(\d+(?:\.\d+)?)\b/gi) || [];
  chapterExplicit.forEach((match) => add(match.match(/(\d+(?:\.\d+)?)/)?.[1] || ""));

  const decimals = text.match(/\b\d+\.\d+\b/g) || [];
  decimals.forEach(add);

  const numerics = text.match(/\b\d+(?:\.\d+)?\b/g) || [];
  numerics.forEach(add);

  return out;
};

const resolveFromTextWithManifest = ({ level, text }) => {
  const normalizedLevel = normalizeLevel(level);
  if (!normalizedLevel) return "";

  const validCanonicalIds = getValidCanonicalIdsForLevel(normalizedLevel);
  if (!validCanonicalIds.size) return "";

  const candidates = collectCandidateChapterTokens(text);
  for (const chapterToken of candidates) {
    const canonical = `${normalizedLevel}-${chapterToken}`;
    if (validCanonicalIds.has(canonical)) return canonical;
  }

  return "";
};

export const toCanonicalAssignmentId = ({ assignmentId, level }) => {
  const normalizedLevel = normalizeLevel(level);
  const token = normalizeAssignmentToken(assignmentId);

  if (!token || !normalizedLevel) return "";

  const canonical = /^(A1|A2|B1|B2|C1|C2)-/i.test(token) ? token.toUpperCase() : `${normalizedLevel}-${token}`;
  return getValidCanonicalIdsForLevel(normalizedLevel).has(canonical) ? canonical : "";
};

export const resolveAssignmentCanonicalKey = ({ level, assignmentId, assignmentTitle }) => {
  const normalizedLevel = normalizeLevel(level);
  if (!normalizedLevel) return "";

  const fromId = resolveFromTextWithManifest({ level: normalizedLevel, text: assignmentId });
  if (fromId) return fromId;

  if (!String(assignmentId || "").trim()) {
    return resolveFromTextWithManifest({ level: normalizedLevel, text: assignmentTitle });
  }

  // Explicit assignment identifier was provided but did not resolve to a manifest entry.
  return "";
};

export const resolveAssignmentMatchKey = ({ level, assignmentId, assignmentTitle }) => {
  const normalizedLevel = normalizeLevel(level);
  if (!normalizedLevel) return "";

  return (
    resolveAssignmentCanonicalKey({
      level: normalizedLevel,
      assignmentId,
      assignmentTitle,
    }) || ""
  );
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

      const canonicalAssignmentId = resolveAssignmentCanonicalKey({
        level: normalizedLevel,
        assignmentId: rawAssignmentId,
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
        matchKey: canonicalAssignmentId,
      };
    });
};

export const normalizeAssignmentKey = (value, level) =>
  resolveAssignmentCanonicalKey({
    level,
    assignmentId: value,
    assignmentTitle: value,
  }) || normalizeText(value);
