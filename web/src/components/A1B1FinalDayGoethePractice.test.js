import fs from "fs";
import path from "path";

const read = (relativePath) => fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("A1 Final Mock handoff and B1 Goethe practice", () => {
  const page = read("GoetheExamOrientationPage.jsx");
  const config = read("../data/goetheExamOrientation.js");
  const schedule = read("../data/courseSchedule.js");
  const app = read("../App.js");
  const courseTab = read("CourseTab.js");
  const completionJourney = read("../data/courseCompletionJourney.js");

  test("ends A1 teaching at Day 22 and makes Day 23 the Final Mock", () => {
    expect(schedule).toContain('day: 23');
    expect(schedule).toContain('topic: "A1 Final Mock Exam"');
    expect(schedule).toContain('workbook_link: "/campus/course/a1-final-mock-exam"');
    expect(schedule).not.toContain('topic: "Goethe A1 Exam Orientation & Official Practice"');
    expect(completionJourney).toContain("A1: 19");
  });

  test("keeps the official Goethe A1 link as a secondary resource", () => {
    expect(config).toContain("https://bfu.goethe.de/a1_sd1/hoeren.php");
    expect(config).toContain('practiceLabel: "Offizielle Goethe-A1-Prüfung öffnen"');
  });

  test("redirects the retired A1 Goethe-orientation route to Exams Room", () => {
    expect(app).toContain('path="/campus/course/a1-day-25-goethe-exam-orientation"');
    expect(app).toContain('<Navigate to="/exams/overview" replace />');
  });

  test("shows Day 23 as the A1 Final Mock section instead of a Goethe-orientation section", () => {
    expect(courseTab).toContain('title: "A1 Final Mock"');
    expect(courseTab).toContain('days: "Day 23"');
    expect(courseTab).not.toContain('title: "A1 Exam Orientation"');
  });

  test("keeps the shared Goethe practice page available for levels that still use it", () => {
    expect(config).toContain("https://bfu.goethe.de/b1_mod/lesen.php");
    expect(app).toContain('path="/campus/course/b1-day-29-goethe-exam-orientation" element={<GoetheExamOrientationPage level="B1" />}');
    expect(page).toContain("data-goethe-exam-section");
    expect(page).toContain("keine zusätzliche Falowen-Aufgabe");
    expect(page).not.toContain("window.localStorage");
  });
});
