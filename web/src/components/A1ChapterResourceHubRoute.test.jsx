import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import A1ChapterResourceHubRoute, {
  A1_CHAPTER_RESOURCE_HUB_PARENT_PATH,
} from "./A1ChapterResourceHubRoute";

jest.mock("./CourseLessonPageLegacy", () => () => (
  <div data-testid="legacy-resource-hub">Legacy resource hub</div>
));

const LocationProbe = () => {
  const location = useLocation();
  return <div data-testid="location">{`${location.pathname}${location.search}`}</div>;
};

const renderHubRoute = (initialEntry) => render(
  <MemoryRouter initialEntries={[initialEntry]}>
    <Routes>
      <Route
        path={A1_CHAPTER_RESOURCE_HUB_PARENT_PATH}
        element={<A1ChapterResourceHubRoute level="A1" fallback={<div>Fallback</div>} />}
      />
      <Route path="*" element={<LocationProbe />} />
    </Routes>
  </MemoryRouter>,
);

describe("A1ChapterResourceHubRoute completed Radio handoff", () => {
  test("keeps the resource hub before Falowen Radio is complete", () => {
    renderHubRoute("/campus/course/lesson/A1/3?chapter=1.2&hub=1");

    expect(screen.getByTestId("legacy-resource-hub")).toBeVisible();
  });

  test("redirects a completed canonical A1 hub request straight to its Course Book", () => {
    renderHubRoute("/campus/course/lesson/A1/3?chapter=1.2&hub=1&radio=done");

    expect(screen.getByTestId("location")).toHaveTextContent(
      "/campus/course/a1-day-3-pronouns-introducing-yourself-workbook?radio=done",
    );
    expect(screen.queryByTestId("legacy-resource-hub")).not.toBeInTheDocument();
  });

  test("preserves workbook query parameters while redirecting after Radio", () => {
    renderHubRoute("/campus/course/lesson/A1/18?chapter=12.2&hub=1&radio=done");

    expect(screen.getByTestId("location")).toHaveTextContent(
      "/campus/course/a1-12-2-dative-articles-mit-bei-zu?view=workbook&radio=done",
    );
  });
});
