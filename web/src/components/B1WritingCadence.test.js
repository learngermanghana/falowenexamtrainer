import fs from "fs";
import path from "path";

const source = fs.readFileSync(path.resolve(__dirname, "B1StandardWorkbookPage.js"), "utf8");

describe("B1 Standard Workbook writing cadence", () => {
  test("hides Schreiben and removes it from default submission copy on no-writing days", () => {
    expect(source).toContain('const writingRequired = isB1WritingRequired(config.day);');
    expect(source).toContain('writingRequired || tab.key !== "schreiben"');
    expect(source).toContain('writingRequired && displayedActiveTab === "schreiben"');
    expect(source).toContain('"Submit Teil 3 and Teil 4."');
    expect(source).toContain('"Submit Teil 3."');
  });
});
