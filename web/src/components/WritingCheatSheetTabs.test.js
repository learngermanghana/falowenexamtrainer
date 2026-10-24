import React, { useEffect, useRef, useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WritingCheatSheetTabs from "./WritingCheatSheetTabs";

const TaskContent = () => <div data-testid="writing-task">Existing writing content and progress callbacks</div>;

const getElementById = (container, id) => container.querySelector(`[id="${id}"]`);

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

test("cheat sheet tab renders lower-level sheets with the same renderer", () => {
  render(<WritingCheatSheetTabs level="B2" day={3}><TaskContent /></WritingCheatSheetTabs>);

  userEvent.click(screen.getByRole("tab", { name: "Cheat Sheet" }));

  expect(screen.getByText("B2 argument linkers")).toBeInTheDocument();
  expect(screen.getByText("meiner Ansicht nach")).toBeInTheDocument();
});

test("renders the B1 opinion template as a structured template section", () => {
  const { container } = render(
    <WritingCheatSheetTabs level="B1" day={4}><TaskContent /></WritingCheatSheetTabs>,
  );

  userEvent.click(screen.getByRole("tab", { name: "Cheat Sheet" }));

  expect(screen.getByText("B1 opinion text template")).toBeInTheDocument();
  expect(screen.getByText("Einleitung")).toBeInTheDocument();
  expect(
    screen.getByText(/Heutzutage ist das Thema \[Thema\] ein sehr wichtiges Thema/),
  ).toBeInTheDocument();
  expect(
    container.querySelector('[data-cheat-sheet-layout="template"]'),
  ).toBeInTheDocument();
});

test("renders the upgraded B2 opinion template", () => {
  render(<WritingCheatSheetTabs level="B2" day={4}><TaskContent /></WritingCheatSheetTabs>);

  userEvent.click(screen.getByRole("tab", { name: "Cheat Sheet" }));

  expect(screen.getByText("B2 opinion text template")).toBeInTheDocument();
  expect(
    screen.getByText(/gewinnt heutzutage zunehmend an Bedeutung/),
  ).toBeInTheDocument();
  expect(
    screen.getByText(/Unter Abwägung beider Seiten/),
  ).toBeInTheDocument();
});

test("keeps stateful writing task mounted while switching to and from the cheat sheet", () => {
  const handleMount = jest.fn();

  render(<WritingCheatSheetTabs level="C1" day={1}><StatefulTaskContent onMount={handleMount} /></WritingCheatSheetTabs>);

  const taskTab = screen.getByRole("tab", { name: "Schreiben Task" });
  const cheatSheetTab = screen.getByRole("tab", { name: "Cheat Sheet" });
  const taskPanel = screen.getByRole("tabpanel", { name: "Schreiben Task" });
  const input = screen.getByLabelText("Draft");

  expect(taskTab).toHaveAttribute("aria-controls", taskPanel.id);
  expect(taskPanel).toHaveAttribute("aria-labelledby", taskTab.id);
  expect(cheatSheetTab).toHaveAttribute("aria-controls");

  userEvent.type(input, "Meine Antwort bleibt erhalten.");
  expect(input).toHaveValue("Meine Antwort bleibt erhalten.");

  userEvent.click(cheatSheetTab);
  const cheatSheetPanel = screen.getByRole("tabpanel", { name: "Cheat Sheet" });
  expect(cheatSheetTab).toHaveAttribute("aria-controls", cheatSheetPanel.id);
  expect(cheatSheetPanel).toHaveAttribute("aria-labelledby", cheatSheetTab.id);
  expect(taskPanel).not.toBeVisible();

  userEvent.click(taskTab);
  expect(screen.getByLabelText("Draft")).toHaveValue("Meine Antwort bleibt erhalten.");
  expect(handleMount).toHaveBeenCalledTimes(1);
});

test("generates unique tab and panel IDs for each component instance", () => {
  const { container } = render(
    <div>
      <WritingCheatSheetTabs level="C1" day={1}><TaskContent /></WritingCheatSheetTabs>
      <WritingCheatSheetTabs level="C1" day={2}><TaskContent /></WritingCheatSheetTabs>
    </div>
  );

  const tablists = screen.getAllByRole("tablist", { name: "Writing support" });

  tablists.forEach((tablist) => {
    const taskTab = within(tablist).getByRole("tab", { name: "Schreiben Task" });
    const cheatSheetTab = within(tablist).getByRole("tab", { name: "Cheat Sheet" });
    const taskPanel = getElementById(container, taskTab.getAttribute("aria-controls"));

    expect(taskTab).toHaveAttribute("aria-controls", taskPanel.id);
    expect(taskPanel).toHaveAttribute("aria-labelledby", taskTab.id);

    userEvent.click(cheatSheetTab);
    const cheatSheetPanel = getElementById(container, cheatSheetTab.getAttribute("aria-controls"));
    expect(cheatSheetTab).toHaveAttribute("aria-controls", cheatSheetPanel.id);
    expect(cheatSheetPanel).toHaveAttribute("aria-labelledby", cheatSheetTab.id);
  });

  const ids = Array.from(container.querySelectorAll("[id]"), (element) => element.id);
  expect(new Set(ids).size).toBe(ids.length);
});

test("returns normal task content without sub-tabs when no cheat sheet exists", () => {
  render(<WritingCheatSheetTabs level="A1" day={3}><TaskContent /></WritingCheatSheetTabs>);

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