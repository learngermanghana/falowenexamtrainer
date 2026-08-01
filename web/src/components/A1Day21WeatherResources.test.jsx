import fs from "fs";
import path from "path";
import React from "react";
import { render, screen } from "@testing-library/react";
import A1Day21WeatherResources, {
  buildA1Day21WeatherResourceModels,
} from "./A1Day21WeatherResources";
import A1GrammarVideoCard from "./A1GrammarVideoCard";
import { buildA1AssignmentVideoModel } from "./A1WorkbookVideoHeader";

const shellSource = fs.readFileSync(
  path.resolve(__dirname, "A1TutorMarkedWorkbookShell.js"),
  "utf8",
);
const grammarSource = fs.readFileSync(
  path.resolve(__dirname, "A1WorkbookGrammarNotes.js"),
  "utf8",
);

describe("A1 Day 21 Weather resources", () => {
  test("keeps the teacher lecture and corrected Chapter 13 AI video", () => {
    const resources = buildA1Day21WeatherResourceModels();

    expect(resources.teacher).toEqual(
      expect.objectContaining({
        sourceUrl: "https://youtu.be/ijEY8XVrsZs",
        youtubeId: "ijEY8XVrsZs",
        embedUrl: "https://www.youtube-nocookie.com/embed/ijEY8XVrsZs",
      }),
    );
    expect(resources.ai).toEqual(
      expect.objectContaining({
        sourceUrl: "https://youtu.be/fRYM7ojc0Yo",
        youtubeId: "fRYM7ojc0Yo",
        embedUrl: "https://www.youtube-nocookie.com/embed/fRYM7ojc0Yo",
      }),
    );
  });

  test("renders both videos after the Falowen Radio step", () => {
    render(<A1Day21WeatherResources />);

    expect(
      screen.getByRole("region", { name: "A1 Day 21 lesson resources" }),
    ).toBeInTheDocument();
    expect(screen.getByTitle("Weather · Teacher lecture")).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/ijEY8XVrsZs",
    );
    expect(screen.getByTitle("A1 Day 21 · Weather · AI video")).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/fRYM7ojc0Yo",
    );
  });

  test("builds an embeddable AI video for the A1-13 Grammar tab", () => {
    const video = buildA1AssignmentVideoModel("A1-13");

    expect(video).toEqual(
      expect.objectContaining({
        sourceUrl: "https://youtu.be/fRYM7ojc0Yo",
        youtubeId: "fRYM7ojc0Yo",
        embedUrl: "https://www.youtube-nocookie.com/embed/fRYM7ojc0Yo",
      }),
    );

    render(<A1GrammarVideoCard assignmentKey="A1-13" />);
    expect(screen.getByTitle("Weather · AI grammar video")).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/fRYM7ojc0Yo",
    );
  });

  test("mounts the resources in the Day 21 Overview and Grammar views", () => {
    expect(shellSource).toContain(
      'assignment.assignmentKey === "A1-13" ? <A1Day21WeatherResources /> : null',
    );
    expect(grammarSource).toContain('normalizedAssignmentKey === "A1-13"');
    expect(grammarSource).toContain("<A1Day21WeatherResources />");
  });
});
