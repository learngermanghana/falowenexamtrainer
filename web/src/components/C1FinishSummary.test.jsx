import React from "react";
import { render, cleanup } from "@testing-library/react";
import C1FinishSummary from "./C1FinishSummary";
import { getC1AcademicDay } from "../data/c1AcademicCurriculum";
import fs from "fs";
import path from "path";

afterEach(cleanup);

test.each(Array.from({ length: 28 }, (_, i) => i + 1))("day %i recaps its current topic, language focus and example without an input", (day) => {
  const academic = getC1AcademicDay(day);
  const { container } = render(<C1FinishSummary day={day} />);
  expect(container.textContent).toContain(academic.topic);
  expect(container.textContent).toContain(academic.grammar);
  expect(container.textContent).toContain(academic.example);
  expect(container.textContent).toContain(academic.vocabulary[0]);
  expect(container.querySelector("textarea, input, select")).toBeNull();
});

test("early C1 completion does not require a confidence choice or reflection", () => {
  const source = fs.readFileSync(path.join(__dirname, "C1Day1To6GuidedLessonPage.js"), "utf8");
  expect(source).toContain("<C1FinishSummary day={lesson.day} />");
  expect(source).not.toContain('key: "confidence"');
  expect(source).not.toContain("Short reflection");
});
