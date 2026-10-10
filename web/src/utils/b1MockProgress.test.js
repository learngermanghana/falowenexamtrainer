import fs from "fs";
import path from "path";
import {
  B1_MOCK_STEPS,
  getB1MockProgress,
  getB1MockPracticeRecommendations,
} from "./b1MockProgress";

const component = fs.readFileSync(path.resolve(__dirname, "../components/B1FinalMockExamPage.jsx"), "utf8");
const catalog = fs.readFileSync(path.resolve(__dirname, "../components/MockExamLibraryPage.js"), "utf8");

describe("B1 mock completion guidance and recovery", () => {
  it("requires four ordered modules before calling the mock complete", () => {
    expect(B1_MOCK_STEPS.map(({ key }) => key)).toEqual(["lesen", "hoeren", "schreiben", "sprechen"]);
    expect(B1_MOCK_STEPS.map(({ minutes }) => minutes)).toEqual([65, 40, 75, 20]);
    expect(getB1MockProgress("intro", {})).toMatchObject({
      completed: 0, total: 4, currentIndex: -1, isComplete: false,
    });
    expect(getB1MockProgress("hoeren", { lesen: 0 })).toMatchObject({
      completed: 1, currentIndex: 1, isComplete: false,
      nextStep: { key: "schreiben" },
    });
    expect(getB1MockProgress("sprechen", { lesen: 0, hoeren: 12, schreiben: 11 })).toMatchObject({
      completed: 3, currentIndex: 3, isComplete: false,
    });
    expect(getB1MockProgress("result", { lesen: 0, hoeren: 12, schreiben: 11 })).toMatchObject({
      completed: 3, isComplete: false,
    });
    expect(getB1MockProgress("result", {
      lesen: 0, hoeren: 12, schreiben: 11, sprechen: 16,
    })).toMatchObject({ completed: 4, isComplete: true });
  });

  it("recommends targeted practice in increasing score order without changing previous scores", () => {
    const scores = Object.freeze({ lesen: 18, hoeren: 8, schreiben: 15, sprechen: 11 });
    expect(getB1MockPracticeRecommendations(scores).map((step) => [step.key, step.score])).toEqual([
      ["hoeren", 8], ["sprechen", 11], ["schreiben", 15], ["lesen", 18],
    ]);
    expect(scores).toEqual({ lesen: 18, hoeren: 8, schreiben: 15, sprechen: 11 });
    expect(getB1MockPracticeRecommendations({ lesen: 5 })).toHaveLength(1);
    expect(B1_MOCK_STEPS.map((step) => step.practiceRoute)).toEqual([
      "/exams/lesen/b1/sample-1",
      "/exams/horen/b1/sample-1",
      "/exams/writing",
      "/exams/speaking",
    ]);
  });

  it("labels all four stages and preserves original attempt and timing behavior", () => {
    expect(component).toContain('<FullMockGuide level="B1"');
    expect(component).toContain("Start or resume complete B1 mock");
    expect(component).toContain("An unfinished mock is not a failed mock.");
    expect(component).toContain("the section timer is <strong>not paused</strong>");
    expect(component).toContain('<FullMockRecovery level="B1"');
    expect(component).toContain("getB1MockPracticeRecommendations");
    expect(component).toContain('sectionScores: scores');
    expect(component).toContain('stage: "result"');
    expect(component).toContain("saveB1MockAttempt");
    expect(catalog).toContain("Start or resume mock");
  });

  it("warns before skipping the four Hören audio Teile, without breaking timed auto-advance", () => {
    expect(component).toContain("four separate audio Teile");
    expect(component).toContain('exam.hoerenAudio?.[part.id] === "ended"');
    expect(component).toContain("hoerenAnswered < hoerenQuestions.length");
    expect(component).toContain("confirmIncompleteHoeren");
    expect(component).toContain("Finish Hören anyway → Schreiben");
    expect(component).toContain("Go back and finish Hören");
    expect(component).toContain('if (exam.stage === "hoeren") submitHoeren();');
    expect(component).toContain('mockId: B1_FINAL_MOCK_ID');
  });
});
