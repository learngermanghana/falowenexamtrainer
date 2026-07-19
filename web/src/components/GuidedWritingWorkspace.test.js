import {
  C1_OPINION_ESSAY_TEMPLATE,
  LEGACY_C1_OPINION_ESSAY_TEMPLATE,
  migrateC1OpinionTemplateDraft,
  migrateGuidedWritingState,
} from "./GuidedWritingWorkspace";
import b2 from "../data/writingQuestionBuilders/b2Day1PersoenlicheIdentitaet";
import c1 from "../data/writingQuestionBuilders/c1Day2KulturUndIdentitaet";

test("B2 and C1 guided routes use exactly five existing questions", () => {
  expect(b2.questions).toHaveLength(5);
  expect(c1.questions).toHaveLength(5);
});

test("old final-view drafts migrate to protected manual combined text", () => {
  expect(migrateGuidedWritingState({ answers: { a: "one" }, finalEssay: "edited", view: "final", updatedAt: "date" })).toMatchObject({
    answers: { a: "one" },
    finalEssay: "edited",
    combinedDraftMode: "manual",
    updatedAt: "date",
  });
});

test("old question-only drafts remain automatic", () => {
  expect(migrateGuidedWritingState({ answers: { a: "one" }, view: "questions" }).combinedDraftMode).toBe("auto");
});

test("C1 opinion writing uses a universal structured template", () => {
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain("C1 OPINION ESSAY · Use this for Meinungsbeitrag, Stellungnahme or argument writing");
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain("INTRODUCTION");
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain("ADVANTAGES");
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain("DISADVANTAGES");
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain("COUNTERARGUMENT");
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain("OWN POSITION");
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain("PROPOSED SOLUTION");
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain("CONCLUSION");
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain("sowohl den Alltag vieler Menschen als auch gesellschaftliche Entwicklungen betrifft");
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain("Dieser Einwand ist insofern nachvollziehbar, als");
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain("unterschiedliche Interessen berücksichtigt und mögliche Nachteile begrenzt werden");
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain("weder ausschließlich positiv noch grundsätzlich negativ bewertet werden sollte");
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain("sowohl praktikabel als auch langfristig sinnvoll ist");
  expect(C1_OPINION_ESSAY_TEMPLATE).not.toContain("[Aspekt 1]");
  expect(C1_OPINION_ESSAY_TEMPLATE).not.toContain("OPTIONAL UNIVERSAL CLOSING SENTENCES");
  expect(C1_OPINION_ESSAY_TEMPLATE).not.toContain("Meiner Meinung nach [eigene Meinung].");
});

test("an untouched saved legacy C1 opinion template upgrades automatically", () => {
  expect(
    migrateC1OpinionTemplateDraft({
      text: LEGACY_C1_OPINION_ESSAY_TEMPLATE,
      level: "C1",
      opinionMode: true,
    }),
  ).toBe(C1_OPINION_ESSAY_TEMPLATE);
});

test("a learner-edited C1 draft is never overwritten by template migration", () => {
  const editedDraft = `${LEGACY_C1_OPINION_ESSAY_TEMPLATE}\n\nMein eigener Satz.`;
  expect(
    migrateC1OpinionTemplateDraft({
      text: editedDraft,
      level: "C1",
      opinionMode: true,
    }),
  ).toBe(editedDraft);
});
