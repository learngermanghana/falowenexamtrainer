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

jest.mock("./B1WritingWorkspace", () => {
  const React = require("react");
  return function MockB1WritingWorkspace({ writingContext }) {
    return React.createElement(
      "div",
      {
        "data-testid": "b1-writing-workspace",
        "data-level": writingContext.level,
        "data-day": String(writingContext.day),
      },
      "B1 planning, Schreiben and Analyse my text workspace",
    );
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

test("B1 Teil 2 renders the shared two-box workspace without an outer practice card", () => {
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

  expect(screen.queryByText("Teil 2 writing workspace")).not.toBeInTheDocument();
  const workspace = screen.getByTestId("b1-writing-workspace");
  expect(workspace).toBeVisible();
  expect(workspace).toHaveAttribute("data-level", "B1");
  expect(workspace).toHaveAttribute("data-day", "1");
  expect(screen.queryByTestId("writing-support-tabs")).not.toBeInTheDocument();
});

test("A2 Small Talk Schreiben uses the same shared workspace", () => {
  window.history.pushState({}, "", "/campus/course/a2-day-2-small-talk-workbook");

  render(<CourseInlinePracticePanel type="writing" />);

  const workspace = screen.getByTestId("b1-writing-workspace");
  expect(workspace).toHaveAttribute("data-level", "A2");
  expect(workspace).toHaveAttribute("data-day", "2");
  expect(screen.queryByTestId("mark-my-letter-ui")).not.toBeInTheDocument();
  expect(screen.queryByTestId("writing-support-tabs")).not.toBeInTheDocument();
});
