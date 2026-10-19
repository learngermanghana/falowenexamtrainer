import React from "react";
import { installA1SubmissionConsistencyRuntime } from "../a1SubmissionConsistencyRuntime";
import { act } from "@testing-library/react";

jest.mock("../context/AuthContext", () => ({ useAuth: () => ({ user: null, studentProfile: null }) }));
jest.mock("../hooks/useLessonProgress", () => ({ useLessonProgress: () => ({ progressByAssignmentId: {}, loading: false }) }));
jest.mock("../hooks/useAssessmentRestriction", () => ({ useAssessmentRestriction: () => {} }));
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import A1TimedMockExam, {
  buildA1MockExamStorageKey,
  formatA1MockExamTime,
  getA1MockExamDurationSeconds,
  useA1TimedMockExam,
} from "./A1TimedMockExam";
import { TimedAssignmentPanel } from "./SharedTimedAssignment";
import { A1SharedWorkbookTabBar } from "./A1SharedAssignmentWorkbookLayout";

describe("A1 timed mock exam", () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.useFakeTimers();
  });

  afterEach(() => jest.useRealTimers());

  test("formats the exam clock", () => {
    expect(formatA1MockExamTime(1800)).toBe("30:00");
    expect(formatA1MockExamTime(299)).toBe("04:59");
    expect(formatA1MockExamTime(-1)).toBe("00:00");
  });

  test("allocates time according to the amount of work in each remaining assignment", () => {
    expect(getA1MockExamDurationSeconds("A1-12.3")).toBe(30 * 60);
    expect(getA1MockExamDurationSeconds("A1-13")).toBe(35 * 60);
    expect(getA1MockExamDurationSeconds("A1-14.1")).toBe(30 * 60);
  });

  test("starts a persistent 30-minute mock for Day 20", () => {
    render(
      <MemoryRouter initialEntries={["/workbook"]}>
        <Routes><Route path="/workbook" element={<A1TimedMockExam assignment={{ assignmentKey: "A1-12.3" }}><TimedAssignmentPanel /></A1TimedMockExam>} /></Routes>
      </MemoryRouter>,
    );

    const unlockButton = screen.getByRole("button", { name: "Start 30-minute mock" });
    expect(unlockButton).toBeDisabled();
    expect(document.querySelector("[data-a1-timed-mock-exam]")).toHaveAttribute("data-assignment-locked", "true");
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(unlockButton);

    expect(screen.getByText("30:00")).toBeInTheDocument();
    expect(document.querySelector("[data-a1-timed-mock-exam]")).toHaveAttribute("data-assignment-locked", "false");
    const saved = JSON.parse(window.localStorage.getItem(buildA1MockExamStorageKey("A1-12.3")));
    expect(saved.endsAt - Date.now()).toBe(getA1MockExamDurationSeconds("A1-12.3") * 1000);
  });

  test("keeps preparation tabs open while assignment and submission tabs are locked", () => {
    render(
      <MemoryRouter>
        <A1SharedWorkbookTabBar
          assignment={{ assignmentKey: "A1-12.3" }}
          sections={[{ key: "teil-1", label: "Teil 1" }]}
          activeTab="grammar"
          onSelect={jest.fn()}
          hasGrammar
          assignmentLocked
        />
      </MemoryRouter>,
    );

    expect(screen.getByRole("tab", { name: "Overview" })).toBeEnabled();
    expect(screen.getByRole("tab", { name: "Grammar" })).toBeEnabled();
    expect(screen.getByRole("tab", { name: "Teil 1 (locked until timed mock starts)" })).toBeDisabled();
    expect(screen.getByRole("tab", { name: "Review & Submit (locked until timed mock starts)" })).toBeDisabled();
  });

  test("does not show the mock timer before Day 20", () => {
    render(
      <MemoryRouter><A1TimedMockExam assignment={{ assignmentKey: "A1-12.2" }} /></MemoryRouter>,
    );
    expect(screen.queryByText(/Timed mock exam/)).not.toBeInTheDocument();
  });

  test("expired short answers pass the production capture guard once the cloud draft is ready", () => {
    window.localStorage.setItem(
      buildA1MockExamStorageKey("A1-12.3"),
      JSON.stringify({ endsAt: Date.now() - 1000 }),
    );
    const handleSubmit = jest.fn((event) => event.preventDefault());

    render(
      <MemoryRouter initialEntries={["/workbook?workbookTab=submit&timedAutoSubmit=1"]}>
        <A1TimedMockExam assignment={{ assignmentKey: "A1-12.3" }}>
          <div data-a1-built-in-submission>
            <div data-cloud-draft-persistence="react-owned" data-draft-submit-ready="true" data-draft-loaded="true" data-draft-conflict="false">
              <form onSubmit={handleSubmit}><textarea defaultValue="1 a" /><button type="submit" data-a1-final-submit-button>Submit</button></form>
            </div>
          </div>
        </A1TimedMockExam>
      </MemoryRouter>,
    );

    const cleanup = installA1SubmissionConsistencyRuntime();
    try {
      act(() => jest.advanceTimersByTime(200));
      expect(handleSubmit).toHaveBeenCalledTimes(1);
    } finally {
      cleanup();
    }
    // The local countdown is cleared at expiry; Firestore tracks the closed attempt.
    expect(window.localStorage.getItem(buildA1MockExamStorageKey("A1-12.3"))).toBeNull();
  });

  test("waits for the cloud draft check before auto-submitting", () => {
    window.localStorage.setItem(
      buildA1MockExamStorageKey("A1-12.3"),
      JSON.stringify({ endsAt: Date.now() - 1000 }),
    );
    const handleSubmit = jest.fn((event) => event.preventDefault());

    render(
      <MemoryRouter initialEntries={["/workbook?workbookTab=submit&timedAutoSubmit=1"]}>
        <A1TimedMockExam assignment={{ assignmentKey: "A1-12.3" }}>
          <div data-a1-built-in-submission>
            <div data-cloud-draft-persistence="react-owned" data-draft-submit-ready="false" data-draft-loaded="false" data-draft-conflict="false">
              <form onSubmit={handleSubmit}><button type="submit" disabled>Submit</button></form>
            </div>
          </div>
        </A1TimedMockExam>
      </MemoryRouter>,
    );

    act(() => jest.advanceTimersByTime(200));
    expect(handleSubmit).not.toHaveBeenCalled();

    const draft = document.querySelector('[data-cloud-draft-persistence="react-owned"]');
    draft.setAttribute("data-draft-submit-ready", "true");
    draft.setAttribute("data-draft-loaded", "true");
    // The manual checklist still disables the button after hydration.
    expect(draft.querySelector('button[type="submit"]')).toBeDisabled();
    act(() => jest.advanceTimersByTime(200));
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  test("shows a retry error until final submission is explicitly verified", () => {
    const storageKey = buildA1MockExamStorageKey("A1-12.3");
    window.localStorage.setItem(storageKey, JSON.stringify({ endsAt: Date.now() - 1000 }));

    const SubmissionResultControls = () => {
      const timedExam = useA1TimedMockExam();
      return (
        <>
          <button type="button" onClick={() => timedExam.onSubmissionError("Time is up, but automatic submission could not finish.")}>Fail submission</button>
          <button type="button" onClick={timedExam.onSubmissionVerified}>Verify submission</button>
        </>
      );
    };

    render(
      <MemoryRouter initialEntries={["/workbook?workbookTab=submit&timedAutoSubmit=1"]}>
        <A1TimedMockExam assignment={{ assignmentKey: "A1-12.3" }}>
          <TimedAssignmentPanel />
          <SubmissionResultControls />
        </A1TimedMockExam>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Fail submission" }));
    expect(screen.getByRole("status")).toHaveTextContent("Time is up");

    fireEvent.click(screen.getByRole("button", { name: "Verify submission" }));
    expect(screen.getByText(/Timed attempt submitted/)).toBeInTheDocument();
  });
});
