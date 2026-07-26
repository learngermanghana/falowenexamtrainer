import React, { useState } from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import A2LegacyStandardWorkbookNavigation from "./A2LegacyStandardWorkbookNavigation";
import A2LegacyStandardWorkbookNavigationImpl, {
  insertA2LegacyPortalMountBefore,
} from "./A2LegacyStandardWorkbookNavigationImpl";
import { A2B1WorkbookGuidance } from "./A2B1WorkbookGuidance";

jest.mock("./AssignmentSubmissionPage", () => () => <div>Submission</div>);
jest.mock("./ContextualAssignmentSubmissionPage", () => () => <div>Submission</div>);
jest.mock("./WorkbookReferenceAnswers", () => () => <div>References</div>);
jest.mock("./A2B1WorkbookGrammarNotes", () => ({
  A2B1GrammarNotesTab: () => <div>Grammar notes</div>,
}));

const DAY23_PATH = "/campus/course/a2-day-23-wie-kommst-du-zur-schule-oder-zur-arbeit-workbook";

const NativeDay23Tabs = ({ replaceable = false }) => {
  const [version, setVersion] = useState(1);
  const [activeTab, setActiveTab] = useState("teil1");

  return (
    <>
      {replaceable ? (
        <button type="button" onClick={() => setVersion((current) => current + 1)}>
          Replace native tabs
        </button>
      ) : null}
      <div key={version} data-native-tab-version={version} data-day23-native-tabs>
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

  test("keeps legacy portal replacement safe for supported A2 routes", async () => {
    const day24Path = "/campus/course/a2-day-24-einen-urlaub-planen-workbook";
    window.history.pushState({}, "", day24Path);

    render(
      <MemoryRouter initialEntries={[day24Path]}>
        <main className="layout-main">
          <NativeDay23Tabs replaceable />
        </main>
        <A2LegacyStandardWorkbookNavigationImpl />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole("navigation", { name: "A2 Day 24 workbook sections" })).toBeVisible();
    });

    expect(() => {
      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Replace native tabs" }));
      });
    }).not.toThrow();

    await waitFor(() => {
      expect(screen.getByRole("navigation", { name: "A2 Day 24 workbook sections" })).toBeVisible();
      expect(document.querySelector('[data-native-tab-version="2"]')).toBeTruthy();
    });
  });

  test("Day 23 uses in-page shared tabs and opens Teil 2 and Teil 3 without a portal collision", async () => {
    const day23Url = `${DAY23_PATH}?radio=done`;
    window.history.pushState({}, "", day23Url);

    render(
      <MemoryRouter initialEntries={[day23Url]}>
        <A2LegacyStandardWorkbookNavigation />
        <main className="layout-main">
          <NativeDay23Tabs />
          <A2B1WorkbookGuidance level="A2" />
        </main>
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole("navigation", { name: "A2 Day 23 workbook sections" })).toBeVisible();
    });

    await waitFor(() => {
      expect(document.querySelector("[data-day23-native-tabs]")).not.toBeVisible();
    });
    expect(document.querySelector("[data-a2-standard-legacy-nav-root]")).toBeNull();

    expect(() => fireEvent.click(screen.getByRole("tab", { name: "Teil 2" }))).not.toThrow();
    expect(screen.getByRole("heading", { name: "Native Teil 2 Schreiben content" })).toBeVisible();

    expect(() => fireEvent.click(screen.getByRole("tab", { name: "Teil 3" }))).not.toThrow();
    expect(screen.getByRole("heading", { name: "Native Teil 3 Lesen content" })).toBeVisible();
  });
});
