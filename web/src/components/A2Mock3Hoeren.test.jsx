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

test("A2 Mock 3 Hören has all four parts, each with five questions and a /20 score", () => {
  const { container } = mount();
  expect(screen.getByText(/Hören Mock 3 — Teile 1 bis 4/)).toBeInTheDocument();
  expect(screen.getByText(/0\/20 Aufgaben beantwortet/)).toBeInTheDocument();
  expect(screen.getByText(/Was sollen die Fahrgäste der U-Bahn-Linie 2 tun/)).toBeInTheDocument();
  expect(container.querySelectorAll("fieldset")).toHaveLength(5);
  expect(screen.getByRole("button", { name: /Antworten zu allen vier Teilen prüfen/i })).toBeDisabled();
  fireEvent.click(screen.getByRole("button", { name:/Teil 2/i }));
  expect(screen.getByText(/Was macht Lukas am Montag um 18 Uhr/)).toBeInTheDocument();
  expect(container.querySelectorAll("fieldset")).toHaveLength(5);
  fireEvent.click(screen.getByRole("button", { name:/Teil 3/i }));
  expect(screen.getByText(/Was möchte die Kundin umtauschen/)).toBeInTheDocument();
  expect(screen.getByText(/Wo findet man die Bio-Äpfel/)).toBeInTheDocument();
  expect(container.querySelectorAll("img")).toHaveLength(6);
  fireEvent.click(screen.getByRole("button", { name:/Teil 4/i }));
  expect(screen.getByText(/Stefan hat vor seiner Arbeit/)).toBeInTheDocument();
  expect(container.querySelectorAll("fieldset")).toHaveLength(5);
  expect(screen.queryByText(/Hören-Übungsergebnis/)).not.toBeInTheDocument();
});

test.each(["teil-1","teil-2","teil-3","teil-4"])("%s fetches the matching canonical R2 audio object", async teil => {
  mount();
  const n = Number(teil.slice(-1));
  if (n !== 1) fireEvent.click(screen.getByRole("button", { name: new RegExp(`Teil ${n}`) }));
  fireEvent.click(screen.getByRole("button", { name: "Audio laden" }));
  await waitFor(() => expect(fetchA2MockAudioPlaybackUrl).toHaveBeenCalledWith({
    mockId: "mock-03", part: teil, key: `a2/mock-hoeren/mock-03/${teil}.mp3`,
    idToken: "secure-session-token",
  }));
  if (teil === "teil-4") expect(screen.getByText(/MP3 bereits zweimal enthalten/)).toBeInTheDocument();
});

test("student-specific Teil 3 answers survive adding Teile 1 and 2", async () => {
  localStorage.setItem(cache("a2-mock3-first"), JSON.stringify({11:"b",16:"richtig"}));
  const { container } = mount();
  expect(screen.getByText(/2\/20 Aufgaben beantwortet/)).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name:/Teil 3/i }));
  expect(container.querySelectorAll("input:checked")).toHaveLength(1);
  mockUid = "a2-mock3-second";
  // A different login must not inherit this device's previous selections.
  expect(localStorage.getItem(cache("a2-mock3-second"))).toBeNull();
});

test("four-part answers are isolated between students and remain a practice result", async () => {
  const { container, rerender } = mount();
  fireEvent.click(container.querySelector('input[name="a2mock3-1"][type="radio"]'));
  await waitFor(() => expect(JSON.parse(localStorage.getItem(cache("a2-mock3-first")))[1]).toBe("a"));
  mockUid = "a2-mock3-second";
  rerender(<MemoryRouter><A2Mock3Hoeren /></MemoryRouter>);
  await waitFor(() => expect(container.querySelectorAll("input:checked")).toHaveLength(0));
  expect(screen.getByText(/noch kein offizielles/i)).not.toBeInTheDocument();
  expect(screen.getByText(/keine vollständige A2-Prüfung/i)).not.toBeInTheDocument();
  expect(screen.getByText(/kein offizielles/i)).toBeInTheDocument();
});
