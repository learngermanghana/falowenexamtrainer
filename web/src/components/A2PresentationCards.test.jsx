import React from "react";
import { render, screen, within, cleanup } from "@testing-library/react";
import SpeakingMindMap from "./SpeakingMindMap";
import SmallTalkWorkbook from "./A2Day2SmallTalkWorkbookEnhancedPage";
import CityWorkbook from "./A2Day10TourismusTraditionelleFesteWorkbookPage";
import RestaurantWorkbook from "./A2Day8RezepteUndEssenWorkbookPage";

jest.mock("./A2StandardTabbedWorkbookPage", () => ({ sprechenContent }) => <div>{sprechenContent}</div>);
import { A2_PRESENTATION_CARDS } from "../data/a2PresentationCards";
import { getA2SpeakingMindMap, validateSpeakingMindMapConfig } from "../data/speakingMindMaps/a2";

afterEach(cleanup);

test.each(Array.from({ length: 28 }, (_, i) => i + 1))("Day %i displays an individual task and all four cues before opening branches", (day) => {
  const config = getA2SpeakingMindMap(day);
  const card = A2_PRESENTATION_CARDS[day];
  expect(validateSpeakingMindMapConfig(config)).toBe(true);
  expect(card.keywords).toHaveLength(4);
  expect(new Set(card.keywords).size).toBe(4);
  expect(config.branches.map(b => b.label)).toEqual(card.keywords);
  render(<SpeakingMindMap config={config} />);
  const task = within(screen.getByRole("region", { name: "A2 presentation task" }));
  expect(task.getByText(card.prompt)).toBeVisible();
  expect(task.getByText(card.instruction)).toBeVisible();
  for (const keyword of card.keywords) expect(screen.getByRole("region", { name: "A2 presentation task" })).toHaveTextContent(keyword);
  expect(screen.getByText(card.branches.map(b => b.modelSentence).join(" "))).toBeInTheDocument();
  expect(card.prompt).not.toMatch(/^Kannst du/);
  config.branches.forEach(b => {
    expect(b.sentenceStarter).not.toMatch(/^Bei .* sage ich/);
    expect(b.modelSentence).not.toMatch(/einen einfachen Satz zum Thema/);
  });
});

test("Small Talk has a personal introduction rather than dialogue instructions", () => {
  const config = getA2SpeakingMindMap(1);
  expect(config.centralQuestion).toBe("Wer bist du?");
  expect(config.presentation.keywords).toEqual(["Name und Herkunft", "Familie und Wohnort", "Sprachen und Beruf", "Freizeit"]);
  render(<SpeakingMindMap config={config} />);
  expect(screen.queryByText(/Small Talk ist kein langer Vortrag/)).not.toBeInTheDocument();
});

test("the legacy Small Talk route uses the canonical presentation once", () => {
  render(<SmallTalkWorkbook />);
  expect(screen.getAllByRole("region", { name: "A2 presentation task" })).toHaveLength(1);
  expect(screen.getByTestId("mind-map-centre")).toHaveTextContent("Wer bist du?");
  expect(screen.queryByText(/Kannst du ein kurzes Small-Talk-Gespräch/)).not.toBeInTheDocument();
  expect(screen.queryByText(/Small Talk ist kein langer Vortrag/)).not.toBeInTheDocument();
});

test("restaurant practice includes a presentation followed by a separate dialogue activity", () => {
  render(<RestaurantWorkbook />);
  expect(screen.getByRole("region", { name: "A2 presentation task" })).toHaveTextContent("Was machst du, wenn du ins Restaurant gehst?");
  expect(screen.getByText("Restaurant-Rollenspiel")).toBeInTheDocument();
  expect(screen.getByText(/Eine Person ist Gast/)).toBeInTheDocument();
});

test("Day 10 presentation page imports and renders without undefined style references", () => {
  render(<CityWorkbook />);
  expect(screen.getByRole("region", { name: "A2 presentation task" })).toHaveTextContent("Welche Stadt möchtest du kennenlernen?");
});
