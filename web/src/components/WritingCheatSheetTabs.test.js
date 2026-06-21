import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WritingCheatSheetTabs from "./WritingCheatSheetTabs";

const TaskContent = () => <div data-testid="writing-task">Existing writing content and progress callbacks</div>;

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

test("returns normal task content without sub-tabs when no cheat sheet exists", () => {
  render(<WritingCheatSheetTabs level="B2" day={3}><TaskContent /></WritingCheatSheetTabs>);

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
