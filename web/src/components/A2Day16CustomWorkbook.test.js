import fs from "fs";
import path from "path";

const workbookSource = fs.readFileSync(
  path.resolve(__dirname, "./A2Day16WohlbefindenUndEntspannungWorkbookPage.js"),
  "utf8",
);
const appSource = fs.readFileSync(path.resolve(__dirname, "../App.js"), "utf8");

describe("A2 Day 16 custom workbook", () => {
  it("keeps the named route wired to the custom workbook component", () => {
    expect(appSource).toContain(
      'path="/campus/course/a2-day-16-wohlbefinden-und-entspannung-workbook"',
    );
    expect(appSource).toContain("A2Day16WohlbefindenUndEntspannungWorkbookPage");
    expect(appSource).toContain('withRadioWorkbookGate("A2", 16');
  });

  it("keeps the original complete four-part workbook instead of the generic template", () => {
    expect(workbookSource).not.toContain("A2StandardTabbedWorkbookPage");
    expect(workbookSource).toContain('label: "Teil 1 · Sprechen"');
    expect(workbookSource).toContain('label: "Teil 2 · Schreiben"');
    expect(workbookSource).toContain('label: "Teil 3 · Lesen"');
    expect(workbookSource).toContain('label: "Teil 4 · Hören"');
    expect(workbookSource).toContain("SpeakingPracticeTimerCard");
    expect(workbookSource).toContain("Gesunde Ernährung Kochkurs");
    expect(workbookSource).toContain("Physiotherapiezentrum Gesund");
    expect(workbookSource).toContain("Teacher mode (show transcript)");
    expect(workbookSource).toContain("Was wird als ein einfacher Anfang für eine gesunde Ernährung empfohlen?");
  });
});
