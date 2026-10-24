import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import A1FinalMockExamPage from "./A1FinalMockExamPage";
import { A1_FINAL_MOCK_STORAGE_KEY, A1_FINAL_MOCK_ID } from "../services/a1FinalMockService";

jest.mock("../context/AuthContext", () => ({ useAuth: () => ({ idToken: "", user: null }) }));

afterEach(() => localStorage.clear());

test("a saved Schreiben stage renders the final-exam task and all three points", () => {
  localStorage.setItem(`${A1_FINAL_MOCK_STORAGE_KEY}:guest`, JSON.stringify({
    mockId: A1_FINAL_MOCK_ID,
    stage: "schreiben",
    sectionDeadlineMs: Date.now() + 20 * 60 * 1000,
  }));
  render(<MemoryRouter><A1FinalMockExamPage /></MemoryRouter>);
  expect(screen.getByText(/Kochschule „GenussZeit“/)).toBeVisible();
  expect(screen.getByText(/Melden Sie sich für den Kurs „Italienische Küche“ an/)).toBeVisible();
  expect(screen.getByText(/Fragen Sie, wann der nächste Kurs beginnt/)).toBeVisible();
  expect(screen.getByText(/Fragen Sie nach dem Preis/)).toBeVisible();
  expect(screen.getByLabelText("Ihre E-Mail")).toBeVisible();
});
