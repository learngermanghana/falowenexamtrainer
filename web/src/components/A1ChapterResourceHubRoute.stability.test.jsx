import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import A1ChapterResourceHubRoute, {
  A1_CHAPTER_RESOURCE_HUB_PARENT_PATH,
} from "./A1ChapterResourceHubRoute";

let mockMountCount = 0;
let mockUnmountCount = 0;

jest.mock("./CourseLessonPageLegacy", () => function StableLessonProbe() {
  const ReactFromMock = require("react");
  const { useLocation: useLocationFromMock } = require("react-router-dom");
  const location = useLocationFromMock();
  ReactFromMock.useEffect(() => {
    mockMountCount += 1;
    return () => { mockUnmountCount += 1; };
  }, []);
  return <div data-testid="stable-lesson">{location.pathname}{location.search}</div>;
});

test("Day 7 chapter hub normalizes once and stays mounted without repeated fetching", async () => {
  mockMountCount = 0;
  mockUnmountCount = 0;
  const originalFetch = global.fetch;
  const fetchSpy = jest.fn().mockResolvedValue({ ok: true });
  global.fetch = fetchSpy;

  const view = render(
    <MemoryRouter initialEntries={["/campus/course/lesson/A1/7?chapter=3&hub=1"]}>
      <Routes>
        <Route
          path={A1_CHAPTER_RESOURCE_HUB_PARENT_PATH}
          element={<A1ChapterResourceHubRoute level="A1" />}
        />
      </Routes>
    </MemoryRouter>,
  );

  expect(await screen.findByTestId("stable-lesson")).toHaveTextContent(
    "/campus/course/lesson/A1/7?chapter=3&hub=1",
  );
  expect(mockMountCount).toBe(1);
  expect(mockUnmountCount).toBe(0);
  expect(fetchSpy).not.toHaveBeenCalled();

  view.rerender(
    <MemoryRouter initialEntries={["/campus/course/lesson/A1/7?chapter=3&hub=1"]}>
      <Routes>
        <Route
          path={A1_CHAPTER_RESOURCE_HUB_PARENT_PATH}
          element={<A1ChapterResourceHubRoute level="A1" />}
        />
      </Routes>
    </MemoryRouter>,
  );
  expect(mockMountCount).toBe(1);
  expect(mockUnmountCount).toBe(0);
  expect(fetchSpy).not.toHaveBeenCalled();
  global.fetch = originalFetch;
});
