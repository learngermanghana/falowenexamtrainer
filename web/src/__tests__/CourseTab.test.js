import React from "react";
import { render, screen, waitFor, within } from "@testing-library/react";

const mockGetDocs = jest.fn();
const mockFetchResults = jest.fn();

jest.mock("../firebase", () => ({
  db: {},
  collection: jest.fn(() => ({})),
  query: jest.fn(() => ({})),
  where: jest.fn(() => ({})),
  orderBy: jest.fn(() => ({})),
  limit: jest.fn(() => ({})),
  getDocs: (...args) => mockGetDocs(...args),
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
        day: 4,
        topic: "Numbers",
        chapter: "2",
        assignment: true,
        lesen_hören: { chapter: "2", assignment: true },
      },
      {
        day: 6,
        topic: "Family and Hobbies",
        chapter: "2.3",
        assignment: false,
        schreiben_sprechen: { chapter: "2.3", assignment: false },
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

import CourseTab from "../components/CourseTab";

describe("CourseTab", () => {
  beforeEach(() => {
    mockGetDocs.mockResolvedValue({ docs: [] });
    mockFetchResults.mockResolvedValue({ results: [] });
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
