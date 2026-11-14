import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SwahiliDaySixWorkbook from "./SwahiliDaySixWorkbook";
import SwahiliWorkbookRadio from "./SwahiliWorkbookRadio";
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
