import React from "react";
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
    expect(getA1MockExamDurationSeconds("A1-14.1")).toBe(35 * 60);
  });

  test("starts a persistent 30-minute mock for Day 20", () => {
    render(
      <MemoryRouter initialEntries={["/workbook"]}>
        <Routes><Route path="/workbook" element={<A1TimedMockExam assignment={{ assignmentKey: "A1-12.3" }}><TimedAssignmentPanel /></A1TimedMockExam>} /></Routes>
      </MemoryRouter>,
    );

    const unlockButton = screen.getByRole("button", { name: "Agree & unlock 30-minute mock" });
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

  test("restores an expired auto-submit and submits even when the minimum-word button is disabled", () => {
    window.localStorage.setItem(
      buildA1MockExamStorageKey("A1-12.3"),
      JSON.stringify({ endsAt: Date.now() - 1000 }),
    );
    const handleSubmit = jest.fn((event) => event.preventDefault());

    render(
      <MemoryRouter initialEntries={["/workbook?workbookTab=submit&timedAutoSubmit=1"]}>
        <A1TimedMockExam assignment={{ assignmentKey: "A1-12.3" }}>
          <div data-a1-built-in-submission>
            <div data-cloud-draft-persistence="react-owned" data-draft-submit-ready="true">
              <form onSubmit={handleSubmit}><button type="submit" disabled>Submit</button></form>
            </div>
          </div>
        </A1TimedMockExam>
      </MemoryRouter>,
    );

    jest.advanceTimersByTime(200);
    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(window.localStorage.getItem(buildA1MockExamStorageKey("A1-12.3"))).not.toBeNull();
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
            <div data-cloud-draft-persistence="react-owned" data-draft-submit-ready="false">
              <form onSubmit={handleSubmit}><button type="submit" disabled>Submit</button></form>
            </div>
          </div>
        </A1TimedMockExam>
      </MemoryRouter>,
    );

    jest.advanceTimersByTime(200);
    expect(handleSubmit).not.toHaveBeenCalled();

    document.querySelector('[data-cloud-draft-persistence="react-owned"]')
      .setAttribute("data-draft-submit-ready", "true");
    jest.advanceTimersByTime(200);
    expect(handleSubmit).toHaveBeenCalledTimes(1);
  });

  test("only clears the persisted timed session after verified submission", () => {
    const storageKey = buildA1MockExamStorageKey("A1-12.3");
    window.localStorage.setItem(storageKey, JSON.stringify({ endsAt: Date.now() - 1000 }));

    const SubmissionResultControls = () => {
      const timedExam = useA1TimedMockExam();
      return (
        <>
          <button type="button" onClick={timedExam.onSubmissionError}>Fail submission</button>
          <button type="button" onClick={timedExam.onSubmissionVerified}>Verify submission</button>
        </>
      );
    };

    render(
      <MemoryRouter initialEntries={["/workbook?workbookTab=submit&timedAutoSubmit=1"]}>
        <A1TimedMockExam assignment={{ assignmentKey: "A1-12.3" }}>
          <SubmissionResultControls />
        </A1TimedMockExam>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", { name: "Fail submission" }));
    expect(window.localStorage.getItem(storageKey)).not.toBeNull();
    expect(screen.getByRole("status")).toHaveTextContent("automatic submission failed");

    fireEvent.click(screen.getByRole("button", { name: "Verify submission" }));
    expect(window.localStorage.getItem(storageKey)).toBeNull();
    expect(screen.getByRole("status")).toHaveTextContent("submitted automatically");
  });
});
