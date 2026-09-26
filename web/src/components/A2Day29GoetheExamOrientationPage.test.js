import fs from "fs";
import path from "path";

const read = (relativePath) => fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("A2 Day 29 Goethe exam orientation", () => {
  const page = read("A2Day29GoetheExamOrientationPage.js");
  const schedule = read("../data/courseSchedule.js");
  const app = read("../App.js");
  const completionJourney = read("../data/courseCompletionJourney.js");

  test("uses Day 29 for official Goethe A2 exam orientation", () => {
    expect(schedule).toContain('day: 29');
    expect(schedule).toContain('topic: "Goethe A2 Exam Orientation & Official Practice"');
    expect(schedule).toContain('workbook_link: "/campus/course/a2-day-29-goethe-exam-orientation"');
    expect(schedule).toContain('day: 30');
    expect(schedule).toContain('topic: "Course Completed!"');
  });

  test("keeps the 28 teaching assignments as the completion requirement", () => {
    expect(completionJourney).toContain("A2: 28");
    expect(page).toContain("keine neue Abgabe");
    expect(page).toContain("Für Day 29 gibt es keine Falowen-Abgabe");
  });

  test("links only to the official Goethe Ghana A2 practice page for the external sample", () => {
    expect(page).toContain("https://www.goethe.de/ins/gh/en/spr/prf/gzsd2/ueb.html");
    expect(page).toContain("Offizielle Goethe-A2-Übungen öffnen");
    expect(page).toContain("Quelle: Goethe-Institut Ghana");
  });

  test("shows the four official exam sections and their timing", () => {
    ["Lesen", "Hören", "Schreiben", "Sprechen"].forEach((section) => {
      expect(page).toContain(`name: "${section}"`);
    });
    expect((page.match(/duration: "30 Min\."/g) || [])).toHaveLength(3);
    expect(page).toContain('duration: "ca. 15 Min."');
  });

  test("registers a direct in-app route without a workbook radio gate", () => {
    expect(app).toContain('import A2Day29GoetheExamOrientationPage from "./components/A2Day29GoetheExamOrientationPage";');
    expect(app).toContain('path="/campus/course/a2-day-29-goethe-exam-orientation" element={<A2Day29GoetheExamOrientationPage />}');
    expect(app).not.toContain('withRadioWorkbookGate("A2", 29');
  });
});
