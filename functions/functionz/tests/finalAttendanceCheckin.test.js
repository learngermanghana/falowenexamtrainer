const express = require("express");
const http = require("http");
const {
  createFinalAttendanceCheckinRouter,
  isPresentAttendanceEntry,
} = require("../routes/finalAttendanceCheckin");

const request = (app, body) =>
  new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const payload = JSON.stringify(body);
      const req = http.request(
        {
          port: server.address().port,
          path: "/attendance/checkin",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Content-Length": Buffer.byteLength(payload),
            Authorization: "Bearer token",
          },
        },
        (res) => {
          let data = "";
          res.setEncoding("utf8");
          res.on("data", (chunk) => (data += chunk));
          res.on("end", () =>
            server.close(() => resolve({ status: res.statusCode, body: JSON.parse(data) }))
          );
        }
      );
      req.on("error", (error) => server.close(() => reject(error)));
      req.write(payload);
      req.end();
    });
  });

function createFixture({ existingCheckinIds = [], attendanceEntry } = {}) {
  const writes = [];
  const studentSnap = {
    exists: true,
    id: "student-doc",
    data: () => ({ className: "A1", studentCode: "STU-1", email: "student@example.com" }),
  };
  const session = {
    opened: true,
    openTo: "2999-01-01T00:00:00Z",
    attendance: { "STU-1": attendanceEntry },
  };
  const sessionRef = {
    kind: "session",
    collection: () => ({ doc: (id) => ({ kind: "checkin", id }) }),
  };
  const transaction = {
    get: jest.fn(async (ref) => {
      if (ref.kind === "session") return { exists: true, data: () => session };
      if (ref.kind === "checkin") return { exists: existingCheckinIds.includes(ref.id) };
      throw new Error("Unexpected reference");
    }),
    set: jest.fn((ref, data, options) => writes.push({ ref, data, options })),
  };
  const db = {
    collection: jest.fn((name) => {
      if (name === "students") {
        return {
          doc: () => ({ get: async () => studentSnap }),
          where: jest.fn(),
        };
      }
      if (name === "attendance") {
        return { doc: () => ({ collection: () => ({ doc: () => sessionRef }) }) };
      }
      throw new Error(`Unexpected collection: ${name}`);
    }),
    runTransaction: jest.fn((callback) => callback(transaction)),
  };
  const firestore = jest.fn(() => db);
  firestore.FieldValue = { serverTimestamp: jest.fn(() => "SERVER_TIME") };
  const adminInstance = {
    auth: () => ({ verifyIdToken: jest.fn(async () => ({ uid: "uid-1", email: "student@example.com" })) }),
    firestore,
  };
  const app = express();
  app.use(createFinalAttendanceCheckinRouter({ adminInstance }));
  return { app, writes };
}

describe("final hybrid attendance check-in", () => {
  it("recognises only present attendance-map entries as duplicates", () => {
    expect(isPresentAttendanceEntry(false)).toBe(false);
    expect(isPresentAttendanceEntry({ present: false, status: "absent" })).toBe(false);
    expect(isPresentAttendanceEntry(true)).toBe(true);
    expect(isPresentAttendanceEntry({ present: true })).toBe(true);
    expect(isPresentAttendanceEntry({ attended: true })).toBe(true);
    expect(isPresentAttendanceEntry({ status: "present" })).toBe(true);
  });

  it.each(["uid-1", "student-doc", "STU-1"])(
    "preserves an existing check-in stored under %s",
    async (existingId) => {
      const { app, writes } = createFixture({ existingCheckinIds: [existingId] });
      const response = await request(app, { className: "A1", sessionId: "session-1" });
      expect(response.status).toBe(200);
      expect(response.body.duplicate).toBe(true);
      expect(writes).toHaveLength(0);
    }
  );

  it("allows check-in when the attendance map contains an absent entry", async () => {
    const { app, writes } = createFixture({ attendanceEntry: { present: false, status: "absent" } });
    const response = await request(app, { className: "A1", sessionId: "session-1" });
    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({ duplicate: false, method: "falowen_button" });
    expect(writes).toHaveLength(2);
  });

  it("treats an existing present attendance-map entry as a duplicate", async () => {
    const { app, writes } = createFixture({ attendanceEntry: { present: true, status: "present" } });
    const response = await request(app, { className: "A1", sessionId: "session-1" });
    expect(response.status).toBe(200);
    expect(response.body.duplicate).toBe(true);
    expect(writes).toHaveLength(0);
  });
});
