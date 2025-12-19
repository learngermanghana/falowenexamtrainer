const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const os = require("os");
const fsPromises = require("fs/promises");
const bcrypt = require("bcryptjs");
const { LETTER_COACH_PROMPTS, markPrompt } = require("./prompts");
const { createChatCompletion, getOpenAIClient } = require("./openaiClient");
const { getSheetsClient, getServiceAccountEmail } = require("./googleSheetsClient");
const { getScoresByStudentCode } = require("./scoresSheet");
const { getStudentCodeByEmail } = require("./studentsLookup");

if (!admin.apps.length) {
  admin.initializeApp();
}

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });
const speakingUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1, fields: 10 },
});

const app = express();

app.use(cors({ origin: true }));
app.use(express.json({ limit: "1mb" }));

app.get("/", (_req, res) => res.send("OK"));
app.get("/health", (_req, res) => res.json({ ok: true }));

const CACHE_TTL_MS = 60 * 1000;

const cache = {
  vocab: { data: null, expiresAt: 0 },
  exams: { data: null, expiresAt: 0 },
};

const setCache = (key, data) => {
  if (!cache[key]) return;
  cache[key] = { data, expiresAt: Date.now() + CACHE_TTL_MS };
};

const getCache = (key) => {
  const entry = cache[key];
  if (!entry) return null;
  if (entry.expiresAt > Date.now()) return entry.data;
  return null;
};

app.get("/vocab", async (_req, res) => {
  try {
    const spreadsheetId = process.env.SHEETS_VOCAB_ID;
    const tab = process.env.SHEETS_VOCAB_TAB || "Sheet1";

    if (!spreadsheetId) {
      return res.status(500).json({ error: "Missing SHEETS_VOCAB_ID env" });
    }

    const cached = getCache("vocab");
    if (cached) return res.json(cached);

    const sheets = await getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${tab}!A:Z`,
    });

    const rows = mapSheetRows(response.data.values || []);
    const payload = { rows };
    setCache("vocab", payload);
    return res.json(payload);
  } catch (err) {
    console.error("/vocab error", err);
    return res.status(500).json({ error: err.message || "Failed to load vocab" });
  }
});

app.get("/exams", async (_req, res) => {
  try {
    const spreadsheetId = process.env.SHEETS_EXAMS_ID;
    const tab = process.env.SHEETS_EXAMS_TAB || "Exams list";

    if (!spreadsheetId) {
      return res.status(500).json({ error: "Missing SHEETS_EXAMS_ID env" });
    }

    const cached = getCache("exams");
    if (cached) return res.json(cached);

    const sheets = await getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${tab}!A:Z`,
    });

    const rows = mapSheetRows(response.data.values || []);
    const payload = { rows };
    setCache("exams", payload);
    return res.json(payload);
  } catch (err) {
    console.error("/exams error", err);
    return res.status(500).json({ error: err.message || "Failed to load exams" });
  }
});

app.get("/sheets/diagnose", async (req, res) => {
  try {
    if (process.env.DIAGNOSE_KEY && req.get("x-diagnose-key") !== process.env.DIAGNOSE_KEY) {
      return res.status(403).json({ ok: false, error: "Forbidden" });
    }

    const sheets = await getSheetsClient();

    const checks = [
      { name: "vocab", id: process.env.SHEETS_VOCAB_ID, tab: process.env.SHEETS_VOCAB_TAB || "Sheet1" },
      { name: "exams", id: process.env.SHEETS_EXAMS_ID, tab: process.env.SHEETS_EXAMS_TAB || "Sheet1" },
      { name: "students", id: process.env.STUDENTS_SHEET_ID, tab: process.env.STUDENTS_SHEET_TAB || "students" },
    ];

    const results = {};
    for (const c of checks) {
      if (!c.id || !c.tab) {
        results[c.name] = { ok: false, error: "Missing sheet id/tab env" };
        continue;
      }
      try {
        const r = await sheets.spreadsheets.values.get({
          spreadsheetId: c.id,
          range: `${c.tab}!1:2`,
        });
        results[c.name] = { ok: true, rowsFetched: (r.data.values || []).length };
      } catch (e) {
        results[c.name] = { ok: false, error: e?.message || String(e) };
      }
    }

    res.json({ ok: true, serviceAccountEmail: getServiceAccountEmail(), results });
  } catch (e) {
    res.status(500).json({ ok: false, error: e?.message || String(e) });
  }
});

const writeTempFile = async (file) => {
  const fileName = file?.originalname || "audio.webm";
  const tempPath = path.join(os.tmpdir(), `${Date.now()}-${fileName}`);
  await fsPromises.writeFile(tempPath, file.buffer);
  return tempPath;
};

const transcribeAudio = async (fileBuffer) => {
  const client = getOpenAIClient();
  const tempPath = await writeTempFile(fileBuffer);

  try {
    const transcription = await client.audio.transcriptions.create({
      file: fs.createReadStream(tempPath),
      model: "whisper-1",
      language: "de",
    });

    return transcription?.text?.trim();
  } finally {
    await fsPromises.unlink(tempPath).catch(() => undefined);
  }
};

const normalizeHeaderKey = (header, index) => {
  const normalized = String(header || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");

  if (normalized) return normalized;
  return `col_${index}`;
};

const mapSheetRows = (values = []) => {
  if (!values.length) return [];

  const header = values[0].map(normalizeHeaderKey);
  const rows = values.slice(1);

  return rows
    .map((row, rowIndex) => {
      const entry = { _row: rowIndex + 2 };

      header.forEach((key, idx) => {
        entry[key] = typeof row[idx] !== "undefined" ? row[idx] : "";
      });

      if (!entry.id) {
        entry.id = `${entry._row}-${Object.values(entry).join("-")}`;
      }

      return entry;
    })
    .filter((row) => Object.values(row).some((value) => String(value || "").trim()));
};

const speakingPrompt = ({ teil, level, contextType, question, interactionMode }) => {
  const teilLabel = teil ? `Teil ${teil}` : "your last speaking sample";
  const context = contextType ? `Context: ${contextType}.` : "";
  const interaction = typeof interactionMode === "undefined" ? "" : `Interaction mode: ${interactionMode}.`;

  return (
    "You are a German speaking examiner and supportive coach. " +
    "Score pronunciation, grammar, vocabulary, fluency, and task achievement. " +
    "Give concise feedback in English, but include short German fragments to model corrections. " +
    `Focus on ${teilLabel}. Level target: ${level || "A2"}. ${context} ${interaction} ` +
    "If the student seems below target, explain the biggest gaps and suggest one focused drill. " +
    (question ? `The prompt/question was: ${question}.` : "")
  );
};

const placementPrompt = ({ answers, targetLevel }) => {
  const formattedAnswers = answers
    .map((item, idx) => `Answer ${idx + 1} (${item.taskType || "custom"}): ${item.text}`)
    .join("\n");

  return (
    "You are an expert German examiner. Estimate the CEFR level (A1–C1) from the answers provided. " +
    `If a target level is given, comment on readiness for ${targetLevel || "their next"} exam. ` +
    "Return a short rationale, confidence 0–1, and one next drill suggestion."
  ).concat("\n\n", formattedAnswers);
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

    const reply = await createChatCompletion(chatMessages, { max_tokens: 750 });

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

    const feedback = await createChatCompletion(messages, { max_tokens: 750 });

    res.json({ feedback });
  } catch (err) {
    console.error("/writing/mark error", err);
    res.status(500).json({ error: err.message || "Failed to mark letter" });
  }
});

app.post("/discussion/correct", async (req, res) => {
  try {
    const { text, level = "A2" } = req.body || {};
    const input = String(text || "").trim();

    if (!input) {
      return res.status(400).json({ error: "Text is required for correction" });
    }

    const messages = [
      {
        role: "system",
        content:
          "You are a concise German writing assistant for class discussions. " +
          "Return only the corrected German text. Preserve meaning, keep it short, and focus on grammar and spelling. " +
          `Target level: ${level}. If the input already looks correct, return it unchanged.`,
      },
      { role: "user", content: input },
    ];

    const corrected = await createChatCompletion(messages, { temperature: 0.2, max_tokens: 300 });

    return res.json({ corrected });
  } catch (err) {
    console.error("/discussion/correct error", err);
    return res.status(500).json({ error: err.message || "Failed to correct text" });
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

app.post("/legacy/login", async (req, res) => {
  try {
    const { email, password, studentCode } = req.body || {};
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const providedPassword = typeof password === "string" ? password : "";
    const normalizedStudentCode = String(studentCode || "").trim();

    if (!providedPassword || (!normalizedEmail && !normalizedStudentCode)) {
      return res.status(400).json({ error: "email or studentCode with password is required" });
    }

    let snapshot;

    if (normalizedStudentCode) {
      snapshot = await admin.firestore().collection("students").doc(normalizedStudentCode).get();
    }

    if (!snapshot || !snapshot.exists) {
      const query = await admin
        .firestore()
        .collection("students")
        .where("email", "==", normalizedEmail)
        .limit(1)
        .get();
      snapshot = query.docs[0];
    }

    if (!snapshot || !snapshot.exists) {
      return res.status(404).json({ error: "Student not found" });
    }

    const student = snapshot.data() || {};
    const hashedPassword = student.password;

    if (!hashedPassword) {
      return res.status(400).json({ error: "Account has no password; please contact support." });
    }

    const isValid = await bcrypt.compare(providedPassword, hashedPassword);
    if (!isValid) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const { password: _hiddenPassword, ...studentSafe } = student;

    return res.json({ id: snapshot.id, ...studentSafe });
  } catch (e) {
    console.error("/legacy/login error", e);
    return res.status(500).json({ error: "Failed to authenticate student" });
  }
});

// READ-ONLY scores from Google Sheet
app.get("/scores", async (req, res) => {
  try {
    const studentCode = String(req.query.studentCode || "").trim();
    const email = String(req.query.email || "").trim();

    let code = studentCode;
    if (!code && email) {
      code = await getStudentCodeByEmail(email);
    }

    if (!code) {
      return res.status(400).json({ ok: false, error: "Provide studentCode or email" });
    }

    const rows = await getScoresByStudentCode(code);
    return res.json({ ok: true, studentCode: code, rows });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ ok: false, error: e?.message || String(e) });
  }
});

app.post("/speaking/analyze", speakingUpload.single("audio"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "Audio file is required" });
    }

    const {
      teil,
      level = "A2",
      contextType,
      question,
      interactionMode,
      userId = "guest",
    } = req.body || {};

    const transcript = await transcribeAudio(req.file);

    if (!transcript) {
      return res.status(500).json({ error: "Could not transcribe audio" });
    }

    const messages = [
      { role: "system", content: speakingPrompt({ teil, level, contextType, question, interactionMode }) },
      {
        role: "user",
        content: `User ${userId} speaking sample transcript: ${transcript}`,
      },
    ];

    const feedback = await createChatCompletion(messages, { temperature: 0.35, max_tokens: 500 });

    return res.json({ transcript, feedback });
  } catch (err) {
    console.error("/speaking/analyze error", err);
    return res.status(500).json({ error: err.message || "Failed to analyze speaking" });
  }
});

app.post("/speaking/analyze-text", async (req, res) => {
  try {
    const { text, teil, level = "A2", targetLevel, userId = "guest" } = req.body || {};

    if (!text || !String(text).trim()) {
      return res.status(400).json({ error: "Transcript text is required" });
    }

    const messages = [
      { role: "system", content: speakingPrompt({ teil, level: targetLevel || level }) },
      { role: "user", content: `User ${userId} transcript: ${String(text).trim()}` },
    ];

    const feedback = await createChatCompletion(messages, { temperature: 0.35, max_tokens: 500 });

    return res.json({ feedback });
  } catch (err) {
    console.error("/speaking/analyze-text error", err);
    return res.status(500).json({ error: err.message || "Failed to analyze text" });
  }
});

app.post("/speaking/interaction-score", speakingUpload.single("audio"), async (req, res) => {
  try {
    const {
      initialTranscript,
      followUpQuestion,
      teil,
      level = "A2",
      targetLevel,
      userId = "guest",
    } = req.body || {};

    let transcript = String(initialTranscript || "").trim();

    if (!transcript && req.file) {
      transcript = (await transcribeAudio(req.file)) || "";
    }

    if (!transcript) {
      return res.status(400).json({ error: "A transcript or audio recording is required" });
    }

    const messages = [
      {
        role: "system",
        content:
          speakingPrompt({ teil, level: targetLevel || level }) +
          " Return a 3-sentence breakdown and a score out of 10 for interaction quality.",
      },
      {
        role: "user",
        content: `User ${userId} follow-up answer to '${followUpQuestion || "prompt"}': ${transcript}`,
      },
    ];

    const feedback = await createChatCompletion(messages, { temperature: 0.35, max_tokens: 450 });

    return res.json({ feedback, transcript });
  } catch (err) {
    console.error("/speaking/interaction-score error", err);
    return res.status(500).json({ error: err.message || "Failed to score interaction" });
  }
});

app.post("/tutor/placement", async (req, res) => {
  try {
    const { answers = [], targetLevel, userId = "guest" } = req.body || {};

    if (!Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ error: "At least one answer is required" });
    }

    const messages = [
      { role: "system", content: placementPrompt({ answers, targetLevel }) },
      { role: "user", content: `Student id ${userId}. Provide JSON with estimated_level, confidence, rationale, next_task_hint.` },
    ];

    const reply = await createChatCompletion(messages, { temperature: 0.2, max_tokens: 400 });

    let placement;

    try {
      placement = JSON.parse(reply);
    } catch (_err) {
      placement = {
        estimated_level: targetLevel || "A2",
        confidence: 0.5,
        rationale: reply,
        next_task_hint: "Try a short speaking drill about your weekend and upload it for feedback.",
      };
    }

    return res.json({ placement });
  } catch (err) {
    console.error("/tutor/placement error", err);
    return res.status(500).json({ error: err.message || "Failed to run placement" });
  }
});

app.get("/tutor/next-task", async (req, res) => {
  try {
    const userId = String(req.query.userId || "guest");

    const messages = [
      {
        role: "system",
        content:
          "You are an AI tutor. Suggest the next micro-task for a German learner. " +
          "Keep it short: title, prompt, skill, and one tip. Respond as JSON.",
      },
      { role: "user", content: `Student id ${userId}. Offer a next actionable task for speaking or writing.` },
    ];

    const reply = await createChatCompletion(messages, { temperature: 0.35, max_tokens: 200 });

    let nextTask;

    try {
      nextTask = JSON.parse(reply);
    } catch (_err) {
      nextTask = {
        title: "Describe your last weekend",
        prompt: reply,
        skill: "Speaking",
        tip: "Use past tense verbs and 3 time markers (e.g., gestern, am Samstag, danach).",
      };
    }

    return res.json({ nextTask });
  } catch (err) {
    console.error("/tutor/next-task error", err);
    return res.status(500).json({ error: err.message || "Failed to fetch next task" });
  }
});

app.use((err, _req, res, next) => {
  if (err && err.name === "MulterError") {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(413).json({ error: "Audio file too large" });
    }
    return res.status(400).json({ error: err.message });
  }
  return next(err);
});

module.exports = app;
