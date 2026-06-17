import { fireEvent, render, screen } from "@testing-library/react";
import SpeakingMindMap from "./SpeakingMindMap";
import {
  a2Day9UrlaubSpeakingMindMap,
  b2Day1IdentitySpeakingMindMap,
} from "../../data/speakingMindMaps/pilotSpeakingMindMaps";

describe("SpeakingMindMap", () => {
  it("renders the central question and level-appropriate branches", () => {
    render(<SpeakingMindMap config={a2Day9UrlaubSpeakingMindMap} />);

    expect(
      screen.getByText("Wohin reist du gern und warum?"),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Reiseziel/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Unterkunft/i })).toBeInTheDocument();
    expect(screen.getByText(/Ziel: 45 Sek\./i)).toBeInTheDocument();
  });

  it("opens a branch and shows its prompt, example and starter", () => {
    render(<SpeakingMindMap config={b2Day1IdentitySpeakingMindMap} />);

    fireEvent.click(screen.getByRole("button", { name: /Online und offline/i }));

    expect(
      screen.getByText(/Warum unterscheidet sich das Selbstbild online/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/In sozialen Medien zeigen Menschen häufig/i),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Zwischen meiner Online-Präsenz und meinem Alltag/i),
    ).toBeInTheDocument();
  });

  it("shows a recommended speaking route", () => {
    render(<SpeakingMindMap config={b2Day1IdentitySpeakingMindMap} />);

    expect(screen.getByText(/Empfohlener Sprechweg/i)).toBeInTheDocument();
    expect(screen.getByText(/Selbstbild erklären → Werte nennen/i)).toBeInTheDocument();
  });
});
