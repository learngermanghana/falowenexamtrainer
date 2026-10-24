import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import A2ListeningTeil1 from "./A2GoetheListeningMockTeil1Preview";
import A2ListeningTeil2 from "./A2GoetheListeningMockTeil2Preview";
import A2ListeningTeil3 from "./A2GoetheListeningMockTeil3Preview";
import A2ListeningTeil4 from "./A2GoetheListeningMockTeil4Preview";
import A1FinalMockExamPage from "./A1FinalMockExamPage";
import A2FinalMockExamPage from "./A2FinalMockExamPage";
import B1FinalMockExamPage from "./B1FinalMockExamPage";
import B2FinalMockExamPage from "./B2FinalMockExamPage";
import C1FinalMockExamPage from "./C1FinalMockExamPage";
import { A1_FINAL_MOCK_STORAGE_KEY, A1_FINAL_MOCK_ID } from "../services/a1FinalMockService";
import { A2_FINAL_MOCK_STORAGE_KEY, A2_FINAL_MOCK_ID } from "../services/a2FinalMockService";
import { B1_FINAL_MOCK_STORAGE_KEY, B1_FINAL_MOCK_ID } from "../services/b1FinalMockService";
import { B2_FINAL_MOCK_STORAGE_KEY } from "../data/b2FinalMockData";
import { C1_READING_PRACTICE_STORAGE_KEY } from "../data/c1FinalMockData";
import { getStudentMockStorageKey } from "../utils/mockReviewAccess";

jest.mock("../context/AuthContext", () => ({ useAuth: () => ({ user: { uid: "student" }, idToken: "" }) }));
jest.mock("./navigation/AppBackButton", () => () => <div>Back</div>);
jest.mock("../services/b2AudioService", () => ({ fetchB2MockAudioPlaybackUrl: jest.fn(() => Promise.resolve("")) }));

const cases = [
  ["A1 Mock 1", A1FinalMockExamPage, A1_FINAL_MOCK_STORAGE_KEY, A1_FINAL_MOCK_ID],
  ["A1 Mock 2", A1FinalMockExamPage, "falowen:a1-final-mock:a1-mock-02", "a1-mock-02"],
  ["A1 Mock 3", A1FinalMockExamPage, "falowen:a1-final-mock:a1-mock-03", "a1-mock-03"],
  ["A2 Mock 1", A2FinalMockExamPage, A2_FINAL_MOCK_STORAGE_KEY, A2_FINAL_MOCK_ID],
  ["B1 Mock 1", B1FinalMockExamPage, B1_FINAL_MOCK_STORAGE_KEY, B1_FINAL_MOCK_ID],
];
beforeEach(() => { localStorage.clear(); window.scrollTo = jest.fn(); });
test.each(cases)("%s listening starts blank and shows no solutions", (_label, Component, baseKey, mockId) => {
  localStorage.setItem(getStudentMockStorageKey(baseKey, "student"), JSON.stringify({ mockId, stage: "hoeren", sectionDeadlineMs: Date.now() + 600000, hoerenAnswers: {} }));
  const { container } = render(<MemoryRouter><Component mockId={mockId} /></MemoryRouter>);
  expect(container.querySelectorAll('input[type="radio"]')).not.toHaveLength(0);
  expect(container.querySelectorAll('input[type="radio"]:checked')).toHaveLength(0);
  expect([...container.querySelectorAll("select")].every(select => select.value === "")).toBe(true);
  expect(screen.queryByText(/Correct answer:|Lösung:|Richtige Antwort:/)).not.toBeInTheDocument();
});
test.each(cases)("%s does not restore premature result pages", (_label, Component, baseKey, mockId) => {
  localStorage.setItem(getStudentMockStorageKey(baseKey, "student"), JSON.stringify({ mockId, stage: "result", completed: true, sectionScores: { lesen: 10 }, sectionDeadlineMs: Date.now() + 600000 }));
  render(<MemoryRouter><Component mockId={mockId} /></MemoryRouter>);
  expect(screen.queryByText(/Correct answer:|Lösung:|Richtige Antwort:/)).not.toBeInTheDocument();
  expect(screen.queryByText(/PASSED|NEEDS MORE PRACTICE/)).not.toBeInTheDocument();
});
test("B2 listening only fills its explicitly unscored example, not exam questions", () => {
  localStorage.setItem(getStudentMockStorageKey(B2_FINAL_MOCK_STORAGE_KEY, "student"), JSON.stringify({ stage: "hoeren-teil1", started: true, deadlineMs: Date.now() + 600000 }));
  const { container } = render(<MemoryRouter><B2FinalMockExamPage /></MemoryRouter>);
  const scoredInputs = [...container.querySelectorAll('input[type="radio"]')].filter(input => !input.disabled);
  expect(scoredInputs.length).toBeGreaterThan(0);
  expect(scoredInputs.every(input => !input.checked)).toBe(true);
  expect(screen.queryByText(/Correct answer:|Lösung:|Richtige Antwort:/)).not.toBeInTheDocument();
});
test("C1 reading practice starts blank despite unowned legacy answers on a shared browser", () => {
  localStorage.setItem(C1_READING_PRACTICE_STORAGE_KEY, JSON.stringify({ started: true, teil1Answers: { 1: "a" } }));
  localStorage.setItem(getStudentMockStorageKey(C1_READING_PRACTICE_STORAGE_KEY, "student"), JSON.stringify({ started: true, stage: "teil1", deadlineMs: Date.now() + 600000 }));
  const { container } = render(<MemoryRouter><C1FinalMockExamPage /></MemoryRouter>);
  const selects = [...container.querySelectorAll("select")].filter(select => !select.disabled);
  expect(selects.length).toBeGreaterThan(0);
  expect(selects.every(select => select.value === "")).toBe(true);
  expect(screen.queryByText(/Correct answer:|Lösung:|Richtige Antwort:/)).not.toBeInTheDocument();
});

test.each(cases.slice(0, 4))("%s releases objective answers after all four modules are finished", (_label, Component, baseKey, mockId) => {
  localStorage.setItem(getStudentMockStorageKey(baseKey, "student"), JSON.stringify({ mockId, stage: "result", completed: true, sectionScores: { lesen: 20, hoeren: 20, schreiben: 20, sprechen: 20 } }));
  render(<MemoryRouter><Component mockId={mockId} /></MemoryRouter>);
  expect(screen.getAllByText(/Correct answer:/).length).toBeGreaterThan(0);
});

test.each([A2ListeningTeil1, A2ListeningTeil2, A2ListeningTeil3, A2ListeningTeil4])("A2 standalone listening preview has no preselected scored answers", (Component) => {
  const { container } = render(<MemoryRouter><Component /></MemoryRouter>);
  const choices = [...container.querySelectorAll('input[type="radio"], select')];
  expect(choices.length).toBeGreaterThan(0);
  expect(choices.every(choice => choice.tagName === "SELECT" ? choice.value === "" : !choice.checked)).toBe(true);
  expect(screen.queryByText(/Correct answer:|Lösung:|Richtige Antwort:/)).not.toBeInTheDocument();
});
