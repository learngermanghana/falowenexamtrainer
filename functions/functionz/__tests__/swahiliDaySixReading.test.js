const fs = require("node:fs");
const path = require("node:path");

const root = path.resolve(__dirname, "../../..");
const data = fs.readFileSync(path.join(root, "web/src/data/swahili/daySix.js"), "utf8");
const workbook = fs.readFileSync(path.join(root, "web/src/components/SwahiliDaySixWorkbook.jsx"), "utf8");

describe("Swahili A1 Day 6 Teil 3 reading", () => {
  test("shows Amina's story instead of the old menu and dialogue", () => {
    expect(data).toContain("readingPassage:");
    expect(data).toContain("Siku ya Jumamosi, Amina alienda mgahawani");
    expect(data).toContain("Jumla ni shilingi elfu kumi.");
    expect(data).toContain("Asante sana!");
    expect(workbook).toContain("lesson.readingPassage.map");
    expect(workbook).toContain("Maswali ya Ufahamu");
    expect(workbook).toContain("showChoiceLetters");
    expect(workbook).not.toContain("Practice menu assembled from the items");
  });

  test.each([
    ["read-day", "Siku ya Jumamosi", 4],
    ["read-order", "Wali na kuku", 4],
    ["read-drink", "Juisi ya embe", 4],
    ["read-bill", "Shilingi elfu kumi (10,000)", 4],
    ["read-thanks", "Asante sana!", 4],
  ])("%s has the teacher's selected answer and four options", (id, expected, count) => {
    const start = data.indexOf(`{id:"${id}",question:`);
    expect(start).toBeGreaterThan(-1);
    const line = data.slice(start, data.indexOf("\n", start));
    expect(line).toContain(`answer:"${expected}"`);
    const choices = line.split("choices:[")[1]?.split("],answer:")[0];
    expect(choices).toBeDefined();
    expect(choices.split('","').length).toBe(count);
    expect(choices).toContain(`"${expected}"`);
  });

  test("does not change Teil 4 private audio or the five listening questions", () => {
    expect(data).toContain('objectKey: "swahili/A1/day-06/day-06.mp3"');
    for (const id of ["listen-greeting", "listen-menu", "listen-drinks", "listen-meal", "listen-price"]) {
      expect(data).toContain(`id:"${id}"`);
    }
    expect(workbook).toContain("getMissingSwahiliDaySixWork");
    expect(workbook).toContain('missing.push("Teil 3 · Kusoma")');
    expect(workbook).toContain('missing.push("Teil 4 · Kusikiliza")');
  });
});
