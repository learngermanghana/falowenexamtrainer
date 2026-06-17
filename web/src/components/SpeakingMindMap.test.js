import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SpeakingMindMap from "./SpeakingMindMap";
import { a2SpeakingMindMaps, getA2SpeakingMindMap, validateSpeakingMindMapConfig } from "../data/speakingMindMaps/a2";

const config = getA2SpeakingMindMap(18);

test("renders shared A2 speaking mind map and selects branch details", async () => {
  render(<SpeakingMindMap config={config} />);
  expect(screen.getByText(config.centralQuestion)).toBeInTheDocument();
  expect(screen.getByText("Speaking goal: 45 seconds")).toBeInTheDocument();

  await userEvent.click(screen.getByRole("button", { name: /Daten/i }));
  expect(screen.getByText(/Selected branch: Daten/i)).toBeInTheDocument();
  expect(screen.getByText(config.branches[1].modelSentence)).toBeInTheDocument();
});

test("moves through the configured speaking route", async () => {
  render(<SpeakingMindMap config={config} />);
  await userEvent.click(screen.getByRole("button", { name: /Next branch/i }));
  expect(screen.getByText(/Selected branch: Daten/i)).toBeInTheDocument();
});

test("handles missing configuration safely", () => {
  render(<SpeakingMindMap />);
  expect(screen.getByLabelText("Interactive brain map unavailable")).toBeInTheDocument();
});

test("uses mobile-friendly responsive branch layout", () => {
  render(<SpeakingMindMap config={config} />);
  expect(screen.getByRole("button", { name: /Grund/i }).parentElement).toHaveStyle("grid-template-columns: repeat(auto-fit, minmax(150px, 1fr))");
});

test("registry validates every A2 Teil 1 speaking mind map", () => {
  expect(a2SpeakingMindMaps).toHaveLength(27);
  expect(a2SpeakingMindMaps.map((entry) => entry.day).sort((a, b) => a - b)).toEqual(Array.from({ length: 27 }, (_, index) => index + 2));
  a2SpeakingMindMaps.forEach((entry) => expect(validateSpeakingMindMapConfig(entry)).toBe(true));
});

test("registry validation rejects incomplete configuration", () => {
  expect(validateSpeakingMindMapConfig({ level: "A2", day: 99, branches: [] })).toBe(false);
});
