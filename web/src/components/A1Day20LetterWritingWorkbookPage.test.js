import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

jest.mock("./PublishedHoerenPractice", () => () => null);

jest.mock("./A1CanonicalSubmissionPanel", () => ({ assignment }) => (
  <div data-testid="canonical-submit">Submit {assignment.assignmentKey}</div>
));

jest.mock("./A1TutorDraftSectionCapture", () => () => null);
jest.mock("./A1TimedMockExam", () => ({
  __esModule: true,
  default: ({ children }) => children,
  useA1TimedMockExam: () => ({ assignmentLocked: false, isTabLocked: () => false }),
}));

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
          "/campus/course/letter-writing-intro-german-a1-day-12-3?radio=done&workbookTab=grammar&assignmentKey=A1-12.3&assignmentId=A1-12.3&level=A1",
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
    const teilOneTab = screen.getByRole("tab", { name: /Teil 1 · Formular ausfüllen/i });
    const teilTwoTab = screen.getByRole("tab", { name: /Teil 2 · E-Mail an Julia/i });
    const submitTab = screen.getByRole("tab", { name: "Review & Submit" });

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

  test("shows five form fields and one invitation writing tool", () => {
    render(<MemoryRouter><A1Day20LetterWritingWorkbookPage /></MemoryRouter>);
    const panels = screen.getAllByTestId("letter-practice");
    expect(panels).toHaveLength(1);
    expect(panels[0]).toHaveAttribute("data-task-id", "A1-12.3-teil-2-julia-invitation");
    expect(panels[0]).toHaveAttribute("data-letter-type", "informal");
    fireEvent.click(screen.getByRole("tab", {name:/Teil 1 · Formular/}));
    const form = document.querySelector('[data-a1-form-task="maria"]');
    expect(form.querySelectorAll("li")).toHaveLength(5);
    expect(form).toHaveTextContent("Der Kurs beginnt im August");
    expect(form).not.toHaveTextContent("Geburtsort");
    fireEvent.click(screen.getByRole("tab", {name:/Teil 2 · E-Mail/}));
    const email = document.querySelector('[data-a1-letter-task="informal"]');
    expect(email.querySelectorAll("li")).toHaveLength(3);
    expect(email).toHaveTextContent("circa 30 Wörter");
    expect(email).not.toHaveTextContent("Liebe Julia,");
  });
  test("restores informal letter steps and weil explanations on the Day 12.3 Grammar tab", async () => {
    const { container } = render(
      <MemoryRouter
        initialEntries={[
          "/campus/course/letter-writing-intro-german-a1-day-12-3?radio=done&assignmentKey=A1-12.3&assignmentId=A1-12.3&level=A1&workbookTab=grammar&view=grammar",
        ]}
      >
        <A1Day20LetterWritingWorkbookPage />
      </MemoryRouter>,
    );

    expect(screen.getByRole("tab", { name: "Grammar" })).toHaveAttribute("aria-selected", "true");
    expect(await screen.findByRole("heading", { name: "Informal Letter Structure" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "How to use weil (because)" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Formal Letter Structure" })).toBeInTheDocument();

    const notes = container.querySelector('[data-a1-day20-letter-structure="true"]');
    expect(notes).not.toBeNull();
    expect(notes).toHaveTextContent("Liebe Sara,");
    expect(notes).toHaveTextContent("Ich bleibe zu Hause, weil ich krank bin.");
    expect(notes).toHaveTextContent("denn (because)");
    expect(notes).toHaveTextContent("Mit freundlichen Grüßen");
    expect(screen.getByRole("tab", { name: /Teil 2 · E-Mail an Julia/ })).toBeInTheDocument();
  });

});
