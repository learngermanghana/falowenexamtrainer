import fs from "fs";
import path from "path";

const read = (relativePath) =>
  fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("A2 Day 22 Teil 4 Hören separation", () => {
  const workbook = read("A2Day22DieWochePlanungWorkbookPage.js");
  const radioDictionary = read("../data/additionalA2RadioEntries.js");

  test("keeps workbook Hören separate from Falowen Radio", () => {
    expect(radioDictionary).toContain('youtubeId: "KR2oT-mujmI"');
    expect(workbook).toContain(
      'hoerenAudioUrl="https://youtu.be/wK9JOG5lhdc?list=PLtjMpIkGWMzD1BkOt9Jx9RhUk2e439CNZ"',
    );
    expect(workbook).not.toContain('hoerenAudioUrl="https://youtu.be/KR2oT-mujmI"');
    expect(workbook).toContain("separate Goethe-Hören-Übung");
    expect(workbook).toContain("Falowen Radio gehört zur Vorbereitung vor dem Workbook");
  });
});
