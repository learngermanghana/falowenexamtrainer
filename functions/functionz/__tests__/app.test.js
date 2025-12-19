const bcrypt = require("bcryptjs");
const request = require("supertest");

const admin = require("firebase-admin");
const { createChatCompletion } = require("../openaiClient");

jest.mock("firebase-admin", () => {
  const state = { record: null };

  return {
    apps: [],
    initializeApp: jest.fn(),
    firestore: jest.fn(() => ({
      collection: jest.fn(() => ({
        doc: jest.fn((id) => ({
          get: jest.fn(async () => {
            if (state.record && state.record.id === id) {
              return { exists: true, data: () => state.record.data };
            }
            return { exists: false };
          }),
        })),
        where: jest.fn(() => ({
          limit: jest.fn(() => ({
            get: jest.fn(async () => ({
              docs: state.record ? [{ exists: true, data: () => state.record.data }] : [],
            })),
          })),
        })),
      })),
    })),
    __setStudentRecord: (record) => {
      state.record = record;
    },
  };
});

jest.mock("../openaiClient", () => ({
  createChatCompletion: jest.fn(),
  getOpenAIClient: jest.fn(() => ({
    audio: { transcriptions: { create: jest.fn().mockResolvedValue({ text: "" }) } },
  })),
}));

const app = require("../app");

describe("app validation", () => {
  beforeEach(() => {
    admin.__setStudentRecord(null);
    createChatCompletion.mockReset();
  });

  test("/legacy/login rejects missing credentials", async () => {
    const res = await request(app).post("/legacy/login").send({ email: "", password: "" });
    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({ ok: false });
  });

  test("/legacy/login authenticates with studentCode and password", async () => {
    const password = "secret123";
    const hashed = bcrypt.hashSync(password, 8);
    admin.__setStudentRecord({
      id: "ABC123",
      data: { email: "test@example.com", password: hashed, level: "A2" },
    });

    const res = await request(app).post("/legacy/login").send({ studentCode: "ABC123", password });

    expect(res.status).toBe(200);
    expect(res.body).toEqual(expect.objectContaining({ id: "ABC123", email: "test@example.com", level: "A2" }));
    expect(res.body.password).toBeUndefined();
  });

  test("/tutor/placement rejects empty answers", async () => {
    const res = await request(app).post("/tutor/placement").send({ answers: [] });
    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({ ok: false });
  });

  test("/tutor/placement returns placement for valid payload", async () => {
    createChatCompletion.mockResolvedValue(
      JSON.stringify({ estimated_level: "B1", confidence: 0.8, rationale: "ok", next_task_hint: "practice" })
    );

    const res = await request(app)
      .post("/tutor/placement")
      .send({ answers: ["Hallo"], targetLevel: "B1", userId: "user-1" });

    expect(res.status).toBe(200);
    expect(res.body.placement).toEqual(
      expect.objectContaining({ estimated_level: "B1", confidence: 0.8, next_task_hint: "practice" })
    );
  });

  test("/speaking/analyze-text rejects missing text", async () => {
    const res = await request(app).post("/speaking/analyze-text").send({ text: "" });
    expect(res.status).toBe(400);
    expect(res.body).toMatchObject({ ok: false });
  });

  test("/speaking/analyze-text returns feedback for valid text", async () => {
    createChatCompletion.mockResolvedValue("Great job!");

    const res = await request(app)
      .post("/speaking/analyze-text")
      .send({ text: "Dies ist ein Test.", level: "B1", userId: "user-2" });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ feedback: "Great job!" });
  });
});
