import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { getA1RadioResource } from "../data/a1RadioResources";
import A1ChapterResourceHubRoute from "./A1ChapterResourceHubRoute";
import { resolveA1RadioFirstWorkbookRoute } from "./A1RadioFirstWorkbookRoutes";

jest.mock("./CourseLessonPageLegacy", () => () => (
  <div data-testid="legacy-a1-resource-hub">A1 lesson resources</div>
));

const requestedLessons = [
  {
    day: 9,
    chapter: "5",
    radioKey: "a1-day9-german-cases-falowen-radio",
    radioTitle: "German Cases · Kapitel 5",
    radioId: "DV8dSaI076o",
    teacherTitle: "German Cases · Teacher lecture",
    teacherUrl: "https://youtu.be/Yi5ZA-XD-GY?si=nCX_pceEYgAL-FU0",
  },
  {
    day: 11,
    chapter: "7",
    radioKey: "a1-day11-understanding-time-falowen-radio",
    radioTitle: "Understanding Time · Kapitel 7",
    radioId: "asJsRtaR1x0",
    teacherTitle: "Understanding Time · Teacher lecture",
    teacherUrl: "https://youtu.be/qrkQJc5kQJQ",
  },
];

describe("A1 tutor-marked lesson media", () => {
  test.each(requestedLessons)(
    "uses the approved Day $day Chapter $chapter Falowen Radio episode",
    ({ day, chapter, radioKey, radioTitle, radioId }) => {
      expect(
        resolveA1RadioFirstWorkbookRoute(
          `/campus/course/lesson/A1/${day}`,
          `?chapter=${chapter}&hub=1`,
        ),
      ).toEqual({ day, chapter });

      expect(getA1RadioResource(day, chapter)).toEqual(
        expect.objectContaining({
          key: radioKey,
          chapter,
          title: radioTitle,
          youtubeId: radioId,
        }),
      );
      expect(getA1RadioResource(day, `${chapter}.1`)).toBeNull();
    },
  );

  test.each(requestedLessons)(
    "pins the configured Day $day teacher lecture above the chapter hub",
    ({ day, chapter, teacherTitle, teacherUrl }) => {
      const { container } = render(
        <MemoryRouter
          initialEntries={[
            `/campus/course/lesson/A1/${day}?chapter=${chapter}&hub=1&radio=done`,
          ]}
        >
          <Routes>
            <Route
              path="/campus/course/lesson/:level/:day"
              element={<A1ChapterResourceHubRoute />}
            />
          </Routes>
        </MemoryRouter>,
      );

      const teacherLink = screen.getByRole("link", { name: /Open teacher lecture/i });
      const support = container.querySelector("[data-teacher-lecture-support='links-only']");
      const hub = screen.getByTestId("legacy-a1-resource-hub");

      expect(screen.getByText("Supporting materials")).toBeVisible();
      expect(screen.getByText(teacherTitle)).toBeVisible();
      expect(teacherLink).toHaveAttribute("href", teacherUrl);
      expect(teacherLink).toHaveAttribute("target", "_blank");
      expect(container.querySelector("iframe")).not.toBeInTheDocument();
      expect(support).toBe(container.firstElementChild);
      expect(hub).toBeVisible();
    },
  );
});
