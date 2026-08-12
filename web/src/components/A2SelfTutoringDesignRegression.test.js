import fs from "fs";
import path from "path";

const read = (relative) => fs.readFileSync(path.resolve(__dirname, relative), "utf8");
const rootRead = (relative) => fs.readFileSync(path.resolve(__dirname, "../../../", relative), "utf8");

describe("A2 self-tutoring design contract", () => {
  test("keeps grammar practice in Grammar and teacher lecture plus brain map in Sprechen", () => {
    const patch = rootRead("scripts/patchA2GrammarQuizSpeakingMindMap.mjs");
    const design = rootRead("scripts/patchA2SelfTutoringDesign.mjs");
    expect(patch).toContain("grammarContent");
    expect(patch).toContain("A2Days6To9LearningGuide");
    expect(design).toContain("A2TeacherLectureCard");
    expect(design).toContain("SpeakingMindMap");
  });

  test("uses bilingual reasoning-first grammar for Day 1", () => {
    const guide = read("A2Day1BilingualGrammarNotes.jsx");
    expect(guide).toContain("Understand first · then practise");
    expect(guide).toContain("two simple ideas");
    expect(guide).toContain("reason");
    expect(guide).toContain("result");
    expect(guide).toContain("Check your understanding");
  });

  test("turns the Day 1 production prompt into the single brain-map question", () => {
    const design = rootRead("scripts/patchA2SelfTutoringDesign.mjs");
    expect(design).toContain("Kannst du dich vorstellen? Erzähl uns etwas über dich!");
    expect(design).toContain('"Familie"');
    expect(design).toContain('"Sprachen"');
    expect(design).toContain('"Beruf / Studium"');
    expect(design).toContain('"Hobbys"');
    expect(design).toContain("Duplicate A2 Day 1 speaking scaffolds remain");
  });
});
