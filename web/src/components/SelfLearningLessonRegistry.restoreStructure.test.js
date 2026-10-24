import fs from "fs";
import path from "path";

const registrySource = fs.readFileSync(
  path.resolve(__dirname, "SelfLearningLessonRegistry.js"),
  "utf8",
);
const standardSource = fs.readFileSync(
  path.resolve(__dirname, "StandardLessonWritingCoachPage.js"),
  "utf8",
);

describe("restored B2 and C1 self-learning structure", () => {
  test("removes teacher lectures without deleting the lesson AI video", () => {
    expect(registrySource).toContain("const pageLesson = removeTeacherLectureFromLesson(lesson)");
    expect(registrySource).toContain("const pageCanonicalLesson = removeTeacherLectureFromCanonicalLesson(canonicalLesson)");
    expect(registrySource).not.toContain("removeAllDisplayedVideosFromLesson");
    expect(registrySource).not.toContain("videoResource: null");
    expect(registrySource).not.toContain("videos: []");
  });

  test("keeps B2 and C1 free of a generic supporting-materials gate", () => {
    expect(registrySource).toContain("export const SelfLearningLessonFrame = ({ children }) => children");
    expect(registrySource).not.toContain("SelfLearningJourneyGate");
    expect(registrySource).not.toContain("SelfLearningMaterialsSelector");
  });

  test("routes C1 Day 11 through the same standout guided page as Day 1", () => {
    expect(registrySource).not.toContain("C1Day11GoetheSpeakingSelfLearningPage");
    expect(standardSource).toContain("isGuidedC1Lesson || isGuidedC1Day11");
    expect(standardSource).toContain("? C1Day1To6GuidedLessonPage");
  });
});
