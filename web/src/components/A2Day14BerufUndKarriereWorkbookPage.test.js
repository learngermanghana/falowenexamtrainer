import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import A2Day14BerufUndKarriereWorkbookPage from "./A2Day14BerufUndKarriereWorkbookPage";

describe("A2 Day 14 Beruf und Karriere workbook", () => {
  test("shows the standard workbook tabs", () => {
    render(
      <MemoryRouter initialEntries={["/campus/course/a2-day-14-beruf-und-karriere-workbook?radio=done"]}>
        <A2Day14BerufUndKarriereWorkbookPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("tab", { name: "Teil 1" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Teil 2" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Teil 3" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Teil 4" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Ref" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Submit" })).toBeInTheDocument();
  });
});
