import React from "react";
import { act, fireEvent, render, screen } from "@testing-library/react";
import "../i18n";
import PlacementTestPage2026 from "./PlacementTestPage2026";
import {
  placementTest,
  placementQuestions,
  PLACEMENT_STORAGE_KEY,
  PLACEMENT_DURATION_MS,
  buildLevelStats,
  getPlacementLevel,
  getRemainingMs,
  formatRemaining,
} from "./placementTest2026Data";

const allCorrect = () => Object.fromEntries(placementQuestions.map((question) => [question.id, question.correct]));

describe("public 30-question placement test", () => {
  beforeEach(() => {
    window.localStorage.clear();
    jest.useFakeTimers();
    jest.setSystemTime(new Date("2026-10-13T12:00:00Z"));
  });
  afterEach(() => jest.useRealTimers());

  test("has exactly 10 valid, uniquely keyed four-option questions at each of A1, A2 and B1", () => {
    expect(placementTest.sections.map((section) => section.level)).toEqual(["A1", "A2", "B1"]);
    expect(placementTest.sections.map((section) => section.questions.length)).toEqual([10, 10, 10]);
    expect(new Set(placementQuestions.map((question) => question.id)).size).toBe(30);
    expect(placementQuestions.map((question) => question.number)).toEqual(Array.from({ length: 30 }, (_, index) => index + 1));
    placementQuestions.forEach((question) => {
      expect(question.options).toHaveLength(4);
      expect(new Set(question.options).size).toBe(4);
      expect(question.options[question.answerIndex]).toBe(question.correct);
    });
    expect(placementQuestions[4].options).not.toContain("möchten");
    expect(placementQuestions[5].options).not.toContain("Was");
    expect(placementQuestions[29].options).not.toContain("welcher");
  });

  test("provides level-level scores and requires strong A1, A2 and B1 performance for B1 placement", () => {
    const answers = allCorrect();
    expect(buildLevelStats(placementTest.sections, answers).A1.correct).toBe(10);
    expect(getPlacementLevel(buildLevelStats(placementTest.sections, answers))).toBe("B1");
    placementTest.sections[2].questions.slice(0, 4).forEach((q) => { answers[q.id] = q.options.find((option) => option !== q.correct); });
    expect(getPlacementLevel(buildLevelStats(placementTest.sections, answers))).toBe("A2");
    placementTest.sections[1].questions.slice(0, 4).forEach((q) => { answers[q.id] = q.options.find((option) => option !== q.correct); });
    expect(getPlacementLevel(buildLevelStats(placementTest.sections, answers))).toBe("A1");
  });

  test("counts down an absolute 20-minute deadline", () => {
    const start = Date.now();
    expect(PLACEMENT_DURATION_MS).toBe(1200000);
    expect(formatRemaining(getRemainingMs(start, start))).toBe("20:00");
    expect(formatRemaining(getRemainingMs(start, start + 15 * 60000))).toBe("05:00");
    expect(formatRemaining(getRemainingMs(start, start + 20 * 60000))).toBe("00:00");
  });

  test("starts on user action and auto-submits unanswered items at timeout", () => {
    render(<PlacementTestPage2026 />);
    expect(screen.getByRole("button", { name: /start test/i })).toBeInTheDocument();
    expect(screen.queryByText("20:00")).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /start test/i }));
    expect(screen.getByText("20:00")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("radio", { name: "A. heiße" }));
    act(() => { jest.advanceTimersByTime(20 * 60 * 1000); });
    expect(screen.getByText(/Time is up/i)).toBeInTheDocument();
    expect(screen.getByText(/Score: 1\/30/)).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /view A1 classes/i })).toHaveAttribute("href", "/classes/?level=A1");
  });

  test("refresh cannot reset or extend the timer", () => {
    const { unmount } = render(<PlacementTestPage2026 />);
    fireEvent.click(screen.getByRole("button", { name: /start test/i }));
    const originallyStartedAt = JSON.parse(window.localStorage.getItem(PLACEMENT_STORAGE_KEY)).startedAt;
    unmount();
    act(() => { jest.advanceTimersByTime(2 * 60000); });
    render(<PlacementTestPage2026 />);
    expect(screen.getByText("18:00")).toBeInTheDocument();
    expect(JSON.parse(window.localStorage.getItem(PLACEMENT_STORAGE_KEY)).startedAt).toBe(originallyStartedAt);
  });

  test("reloading after the deadline displays the timed-out result", () => {
    const { unmount } = render(<PlacementTestPage2026 />);
    fireEvent.click(screen.getByRole("button", { name: /start test/i }));
    unmount();
    act(() => { jest.advanceTimersByTime(21 * 60000); });
    render(<PlacementTestPage2026 />);
    expect(screen.getByText(/Time is up/i)).toBeInTheDocument();
    expect(screen.getByText(/Score: 0\/30/)).toBeInTheDocument();
  });
});
