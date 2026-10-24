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
  test("shows the corrected AI lesson and leaves the unknown teacher lecture empty", () => {
    const { container } = render(<A1Day3SchreibenSprechenKapitel11WorkbookPage />);

    expect(A1_DAY3_PRACTICE_VIDEOS).toEqual([
      expect.objectContaining({
        key: "ai-lesson-video",
        youtubeId: "LdCVsY-SFTg",
        url: "https://youtu.be/LdCVsY-SFTg",
      }),
    ]);

    expect(screen.getByRole("heading", { name: "Supporting materials" })).toBeVisible();
    expect(screen.getByRole("link", { name: /Watch AI video/i })).toHaveAttribute(
      "href",
      "https://youtu.be/LdCVsY-SFTg",
    );
    expect(screen.queryByRole("link", { name: /Watch teacher video/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/DnfWKdi6DsA/i)).not.toBeInTheDocument();
    expect(container.querySelector('[data-self-learning-media-resource="ai"]')).toBeInTheDocument();
    expect(container.querySelector('[data-self-learning-media-resource="teacher"]')).not.toBeInTheDocument();
    expect(container.querySelector('[data-a1-workbook-owned-media="true"]')).toBeInTheDocument();
    expect(container.querySelector('[data-radio-first-workbook-gate="true"]')).toBeInTheDocument();
    expect(screen.getByTestId("legacy-workbook")).toBeVisible();
  });
});
