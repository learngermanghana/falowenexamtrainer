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

  test("restores the Goethe speaking coach for B2 and C1 instead of hiding it", () => {
    expect(cleanupScript).toContain('const COURSE_LEVELS = "a1|a2|b1|b2|c1"');
    expect(cleanupScript).toContain("return restoreCourseSpeakingChat()");
    expect(cleanupScript).not.toContain("HIDDEN_COURSE_LEVELS");
    expect(cleanupScript).not.toContain("hideQuickStartersFallback");
    expect(cleanupScript).not.toContain("const hideElement");
  });

  test("installs only once", () => {
    expect(cleanupScript).toContain("__falowenCourseSpeakingChatCleanupInstalled");
  });
});
