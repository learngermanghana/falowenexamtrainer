import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { getA1Assignment } from "../data/a1AssignmentRegistry";
import A1Day17InstructionsDirectionsKapitel11WorkbookPage from "./A1Day17InstructionsDirectionsKapitel11WorkbookPage";

jest.mock("./VerifiedCloudDraftSubmissionPage", () => () => (
  <div data-testid="verified-cloud-draft-submission" />
));

const route = "/campus/course/a1-day-17-instructions-and-directions-kapitel-11-workbook";

describe("A1 Day 17 native standard workbook", () => {
  test("uses the same native A1 shared navigation contract as Day 1", () => {
    const { container } = render(
      <MemoryRouter initialEntries={[`${route}?radio=done`]}>
        <A1Day17InstructionsDirectionsKapitel11WorkbookPage />
      </MemoryRouter>,
    );

    expect(getA1Assignment("A1-11")).toEqual(
      expect.objectContaining({
        layoutMode: "native",
        day: 17,
        chapter: "11",
      }),
    );
    expect(container.querySelector('[data-a1-shared-workbook="A1-11"]')).toBeInTheDocument();

    const navigation = screen.getByRole("tablist", { name: /A1-11 workbook sections/i });
    expect(navigation).toBeVisible();
    expect(screen.getByRole("tab", { name: "Overview" })).toBeVisible();
    expect(screen.getByRole("tab", { name: /Teil 1/i })).toBeVisible();
    expect(screen.getByRole("tab", { name: /Teil 2/i })).toBeVisible();
    expect(screen.getByRole("tab", { name: /Teil 3/i })).toBeVisible();
    expect(screen.getByRole("tab", { name: "Submit" })).toBeVisible();
  });

  test("opens each original section through the native tabs", () => {
    render(
      <MemoryRouter initialEntries={[`${route}?radio=done`]}>
        <A1Day17InstructionsDirectionsKapitel11WorkbookPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("tab", { name: /Teil 1/i }));
    expect(screen.getByRole("heading", { name: /Teil 1 · Lesen Essay: Wegbeschreibungen/i })).toBeVisible();
    expect(screen.getByText("Wo ist der Bahnhof?")).toBeVisible();

    fireEvent.click(screen.getByRole("tab", { name: /Teil 2/i }));
    expect(screen.getByRole("heading", { name: /Teil 2 · Lesen Essay: Wegbeschreibungen/i })).toBeVisible();
    expect(screen.getByText("Wo ist die Apotheke?")).toBeVisible();

    fireEvent.click(screen.getByRole("tab", { name: /Teil 3/i }));
    expect(screen.getByRole("heading", { name: /Teil 3 · Schreiben Assignment/i })).toBeVisible();
    expect(screen.getByText(/How do I get to the train station/i)).toBeVisible();
  });
});
