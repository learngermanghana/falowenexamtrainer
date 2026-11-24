import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import PersonalExamCountdown, { examDaysRemaining } from "./PersonalExamCountdown";

test("countdown compares calendar dates and rejects invalid dates", () => {
  const now = new Date(2026,10,24,23,30);
  expect(examDaysRemaining("2026-12-01",now)).toBe(7);
  expect(examDaysRemaining("2026-11-24",now)).toBe(0);
  expect(examDaysRemaining("2026-11-23",now)).toBe(-1);
  expect(examDaysRemaining("2026-02-31",now)).toBeNull();
});
test("personal exam dates persist for the same student and level only", () => {
  window.localStorage.clear();
  const first=render(<PersonalExamCountdown uid="a" level="A2" />);
  fireEvent.change(screen.getByLabelText("Booked exam date"),{target:{value:"2027-02-01"}});
  first.unmount();
  const second=render(<PersonalExamCountdown uid="a" level="A2" />);
  expect(screen.getByLabelText("Booked exam date")).toHaveValue("2027-02-01");
  second.unmount();
  const other=render(<PersonalExamCountdown uid="b" level="A2" />);
  expect(screen.getByLabelText("Booked exam date")).toHaveValue("");
  other.unmount();
  render(<PersonalExamCountdown uid="a" level="B1" />);
  expect(screen.getByLabelText("Booked exam date")).toHaveValue("");
  window.localStorage.clear();
});
