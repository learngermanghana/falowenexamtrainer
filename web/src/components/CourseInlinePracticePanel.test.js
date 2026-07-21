jest.mock("./WritingPage", () => {
  const React = require("react");
  return function MockWritingPage(props) {
    return React.createElement(
      "div",
      {
        "data-testid": "mark-my-letter-ui",
        "data-initial-tab": props.initialTab,
        "data-enabled-tabs": (props.enabledTabs || []).join(","),
        "data-hide-tab-list": String(Boolean(props.hideTabList)),
      },
      "Mark My Letter UI",
    );
  };
});

jest.mock("./WritingCheatSheetTabs", () => {
  const React = require("react");
  return function MockWritingCheatSheetTabs({ children }) {
    return React.createElement("div", { "data-testid": "writing-support-tabs" }, children);
  };
});

import { render, screen } from "@testing-library/react";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";

const originalPath = `${window.location.pathname}${window.location.search}`;

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

test("B1 Teil 2 embeds Mark My Letter instead of a plain draft textarea", () => {
  window.history.pushState(
    {},
    "",
    "/campus/course/lesson/B1/1?view=workbook&assignmentKey=B1-1.1&radio=done",
  );

  render(
    <CourseInlinePracticePanel
      type="writing"
      writingContext={{
        level: "B1",
        courseLevel: "B1",
        day: 1,
        lessonId: "B1-day-1",
        workbookId: "B1Day1Traumwelt",
        writingTaskId: "B1Day1Traumwelt-teil-2-writing",
      }}
    />,
  );

  const marker = screen.getByTestId("mark-my-letter-ui");
  expect(marker).toBeVisible();
  expect(marker).toHaveAttribute("data-initial-tab", "mark");
  expect(marker).toHaveAttribute("data-enabled-tabs", "mark");
  expect(marker).toHaveAttribute("data-hide-tab-list", "true");
  expect(screen.getByTestId("writing-support-tabs")).toContainElement(marker);
  expect(screen.queryByLabelText("B1 writing draft")).not.toBeInTheDocument();
});
