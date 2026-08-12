import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const patch = fs.readFileSync(path.join(root, "../scripts/patchA2Day1BeginnerLearning.mjs"), "utf8");
const teacherCard = fs.readFileSync(path.join(root, "src/components/A2Day1TeacherLectureCard.jsx"), "utf8");

describe("A2 Day 1 beginner learning design", () => {
  it("keeps English support in the grammar explanation and teaches the thinking process", () => {
    expect(patch).toContain("Am I explaining why?");
    expect(patch).toContain("RESULT?");
    expect(patch).toContain("weil → the verb waits at the end");
  });

  it("uses one coherent self-introduction brain map", () => {
    expect(patch).toContain("Kannst du dich vorstellen? Erzähl uns etwas über dich!");
    expect(patch).toContain('"Familie"');
    expect(patch).toContain('"Sprachen"');
    expect(patch).toContain('"Beruf / Studium"');
    expect(patch).toContain('"Hobbys"');
  });

  it("removes the duplicated old speaking-help block and keeps the teacher lecture in Sprechen", () => {
    expect(patch).toContain("const speakingContent = <A2Day1TeacherLectureCard />;");
    expect(teacherCard).toContain("70AgN5VKeqc");
  });
});
