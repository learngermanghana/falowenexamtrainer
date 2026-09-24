import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import { Link, MemoryRouter, Navigate, useLocation } from "react-router-dom";
import LearningSessionBoundary from "./LearningSessionBoundary";
import { readLearningSession, saveLearningSession } from "../services/learningSession";

let mockAuth;
jest.mock("../context/AuthContext", () => ({ useAuth: () => mockAuth }));

const lesson = "/campus/course/lesson/B1/13?view=workbook&assignmentId=B1-4.13&radio=done#schreiben";

function Page() {
  const location = useLocation();
  if (mockAuth.loading) return <p>Restoring sign-in</p>;
  if (!mockAuth.user) return <p>Sign in</p>;
  // The real campus entry redirect must not race recovery.
  if (location.pathname === "/campus") return <Navigate to="/campus/course" replace />;
  return <>
    <output data-testid="route">{location.pathname}{location.search}{location.hash}</output>
    <Link to="/">Home</Link>
    <Link to="/campus">Campus</Link>
    <Link to="/campus/results">Results</Link>
  </>;
}

function Harness({ entry = "/" }) {
  return <React.StrictMode><MemoryRouter initialEntries={[entry]}>
    <LearningSessionBoundary><Page /></LearningSessionBoundary>
  </MemoryRouter></React.StrictMode>;
}

beforeEach(() => {
  mockAuth = { user: { uid: "student-a" }, loading: false };
  sessionStorage.clear();
  localStorage.clear();
  Object.defineProperty(navigator, "standalone", { configurable: true, value: true });
});

afterEach(() => {
  delete navigator.standalone;
  delete performance.getEntriesByType;
  delete document.visibilityState;
  jest.restoreAllMocks();
});

it.each(["/", "/campus"])("resumes the full URL after an installed app restarts at %s", (entry) => {
  saveLearningSession("student-a", lesson);
  sessionStorage.clear();
  render(<Harness entry={entry} />);
  expect(screen.getByTestId("route")).toHaveTextContent(lesson);
  expect(readLearningSession("student-a")?.href).toBe(lesson);
});

it("waits for authentication before restoring or overwriting the saved page", () => {
  saveLearningSession("student-a", lesson);
  mockAuth = { user: null, loading: true };
  const view = render(<Harness />);
  expect(screen.getByText("Restoring sign-in")).toBeInTheDocument();
  expect(readLearningSession("student-a")?.href).toBe(lesson);
  mockAuth = { user: { uid: "student-a" }, loading: false };
  view.rerender(<Harness />);
  expect(screen.getByTestId("route")).toHaveTextContent(lesson);
});

it("keeps an explicit new lesson link and its query/hash", () => {
  saveLearningSession("student-a", lesson);
  const direct = "/campus/course/lesson/C2/2?view=grammar#vocabulary";
  render(<Harness entry={direct} />);
  expect(screen.getByTestId("route")).toHaveTextContent(direct);
  expect(readLearningSession("student-a")?.href).toBe(direct);
});

it("preserves ordinary Home, Campus, and Results navigation after recovery", () => {
  saveLearningSession("student-a", lesson);
  const view = render(<Harness />);
  fireEvent.click(screen.getByText("Home"));
  expect(screen.getByTestId("route").textContent).toBe("/");
  expect(readLearningSession("student-a")?.href).toBe("/");
  fireEvent.click(screen.getByText("Campus"));
  expect(screen.getByTestId("route").textContent).toBe("/campus/course");
  fireEvent.click(screen.getByText("Results"));
  mockAuth = { ...mockAuth, user: { uid: "student-a" } };
  view.rerender(<Harness />);
  expect(screen.getByTestId("route").textContent).toBe("/campus/results");
});

it("keeps a normal browser's fresh home visit separate from resume", () => {
  Object.defineProperty(navigator, "standalone", { configurable: true, value: false });
  saveLearningSession("student-a", lesson);
  render(<Harness />);
  expect(screen.getByTestId("route").textContent).toBe("/");
});

it("can recover this tab after a browser reload at the launch URL", () => {
  Object.defineProperty(navigator, "standalone", { configurable: true, value: false });
  Object.defineProperty(performance, "getEntriesByType", {
    configurable: true, value: jest.fn(() => [{ type: "reload" }]),
  });
  saveLearningSession("student-a", lesson);
  render(<Harness />);
  expect(screen.getByTestId("route")).toHaveTextContent(lesson);
});

it("checkpoints the current page when hidden or unloaded without navigating", () => {
  render(<Harness entry={lesson} />);
  const clock = jest.spyOn(Date, "now").mockReturnValue(Date.now() + 60_000);
  Object.defineProperty(document, "visibilityState", { configurable: true, value: "hidden" });
  act(() => document.dispatchEvent(new Event("visibilitychange")));
  expect(readLearningSession("student-a")?.savedAt).toBe(Date.now());
  clock.mockReturnValue(Date.now() + 60_000);
  act(() => window.dispatchEvent(new Event("pagehide")));
  expect(readLearningSession("student-a")?.savedAt).toBe(Date.now());
  expect(screen.getByTestId("route")).toHaveTextContent(lesson);
});

it("does not restore another account's page, and clears saved pages on sign-out", () => {
  saveLearningSession("student-b", lesson);
  const view = render(<Harness />);
  expect(screen.getByTestId("route").textContent).toBe("/");
  mockAuth = { user: null, loading: false };
  view.rerender(<Harness />);
  expect(screen.getByText("Sign in")).toBeInTheDocument();
  expect(readLearningSession("student-a")).toBeNull();
  expect(readLearningSession("student-b")?.href).toBe(lesson);
});
