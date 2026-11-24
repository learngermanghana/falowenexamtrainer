import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import ExamReadinessBadge from "./ExamReadinessBadge";
import { fetchScoreSummary } from "../services/scoreSummaryService";
import { fetchAttendanceSummary } from "../services/attendanceService";

let mockIdToken = "signed-in-firebase-token";
let mockUser = { uid: "learner-auth-uid" };

jest.mock("react-router-dom", () => ({
  useNavigate: () => jest.fn(),
}));
jest.mock("react-i18next", () => {
  const stableTranslate = (key, fallback) => typeof fallback === "string" ? fallback : key;
  return { useTranslation: () => ({ t: stableTranslate }) };
});
jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({ idToken: mockIdToken, user: mockUser }),
}));
jest.mock("../firebase", () => ({ isFirebaseConfigured: true }));
jest.mock("../services/scoreSummaryService", () => ({
  fetchScoreSummary: jest.fn(),
}));
jest.mock("../services/attendanceService", () => ({
  fetchAttendanceSummary: jest.fn(),
}));

const score = {
  student: {
    totalAssignments: 28,
    completedAssignments: [{ score: 82, assignmentId: "B2-1" }],
    failedAssignments: [],
    missedAssignments: [],
    retriesThisWeek: 0,
  },
};

beforeEach(() => {
  jest.clearAllMocks();
  mockIdToken = "signed-in-firebase-token";
  mockUser = { uid: "learner-auth-uid" };
  fetchScoreSummary.mockResolvedValue(score);
  fetchAttendanceSummary.mockResolvedValue({ sessions: 2 });
});

test("independent B2 learner automatically receives their own score readiness without a class", async () => {
  render(<ExamReadinessBadge studentProfile={{ id: "student-record-id", level: "B2" }} variant="homepage" />);
  await waitFor(() => expect(screen.getByRole("progressbar", { name: "Course progress" }))
    .toHaveAttribute("aria-valuenow", expect.stringMatching(/^\d+$/)));
  expect(fetchScoreSummary).toHaveBeenCalledWith({
    idToken: "signed-in-firebase-token",
    studentCode: "student-record-id",
  });
  expect(fetchAttendanceSummary).not.toHaveBeenCalled();
  expect(screen.queryByText(/Add your class and student code/)).not.toBeInTheDocument();
});

test("class attendance failing does not prevent authenticated score readiness", async () => {
  fetchAttendanceSummary.mockRejectedValue(new Error("attendance offline"));
  render(<ExamReadinessBadge studentProfile={{ id: "student-record-id", className: "A2 Accra", level: "A2" }} variant="homepage" />);
  await waitFor(() => expect(screen.getByRole("progressbar", { name: "Course progress" }))
    .toHaveAttribute("aria-valuenow", expect.stringMatching(/^\d+$/)));
  expect(fetchAttendanceSummary).toHaveBeenCalledWith({
    className: "A2 Accra",
    level: "A2",
    studentCode: "student-record-id",
    studentUid: "learner-auth-uid",
  });
});

test("does not display a fabricated 15 percent while the authenticated token is loading", () => {
  mockIdToken = null;
  render(<ExamReadinessBadge studentProfile={{ id: "student-record-id", level: "B2" }} variant="homepage" />);
  expect(screen.getByText("Checking your latest progress…")).toBeInTheDocument();
  expect(screen.getByRole("progressbar", { name: "Course progress" })).not.toHaveAttribute("aria-valuenow");
  expect(fetchScoreSummary).not.toHaveBeenCalled();
});

test("does not ask a student to manually supply class and code on incomplete profile", async () => {
  render(<ExamReadinessBadge studentProfile={{ level: "B2" }} variant="homepage" />);
  expect(await screen.findByText(/student record could not be identified automatically/i)).toBeInTheDocument();
  expect(fetchScoreSummary).not.toHaveBeenCalled();
});

test("no marked results do not get mistaken for a calculated score", async () => {
  fetchScoreSummary.mockResolvedValue({ student: null });
  render(<ExamReadinessBadge studentProfile={{ id: "student-record-id", level: "B2" }} variant="homepage" />);
  expect(await screen.findByText(/No marked results yet/i)).toBeInTheDocument();
  expect(screen.getByRole("progressbar", { name: "Course progress" })).not.toHaveAttribute("aria-valuenow");
});

test("prefer canonical student code if the authenticated profile provides it", async () => {
  render(<ExamReadinessBadge studentProfile={{ id: "document-key", studentCode: "LL-2026-010", level: "B1" }} variant="homepage" />);
  await waitFor(() => expect(fetchScoreSummary).toHaveBeenCalled());
  expect(fetchScoreSummary).toHaveBeenCalledWith({
    idToken: "signed-in-firebase-token",
    studentCode: "LL-2026-010",
  });
});
