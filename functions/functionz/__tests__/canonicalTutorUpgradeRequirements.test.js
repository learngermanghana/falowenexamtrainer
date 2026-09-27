const {
  getCanonicalTutorRequirements,
  getCanonicalTutorAssignmentSet,
} = require("../routes/scoresSummaryCoursePlan");

describe("canonical tutor upgrade requirements", () => {
  test("match the frontend Course Book totals for A1, A2 and B1", () => {
    const a1 = getCanonicalTutorRequirements("A1");
    const a2 = getCanonicalTutorRequirements("A2");
    const b1 = getCanonicalTutorRequirements("B1");

    expect(a1).toHaveLength(19);
    expect(a2).toHaveLength(28);
    expect(b1).toHaveLength(28);
    expect(b1.map((item) => item.day)).toEqual(
      Array.from({ length: 28 }, (_, index) => index + 1),
    );
    expect(getCanonicalTutorAssignmentSet("B1").has("B1-10.28")).toBe(true);
  });
});
