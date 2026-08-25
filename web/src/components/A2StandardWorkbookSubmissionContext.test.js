import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("A2 standard workbook submission context", () => {
  test("passes canonical assignment data through submissionContext", () => {
    const shell = read("A2StandardTabbedWorkbookPage.js");

    expect(shell).toContain('const assignmentKey = `A2-${chapter}`');
    expect(shell).toContain('level: "A2"');
    expect(shell).toContain("day,");
    expect(shell).toContain("assignmentKey,");
    expect(shell).toContain("canonicalAssignmentKey: assignmentKey");
    expect(shell).toContain("workbookId: resolvedWorkbookId");
    expect(shell).toContain("<ContextualAssignmentSubmissionPage submissionContext={submissionContext} />");
  });

  test("Day 10 supplies the canonical values used to build A2-4.10", () => {
    const day10 = read("A2Day10TourismusTraditionelleFesteWorkbookPage.js");

    expect(day10).toContain("day={10}");
    expect(day10).toContain('chapter="4.10"');
    expect(day10).toContain('workbookId="A2Day10TourismusTraditionelleFeste"');
  });
});
