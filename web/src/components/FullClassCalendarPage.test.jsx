import React from "react";
import { render, screen, within, waitFor } from "@testing-library/react";
import FullClassCalendarPage from "./FullClassCalendarPage";
import { subscribeCanonicalLiveClass } from "../services/canonicalLiveClassService";

jest.mock("react-router-dom", () => ({
  useParams: () => ({ className: "A1%20Stuttgart%20Klasse" }),
  useSearchParams: () => [new URLSearchParams("classId=class-test-123")],
}));
jest.mock("./navigation/AppBackButton", () => () => null);
jest.mock("../services/canonicalLiveClassService", () => ({
  subscribeCanonicalLiveClass: jest.fn(),
}));

const makeSession = (id, date, day, status = "scheduled") => ({
  id,
  startsAt: date,
  endsAt: new Date(new Date(date).getTime() + 60 * 60 * 1000).toISOString(),
  curriculumDay: day,
  status,
  topic: day === 0 ? "Orientation and Tutorial" : "Greetings and Asking About Well-being",
  assignmentIds: [day === 0 ? "A1-TUTORIAL" : "A1-0.1"],
});

const summary = {
  klass: { id: "class-test-123", name: "A1 Stuttgart Klasse", level: "A1" },
  sessions: [
    makeSession("day0", "2024-11-11T11:00:00.000Z", 0, "completed"),
    makeSession("day1", "2099-11-16T11:00:00.000Z", 1),
    makeSession("day2", "2099-12-01T11:00:00.000Z", 2),
  ],
};

beforeEach(() => {
  jest.clearAllMocks();
  subscribeCanonicalLiveClass.mockImplementation(({ onChange }) => {
    onChange(summary);
    return () => {};
  });
});

test("renders Figma timetable with actual class, upcoming lesson and month sections", async () => {
  render(<FullClassCalendarPage />);
  expect(await screen.findByRole("heading", { name: "Full class timetable" })).toBeInTheDocument();
  expect(screen.getByText("Live timetable")).toBeInTheDocument();
  expect(screen.getByRole("heading", { name: "A1 Stuttgart Klasse" })).toBeInTheDocument();
  expect(screen.getByRole("region", { name: "Scrollable session timetable" })).toBeInTheDocument();

  const featured = screen.getByRole("region", { name: "Featured class session" });
  expect(within(featured).getByText(/NEXT CLASS/)).toBeInTheDocument();
  expect(within(featured).getByText("Day 1")).toBeInTheDocument();
  expect(within(featured).getByRole("link", { name: /Open lesson/ }))
    .toHaveAttribute("href", expect.stringContaining("/campus/course/lesson/A1/1"));

  const plan = screen.getByRole("region", { name: "Class session plan" });
  expect(within(plan).getByText("November 2099")).toBeInTheDocument();
  expect(within(plan).getByText("December 2099")).toBeInTheDocument();
  expect(within(plan).getAllByRole("link", { name: /Open lesson/ })).toHaveLength(3);
  await waitFor(() => expect(subscribeCanonicalLiveClass).toHaveBeenCalledWith(
    expect.objectContaining({ classId: "class-test-123", className: "A1 Stuttgart Klasse" })
  ));
});

test("does not fabricate a featured class when canonical schedule has no sessions", async () => {
  subscribeCanonicalLiveClass.mockImplementation(({ onChange }) => {
    onChange({ ...summary, sessions: [] });
    return () => {};
  });
  render(<FullClassCalendarPage />);
  expect(await screen.findByText("No current lessons scheduled")).toBeInTheDocument();
  expect(screen.getByText("No current sessions were found for this class.")).toBeInTheDocument();
  expect(screen.queryByRole("region", { name: "Class session plan" })).not.toBeInTheDocument();
});
