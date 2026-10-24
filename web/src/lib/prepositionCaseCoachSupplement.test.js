import { analyzePrepositionCaseCoach } from "./prepositionCaseCoachSupplement";

describe("Preposition Case Coach supplemental articleless rules", () => {
  it("abstains when Verkehrsmittel number is ambiguous", () => {
    expect(
      analyzePrepositionCaseCoach(
        "Bei der Beurteilung von öffentliche Verkehrsmittel sollten mehrere Kriterien berücksichtigt werden.",
        { level: "C1" },
      ),
    ).toEqual([]);
  });

  it("does not change valid singular Verkehrsmittel phrases to plural", () => {
    expect(
      analyzePrepositionCaseCoach("mit öffentlichem Verkehrsmittel", { level: "C1" }),
    ).toEqual([]);
    expect(
      analyzePrepositionCaseCoach("ohne öffentliches Verkehrsmittel", { level: "C1" }),
    ).toEqual([]);
  });

  it("keeps already-correct plural Verkehrsmittel phrases unchanged", () => {
    expect(
      analyzePrepositionCaseCoach(
        "Bei der Beurteilung von öffentlichen Verkehrsmitteln sollten mehrere Kriterien berücksichtigt werden.",
        { level: "C1" },
      ),
    ).toEqual([]);
  });

  it("preserves lexical adjective stems such as teuer and sicher", () => {
    expect(
      analyzePrepositionCaseCoach("mit teuer Verkehrsmittel", { level: "C1" }),
    ).toEqual([]);
    expect(
      analyzePrepositionCaseCoach("mit sicher Verkehrsmittel", { level: "C1" }),
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
