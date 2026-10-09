import fs from "fs";
import path from "path";
const read = (file) => fs.readFileSync(path.resolve(__dirname, file), "utf8");

describe("A2/B1 workbook navigation and A2 Day 14 placement", () => {
  test("navigation is a sibling of the content header in A2 and B1", () => {
    for (const [file, marker] of [["A2StandardTabbedWorkbookPage.js", "data-a2-workbook-sticky-navigation"], ["B1StandardWorkbookPage.js", "data-b1-workbook-sticky-navigation"]]) {
      const source = read(file);
      expect(source).toContain(marker);
      expect(source).toContain('position: "sticky", top: 0');
      expect(source.indexOf(marker)).toBeGreaterThan(source.indexOf("Back to Course Book"));
    }
  });
  test("Day 14 begins with the standard speaking brain map rather than quick learning", () => {
    const page = read("A2Day14BerufUndKarriereWorkbookPage.js");
    expect(page).toContain("mindMapOnlySpeaking");
    expect(page).not.toContain("A2Day14QuickLearnSpeaking");
    expect(page).not.toContain("sprechenContent=");
    expect(read("A2StandardTabbedWorkbookPage.js")).toContain("<SpeakingMindMap config={getA2SpeakingMindMap(day)} />");
  });
});
