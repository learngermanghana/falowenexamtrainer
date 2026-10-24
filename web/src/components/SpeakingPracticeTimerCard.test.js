import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";

test("starts with a compact five-minute timer and preset choices", () => {
  const { container } = render(<SpeakingPracticeTimerCard />);

  expect(screen.getByLabelText("Teil 1 speaking timer")).toBeInTheDocument();
  expect(screen.getByText("05:00")).toBeInTheDocument();
  expect(container.querySelectorAll("[data-compact-speaking-timer]")).toHaveLength(1);

  const durationSelect = screen.getByRole("combobox", {
    name: "Timer duration",
  });
  expect(durationSelect).toHaveValue("5");
  expect(screen.getByRole("option", { name: "10 min" })).toBeInTheDocument();
  expect(screen.getByRole("option", { name: "15 min" })).toBeInTheDocument();
  expect(screen.getByRole("option", { name: "20 min" })).toBeInTheDocument();
});

test("changes to a preset duration", async () => {
  render(<SpeakingPracticeTimerCard />);

  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Timer duration" }),
    "10",
  );

  expect(screen.getByText("10:00")).toBeInTheDocument();
});

test("accepts an editable custom duration", async () => {
  render(<SpeakingPracticeTimerCard />);

  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Timer duration" }),
    "custom",
  );
  const customInput = screen.getByRole("spinbutton", {
    name: "Custom timer minutes",
  });
  await userEvent.clear(customInput);
  await userEvent.type(customInput, "7");
  await userEvent.click(
    screen.getByRole("button", { name: "Set custom timer duration" }),
  );

  expect(screen.getByText("07:00")).toBeInTheDocument();
});

test("toggles between start and pause", async () => {
  render(<SpeakingPracticeTimerCard />);

  await userEvent.click(
    screen.getByRole("button", { name: /Start speaking timer/i }),
  );
  expect(
    screen.getByRole("button", { name: /Pause speaking timer/i }),
  ).toBeInTheDocument();
});

test("older short target values still use the new five-minute default", () => {
  render(<SpeakingPracticeTimerCard targetSeconds={45} level="A2" />);
  expect(screen.getByText("05:00")).toBeInTheDocument();
});
