import navigation from "../../public/falowen-navigation.json";
import {
  resolveStudyBuddyNavigationReply,
  splitStudyBuddySafeLinks,
  STUDY_BUDDY_DESTINATIONS,
} from "./studyBuddyNavigation";

describe("Study Buddy authoritative navigation routing", () => {
  test("all supported signed-in destinations match the published Falowen navigation catalogue", () => {
    const ids = {
      results: "results", exams: "exams-room", examFile: "exam-file",
      courseBook: "course-book", attendance: "attendance", vocab: "vocabulary",
      calendar: "study-calendar", billing: "billing",
    };
    Object.entries(ids).forEach(([key, id]) => {
      const catalogEntry = navigation.navigation.find((entry) => entry.id === id);
      expect(catalogEntry).toBeDefined();
      expect(STUDY_BUDDY_DESTINATIONS[key].path).toBe(catalogEntry.route);
    });
  });

  test.each([
    "How can I access my result?",
    "How can I see my results?",
    "Where can I find my results?",
    "Where are my grades?",
    "Can I check my marks?",
    "Please show me my score",
    "Where is my assignment feedback?",
    "Wo finde ich meine Ergebnisse?",
    "Où voir mes résultats?",
  ])("%s goes to Results, not Exams Room", (message) => {
    const matched = resolveStudyBuddyNavigationReply(message);
    expect(matched?.destination).toBe("results");
    expect(matched.reply).toContain("https://www.falowen.app/campus/results");
    expect(matched.reply).not.toContain("https://www.falowen.app/exams/overview");
    expect(matched.reply).not.toMatch(/your score is \d+/i);
  });

  test("mock score question leads with Results, and only then offers detailed Exam Room review", () => {
    const matched = resolveStudyBuddyNavigationReply("Where can I see my B1 mock exam result?");
    expect(matched.destination).toBe("results");
    expect(matched.reply.indexOf("/campus/results")).toBeLessThan(matched.reply.indexOf("/exams/overview"));
    expect(matched.reply).toContain("detailed full-mock review");
  });

  test("missing result directs to Results without suggesting a duplicate submission", () => {
    const matched = resolveStudyBuddyNavigationReply("My results are not showing, where can I check them?");
    expect(matched.destination).toBe("results");
    expect(matched.reply).toContain("may still be pending");
    expect(matched.reply).toContain("Do not resubmit");
  });

  test.each([
    ["Where can I start a mock test?", "exams", "/exams/overview"],
    ["How do I resume my Goethe mock?", "exams", "/exams/overview"],
    ["Where can I review my mock attempt?", "exams", "/exams/overview"],
    ["How do I access my exam file?", "examFile", "/campus/examFile"],
    ["Where do I open my course book?", "courseBook", "/campus/course"],
    ["Where can I submit my assignment?", "courseBook", "/campus/course"],
    ["How do I check attendance?", "attendance", "/campus/attendance"],
    ["Where do I open vocabulary practice?", "vocab", "/campus/vocab"],
    ["How do I find my study calendar?", "calendar", "/exams/study"],
    ["Where is my payment history?", "billing", "/campus/account?tab=billing"],
    ["How can I take a placement test?", "placement", "/placement-test"],
  ])("%s gets the intended destination", (message, expected, path) => {
    const answer = resolveStudyBuddyNavigationReply(message);
    expect(answer?.destination).toBe(expected);
    expect(answer.reply).toContain(`https://www.falowen.app${path}`);
  });

  test("a natural follow-up about results can use the last student's question", () => {
    const matched = resolveStudyBuddyNavigationReply("And where do I find them?", [
      { role: "user", content: "Are my exam results ready?" },
      { role: "assistant", content: "I cannot see your individual score." },
    ]);
    expect(matched?.destination).toBe("results");
  });

  test.each([
    "Why is the Dativ used after mit?",
    "Help me prepare for the Goethe A2 exam.",
    "Can you explain why my writing is wrong?",
    "How do I solve this grammar problem?",
    "Score my writing task, please.",
  ])("keeps %s for the course-grounded AI", (message) => {
    expect(resolveStudyBuddyNavigationReply(message)).toBeNull();
  });

  test("only converts links on the real HTTPS Falowen domain into safe links", () => {
    const parts = splitStudyBuddySafeLinks(
      "Results: https://www.falowen.app/campus/results. " +
      "Other: https://falowen.app.evil.example/campus/results. " +
      "Bad: http://www.falowen.app/campus/results. " +
      "Exam: https://www.falowen.app/exams/overview."
    );
    expect(parts.filter((entry) => entry.href).map((entry) => entry.href)).toEqual([
      "https://www.falowen.app/campus/results",
      "https://www.falowen.app/exams/overview",
    ]);
    expect(parts.map((part) => part.suffix || "").join("")).toContain(".");
  });

  test("rejects unexpected hosts and Javascript links, rendering them as plain text", () => {
    expect(splitStudyBuddySafeLinks(
      "javascript:alert(1) https://evil.example/  https://www.falowen.app.evil.tld/bug"
    ).every((entry) => !entry.href)).toBe(true);
  });
});
