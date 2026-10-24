import React from "react";
import { render, screen } from "@testing-library/react";
import { SelfLearningLessonFrame } from "./SelfLearningLessonRegistry";

const teacherVideo = {
  key: "b2-day4-teacher-lecture",
  title: "B2 Day 4 · Teacher lecture",
  url: "https://youtu.be/teacher-b2-day4",
};

describe("teacher lecture placement", () => {
  test("does not add a separate B2/C1 materials page before the lesson content", () => {
    const { container } = render(
      <SelfLearningLessonFrame
        canonicalLesson={{
          resources: {
            teacherVideo,
            videos: [teacherVideo],
          },
        }}
      >
        <main data-testid="self-learning-lesson">Self-learning lesson content</main>
      </SelfLearningLessonFrame>,
    );

    const lesson = screen.getByTestId("self-learning-lesson");

    expect(container.querySelector("[data-teacher-lecture-support='links-only']")).not.toBeInTheDocument();
    expect(screen.queryByText("B2 Day 4 · Teacher lecture")).not.toBeInTheDocument();
    expect(lesson).toBeVisible();
    expect(container.firstElementChild).toBe(lesson);
  });
});
