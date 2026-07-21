import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useParams } from "react-router-dom";
import A1ChapterResourceHubRoute from "./A1ChapterResourceHubRoute";

jest.mock("./CourseLessonPageLegacy", () => function A1HubLevelProbe() {
  const { level, day } = useParams();
  return <div data-testid="a1-hub-params">{level}:{day}</div>;
});

test("re-matches the literal A1 route so the lesson hub receives level A1", () => {
  render(
    <MemoryRouter initialEntries={["/campus/course/lesson/A1/1?chapter=0.1&hub=1"]}>
      <Routes>
        <Route
          path="/campus/course/lesson/A1/:day"
          element={<A1ChapterResourceHubRoute level="A1" />}
        />
      </Routes>
    </MemoryRouter>,
  );

  expect(screen.getByTestId("a1-hub-params")).toHaveTextContent("A1:1");
});
