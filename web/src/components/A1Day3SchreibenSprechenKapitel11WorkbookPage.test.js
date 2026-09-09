import React from "react";
import { render, screen } from "@testing-library/react";
import A1Day3SchreibenSprechenKapitel11WorkbookPage, {
  A1_DAY3_KAPITEL11_TEACHER_VIDEO,
  A1_DAY3_PRACTICE_VIDEOS,
} from "./A1Day3SchreibenSprechenKapitel11WorkbookPage";

jest.mock(
  "./A1Day3SchreibenSprechenKapitel11WorkbookPageLegacy",
  () => function LegacyWorkbookProbe() {
    return <div data-testid="legacy-workbook">Workbook activities</div>;
  },
);

describe("A1 Day 3 Kapitel 1.1 practice workbook media", () => {
  test("shows the requested teacher lecture alongside the AI lesson", () => {
    const { container } = render(<A1Day3SchreibenSprechenKapitel11WorkbookPage />);

    expect(A1_DAY3_KAPITEL11_TEACHER_VIDEO).toEqual(
      expect.objectContaining({
        chapter: "1.1",
        url: "https://youtu.be/Ygbpt6yC_f4",
      }),
    );
    expect(A1_DAY3_PRACTICE_VIDEOS).toEqual([
      expect.objectContaining({
        key: "ai-lesson-video",
        youtubeId: "LdCVsY-SFTg",
        url: "https://youtu.be/LdCVsY-SFTg",
      }),
    ]);

    expect(screen.getByRole("heading", { name: "Supporting materials" })).toBeVisible();
    expect(screen.getByRole("link", { name: /Watch teacher video/i })).toHaveAttribute(
      "href",
      "https://youtu.be/Ygbpt6yC_f4",
    );
    expect(screen.getByRole("link", { name: /Watch AI video/i })).toHaveAttribute(
      "href",
      "https://youtu.be/LdCVsY-SFTg",
    );
    expect(container.querySelector('[data-self-learning-media-resource="teacher"]')).toBeInTheDocument();
    expect(container.querySelector('[data-self-learning-media-resource="ai"]')).toBeInTheDocument();
    expect(container.querySelector('[data-a1-workbook-owned-media="true"]')).toBeInTheDocument();
    expect(container.querySelector('[data-radio-first-workbook-gate="true"]')).toBeInTheDocument();
    expect(screen.getByTestId("legacy-workbook")).toBeVisible();
  });
});
