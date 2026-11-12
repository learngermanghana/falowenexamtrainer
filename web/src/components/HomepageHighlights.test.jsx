import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HomepageHighlights from "./HomepageHighlights";
import { subscribeCanonicalLiveClass } from "../services/canonicalLiveClassService";

jest.mock("../services/canonicalLiveClassService", () => ({
  subscribeCanonicalLiveClass: jest.fn(),
}));
jest.mock("../utils/liveClassCardPresentation", () => {
  const actual = jest.requireActual("../utils/liveClassCardPresentation");
  return {
    ...actual,
    loadLiveClassSummaryCache: jest.fn(() => null),
    saveLiveClassSummaryCache: jest.fn(),
  };
});

const mount = props => render(<MemoryRouter><HomepageHighlights {...props} /></MemoryRouter>);
const makeSummary = () => ({
  klass: { id: "class-123", name: "A2 Accra Klasse", level: "A2" },
  sessions: [{
    id: "session-1", topic: "Eine Reise planen", curriculumDay: 10,
    startsAt: new Date(Date.now() + 86400000).toISOString(),
    endsAt: new Date(Date.now() + 90000000).toISOString(),
    status: "scheduled",
  }],
});

beforeEach(() => {
  jest.clearAllMocks();
  subscribeCanonicalLiveClass.mockImplementation(({ onChange }) => {
    onChange(makeSummary());
    return () => {};
  });
});

test("without an assigned class shows only Music and Books", () => {
  mount({ level: "A1" });
  expect(screen.getByRole("button", { name: "Show Music" })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "Show Books" })).toBeInTheDocument();
  expect(screen.queryByRole("button", { name: "Show Next Class" })).not.toBeInTheDocument();
  expect(subscribeCanonicalLiveClass).not.toHaveBeenCalled();
  fireEvent.click(screen.getByRole("button", { name: "Next highlight" }));
  expect(screen.getByRole("img", { name: "Deutsch A1 book cover" })).toHaveAttribute("src", "/books/a1-cover.svg");
});

test("assigned students see their actual class and a direct lesson and schedule link", () => {
  mount({ level: "A2", className: "A2 Accra Klasse", classId: "class-123" });
  expect(subscribeCanonicalLiveClass).toHaveBeenCalledWith(expect.objectContaining({
    className: "A2 Accra Klasse", classId: "class-123",
  }));
  expect(screen.getByText("Eine Reise planen")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Open lesson/ })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: "View schedule" })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Show Music" }));
  expect(screen.getByText("Listen. Sing. Learn German.")).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Show your upcoming class/ })).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Show Books" }));
  expect(screen.getByRole("img", { name: "Deutsch A2 book cover" })).toHaveAttribute("src", "/books/a2-cover.svg");
});

test("does not advertise cancelled or missing next classes", () => {
  subscribeCanonicalLiveClass.mockImplementation(({ onChange }) => {
    onChange({ ...makeSummary(), sessions: [{ ...makeSummary().sessions[0], status: "cancelled" }] });
    return () => {};
  });
  mount({ level: "B1", className: "B1 Accra Klasse", classId: "class-123" });
  expect(screen.queryByRole("button", { name: "Show Next Class" })).not.toBeInTheDocument();
  expect(screen.getByText("Listen. Sing. Learn German.")).toBeInTheDocument();
});

test("the carousel never starts an automatic rotation timer for unassigned learners", () => {
  const setIntervalSpy = jest.spyOn(window, "setInterval");
  mount({ level: "B2" });
  expect(setIntervalSpy).not.toHaveBeenCalled();
  setIntervalSpy.mockRestore();
});
