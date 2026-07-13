import {
  A2_LEGACY_WORKBOOK_COMPLETION_BY_PATH,
  findA2LegacyWorkbookTabRow,
  getA2LegacyWorkbookTabKey,
} from "./A2LegacyWorkbookCompletionTabs";

describe("A2LegacyWorkbookCompletionTabs", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  it("covers every restored rich workbook route", () => {
    expect(Object.keys(A2_LEGACY_WORKBOOK_COMPLETION_BY_PATH)).toEqual([
      "/campus/course/a2-day-16-wohlbefinden-und-entspannung-workbook",
      "/campus/course/a2-day-18-die-bank-anrufen-workbook",
      "/campus/course/a2-day-19-einkaufen-wo-und-wie-workbook",
      "/campus/course/a2-day-20-typische-reklamationssituationen-workbook",
      "/campus/course/a2-day-21-ein-wochenende-planen-workbook",
      "/campus/course/a2-day-26-gefuehle-in-verschiedenen-situationen-workbook",
    ]);

    expect(
      Object.values(A2_LEGACY_WORKBOOK_COMPLETION_BY_PATH).map((entry) => entry.day),
    ).toEqual([16, 18, 19, 20, 21, 26]);

    Object.values(A2_LEGACY_WORKBOOK_COMPLETION_BY_PATH).forEach((entry) => {
      expect(entry.fallbackChapter).toMatch(/^\d+\.\d+$/);
      expect(entry.workbookId).toMatch(/^A2Day\d+/);
      expect(entry.title).toBeTruthy();
    });
  });

  it("recognizes Teil, Ref and Submit labels", () => {
    expect(getA2LegacyWorkbookTabKey("Teil 1 · Sprechen")).toBe("teil1");
    expect(getA2LegacyWorkbookTabKey("Teil 2 · Schreiben")).toBe("teil2");
    expect(getA2LegacyWorkbookTabKey("Teil 3 · Lesen")).toBe("teil3");
    expect(getA2LegacyWorkbookTabKey("Teil 4 · Hören")).toBe("teil4");
    expect(getA2LegacyWorkbookTabKey("5. Ref")).toBe("references");
    expect(getA2LegacyWorkbookTabKey("Submit")).toBe("submit");
  });

  it("finds the native four-part workbook tab row and ignores unrelated buttons", () => {
    document.body.innerHTML = `
      <main class="layout-main">
        <div id="unrelated"><button>Back to Course</button><button>Help</button></div>
        <div id="workbook-tabs">
          <button>Teil 1 · Sprechen</button>
          <button>Teil 2 · Schreiben</button>
          <button>Teil 3 · Lesen</button>
          <button>Teil 4 · Hören</button>
          <button>5. Ref</button>
        </div>
      </main>
    `;

    expect(findA2LegacyWorkbookTabRow(document)?.id).toBe("workbook-tabs");
  });
});
