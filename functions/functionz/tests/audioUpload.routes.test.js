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

function postBuffer(path, body, headers = {}) {
  return new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const { port } = server.address();
      const req = http.request(
        {
          port,
          path,
          method: "POST",
          headers: {
            Authorization: "Bearer token",
            "Content-Length": body.length,
            ...headers,
          },
        },
        (res) => {
          let data = "";
          res.setEncoding("utf8");
          res.on("data", (chunk) => {
            data += chunk;
          });
          res.on("end", () => {
            server.close(() => {
              try {
                resolve({ status: res.statusCode, body: data ? JSON.parse(data) : null });
              } catch (err) {
                reject(err);
              }
            });
          });
        }
      );

      req.on("error", (err) => server.close(() => reject(err)));
      req.write(body);
      req.end();
    });
  });
}

function multipartWithAudio({ boundary = "test-boundary", audio = Buffer.from("audio") } = {}) {
  return {
    boundary,
    body: Buffer.concat([
      Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="audio"; filename="audio.webm"\r\nContent-Type: audio/webm\r\n\r\n`),
      audio,
      Buffer.from(`\r\n--${boundary}--\r\n`),
    ]),
  };
}

const audioRoutes = ["/speech-trainer/feedback", "/chatbuddy/respond"];

beforeEach(() => {
  jest.clearAllMocks();
  mockDb = null;
});

describe("audio upload middleware", () => {
  it.each(audioRoutes)("returns a structured 400 when %s receives an oversized audio file", async (route) => {
    const { boundary, body } = multipartWithAudio({ audio: Buffer.alloc(25 * 1024 * 1024 + 1, "a") });

    const res = await postBuffer(route, body, { "Content-Type": `multipart/form-data; boundary=${boundary}` });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      error: "File too large",
      code: "LIMIT_FILE_SIZE",
    });
  });

  it.each(audioRoutes)("returns a structured 400 when %s receives a malformed multipart request", async (route) => {
    const boundary = "broken-boundary";
    const body = Buffer.from(`--${boundary}\r\nContent-Disposition: form-data; name="audio"; filename="audio.webm"\r\nContent-Type: audio/webm\r\n\r\nbroken audio`);

    const res = await postBuffer(route, body, { "Content-Type": `multipart/form-data; boundary=${boundary}` });

    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: "Unexpected end of form" });
  });
});
