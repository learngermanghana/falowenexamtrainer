import fs from "fs";
import path from "path";
import { getC2ExamStandard } from "../data/c2ExamStandardContent";
import { getC2TopicKnowledge } from "../data/c2TopicKnowledge";
import { getC2SkillFocus, C2_SKILL_DAYS } from "../data/c2SkillCycle";
import { getC2ReadingPractice } from "../data/c2ReadingPractice";
import { getC2ListeningPractice } from "../data/c2ListeningPractice";

describe("C2 unified topic-first workbook", () => {
  const page = fs.readFileSync(path.join(__dirname, "C2UnifiedGuidedWorkbookPage.js"), "utf8");
  const registry = fs.readFileSync(path.join(__dirname, "SelfLearningLessonRegistry.js"), "utf8");
  const cloudSync = fs.readFileSync(path.join(__dirname, "../utils/c2CloudDraftSync.js"), "utf8");
  const workbookComponents = fs.readFileSync(path.join(__dirname, "StandardWorkbookComponents.js"), "utf8");

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

  test("uses a balanced seven-day-per-skill rotation instead of requiring every skill daily", () => {
    expect(C2_SKILL_DAYS.lesen).toEqual([1, 5, 9, 13, 17, 21, 25]);
    expect(C2_SKILL_DAYS.hoeren).toEqual([2, 6, 10, 14, 18, 22, 26]);
    expect(C2_SKILL_DAYS.speak).toEqual([3, 7, 11, 15, 19, 23, 27]);
    expect(C2_SKILL_DAYS.write).toEqual([4, 8, 12, 16, 20, 24, 28]);
    expect(Array.from({ length: 28 }, (_, index) => getC2SkillFocus(index + 1))).toHaveLength(28);
    expect(page).toContain("Today: Grammar/Learn +");
    expect(page).toContain("The other production skills are not required today.");
  });

  test("uses the full opinion-writing workspace on the seven assigned writing days", () => {
    expect(page).toContain("buildC2OpinionWritingTemplate");
    expect(page).toContain('!String(saved||"").trim()?buildC2OpinionWritingTemplate(standard):saved');
    expect(page).toContain("C2-Schreibvorlage ist bereits im Textfeld gespeichert");
    expect(page).toContain("Nutzen Sie nur die Satzanfänge als Gerüst");
    expect(page).toContain("Vorlage wiederherstellen");
    expect(page).toContain('active==="write"?<OpinionWrite');
    expect(page).not.toContain('active==="write"?(standard.writeType');
  });

  test("only allows deep links to sections assigned to that C2 day", () => {
    expect(page).toContain('new Set(getC2DayTabs(day).map(({key})=>key))');
    expect(page).toContain('allowedViews.has(value)?value:"learn"');
    expect(page).toContain('if(!allowedViews.has(next))return');
    expect(page).toContain('params.set("view",next)');
    expect(page).toContain('skillFocus==="write"');
    expect(page).toContain('onClick={()=>changeView("write")}');
    expect(page).toContain("Open writing template");
  });

  test("creates instant-feedback Lesen practice on every reading day", () => {
    C2_SKILL_DAYS.lesen.forEach((day) => {
      const reading = getC2ReadingPractice(day);
      expect(reading).toBeTruthy();
      expect(reading.text.length).toBeGreaterThanOrEqual(4);
      expect(reading.questions).toHaveLength(5);
      reading.questions.forEach((question) => {
        expect(question.options.length).toBeGreaterThanOrEqual(4);
        expect(Number.isInteger(question.answerIndex)).toBe(true);
        expect(question.explanation.length).toBeGreaterThan(20);
      });
    });
    expect(page).toContain("Sie sehen sofort, ob sie richtig ist und warum.");
    expect(page).toContain('Richtige Antwort:');
  });

  test("keeps Hören transcript-first with empty sources and no invented questions", () => {
    C2_SKILL_DAYS.hoeren.forEach((day) => {
      const listening = getC2ListeningPractice(day);
      expect(listening).toBeTruthy();
      expect(listening.audioUrl).toBe("");
      expect(listening.transcript).toBe("");
      expect(listening.questions).toBeUndefined();
    });
    expect(page).toContain("Es werden bewusst noch keine Fragen angezeigt.");
    expect(page).toContain("Die Fragen werden erst aus dem tatsächlichen Transkript erstellt");
    expect(page).toContain("so Hören does not block this day");
  });

  test("syncs C2 progress and drafts through the signed-in account while retaining local fallback", () => {
    expect(page).toContain('field:"progress"');
    expect(page).toContain('field:"speechPlan"');
    expect(page).toContain('field:"opinionDraft"');
    expect(page).toContain('field:"reformulationAnswers"');
    expect(page).toContain("localStorage.setItem");

    expect(cloudSync).toContain('doc(db, "users", user.uid, "c2Drafts"');
    expect(cloudSync).toContain("onSnapshot");
    expect(cloudSync).toContain("setDoc");
    expect(cloudSync).toContain('ownerUid: user.uid');
    expect(cloudSync).toContain('{ merge: true }');
    expect(cloudSync).toContain("seedCloudWhenMissing");
    expect(cloudSync).toContain("shouldPreferLegacyLocal");
    expect(cloudSync).toContain("cloud-migrated");
    expect(page).toContain("legacyDraftSeedAllowed");
    expect(page).toContain("legacyProgressSeedAllowed");
    expect(cloudSync).toContain("pendingSaveRef");
    expect(cloudSync).toContain("dirtySerializedRef");
    expect(cloudSync).toContain("WriterId");
    expect(cloudSync).toContain("shouldPreserveNewerLocalC2Draft");
    expect(cloudSync).toContain('window.addEventListener("pagehide", flushOnExit)');
    expect(cloudSync).toContain("flushPendingSave()");
    expect(page).toContain('data-c2-opinion-editor="true"');
    expect(page).toContain('overflowAnchor:"none"');
  });

  test("keeps the C2 section navigation in normal document flow", () => {
    expect(workbookComponents).toContain('data-sticky-navigation={normalizedLevel === "C2" ? "false" : "true"}');
    expect(workbookComponents).toContain('style={normalizedLevel === "C2" ? undefined : { position: "sticky", top: 0, zIndex: 35 }}');
  });


  test("keeps topic knowledge ahead of grammar and speaking support", () => {
    expect(page).toContain("Thema verstehen");
    expect(page).toContain("In simple English");
    expect(page).toContain("Auf Deutsch");
    expect(page).toContain("Welche Interessen oder Werte geraten in Spannung?");
    expect(page).toContain("Sprechen · Erst verstehen, dann argumentieren");
  });
});
