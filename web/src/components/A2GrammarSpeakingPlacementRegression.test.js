import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const shell = fs.readFileSync(path.join(root, "src/components/A2StandardTabbedWorkbookPage.js"), "utf8");
const day4 = fs.readFileSync(path.join(root, "src/components/A2Day4WoMoechtenWirUnsTreffenWorkbookPage.js"), "utf8");
const patch = fs.readFileSync(path.join(root, "../scripts/patchA2GrammarQuizSpeakingMindMap.mjs"), "utf8");
const mobilePatch = fs.readFileSync(path.join(root, "../scripts/patchA2B1MobileFloatingActions.mjs"), "utf8");

describe("A2 grammar and speaking placement", () => {
  it("keeps the speaking brain map visible even when custom speaking content exists", () => {
    expect(shell).toContain('<SpeakingMindMap config={getA2SpeakingMindMap(day)} />');
    expect(shell).toContain('{sprechenContent ? sprechenContent : <WorkbookTaskCard');
  });

  it("places interactive learning helpers in Grammar rather than Sprechen", () => {
    expect(shell).toContain('{grammarContent || null}');
    expect(shell).toContain('activeTab === "grammar"');
    expect(shell).toContain('Number(day) >= 6 && Number(day) <= 9 ? <A2Days6To9LearningGuide day={day} /> : null');
  });

  it("routes Day 4 Wo/Wohin lesson and MCQs to Grammar", () => {
    expect(day4).toContain('const grammarContent = <A2Day4WoWohinPrepositionLesson />;');
    expect(day4).toContain('grammarContent={grammarContent}');
    expect(day4).not.toContain('sprechenContent={speakingContent}');
  });

  it("preserves the correction during prebuild", () => {
    expect(patch).toContain('Restore A2 Grammar quiz placement');
    expect(mobilePatch).toContain('patchA2GrammarQuizSpeakingMindMap.mjs');
  });
});
