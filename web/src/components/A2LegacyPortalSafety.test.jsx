import React, { useState } from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import A2LegacyStandardWorkbookNavigation from "./A2LegacyStandardWorkbookNavigation";
import A2LegacyStandardWorkbookNavigationImpl, {
  insertA2LegacyPortalMountBefore,
} from "./A2LegacyStandardWorkbookNavigationImpl";
import { A2B1WorkbookGuidance } from "./A2B1WorkbookGuidance";
import A2Day23WieKommstDuZurSchuleOderZurArbeitWorkbookPage from "./A2Day23WieKommstDuZurSchuleOderZurArbeitWorkbookPage";
import A2Day27DigitaleKommunikationWorkbookPage from "./A2Day27DigitaleKommunikationWorkbookPage";
import A2Day28UeberDieZukunftSprechenWorkbookPage from "./A2Day28UeberDieZukunftSprechenWorkbookPage";

jest.mock("./AssignmentSubmissionPage", () => () => <div>Submission</div>);
jest.mock("./ContextualAssignmentSubmissionPage", () => () => <div>Submission</div>);
jest.mock("./WorkbookReferenceAnswers", () => () => <div>References</div>);
jest.mock("./A2B1WorkbookGrammarNotes", () => ({
  A2B1GrammarNotesTab: () => <div>Grammar notes</div>,
}));
jest.mock("./navigation/AppBackButton", () => () => <div>Back</div>);
jest.mock("./CourseInlinePracticePanel", () => ({ type }) => <div>{type} practice</div>);
jest.mock("./SpeakingMindMap", () => () => <div>Speaking mind map</div>);
jest.mock("./SpeakingPracticeTimerCard", () => () => <div>Speaking timer</div>);

const DAY23_PATH = "/campus/course/a2-day-23-wie-kommst-du-zur-schule-oder-zur-arbeit-workbook";
const DAY24_TO_26 = [
  {
    day: 24,
    path: "/campus/course/a2-day-24-einen-urlaub-planen-workbook",
  },
  {
    day: 25,
    path: "/campus/course/a2-day-25-tagesablauf-workbook",
  },
  {
    day: 26,
    path: "/campus/course/a2-day-26-gefuehle-in-verschiedenen-situationen-workbook",
  },
];

const NativeWorkbookTabs = ({ replaceable = false }) => {
  const [version, setVersion] = useState(1);
  const [activeTab, setActiveTab] = useState("teil1");

  return (
    <>
      {replaceable ? (
        <button type="button" onClick={() => setVersion((current) => current + 1)}>
          Replace native tabs
        </button>
      ) : null}
      <div key={version} data-native-tab-version={version} data-native-workbook-tabs>
        <button type="button" onClick={() => setActiveTab("teil1")}>Teil 1 · Group Practice</button>
        <button type="button" onClick={() => setActiveTab("teil2")}>Teil 2 · Schreiben</button>
        <button type="button" onClick={() => setActiveTab("teil3")}>Teil 3 · Lesen</button>
        <button type="button" onClick={() => setActiveTab("teil4")}>Teil 4 · Hören</button>
        <button type="button" onClick={() => setActiveTab("references")}>5. Ref</button>
      </div>
      {activeTab === "teil1" ? <h2>Native Teil 1 content</h2> : null}
      {activeTab === "teil2" ? <h2>Native Teil 2 Schreiben content</h2> : null}
      {activeTab === "teil3" ? <h2>Native Teil 3 Lesen content</h2> : null}
      {activeTab === "teil4" ? <h2>Native Teil 4 Hören content</h2> : null}
      {activeTab === "references" ? <h2>Native references content</h2> : null}
    </>
  );
};

describe("A2 legacy portal safety", () => {
  beforeEach(() => {
    window.requestAnimationFrame = (callback) => window.setTimeout(callback, 0);
    window.cancelAnimationFrame = (id) => window.clearTimeout(id);
  });

  test("does not call insertBefore when the reference row is already stale", () => {
    const parent = document.createElement("div");
    const row = document.createElement("div");
    const mount = document.createElement("div");
    parent.appendChild(row);
    row.remove();

    expect(() => insertA2LegacyPortalMountBefore(parent, mount, row)).not.toThrow();
    expect(insertA2LegacyPortalMountBefore(parent, mount, row)).toBe(false);
    expect(mount.isConnected).toBe(false);
  });

  test("absorbs a NotFoundError if the row disappears during insertion", () => {
    const parent = document.createElement("div");
    const row = document.createElement("div");
    const mount = document.createElement("div");
    parent.appendChild(row);
    const nativeInsertBefore = parent.insertBefore.bind(parent);
    parent.insertBefore = (node, referenceNode) => {
      referenceNode.remove();
      return nativeInsertBefore(node, referenceNode);
    };

    expect(() => insertA2LegacyPortalMountBefore(parent, mount, row)).not.toThrow();
    expect(mount.parentNode).toBeNull();
  });

  test("keeps portal replacement safety for A2 routes that still use the legacy bridge", async () => {
    const day22Path = "/campus/course/a2-day-22-die-woche-planung-workbook";
    window.history.pushState({}, "", day22Path);

    render(
      <MemoryRouter initialEntries={[day22Path]}>
        <main className="layout-main">
          <NativeWorkbookTabs replaceable />
        </main>
        <A2LegacyStandardWorkbookNavigationImpl />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole("navigation", { name: "A2 Day 22 workbook sections" })).toBeVisible();
    });

    expect(() => {
      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Replace native tabs" }));
      });
    }).not.toThrow();

    await waitFor(() => {
      expect(screen.getByRole("navigation", { name: "A2 Day 22 workbook sections" })).toBeVisible();
      expect(document.querySelector('[data-native-tab-version="2"]')).toBeTruthy();
    });
  });

  test("Day 23 owns native standard tabs, opens Teil 2 and Teil 3, and keeps Hören self-check only", async () => {
    const day23Url = `${DAY23_PATH}?radio=done`;
    window.history.pushState({}, "", day23Url);

    render(
      <MemoryRouter initialEntries={[day23Url]}>
        <A2LegacyStandardWorkbookNavigation />
        <main className="layout-main">
          <A2Day23WieKommstDuZurSchuleOderZurArbeitWorkbookPage />
        </main>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole("navigation", { name: "A2 Day 23 workbook sections" })).toBeVisible();
    });
    expect(document.querySelector("[data-a2-standard-legacy-nav-root]")).toBeNull();
    expect(document.querySelector("[data-universal-a2-workbook-tabs]")).toBeNull();
    expect(document.querySelector('[data-a2-day23-native-guidance="true"]')).toBeTruthy();
    expect(screen.getByText(/Teil 4 · Hören:.*self-check only/i)).toBeInTheDocument();
    expect(screen.getByText(/do not send Hören through Submit/i)).toBeInTheDocument();

    expect(() => fireEvent.click(screen.getByRole("tab", { name: "Teil 2" }))).not.toThrow();
    expect(screen.getByRole("heading", { name: /Teil 2 \(Schreiben\)/i })).toBeVisible();

    expect(() => fireEvent.click(screen.getByRole("tab", { name: "Teil 3" }))).not.toThrow();
    expect(screen.getByRole("heading", { name: /Teil 3 \(Lesen\)/i })).toBeVisible();

    expect(() => fireEvent.click(screen.getByRole("tab", { name: "Teil 4" }))).not.toThrow();
    expect(screen.getByRole("heading", { name: /Teil 4 \(Hören\)/i })).toBeVisible();
    expect(screen.getByText(/only parts that will be officially evaluated.*Lesen and Schreiben/i)).toBeInTheDocument();

    expect(() => fireEvent.click(screen.getByRole("tab", { name: "Submit" }))).not.toThrow();
    expect(screen.getByRole("heading", { name: /Submit Workbook · Day 23/i })).toBeVisible();
    expect(screen.getByText(/Submit only.*Teil 2.*Teil 3/i)).toBeInTheDocument();
    expect(screen.getByText(/Do not submit Teil 1 or Teil 4/i)).toBeInTheDocument();
  });

  test.each(DAY24_TO_26)(
    "Day $day uses in-page shared tabs and opens Teil 2 and Teil 3 without a portal collision",
    async ({ day, path }) => {
      const url = `${path}?radio=done`;
      window.history.pushState({}, "", url);

      render(
        <MemoryRouter initialEntries={[url]}>
          <A2LegacyStandardWorkbookNavigation />
          <main className="layout-main">
            <NativeWorkbookTabs />
            <A2B1WorkbookGuidance level="A2" />
          </main>
        </MemoryRouter>,
      );

      await waitFor(() => {
        expect(screen.getByRole("navigation", { name: `A2 Day ${day} workbook sections` })).toBeVisible();
      });

      await waitFor(() => {
        expect(document.querySelector("[data-native-workbook-tabs]")).not.toBeVisible();
      });
      expect(document.querySelector("[data-a2-standard-legacy-nav-root]")).toBeNull();

      expect(() => fireEvent.click(screen.getByRole("tab", { name: "Teil 2" }))).not.toThrow();
      expect(screen.getByRole("heading", { name: "Native Teil 2 Schreiben content" })).toBeVisible();

      expect(() => fireEvent.click(screen.getByRole("tab", { name: "Teil 3" }))).not.toThrow();
      expect(screen.getByRole("heading", { name: "Native Teil 3 Lesen content" })).toBeVisible();
    },
  );

  test.each([
    {
      day: 27,
      path: "/campus/course/a2-day-27-digitale-kommunikation-workbook",
      Component: A2Day27DigitaleKommunikationWorkbookPage,
    },
    {
      day: 28,
      path: "/campus/course/a2-day-28-ueber-die-zukunft-sprechen-workbook",
      Component: A2Day28UeberDieZukunftSprechenWorkbookPage,
    },
  ])("Day $day uses native standard tabs without the legacy portal", async ({ day, path, Component }) => {
    window.history.pushState({}, "", path);

    render(
      <MemoryRouter initialEntries={[path]}>
        <A2LegacyStandardWorkbookNavigation />
        <main className="layout-main">
          <Component />
        </main>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole("navigation", { name: `A2 Day ${day} workbook sections` })).toBeVisible();
    });
    expect(document.querySelector("[data-a2-standard-legacy-nav-root]")).toBeNull();

    expect(() => fireEvent.click(screen.getByRole("tab", { name: "Teil 2" }))).not.toThrow();
    expect(screen.getByRole("heading", { name: /Teil 2/i })).toBeVisible();

    expect(() => fireEvent.click(screen.getByRole("tab", { name: "Teil 3" }))).not.toThrow();
    expect(screen.getByRole("heading", { name: /Teil 3/i })).toBeVisible();
  });
});
