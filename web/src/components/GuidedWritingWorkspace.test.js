import { C1_OPINION_ESSAY_TEMPLATE, migrateGuidedWritingState } from "./GuidedWritingWorkspace";
import b2 from "../data/writingQuestionBuilders/b2Day1PersoenlicheIdentitaet";
import c1 from "../data/writingQuestionBuilders/c1Day2KulturUndIdentitaet";
test("B2 and C1 guided routes use exactly five existing questions", () => { expect(b2.questions).toHaveLength(5); expect(c1.questions).toHaveLength(5); });
test("old final-view drafts migrate to protected manual combined text", () => { expect(migrateGuidedWritingState({ answers: { a: "one" }, finalEssay: "edited", view: "final", updatedAt: "date" })).toMatchObject({ answers: { a: "one" }, finalEssay: "edited", combinedDraftMode: "manual", updatedAt: "date" }); });
test("old question-only drafts remain automatic", () => { expect(migrateGuidedWritingState({ answers: { a: "one" }, view: "questions" }).combinedDraftMode).toBe("auto"); });
test("C1 opinion writing uses the complete structured template and optional closings", () => {
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain("C1 OPINION ESSAY · Use this for Meinungsbeitrag, Stellungnahme or argument writing");
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain("INTRODUCTION");
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain("ADVANTAGES");
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain("DISADVANTAGES");
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain("COUNTERARGUMENT");
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain("OWN POSITION");
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain("PROPOSED SOLUTION");
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain("CONCLUSION");
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain("Letztlich kommt es darauf an");
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain("Nur durch einen verantwortungsvollen und differenzierten Umgang");
  expect(C1_OPINION_ESSAY_TEMPLATE).not.toContain("Meiner Meinung nach [eigene Meinung].");
});
