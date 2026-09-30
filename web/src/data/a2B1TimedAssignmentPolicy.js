const A2_B1_PREPARATION_LABEL =
  "Grammar, Teil 1 speaking practice and reference notes stay open before you start. Start the timer only when you have enough uninterrupted time.";

const timedPolicy = ({ level, durationMinutes, mode = "practice" }) =>
  Object.freeze({
    level,
    durationMinutes,
    mode,
    autoSubmit: true,
    preparationLabel: A2_B1_PREPARATION_LABEL,
  });

export const A2_B1_TIMED_ASSIGNMENT_POLICY = Object.freeze({
  "A2-8.21": timedPolicy({ level: "A2", durationMinutes: 40 }),
  "A2-8.22": timedPolicy({ level: "A2", durationMinutes: 40 }),
  "A2-9.23": timedPolicy({ level: "A2", durationMinutes: 40 }),
  "A2-9.24": timedPolicy({ level: "A2", durationMinutes: 40 }),
  "A2-9.25": timedPolicy({ level: "A2", durationMinutes: 45 }),
  "A2-10.26": timedPolicy({ level: "A2", durationMinutes: 45 }),
  "A2-10.27": timedPolicy({ level: "A2", durationMinutes: 45, mode: "mock" }),
  "A2-10.28": timedPolicy({ level: "A2", durationMinutes: 45, mode: "mock" }),

  "B1-6.18": timedPolicy({ level: "B1", durationMinutes: 55 }),
  "B1-6.19": timedPolicy({ level: "B1", durationMinutes: 55 }),
  "B1-7.21": timedPolicy({ level: "B1", durationMinutes: 55 }),
  "B1-7.22": timedPolicy({ level: "B1", durationMinutes: 55 }),
  "B1-7.23": timedPolicy({ level: "B1", durationMinutes: 55 }),
  "B1-8.24": timedPolicy({ level: "B1", durationMinutes: 55 }),
  "B1-8.25": timedPolicy({ level: "B1", durationMinutes: 55 }),
  "B1-9.26": timedPolicy({ level: "B1", durationMinutes: 55 }),
  "B1-10.27": timedPolicy({ level: "B1", durationMinutes: 55, mode: "mock" }),
  "B1-10.28": timedPolicy({ level: "B1", durationMinutes: 60, mode: "mock" }),
});

export const getA2B1TimedAssignmentPolicy = (assignmentKey = "") =>
  A2_B1_TIMED_ASSIGNMENT_POLICY[String(assignmentKey || "").trim().toUpperCase()] || null;

export const getA2B1TimedAssignmentKeysForLevel = (level = "") => {
  const normalizedLevel = String(level || "").trim().toUpperCase();
  return Object.entries(A2_B1_TIMED_ASSIGNMENT_POLICY)
    .filter(([, policy]) => policy.level === normalizedLevel)
    .map(([key]) => key);
};

export { A2_B1_PREPARATION_LABEL };
