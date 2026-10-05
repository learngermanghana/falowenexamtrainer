import fs from "fs";
import path from "path";

const read = (relativePath) => fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("official Goethe completion configuration", () => {
  const config = read("goetheExamOrientation.js");
  const journey = read("courseCompletionJourney.js");
  const conclusion = read("../components/CourseCompletionConclusion.js");
  const app = read("../App.js");

  test("keeps official Goethe configuration while retiring A1 course orientation", () => {
    expect(config).toContain('courseRoute: "/campus/course/a1-day-25-goethe-exam-orientation"');
    expect(config).toContain('courseRoute: "/campus/course/a2-day-29-goethe-exam-orientation"');
    expect(config).toContain('courseRoute: "/campus/course/b1-day-29-goethe-exam-orientation"');

    expect(app).toContain('path="/campus/course/a1-day-25-goethe-exam-orientation"');
    expect(app).toContain('<Navigate to="/exams/overview" replace />');
  });

  test("A1 hands off from Final Mock to Exams Room while later levels keep Goethe-first guidance", () => {
    expect(conclusion).toContain("Continue to Exams Room");
    expect(conclusion).toContain("Official Goethe A1 Sample");
    expect(conclusion).toContain("Open Official Goethe");
    expect(conclusion).toContain("Go to Exams Room");
    expect(conclusion).toContain("getGoetheExamFileGuide");

    expect(journey).toContain("After A1: move from the Final Mock to the Exams Room");
    expect(journey).toContain("Use your Final Mock result to identify weak areas");
    expect(journey).toContain("official Goethe A2 practice");
    expect(journey).toContain("official Goethe B1 practice");
    expect(journey).toContain("Falowen Exams Room afterwards only for additional practice in weak areas");
  });
});
