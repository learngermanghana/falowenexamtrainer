import fs from "fs";
import path from "path";
import { getA2B1GrammarNotesComponent } from "./A2B1WorkbookGrammarNotesContent";
import A2Day17InDieApothekeModalverbenFragenGrammarPage from "./A2Day17InDieApothekeModalverbenFragenGrammarPage";
import { getWorkbookTabsWithLegacyGrammar } from "./StandardWorkbookComponents";
import { getTeacherLectureVideoResources } from "../data/teacherLectureVideoResources";
import { normalizeA2B1Lesson } from "../data/lessonModel";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

describe("A2 Day 17 standard workbook flow", () => {
  test("Day 17 still exposes the shared Grammar tab", () => {
    const result = getWorkbookTabsWithLegacyGrammar({
      ariaLabel: "A2 Day 17 workbook sections",
    });

    expect(result.tabs[0]?.key).toBe("grammar");
    expect(result.integratesLegacyGrammar).toBe(true);
  });

  test("Day 17 resolves to the improved pharmacy modal-verb grammar page", () => {
    expect(getA2B1GrammarNotesComponent("A2", 17)).toBe(
      A2Day17InDieApothekeModalverbenFragenGrammarPage,
    );
  });

  test("Day 17 exposes the pharmacy teacher video on the lesson and direct workbook", () => {
    const resources = getTeacherLectureVideoResources("A2", 17);
    expect(resources).toEqual([
      expect.objectContaining({
        chapter: "6.17",
        url: "https://youtu.be/5pHPl8onjj0",
        title: "Kapitel 6.17 · Teacher lecture video",
      }),
    ]);
    const lesson = normalizeA2B1Lesson({ day: 17, chapter: "6.17", assignmentId: "A2-6.17" }, "A2");
    expect(lesson.resources.teacherVideo).toEqual(expect.objectContaining({
      chapter: "6.17",
      url: "https://youtu.be/5pHPl8onjj0",
    }));
    expect(lesson.submission.assignmentId).toBe("A2-6.17");

    const shared = read("A2StandardTabbedWorkbookPage.js");
    expect(shared).toContain("[16, 17].includes(Number(day))");
    expect(shared).toContain('data-a2-day17-teacher-lecture={Number(day) === 17 ? "true" : undefined}');
    expect(shared).toContain("inlineTeacherLecture.url");
    expect(shared).toContain("youtube-nocookie.com/embed/");
  });

  test("Day 17 opens like every normal A2 workbook even after radio completion", () => {
    const day17 = read("A2Day17InDieApothekeGehenWorkbookPage.js");
    const shared = read("A2StandardTabbedWorkbookPage.js");

    expect(day17).toContain("A2StandardTabbedWorkbookPage");
    expect(day17).not.toContain("openGrammarAfterRadio");
    expect(shared).toContain('useState("sprechen")');
    expect(shared).not.toContain('get("radio") === "done"');
    expect(shared).not.toContain("radioCompleted");
  });
});
