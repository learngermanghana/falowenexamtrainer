import fs from "fs";
import path from "path";

const source = fs.readFileSync(path.resolve(__dirname, "./CourseTab.js"), "utf8");

describe("Course Book Smart Progress integration", () => {
  test("subscribes to cloud lesson resume state for the selected level", () => {
    expect(source).toContain('import { subscribeLessonResumeMap } from "../services/lessonResumeService"');
    expect(source).toContain("subscribeLessonResumeMap({");
    expect(source).toContain("level: selectedCourseLevel");
    expect(source).toContain("onChange: setLessonResumeByDay");
  });

  test("renders smart status, Radio state and exact action controls on lesson cards", () => {
    expect(source).toContain("data-coursebook-smart-status={smartProgress.key}");
    expect(source).toContain('data-coursebook-radio-complete="true"');
    expect(source).toContain('data-coursebook-smart-progress="true"');
    expect(source).toContain("data-coursebook-smart-action={smartProgress.key}");
    expect(source).toContain("smartProgress.continueLabel");
    expect(source).toContain("smartLessonHref");
  });

  test("uses Smart Resume for top-level continue actions too", () => {
    expect(source).toContain("const nextLessonHref = nextLessonSmartProgress?.continueUrl");
    expect(source).toContain("openLesson(nextLesson, nextLessonHref)");
    expect(source).toContain("handleLessonLinkClick(event, nextLesson, nextLessonHref)");
  });
});
