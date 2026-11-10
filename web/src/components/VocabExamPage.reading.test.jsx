import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import VocabExamPage from "./VocabExamPage";
import { saveReadingPhrase } from "../services/savedReadingPhrases";

jest.mock("../context/AuthContext", () => ({ useAuth: () => ({ user: { uid: "learner" }, studentProfile: { level: "C2" } }) }));
jest.mock("../context/ExamContext", () => ({ useExam: () => ({ level: "C2" }), ALLOWED_LEVELS: ["C2"] }));
jest.mock("../services/vocabService", () => ({ fetchVocabularyFromSheet: async () => [] }));

test("Campus Vocab shows the saved sentence and links back to the lesson", async () => {
  saveReadingPhrase("learner", { de: "Kohärenz", en: "consistency", level: "C2", day: 5, sentence: "Das schafft Kohärenz." });
  saveReadingPhrase("another", { de: "Teilhabe", en: "participation", level: "B2", day: 1, sentence: "Teilhabe zählt." });
  const { rerender } = render(<VocabExamPage context="campus" />);
  expect(screen.getByText("Das schafft Kohärenz.")).toBeInTheDocument();
  expect(screen.getByRole("link", { name: "C2 · Day 5" })).toHaveAttribute("href", "/campus/course/lesson/C2/5?view=lesen");
  expect(screen.queryByText("Teilhabe zählt.")).toBeNull();
  rerender(<VocabExamPage context="exam" />);
  await waitFor(() => expect(screen.queryByText("Saved reading phrases")).toBeNull());
});
