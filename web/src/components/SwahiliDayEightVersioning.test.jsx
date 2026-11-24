import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SwahiliA1PracticeWorkbook from "./SwahiliA1PracticeWorkbook";
import { SWAHILI_A1_PRACTICE_UNITS } from "../data/swahili/a1PracticeUnits";
import { getDoc, setDoc } from "../firebase";

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: { uid: "day8-learner", email: "student@example.test", displayName: "Day 8 Student" },
    studentProfile: { program: "swahili" },
  }),
}));

jest.mock("../firebase", () => ({
  db: {},
  doc: jest.fn((_db, ...segments) => "/" + segments.join("/")),
  getDoc: jest.fn(),
  setDoc: jest.fn(async () => undefined),
  serverTimestamp: jest.fn(() => "server-now"),
}));

const lesson = SWAHILI_A1_PRACTICE_UNITS[8];
const oldKey = "falowen:swahili-review:day8-learner:day-8";
const currentKey = oldKey + ":reading-v2";
const renderDay8 = tab => render(
  <MemoryRouter initialEntries={[`/campus/course/swahili/day-8?view=${tab}`]}>
    <SwahiliA1PracticeWorkbook lesson={lesson} />
  </MemoryRouter>
);
const openTab = name => fireEvent.click(screen.getByRole("tab", { name: new RegExp("^" + name + " ·") }));
const noWork = () => getDoc.mockImplementation(async () => ({ data: () => undefined }));

beforeEach(() => {
  jest.clearAllMocks();
  window.localStorage.clear();
  noWork();
});

test("old Day 8 draft and submission cannot populate new Lesen, Schreiben, Hören or tutor feedback", async () => {
  const oldDraft = {
    writing: "Darasa letu ni namba ishirini na moja. Msimbo ni 0725.",
    reading: { "read-1": "21", "read-2": "0725", "read-3": "0" },
    listeningAnswers: {},
  };
  localStorage.setItem(oldKey, JSON.stringify(oldDraft));
  getDoc.mockImplementation(async path => ({
    data: () => path.includes("/swahiliLessons/")
      ? {
        status: "submitted",
        lessonId: "swahili-day-8",
        writing: { response: "My old classroom number is 21 and the contact code is 0725." },
        readingAnswers: { "read-1": "21", "read-2": "0725", "read-3": "0" },
        submittedAt: { seconds: 1, nanoseconds: 0 },
      }
      : { feedback: "Old tutor feedback about the contact code", submissionVersion: "1:0" },
  }));
  renderDay8("submit");
  expect(await screen.findByText(/previous Day 8 submission used the earlier classroom-number/i)).toBeTruthy();
  expect(screen.queryByText(/My old classroom number/)).toBeNull();
  expect(screen.queryByText(/Darasa letu ni namba ishirini na moja/)).toBeNull();
  expect(screen.queryByText(/Old tutor feedback/)).toBeNull();
  expect(screen.getAllByText("Unanswered").length).toBeGreaterThan(0);
  expect(localStorage.getItem(oldKey)).toBe(JSON.stringify(oldDraft));
  expect(localStorage.getItem(currentKey)).toBeNull();
  expect(getDoc).toHaveBeenCalledWith("/users/day8-learner/swahiliLessons/day-8");
  expect(getDoc).not.toHaveBeenCalledWith("/swahiliTeacherReviews/day8-learner_day-8");
});

test("an identifiable replacement Day 8 draft is migrated without deleting the previous key", async () => {
  const draft = {
    writing: "Nina miaka ishirini na miwili.",
    reading: { "read-4": "Miaka minne" },
    listeningAnswers: {},
  };
  localStorage.setItem(oldKey, JSON.stringify(draft));
  renderDay8("submit");
  expect(await screen.findByText("Nina miaka ishirini na miwili.")).toBeTruthy();
  expect(screen.getByText("Miaka minne")).toBeTruthy();
  expect(JSON.parse(localStorage.getItem(currentKey))).toEqual(draft);
  expect(JSON.parse(localStorage.getItem(oldKey))).toEqual(draft);
});

test("a submitted Day 8 family assignment with explicit version restores its answers and current feedback", async () => {
  getDoc.mockImplementation(async path => ({
    data: () => path.includes("/swahiliLessons/") ? {
      status: "submitted",
      assignmentVersion: 2,
      readingVersion: 2,
      writing: { response: "Familia yangu ina watu watano." },
      readingAnswers: { "read-1": "Miaka ishirini na miwili" },
      listeningAnswers: { "listen-age-b": "Miaka ishirini na tano" },
      submittedAt: { seconds: 10, nanoseconds: 0 },
    } : {
      submissionVersion: "10:0",
      feedback: "Current family-age tutor feedback",
    },
  }));
  renderDay8("submit");
  expect(await screen.findByText("Current family-age tutor feedback")).toBeTruthy();
  expect(screen.getByText("Familia yangu ina watu watano.")).toBeTruthy();
  expect(screen.getByText("Miaka ishirini na miwili")).toBeTruthy();
  expect(screen.getByText("Miaka ishirini na tano")).toBeTruthy();
  expect(screen.queryByText(/earlier classroom-number/i)).toBeNull();
});

test("new Day 8 submissions carry an explicit assignment version and use isolated drafts", async () => {
  renderDay8("schreiben");
  fireEvent.change(screen.getByRole("textbox", { name: /Your writing/ }), {
    target: { value: "Jina langu ni Amina. Nina miaka ishirini na miwili." },
  });
  for (const tab of ["Teil 3", "Teil 4"]) {
    openTab(tab);
    for (const group of screen.getAllByRole("group")) {
      fireEvent.click(within(group).getAllByRole("radio")[0]);
    }
  }
  openTab("Review & Submit");
  fireEvent.click(screen.getByRole("button", { name: "Save draft" }));
  expect(localStorage.getItem(oldKey)).toBeNull();
  expect(JSON.parse(localStorage.getItem(currentKey)).writing).toContain("Nina miaka");
  screen.getAllByRole("checkbox").forEach(box => fireEvent.click(box));
  fireEvent.click(screen.getByRole("button", { name: /Submit to tutor/ }));
  await waitFor(() => expect(setDoc).toHaveBeenCalledWith(
    "/users/day8-learner/swahiliLessons/day-8",
    expect.objectContaining({
      assignmentVersion: 2,
      readingVersion: 2,
      status: "submitted",
      writing: { response: "Jina langu ni Amina. Nina miaka ishirini na miwili." },
      readingAnswers: expect.objectContaining({ "read-1": lesson.reading.questions[0].choices[0] }),
      listeningAnswers: expect.objectContaining({ "listen-age-b": lesson.listening.questions[0].choices[0] }),
    })
  ));
});
