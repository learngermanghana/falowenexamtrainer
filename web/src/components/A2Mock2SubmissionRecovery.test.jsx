import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import A2Mock2ExamHub from "./A2Mock2ExamHub";
import { getA2Mock2StorageKeys, isA2Mock2ReviewReady } from "../utils/mockReviewAccess";
import { markLetterWithAI, scoreA2MockSpeaking } from "../services/coachService";

jest.mock("../context/AuthContext", () => ({ useAuth: () => ({ user: { uid: "mock-2-recovery-student" }, idToken: "test-token" }) }));
jest.mock("./navigation/AppBackButton", () => () => <div>Back</div>);
jest.mock("../services/coachService", () => ({
  markLetterWithAI: jest.fn(),
  scoreA2MockSpeaking: jest.fn(),
  analyzeAudio: jest.fn(),
  TIMED_MOCK_SPEAKING_ANALYZE_TIMEOUT_MS: 30000,
}));

const keys = getA2Mock2StorageKeys("mock-2-recovery-student");
const save = (key, value) => localStorage.setItem(keys[key], JSON.stringify(value));
const completedFirstTwo = () => {
  save("lesen", { completedAt: Date.now(), answers: { 1: "a" } });
  save("hoeren", { completedAt: Date.now(), answers: { 1: "b" } });
};
const completeSpeech = () => Object.fromEntries(
  ["t1_questions", "t1_answers", "t2_main", "t2_followups", "t3_plan"]
    .map(key => [key, { transcript: "Das ist meine gespeicherte Antwort." }]),
);
const mount = () => render(<MemoryRouter><A2Mock2ExamHub /></MemoryRouter>);

beforeEach(() => {
  localStorage.clear();
  window.scrollTo = jest.fn();
  markLetterWithAI.mockReset().mockRejectedValue(new Error("Writing marking unavailable"));
  scoreA2MockSpeaking.mockReset().mockRejectedValue(new Error("Speaking marking unavailable"));
});

test("an earlier submitted Schreiben advances to Sprechen even without AI feedback", async () => {
  completedFirstTwo();
  const text = { startedAt: Date.now() - 1000, submittedAt: Date.now(), sms: "Hallo Julia, ich bin krank.", email: "Sehr geehrte Damen und Herren, ich möchte reservieren." };
  save("schreiben", text);
  save("flow", { stage: "schreiben", startedAt: Date.now() - 90000 });
  mount();

  await waitFor(() => expect(screen.getByText("Speaking · A2 Mock 2")).toBeInTheDocument());
  expect(screen.getByText("3 of 4 modules completed")).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem(keys.schreiben)).sms).toBe(text.sms);
  expect(JSON.parse(localStorage.getItem(keys.schreiben)).email).toBe(text.email);
  expect(markLetterWithAI).not.toHaveBeenCalled();
});

test("an expired Schreiben automatically submits and moves on without an AI response", async () => {
  completedFirstTwo();
  save("schreiben", { startedAt: Date.now() - 31 * 60 * 1000, sms: "Entwurf bleibt erhalten", email: "" });
  save("flow", { stage: "schreiben", startedAt: Date.now() - 62 * 60 * 1000 });
  mount();

  await waitFor(() => expect(screen.getByText("Speaking · A2 Mock 2")).toBeInTheDocument());
  const recovered = JSON.parse(localStorage.getItem(keys.schreiben));
  expect(recovered.submittedAt).toEqual(expect.any(Number));
  expect(recovered.sms).toBe("Entwurf bleibt erhalten");
});

test("all four submitted modules unlock final review even if both AI marking services fail", async () => {
  completedFirstTwo();
  save("schreiben", { startedAt: Date.now() - 9999, submittedAt: Date.now(), sms: "Hallo Julia", email: "Sehr geehrte Damen und Herren" });
  save("sprechen", completeSpeech());
  save("flow", { stage: "sprechen", startedAt: Date.now() - 500000 });
  expect(isA2Mock2ReviewReady(keys)).toBe(true);
  mount();

  await waitFor(() => expect(screen.getByText("All four modules completed")).toBeInTheDocument());
  expect(screen.getByText("4 of 4 modules completed")).toBeInTheDocument();
  expect(markLetterWithAI).not.toHaveBeenCalled();
  expect(scoreA2MockSpeaking).not.toHaveBeenCalled();
  expect(screen.getByText("Writing · AI feedback / retry marking")).toBeInTheDocument();
  expect(screen.getAllByText("Speaking · AI examiner feedback").length).toBeGreaterThan(0);
  expect(JSON.parse(localStorage.getItem(keys.sprechen)).t3_plan.transcript).toBe("Das ist meine gespeicherte Antwort.");
});

test("completion tracker immediately counts Lesen and Hören without refreshing the page", async () => {
  const confirm = jest.spyOn(window, "confirm").mockReturnValue(true);
  try {
    save("flow", { stage: "lesen", startedAt: Date.now() - 1000 });
    mount();

    // Reading can be submitted with unanswered questions (they count as wrong).
    fireEvent.click(within(screen.getByRole("navigation", {name:"Prüfungsteile"}))
      .getByRole("button", {name:/Teil 4/}));
    fireEvent.click(screen.getByRole("button", {name:"Submit reading"}));

    await waitFor(() => expect(screen.getByText("1 of 4 modules completed")).toBeInTheDocument());
    expect(screen.getByText("Hören · Übungstest 2")).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(keys.lesen)).completedAt).toEqual(expect.any(Number));

    fireEvent.click(within(screen.getByRole("navigation", {name:"Hören-Teile"}))
      .getByRole("button", {name:/Teil 4/}));
    fireEvent.click(screen.getByRole("button", {name:"Submit listening"}));

    await waitFor(() => expect(screen.getByText("2 of 4 modules completed")).toBeInTheDocument());
    expect(screen.getByText("Mock 2 · Schreiben")).toBeInTheDocument();
    expect(JSON.parse(localStorage.getItem(keys.hoeren)).completedAt).toEqual(expect.any(Number));
    expect(markLetterWithAI).not.toHaveBeenCalled();
    expect(scoreA2MockSpeaking).not.toHaveBeenCalled();
  } finally {
    confirm.mockRestore();
  }
});
