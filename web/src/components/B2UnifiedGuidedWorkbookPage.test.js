import fs from "fs";
import path from "path";
import { B2_SKILL_DAYS, getB2DayTabs, getB2SkillFocus } from "../data/b2SkillCycle";
import { B2_LISTENING_PRACTICE } from "../data/b2ListeningPractice";
import { B2_READING_PRACTICE } from "../data/b2ReadingPractice";
import { getB2ReviewKeyPoints } from "../data/b2ReviewKeyPoints";
import { getB2GrammarLesson } from "../data/b2GrammarLessons";
import { getB2LessonContentAlignment } from "../data/b2LessonContentAlignment";
import { B2_WRITE_DAYS, getB2WritingTask } from "../data/b2WritingTasks";

const read = (relativePath) =>
  fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("B2 unified C2-style course structure", () => {
  const page = read("B2UnifiedGuidedWorkbookPage.js");
  const registry = read("SelfLearningLessonRegistry.js");
  const nav = read("StandardWorkbookComponents.js");
  const courseTab = read("CourseTab.js");
  const writingPrompt = read("WritingTaskPrompt.js");
  const writingWorkspace = read("GuidedWritingWorkspace.js");

  test("uses the agreed four-day rotating main-skill cycle", () => {
    expect(B2_SKILL_DAYS.lesen).toEqual([1, 5, 9, 13, 17, 21, 25]);
    expect(B2_SKILL_DAYS.hoeren).toEqual([2, 6, 10, 14, 18, 22, 26]);
    expect(B2_SKILL_DAYS.speak).toEqual([3, 7, 11, 15, 19, 23, 27]);
    expect(B2_SKILL_DAYS.write).toEqual([4, 8, 12, 16, 20, 24, 28]);
    expect(getB2SkillFocus(1)).toBe("lesen");
    expect(getB2SkillFocus(2)).toBe("hoeren");
    expect(getB2SkillFocus(28)).toBe("write");
  });

  test("replaces Finish with Review and shows only today's main skill", () => {
    expect(getB2DayTabs(1).map((tab) => tab.key)).toEqual(["learn", "lesen", "review", "references"]);
    expect(getB2DayTabs(2).map((tab) => tab.key)).toEqual(["learn", "hoeren", "review", "references"]);
    expect(getB2DayTabs(3).map((tab) => tab.key)).toEqual(["learn", "speak", "review", "references"]);
    expect(getB2DayTabs(4).map((tab) => tab.key)).toEqual(["learn", "write", "review", "references"]);
    expect(getB2DayTabs(4).map((tab) => tab.key)).not.toContain("finish");
  });

  test("connects Days 2 and 6 to their real R2 audio while later Hören days stay pending", () => {
    expect(Object.keys(B2_LISTENING_PRACTICE).map(Number)).toEqual([2, 6, 10, 14, 18, 22, 26]);

    const day2 = B2_LISTENING_PRACTICE[2];
    expect(day2.audioKey).toBe("b2/day-02/day.02.m4a");
    expect(day2.audioUrl).toBeUndefined();
    expect(Array.isArray(day2.transcript)).toBe(true);
    expect(day2.transcript.length).toBeGreaterThanOrEqual(10);
    expect(day2.vocabulary).toHaveLength(8);
    expect(day2.questions).toHaveLength(5);

    const day6 = B2_LISTENING_PRACTICE[6];
    expect(day6.audioKey).toBe("b2/day-06/day-06.m4a");
    expect(day6.audioUrl).toBeUndefined();
    expect(Array.isArray(day6.transcript)).toBe(true);
    expect(day6.transcript.length).toBeGreaterThanOrEqual(30);
    expect(day6.vocabulary).toHaveLength(8);
    expect(day6.questions).toHaveLength(5);
    expect(day6.transcript.join(" ")).toContain("Energieeffizienz bedeutet");
    expect(day6.transcript.join(" ")).toContain("Speicherkapazität bedeutet");
    expect(day6.questions[4].options[day6.questions[4].answerIndex]).toContain("saubere Energiequellen");

    [day2, day6].forEach((practice) => {
      practice.questions.forEach((question) => {
        expect(question.options).toHaveLength(4);
        expect(Number.isInteger(question.answerIndex)).toBe(true);
        expect(question.explanation.length).toBeGreaterThan(20);
      });
    });

    [10, 14, 18, 22, 26].forEach((day) => {
      const practice = B2_LISTENING_PRACTICE[day];
      expect(practice.audioKey).toBe("");
      expect(practice.transcript).toBe("");
      expect(practice.audioUrl).toBeUndefined();
    });
  });

  test("provides full reading practice on all seven Lesen days", () => {
    expect(Object.keys(B2_READING_PRACTICE).map(Number)).toEqual([1, 5, 9, 13, 17, 21, 25]);
    Object.values(B2_READING_PRACTICE).forEach((practice) => {
      expect(practice.paragraphs).toHaveLength(5);
      expect(practice.questions).toHaveLength(5);
      practice.questions.forEach((question) => {
        expect(question.options).toHaveLength(4);
        expect(Number.isInteger(question.answerIndex)).toBe(true);
      });
      expect(practice.paragraphs.join(" ").split(/\s+/).length).toBeGreaterThan(250);
    });
  });

  test("renders substantial grammar content for every B2 Course Book day", () => {
    Array.from({ length: 28 }, (_, index) => index + 1).forEach((day) => {
      const grammar = getB2GrammarLesson(day);
      const alignment = getB2LessonContentAlignment(day);
      expect(grammar.title).toBe(alignment.grammar_topic);
      expect(grammar.focuses.length).toBeGreaterThanOrEqual(2);
    });

    expect(page).toContain('import { getB2GrammarLesson } from "../data/b2GrammarLessons"');
    expect(page).toContain("const GrammarLessonContent = ({ day })");
    expect(page).toContain('data-b2-grammar-content={day}');
    expect(page).toContain("grammar.focuses.map");
    expect(page).toContain("<strong>Regeln</strong>");
    expect(page).toContain("<strong>Beispiele</strong>");
    expect(page).toContain('data-b2-grammar-relevance="true"');
    expect(page).toContain("Warum diese Grammatik?");
    expect(page).toContain("Modellsatz für heute");
    expect(page).toContain("Mini-Übung");
    expect(page).toContain("<GrammarLessonContent day={day} />");
  });

  test("uses exactly four Goethe-style points on every B2 Write day", () => {
    expect(B2_WRITE_DAYS).toEqual([4, 8, 12, 16, 20, 24, 28]);

    B2_WRITE_DAYS.forEach((day) => {
      expect(getB2WritingTask(day).bullets).toHaveLength(4);
    });

    expect([4, 8, 12, 20].map((day) => getB2WritingTask(day).type)).toEqual([
      "opinion", "opinion", "opinion", "opinion",
    ]);
    expect([16, 24, 28].map((day) => getB2WritingTask(day).type)).toEqual([
      "formal", "formal", "formal",
    ]);
  });

  test("connects the canonical B2 writing task, note, word minimum and starter template to the Write page", () => {
    expect(page).toContain('applyB2WritingTaskToLesson');
    expect(page).toContain('getB2WritingTask(day)');
    expect(page).toContain('minimumWords: writingTask.minimumWords');
    expect(page).toContain('<WritingTaskPrompt lesson={writingLesson} />');
    expect(page).toContain('<GuidedWritingWorkspace config={writingConfig}');

    expect(writingPrompt).toContain('data-writing-task-note="true"');
    expect(writingWorkspace).toContain('data-writing-word-requirement="true"');
    expect(writingWorkspace).toContain('const meetsMinimumWords');
    expect(writingWorkspace).toContain('starterEllipsisWarning');
    expect(writingWorkspace).toContain('Replace every <strong>...</strong> with your own content');
  });

  test("gives every B2 review exactly three concise model points", () => {
    Array.from({ length: 28 }, (_, index) => index + 1).forEach((day) => {
      const points = getB2ReviewKeyPoints(day);
      expect(points).toHaveLength(3);
      points.forEach((point) => {
        expect(point.length).toBeGreaterThan(30);
        expect(point.length).toBeLessThan(230);
      });
    });
  });

  test("keeps Day 2 focused on recycling, reuse and the circular economy", () => {
    expect(getB2ReviewKeyPoints(2)).toEqual([
      "Mülltrennung ist wichtig, aber sie ist nur der erste Schritt eines funktionierenden Recyclingprozesses.",
      "Wiederverwendung ist oft sinnvoller als Recycling, weil Produkte und Materialien dabei länger direkt genutzt werden.",
      "Kreislaufwirtschaft bedeutet, Rohstoffe möglichst lange im Umlauf zu halten und Abfall so weit wie möglich zu vermeiden.",
    ]);
  });

  test("routes every B2 day through the unified workbook", () => {
    expect(registry).toContain('import B2UnifiedGuidedWorkbookPage from "./B2UnifiedGuidedWorkbookPage"');
    expect(registry).toContain('normalizedLevel === "B2" && day >= 1 && day <= 28');
    expect(registry).toContain("<B2UnifiedGuidedWorkbookPage");
    expect(registry).toContain('shouldShowRadioFirst("B2", day)');
    expect(registry).toContain('<RadioFirstWorkbookGate level="B2" day={day}>');
  });

  test("shows the B2 main skill directly on each Course Book card like C2", () => {
    expect(courseTab).toContain('import { getB2SkillLabel } from "../data/b2SkillCycle"');
    expect(courseTab).toContain('const isB2CourseBook = normalizedSelectedCourseLevel === "B2"');
    expect(courseTab).toContain('data-b2-main-skill={getB2SkillLabel(entry.day)?.label || ""}');
    expect(courseTab).toContain('Main: {getB2SkillLabel(entry.day)?.label}');
    expect(courseTab).toContain('today’s ${getB2SkillLabel(nextLesson.day)?.label || "main skill"}');
  });

  test("uses non-sticky rotating navigation like C2", () => {
    expect(nav).toContain('import { getB2DayTabs } from "../data/b2SkillCycle"');
    expect(nav).toContain('normalizedLevel === "B2"');
    expect(nav).toContain('getB2DayTabs(day)');
    expect(nav).toContain('["B2", "C2"].includes(normalizedLevel)');
  });

  test("opens previous and next B2 lessons directly without repeating Radio", () => {
    expect(page).toContain('aria-label="B2 workbook navigation"');
    expect(page).toContain("← Previous lesson");
    expect(page).toContain('/campus/course/lesson/B2/${day - 1}?radio=done');
    expect(page).toContain('/campus/course/lesson/B2/${day + 1}?radio=done');
  });

  test("keeps reading feedback, private Hören, cloud sync, automatic completion and the new Review design", () => {
    expect(page).toContain("getB2ReadingPractice");
    expect(page).toContain("Textverständnis");
    expect(page).toContain("Erster Versuch:");
    expect(page).toContain('data-b2-listening-awaiting-source="true"');
    expect(page).toContain('data-b2-r2-audio="true"');
    expect(page).toContain('data-b2-listening-vocabulary="true"');
    expect(page).toContain("Vor dem Hören · wichtige Wörter");
    expect(page).toContain("fetchB2AudioPlaybackUrl");
    expect(page).toContain("Transkript anzeigen");
    expect(page).toContain("Transkript ausblenden");
    expect(page).toContain('field: "progress"');
    expect(page).toContain("useB2CloudDraftField");
    expect(page).not.toContain("B2KnowledgeChoicePractice");
    expect(page).toContain("Hörquelle wird ergänzt");
    expect(page).toContain('data-b2-grammar-video-status="missing"');
    expect(page).toContain("Grammar video not added yet");
    expect(page).toContain("Falowen zeigt bewusst kein altes oder themenfremdes Video.");
    expect(page).toContain("Review · B2 Day");
    expect(page).toContain("Day complete ✓");
    expect(page).toContain("Das Wichtigste heute");
    expect(page).toContain("Kernantwort · 3 Punkte");
    expect(page).toContain('data-b2-review-key-points="true"');
    expect(page).toContain("getB2ReviewKeyPoints(day)");
    expect(page).toContain("Next up");
    expect(page).toContain("Review is revision only");
    expect(page).toContain("completedAt: new Date().toISOString()");
  });
});
