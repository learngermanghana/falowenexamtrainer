import React from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import A2Mock2Hoeren from "./A2Mock2Hoeren";
import A2Mock2Lesen from "./A2Mock2Lesen";
import A2Mock2ExamHub from "./A2Mock2ExamHub";
import { getA2Mock2StorageKeys, A2_MOCK_2_STORAGE } from "../utils/mockReviewAccess";

let mockStudentId = "student-two";
jest.mock("../context/AuthContext", () => ({ useAuth: () => ({ user: { uid: mockStudentId }, idToken: "" }) }));
jest.mock("./navigation/AppBackButton", () => () => <div>Back</div>);
const keys = getA2Mock2StorageKeys("student-two");
const mount = (component) => render(<MemoryRouter>{component}</MemoryRouter>);
const complete = () => {
  localStorage.setItem(keys.lesen, JSON.stringify({ startedAt: Date.now(), completedAt: Date.now(), answers: { 1: "a" } }));
  localStorage.setItem(keys.hoeren, JSON.stringify({ completedAt: Date.now(), answers: { 1: "a" } }));
  localStorage.setItem(keys.schreiben, JSON.stringify({ startedAt: Date.now(), submittedAt: Date.now(), aiFeedback: [{part:"teil1", feedback:"Feedback one"}, {part:"teil2", feedback:"Feedback two"}] }));
  localStorage.setItem(keys.sprechen, JSON.stringify({ _mock2AiScored: true, ...Object.fromEntries(["t1_questions","t1_answers","t2_main","t2_followups","t3_plan"].map(key => [key, { transcript: "Meine Antwort" }])) }));
};
beforeEach(() => { mockStudentId = "student-two"; localStorage.clear(); window.scrollTo = jest.fn(); });
test("fresh Hören is blank even if a shared device has another student's completed answers", () => {
  localStorage.setItem(A2_MOCK_2_STORAGE.hoeren, JSON.stringify({ completedAt: 1, answers: { 1: "c" } }));
  localStorage.setItem(getA2Mock2StorageKeys("student-one").hoeren, JSON.stringify({ completedAt: 1, answers: { 1: "c" } }));
  const { container } = mount(<A2Mock2Hoeren />);
  expect(container.querySelectorAll('input[type="radio"]:checked')).toHaveLength(0);
  expect(screen.queryByText(/Your listening result/)).not.toBeInTheDocument();
  expect(screen.queryByText(/Correct answer:/)).not.toBeInTheDocument();
  expect(localStorage.getItem(A2_MOCK_2_STORAGE.hoeren)).not.toBeNull();
});
test.each([["Hören", A2Mock2Hoeren, "hoeren"], ["Lesen", A2Mock2Lesen, "lesen"]])(
  "%s solutions stay hidden after that module is submitted, even on a direct module link", (_label, Component, key) => {
    localStorage.setItem(keys[key], JSON.stringify({ startedAt: Date.now(), completedAt: Date.now(), answers: { 1: "a" } }));
    mount(<Component />);
    expect(screen.queryByText(/Correct answer:/)).not.toBeInTheDocument();
    expect(screen.getByText(/after all four modules are complete/)).toBeInTheDocument();
  },
);
test("an embedded finished listening module advances without flashing solutions", () => {
  localStorage.setItem(keys.hoeren, JSON.stringify({ completedAt: Date.now(), answers: { 1: "a" } }));
  const onComplete = jest.fn();
  mount(<A2Mock2Hoeren embedded onComplete={onComplete} />);
  expect(onComplete).toHaveBeenCalledTimes(1);
  expect(screen.queryByText(/Correct answer:/)).not.toBeInTheDocument();
});
test("solutions unlock only after all four modules, and retake archives the old answers", () => {
  complete();
  localStorage.setItem(keys.flow, JSON.stringify({ stage: "result", startedAt: Date.now() }));
  jest.spyOn(window, "confirm").mockReturnValue(true);
  mount(<A2Mock2ExamHub />);
  expect(screen.getByText("All four modules completed")).toBeInTheDocument();
  expect(screen.getAllByText(/Correct answer:/)).toHaveLength(40);
  fireEvent.click(screen.getByRole("button", { name: "Start a new full mock" }));
  expect(screen.queryByText(/Correct answer:/)).not.toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem(`${keys.flow}:history`))).toHaveLength(1);
  expect(localStorage.getItem(keys.hoeren)).toBeNull();
  window.confirm.mockRestore();
});

test("switching student accounts remounts Hören without copying selected answers", () => {
  localStorage.setItem(keys.hoeren, JSON.stringify({ answers: { 1: "a" } }));
  const view = mount(<A2Mock2Hoeren />);
  expect(view.container.querySelectorAll('input[type="radio"]:checked')).toHaveLength(1);
  mockStudentId = "student-three";
  view.rerender(<MemoryRouter><A2Mock2Hoeren /></MemoryRouter>);
  expect(view.container.querySelectorAll('input[type="radio"]:checked')).toHaveLength(0);
  expect(JSON.parse(localStorage.getItem(keys.hoeren)).answers).toEqual({ 1: "a" });
});
