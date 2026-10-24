import fs from "fs";

describe("late-course reading questions", () => {
  test("A2 late questions require application and sequence, not only copying", () => {
    const source = fs.readFileSync("src/data/a2ReadingTasks.js", "utf8");
    expect(source).toMatch(/Welches Ziel verfolgt sie damit/);
    expect(source).toMatch(/Welche Reaktion passt zu den Sicherheitstipps/);
    expect(source).toMatch(/Welcher Schritt kommt vor der Bewerbung/);
  });

  test("B1 late questions require paraphrase, inference and text-wide understanding", () => {
    const source = fs.readFileSync("src/data/b1ReadingTasks.js", "utf8");
    expect(source).toMatch(/nicht nur wegen eines einzigen Ortes/);
    expect(source).toMatch(/persönliche Verantwortung/);
    expect(source).toMatch(/Verantwortung von Einzelnen und Politik/);
  });
});
