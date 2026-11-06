import React from "react";
import { act, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const ASSIGNMENT_LABEL = "A2 • Day 21: Ein Wochenende planen 8.21 • Chapter 8.21";

jest.mock("../context/AuthContext", () => {
  const value = {
    user: { uid: "u1", email: "student@example.com" },
    studentProfile: {
      className: "A2 Demo",
      level: "A2",
      studentCode: "ST-1",
      assignmentTitle: "Day 0 · Orientation",
      assignmentTitles: ["Day 0 · Orientation", "Day 21 · Ein Wochenende planen 8.21"],
      assignments: ["Day 0 · Orientation", "Day 21 · Ein Wochenende planen 8.21"],
      name: "Ada Student",
    },
  };
  return { useAuth: () => value };
});

jest.mock("../context/ToastContext", () => ({
  useToast: () => ({ showToast: jest.fn() }),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { resolvedLanguage: "en", language: "en" },
  }),
}));

jest.mock("../data/courseSchedule", () => ({
  courseSchedules: {
    A2: [
      { day: 0, topic: "Orientation", assignment: false, chapter: "0" },
      { day: 21, topic: "Ein Wochenende planen 8.21", assignment: true, chapter: "8.21", assignmentId: "A2-8.21" },
    ],
  },
}));

jest.mock("../data/germanAssignmentCatalog", () => ({
  getCurriculumEntriesForLevel: jest.fn(() => [
    { assignmentDay: 21, topic: "Ein Wochenende planen 8.21", assignment: true, chapter: "8.21", assignment_id: "A2-8.21" },
  ]),
}));

jest.mock("../utils/assignmentIdentity", () => ({
  resolveAssignmentCanonicalKey: jest.fn(({ assignmentId, assignmentTitle }) => assignmentId || assignmentTitle || ""),
}));

jest.mock("../utils/assignmentProgress", () => ({
  mergeAssignmentProgress: jest.fn(() => []),
}));

jest.mock("../services/answerKeyRegistryService", () => ({
  fetchAnswerKeyRegistry: jest.fn(() => Promise.resolve(new Map())),
  resolveAnswerKeySource: jest.fn(() => null),
}));

jest.mock("../services/interactionFeedback", () => ({
  triggerInteractionFeedback: jest.fn(),
}));

jest.mock("./ExamReadinessBadge", () => () => <div>badge</div>);

jest.mock("../firebase", () => ({
  db: {},
  functions: {},
  httpsCallable: jest.fn(() => jest.fn(() => Promise.resolve({ data: { attempt: 2 } }))),
  serverTimestamp: jest.fn(() => ({ seconds: 1 })),
  collection: jest.fn((_db, name) => ({ name })),
  query: jest.fn((ref, ...constraints) => ({ ...ref, constraints })),
  where: jest.fn((field, _op, value) => ({ field, value })),
  orderBy: jest.fn(() => ({})),
  limit: jest.fn(() => ({})),
  doc: jest.fn(() => ({})),
  getDoc: jest.fn(() => Promise.resolve({ exists: () => false })),
  getDocs: jest.fn(() => Promise.resolve({ docs: [], empty: true })),
  addDoc: jest.fn(() => Promise.resolve({ id: "id1" })),
  writeBatch: jest.fn(() => ({
    set: jest.fn(),
    commit: jest.fn(() => Promise.resolve()),
  })),
  setDoc: jest.fn(() => Promise.resolve()),
}));

import { addDoc, getDocs, getDoc, writeBatch, httpsCallable } from "../firebase";
import AssignmentSubmissionPage, { __TESTING__ } from "./AssignmentSubmissionPage";

const renderPage = (initialEntries = ["/"]) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <AssignmentSubmissionPage />
    </MemoryRouter>
  );


const original = "TEIL 2\nAm Samstag habe ich keine Zeit.\n\nTEIL 3\n1. A 2. B 3. C\n\nTEIL 4\n1. A 2. A 3. B";
const corrected = "TEIL 2\nLiebe Anna, am Samstag möchte ich mit dir einen Ausflug machen. Wir können um zehn Uhr mit dem Zug fahren und am See spazieren gehen. Bring bitte etwas zu essen mit. Am Sonntag besuchen wir zusammen meine Schwester. Schreib mir bitte, ob du Zeit hast. Viele Grüße, Ada\n\nTEIL 3\n1. B 2. C 3. A\n\nTEIL 4\n1. C 2. B 3. A";
let rows;
const entry = (id, data) => ({ id, data: () => data });
const failed = () => entry("first", {
  studentId: "u1", level: "A2", assignmentTitle: ASSIGNMENT_LABEL,
  assignmentKey: "A2-8.21", canonicalAssignmentKey: "A2-8.21", assignmentId: "A2-8.21",
  chapterKey: "chapter-8.21", status: "submitted", attempt: 1,
  submissionText: original, score: 0, createdAt: new Date("2026-01-01"),
});
const lock = () => entry("lock", {
  studentId: "u1", level: "A2", assignmentTitle: ASSIGNMENT_LABEL, chapterKey: "chapter-8.21",
});
const open = () => renderPage(["/campus/submit?level=A2&assignmentKey=A2-8.21"]);
beforeEach(() => {
  jest.clearAllMocks();
  rows = { submissions: [], submissionLocks: [], submissionDrafts: [] };
  getDocs.mockImplementation(async (ref) => {
    const selected = ref.constraints?.find(item => item.field === "canonicalAssignmentKey");
    const docs = selected && rows.selectedAttempts
      ? rows.selectedAttempts.filter(item => item.data().canonicalAssignmentKey === selected.value)
      : rows[ref.name] || [];
    return { docs, empty: !docs.length };
  });
});
test("A2 Day 21 saves the first confirmed submission atomically with its lock", async () => {
  open();
  const editor = await screen.findByRole("textbox", { name: /Your (text|answers)/i });
  await waitFor(() => expect(editor).not.toBeDisabled());
  fireEvent.change(editor, { target: { value: corrected } });
  fireEvent.click(screen.getByRole("checkbox", { name: "I checked that this is the correct assignment." }));
  fireEvent.click(screen.getByRole("button", { name: /^Submit assignment$/i }));
  await waitFor(() => expect(writeBatch).toHaveBeenCalled());
  const batch = writeBatch.mock.results[0].value;
  expect(batch.set).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ canonicalAssignmentKey: "A2-8.21", submissionText: corrected, attempt: 1 }));
  expect(batch.set).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ chapterKey: "chapter-8.21" }), { merge: true });
  expect(batch.commit).toHaveBeenCalledTimes(1);
});
test("returning to the open workbook refreshes a zero mark and permits corrected resubmission", async () => {
  rows.submissionLocks = [lock()];
  rows.submissions = [entry("first", { ...failed().data(), score: null })];
  open();
  await screen.findByText("Awaiting review");
  await act(async () => { await new Promise(resolve => setTimeout(resolve, 0)); });
  rows.submissions = [failed()];
  getDocs.mockClear();
  fireEvent(window, new Event("focus"));
  await waitFor(() => expect(getDocs).toHaveBeenCalled());
  const editor = await screen.findByRole("textbox", { name: /Corrected (work|answers)/ });
  fireEvent.change(editor, { target: { value: corrected } });
  fireEvent.change(screen.getByRole("textbox", { name: /What did you improve/ }), { target: { value: "I completed the invitation and corrected the weekend plans and missing answers." } });
  fireEvent.click(screen.getByRole("button", { name: /Submit resubmission/i }));
  await waitFor(() => expect(httpsCallable).toHaveBeenCalledWith(expect.anything(), "submitAssignmentResubmission"));
  const callable = httpsCallable.mock.results[0].value;
  expect(callable).toHaveBeenCalledWith(expect.objectContaining({ assignmentKey: "A2-8.21", previousScore: 0, submissionText: corrected, attempt: 2 }));
  expect(await screen.findByText(/Resubmission sent successfully/)).toBeInTheDocument();
});
test("a teacher removing the submission lock is reflected when the student returns", async () => {
  rows.submissionLocks = [lock()]; rows.submissions = [failed()];
  open();
  await screen.findByRole("textbox", { name: /Corrected (work|answers)/ });
  await act(async () => { await new Promise(resolve => setTimeout(resolve, 0)); });
  rows.submissionLocks = [];
  getDocs.mockClear();
  fireEvent(window, new Event("focus"));
  await waitFor(() => expect(getDocs).toHaveBeenCalled());
  await waitFor(() => expect(screen.getByRole("textbox", { name: /Your (text|answers)/i })).not.toBeDisabled());
});

test("return events share a refresh and listeners stop when the page closes", async () => {
  const view = open();
  await screen.findByPlaceholderText("Type your answer here or paste it in.");
  await act(async () => { await new Promise(resolve => setTimeout(resolve, 0)); });
  getDocs.mockClear();
  fireEvent(window, new Event("focus"));
  fireEvent(document, new Event("visibilitychange"));
  await act(async () => { await new Promise(resolve => setTimeout(resolve, 0)); });
  expect(getDocs.mock.calls.filter(([ref]) => ref.name === "submissionLocks")).toHaveLength(1);
  view.unmount();
  getDocs.mockClear();
  fireEvent(window, new Event("focus"));
  fireEvent(document, new Event("visibilitychange"));
  expect(getDocs).not.toHaveBeenCalled();
});


test.each(["focus", "visibilitychange"])("%s retains and refreshes reviewed attempts outside the latest 25 submissions", async (eventName) => {
  rows.submissionLocks = [lock()];
  rows.submissions = Array.from({ length: 25 }, (_, index) => entry(`newer-${index}`, {
    studentId: "u1", level: "A2", canonicalAssignmentKey: "A2-10.28",
    assignmentKey: "A2-10.28", assignmentTitle: "Another assignment", status: "submitted",
    score: 90, createdAt: new Date("2026-02-01"),
  }));
  rows.selectedAttempts = [failed()];
  open();
  await screen.findByRole("textbox", { name: /Corrected (work|answers)/ });
  await act(async () => { await new Promise(resolve => setTimeout(resolve, 0)); });
  // A subsequent review must replace the cached score, not merely retain it.
  rows.selectedAttempts = [entry("first", { ...failed().data(), score: 35 })];
  getDocs.mockClear();
  fireEvent(eventName === "focus" ? window : document, new Event(eventName));
  await act(async () => { await new Promise(resolve => setTimeout(resolve, 0)); });
  expect(getDocs.mock.calls.some(([ref]) => ref.constraints?.some(item =>
    item.field === "canonicalAssignmentKey" && item.value === "A2-8.21"
  ))).toBe(true);
  const editor = screen.getByRole("textbox", { name: /Corrected (work|answers)/ });
  expect(screen.queryByText("Awaiting review")).not.toBeInTheDocument();
  fireEvent.change(editor, { target: { value: corrected } });
  fireEvent.change(screen.getByRole("textbox", { name: /What did you improve/ }), {
    target: { value: "I completed the invitation and corrected the weekend plans and missing answers." },
  });
  fireEvent.click(screen.getByRole("button", { name: /Submit resubmission/i }));
  await waitFor(() => expect(httpsCallable).toHaveBeenCalled());
  expect(httpsCallable.mock.results[0].value).toHaveBeenCalledWith(expect.objectContaining({
    assignmentKey: "A2-8.21", previousScore: 35, attempt: 2,
  }));
});

test("a slower assignment-specific refresh keeps the existing correction form until both windows finish", async () => {
  rows.submissionLocks = [lock()];
  rows.selectedAttempts = [failed()];
  open();
  await screen.findByRole("textbox", { name: /Corrected (work|answers)/ });
  await act(async () => { await new Promise(resolve => setTimeout(resolve, 0)); });
  const normalGetDocs = getDocs.getMockImplementation();
  let finishSelected;
  getDocs.mockImplementation(ref => {
    if (ref.constraints?.some(item => item.field === "canonicalAssignmentKey")) {
      return new Promise(resolve => { finishSelected = resolve; });
    }
    return normalGetDocs(ref);
  });
  fireEvent(window, new Event("focus"));
  await waitFor(() => expect(finishSelected).toEqual(expect.any(Function)));
  expect(screen.getByRole("textbox", { name: /Corrected (work|answers)/ })).toBeEnabled();
  expect(screen.queryByText("Awaiting review")).not.toBeInTheDocument();
  await act(async () => finishSelected({ docs: [failed()], empty: false }));
  expect(screen.getByRole("textbox", { name: /Corrected (work|answers)/ })).toBeEnabled();
});
