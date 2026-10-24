import React from "react";
import { render, screen } from "@testing-library/react";
import fs from "fs";
import path from "path";
import CourseCompletionConclusion from "./CourseCompletionConclusion";

const read = (relativePath) => fs.readFileSync(path.resolve(__dirname, relativePath), "utf8");

describe("course completion exam actions", () => {
  test("A1 makes Exams Room primary after the Final Mock", () => {
    render(
      <CourseCompletionConclusion
        level="A1"
        isComplete
        completedRequirements={19}
        totalRequirements={19}
        passedAssignments={19}
        totalAssignments={19}
      />,
    );

    expect(screen.getByRole("link", { name: "Continue to Exams Room" })).toHaveAttribute(
      "href",
      "/exams/overview",
    );
    expect(screen.getByRole("link", { name: "Official Goethe A1 Sample" })).toHaveAttribute(
      "href",
      "https://bfu.goethe.de/a1_sd1/hoeren.php",
    );
  });

  test.each([
    ["A2", "https://www.goethe.de/ins/gh/en/spr/prf/gzsd2/ueb.html"],
    ["B1", "https://bfu.goethe.de/b1_mod/lesen.php"],
    ["B2", "https://www.goethe.de/en/spr/prf/ueb/pb2.html"],
    ["C1", "https://www.goethe.de/en/spr/prf/ueb/pc1.html"],
    ["C2", "https://www.goethe.de/en/spr/prf/ueb/pc2.html"],
  ])("%s keeps official Goethe practice primary until its full mock flow is promoted", (level, sampleUrl) => {
    render(
      <CourseCompletionConclusion
        level={level}
        isComplete
        completedRequirements={28}
        totalRequirements={28}
        passedAssignments={28}
        totalAssignments={28}
      />,
    );

    expect(
      screen.getByRole("link", { name: `Open Official Goethe ${level} Exam Sample` }),
    ).toHaveAttribute("href", sampleUrl);
    expect(screen.getByRole("link", { name: "Go to Exams Room" })).toHaveAttribute(
      "href",
      "/exams/overview",
    );
  });

  test("an incomplete A2 course still exposes both practice destinations", () => {
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

    expect(
      screen.getByRole("link", { name: "Open Official Goethe A2 Exam Sample" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Go to Exams Room" })).toHaveAttribute(
      "href",
      "/exams/overview",
    );
  });

  test("the YouTube button no longer injects a duplicate completion handoff", () => {
    const source = read("YouTubeSubscribeButton.js");

    expect(source).not.toContain("CourseCompletionHandoff");
    expect(source).not.toContain("createPortal");
    expect(source).not.toContain("data-course-completion-handoff-host");
  });

  test("course-book normalization keeps A2 and B1 exam orientation as dedicated final sections", () => {
    const a2Patch = read("../../../scripts/patchA2LateWorkbookNativeOwnership.mjs");
    const presentationPatch = read("../../../scripts/patchCourseBookPresentationSections.mjs");

    expect(a2Patch).toContain('{ key: "a2-exam", title: "A2 Exam Orientation", days: "Day 29", firstDay: 29, lastDay: 29 }');
    expect(presentationPatch).toContain('{ key: "b1-exam", title: "B1 Exam Orientation", days: "Day 29", firstDay: 29, lastDay: 29 }');
    expect(presentationPatch).toContain('"B1 Exam Orientation"');
  });
});
