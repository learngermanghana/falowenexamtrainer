import React from "react";
import { render, screen } from "@testing-library/react";
import { LessonResourcesHub } from "./CourseLessonPageLegacy";

describe("LessonResourcesHub visibility", () => {
  const lesson = {
    level: "A2",
    resources: {
      videos: [
        { url: "https://youtu.be/teacher", title: "Teacher lesson", key: "teacher-video" },
        { url: "https://youtu.be/ai", title: "AI grammar video", key: "ai-grammar-video" },
      ],
      resourceGroups: [
        {
          chapter: "1.1",
          grammarBook: { url: "/grammar" },
          workbook: { url: "/workbook" },
        },
      ],
      falowenRadio: {
        title: "Test Radio",
        youtubeId: "radio123",
        instruction: "Listen first.",
      },
    },
  };

  test("hides integrated A1-B1 grammar books while keeping workbook, videos, and Falowen Radio", () => {
    render(<LessonResourcesHub lesson={lesson} />);

    expect(screen.queryByRole("link", { name: /open grammar book/i })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: /open workbook/i })).toHaveAttribute("href", "/workbook");
    expect(screen.getByRole("link", { name: /watch teacher video/i })).toHaveAttribute("href", "https://youtu.be/teacher");
    expect(screen.getByRole("link", { name: /watch ai video/i })).toHaveAttribute("href", "https://youtu.be/ai");
    expect(screen.getByRole("link", { name: /listen to radio/i })).toHaveAttribute("href", "https://youtu.be/radio123");
  });

  test("keeps grammar books visible outside A1-B1", () => {
    render(<LessonResourcesHub lesson={{ ...lesson, level: "C1" }} />);

    expect(screen.getByRole("link", { name: /open grammar book/i })).toHaveAttribute("href", "/grammar");
  });
});
