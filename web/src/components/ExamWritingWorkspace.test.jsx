import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ExamWritingWorkspace from "./ExamWritingWorkspace";

let selectedLevel = "A1";
const mockSetLevel = jest.fn((value) => { selectedLevel = value; });
const mockShowToast = jest.fn();
const mockMark = jest.fn();
const mockSaveAttempt = jest.fn();
const mockSaveForTutor = jest.fn();

jest.mock("../context/ExamContext", () => ({
  useExam: () => ({
    level: selectedLevel,
    setLevel: mockSetLevel,
    accessibleLevels: ["A1", "A2", "B1", "B2", "C1", "C2"],
  }),
}));
jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: { uid: "writing-test-student", displayName: "Test Student" },
    idToken: "test-token",
    studentProfile: { studentCode: "TEST001", level: "A1" },
  }),
}));
jest.mock("../context/ToastContext", () => ({
  useToast: () => ({ showToast: mockShowToast }),
}));
jest.mock("../services/coachService", () => ({
  markLetterWithAI: (...args) => mockMark(...args),
}));
jest.mock("../services/writingProgressService", () => ({
  saveWritingAttempt: (...args) => mockSaveAttempt(...args),
}));
jest.mock("../services/tutorReviewService", () => ({
  saveExamLetterForTutorReview: (...args) => mockSaveForTutor(...args),
  isTutorReviewCloudEnabled: () => true,
}));
jest.mock("./WritingFeedbackCard", () => ({
  __esModule: true,
  default: ({ feedback }) => <div data-testid="writing-feedback">{feedback}</div>,
}));

describe("Exams Room writing tasks", () => {
  beforeEach(() => {
    selectedLevel = "A1";
    window.localStorage.clear();
    jest.clearAllMocks();
    mockSaveAttempt.mockResolvedValue(true);
    mockSaveForTutor.mockResolvedValue({ id: "review-1" });
    mockMark.mockResolvedValue({
      feedback: "Aufgabe erfüllt", score: 10, maxScore: 15,
      rubric: { task: 4, coherence: 3, grammar: 3 },
      corrections: [], structuredFeedback: { summary: "Aufgabe erfüllt" },
    });
  });

  test("renders the first supplied A1 form and checks only five blanks", async () => {
    render(<ExamWritingWorkspace />);
    expect(screen.getByText("Sprachschule Berlin — Anmeldung")).toBeInTheDocument();
    expect(screen.getByText("Garcia, Maria")).toBeInTheDocument();
    expect(screen.getByText("14.05.1998")).toBeInTheDocument();
    const answers = [
      ["(1) Wohnort / PLZ", "10115 Berlin"],
      ["(2) Kurstyp", "Intensivkurs"],
      ["(3) Kursbeginn", "01.11.2026"],
      ["(4) Bezahlungsart", "Kreditkarte"],
      ["(5) Anzahl der Personen", "1"],
    ];
    answers.forEach(([name, value]) => {
      fireEvent.change(screen.getByRole("textbox", { name }), { target: { value } });
    });
    fireEvent.click(screen.getByRole("button", { name: "Formular prüfen" }));
    expect(await screen.findByText("Richtige Angaben")).toBeInTheDocument();
    expect(screen.getByText("5/5")).toBeInTheDocument();
    expect(screen.getByText("1/5 erledigt")).toBeInTheDocument();
    expect(mockSaveAttempt).toHaveBeenCalledTimes(1);
  });

  test("keeps separate form and letter drafts when switching Teil and tasks", () => {
    render(<ExamWritingWorkspace />);
    fireEvent.change(screen.getByRole("textbox", { name: "(1) Wohnort / PLZ" }), {
      target: { value: "Berlin" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Teil 2 · E-Mail" }));
    expect(screen.getByText("Hotelzimmer anfragen")).toBeInTheDocument();
    const editor = screen.getByPlaceholderText("Beginne mit einer passenden Anrede ...");
    fireEvent.change(editor, { target: { value: "Sehr geehrte Damen und Herren," } });
    fireEvent.click(screen.getByRole("button", { name: "Teil 1 · Formular" }));
    expect(screen.getByRole("textbox", { name: "(1) Wohnort / PLZ" })).toHaveValue("Berlin");
    fireEvent.click(screen.getByRole("button", { name: "Teil 2 · E-Mail" }));
    expect(screen.getByPlaceholderText("Beginne mit einer passenden Anrede ..."))
      .toHaveValue("Sehr geehrte Damen und Herren,");
  });

  test("uses the existing AI and tutor services for text exercises", async () => {
    render(<ExamWritingWorkspace />);
    fireEvent.click(screen.getByRole("button", { name: "Teil 2 · E-Mail" }));
    fireEvent.change(screen.getByPlaceholderText("Beginne mit einer passenden Anrede ..."), {
      target: { value: "Sehr geehrte Damen und Herren, ich möchte ein Zimmer buchen." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Text analysieren" }));
    await waitFor(() => expect(mockMark).toHaveBeenCalledTimes(1));
    await screen.findByTestId("writing-feedback");
    expect(mockMark.mock.calls[0][0]).toMatchObject({
      level: "A1", submissionContext: "exam-room", promptType: "email",
    });
    fireEvent.click(screen.getByRole("button", { name: "Für Tutor speichern" }));
    await waitFor(() => expect(mockSaveForTutor).toHaveBeenCalledTimes(1));
    expect(mockSaveForTutor.mock.calls[0][0].source).toBe("exam-room-simple-writing");
  });
});
