import React from "react";
import { render, screen } from "@testing-library/react";
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
  render(<Component canonicalLesson={{ level, day, topic: "Test lesson", resources: { falowenRadio } }} />);
};

describe("self-learning lesson Falowen Radio integration", () => {
  test.each(["B2", "C1"])("%s lesson with a Radio entry shows the listening-only resource", (level) => {
    renderRegisteredLesson(level, 1, radio);

    expect(screen.getByRole("heading", { name: "🎙️ Falowen Radio" })).toBeInTheDocument();
    expect(screen.getByText("Test Radio Episode")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /continue to teil/i })).toBeInTheDocument();
  });

  test.each(["B2", "C1"])("%s lesson without Radio opens the lesson UI directly", (level) => {
    renderRegisteredLesson(level, 28);

    expect(screen.queryByRole("heading", { name: "🎙️ Falowen Radio" })).not.toBeInTheDocument();
    expect(screen.queryByText(/choose your learning material/i)).not.toBeInTheDocument();
    expect(screen.getByRole("button", { name: "1. Learn" })).toBeInTheDocument();
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
