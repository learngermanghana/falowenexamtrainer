import { render, screen } from "@testing-library/react";
import App from "./App";

jest.mock("./services/coachService", () => ({
  analyzeAudio: jest.fn(),
  analyzeText: jest.fn(),
}));

test("renders navigation buttons", () => {
  render(<App />);
  expect(screen.getByText(/Falowen Exam Coach/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Sprechen/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Schreiben/i })).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Vokabeln/i })).toBeInTheDocument();
});
