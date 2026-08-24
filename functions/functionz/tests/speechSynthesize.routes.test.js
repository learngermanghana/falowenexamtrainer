const http = require("http");

let mockDb;
const mockVerifyIdToken = jest.fn(async () => ({ uid: "uid-tts", email: "student@example.com" }));
const mockSpeechCreate = jest.fn();
const auditAdd = jest.fn(async () => ({}));

jest.mock("firebase-admin", () => ({
  apps: [{}],
  auth: () => ({ verifyIdToken: mockVerifyIdToken }),
  firestore: () => mockDb,
  credential: { cert: jest.fn() },
  initializeApp: jest.fn(),
}));

jest.mock("../openaiClient", () => ({
  createChatCompletion: jest.fn(),
  getOpenAIClient: jest.fn(() => ({ audio: { speech: { create: mockSpeechCreate } } })),
}));

const admin = require("firebase-admin");
admin.firestore.FieldValue = { serverTimestamp: jest.fn(() => "SERVER_TIME") };
admin.firestore.Timestamp = { now: jest.fn(() => "NOW") };

const app = require("../app");

function makeDb({ currentTts = 0 } = {}) {
  return {
    collection: jest.fn((name) => {
      if (name === "aiAuditLogs") return { add: auditAdd };
      return { doc: jest.fn(() => ({ id: "quota" })) };
    }),
    runTransaction: jest.fn(async (fn) => fn({
      get: jest.fn(async () => ({ exists: true, data: () => ({ counters: { [new Date().toISOString().slice(0, 10)]: { tts: currentTts } } }) })),
      set: jest.fn(),
    })),
  };
}

function postJson(path, body, headers = {}) {
  const raw = JSON.stringify(body || {});
  return new Promise((resolve, reject) => {
    const server = app.listen(0, () => {
      const { port } = server.address();
      const req = http.request({ port, path, method: "POST", headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(raw), ...headers } }, (res) => {
        const chunks = [];
        res.on("data", (chunk) => chunks.push(chunk));
        res.on("end", () => server.close(() => {
          const buffer = Buffer.concat(chunks);
          let body = buffer;
          if ((res.headers["content-type"] || "").includes("application/json")) body = JSON.parse(buffer.toString("utf8") || "{}");
          resolve({ status: res.statusCode, headers: res.headers, body, buffer });
        }));
      });
      req.on("error", (err) => server.close(() => reject(err)));
      req.write(raw);
      req.end();
    });
  });
}

beforeEach(() => {
  jest.clearAllMocks();
  mockDb = makeDb();
  process.env.OPENAI_API_KEY = "test-key";
  delete process.env.OPENAI_TTS_MODEL;
  delete process.env.OPENAI_TTS_VOICE;
  mockSpeechCreate.mockResolvedValue({ arrayBuffer: async () => Buffer.from("mp3-bytes") });
});

describe("POST /speech/synthesize", () => {
  it("requires authentication", async () => {
    mockVerifyIdToken.mockResolvedValueOnce(null);
    const res = await postJson("/speech/synthesize", { text: "Hallo", level: "A2" });
    expect(res.status).toBe(401);
  });

  it("rejects empty and oversized text", async () => {
    const empty = await postJson("/speech/synthesize", { text: " ", level: "A2" }, { Authorization: "Bearer token" });
    const long = await postJson("/speech/synthesize", { text: "x".repeat(1201), level: "A2" }, { Authorization: "Bearer token" });
    expect(empty.status).toBe(400);
    expect(long.status).toBe(400);
  });

  it("returns 429 when tts quota is exhausted", async () => {
    mockDb = makeDb({ currentTts: 30 });
    const res = await postJson("/speech/synthesize", { text: "Hallo", level: "A2" }, { Authorization: "Bearer token" });
    expect(res.status).toBe(429);
    expect(mockSpeechCreate).not.toHaveBeenCalled();
  });

  it("calls OpenAI speech with expected options and returns audio/mpeg", async () => {
    process.env.OPENAI_TTS_MODEL = "tts-model";
    process.env.OPENAI_TTS_VOICE = "voice-name";
    const text = "Das klingt interessant. Warum möchtest du Deutsch lernen?";
    const res = await postJson("/speech/synthesize", { text, level: "b1" }, { Authorization: "Bearer token" });
    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toContain("audio/mpeg");
    expect(res.headers["cache-control"]).toBe("private, max-age=3600");
    expect(res.buffer.toString()).toBe("mp3-bytes");
    expect(mockSpeechCreate).toHaveBeenCalledWith(expect.objectContaining({ model: "tts-model", voice: "voice-name", input: text, response_format: "mp3", speed: 0.94, instructions: expect.stringContaining("Standard German") }));
  });

  it("uses supported level speed and safe logs without full input", async () => {
    const secretText = `Hallo ${"secret ".repeat(20)}`;
    await postJson("/speech/synthesize", { text: secretText, level: "C1" }, { Authorization: "Bearer token" });
    expect(mockSpeechCreate).toHaveBeenCalledWith(expect.objectContaining({ speed: 1.03 }));
    expect(JSON.stringify(auditAdd.mock.calls)).not.toContain(secretText);
  });

  it("returns a safe structured error when OpenAI speech fails", async () => {
    mockSpeechCreate.mockRejectedValueOnce(new Error("provider exploded with details"));
    const res = await postJson("/speech/synthesize", { text: "Hallo", level: "B2" }, { Authorization: "Bearer token" });
    expect(res.status).toBe(502);
    expect(res.body).toEqual({ error: "Speech generation failed", code: "speech_generation_failed" });
  });
});
