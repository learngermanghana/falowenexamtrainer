import { analyzePrepositionCaseCoach } from "./prepositionCaseCoachSupplement";

describe("Preposition Case Coach supplemental articleless rules", () => {
  it("detects von öffentliche Verkehrsmittel", () => {
    const issue = analyzePrepositionCaseCoach(
      "Bei der Beurteilung von öffentliche Verkehrsmittel sollten mehrere Kriterien berücksichtigt werden.",
      { level: "C1" },
    )[0];

    expect(issue).toMatchObject({
      fullPhrase: "von öffentliche Verkehrsmittel",
      fullCorrection: "von öffentlichen Verkehrsmitteln",
      case: "dative",
      expectedEnding: "en",
      issueType: "articleless-case",
      confidence: 1,
    });
  });

  it("does not flag the corrected phrase", () => {
    expect(
      analyzePrepositionCaseCoach(
        "Bei der Beurteilung von öffentlichen Verkehrsmitteln sollten mehrere Kriterien berücksichtigt werden.",
        { level: "C1" },
      ),
    ).toEqual([]);
  });

  it("keeps the original coach rules working", () => {
    const issue = analyzePrepositionCaseCoach("mit einem wichtig Projekt", {
      level: "B2",
    })[0];

    expect(issue.fullCorrection).toBe("mit einem wichtigen Projekt");
    expect(issue.issueType).toBe("adjective-ending");
  });

  it("stays disabled for unsupported levels by default", () => {
    expect(
      analyzePrepositionCaseCoach("von öffentliche Verkehrsmittel", {
        level: "B1",
      }),
    ).toEqual([]);
  });
});
