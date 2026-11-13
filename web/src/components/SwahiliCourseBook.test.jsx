import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import SwahiliCourseBook, { scoreListeningAnswers, scoreReadingAnswers, getMissingSwahiliDayOneWork } from "./SwahiliCourseBook";
import { SWAHILI_DAY_ONE } from "../data/swahili/dayOne";
import { setDoc, getDoc } from "../firebase";

let mockUser = null;
let mockStudentProfile = null;
jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ user: mockUser, studentProfile: mockStudentProfile }),
}));
jest.mock("../firebase", () => ({
  db: {},
  doc: jest.fn((...args) => args.join("/")),
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
    mockStudentProfile = null;
    jest.clearAllMocks();
  });

  it("offers only Day 1 and no invented later lessons", () => {
    render(<MemoryRouter><SwahiliCourseBook /></MemoryRouter>);
    expect(screen.getByText("Alfabeti, sauti na matamshi")).toBeTruthy();
    expect(screen.getByText("Somo 1 pekee")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Fungua Somo la 1" }).getAttribute("href")).toBe("/swahili/day-1");
    expect(screen.queryByText(/Somo la 2/)).toBeNull();
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
    expect(scoreListeningAnswers({0:"A",1:"E",2:"I",3:"O",4:"U"})).toBe(5);
    expect(scoreListeningAnswers({0:"U"})).toBe(0);
    expect(scoreReadingAnswers({mother:"mama",child:"mtoto",chair:"kiti",u:"kuku"})).toBe(4);
    expect(SWAHILI_DAY_ONE.listening).toHaveLength(5);
    renderLesson();
    openTab("Teil 4");
    expect(screen.getByText(/Sauti iliyorekodiwa bado haijapatikana/)).toBeTruthy();
    expect(document.querySelector("audio")).toBeNull();
    expect(screen.getByRole("button", { name: "Kagua majibu" }).disabled).toBe(true);
  });

  it("requires writing and reading, not unrecorded listening, before Submit", () => {
    expect(getMissingSwahiliDayOneWork({ writing: { vowels:"A E I O U", syllables:"ba be bi bo bu", words:"mama kiti kuku" }, readingAnswers: {mother:"mama",child:"mtoto",chair:"kiti",u:"kuku"} })).toEqual([]);
    expect(getMissingSwahiliDayOneWork({ writing: {}, readingAnswers: {} })).toEqual(expect.arrayContaining(["Teil 2 · Vokali", "Teil 3 · Kusoma"]));
    renderLesson();
    openTab("Submit");
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
    openTab("Submit");
    await waitFor(() => expect(getDoc).toHaveBeenCalledTimes(2));
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
      : { exists: () => true });
    renderLesson();
    openTab("Submit");
    expect(await screen.findByText("Repeat the B syllables.")).toBeTruthy();
    expect(screen.getAllByRole("tab")).toHaveLength(7);
  });

});
