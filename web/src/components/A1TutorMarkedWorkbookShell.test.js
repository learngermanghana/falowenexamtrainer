import React from "react";

jest.mock("./A1CanonicalSubmissionPanel", () => () => null);

import { splitA1WorkbookContent, WorkbookSection } from "./A1TutorMarkedWorkbookShell";
import { validateWorkbookSections } from "./A1SharedAssignmentWorkbookLayout";

const Day21SectionNavigation = () => <nav>Legacy navigation</nav>;
const Teil2Content = () => <section><h2>Teil 2 · Nachricht</h2><p>Message content</p></section>;
const WeatherOverview = () => <section><h2>Workbook sections</h2><p>Overview content</p></section>;

describe("A1TutorMarkedWorkbookShell section extraction", () => {
  test("extracts several Teile from one wrapper without assigning the wrapper only to Teil 1", () => {
    const content = (
      <div data-wrapper="true">
        <section><h2>Overview</h2><p>Introduction</p></section>
        <section id="one"><h2>Teil 1 · Lesen</h2><p>First</p></section>
        <section id="two"><h2>Teil 2 · Hören</h2><p>Second</p></section>
        <section id="three"><h2>Teil 3 · Schreiben</h2><p>Third</p></section>
      </div>
    );

    const result = splitA1WorkbookContent(content);
    expect(Array.from(result.sectionMap.keys())).toEqual(["teil-1", "teil-2", "teil-3"]);
    expect(result.sectionMap.get("teil-1").props.id).toBe("one");
    expect(result.sectionMap.get("teil-2").props.id).toBe("two");
    expect(result.sectionMap.get("teil-3").props.id).toBe("three");
    expect(result.overviewNodes).toHaveLength(1);
  });

  test("accepts explicit WorkbookSection ownership for component-based sections", () => {
    const content = (
      <>
        <div>Overview</div>
        <WorkbookSection sectionKey="teil-1"><div>First component</div></WorkbookSection>
        <WorkbookSection sectionKey="teil-2"><div>Second component</div></WorkbookSection>
      </>
    );

    const result = splitA1WorkbookContent(content);
    expect(Array.from(result.sectionMap.keys())).toEqual(["teil-1", "teil-2"]);
    expect(result.overviewNodes).toHaveLength(1);
  });

  test("recognizes the dynamically rendered A1-13 Teil component and removes its legacy navigator", () => {
    const content = (
      <div data-a1-day21-weather-workbook-content="true">
        <Day21SectionNavigation />
        <WeatherOverview />
        <Teil2Content />
      </div>
    );

    const result = splitA1WorkbookContent(content);
    expect(Array.from(result.sectionMap.keys())).toEqual(["teil-2"]);
    expect(result.sectionMap.get("teil-2").type).toBe(Teil2Content);
    expect(result.overviewNodes).toHaveLength(1);
    expect(result.overviewNodes[0].type).toBe(WeatherOverview);
  });

  test("allows one currently rendered section for a page-managed dynamic workbook", () => {
    const assignment = {
      assignmentKey: "A1-13",
      sections: [{ key: "teil-1" }, { key: "teil-2" }, { key: "teil-3" }],
    };
    const rendered = [
      <WorkbookSection key="teil-2" sectionKey="teil-2"><div>Current section</div></WorkbookSection>,
    ];

    expect(() => validateWorkbookSections(assignment, rendered, { allowPartialSections: true })).not.toThrow();
    expect(() => validateWorkbookSections(assignment, rendered)).toThrow(/teil-1/);
  });
});
