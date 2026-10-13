import React from "react";
import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import A1FinalMockExamPage from "./A1FinalMockExamPage";
import { A1_GOETHE_LISTENING_MOCK } from "./A1GoetheListeningMockPreview";
import { A1_MOCK_2_ID, A1_MOCK_2_LISTENING, A1_MOCK_2_READING } from "../data/a1FinalMock2Data";
import { mockA1ReviewAnswer } from "../utils/mockChoicePresentation";

jest.mock("../context/AuthContext", () => ({ useAuth: () => ({ idToken: "", user: null }) }));

const allScores = { lesen: 15, hoeren: 25, schreiben: 20, sprechen: 20 };
const storageKey = (mockId) => `falowen:a1-final-mock:${mockId}:guest`;

function mountResult(mockId, { lesenAnswers = {}, hoerenAnswers = {} } = {}) {
  window.localStorage.setItem(storageKey(mockId), JSON.stringify({
    mockId, stage: "result", completed: true, sectionScores: allScores,
    overall: { score: 80, maxScore: 100, passed: true },
    lesenAnswers, hoerenAnswers,
  }));
  return render(
    <MemoryRouter>
      <A1FinalMockExamPage mockId={mockId} />
    </MemoryRouter>
  );
}

function reviewedQuestion(sectionName, questionNumber) {
  const section = screen.getByRole("heading", { name: sectionName }).closest("section");
  return within(section).getByText(`Aufgabe ${questionNumber}`).closest("div");
}

beforeEach(() => { window.localStorage.clear(); window.scrollTo = jest.fn(); });
afterEach(() => { jest.clearAllMocks(); });

test("A1 Mock 1 Hören review uses the visible letter for both a stored submitted and correct answer", () => {
  const question = A1_GOETHE_LISTENING_MOCK.teil1.questions[0];
  expect(question.answer).toBe("B");
  expect(mockA1ReviewAnswer(question, "B", "hoeren", "t1-1")).toBe("A");
  mountResult("a1-mock-01", { hoerenAnswers: { "t1-1": "B" } });
  const item = reviewedQuestion("Hören review", 1);
  expect(within(item).getByText("Your answer: A")).toBeInTheDocument();
  expect(within(item).getByText("Correct answer: A")).toBeInTheDocument();
  expect(within(item).queryByText("Your answer: B")).toBeNull();
});

test("A1 Mock 2 picture options use the same visible letters in review and in the answer selection", () => {
  const question = A1_MOCK_2_LISTENING.teil1.questions[0];
  const key = `t1-${question.number}`;
  const display = mockA1ReviewAnswer(question, question.answer, "hoeren", key);
  mountResult(A1_MOCK_2_ID, { hoerenAnswers: { [key]: question.answer } });
  const item = reviewedQuestion("Hören review", question.number);
  expect(within(item).getByText(`Your answer: ${display}`)).toBeInTheDocument();
  expect(within(item).getByText(`Correct answer: ${display}`)).toBeInTheDocument();
});

test("A1 Lesen Text A/B matching and binary questions remain unchanged", () => {
  const question = A1_MOCK_2_READING.teil2.questions[0];
  expect(question.answer).toBe("a");
  mountResult(A1_MOCK_2_ID, { lesenAnswers: { "t2-6": "a", "t1-1": "falsch" } });
  const item = reviewedQuestion("Lesen review", 6);
  expect(within(item).getByText("Your answer: a")).toBeInTheDocument();
  expect(within(item).getByText("Correct answer: Text A")).toBeInTheDocument();
  const binary = reviewedQuestion("Lesen review", 1);
  expect(within(binary).getByText("Your answer: falsch")).toBeInTheDocument();
});
