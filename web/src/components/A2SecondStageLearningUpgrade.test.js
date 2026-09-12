import fs from "fs";
import path from "path";
import { A2_SECOND_STAGE_DAYS } from "./A2SecondStageLearningUpgrade";

const read = (name) => fs.readFileSync(path.resolve(__dirname, name), "utf8");

const upgradeSource = read("A2SecondStageLearningUpgrade.js");
const standardShell = read("A2StandardTabbedWorkbookPage.js");
const grammarWrapper = read("A2B1WorkbookGrammarNotes.js");
const day17 = read("A2Day17InDieApothekeGehenWorkbookPage.js");

describe("A2.2 content upgrade", () => {
  it("covers every A2.2 day from 15 through 28", () => {
    expect(A2_SECOND_STAGE_DAYS).toEqual([15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28]);
  });

  it("adds grammar, speaking and writing teaching without owning Lesen/Hören assessment data", () => {
    expect(upgradeSource).toContain("A2SecondStageGrammarUpgrade");
    expect(upgradeSource).toContain("A2SecondStageSpeakingUpgrade");
    expect(upgradeSource).toContain("A2SecondStageWritingUpgrade");
    expect(upgradeSource).not.toContain("lesenQuestions");
    expect(upgradeSource).not.toContain("hoerenQuestions");
    expect(upgradeSource).not.toContain("hoerenAudioUrl");
  });

  it("wires real-life speaking and writing only around the standard assessment shell", () => {
    expect(standardShell).toContain("<A2SecondStageSpeakingUpgrade day={day} />");
    expect(standardShell).toContain("<A2SecondStageWritingUpgrade day={day} />");
    expect(standardShell).toContain("<QuestionList questions={lesenQuestions} />");
    expect(standardShell).toContain("<QuestionList questions={hoerenQuestions} />");
    expect(standardShell).toContain("<ListeningMedia url={hoerenAudioUrl} />");
  });

  it("gives custom Day 17 the A2.2 grammar upgrade without changing its pharmacy assessment", () => {
    expect(grammarWrapper).toContain("<A2SecondStageGrammarUpgrade day={day} />");
    expect(day17).toContain('<A2B1GrammarNotesTab level="A2" day={17} />');
    expect(day17).toContain('src="https://www.youtube.com/embed/jgl__L4L9kE"');
    expect(day17).toContain('stem: "Warum ging Anna in die Apotheke?"');
  });

  it("keeps the upgrade text-first and practical", () => {
    expect(upgradeSource).toContain("Real-life speaking");
    expect(upgradeSource).toContain("70–90 Wörter");
    expect(upgradeSource).toContain("Rollenspiel");
    expect(upgradeSource).not.toContain("<img");
  });
});
