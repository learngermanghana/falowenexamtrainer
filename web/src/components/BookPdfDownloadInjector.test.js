import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BookPdfDownloadInjector, {
  getPrintableBookKind,
  isPrintableBookRoute,
  needsInlineA1PdfAction,
  SCHOOL_PRINT_STAMP,
} from "./BookPdfDownloadInjector";

describe("BookPdfDownloadInjector helpers", () => {
  it("treats the dedicated A1 Day 15 workbook as printable", () => {
    const pathname = "/campus/course/speaking-exams-intro-4-7";

    expect(getPrintableBookKind(pathname)).toBe("combined");
    expect(needsInlineA1PdfAction(pathname)).toBe(true);
  });

  it.each([
    "/campus/course/two-case-prepositions-wechselpraepositionen-day-18",
    "/campus/course/a1-12-2-dative-articles-mit-bei-zu",
    "/campus/course/letter-writing-intro-german-a1-day-12-3",
  ])("shows the PDF action on special A1 workbook route %s", (pathname) => {
    expect(getPrintableBookKind(pathname, "?view=workbook")).toBe("combined");
    expect(isPrintableBookRoute(pathname, "?view=workbook")).toBe(true);
    expect(needsInlineA1PdfAction(pathname)).toBe(true);
    expect(needsInlineA1PdfAction(`${pathname}/`)).toBe(true);
  });

  it("targets grammar notes and workbook pages only", () => {
    expect(isPrintableBookRoute("/campus/course/a2-day-9-urlaub-workbook")).toBe(true);
    expect(isPrintableBookRoute("/campus/course/a2-day-9-perfekt-grammar-notes")).toBe(true);
    expect(isPrintableBookRoute("/campus/course/german-alphabet-grammar-notes-day-2")).toBe(true);
    expect(isPrintableBookRoute("/campus/course/a2-day-9-urlaub-radio")).toBe(false);
  });

  it.each([
    ["A1", "combined", false],
    ["A2", "combined", false],
    ["B1", "workbook", false],
    ["B2", "combined", true],
    ["C1", "combined", true],
  ])(
    "supports the printable %s lesson workbook route",
    (level, workbookKind, printsCompleteLesson) => {
      const pathname = `/campus/course/lesson/${level}/12`;
      expect(isPrintableBookRoute(pathname, "?view=workbook")).toBe(true);
      expect(getPrintableBookKind(pathname, "?view=workbook")).toBe(workbookKind);
      expect(getPrintableBookKind(pathname, "?view=grammar")).toBe("grammar");
      expect(isPrintableBookRoute(pathname)).toBe(printsCompleteLesson);
    }
  );

  it("keeps printable lesson metadata without covering Study Buddy with a floating download", () => {
    render(
      <MemoryRouter initialEntries={["/campus/course/lesson/C1/12?view=workbook"]}>
        <BookPdfDownloadInjector />
      </MemoryRouter>
    );

    expect(screen.queryByRole("complementary", { name: "PDF download" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Download PDF" })).not.toBeInTheDocument();
    expect(screen.getByText(SCHOOL_PRINT_STAMP)).toBeInTheDocument();
  });

  it("shows an inline print action on legacy A1 workbook routes", () => {
    const printSpy = jest.spyOn(window, "print").mockImplementation(() => {});

    render(
      <MemoryRouter initialEntries={["/campus/course/a1-day-1-greetings-workbook"]}>
        <BookPdfDownloadInjector />
      </MemoryRouter>
    );

    expect(needsInlineA1PdfAction("/campus/course/a1-day-1-greetings-workbook")).toBe(true);
    expect(needsInlineA1PdfAction("/campus/course/a2-day-1-greetings-workbook")).toBe(false);

    fireEvent.click(screen.getByRole("button", { name: "Download or print PDF" }));
    expect(printSpy).toHaveBeenCalledTimes(1);

    printSpy.mockRestore();
  });

  it("exposes the school print stamp", () => {
    expect(SCHOOL_PRINT_STAMP).toBe("learn Language Education Academy");
  });
});
