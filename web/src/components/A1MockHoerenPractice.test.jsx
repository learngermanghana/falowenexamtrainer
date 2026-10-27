import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import HorenPage from "./HorenPage";
import { fetchA1MockAudioPlaybackUrl } from "../services/a1AudioService";
import { scoreA1HoerenPractice } from "../services/a1HoerenPracticeService";

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ idToken: "student-token" }),
}));
jest.mock("../context/ExamContext", () => ({
  useExam: () => ({ level: "A1" }),
}));
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: value => value }),
}));
jest.mock("../services/a1AudioService", () => ({
  fetchA1MockAudioPlaybackUrl: jest.fn(),
}));
jest.mock("../services/a1HoerenPracticeService", () => ({
  scoreA1HoerenPractice: jest.fn(),
}));

beforeEach(() => {
  jest.clearAllMocks();
  fetchA1MockAudioPlaybackUrl.mockResolvedValue({ url: "https://audio.example.test/signed-teil-1.mp3" });
  scoreA1HoerenPractice.mockResolvedValue({
    correct: 15, total: 15, percent: 100, passed: true, saved: true,
    correctAnswers: {},
  });
});

test("A1 Exams Room lists Hören Samples 01 through 08, five new entries using existing mocks", () => {
  render(<MemoryRouter><HorenPage practiceLevel="A1" /></MemoryRouter>);
  for (const number of [1, 2, 3, 4, 5, 6, 7, 8]) {
    expect(screen.getByText(`Hören Sample ${number}`)).toBeInTheDocument();
  }
  for (const number of [4, 5, 6, 7, 8]) {
    expect(screen.getByText(new RegExp(`From A1 Mock ${number} · server-graded`))).toBeInTheDocument();
  }
});

test("A1 Hören Sample 08 reuses private R2 audio and server-only scoring without full mock answers", async () => {
  const { container } = render(<MemoryRouter>
    <HorenPage practiceLevel="A1" sampleId="sample-8" />
  </MemoryRouter>);
  expect(container.querySelector('[data-a1-hoeren-standalone="a1-mock-08"]')).toBeInTheDocument();
  const inputs = Array.from(container.querySelectorAll('input[type="radio"]'));
  const questionIds = [...new Set(inputs.map(input => input.name))];
  expect(questionIds).toHaveLength(15);
  expect(screen.queryByText(/Correct answer:/)).not.toBeInTheDocument();
  fireEvent.click(screen.getAllByRole("button", { name: "Load audio" })[0]);
  await waitFor(() => expect(fetchA1MockAudioPlaybackUrl).toHaveBeenCalledWith({
    mockId: "mock-08", part: "teil-1",
    key: "a1/mock-hoeren/mock-08/teil-1.mp3",
    idToken: "student-token",
  }));
  questionIds.forEach(name => {
    fireEvent.click(inputs.find(input => input.name === name));
  });
  fireEvent.click(screen.getByRole("button", { name: "Check answers" }));
  await waitFor(() => expect(scoreA1HoerenPractice).toHaveBeenCalledWith({
    mockId: "a1-mock-08", idToken: "student-token",
    answers: expect.objectContaining({
      "t1-1": expect.any(String), "t2-1": expect.any(String), "t3-5": expect.any(String),
    }),
  }));
  expect(await screen.findByText(/Saved to Results/)).toBeInTheDocument();
});

test("A1 Mock 04 also has a standalone 15-question Hören page", () => {
  const { container } = render(<MemoryRouter>
    <HorenPage practiceLevel="A1" sampleId="sample-4" />
  </MemoryRouter>);
  expect(container.querySelector('[data-a1-hoeren-standalone="a1-mock-04"]')).toBeInTheDocument();
  expect(new Set(Array.from(container.querySelectorAll('input[type="radio"]')).map(input => input.name)).size).toBe(15);
});
