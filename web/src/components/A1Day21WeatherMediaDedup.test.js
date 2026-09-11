import fs from "fs";
import path from "path";
import A1Day21WeatherResources from "./A1Day21WeatherResources";
import {
  getA1WorkbookMediaResources,
  getYouTubeVideoId,
} from "./A1WorkbookMediaPanel";

const DAY = 21;
const CHAPTER = "13";

describe("A1 Day 21 weather media", () => {
  it("keeps the legacy Day 21 resource block disabled so videos render only in the shared top panel", () => {
    expect(A1Day21WeatherResources()).toBeNull();

    const grammarSource = fs.readFileSync(
      path.resolve(__dirname, "A1WorkbookGrammarNotes.js"),
      "utf8",
    );
    expect(grammarSource).toContain('"A1-13": WeatherPerfektLetterPage');
  });

  it("keeps one canonical teacher/AI media set with no duplicate YouTube IDs", () => {
    const resources = getA1WorkbookMediaResources({ day: DAY, chapter: CHAPTER });
    const ids = resources.map((resource) => getYouTubeVideoId(resource.url)).filter(Boolean);

    expect(resources.some((resource) => resource.kind === "teacher")).toBe(true);
    expect(resources.some((resource) => resource.kind === "ai")).toBe(true);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("keeps the fixed A1-13 tutor assignment identity unchanged", () => {
    const workbookSource = fs.readFileSync(
      path.resolve(__dirname, "A1Day21WeatherWorkbookPage.js"),
      "utf8",
    );

    expect(workbookSource).toContain('const DAY21_ASSIGNMENT_KEY = "A1-13"');
    expect(workbookSource).toContain('fallbackAssignmentKey={DAY21_ASSIGNMENT_KEY}');
  });
});
