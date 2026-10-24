import fs from "fs";
import path from "path";

const read = (relativePath) =>
  fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("A2 Day 9 Urlaub grammar notes", () => {
  test("uses the standard A2 workbook tab behavior", () => {
    const page = read("./A2Day9UrlaubWorkbookPage.js");
    const standard = read("./A2StandardTabbedWorkbookPage.js");

    expect(page).not.toContain("initialTab");
    expect(standard).not.toContain("initialTab");
    expect(standard).toContain('useState("sprechen")');
  });

  test("contains full Perfekt notes instead of a small summary", () => {
    const grammar = read("./A2Day9PerfektGrammarPage.js");

    expect(grammar).toContain('data-a2-day9-real-grammar-notes="true"');
    expect(grammar).toContain("The basic Perfekt structure");
    expect(grammar).toContain("When do we use haben?");
    expect(grammar).toContain("When do we use sein?");
    expect(grammar).toContain("How to form the Partizip II");
    expect(grammar).toContain("Separable verbs: prefix + ge + verb");
    expect(grammar).toContain("No ge- with inseparable prefixes");
    expect(grammar).toContain("-ieren verbs: no ge-");
    expect(grammar).toContain("Questions about a past holiday");
    expect(grammar).toContain("Typical mistakes to avoid");
    expect(grammar).toContain("Knowledge Test · Perfekt im Urlaub");
  });
});
