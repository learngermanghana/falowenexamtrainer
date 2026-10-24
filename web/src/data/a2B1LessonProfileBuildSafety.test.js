import fs from "fs";
import path from "path";

const readRoot = (relativePath) =>
  fs.readFileSync(path.resolve(process.cwd(), "..", relativePath), "utf8");

describe("A2/B1 lesson profile build safety", () => {
  test("mapped submission build patch validates canonical profiles instead of mutating overrides", () => {
    const source = readRoot("scripts/patchA2B1MappedSubmissionCapture.mjs");

    expect(source).toContain('web/src/data/a2B1LessonProfile.js');
    expect(source).toContain('task.status === "unavailable"');
    expect(source).not.toContain('B1: Object.freeze({})');
    expect(source).not.toContain("B1 Day 21 no-Teil-4 profile");
  });

  test("writing cleanup cannot erase editable starter-text behavior", () => {
    const source = readRoot("scripts/patchA2B1WritingAndNavigationCleanup.mjs");

    expect(source).toContain('writingSource.includes("normalizeWritingStarterText")');
    expect(source).toContain('writingSource.includes("starterTaskRef")');
    expect(source).toContain("destructive legacy rewrite skipped");
  });
});
