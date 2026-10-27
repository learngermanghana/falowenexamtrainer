const http = require("node:http");
let mockDb;
let mockPublishedDoc;
const mockVerifyIdToken = jest.fn(async () => ({ uid: "test-student", email: "learner@example.com" }));
const mockSignerA1 = jest.fn(async ({ key, mockId, part }) => ({ url: `https://signed.test/${key}`, mockId, part }));
const mockSignerA2 = jest.fn(async ({ key, mockId, part }) => ({ url: `https://signed.test/${key}`, mockId, part }));
const mockSignerB1 = jest.fn(async ({ key, mockId, part }) => ({ url: `https://signed.test/${key}`, mockId, part }));
const mockSignerB2 = jest.fn(async ({ key, mockId, part }) => ({ url: `https://signed.test/${key}`, mockId, part }));

jest.mock("firebase-admin", () => ({
  apps: [{}],
  auth: () => ({ verifyIdToken: mockVerifyIdToken }),
  firestore: () => mockDb,
  credential: { cert: jest.fn() },
  initializeApp: jest.fn(),
}));
jest.mock("../r2CourseAudio", () => ({
  ...jest.requireActual("../r2CourseAudio"),
  createA1MockAudioSignedUrl: mockSignerA1,
  createA2MockAudioSignedUrl: mockSignerA2,
  createB1MockAudioSignedUrl: mockSignerB1,
  createB2MockAudioSignedUrl: mockSignerB2,
}));

jest.mock("../b1Mock2PublishedAudio", () => ({
  ...jest.requireActual("../b1Mock2PublishedAudio"),
  verifyB1Mock2Audio: jest.fn(async () => false),
}));
const { verifyB1Mock2Audio } = require("../b1Mock2PublishedAudio");

const admin = require("firebase-admin");
admin.firestore.FieldValue = { serverTimestamp: jest.fn(() => "SERVER_TIME") };
const app = require("../app");

function getJson(path) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const request = http.get({
        hostname: "127.0.0.1", port: server.address().port, path,
        headers: { Authorization: "Bearer test-token" },
      }, response => {
        let data = "";
        response.setEncoding("utf8");
        response.on("data", chunk => { data += chunk; });
        response.on("end", () => server.close(() => {
          try { resolve({ status: response.statusCode, body: JSON.parse(data) }); }
          catch (err) { reject(err); }
        }));
      });
      request.on("error", err => server.close(() => reject(err)));
    });
    server.on("error", reject);
  });
}

function request(level, mockId, part, key) {
  return `/course-media/${level.toLowerCase()}/mock-audio-url?mockId=${encodeURIComponent(mockId)}&part=${encodeURIComponent(part)}&key=${encodeURIComponent(key)}`;
}

beforeEach(() => {
  mockPublishedDoc = null;
  verifyB1Mock2Audio.mockReset().mockResolvedValue(false);
  for (const fn of [mockSignerA1, mockSignerA2, mockSignerB1, mockSignerB2]) fn.mockClear();
  mockDb = {
    collection: name => ({
      doc: () => ({
        get: async () => name === "students"
          ? { exists: true, data: () => ({ level: "B2", status: "active", paymentStatus: "paid" }) }
          : name === "publishedMockHoerenAudio" && mockPublishedDoc
          ? { exists: true, data: () => mockPublishedDoc }
          : { exists: false, data: () => ({}) },
      }),
      where: () => ({ limit: () => ({ get: async () => ({ empty: true, docs: [] }) }) }),
    }),
  };
});

test.each([
  ["A1", "mock-08", "teil-1", "a1/mock-hoeren/mock-08/teil-1.mp3"],
  ["A2", "mock-02", "teil-1", "a2/mock-hoeren/mock-02/teil-1.mp3"],
  ["B1", "mock-02", "teil-1", "b1/mock-hoeren/mock-02/teil-1.mp3"],
  ["B2", "mock-99", "teil-1", "b2/mock-hoeren/mock-99/teil-1.mp3"],
])("%s endpoint refuses a future canonical mock ID absent a published manifest", async (level, id, part, key) => {
  const result = await getJson(request(level, id, part, key));
  expect(result.status).toBe(404);
  expect(result.body).not.toHaveProperty("url");
  const signer = { A1: mockSignerA1, A2: mockSignerA2, B1: mockSignerB1, B2: mockSignerB2 }[level];
  expect(signer).toHaveBeenCalledTimes(level === "B1" ? 1 : 0);
});

test("published B1 manifest permits only the exact approved recording", async () => {
  mockPublishedDoc = { status: "published", level: "B1", mockId: "mock-02",
    parts: { "teil-1": "b1/mock-hoeren/mock-02/teil-1.mp3" } };
  const released = await getJson(request("B1", "mock-02", "teil-1", mockPublishedDoc.parts["teil-1"]));
  expect(released.status).toBe(200);
  expect(mockSignerB1).toHaveBeenCalledTimes(1);
  const pending = await getJson(request("B1", "mock-02", "teil-2", "b1/mock-hoeren/mock-02/teil-2.mp3"));
  expect(pending.status).toBe(404);
  expect(mockSignerB1).toHaveBeenCalledTimes(2);
  mockPublishedDoc.status = "draft";
  const draft = await getJson(request("B1", "mock-02", "teil-1", mockPublishedDoc.parts["teil-1"]));
  expect(draft.status).toBe(404);
  expect(mockSignerB1).toHaveBeenCalledTimes(3);
});

test.each([
  ["A1", "mock-01", "teil-1", "a1/mock-hoeren/mock-01/teil-1.mp3"],
  ["A1", "mock-04", "teil-1", "a1/mock-hoeren/mock-04/teil-1.mp3"],
  ["A1", "mock-05", "teil-1", "a1/mock-hoeren/mock-05/teil-1.mp3"],
  ["A1", "mock-05", "teil-2", "a1/mock-hoeren/mock-05/teil-2.mp3"],
  ["A1", "mock-05", "teil-3", "a1/mock-hoeren/mock-05/teil-3.mp3"],
  ["A1", "mock-06", "teil-1", "a1/mock-hoeren/mock-06/teil-1.mp3"],
  ["A1", "mock-06", "teil-2", "a1/mock-hoeren/mock-06/teil-2.mp3"],
  ["A1", "mock-06", "teil-3", "a1/mock-hoeren/mock-06/teil-3.mp3"],
  ["A1", "mock-07", "teil-1", "a1/mock-hoeren/mock-07/teil-1.mp3"],
  ["A1", "mock-07", "teil-2", "a1/mock-hoeren/mock-07/teil-2.mp3"],
  ["A1", "mock-07", "teil-3", "a1/mock-hoeren/mock-07/teil-3.mp3"],
  ["A2", "mock-01", "teil-4", "a2/mock-hoeren/mock-01/teil-4.mp3"],
  ["A2", "mock-02", "teil-1", "a2/mock-horen-2/teil-1.mp3"],
  ["B1", "mock-01", "teil-1", "b1/mock-hoeren-1/teil-1.mp3"],
  ["B2", "mock-01", "teil-1", "b2/mock-hoeren-1/teil-1.mp3"],
])("%s existing published / legacy path stays playable", async (level, id, part, key) => {
  const result = await getJson(request(level, id, part, key));
  expect(result.status).toBe(200);
  expect(result.body.url).toContain(key);
});

test("B1 Mock 2 exact teacher key plays when the R2 verifier confirms the asset", async () => {
  verifyB1Mock2Audio.mockResolvedValueOnce(true);
  const key = "b1/mock-hoeren/mock-02/teil-1.mp3";
  const response = await getJson(request("B1", "mock-02", "teil-1", key));
  expect(response.status).toBe(200);
  expect(response.body.url).toContain(key);
  expect(verifyB1Mock2Audio).toHaveBeenCalledTimes(1);
  const denied = await getJson(request("B1", "mock-03", "teil-1", "b1/mock-hoeren/mock-03/teil-1.mp3"));
  expect(denied.status).toBe(404);
});
