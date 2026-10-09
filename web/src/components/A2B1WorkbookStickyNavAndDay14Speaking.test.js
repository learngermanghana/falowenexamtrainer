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
  test("Day 14 short goal lesson is owned by Teil 1 Sprechen", () => {
    const page = read("A2Day14BerufUndKarriereWorkbookPage.js");
    expect(page).toContain("sprechenContent={<A2Day14QuickLearnSpeaking />}");
    const practice = read("A2Day14QuickLearnSpeaking.js");
    expect(practice).toContain("Berufsziele mit um ... zu ausdrücken");
    expect(practice).toContain("Jetzt selbst anwenden");
    expect(practice).toContain("Kurz prüfen");
  });
});
