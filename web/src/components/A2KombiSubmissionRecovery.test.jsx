import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import A2KombiMockExamPage from "./A2KombiMockExamPage";
import { a2KombiKeys } from "../services/a2KombiMockFinalization";
import { saveA2MockAttempt } from "../services/a2FinalMockService";

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ idToken: "test-token", user: { uid: "kombi-student" } }),
}));
jest.mock("../services/a2FinalMockService", () => ({
  saveA2MockAttempt: jest.fn(),
}));
jest.mock("./navigation/AppBackButton", () => () => null);
jest.mock("./A2MockSpeakingExaminer", () => () => null);
jest.mock("./A2Mock04Hoeren", () => () => null);

test("expired Schreiben sends both saved texts and retries the same checkpoint", async () => {
  localStorage.clear();
  window.scrollTo = jest.fn();
  const startedAt = Date.now() - 31 * 60_000;
  const keys = a2KombiKeys("a2-mock-08", "kombi-student");
  localStorage.setItem(keys.flow, JSON.stringify({
    stage: "schreiben", attemptInfo: { attemptId: "mock-eight", assessmentVersion: "three-module-v1" },
  }));
  localStorage.setItem(keys.schreiben, JSON.stringify({ startedAt, sms: "Hallo!", email: "Guten Tag." }));
  saveA2MockAttempt.mockRejectedValueOnce(new Error("Offline")).mockResolvedValueOnce({ ok: true });

  render(<MemoryRouter><A2KombiMockExamPage mockNumber={8} /></MemoryRouter>);
  expect(await screen.findByRole("heading", { name: "Sprechen · A2 Mock 8" })).toBeInTheDocument();
  fireEvent.click(await screen.findByRole("button", { name: "Retry saving answers" }));

  const checkpoint = expect.objectContaining({
    attemptId: "mock-eight", section: "schreiben",
    state: expect.objectContaining({
      assessmentVersion: "three-module-v1",
      schreibenSubmission: { startedAt, submittedAt: expect.any(Number), sms: "Hallo!", email: "Guten Tag." },
    }),
  });
  expect(saveA2MockAttempt).toHaveBeenCalledTimes(2);
  expect(saveA2MockAttempt).toHaveBeenNthCalledWith(1, checkpoint);
  expect(saveA2MockAttempt).toHaveBeenNthCalledWith(2, checkpoint);
  expect(await screen.findByRole("heading", { name: "Sprechen · A2 Mock 8" })).toBeInTheDocument();
});
