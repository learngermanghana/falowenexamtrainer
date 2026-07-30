import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { A2B1WorkbookGuidance } from "./A2B1WorkbookGuidance";
import A2Day2SmallTalkWorkbookEnhancedPage from "./A2Day2SmallTalkWorkbookEnhancedPage";
import Day0StudentWorkflowUpgrade from "./Day0StudentWorkflowUpgrade";
import RadioFirstWorkbookGate from "./RadioFirstWorkbookGate";
import { B1_DAY12_ABENTEUER_IN_DER_NATUR_WORKBOOK_CONFIG } from "./B1Day12AbenteuerInDerNaturWorkbookPage";
import { B1_DAY13_EIGENE_FILMKRITIK_WORKBOOK_CONFIG } from "./B1Day13EigeneFilmkritikWorkbookPage";
import { B1_DAY14_TRADITIONELLES_DIGITALES_LERNEN_WORKBOOK_CONFIG } from "./B1Day14TraditionellesDigitalesLernenWorkbookPage";
import { getWorkbookNavigationTabs } from "../utils/courseWorkbookSubmission";
import { __TESTING__ as courseWorkbookSubmissionTabsTesting } from "./CourseWorkbookSubmissionTabs";
import fs from "node:fs";
import path from "node:path";

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
  test("share the responsive phone course-book presentation", () => {
    const courseTabSource = fs.readFileSync(path.join(process.cwd(), "src/components/CourseTab.js"), "utf8");
    const responsiveCss = fs.readFileSync(path.join(process.cwd(), "src/components/CourseTabResponsive.css"), "utf8");

    expect(courseTabSource).toContain('normalizedSelectedCourseLevel === "A2" || normalizedSelectedCourseLevel === "B1"');
    expect(courseTabSource).toContain('className="course-book-mobile-actions"');
    expect(courseTabSource).toContain('className="course-book-submit-sheet"');
    expect(courseTabSource).toContain('className="course-book-week"');
    expect(responsiveCss).toContain("grid-template-columns: repeat(2, minmax(0, 1fr))");
    expect(responsiveCss).toContain("overflow-x: auto");
    expect(responsiveCss).toContain("max-height: 88dvh");
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
      <MemoryRouter initialEntries={["/campus/course/a2-day-2-small-talk?radio=done"]}>
        <A2Day2SmallTalkWorkbookEnhancedPage />
      </MemoryRouter>
    );

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

  test("uses YouTube instead of Google Drive for B1 Day 12 Teil 4 Hören", () => {
    const config = B1_DAY12_ABENTEUER_IN_DER_NATUR_WORKBOOK_CONFIG;

    expect(config).toEqual(expect.objectContaining({
      day: 12,
      chapter: "4.12",
      title: "Abenteuer in der Natur",
    }));
    expect(config.listening).toEqual(expect.objectContaining({
      embedUrl: "https://www.youtube.com/embed/NSSr1__ngyU",
      externalUrl: "https://youtu.be/NSSr1__ngyU",
      videoTitle: "B1 Day 12 Abenteuer in der Natur Hören",
    }));
    expect(JSON.stringify(config.listening)).not.toContain("drive.google.com");
  });

  test("uses YouTube instead of Google Drive for B1 Day 13 Teil 4 Hören", () => {
    const config = B1_DAY13_EIGENE_FILMKRITIK_WORKBOOK_CONFIG;

    expect(config).toEqual(expect.objectContaining({
      day: 13,
      chapter: "4.13",
      title: "Eigene Filmkritik schreiben",
    }));
    expect(config.listening).toEqual(expect.objectContaining({
      embedUrl: "https://www.youtube.com/embed/gFDy1atY9K4",
      externalUrl: "https://youtu.be/gFDy1atY9K4",
      videoTitle: "B1 Day 13 Eigene Filmkritik Hören",
    }));
    expect(JSON.stringify(config.listening)).not.toContain("drive.google.com");
  });

  test("uses YouTube instead of Google Drive for B1 Day 14 Teil 4 Hören", () => {
    const config = B1_DAY14_TRADITIONELLES_DIGITALES_LERNEN_WORKBOOK_CONFIG;

    expect(config).toEqual(expect.objectContaining({
      day: 14,
      chapter: "5.14",
      title: "Traditionelles vs. digitales Lernen",
    }));
    expect(config.listening).toEqual(expect.objectContaining({
      embedUrl: "https://www.youtube.com/embed/PwA3HJ_V1HA",
      externalUrl: "https://youtu.be/PwA3HJ_V1HA",
      videoTitle: "B1 Day 14 Traditionelles vs digitales Lernen Hören",
    }));
    expect(JSON.stringify(config.listening)).not.toContain("drive.google.com");
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
    const firstView = render(
      <MemoryRouter initialEntries={["/campus/course/b1-day-1"]}>
        <RadioFirstWorkbookGate level="B1" day={1}>
          <div>B1 Day 1 workbook interface</div>
        </RadioFirstWorkbookGate>
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", { name: /^🎙️ Falowen Radio$/i }),
    ).toBeInTheDocument();
    expect(screen.queryByText("B1 Day 1 workbook interface")).not.toBeInTheDocument();
    firstView.unmount();

    render(
      <MemoryRouter initialEntries={["/campus/course/b1-day-1?radio=done"]}>
        <RadioFirstWorkbookGate level="B1" day={1}>
          <div>B1 Day 1 workbook interface</div>
        </RadioFirstWorkbookGate>
      </MemoryRouter>
    );

    expect(screen.getByText("B1 Day 1 workbook interface")).toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: /^🎙️ Falowen Radio$/i }),
    ).not.toBeInTheDocument();
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
