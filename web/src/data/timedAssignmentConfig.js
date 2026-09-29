export const TIMED_ASSIGNMENT_CONFIG = Object.freeze({
  "A1-12.3": Object.freeze({
    level: "A1",
    durationMinutes: 30,
    scope: "Two complete letters",
    timedTabs: Object.freeze(["teil-1", "teil-2"]),
    preparationLabel: "Grammar stays open for preparation.",
    autoSubmit: true,
  }),
  "A1-13": Object.freeze({
    level: "A1",
    durationMinutes: 35,
    scope: "9 reading answers and one letter",
    timedTabs: Object.freeze(["teil-1", "teil-2", "teil-3"]),
    preparationLabel: "Grammar stays open for preparation.",
    autoSubmit: true,
  }),
  "A1-14.1": Object.freeze({
    level: "A1",
    durationMinutes: 35,
    scope: "5 reading answers, one letter and 10 vocabulary answers",
    timedTabs: Object.freeze(["teil-1", "teil-2", "teil-3", "teil-4"]),
    preparationLabel: "Grammar stays open for preparation.",
    autoSubmit: true,
  }),
  "A2-10.27": Object.freeze({
    level: "A2",
    durationMinutes: 45,
    scope: "Teil 2 Schreiben, Teil 3 Lesen and the graded Teil 4 Hören",
    timedTabs: Object.freeze(["schreiben", "lesen", "hoeren"]),
    preparationLabel: "Grammar, Teil 1 speaking practice and reference notes stay open before you start.",
    autoSubmit: false,
  }),
  "A2-10.28": Object.freeze({
    level: "A2",
    durationMinutes: 45,
    scope: "Teil 2 Schreiben, Teil 3 Lesen and the graded Teil 4 Hören",
    timedTabs: Object.freeze(["schreiben", "lesen", "hoeren"]),
    preparationLabel: "Grammar, Teil 1 speaking practice and reference notes stay open before you start.",
    autoSubmit: false,
  }),
  "B1-6.18": Object.freeze({
    level: "B1",
    durationMinutes: 55,
    scope: "Teil 2 Schreiben, Teil 3 Lesen and Teil 4 Hören",
    timedTabs: Object.freeze(["schreiben", "lesen", "hoeren"]),
    preparationLabel: "Grammar, Teil 1 speaking practice and reference notes stay open before you start.",
    autoSubmit: false,
  }),
  "B1-6.19": Object.freeze({
    level: "B1",
    durationMinutes: 55,
    scope: "Teil 2 Schreiben, Teil 3 Lesen and Teil 4 Hören",
    timedTabs: Object.freeze(["schreiben", "lesen", "hoeren"]),
    preparationLabel: "Grammar, Teil 1 speaking practice and reference notes stay open before you start.",
    autoSubmit: false,
  }),
  "B1-7.22": Object.freeze({
    level: "B1",
    durationMinutes: 55,
    scope: "Teil 2 Schreiben, Teil 3 Lesen and the submitted Teil 4 reading task",
    timedTabs: Object.freeze(["schreiben", "lesen", "hoeren"]),
    preparationLabel: "Grammar, Teil 1 speaking practice and reference notes stay open before you start.",
    autoSubmit: false,
  }),
});

const normalizeAssignmentKey = (assignmentKey = "") =>
  String(assignmentKey || "").trim().toUpperCase();

export const getTimedAssignmentConfig = (assignmentKey = "") =>
  TIMED_ASSIGNMENT_CONFIG[normalizeAssignmentKey(assignmentKey)] || null;

export const getTimedAssignmentDurationSeconds = (assignmentKey = "") =>
  (getTimedAssignmentConfig(assignmentKey)?.durationMinutes || 0) * 60;

export const getTimedAssignmentKeysForLevel = (level = "") => {
  const normalizedLevel = String(level || "").trim().toUpperCase();
  return Object.entries(TIMED_ASSIGNMENT_CONFIG)
    .filter(([, value]) => value.level === normalizedLevel)
    .map(([key]) => key);
};
