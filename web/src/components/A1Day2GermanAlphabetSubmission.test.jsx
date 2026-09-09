import { validateA1CanonicalSubmissionCompleteness } from "./A1CanonicalSubmissionPanel";
import { getA1Assignment } from "../data/a1AssignmentRegistry";

describe("A1-0.2 German Alphabet submission completeness", () => {
  it("uses consecutive Teil 1 and Teil 2 labels", () => {
    const assignment = getA1Assignment("A1-0.2");
    expect(assignment.sections).toEqual([
      { key: "teil-1", number: 1, label: "Teil 1 · Reading and Questions" },
      { key: "teil-2", number: 2, label: "Teil 2 · Hören" },
    ]);
  });

  it("blocks a submission that contains only the seven Teil 1 answers", () => {
    const result = validateA1CanonicalSubmissionCompleteness({
      assignmentKey: "A1-0.2",
      text: `Teil 1\n1. C - 26\n2. A - Ä, Ö, Ü, ß\n3. A - Eszett\n4. A - K\n5. A - A-Umlaut\n6. A - Ä, Ö, Ü, ß\n7. B - 4`,
    });

    expect(result.ok).toBe(false);
    expect(result.message).toContain("Teil 2 · Hören answers 1, 2, 3, 4, 5");
  });

  it("accepts the final response only when Teil 1 has 7 answers and Teil 2 has 5 answers", () => {
    const result = validateA1CanonicalSubmissionCompleteness({
      assignmentKey: "A1-0.2",
      text: `Teil 1\n1. C - 26\n2. A - Ä, Ö, Ü, ß\n3. A - Eszett\n4. A - K\n5. A - A-Umlaut\n6. A - Ä, Ö, Ü, ß\n7. B - 4\n\nTeil 2 · Hören\n1. Wasser\n2. Käufe\n3. Brief\n4. Schule\n5. Tisch`,
    });

    expect(result).toEqual({ ok: true, message: "" });
  });

  it("does not apply the A1-0.2 structure to other A1 assignments", () => {
    expect(
      validateA1CanonicalSubmissionCompleteness({ assignmentKey: "A1-1.1", text: "short answer" }),
    ).toEqual({ ok: true, message: "" });
  });
});
