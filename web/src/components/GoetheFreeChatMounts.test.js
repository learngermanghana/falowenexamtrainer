import fs from "node:fs";
import path from "node:path";

const webRoot = process.cwd();
const read = (relativePath) => fs.readFileSync(path.join(webRoot, relativePath), "utf8");

describe("course Goethe free chat mounts", () => {
  test("A2 and B1 workbook speaking uses GoetheFreeChatPage directly", () => {
    const source = read("src/components/CourseInlinePracticePanel.js");
    expect(source).toContain('import GoetheFreeChatPage from "./GoetheFreeChatPage";');
    expect(source).toContain("<GoetheFreeChatPage");
    expect(source).not.toContain('<SpeakingPage mode="course"');
  });

  test("B2 and C1 embedded Speak pages are redirected after pretest patching", () => {
    const source = read("src/components/selfLearning/EmbeddedPracticePanels.js");
    expect(source).toContain('import GoetheFreeChatPage from "../GoetheFreeChatPage";');
    expect(source).toContain('<GoetheFreeChatPage lockedLevel={getCourseLessonRouteMeta().level} />');
    expect(source).not.toContain('<SpeakingPage mode="course"');
  });

  test("stable course free chat has no coach TTS dependency", () => {
    const source = read("src/components/GoetheFreeChatPage.js");
    expect(source).toContain("requestCustomSpeakingChatReply");
    expect(source).toContain("analyzeAudio");
    expect(source).not.toContain("requestCoachSpeech");
    expect(source).not.toContain("useCustomCoachSpeech");
    expect(source).not.toContain("Audio replies:");
    expect(source).not.toContain("Play German reply");
  });
});
