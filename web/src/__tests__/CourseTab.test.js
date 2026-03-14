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

  it("renders Day 4 chapter 2 (A1-2) as Passed when score is 83", async () => {
    mockFetchResults.mockResolvedValueOnce({
      results: [{ assignmentId: "A1-2", score: 83, studentCode: "ComfortArmah295" }],
    });

    render(<CourseTab defaultLevel="A1" />);

    await waitFor(() => {
      expect(screen.getByText("Numbers")).toBeInTheDocument();
      const card = screen.getByText("Numbers").closest("div");
      expect(within(card).getByText("Passed")).toBeInTheDocument();
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
