import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import B1Day16PruefungsangstStressbewaeltigungWorkbookPage, {
  B1_DAY16_PRUEFUNGSANGST_STRESSBEWAELTIGUNG_WORKBOOK_CONFIG,
} from "./B1Day16PruefungsangstStressbewaeltigungWorkbookPage";

jest.mock("./CourseInlinePracticePanel", () => () => null);
jest.mock("./AssignmentSubmissionPage", () => () => null);
jest.mock("./WorkbookReferenceAnswers", () => () => null);

describe("B1 Day 16 Hören video", () => {
  test("replaces the old Drive source with the approved YouTube resource", () => {
    expect(B1_DAY16_PRUEFUNGSANGST_STRESSBEWAELTIGUNG_WORKBOOK_CONFIG.listening).toEqual(
      expect.objectContaining({
        embedUrl: "https://www.youtube-nocookie.com/embed/XT5pZGgvMGk?rel=0&playsinline=1",
        externalUrl: "https://youtu.be/XT5pZGgvMGk",
      }),
    );

    expect(
      JSON.stringify(B1_DAY16_PRUEFUNGSANGST_STRESSBEWAELTIGUNG_WORKBOOK_CONFIG.listening),
    ).not.toContain("1FrNgfUChKDYLnd0pUO6-LnGppeHSet8E");
  });

  test("shows the listening embed only inside Teil 4", () => {
    render(
      <MemoryRouter>
        <B1Day16PruefungsangstStressbewaeltigungWorkbookPage />
      </MemoryRouter>,
    );

    const videoTitle = "B1 Day 16 Prüfungsangst und Stressbewältigung Hören";
    expect(screen.queryByTitle(videoTitle)).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: "Teil 4" }));

    expect(screen.getByTitle(videoTitle)).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/XT5pZGgvMGk?rel=0&playsinline=1",
    );
    expect(screen.getByRole("link", { name: "Open listening resource" })).toHaveAttribute(
      "href",
      "https://youtu.be/XT5pZGgvMGk",
    );

    fireEvent.click(screen.getByRole("tab", { name: "Teil 2" }));
    expect(screen.queryByTitle(videoTitle)).not.toBeInTheDocument();
  });
});
