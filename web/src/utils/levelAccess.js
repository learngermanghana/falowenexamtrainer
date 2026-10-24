export const LEVEL_ORDER = ["A1", "A2", "B1", "B2", "C1", "C2"];

export const normalizeCourseLevel = (value) => {
  const match = String(value || "")
    .toUpperCase()
    .match(/\b(A1|A2|B1|B2|C1|C2)\b/);

  return match ? match[1] : "";
};

export const getAccessibleLevels = (studentLevel, availableLevels = LEVEL_ORDER) => {
  const normalizedStudentLevel = normalizeCourseLevel(studentLevel) || "A1";
  const studentLevelIndex = LEVEL_ORDER.indexOf(normalizedStudentLevel);
  const maxAllowedIndex = studentLevelIndex >= 0 ? studentLevelIndex : 0;
  const normalizedAvailableLevels = Array.isArray(availableLevels)
    ? availableLevels.map(normalizeCourseLevel).filter(Boolean)
    : [];
  const availableLevelSet = new Set(normalizedAvailableLevels.length ? normalizedAvailableLevels : LEVEL_ORDER);

  const accessibleLevels = LEVEL_ORDER.filter((level, index) => index <= maxAllowedIndex && availableLevelSet.has(level));

  return accessibleLevels.length ? accessibleLevels : ["A1"];
};
