import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import B1Day21LebensformenHeuteWorkbookPage, {
  B1_DAY21_HAS_TEIL4,
} from "./B1Day21LebensformenHeuteWorkbookPage";

jest.mock("./navigation/AppBackButton", () => () => <div>Back</div>);
jest.mock("./AssignmentSubmissionPage", () => () => <div>Submission form</div>);
jest.mock("./CourseInlinePracticePanel", () => ({ type }) => (
  <div data-course-inline-practice={type}>{type} practice</div>
));
jest.mock("./WorkbookReferenceAnswers", () => () => <div>Reference answers</div>);
jest.mock("./A2B1WorkbookGuidance", () => ({
  A2B1WorkbookGuidance: () => <div>Workbook guidance</div>,
  WorkbookSubmissionReminder: () => <div>Submission reminder</div>,
}));

describe("B1 Day 21 workbook parts", () => {
  test("states that there is no Teil 4 and hides the Hören tab", () => {
    const { container } = render(
      <MemoryRouter>
        <B1Day21LebensformenHeuteWorkbookPage />
      </MemoryRouter>,
    );

    expect(B1_DAY21_HAS_TEIL4).toBe(false);
    const notice = container.querySelector('[data-b1-day21-no-teil4-notice="true"]');
    expect(notice).toBeVisible();
    expect(notice).toHaveTextContent("There is no Teil 4 · Hören for this lesson");

    const teil4Tab = screen.getByRole("tab", { name: "Teil 4", hidden: true });
    expect(teil4Tab).not.toBeVisible();
    expect(screen.queryByRole("heading", { name: /Teil 4 · Hören/i })).not.toBeInTheDocument();
  });

  test("the Submit page requests only Teil 2 and Teil 3", () => {
    render(
      <MemoryRouter>
        <B1Day21LebensformenHeuteWorkbookPage />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("tab", { name: "Submit" }));
    expect(screen.getByRole("heading", { name: "Submit workbook answers" })).toBeVisible();
    expect(screen.getByText("Submit Teil 2 and Teil 3.")).toBeVisible();
    expect(screen.getByText("Teil 1 is group practice. There is no Teil 4 in this workbook.")).toBeVisible();
  });
});
