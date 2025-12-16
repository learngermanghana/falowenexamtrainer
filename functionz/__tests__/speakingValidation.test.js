const fs = require("fs");
const path = require("path");
const request = require("supertest");

jest.mock("openai", () => {
  const mockChatCreate = jest.fn(async () => ({
    choices: [
      {
        message: {
          content: JSON.stringify({
            overall_level: "B1",
            overall_score: 80,
            corrected_text: "Korrigierter Text",
            scores: {
              task_fulfilment: 18,
              fluency: 19,
              grammar: 20,
              vocabulary: 18,
            },
            strengths: ["Good flow"],
            improvements: ["Fix verb position"],
            example_corrections: [
              { student: "Ich habe 20 Jahre alt.", corrected: "Ich bin 20 Jahre alt." },
            ],
            practice_phrases: ["Gerne!"],
            next_task_hint: "Use weil for reasons",
            summary: "Nice interaction",
            turn_taking: "Balanced",
            follow_up_quality: "Relevant",
            politeness: "Polite",
          }),
        },
      },
    ],
  }));

  const mockAudioCreate = jest.fn(async () => ({ text: "Mock transcript" }));

  return function OpenAI() {
    return {
      chat: { completions: { create: mockChatCreate } },
      audio: { transcriptions: { create: mockAudioCreate } },
    };
  };
});

const app = require("../app");

const audioPath = path.join(__dirname, "fixtures", "audio-sample.wav");

describe("speaking route validation", () => {
  beforeAll(() => {
    if (!fs.existsSync(audioPath)) {
      fs.writeFileSync(audioPath, "Dummy audio content");
    }
  });

  describe("/api/speaking/analyze", () => {
    it("returns 400 with consistent shape for invalid level", async () => {
      const response = await request(app)
        .post("/api/speaking/analyze")
        .field("teil", "Teil 1 – Vorstellung")
        .field("level", "C1")
        .attach("audio", audioPath);

      expect(response.status).toBe(400);
      expect(response.body).toEqual(
        expect.objectContaining({
          error: "Invalid request payload",
          details: expect.any(Array),
        })
      );
      expect(response.body.details[0]).toEqual(
        expect.objectContaining({ path: ["level"] })
      );
    });

    it("returns 400 when audio is missing", async () => {
      const response = await request(app)
        .post("/api/speaking/analyze")
        .field("teil", "Teil 1 – Vorstellung")
        .field("level", "A1");

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid request payload");
      expect(response.body.details[0]).toEqual(
        expect.objectContaining({ path: ["audio"] })
      );
    });

    it("accepts valid payloads and normalizes interactionMode", async () => {
      const response = await request(app)
        .post("/api/speaking/analyze")
        .field("teil", " Teil 1 – Vorstellung ")
        .field("level", "a1")
        .field("interactionMode", "true")
        .attach("audio", audioPath);

      expect(response.status).toBe(200);
      expect(response.body.meta.teil).toBe("Teil 1 – Vorstellung");
      expect(response.body.meta.level).toBe("A1");
      expect(response.body.interaction || {}).toBeDefined();
    });
  });

  describe("/api/speaking/analyze-text", () => {
    it("rejects empty text", async () => {
      const response = await request(app)
        .post("/api/speaking/analyze-text")
        .send({ text: "   ", level: "A1" });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid request payload");
      expect(response.body.details[0]).toEqual(
        expect.objectContaining({ path: ["text"] })
      );
    });

    it("accepts trimmed text", async () => {
      const response = await request(app)
        .post("/api/speaking/analyze-text")
        .send({ text: "  Hallo Welt  ", level: "A1" });

      expect(response.status).toBe(200);
      expect(response.body.transcript).toBe("Hallo Welt");
      expect(response.body.meta.level).toBe("A1");
    });
  });

  describe("/api/speaking/interaction-score", () => {
    it("requires interaction details", async () => {
      const response = await request(app)
        .post("/api/speaking/interaction-score")
        .attach("audio", audioPath)
        .field("level", "A1");

      expect(response.status).toBe(400);
      expect(response.body.error).toBe("Invalid request payload");
      expect(response.body.details).toEqual(
        expect.arrayContaining([expect.objectContaining({ path: ["initialTranscript"] })])
      );
    });

    it("requires audio", async () => {
      const response = await request(app)
        .post("/api/speaking/interaction-score")
        .field("initialTranscript", "Hallo")
        .field("followUpQuestion", "Wie geht's?")
        .field("level", "A1");

      expect(response.status).toBe(400);
      expect(response.body.details[0]).toEqual(
        expect.objectContaining({ path: ["audio"] })
      );
    });

    it("accepts valid payloads and trims text", async () => {
      const response = await request(app)
        .post("/api/speaking/interaction-score")
        .field("initialTranscript", "  Hallo  ")
        .field("followUpQuestion", "  Wie geht's?  ")
        .field("level", "A1")
        .attach("audio", audioPath);

      expect(response.status).toBe(200);
      expect(response.body.meta.level).toBe("A1");
      expect(response.body.interaction.initialTranscript).toBe("Hallo");
      expect(response.body.interaction.followUpQuestion).toBe("Wie geht's?");
      expect(response.body.transcript).toBe("Mock transcript");
    });
  });
});
