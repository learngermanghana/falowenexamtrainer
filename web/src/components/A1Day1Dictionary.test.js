import fs from "fs";
import path from "path";

const read = (file) => fs.readFileSync(path.resolve(__dirname, file), "utf8");

describe("A1 Day 1 dictionary", () => {
  test("Day 1 has an accessible dictionary tab and content panel", () => {
    const workbook = read("A1SharedAssignmentWorkbookLayout.jsx");
    expect(workbook).toContain('const hasDictionary = isCombinedDay1;');
    expect(workbook).toContain('key: "dictionary", label: "Dictionary"');
    expect(workbook).toContain('data-workbook-panel="dictionary"');
    expect(workbook).toContain("<A1Day1Dictionary />");
    expect(workbook).toContain('"dictionary"].includes(activeTab)');
    expect(workbook).toContain('...(hasDictionary ? ["dictionary"] : [])');
  });

  test("Day 1 dictionary covers greeting and wellbeing phrases", () => {
    const dictionary = read("A1Day1Dictionary.jsx");
    expect(dictionary).toContain("Guten Morgen!");
    expect(dictionary).toContain("Guten Abend!");
    expect(dictionary).toContain("Wie geht es Ihnen?");
    expect(dictionary).toContain("Mir geht es gut.");
    expect(dictionary).toContain("ein bisschen müde");
    expect(dictionary).toContain('data-a1-day1-dictionary="true"');
  });
});
