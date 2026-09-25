import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { getSelfLearningLessonComponent, shouldSkipSelfLearningRadio } from "./SelfLearningLessonRegistry";
import { normalizeLesson } from "../data/lessonModel";

jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
  useLocation: () => ({
    pathname: "/campus/course/lesson/B2/1",
    search: "",
    hash: "",
  }),
}));

jest.mock("../context/ToastContext", () => ({
  useToast: () => ({ showToast: jest.fn() }),
}));

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ studentProfile: null, user: null }),
}));

const radio = {
  key: "test-radio",
  title: "Test Radio Episode",
  youtubeId: "testVideoId",
  instruction: "Listen only.",
};

const renderRegisteredLesson = (level, day, falowenRadio = null) => {
  const Component = getSelfLearningLessonComponent(level, day);
  return render(
    <Component
      canonicalLesson={{ level, day, topic: "Test lesson", resources: { falowenRadio } }}
    />,
  );
};

beforeEach(() => {
  window.scrollTo = jest.fn();
});

describe("self-learning lesson Falowen Radio integration", () => {
  test("direct C1 workbook navigation skips a repeated Radio entrance", () => {
    expect(shouldSkipSelfLearningRadio("C1", "?radio=done")).toBe(true);
    expect(shouldSkipSelfLearningRadio("C1", "?view=write&radio=done")).toBe(true);
    expect(shouldSkipSelfLearningRadio("C1", "")).toBe(false);
    expect(shouldSkipSelfLearningRadio("B2", "?radio=done")).toBe(false);
  });

  test("B2 ignores retired Falowen Radio metadata and opens the redesigned lesson directly", () => {
    renderRegisteredLesson("B2", 1, radio);

    expect(screen.queryByRole("heading", { name: "🎙️ Falowen Radio" })).not.toBeInTheDocument();
    expect(screen.queryByText("Test Radio Episode")).not.toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Grammar" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Lesen" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Review" })).toBeInTheDocument();
  });

  test("C1 lesson with a Radio entry keeps the listening-only entrance", () => {
    renderRegisteredLesson("C1", 1, radio);

    expect(screen.getByRole("heading", { name: "🎙️ Falowen Radio" })).toBeInTheDocument();
    expect(screen.getByText("Test Radio Episode")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continue to teil/i })).toBeInTheDocument();
  });

  test("C1 opens its lesson-owned AI video after Falowen Radio", () => {
    renderRegisteredLesson("C1", 1, radio);

    fireEvent.click(screen.getByRole("button", { name: /continue to teil/i }));

    expect(screen.getByRole("heading", { name: "AI video" })).toBeInTheDocument();
    expect(screen.getByTitle("Video explanation: Relativsätze mit Präpositionen")).toHaveAttribute(
      "src",
      "https://www.youtube.com/embed/u41XmMwb5PU",
    );
  });

  test("B2 lesson without Radio opens the new rotating lesson UI directly", () => {
    renderRegisteredLesson("B2", 28);

    expect(screen.queryByRole("heading", { name: "🎙️ Falowen Radio" })).not.toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Grammar" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Write" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Review" })).toBeInTheDocument();
  });

  test("C1 lesson without Radio opens the lesson UI directly", () => {
    renderRegisteredLesson("C1", 28);

    expect(screen.queryByRole("heading", { name: "🎙️ Falowen Radio" })).not.toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Learn" })).toBeInTheDocument();
  });

  test("C1 Engagement und Ehrenamt uses the Day 1 standout Radio-to-tabs workbook", () => {
    renderRegisteredLesson("C1", 11, radio);

    expect(screen.getByRole("heading", { name: "🎙️ Falowen Radio" })).toBeInTheDocument();
    expect(screen.queryByText(/supporting materials/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "1. Learn" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /continue to teil/i }));

    expect(screen.getByRole("heading", { name: "Engagement und Ehrenamt", level: 1 })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Learn" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Speak" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Write" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Finish" })).toBeInTheDocument();
    expect(screen.getByRole("tab", { name: "Ref" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Teil 1 · Sprechen/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/supporting materials/i)).not.toBeInTheDocument();
  });

  test("C1 Day 8 keeps the saved Schreiben video on the Write page", () => {
    renderRegisteredLesson("C1", 8);

    fireEvent.click(screen.getByRole("tab", { name: "Write" }));

    expect(screen.getByText("Watch before writing · Essay Ideas")).toBeInTheDocument();
    expect(screen.getByTitle("C1 Day 8 · Wohnen und Stadtentwicklung · Writing explanation")).toHaveAttribute(
      "src",
      "https://www.youtube.com/embed/VdczhJS9ClY",
    );
  });

  test("A1 remains outside the B2/C1 self-learning registry and without generic Radio capability", () => {
    expect(getSelfLearningLessonComponent("A1", 1)).toBeNull();
    expect(normalizeLesson({ day: 1 }, "A1").resources.falowenRadio).toBeNull();
  });

  test("A2 keeps its four-part workbook behaviour and does not use the self-learning registry", () => {
    const lesson = normalizeLesson({ day: 1 }, "A2");

    expect(lesson.lessonType).toBe("fourPartWorkbook");
    expect(lesson.capabilities.fourPartWorkbook).toBe(true);
    expect(getSelfLearningLessonComponent("A2", 1)).toBeNull();
  });

  test("B1 keeps its four-part tutor-marked workbook behind its Radio entrance", () => {
    const lesson = normalizeLesson({ day: 1 }, "B1");

    expect(lesson.lessonType).toBe("fourPartWorkbook");
    expect(lesson.capabilities.fourPartWorkbook).toBe(true);
    expect(typeof getSelfLearningLessonComponent("B1", 1)).toBe("function");
  });
});
