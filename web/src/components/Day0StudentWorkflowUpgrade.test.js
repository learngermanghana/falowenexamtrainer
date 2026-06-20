import React from "react";
import { render, screen } from "@testing-library/react";
import Day0StudentWorkflowUpgrade, { DAY0_PATH_CONFIG } from "./Day0StudentWorkflowUpgrade";

describe("Day 0 student workflow", () => {
  test("supports A1, A2, B1, B2 and C1 orientation routes", () => {
    expect(DAY0_PATH_CONFIG.map((item) => item.level)).toEqual(["A1", "A2", "B1", "B2", "C1"]);
  });

  test("shows the native workbook submission flow for A2", () => {
    render(
      <Day0StudentWorkflowUpgrade pathname="/campus/course/a2-day-0-orientation-and-knowledge-test-workbook" />
    );

    expect(screen.getByText("A2 Day 0 Orientation")).toBeInTheDocument();
    expect(screen.getByText(/Teil 1 → Teil 2 → Teil 3 → Teil 4 → Ref → Submit/)).toBeInTheDocument();
    expect(screen.getByText("Submit Assignment")).toBeInTheDocument();
  });

  test("shows the self-learning Write and Analyse workflow for B2", () => {
    render(
      <Day0StudentWorkflowUpgrade pathname="/campus/course/b2-day-0-self-learning-orientation-workbook" />
    );

    expect(screen.getByText("B2 Day 0 Orientation")).toBeInTheDocument();
    expect(screen.getByText(/Write\/Analyse → Ref → Self-mark progress/)).toBeInTheDocument();
    expect(screen.getByText(/B2 is a self-learning path/)).toBeInTheDocument();
  });
});
