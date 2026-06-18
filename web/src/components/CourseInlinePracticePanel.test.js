import { render, screen } from "@testing-library/react";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";

const originalPath = window.location.pathname;

afterEach(() => {
  window.history.pushState({}, "", originalPath || "/");
});

test("historical A2 Small Talk workbook route renders the Day 1 speaking mind map", () => {
  window.history.pushState({}, "", "/campus/course/a2-day-2-small-talk-workbook");

  render(
    <CourseInlinePracticePanel
      type="speaking"
      defaultOpen={false}
    />,
  );

  expect(screen.getByTestId("mind-map-centre")).toHaveTextContent(
    "Wie führst du ein kurzes freundliches Gespräch?",
  );
  expect(screen.getByRole("button", { name: /Begrüßung/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "More speaking help" })).toBeInTheDocument();
});

test("unrelated workbook routes do not receive the Small Talk map", () => {
  window.history.pushState({}, "", "/campus/course/a1-day-4-numbers-workbook");

  render(
    <CourseInlinePracticePanel
      type="speaking"
      defaultOpen={false}
    />,
  );

  expect(screen.queryByTestId("mind-map-centre")).not.toBeInTheDocument();
});
