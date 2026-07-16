import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import A1ChapterSpecificLessonRouteBoundary, {
  getA1LegacyChapterLessonRedirect,
} from "./A1ChapterSpecificLessonRouteBoundary";

const LessonProbe = ({ onRender }) => {
  const location = useLocation();
  onRender();
  return (
    <div>
      <div data-testid="lesson-location">{`${location.pathname}${location.search}`}</div>
      <div data-testid="lesson-state">{location.state ? "state-present" : "state-cleared"}</div>
    </div>
  );
};

const renderBoundary = ({ pathname = "/campus/course/lesson/A1/2", search, state, onRender }) =>
  render(
    <MemoryRouter
      initialEntries={[
        {
          pathname,
          search,
          state,
        },
      ]}
    >
      <A1ChapterSpecificLessonRouteBoundary>
        <Routes>
          <Route path="*" element={<LessonProbe onRender={onRender} />} />
        </Routes>
      </A1ChapterSpecificLessonRouteBoundary>
    </MemoryRouter>,
  );

describe("A1ChapterSpecificLessonRouteBoundary", () => {
  test("keeps the requested Kapitel 1.1 URL even when stale state belongs to 0.2", async () => {
    const onRender = jest.fn();

    renderBoundary({
      search: "?chapter=1.1",
      state: {
        assignmentKey: "A1-0.2",
        entry: {
          assignmentId: "A1-0.2",
          chapter: "0.2",
          title: "German Alphabet",
        },
      },
      onRender,
    });

    expect(
      await screen.findByText("/campus/course/lesson/A1/chapter/1.1"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("lesson-state")).toHaveTextContent("state-cleared");
    expect(onRender).toHaveBeenCalledTimes(1);
  });

  test("keeps the requested Kapitel 0.2 URL even when stale state belongs to 1.1", async () => {
    const onRender = jest.fn();

    renderBoundary({
      search: "?chapter=0.2",
      state: {
        assignmentKey: "A1-1.1",
        entry: { assignmentId: "A1-1.1", chapter: "1.1" },
      },
      onRender,
    });

    expect(
      await screen.findByText("/campus/course/lesson/A1/chapter/0.2"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("lesson-state")).toHaveTextContent("state-cleared");
    expect(onRender).toHaveBeenCalledTimes(1);
  });

  test("uses Day 3 to keep the repeated Kapitel 1.1 self-practice route separate", async () => {
    const onRender = jest.fn();

    renderBoundary({
      pathname: "/campus/course/lesson/A1/3",
      search: "?chapter=1.1",
      state: { entry: { chapter: "1.1" } },
      onRender,
    });

    expect(
      await screen.findByText("/campus/course/lesson/A1/chapter/1.1-practice"),
    ).toBeInTheDocument();
    expect(screen.getByTestId("lesson-state")).toHaveTextContent("state-cleared");
  });

  test("preserves unrelated URL parameters while removing the legacy chapter query", async () => {
    const onRender = jest.fn();

    renderBoundary({
      search: "?chapter=1.1&source=coursebook&radio=done",
      state: { entry: { assignmentId: "A1-0.2", chapter: "0.2" } },
      onRender,
    });

    expect(
      await screen.findByText(
        "/campus/course/lesson/A1/chapter/1.1?source=coursebook&radio=done",
      ),
    ).toBeInTheDocument();
  });

  test("does not redirect an A1 day route without a chapter", () => {
    const onRender = jest.fn();
    renderBoundary({ search: "", state: { entry: { chapter: "0.2" } }, onRender });

    expect(screen.getByText("/campus/course/lesson/A1/2")).toBeInTheDocument();
    expect(onRender).toHaveBeenCalledTimes(1);
  });

  test("resolves redirects from URL identity and legacy day only", () => {
    expect(
      getA1LegacyChapterLessonRedirect({
        pathname: "/campus/course/lesson/A1/2",
        search: "?chapter=1.1",
      }),
    ).toEqual({
      pathname: "/campus/course/lesson/A1/chapter/1.1",
      search: "",
    });
    expect(
      getA1LegacyChapterLessonRedirect({
        pathname: "/campus/course/lesson/A1/3",
        search: "?chapter=1.1",
      }),
    ).toEqual({
      pathname: "/campus/course/lesson/A1/chapter/1.1-practice",
      search: "",
    });
  });
});
