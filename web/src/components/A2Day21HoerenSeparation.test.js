import fs from "fs";
import path from "path";

const read = (relativePath) =>
  fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("A2 Day 21 Teil 4 Hören separation", () => {
  const workbook = read("A2Day21EinWochenendePlanenWorkbookPage.js");
  const radioDictionary = read("../data/additionalA2RadioEntries.js");

  test("keeps workbook Hören separate from Falowen Radio", () => {
    expect(radioDictionary).toContain('youtubeId: "LlXsNA1a8lc"');
    expect(workbook).toContain('hoerenAudioUrl="https://youtu.be/Qg0tQFveI0M"');
    expect(workbook).not.toContain('hoerenAudioUrl="https://youtu.be/LlXsNA1a8lc"');
    expect(workbook).toContain("separate Goethe-Hören-Übung");
    expect(workbook).toContain("Falowen Radio gehört zur Vorbereitung vor dem Workbook");
  });
});
