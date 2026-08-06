import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
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

  it.each(["A1", "A2", "B1", "B2", "C1"])(
    "supports the merged %s lesson workbook route",
    (level) => {
      const pathname = `/campus/course/lesson/${level}/12`;
      expect(isPrintableBookRoute(pathname, "?view=workbook")).toBe(true);
      expect(getPrintableBookKind(pathname, "?view=workbook")).toBe("combined");
      expect(getPrintableBookKind(pathname, "?view=grammar")).toBe("grammar");
      expect(isPrintableBookRoute(pathname)).toBe(false);
    }
  );

  it("offers one combined download and prints the current lesson", () => {
    const print = jest.spyOn(window, "print").mockImplementation(() => {});
    render(
      <MemoryRouter initialEntries={["/campus/course/lesson/C1/12?view=workbook"]}>
        <BookPdfDownloadInjector />
      </MemoryRouter>
    );

    expect(screen.getByText("Grammar + workbook")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Download PDF" }));
    expect(print).toHaveBeenCalledTimes(1);
    print.mockRestore();
  });

  it("exposes the school print stamp", () => {
    expect(SCHOOL_PRINT_STAMP).toBe("learn Language Education Academy");
  });
});
