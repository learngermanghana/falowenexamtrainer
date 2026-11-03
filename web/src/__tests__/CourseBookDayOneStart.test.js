import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import CourseTab from "../components/CourseTab";

const mockNavigate = jest.fn();
const mockSetDoc = jest.fn();

jest.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
  useLocation: () => ({ pathname: "/campus/course", search: "" }),
}));
jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ studentProfile: { studentCode: "section-test" }, user: null }),
}));
jest.mock("../hooks/useLessonProgress", () => ({
  useLessonProgress: () => ({ progressByAssignmentId: { "A1-8": { status: "passed" } }, loading: false, error: null }),
}));
jest.mock("../firebase", () => ({
  db: {},
  doc: jest.fn(),
  setDoc: (...args) => mockSetDoc(...args),
  serverTimestamp: () => "timestamp",
}));
jest.mock("../components/ClassMembersTab", () => () => null);

import { courseSchedules } from "../data/courseSchedule";

test.each(["A1", "A2", "B1", "B2", "C1"])("%s Course Book begins at Day 1 while the schedule retains Day 0", (level) => {
  window.localStorage.clear();
  expect(courseSchedules[level].some(entry => Number(entry.day) === 0)).toBe(true);
  render(<CourseTab defaultLevel={level} />);
  const days = screen.getAllByRole("article").map(card => Number(card.textContent.match(/\bDay (\d+)/)?.[1])).filter(Number.isFinite);
  expect(days[0]).toBe(1);
  expect(days).not.toContain(0);
  expect(screen.queryByRole("heading", { name: "Orientation", exact: true })).not.toBeInTheDocument();
});
