import fs from "fs";
import path from "path";
import { B1_LISTENING, B1_READING, B1_SPEAKING, B1_WRITING_TASKS } from "../data/b1FinalMockData";

describe("B1 Final Mock Exam", () => {
  const source = fs.readFileSync(path.resolve(__dirname, "./B1FinalMockExamPage.jsx"), "utf8");
  const speaking = fs.readFileSync(path.resolve(__dirname, "./B1FinalMockSpeaking.jsx"), "utf8");

  test("contains all four timed skills and a 100-point final result", () => {
    expect(source).toContain("lesen: 65 * 60");
    expect(source).toContain("hoeren: 40 * 60");
    expect(source).toContain("schreiben: 75 * 60");
    expect(source).toContain("sprechen: 20 * 60");
    expect(source).toContain("overallScore >= 60");
    expect(source).toContain("maxScore: 100");
    expect(source).toContain("saveB1MockAttempt");
  });

  test("uses the supplied protected B1 Hören objects and answer key", () => {
    expect(B1_LISTENING.map((part) => part.audioObjectKey)).toEqual([
      "b1/mock-hoeren-1/teil-1.mp3",
      "b1/mock-hoeren-1/teil-2.mp3",
      "b1/mock-hoeren-1/teil-3.mp3",
      "b1/mock-hoeren-1/teil-4.mp3",
    ]);
    expect(B1_LISTENING.flatMap((part) => part.questions).map((item) => item.answer)).toEqual([
      "richtig","b","richtig","c","richtig","b","richtig","b","falsch","b",
      "b","b","a","c","c",
      "falsch","richtig","richtig","falsch","falsch","richtig","falsch",
      "a","b","b","a","c","b","a","c",
    ]);
  });

  test("keeps the approved B1 writing tasks and word targets", () => {
    expect(B1_WRITING_TASKS.map((task) => task.target)).toEqual([80, 80, 40]);
    expect(B1_WRITING_TASKS[0].prompt).toContain("Jan");
    expect(B1_WRITING_TASKS[1].prompt).toContain("bargeldloses Bezahlen");
    expect(B1_WRITING_TASKS[2].prompt).toContain("Frau Schneider");
    expect(source).toContain("Automatisch gespeichert");
  });

  test("uses one continuous partner simulation for speaking Teil 1 and one recording for Teil 2 and Teil 3", () => {
    expect(B1_SPEAKING.teil1.audioObjectKey).toBe("b1/mock-hoeren-1/sprechen-teil-1.mp3");
    expect(B1_SPEAKING.teil1.points).toHaveLength(6);
    expect(B1_SPEAKING.teil2.topic).toContain("gedruckte Bücher");
    expect(B1_SPEAKING.teil2.prepSeconds).toBe(300);
    expect(speaking).toContain("Start conversation + recording");
    expect(speaking).toContain("scoreB1MockSpeaking");
    expect(speaking).toContain("Start 5-minute preparation");
  });

  test("matches A1/A2 recovery protections for autosave and final-result sync", () => {
    expect(source).toContain("clientSavedAtMs: Date.now()");
    expect(source).toContain("sameLocalAttempt");
    expect(source).toContain("localSavedAt");
    expect(source).toContain("serverSavedAt");
    expect(source).toContain("localSavedAt > serverSavedAt");
    expect(source).toContain("completionRetryCountRef");
    expect(source).toContain("completionRetryTimerRef");
    expect(source).toContain("[3000, 10000, 30000, 60000]");
    expect(source).toContain("setCompletionRetryNonce");
    expect(source).toContain("Could not finalize B1 mock result sync");
    expect(source).toContain("forceNew && exam.completed && exam.attemptInfo?.attemptId");
  });

  test("lets React StrictMode replay own the completion sync", () => {
    expect(source).toContain('if (completionSavedRef.current === completionKey) {');
    expect(source).toContain('completionSavedRef.current = "";');
    expect(source).toContain("cancelled = true");
  });

  test("keeps supplied reading answers aligned", () => {
    expect(B1_READING.teil1.questions.map((q) => q.answer)).toEqual([
      "richtig","richtig","falsch","falsch","richtig","falsch",
    ]);
    expect(B1_READING.teil2.questions.map((q) => q.answer)).toEqual(["b","a","b"]);
    expect(B1_READING.teil2.text2.heading).toContain("Ehrenamt im Trend");
    expect(B1_READING.teil2.text2.questions.map((q) => q.answer)).toEqual(["b","a","b"]);
    expect(B1_READING.teil3.situations.map((q) => q.answer)).toEqual(["b","e","a","0","d","f","i"]);
    expect(B1_READING.teil4.comments.map((q) => q.answer)).toEqual(["nein","ja","nein","nein","ja","nein","ja"]);
    expect(B1_READING.teil5.questions.map((q) => q.answer)).toEqual(["b","b","b","a"]);
  });
});
