import {
  C1_OPINION_ESSAY_TEMPLATE,
  LEGACY_C1_OPINION_ESSAY_TEMPLATES,
  migrateC1OpinionTemplateDraft,
  migrateGuidedWritingState,
  usesSingleWritingAndAnalysisBox,
} from "./GuidedWritingWorkspace";
import b2 from "../data/writingQuestionBuilders/b2Day1PersoenlicheIdentitaet";
import c1 from "../data/writingQuestionBuilders/c1Day2KulturUndIdentitaet";

test("B2 and C1 guided routes use exactly five existing questions", () => {
  expect(b2.questions).toHaveLength(5);
  expect(c1.questions).toHaveLength(5);
});

test("B2 and C1 use one shared writing and analysis box", () => {
  expect(usesSingleWritingAndAnalysisBox({ level: "B2" })).toBe(true);
  expect(usesSingleWritingAndAnalysisBox({ level: "c1" })).toBe(true);
  expect(usesSingleWritingAndAnalysisBox({ level: "B1" })).toBe(false);
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

test("C1 opinion writing uses the revised concise approved scaffold", () => {
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain(
    "In der heutigen Zeit wird oft über [Thema] diskutiert.",
  );
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain(
    "Dieses Thema ist von großer Bedeutung, da es sowohl [Bereich 1] als auch [Bereich 2] betrifft.",
  );
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain(
    "Ich vertrete die Ansicht, dass [eigene Meinung].",
  );
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain(
    "Zunächst ist festzustellen, dass [Grund / Hauptargument].",
  );
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain(
    "Andererseits sollte berücksichtigt werden, dass [Gegenargument / Nachteil].",
  );
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain(
    "Eine mögliche Lösung oder Alternative wäre, dass [Vorschlag / Alternative].",
  );
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain(
    "Zusammenfassend lässt sich festhalten, dass [kurzes Fazit].",
  );
  expect(C1_OPINION_ESSAY_TEMPLATE).toContain(
    "Ich bin der Auffassung, dass [eigene Position].",
  );
  expect(C1_OPINION_ESSAY_TEMPLATE).not.toContain("Einerseits bietet");
  expect(C1_OPINION_ESSAY_TEMPLATE).not.toContain("INTRODUCTION");
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
