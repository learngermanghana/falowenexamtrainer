import {
  analyzePrepositionCaseCoach,
  tokenizeGermanText,
} from "./prepositionCaseCoach";

const firstIssue = (text, level = "B2") =>
  analyzePrepositionCaseCoach(text, { level })[0];

describe("Preposition Case Coach rule engine", () => {
  test.each([
    ["mit einem wichtig Projekt", "mit einem wichtigen Projekt", "dative", "en"],
    ["für eine besser Zukunft", "für eine bessere Zukunft", "accusative", "e"],
    ["von der modern Technologie", "von der modernen Technologie", "dative", "en"],
    ["wegen eines schwer Problem", "wegen eines schweren Problem", "genitive", "en"],
    ["in einem groß Gebäude", "in einem großen Gebäude", "dative", "en"],
  ])("detects %s", (text, correction, grammaticalCase, ending) => {
    const issue = firstIssue(text);

    expect(issue).toMatchObject({
      fullCorrection: correction,
      case: grammaticalCase,
      expectedEnding: ending,
      confidence: 1,
    });
  });

  test.each([
    "mit einem wichtigen Projekt",
    "für eine bessere Zukunft",
    "von der modernen Technologie",
    "Das Projekt ist wichtig.",
    "mit moderner Technologie",
  ])("does not flag correct or unsupported phrase: %s", (text) => {
    expect(analyzePrepositionCaseCoach(text, { level: "C1" })).toEqual([]);
  });

  test.each(["A1", "A2", "B1"])("is disabled for %s", (level) => {
    expect(
      analyzePrepositionCaseCoach("mit einem wichtig Projekt", { level }),
    ).toEqual([]);
  });

  it("returns no hints for empty and incomplete drafts", () => {
    expect(analyzePrepositionCaseCoach("", { level: "B2" })).toEqual([]);
    expect(
      analyzePrepositionCaseCoach("mit einem wichtig", { level: "B2" }),
    ).toEqual([]);
  });

  it("tokenises umlauts and sharp s with exact offsets", () => {
    const text = "Wir planen für eine schön Überlegung.";
    const tokens = tokenizeGermanText(text);
    const issue = firstIssue(text);

    expect(tokens.map((token) => token.value)).toEqual([
      "Wir",
      "planen",
      "für",
      "eine",
      "schön",
      "Überlegung",
    ]);
    expect(text.slice(issue.start, issue.end)).toBe(issue.phrase);
    expect(issue.fullCorrection).toBe("für eine schöne Überlegung");
  });

  it("handles punctuation after the noun", () => {
    const text = "Wir arbeiten mit einem wichtig Projekt, heute.";
    const issue = firstIssue(text);

    expect(issue.phrase).toBe("einem wichtig Projekt");
    expect(text.slice(issue.start, issue.end)).toBe("einem wichtig Projekt");
    expect(issue.fullCorrection).toBe("mit einem wichtigen Projekt");
  });

  it("supports possessive and der-word determiners", () => {
    expect(firstIssue("mit meinem wichtig Projekt").fullCorrection).toBe(
      "mit meinem wichtigen Projekt",
    );
    expect(firstIssue("mit diesem wichtig Projekt").fullCorrection).toBe(
      "mit diesem wichtigen Projekt",
    );
  });

  it("skips ambiguous determiner forms when endings could differ", () => {
    expect(
      analyzePrepositionCaseCoach("für die modern Projekte", { level: "B2" }),
    ).toEqual([]);
  });
});
