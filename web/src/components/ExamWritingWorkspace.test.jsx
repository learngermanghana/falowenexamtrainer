import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ExamWritingWorkspace from "./ExamWritingWorkspace";

let mockSelectedLevel = "A1";
const mockSetLevel = jest.fn((value) => { mockSelectedLevel = value; });
const mockShowToast = jest.fn();
const mockMark = jest.fn();
const mockSaveAttempt = jest.fn();
const mockSaveExamResult = jest.fn();
const mockSaveForTutor = jest.fn();

jest.mock("../context/ExamContext", () => ({
  useExam: () => ({
    level: mockSelectedLevel,
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
jest.mock("../services/examRoomResultService", () => ({
  saveExamRoomResult: (...args) => mockSaveExamResult(...args),
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
    mockSelectedLevel = "A1";
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
    expect(screen.getByRole("heading", { name: "Sprachschule Berlin — Anmeldung" })).toBeInTheDocument();
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
    fireEvent.click(screen.getByRole("button", { name: "Check form" }));
    expect(await screen.findByText("Correct fields")).toBeInTheDocument();
    expect(screen.getByText("5/5")).toBeInTheDocument();
    expect(screen.getByText("1/5 completed")).toBeInTheDocument();
    expect(mockSaveAttempt).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(mockSaveExamResult).toHaveBeenCalledTimes(1));
    expect(mockSaveExamResult.mock.calls[0][0]).toMatchObject({
      level: "A1", section: "schreiben", score: 5, total: 5, resultType: "practice",
    });
    expect(mockSaveExamResult.mock.calls[0][0]).not.toHaveProperty("text");
  });

  test("requires all numbered A1 fields before checking or saving", () => {
    render(<ExamWritingWorkspace />);
    fireEvent.change(screen.getByRole("textbox", { name: "(1) Wohnort / PLZ" }), {
      target: { value: "Berlin" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Check form" }));
    expect(mockSaveAttempt).not.toHaveBeenCalled();
    expect(screen.getByText("0/5 completed")).toBeInTheDocument();
    expect(mockShowToast).toHaveBeenCalledWith(
      "Please complete every numbered form field before checking.", "info"
    );
  });

  test("keeps separate form and letter drafts when switching Teil and tasks", () => {
    render(<ExamWritingWorkspace />);
    fireEvent.change(screen.getByRole("textbox", { name: "(1) Wohnort / PLZ" }), {
      target: { value: "Berlin" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Part 2 · Email" }));
    expect(screen.getByRole("heading", { name: "Ask About a Hotel Room" })).toBeInTheDocument();
    const editor = screen.getByPlaceholderText("Start with an appropriate German greeting ...");
    fireEvent.change(editor, { target: { value: "Sehr geehrte Damen und Herren," } });
    fireEvent.click(screen.getByRole("button", { name: "Part 1 · Form" }));
    expect(screen.getByRole("textbox", { name: "(1) Wohnort / PLZ" })).toHaveValue("Berlin");
    fireEvent.click(screen.getByRole("button", { name: "Part 2 · Email" }));
    expect(screen.getByPlaceholderText("Start with an appropriate German greeting ..."))
      .toHaveValue("Sehr geehrte Damen und Herren,");
  });

  test("uses the existing AI and tutor services for text exercises", async () => {
    render(<ExamWritingWorkspace />);
    fireEvent.click(screen.getByRole("button", { name: "Part 2 · Email" }));
    fireEvent.change(screen.getByPlaceholderText("Start with an appropriate German greeting ..."), {
      target: { value: "Sehr geehrte Damen und Herren, ich möchte ein Zimmer buchen." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Analyse my writing" }));
    await waitFor(() => expect(mockMark).toHaveBeenCalledTimes(1));
    await screen.findByTestId("writing-feedback");
    expect(mockMark.mock.calls[0][0]).toMatchObject({
      level: "A1", submissionContext: "exam-room", promptType: "email",
    });
    fireEvent.click(screen.getByRole("button", { name: "Send to tutor" }));
    await waitFor(() => expect(mockSaveForTutor).toHaveBeenCalledTimes(1));
    expect(mockSaveForTutor.mock.calls[0][0].source).toBe("exam-room-simple-writing");
  });
  test("C1 Part 2 offers the optional formal-email template with English controls and German content", () => {
    mockSelectedLevel = "C1";
    render(<ExamWritingWorkspace />);
    expect(screen.getByRole("button", { name: "Part 1 · Discussion Post" })).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: "Part 2 · Formal Email" }));
    expect(screen.getByRole("heading", { name: "Move to an Open-Plan Office" })).toBeInTheDocument();
    const guide = screen.getByTestId("c1-formal-email-guide");
    expect(guide).toHaveTextContent("Show C1 formal email template");
    expect(guide).toHaveTextContent("Möglicherweise ließe sich die Situation");
    expect(guide).toHaveTextContent("Mit freundlichen Grüßen");
    expect(screen.getByText(/Empfänger\/-in: Ihre Vorgesetzte/)).toBeInTheDocument();
    expect(screen.getByText(/organisatorische Notwendigkeiten/)).toBeInTheDocument();
  });

  test("C1 discussion and email tasks send their distinct registered IDs to AI marking", async () => {
    mockSelectedLevel = "C1";
    render(<ExamWritingWorkspace />);
    fireEvent.change(screen.getByPlaceholderText("Write your opinion in German ..."), {
      target: { value: "Ich bin der Auffassung, dass die Wahl eines Studiums von den eigenen Zielen abhängt." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Analyse my writing" }));
    await waitFor(() => expect(mockMark).toHaveBeenCalledTimes(1));
    expect(mockMark.mock.calls[0][0]).toMatchObject({
      level: "C1", taskId: "c1-discussion-01", promptType: "argument",
    });
    fireEvent.click(screen.getByRole("button", { name: "Part 2 · Formal Email" }));
    fireEvent.change(screen.getByPlaceholderText("Start with an appropriate German greeting ..."), {
      target: { value: "Sehr geehrte Frau Dr. Menzel, ich möchte eine Lösung vorschlagen." },
    });
    fireEvent.click(screen.getByRole("button", { name: "Analyse my writing" }));
    await waitFor(() => expect(mockMark).toHaveBeenCalledTimes(2));
    expect(mockMark.mock.calls[1][0]).toMatchObject({
      level: "C1", taskId: "c1-email-01", promptType: "email",
    });
  });

});
