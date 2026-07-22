import fs from "node:fs";
import path from "node:path";
import {
  findWorkbookContextAssignment,
  resolveWorkbookSubmissionContext,
} from "./workbookSubmissionContext";

describe("workbook submission context", () => {
  test.each([
    ["A1", 10, "A1-6"],
    ["A2", 10, "A2-4.10"],
    ["B1", 10, "B1-4.10"],
  ])("locks %s workbook submissions to the route assignment", (level, day, assignmentKey) => {
    expect(
      resolveWorkbookSubmissionContext({
        submissionContext: { level, day, assignmentKey, canonicalAssignmentKey: assignmentKey },
        locationState: { level: "C1", day: 99, assignmentKey: "C1-9.9" },
        search: "?level=B2&assignmentKey=B2-2.2",
      }),
    ).toEqual(
      expect.objectContaining({
        assignmentKey,
        day,
        level,
        locked: true,
      }),
    );
  });

  test("does not lock B2 or C1 self-learning submissions", () => {
    expect(
      resolveWorkbookSubmissionContext({
        submissionContext: { level: "B2", day: 2, assignmentKey: "B2-1.2" },
      }).locked,
    ).toBe(false);
    expect(
      resolveWorkbookSubmissionContext({
        submissionContext: { level: "C1", day: 2, assignmentKey: "C1-1.2" },
      }).locked,
    ).toBe(false);
  });

  test("resolves A2 Day 10 by exact canonical key", () => {
    const day10 = {
      assignmentKey: "A2-4.10",
      canonicalAssignmentId: "A2-4.10",
      chapter: "4.10",
      day: 10,
      label: "A2 • Day 10: Tourismus und Traditionelle Feste 4.10 • Chapter 4.10",
    };

    expect(
      findWorkbookContextAssignment({
        assignmentDictionary: [day10],
        assignmentKey: "A2-4.10",
        day: 10,
        chapter: "4.10",
      }),
    ).toBe(day10);
  });

  test("falls back to the route day and chapter when a legacy dictionary key differs", () => {
    const day10 = {
      assignmentKey: "legacy-a2-day10",
      chapter: "4.10",
      day: 10,
      label: "A2 • Day 10: Tourismus und Traditionelle Feste 4.10",
    };
    const other = {
      assignmentKey: "A2-4.11",
      chapter: "4.11",
      day: 11,
      label: "A2 • Day 11",
    };

    expect(
      findWorkbookContextAssignment({
        assignmentDictionary: [other, day10],
        assignmentKey: "A2-4.10",
        day: 10,
        chapter: "4.10",
      }),
    ).toBe(day10);
  });

  test("the patched form hides manual selectors for locked workbook submissions", () => {
    const source = fs.readFileSync(
      path.resolve(process.cwd(), "src/components/AssignmentSubmissionPage.js"),
      "utf8",
    );

    expect(source).toContain('data-workbook-submission-context="locked"');
    expect(source).toContain('display: isWorkbookSubmissionContext ? "none" : "grid"');
    expect(source).toContain("const requestedAssignmentKey = workbookSubmissionContext.assignmentKey;");
    expect(source).toContain("findWorkbookContextAssignment({");
  });
});
