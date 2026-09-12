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
  useAuth: () => ({ studentProfile: { studentCode: "a2-section-test" }, user: null }),
}));
jest.mock("../hooks/useLessonProgress", () => ({
  useLessonProgress: () => ({ progressByAssignmentId: {}, loading: false, error: null }),
}));
jest.mock("../firebase", () => ({
  db: {},
  doc: jest.fn(),
  setDoc: (...args) => mockSetDoc(...args),
  serverTimestamp: () => "timestamp",
}));
jest.mock("../components/ClassMembersTab", () => () => null);

const sectionByTitle = (name) => screen.getByRole("heading", { name }).closest("details");
const cardDays = (section) =>
  within(section)
    .getAllByRole("article")
    .map((card) => {
      const href = within(card).getByRole("link", { name: "Open Lesson" }).getAttribute("href");
      const match = href?.match(/\/lesson\/A2\/(\d+)/);
      return match ? Number(match[1]) : null;
    })
    .filter((day) => Number.isFinite(day));

beforeEach(() => {
  window.localStorage.clear();
  mockSetDoc.mockReset().mockResolvedValue(undefined);
  mockNavigate.mockClear();
});

test("presents one A2 course as A2.1 Days 1-14 and A2.2 Days 15-28", () => {
  render(<CourseTab defaultLevel="A2" />);

  const first = sectionByTitle("A2.1 – Building Independence");
  const second = sectionByTitle("A2.2 – Independent Communication");
  const firstDays = cardDays(first);
  const secondDays = cardDays(second);

  expect(firstDays.length).toBeGreaterThan(0);
  expect(secondDays.length).toBeGreaterThan(0);
  expect(Math.min(...firstDays)).toBe(1);
  expect(Math.max(...firstDays)).toBe(14);
  expect(Math.min(...secondDays)).toBe(15);
  expect(Math.max(...secondDays)).toBe(28);
  expect(firstDays.every((day) => day >= 1 && day <= 14)).toBe(true);
  expect(secondDays.every((day) => day >= 15 && day <= 28)).toBe(true);
  expect(screen.queryByRole("heading", { name: "Week 1" })).not.toBeInTheDocument();
  expect(within(second).getByRole("heading", { name: "Welcome to A2.2" })).toBeInTheDocument();
});

test("keeps Day 15 on its existing A2 identity and chapter route", () => {
  render(<CourseTab defaultLevel="A2" />);
  const second = sectionByTitle("A2.2 – Independent Communication");
  const day15 = within(second)
    .getAllByRole("article")
    .find((card) => within(card).queryByText("Day 15"));

  expect(day15).toBeTruthy();
  const lessonLink = within(day15).getByRole("link", { name: "Open Lesson" });
  expect(lessonLink.getAttribute("href")).toContain("/campus/course/lesson/A2/15");
  expect(lessonLink.getAttribute("href")).toContain("chapter=6.15");
});

test("searching A2.2 does not create a new enrollment level or duplicate lessons", () => {
  render(<CourseTab defaultLevel="A2" />);
  const totalCards = screen.getAllByRole("article").length;

  expect(screen.queryByRole("option", { name: "A2.1" })).not.toBeInTheDocument();
  expect(screen.queryByRole("option", { name: "A2.2" })).not.toBeInTheDocument();

  fireEvent.change(screen.getByPlaceholderText("Search by day, topic, chapter or grammar point..."), {
    target: { value: "Mein Lieblingssport" },
  });

  expect(screen.queryByRole("heading", { name: "A2.1 – Building Independence" })).not.toBeInTheDocument();
  expect(cardDays(sectionByTitle("A2.2 – Independent Communication"))).toEqual([15]);

  fireEvent.change(screen.getByPlaceholderText("Search by day, topic, chapter or grammar point..."), {
    target: { value: "" },
  });
  expect(screen.getAllByRole("article")).toHaveLength(totalCards);
});
