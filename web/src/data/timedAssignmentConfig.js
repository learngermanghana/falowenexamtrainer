import { getA2B1LessonProfiles } from "./a2B1LessonProfile";

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

const A1_TIMED_ASSIGNMENT_CONFIG = Object.freeze({
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
    scope: "9 reading answers and one letter",
    timedTabs: ["teil-1", "teil-2", "teil-3"],
    preparationLabel: A1_PREP,
    mode: "mock",
  }),
  "A1-14.1": timed({
    level: "A1",
    durationMinutes: 35,
    scope: "5 reading answers, one letter and 10 vocabulary answers",
    timedTabs: ["teil-1", "teil-2", "teil-3", "teil-4"],
    preparationLabel: A1_PREP,
    mode: "mock",
  }),
});

const timedConfigFromProfiles = (level) =>
  Object.fromEntries(
    getA2B1LessonProfiles(level)
      .filter((profile) => profile?.assignmentKey && profile?.timer)
      .map((profile) => [
        profile.assignmentKey,
        Object.freeze({
          ...profile.timer,
          lessonProfileVersion: profile.version,
        }),
      ]),
  );

export const TIMED_ASSIGNMENT_CONFIG = Object.freeze({
  ...A1_TIMED_ASSIGNMENT_CONFIG,
  ...timedConfigFromProfiles("A2"),
  ...timedConfigFromProfiles("B1"),
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

export const getTimedAssignmentPhase = (level = "") =>
  TIMED_ASSIGNMENT_PHASES[String(level || "").trim().toUpperCase()] || null;
