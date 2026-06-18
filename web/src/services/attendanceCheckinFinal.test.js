import {
  isAttendanceSessionActive,
  resolveAttendanceApiBase,
  submitFalowenAttendanceCheckin,
} from "./attendanceCheckinService";

jest.mock("../firebase", () => ({
  collection: jest.fn(),
  db: {},
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  isFirebaseConfigured: true,
}));

describe("final attendance check-in service", () => {
  const now = new Date("2026-06-18T12:00:00Z").getTime();

  it("uses /api when API environment variables are missing", () => {
    expect(resolveAttendanceApiBase({})).toBe("/api");
  });

  it("requires an ID token before submitting", async () => {
    await expect(
      submitFalowenAttendanceCheckin({ className: "A1", sessionId: "session-1" })
    ).rejects.toThrow("Missing Firebase ID token");
  });

  it("accepts an open Admin attendance session", () => {
    expect(
      isAttendanceSessionActive(
        {
          opened: true,
          openFrom: "2026-06-18T11:00:00Z",
          openTo: "2026-06-18T13:00:00Z",
        },
        now
      )
    ).toBe(true);
  });

  it("rejects expired and closed Admin attendance sessions", () => {
    expect(
      isAttendanceSessionActive({ opened: true, openTo: "2026-06-18T11:59:00Z" }, now)
    ).toBe(false);
    expect(
      isAttendanceSessionActive({ opened: false, openTo: "2026-06-18T13:00:00Z" }, now)
    ).toBe(false);
  });
});
