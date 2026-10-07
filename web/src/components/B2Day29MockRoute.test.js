import fs from "fs";
import path from "path";

const read = (relativePath) =>
  fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("B2 Day 29 final mock route ownership", () => {
  test("the generic B2 Day 29 lesson route redirects to the full mock", () => {
    const source = read("./CourseLessonPage.js");
    expect(source).toContain('const isB2Day29Mock = level === "B2" && day === 29');
    expect(source).toContain(
      'return <Navigate to="/campus/course/b2-final-mock-exam" replace state={location.state} />',
    );
  });

  test("the Course Book opens B2 Day 29 directly on the final mock", () => {
    const source = read("./CourseTab.js");
    expect(source).toContain('String(selectedCourseLevel || "").toUpperCase() === "B2"');
    expect(source).toContain('return "/campus/course/b2-final-mock-exam"');
  });

  test("the B2 Course Book has a non-assignment Day 29 final mock entry", () => {
    const source = read("../data/courseSchedule.js");
    const b2Start = source.lastIndexOf("B2: [");
    const start = source.indexOf("day: 29", b2Start);
    const end = source.indexOf("],\n  C1:", start);
    const day29 = source.slice(start, end);

    expect(day29).toContain('topic: "B2 Final Mock Exam"');
    expect(day29).toContain('chapter: "Final Mock"');
    expect(day29).toContain("assignment: false");
    expect(day29).toContain('workbook_link: "/campus/course/b2-final-mock-exam"');
  });

  test("App owns both B2 mock routes", () => {
    const source = read("../App.js");
    expect(source).toContain('path="/campus/course/b2-mock-practice-preview" element={<B2FinalMockExamPage />}');
    expect(source).toContain('path="/campus/course/b2-final-mock-exam" element={<B2FinalMockExamPage />}');
  });
});
