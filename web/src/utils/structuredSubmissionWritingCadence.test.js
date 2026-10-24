import { getStructuredSubmissionProfile } from "./structuredSubmissionTemplate";

describe("A2/B1 structured submission required parts", () => {
  test("A2 Day 2 omits Schreiben but keeps Lesen and graded Hören", () => {
    const profile = getStructuredSubmissionProfile({ level: "A2", day: 2, assignmentKey: "A2-1.2" });
    expect(profile.parts.map((part) => part.partId)).toEqual(["teil3", "teil4"]);
  });

  test("A2 Day 3 keeps Schreiben", () => {
    const profile = getStructuredSubmissionProfile({ level: "A2", day: 3, assignmentKey: "A2-1.3" });
    expect(profile.parts.map((part) => part.partId)).toContain("teil2");
  });

  test("B1 Day 2 omits Schreiben", () => {
    const profile = getStructuredSubmissionProfile({ level: "B1", day: 2, assignmentKey: "B1-1.2" });
    expect(profile.parts.map((part) => part.partId)).not.toContain("teil2");
  });
});
