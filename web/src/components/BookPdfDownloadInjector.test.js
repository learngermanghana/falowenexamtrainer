import { isPrintableBookRoute, SCHOOL_PRINT_STAMP } from "./BookPdfDownloadInjector";

describe("BookPdfDownloadInjector helpers", () => {
  it("targets grammar notes and workbook pages only", () => {
    expect(isPrintableBookRoute("/campus/course/a2-day-9-urlaub-workbook")).toBe(true);
    expect(isPrintableBookRoute("/campus/course/a2-day-9-perfekt-grammar-notes")).toBe(true);
    expect(isPrintableBookRoute("/campus/course/german-alphabet-grammar-notes-day-2")).toBe(true);
    expect(isPrintableBookRoute("/campus/course/a2-day-9-urlaub-radio")).toBe(false);
  });

  it("exposes the school print stamp", () => {
    expect(SCHOOL_PRINT_STAMP).toBe("learn Language Education Academy");
  });
});
