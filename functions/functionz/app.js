const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const { LETTER_COACH_PROMPTS, markPrompt } = require("./prompts");
let getScoresForStudent;

if (!admin.apps.length) {
  admin.initializeApp();
}

function loadScoresModule() {
  if (getScoresForStudent) return getScoresForStudent;

  try {
    // Lazily require so the function can still start if the file is missing in a build/deploy artefact.
    const mod = require("./scoresSheet.js");
    if (typeof mod.getScoresForStudent !== "function") {
      throw new Error("scoresSheet.getScoresForStudent is not a function");
    }

    getScoresForStudent = mod.getScoresForStudent;
    return getScoresForStudent;
  } catch (err) {
    console.error("Failed to load scoresSheet module", err);
    throw err;
  }
}

const app = express();

app.use(cors({ origin: true }));
app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => res.send("OK"));
app.get("/health", (_req, res) => res.json({ ok: true }));

const callOpenAI = async (messages) => {
  if (!process.env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature: 0.4,
      max_tokens: 750,
      messages,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI request failed: ${response.status} ${errorBody}`);
  }

  const data = await response.json();
  const reply = data?.choices?.[0]?.message?.content;

  if (!reply) {
    throw new Error("OpenAI response missing content");
  }

  return reply;
};

app.post("/writing/ideas", async (req, res) => {
  try {
    const { level = "A2", messages = [] } = req.body || {};
    const systemPrompt = LETTER_COACH_PROMPTS[level] || LETTER_COACH_PROMPTS.A2;

    const chatMessages = [
      { role: "system", content: systemPrompt },
      ...messages
        .filter((msg) => msg && msg.content)
        .map((msg) => ({
          role: msg.role === "assistant" ? "assistant" : "user",
          content: msg.content,
        })),
    ];

    const reply = await callOpenAI(chatMessages);

    res.json({ reply });
  } catch (err) {
    console.error("/writing/ideas error", err);
    res.status(500).json({ error: err.message || "Failed to get ideas" });
  }
});

app.post("/writing/mark", async (req, res) => {
  try {
    const { text, level = "A2", studentName = "Student" } = req.body || {};

    if (!text || !String(text).trim()) {
      return res.status(400).json({ error: "Letter text is required" });
    }

    const systemPrompt = markPrompt({ schreibenLevel: level, studentName });
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: String(text).trim() },
    ];

    const feedback = await callOpenAI(messages);

    res.json({ feedback });
  } catch (err) {
    console.error("/writing/mark error", err);
    res.status(500).json({ error: err.message || "Failed to mark letter" });
  }
});

app.get("/student", async (req, res) => {
  try {
    const studentCode = String(req.query.studentCode || "").trim();
    if (!studentCode) return res.status(400).json({ error: "studentCode is required" });

    const doc = await admin.firestore().collection("students").doc(studentCode).get();
    if (!doc.exists) return res.status(404).json({ error: "Student not found" });

    return res.json({ id: doc.id, ...doc.data() });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to fetch student" });
  }
});

// READ-ONLY scores from Google Sheet
app.get("/scores", async (req, res) => {
  try {
    const studentCode = String(req.query.studentCode || "").trim();
    if (!studentCode) return res.status(400).json({ error: "studentCode is required" });

    const rows = await loadScoresModule()(studentCode);
    return res.json({ studentCode, rows });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to fetch scores" });
  }
});

module.exports = app;
