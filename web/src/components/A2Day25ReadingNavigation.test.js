import fs from "fs";
import path from "path";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("A2 Day 25 reading-only navigation", () => {
  test("the lesson source identifies Teil 4 as reading and not listening", () => {
    const source = read("A2Day25TagesablaufWorkbookPage.js");

    expect(source).toContain('{ key: "lesen2", label: "Teil 4 · Lesen" }');
    expect(source).toContain("There is no Hören assignment in this workbook.");
  });

  test("the shared legacy overlay preserves the second reading section", () => {
    const source = read("A2LegacyStandardWorkbookNavigationImpl.js");

    expect(source).toContain('{ key: "lesen2", label: "Teil 4", description: "Lesen" }');
    expect(source).toContain('lesen2: "teil4"');
    expect(source).toContain("config.day === 25 ? A2_DAY25_WORKBOOK_TABS : STANDARD_WORKBOOK_TABS");
  });
});
