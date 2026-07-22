import fs from "fs";
import path from "path";

const read = (relativePath) => fs.readFileSync(path.resolve(__dirname, "..", relativePath), "utf8");

describe("B2 C1 lesson structure contract", () => {
  test("Learn keeps lesson AI, Speak keeps Goethe UI, and Write keeps dictionary videos", () => {
    const registry = read("components/SelfLearningLessonRegistry.js");
    const cleanup = fs.readFileSync(
      path.resolve(__dirname, "../../public/course-speaking-chat-cleanup.js"),
      "utf8",
    );
    const writingTabs = read("components/WritingCheatSheetTabs.js");

    expect(registry).toContain("removeTeacherLectureFromLesson(lesson)");
    expect(registry).not.toContain("videoResource: null");
    expect(cleanup).not.toContain("HIDDEN_COURSE_LEVELS");
    expect(writingTabs).toContain("getWritingVideoResource(level, day)");
    expect(writingTabs).toContain("<WritingVideoSupportCard");
  });
});
