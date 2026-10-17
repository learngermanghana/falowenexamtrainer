import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import SharedTimedAssignment, { TimedAssignmentPanel, buildTimedAssignmentStorageKey } from "./SharedTimedAssignment";
import { getTimedAssignmentConfig } from "../data/timedAssignmentConfig";
import { getA2B1LessonProfile } from "../data/a2B1LessonProfile";
import { onSnapshot, setDoc } from "../firebase";
jest.mock("../firebase", () => ({ auth: null, db: {}, doc: jest.fn(() => "ref"), onSnapshot: jest.fn(), setDoc: jest.fn(), serverTimestamp: jest.fn(() => "server-time") }));
jest.mock("../context/AuthContext", () => ({ useAuth: () => ({ user: { uid: "student" } }) }));
jest.mock("../hooks/useLessonProgress", () => ({ useLessonProgress: () => ({ progressByAssignmentId: {}, loading: false }) }));
jest.mock("../hooks/useAssessmentRestriction", () => ({ useAssessmentRestriction: jest.fn() }));
jest.mock("../services/interactionFeedback", () => ({ triggerInteractionFeedback: jest.fn(() => Promise.resolve()) }));
let snapshot;
let unsubscribe;
function Harness({ level, assignmentKey, day, onTimeExpired }) {
  const config = day ? getA2B1LessonProfile(level, day).timer : getTimedAssignmentConfig(assignmentKey);
  return <SharedTimedAssignment assignmentKey={assignmentKey} level={level} configOverride={config} onTimeExpired={onTimeExpired}>
    {(timed) => <><TimedAssignmentPanel /><output data-testid="lock">{String(timed.isTabLocked(config.timedTabs[0]))}</output></>}
  </SharedTimedAssignment>;
}
beforeEach(() => {
  jest.useFakeTimers(); jest.setSystemTime(new Date("2026-10-12T10:00:00Z"));
  localStorage.clear(); jest.clearAllMocks(); unsubscribe = jest.fn();
  onSnapshot.mockImplementation((_ref, next) => { snapshot = next; next({ exists: () => false }); return unsubscribe; });
  setDoc.mockResolvedValue(undefined);
});
afterEach(() => jest.useRealTimers());
test.each([["B1", "B1-6.18", 18], ["B1", "B1-10.27", 27], ["A2", "A2-10.27", 27], ["A1", "A1-12.3", null]])(
  "%s agreement, start, countdown, navigation, resume and expiry", async (level, assignmentKey, day) => {
    const onTimeExpired = jest.fn();
    const props = { level, assignmentKey, day, onTimeExpired };
    const seconds = getTimedAssignmentConfig(assignmentKey).durationMinutes * 60;
    const view = render(<Harness {...props} />);
    expect(screen.getByTestId("lock")).toHaveTextContent("true");
    expect(screen.getByRole("button", { name: /^Start/ })).toBeDisabled();
    fireEvent.click(screen.getByRole("checkbox"));
    view.rerender(<Harness {...props} />);
    expect(screen.getByRole("checkbox")).toBeChecked();
    expect(onSnapshot).toHaveBeenCalledTimes(1);
    await act(async () => fireEvent.click(screen.getByRole("button", { name: /^Start/ })));
    expect(screen.getByLabelText(`${seconds} seconds remaining`)).toBeInTheDocument();
    expect(screen.getByTestId("lock")).toHaveTextContent("false");
    const startedAt = Date.now();
    const active = { exists: () => true, data: () => ({ status: "active", clientStartedAt: startedAt, durationSeconds: seconds }) };
    act(() => snapshot(active));
    act(() => jest.advanceTimersByTime(3000));
    expect(screen.getByLabelText(`${seconds - 3} seconds remaining`)).toBeInTheDocument();
    view.rerender(<Harness {...props} />);
    expect(onSnapshot).toHaveBeenCalledTimes(1);
    act(() => jest.advanceTimersByTime(2000));
    expect(screen.getByLabelText(`${seconds - 5} seconds remaining`)).toBeInTheDocument();
    view.unmount(); expect(unsubscribe).toHaveBeenCalledTimes(1);
    onSnapshot.mockImplementation((_ref, next) => { snapshot = next; next(active); return unsubscribe; });
    render(<Harness {...props} />);
    expect(screen.getByLabelText(`${seconds - 5} seconds remaining`)).toBeInTheDocument();
    act(() => jest.advanceTimersByTime((seconds - 5) * 1000));
    expect(screen.getByTestId("lock")).toHaveTextContent("true");
    expect(onTimeExpired).toHaveBeenCalledTimes(1);
    act(() => jest.advanceTimersByTime(5000));
    expect(onTimeExpired).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("button", { name: /^Start/ })).not.toBeInTheDocument();
  });
test("a rejected start stays locked and explains the failure", async () => {
  setDoc.mockRejectedValueOnce(new Error("permission-denied"));
  const log = jest.spyOn(console, "error").mockImplementation(() => {});
  render(<Harness level="B1" assignmentKey="B1-6.18" day={18} />);
  fireEvent.click(screen.getByRole("checkbox"));
  await act(async () => fireEvent.click(screen.getByRole("button", { name: /^Start/ })));
  expect(screen.getByText(/This timed attempt could not be started/)).toHaveTextContent("could not be started");
  expect(screen.getByTestId("lock")).toHaveTextContent("true");
  expect(screen.queryByLabelText(/seconds remaining/)).not.toBeInTheDocument();
  log.mockRestore();
});


test("resuming a previously started 55-minute B1 attempt keeps all originally promised time", () => {
  const onTimeExpired = jest.fn();
  const now = Date.now();
  const oldDurationSeconds = 55 * 60;
  const startedAt = now - 25 * 60 * 1000;
  const active = {
    exists: () => true,
    data: () => ({ status: "active", clientStartedAt: startedAt, durationSeconds: oldDurationSeconds }),
  };
  onSnapshot.mockImplementation((_ref, next) => {
    snapshot = next;
    next(active);
    return unsubscribe;
  });

  const props = { level: "B1", assignmentKey: "B1-7.21", day: 21, onTimeExpired };
  expect(getTimedAssignmentConfig(props.assignmentKey).durationMinutes).toBe(20);
  const view = render(<Harness {...props} />);
  expect(screen.getByText(/Timed practice · 55 minutes/)).toBeInTheDocument();
  expect(screen.getByLabelText(`${30 * 60} seconds remaining`)).toBeInTheDocument();
  expect(screen.getByTestId("lock")).toHaveTextContent("false");
  expect(onTimeExpired).not.toHaveBeenCalled();

  act(() => jest.advanceTimersByTime(10 * 60 * 1000));
  expect(screen.getByLabelText(`${20 * 60} seconds remaining`)).toBeInTheDocument();
  expect(onTimeExpired).not.toHaveBeenCalled();

  view.unmount();
  render(<Harness {...props} />);
  expect(screen.getByLabelText(`${20 * 60} seconds remaining`)).toBeInTheDocument();
  act(() => jest.advanceTimersByTime(20 * 60 * 1000));
  expect(onTimeExpired).toHaveBeenCalledTimes(1);
  expect(screen.getByTestId("lock")).toHaveTextContent("true");
});

test("legacy local attempt never expires early while its original cloud duration loads", () => {
  const onTimeExpired = jest.fn();
  const now = Date.now();
  const startedAt = now - 25 * 60 * 1000;
  const oldDurationSeconds = 55 * 60;
  localStorage.setItem(
    buildTimedAssignmentStorageKey("B1-7.21", "B1"),
    JSON.stringify({ startedAt, endsAt: startedAt + oldDurationSeconds * 1000 }),
  );
  onSnapshot.mockImplementation((_ref, next) => {
    snapshot = next;
    return unsubscribe; // Simulate a slow Firestore response.
  });

  render(<Harness level="B1" assignmentKey="B1-7.21" day={21} onTimeExpired={onTimeExpired} />);
  expect(screen.getByText(/Timed practice · 55 minutes/)).toBeInTheDocument();
  expect(screen.getByTestId("lock")).toHaveTextContent("false");
  act(() => jest.advanceTimersByTime(10 * 60 * 1000));
  expect(onTimeExpired).not.toHaveBeenCalled();
  expect(screen.getByTestId("lock")).toHaveTextContent("false");

  act(() => snapshot({
    exists: () => true,
    data: () => ({ status: "active", clientStartedAt: startedAt, durationSeconds: oldDurationSeconds }),
  }));
  expect(screen.getByLabelText(`${20 * 60} seconds remaining`)).toBeInTheDocument();
  expect(onTimeExpired).not.toHaveBeenCalled();
});

test("new attempts persist the newly configured 20-minute duration", async () => {
  render(<Harness level="B1" assignmentKey="B1-7.21" day={21} />);
  fireEvent.click(screen.getByRole("checkbox"));
  await act(async () => fireEvent.click(screen.getByRole("button", { name: /^Start/ })));
  expect(setDoc).toHaveBeenCalledWith(
    "ref",
    expect.objectContaining({ durationSeconds: 20 * 60, status: "active" }),
  );
  expect(screen.getByText(/Timed practice · 20 minutes/)).toBeInTheDocument();
});
