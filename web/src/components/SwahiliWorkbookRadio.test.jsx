import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SwahiliDaySixWorkbook from "./SwahiliDaySixWorkbook";
import SwahiliWorkbookRadio from "./SwahiliWorkbookRadio";
import SwahiliA1PracticeWorkbook from "./SwahiliA1PracticeWorkbook";
import SwahiliB1Day28Workbook from "./SwahiliB1Day28Workbook";
import { SWAHILI_A1_PRACTICE_UNITS } from "../data/swahili/a1PracticeUnits";
import { SWAHILI_DAY_ONE } from "../data/swahili/dayOne";
import { buildCompletedRadioHref } from "./RadioFirstWorkbookGate";

jest.mock("../context/AuthContext", () => ({ useAuth: () => ({ user: null, studentProfile: null }) }));

test.each(["/swahili", "/campus/course/swahili"])("%s Day 6 starts with the restaurant episode and opens the workbook on Continue", basePath => {
  const pathname = basePath + "/day-6";
  const renderDay = path => render(<MemoryRouter initialEntries={[path]}>
    <SwahiliDaySixWorkbook basePath={basePath} preview={basePath === "/swahili"} />
  </MemoryRouter>);
  const start = renderDay(pathname);
  expect(screen.getByTitle(/Falowen Radio: Mgahawani/).src).toContain("/embed/ZesonfipX4I");
  expect(screen.getByRole("button", { name: /Continue to workbook/ })).toBeVisible();
  expect(screen.queryAllByRole("tab")).toHaveLength(0);
  start.unmount();
  renderDay(buildCompletedRadioHref({ pathname }));
  expect(screen.getByTitle("Mgahawani · AI lecture").src).toContain("/embed/Tlc0mbxxkd8");
  expect(screen.getAllByRole("tab")).toHaveLength(7);
  expect(screen.queryByTitle(/Falowen Radio: Mgahawani/)).toBeNull();
});

test("a lesson without an episode goes directly to its workbook", () => {
  render(<SwahiliWorkbookRadio lesson={SWAHILI_DAY_ONE}><p>Day 1</p></SwahiliWorkbookRadio>);
  expect(screen.getByText("Day 1")).toBeVisible();
});


test.each([[10, "4_ygEiW5QjI"], [11, "_eSAXWecsgY"], [12, "QdpRliUlbMA"]])(
  "A1 Day %i opens the shared Radio screen before workbook navigation",
  (day, videoId) => {
    const pathname = `/campus/course/swahili/day-${day}`;
    const search = "?view=hoeren";
    const renderDay = path => render(<MemoryRouter initialEntries={[path]}>
      <SwahiliA1PracticeWorkbook lesson={SWAHILI_A1_PRACTICE_UNITS[day]} />
    </MemoryRouter>);

    const opening = renderDay(pathname + search);
    expect(screen.getByTitle(/^Falowen Radio:/).src).toContain("/embed/" + videoId);
    expect(screen.getByRole("button", { name: /Continue to workbook/ })).toBeVisible();
    expect(screen.queryAllByRole("tab")).toHaveLength(0);
    expect(screen.queryByTitle(/Video ya AI/)).toBeNull();
    opening.unmount();

    renderDay(buildCompletedRadioHref({ pathname, search }));
    expect(screen.queryByTitle(/^Falowen Radio:/)).toBeNull();
    expect(screen.getByRole("heading", { name: /Teil 4 · Kusikiliza/ })).toBeVisible();
    expect(screen.getByRole("button", { name: /Load audio/ })).toBeVisible();
  }
);

test("B1 Day 28 uses the shared Radio screen with its podcast activities before Continue", () => {
  render(<MemoryRouter initialEntries={["/campus/course/swahili/b1/day-28"]}>
    <SwahiliB1Day28Workbook uid="student" />
  </MemoryRouter>);
  expect(screen.getByTitle(/^Falowen Radio:/).src).toContain("/embed/aeXVw4Q4olE");
  expect(screen.getByRole("heading", { name: "Maswali kuhusu podcast" })).toBeVisible();
  expect(screen.getByRole("button", { name: /Continue to workbook/ })).toBeVisible();
  expect(screen.queryAllByRole("tab")).toHaveLength(0);
});
