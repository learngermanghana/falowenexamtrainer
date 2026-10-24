import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import CourseSpeakingMockAssignment from "./CourseSpeakingMockAssignment";
import { useAuth } from "../context/AuthContext";
import { fetchCourseSpeakingMockStatus, startCourseSpeakingMock, submitCourseSpeakingMock } from "../services/courseSpeakingMockService";

jest.mock("../context/AuthContext", () => ({ useAuth: jest.fn() }));
jest.mock("../services/interactionFeedback", () => ({ announceExamSuccess: jest.fn() }));
jest.mock("./SpeakingPracticeHome", () => ({ SpeakingFeedback: () => <div>Saved feedback</div> }));
jest.mock("../data/speakingDictionary", () => ({
  speakingQuestionDictionary: [1, 2, 3].map(i => ({
    id: `b1-speaking-${i}`, level: "B1", teilLabel: `Teil ${i}`,
    topicPrompt: ["Ein Geschenk kaufen", "Sport im Alltag", "Fragen zur Präsentation"][i - 1],
    keywordSubtopic: "B1 speaking practice",
  })),
}));
jest.mock("../services/courseSpeakingMockService", () => ({
  fetchCourseSpeakingMockStatus: jest.fn(),
  startCourseSpeakingMock: jest.fn(),
  submitCourseSpeakingMock: jest.fn(),
}));

const ok = data => ({ ok: true, json: async () => data });
const limits = [5, 1, 2];
const active = i => ({
  sessionId: `b1-part-${i + 1}`, level: "B1", source: "exam-speaking-practice",
  examTask: { id: `b1-speaking-${i + 1}`, teil: `Teil ${i + 1}`,
    courseAssignmentKey: "B1-7.23", mockAttemptId: "attempt-b1" },
  expiresAt: new Date(Date.now() + 20 * 60 * 1000).toISOString(),
  answeredTurns: 0, answerLimit: limits[i], maxRecordingSeconds: i === 1 ? 180 : 35,
  maxAudioBytes: 350000, maxTranscriptChars: 800,
  examFlow: { key: `B1-${i + 1}`, mode: "simulation", title: "B1 exam",
    points: i === 0 ? ["Wann?", "Wie viel?", "Wo?", "Wer?"] : [],
    step: { role: "partner", index: 1, seconds: 35 } },
});

let now, part, confirmed, recordings, starts;
const originalMediaRecorder = global.MediaRecorder;
const originalMedia = navigator.mediaDevices;
const originalCreate = URL.createObjectURL;
const originalRevoke = URL.revokeObjectURL;

beforeEach(() => {
  now = Date.now();
  part = -1;
  confirmed = [0, 0, 0];
  recordings = [];
  starts = 0;
  jest.spyOn(Date, "now").mockImplementation(() => now);
  useAuth.mockReturnValue({ idToken: "test-b1", user: { uid: "learner-b1" }, studentProfile: { level: "B1" } });
  fetchCourseSpeakingMockStatus.mockResolvedValue({ completed: false, attemptId: "", recovery: { parts: [] } });
  startCourseSpeakingMock.mockResolvedValue({ attemptId: "attempt-b1" });
  submitCourseSpeakingMock.mockResolvedValue({ score: 75, passed: true,
    sectionScores: { teil1: 70, teil2: 80, teil3: 75 } });
  global.Audio = jest.fn(() => ({ play: jest.fn().mockResolvedValue(), pause: jest.fn() }));
  URL.createObjectURL = jest.fn(() => "blob:b1-course-speaking");
  URL.revokeObjectURL = jest.fn();
  Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: {
    getUserMedia: jest.fn(async () => ({ getTracks: () => [{ stop: jest.fn() }] })),
  } });
  global.MediaRecorder = class {
    static isTypeSupported() { return true; }
    constructor() { this.mimeType = "audio/webm"; this.state = "inactive"; }
    start() {
      this.state = "recording";
      this.ondataavailable?.({ data: new Blob([new Uint8Array(1800)], { type: "audio/webm" }) });
    }
    stop() { this.state = "inactive"; this.onstop?.(); }
  };
  global.fetch = jest.fn(async (url, options = {}) => {
    const pathname = String(url);
    if (pathname.includes("/live-speak/status")) {
      return ok({ enabled: true, remaining: 2, openTesting: true,
        examinerFlowVersion: 1, activeSession: null });
    }
    if (pathname.endsWith("/live-speak/session/start")) {
      part += 1; starts += 1;
      return ok({ ...active(part), resumed: false });
    }
    if (pathname.endsWith("/live-speak/session/turn")) {
      const req = JSON.parse(options.body);
      if (req.intro) return ok({ reply: "Guten Tag. Beginnen wir bitte.", audioBase64: "" });
      expect(req.audioBase64).toBeTruthy();
      recordings.push({ part, payload: req });
      return ok({ needsConfirmation: true,
        pendingId: `pending-${part}-${confirmed[part]}`,
        transcript: "Ich schlage vor, dass wir es zusammen machen." });
    }
    if (pathname.endsWith("/live-speak/session/confirm")) {
      const req = JSON.parse(options.body);
      expect(req.expectedAnsweredTurns).toBe(confirmed[part]);
      confirmed[part] += 1;
      const ready = confirmed[part] === limits[part];
      return ok({ transcript: req.transcript, reply: "Danke, das klingt gut.", audioBase64: "",
        taskReady: ready, maxRecordingSeconds: part === 1 ? 180 : 35,
        examFlow: { ...active(part).examFlow, step: ready ? null : {
          role: "partner", index: confirmed[part] + 1, seconds: 35 } } });
    }
    if (pathname.endsWith("/live-speak/session/exam-feedback")) {
      expect(confirmed[part]).toBe(limits[part]);
      return ok({ feedback: "Ihre Antworten wurden bewertet.",
        assessment: { score: 7, maxScore: 10, percent: 70, practiceOnly: true,
          tasks: [{ step: 1, score: 7, maxScore: 10 }] } });
    }
    throw new Error(`Unexpected examiner request: ${pathname}`);
  });
});

afterEach(() => {
  jest.restoreAllMocks();
  jest.clearAllMocks();
  global.MediaRecorder = originalMediaRecorder;
  Object.defineProperty(navigator, "mediaDevices", { configurable: true, value: originalMedia });
  URL.createObjectURL = originalCreate;
  URL.revokeObjectURL = originalRevoke;
  localStorage.clear();
});

test("B1 student records every step, confirms transcripts, completes all three Teile and submits once", async () => {
  render(<MemoryRouter><CourseSpeakingMockAssignment assignmentKey="B1-7.23" /></MemoryRouter>);
  fireEvent.click(await screen.findByRole("button", { name: /Start speaking mock/ }));
  await screen.findByRole("heading", { name: "AI Examiner · B1" });
  expect(screen.queryByText(/Exam simulation/)).not.toBeInTheDocument();
  expect(screen.queryByText(/Your brief notes/)).not.toBeInTheDocument();
  expect(screen.getByLabelText("Session time left")).toHaveTextContent(/^20:0[0-1]$/);
  expect(screen.getByRole("button", { name: "Check saved answer / speaking progress" })).toBeInTheDocument();
  expect(screen.getByText("View planning points")).toBeInTheDocument();

  for (let index = 0; index < limits.length; index += 1) {
    await waitFor(() => expect(starts).toBe(index + 1));
    for (let step = 0; step < limits[index]; step += 1) {
      const record = await screen.findByRole("button", { name: "Record German answer" });
      await waitFor(() => expect(record).toBeEnabled());
      fireEvent.click(record);
      const stop = await screen.findByRole("button", { name: "Stop and send recording" });
      now += 2300; // More than the 1.5-second minimum on real microphone recordings.
      fireEvent.click(stop);
      // Repeating the step with the same recording is forbidden. Transcript
      // confirmation must be the only operation that advances it.
      fireEvent.click(await screen.findByRole("button", { name: "Confirm answer" }));
      await waitFor(() => expect(confirmed[index]).toBe(step + 1));
      if (step < limits[index] - 1) {
        await screen.findByRole("button", { name: "Record German answer" });
      }
    }
    if (index < 2) {
      await waitFor(() => expect(starts).toBe(index + 2));
      expect(screen.getByRole("navigation", { name: "Exam progress" })).toHaveTextContent(`Teil ${index + 2}`);
    }
  }

  expect(await screen.findByText(/All three speaking parts assessed — course score saved/)).toBeInTheDocument();
  expect(recordings).toHaveLength(8);
  expect(confirmed).toEqual([5, 1, 2]);
  expect(submitCourseSpeakingMock).toHaveBeenCalledTimes(1);
  expect(submitCourseSpeakingMock).toHaveBeenCalledWith(expect.objectContaining({
    assignmentKey: "B1-7.23",
    attemptId: "attempt-b1",
    sessionIds: ["b1-part-1", "b1-part-2", "b1-part-3"],
  }));
});
