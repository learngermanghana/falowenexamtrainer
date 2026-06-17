import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";

test("renders as one compact horizontal control", () => {
  const { container } = render(
    <SpeakingPracticeTimerCard targetSeconds={45} level="A2" />,
  );

  expect(screen.getByLabelText("Teil 1 speaking timer")).toBeInTheDocument();
  expect(screen.getByText("00:45")).toBeInTheDocument();
  expect(container.querySelectorAll("[data-compact-speaking-timer]")).toHaveLength(1);
  expect(screen.queryByText(/confidence timer/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/5 min/i)).not.toBeInTheDocument();
});

test("toggles between start and pause", async () => {
  render(<SpeakingPracticeTimerCard targetSeconds={45} level="A2" />);

  await userEvent.click(screen.getByRole("button", { name: /Start speaking timer/i }));
  expect(
    screen.getByRole("button", { name: /Pause speaking timer/i }),
  ).toBeInTheDocument();
});

test("uses the B1 target when level is supplied", () => {
  render(<SpeakingPracticeTimerCard level="B1" />);
  expect(screen.getByText("01:30")).toBeInTheDocument();
});
