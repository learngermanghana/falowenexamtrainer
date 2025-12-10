// app.js
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

app.use(cors());
app.use(express.json());

// --- Allowed options ---
const ALLOWED_TEILE = [
  "Teil 1 – Vorstellung",
  "Teil 2 – Fragen",
  "Teil 3 – Bitten / Planen",
];

const ALLOWED_LEVELS = ["A1", "A2", "B1", "B2"];

// --- Google Sheets config for practice questions ---
const SHEET_ID = "1zaAT5NjRGKiITV7EpuSHvYMBHHENMs9Piw3pNcyQtho";
const SHEET_GID = "1161508231"; // Exams_list tab
const SHEET_EXPORT_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${SHEET_GID}`;
const QUESTIONS_CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

let cachedQuestions = {
  fetchedAt: 0,
  data: null,
};

// Ensure uploads directory exists before multer writes streamed chunks
const uploadsDir = process.env.VERCEL
  ? path.join("/tmp", "uploads")
  : path.join(__dirname, "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

// --- Multer config for audio uploads ---
const upload = multer({
  dest: uploadsDir,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB max
  },
  fileFilter: (req, file, cb) => {
    const isAudio = file.mimetype.startsWith("audio/");
    if (!isAudio) {
      return cb(new Error("Only audio files are allowed"));
    }
    cb(null, true);
  },
});

function validateTeilAndLevel(teil, level) {
  if (!ALLOWED_TEILE.includes(teil)) {
    return {
      valid: false,
      message: "Invalid exam teil provided. Choose a supported option.",
    };
  }

  if (!ALLOWED_LEVELS.includes(level)) {
    return {
      valid: false,
      message: "Invalid level provided. Choose A1, A2, B1, or B2.",
    };
  }

  return { valid: true };
}

function splitCsvLine(line) {
  const cells = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"' && next === '"' && inQuotes) {
      current += '"';
      i += 1; // skip escaped quote
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      cells.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current.trim());
  return cells;
}

function parseCsv(csvText) {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) return [];

  const headers = splitCsvLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    const row = {};

    headers.forEach((header, idx) => {
      row[header] = values[idx] ?? "";
    });

    return row;
  });
}

async function fetchSheetQuestions() {
  const now = Date.now();
  if (cachedQuestions.data && now - cachedQuestions.fetchedAt < QUESTIONS_CACHE_TTL_MS) {
    return cachedQuestions.data;
  }

  if (typeof fetch !== "function") {
    throw new Error("Fetch API is not available in this runtime.");
  }

  const response = await fetch(SHEET_EXPORT_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch sheet (status ${response.status})`);
  }

  const csvText = await response.text();
  const rows = parseCsv(csvText);

  const normalized = rows
    .map((row) => {
      const level = row.Level?.trim();
      const teil = row.Teil?.trim();
      const topic =
        row["Topic/Prompt"]?.trim() || row["Topic / Prompt"]?.trim() || "";
      const keyword =
        row["Keyword/Subtopic"]?.trim() || row["Keyword / Subtopic"]?.trim() || "";

      if (!level || !teil || !topic) return null;

      return {
        level,
        teil,
        topic,
        keyword,
      };
    })
    .filter(Boolean);

  cachedQuestions = {
    fetchedAt: now,
    data: normalized,
  };

  return normalized;
}

// Clean up stale uploads (e.g., if process crashes before fs.unlink runs)
async function cleanOldUploads(maxAgeMs = 60 * 60 * 1000) {
  try {
    const now = Date.now();
    const files = await fs.promises.readdir(uploadsDir);

    await Promise.all(
      files.map(async (file) => {
        const fullPath = path.join(uploadsDir, file);
        const stats = await fs.promises.stat(fullPath);
        if (now - stats.mtimeMs > maxAgeMs) {
          await fs.promises.unlink(fullPath);
        }
      })
    );
  } catch (error) {
    console.error("⚠️ Failed to clean uploads directory:", error);
  }
}

// Initial cleanup plus periodic sweep for chunked/partial uploads that were never deleted
cleanOldUploads().catch(() => {});
setInterval(() => cleanOldUploads().catch(() => {}), 30 * 60 * 1000); // every 30 minutes

// --- Test route ---
app.get("/", (req, res) => {
  res.send("Falowen Exam Coach Backend is running ✅");
});

// --- 1. Transcribe audio ---
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

// --- 2. Analyze speaking with GPT (Goethe-style feedback) ---
async function analyzeSpeaking(transcript, teil, level) {
  try {
    const validation = validateTeilAndLevel(teil, level);
    if (!validation.valid) {
      throw new Error(validation.message);
    }

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
4. Give a short comment about fluency/pronunciation based ONLY on the transcript quality (word choice, clarity), not the actual
sound.
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
    const { teil = "Teil 1 – Vorstellung", level = "A1" } = req.body;
    const validation = validateTeilAndLevel(teil, level);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }

    const file = req.file;

    if (!file) {
      return res
        .status(400)
        .json({ error: "Audio file is required (field name: audio)" });
    }

    const filePath = file.path || path.join(uploadsDir, file.filename);

    try {
      // 1) Transcribe (currently dummy)
      const transcript = await transcribeAudio(filePath);

      // 2) Analyze
      const analysis = await analyzeSpeaking(transcript, teil, level);

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

// --- 3B. Questions endpoint: fetch prompts from Google Sheets ---
app.get("/api/speaking/questions", async (req, res) => {
  const { level, teil } = req.query;

  if (!level || !ALLOWED_LEVELS.includes(level)) {
    return res
      .status(400)
      .json({ error: "Invalid or missing level. Choose A1, A2, B1, or B2." });
  }

  if (teil && !ALLOWED_TEILE.includes(teil)) {
    return res.status(400).json({ error: "Invalid exam teil provided." });
  }

  try {
    const questions = await fetchSheetQuestions();

    const filtered = questions.filter(
      (q) =>
        q.level?.toUpperCase() === level.toUpperCase() &&
        (!teil || q.teil === teil)
    );

    return res.json({ questions: filtered });
  } catch (error) {
    console.error("❌ Failed to fetch speaking questions:", error);
    return res
      .status(500)
      .json({ error: "Failed to load speaking questions. Please try again." });
  }
});

// --- 3C. Text endpoint: send typed answer + get feedback ---
app.post("/api/speaking/analyze-text", async (req, res) => {
  try {
    const {
      text,
      teil = "Teil 1 – Vorstellung",
      level = "A1",
    } = req.body;

    const validation = validateTeilAndLevel(teil, level);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }

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

// --- Multer / upload error handler ---
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }

  if (err?.message === "Only audio files are allowed") {
    return res.status(400).json({ error: err.message });
  }

  next(err);
});

module.exports = app;
