const admin = require("firebase-admin");
const OpenAI = require("openai");
const { getOpenAIClient } = require("../openaiClient");

const QUESTIONS_PUBLISHED_CSV_URL =
  process.env.GOETHE_QUESTIONS_CSV_URL ||
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vQOBThuga7fR-PiYFEkR0zsfBanlQiRRDAQKl0FQkc--GUkZBkS4SrOz9p6R9ONTCGzSGdDmMBBiTK3/pub?output=csv";

const MAX_AUDIO_BYTES = 45 * 1024 * 1024;

const toSafe = (value) => String(value == null ? "" : value).trim();

const parseCsv = (csvText) => {
  const rows = [];
  let row = [];
  let cell = "";
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i += 1) {
    const ch = csvText[i];
    const next = csvText[i + 1];

    if (inQuotes) {
      if (ch === '"' && next === '"') {
        cell += '"';
        i += 1;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cell += ch;
      }
      continue;
    }

    if (ch === '"') {
      inQuotes = true;
      continue;
    }

    if (ch === ',') {
      row.push(cell);
      cell = "";
      continue;
    }

    if (ch === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
      continue;
    }

    if (ch === "\r") continue;
    cell += ch;
  }

  row.push(cell);
  rows.push(row);
  return rows.filter((r) => r.some((v) => toSafe(v)));
};

const headerMap = (headerRow = []) => {
  const map = {};
  headerRow.forEach((value, index) => {
    const key = toSafe(value).toLowerCase();
    if (key) map[key] = index;
  });
  return map;
};

const teilLabel = (level, teil) => {
  const lvl = toSafe(level).toUpperCase();
  const t = toSafe(teil);

  if (lvl === "A1") {
    if (t === "1") return "Teil 1 — Introduction (one line)";
    if (t === "2") return "Teil 2 — Ask & Answer (German)";
    if (t === "3") return "Teil 3 — Request (Imperative) + Response";
  }

  if (lvl === "A2") {
    if (t === "1") return "Teil 1 — Interview (Goethe standard)";
    if (t === "2") return "Teil 2 — Topic / Picture (Goethe standard)";
    if (t === "3") return "Teil 3 — Planning Together (Goethe standard)";
  }

  return t ? `Teil ${t}` : "Teil";
};

const looksEnglish = (text) => {
  const s = toSafe(text).toLowerCase();
  if (!s) return true;

  const englishHits = (s.match(/\b(yeah|is|are|a|the|and|to|of|in|on|for|with|i|you|we|they)\b/g) || []).length;
  const germanHits = (s.match(/\b(ich|du|er|sie|wir|ihr|ist|sind|nicht|ja|nein|bitte|danke|rauchen|erlaubt|esse|gern|reis)\b/g) || []).length;
  return englishHits >= 2 && germanHits === 0;
};

const buildMarkingPrompt = ({ level, teil, taskPrompt, keyword, transcript }) => {
  const lvl = toSafe(level).toUpperCase();
  const teilRaw = toSafe(teil);

  return `You are a strict but supportive Goethe speaking examiner.
Return ONLY valid JSON:
{
  "scores": { "pronunciation": number, "grammar": number, "content": number, "fluency": number },
  "total": number,
  "feedback_text": string,
  "normalized_transcript": string,
  "improved_answer": string,
  "ask_info_present": boolean,
  "give_info_present": boolean,
  "request_present": boolean,
  "reaction_present": boolean
}

Rules:
- Feedback must be in ENGLISH.
- Improved answer must be in GERMAN and level-appropriate.
- For A1 Teil 1: one-line intro with name+age+residence.
- For A1 Teil 2: ask + answer in German.
- For A1 Teil 3: request + reaction in German.

LEVEL: ${lvl}
TEIL: ${teilRaw}
PROMPT: ${taskPrompt || ""}
KEYWORD: ${keyword || ""}
TRANSCRIPT: ${toSafe(transcript)}`;
};

const parseJsonMaybe = (text) => {
  const raw = toSafe(text);
  try {
    return JSON.parse(raw);
  } catch (_error) {
    const match = raw.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Model did not return valid JSON");
    return JSON.parse(match[0]);
  }
};

const clampScore = (value) => {
  const n = Number(value);
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(5, Math.round(n * 10) / 10));
};

const normalizeMarking = (payload = {}) => {
  const scores = payload.scores || {};
  const pronunciation = clampScore(scores.pronunciation);
  const grammar = clampScore(scores.grammar);
  const content = clampScore(scores.content);
  const fluency = clampScore(scores.fluency);

  return {
    scores: { pronunciation, grammar, content, fluency },
    total: Math.round((pronunciation + grammar + content + fluency) * 10) / 10,
    feedback_text: toSafe(payload.feedback_text),
    normalized_transcript: toSafe(payload.normalized_transcript),
    improved_answer: toSafe(payload.improved_answer),
    ask_info_present: Boolean(payload.ask_info_present),
    give_info_present: Boolean(payload.give_info_present),
    request_present: Boolean(payload.request_present),
    reaction_present: Boolean(payload.reaction_present),
  };
};

const fetchQuestions = async () => {
  const response = await fetch(QUESTIONS_PUBLISHED_CSV_URL, { method: "GET" });
  if (!response.ok) {
    throw new Error(`Failed to load published questions: ${response.status}`);
  }

  const csvText = await response.text();
  const rows = parseCsv(csvText);
  if (rows.length < 2) return [];

  const H = headerMap(rows[0]);
  const idxLevel = H.level;
  const idxTeil = H.teil;
  const idxPrompt = H["topic/prompt"] ?? H.topic ?? H.prompt;
  const idxKeyword = H["keyword/subtopic"] ?? H.keyword ?? H.subtopic;

  if (idxLevel == null || idxTeil == null || idxPrompt == null) return [];

  return rows.slice(1).map((row, index) => {
    const level = toSafe(row[idxLevel]).toUpperCase();
    const teil = toSafe(row[idxTeil]);
    const prompt = toSafe(row[idxPrompt]);
    const keyword = idxKeyword == null ? "" : toSafe(row[idxKeyword]);

    return {
      id: String(index + 2),
      level,
      teil,
      part: teilLabel(level, teil),
      prompt,
      keyword,
    };
  });
};

const findQuestionById = (questions, questionId) => {
  const id = toSafe(questionId);
  return questions.find((item) => item.id === id) || null;
};

async function registerGoetheRecorderRoutes(app, { audioUpload, ensureOpenAIConfigured, requireAuthenticatedUser }) {
  app.get("/goethe/levels", async (_req, res) => {
    try {
      const questions = await fetchQuestions();
      const set = new Set(questions.map((item) => item.level).filter(Boolean));
      const order = ["A1", "A2", "B1", "B2", "C1", "C2"];
      return res.json(Array.from(set).sort((a, b) => order.indexOf(a) - order.indexOf(b)));
    } catch (error) {
      return res.status(500).json({ error: error.message || "Failed to load levels." });
    }
  });

  app.get("/goethe/questions", async (req, res) => {
    try {
      const level = toSafe(req.query.level).toUpperCase();
      const questions = await fetchQuestions();
      const filtered = level ? questions.filter((item) => item.level === level) : questions;
      return res.json(filtered);
    } catch (error) {
      return res.status(500).json({ error: error.message || "Failed to load questions." });
    }
  });

  app.post("/goethe/partner-script", async (req, res) => {
    if (!ensureOpenAIConfigured(res)) return;

    try {
      const authedUser = await requireAuthenticatedUser(req, res, { allowGuest: false });
      if (!authedUser) return;

      const level = toSafe(req.body?.level).toUpperCase();
      const questionId = toSafe(req.body?.questionId);
      if (!level || !questionId) return res.status(400).json({ error: "level and questionId are required" });

      const questions = await fetchQuestions();
      const question = findQuestionById(questions, questionId);
      if (!question) return res.status(404).json({ error: "Question not found" });

      const client = getOpenAIClient();
      const prompt = `Generate exactly 3 short partner lines in German for Goethe prep.\nLevel: ${level}\nTeil: ${question.teil}\nPrompt: ${question.prompt}\nKeyword: ${question.keyword || "none"}\nNo numbering. One sentence per line.`;

      const completion = await client.chat.completions.create({
        model: process.env.GOETHE_MODEL_PARTNER || "gpt-4o-mini",
        temperature: 0.6,
        max_tokens: 180,
        messages: [{ role: "user", content: prompt }],
      });

      const text = completion?.choices?.[0]?.message?.content || "";
      const lines = String(text)
        .split("\n")
        .map((line) => line.trim().replace(/^[-\d.\s]+/, ""))
        .filter(Boolean)
        .slice(0, 3);

      return res.json({ lines });
    } catch (error) {
      return res.status(500).json({ error: error.message || "Failed to generate partner lines." });
    }
  });

  app.post("/goethe/evaluate-audio", audioUpload, async (req, res) => {
    if (!ensureOpenAIConfigured(res)) return;

    try {
      const authedUser = await requireAuthenticatedUser(req, res, { allowGuest: false });
      if (!authedUser) return;

      const { file } = req;
      if (!file?.buffer?.length) return res.status(400).json({ error: "Audio file is required." });
      if (file.size > MAX_AUDIO_BYTES) return res.status(400).json({ error: "Recording too large." });

      const level = toSafe(req.body?.level).toUpperCase();
      const questionId = toSafe(req.body?.questionId);
      if (!level || !questionId) {
        return res.status(400).json({ error: "level and questionId are required." });
      }

      const questions = await fetchQuestions();
      const question = findQuestionById(questions, questionId);
      if (!question) return res.status(404).json({ error: "Question not found." });

      const client = getOpenAIClient();

      const transcribe = async (extraPrompt = "") => {
        const fileObj = await OpenAI.toFile(file.buffer, file.originalname || "goethe-answer.webm", {
          type: file.mimetype || "audio/webm",
        });

        const result = await client.audio.transcriptions.create({
          model: process.env.GOETHE_MODEL_TRANSCRIBE || "gpt-4o-mini-transcribe",
          language: "de",
          prompt: extraPrompt || "Deutsch. Transkribiere nur auf Deutsch mit korrekter Rechtschreibung.",
          file: fileObj,
        });

        return toSafe(result?.text);
      };

      let transcript = await transcribe();
      if (looksEnglish(transcript)) {
        transcript = await transcribe("WICHTIG: Nutze deutsche Wörter und deutsche Orthographie.");
      }

      const markingPrompt = buildMarkingPrompt({
        level,
        teil: question.teil,
        taskPrompt: question.prompt,
        keyword: question.keyword,
        transcript,
      });

      const marking = await client.chat.completions.create({
        model: process.env.GOETHE_MODEL_MARKING || "gpt-4o-mini",
        temperature: 0.2,
        max_tokens: 600,
        messages: [{ role: "user", content: markingPrompt }],
      });

      const rawResult = marking?.choices?.[0]?.message?.content || "{}";
      const parsed = parseJsonMaybe(rawResult);
      const normalized = normalizeMarking(parsed);

      let audioFileUrl = "";
      let audioPath = "";

      try {
        const bucket = admin.storage().bucket();
        audioPath = `goethe-recordings/${authedUser.uid}/${Date.now()}-${file.originalname || "answer.webm"}`;
        const bucketFile = bucket.file(audioPath);
        await bucketFile.save(file.buffer, { contentType: file.mimetype || "audio/webm" });
        const [signedUrl] = await bucketFile.getSignedUrl({ action: "read", expires: Date.now() + 1000 * 60 * 60 * 24 });
        audioFileUrl = signedUrl;
      } catch (_storageError) {
        audioFileUrl = "";
      }

      return res.json({
        ...normalized,
        transcript,
        audioFileUrl,
        meta: {
          level,
          questionId,
          uid: authedUser.uid,
          audioPath,
        },
      });
    } catch (error) {
      return res.status(500).json({ error: error.message || "Failed to evaluate audio." });
    }
  });
}

module.exports = {
  registerGoetheRecorderRoutes,
};
