import React from "react";
import { render, screen } from "@testing-library/react";
import fs from "fs";
import path from "path";
import CourseCompletionConclusion from "./CourseCompletionConclusion";

const read = (relativePath) => fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("Goethe-first course completion handoff", () => {
  test.each([
    ["A1", "/campus/course/a1-day-25-goethe-exam-orientation"],
    ["A2", "/campus/course/a2-day-29-goethe-exam-orientation"],
    ["B1", "/campus/course/b1-day-29-goethe-exam-orientation"],
  ])("%s completed course points first to official Goethe practice", (level, route) => {
    render(
      <CourseCompletionConclusion
        level={level}
        isComplete
        completedRequirements={level === "A1" ? 19 : 28}
        totalRequirements={level === "A1" ? 19 : 28}
        passedAssignments={level === "A1" ? 19 : 28}
        totalAssignments={level === "A1" ? 19 : 28}
      />,
    );

    expect(screen.getByRole("link", { name: "Continue to Official Goethe Practice" })).toHaveAttribute("href", route);
    expect(screen.getByRole("link", { name: "Exams Room (optional)" })).toHaveAttribute("href", "/exams/question");
    expect(screen.getByText(new RegExp(`official Goethe ${level} practice`, "i"))).toBeInTheDocument();
  });

  test("incomplete tutor-guided course does not present Goethe practice as the primary completion action", () => {
    render(
      <CourseCompletionConclusion
        level="A2"
        isComplete={false}
        completedRequirements={20}
        totalRequirements={28}
        passedAssignments={18}
        totalAssignments={28}
      />,
    );

    expect(screen.queryByRole("link", { name: "Continue to Official Goethe Practice" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go to Exams Room" })).toHaveAttribute("href", "/exams/question");
  });

  test("self-learning levels retain the existing Exams Room handoff", () => {
    render(
      <CourseCompletionConclusion
        level="B2"
        isComplete
        completedRequirements={28}
        totalRequirements={28}
      />,
    );

    expect(screen.getByRole("link", { name: "Go to Exams Room" })).toHaveAttribute("href", "/exams/question");
    expect(screen.queryByRole("link", { name: "Continue to Official Goethe Practice" })).not.toBeInTheDocument();
  });

  test("course-book normalization keeps A2 and B1 exam orientation as dedicated final sections", () => {
    const a2Patch = read("../../../scripts/patchA2LateWorkbookNativeOwnership.mjs");
    const presentationPatch = read("../../../scripts/patchCourseBookPresentationSections.mjs");

    expect(a2Patch).toContain('{ key: "a2-exam", title: "A2 Exam Orientation", days: "Day 29", firstDay: 29, lastDay: 29 }');
    expect(presentationPatch).toContain('{ key: "b1-exam", title: "B1 Exam Orientation", days: "Day 29", firstDay: 29, lastDay: 29 }');
    expect(presentationPatch).toContain('"B1 Exam Orientation"');
  });
});
