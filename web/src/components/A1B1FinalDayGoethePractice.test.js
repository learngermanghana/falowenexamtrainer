import fs from "fs";
import path from "path";

const read = (relativePath) => fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("A1 and B1 final-day Goethe practice", () => {
  const a1Page = read("A1Day25GoetheExamOrientationPage.jsx");
  const b1Page = read("B1Day29GoetheExamOrientationPage.jsx");
  const schedule = read("../data/courseSchedule.js");
  const app = read("../App.js");
  const courseTab = read("CourseTab.js");
  const completionJourney = read("../data/courseCompletionJourney.js");

  test("places official Goethe practice after the teaching days without adding required assignments", () => {
    expect(schedule).toContain('topic: "Goethe A1 Exam Orientation & Official Practice"');
    expect(schedule).toContain('workbook_link: "/campus/course/a1-day-25-goethe-exam-orientation"');
    expect(schedule).toContain('day: 26');
    expect(schedule).toContain('topic: "Goethe B1 Exam Orientation & Official Practice"');
    expect(schedule).toContain('workbook_link: "/campus/course/b1-day-29-goethe-exam-orientation"');
    expect(schedule).toContain('day: 30');
    expect(completionJourney).toContain("A1: 19");
    expect(completionJourney).toContain("B1: 28");
  });

  test("uses the exact official Goethe model-test links", () => {
    expect(a1Page).toContain("https://bfu.goethe.de/a1_sd1/hoeren.php");
    expect(b1Page).toContain("https://bfu.goethe.de/b1_mod/lesen.php");
    expect(a1Page).toContain("Offizielle Goethe-A1-Prüfung öffnen");
    expect(b1Page).toContain("Offizielle Goethe-B1-Prüfung öffnen");
  });

  test("registers direct in-app orientation routes without radio gates", () => {
    expect(app).toContain('path="/campus/course/a1-day-25-goethe-exam-orientation" element={<A1Day25GoetheExamOrientationPage />}');
    expect(app).toContain('path="/campus/course/b1-day-29-goethe-exam-orientation" element={<B1Day29GoetheExamOrientationPage />}');
    expect(app).not.toContain('withRadioWorkbookGate("A1", 25');
    expect(app).not.toContain('withRadioWorkbookGate("B1", 29');
  });

  test("shows A1 Day 25 as its own exam-orientation section", () => {
    expect(courseTab).toContain('title: "A1 Exam Orientation"');
    expect(courseTab).toContain('days: "Day 25"');
    expect(courseTab).toContain("continue to Day 25 for official Goethe exam practice");
  });
});
