import fs from "fs";
import path from "path";

const read = (relativePath) => fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("Falowen Radio and A2 workbook section isolation", () => {
  test("Falowen Radio hides workbook media and tools until Continue opens the workbook", () => {
    const radioGate = read("RadioFirstWorkbookGate.js");

    expect(radioGate).toContain('if (hasEnteredWorkbook) return children;');
    expect(radioGate).toContain('.book-pdf-download-action { display: none !important; }');
    expect(radioGate).toContain('Continue to workbook →');
    expect(radioGate).toContain('params.set(RADIO_COMPLETE_PARAM, RADIO_COMPLETE_VALUE)');
  });

  test("A2 Day 15 delegates section visibility to its real workbook tabs", () => {
    const day15 = read("A2Day15MeinLieblingssportWorkbookPage.js");
    const workbook = read("A2StandardTabbedWorkbookPage.js");

    expect(day15).toContain("<A2StandardTabbedWorkbookPage");
    expect(day15).toContain("day={15}");
    expect(day15).not.toContain("workbook-hoeren-refresh");
    expect(day15).not.toContain("workbook-hoeren-replacement");
    expect(day15).not.toContain("Teil 4 · Hören video");
    expect(day15).not.toContain("p_OE59m0J-Y");

    expect(workbook).toContain("<WorkbookTabNav");
    expect(workbook).toContain('displayedActiveTab === "sprechen"');
    expect(workbook).toContain('displayedActiveTab === "hoeren"');
    expect(workbook).toContain("Teil 4 · Hören");
  });
});
