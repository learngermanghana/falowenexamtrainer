import fs from "fs";
import path from "path";

const read = (relativePath) => fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("A2 Day 29 final mock", () => {
  const schedule = read("../data/courseSchedule.js");
  const app = read("../App.js");
  const completionJourney = read("../data/courseCompletionJourney.js");
  const lifecyclePatch = read("../../scripts/patchA2CompletionAndDay0ClassParticipation.mjs");
  const finalMock = read("A2FinalMockExamPage.jsx");

  test("uses Day 29 for the A2 Final Mock and Day 30 for completion", () => {
    expect(schedule).toContain("day: 29");
    expect(schedule).toContain('topic: "A2 Final Mock Exam"');
    expect(schedule).toContain('workbook_link: "/campus/course/a2-final-mock-exam"');
    expect(schedule).toContain("day: 30");
    expect(schedule).toContain('topic: "Course Completed!"');
  });

  test("keeps the 28 teaching assignments as the completion requirement", () => {
    expect(completionJourney).toContain("A2: 28");
    expect(schedule).toContain("does not add a 29th required course assignment");
  });

  test("opens the four A2 mock areas from the final mock hub", () => {
    ["Lesen", "Hören", "Schreiben", "Sprechen"].forEach((section) => {
      expect(finalMock).toContain(`title: "${section}"`);
    });
    expect(finalMock).toContain("/campus/course/a2-mock-lesen-preview");
    expect(finalMock).toContain("/campus/course/a2-mock-hoeren-teil-1-preview");
    expect(finalMock).toContain("/campus/course/a2-mock-schreiben-preview");
    expect(finalMock).toContain("/campus/course/a2-mock-sprechen-teil-1-preview");
  });

  test("keeps official Goethe practice as a follow-up resource", () => {
    expect(finalMock).toContain("https://www.goethe.de/ins/gh/en/spr/prf/gzsd2/ueb.html");
    expect(finalMock).toContain("Official Goethe A2 practice");
  });

  test("registers the canonical mock route and keeps the old orientation URL as an alias", () => {
    expect(app).toContain('import A2FinalMockExamPage from "./components/A2FinalMockExamPage";');
    expect(app).toContain('path="/campus/course/a2-final-mock-exam" element={<A2FinalMockExamPage />}');
    expect(app).toContain('path="/campus/course/a2-day-29-goethe-exam-orientation" element={<A2FinalMockExamPage />}');
  });

  test("keeps lifecycle normalization aligned with the Day 30 milestone after the final mock", () => {
    expect(lifecyclePatch).toContain("Day 29 final mock");
    expect(lifecyclePatch).toContain('day: 30,\\n    topic: "Course Completed!"');
  });
});
