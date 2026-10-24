import { isAttendanceSessionActive } from "./attendanceCheckinService";

jest.mock("../firebase", () => ({
  collection: jest.fn(),
  db: {},
  doc: jest.fn(),
  getDoc: jest.fn(),
  getDocs: jest.fn(),
  isFirebaseConfigured: true,
}));

describe("isAttendanceSessionActive", () => {
  const now = new Date("2026-06-18T12:00:00Z").getTime();

  it("prefers Admin opened/openFrom/openTo sessions", () => {
    expect(
      isAttendanceSessionActive(
        { opened: true, active: false, openFrom: "2026-06-18T11:00:00Z", openTo: "2026-06-18T13:00:00Z" },
        now
      )
    ).toBe(true);
  });

  it("treats expired Admin sessions as inactive", () => {
    expect(isAttendanceSessionActive({ opened: true, openTo: "2026-06-18T11:59:00Z" }, now)).toBe(false);
  });

  it("treats closed Admin sessions as inactive", () => {
    expect(isAttendanceSessionActive({ opened: false, active: true, openTo: "2026-06-18T13:00:00Z" }, now)).toBe(false);
  });
});
