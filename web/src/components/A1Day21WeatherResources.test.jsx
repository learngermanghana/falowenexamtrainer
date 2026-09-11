import fs from "fs";
import path from "path";
import A1Day21WeatherResources, {
  buildA1Day21WeatherResourceModels,
} from "./A1Day21WeatherResources";
import {
  getA1WorkbookMediaResources,
  getYouTubeVideoId,
} from "./A1WorkbookMediaPanel";

const grammarSource = fs.readFileSync(
  path.resolve(__dirname, "A1WorkbookGrammarNotes.js"),
  "utf8",
);
const workbookSource = fs.readFileSync(
  path.resolve(__dirname, "A1Day21WeatherWorkbookPage.js"),
  "utf8",
);

describe("A1 Day 21 Weather resources", () => {
  test("keeps the teacher lecture and corrected Chapter 13 AI video models", () => {
    const resources = buildA1Day21WeatherResourceModels();

    expect(resources.teacher).toEqual(
      expect.objectContaining({
        sourceUrl: "https://youtu.be/ijEY8XVrsZs",
        youtubeId: "ijEY8XVrsZs",
        embedUrl: "https://www.youtube-nocookie.com/embed/ijEY8XVrsZs",
      }),
    );
    expect(resources.ai).toEqual(
      expect.objectContaining({
        sourceUrl: "https://youtu.be/fRYM7ojc0Yo",
        youtubeId: "fRYM7ojc0Yo",
        embedUrl: "https://www.youtube-nocookie.com/embed/fRYM7ojc0Yo",
      }),
    );
  });

  test("disables the legacy Day 21 duplicate block", () => {
    expect(A1Day21WeatherResources()).toBeNull();
  });

  test("renders Day 21 teacher and AI media once through the shared top panel model", () => {
    const resources = getA1WorkbookMediaResources({ day: 21, chapter: "13" });
    const videoIds = resources.map((resource) => getYouTubeVideoId(resource.url)).filter(Boolean);

    expect(resources).toEqual(expect.arrayContaining([
      expect.objectContaining({ kind: "teacher", url: "https://youtu.be/ijEY8XVrsZs" }),
      expect.objectContaining({ kind: "ai", url: "https://youtu.be/fRYM7ojc0Yo" }),
    ]));
    expect(new Set(videoIds).size).toBe(videoIds.length);
  });

  test("keeps the improved Day 21 grammar lesson and fixed A1-13 assignment", () => {
    expect(grammarSource).toContain('"A1-13": WeatherPerfektLetterPage');
    expect(workbookSource).toContain('const DAY21_ASSIGNMENT_KEY = "A1-13"');
    expect(workbookSource).toContain('fallbackAssignmentKey={DAY21_ASSIGNMENT_KEY}');
  });
});
