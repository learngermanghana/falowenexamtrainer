import React from "react";
import { render, screen } from "@testing-library/react";
import { getSelfLearningLessonComponent } from "./SelfLearningLessonRegistry";
import { normalizeLesson } from "../data/lessonModel";

jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
}));

jest.mock("../context/ToastContext", () => ({
  useToast: () => ({ showToast: jest.fn() }),
}));

const radio = {
  key: "test-radio",
  title: "Test Radio Episode",
  youtubeId: "testVideoId",
  instruction: "Listen only.",
};

const renderRegisteredLesson = (level, day, falowenRadio = null) => {
  const Component = getSelfLearningLessonComponent(level, day);
  render(<Component canonicalLesson={{ resources: { falowenRadio } }} />);
};

describe("self-learning lesson Falowen Radio integration", () => {
  test.each(["B2", "C1"])("%s lesson with a Radio entry shows the listening-only resource", (level) => {
    renderRegisteredLesson(level, 1, radio);

    expect(screen.getByRole("heading", { name: "🎙️ Falowen Radio" })).toBeInTheDocument();
    expect(screen.getByText("Test Radio Episode")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /continue to teil/i })).not.toBeInTheDocument();
  });

  test.each(["B2", "C1"])("%s lesson without Radio does not show an empty Radio card", (level) => {
    renderRegisteredLesson(level, 1);

    expect(screen.queryByRole("heading", { name: "🎙️ Falowen Radio" })).not.toBeInTheDocument();
  });

  test("A1 remains outside the self-learning registry and without Radio capability", () => {
    expect(getSelfLearningLessonComponent("A1", 1)).toBeNull();
    expect(normalizeLesson({ day: 1 }, "A1").resources.falowenRadio).toBeNull();
  });

  test.each(["A2", "B1"])("%s keeps four-part workbook behaviour", (level) => {
    const lesson = normalizeLesson({ day: 1 }, level);

    expect(lesson.lessonType).toBe("fourPartWorkbook");
    expect(lesson.capabilities.fourPartWorkbook).toBe(true);
    expect(getSelfLearningLessonComponent(level, 1)).toBeNull();
  });
});
