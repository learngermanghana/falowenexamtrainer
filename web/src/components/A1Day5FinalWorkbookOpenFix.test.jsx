import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter, useLocation } from "react-router-dom";
import A1Day5FinalWorkbookOpenFix, {
  A1_DAY5_FINAL_WORKBOOK_PATH,
  resolveA1Day5FinalWorkbookSearch,
} from "./A1Day5FinalWorkbookOpenFix";

const LocationProbe = () => {
  const location = useLocation();
  return <output data-testid="location-search">{location.search}</output>;
};

describe("A1 Day 5 completed workbook route", () => {
  test("opens the completed Day 5 workbook on Teil 1 instead of a hidden Overview", async () => {
    render(
      <MemoryRouter
        initialEntries={[
          `${A1_DAY5_FINAL_WORKBOOK_PATH}?radio=done&materials=done`,
        ]}
      >
        <A1Day5FinalWorkbookOpenFix />
        <LocationProbe />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByTestId("location-search")).toHaveTextContent("radio=done");
      expect(screen.getByTestId("location-search")).toHaveTextContent("materials=done");
      expect(screen.getByTestId("location-search")).toHaveTextContent("workbookTab=section-1");
    });
  });

  test("does not interfere with Radio, materials, or an explicitly selected workbook tab", () => {
    expect(
      resolveA1Day5FinalWorkbookSearch({
        pathname: A1_DAY5_FINAL_WORKBOOK_PATH,
        search: "?radio=done",
      }),
    ).toBe("");

    expect(
      resolveA1Day5FinalWorkbookSearch({
        pathname: A1_DAY5_FINAL_WORKBOOK_PATH,
        search: "?radio=done&materials=done&workbookTab=overview",
      }),
    ).toBe("");

    expect(
      resolveA1Day5FinalWorkbookSearch({
        pathname: "/campus/course/a1-day-6-family-and-hobbies-workbook",
        search: "?radio=done&materials=done",
      }),
    ).toBe("");
  });
});
