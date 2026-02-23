import { computeCertificateReadiness } from "./certificateReadiness";

describe("computeCertificateReadiness", () => {
  it("returns blocked when failed assignments exist", () => {
    const result = computeCertificateReadiness({
      scoreSummary: {
        failedAssignments: [{ label: "Day 7 · Schreiben" }],
        missedAssignments: [],
        recommendationBlocked: false,
      },
    });

    expect(result.state).toBe("blocked");
    expect(result.label).toBe("Blocked");
    expect(result.detail).toContain("Day 7");
  });

  it("returns blocked when recommendationBlocked is true even without failed list", () => {
    const result = computeCertificateReadiness({
      scoreSummary: {
        failedAssignments: [],
        missedAssignments: [{ label: "Day 8" }],
        recommendationBlocked: true,
      },
    });

    expect(result.state).toBe("blocked");
    expect(result.canResolve).toBe(true);
  });

  it("returns incomplete when only missed assignments exist", () => {
    const result = computeCertificateReadiness({
      scoreSummary: {
        failedAssignments: [],
        missedAssignments: [{ label: "Day 4" }],
        recommendationBlocked: false,
      },
    });

    expect(result.state).toBe("incomplete");
    expect(result.label).toBe("Incomplete");
  });

  it("returns ready when no failed or missed assignments exist", () => {
    const result = computeCertificateReadiness({
      scoreSummary: {
        failedAssignments: [],
        missedAssignments: [],
        recommendationBlocked: false,
      },
    });

    expect(result.state).toBe("ready");
    expect(result.label).toBe("Ready");
  });
});
