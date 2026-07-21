import React from "react";
import { render, screen } from "@testing-library/react";
import A1Day3SchreibenSprechenKapitel11WorkbookPage, {
  A1_DAY3_PRACTICE_VIDEOS,
} from "./A1Day3SchreibenSprechenKapitel11WorkbookPage";

jest.mock(
  "./A1Day3SchreibenSprechenKapitel11WorkbookPageLegacy",
  () => function LegacyWorkbookProbe() {
    return <div data-testid="legacy-workbook">Workbook activities</div>;
  },
);

describe("A1 Day 3 Kapitel 1.1 practice workbook media", () => {
  test("keeps the AI lesson and teacher lecture visible inside the workbook", () => {
    const { container } = render(<A1Day3SchreibenSprechenKapitel11WorkbookPage />);

    expect(A1_DAY3_PRACTICE_VIDEOS).toEqual([
      expect.objectContaining({
        key: "ai-lesson-video",
        youtubeId: "DnfWKdi6DsA",
        url: "https://youtu.be/DnfWKdi6DsA",
      }),
      expect.objectContaining({
        key: "teacher-lecture-video",
        youtubeId: "LdCVsY-SFTg",
        url: "https://youtu.be/LdCVsY-SFTg",
      }),
    ]);

    expect(screen.getByRole("heading", { name: "Lesson videos" })).toBeVisible();
    expect(screen.getByTitle("Kapitel 1.1 AI lesson")).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/DnfWKdi6DsA",
    );
    expect(screen.getByTitle("Kapitel 1.1 teacher lecture")).toHaveAttribute(
      "src",
      "https://www.youtube-nocookie.com/embed/LdCVsY-SFTg",
    );
    expect(screen.getByRole("link", { name: /Open AI lesson video on YouTube/i })).toHaveAttribute(
      "href",
      "https://youtu.be/DnfWKdi6DsA",
    );
    expect(screen.getByRole("link", { name: /Open teacher lecture video on YouTube/i })).toHaveAttribute(
      "href",
      "https://youtu.be/LdCVsY-SFTg",
    );
    expect(container.querySelector('[data-a1-workbook-owned-media="true"]')).toBeInTheDocument();
    expect(container.querySelector('[data-radio-first-workbook-gate="true"]')).toBeInTheDocument();
    expect(screen.getByTestId("legacy-workbook")).toBeVisible();
  });
});
