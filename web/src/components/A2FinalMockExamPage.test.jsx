import fs from "fs";
import path from "path";
import { A2_GOETHE_READING_MOCK } from "./A2GoetheReadingMockPreview";
import { A2_GOETHE_LISTENING_TEIL1 } from "./A2GoetheListeningMockTeil1Preview";
import { A2_GOETHE_LISTENING_TEIL2 } from "./A2GoetheListeningMockTeil2Preview";
import { A2_GOETHE_LISTENING_TEIL3 } from "./A2GoetheListeningMockTeil3Preview";
import { A2_GOETHE_LISTENING_TEIL4 } from "./A2GoetheListeningMockTeil4Preview";

describe("A2 Final Mock Exam Day 29", () => {
  const componentSource = fs.readFileSync(
    path.resolve(__dirname, "./A2FinalMockExamPage.jsx"),
    "utf8",
  );
  const speakingSource = fs.readFileSync(
    path.resolve(__dirname, "./A2FinalMockSpeaking.jsx"),
    "utf8",
  );
  const coachServiceSource = fs.readFileSync(
    path.resolve(__dirname, "../services/coachService.js"),
    "utf8",
  );

  test("uses one synchronized four-section mock instead of the old preview hub", () => {
    expect(componentSource).toContain("Start A2 Mock");
    expect(componentSource).toContain("Submit Lesen → Hören");
    expect(componentSource).toContain("Submit Hören → Schreiben");
    expect(componentSource).toContain("Submit Schreiben → Sprechen");
    expect(componentSource).toContain('stage: "result"');
    expect(componentSource).toContain("saveA2MockAttempt");
    expect(componentSource).not.toContain("<MockExamHub");
    expect(componentSource).not.toContain("Answers are not yet saved across sections");
  });

  test("uses a 100-point result with four 25-point skills and a 60 percent pass mark", () => {
    expect(componentSource).toContain("maxScore: 100");
    expect(componentSource).toContain("overallScore >= 60");
    expect(componentSource).toContain("Lesen review");
    expect(componentSource).toContain("Hören review");
    expect(componentSource).toContain("Schreiben feedback");
    expect(componentSource).toContain("Sprechen feedback");
  });

  test("contains the supplied Lesen Teil 1–4 tasks and answer keys", () => {
    expect(A2_GOETHE_READING_MOCK.teil1.article.title).toContain("Stadtteilcafé „Miteinander“");
    expect(A2_GOETHE_READING_MOCK.teil1.questions.map((item) => item.answer)).toEqual(["b", "c", "b", "a", "b"]);

    expect(A2_GOETHE_READING_MOCK.teil2.store.title).toBe("Kaufhaus „ALEX“ – Wegweiser");
    expect(A2_GOETHE_READING_MOCK.teil2.questions.map((item) => item.answer)).toEqual(["a", "b", "a", "a", "c"]);

    expect(A2_GOETHE_READING_MOCK.teil3.email).toMatchObject({
      from: "Julia",
      to: "Sarah",
      subject: "Meine neue Wohnung / Einladung zur Party",
    });
    expect(A2_GOETHE_READING_MOCK.teil3.questions.map((item) => item.answer)).toEqual(["b", "b", "a", "c", "b"]);

    expect(A2_GOETHE_READING_MOCK.teil4.example).toMatchObject({
      person: "Markus möchte am Sonntagmorgen mit seiner Familie ausgiebig frühstücken.",
      answer: "c",
    });
    expect(A2_GOETHE_READING_MOCK.teil4.people.map((item) => item.answer)).toEqual(["e", "b", "a", "d", "X"]);
    expect(A2_GOETHE_READING_MOCK.teil4.ads.map((item) => item.title)).toEqual([
      "Café & Bistro „Bambini“",
      "Pizzeria „Bella Napoli“",
      "Café „MorgenSonn“",
      "Bio-Snack „Grün & Schnell“",
      "Bar & Restaurant „Havana Club“",
      "Trattoria „Mamma Mia“",
    ]);
  });

  test("keeps feedback hidden until the full mock result", () => {
    expect(componentSource).toContain("feedback is revealed only after the full mock is finished");
    expect(componentSource).toContain("Results remain hidden until the full mock is complete.");
    expect(speakingSource).toContain("Feedback stays hidden until the end of the exam.");
  });

  test("waits for transcription and auto-submits a recording made before timeout", () => {
    expect(speakingSource).toContain("hasInFlightSubmission");
    expect(speakingSource).toContain("pendingRecordedTask");
    expect(speakingSource).toContain("recordingTaskId || hasInFlightSubmission");
    expect(speakingSource).toContain("submitTask(pendingRecordedTask, { timeoutAuto: true })");
    expect(speakingSource).toContain("timeoutSubmissionFailed: timeoutAuto || secondsLeftRef.current <= 0");

    expect(coachServiceSource).toContain("TIMED_MOCK_SPEAKING_ANALYZE_TIMEOUT_MS = 30_000");
    expect(coachServiceSource).toContain("timeoutMs = null");
    expect(coachServiceSource).toContain("if (!hasTimeout)");
    expect(coachServiceSource).toContain("return runAnalysis()");
    expect(coachServiceSource).toContain("Promise.race([runAnalysis(), timeoutPromise])");
    expect(speakingSource).toContain("timeoutMs: TIMED_MOCK_SPEAKING_ANALYZE_TIMEOUT_MS");
  });

  test("keeps Hören audio rules and answer data aligned", () => {
    expect(A2_GOETHE_LISTENING_TEIL1.plays).toBe(2);
    expect(A2_GOETHE_LISTENING_TEIL2.plays).toBe(1);
    expect(A2_GOETHE_LISTENING_TEIL3.plays).toBe(1);
    expect(A2_GOETHE_LISTENING_TEIL4.plays).toBe(2);

    expect(A2_GOETHE_LISTENING_TEIL1.questions.map((item) => item.answer)).toEqual(["c", "b", "b", "b", "b"]);
    expect(A2_GOETHE_LISTENING_TEIL2.tasks.map((item) => item.answer.toLowerCase())).toEqual(["a", "b", "c", "d", "e"]);
    expect(A2_GOETHE_LISTENING_TEIL3.questions.map((item) => item.answer.toLowerCase())).toEqual(["a", "c", "b", "a", "c"]);
    expect(A2_GOETHE_LISTENING_TEIL4.questions.map((item) => item.answer)).toEqual(["ja", "nein", "ja", "nein", "ja"]);
    expect(componentSource.match(/expired=\{secondsLeft <= 0\}/g)).toHaveLength(4);
    expect(componentSource).toContain("audioRef.current.pause()");
  });

  test("keeps the freshest local attempt on resume and timestamps autosaves", () => {
    expect(componentSource).toContain("clientSavedAtMs: Date.now()");
    expect(componentSource).toContain("localSavedAt > serverSavedAt");
    expect(componentSource).toContain("sameLocalAttempt");
    expect(componentSource).toContain("state: persistedState");
  });

  test("collects all five A2 speaking responses into one final score", () => {
    expect(speakingSource).toContain("teil1_questions");
    expect(speakingSource).toContain("teil1_answers");
    expect(speakingSource).toContain("teil2_main");
    expect(speakingSource).toContain("teil2_followup");
    expect(speakingSource).toContain('id: "teil3"');
    expect(speakingSource).toContain("scoreA2MockSpeaking");
  });
});
