const http = require("node:http");
let mockDb;
const mockVerifyIdToken = jest.fn(async () => ({ uid: "test-student", email: "learner@example.com" }));
const mockCreateSignedUrl = jest.fn(async ({ day, key }) => ({
  url: `https://signed.example.test/${key}?signature=TEST`,
  expiresAt: "2026-10-18T20:00:00.000Z",
  day, key,
}));

jest.mock("firebase-admin", () => ({
  apps: [{}],
  auth: () => ({ verifyIdToken: mockVerifyIdToken }),
  firestore: () => mockDb,
  credential: { cert: jest.fn() },
  initializeApp: jest.fn(),
}));

jest.mock("../r2CourseAudio", () => ({
  ...jest.requireActual("../r2CourseAudio"),
  createA1AudioSignedUrl: mockCreateSignedUrl,
}));

const admin = require("firebase-admin");
admin.firestore.FieldValue = { serverTimestamp: jest.fn(() => "SERVER_TIME") };

const app = require("../app");

function getJson(path, token = "test-token") {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const request = http.get({
        hostname: "127.0.0.1",
        port: server.address().port,
        path,
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      }, response => {
        let responseText = "";
        response.setEncoding("utf8");
        response.on("data", chunk => { responseText += chunk; });
        response.on("end", () => server.close(() => {
          try {
            resolve({ status: response.statusCode, data: responseText ? JSON.parse(responseText) : {} });
          } catch (error) { reject(error); }
        }));
      });
      request.on("error", error => server.close(() => reject(error)));
    });
    server.on("error", reject);
  });
}

beforeEach(() => {
  mockVerifyIdToken.mockClear();
  mockCreateSignedUrl.mockClear();
  mockDb = {
    collection: name => ({
      doc: () => ({
        get: async () => name === "students"
          ? { exists: true, data: () => ({ level: "A1", status: "active", paymentStatus: "paid" }) }
          : { exists: false, data: () => ({}) },
      }),
      where: () => ({ limit: () => ({ get: async () => ({ empty: true, docs: [] }) }) }),
    }),
  };
});

describe("authenticated A1 day 18 R2 course audio endpoint", () => {
  test("issues a signed URL for the Bahnhof MP3 to an eligible A1 learner", async () => {
    const reply = await getJson("/course-media/a1/audio-url?day=18&key=a1%2Fday-18%2Fday-18.mp3");
    expect(reply.status).toBe(200);
    expect(reply.data.url).toContain("/a1/day-18/day-18.mp3");
    expect(mockCreateSignedUrl).toHaveBeenCalledWith({ day: 18, key: "a1/day-18/day-18.mp3" });
  });

  test("rejects mismatched folders and does not sign them", async () => {
    const reply = await getJson("/course-media/a1/audio-url?day=18&key=a1%2Fday-17%2Fday-17.mp3");
    expect(reply.status).toBe(400);
    expect(reply.data.error).toBe("Invalid A1 audio request");
    expect(mockCreateSignedUrl).not.toHaveBeenCalled();
  });

  test("requires a signed-in student before returning an R2 URL", async () => {
    const reply = await getJson("/course-media/a1/audio-url?day=18&key=a1%2Fday-18%2Fday-18.mp3", "");
    expect(reply.status).toBe(401);
    expect(mockCreateSignedUrl).not.toHaveBeenCalled();
  });
});
