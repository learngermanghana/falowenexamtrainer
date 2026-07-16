import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useAuth } from "../context/AuthContext";
import { markLetterWithAI } from "../services/coachService";
import {
  loadWritingProgress,
  saveWritingAttempt,
  saveWritingProgress,
} from "../services/writingProgressService";
import A1CourseBookLetterPracticePanel, {
  __TESTING__,
} from "./A1CourseBookLetterPracticePanel";

jest.mock("../context/AuthContext", () => ({
  useAuth: jest.fn(),
}));

jest.mock("../services/coachService", () => ({
  markLetterWithAI: jest.fn(),
}));

jest.mock("../services/writingProgressService", () => ({
  loadWritingProgress: jest.fn(),
  saveWritingAttempt: jest.fn(),
  saveWritingProgress: jest.fn(),
}));

jest.mock("./WritingFeedbackCard", () => ({ feedback, draft }) => (
  <div data-testid="writing-feedback">
    {feedback} · {draft}
  </div>
));

const formalProps = {
  title: "Mark My Formal Letter",
  description: "Practise before submission.",
  taskId: "A1-12.3-teil-2-formal-letter",
  taskTitle: "Formal enquiry to a language school",
  taskContext:
    "formal email to a language school using Sie, Ihnen, a formal greeting and a formal closing",
  letterType: "formal",
  promptType: "email",
  placeholder:
    "Sehr geehrte Damen und Herren,\n\nich schreibe Ihnen, weil ...",
  minimumWords: 35,
  maximumWords: 50,
};

beforeEach(() => {
  jest.clearAllMocks();
  useAuth.mockReturnValue({
    user: {
      uid: "student-1",
      displayName: "Vanessa",
      email: "vanessa@example.com",
    },
    idToken: "token-1",
    studentProfile: {
      studentCode: "LLEA-001",
      level: "A1",
      program: "german",
    },
  });
  loadWritingProgress.mockResolvedValue(null);
  saveWritingProgress.mockResolvedValue(true);
  saveWritingAttempt.mockResolvedValue(true);
  markLetterWithAI.mockResolvedValue({
    feedback: "Good formal opening.",
    score: 20,
    maxScore: 25,
    rubric: { overall: 20 },
    corrections: [],
    structuredFeedback: { summary: "Good formal opening." },
  });
});

test("loads the exact task workspace and displays its configured placeholder", async () => {
  loadWritingProgress.mockResolvedValue({
    draft: "Sehr geehrte Damen und Herren, ich möchte Informationen.",
  });

  render(<A1CourseBookLetterPracticePanel {...formalProps} />);

  const textarea = await screen.findByLabelText("Your letter");
  await waitFor(() =>
    expect(textarea).toHaveValue(
      "Sehr geehrte Damen und Herren, ich möchte Informationen.",
    ),
  );
  expect(textarea).toHaveAttribute("placeholder", formalProps.placeholder);
  expect(loadWritingProgress).toHaveBeenCalledWith({
    userId: "student-1",
    studentCode: "LLEA-001",
    mode: "course",
    workspaceKey: "A1-12.3-teil-2-formal-letter",
  });
});

test("marks the formal task as an email with explicit formal course context", async () => {
  render(<A1CourseBookLetterPracticePanel {...formalProps} />);

  const draft = Array.from(
    { length: 35 },
    (_, index) => (index === 0 ? "Sehr" : `wort${index}`),
  ).join(" ");
  fireEvent.change(await screen.findByLabelText("Your letter"), {
    target: { value: draft },
  });
  fireEvent.click(
    screen.getByRole("button", { name: "Mark My Formal Letter" }),
  );

  await waitFor(() => expect(markLetterWithAI).toHaveBeenCalledTimes(1));
  expect(markLetterWithAI).toHaveBeenCalledWith(
    expect.objectContaining({
      text: draft,
      level: "A1",
      studentName: "Vanessa",
      promptType: "email",
      submissionContext: expect.stringContaining(
        "course-task:formal email to a language school",
      ),
      idToken: "token-1",
    }),
  );

  await waitFor(() => expect(saveWritingAttempt).toHaveBeenCalledTimes(1));
  expect(saveWritingAttempt).toHaveBeenCalledWith(
    expect.objectContaining({
      workspaceKey: "A1-12.3-teil-2-formal-letter",
      attempt: expect.objectContaining({
        taskId: "A1-12.3-teil-2-formal-letter",
        letterType: "formal",
        promptType: "email",
        originalText: draft,
      }),
    }),
  );
  expect(screen.getByTestId("writing-feedback")).toHaveTextContent(
    "Good formal opening.",
  );
});

test("builds different marker contexts for formal and informal tasks", () => {
  expect(
    __TESTING__.buildPracticeSubmissionContext({
      taskContext: "informal birthday note",
      letterType: "informal",
      promptType: "note",
    }),
  ).toBe("course-task:informal birthday note informal note");

  expect(
    __TESTING__.buildPracticeSubmissionContext({
      taskContext: "formal language school email",
      letterType: "formal",
      promptType: "email",
    }),
  ).toBe("course-task:formal language school email formal email");
});
