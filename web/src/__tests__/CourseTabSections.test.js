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

const sectionByTitle = (name) => screen.getByRole("heading", { name }).closest("details");
const cardDays = (section) => within(section).getAllByRole("article").map((card) => {
  const href = within(card).getByRole("link", { name: "Open Lesson" }).getAttribute("href");
  return Number(href.match(/\/lesson\/A1\/(\d+)/)[1]);
});

beforeEach(() => {
  window.localStorage.clear();
  mockSetDoc.mockReset().mockResolvedValue(undefined);
  mockNavigate.mockClear();
});

test("divides the real A1 curriculum at Day 13 without dropping, duplicating or renumbering lessons", () => {
  render(<CourseTab defaultLevel="A1" />);
  const first = sectionByTitle("A1.1 – Foundations");
  const second = sectionByTitle("A1.2 – Application and Readiness");
  expect(cardDays(sectionByTitle("Orientation"))).toEqual([0]);
  expect(cardDays(first)).toEqual([1, 2, 2, 3, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]);
  expect(cardDays(second)).toEqual([13, 14, 15, 16, 16, 17, 18, 18, 19, 20, 21, 22, 23, 24]);
  expect(screen.getAllByRole("article")).toHaveLength(29);
  expect(within(second).getByRole("heading", { name: "Welcome to A1.2" })).toBeInTheDocument();
  const firstCard = within(second).getAllByRole("article")[0];
  expect(firstCard.previousElementSibling).toHaveTextContent("Welcome to A1.2");
  expect(firstCard.previousElementSibling).toHaveTextContent("After the final Conjunctions lesson on Day 24, continue in the Exam Room");
  expect(within(second).getAllByRole("article").at(-1)).toHaveTextContent("Conjunctions");
  expect(within(first).getAllByRole("article").at(-1)).toHaveTextContent("Passed");
  expect(screen.getAllByText("Progress", { exact: true })).toHaveLength(1);
  expect(screen.getByText("1 of 29 lessons completed")).toBeInTheDocument();
  expect(screen.queryByRole("option", { name: "A1.1" })).not.toBeInTheDocument();
  expect(screen.queryByRole("option", { name: "A1.2" })).not.toBeInTheDocument();
});

test("keeps search and assignment filters working across the two sections", () => {
  render(<CourseTab defaultLevel="A1" />);
  fireEvent.change(screen.getByPlaceholderText("Search by day, topic, chapter or grammar point..."), { target: { value: "Conjunctions" } });
  expect(screen.queryByRole("heading", { name: "A1.1 – Foundations" })).not.toBeInTheDocument();
  expect(cardDays(sectionByTitle("A1.2 – Application and Readiness"))).toEqual([24]);
  expect(screen.queryByRole("heading", { name: "Welcome to A1.2" })).not.toBeInTheDocument();
  fireEvent.change(screen.getByPlaceholderText("Search by day, topic, chapter or grammar point..."), { target: { value: "" } });
  fireEvent.click(screen.getByRole("button", { name: "Assignments" }));
  expect(cardDays(sectionByTitle("A1.1 – Foundations"))).toEqual([1, 2, 2, 3, 4, 7, 8, 9, 10, 11, 12]);
  expect(cardDays(sectionByTitle("A1.2 – Application and Readiness"))).toEqual([16, 16, 17, 18, 18, 20, 21, 22]);
});

test("Day 13 navigation and practice progress continue to use A1 identities", () => {
  render(<CourseTab defaultLevel="A1" />);
  const day13 = within(sectionByTitle("A1.2 – Application and Readiness")).getAllByRole("article")[0];
  fireEvent.click(within(day13).getByRole("link", { name: "Open Lesson" }));
  expect(mockNavigate).toHaveBeenCalledWith("/campus/course/lesson/A1/13?chapter=3.5", expect.objectContaining({ state: expect.objectContaining({ level: "A1", day: 13 }) }));
  fireEvent.click(within(day13).getByRole("checkbox"));
  expect(mockSetDoc).toHaveBeenCalledWith(undefined, expect.objectContaining({ level: "A1", displayDay: 13, completed: true }), { merge: true });
  expect(window.localStorage.getItem("coursePracticeProgress:section-test:A1")).toContain('"completed":true');
  expect(screen.getByText("2 of 29 lessons completed")).toBeInTheDocument();
});

test("later course levels retain their weekly layout", () => {
  render(<CourseTab defaultLevel="A2" />);
  expect(screen.getByRole("heading", { name: "Week 1" })).toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: "A1.1 – Foundations" })).not.toBeInTheDocument();
  expect(screen.queryByRole("heading", { name: "Welcome to A1.2" })).not.toBeInTheDocument();
});
