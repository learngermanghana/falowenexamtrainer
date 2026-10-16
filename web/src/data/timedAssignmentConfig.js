import { getA2B1LessonProfile } from "./a2B1LessonProfile";

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

const A1_PREP = "Grammar and reference material stay open before you start. Start the timer only when you have enough uninterrupted time.";
const A2_B1_PREP = "Grammar, Teil 1 speaking practice and reference notes stay open before you start. Start the timer only when you have enough uninterrupted time.";

export const TIMED_ASSIGNMENT_PHASES = Object.freeze({
  A1: Object.freeze({
    startDay: 16,
    week: 4,
    title: "Timed practice begins this week",
    message: "From this week, every tutor-marked A1 assignment is timed. The purpose is to build time-management habits gradually before exam preparation. The clock starts only when you choose Start, so prepare first and begin when you have uninterrupted time.",
  }),
  A2: Object.freeze({
    startDay: 21,
    week: 5,
    title: "Timed practice begins this week",
    message: "From this week, every tutor-marked A2 assignment is timed. This helps you practise working independently, managing your time and finishing within realistic exam-style limits. Self-check Hören stays outside the timer; only submitted work is timed.",
  }),
  B1: Object.freeze({
    startDay: 21,
    week: 5,
    title: "Timed practice begins this week",
    message: "From this week, every tutor-marked B1 assignment is timed. The goal is stronger time management, independent work and exam readiness. Self-check or unavailable Hören is not timed; the clock applies to the work you actually submit.",
  }),
});

const BASE_TIMED_ASSIGNMENT_CONFIG = Object.freeze({
  // A1 · Week 4 onward: every tutor-marked assignment is timed.
  "A1-9": timed({
    level: "A1",
    durationMinutes: 20,
    scope: "Teil 1 Lesen, Teil 2 Hören and Teil 3 Schreiben",
    timedTabs: ["teil-1", "teil-2", "teil-3"],
    preparationLabel: A1_PREP,
  }),
  "A1-10": timed({
    level: "A1",
    durationMinutes: 20,
    scope: "Teil 1 Lesen/Schreiben and Teil 2 Hören",
    timedTabs: ["teil-1", "teil-2"],
    preparationLabel: A1_PREP,
  }),
  "A1-11": timed({
    level: "A1",
    durationMinutes: 25,
    scope: "the three tutor-marked Instructions sections",
    timedTabs: ["teil-1", "teil-2", "teil-3"],
    preparationLabel: A1_PREP,
  }),
  "A1-12.1": timed({
    level: "A1",
    durationMinutes: 25,
    scope: "Teil 1 Lesen, Teil 2 Lesen and Teil 3 Hören",
    timedTabs: ["teil-1", "teil-2", "teil-3"],
    preparationLabel: A1_PREP,
  }),
  "A1-12.2": timed({
    level: "A1",
    durationMinutes: 25,
    scope: "Teil 1 Lesen, Teil 2 Lesen and Teil 3 Hören",
    timedTabs: ["teil-1", "teil-2", "teil-3"],
    preparationLabel: A1_PREP,
  }),
  "A1-12.3": timed({
    level: "A1",
    durationMinutes: 30,
    scope: "Two complete letters",
    timedTabs: ["teil-1", "teil-2"],
    preparationLabel: A1_PREP,
    mode: "mock",
  }),
  "A1-13": timed({
    level: "A1",
    durationMinutes: 35,
    scope: "10 reading answers and one independent 35–50 word letter",
    timedTabs: ["teil-1", "teil-2", "teil-3"],
    preparationLabel: "Controlled mock: prepare first. Start the timer only when you have enough uninterrupted time, then complete the reading and letter independently. Mark My Letter is unavailable while the timer is running.",
    mode: "mock",
  }),
  "A1-14.1": timed({
    level: "A1",
    durationMinutes: 30,
    scope: "10 reading answers and 6 listening answers",
    timedTabs: ["teil-1", "teil-2", "teil-3"],
    preparationLabel: "Final independent challenge: read the advertisements and appointment email, then complete the listening questions. Start the timer only when you have enough uninterrupted time.",
    mode: "mock",
  }),

  // A2 · Week 5 onward: every tutor-marked workbook is timed.
  "A2-8.21": timed({
    level: "A2",
    durationMinutes: 20,
    scope: "Teil 2 Schreiben and Teil 3 Lesen",
    timedTabs: ["schreiben", "lesen"],
    preparationLabel: A2_B1_PREP,
  }),
  "A2-8.22": timed({
    level: "A2",
    durationMinutes: 30,
    scope: "Teil 2 Schreiben and Teil 3 Lesen",
    timedTabs: ["schreiben", "lesen"],
    preparationLabel: A2_B1_PREP,
  }),
  "A2-9.23": timed({
    level: "A2",
    durationMinutes: 10,
    scope: "Teil 3 Lesen",
    timedTabs: ["lesen"],
    preparationLabel: A2_B1_PREP,
  }),
  "A2-9.24": timed({
    level: "A2",
    durationMinutes: 40,
    scope: "Teil 2 Schreiben and Teil 3 Lesen",
    timedTabs: ["schreiben", "lesen"],
    preparationLabel: A2_B1_PREP,
  }),
  "A2-9.25": timed({
    level: "A2",
    durationMinutes: 10,
    scope: "Teil 3 Lesen",
    timedTabs: ["lesen"],
    preparationLabel: A2_B1_PREP,
  }),
  "A2-10.26": timed({
    level: "A2",
    durationMinutes: 45,
    scope: "Teil 2 Schreiben and Teil 3 Lesen",
    timedTabs: ["schreiben", "lesen"],
    preparationLabel: A2_B1_PREP,
  }),
  "A2-10.27": timed({
    level: "A2",
    durationMinutes: 45,
    scope: "Teil 2 Schreiben, Teil 3 Lesen and the graded Teil 4 Hören",
    timedTabs: ["schreiben", "lesen", "hoeren"],
    preparationLabel: A2_B1_PREP,
    mode: "mock",
  }),
  "A2-10.28": timed({
    level: "A2",
    durationMinutes: 45,
    scope: "Teil 2 Schreiben, Teil 3 Lesen and the graded Teil 4 Hören",
    timedTabs: ["schreiben", "lesen", "hoeren"],
    preparationLabel: A2_B1_PREP,
    mode: "mock",
  }),

  // B1 · earlier checkpoints, followed by every tutor-marked workbook from Week 5.
  "B1-6.18": timed({
    level: "B1",
    durationMinutes: 55,
    scope: "Teil 2 Schreiben, Teil 3 Lesen and Teil 4 Hören",
    timedTabs: ["schreiben", "lesen", "hoeren"],
    preparationLabel: A2_B1_PREP,
  }),
  "B1-6.19": timed({
    level: "B1",
    durationMinutes: 55,
    scope: "Teil 2 Schreiben, Teil 3 Lesen and the submitted Teil 4 reading task",
    timedTabs: ["schreiben", "lesen", "hoeren"],
    preparationLabel: A2_B1_PREP,
  }),
  "B1-7.21": timed({
    level: "B1",
    durationMinutes: 55,
    scope: "Teil 2 Schreiben and Teil 3 Lesen",
    timedTabs: ["schreiben", "lesen"],
    preparationLabel: A2_B1_PREP,
  }),
  "B1-7.22": timed({
    level: "B1",
    durationMinutes: 55,
    scope: "Teil 2 Schreiben, Teil 3 Lesen and the submitted Teil 4 reading task",
    timedTabs: ["schreiben", "lesen", "hoeren"],
    preparationLabel: A2_B1_PREP,
  }),
  "B1-7.23": timed({
    level: "B1",
    durationMinutes: 55,
    scope: "Teil 2 Schreiben and Teil 3 Lesen",
    timedTabs: ["schreiben", "lesen"],
    preparationLabel: A2_B1_PREP,
  }),
  "B1-8.24": timed({
    level: "B1",
    durationMinutes: 55,
    scope: "Teil 2 Schreiben and Teil 3 Lesen",
    timedTabs: ["schreiben", "lesen"],
    preparationLabel: A2_B1_PREP,
  }),
  "B1-8.25": timed({
    level: "B1",
    durationMinutes: 55,
    scope: "Teil 2 Schreiben and Teil 3 Lesen",
    timedTabs: ["schreiben", "lesen"],
    preparationLabel: A2_B1_PREP,
  }),
  "B1-9.26": timed({
    level: "B1",
    durationMinutes: 55,
    scope: "Teil 2 Schreiben and Teil 3 Lesen",
    timedTabs: ["schreiben", "lesen"],
    preparationLabel: A2_B1_PREP,
  }),
  "B1-10.27": timed({
    level: "B1",
    durationMinutes: 55,
    scope: "Teil 2 Schreiben and Teil 3 Lesen",
    timedTabs: ["schreiben", "lesen"],
    preparationLabel: A2_B1_PREP,
    mode: "mock",
  }),
  "B1-10.28": timed({
    level: "B1",
    durationMinutes: 60,
    scope: "Teil 2 Schreiben and Teil 3 Lesen",
    timedTabs: ["schreiben", "lesen"],
    preparationLabel: A2_B1_PREP,
    mode: "mock",
  }),
});

const normalizeAssignmentKey = (assignmentKey = "") =>
  String(assignmentKey || "").trim().toUpperCase();

const resolveAssignmentDay = (assignmentKey = "") => {
  const normalized = normalizeAssignmentKey(assignmentKey);
  const match = normalized.match(/(?:^|[.-])(\d{1,2})$/);
  return match ? Number(match[1]) : 0;
};

const profileTimedTab = (part = {}) => {
  if (part.sectionKey === "writing") return "schreiben";
  if (part.sectionKey === "reading") return "lesen";
  if (part.sectionKey === "part4") return "hoeren";
  return "";
};

const joinTimedScope = (parts = []) => {
  const labels = parts.map((part) => `Teil ${part.number} ${part.label}`);
  if (labels.length <= 1) return labels[0] || "submitted workbook work";
  if (labels.length === 2) return `${labels[0]} and ${labels[1]}`;
  return `${labels.slice(0, -1).join(", ")} and ${labels.at(-1)}`;
};

const alignTimedConfigWithLessonProfile = (assignmentKey, config) => {
  if (!config || !["A2", "B1"].includes(config.level)) return config;
  const day = resolveAssignmentDay(assignmentKey);
  const profile = getA2B1LessonProfile(config.level, day);
  if (!profile) return config;

  const requiredParts = profile.requiredSubmissionParts || [];
  const timedTabs = requiredParts.map(profileTimedTab).filter(Boolean);
  return Object.freeze({
    ...config,
    scope: joinTimedScope(requiredParts),
    timedTabs: freezeTabs(timedTabs),
    lessonProfileVersion: profile.version,
  });
};

export const TIMED_ASSIGNMENT_CONFIG = Object.freeze(
  Object.fromEntries(
    Object.entries(BASE_TIMED_ASSIGNMENT_CONFIG).map(([assignmentKey, config]) => [
      assignmentKey,
      alignTimedConfigWithLessonProfile(assignmentKey, config),
    ]),
  ),
);

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

export const getTimedAssignmentPhase = (level = "") =>
  TIMED_ASSIGNMENT_PHASES[String(level || "").trim().toUpperCase()] || null;
