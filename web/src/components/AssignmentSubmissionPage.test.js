import React from "react";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

const TUTOR_ASSIGNMENT_LABEL = "A1 • Day 1: Tutor Assignment • Chapter 1.1";

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: { uid: "u1", email: "student@example.com" },
    studentProfile: {
      className: "A1 Demo",
      level: "A1",
      studentCode: "ST-1",
      assignmentTitle: "Day 0 · Orientation",
      assignmentTitles: ["Day 0 · Orientation", "Day 1 · Tutor Assignment"],
      assignments: ["Day 0 · Orientation", "Day 1 · Tutor Assignment"],
      name: "Ada Student",
    },
  }),
}));

jest.mock("../context/ToastContext", () => ({
  useToast: () => ({ showToast: jest.fn() }),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key) => key,
    i18n: { resolvedLanguage: "en", language: "en" },
  }),
}));

jest.mock("../data/courseSchedule", () => ({
  courseSchedules: {
    A1: [
      { day: 0, topic: "Orientation", assignment: false, chapter: "0" },
      { day: 1, topic: "Tutor Assignment", assignment: true, chapter: "1.1", assignmentId: "A1-1.1" },
    ],
  },
}));

jest.mock("../data/germanAssignmentCatalog", () => ({
  getCurriculumEntriesForLevel: jest.fn(() => [
    { assignmentDay: 1, topic: "Tutor Assignment", assignment: true, chapter: "1.1", assignment_id: "A1-1.1" },
  ]),
}));

jest.mock("../utils/assignmentIdentity", () => ({
  resolveAssignmentCanonicalKey: jest.fn(({ assignmentId, assignmentTitle }) => assignmentId || assignmentTitle || ""),
}));

jest.mock("../utils/assignmentProgress", () => ({
  mergeAssignmentProgress: jest.fn(() => []),
}));

jest.mock("../services/answerKeyRegistryService", () => ({
  fetchAnswerKeyRegistry: jest.fn(() => Promise.resolve(new Map())),
  resolveAnswerKeySource: jest.fn(() => null),
}));

jest.mock("../services/interactionFeedback", () => ({
  triggerInteractionFeedback: jest.fn(),
}));

jest.mock("./ExamReadinessBadge", () => () => <div>badge</div>);

jest.mock("../firebase", () => ({
  db: {},
  serverTimestamp: jest.fn(() => ({ seconds: 1 })),
  collection: jest.fn(() => ({})),
  query: jest.fn(() => ({})),
  where: jest.fn(() => ({})),
  orderBy: jest.fn(() => ({})),
  limit: jest.fn(() => ({})),
  doc: jest.fn(() => ({})),
  getDoc: jest.fn(() => Promise.resolve({ exists: () => false })),
  getDocs: jest.fn(() => Promise.resolve({ docs: [], empty: true })),
  addDoc: jest.fn(() => Promise.resolve({ id: "id1" })),
  setDoc: jest.fn(() => Promise.resolve()),
}));

import { addDoc } from "../firebase";
import AssignmentSubmissionPage, { __TESTING__ } from "./AssignmentSubmissionPage";

const renderPage = (initialEntries = ["/"]) =>
  render(
    <MemoryRouter initialEntries={initialEntries}>
      <AssignmentSubmissionPage />
    </MemoryRouter>
  );

describe("AssignmentSubmissionPage", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("requires an explicit assignment selection and excludes orientation from options", async () => {
    renderPage();

    await waitFor(() => expect(screen.getByRole("combobox")).toBeInTheDocument());

    const select = screen.getByRole("combobox");
    const options = screen.getAllByRole("option").map((option) => option.textContent);

    expect(select).toHaveValue("");
    expect(options.some((text) => /Day 0 · Orientation/i.test(text || ""))).toBe(false);
    expect(options.some((text) => /Tutor Assignment/i.test(text || ""))).toBe(true);
    expect(screen.getByText("Canonical ID: –")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /submit assignment/i })).toBeDisabled();
  });

  it("locks the exact assignment when opened from a course/workbook assignment link", async () => {
    renderPage([
      {
        pathname: "/campus/submit",
        search: "?assignmentKey=A1-1.1",
      },
    ]);

    await waitFor(() => expect(screen.getByRole("combobox")).toHaveValue(TUTOR_ASSIGNMENT_LABEL));

    expect(screen.getByRole("combobox")).toBeDisabled();
    expect(screen.getByText(/Opened from course\/workbook link/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /choose a different assignment instead/i })).toBeInTheDocument();
  });


  it("compares objective answers by section and ignores free-text numbered responses", () => {
    const previousSubmission = `Teil 2:
1. B
2. C
3. A
4. C
5. B
6. B
7. A
8. C
9. C
10. B

Teil 3:
1. A
2. A
3. D
4. A
5. C

Teil :4
1. Ich esse gerne brot
2. Ich esse nicht gerne reis
3. Ich esse gern brot zum frühstrück`;

    const currentSubmission = `Teil 2: chapter 9
1. B
2. D
3. A
4. C
5. B
6. C
7. B
8. C
9. C
10. B

Teil 3:
1. A
2. A
3. D
4. A
5. C

Teil :4
1. Ich esse gerne brot
2. Ich esse nicht gerne reis
3. Ich esse gern brot zum frühstrück`;

    const diff = __TESTING__.buildResubmissionDiff({
      previousSubmissionText: previousSubmission,
      currentSubmissionText: currentSubmission,
    });

    expect(diff).toMatchObject({
      mode: "objective",
      changedAnswers: 3,
      overlappingQuestions: 15,
    });
    expect(diff.changedCharacters).toBeGreaterThan(0);
    expect(diff.newWordsCount).toBeGreaterThan(0);
  });

  it("falls back to text mode when numbered responses contain full-sentence answers", () => {
    const previousSubmission = `Teil :4
1. Ich esse gerne brot
2. Ich esse nicht gerne reis
3. Ich esse gern brot zum frühstrück`;

    const currentSubmission = `Teil :4
1. Ich esse gerne brot und suppe
2. Ich esse nicht gerne reis
3. Ich esse gern brot zum frühstrück`;

    const diff = __TESTING__.buildResubmissionDiff({
      previousSubmissionText: previousSubmission,
      currentSubmissionText: currentSubmission,
    });

    expect(diff.mode).toBe("text");
    expect(diff.changedCharacters).toBeGreaterThan(0);
  });

  it("counts repeated added words when short answers are expanded with fuller text", () => {
    const previousSubmission = `Teil 2:
1. B
2. C
3. A
4. C
5. B
6. B
7. A
8. C
9. C
10. B`;

    const currentSubmission = `Teil 2: chapter 9
1. B Apfel und Karotten
2. C Karotten
3. A Weil er brot mag
4. C
5. B
6. B
7. B
8. C
9. C
10. B`;

    const diff = __TESTING__.buildResubmissionDiff({
      previousSubmissionText: previousSubmission,
      currentSubmissionText: currentSubmission,
    });

    expect(diff.mode).toBe("text");
    expect(diff.changedCharacters).toBeGreaterThanOrEqual(40);
    expect(diff.newWordsCount).toBeGreaterThanOrEqual(8);
  });

  it("stores the true chapter and canonical id in the submission payload", async () => {
    renderPage();

    await waitFor(() => expect(screen.getByRole("combobox")).toBeInTheDocument());

    fireEvent.change(screen.getByRole("combobox"), {
      target: { value: TUTOR_ASSIGNMENT_LABEL },
    });

    expect(screen.getByText("Chapter: 1.1")).toBeInTheDocument();
    expect(screen.getByText("Canonical ID: A1-1.1")).toBeInTheDocument();
    expect(screen.getByLabelText(/I confirm I am submitting Chapter 1.1 \(A1-1.1\)\./i)).toBeInTheDocument();

    fireEvent.change(screen.getByPlaceholderText(/type your answer here or paste it in/i), {
      target: {
        value:
          "This is a long enough practice submission for the chapter routing test. It includes enough detail to pass the minimum character requirement.",
      },
    });
    fireEvent.click(screen.getByRole("checkbox"));
    fireEvent.click(screen.getByRole("button", { name: /submit assignment/i }));

    await waitFor(() => expect(addDoc).toHaveBeenCalled());

    const payload = addDoc.mock.calls[0][1];
    expect(payload.day).toBe(1);
    expect(payload.chapter).toBe("1.1");
    expect(payload.assignmentId).toBe("A1-1.1");
    expect(payload.assignmentKey).toBe("A1-1.1");
    expect(payload.canonicalAssignmentKey).toBe("A1-1.1");
  });
});
