import React from "react";
import { render, screen } from "@testing-library/react";
import SelfLearningSupportingMaterials from "./SelfLearningSupportingMaterials";

describe("SelfLearningSupportingMaterials", () => {
  test("uses the standard teacher-first then AI layout", () => {
    const { container } = render(
      <SelfLearningSupportingMaterials
        teacherVideo={{ url: "https://youtu.be/teacher", description: "Teacher explanation" }}
        aiVideo={{ url: "https://youtu.be/ai", description: "AI explanation" }}
      />,
    );

    const resources = Array.from(container.querySelectorAll("[data-self-learning-media-resource]"));
    expect(resources.map((resource) => resource.getAttribute("data-self-learning-media-resource"))).toEqual([
      "teacher",
      "ai",
    ]);
    expect(screen.getByRole("link", { name: "Watch teacher video" })).toHaveAttribute(
      "href",
      "https://youtu.be/teacher",
    );
    expect(screen.getByRole("link", { name: "Watch AI video" })).toHaveAttribute(
      "href",
      "https://youtu.be/ai",
    );
  });

  test("leaves the teacher slot empty when no teacher lecture is configured", () => {
    const { container } = render(
      <SelfLearningSupportingMaterials aiVideo={{ url: "https://youtu.be/ai-only" }} />,
    );

    expect(screen.queryByRole("link", { name: "Watch teacher video" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Watch AI video" })).toHaveAttribute(
      "href",
      "https://youtu.be/ai-only",
    );
    expect(container.querySelector('[data-self-learning-media-resource="teacher"]')).not.toBeInTheDocument();
  });
});
