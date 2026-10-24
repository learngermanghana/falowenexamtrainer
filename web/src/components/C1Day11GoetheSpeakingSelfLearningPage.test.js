import React from "react";
import { render, screen } from "@testing-library/react";
import C1Day11GoetheSpeakingSelfLearningPage from "./C1Day11GoetheSpeakingSelfLearningPage";

jest.mock("./SpeakingPage", () => function SpeakingPageProbe({ mode }) {
  return <div data-testid="speaking-page" data-mode={mode}>Goethe speaking interface</div>;
});

jest.mock("./C1Day11EngagementUndEhrenamtWorkbookPage", () => function WorkbookProbe() {
  return <div data-testid="c1-day11-workbook">C1 Day 11 workbook</div>;
});

describe("C1 Day 11 self-learning speaking page", () => {
  test("restores the embedded Goethe speaking interface and keeps the workbook", () => {
    const { container } = render(<C1Day11GoetheSpeakingSelfLearningPage />);

    expect(screen.getByRole("heading", { name: /Practise Engagement und Ehrenamt/i })).toBeVisible();
    expect(screen.getByTestId("speaking-page")).toHaveAttribute("data-mode", "exam");
    expect(screen.getByTestId("c1-day11-workbook")).toBeVisible();
    expect(container.querySelector('[data-c1-day11-speaking-ui="embedded"]')).toBeInTheDocument();
  });
});
