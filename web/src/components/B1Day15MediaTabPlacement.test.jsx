import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import B1Day15MedienHomeofficeWorkbookPage from "./B1Day15MedienHomeofficeWorkbookPage";

jest.mock("./CourseInlinePracticePanel", () => () => null);
jest.mock("./AssignmentSubmissionPage", () => () => null);
jest.mock("./WorkbookReferenceAnswers", () => () => null);

describe("B1 Day 15 workbook media placement", () => {
  test("shows the Hören video only inside Teil 4 and no workbook-wide AI video", () => {
    render(
      <MemoryRouter>
        <B1Day15MedienHomeofficeWorkbookPage />
      </MemoryRouter>,
    );

    const videoTitle = "B1 Day 15 Medien und Arbeiten im Homeoffice Hören";

    expect(screen.queryByTitle(videoTitle)).not.toBeInTheDocument();
    expect(screen.queryByText("AI lesson video")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "Teil 4" }));

    expect(screen.getByTitle(videoTitle)).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/8_-AA6tpbUI?rel=0&playsinline=1",
    );
    expect(screen.getByRole("link", { name: "Open listening resource" })).toHaveAttribute(
      "href",
      "https://youtu.be/8_-AA6tpbUI",
    );
    expect(screen.queryByText("AI lesson video")).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "Teil 2" }));

    expect(screen.queryByTitle(videoTitle)).not.toBeInTheDocument();
  });
});
