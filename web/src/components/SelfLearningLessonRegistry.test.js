import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { getSelfLearningLessonComponent } from "./SelfLearningLessonRegistry";
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
  test.each(["B2", "C1"])("%s lesson with a Radio entry shows the listening-only resource", (level) => {
    renderRegisteredLesson(level, 1, radio);

    expect(screen.getByRole("heading", { name: "🎙️ Falowen Radio" })).toBeInTheDocument();
    expect(screen.getByText("Test Radio Episode")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continue to teil/i })).toBeInTheDocument();
    expect(screen.queryByText(/supporting materials/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/choose your learning material/i)).not.toBeInTheDocument();
  });

  test.each([
    ["B2", "B2 AI lesson video: Persönliche Identität", "https://www.youtube.com/embed/HhUUkc8zgEc"],
    ["C1", "Video explanation: Relativsätze mit Präpositionen", "https://www.youtube.com/embed/u41XmMwb5PU"],
  ])("%s opens the lesson-owned AI video after Falowen Radio", (level, title, src) => {
    renderRegisteredLesson(level, 1, radio);

    fireEvent.click(screen.getByRole("button", { name: /continue to teil/i }));

    expect(screen.getByRole("heading", { name: "AI video" })).toBeInTheDocument();
    expect(screen.getByTitle(title)).toHaveAttribute("src", src);
    expect(screen.queryByTitle("Test Radio Episode")).not.toBeInTheDocument();
    expect(screen.queryByText(/supporting materials/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/choose your learning material/i)).not.toBeInTheDocument();
  });

  test.each(["B2", "C1"])("%s lesson without Radio opens the lesson UI directly", (level) => {
    renderRegisteredLesson(level, 28);

    expect(screen.queryByRole("heading", { name: "🎙️ Falowen Radio" })).not.toBeInTheDocument();
    expect(screen.queryByText(/choose your learning material/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/supporting materials/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1. Learn" })).toBeInTheDocument();
  });

  test("C1 Engagement und Ehrenamt uses the Day 1 standout Radio-to-tabs workbook", () => {
    renderRegisteredLesson("C1", 11, radio);

    expect(screen.getByRole("heading", { name: "🎙️ Falowen Radio" })).toBeInTheDocument();
    expect(screen.queryByText(/supporting materials/i)).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "1. Learn" })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /continue to teil/i }));

    expect(screen.getByRole("heading", { name: /Engagement und Ehrenamt/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1. Learn" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "2. Speak" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "3. Write" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "4. Finish" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "5. Ref" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Teil 1 · Sprechen/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/supporting materials/i)).not.toBeInTheDocument();
  });

  test.each([
    ["B2", 1, "B2 Day 1 · Persönliche Identität · Writing explanation", "https://www.youtube.com/embed/w8TaNHk-a0U"],
    ["C1", 8, "C1 Day 8 · Wohnen und Stadtentwicklung · Writing explanation", "https://www.youtube.com/embed/VdczhJS9ClY"],
  ])("%s Day %i keeps the saved Schreiben video on the Write page", (level, day, title, src) => {
    renderRegisteredLesson(level, day);

    fireEvent.click(screen.getByRole("button", { name: "3. Write" }));

    expect(screen.getByText("Watch before writing · Essay Ideas")).toBeInTheDocument();
    expect(screen.getByTitle(title)).toHaveAttribute("src", src);
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
