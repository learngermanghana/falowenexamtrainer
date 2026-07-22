import fs from "fs";
import path from "path";

const source = fs.readFileSync(
  path.resolve(__dirname, "SelfLearningLessonRegistry.js"),
  "utf8",
);

describe("restored B2 and C1 self-learning structure", () => {
  test("removes teacher lectures without deleting the lesson AI video", () => {
    expect(source).toContain("const pageLesson = removeTeacherLectureFromLesson(lesson)");
    expect(source).toContain("const pageCanonicalLesson = removeTeacherLectureFromCanonicalLesson(canonicalLesson)");
    expect(source).not.toContain("removeAllDisplayedVideosFromLesson");
    expect(source).not.toContain("videoResource: null");
    expect(source).not.toContain("videos: []");
  });

  test("keeps the dedicated C1 Day 11 Goethe speaking page", () => {
    expect(source).toContain('normalizedLevel === "C1" && day === 11');
    expect(source).toContain("<C1Day11GoetheSpeakingSelfLearningPage />");
  });
});
