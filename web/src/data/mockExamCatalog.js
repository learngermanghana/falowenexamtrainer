const A2_SECTION_CARDS = Object.freeze([
  {
    key: "lesen",
    title: "Lesen",
    meta: "30 min",
    description: "Complete Teil 1–4 in the A2 reading mock.",
    actions: [{ label: "Start Lesen", to: "/campus/course/a2-mock-lesen-preview" }],
  },
  {
    key: "hoeren",
    title: "Hören",
    meta: "30 min",
    description: "Complete all four listening parts in order.",
    actions: [
      { label: "Teil 1", to: "/campus/course/a2-mock-hoeren-teil-1-preview" },
      { label: "Teil 2", to: "/campus/course/a2-mock-hoeren-teil-2-preview" },
      { label: "Teil 3", to: "/campus/course/a2-mock-hoeren-teil-3-preview" },
      { label: "Teil 4", to: "/campus/course/a2-mock-hoeren-teil-4-preview" },
    ],
  },
  {
    key: "schreiben",
    title: "Schreiben",
    meta: "30 min",
    description: "Complete the SMS task and the formal email task.",
    actions: [{ label: "Start Schreiben", to: "/campus/course/a2-mock-schreiben-preview" }],
  },
  {
    key: "sprechen",
    title: "Sprechen",
    meta: "ca. 15 min",
    description: "Complete all three speaking parts. Record your answers in German.",
    actions: [
      { label: "Teil 1", to: "/campus/course/a2-mock-sprechen-teil-1-preview" },
      { label: "Teil 2", to: "/campus/course/a2-mock-sprechen-teil-2-preview" },
      { label: "Teil 3", to: "/campus/course/a2-mock-sprechen-teil-3-preview" },
    ],
  },
]);

export const MOCK_EXAM_CATALOG = Object.freeze({
  "a1-final-01": {
    id: "a1-final-01",
    level: "A1",
    title: "A1 Final Mock Exam",
    shortTitle: "A1 Mock 1",
    description: "A complete timed A1 mock with autosave, scoring and a final result.",
    durationLabel: "about 80 min",
    status: "ready",
    route: "/campus/course/a1-final-mock-exam",
    mode: "full",
    questionSetId: "a1-final-01",
    sections: ["Lesen", "Hören", "Schreiben", "Sprechen"],
  },
  "b1-final-01": {
    id: "b1-final-01",
    level: "B1",
    title: "B1 Final Mock Exam",
    shortTitle: "B1 Mock 1",
    description: "A complete timed B1 mock with autosave, protected audio, AI-marked writing and speaking, and a final result.",
    durationLabel: "about 3 hr 20 min",
    status: "ready",
    route: "/campus/course/b1-final-mock-exam",
    mode: "full",
    questionSetId: "b1-final-01",
    sections: ["Lesen", "Hören", "Schreiben", "Sprechen"],
  },
  "a2-course-preview-01": {
    id: "a2-course-preview-01",
    level: "A2",
    title: "A2 exam-format practice",
    shortTitle: "A2 Course Mock",
    description: "The Day 29 exam-format practice across all four Goethe A2 sections.",
    durationLabel: "about 1 hr 45 min",
    status: "preview",
    route: "/campus/course/a2-mock-practice-preview",
    mode: "section-preview",
    questionSetId: "a2-course-preview-01",
    kicker: "A2 Mock Practice · Preview",
    badge: "A2 · Day 29",
    intro:
      "Work through Lesen, Hören, Schreiben and Sprechen under exam-style conditions. This mock is practice and does not increase the 28 required course assignments.",
    notice:
      "Use each section as focused exam practice. Answers are not yet saved across sections, so there is no unified score or final result yet.",
    sectionCards: A2_SECTION_CARDS,
    sections: ["Lesen", "Hören", "Schreiben", "Sprechen"],
    officialPracticeUrl: "https://www.goethe.de/ins/gh/en/spr/prf/gzsd2/ueb.html",
  },
});

export const getMockExam = (id) => MOCK_EXAM_CATALOG[id] || null;

export const getMockExamsForLevel = (level, { includeCourse = false } = {}) => {
  const normalizedLevel = String(level || "").trim().toUpperCase();
  return Object.values(MOCK_EXAM_CATALOG).filter(
    (exam) =>
      exam.level === normalizedLevel &&
      (includeCourse || exam.mode !== "section-preview"),
  );
};

export const buildPracticeMockConfig = ({
  id,
  level,
  title,
  description,
  durationLabel,
  route,
  questionSetId,
  sections = ["Lesen", "Hören", "Schreiben", "Sprechen"],
  status = "ready",
} = {}) => ({
  id,
  level: String(level || "").toUpperCase(),
  title,
  shortTitle: title,
  description,
  durationLabel,
  status,
  route,
  mode: "full",
  questionSetId: questionSetId || id,
  sections,
});
