import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import A2Mock3Hoeren from "./A2Mock3Hoeren";
import { fetchA2MockAudioPlaybackUrl } from "../services/a2AudioService";

let mockUid = "a2-mock3-first";
jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ user: { uid: mockUid }, idToken: "secure-session-token" }),
}));
jest.mock("../services/a2AudioService", () => ({
  fetchA2MockAudioPlaybackUrl: jest.fn(),
}));
jest.mock("./navigation/AppBackButton", () => () => <div>Zurück</div>);
const mount = () => render(<MemoryRouter><A2Mock3Hoeren /></MemoryRouter>);
const cache = uid => `falowen:a2:mock-03:hoeren-teile-3-4:${uid}:v1`;

beforeEach(() => {
  localStorage.clear();
  mockUid = "a2-mock3-first";
  fetchA2MockAudioPlaybackUrl.mockReset().mockResolvedValue({url:"https://example.com/test.mp3"});
});

test("Teil 3 has the newly recorded five dialogues, picture choices and no premature results", () => {
  const { container } = mount();
  expect(screen.getByText(/Hören Mock 3 — Teile 3 und 4/)).toBeInTheDocument();
  expect(screen.getByText(/Um wie viel Uhr schließt das Geschäft heute/)).toBeInTheDocument();
  expect(screen.getByText(/Wann treffen sich die beiden morgen/)).toBeInTheDocument();
  expect(screen.getByText(/Was möchte die Kundin umtauschen/)).toBeInTheDocument();
  expect(screen.getByText(/Wo findet man die Bio-Äpfel/)).toBeInTheDocument();
  expect(screen.getByText(/Bis wann ist die Zahnarztpraxis am Mittwoch geöffnet/)).toBeInTheDocument();
  expect(container.querySelectorAll("fieldset")).toHaveLength(5);
  expect(container.querySelectorAll("img")).toHaveLength(6);
  expect(screen.getByRole("button", { name: /Antworten zu Teile 3 und 4 prüfen/i })).toBeDisabled();
  expect(screen.queryByText(/Übungsergebnis/)).not.toBeInTheDocument();
});

test("Teil 4 has five independent Richtig/Falsch choices and fetches canonical R2 object", async () => {
  mount();
  fireEvent.click(screen.getByRole("button", { name: /Teil 4/i }));
  expect(screen.getByText(/Stefan hat vor seiner Arbeit/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: "Audio laden" }));
  await waitFor(() => expect(fetchA2MockAudioPlaybackUrl).toHaveBeenCalledWith({
    mockId: "mock-03", part: "teil-4",
    key: "a2/mock-hoeren/mock-03/teil-4.mp3",
    idToken: "secure-session-token",
  }));
  expect(screen.getByText(/MP3 bereits zweimal enthalten/)).toBeInTheDocument();
});

test("answers are isolated by student id and are not a verified full mock result", async () => {
  const { container, rerender } = mount();
  fireEvent.click(container.querySelector('input[name="a2mock3-11"][type="radio"]'));
  await waitFor(() => expect(JSON.parse(localStorage.getItem(cache("a2-mock3-first")))[11]).toBe("a"));
  mockUid = "a2-mock3-second";
  rerender(<MemoryRouter><A2Mock3Hoeren /></MemoryRouter>);
  await waitFor(() => expect(container.querySelectorAll('input[type="radio"]:checked')).toHaveLength(0));
  expect(screen.getByText(/noch keine vollständige A2-Prüfung/i)).toBeInTheDocument();
});
