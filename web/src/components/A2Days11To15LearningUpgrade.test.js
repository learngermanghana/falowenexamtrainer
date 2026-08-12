import fs from "fs";
import path from "path";

const source = fs.readFileSync(path.join(__dirname, "A2B1WorkbookGuidance.js"), "utf8");

describe("A2 Days 11-15 guided learning", () => {
  test.each([
    [11, "Verkehrsmittel klar vergleichen", "genauso ... wie"],
    [12, "Über deinen Traumberuf sprechen", "Ich würde gern"],
    [13, "Modalverben im Präteritum im Vorstellungsgespräch", "Ich musste"],
    [14, "Berufsziele mit um ... zu ausdrücken", "um meine Chancen zu verbessern"],
    [15, "Seit + Dativ + Präsens", "seit zwei Jahren Fußball"],
  ])("Day %s keeps its focused A2 learning block", (day, title, marker) => {
    expect(source).toContain(`${day}: {`);
    expect(source).toContain(`title: \"${title}\"`);
    expect(source).toContain(marker);
  });

  test("all five days use the shared interactive mini-learning component", () => {
    expect(source).toContain('import A2MiniLearningBlock from "./A2MiniLearningBlock"');
    expect(source).toContain('<A2MiniLearningBlock {...lesson} />');
    expect(source).toContain('<A2Days11To15QuickLearning level={workbookLevel} />');
  });

  test("the learning configuration contains at least four checks for every day", () => {
    for (let day = 11; day <= 15; day += 1) {
      const start = source.indexOf(`${day}: {`);
      const end = day < 15 ? source.indexOf(`${day + 1}: {`, start) : source.indexOf("const A2Days11To15QuickLearning", start);
      const block = source.slice(start, end);
      expect((block.match(/stem:/g) || []).length).toBeGreaterThanOrEqual(4);
    }
  });
});
