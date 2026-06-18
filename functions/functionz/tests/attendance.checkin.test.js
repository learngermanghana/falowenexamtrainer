const http = require("http");

let mockDb;
const verifyIdToken = jest.fn(async () => ({ uid: "uid-1", email: "student@example.com" }));

jest.mock("firebase-admin", () => ({
  apps: [{}],
  auth: () => ({ verifyIdToken }),
  firestore: () => mockDb,
  credential: { cert: jest.fn() },
  initializeApp: jest.fn(),
}));

const admin = require("firebase-admin");
admin.firestore.FieldValue = { serverTimestamp: jest.fn(() => "SERVER_TIME") };

const app = require("../app");

const request = (body) =>
  new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const { port } = server.address();
      const payload = JSON.stringify(body);
      const req = http.request(
        {
          port,
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
          res.on("end", () => server.close(() => resolve({ status: res.statusCode, body: data ? JSON.parse(data) : null })));
        }
      );
      req.on("error", (err) => server.close(() => reject(err)));
      req.write(payload);
      req.end();
    });
  });

function createDb({ session, existingCheckin = null }) {
  const writes = [];
  const studentSnap = { exists: true, id: "student-doc", data: () => ({ className: "A1", studentCode: "STU-1", email: "student@example.com" }) };
  const sessionRef = { kind: "session", collection: () => ({ doc: () => checkinRef }) };
  const checkinRef = { kind: "checkin" };
  const tx = {
    get: jest.fn(async (ref) => {
      if (ref.kind === "session") return { exists: true, data: () => session };
      if (ref.kind === "checkin") return { exists: Boolean(existingCheckin), data: () => existingCheckin || {} };
      throw new Error("unknown ref");
    }),
    set: jest.fn((ref, data, opts) => writes.push({ ref, data, opts })),
  };
  return {
    writes,
    tx,
    collection: jest.fn((name) => {
      if (name === "students") return { doc: () => ({ get: async () => studentSnap }), where: jest.fn() };
      if (name === "attendance") return { doc: () => ({ collection: () => ({ doc: () => sessionRef }) }) };
      throw new Error(`unexpected collection ${name}`);
    }),
    runTransaction: jest.fn((fn) => fn(tx)),
  };
}

beforeEach(() => {
  jest.clearAllMocks();
});

describe("attendance check-in", () => {
  it("accepts an Admin session with opened, openFrom, and openTo", async () => {
    mockDb = createDb({ session: { opened: true, openFrom: "2026-06-18T00:00:00Z", openTo: "2999-01-01T00:00:00Z" } });

    const res = await request({ className: "A1", sessionId: "s1" });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ ok: true, duplicate: false });
    expect(mockDb.writes[0].data.method).toBe("falowen_button");
  });

  it("rejects an expired Admin session", async () => {
    mockDb = createDb({ session: { opened: true, openFrom: "2020-01-01T00:00:00Z", openTo: "2020-01-02T00:00:00Z" } });

    const res = await request({ className: "A1", sessionId: "s1" });

    expect(res.status).toBe(409);
    expect(mockDb.writes).toHaveLength(0);
  });

  it("rejects a closed Admin session", async () => {
    mockDb = createDb({ session: { opened: false, openFrom: "2020-01-01T00:00:00Z", openTo: "2999-01-01T00:00:00Z" } });

    const res = await request({ className: "A1", sessionId: "s1" });

    expect(res.status).toBe(409);
    expect(mockDb.writes).toHaveLength(0);
  });

  it("returns duplicate for an existing QR check-in without overwriting it", async () => {
    mockDb = createDb({
      session: { opened: true, openTo: "2999-01-01T00:00:00Z", attendance: {} },
      existingCheckin: { method: "qr", source: "public_checkin", checkedInAt: "old" },
    });

    const res = await request({ className: "A1", sessionId: "s1" });

    expect(res.status).toBe(200);
    expect(res.body).toMatchObject({ duplicate: true });
    expect(mockDb.writes).toHaveLength(0);
  });

  it("saves successful Falowen button check-ins with the app source", async () => {
    mockDb = createDb({ session: { opened: true, attendance: {} } });

    const res = await request({ className: "A1", sessionId: "s1", source: "falowen_student_app" });

    expect(res.status).toBe(200);
    expect(mockDb.writes[0].data).toMatchObject({ method: "falowen_button", source: "falowen_student_app" });
    expect(mockDb.writes[1].data.attendance["STU-1"]).toMatchObject({ method: "falowen_button", source: "falowen_student_app" });
  });
});
