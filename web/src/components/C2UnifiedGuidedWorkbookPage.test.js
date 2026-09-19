import fs from "fs";
import path from "path";
import { getC2ExamStandard } from "../data/c2ExamStandardContent";
import { getC2TopicKnowledge } from "../data/c2TopicKnowledge";

describe("C2 unified topic-first workbook", () => {
  const page = fs.readFileSync(path.join(__dirname, "C2UnifiedGuidedWorkbookPage.js"), "utf8");
  const registry = fs.readFileSync(path.join(__dirname, "SelfLearningLessonRegistry.js"), "utf8");

  test.each(Array.from({ length: 28 }, (_, index) => index + 1))("Day %i has a complete topic foundation", (day) => {
    const standard = getC2ExamStandard(day);
    const knowledge = getC2TopicKnowledge(day);

    expect(standard).toBeTruthy();
    expect(knowledge).toBeTruthy();
    expect(knowledge.chapter).toMatch(/^\d+\.\d+$/);
    expect(knowledge.core.length).toBeGreaterThan(45);
    expect(knowledge.en.length).toBeGreaterThan(60);
    expect(knowledge.de.length).toBeGreaterThan(60);
    expect(knowledge.example.length).toBeGreaterThan(40);
    expect(knowledge.actors.length).toBeGreaterThanOrEqual(3);
    expect(knowledge.tensions.length).toBeGreaterThanOrEqual(3);
  });

  test("routes every live C2 day through the unified workbook", () => {
    expect(registry).toContain('import C2UnifiedGuidedWorkbookPage from "./C2UnifiedGuidedWorkbookPage"');
    expect(registry).toContain('normalizedLevel === "C2" && day >= 1 && day <= 28');
    expect(registry).toContain("<C2UnifiedGuidedWorkbookPage");
    expect(registry).not.toContain("<C2Day1To7MasteryPage");
    expect(registry).not.toContain("<C2Day8To14MasteryPage");
  });

  test("keeps Learn teaching and Write testing separated", () => {
    expect(page).toContain("Im Learn-Bereich lernen, im Write-Bereich testen");
    expect(page).toContain("Hier werden keine Musterlösungen angezeigt");
    expect(page).toContain("standard.reformulations.map");
    expect(page).not.toContain("item.model");
    expect(page).not.toContain("item.note");
  });

  test("preloads and preserves the reusable C2 opinion template on opinion days", () => {
    expect(page).toContain("buildC2OpinionWritingTemplate");
    expect(page).toContain("saved===null?buildC2OpinionWritingTemplate(standard):saved");
    expect(page).toContain("C2-Schreibvorlage ist bereits im Textfeld gespeichert");
    expect(page).toContain("Vorlage wiederherstellen");
    expect(page).toContain("alle Platzhalter ersetzt");
  });


  test("keeps topic knowledge ahead of grammar and speaking support", () => {
    expect(page).toContain("Thema verstehen");
    expect(page).toContain("In simple English");
    expect(page).toContain("Auf Deutsch");
    expect(page).toContain("Welche Interessen oder Werte geraten in Spannung?");
    expect(page).toContain("Sprechen · Erst verstehen, dann argumentieren");
  });
});
