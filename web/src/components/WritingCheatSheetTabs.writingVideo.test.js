import React from "react";
import { render, screen } from "@testing-library/react";
import WritingCheatSheetTabs from "./WritingCheatSheetTabs";

const WritingQuestion = () => <div data-testid="writing-question">Writing question and required points</div>;
const WritingEditor = () => <div data-testid="writing-editor">Writing editor</div>;

describe("WritingCheatSheetTabs writing videos", () => {
  test.each([
    ["B1", 1, "B1 Day 1 · Traumwelt · Writing explanation", "https://www.youtube.com/embed/nG1PUrvrS_s"],
    ["C1", 8, "C1 Day 8 · Wohnen und Stadtentwicklung · Writing explanation", "https://www.youtube.com/embed/VdczhJS9ClY"],
    ["C1", 9, "C1 Day 9 · Chapter 2.4 · Writing explanation", "https://www.youtube.com/embed/tpj8TV8DaH8"],
    ["C1", 11, "C1 Day 11 · Engagement und Ehrenamt · Schreiben explanation", "https://www.youtube.com/embed/Ww6gq3lmmpk"],
    ["C1", 12, "C1 Day 12 · Freizeit und Kultur · Schreiben explanation", "https://www.youtube.com/embed/0lWMEqPU6x4"],
  ])("shows the mapped %s Day %i video between the question and editor", (level, day, title, src) => {
    render(
      <WritingCheatSheetTabs level={level} day={day}>
        <WritingQuestion />
        <WritingEditor />
      </WritingCheatSheetTabs>,
    );

    expect(screen.queryByRole("tab", { name: "Writing Video" })).not.toBeInTheDocument();
    expect(screen.getByText("Watch before writing · Essay Ideas")).toBeInTheDocument();
    expect(screen.getByText("Get ideas for this exact essay")).toBeInTheDocument();
    expect(screen.getByTitle(title)).toHaveAttribute("src", src);

    const taskPanel = screen.getByRole("tabpanel", { name: "Schreiben Task" });
    const directChildren = Array.from(taskPanel.children);

    expect(directChildren[0]).toHaveAttribute("data-testid", "writing-question");
    expect(directChildren[1]).toHaveAttribute("data-writing-video-support", "true");
    expect(directChildren[2]).toHaveAttribute("data-testid", "writing-editor");
  });

  test.each([1, 2, 6, 8])("does not invent unpublished B2 Day %i writing videos", (day) => {
    render(
      <WritingCheatSheetTabs level="B2" day={day}>
        <WritingQuestion />
        <WritingEditor />
      </WritingCheatSheetTabs>,
    );
    expect(screen.queryByLabelText("Writing video and essay ideas")).not.toBeInTheDocument();
  });

  test("does not show a writing video for an unmapped assignment", () => {
    render(
      <WritingCheatSheetTabs level="B2" day={8}>
        <WritingQuestion />
        <WritingEditor />
      </WritingCheatSheetTabs>,
    );

    expect(screen.queryByRole("tab", { name: "Writing Video" })).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Writing video and essay ideas")).not.toBeInTheDocument();
  });
}
);
