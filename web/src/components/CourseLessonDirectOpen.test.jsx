import React from "react";
import fs from "fs";
import path from "path";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";

jest.mock("./SelfLearningLessonRegistry", () => ({
  getSelfLearningLessonComponent: jest.fn((level, day) => {
    const normalizedLevel = String(level || "").toUpperCase();
    if (Number(day) !== 10 || !["B2", "C1"].includes(normalizedLevel)) return null;

    return ({ canonicalLesson }) => {
      const ReactModule = require("react");
      return ReactModule.createElement(
        "div",
        { "data-testid": "direct-lesson" },
        `${canonicalLesson.level}:${canonicalLesson.day}:${canonicalLesson.chapter}`,
      );
    };
  }),
}));

import CourseLessonPageLegacy from "./CourseLessonPageLegacy";

const renderDirectLesson = (url) =>
  render(
    <MemoryRouter initialEntries={[url]}>
      <Routes>
        <Route
          path="/campus/course/lesson/:level/:day"
          element={<CourseLessonPageLegacy />}
        />
      </Routes>
    </MemoryRouter>,
  );

describe("lesson links opened in a fresh browser tab", () => {
  test("the top-level A1 resource-hub route no longer owns B2 or C1 URLs", () => {
    const indexSource = fs.readFileSync(path.resolve(__dirname, "../index.jsx"), "utf8");
    const appSource = fs.readFileSync(path.resolve(__dirname, "../App.js"), "utf8");

    expect(indexSource).toContain('path="/campus/course/lesson/A1/:day"');
    expect(indexSource).toContain('<A1ChapterResourceHubRoute level="A1" fallback={<App />} />');
    expect(indexSource).not.toContain('path="/campus/course/lesson/:level/:day"');
    expect(appSource).toContain('path="/campus/course/lesson/:level/:day" element={<CourseLessonPage />}');
  });

  test.each([
    ["B2", "/campus/course/lesson/B2/10?chapter=2.5"],
    ["C1", "/campus/course/lesson/C1/10?chapter=2.5"],
  ])("opens %s Day 10 Kapitel 2.5 without location state", (level, url) => {
    renderDirectLesson(url);

    expect(screen.getByTestId("direct-lesson")).toHaveTextContent(`${level}:10:2.5`);
  });
});
