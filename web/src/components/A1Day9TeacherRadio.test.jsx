import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { getA1RadioResource } from "../data/a1RadioResources";
import A1ChapterResourceHubRoute from "./A1ChapterResourceHubRoute";
import { resolveA1RadioFirstWorkbookRoute } from "./A1RadioFirstWorkbookRoutes";

jest.mock("./CourseLessonPageLegacy", () => () => (
  <div data-testid="legacy-a1-resource-hub">A1 lesson resources</div>
));

describe("A1 Day 9 teacher lecture and Falowen Radio", () => {
  test("uses the approved Chapter 5 video as the radio-first episode", () => {
    expect(
      resolveA1RadioFirstWorkbookRoute(
        "/campus/course/lesson/A1/9",
        "?chapter=5&hub=1",
      ),
    ).toEqual({ day: 9, chapter: "5" });

    expect(getA1RadioResource(9, "5")).toEqual(
      expect.objectContaining({
        key: "a1-day9-german-cases-falowen-radio",
        chapter: "5",
        title: "German Cases · Kapitel 5",
        youtubeId: "1XWJ8-J7VKw",
      }),
    );
    expect(getA1RadioResource(9, "5.1")).toBeNull();
  });

  test("pins the existing German Cases teacher lecture above the Day 9 hub", () => {
    const { container } = render(
      <MemoryRouter initialEntries={["/campus/course/lesson/A1/9?chapter=5&hub=1&radio=done"]}>
        <Routes>
          <Route
            path="/campus/course/lesson/:level/:day"
            element={<A1ChapterResourceHubRoute />}
          />
        </Routes>
      </MemoryRouter>,
    );

    const teacherLink = screen.getByRole("link", { name: /Open teacher lecture/i });
    expect(screen.getByText("Supporting materials")).toBeVisible();
    expect(screen.getByText("German Cases · Teacher lecture")).toBeVisible();
    expect(teacherLink).toHaveAttribute(
      "href",
      "https://youtu.be/Yi5ZA-XD-GY?si=nCX_pceEYgAL-FU0",
    );
    expect(teacherLink).toHaveAttribute("target", "_blank");
    expect(container.querySelector("iframe")).not.toBeInTheDocument();
    expect(screen.getByTestId("legacy-a1-resource-hub")).toBeVisible();
  });
});
