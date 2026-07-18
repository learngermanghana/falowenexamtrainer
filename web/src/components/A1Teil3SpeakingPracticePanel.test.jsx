import React from "react";
import { render, screen } from "@testing-library/react";
import A1Teil3SpeakingPracticePanel from "./A1Teil3SpeakingPracticePanel";

jest.mock("./SpeakingPage", () => (props) => (
  <div
    data-testid="speaking-page"
    data-level={props.lockedLevel}
    data-teil={props.lockedTeil}
    data-exam-only={String(Boolean(props.examOnly))}
    data-context-label={props.contextLabel}
  />
));

test("embeds the Goethe coach locked to A1 Teil 3", () => {
  render(<A1Teil3SpeakingPracticePanel />);

  const coach = screen.getByTestId("speaking-page");
  expect(coach).toHaveAttribute("data-level", "A1");
  expect(coach).toHaveAttribute("data-teil", "3");
  expect(coach).toHaveAttribute("data-exam-only", "true");
  expect(coach).toHaveAttribute("data-context-label", "Goethe A1 · Sprechen Teil 3");
  expect(screen.getByText(/locked to/i)).toBeInTheDocument();
});
