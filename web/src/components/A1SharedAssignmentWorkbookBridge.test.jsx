jest.mock("./A1CanonicalSubmissionPanel", () => () => null);

import React from "react";
import { cleanup, fireEvent, render, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import A1SharedAssignmentWorkbookBridge, {
  __TESTING__,
  discoverA1BridgeSections,
} from "./A1SharedAssignmentWorkbookBridge";
import { A1_TUTOR_MARKED_OVERVIEW_GUIDANCE } from "./A1TutorMarkedOverviewGuidance";
import { getA1Assignment } from "../data/a1AssignmentRegistry";

const GRAMMAR_ENABLED_BRIDGE_ASSIGNMENT_KEYS = ["A1-2", "A1-3", "A1-5", "A1-12.1", "A1-12.2"];

const renderBridgeWorkbook = (assignmentKey) => {
  const assignment = getA1Assignment(assignmentKey);
  const sections = assignment.sections
    .map(({ label }, index) => `<section id="section-${index + 1}"><h2>${label}</h2><p>Assignment content</p></section>`)
    .join("");

  document.body.innerHTML = `
    <main>
      <div id="workbook">
        <h1>${assignment.title}</h1>
        <p id="overview-copy">Read the assignment overview.</p>
        ${sections}
      </div>
    </main>
    <div id="react-root"></div>
  `;

  const container = document.querySelector("#react-root");
  render(
    <MemoryRouter initialEntries={[assignment.workbookRoute]}>
      <A1SharedAssignmentWorkbookBridge assignmentKey={assignmentKey} />
    </MemoryRouter>,
    { container },
  );

  return assignment;
};

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

  test.each(GRAMMAR_ENABLED_BRIDGE_ASSIGNMENT_KEYS)(
    "%s opens with the shared Grammar guidance on Overview",
    async (assignmentKey) => {
      const assignment = renderBridgeWorkbook(assignmentKey);
      expect(assignment.layoutMode).toBe("bridge");

      const guidanceHost = await waitFor(() => {
        const host = document.querySelector(
          `[data-a1-canonical-bridge-overview-guidance="true"][data-assignment-key="${assignmentKey}"]`,
        );
        expect(host).not.toBeNull();
        return host;
      });

      expect(guidanceHost.style.display).toBe("");
      expect(guidanceHost.textContent).toContain("How to complete this assignment");
      expect(guidanceHost.textContent).toContain(A1_TUTOR_MARKED_OVERVIEW_GUIDANCE);

      const grammarButton = Array.from(document.querySelectorAll('[role="tab"]')).find(
        (button) => button.textContent === "Grammar",
      );
      expect(grammarButton).toBeTruthy();
      fireEvent.click(grammarButton);

      await waitFor(() => expect(guidanceHost.style.display).toBe("none"));
    },
  );

  test("A1-10 omits Grammar guidance because the bridge has no Grammar tab", async () => {
    const assignment = renderBridgeWorkbook("A1-10");
    expect(assignment.layoutMode).toBe("bridge");

    const guidanceHost = await waitFor(() => {
      const host = document.querySelector(
        '[data-a1-canonical-bridge-overview-guidance="true"][data-assignment-key="A1-10"]',
      );
      expect(host).not.toBeNull();
      return host;
    });

    await waitFor(() => {
      const tabLabels = Array.from(document.querySelectorAll('[role="tab"]')).map(
        (button) => button.textContent,
      );
      expect(tabLabels).toContain("Overview");
      expect(tabLabels).not.toContain("Grammar");
    });

    expect(guidanceHost.style.display).toBe("none");
    expect(guidanceHost.querySelector('[data-a1-tutor-marked-grammar-guidance="true"]')).toBeNull();
    expect(guidanceHost.textContent).not.toContain("open the Grammar tab");
  });
});
