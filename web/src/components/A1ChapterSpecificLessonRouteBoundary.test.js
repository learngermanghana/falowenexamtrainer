import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router-dom";
import A1ChapterSpecificLessonRouteBoundary from "./A1ChapterSpecificLessonRouteBoundary";

const LessonProbe = ({ onRender }) => {
  const location = useLocation();
  onRender();
  return <div data-testid="lesson-location">{`${location.pathname}${location.search}`}</div>;
};

const renderBoundary = ({ search, state, onRender }) =>
  render(
    <MemoryRouter
      initialEntries={[
        {
          pathname: "/campus/course/lesson/A1/2",
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
  test("corrects the Day 0.2 URL before the lesson subtree renders", async () => {
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
      await screen.findByText("/campus/course/lesson/A1/2?chapter=0.2"),
    ).toBeInTheDocument();
    expect(onRender).toHaveBeenCalledTimes(1);
  });

  test("renders a correctly matched Kapitel 1.1 route without redirecting", () => {
    const onRender = jest.fn();

    renderBoundary({
      search: "?chapter=1.1",
      state: {
        assignmentKey: "A1-1.1",
        entry: { assignmentId: "A1-1.1", chapter: "1.1" },
      },
      onRender,
    });

    expect(
      screen.getByText("/campus/course/lesson/A1/2?chapter=1.1"),
    ).toBeInTheDocument();
    expect(onRender).toHaveBeenCalledTimes(1);
  });
});
