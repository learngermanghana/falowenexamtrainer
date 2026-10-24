import fs from "fs";
import path from "path";

const read = (relativePath) =>
  fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("A2 Day 29 mock route ownership", () => {
  test("the generic A2 Day 29 lesson route cannot render the legacy orientation page", () => {
    const source = read("CourseLessonPage.js");

    expect(source).toContain('const isA2Day29Mock = level === "A2" && day === 29');
    expect(source).toContain(
      'return <Navigate to="/campus/course/a2-mock-practice-preview" replace state={location.state} />',
    );
  });

  test("the Course Book opens Day 29 directly on the mock preview", () => {
    const source = read("CourseTab.js");

    expect(source).toContain('String(selectedCourseLevel || "").toUpperCase() === "A2"');
    expect(source).toContain('Number(entry?.day) === 29');
    expect(source).toContain('"/campus/course/a2-mock-practice-preview"');
  });
});
