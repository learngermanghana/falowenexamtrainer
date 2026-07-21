import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useParams } from "react-router-dom";
import A1ChapterResourceHubRoute, {
  A1_CHAPTER_RESOURCE_HUB_PARENT_PATH,
} from "./A1ChapterResourceHubRoute";

jest.mock("./CourseLessonPageLegacy", () => function A1HubLevelProbe() {
  const { level, day } = useParams();
  return <div data-testid="a1-hub-params">{level}:{day}</div>;
});

test("uses a wildcard-safe A1 parent route and re-matches level A1 for the lesson hub", () => {
  expect(A1_CHAPTER_RESOURCE_HUB_PARENT_PATH).toBe("/campus/course/lesson/A1/:day/*");

  render(
    <MemoryRouter initialEntries={["/campus/course/lesson/A1/1?chapter=0.1&hub=1"]}>
      <Routes>
        <Route
          path={A1_CHAPTER_RESOURCE_HUB_PARENT_PATH}
          element={<A1ChapterResourceHubRoute level="A1" />}
        />
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.getByTestId("a1-hub-params")).toHaveTextContent("A1:1");
});
