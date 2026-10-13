import { getSavedMockSectionRows, formatMockSectionScore } from "./mockSectionScores";

describe("saved full-mock module grades", () => {
  test("shows all four independently stored section scores in exam order", () => {
    const sections = getSavedMockSectionRows({
      source: "b1_final_mock",
      sectionScores: { sprechen: 21, schreiben: 17, hoeren: 18, lesen: 20 },
      finalScore: 76,
    });
    expect(sections.map(({ label, score, maxScore }) => [label, score, maxScore])).toEqual([
      ["Lesen", 20, 25], ["Hören", 18, 25],
      ["Schreiben", 17, 25], ["Sprechen", 21, 25],
    ]);
  });

  test("recovers B2 grades from breakdown if sectionScores are absent", () => {
    expect(getSavedMockSectionRows({
      resultType: "final_mock",
      scoreBreakdown: [
        { key: "lesen", score: 24, maxScore: 25 },
        { key: "hoeren", score: 0, maxScore: 25 },
      ],
    }).map((part) => [part.key, part.score])).toEqual([
      ["lesen", 24], ["hoeren", 0],
    ]);
  });

  test("missing or ungraded modules are not shown as zero", () => {
    const sections = getSavedMockSectionRows({
      source: "a2_final_mock", sectionScores: {
        lesen: 0, hoeren: null, schreiben: undefined, sprechen: 30,
      },
    });
    expect(sections.map(({ key, score }) => [key, score])).toEqual([["lesen", 0]]);
  });

  test("ordinary Lesen section practice is not mistaken for a full mock", () => {
    expect(getSavedMockSectionRows({
      source: "exam_room_practice", section: "lesen",
      sectionScores: [{ label: "Teil 1", score: 4, total: 5 }],
    })).toEqual([]);
  });

  test("scores are formatted without inventing extra decimals", () => {
    expect(formatMockSectionScore(20)).toBe("20");
    expect(formatMockSectionScore(18.5)).toBe("18.5");
  });
});
