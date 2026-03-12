import { render, screen } from "@testing-library/react";

jest.mock("../context/AuthContext", () => ({
  useAuth: () => ({
    user: { uid: "u1" },
    studentProfile: { className: "A2-MON", studentCode: "ST-1", level: "A2" },
  }),
}));

jest.mock("../services/attendanceService", () => ({
  fetchAttendanceRecords: jest.fn(() =>
    Promise.resolve({
      records: [
        { id: "1", level: "A2", present: true, title: "Chapter 1 · Introductions" },
        { id: "2", level: "A2", present: false, title: "Chapter 2 · Family" },
      ],
    })
  ),
}));

jest.mock("../firebase", () => ({
  isFirebaseConfigured: true,
}));

import AttendanceTab from "./AttendanceTab";

describe("AttendanceTab", () => {
  it("shows present and not present attendance dictionaries", async () => {
    render(<AttendanceTab />);

    expect(await screen.findByText(/Present \(1\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Not present \/ pending \(1\)/i)).toBeInTheDocument();
    expect(screen.getByText(/Chapter 1 · Introductions/i)).toBeInTheDocument();
    expect(screen.getByText(/Chapter 2 · Family/i)).toBeInTheDocument();
  });
});
