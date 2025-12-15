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
const SPEAKING_FORMATS = {
  A1: [
    { id: "a1_vorstellung", label: "Teil 1 – Vorstellung" },
    { id: "a1_fragen", label: "Teil 2 – Fragen" },
    { id: "a1_planen", label: "Teil 3 – Bitten / Planen" },
  ],
  A2: [
    { id: "a2_vorstellung", label: "Teil 1 – Vorstellung" },
    { id: "a2_fragen", label: "Teil 2 – Fragen" },
    { id: "a2_planen", label: "Teil 3 – Bitten / Planen" },
  ],
  B1: [
    { id: "b1_praesentation", label: "Teil 1 – Präsentation" },
    { id: "b1_diskussion", label: "Teil 2 – Diskussion / Fragen" },
    { id: "b1_planung", label: "Teil 3 – Gemeinsame Planung" },
  ],
  B2: [
    { id: "b2_praesentation", label: "Teil 1 – Präsentation mit Stellungnahme" },
    { id: "b2_diskussion", label: "Teil 2 – Diskussion / Streitgespräch" },
    { id: "b2_verhandlung", label: "Teil 3 – Verhandeln / Planung auf B2" },
  ],
};

const ALLOWED_LEVELS = Object.keys(SPEAKING_FORMATS);

// --- Google Sheets config for practice questions ---
const SHEET_ID = "1zaAT5NjRGKiITV7EpuSHvYMBHHENMs9Piw3pNcyQtho";
const SHEET_GID = "1161508231"; // Exams_list tab
const SHEET_EXPORT_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${SHEET_GID}`;
const QUESTIONS_CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

let cachedQuestions = {
  fetchedAt: 0,
  data: null,
};

// --- Simple user history persistence ---
const historyFile = path.join(__dirname, "data", "userHistory.json");
fs.mkdirSync(path.dirname(historyFile), { recursive: true });

function loadHistory() {
  try {
    const raw = fs.readFileSync(historyFile, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    return { users: {} };
  }
}

function saveHistory(history) {
  fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
}

function getUserHistory(userId) {
  if (!userId) return null;
  const history = loadHistory();
  return history.users[userId] || { targetLevel: "A1", entries: [] };
}

function recordHistoryEntry(userId, entry) {
  if (!userId) return;
  const history = loadHistory();
  if (!history.users[userId]) {
    history.users[userId] = { targetLevel: entry.targetLevel || "A1", entries: [] };
  }

  const userHistory = history.users[userId];
  userHistory.targetLevel = entry.targetLevel || userHistory.targetLevel;
  userHistory.entries.unshift({ ...entry, timestamp: new Date().toISOString() });
  userHistory.entries = userHistory.entries.slice(0, 25);
  saveHistory(history);
}

function buildPromptContext(userId, taskType, targetLevel) {
  const history = getUserHistory(userId);
  const recentEntries = history?.entries?.slice(0, 5) || [];

  const scoreSnapshot = recentEntries.map((item) => ({
    taskType: item.taskType,
    level: item.level,
    overall_score: item.overall_score,
    teil: item.teil,
  }));

  return {
    targetLevel: targetLevel || history?.targetLevel || "A1",
    taskType,
    recentScores: scoreSnapshot,
  };
}

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

function getAllowedTeile(level) {
  return (SPEAKING_FORMATS[level] || []).map((format) => format.label);
}

function validateTeilAndLevel(teil, level) {
  if (!ALLOWED_LEVELS.includes(level)) {
    return {
      valid: false,
      message: "Invalid level provided. Choose A1, A2, B1, or B2.",
    };
  }

  const allowedTeile = getAllowedTeile(level);
  if (teil && !allowedTeile.includes(teil)) {
    return {
      valid: false,
      message:
        "Invalid exam teil provided for the selected level. Choose a supported option.",
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
function shouldOfferInteraction(teil, level, explicitFlag = false) {
  if (explicitFlag) return true;

  const normalizedTeil = (teil || "").toLowerCase();
  const normalizedLevel = (level || "").toUpperCase();

  const isB1Interaction =
    normalizedLevel === "B1" &&
    (normalizedTeil.includes("präsentation") ||
      normalizedTeil.includes("planung"));

  const isB2OrHigherDiscussion =
    ["B2", "C1", "C2"].includes(normalizedLevel) &&
    normalizedTeil.includes("diskussion");

  return isB1Interaction || isB2OrHigherDiscussion;
}

async function generateInteractionFollowups(transcript, teil, level) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are the AI examiner/partner in a Goethe-style speaking interaction. Level ${level}. Exam part: ${teil}.
Generate 2-3 natural, concise follow-up questions that keep the conversation moving. Mix brief reactions, clarifying questions and polite interruptions where relevant.
Return JSON {"mode": "examiner|partner", "style_tip": "one sentence on tone", "follow_up_questions": [{"prompt": "", "focus": ""}, ...], "closing_prompt": "short wrap-up or summary request"}.`,
      },
      {
        role: "user",
        content: `Learner just said: ${transcript}`,
      },
    ],
  });

  const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");
  const questions = Array.isArray(parsed.follow_up_questions)
    ? parsed.follow_up_questions
    : [];

  return {
    mode: parsed.mode || "examiner",
    style_tip: parsed.style_tip || "Höflich, knapp und fokussiert.",
    closing_prompt:
      parsed.closing_prompt ||
      "Fasse deine Position in zwei Sätzen zusammen und reagiere kurz auf einen Einwand.",
    followUpQuestions: questions
      .map((q, idx) => ({
        prompt: q.prompt || q.question || `Rückfrage ${idx + 1}?`,
        focus: q.focus || "",
      }))
      .slice(0, 3),
  };
}

async function scoreInteractionLoop({
  initialTranscript,
  followUpTranscript,
  followUpQuestion,
  teil,
  level,
}) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are an interaction examiner. Evaluate the learner's turn-taking, reactions, follow-up quality and politeness for Goethe level ${level}, part ${teil}. Return JSON with keys: overall_score (0-100), overall_level (A1-C2), summary, turn_taking, follow_up_quality, politeness, strengths [..], improvements [..], practice_phrases [..], next_task_hint.`,
      },
      {
        role: "user",
        content: `Initial contribution: ${initialTranscript}\nFollow-up question: ${followUpQuestion}\nLearner follow-up answer: ${followUpTranscript}`,
      },
    ],
  });

  const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");

  return {
    overall_level: parsed.overall_level || level,
    overall_score:
      typeof parsed.overall_score === "number"
        ? Math.min(Math.max(Math.round(parsed.overall_score), 0), 100)
        : 0,
    summary: parsed.summary || "",
    turn_taking: parsed.turn_taking || "",
    follow_up_quality: parsed.follow_up_quality || "",
    politeness: parsed.politeness || "",
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
    practice_phrases: Array.isArray(parsed.practice_phrases)
      ? parsed.practice_phrases
      : [],
    next_task_hint: parsed.next_task_hint || "",
  };
}

async function analyzeSpeaking(transcript, teil, level, userContext = {}, options = {}) {
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

    const contextInfo = buildPromptContext(
      userContext.userId,
      userContext.taskType || teil,
      userContext.targetLevel || level
    );

    const systemPrompt = `
You are an experienced German teacher preparing students for the Goethe ${level} Sprechen exam.
You receive the TRANSCRIPT of the student's spoken answer (already transcribed from audio or typed by the student).

Exam part: ${teil}

${teilDescription}

Learner context (use this to tailor the feedback):
- Target level: ${contextInfo.targetLevel}
- Task type: ${contextInfo.taskType}
- Recent scores (most recent first): ${JSON.stringify(contextInfo.recentScores)}

Your task is to become a fully self-contained coach. Give the student everything they need to improve without another tutor.

Do the following:
1) Understand what the student wanted to say and produce a corrected German version at the same idea level.
2) Score their performance by skill (task fulfilment, fluency, grammar, vocabulary) out of 25 each, plus an overall score out of 100.
3) Decide an overall CEFR level label (A1–B2) for this answer only.
4) List clear strengths and concrete improvements (short bullet sentences in English).
5) Add at least one example correction mapping a student sentence to the fixed version.
6) Provide 2–4 practice phrases they can reuse immediately.
7) Suggest one focused next task hint that can be trained now (e.g., "Use 'weil' to give a reason").

Keep the tone encouraging and specific to their errors. If information is missing, make reasonable, level-appropriate suggestions.

You MUST answer in valid JSON with this exact shape:
{
  "overall_level": "A2",
  "overall_score": 72,
  "corrected_text": "string - corrected German version",
  "scores": {
    "task_fulfilment": 18,
    "fluency": 17,
    "grammar": 19,
    "vocabulary": 18
  },
  "strengths": ["..."],
  "improvements": ["..."],
  "example_corrections": [
    {"student": "Ich habe 20 Jahre alt.", "corrected": "Ich bin 20 Jahre alt."}
  ],
  "practice_phrases": ["..."],
  "next_task_hint": "Next time, focus on using 'weil' to give a reason in at least 2 sentences."
}
Do not include any additional keys.
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

    const baseResult = {
      meta: {
        teil,
        level,
        targetLevel: contextInfo.targetLevel,
        taskType: userContext.taskType || teil,
      },
      transcript,
      feedback: {
        corrected_text: parsed.corrected_text || "",
        overall_level: parsed.overall_level || level,
        overall_score:
          typeof parsed.overall_score === "number"
            ? Math.min(Math.max(Math.round(parsed.overall_score), 0), 100)
            : 0,
        scores: {
          task_fulfilment: parsed.scores?.task_fulfilment || 0,
          fluency: parsed.scores?.fluency || 0,
          grammar: parsed.scores?.grammar || 0,
          vocabulary: parsed.scores?.vocabulary || 0,
        },
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        improvements: Array.isArray(parsed.improvements)
          ? parsed.improvements
          : [],
        example_corrections: Array.isArray(parsed.example_corrections)
          ? parsed.example_corrections
          : [],
        practice_phrases: Array.isArray(parsed.practice_phrases)
          ? parsed.practice_phrases
          : [],
        next_task_hint: parsed.next_task_hint || "",
      },
      // Legacy fields kept for backwards compatibility
      mistakes:
        parsed.mistakes ||
        (Array.isArray(parsed.improvements)
          ? parsed.improvements.map((item) => `• ${item}`).join("\n")
          : ""),
      pronunciation: parsed.pronunciation || "",
      score:
        typeof parsed.score === "number"
          ? parsed.score
          : typeof parsed.overall_score === "number"
          ? Math.round(parsed.overall_score / 10)
          : 0,
      comment: parsed.comment || parsed.next_task_hint || "",
    };

    if (shouldOfferInteraction(teil, level, options.interactionMode)) {
      baseResult.interaction = await generateInteractionFollowups(
        transcript,
        teil,
        level
      );
    }

    return baseResult;
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
    const {
      teil = "Teil 1 – Vorstellung",
      level = "A1",
      userId,
      targetLevel,
      interactionMode,
    } = req.body;
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
      const analysis = await analyzeSpeaking(
        transcript,
        teil,
        level,
        {
          userId,
          targetLevel,
          taskType: "speaking",
        },
        { interactionMode: interactionMode === "true" || interactionMode === true }
      );

      recordHistoryEntry(userId, {
        taskType: "speaking",
        teil,
        level,
        targetLevel: targetLevel || level,
        overall_score: analysis.feedback?.overall_score,
      });

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

  const allowedTeile = getAllowedTeile(level);
  if (teil && !allowedTeile.includes(teil)) {
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
    const { text, teil = "Teil 1 – Vorstellung", level = "A1", userId, targetLevel } = req.body;

    const validation = validateTeilAndLevel(teil, level);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }

    if (!text || !text.trim()) {
      return res.status(400).json({ error: "Text is required." });
    }

    const transcript = text.trim();
    const analysis = await analyzeSpeaking(transcript, teil || "Teil 1", level || "A1", {
      userId,
      targetLevel,
      taskType: "speaking-text",
    });

    recordHistoryEntry(userId, {
      taskType: "speaking-text",
      teil,
      level,
      targetLevel: targetLevel || level,
      overall_score: analysis.feedback?.overall_score,
    });

    return res.json(analysis);
  } catch (error) {
    console.error("❌ Error in /api/speaking/analyze-text:", error);
    return res.status(500).json({ error: error.message || "Server error" });
  }
});

app.post(
  "/api/speaking/interaction-score",
  upload.single("audio"),
  async (req, res) => {
    const {
      initialTranscript,
      followUpQuestion,
      teil = "Teil 1 – Vorstellung",
      level = "A1",
      userId,
      targetLevel,
    } = req.body;

    const validation = validateTeilAndLevel(teil, level);
    if (!validation.valid) {
      return res.status(400).json({ error: validation.message });
    }

    if (!initialTranscript || !initialTranscript.trim()) {
      return res
        .status(400)
        .json({ error: "Initial transcript is required for interaction scoring." });
    }

    if (!followUpQuestion || !followUpQuestion.trim()) {
      return res
        .status(400)
        .json({ error: "Please include the follow-up question that was answered." });
    }

    const file = req.file;
    if (!file) {
      return res.status(400).json({ error: "Audio file is required (field name: audio)" });
    }

    const filePath = file.path || path.join(uploadsDir, file.filename);

    try {
      const followUpTranscript = await transcribeAudio(filePath);

      const interactionScore = await scoreInteractionLoop({
        initialTranscript,
        followUpTranscript,
        followUpQuestion,
        teil,
        level,
      });

      const scoreForBars = interactionScore.overall_score || 0;
      const balancedScore = Math.round(scoreForBars / 4);

      const responsePayload = {
        meta: {
          teil,
          level,
          targetLevel: targetLevel || level,
          taskType: "speaking-interaction",
        },
        transcript: followUpTranscript,
        feedback: {
          corrected_text: followUpTranscript,
          overall_level: interactionScore.overall_level,
          overall_score: interactionScore.overall_score,
          scores: {
            task_fulfilment: balancedScore,
            fluency: balancedScore,
            grammar: balancedScore,
            vocabulary: balancedScore,
          },
          strengths: interactionScore.strengths,
          improvements: interactionScore.improvements,
          practice_phrases: interactionScore.practice_phrases,
          next_task_hint: interactionScore.next_task_hint,
        },
        interaction: {
          followUpQuestion,
          initialTranscript,
          followUpTranscript,
          summary: interactionScore.summary,
          turn_taking: interactionScore.turn_taking,
          follow_up_quality: interactionScore.follow_up_quality,
          politeness: interactionScore.politeness,
        },
      };

      recordHistoryEntry(userId, {
        taskType: "speaking-interaction",
        teil,
        level,
        targetLevel: targetLevel || level,
        overall_score: interactionScore.overall_score,
      });

      fs.unlink(filePath, (err) => {
        if (err) console.error("⚠️ Failed to delete temp file:", err);
      });

      return res.json(responsePayload);
    } catch (error) {
      console.error("❌ Error in /api/speaking/interaction-score:", error);
      return res.status(500).json({ error: error.message || "Interaction scoring failed" });
    }
  }
);

// --- Tutor endpoints ---
app.post("/api/tutor/placement", async (req, res) => {
  const { userId = "guest", targetLevel = "A2", answers = [] } = req.body;

  const contextInfo = buildPromptContext(userId, "placement", targetLevel);
  const joinedAnswers = answers
    .map((item) => `- (${item.taskType || "task"}) ${item.text || ""}`)
    .join("\n");

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a placement bot that estimates a learner's CEFR level (A1-B2). Consider previous scores and tasks when available: ${JSON.stringify(
            contextInfo
          )}. Reply with JSON {"estimated_level": "A2", "confidence": 0.72, "rationale": "...", "next_task_hint": "..."}.`,
        },
        {
          role: "user",
          content: `Mini test answers:\n${joinedAnswers || "No answers provided"}`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(raw);

    recordHistoryEntry(userId, {
      taskType: "placement",
      level: parsed.estimated_level || targetLevel,
      targetLevel: parsed.estimated_level || targetLevel,
      overall_score: Math.round((parsed.confidence || 0) * 100),
    });

    return res.json({
      meta: { targetLevel: parsed.estimated_level || targetLevel },
      placement: parsed,
    });
  } catch (error) {
    console.error("❌ Error in /api/tutor/placement:", error.response?.data || error);
    return res.status(500).json({ error: "Placement failed" });
  }
});

app.get("/api/tutor/next-task", async (req, res) => {
  const userId = req.query.userId || "guest";
  const history = getUserHistory(userId);
  const targetLevel = history?.targetLevel || "A2";

  const contextInfo = buildPromptContext(userId, "next-task", targetLevel);
  const recentScores = contextInfo.recentScores || [];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a concise German tutor. Given a learner profile (target level ${targetLevel}) and recent scores ${JSON.stringify(
            recentScores
          )}, return JSON {"title": "", "prompt": "", "skill": "speaking|writing|vocab", "tip": "short tip"}.`,
        },
        {
          role: "user",
          content: `Task type: ${contextInfo.taskType}. Target level ${targetLevel}. Recent scores: ${JSON.stringify(
            recentScores
          )}. Suggest the next micro-task in 1-2 sentences.`,
        },
      ],
    });

    const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");
    return res.json({
      meta: { targetLevel },
      nextTask: parsed,
    });
  } catch (error) {
    console.error("❌ Error in /api/tutor/next-task:", error.response?.data || error);
    return res.status(500).json({ error: "Could not generate next task" });
  }
});

app.get("/api/tutor/weekly-summary", async (req, res) => {
  const userId = req.query.userId || "guest";
  const history = getUserHistory(userId);
  const targetLevel = history?.targetLevel || "A2";
  const recentEntries = history?.entries?.slice(0, 7) || [];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `You summarize weekly language training. Target level: ${targetLevel}. Use bullet points and keep it under 120 words.`,
        },
        {
          role: "user",
          content: `Recent attempts: ${JSON.stringify(recentEntries)}`,
        },
      ],
    });

    const summary = completion.choices[0]?.message?.content || "Summary unavailable.";
    return res.json({ summary, targetLevel });
  } catch (error) {
    console.error("❌ Error in /api/tutor/weekly-summary:", error.response?.data || error);
    return res.status(500).json({ error: "Could not create weekly summary" });
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
