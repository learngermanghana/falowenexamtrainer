import { render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { A2B1WorkbookGuidance } from "./A2B1WorkbookGuidance";
import A2Day2SmallTalkWorkbookEnhancedPage from "./A2Day2SmallTalkWorkbookEnhancedPage";
import Day0StudentWorkflowUpgrade from "./Day0StudentWorkflowUpgrade";

jest.mock("./WorkbookReadAloudInjector", () => () => null);
jest.mock("./SpeakingPracticeTimerCard", () => () => null);
jest.mock("./CourseInlinePracticePanel", () => () => null);

describe("A2 and B1 course books", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test("shows a shortened expandable workbook guide without read-aloud copy", () => {
    render(<A2B1WorkbookGuidance level="B1" />);

    expect(screen.getByText(/B1 workbook/i)).toHaveTextContent("four parts");
    expect(screen.getByText(/No submission is required/i)).toBeInTheDocument();
    expect(screen.queryByText(/Read aloud:/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/class notes/i)).not.toBeInTheDocument();
  });

  test("opens on the first visit and stays collapsed on later visits", () => {
    const firstRender = render(<A2B1WorkbookGuidance level="A2" />);
    expect(screen.getByText("How this workbook works").closest("details")).toHaveAttribute("open");
    firstRender.unmount();

    render(<A2B1WorkbookGuidance level="A2" />);
    expect(screen.getByText("How this workbook works").closest("details")).not.toHaveAttribute("open");
  });

  test("moves the guide into the workbook header before the tab buttons", async () => {
    render(
      <div data-testid="workbook-root">
        <div data-testid="workbook-header">
          <h1>A2 Workbook</h1>
          <p>Lesson goal</p>
          <div data-testid="workbook-tabs">
            <button>Teil 1 · Sprechen</button>
            <button>Teil 2 · Schreiben</button>
            <button>Teil 3 · Lesen</button>
            <button>Teil 4 · Hören</button>
          </div>
        </div>
        <A2B1WorkbookGuidance level="A2" />
      </div>,
    );

    const header = screen.getByTestId("workbook-header");
    const tabs = screen.getByTestId("workbook-tabs");
    await waitFor(() =>
      expect(within(header).getByText("How this workbook works")).toBeInTheDocument(),
    );

    const guide = within(header).getByText("How this workbook works").closest("details");
    expect(
      guide.compareDocumentPosition(tabs) & Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  test("shows only four tabs in the custom A2 Day 2 workbook", () => {
    render(
      <MemoryRouter>
        <A2Day2SmallTalkWorkbookEnhancedPage />
      </MemoryRouter>
    );

    expect(screen.getAllByRole("button", { name: /Teil [1-4]/i })).toHaveLength(4);
    expect(screen.queryByText(/class notes/i)).not.toBeInTheDocument();
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
