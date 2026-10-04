import fs from "fs";
import path from "path";
import { A1_GOETHE_WRITING_MOCK } from "./A1GoetheWritingMockPreview";

describe("A1 Goethe-style Schreiben mock preview", () => {
  test("keeps Teil 1 as a five-gap form task", () => {
    expect(A1_GOETHE_WRITING_MOCK.teil1.fields).toHaveLength(5);
    expect(A1_GOETHE_WRITING_MOCK.teil1.fields.map((field) => field.number)).toEqual([1, 2, 3, 4, 5]);
    expect(A1_GOETHE_WRITING_MOCK.teil1.example.value).toBe("Mensah, Linda");
  });

  test("keeps Teil 2 to exactly three content points", () => {
    expect(A1_GOETHE_WRITING_MOCK.teil2.points).toHaveLength(3);
    expect(A1_GOETHE_WRITING_MOCK.teil2.points).toEqual([
      "Melden Sie sich für den Kochkurs „Italienische Küche“ an.",
      "Fragen Sie, wann der nächste Kurs beginnt.",
      "Fragen Sie nach dem Preis.",
    ]);
  });

  test("requires greeting, closing, and name without making them extra content points", () => {
    expect(A1_GOETHE_WRITING_MOCK.teil2.reminder).toContain("Anrede");
    expect(A1_GOETHE_WRITING_MOCK.teil2.reminder).toContain("Gruß");
    expect(A1_GOETHE_WRITING_MOCK.teil2.reminder).toContain("Namen");
    expect(A1_GOETHE_WRITING_MOCK.teil2.reminder).toContain("keine zusätzlichen Inhaltspunkte");
  });

  test("stays hidden from the A1 Course Book", () => {
    const appSource = fs.readFileSync(path.resolve(__dirname, "../App.js"), "utf8");
    const courseBookSource = fs.readFileSync(path.resolve(__dirname, "../data/a1CourseBookCards.js"), "utf8");

    expect(appSource).toContain("/campus/course/a1-mock-schreiben-preview");
    expect(courseBookSource).not.toContain("a1-mock-schreiben-preview");
  });
});
