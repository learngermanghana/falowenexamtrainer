import { resolveAssignmentCanonicalKey, toCanonicalAssignmentId } from "./assignmentIdentity";

describe("assignment identity canonical keys", () => {
  test("duplicate day entries use task token from title fallback", () => {
    expect(
      resolveAssignmentCanonicalKey({
        level: "A1",
        assignmentTitle: "Day 2 • Task 2: Modal verbs",
      })
    ).toBe("A1-DAY-2-TASK-2");
  });

  test("assignment IDs with and without level prefix normalize consistently", () => {
    expect(toCanonicalAssignmentId({ level: "A1", assignmentId: "0.1" })).toBe("A1-0.1");
    expect(toCanonicalAssignmentId({ level: "A1", assignmentId: "a1-0.1" })).toBe("A1-0.1");
  });

  test("title-only rows use strict TITLE key format", () => {
    expect(resolveAssignmentCanonicalKey({ level: "B1", assignmentTitle: "My custom assignment" })).toBe(
      "B1-TITLE-MY-CUSTOM-ASSIGNMENT"
    );
  });

  test("mixed case and underscore inputs normalize to strict format", () => {
    expect(toCanonicalAssignmentId({ level: "a2", assignmentId: "day_5" })).toBe("A2-DAY-5");
  });

  test("title chapter token extraction prefers chapter-like decimal over day number", () => {
    expect(
      resolveAssignmentCanonicalKey({
        level: "A1",
        assignmentTitle: "Day 1: 0.1 Greetings and Asking About Well-being",
      })
    ).toBe("A1-0.1");
  });

  test("bad sentence-like assignmentId falls back to title key", () => {
    expect(
      resolveAssignmentCanonicalKey({
        level: "A1",
        assignmentId: "A1 Greetings and Asking About Well-being 0.1",
        assignmentTitle: "A1 Greetings and Asking About Well-being 0.1",
      })
    ).toBe("A1-0.1");
  });

  test("assignment titles ending with numeric token map to chapter/day", () => {
    expect(resolveAssignmentCanonicalKey({ level: "A1", assignmentTitle: "A1 Numbers 2" })).toBe("A1-2");
    expect(resolveAssignmentCanonicalKey({ level: "A1", assignmentTitle: "A1 Asking About Prices 3" })).toBe("A1-3");
    expect(resolveAssignmentCanonicalKey({ level: "A1", assignmentTitle: "A1 Countries and Languages 4" })).toBe("A1-4");
    expect(resolveAssignmentCanonicalKey({ level: "A1", assignmentTitle: "A1 German Cases 5" })).toBe("A1-5");
    expect(resolveAssignmentCanonicalKey({ level: "A1", assignmentTitle: "A1 Objects and Colours 6" })).toBe("A1-6");
    expect(resolveAssignmentCanonicalKey({ level: "A1", assignmentTitle: "A1 Understanding Time 7" })).toBe("A1-7");
  });

  test("prefers title chapter token when structured assignmentId number mismatches", () => {
    expect(
      resolveAssignmentCanonicalKey({
        level: "A1",
        assignmentId: "A1-12",
        assignmentTitle: "A1 Objects and Colours 6",
      })
    ).toBe("A1-6");

    expect(
      resolveAssignmentCanonicalKey({
        level: "A1",
        assignmentId: "A1-12",
        assignmentTitle: "A1 Understanding Time 7",
      })
    ).toBe("A1-7");
  });

});
