import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import A1RadioFirstWorkbookRoutes from "./A1RadioFirstWorkbookRoutes";

describe("A1 Radio route ownership", () => {
  test("Day 5 relinquishes the screen after radio=done so the self-learning journey can own materials", () => {
    render(
      <MemoryRouter
        initialEntries={[
          "/campus/course/a1-day-5-introducing-yourself-and-articles-workbook?radio=done",
        ]}
      >
        <A1RadioFirstWorkbookRoutes />
      </MemoryRouter>,
    );

    expect(document.querySelector('[data-a1-radio-first-workbook-route="true"]')).not.toBeInTheDocument();
    expect(document.querySelector('[data-a1-self-learning-materials-route="true"]')).not.toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /Choose your learning material/i })).not.toBeInTheDocument();
  });

  test("Day 5 still owns the screen while Falowen Radio is incomplete", () => {
    render(
      <MemoryRouter
        initialEntries={[
          "/campus/course/a1-day-5-introducing-yourself-and-articles-workbook",
        ]}
      >
        <A1RadioFirstWorkbookRoutes />
      </MemoryRouter>,
    );

    expect(document.querySelector('[data-a1-radio-first-workbook-route="true"]')).toBeInTheDocument();
  });
});
