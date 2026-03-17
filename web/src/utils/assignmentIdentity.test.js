import { resolveAssignmentCanonicalKey, toCanonicalAssignmentId } from "./assignmentIdentity";

describe("assignment identity canonical keys", () => {
  test("preserves decimal and major assignment IDs exactly", () => {
    expect(toCanonicalAssignmentId({ level: "A1", assignmentId: "0.1" })).toBe("A1-0.1");
    expect(toCanonicalAssignmentId({ level: "A1", assignmentId: "a1-14.1" })).toBe("A1-14.1");
    expect(toCanonicalAssignmentId({ level: "A1", assignmentId: "8" })).toBe("A1-8");
  });

  test("resolves required migration examples against manifest", () => {
    expect(resolveAssignmentCanonicalKey({ level: "A1", assignmentTitle: "A1 Health 14.1" })).toBe("A1-14.1");
    expect(resolveAssignmentCanonicalKey({ level: "A2", assignmentTitle: "A2 3.6 Möbel und Räume kennenlernen" })).toBe("A2-3.6");
    expect(resolveAssignmentCanonicalKey({ level: "A1", assignmentTitle: "A1 Pronouns 1.2" })).toBe("A1-1.2");
    expect(resolveAssignmentCanonicalKey({ level: "A1", assignmentTitle: "A1 Greetings 0.1" })).toBe("A1-0.1");
    expect(resolveAssignmentCanonicalKey({ level: "A1", assignmentTitle: "A1 24 Hour Clock 8" })).toBe("A1-8");
    expect(resolveAssignmentCanonicalKey({ level: "A2", assignmentTitle: "A2 1.1 Small Talk" })).toBe("A2-1.1");
    expect(resolveAssignmentCanonicalKey({ level: "B1", assignmentTitle: "B1 3.7 Fast Food vs. Hausmannskost" })).toBe("B1-3.7");
  });

  test("does not replace a trustworthy explicit ID with weak title inference", () => {
    expect(
      resolveAssignmentCanonicalKey({
        level: "A1",
        assignmentId: "A1-8",
        assignmentTitle: "A1 24 Hour Clock 24",
      })
    ).toBe("A1-8");
  });

  test("marks unresolved IDs when explicit ID is invalid", () => {
    expect(
      resolveAssignmentCanonicalKey({
        level: "A1",
        assignmentId: "A1-999",
        assignmentTitle: "A1 Greetings 0.1",
      })
    ).toBe("");
  });
});
