import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import LiveSpeakPage from "./LiveSpeakPage";
import SpeakingLoadingStatus from "./SpeakingLoadingStatus";
import { useAuth } from "../context/AuthContext";

jest.mock("../context/AuthContext", () => ({ useAuth: jest.fn() }));
const ok = data => ({ ok: true, json: async () => data });
const deferred = () => {
  let resolve;
  const promise = new Promise(done => { resolve = done; });
  return { promise, resolve };
};

afterEach(() => { jest.restoreAllMocks(); jest.useRealTimers(); });

test.each(["A1", "A2", "B1", "B2", "C1", "C2"])("%s shows loading through automatic start and opening, then clears it", async level => {
  useAuth.mockReturnValue({ idToken: "test", studentProfile: { level } });
  const status = deferred(), start = deferred(), turn = deferred();
  global.fetch = jest.fn(url => String(url).endsWith("/status") ? status.promise
    : String(url).endsWith("/start") ? start.promise : turn.promise);
  global.Audio = jest.fn(() => ({ play: jest.fn().mockResolvedValue(), pause: jest.fn() }));
  render(<MemoryRouter><LiveSpeakPage embedded initialLevel={level} autoStart
    practiceSource="exam-speaking-practice" examTask={{ id: "test", teil: "Teil 1", prompt: "Freizeit" }} /></MemoryRouter>);
  expect(screen.getByText("Connecting to your AI speaking examiner…")).toBeVisible();
  await act(async () => status.resolve(ok({ enabled: true, openTesting: true, examinerFlowVersion: 1 })));
  expect(await screen.findByText("Preparing your German examiner’s voice…")).toBeVisible();
  await act(async () => start.resolve(ok({ sessionId: "test", source: "exam-speaking-practice", level,
    expiresAt: new Date(Date.now() + 240000).toISOString() })));
  expect(screen.getByText("Preparing your German examiner’s voice…")).toBeVisible();
  await act(async () => turn.resolve(ok({ reply: "Was machen Sie gern?", audioBase64: "test" })));
  await waitFor(() => expect(screen.queryByText("Preparing your German examiner’s voice…")).not.toBeInTheDocument());
});

test("slow requests reassure the learner and reset the message for the next phase", () => {
  jest.useFakeTimers();
  const { rerender, unmount } = render(<SpeakingLoadingStatus phase="connecting" />);
  act(() => jest.advanceTimersByTime(12000));
  expect(screen.getByRole("status")).toHaveTextContent("taking longer than usual");
  rerender(<SpeakingLoadingStatus phase="opening" />);
  expect(screen.getByRole("status")).not.toHaveTextContent("taking longer than usual");
  unmount();
  expect(jest.getTimerCount()).toBe(0);
});
