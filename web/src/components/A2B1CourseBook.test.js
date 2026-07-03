import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { A2B1WorkbookGuidance } from "./A2B1WorkbookGuidance";
import A2Day2SmallTalkWorkbookEnhancedPage from "./A2Day2SmallTalkWorkbookEnhancedPage";
import Day0StudentWorkflowUpgrade from "./Day0StudentWorkflowUpgrade";
import RadioFirstWorkbookGate from "./RadioFirstWorkbookGate";
import { getWorkbookNavigationTabs } from "../utils/courseWorkbookSubmission";
import { __TESTING__ as courseWorkbookSubmissionTabsTesting } from "./CourseWorkbookSubmissionTabs";

jest.mock(
  "react-router-dom",
  () => {
    const React = require("react");
    const LocationContext = React.createContext({
      pathname: "/",
      search: "",
      hash: "",
      state: null,
      key: "test",
    });

    const MemoryRouter = ({ children, initialEntries = ["/"] }) => {
      const rawEntry = initialEntries[0] || "/";
      const entry = typeof rawEntry === "string" ? rawEntry : rawEntry.pathname || "/";
      const parsed = new URL(entry, "https://falowen.test");
      const location = {
        pathname: parsed.pathname,
        search: parsed.search,
        hash: parsed.hash,
        state: typeof rawEntry === "object" ? rawEntry.state || null : null,
        key: "test",
      };
      return React.createElement(LocationContext.Provider, { value: location }, children);
    };

    const Link = ({ children, to = "#", ...props }) =>
      React.createElement(
        "a",
        { ...props, href: typeof to === "string" ? to : to.pathname || "#" },
        children
      );

    return {
      MemoryRouter,
      BrowserRouter: MemoryRouter,
      HashRouter: MemoryRouter,
      Router: MemoryRouter,
      Link,
      NavLink: Link,
      useLocation: () => React.useContext(LocationContext),
      useNavigate: () => jest.fn(),
      useParams: () => ({}),
      useSearchParams: () => [new URLSearchParams(), jest.fn()],
    };
  },
  { virtual: true }
);

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ user: null, studentProfile: null }),
}));

jest.mock("../firebase", () => ({
  db: {},
  doc: jest.fn(),
  getDoc: jest.fn(),
  onSnapshot: jest.fn(() => () => {}),
  serverTimestamp: jest.fn(),
  setDoc: jest.fn(),
}));

jest.mock("./AssignmentSubmissionPage", () => () => null);
jest.mock("./WorkbookReadAloudInjector", () => () => null);
jest.mock("./SpeakingPracticeTimerCard", () => () => null);
jest.mock("./CourseInlinePracticePanel", () => () => null);

describe("A2 and B1 course books", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  test("describes the four workbook parts plus Ref and Submit", () => {
    render(<A2B1WorkbookGuidance level="B1" />);

    const navigationGuide = screen.getByText(/four workbook parts of this B1 workbook/i);
    expect(navigationGuide).toHaveTextContent("Ref");
    expect(navigationGuide).toHaveTextContent("Submit");
    expect(navigationGuide).toHaveTextContent("Submit tab in the Course Book");
    expect(screen.queryByText(/class notes/i)).not.toBeInTheDocument();
  });

  test("keeps the native custom A2 Day 2 workbook focused on four content parts after Radio", () => {
    render(
      <MemoryRouter>
        <A2Day2SmallTalkWorkbookEnhancedPage />
      </MemoryRouter>
    );

    expect(screen.queryByRole("tab", { name: /Teil [1-4]/i })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /Continue to workbook/i }));

    expect(screen.getAllByRole("tab", { name: /Teil [1-4]/i })).toHaveLength(4);
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

  test("detects native workbook tabs only when at least three recognized buttons share a row", () => {
    const pageRoot = document.createElement("div");
    const nativeRow = document.createElement("div");
    ["Teil 1", "Teil 2", "Ref"].forEach((label) => {
      const button = document.createElement("button");
      button.textContent = label;
      nativeRow.appendChild(button);
    });
    pageRoot.appendChild(nativeRow);

    expect(courseWorkbookSubmissionTabsTesting.findNativeTabRow(pageRoot)).toBe(nativeRow);

    nativeRow.lastChild.remove();
    expect(courseWorkbookSubmissionTabsTesting.findNativeTabRow(pageRoot)).toBeNull();
  });

  test("preserves the direct child that contains native tabs when hiding workbook content", () => {
    const pageRoot = document.createElement("div");
    const introCard = document.createElement("section");
    const workbookCard = document.createElement("section");
    const nativeRow = document.createElement("div");
    const exerciseCard = document.createElement("section");

    workbookCard.appendChild(nativeRow);
    pageRoot.append(introCard, workbookCard, exerciseCard);

    courseWorkbookSubmissionTabsTesting.setWorkbookContentHidden(pageRoot, true, nativeRow);

    expect(introCard.style.display).toBe("none");
    expect(workbookCard.style.display).toBe("");
    expect(exerciseCard.style.display).toBe("none");

    courseWorkbookSubmissionTabsTesting.setWorkbookContentHidden(pageRoot, false, nativeRow);
    expect(introCard.style.display).toBe("");
    expect(exerciseCard.style.display).toBe("");
  });

  test("shows Falowen Radio before opening a B1 workbook", () => {
    render(
      <MemoryRouter>
        <RadioFirstWorkbookGate level="B1" day={1}>
          <div>B1 Day 1 workbook interface</div>
        </RadioFirstWorkbookGate>
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /^🎙️ Falowen Radio$/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText("B1 Day 1 workbook interface")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Continue to workbook/i }));

    expect(screen.getByText("B1 Day 1 workbook interface")).toBeInTheDocument();
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
