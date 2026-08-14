import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
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

function LocationProbe() {
  const location = useLocation();
  return <div data-testid="location-probe">{location.pathname}{location.search}</div>;
}

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

test("completed Day 15 Kapitel 4.7 radio URL redirects straight to the workbook", async () => {
  render(
    <MemoryRouter initialEntries={["/campus/course/lesson/A1/15?radio=done&chapter=4.7&hub=1"]}>
      <Routes>
        <Route
          path={A1_CHAPTER_RESOURCE_HUB_PARENT_PATH}
          element={<A1ChapterResourceHubRoute level="A1" />}
        />
        <Route path="*" element={<LocationProbe />} />
      </Routes>
    </MemoryRouter>,
  );

  expect(await screen.findByTestId("location-probe")).toHaveTextContent(
    "/campus/course/speaking-exams-intro-4-7?view=workbook&radio=done",
  );
});
