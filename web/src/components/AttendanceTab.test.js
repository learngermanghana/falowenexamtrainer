import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "../i18n";

jest.mock("../context/AuthContext", () => {
  const authState = {
    user: { uid: "u1" },
    studentProfile: { className: "A2-MON", studentCode: "ST-1", level: "A2" },
  };
  return { useAuth: () => authState };
});

jest.mock("../services/attendanceService", () => {
  const records = [
    {
      id: "present-1",
      level: "A2",
      marked: true,
      present: true,
      status: "Present",
      title: "Chapter 1 · Introductions",
      date: "2026-08-11",
    },
    {
      id: "absent-1",
      level: "A2",
      marked: true,
      present: false,
      status: "Absent",
      title: "Chapter 2 · Family",
      date: "2026-08-12",
    },
    ...Array.from({ length: 7 }, (_, index) => ({
      id: `pending-${index + 1}`,
      level: "A2",
      marked: false,
      present: null,
      status: "Pending",
      title: `Pending lesson ${index + 1}`,
    })),
  ];

  return {
    fetchAttendanceRecords: jest.fn(() => Promise.resolve({ records })),
    buildAttendanceSummary: jest.fn((input = []) => {
      const markedRecords = input.filter((record) => record.marked && record.present !== null);
      const presentRecords = markedRecords.filter((record) => record.present === true);
      const absentRecords = markedRecords.filter((record) => record.present === false);
      const pendingRecords = input.filter((record) => !record.marked || record.present === null);
      return {
        records: input,
        markedRecords,
        totalSessions: markedRecords.length,
        presentSessions: presentRecords.length,
        absentSessions: absentRecords.length,
        pendingSessions: pendingRecords.length,
        attendanceRate: 50,
        consecutiveAbsences: 1,
        lastAttendance: presentRecords[0] || null,
        statusLevel: "low",
        statusLabel: "Attendance warning",
        message: "Attend the next class to improve your attendance.",
        target: 80,
      };
    }),
  };
});

jest.mock("../firebase", () => ({
  isFirebaseConfigured: true,
}));

import AttendanceTab from "./AttendanceTab";

describe("AttendanceTab", () => {
  it("formats present, absent, and pending attendance as readable groups", async () => {
    render(<AttendanceTab />);

    expect(await screen.findByText("Attendance details")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Present" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Absent / missed" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Pending" })).toBeInTheDocument();
    expect(screen.getByText("Chapter 1 · Introductions")).toBeInTheDocument();
    expect(screen.getByText("Chapter 2 · Family")).toBeInTheDocument();
    expect(screen.getByText("Pending lesson 1")).toBeInTheDocument();
    expect(screen.getByText("Pending lesson 5")).toBeInTheDocument();
    expect(screen.queryByText("Pending lesson 6")).not.toBeInTheDocument();
  });

  it("shows a short pending preview before the student chooses to see all", async () => {
    render(<AttendanceTab />);

    expect(await screen.findByText("Pending lesson 5")).toBeInTheDocument();
    expect(screen.queryByText("Pending lesson 6")).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole("button", { name: /show all 7 pending records/i }));

    expect(screen.getByText("Pending lesson 6")).toBeInTheDocument();
    expect(screen.getByText("Pending lesson 7")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /show fewer pending records/i })).toHaveAttribute(
      "aria-expanded",
      "true"
    );
  });
});
