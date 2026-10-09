import fs from "fs";
import path from "path";
import { A1_GOETHE_SPEAKING_MOCK } from "./A1GoetheSpeakingMockPreview";

describe("A1 Goethe-style Sprechen mock preview", () => {
  test("uses a 15-minute three-part speaking mock", () => {
    expect(A1_GOETHE_SPEAKING_MOCK.durationSeconds).toBe(15 * 60);
    expect(A1_GOETHE_SPEAKING_MOCK.tasks.map((task) => task.teil)).toEqual(["1", "2", "3"]);
    expect(A1_GOETHE_SPEAKING_MOCK.maxScore).toBe(25);
    expect(A1_GOETHE_SPEAKING_MOCK.passScore).toBe(15);
  });

  test("uses the intended A1 speaking tasks", () => {
    const [teil1, teil2, teil3] = A1_GOETHE_SPEAKING_MOCK.tasks;

    expect(teil1.prompt).toContain("Stellen Sie sich kurz vor");
    expect(teil1.card).toContain("Familienname buchstabieren");

    expect(teil2.context).toBe("Thema: Freizeit");
    expect(teil2.keyword).toBe("Wochenende");
    expect(teil2.prompt).toContain("Stellen Sie eine passende A1-Frage");

    expect(teil3.keyword).toBe("Fenster");
    expect(teil3.prompt).toContain("höflich");
  });

  test("uses the existing audio analysis service plus one combined scorer", () => {
    const componentSource = fs.readFileSync(
      path.resolve(__dirname, "./A1GoetheSpeakingMockPreview.jsx"),
      "utf8",
    );
    const coachServiceSource = fs.readFileSync(
      path.resolve(__dirname, "../services/coachService.js"),
      "utf8",
    );

    expect(componentSource).toContain("analyzeAudio");
    expect(componentSource).toContain("scoreA1MockSpeaking");
    expect(coachServiceSource).toContain("/speaking/a1-mock-score");
  });

  test("lets a timed-out incomplete attempt retry final marking after a request failure", () => {
    const componentSource = fs.readFileSync(
      path.resolve(__dirname, "./A1GoetheSpeakingMockPreview.jsx"),
      "utf8",
    );

    expect(componentSource).toContain("timedOutMarkFailed");
    expect(componentSource).toContain("Retry speaking marking");
    expect(componentSource).toContain("markSpeaking({ force: true })");
    expect(componentSource).toContain("your submitted answers are still saved");
  });

  test("waits for in-flight transcription and auto-submits a pre-timeout recording", () => {
    const componentSource = fs.readFileSync(
      path.resolve(__dirname, "./A1GoetheSpeakingMockPreview.jsx"),
      "utf8",
    );

    expect(componentSource).toContain("hasInFlightSubmission");
    expect(componentSource).toContain("pendingRecordedTask");
    expect(componentSource).toContain("recordingTaskId || hasInFlightSubmission");
    expect(componentSource).toContain("submitTask(pendingRecordedTask, { timeoutAuto: true })");
    expect(componentSource).toContain("timeoutSubmissionFailed: timeoutAuto || secondsLeftRef.current <= 0");
    expect(componentSource).toContain("TIMED_MOCK_SPEAKING_ANALYZE_TIMEOUT_MS");
    expect(componentSource).toContain("timeoutMs: TIMED_MOCK_SPEAKING_ANALYZE_TIMEOUT_MS");
  });

  test("uses English for recording and submission controls", () => {
    const componentSource = fs.readFileSync(
      path.resolve(__dirname, "./A1GoetheSpeakingMockPreview.jsx"),
      "utf8",
    );

    expect(componentSource).toContain("Start speaking");
    expect(componentSource).toContain("Record answer");
    expect(componentSource).toContain("Stop recording");
    expect(componentSource).toContain("Delete recording");
    expect(componentSource).toContain("Send answer");
    expect(componentSource).toContain("Progress");
    expect(componentSource).toContain("Time left");
    expect(componentSource).not.toContain("Sprechen starten");
    expect(componentSource).not.toContain("Aufnahme löschen");
    expect(componentSource).not.toContain("Diese Antwort abgeben");
  });

  test("keeps English final feedback and Exams Room practice links", () => {
    const componentSource = fs.readFileSync(
      path.resolve(__dirname, "./A1GoetheSpeakingMockPreview.jsx"),
      "utf8",
    );

    expect(componentSource).toContain("AI feedback");
    expect(componentSource).toContain("overall_feedback_en");
    expect(componentSource).toContain('href="/exams/question"');
    expect(componentSource).toContain('href="/exams/speaking"');
  });

  test("stays hidden from the A1 Course Book", () => {
    const appSource = fs.readFileSync(path.resolve(__dirname, "../App.js"), "utf8");
    const courseBookSource = fs.readFileSync(path.resolve(__dirname, "../data/a1CourseBookCards.js"), "utf8");

    expect(appSource).toContain("/campus/course/a1-mock-sprechen-preview");
    expect(courseBookSource).not.toContain("a1-mock-sprechen-preview");
  });
});
