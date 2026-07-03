import React from "react";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";

const mockGetDocs = jest.fn();
const mockFetchResults = jest.fn();
const mockGetDoc = jest.fn();
const mockSetDoc = jest.fn();
const mockNavigate = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ search: "" }),
}));

jest.mock("../firebase", () => ({
  db: {},
  collection: jest.fn(() => ({})),
  query: jest.fn(() => ({})),
  where: jest.fn(() => ({})),
  orderBy: jest.fn(() => ({})),
  limit: jest.fn(() => ({})),
  getDocs: (...args) => mockGetDocs(...args),
  doc: jest.fn(() => ({})),
  getDoc: (...args) => mockGetDoc(...args),
  setDoc: (...args) => mockSetDoc(...args),
  serverTimestamp: jest.fn(() => "server-timestamp"),
}));

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    loading: false,
    studentProfile: {
      id: "student-1",
      email: "comfort@example.com",
      studentCode: "ComfortArmah295",
    },
  }),
}));

jest.mock("../services/resultsService", () => ({
  fetchResults: (...args) => mockFetchResults(...args),
}));

jest.mock("../data/courseSchedules", () => ({
  courseSchedulesByName: {},
}));

jest.mock("../data/courseSchedule", () => ({
  courseSchedules: {
    A1: [
      {
        day: 1,
        topic: "Greetings",
        chapter: "0.1",
        assignment: true,
        lesen_hören: { chapter: "0.1", assignment: true },
      },
      {
        day: 2,
        topic: "German Alphabet",
        chapter: "0.2",
        assignment: true,
        lesen_hören: { chapter: "0.2", assignment: true },
      },
      {
        day: 2,
        topic: "Personal Pronouns",
        chapter: "1.1",
        assignment: true,
        lesen_hören: { chapter: "1.1", assignment: true },
      },
      {
        day: 4,
        topic: "Numbers",
        chapter: "2",
        assignment: true,
        lesen_hören: { chapter: "2", assignment: true },
      },
      {
        day: 5,
        topic: "Introducing Yourself and Articles",
        chapter: "1.2",
        assignment: false,
        schreiben_sprechen: { chapter: "1.2", assignment: false },
      },
      {
        day: 6,
        topic: "Family and Hobbies",
        chapter: "2.3",
        assignment: false,
        schreiben_sprechen: { chapter: "2.3", assignment: false },
      },
      {
        day: 13,
        topic: "Revision",
        chapter: "3.5",
        assignment: false,
        schreiben_sprechen: { chapter: "3.5", assignment: false },
      },
      {
        day: 14,
        topic: "Modal Verbs",
        chapter: "3.6",
        assignment: false,
        schreiben_sprechen: { chapter: "3.6", assignment: false },
      },
      {
        day: 15,
        topic: "Introduction to Speaking Exams",
        chapter: "4.7",
        assignment: false,
        schreiben_sprechen: { chapter: "4.7", assignment: false },
      },
      {
        day: 7,
        topic: "Asking Prices",
        chapter: "3",
        assignment: true,
        lesen_hören: { chapter: "3", assignment: true },
      },
      {
        day: 8,
        topic: "Countries and Languages",
        chapter: "4",
        assignment: true,
        lesen_hören: { chapter: "4", assignment: true },
      },
      {
        day: 9,
        topic: "German Cases",
        chapter: "5",
        assignment: true,
        lesen_hören: { chapter: "5", assignment: true },
      },
      {
        day: 11,
        topic: "Understanding Time",
        chapter: "7",
        assignment: true,
        lesen_hören: { chapter: "7", assignment: true },
      },
    ],
    A2: [
      {
        day: 1,
        topic: "A2 Intro",
        chapter: "1",
        assignment: true,
        lesen_hören: { chapter: "1", assignment: true },
      },
    ],
    B1: [
      {
        day: 1,
        topic: "B1 Intro",
        chapter: "1",
        assignment: true,
        lesen_hören: { chapter: "1", assignment: true },
      },
      {
        day: 9,
        topic: "B1 Later Unit",
        chapter: "11",
        assignment: true,
        lesen_hören: { chapter: "11", assignment: true },
      },
    ],
  },
}));


const mockCanonicalA1Entries = [
  { id: "A1-Tutorial", level: "A1", day: 0, chapter: "Tutorial", topic: "Tutorial", assignmentId: "A1-Tutorial", kind: "lesen_hören", assignment: false, submissionRequired: false, progressionEligible: false, workbookRoute: "/campus/course/a1-day-0-orientation-and-knowledge-test-workbook", schreiben_sprechen: { chapter: "Tutorial", assignment: false, workbook_link: "/campus/course/a1-day-0-orientation-and-knowledge-test-workbook" } },
  { id: "A1-0.1", level: "A1", day: 1, chapter: "0.1", topic: "Greetings and Asking About Well-being", assignmentId: "A1-0.1", kind: "lesen_hören", assignment: true, submissionRequired: true, progressionEligible: true, lesen_hören: [{ chapter: "0.1", assignment: true, assignmentId: "A1-0.1" }] },
  { id: "A1-0.2", level: "A1", day: 2, chapter: "0.2", topic: "German Alphabet", assignmentId: "A1-0.2", kind: "lesen_hören", assignment: true, submissionRequired: true, progressionEligible: true, lesen_hören: [{ chapter: "0.2", assignment: true, assignmentId: "A1-0.2" }] },
  { id: "A1-1.1", level: "A1", day: 2, chapter: "1.1", topic: "Personal Pronouns and Verb Conjugation", assignmentId: "A1-1.1", kind: "lesen_hören", assignment: true, submissionRequired: true, progressionEligible: true, lesen_hören: [{ chapter: "1.1", assignment: true, assignmentId: "A1-1.1" }] },
  { id: "A1-1.1-practice", level: "A1", day: 3, chapter: "1.1", topic: "Personal Information, Articles, Adjectives and W-Questions", assignmentId: "A1-1.1-practice", kind: "schreiben_sprechen", assignment: false, submissionRequired: false, progressionEligible: false, schreiben_sprechen: [{ chapter: "1.1", assignment: false, assignmentId: "A1-1.1-practice" }] },
  { id: "A1-1.2", level: "A1", day: 3, chapter: "1.2", topic: "Personal Pronouns and Verb Conjugation", assignmentId: "A1-1.2", kind: "lesen_hören", assignment: true, submissionRequired: true, progressionEligible: true, lesen_hören: [{ chapter: "1.2", assignment: true, assignmentId: "A1-1.2" }] },
  { id: "A1-2", level: "A1", day: 4, chapter: "2", topic: "Numbers", assignmentId: "A1-2", kind: "lesen_hören", assignment: true, submissionRequired: true, progressionEligible: true, lesen_hören: [{ chapter: "2", assignment: true, assignmentId: "A1-2" }] },
  { id: "A1-1.3", level: "A1", day: 5, chapter: "1.3", topic: "Introducing Yourself and Articles", assignmentId: "A1-1.3", kind: "schreiben_sprechen", assignment: false, submissionRequired: false, progressionEligible: false, workbookRoute: "/campus/course/a1-day-5-introducing-yourself-and-articles-workbook", schreiben_sprechen: [{ chapter: "1.3", assignment: false, assignmentId: "A1-1.3", workbook_link: "/campus/course/a1-day-5-introducing-yourself-and-articles-workbook" }] },
  { id: "A1-2.3", level: "A1", day: 6, chapter: "2.3", topic: "Family and Hobbies", assignmentId: "A1-2.3", kind: "schreiben_sprechen", assignment: false, submissionRequired: false, progressionEligible: false, schreiben_sprechen: [{ chapter: "2.3", assignment: false, assignmentId: "A1-2.3" }] },
  { id: "A1-3", level: "A1", day: 7, chapter: "3", topic: "Asking Prices", assignmentId: "A1-3", kind: "lesen_hören", assignment: true, submissionRequired: true, progressionEligible: true, lesen_hören: [{ chapter: "3", assignment: true, assignmentId: "A1-3" }] },
  { id: "A1-4", level: "A1", day: 8, chapter: "4", topic: "Countries and Languages", assignmentId: "A1-4", kind: "lesen_hören", assignment: true, submissionRequired: true, progressionEligible: true, lesen_hören: [{ chapter: "4", assignment: true, assignmentId: "A1-4" }] },
  { id: "A1-5", level: "A1", day: 9, chapter: "5", topic: "German Cases", assignmentId: "A1-5", kind: "lesen_hören", assignment: true, submissionRequired: true, progressionEligible: true, lesen_hören: [{ chapter: "5", assignment: true, assignmentId: "A1-5" }] },
  { id: "A1-7", level: "A1", day: 11, chapter: "7", topic: "Understanding Time", assignmentId: "A1-7", kind: "lesen_hören", assignment: true, submissionRequired: true, progressionEligible: true, lesen_hören: [{ chapter: "7", assignment: true, assignmentId: "A1-7" }] },
];

jest.mock("../data/curriculumManifest", () => ({
  getCurriculumEntriesForLevel: jest.fn((level) => (String(level).toUpperCase() === "A1" ? mockCanonicalA1Entries : [])),
}));

import CourseTab from "../components/CourseTab";

describe("CourseTab", () => {
  beforeEach(() => {
    window.localStorage.clear();
    mockGetDocs.mockResolvedValue({ docs: [] });
    mockFetchResults.mockResolvedValue({ results: [] });
    mockGetDoc.mockResolvedValue({
      exists: () => false,
      data: () => ({}),
    });
    mockSetDoc.mockResolvedValue(undefined);
    mockNavigate.mockClear();
  });



  it("renders A1 from canonical identities without duplicate legacy split cards", async () => {
    render(<CourseTab defaultLevel="A1" />);

    await waitFor(() => {
      expect(screen.getAllByText("German Alphabet")).toHaveLength(1);
    });

    expect(screen.getAllByText("Personal Information, Articles, Adjectives and W-Questions")).toHaveLength(1);
    expect(screen.getAllByText("Introducing Yourself and Articles")).toHaveLength(1);
    expect(screen.queryByText("German Alphabet + Personal Pronouns and Verb Conjugation")).not.toBeInTheDocument();
    expect(screen.queryByText("Personal Pronouns and Verb Conjugation + Introducing Yourself")).not.toBeInTheDocument();

    const lessonCards = screen.getAllByRole("article");
    expect(lessonCards.slice(0, 9).map((card) => {
      const title = within(card).getByRole("heading", { level: 3 }).textContent;
      return mockCanonicalA1Entries.find((entry) => entry.topic === title)?.id;
    })).toEqual([
      "A1-Tutorial",
      "A1-0.1",
      "A1-0.2",
      "A1-1.1",
      "A1-1.1-practice",
      "A1-1.2",
      "A1-2",
      "A1-1.3",
      "A1-2.3",
    ]);

    const practiceCard = screen.getByText("Personal Information, Articles, Adjectives and W-Questions").closest("article");
    const day5Card = screen.getByText("Introducing Yourself and Articles").closest("article");
    const day2Chapter11Card = lessonCards.find((card) => within(card).queryByText("Day 2 1.1"));
    const day3Chapter12Card = lessonCards.find((card) => within(card).queryByText("Day 3 1.2"));

    expect(within(practiceCard).getByText("Self-learning")).toBeInTheDocument();
    expect(within(day5Card).getByText("Self-learning")).toBeInTheDocument();
    expect(within(practiceCard).queryByText("Tutor-marked")).not.toBeInTheDocument();
    expect(within(day5Card).queryByText("Tutor-marked")).not.toBeInTheDocument();
    expect(within(day2Chapter11Card).getByText("Tutor-marked")).toBeInTheDocument();
    expect(within(day3Chapter12Card).getByText("Tutor-marked")).toBeInTheDocument();
    expect(screen.getByText("Practical completed: 0/4")).toBeInTheDocument();
    expect(screen.getByText("Assignments").nextElementSibling).toHaveTextContent("9");

    const openLessonLink = within(day5Card).getByRole("link", { name: "Open Lesson" });
    expect(openLessonLink).toHaveAttribute("href", "/campus/course/lesson/A1/5?chapter=1.3");

    fireEvent.click(openLessonLink);
    expect(mockNavigate).toHaveBeenCalledWith(
      "/campus/course/lesson/A1/5?chapter=1.3",
      expect.objectContaining({
        state: expect.objectContaining({
          entry: expect.objectContaining({
            id: "A1-1.3",
            workbookRoute: "/campus/course/a1-day-5-introducing-yourself-and-articles-workbook",
          }),
        }),
      })
    );
  });

  it("shows chapter suffixes only when a day has multiple course-book tasks", async () => {
    render(<CourseTab defaultLevel="A1" />);

    await waitFor(() => {
      expect(screen.getByText("German Alphabet")).toBeInTheDocument();
      expect(screen.getByText("Numbers")).toBeInTheDocument();
    });

    expect(screen.getByText("Day 2 0.2")).toBeInTheDocument();
    expect(screen.getByText("Day 2 1.1")).toBeInTheDocument();
    expect(screen.getByText("Day 4")).toBeInTheDocument();
    expect(screen.queryByText("Day 4 2")).not.toBeInTheDocument();
  });

  it("renders Passed for tutor-marked entries when merged progress status is passed even with a submission state", async () => {
    mockFetchResults.mockResolvedValueOnce({
      results: [{ assignmentId: "A1-0.1", score: 88, studentCode: "ComfortArmah295" }],
    });

    render(<CourseTab defaultLevel="A1" />);

    await waitFor(() => {
      expect(screen.getAllByText("Passed").length).toBeGreaterThan(0);
    });

    expect(screen.queryAllByText("Submitted").length).toBe(0);
  });

  it("renders Passed for later tutor-marked days (4, 7, 8, 9, 11) from merged progress", async () => {
    mockFetchResults.mockResolvedValueOnce({
      results: [
        { assignmentId: "A1-2", score: 83, studentCode: "ComfortArmah295" },
        { assignmentId: "A1-3", score: 80, studentCode: "ComfortArmah295" },
        { assignmentId: "A1-4", score: 79, studentCode: "ComfortArmah295" },
        { assignmentId: "A1-5", score: 78, studentCode: "ComfortArmah295" },
        { assignmentId: "A1-7", score: 81, studentCode: "ComfortArmah295" },
        // Simulate legacy rows where level is missing in backend result data.
        { assignmentId: "A1-8", score: 84, studentCode: "ComfortArmah295", level: "" },
      ],
    });

    render(<CourseTab defaultLevel="A1" />);

    await waitFor(() => {
      ["Numbers", "Asking Prices", "Countries and Languages", "German Cases", "Understanding Time"].forEach((topic) => {
        expect(screen.getByText(topic)).toBeInTheDocument();
        const card = screen.getByText(topic).closest("div");
        expect(within(card).getByText("Passed")).toBeInTheDocument();
      });
    });
  });

  it("shows only Practice only for self-practice entries and does not render Submitted or Not started", async () => {
    render(<CourseTab defaultLevel="A1" />);

    await waitFor(() => {
      expect(screen.getByText("Family and Hobbies")).toBeInTheDocument();
    });

    const card = screen.getByText("Family and Hobbies").closest("div");
    expect(within(card).getByText("Practice only")).toBeInTheDocument();
    expect(within(card).queryByText("Submitted")).not.toBeInTheDocument();
    expect(within(card).queryByText("Not started")).not.toBeInTheDocument();
  });

  it("supports self-marked completion and confidence for practice-only entries", async () => {
    render(<CourseTab defaultLevel="A1" />);

    await waitFor(() => {
      expect(screen.getByText("Family and Hobbies")).toBeInTheDocument();
    });

    const card = screen.getByText("Family and Hobbies").closest("div");
    const completionCheckbox = within(card).getByRole("checkbox");
    fireEvent.click(completionCheckbox);

    const confidenceSelect = within(card).getByRole("combobox");
    fireEvent.change(confidenceSelect, { target: { value: "high" } });

    expect(within(card).getByText("Self-marked complete")).toBeInTheDocument();
    expect(screen.getByText("Practical completed: 1/4")).toBeInTheDocument();
    await waitFor(() => {
      expect(mockSetDoc).toHaveBeenCalled();
    });
  });

  it("awards practical cluster badges when required practice days are completed", async () => {
    render(<CourseTab defaultLevel="A1" />);

    await waitFor(() => {
      expect(screen.getByText("Introducing Yourself and Articles")).toBeInTheDocument();
      expect(screen.getByText("Family and Hobbies")).toBeInTheDocument();
    });

    const day5Card = screen.getByText("Introducing Yourself and Articles").closest("div");
    const day6Card = screen.getByText("Family and Hobbies").closest("div");
    fireEvent.click(within(day5Card).getByRole("checkbox"));
    fireEvent.click(within(day6Card).getByRole("checkbox"));

    expect(screen.getByText("🧩 Foundation Speaker")).toBeInTheDocument();
  });


  it("renders Failed for A2 tutor-marked assignments below pass mark", async () => {
    mockFetchResults.mockResolvedValueOnce({
      results: [{ assignmentId: "A2-1", score: 42, studentCode: "ComfortArmah295" }],
    });

    render(<CourseTab defaultLevel="A2" />);

    await waitFor(() => {
      expect(screen.getByText("A2 Intro")).toBeInTheDocument();
      const card = screen.getByText("A2 Intro").closest("div");
      expect(within(card).getByText("Failed")).toBeInTheDocument();
      expect(within(card).queryByText("Practice only")).not.toBeInTheDocument();
    });
  });

  it("keeps later B1 passed assignments when result rows miss explicit level", async () => {
    mockFetchResults.mockResolvedValueOnce({
      results: [
        { assignmentId: "B1-1", score: 77, studentCode: "ComfortArmah295" },
        { assignmentId: "B1-11", score: 79, studentCode: "ComfortArmah295", level: "" },
      ],
    });

    render(<CourseTab defaultLevel="B1" />);

    await waitFor(() => {
      ["B1 Intro", "B1 Later Unit"].forEach((topic) => {
        expect(screen.getByText(topic)).toBeInTheDocument();
        const card = screen.getByText(topic).closest("div");
        expect(within(card).getByText("Passed")).toBeInTheDocument();
      });
    });
  });

  it("keeps tutor-marked status rendering active for A2 and B1 levels", async () => {
    mockFetchResults.mockResolvedValueOnce({
      results: [{ assignmentId: "A2-1", score: 74, studentCode: "ComfortArmah295" }],
    });

    const { rerender } = render(<CourseTab defaultLevel="A2" />);

    await waitFor(() => {
      expect(screen.getByText("Passed")).toBeInTheDocument();
    });

    mockFetchResults.mockResolvedValueOnce({
      results: [{ assignmentId: "B1-1", score: 77, studentCode: "ComfortArmah295" }],
    });

    rerender(<CourseTab defaultLevel="B1" />);

    await waitFor(() => {
      expect(screen.getByText("Passed")).toBeInTheDocument();
    });
  });
});
