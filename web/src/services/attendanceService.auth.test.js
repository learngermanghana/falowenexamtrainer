import { auth, collection, getDocs } from "../firebase";
import { fetchAttendanceRecords } from "./attendanceService";

jest.mock("../firebase", () => ({
  auth: { currentUser: null },
  db: {},
  collection: jest.fn(),
  getDocs: jest.fn(),
}));

jest.mock("./attendanceServiceBase", () => ({
  fetchAttendanceRecords: jest.fn(),
  buildAttendanceSummary: jest.fn(() => ({})),
}));

describe("attendance authentication guard", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    auth.currentUser = null;
  });

  it("does not query Firestore before Firebase restores a signed-in user", async () => {
    const result = await fetchAttendanceRecords({
      className: "A1 Munich Klasse",
      studentCode: "Student001",
    });

    expect(result).toEqual({
      records: [],
      sessions: 0,
      hours: 0,
      excludedSessions: 0,
    });
    expect(collection).not.toHaveBeenCalled();
    expect(getDocs).not.toHaveBeenCalled();
  });
});
