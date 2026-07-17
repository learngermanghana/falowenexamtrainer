import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import A1CanonicalChapterLessonRoute, {
  getA1CanonicalChapterDestination,
} from "./A1CanonicalChapterLessonRoute";

const LocationProbe = () => {
  const location = useLocation();
  return (
    <div>
      <div data-testid="location">{`${location.pathname}${location.search}`}</div>
      <div data-testid="state">{location.state ? "state-present" : "state-cleared"}</div>
    </div>
  );
};

const renderCanonicalRoute = ({
  pathname,
  search = "",
  state = null,
  fixedChapter = "",
}) =>
  render(
    <MemoryRouter initialEntries={[{ pathname, search, state }]}>
      <Routes>
        <Route
          path="/campus/course/lesson/A1/chapter/:chapter"
          element={<A1CanonicalChapterLessonRoute />}
        />
        <Route
          path="/campus/course/lesson/A1/1.1"
          element={<A1CanonicalChapterLessonRoute chapter={fixedChapter || "1.1"} />}
        />
        <Route path="*" element={<LocationProbe />} />
      </Routes>
    </MemoryRouter>,
  );

describe("A1CanonicalChapterLessonRoute", () => {
  test("routes Kapitel 1.1 to its chapter resource hub even when stale state says 0.2", async () => {
    renderCanonicalRoute({
      pathname: "/campus/course/lesson/A1/chapter/1.1",
      state: {
        assignmentKey: "A1-0.2",
        entry: { assignmentId: "A1-0.2", chapter: "0.2" },
      },
    });

    expect(
      await screen.findByText("/campus/course/lesson/A1/2?chapter=1.1&hub=1"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("state")).toHaveTextContent("state-cleared");
  });

  test("routes Kapitel 0.2 to its separate alphabet resource hub", async () => {
    renderCanonicalRoute({
      pathname: "/campus/course/lesson/A1/chapter/0.2",
    });

    expect(
      await screen.findByText("/campus/course/lesson/A1/2?chapter=0.2&hub=1"),
    ).toBeInTheDocument();
  });

  test("supports the requested short dotted route alias", async () => {
    renderCanonicalRoute({
      pathname: "/campus/course/lesson/A1/1.1",
      fixedChapter: "1.1",
    });

    expect(
      await screen.findByText("/campus/course/lesson/A1/2?chapter=1.1&hub=1"),
    ).toBeInTheDocument();
  });

  test("preserves optional query parameters on the resource hub", async () => {
    renderCanonicalRoute({
      pathname: "/campus/course/lesson/A1/chapter/12.1",
      search: "?radio=done&source=coursebook",
    });

    expect(
      await screen.findByText(
        "/campus/course/lesson/A1/18?chapter=12.1&radio=done&source=coursebook&hub=1",
      ),
    ).toBeInTheDocument();
  });

  test("keeps grammar-only practice chapters on their dedicated destination", () => {
    expect(getA1CanonicalChapterDestination({ chapter: "14.2" })).toBe(
      "/campus/course/dative-and-accusative-verbs-14-2",
    );
  });

  test("returns to Course Book for an unknown chapter", async () => {
    renderCanonicalRoute({
      pathname: "/campus/course/lesson/A1/chapter/99.9",
    });

    expect(await screen.findByText("/campus/course")).toBeInTheDocument();
  });

  test("destination resolution is chapter-owned and opens each assignment resource hub", () => {
    expect(getA1CanonicalChapterDestination({ chapter: "1.1" })).toBe(
      "/campus/course/lesson/A1/2?chapter=1.1&hub=1",
    );
    expect(getA1CanonicalChapterDestination({ chapter: "0.2" })).toBe(
      "/campus/course/lesson/A1/2?chapter=0.2&hub=1",
    );
  });
});
