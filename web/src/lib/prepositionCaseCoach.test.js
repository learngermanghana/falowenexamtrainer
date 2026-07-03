import {
  analyzePrepositionCaseCoach,
  tokenizeGermanText,
} from "./prepositionCaseCoach";

const firstIssue = (text, level = "B2", options = {}) =>
  analyzePrepositionCaseCoach(text, { level, ...options })[0];

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
      issueType: "adjective-ending",
    });
  });

  test.each([
    ["mit einen", "mit einem", "dative"],
    ["mit ein", "mit einem", "dative"],
    ["mit eine", "mit einer", "dative"],
    ["mit das", "mit dem", "dative"],
    ["wegen einem", "wegen eines", "genitive"],
    ["wegen eine", "wegen einer", "genitive"],
    ["für einer", "für eine", "accusative"],
  ])("corrects clear article-case error %s", (text, correction, grammaticalCase) => {
    const issue = firstIssue(text);

    expect(issue).toMatchObject({
      fullPhrase: text,
      fullCorrection: correction,
      case: grammaticalCase,
      issueType: "determiner-case",
      confidence: 1,
    });
  });

  it("detects the screenshot phrase before noun capitalization is corrected", () => {
    const text = "Ich denke, die Regierung sollte mit einen großen unterschiede arbeiten.";
    const issue = firstIssue(text, "C1");

    expect(issue.fullPhrase).toBe("mit einen");
    expect(issue.fullCorrection).toBe("mit einem");
    expect(issue.hint).toMatch(/requires dative/i);
    expect(text.slice(issue.fullStart, issue.end)).toBe("mit einen");
  });

  it("skips article corrections when gender or number would change the answer", () => {
    expect(analyzePrepositionCaseCoach("für einem", { level: "B2" })).toEqual([]);
    expect(analyzePrepositionCaseCoach("mit die", { level: "B2" })).toEqual([]);
  });

  test.each([
    ["im modern Gebäude", "im modernen Gebäude", "dative", "en"],
    ["am neu Standort", "am neuen Standort", "dative", "en"],
    ["beim wichtig Gespräch", "beim wichtigen Gespräch", "dative", "en"],
    ["vom aktuell Projekt", "vom aktuellen Projekt", "dative", "en"],
    ["zum nächst Termin", "zum nächsten Termin", "dative", "en"],
    ["zur beruflich Entwicklung", "zur beruflichen Entwicklung", "dative", "en"],
    ["ins schön Gebäude", "ins schöne Gebäude", "accusative", "e"],
    ["ans ruhig Meer", "ans ruhige Meer", "accusative", "e"],
  ])("supports contracted preposition %s", (text, correction, grammaticalCase, ending) => {
    const issue = firstIssue(text);

    expect(issue).toMatchObject({
      fullCorrection: correction,
      case: grammaticalCase,
      expectedEnding: ending,
      contracted: true,
    });
    expect(issue.explanation).toMatch(/short for/i);
  });

  it("corrects safe multi-adjective phrases", () => {
    const issue = firstIssue("mit einem wichtig international Projekt");

    expect(issue.fullCorrection).toBe(
      "mit einem wichtigen internationalen Projekt",
    );
    expect(issue.adjectives).toEqual(["wichtig", "international"]);
    expect(issue.incorrectAdjectives).toEqual(["wichtig", "international"]);
    expect(issue.confidence).toBe(0.95);
  });

  it("keeps already-correct adjectives while correcting another adjective", () => {
    const issue = firstIssue("mit einem wichtigen international Projekt");

    expect(issue.fullCorrection).toBe(
      "mit einem wichtigen internationalen Projekt",
    );
    expect(issue.incorrectAdjectives).toEqual(["international"]);
  });

  it("skips uncertain multi-word sequences containing an adverb", () => {
    expect(
      analyzePrepositionCaseCoach("mit einem sehr wichtig Projekt", { level: "B2" }),
    ).toEqual([]);
  });

  test.each([
    ["mit einem hoch Gebäude", "mit einem hohen Gebäude"],
    ["mit einem hohe Gebäude", "mit einem hohen Gebäude"],
    ["mit einem teuer Projekt", "mit einem teuren Projekt"],
    ["mit einem dunkel Raum", "mit einem dunklen Raum"],
    ["mit einem offen Fenster", "mit einem offenen Fenster"],
  ])("uses a safe adjective stem for %s", (text, correction) => {
    expect(firstIssue(text).fullCorrection).toBe(correction);
  });

  test.each([
    "mit einem wichtigen Projekt",
    "für eine bessere Zukunft",
    "von der modernen Technologie",
    "im modernen Gebäude",
    "mit einem hohen Gebäude",
    "mit einem teuren Projekt",
    "mit einem offenen Fenster",
    "mit einem wichtigen internationalen Projekt",
    "Das Projekt ist wichtig.",
    "mit moderner Technologie",
    "mit einem",
  ])("does not flag correct or unsupported phrase: %s", (text) => {
    expect(analyzePrepositionCaseCoach(text, { level: "C1" })).toEqual([]);
  });

  test.each(["A1", "A2", "B1"])("stays disabled by default for %s", (level) => {
    expect(
      analyzePrepositionCaseCoach("mit einen", { level }),
    ).toEqual([]);
  });

  test.each(["A1", "A2", "B1", "B2", "C1"])(
    "supports %s in all-level Mark My Letter mode",
    (level) => {
      expect(
        analyzePrepositionCaseCoach("mit einen", {
          level,
          allowAllLevels: true,
        })[0].fullCorrection,
      ).toBe("mit einem");
    },
  );

  it("returns no hints for empty and incomplete adjective drafts", () => {
    expect(analyzePrepositionCaseCoach("", { level: "B2" })).toEqual([]);
    expect(
      analyzePrepositionCaseCoach("mit einem wichtig", { level: "B2" }),
    ).toEqual([]);
    expect(
      analyzePrepositionCaseCoach("im wichtig", { level: "B2" }),
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
    expect(text.slice(issue.fullStart, issue.end)).toBe(issue.fullPhrase);
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
