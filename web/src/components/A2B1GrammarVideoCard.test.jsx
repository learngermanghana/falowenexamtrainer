import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import A2B1GrammarVideoCard, {
  A2_B1_GRAMMAR_VIDEO_ATTRIBUTE,
  getA2B1GrammarVideoModel,
} from "./A2B1GrammarVideoCard";
import { A2B1GrammarNotesTab } from "./A2B1WorkbookGrammarNotes";

const renderWithRouter = (ui) => render(<MemoryRouter>{ui}</MemoryRouter>);

describe("A2/B1 tutor grammar AI videos", () => {
  test("embeds the configured A2 AI video above the grammar notes", () => {
    renderWithRouter(<A2B1GrammarNotesTab level="A2" day={1} />);

    const card = document.querySelector(`[${A2_B1_GRAMMAR_VIDEO_ATTRIBUTE}="true"]`);
    expect(card).toBeVisible();
    expect(card).toBe(card.parentElement.firstElementChild);
    expect(card.nextElementSibling).not.toBeNull();
    expect(screen.getByTitle(/A2 Day 1.*AI grammar video/i)).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/HMEs3mEKdrk",
    );
  });

  test("resolves and embeds a B1 override AI video", () => {
    const model = getA2B1GrammarVideoModel("B1", 2);
    expect(model).toEqual(
      expect.objectContaining({
        level: "B1",
        day: 2,
        sourceUrl: "https://youtu.be/Skl0FjF5JBg",
        embedUrl: "https://www.youtube-nocookie.com/embed/Skl0FjF5JBg",
      }),
    );

    render(<A2B1GrammarVideoCard level="B1" day={2} />);
    expect(screen.getByTitle(/AI grammar video/i)).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/Skl0FjF5JBg",
    );
  });

  test("uses additional B1 AI resources without treating them as teacher lectures", () => {
    const model = getA2B1GrammarVideoModel("B1", 6);
    expect(model).toEqual(
      expect.objectContaining({
        sourceUrl: "https://youtu.be/5tGvAPq6hGk?si=uI_ODAT_A6_mZjG2",
        embedUrl: "https://www.youtube-nocookie.com/embed/5tGvAPq6hGk",
      }),
    );
    expect(model.videoResource.title).toMatch(/AI video/i);
  });

  test("does not add a video-only grammar section when grammar notes are unavailable", () => {
    renderWithRouter(<A2B1GrammarNotesTab level="B1" day={17} />);

    expect(document.querySelector(`[${A2_B1_GRAMMAR_VIDEO_ATTRIBUTE}="true"]`)).toBeNull();
    expect(screen.getByText(/Grammar notes have not been added/i)).toBeVisible();
  });
});
