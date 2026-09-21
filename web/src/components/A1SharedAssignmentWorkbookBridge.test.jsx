jest.mock("./A1CanonicalSubmissionPanel", () => () => null);

import React from "react";
import { cleanup } from "@testing-library/react";
import A1SharedAssignmentWorkbookBridge, {
  __TESTING__,
  discoverA1BridgeSections,
} from "./A1SharedAssignmentWorkbookBridge";
import { A1_ASSIGNMENT_ORDER, getA1Assignment } from "../data/a1AssignmentRegistry";

const FORMER_BRIDGE_ASSIGNMENT_KEYS = ["A1-2", "A1-10", "A1-12.1", "A1-12.2"];

describe("A1SharedAssignmentWorkbookBridge", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
    if (!window.requestAnimationFrame) {
      window.requestAnimationFrame = (callback) => window.setTimeout(callback, 0);
      window.cancelAnimationFrame = (id) => window.clearTimeout(id);
    }
  });

  afterEach(() => {
    cleanup();
    document.body.innerHTML = "";
  });

  test("discovers only the sections declared for a legacy workbook", () => {
    document.body.innerHTML = `
      <main>
        <div id="workbook">
          <div id="header"><h1>Numbers</h1></div>
          <div id="teil-one"><h2>Teil 1: Reading / Writing</h2></div>
          <div id="teil-two"><h2>Teil 2: Questions</h2></div>
          <div id="extra"><h2>Teil 3: Not part of this workbook</h2></div>
        </div>
      </main>
    `;

    const sections = discoverA1BridgeSections({
      pageRoot: document.querySelector("#workbook"),
      assignment: getA1Assignment("A1-2"),
    });

    expect(sections.map(({ key }) => key)).toEqual(["teil-1", "teil-2"]);
    expect(sections[0].element.id).toBe("teil-one");
    expect(sections[1].element.id).toBe("teil-two");
  });

  test("preserves registry order even when headings appear in another DOM order", () => {
    document.body.innerHTML = `
      <main>
        <div id="workbook">
          <h1>Cases</h1>
          <section id="three"><h2>Teil 3: Accusative Case</h2></section>
          <section id="one"><h2>Teil 1: Vocabulary Review</h2></section>
          <section id="two"><h2>Teil 2: Nominative Case</h2></section>
        </div>
      </main>
    `;

    const sections = discoverA1BridgeSections({
      pageRoot: document.querySelector("#workbook"),
      assignment: getA1Assignment("A1-5"),
    });

    expect(sections.map(({ key }) => key)).toEqual(["teil-1", "teil-2", "teil-3"]);
    expect(sections.map(({ element }) => element.id)).toEqual(["one", "two", "three"]);
  });

  test("detects existing bridge portal hosts without removing them", () => {
    document.body.innerHTML = `
      <main>
        <div id="workbook">
          <div data-a1-canonical-bridge-nav="true"></div>
          <div data-a1-canonical-bridge-overview-guidance="true"></div>
          <div data-a1-canonical-bridge-grammar="true"></div>
          <div data-a1-canonical-bridge-submission="true"></div>
          <h1>Numbers</h1>
          <div data-a1-canonical-bridge-footer="true"></div>
        </div>
      </main>
    `;

    const pageRoot = document.querySelector("#workbook");
    const existingHosts = __TESTING__.findExistingBridgeHosts(pageRoot);

    expect(existingHosts).toHaveLength(5);
    expect(existingHosts.every((host) => host.isConnected)).toBe(true);
    expect(pageRoot.querySelectorAll("[data-a1-canonical-bridge-nav], [data-a1-canonical-bridge-overview-guidance], [data-a1-canonical-bridge-grammar], [data-a1-canonical-bridge-submission], [data-a1-canonical-bridge-footer]")).toHaveLength(5);
  });

  test.each([
    ["A1-3", "A1Chapter3AskingAboutPricesWorkbookPage"],
    ["A1-5", "A1Chapter5GermanCasesWorkbookPage"],
  ])("%s is native and is not owned by the legacy bridge", (assignmentKey, component) => {
    expect(getA1Assignment(assignmentKey)).toEqual(
      expect.objectContaining({
        assignmentKey,
        component,
        layoutMode: "native",
      }),
    );
  });

  test.each(FORMER_BRIDGE_ASSIGNMENT_KEYS)(
    "%s has been migrated off the legacy bridge onto native shared navigation",
    (assignmentKey) => {
      expect(getA1Assignment(assignmentKey)).toEqual(
        expect.objectContaining({
          assignmentKey,
          layoutMode: "native",
        }),
      );
    },
  );

  test("no canonical tutor-marked A1 assignment depends on the legacy bridge", () => {
    const bridgeAssignments = A1_ASSIGNMENT_ORDER.filter(
      (assignmentKey) => getA1Assignment(assignmentKey)?.layoutMode === "bridge",
    );
    expect(bridgeAssignments).toEqual([]);
  });
});
