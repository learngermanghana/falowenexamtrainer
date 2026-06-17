import React, { useState } from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SpeakingMindMap from "./SpeakingMindMap";
import SpeakingPracticeTimerCard from "./SpeakingPracticeTimerCard";
import { getA2SpeakingMindMap } from "../data/speakingMindMaps/a2";
import {
  readSpeakingProgress,
  writeSpeakingProgress,
} from "../services/speakingProgressStorage";

const config = getA2SpeakingMindMap(18);

beforeEach(() => {
  window.localStorage.clear();
});

test("restores the selected branch and speaking route position", async () => {
  const scope = "branch-memory-test";
  const firstRender = render(
    <SpeakingMindMap config={config} progressScope={scope} />,
  );

  await userEvent.click(screen.getByRole("button", { name: /Daten/i }));
  expect(screen.getByRole("heading", { name: "Daten" })).toBeInTheDocument();
  expect(readSpeakingProgress(scope)).toMatchObject({
    selectedBranchId: config.branches[1].id,
    routeIndex: 1,
  });
  firstRender.unmount();

  render(<SpeakingMindMap config={config} progressScope={scope} />);
  expect(screen.getByRole("heading", { name: "Daten" })).toBeInTheDocument();
  expect(screen.getByText("2/5")).toBeInTheDocument();
});

test("restores whether extra speaking help was open", async () => {
  const scope = "help-memory-test";
  const firstRender = render(
    <SpeakingMindMap config={config} progressScope={scope} />,
  );

  await userEvent.click(
    screen.getByRole("button", { name: "More speaking help" }),
  );
  expect(readSpeakingProgress(scope)).toMatchObject({ helpOpen: true });
  firstRender.unmount();

  render(<SpeakingMindMap config={config} progressScope={scope} />);
  expect(
    screen.getByRole("button", { name: "Hide extra speaking help" }),
  ).toHaveAttribute("aria-expanded", "true");
});

test("restores the prepared checkbox", async () => {
  const scope = "prepared-memory-test";
  const PreparedHarness = () => {
    const [checked, setChecked] = useState(false);
    return (
      <div>
        <SpeakingMindMap config={config} progressScope={scope} />
        <label>
          <input
            type="checkbox"
            checked={checked}
            onChange={(event) => setChecked(event.target.checked)}
          />
          I prepared this part.
        </label>
      </div>
    );
  };

  const firstRender = render(<PreparedHarness />);
  await userEvent.click(screen.getByRole("checkbox"));
  expect(readSpeakingProgress(scope)).toMatchObject({ prepared: true });
  firstRender.unmount();

  render(<PreparedHarness />);
  await waitFor(() => expect(screen.getByRole("checkbox")).toBeChecked());
});

test("restores a selected timer preset", async () => {
  const scope = "timer-preset-memory-test";
  const firstRender = render(
    <SpeakingPracticeTimerCard progressScope={scope} />,
  );

  await userEvent.selectOptions(
    screen.getByRole("combobox", { name: "Timer duration" }),
    "15",
  );
  expect(screen.getByText("15:00")).toBeInTheDocument();
  firstRender.unmount();

  render(<SpeakingPracticeTimerCard progressScope={scope} />);
  expect(screen.getByText("15:00")).toBeInTheDocument();
  expect(
    screen.getByRole("combobox", { name: "Timer duration" }),
  ).toHaveValue("15");
});

test("restores an editable custom timer duration", () => {
  const scope = "timer-custom-memory-test";
  writeSpeakingProgress(scope, {
    timerMinutes: 7,
    timerChoice: "custom",
    customTimerMinutes: 7,
  });

  render(<SpeakingPracticeTimerCard progressScope={scope} />);
  expect(screen.getByText("07:00")).toBeInTheDocument();
  expect(
    screen.getByRole("combobox", { name: "Timer duration" }),
  ).toHaveValue("custom");
  expect(
    screen.getByRole("spinbutton", { name: "Custom timer minutes" }),
  ).toHaveValue(7);
});
