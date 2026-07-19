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

test("C1 opinion writing uses the approved concise model with recommendation and outlook", () => {
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain(
    "In der heutigen Zeit wird häufig über [Thema] diskutiert.",
  );
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain(
    "da es sowohl [Bereich 1] als auch [Bereich 2] betrifft",
  );
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain(
    "Ein wesentlicher Vorteil besteht darin, dass [Vorteil und Erklärung]",
  );
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain(
    "Andererseits sollte berücksichtigt werden, dass [Nachteil oder Problem]",
  );
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain(
    "Einige Menschen sind der Ansicht, dass [Gegenargument]",
  );
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain(
    "Dennoch bin ich der Auffassung, dass [eigene Position mit Begründung]",
  );
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain(
    "sowohl Chancen als auch Herausforderungen mit sich bringt",
  );
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain(
    "Daher wäre es empfehlenswert, [konkrete Maßnahme oder ausgewogene Lösung]",
  );
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain(
    "langfristig ein angemessener Ausgleich zwischen [Aspekt 1] und [Aspekt 2] geschaffen werden",
  );
  expect(C1_OPINION_ESSAY_TEMPLATE).not.toContain("INTRODUCTION");
  expect(C1_OPINION_ESSAY_TEMPLATE).not.toContain("ADVANTAGES");
  expect(C1_OPINION_ESSAY_TEMPLATE).not.toContain("PROPOSED SOLUTION");
  expect(C1_OPINION_ESSAY_TEMPLATE).not.toContain("personalisierte Werbung");
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
