import { discoverA1BridgeSections } from "./A1SharedAssignmentWorkbookBridge";
import { getA1Assignment } from "../data/a1AssignmentRegistry";

describe("A1SharedAssignmentWorkbookBridge", () => {
  beforeEach(() => {
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
});
