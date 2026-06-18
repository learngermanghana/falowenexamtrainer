export const normalizeStorageIdPart = (value) =>
  String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9._-]/g, "_")
    .slice(0, 160);

export const normalizeWorkbookAssignmentKey = (value) =>
  String(value || "")
    .trim()
    .toUpperCase()
    .replace(/_/g, "-")
    .replace(/\s+/g, "");

export const buildWorkbookStudentScopeKey = ({ userId, studentCode, studentEmail } = {}) =>
  [userId, studentCode, studentEmail]
    .map((part) => normalizeStorageIdPart(part || ""))
    .filter(Boolean)
    .join("__") || "anonymous";

export const buildCanonicalAssignmentLockId = ({ studentScopeKey, assignmentKey } = {}) => {
  const normalizedScope = normalizeStorageIdPart(studentScopeKey || "anonymous");
  const normalizedAssignment = normalizeStorageIdPart(normalizeWorkbookAssignmentKey(assignmentKey));
  if (!normalizedAssignment) return "";
  return `${normalizedScope}__${normalizedAssignment}`;
};

export const buildLegacyChapterKey = ({ chapter, day, occurrence = 1 } = {}) => {
  const normalizedChapter = normalizeStorageIdPart(chapter);
  if (normalizedChapter) return `chapter-${normalizedChapter}`;

  const numericDay = Number(day);
  if (!Number.isFinite(numericDay)) return "";
  const numericOccurrence = Number(occurrence);
  return numericOccurrence > 1 ? `day-${numericDay}-task-${numericOccurrence}` : `day-${numericDay}`;
};

export const buildLegacyAssignmentLockId = ({ studentScopeKey, level, chapterKey } = {}) => {
  const normalizedScope = normalizeStorageIdPart(studentScopeKey || "anonymous");
  const normalizedLevel = normalizeStorageIdPart(level || "general");
  const normalizedChapterKey = normalizeStorageIdPart(chapterKey || "unknown");
  return `${normalizedScope}__${normalizedLevel}__${normalizedChapterKey}`;
};

export const getWorkbookNavigationTabs = (level) => {
  const normalizedLevel = String(level || "").trim().toUpperCase();
  if (normalizedLevel === "A1") {
    return [
      { key: "assignment", label: "Assignment" },
      { key: "submit", label: "Submit" },
    ];
  }

  if (["A2", "B1"].includes(normalizedLevel)) {
    return [
      { key: "teil1", label: "Teil 1" },
      { key: "teil2", label: "Teil 2" },
      { key: "teil3", label: "Teil 3" },
      { key: "teil4", label: "Teil 4" },
      { key: "ref", label: "Ref" },
      { key: "submit", label: "Submit" },
    ];
  }

  return [];
};

export const getWorkbookNativeTabKey = (label) => {
  const normalized = String(label || "")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

  if (/teil\s*1\b/.test(normalized)) return "teil1";
  if (/teil\s*2\b/.test(normalized)) return "teil2";
  if (/teil\s*3\b/.test(normalized)) return "teil3";
  if (/teil\s*4\b/.test(normalized)) return "teil4";
  if (/\bref\b/.test(normalized) || /reference/.test(normalized)) return "ref";
  return "";
};
