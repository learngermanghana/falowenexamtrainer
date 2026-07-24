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
const standoutSource = fs.readFileSync(
  path.resolve(__dirname, "C1Day1To6GuidedLessonPage.js"),
  "utf8",
);
const practiceSource = fs.readFileSync(
  path.resolve(__dirname, "selfLearning/EmbeddedPracticePanels.js"),
  "utf8",
);

describe("C1 Engagement und Ehrenamt standout workbook", () => {
  test("routes Day 11 through the same guided shell as C1 Day 1", () => {
    expect(registrySource).not.toContain("C1Day11GoetheSpeakingSelfLearningPage");
    expect(standardSource).toContain("isGuidedC1Lesson || isGuidedC1Day11");
    expect(standardSource).toContain("? C1Day1To6GuidedLessonPage");
  });

  test("keeps Radio first and the Learn Speak Write Finish Ref tabs", () => {
    expect(standoutSource).toContain("Listen to Falowen Radio first. Continue opens Learn, Speak, Write and Finish.");
    expect(standoutSource).toContain('const tabs = ["learn", "speak", "write", "finish", "references"]');
    expect(standoutSource).toContain('speak: "2. Speak"');
    expect(standoutSource).toContain('write: "3. Write"');
  });

  test("keeps the stable Goethe free speaking chat inside the Speak tab", () => {
    expect(standoutSource).toContain("<EmbeddedSpeechPracticePanel />");
    expect(practiceSource).toContain('import GoetheFreeChatPage from "../GoetheFreeChatPage";');
    expect(practiceSource).toContain('<GoetheFreeChatPage lockedLevel={getCourseLessonRouteMeta().level} />');
    expect(practiceSource).not.toContain('<SpeakingPage mode="course"');
  });
});
