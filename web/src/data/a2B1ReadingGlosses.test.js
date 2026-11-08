import { getA2ReadingTask } from "./a2ReadingTasks";
import { getB1ReadingTask } from "./b1ReadingTasks";
import { getReadingGlosses, splitReadingGlossaryText } from "./a2B1ReadingGlosses";

describe("A2/B1 Lesen English word meanings", () => {
  test("A2 day 1 shows curated phrases but never replaces the German passage", () => {
    const text = getA2ReadingTask(1).text;
    const segments = splitReadingGlossaryText(text, "A2", 1);
    expect(segments.map((item) => item.text).join("")).toBe(text);
    expect(segments.find((item) => item.text === "Mittagspause")?.meaning).toBe("lunch break");
    expect(segments.find((item) => item.text === "Feierabend")?.meaning).toBe("end of the working day");
  });

  test("all 28 A2 Lesen passages have at least two tappable glossary phrases", () => {
    for (let day = 1; day <= 28; day += 1) {
      const passage = getA2ReadingTask(day)?.text || "";
      expect(getReadingGlosses("A2", day, passage).length).toBeGreaterThanOrEqual(2);
    }
  });

  test("does not underline the middle of a longer German word", () => {
    const text = "Er ist zuverlässiger als sein Kollege. Sie ist zuverlässig.";
    const segments = splitReadingGlossaryText(text, "A2", 2);
    expect(segments.map((item) => item.text).join("")).toBe(text);
    expect(segments.filter((item) => item.meaning).map((item) => item.text)).toEqual(["zuverlässig"]);
  });

  test("a B1 paragraph uses terms selected for the full reading text", () => {
    const wholePassage = "Stress hat gravierende Auswirkungen. Zeitdruck gehört dazu.";
    const paragraph = "Zeitdruck gehört dazu.";
    const segments = splitReadingGlossaryText(paragraph, "B1", 9, wholePassage);
    expect(segments.find((item) => item.meaning)?.meaning).toBe("time pressure");
    expect(segments.map((item) => item.text).join("")).toBe(paragraph);
  });

  test("special B1 matching cards can translate descriptions without giving answers", () => {
    const task = getB1ReadingTask(26);
    const text = task.text.situations.map((item) => item.description).join(" ");
    const segments = splitReadingGlossaryText(text, "B1", 26);
    expect(segments.some((item) => item.meaning === "short-term sublet")).toBe(true);
    expect(segments.map((item) => item.text).join("")).toBe(text);
  });

  test("unrelated words stay untouched", () => {
    expect(splitReadingGlossaryText("Apfel und Birne", "A2", 1)).toEqual([{ text: "Apfel und Birne" }]);
  });
});
