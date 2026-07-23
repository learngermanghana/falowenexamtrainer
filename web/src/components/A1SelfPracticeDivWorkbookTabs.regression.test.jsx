import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import A1SharedPracticeWorkbookNavigation from "./A1SharedPracticeWorkbookNavigation";
import { applyA1WorkbookSectionTabs } from "./A1WorkbookSectionTabs";

const DAY6_PATH = "/campus/course/a1-day-6-family-and-hobbies-workbook";

const DivCardPracticeWorkbook = () => (
  <main className="layout-main">
    <div data-testid="practice-page">
      <div><h1>A1 Day 6 self-practice</h1></div>
      <nav data-a1-teil-navigation="true">
        <button type="button">Overview</button>
        <button type="button">Teil 1 · Family</button>
        <button type="button">Teil 2 · Writing</button>
        <button type="button">Teil 3 · Languages</button>
      </nav>
      <div data-testid="practice-section-1"><h2>Teil 1 · Family</h2><p>Family practice</p></div>
      <div data-testid="practice-section-2"><h2>Teil 2 · Writing</h2><p>Writing practice</p></div>
      <div data-testid="practice-section-3"><h2>Teil 3 · Languages</h2><p>Language practice</p></div>
    </div>
  </main>
);

describe("A1 self-practice div-card workbook navigation", () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
    window.requestAnimationFrame = (callback) => window.setTimeout(callback, 0);
    window.cancelAnimationFrame = (id) => window.clearTimeout(id);
  });

  test("keeps workbook content visible and switches div-based Teil cards", async () => {
    render(
      <MemoryRouter initialEntries={[`${DAY6_PATH}?radio=done&materials=done&workbookTab=section-1`]}>
        <DivCardPracticeWorkbook />
        <A1SharedPracticeWorkbookNavigation />
      </MemoryRouter>,
    );

    // Reproduce the production race: the legacy tab controller can run before
    // the shared self-practice navigator mounts and temporarily hide the page.
    expect(
      applyA1WorkbookSectionTabs(document, {
        pathname: DAY6_PATH,
        search: "?radio=done&materials=done&workbookTab=section-1",
      }),
    ).toBe(true);

    await screen.findByRole("region", { name: "A1 self-practice workbook navigation" });

    // Once the shared navigator exists, the legacy controller must release all
    // content it previously managed instead of keeping the workbook blank.
    expect(
      applyA1WorkbookSectionTabs(document, {
        pathname: DAY6_PATH,
        search: "?radio=done&materials=done&workbookTab=section-1",
      }),
    ).toBe(false);

    await waitFor(() => expect(screen.getByTestId("practice-section-1")).toBeVisible());
    expect(screen.getByTestId("practice-section-2")).not.toBeVisible();
    expect(screen.getByRole("tab", { name: "Teil 1" })).toHaveAttribute("aria-selected", "true");
    expect(document.querySelector('[data-a1-teil-navigation="true"]')).not.toBeVisible();

    fireEvent.click(screen.getByRole("tab", { name: "Teil 2" }));
    await waitFor(() => expect(screen.getByTestId("practice-section-2")).toBeVisible());
    expect(screen.getByTestId("practice-section-1")).not.toBeVisible();
  });
});
