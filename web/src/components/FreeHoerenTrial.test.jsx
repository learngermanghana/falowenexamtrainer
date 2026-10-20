import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import ListeningPracticeSamplePage from "./ListeningPracticeSamplePage";
import { saveExamRoomResult } from "../services/examRoomResultService";
import { fetchFreeHoerenTrialAudio } from "../services/a1AudioService";

jest.mock("../context/AuthContext", () => ({ useAuth: () => ({ idToken: "" }) }));
jest.mock("../services/examRoomResultService", () => ({ saveExamRoomResult: jest.fn() }));
jest.mock("../services/a1AudioService", () => ({
  fetchA1MockAudioPlaybackUrl: jest.fn(),
  fetchFreeHoerenTrialAudio: jest.fn(),
}));
jest.mock("../services/a1ExamHorenAudioService", () => ({ fetchA1ExamHorenAudioPlaybackUrl: jest.fn() }));

test("free Hören shows the real A1 exam sample, offers public playback and converts only after all answers", async () => {
  fetchFreeHoerenTrialAudio.mockResolvedValue({url:"https://sample.example.test/teil-1.mp3"});
  const { container } = render(<MemoryRouter><ListeningPracticeSamplePage level="A1" sampleId="sample-1" freeTrial /></MemoryRouter>);
  expect(screen.getByText(/Kostenlose A1 Hören-Prüfung/)).toBeInTheDocument();
  expect(screen.getByText(/15 questions across Teil 1–3/)).toBeInTheDocument();
  expect(screen.getByText("Was kostet das Brot?")).toBeInTheDocument();
  expect(screen.getByText("Wann treffen sich Anna und Paul?")).toBeInTheDocument();
  expect(screen.getByText("Der Zug nach Hamburg fährt um 10.15 Uhr ab.")).toBeInTheDocument();
  expect(screen.queryByTestId("free-hoeren-conversion")).not.toBeInTheDocument();
  fireEvent.click(screen.getAllByRole("button",{name:"Load audio"})[0]);
  expect(fetchFreeHoerenTrialAudio).toHaveBeenCalledWith({part:"teil-1"});
  const inputs = Array.from(container.querySelectorAll('input[type="radio"]'));
  const questions = new Set(inputs.map(el => el.name));
  expect(questions.size).toBe(15);
  for (const name of questions) {
    const option = inputs.find(input => input.name === name);
    fireEvent.click(option);
  }
  fireEvent.click(screen.getByRole("button",{name:"Check answers"}));
  expect(screen.getByTestId("free-hoeren-conversion")).toBeInTheDocument();
  expect(screen.getByRole("link",{name:/Explore German classes/})).toHaveAttribute("href",expect.stringContaining("/classes/"));
  expect(screen.getByRole("link",{name:/Unlock exam preparation/})).toHaveAttribute("href","/mock/register?level=A1&source=free-hoeren");
  expect(saveExamRoomResult).not.toHaveBeenCalled();
  expect(screen.getByText(/not saved to a Falowen account/)).toBeInTheDocument();
});
