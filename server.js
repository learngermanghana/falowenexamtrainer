// server.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");

// --- OpenAI client ---
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// --- Multer config for audio uploads ---
const upload = multer({
  dest: "uploads/",
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB max
  },
});

// --- Test route ---
app.get("/", (req, res) => {
  res.send("Falowen Exam Coach Backend is running ✅");
});

// --- 1. Transcribe audio (TEMP: dummy, replace with real STT later) ---
async function transcribeAudio(filePath) {
  // TEMPORARY: skip real transcription while testing locally
  console.log("⚠️ Using dummy transcript instead of real transcription.");

  // Change this text to test different answers
  return "Hallo, ich heiße Felix. Ich komme aus Ghana und wohne in Accra. Ich spreche Englisch und ein bisschen Deutsch.";
}

/*
// --- REAL version (for later, when you want real transcription) ---
async function transcribeAudio(filePath) {
  try {
    const fileStream = fs.createReadStream(filePath);

    const transcription = await openai.audio.transcriptions.create({
      model: "gpt-4o-transcribe", // or "whisper-1"
      file: fileStream,
      language: "de", // hint: German
    });

    return transcription.text;
  } catch (error) {
    console.error("❌ Error during transcription:", error.response?.data || error);
    throw new Error("Transcription failed");
  }
}
*/

// --- 2. Analyze speaking with GPT (Goethe-style feedback) ---
async function analyzeSpeaking(transcript, teil, level) {
  try {
    // Short description per Teil for the prompt
    let teilDescription = "";
    if (teil && teil.startsWith("Teil 1")) {
      teilDescription = `
This is Teil 1 – Vorstellung.
The student should introduce themselves and ideally mention:
- Name
- Age
- Country
- Place of residence
- Languages
- Job / studies
- Hobbies

For A1, short simple sentences are enough.
Score higher if more of these points are included and sentences are clear.
`;
    } else if (teil && teil.startsWith("Teil 2")) {
      teilDescription = `
This is Teil 2 – Fragen.
The student should ask questions about a topic.
For A1/A2 you expect:
- Correct question word order:
  - W-questions: W-word at the beginning (Wo, Wie, Was, Wann, Warum, Welche ...)
  - Yes/No questions: verb at the beginning.
Mention if the student forgets verb position or uses statements instead of questions.
`;
    } else if (teil && teil.startsWith("Teil 3")) {
      teilDescription = `
This is Teil 3 – Bitten / Planen.
The student should make polite requests or suggestions.
Examples for A1:
- "Können Sie bitte ...?"
- "Kannst du bitte ...?"
- Imperative with "bitte": "Mach bitte das Fenster zu."
Check if the form is polite and fits the idea.
`;
    }

    const systemPrompt = `
You are an experienced German teacher preparing students for the Goethe ${level} Sprechen exam.
You receive the TRANSCRIPT of the student's spoken answer (already transcribed from audio or typed by the student).

Exam part: ${teil}

${teilDescription}

Your task:
1. Understand what the student wanted to say.
2. Correct the German (same ideas, better ${level} level grammar and vocabulary).
3. Explain the MOST IMPORTANT mistakes in simple English (short bullet points).
4. Give a short comment about fluency/pronunciation based ONLY on the transcript quality (word choice, clarity), not the actual sound.
5. Give a score from 0 to 10 for THIS Teil only.
   - 0–3: very weak / incomplete
   - 4–6: basic but understandable
   - 7–8: good for this level, small mistakes
   - 9–10: very good for this level

IMPORTANT:
- Tailor expectations to the level: ${level}.
- For A1 keep grammar simple (no complex structures).
- Be friendly and encouraging.
- Keep explanations short and focused on what helps the student next time.

You MUST answer in valid JSON with this exact shape:

{
  "corrected_text": "string - corrected German version",
  "mistakes": "string - short English explanation of common mistakes (bullets allowed)",
  "pronunciation": "string - short comment based on transcript quality only",
  "score": 7,
  "comment": "string - very short overall feedback in English"
}
    `.trim();

    const userPrompt = `
Student transcript (already in text form):
${transcript}
    `.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content || "{}";

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.error("⚠️ Failed to parse JSON from model, raw content:", raw);
      throw new Error("Model returned invalid JSON");
    }

    return {
      transcript,
      corrected_text: parsed.corrected_text || "",
      mistakes: parsed.mistakes || "",
      pronunciation: parsed.pronunciation || "",
      score: typeof parsed.score === "number" ? parsed.score : 0,
      comment: parsed.comment || "",
    };
  } catch (error) {
    console.error("❌ Error during speaking analysis:", error.response?.data || error);
    throw new Error("Speaking analysis failed");
  }
}

// --- 3A. Audio endpoint: upload audio + get feedback ---
app.post(
  "/api/speaking/analyze",
  upload.single("audio"), // field name: "audio"
  async (req, res) => {
    const { teil, level } = req.body;
    const file = req.file;

    if (!file) {
      return res
        .status(400)
        .json({ error: "Audio file is required (field name: audio)" });
    }

    const filePath = path.join(__dirname, file.path);

    try {
      // 1) Transcribe (currently dummy)
      const transcript = await transcribeAudio(filePath);

      // 2) Analyze
      const analysis = await analyzeSpeaking(transcript, teil || "Teil 1", level || "A1");

      // 3) Cleanup temp file
      fs.unlink(filePath, (err) => {
        if (err) console.error("⚠️ Failed to delete temp file:", err);
      });

      return res.json(analysis);
    } catch (error) {
      console.error("❌ Error in /api/speaking/analyze:", error);
      return res.status(500).json({ error: error.message || "Server error" });
    }
  }
);

// --- 3B. Text endpoint: send typed answer + get feedback ---
app.post("/api/speaking/analyze-text", async (req, res) => {
  try {
    const { text, teil, level } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Text is required." });
    }

    const transcript = text.trim();
    const analysis = await analyzeSpeaking(transcript, teil || "Teil 1", level || "A1");

    return res.json(analysis);
  } catch (error) {
    console.error("❌ Error in /api/speaking/analyze-text:", error);
    return res.status(500).json({ error: error.message || "Server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Falowen Exam Coach Backend listening on port ${PORT}`);
});
