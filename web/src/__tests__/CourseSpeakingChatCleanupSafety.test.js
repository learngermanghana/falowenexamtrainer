import fs from "fs";
import path from "path";

const repositoryRoot = path.resolve(__dirname, "../../..");
const cleanupScript = fs.readFileSync(
  path.join(repositoryRoot, "web/public/course-speaking-chat-cleanup.js"),
  "utf8",
);

describe("course speaking chat cleanup navigation safety", () => {
  test("does not replace History API methods", () => {
    expect(cleanupScript).not.toContain("patchedHistoryMethod");
    expect(cleanupScript).not.toContain("wrapHistoryMethod");
    expect(cleanupScript).not.toContain('wrapHistoryMethod("pushState")');
    expect(cleanupScript).not.toContain('wrapHistoryMethod("replaceState")');
  });

  test("watches route changes without calling pushState or replaceState", () => {
    expect(cleanupScript).toContain("const watchLocation = () =>");
    expect(cleanupScript).toContain("window.setInterval(watchLocation, 250)");
    expect(cleanupScript).toContain("new MutationObserver(scheduleCleanup)");
  });

  test("limits hiding to A2/B1 Grammar and restores speaking chat elsewhere", () => {
    expect(cleanupScript).toContain('const COURSE_LEVELS = "a1|a2|b1|b2|c1"');
    expect(cleanupScript).toContain('const A2_B1_LEVELS = "a2|b1"');
    expect(cleanupScript).toContain("if (!isA2B1CourseLesson(pathname)) return false");
    expect(cleanupScript).toContain("if (isGrammarViewActive()) return hideA2B1GrammarSpeakingChat()");
    expect(cleanupScript).toContain("return restoreCourseSpeakingChat()");
    expect(cleanupScript).not.toContain("HIDDEN_COURSE_LEVELS");
  });

  test("keeps the A2/B1 Grammar cleanup scoped to managed chat elements", () => {
    expect(cleanupScript).toContain('const INLINE_PANEL_SELECTOR = \'[data-course-inline-practice="speaking"]\'');
    expect(cleanupScript).toContain('const HIDDEN_ATTRIBUTE = "data-course-free-chat-hidden"');
    expect(cleanupScript).toContain("const hideA2B1GrammarSpeakingChat = () =>");
    expect(cleanupScript).toContain("document.querySelectorAll(INLINE_PANEL_SELECTOR)");
    expect(cleanupScript).toContain("document.querySelectorAll(`[${HIDDEN_ATTRIBUTE}=\"true\"]`)");
  });

  test("installs only once", () => {
    expect(cleanupScript).toContain("__falowenCourseSpeakingChatCleanupInstalled");
  });
});
