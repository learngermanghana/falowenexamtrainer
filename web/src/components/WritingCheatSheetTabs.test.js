import React, { useEffect, useRef, useState } from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WritingCheatSheetTabs from "./WritingCheatSheetTabs";

const TaskContent = () => <div data-testid="writing-task">Existing writing content and progress callbacks</div>;

const StatefulTaskContent = ({ onMount }) => {
  const [text, setText] = useState("");
  const reportedMount = useRef(false);

  useEffect(() => {
    if (!reportedMount.current) {
      onMount();
      reportedMount.current = true;
    }
  }, [onMount]);

  return (
    <label htmlFor="writing-draft-input">
      Draft
      <input id="writing-draft-input" value={text} onChange={(event) => setText(event.target.value)} />
    </label>
  );
};

test("task view is selected by default and keeps existing writing content inside it", () => {
  render(<WritingCheatSheetTabs level="C1" day={1}><TaskContent /></WritingCheatSheetTabs>);

  expect(screen.getByRole("tab", { name: "Schreiben Task" })).toHaveAttribute("aria-selected", "true");
  expect(screen.getByRole("tab", { name: "Cheat Sheet" })).toHaveAttribute("aria-selected", "false");
  expect(screen.getByTestId("writing-task")).toBeInTheDocument();
});

test("cheat sheet tab renders the shared general C1 sheet", () => {
  render(<WritingCheatSheetTabs level="C1" day={28}><TaskContent /></WritingCheatSheetTabs>);

  userEvent.click(screen.getByRole("tab", { name: "Cheat Sheet" }));

  expect(screen.getByText("Recommended linking expressions")).toBeInTheDocument();
  expect(screen.getByText("Useful verbs and phrases")).toBeInTheDocument();
  expect(screen.getByText("nicht nur …, sondern auch")).toBeInTheDocument();
  expect(screen.getByText("not only … but also")).toBeInTheDocument();
});

test("keeps stateful writing task mounted while switching to and from the cheat sheet", () => {
  const handleMount = jest.fn();

  render(<WritingCheatSheetTabs level="C1" day={1}><StatefulTaskContent onMount={handleMount} /></WritingCheatSheetTabs>);

  const taskTab = screen.getByRole("tab", { name: "Schreiben Task" });
  const cheatSheetTab = screen.getByRole("tab", { name: "Cheat Sheet" });
  const taskPanel = screen.getByRole("tabpanel", { name: "Schreiben Task" });
  const input = screen.getByLabelText("Draft");

  expect(taskTab).toHaveAttribute("id", "writing-task-tab");
  expect(taskTab).toHaveAttribute("aria-controls", "writing-task-panel");
  expect(taskPanel).toHaveAttribute("id", "writing-task-panel");
  expect(taskPanel).toHaveAttribute("aria-labelledby", "writing-task-tab");
  expect(cheatSheetTab).toHaveAttribute("id", "writing-cheat-sheet-tab");
  expect(cheatSheetTab).toHaveAttribute("aria-controls", "writing-cheat-sheet-panel");

  userEvent.type(input, "Meine Antwort bleibt erhalten.");
  expect(input).toHaveValue("Meine Antwort bleibt erhalten.");

  userEvent.click(cheatSheetTab);
  const cheatSheetPanel = screen.getByRole("tabpanel", { name: "Cheat Sheet" });
  expect(cheatSheetPanel).toHaveAttribute("id", "writing-cheat-sheet-panel");
  expect(cheatSheetPanel).toHaveAttribute("aria-labelledby", "writing-cheat-sheet-tab");
  expect(taskPanel).not.toBeVisible();

  userEvent.click(taskTab);
  expect(screen.getByLabelText("Draft")).toHaveValue("Meine Antwort bleibt erhalten.");
  expect(handleMount).toHaveBeenCalledTimes(1);
});

test("returns normal task content without sub-tabs when no cheat sheet exists", () => {
  render(<WritingCheatSheetTabs level="B2" day={3}><TaskContent /></WritingCheatSheetTabs>);

  expect(screen.queryByRole("tab", { name: "Schreiben Task" })).not.toBeInTheDocument();
  expect(screen.queryByRole("tab", { name: "Cheat Sheet" })).not.toBeInTheDocument();
  expect(screen.getByTestId("writing-task")).toBeInTheDocument();
});

test("does not add cheat sheet tabs for C1 Day 0", () => {
  render(<WritingCheatSheetTabs level="C1" day={0}><TaskContent /></WritingCheatSheetTabs>);

  expect(screen.queryByRole("tab", { name: "Schreiben Task" })).not.toBeInTheDocument();
  expect(screen.queryByRole("tab", { name: "Cheat Sheet" })).not.toBeInTheDocument();
  expect(screen.getByTestId("writing-task")).toBeInTheDocument();
});

test("resets to Schreiben Task when level or day changes", () => {
  const { rerender } = render(<WritingCheatSheetTabs level="C1" day={1}><TaskContent /></WritingCheatSheetTabs>);

  userEvent.click(screen.getByRole("tab", { name: "Cheat Sheet" }));
  expect(screen.getByRole("tab", { name: "Cheat Sheet" })).toHaveAttribute("aria-selected", "true");

  rerender(<WritingCheatSheetTabs level="C1" day={2}><TaskContent /></WritingCheatSheetTabs>);
  expect(screen.getByRole("tab", { name: "Schreiben Task" })).toHaveAttribute("aria-selected", "true");
});
