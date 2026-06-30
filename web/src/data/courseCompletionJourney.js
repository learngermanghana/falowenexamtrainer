const DEFAULT_COMPLETION_JOURNEY = {
  videoUrl: "",
  eyebrow: "Your next step",
  title: "Move from the Course Book to the Exams Room",
  completedTitle: "Congratulations — your course learning phase is complete",
  description:
    "The Course Book builds your language skills. The Exams Room now helps you practise the real exam structure, timing and task types.",
  completedDescription:
    "You have reached the end of the Course Book. Continue in the Exams Room to prepare with speaking, writing, reading and listening practice.",
  steps: [
    "Open the Exams Room and choose your current level.",
    "Start with the exam overview and study plan.",
    "Practise speaking, writing, reading and listening under exam conditions.",
    "Review weak areas and repeat practice until you feel ready.",
  ],
};

const COMPLETION_JOURNEYS = {
  A1: {
    ...DEFAULT_COMPLETION_JOURNEY,
    title: "After A1: prepare for the Goethe A1 exam",
    completedTitle: "You finished the A1 Course Book — now prepare for the exam",
  },
  A2: {
    ...DEFAULT_COMPLETION_JOURNEY,
    title: "After A2: prepare for the Goethe A2 exam",
    completedTitle: "You finished the A2 Course Book — now prepare for the exam",
  },
  B1: {
    ...DEFAULT_COMPLETION_JOURNEY,
    title: "After B1: prepare for the Goethe B1 exam",
    completedTitle: "You finished the B1 Course Book — now prepare for the exam",
  },
  B2: {
    ...DEFAULT_COMPLETION_JOURNEY,
    title: "After B2: prepare for the Goethe B2 exam",
    completedTitle: "You finished the B2 Course Book — now prepare for the exam",
  },
  C1: {
    ...DEFAULT_COMPLETION_JOURNEY,
    title: "After C1: prepare for the Goethe C1 exam",
    completedTitle: "You finished the C1 Course Book — now prepare for the exam",
  },
};

export const getCourseCompletionJourney = (level = "") =>
  COMPLETION_JOURNEYS[String(level || "").trim().toUpperCase()] || DEFAULT_COMPLETION_JOURNEY;

export default COMPLETION_JOURNEYS;
