import fs from "fs";
import path from "path";

const read = (relativePath) =>
  fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("B1 Day 29 final mock route ownership", () => {
  test("the generic B1 Day 29 lesson route redirects to the full mock", () => {
    const source = read("CourseLessonPage.js");
    expect(source).toContain('const isB1Day29Mock = level === "B1" && day === 29');
    expect(source).toContain(
      'return <Navigate to="/campus/course/b1-mock-practice-preview" replace state={location.state} />',
    );
  });

  test("the Course Book opens B1 Day 29 directly on the mock", () => {
    const source = read("CourseTab.js");
    expect(source).toContain('String(selectedCourseLevel || "").toUpperCase() === "B1"');
    expect(source).toContain('"/campus/course/b1-mock-practice-preview"');
  });

  test("the Course Book Day 29 entry is the final mock, not the old orientation", () => {
    const source = read("../data/courseSchedule.js");
    const b1Start = source.indexOf("B1: [");
    const start = source.indexOf("day: 29", b1Start);
    const end = source.indexOf("day: 30", start);
    const day29 = source.slice(start, end);

    expect(day29).toContain('topic: "B1 Final Mock Exam"');
    expect(day29).toContain('chapter: "Final Mock"');
    expect(day29).toContain('workbook_link: "/campus/course/b1-mock-practice-preview"');
    expect(day29).not.toContain("Exam Orientation");
    expect(day29).not.toContain("official Goethe B1 model test");
  });

  test("App owns both the course and Exams Room B1 final mock routes", () => {
    const source = read("../App.js");
    expect(source).toContain('path="/campus/course/b1-mock-practice-preview" element={<B1FinalMockExamPage />}');
    expect(source).toContain('path="/campus/course/b1-final-mock-exam" element={<B1FinalMockExamPage />}');
    expect(source).toContain('path="/campus/course/b1-day-29-goethe-exam-orientation" element={<B1FinalMockExamPage />}');
  });
});
