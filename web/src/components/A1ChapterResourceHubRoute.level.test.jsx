import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import A1ChapterResourceHubRoute, {
  A1_CHAPTER_RESOURCE_HUB_PARENT_PATH,
} from "./A1ChapterResourceHubRoute";

jest.mock("./CourseLessonPageLegacy", () => {
  const { useParams } = require("react-router-dom");

  return function A1HubLevelProbe({ routeLevel = "", routeDay = "", routeState = null } = {}) {
    const { day } = useParams();
    return (
      <div data-testid="a1-hub-params">
        {routeState?.level || routeLevel}:{routeState?.day || routeDay}:{day}
      </div>
    );
  };
});

describe("A1 chapter hub route identity", () => {
  test("uses the wildcard-safe A1 parent route", () => {
    expect(A1_CHAPTER_RESOURCE_HUB_PARENT_PATH).toBe("/campus/course/lesson/A1/:day/*");
  });

  test.each([
    ["/campus/course/lesson/A1/1?chapter=0.1&hub=1", "A1:1:1"],
    ["/campus/course/lesson/A1/2?chapter=1.1&hub=1&radio=done", "A1:2:2"],
  ])("builds route state in memory and renders the hub for %s", async (url, expected) => {
    render(
      <MemoryRouter initialEntries={[url]}>
        <Routes>
          <Route
            path={A1_CHAPTER_RESOURCE_HUB_PARENT_PATH}
            element={<A1ChapterResourceHubRoute level="A1" />}
          />
        </Routes>
      </MemoryRouter>,
    );

    expect(await screen.findByTestId("a1-hub-params")).toHaveTextContent(expected);
  });
});
