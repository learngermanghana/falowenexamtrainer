import React from "react";
import { render, screen } from "@testing-library/react";
import WritingCheatSheetTabs from "./WritingCheatSheetTabs";

describe("B2 Day 4 Write-page video", () => {
  test("renders the approved Schreiben video inside the writing task", () => {
    const { container } = render(
      <WritingCheatSheetTabs level="B2" day={4}>
        <div>Chapter 1.4 writing prompt</div>
        <div>Writing workspace</div>
      </WritingCheatSheetTabs>,
    );

    expect(screen.getByText("Chapter 1.4 writing prompt")).toBeVisible();
    expect(screen.getByText("B2 Day 4 · Bildung und Lernen · Schreiben explanation")).toBeVisible();
    expect(screen.getByLabelText("Writing video and essay ideas")).toBeVisible();

    const iframe = container.querySelector("iframe");
    expect(iframe).toHaveAttribute("src", "https://www.youtube.com/embed/ltTxYa_T2xc");
    expect(iframe).toHaveAttribute(
      "title",
      "B2 Day 4 · Bildung und Lernen · Schreiben explanation",
    );
  });
});
