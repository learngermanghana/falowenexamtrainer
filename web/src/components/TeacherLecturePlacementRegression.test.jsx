import React from "react";
import { render, screen } from "@testing-library/react";
import { SelfLearningLessonFrame } from "./SelfLearningLessonRegistry";

const teacherVideo = {
  key: "b2-day4-teacher-lecture",
  title: "B2 Day 4 · Teacher lecture",
  url: "https://youtu.be/teacher-b2-day4",
};

describe("teacher lecture placement", () => {
  test("shows self-learning teacher lectures before the lesson content", () => {
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

    const support = container.querySelector("[data-teacher-lecture-support='links-only']");
    const lesson = screen.getByTestId("self-learning-lesson");

    expect(support).toBe(container.firstElementChild);
    expect(screen.getByText("B2 Day 4 · Teacher lecture")).toBeVisible();
    expect(screen.getByRole("link", { name: /Open teacher lecture/i })).toHaveAttribute(
      "href",
      teacherVideo.url,
    );
    expect(lesson).toBeVisible();
    expect(container.querySelector("iframe")).not.toBeInTheDocument();
  });
});
