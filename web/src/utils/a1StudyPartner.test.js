import { buildStudyPrompt, isStudyPartnerLesson, A1_STUDY_MODES, buildA1StudyPrompt, buildA1ChatGPTUrl, isA1StudyPartnerLesson } from "./a1StudyPartner";

const teacher = { kind: "assignment", day: 17, chapter: "11", title: "Instructions", assignmentKey: "A1-11", uid: "private-user", answers: "private-answer", token: "private-token" };
const independent = { kind: "practice", day: 6, chapter: "2.3", title: "Family and Hobbies" };

test("teacher prompt identifies exact assignment and active section without private data", () => {
  const prompt = buildA1StudyPrompt(teacher, "speaking", "Teil 1 · Sprechen");
  expect(prompt).toContain("Day 17, Kapitel 11");
  expect(prompt).toContain("A1-11");
  expect(prompt).toContain("Teil 1 · Sprechen");
  expect(prompt).toContain("Role-play");
  expect(prompt).toContain("Do not provide official assignment answers");
  expect(prompt).not.toContain("private-");
});

test("self-learning uses independent context and no official assignment reference", () => {
  const prompt = buildA1StudyPrompt(independent, "grammar");
  expect(prompt).toContain("Day 6, Kapitel 2.3");
  expect(prompt).toContain("self-learning material independently");
  expect(prompt).not.toContain("Official assignment reference");
  expect(prompt).toContain("Teach the grammar");
});

test("all five study modes build different prompts and URLs round trip", () => {
  const prompts = A1_STUDY_MODES.map(({ key }) => buildA1StudyPrompt(independent, key));
  expect(new Set(prompts).size).toBe(5);
  for (const prompt of prompts) {
    const url = new URL(buildA1ChatGPTUrl(prompt));
    expect(url.origin).toBe("https://chatgpt.com");
    expect(url.searchParams.get("q")).toBe(prompt);
  }
});

test("final mock and invalid lesson metadata are excluded", () => {
  expect(isA1StudyPartnerLesson({ ...teacher, title: "A1 Final Mock Exam" })).toBe(false);
  expect(isA1StudyPartnerLesson({ ...teacher, destination: "/campus/course/a1-final-mock-exam" })).toBe(false);
  expect(buildA1StudyPrompt({})).toBe("");
});

test("A2 uses its own level, exact chapter and assignment instead of A1", () => {
  const prompt = buildStudyPrompt({ kind: "assignment", day: 6, chapter: "3.6", title: "Möbel und Räume", assignmentKey: "A2-3.6", uid: "private-record" }, "speaking", "Speaking practice", "A2");
  expect(prompt).toContain("German A2 study partner");
  expect(prompt).toContain("Kapitel 3.6");
  expect(prompt).toContain("A2-3.6");
  expect(prompt).toContain("realistic A2 conversation");
  expect(prompt).not.toContain("A1");
  expect(prompt).not.toContain("private-record");
});

test("A2 self-study and assessment exclusion remain distinct", () => {
  const lesson = { kind: "practice", day: 22, chapter: "8.22", title: "Die Woche Planung", assignmentKey: "A2-8.22" };
  const prompt = buildStudyPrompt(lesson, "grammar", "Self-learning grammar notes", "A2");
  expect(prompt).toContain("self-learning material independently");
  expect(prompt).not.toContain("Official assignment reference");
  expect(isStudyPartnerLesson({ ...lesson, title: "Goethe A2 Speaking Mock" }, "A2")).toBe(false);
  expect(buildStudyPrompt(lesson, "grammar", "", "B1")).toBe("");
});
