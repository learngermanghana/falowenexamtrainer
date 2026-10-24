import React from "react";
import { render, screen } from "@testing-library/react";
import WritingCheatSheetTabs from "./WritingCheatSheetTabs";

describe("requested B1 Day 8 and B2 Day 7 Write-page videos", () => {
  test.each([
    ["B1", 8, "B1 Day 8 · Gesundheit · Schreiben explanation", "https://www.youtube.com/embed/kGQWOEfhP-k"],
    ["B2", 7, "B2 Day 7 · Gesellschaftliche Vielfalt · Schreiben explanation", "https://www.youtube.com/embed/pzvyE35CZbI"],
  ])("renders %s Day %i inside the Schreiben task", (level, day, title, embedUrl) => {
    const { container } = render(
      <WritingCheatSheetTabs level={level} day={day}>
        <div>Writing prompt</div>
        <div>Writing workspace</div>
      </WritingCheatSheetTabs>,
    );

    expect(screen.getByText("Writing prompt")).toBeVisible();
    expect(screen.getByText(title)).toBeVisible();
    expect(screen.getByLabelText("Writing video and essay ideas")).toBeVisible();

    const iframe = container.querySelector("iframe");
    expect(iframe).toHaveAttribute("src", embedUrl);
    expect(iframe).toHaveAttribute("title", title);
  });
});