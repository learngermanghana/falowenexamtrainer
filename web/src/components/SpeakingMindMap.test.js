import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SpeakingMindMap from "./SpeakingMindMap";
import {
  a2SpeakingMindMaps,
  getA2SpeakingMindMap,
  validateSpeakingMindMapConfig,
} from "../data/speakingMindMaps/a2";

const config = getA2SpeakingMindMap(18);

test("renders a central question with one visible connection per branch", () => {
  render(<SpeakingMindMap config={config} />);

  expect(screen.getByTestId("mind-map-centre")).toHaveTextContent(
    config.centralQuestion,
  );
  expect(screen.getAllByTestId("mind-map-connection")).toHaveLength(
    config.branches.length,
  );
  expect(screen.getByText("Speaking goal: 45 seconds")).toBeInTheDocument();
});

test("selects a branch and shows its full speaking support", async () => {
  render(<SpeakingMindMap config={config} />);

  await userEvent.click(screen.getByRole("button", { name: /Daten/i }));

  expect(
    screen.getByRole("heading", { name: "Daten" }),
  ).toBeInTheDocument();
  expect(screen.getByText(config.branches[1].guidingQuestion)).toBeInTheDocument();
  expect(screen.getByText(config.branches[1].sentenceStarter)).toBeInTheDocument();
  expect(screen.getByText(config.branches[1].modelSentence)).toBeInTheDocument();
});

test("moves through the configured speaking route", async () => {
  render(<SpeakingMindMap config={config} />);

  await userEvent.click(screen.getByRole("button", { name: /Next branch/i }));

  expect(
    screen.getByRole("heading", { name: "Daten" }),
  ).toBeInTheDocument();
  expect(screen.getByText(/Route 2 \/ 5/i)).toBeInTheDocument();
});

test("handles missing configuration safely", () => {
  render(<SpeakingMindMap />);
  expect(
    screen.getByLabelText("Interactive brain map unavailable"),
  ).toBeInTheDocument();
});

test("declares a vertical connected mobile fallback", () => {
  render(<SpeakingMindMap config={config} />);
  expect(screen.getByTestId("mind-map-canvas")).toHaveAttribute(
    "data-mobile-layout",
    "vertical-connected",
  );
});

test("renders only one mind map root per component", () => {
  const { container } = render(<SpeakingMindMap config={config} />);
  expect(container.querySelectorAll("[data-speaking-mind-map]")).toHaveLength(1);
});

test("registry validates every A2 Teil 1 speaking mind map", () => {
  expect(a2SpeakingMindMaps).toHaveLength(27);
  expect(
    a2SpeakingMindMaps.map((entry) => entry.day).sort((a, b) => a - b),
  ).toEqual(Array.from({ length: 27 }, (_, index) => index + 2));
  a2SpeakingMindMaps.forEach((entry) =>
    expect(validateSpeakingMindMapConfig(entry)).toBe(true),
  );
});

test("registry validation rejects incomplete configuration", () => {
  expect(
    validateSpeakingMindMapConfig({ level: "A2", day: 99, branches: [] }),
  ).toBe(false);
});
