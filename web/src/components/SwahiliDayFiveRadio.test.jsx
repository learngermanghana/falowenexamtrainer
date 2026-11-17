import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SwahiliDayFiveWorkbook from "./SwahiliDayFiveWorkbook";
import { SWAHILI_DAY_FIVE } from "../data/swahili/dayFive";

jest.mock("../context/AuthContext", () => ({ useAuth: () => ({ user: null, studentProfile: null }) }));

test.each(["/swahili", "/campus/course/swahili"])("Day 5 on %s opens the correct Familia Yangu episode", basePath => {
  const { unmount } = render(
    <MemoryRouter initialEntries={[basePath + "/day-5?view=radio"]}>
      <SwahiliDayFiveWorkbook preview={basePath === "/swahili"} />
    </MemoryRouter>,
  );
  expect(SWAHILI_DAY_FIVE.radio.youtubeId).toBe("qfgDXc8yYiE");
  expect(screen.getByTitle("Falowen Radio: Familia Yangu").src).toContain("/embed/qfgDXc8yYiE");
  expect(screen.getByRole("button", { name: /Continue to workbook/ })).toBeVisible();
  expect(screen.queryAllByRole("tab")).toHaveLength(0);
  unmount();
});

test("Day 5 workbook mirrors the Radio questions but keeps other recorded listening separate", () => {
  render(
    <MemoryRouter initialEntries={["/swahili/day-5?radio=done&view=hoeren"]}>
      <SwahiliDayFiveWorkbook preview />
    </MemoryRouter>,
  );
  expect(screen.getByRole("heading", { name: "Falowen Radio · Familia Yangu" })).toBeVisible();
  expect(screen.getByRole("link", { name: "Play Familia Yangu on YouTube" }).getAttribute("href")).toBe("https://youtu.be/qfgDXc8yYiE");
  expect(screen.getAllByRole("textbox")).toHaveLength(4);
  fireEvent.change(screen.getByRole("textbox", { name: "Answer for question 1" }), { target: { value: "wazazi" } });
  expect(screen.getByRole("textbox", { name: "Answer for question 1" }).value).toBe("wazazi");
  expect(screen.getByText(/Additional listening practice/)).toBeVisible();
  fireEvent.click(screen.getByRole("tab", { name: /Submit/ }));
  expect(screen.getByText("Receive & Submit · Review Falowen Radio answers")).toBeVisible();
  expect(screen.getAllByRole("radio")).toHaveLength(27);
});

test("Day 5 writing requests at least seven sentences with the supplied model hidden initially", () => {
  render(
    <MemoryRouter initialEntries={["/swahili/day-5?radio=done&view=schreiben"]}>
      <SwahiliDayFiveWorkbook preview />
    </MemoryRouter>,
  );
  expect(screen.getByText(/sentensi zisizopungua saba/)).toBeVisible();
  expect(screen.getByText(/Idadi ya watu katika familia yako/)).toBeVisible();
  expect(screen.queryByText(/Tunapenda kupika na kula pamoja/)).toBeNull();
  fireEvent.click(screen.getByRole("tab", { name: /Submit/ }));
  fireEvent.click(screen.getByText("Review model writing"));
  expect(screen.getByText(/Tunapenda kupika na kula pamoja/)).toBeVisible();
});
