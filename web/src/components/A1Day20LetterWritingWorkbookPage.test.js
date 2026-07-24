import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

jest.mock("./A1CanonicalSubmissionPanel", () => ({ assignment }) => (
  <div data-testid="canonical-submit">Submit {assignment.assignmentKey}</div>
));

jest.mock("./A1CourseBookLetterPracticePanel", () => ({
  title,
  taskId,
  letterType,
  promptType,
  placeholder,
  taskContext,
}) => (
  <div
    data-testid="letter-practice"
    data-task-id={taskId}
    data-letter-type={letterType}
    data-prompt-type={promptType}
    data-placeholder={placeholder}
    data-task-context={taskContext}
  >
    {title}
  </div>
));

import A1Day20LetterWritingWorkbookPage from "./A1Day20LetterWritingWorkbookPage";

describe("A1 Day 20 letter-writing workbook", () => {
  test("renders the canonical shared Grammar, Overview, Teil 1, Teil 2 and Submit navigation", () => {
    const { container } = render(
      <MemoryRouter
        initialEntries={[
          "/campus/course/letter-writing-intro-german-a1-day-12-3?radio=done",
        ]}
      >
        <A1Day20LetterWritingWorkbookPage />
      </MemoryRouter>,
    );

    const navigation = screen.getByRole("tablist", {
      name: "A1-12.3 workbook sections",
    });
    expect(navigation).toHaveAttribute("data-workbook-navigation", "shared");

    const grammarTab = screen.getByRole("tab", { name: "Grammar" });
    const overviewTab = screen.getByRole("tab", { name: "Overview" });
    const teilOneTab = screen.getByRole("tab", { name: /Teil 1 · Informal letter/i });
    const teilTwoTab = screen.getByRole("tab", { name: /Teil 2 · Formal letter/i });
    const submitTab = screen.getByRole("tab", { name: "Submit" });

    expect(grammarTab).toHaveAttribute("aria-selected", "true");
    expect(overviewTab).toHaveAttribute("aria-selected", "false");
    expect(teilOneTab).toHaveAttribute("aria-selected", "false");
    expect(teilTwoTab).toHaveAttribute("aria-selected", "false");
    expect(submitTab).toHaveAttribute("aria-selected", "false");
    expect(screen.queryByRole("link", { name: /open grammar notes/i })).not.toBeInTheDocument();

    fireEvent.click(teilOneTab);
    expect(teilOneTab).toHaveAttribute("aria-selected", "true");
    expect(
      container.querySelector('[data-workbook-section="teil-1"]').parentElement,
    ).not.toHaveAttribute("hidden");

    fireEvent.click(teilTwoTab);
    expect(teilTwoTab).toHaveAttribute("aria-selected", "true");
    expect(
      container.querySelector('[data-workbook-section="teil-2"]').parentElement,
    ).not.toHaveAttribute("hidden");

    fireEvent.click(submitTab);
    expect(submitTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByTestId("canonical-submit")).toHaveTextContent("A1-12.3");
  });

  test("places two independently configured Mark My Letter tools below the tasks", () => {
    render(
      <MemoryRouter>
        <A1Day20LetterWritingWorkbookPage />
      </MemoryRouter>,
    );

    const practicePanels = screen.getAllByTestId("letter-practice");
    expect(practicePanels).toHaveLength(2);

    const informal = screen.getByText("Mark My Informal Letter");
    const formal = screen.getByText("Mark My Formal Letter");

    expect(informal).toHaveAttribute(
      "data-task-id",
      "A1-12.3-teil-1-informal-letter",
    );
    expect(formal).toHaveAttribute(
      "data-task-id",
      "A1-12.3-teil-2-formal-letter",
    );
    expect(informal).toHaveAttribute("data-letter-type", "informal");
    expect(formal).toHaveAttribute("data-letter-type", "formal");
    expect(informal).toHaveAttribute("data-prompt-type", "note");
    expect(formal).toHaveAttribute("data-prompt-type", "email");
    expect(informal.getAttribute("data-placeholder")).toContain("Hallo Anna");
    expect(formal.getAttribute("data-placeholder")).toContain(
      "Sehr geehrte Damen und Herren",
    );
    expect(informal.getAttribute("data-task-context")).toContain("informal");
    expect(formal.getAttribute("data-task-context")).toContain("formal email");
  });
});
