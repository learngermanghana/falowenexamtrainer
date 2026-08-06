import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import BookPdfDownloadInjector, {
  getPrintableBookKind,
  isPrintableBookRoute,
  SCHOOL_PRINT_STAMP,
} from "./BookPdfDownloadInjector";

describe("BookPdfDownloadInjector helpers", () => {
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

  it("exposes the school print stamp", () => {
    expect(SCHOOL_PRINT_STAMP).toBe("learn Language Education Academy");
  });
});
