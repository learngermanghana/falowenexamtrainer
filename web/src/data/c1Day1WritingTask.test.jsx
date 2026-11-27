import React from "react";
import { render, screen } from "@testing-library/react";
import lesson from "./selfLearningLessons/c1/day1ZieleUndLernweg";
import { alignC1LessonContent } from "./c1ContentRefresh";
import { getStandardWritingConfig } from "./standardLessonJourney";
import { C1_DAY1_WRITING_CONTEXT, C1_DAY1_WRITING_POINTS, C1_DAY1_WRITING_TITLE } from "./c1Day1WritingTask";
import WritingTaskPrompt from "../components/WritingTaskPrompt";

test("Day 1 displays the new context and all four points after course alignment", () => {
  const aligned = alignC1LessonContent(lesson);
  render(<WritingTaskPrompt lesson={aligned} />);
  expect(screen.getByText(C1_DAY1_WRITING_TITLE + ".")).toBeTruthy();
  expect(screen.getByText(new RegExp(C1_DAY1_WRITING_CONTEXT.slice(0, 45)))).toBeTruthy();
  C1_DAY1_WRITING_POINTS.forEach(point => expect(screen.getByText(point)).toBeTruthy());
  expect(aligned.writingTopic).not.toContain("Wie kann man einen realistischen Lernweg planen");
  const config = getStandardWritingConfig(aligned);
  expect(config.writingPromptBullets).toEqual(C1_DAY1_WRITING_POINTS);
  C1_DAY1_WRITING_POINTS.forEach((point, index) => expect(config.questions[index + 1].question).toBe(point));
});
