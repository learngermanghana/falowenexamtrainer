import fs from "fs";
import path from "path";
import { getC2ExamStandard } from "../data/c2ExamStandardContent";
import { getC2TopicKnowledge } from "../data/c2TopicKnowledge";
import { getC2SkillFocus, getC2SpeakingSupport, C2_SKILL_DAYS } from "../data/c2SkillCycle";
import { getC2ReadingPractice } from "../data/c2ReadingPractice";
import { getC2ListeningPractice } from "../data/c2ListeningPractice";
import { getC2WritingFormat } from "../data/c2WritingFormats";
import { buildC2DayProgress, summarizeC2SkillProgress } from "../hooks/useC2CourseProgress";

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
    expect(page).toContain("Review is revision only; it does not add another assignment.");
  });

  test("varies the seven substantial writing days instead of repeating one format", () => {
    const labels = C2_SKILL_DAYS.write.map((day) => getC2WritingFormat(day, "Thema").label);
    expect(labels).toEqual([
      "Leserbrief",
      "Formelle E-Mail",
      "Argumentativer Beitrag",
      "Zusammenfassung + Bewertung",
      "Stellungnahme",
      "Synthese mehrerer Positionen",
      "Prüfungssimulation",
    ]);
    expect(page).toContain("getC2WritingFormat");
    expect(page).toContain("Passende C2-Schreibvorlage ist bereits im Textfeld gespeichert");
    expect(page).toContain("Vorlage wiederherstellen");
    expect(page).toContain('active==="write"?<OpinionWrite');
  });

  test("only allows deep links to sections assigned to that C2 day", () => {
    expect(page).toContain('new Set(getC2DayTabs(day).map(({key})=>key))');
    expect(page).toContain('rawValue==="finish"?"review":rawValue');
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
    expect(page).toContain('field:"readingAnswers"');
    expect(page).toContain('field:"readingFirstAttempts"');
    expect(page).toContain("Eine falsche erste Antwort blockiert den Abschluss nicht.");
    expect(page).toContain("Dieser Wert dient nur als Lernstand. Er entscheidet nicht über den Kursabschluss.");
  });

  test("uses the real Day 2 transcript and instant-feedback listening questions", () => {
    C2_SKILL_DAYS.hoeren.forEach((day) => {
      const listening = getC2ListeningPractice(day);
      expect(listening).toBeTruthy();
      expect(listening.audioUrl).toBe("");
      if (day === 2) {
        expect(listening.audioKey).toBe("c2/day-02/day-02.m4a");
        expect(Array.isArray(listening.transcript)).toBe(true);
        expect(listening.transcript.length).toBeGreaterThanOrEqual(10);
        expect(listening.questions).toHaveLength(6);
        listening.questions.forEach((question) => {
          expect(question.options).toHaveLength(4);
          expect(Number.isInteger(question.answerIndex)).toBe(true);
          expect(question.explanation.length).toBeGreaterThan(20);
        });
      } else {
        expect(listening.audioKey).toBe("");
        expect(listening.transcript).toBe("");
        expect(listening.questions).toBeUndefined();
      }
    });
    expect(page).toContain("Es werden bewusst noch keine Fragen angezeigt.");
    expect(page).toContain("Die Fragen werden erst aus dem tatsächlichen Transkript erstellt");
    expect(page).toContain("Hören source is still pending and does not block completion.");
    expect(page).toContain('data-c2-r2-audio="true"');
    expect(page).toContain("fetchC2AudioPlaybackUrl");
    expect(page).toContain("Die Aufnahme wird direkt hier in Falowen abgespielt.");
    expect(page).toContain("Transkript anzeigen");
    expect(page).toContain("Transkript ausblenden");
    expect(page).toContain('data-c2-listening-transcript="true"');
    expect(page).toContain('field:"listeningAnswers"');
    expect(page).toContain('field:"listeningFirstAttempts"');
    expect(page).toContain("Verständnis und Argumentation");
  });

  test("reduces speaking support deliberately across the seven speaking days", () => {
    expect(C2_SKILL_DAYS.speak.map(getC2SpeakingSupport)).toEqual([
      "full", "full", "keywords", "keywords", "keywords", "exam", "exam",
    ]);
    expect(page).toContain("Recommended support for this stage");
  });

  test("builds day completion separately from first-attempt learning scores", () => {
    const readingDay = buildC2DayProgress(1, {
      progress: { learnDone: true, lesenDone: true },
      readingFirstAttempts: { 0: 1, 1: 0, 2: 1, 3: 2, 4: 1 },
    });
    expect(readingDay.dayComplete).toBe(true);
    expect(readingDay.readingFirstAttemptScore).toEqual(
      expect.objectContaining({ answered: 5, total: 5 }),
    );

    const summary = summarizeC2SkillProgress({
      1: readingDay,
      3: { skillFocus: "speak", skillDone: true, dayComplete: true },
    });
    expect(summary.lesen.completed).toBe(1);
    expect(summary.speak.completed).toBe(1);
  });

  test("shows a recap after each four-day cycle without adding another assignment", () => {
    expect(page).toContain("4-day cycle recap");
    expect(page).toContain("This is a recap only. It does not add another assignment.");
    expect(page).toContain("day%4===0?day-3:null");
  });

  test("syncs C2 progress and drafts through the signed-in account while retaining local fallback", () => {
    expect(page).toContain('field:"progress"');
    expect(page).toContain('field:"speechPlan"');
    expect(page).toContain('field:"opinionDraft"');
    expect(page).toContain('field:"writingFeedback"');
    expect(page).toContain('field:"readingAnswers"');
    expect(page).toContain('field:"readingFirstAttempts"');
    expect(page).toContain('field:"listeningAnswers"');
    expect(page).toContain('field:"listeningFirstAttempts"');
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

  test("replaces Finish with a useful Review page and automatic completion", () => {
    expect(page).toContain('active==="review"?<C2ReviewPage');
    expect(page).toContain("Das Wichtigste heute");
    expect(page).toContain("Grammatik merken");
    expect(page).toContain("Wortschatz · 6 wichtige Ausdrücke");
    expect(page).toContain("Kann ich das?");
    expect(page).toContain("Next up");
    expect(page).not.toContain("<strong>Confidence</strong>");
    expect(page).not.toContain("<strong>Reflection</strong>");
    expect(page).toContain("const ready=Boolean(progress.learnDone&&skillDone)");
  });

  test("adds next-assignment navigation below every C2 workbook", () => {
    expect(page).toContain('aria-label="C2 workbook navigation"');
    expect(page).toContain("Next assignment · Day");
    expect(page).toContain('/campus/course/lesson/C2/');
    expect(page).toContain("<C2WorkbookNextNavigation day={day} navigate={navigate}/>");
  });

  test("adds C2 AI analysis to the writing page", () => {
    expect(page).toContain('level:"C2"');
    expect(page).toContain("Analyse my text");
    expect(page).toContain("AI-Schreibanalyse");
    expect(page).toContain("<WritingFeedbackCard level=\"C2\"");
    expect(page).toContain('field:"writingFeedback"');
  });

  test("keeps the B2 and C2 section navigation in normal document flow", () => {
    expect(workbookComponents).toContain('const sticky = !["B2", "C2"].includes(normalizedLevel)');
    expect(workbookComponents).toContain('data-sticky-navigation={sticky ? "true" : "false"}');
    expect(workbookComponents).toContain('style={sticky ? { position: "sticky", top: 0, zIndex: 35 } : undefined}');
  });


  test("keeps topic knowledge ahead of grammar and speaking support", () => {
    expect(page).toContain("Thema verstehen");
    expect(page).toContain("In simple English");
    expect(page).toContain("Auf Deutsch");
    expect(page).toContain("Welche Interessen oder Werte geraten in Spannung?");
    expect(page).toContain("Sprechen · Erst verstehen, dann argumentieren");
  });
});
