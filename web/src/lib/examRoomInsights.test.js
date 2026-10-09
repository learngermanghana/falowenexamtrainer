import { buildExamRoomCoach } from "./examRoomCoach";
import { buildExamRoomInsights, getAttemptBreakdown } from "./examRoomInsights";

describe("Phase 2 exam insights", () => {
  const mock = (id, percent, date, sectionScores) => ({
    id, level: "B1", resultType: "final_mock", section: "mixed",
    percent, completedAt: date, sectionScores,
  });

  it("never presents practice coverage as exam readiness or invents a mock score", () => {
    const coach = buildExamRoomCoach({
      level: "A2",
      cloudResults: [
        { id: "one", level: "A2", section: "lesen", percent: 75, completedAt: "2026-10-01" },
      ],
    });
    const insights = buildExamRoomInsights(coach, "A2");
    expect(insights.evidenceLabel).toBe("Not assessed");
    expect(insights.trend).toEqual([]);
    expect(insights.evidenceText).toMatch(/practice coverage alone is not readiness/i);
    expect(insights.weeklyPlan).toHaveLength(7);
    expect(insights.weeklyPlan[0].title).toBe("Lesen");
    expect(insights.skillScores.find((skill) => skill.key === "sprechen").percent).toBeNull();
  });

  it("uses full-mock scores from stored verified history, not unscored practice", () => {
    const coach = buildExamRoomCoach({
      level: "B1",
      cloudResults: [
        mock("second", 75, "2026-10-08T15:00:00Z", {
          lesen: 20, hoeren: 18, schreiben: 16, sprechen: 21,
        }),
        mock("first", 61, "2026-10-01T15:00:00Z", {
          lesen: 20, hoeren: 8, schreiben: 15, sprechen: 18,
        }),
        { id: "unverified", level: "B1", section: "sprechen", percent: 99, completedAt: "2026-10-09" },
      ],
    });
    const insights = buildExamRoomInsights(coach, "B1");
    expect(insights.evidenceLabel).toBe("Multiple scored mocks");
    expect(insights.trend.map((entry) => entry.percent)).toEqual([61, 75]);
    expect(insights.weakestMockPart.label).toBe("Schreiben");
    expect(insights.weakestMockPart.score).toBe(16);
    expect(insights.evidenceText).toMatch(/not a Goethe pass prediction/i);
  });

  it("does not infer missing full-mock section scores", () => {
    const coach = buildExamRoomCoach({
      level: "B1",
      cloudResults: [mock("partial", 40, "2026-10-08", { lesen: 10 })],
    });
    const insights = buildExamRoomInsights(coach, "B1");
    expect(insights.evidenceLabel).toBe("Partial evidence");
    expect(insights.latestParts).toHaveLength(1);
  });

  it("only shows a reading Teil when a real denominator is known", () => {
    expect(getAttemptBreakdown({
      section: "lesen", level: "A1",
      sectionScores: [{ label: "Teil 2", score: 2, total: 5 }],
    })).toEqual([{ label: "Teil 2", score: 2, total: 5, percent: 40 }]);
    expect(getAttemptBreakdown({
      section: "lesen", level: "B1", sectionScores: { teil1: 2, teil2: 3 },
    })).toEqual([]);
  });

  it("rejects malformed part scores instead of displaying misleading results", () => {
    expect(getAttemptBreakdown({
      section: "mixed", resultType: "final_mock",
      scoreBreakdown: [
        { key: "lesen", score: 30, maxScore: 25 },
        { key: "hoeren", score: 0, maxScore: 25 },
        { key: "schreiben", score: "not-scored", maxScore: 25 },
      ],
    })).toEqual([{ label: "Hören", score: 0, total: 25, percent: 0 }]);
  });
});
