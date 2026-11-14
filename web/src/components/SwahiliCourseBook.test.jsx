import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SwahiliCourseBook, { getMissingSwahiliDayOneWork } from "./SwahiliCourseBook";
import SwahiliDaySixWorkbook from "./SwahiliDaySixWorkbook";
import { SWAHILI_DAY_ONE } from "../data/swahili/dayOne";
import { setDoc, getDoc } from "../firebase";

let mockUser = null;
let mockStudentProfile = null;
jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ user: mockUser, studentProfile: mockStudentProfile }),
}));
jest.mock("../firebase", () => ({
  db: {},
  doc: jest.fn((_db, ...segments) => "/" + segments.join("/")),
  getDoc: jest.fn(async () => ({ exists: () => false })),
  getDocs: jest.fn(async () => ({ docs: [] })),
  query: jest.fn((...args) => args),
  collectionGroup: jest.fn((database, name) => name),
  limit: jest.fn((value) => value),
  setDoc: jest.fn(async () => ({})),
  serverTimestamp: jest.fn(() => "server-now"),
}));

const renderLesson = () => render(<MemoryRouter><SwahiliCourseBook day={1} /></MemoryRouter>);
const openTab = (label) => fireEvent.click(screen.getByRole("tab", { name: new RegExp("^" + label + " ·") }));

describe("Kiswahili Day 1 follows the native A2/B1 workbook", () => {
  beforeEach(() => {
    mockUser = null;
    mockStudentProfile = { program: "swahili" };
    jest.clearAllMocks();
    getDoc.mockImplementation(async () => ({ exists: () => false }));
  });

  it("lists only the published lessons and keeps personal progress out of the public preview", () => {
    mockUser = { uid: "swahili-student-1" };
    render(<MemoryRouter><SwahiliCourseBook preview /></MemoryRouter>);
    expect(screen.getByRole("link", { name: "Fungua Somo la 1" }).getAttribute("href")).toBe("/swahili/day-1");
    expect(screen.getByRole("link", { name: "Fungua Somo la 6" }).getAttribute("href")).toBe("/swahili/day-6");
    expect(screen.getByText(/Personal progress is available in Campus/)).toBeTruthy();
    expect(getDoc).not.toHaveBeenCalled();
    fireEvent.change(screen.getByRole("textbox", { name: "Search lessons" }), { target: { value: "Mgahawani" } });
    expect(screen.queryByRole("link", { name: "Fungua Somo la 1" })).toBeNull();
  });

  it("uses the learner's submissions and tutor decisions to show progress and resume", async () => {
    mockUser = { uid: "swahili-student-1" };
    getDoc.mockImplementation(async (path) => ({
      exists: () => path.endsWith("/day-1") || path.endsWith("/swahiliTeacherReviews/swahili-student-1"),
      data: () => ({ status: "reviewed" }),
    }));
    render(<MemoryRouter><SwahiliCourseBook basePath="/campus/course/swahili" /></MemoryRouter>);
    expect(await screen.findByText("1 of 2 required assignments submitted · 50% complete")).toBeTruthy();
    expect(screen.getByRole("progressbar").getAttribute("aria-valuenow")).toBe("50");
    expect(screen.getByText("1 reviewed")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Continue learning" }).getAttribute("href")).toBe("/campus/course/swahili/day-6");
  });

  it("opens Submit directly and can move back through workbook sections", () => {
    render(<MemoryRouter initialEntries={["/swahili/day-1?view=submit"]}><SwahiliCourseBook day={1} /></MemoryRouter>);
    expect(screen.getByRole("tabpanel", { name: "Review & Submit" })).toBeTruthy();
    fireEvent.click(within(screen.getByRole("navigation", { name: "Workbook navigation" })).getByRole("button", { name: /Teil 4/ }));
    expect(screen.getByRole("tabpanel", { name: "Teil 4" })).toBeTruthy();
  });

  it("reuses the same seven-step shared A2/B1 navigation, including Submit", () => {
    renderLesson();
    const tabs = screen.getAllByRole("tab").map((tab) => tab.textContent);
    expect(tabs).toHaveLength(7);
    expect(tabs[0]).toContain("Music");
    expect(tabs[1]).toContain("Grammar");
    expect(tabs[2]).toContain("Teil 1");
    expect(tabs[3]).toContain("Teil 2");
    expect(tabs[4]).toContain("Teil 3");
    expect(tabs[5]).toContain("Teil 4");
    expect(tabs[6]).toContain("Submit");
    expect(document.querySelector("[data-workbook-tab-navigation]")).toBeTruthy();
    openTab("Music");
    expect(screen.getByText(/Rekodi ya muziki bado haijapakiwa/)).toBeTruthy();
    expect(document.querySelector("audio")).toBeNull();
    openTab("Grammar");
    expect(screen.getByText(/Grammar · Sarufi na matamshi/)).toBeTruthy();
    expect(screen.getByText(/MA-ma/)).toBeTruthy();
  });

  it("makes Teil 2 writing and Teil 3 reading, like A2/B1", () => {
    renderLesson();
    openTab("Teil 2");
    expect(screen.getByRole("heading", { name: /Teil 2 · Kuandika/ })).toBeTruthy();
    fireEvent.change(screen.getByLabelText(/Vokali tano/), { target: { value: "A, E, I, O, U" } });
    openTab("Teil 3");
    expect(screen.getByRole("heading", { name: /Teil 3 · Kusoma/ })).toBeTruthy();
    expect(screen.getAllByRole("radio")).toHaveLength(12);
    openTab("Teil 2");
    expect(screen.getByLabelText(/Vokali tano/).value).toBe("A, E, I, O, U");
  });

  it("keeps teacher-led listening honest without claiming uploaded music/audio", () => {
    expect(SWAHILI_DAY_ONE.listening).toHaveLength(5);
    renderLesson();
    openTab("Teil 4");
    expect(screen.getByText(/Sauti iliyorekodiwa bado haijapatikana/)).toBeTruthy();
    expect(document.querySelector("audio")).toBeNull();
    expect(screen.queryByRole("button", { name: "Kagua majibu" })).toBeNull();
  });

  it("requires writing and reading, not unrecorded listening, before Submit", () => {
    expect(getMissingSwahiliDayOneWork({ writing: { vowels:"A E I O U", syllables:"ba be bi bo bu", words:"mama kiti kuku" }, readingAnswers: {mother:"mama",child:"mtoto",chair:"kiti",u:"kuku"} })).toEqual([]);
    expect(getMissingSwahiliDayOneWork({ writing: {}, readingAnswers: {} })).toEqual(expect.arrayContaining(["Teil 2 · Vokali", "Teil 3 · Kusoma"]));
    renderLesson();
    openTab("Review & Submit");
    expect(screen.getByText(/Ingia kwenye akaunti yako/)).toBeTruthy();
    expect(setDoc).not.toHaveBeenCalled();
  });

  it("persists a logged-in learner's actual submitted Day 1 work in the separate Swahili user record", async () => {
    mockUser = { uid: "swahili-student-1" };
    renderLesson();
    openTab("Teil 2");
    fireEvent.change(screen.getByLabelText(/Vokali tano/), { target: { value: "A E I O U" } });
    fireEvent.change(screen.getByLabelText(/Silabi za B/), { target: { value: "ba be bi bo bu" } });
    fireEvent.change(screen.getByLabelText(/Maneno matatu/), { target: { value: "mama kiti kuku" } });
    openTab("Teil 3");
    SWAHILI_DAY_ONE.reading.forEach((question, index) => {
      const questionGroup = document.querySelectorAll("fieldset")[index];
      fireEvent.click(within(questionGroup).getByLabelText(question.answer));
    });
    openTab("Review & Submit");
    await waitFor(() => expect(getDoc).toHaveBeenCalledTimes(2));
    expect(screen.getByText("mama kiti kuku")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Save draft" }));
    expect(setDoc).not.toHaveBeenCalled();
    const button = screen.getByRole("button", { name: "Wasilisha kazi" });
    expect(button.disabled).toBe(false);
    fireEvent.click(button);
    await waitFor(() => expect(setDoc).toHaveBeenCalledTimes(1));
    expect(setDoc.mock.calls[0][0]).toBe("/users/swahili-student-1/swahiliLessons/day-1");
    expect(setDoc.mock.calls[0][1]).toEqual(expect.objectContaining({
      program: "swahili",
      lessonId: "swahili-day-1",
      status: "submitted",
      writing: { vowels:"A E I O U", syllables:"ba be bi bo bu", words:"mama kiti kuku" },
    }));
    await waitFor(() => expect(screen.getByText(/Kazi imehifadhiwa kwenye akaunti yako/)).toBeTruthy());
  });
  it("keeps teacher materials separate from the seven student workbook tabs", () => {
    mockUser = { uid: "teacher-1" };
    mockStudentProfile = { role: "tutor" };
    renderLesson();
    expect(screen.getAllByRole("tab")).toHaveLength(7);
    expect(screen.getByRole("link", { name: /Teacher slides & marking/ }).getAttribute("href")).toBe("/swahili/day-1?teacher=1");
  });

  it("displays reviewed feedback inside Submit only for the student who owns it", async () => {
    mockUser = { uid: "swahili-student-1" };
    getDoc.mockImplementation(async (path) => path === "/swahiliTeacherReviews/swahili-student-1"
      ? { exists: () => true, data: () => ({ status: "needs_revision", feedback: "Repeat the B syllables." }) }
      : { exists: () => true, data: () => ({}) });
    renderLesson();
    openTab("Review & Submit");
    expect(await screen.findByText("Repeat the B syllables.")).toBeTruthy();
    expect(screen.getAllByRole("tab")).toHaveLength(7);
  });


  it("hides older feedback when the workbook has been resubmitted", async () => {
    mockUser = { uid: "swahili-student-1" };
    getDoc.mockImplementation(async (path) => path.includes("swahiliTeacherReviews")
      ? { exists: () => true, data: () => ({ feedback: "Old feedback", reviewedAt: { toMillis: () => 10 } }) }
      : { exists: () => true, data: () => ({ submittedAt: { toMillis: () => 20 } }) });
    renderLesson();
    openTab("Review & Submit");
    await screen.findByRole("button", { name: "Wasilisha tena" });
    expect(screen.queryByText("Old feedback")).toBeNull();
  });

  it("keeps public previews read-only for a signed-in German account", () => {
    mockUser = { uid: "german-student" };
    mockStudentProfile = { program: "german" };
    render(<MemoryRouter initialEntries={["/swahili/day-1?view=submit"]}>
      <SwahiliCourseBook day={1} preview />
    </MemoryRouter>);
    expect(screen.getByText(/This public preview cannot submit work/)).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Wasilisha kazi" })).toBeNull();
    expect(getDoc).not.toHaveBeenCalled();
    expect(setDoc).not.toHaveBeenCalled();
  });

  it("keeps restaurant submissions read-only for a German account or public preview", () => {
    mockUser = { uid: "german-student" };
    mockStudentProfile = { program: "german" };
    render(<MemoryRouter initialEntries={["/swahili/day-6?view=submit&radio=done"]}>
      <SwahiliDaySixWorkbook preview />
    </MemoryRouter>);
    expect(screen.getByText(/This preview cannot submit work/)).toBeTruthy();
    expect(screen.queryByRole("button", { name: "Wasilisha kazi" })).toBeNull();
    expect(getDoc).not.toHaveBeenCalled();
    expect(setDoc).not.toHaveBeenCalled();
  });

  it("shows only current, student-owned tutor feedback and prioritizes revisions", async () => {
    mockUser = { uid: "swahili-student-1" };
    getDoc.mockImplementation(async (path) => {
      const record = ({
        "/users/swahili-student-1/swahiliLessons/day-1": {
          submittedAt: { toMillis: () => 100 },
        },
        "/swahiliTeacherReviews/swahili-student-1": {
          status: "needs_revision", feedback: "Please review vowel pronunciation.",
          reviewedAt: { toMillis: () => 150 },
        },
        "/users/swahili-student-1/swahiliLessons/day-6": {
          submittedAt: { toMillis: () => 300 },
        },
        "/swahiliTeacherReviews/swahili-student-1_day-6": {
          status: "reviewed", feedback: "Outdated restaurant feedback.",
          reviewedAt: { toMillis: () => 200 },
        },
      })[path];
      return { exists: () => Boolean(record), data: () => record };
    });
    render(<MemoryRouter><SwahiliCourseBook basePath="/campus/course/swahili" /></MemoryRouter>);
    expect(await screen.findByText("Please review vowel pronunciation.")).toBeTruthy();
    expect(screen.queryByText("Outdated restaurant feedback.")).toBeNull();
    expect(screen.getByRole("link", { name: "Continue learning" }).getAttribute("href"))
      .toBe("/campus/course/swahili/day-1");
    const feedback = screen.getByRole("link", { name: "View feedback and resubmit" });
    expect(feedback.getAttribute("href")).toBe("/campus/course/swahili/day-1?view=submit");
    fireEvent.click(screen.getByRole("button", { name: "Needs revision" }));
    expect(screen.getByText("1 shown from 3")).toBeTruthy();
    expect(screen.queryByRole("link", { name: "Fungua Somo la 6" })).toBeNull();
    const paths = getDoc.mock.calls.map((call) => call[0]);
    expect(paths).toEqual(expect.arrayContaining([
      "/users/swahili-student-1/swahiliLessons/day-1",
      "/users/swahili-student-1/swahiliLessons/day-6",
    ]));
    expect(paths.every((path) => !path.includes("german") && !path.includes("results"))).toBe(true);
  });

});
