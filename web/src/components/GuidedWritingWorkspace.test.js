import {
  C1_OPINION_ESSAY_TEMPLATE,
  LEGACY_C1_OPINION_ESSAY_TEMPLATES,
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

test("C1 opinion writing uses the approved topic-neutral model", () => {
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain("[Fragestellung / Titel]");
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain(
    "[Thema] kann nicht nur [positive Funktion], sondern auch [weitere Wirkung]",
  );
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain(
    "Ein gutes Beispiel hierfür ist [konkretes Beispiel]",
  );
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain(
    "Deshalb sind [Schutzprinzip 1] und [Schutzprinzip 2] von entscheidender Bedeutung",
  );
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain(
    "gleichermaßen eine wichtige Verantwortung tragen",
  );
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain(
    "sowohl Chancen als auch Risiken mit sich bringt",
  );
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain(
    "weder [extreme Position 1] noch [extreme Position 2]",
  );
  expect(C1_OPINION_ESSAY_TEMPLATE).not.toContain("INTRODUCTION");
  expect(C1_OPINION_ESSAY_TEMPLATE).not.toContain("ADVANTAGES");
  expect(C1_OPINION_ESSAY_TEMPLATE).not.toContain("PROPOSED SOLUTION");
  expect(C1_OPINION_ESSAY_TEMPLATE).not.toContain("personalisierte Werbung");
  expect(C1_OPINION_ESSAY_TEMPLATE).not.toContain("Unternehmen");
  expect(C1_OPINION_ESSAY_TEMPLATE).not.toContain("Verbraucherinnen");
});

test.each(LEGACY_C1_OPINION_ESSAY_TEMPLATES)(
  "an untouched saved legacy C1 opinion template upgrades automatically",
  (legacyTemplate) => {
    expect(
      migrateC1OpinionTemplateDraft({
        text: legacyTemplate,
        level: "C1",
        opinionMode: true,
      }),
    ).toBe(C1_OPINION_ESSAY_TEMPLATE);
  },
);

test("a learner-edited C1 draft is never overwritten by template migration", () => {
  const editedDraft = `${LEGACY_C1_OPINION_ESSAY_TEMPLATES[0]}\n\nMein eigener Satz.`;
  expect(
    migrateC1OpinionTemplateDraft({
      text: editedDraft,
      level: "C1",
      opinionMode: true,
    }),
  ).toBe(editedDraft);
});
