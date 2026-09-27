import fs from "fs";
import path from "path";

const read = (relativePath) => fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("A2 Day 29 Goethe exam orientation", () => {
  const page = read("GoetheExamOrientationPage.jsx");
  const config = read("../data/goetheExamOrientation.js");
  const schedule = read("../data/courseSchedule.js");
  const app = read("../App.js");
  const completionJourney = read("../data/courseCompletionJourney.js");
  const lifecyclePatch = read("../../scripts/patchA2CompletionAndDay0ClassParticipation.mjs");

  test("uses Day 29 for official Goethe A2 exam orientation", () => {
    expect(schedule).toContain('day: 29');
    expect(schedule).toContain('topic: "Goethe A2 Exam Orientation & Official Practice"');
    expect(schedule).toContain('workbook_link: "/campus/course/a2-day-29-goethe-exam-orientation"');
    expect(schedule).toContain('day: 30');
    expect(schedule).toContain('topic: "Course Completed!"');
  });

  test("keeps the 28 teaching assignments as the completion requirement", () => {
    expect(completionJourney).toContain("A2: 28");
    expect(config).toContain("requiredAssignments: 28");
    expect(page).toContain("keine zusätzliche Falowen-Aufgabe");
  });

  test("keeps the official Goethe Ghana A2 practice page in shared config", () => {
    expect(config).toContain("https://www.goethe.de/ins/gh/en/spr/prf/gzsd2/ueb.html");
    expect(config).toContain("Offizielle Goethe-A2-Übungen öffnen");
    expect(config).toContain("Goethe-Institut Ghana");
  });

  test("shows the four official exam sections and their timing", () => {
    ["Lesen", "Hören", "Schreiben", "Sprechen"].forEach((section) => {
      expect(config).toContain(`name: "${section}"`);
    });
    expect((config.match(/duration: "30 Min\."/g) || [])).toHaveLength(3);
    expect(config).toContain('duration: "ca. 15 Min."');
  });

  test("keeps lifecycle normalization aligned with the Day 30 completion milestone", () => {
    expect(lifecyclePatch).toContain('day: 30,\\n    topic: "Course Completed!"');
    expect(lifecyclePatch).toContain("A2 Day 30 completion milestone");
    expect(lifecyclePatch).not.toContain("A2 Day 29 completion milestone is missing");
  });

  test("registers a direct shared route without a workbook radio gate", () => {
    expect(app).toContain('import GoetheExamOrientationPage from "./components/GoetheExamOrientationPage";');
    expect(app).toContain('path="/campus/course/a2-day-29-goethe-exam-orientation" element={<GoetheExamOrientationPage level="A2" />}');
    expect(app).not.toContain('withRadioWorkbookGate("A2", 29');
  });
});
