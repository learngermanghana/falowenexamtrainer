import fs from "fs";
import path from "path";

const read = (relativePath) => fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("official Goethe completion configuration", () => {
  const config = read("goetheExamOrientation.js");
  const journey = read("courseCompletionJourney.js");
  const conclusion = read("../components/CourseCompletionConclusion.js");

  test("stores the three final Course Book orientation routes with the Goethe configuration", () => {
    expect(config).toContain('courseRoute: "/campus/course/a1-day-25-goethe-exam-orientation"');
    expect(config).toContain('courseRoute: "/campus/course/a2-day-29-goethe-exam-orientation"');
    expect(config).toContain('courseRoute: "/campus/course/b1-day-29-goethe-exam-orientation"');
  });

  test("the single completion card exposes official samples and the Exams Room for every level", () => {
    expect(conclusion).toContain("Open Official Goethe");
    expect(conclusion).toContain("Go to Exams Room");
    expect(conclusion).toContain("getGoetheExamFileGuide");
    expect(journey).toContain("official Goethe A1 practice");
    expect(journey).toContain("official Goethe A2 practice");
    expect(journey).toContain("official Goethe B1 practice");
    expect(journey).toContain("Falowen Exams Room afterwards only for additional practice in weak areas");
  });
});
