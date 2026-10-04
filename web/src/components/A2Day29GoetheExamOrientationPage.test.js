import fs from "fs";
import path from "path";

const read = (relativePath) => fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("A2 Day 29 mock preview", () => {
  const schedule = read("../data/courseSchedule.js");
  const app = read("../App.js");
  const completionJourney = read("../data/courseCompletionJourney.js");
  const lifecyclePatch = read("../../scripts/patchA2CompletionAndDay0ClassParticipation.mjs");
  const finalMock = read("A2FinalMockExamPage.jsx");

  test("uses Day 29 for the A2 mock preview and Day 30 for completion", () => {
    expect(schedule).toContain("day: 29");
    expect(schedule).toContain('topic: "A2 Mock Practice · Preview"');
    expect(schedule).toContain('workbook_link: "/campus/course/a2-mock-practice-preview"');
    expect(schedule).toContain("day: 30");
    expect(schedule).toContain('topic: "Course Completed!"');
  });

  test("keeps the 28 teaching assignments as the completion requirement", () => {
    expect(completionJourney).toContain("A2: 28");
    expect(schedule).toContain("does not add a 29th required course assignment");
  });

  test("does not present the unfinished previews as a completed scored mock", () => {
    expect(schedule).toContain("answers are not yet saved across sections");
    expect(finalMock).toContain("This is a preview");
    expect(finalMock).toContain("there is no unified score or final result yet");
  });

  test("opens the four A2 practice areas from the preview hub", () => {
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

  test("registers the canonical preview route and keeps prior URLs as aliases", () => {
    expect(app).toContain('import A2FinalMockExamPage from "./components/A2FinalMockExamPage";');
    expect(app).toContain('path="/campus/course/a2-mock-practice-preview" element={<A2FinalMockExamPage />}');
    expect(app).toContain('path="/campus/course/a2-final-mock-exam" element={<A2FinalMockExamPage />}');
    expect(app).toContain('path="/campus/course/a2-day-29-goethe-exam-orientation" element={<A2FinalMockExamPage />}');
  });

  test("keeps lifecycle normalization aligned with the Day 30 milestone after the mock preview", () => {
    expect(lifecyclePatch).toContain("Day 29 mock preview");
    expect(lifecyclePatch).toContain('day: 30,\\n    topic: "Course Completed!"');
  });
});
