import React, { useState } from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import A2LegacyStandardWorkbookNavigationImpl, {
  insertA2LegacyPortalMountBefore,
} from "./A2LegacyStandardWorkbookNavigationImpl";

jest.mock("./ContextualAssignmentSubmissionPage", () => () => <div>Submission</div>);
jest.mock("./WorkbookReferenceAnswers", () => () => <div>References</div>);

const NativeDay23Tabs = () => {
  const [version, setVersion] = useState(1);
  return (
    <main className="layout-main">
      <button type="button" onClick={() => setVersion((current) => current + 1)}>
        Replace native tabs
      </button>
      <div key={version} data-native-tab-version={version}>
        <button type="button">Teil 1 · Group Practice</button>
        <button type="button">Teil 2 · Schreiben</button>
        <button type="button">Teil 3 · Lesen</button>
        <button type="button">Teil 4 · Hören</button>
        <button type="button">5. Ref</button>
      </div>
    </main>
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

  test("keeps the Day 23 standard navigation alive when React replaces the native row", async () => {
    render(
      <MemoryRouter
        initialEntries={[
          "/campus/course/a2-day-23-wie-kommst-du-zur-schule-oder-zur-arbeit-workbook?radio=done",
        ]}
      >
        <NativeDay23Tabs />
        <A2LegacyStandardWorkbookNavigationImpl />
      </MemoryRouter>,
    );

    await waitFor(() => {
      expect(screen.getByRole("navigation", { name: "A2 Day 23 workbook sections" })).toBeVisible();
    });

    expect(() => {
      act(() => {
        fireEvent.click(screen.getByRole("button", { name: "Replace native tabs" }));
      });
    }).not.toThrow();

    await waitFor(() => {
      expect(screen.getByRole("navigation", { name: "A2 Day 23 workbook sections" })).toBeVisible();
      expect(document.querySelector('[data-native-tab-version="2"]')).toBeTruthy();
    });
  });
});
