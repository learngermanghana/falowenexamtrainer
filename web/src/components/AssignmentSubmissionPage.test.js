import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

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
    },
  }),
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
      { day: 1, topic: "Tutor Assignment", assignment: true, chapter: "1", assignmentId: "A1-1" },
    ],
  },
}));

jest.mock("../services/answerKeyRegistryService", () => ({
  fetchAnswerKeyRegistry: jest.fn(() => Promise.resolve(new Map())),
  resolveAnswerKeySource: jest.fn(() => null),
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

import AssignmentSubmissionPage from "./AssignmentSubmissionPage";

describe("AssignmentSubmissionPage", () => {
  it("excludes self-practice items from normal submission options and keeps tutor-marked options", async () => {
    render(
      <MemoryRouter>
        <AssignmentSubmissionPage />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByRole("combobox")).toBeInTheDocument());

    const options = screen.getAllByRole("option").map((option) => option.textContent);
    expect(options.some((text) => /Day 0 · Orientation/i.test(text || ""))).toBe(false);
    expect(options.some((text) => /Day 1 · Tutor Assignment/i.test(text || ""))).toBe(true);
  });
});
