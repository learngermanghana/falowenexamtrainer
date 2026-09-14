import React from "react";
import { render, screen } from "@testing-library/react";
import A1WorkbookMediaPanel, {
  getA1WorkbookMediaResources,
  shouldSuppressA1WorkbookAiVideo,
} from "./A1WorkbookMediaPanel";

describe("A1 workbook media regression policy", () => {
  test("Day 13 shows only the latest teacher lecture", () => {
    const resources = getA1WorkbookMediaResources({ day: 13, chapter: "3.5" });
    const teacherVideos = resources.filter((resource) => resource.kind === "teacher");

    expect(teacherVideos).toHaveLength(1);
    expect(teacherVideos[0].url).toBe("https://youtu.be/zizS5WdOYs8");
    expect(resources.map((resource) => resource.url)).not.toContain("https://youtu.be/eqSc_5p5uyQ");
  });

  test("Day 14 Kapitel 3.6 never restores an AI video from legacy lesson media", () => {
    expect(shouldSuppressA1WorkbookAiVideo(14, "3.6")).toBe(true);

    const resources = getA1WorkbookMediaResources({ day: 14, chapter: "3.6" });
    expect(resources.filter((resource) => resource.kind === "ai")).toEqual([]);

    const { container } = render(
      <A1WorkbookMediaPanel
        day={14}
        chapter="3.6"
        teacherVideo={{
          url: "https://youtu.be/0zps4OYwShg",
          title: "Modal Verbs · Teacher lecture",
        }}
        aiVideo={{
          url: "https://youtu.be/Wkj1-TnNUxY",
          title: "Modal Verbs · AI video",
        }}
      />,
    );

    expect(screen.getAllByText(/Teacher lecture/i).length).toBeGreaterThan(0);
    expect(screen.queryByText(/AI revision/i)).not.toBeInTheDocument();
    expect(container.innerHTML).not.toContain("Wkj1-TnNUxY");
  });
});
