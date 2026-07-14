import {
  A2_FORMAL_LETTER_TEMPLATE,
  A2_INFORMAL_LETTER_TEMPLATE,
} from "./A2WritingWorkspaceSupport";
import { inferQuestionOfDayTemplateId } from "./QuestionOfDayWritingTemplateController";
import { __TESTING__ } from "./QuestionOfDayWritingTemplateInjector";

const {
  A1_FORMAL_WRITING_TEMPLATE,
  A1_INFORMAL_WRITING_TEMPLATE,
  buildQuestionOfDayWritingTemplates,
} = __TESTING__;

const kindsFor = (level) =>
  buildQuestionOfDayWritingTemplates(level).map((template) => template.kind);

describe("Question of the Day writing templates", () => {
  test("A1 provides formal and informal templates with simple body guidance", () => {
    expect(kindsFor("A1")).toEqual(["informal", "formal"]);
    expect(A1_FORMAL_WRITING_TEMPLATE).toContain("ich hoffe, es geht Ihnen gut");
    expect(A1_FORMAL_WRITING_TEMPLATE).toContain(
      "einfachen deutschen Satz zu Punkt 1",
    );
    expect(A1_FORMAL_WRITING_TEMPLATE).toContain(
      "Ich freue mich im Voraus auf Ihre Antwort",
    );
    expect(A1_INFORMAL_WRITING_TEMPLATE).toContain(
      "wie geht es dir? Ich hoffe, es geht dir gut",
    );
    expect(A1_INFORMAL_WRITING_TEMPLATE).toContain(
      "einfachen deutschen Satz zu Punkt 1",
    );
    expect(A1_INFORMAL_WRITING_TEMPLATE).toContain(
      "Ich freue mich im Voraus auf deine Antwort",
    );
  });

  test("A2 reuses the existing editable formal and informal templates", () => {
    const templates = buildQuestionOfDayWritingTemplates("A2");
    expect(
      templates.find((template) => template.kind === "formal")?.template,
    ).toBe(A2_FORMAL_LETTER_TEMPLATE);
    expect(
      templates.find((template) => template.kind === "informal")?.template,
    ).toBe(A2_INFORMAL_LETTER_TEMPLATE);
  });

  test("B1 exposes formal, informal and opinion templates", () => {
    expect(kindsFor("B1")).toEqual(
      expect.arrayContaining(["formal", "informal", "opinion"]),
    );
  });

  test("B2 exposes opinion, formal and report templates", () => {
    expect(kindsFor("B2")).toEqual(
      expect.arrayContaining(["opinion", "formal", "report"]),
    );
  });

  test("C1 exposes opinion, formal, analysis, proposal and speech templates", () => {
    expect(kindsFor("C1")).toEqual(
      expect.arrayContaining([
        "opinion",
        "formal",
        "analysis",
        "proposal",
        "speech",
      ]),
    );
  });

  test.each([
    ["A1", "Schreiben Sie eine E-Mail an Ihren Freund Patrick.", "informal"],
    ["A2", "Schreiben Sie eine Beschwerde an eine Firma.", "formal"],
    [
      "B1",
      "Schreiben Sie einen Kommentar in einem Forum über Smartphones.",
      "opinion",
    ],
    [
      "B2",
      "Schreiben Sie einen Bericht über die Ergebnisse einer Kundenumfrage.",
      "report",
    ],
    [
      "C1",
      "Erstellen Sie eine Rede für eine Konferenz zum Thema digitale Ethik.",
      "speech",
    ],
    [
      "C1",
      "Schreiben Sie einen Projektvorschlag für eine internationale Kooperation.",
      "proposal",
    ],
  ])("recommends the matching %s template", (level, prompt, expectedKind) => {
    const templates = buildQuestionOfDayWritingTemplates(level);
    const recommendedId = inferQuestionOfDayTemplateId(
      level,
      prompt,
      templates,
    );
    expect(
      templates.find((template) => template.id === recommendedId)?.kind,
    ).toBe(expectedKind);
  });
});
