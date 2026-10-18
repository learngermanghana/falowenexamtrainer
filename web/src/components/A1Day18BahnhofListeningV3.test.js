import { A1_12_1_LISTENING_AUDIO_KEY, A1_12_1_LISTENING_QUESTIONS_V3 } from "./A1Day18Kapitel121WorkbookPage";
import { getA1Assignment } from "../data/a1AssignmentRegistry";
import { buildA1WorkbookSubmissionText, makeEmptyA1WorkbookDraft } from "../utils/a1WorkbookDraft";

test("A1-12.1 loads the protected R2 Day 18 MP3 and five Bahnhof questions", () => {
  expect(A1_12_1_LISTENING_AUDIO_KEY).toBe("a1/day-18/day-18.mp3");
  expect(A1_12_1_LISTENING_QUESTIONS_V3).toHaveLength(5);
  expect(A1_12_1_LISTENING_QUESTIONS_V3.join(" ")).toMatch(/Schwester/);
  expect(A1_12_1_LISTENING_QUESTIONS_V3.join(" ")).toMatch(/Bahnhofshalle/);
  expect(A1_12_1_LISTENING_QUESTIONS_V3.join(" ")).toMatch(/Koffer/);
});

test("new listening version is serialized for correct server answer key", () => {
  const assignment = getA1Assignment("A1-12.1");
  const draft = {
    ...makeEmptyA1WorkbookDraft("A1-12.1"),
    sections: {
      "teil-1": { answers: { 1: "Richtig", 2: "Falsch", 3: "Falsch", 4: "Richtig", 5: "Falsch" } },
      "teil-3": { answers: { 1: "Richtig", 2: "Falsch", 3: "Richtig", 4: "Falsch", 5: "Richtig" } },
    },
  };
  const output = buildA1WorkbookSubmissionText({ assignment, draft });
  expect(output).toContain("A1-12.1-BAHNHOF-HOEREN-V3");
  expect(output).toContain("TEIL 3");
  expect(output.split("TEIL 3")[1]).toContain("5. Richtig");
  expect(output).not.toContain("TEIL 2");
});
