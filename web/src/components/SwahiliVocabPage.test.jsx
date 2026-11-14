import React from "react";
import { fireEvent, render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import VocabExamPage from "./VocabExamPage";
import SwahiliDictionary from "./SwahiliDictionary";
import { readSavedSwahiliWordIds, getSwahiliWordId } from "../services/swahiliSavedVocabulary";
import { SWAHILI_DICTIONARY_WORDS } from "../data/swahili/vocabulary";
import { fetchVocabularyFromSheet } from "../services/vocabService";

let currentUser = { uid: "swahili-test-user" };
let currentProfile = { program: "swahili" };

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ user: currentUser, studentProfile: currentProfile }),
}));
jest.mock("../context/ExamContext", () => ({
  ALLOWED_LEVELS: ["A1", "A2", "B1", "B2", "C1", "C2"],
  useExam: () => ({ level: "A1", setLevel: jest.fn(), setError: jest.fn() }),
}));
jest.mock("../services/vocabService", () => ({
  fetchVocabularyFromSheet: jest.fn(() => Promise.resolve([])),
}));

const renderVocab = () => render(<MemoryRouter><VocabExamPage context="campus" /></MemoryRouter>);

describe("Kiswahili Campus vocabulary reuses the existing Falowen vocabulary route", () => {
  beforeEach(() => {
    currentUser = { uid: "swahili-test-user" };
    currentProfile = { program: "swahili" };
    window.localStorage.clear();
    jest.clearAllMocks();
  });

  test("searches source-grounded words in Kiswahili and English without fetching German sheets", () => {
    renderVocab();
    expect(screen.getByRole("heading", { name: "Msamiati · Vocabulary Practice" })).toBeTruthy();
    expect(screen.getByText("mother")).toBeTruthy();
    fireEvent.change(screen.getByRole("searchbox", { name: "Search Kiswahili or English" }), {
      target: { value: "MANGO" },
    });
    expect(screen.getByText("juisi ya embe")).toBeTruthy();
    expect(screen.queryByText("mama")).toBeNull();
    expect(fetchVocabularyFromSheet).not.toHaveBeenCalled();
  });

  test("filters only Day 1 and Day 6 published words", () => {
    renderVocab();
    fireEvent.change(screen.getByRole("combobox", { name: "Filter by lesson" }), {
      target: { value: "day-1" },
    });
    expect(screen.getByText("mama")).toBeTruthy();
    expect(screen.queryByText("wali samaki")).toBeNull();
    fireEvent.change(screen.getByRole("combobox", { name: "Filter by lesson" }), {
      target: { value: "day-6" },
    });
    expect(screen.getByText("wali samaki")).toBeTruthy();
    expect(screen.queryByText("mama")).toBeNull();
  });

  test("saves words in the workbook dictionary and reviews them in Campus", () => {
    const page = render(<MemoryRouter><SwahiliDictionary uid={currentUser.uid} allowSave /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText("Tafuta neno · Search"), { target: { value: "mama" } });
    fireEvent.click(screen.getByRole("button", { name: "Save mama" }));
    const mama = SWAHILI_DICTIONARY_WORDS.find((word) => word.sw === "mama");
    expect(readSavedSwahiliWordIds(currentUser.uid)).toContain(getSwahiliWordId(mama));
    page.unmount();
    renderVocab();
    fireEvent.click(screen.getByRole("checkbox", { name: "Saved words only" }));
    expect(screen.getByText("mama")).toBeTruthy();
    expect(screen.queryByText("wali samaki")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Remove mama" }));
    expect(readSavedSwahiliWordIds(currentUser.uid)).toEqual([]);
    expect(screen.getByText(/No saved words match these filters/)).toBeTruthy();
  });

  test("flashcards hide English until reveal and advance without network requests", () => {
    renderVocab();
    fireEvent.change(screen.getByRole("searchbox", { name: "Search Kiswahili or English" }), {
      target: { value: "mama" },
    });
    fireEvent.change(screen.getByRole("combobox", { name: "Vocabulary practice mode" }), {
      target: { value: "cards" },
    });
    expect(screen.getByText("mama")).toBeTruthy();
    expect(screen.queryByText("mother")).toBeNull();
    fireEvent.click(screen.getByRole("button", { name: "Reveal English meaning" }));
    expect(screen.getByText("mother")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Hide meaning" }));
    expect(screen.queryByText("mother")).toBeNull();
    expect(fetchVocabularyFromSheet).not.toHaveBeenCalled();
  });

  test("does not show another student's saved words after switching accounts", () => {
    window.localStorage.setItem(
      "falowen:reading-phrases:swahili-test-user:GermanOnly",
      JSON.stringify({ de: "Hallo" })
    );
    const page = renderVocab();
    fireEvent.click(screen.getByRole("button", { name: "Save mama" }));
    page.unmount();
    currentUser = { uid: "other-learner" };
    renderVocab();
    expect(screen.getByText(/0 saved on this device/)).toBeTruthy();
    expect(readSavedSwahiliWordIds("other-learner")).toEqual([]);
    expect(fetchVocabularyFromSheet).not.toHaveBeenCalled();
  });
});
