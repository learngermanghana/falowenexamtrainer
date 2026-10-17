import React from "react";
import { render, screen } from "@testing-library/react";
import AutomaticMarkingStatus from "./AutomaticMarkingStatus";
test("shows saved-work reassurance while marking and a result link when ready", () => {
  const { rerender } = render(<AutomaticMarkingStatus />);
  expect(screen.getByRole("status")).toHaveTextContent("Marking your work");
  rerender(<AutomaticMarkingStatus result={{ markingStatus: "marked", finalScore: 85, aiFeedback: "Check the verb ending." }} />);
  expect(screen.getByRole("status")).toHaveTextContent("85/100");
  expect(screen.getByText("Check the verb ending.")).toBeInTheDocument();
  expect(screen.getByRole("link")).toHaveAttribute("href", "/campus/results");
});
test("review and delayed states never display an invented score", () => {
  const { rerender } = render(<AutomaticMarkingStatus result={{ markingStatus: "needs_review" }} />);
  expect(screen.getByRole("status")).toHaveTextContent("tutor review");
  expect(screen.queryByRole("link")).not.toBeInTheDocument();
  rerender(<AutomaticMarkingStatus delayed />);
  expect(screen.getByRole("status")).toHaveTextContent("check Results later");
});
