import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { A2B1WorkbookGuidance } from "./A2B1WorkbookGuidance";
import A2Day2SmallTalkWorkbookEnhancedPage from "./A2Day2SmallTalkWorkbookEnhancedPage";
import Day0StudentWorkflowUpgrade from "./Day0StudentWorkflowUpgrade";
import { getWorkbookNavigationTabs } from "../utils/courseWorkbookSubmission";

jest.mock("./WorkbookReadAloudInjector", () => () => null);
jest.mock("./SpeakingPracticeTimerCard", () => () => null);
jest.mock("./CourseInlinePracticePanel", () => () => null);

describe("A2 and B1 course books", () => {
  test("describes the shared workbook as four parts without class notes", () => {
    render(<A2B1WorkbookGuidance level="B1" />);

    expect(screen.getByText(/B1 workbook/i)).toHaveTextContent("four parts");
    expect(screen.queryByText(/class notes/i)).not.toBeInTheDocument();
  });

  test("keeps the native custom A2 Day 2 workbook focused on four content parts", () => {
    render(
      <MemoryRouter>
        <A2Day2SmallTalkWorkbookEnhancedPage />
      </MemoryRouter>
    );

    expect(screen.getAllByRole("button", { name: /Teil [1-4]/i })).toHaveLength(4);
    expect(screen.queryByText(/class notes/i)).not.toBeInTheDocument();
  });

  test.each(["A2", "B1"])("adds a standardized Submit tab after Teil 1-4 and Ref for %s", (level) => {
    expect(getWorkbookNavigationTabs(level).map((tab) => tab.label)).toEqual([
      "Teil 1",
      "Teil 2",
      "Teil 3",
      "Teil 4",
      "Ref",
      "Submit",
    ]);
  });

  test.each(["a2", "b1"])("does not mention class notes in the %s Day 0 guide", (level) => {
    render(
      <MemoryRouter initialEntries={[`/campus/course/${level}-day-0-orientation-and-knowledge-test-workbook`]}>
        <Day0StudentWorkflowUpgrade />
      </MemoryRouter>
    );

    expect(screen.queryByText(/class notes/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/Teil 5/i)).not.toBeInTheDocument();
  });
});
