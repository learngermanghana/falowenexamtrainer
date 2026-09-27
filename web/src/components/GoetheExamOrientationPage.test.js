import fs from "fs";
import path from "path";

const read = (relativePath) => fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("shared Goethe exam orientation", () => {
  const page = read("GoetheExamOrientationPage.jsx");
  const config = read("../data/goetheExamOrientation.js");
  const app = read("../App.js");
  const schedule = read("../data/courseSchedule.js");
  const completionJourney = read("../data/courseCompletionJourney.js");

  test("uses one shared page for A1, A2 and B1", () => {
    expect(app).toContain('import GoetheExamOrientationPage from "./components/GoetheExamOrientationPage";');
    expect(app).toContain('<GoetheExamOrientationPage level="A1" />');
    expect(app).toContain('<GoetheExamOrientationPage level="A2" />');
    expect(app).toContain('<GoetheExamOrientationPage level="B1" />');
    expect(app).not.toContain("A1Day25GoetheExamOrientationPage");
    expect(app).not.toContain("A2Day29GoetheExamOrientationPage");
    expect(app).not.toContain("B1Day29GoetheExamOrientationPage");
  });

  test("keeps official URLs in one configuration file", () => {
    [
      "https://bfu.goethe.de/a1_sd1/lesen.php",
      "https://bfu.goethe.de/a1_sd1/hoeren.php",
      "https://bfu.goethe.de/a1_sd1/schreiben.php",
      "https://bfu.goethe.de/a1_sd1/sprechen.php",
      "https://www.goethe.de/ins/gh/en/spr/prf/gzsd2/ueb.html",
      "https://bfu.goethe.de/b1_mod/lesen.php",
      "https://bfu.goethe.de/b1_mod/hoeren.php",
      "https://bfu.goethe.de/b1_mod/schreiben.php",
      "https://bfu.goethe.de/b1_mod/sprechen.php",
    ].forEach((url) => expect(config).toContain(url));
    expect(page).toContain("config.practiceUrl");
    expect(page).toContain("section.url");
  });

  test("shows all four exam sections with local progress tracking", () => {
    ["Lesen", "Hören", "Schreiben", "Sprechen"].forEach((section) => {
      expect(config).toContain(`name: "${section}"`);
    });
    expect(page).toContain("window.localStorage.setItem");
    expect(page).toContain("data-goethe-exam-section");
    expect(page).toContain("keine zusätzliche Falowen-Aufgabe");
  });

  test("preserves final-day schedule placement and completion requirements", () => {
    expect(schedule).toContain('workbook_link: "/campus/course/a1-day-25-goethe-exam-orientation"');
    expect(schedule).toContain('workbook_link: "/campus/course/a2-day-29-goethe-exam-orientation"');
    expect(schedule).toContain('workbook_link: "/campus/course/b1-day-29-goethe-exam-orientation"');
    expect(schedule).toContain('topic: "Goethe A1 Exam Orientation & Official Practice"\n      chapter: "Exam Orientation",\n      attendance: false');
    expect(schedule).toContain('topic: "Goethe A2 Exam Orientation & Official Practice"\n    chapter: "Exam Orientation",\n    attendance: false');
    expect(schedule).toContain('topic: "Goethe B1 Exam Orientation & Official Practice"\n      chapter: "Exam Orientation",\n      attendance: false');
    expect(completionJourney).toContain("A1: 19");
    expect(completionJourney).toContain("A2: 28");
    expect(completionJourney).toContain("B1: 28");
    expect(config).toContain("requiredAssignments: 19");
    expect((config.match(/requiredAssignments: 28/g) || [])).toHaveLength(2);
  });

  test("keeps all exam-orientation routes outside workbook radio gates", () => {
    expect(app).not.toContain('withRadioWorkbookGate("A1", 25');
    expect(app).not.toContain('withRadioWorkbookGate("A2", 29');
    expect(app).not.toContain('withRadioWorkbookGate("B1", 29');
  });
});
