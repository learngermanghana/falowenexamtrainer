import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import A1GrammarVideoCard from "./A1GrammarVideoCard";
import A1WorkbookGrammarNotes from "./A1WorkbookGrammarNotes";

describe("A1 tutor-marked grammar video", () => {
  test("embeds the assignment AI video inside the grammar notes", () => {
    render(<A1GrammarVideoCard assignmentKey="A1-8" />);

    expect(screen.getByRole("heading", { name: "Watch before reading the grammar notes" })).toBeVisible();
    expect(screen.getByTitle(/24 Hour Clock · AI grammar video/i)).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/ZE24QSbGaSo",
    );
  });

  test("places the video before the written grammar content", () => {
    const { container } = render(
      <MemoryRouter>
        <A1WorkbookGrammarNotes assignmentKey="A1-0.1" />
      </MemoryRouter>,
    );
    const video = container.querySelector('[data-a1-grammar-video="true"]');

    expect(video).toBeVisible();
    expect(video).toBe(container.firstElementChild.firstElementChild);
    expect(video.nextElementSibling).not.toBeNull();
  });
});
