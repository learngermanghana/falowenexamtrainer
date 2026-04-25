import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import B2SelfLearningCourse from "./B2SelfLearningCourse";

jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
}));

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ user: null, studentProfile: null }),
}));

jest.mock("../services/selfLearningResourcesService", () => ({
  fetchSelfLearningResources: jest.fn().mockResolvedValue(null),
}));

jest.mock("../services/selfLearningProgressService", () => ({
  loadSelfLearningProgress: jest.fn().mockResolvedValue({ progressByDay: {} }),
  saveSelfLearningProgress: jest.fn().mockResolvedValue({ ok: true }),
}));

jest.mock("../services/vocabService", () => ({
  fetchVocabularyFromSheet: jest.fn().mockResolvedValue([]),
}));

jest.mock("../data/b2SelfLearningPlan", () => ({
  B2_SELF_LEARNING_PLAN: [
    {
      day: 1,
      title: "Tag 1",
      topic: "Topic",
      learningObjectives: ["Objective A"],
      grammarFocus: { items: ["passiv"] },
      brainMap: ["Idea A"],
      speaking: { prompt: "Speak", outline: [], starters: [], grammarNotes: [] },
      writing: { prompt: "Write" },
      skimmingWords: ["Wort"],
      weeklyReview: { summary: "Review summary", reflectionQuestions: ["Q1"] },
    },
    {
      day: 2,
      title: "Tag 2",
      topic: "Topic 2",
      speaking: { prompt: "Speak 2", outline: [], starters: [], grammarNotes: [] },
      writing: { prompt: "Write 2" },
      skimmingWords: ["Wort2"],
    },
  ],
}));

describe("B2SelfLearningCourse overview tabs", () => {
  test("defaults to overview and shows overview content", async () => {
    render(<B2SelfLearningCourse />);

    await waitFor(() => {
      expect(screen.getByText("Learning objectives")).toBeInTheDocument();
    });

    expect(screen.getByText("Objective A")).toBeInTheDocument();
  });

  test("shows fallback message when overview is missing", async () => {
    render(<B2SelfLearningCourse />);

    await screen.findAllByRole("tab", { name: "Overview" });
    const dayTwoOverviewTab = screen.getAllByRole("tab", { name: "Overview" })[1];
    fireEvent.click(dayTwoOverviewTab);

    expect(screen.getByText("No overview details available for this day yet.")).toBeInTheDocument();
  });

  test("switching tabs still works", async () => {
    render(<B2SelfLearningCourse />);

    const speakingTab = await screen.findByRole("tab", { name: "Speaking" });
    fireEvent.click(speakingTab);

    expect(screen.getByText("1) Speaking recorder")).toBeInTheDocument();
  });
});
