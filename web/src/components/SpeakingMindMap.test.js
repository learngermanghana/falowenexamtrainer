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
  expect(screen.queryByText(/Speaking goal:/i)).not.toBeInTheDocument();
});

test("selects a branch and shows compact speaking support", async () => {
  render(<SpeakingMindMap config={config} />);

  await userEvent.click(screen.getByRole("button", { name: /Daten/i }));

  expect(
    screen.getByRole("heading", { name: "Daten" }),
  ).toBeInTheDocument();
  expect(screen.getByText(config.branches[1].guidingQuestion)).toBeInTheDocument();
  expect(screen.getByText(config.branches[1].sentenceStarter)).toBeInTheDocument();
  expect(screen.getByText("Show model sentence")).toBeInTheDocument();
  expect(screen.getByText(config.branches[1].modelSentence)).toBeInTheDocument();
});

test("moves through the configured speaking route", async () => {
  render(<SpeakingMindMap config={config} />);

  await userEvent.click(screen.getByRole("button", { name: /^Next$/i }));

  expect(
    screen.getByRole("heading", { name: "Daten" }),
  ).toBeInTheDocument();
  expect(screen.getByText("2/5")).toBeInTheDocument();
});

test("starts A2 focus mode collapsed and opens extra speaking help", async () => {
  const { container } = render(<SpeakingMindMap config={config} />);
  const root = container.querySelector("[data-speaking-mind-map]");

  expect(root).toHaveAttribute("data-focus-mode", "true");
  expect(root).toHaveAttribute("data-help-open", "false");
  expect(
    screen.getByRole("button", { name: "More speaking help" }),
  ).toHaveAttribute("aria-expanded", "false");

  await userEvent.click(
    screen.getByRole("button", { name: "More speaking help" }),
  );

  expect(root).toHaveAttribute("data-help-open", "true");
  expect(
    screen.getByRole("button", { name: "Hide extra speaking help" }),
  ).toHaveAttribute("aria-expanded", "true");
});

test("allows focus mode to be disabled for advanced layouts", () => {
  const advancedConfig = {
    ...config,
    level: "B2",
    focusMode: false,
  };
  const { container } = render(<SpeakingMindMap config={advancedConfig} />);

  expect(
    container.querySelector("[data-speaking-mind-map]"),
  ).toHaveAttribute("data-focus-mode", "false");
  expect(
    screen.queryByRole("button", { name: "More speaking help" }),
  ).not.toBeInTheDocument();
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

test("registry validates every A2 Teil 1 speaking mind map from Day 1 to Day 28", () => {
  expect(a2SpeakingMindMaps).toHaveLength(28);
  expect(
    a2SpeakingMindMaps.map((entry) => entry.day).sort((a, b) => a - b),
  ).toEqual(Array.from({ length: 28 }, (_, index) => index + 1));
  a2SpeakingMindMaps.forEach((entry) =>
    expect(validateSpeakingMindMapConfig(entry)).toBe(true),
  );
});

test("A2 Days 1 to 8 use topic-specific prompts instead of the generic template", () => {
  const earlyMaps = Array.from({ length: 8 }, (_, index) =>
    getA2SpeakingMindMap(index + 1),
  );

  expect(earlyMaps[0]).toEqual(
    expect.objectContaining({
      day: 1,
      title: "Small Talk",
      centralQuestion: "Wie führst du ein kurzes freundliches Gespräch?",
    }),
  );

  earlyMaps.forEach((entry) => {
    expect(validateSpeakingMindMapConfig(entry)).toBe(true);
    entry.branches.forEach((branch) => {
      expect(branch.guidingQuestion).not.toMatch(/^Was sagst du über/i);
      expect(branch.sentenceStarter).not.toMatch(/^Bei .+ sage ich:/i);
      expect(branch.modelSentence).not.toContain(
        "einen einfachen Satz zum Thema",
      );
    });
  });
});

test("registry validation rejects incomplete configuration", () => {
  expect(
    validateSpeakingMindMapConfig({ level: "A2", day: 99, branches: [] }),
  ).toBe(false);
});
