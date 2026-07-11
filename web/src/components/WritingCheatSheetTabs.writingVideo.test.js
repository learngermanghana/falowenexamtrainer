import React from "react";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import WritingCheatSheetTabs from "./WritingCheatSheetTabs";

const TaskContent = () => <div>Writing task content</div>;

describe("WritingCheatSheetTabs writing videos", () => {
  test.each([
    ["B1", 1, "B1 Day 1 · Traumwelt · Writing explanation", "https://www.youtube.com/embed/nG1PUrvrS_s"],
    ["B2", 1, "B2 Day 1 · Persönliche Identität · Writing explanation", "https://www.youtube.com/embed/w8TaNHk-a0U"],
    ["C1", 8, "C1 Day 8 · Wohnen und Stadtentwicklung · Writing explanation", "https://www.youtube.com/embed/VdczhJS9ClY"],
  ])("shows the mapped %s Day %i writing video", (level, day, title, src) => {
    render(
      <WritingCheatSheetTabs level={level} day={day}>
        <TaskContent />
      </WritingCheatSheetTabs>,
    );

    const videoTab = screen.getByRole("tab", { name: "Writing Video" });
    expect(videoTab).toHaveAttribute("aria-selected", "false");

    userEvent.click(videoTab);

    expect(videoTab).toHaveAttribute("aria-selected", "true");
    expect(screen.getByTitle(title)).toHaveAttribute("src", src);
  });

  test("does not show a writing video tab for an unmapped assignment", () => {
    render(
      <WritingCheatSheetTabs level="B2" day={2}>
        <TaskContent />
      </WritingCheatSheetTabs>,
    );

    expect(screen.queryByRole("tab", { name: "Writing Video" })).not.toBeInTheDocument();
  });
});
