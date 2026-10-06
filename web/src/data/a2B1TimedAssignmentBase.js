const freezeTabs = (tabs) => Object.freeze(tabs);

const timed = ({
  level,
  durationMinutes,
  scope,
  timedTabs,
  preparationLabel,
  mode = "practice",
  autoSubmit = true,
}) => Object.freeze({
  level,
  durationMinutes,
  scope,
  timedTabs: freezeTabs(timedTabs),
  preparationLabel,
  mode,
  autoSubmit,
});

const A2_B1_PREP = "Grammar, Teil 1 speaking practice and reference notes stay open before you start. Start the timer only when you have enough uninterrupted time.";

export const A2_B1_BASE_TIMED_ASSIGNMENT_CONFIG = Object.freeze({
  "A2-8.21": timed({ level: "A2", durationMinutes: 40, scope: "Teil 2 Schreiben and Teil 3 Lesen", timedTabs: ["schreiben", "lesen"], preparationLabel: A2_B1_PREP }),
  "A2-8.22": timed({ level: "A2", durationMinutes: 30, scope: "Teil 2 Schreiben and Teil 3 Lesen", timedTabs: ["schreiben", "lesen"], preparationLabel: A2_B1_PREP }),
  "A2-9.23": timed({ level: "A2", durationMinutes: 40, scope: "Teil 3 Lesen", timedTabs: ["lesen"], preparationLabel: A2_B1_PREP }),
  "A2-9.24": timed({ level: "A2", durationMinutes: 40, scope: "Teil 2 Schreiben, Teil 3 Lesen and Teil 4 Hören", timedTabs: ["schreiben", "lesen", "hoeren"], preparationLabel: A2_B1_PREP }),
  "A2-9.25": timed({ level: "A2", durationMinutes: 45, scope: "Teil 3 Lesen", timedTabs: ["lesen"], preparationLabel: A2_B1_PREP }),
  "A2-10.26": timed({ level: "A2", durationMinutes: 45, scope: "Teil 2 Schreiben, Teil 3 Lesen and Teil 4 Hören", timedTabs: ["schreiben", "lesen", "hoeren"], preparationLabel: A2_B1_PREP }),
  "A2-10.27": timed({ level: "A2", durationMinutes: 45, scope: "Teil 3 Lesen and Teil 4 Hören", timedTabs: ["lesen", "hoeren"], preparationLabel: A2_B1_PREP, mode: "mock" }),
  "A2-10.28": timed({ level: "A2", durationMinutes: 45, scope: "Teil 2 Schreiben, Teil 3 Lesen and Teil 4 Hören", timedTabs: ["schreiben", "lesen", "hoeren"], preparationLabel: A2_B1_PREP, mode: "mock" }),
  "B1-6.18": timed({ level: "B1", durationMinutes: 55, scope: "Teil 2 Schreiben, Teil 3 Lesen and Teil 4 Hören", timedTabs: ["schreiben", "lesen", "hoeren"], preparationLabel: A2_B1_PREP }),
  "B1-6.19": timed({ level: "B1", durationMinutes: 55, scope: "Teil 3 Lesen and Teil 4 Lesen", timedTabs: ["lesen", "hoeren"], preparationLabel: A2_B1_PREP }),
  "B1-7.21": timed({ level: "B1", durationMinutes: 55, scope: "Teil 2 Schreiben and Teil 3 Lesen", timedTabs: ["schreiben", "lesen"], preparationLabel: A2_B1_PREP }),
  "B1-7.22": timed({ level: "B1", durationMinutes: 55, scope: "Teil 3 Lesen and Teil 4 Lesen", timedTabs: ["lesen", "hoeren"], preparationLabel: A2_B1_PREP }),
  "B1-7.23": timed({ level: "B1", durationMinutes: 55, scope: "Teil 2 Schreiben and Teil 3 Lesen", timedTabs: ["schreiben", "lesen"], preparationLabel: A2_B1_PREP }),
  "B1-8.24": timed({ level: "B1", durationMinutes: 55, scope: "Teil 2 Schreiben and Teil 3 Lesen", timedTabs: ["schreiben", "lesen"], preparationLabel: A2_B1_PREP }),
  "B1-8.25": timed({ level: "B1", durationMinutes: 55, scope: "Teil 3 Lesen", timedTabs: ["lesen"], preparationLabel: A2_B1_PREP }),
  "B1-9.26": timed({ level: "B1", durationMinutes: 55, scope: "Teil 2 Schreiben and Teil 3 Lesen", timedTabs: ["schreiben", "lesen"], preparationLabel: A2_B1_PREP }),
  "B1-10.27": timed({ level: "B1", durationMinutes: 55, scope: "Teil 2 Schreiben and Teil 3 Lesen", timedTabs: ["schreiben", "lesen"], preparationLabel: A2_B1_PREP, mode: "mock" }),
  "B1-10.28": timed({ level: "B1", durationMinutes: 60, scope: "Teil 2 Schreiben and Teil 3 Lesen", timedTabs: ["schreiben", "lesen"], preparationLabel: A2_B1_PREP, mode: "mock" }),
});

const normalizeAssignmentKey = (assignmentKey = "") =>
  String(assignmentKey || "").trim().toUpperCase();

export const getA2B1BaseTimedAssignmentConfig = (assignmentKey = "") =>
  A2_B1_BASE_TIMED_ASSIGNMENT_CONFIG[normalizeAssignmentKey(assignmentKey)] || null;
