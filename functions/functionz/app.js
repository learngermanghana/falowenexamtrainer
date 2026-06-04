/**
 * app.js (FULL FILE) — Paystack installments + better contract handling
 * Key fixes included:
 * 1) DO NOT store authorization_url in students.paystackLink (it expires). Return it only to frontend.
 * 2) Preserve contractStart if already active; extend/upgrade contractEnd instead of resetting each payment.
 * 3) Enforce min installment GH₵2000 unless the payment clears the remaining balance.
 * 4) Safer Paystack signature comparison (timing-safe).
 */

const express = require("express");
const cors = require("cors");
const admin = require("firebase-admin");
const crypto = require("crypto");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const os = require("os");
const fsPromises = require("fs/promises");
const bcrypt = require("bcryptjs");

const { grammarPrompt, getWritingIdeasPrompt, markPrompt } = require("./prompts");
const { createChatCompletion, getOpenAIClient } = require("./openaiClient");
const { appendStudentToStudentsSheetSafely } = require("./studentsSheet");
const { createLogger, logRequest } = require("./logger");
const { incrementCounter, getMetricsSnapshot } = require("./metrics");
const { courseSchedulesByName } = require("../data/classSchedules");

let getScoresForStudent;

const log = createLogger({ scope: "app" });
const isOpenAIConfigured = () => Boolean(process.env.OPENAI_API_KEY);
const ensureOpenAIConfigured = (res) => {
  if (isOpenAIConfigured()) return true;
  res.status(503).json({ error: "OpenAI API key is not configured" });
  return false;
};

function initFirebaseAdmin() {
  if (admin.apps.length) return;

  const b64 =
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON_B64 ||
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON_B64;

  const raw =
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON ||
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  let serviceAccount = null;

  if (raw) {
    serviceAccount = JSON.parse(raw);
  } else if (b64) {
    serviceAccount = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
  }

  if (serviceAccount?.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
  }

  const projectId =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.GOOGLE_CLOUD_PROJECT ||
    process.env.GCLOUD_PROJECT ||
    serviceAccount?.project_id;

  if (serviceAccount?.client_email && serviceAccount?.private_key) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId,
    });
    return;
  }

  // fallback (not ideal on Vercel, but keeps it from crashing if projectId exists)
  admin.initializeApp({ projectId });
}

initFirebaseAdmin();

const { scoresSummaryHandler } = require("./routes/scoresSummary");

async function getAuthedUser(req) {
  const authHeader = req.headers?.authorization || "";
  const match = authHeader.match(/^Bearer (.+)$/i);
  if (!match) return null;

  try {
    return await admin.auth().verifyIdToken(match[1]);
  } catch (err) {
    console.warn("Failed to verify ID token", err);
    return null;
  }
}

function getFirestoreSafe() {
  try {
    return admin.firestore();
  } catch (err) {
    console.warn("Firestore not available", err?.message || err);
    return null;
  }
}

function validateString(
  value,
  { required = false, maxLength = 500, label = "field" } = {}
) {
  if (required && (typeof value !== "string" || !value.trim())) {
    return `${label} is required`;
  }

  if (typeof value === "string" && value.length > maxLength) {
    return `${label} must be at most ${maxLength} characters`;
  }

  return null;
}

function validateAnswersArray(value, { maxEntries = 10, maxTextLength = 600 } = {}) {
  if (!Array.isArray(value) || value.length === 0) {
    return "At least one answer is required";
  }

  if (value.length > maxEntries) {
    return `A maximum of ${maxEntries} answers is allowed`;
  }

  for (const item of value) {
    if (typeof item?.text !== "string" || !item.text.trim()) {
      return "Each answer must include text";
    }

    if (item.text.length > maxTextLength) {
      return `Answers must be under ${maxTextLength} characters`;
    }
  }

  return null;
}

const DAILY_LIMITS = {
  grammar: 20,
  chatbuddy: 30,
  placement: 5,
  speaking: 25,
  speechTrainer: 25,
  nextTask: 30,
};

const DEFAULT_TUITION_CURRENCY = "GHS";
const PAYSTACK_MAX_EVENT_AGE_MINUTES = 60 * 24 * 3; // 72 hours
const PAYSTACK_MIN_PAYMENT_FLOOR = 10; // guard against tiny or missing amounts
const PAYSTACK_OVERPAY_TOLERANCE_RATE = 0.02; // allow small rounding/fee differences
const PAYSTACK_MIN_INSTALLMENT_GHS = 2000;
const ZOOM_SIGNATURE_TOLERANCE_MS = 5 * 60 * 1000;

function addMonths(date, months) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  d.setMonth(d.getMonth() + Number(months || 0));
  return d;
}

function parseSlashDate(raw) {
  if (!raw) return null;
  const match = String(raw).trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (!match) return null;
  const first = Number(match[1]);
  const second = Number(match[2]);
  const year = Number(match[3]);
  if (!first || !second || !year) return null;

  let month = first;
  let day = second;
  if (first > 12 && second <= 12) {
    day = first;
    month = second;
  } else if (second > 12 && first <= 12) {
    month = first;
    day = second;
  }

  const parsed = new Date(year, month - 1, day);
  if (Number.isNaN(parsed.getTime())) return null;
  if (parsed.getFullYear() !== year || parsed.getMonth() !== month - 1 || parsed.getDate() !== day) {
    return null;
  }
  return parsed;
}

function parseContractEnd(value) {
  if (!value) return null;
  if (value instanceof Date) return value;
  if (typeof value === "object" && typeof value.toDate === "function") {
    const fromTimestamp = value.toDate();
    if (fromTimestamp instanceof Date && !Number.isNaN(fromTimestamp.getTime())) {
      return fromTimestamp;
    }
  }
  if (typeof value === "string") {
    const slashDate = parseSlashDate(value);
    if (slashDate) return slashDate;
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  if (typeof value === "number") {
    const parsed = new Date(value);
    if (!Number.isNaN(parsed.getTime())) return parsed;
  }
  return null;
}

/**
 * Timing-safe compare for signature hex strings
 */
function safeEqualHex(a, b) {
  if (!a || !b) return false;
  const aStr = String(a);
  const bStr = String(b);
  if (aStr.length !== bStr.length) return false;

  try {
    return crypto.timingSafeEqual(Buffer.from(aStr, "utf8"), Buffer.from(bStr, "utf8"));
  } catch (_e) {
    return false;
  }
}

const pad2 = (value) => String(value).padStart(2, "0");

const formatDateInTimeZone = (date, timeZone) => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const parts = formatter.formatToParts(date);
  const lookup = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${lookup.year}-${lookup.month}-${lookup.day}`;
};

const buildScheduleSummary = (sessions = []) =>
  sessions
    .map((session) => {
      const base = [session.chapter, session.type].filter(Boolean).join(" – ");
      return session.note ? `${base} (${session.note})` : base;
    })
    .join(" • ");

const getScheduleSessionForDate = ({ className, referenceDate }) => {
  const schedule = courseSchedulesByName[className];
  if (!schedule?.days?.length) return null;

  const timeZone = schedule.timezone || "UTC";
  const date = formatDateInTimeZone(referenceDate, timeZone);
  const day = schedule.days.find((entry) => entry.date === date);

  if (!day) {
    return { date, summary: null, sessions: [] };
  }

  return {
    date,
    sessions: day.sessions || [],
    summary: buildScheduleSummary(day.sessions || []),
  };
};

const verifyZoomSignature = (req, secret) => {
  const signature = req.headers["x-zm-signature"];
  const timestamp = req.headers["x-zm-request-timestamp"];

  if (!signature || !timestamp) {
    return { ok: false, error: "Missing Zoom signature headers" };
  }

  const parsedTimestamp = Number(timestamp);
  if (!Number.isFinite(parsedTimestamp)) {
    return { ok: false, error: "Invalid Zoom signature timestamp" };
  }

  const ageMs = Math.abs(Date.now() - parsedTimestamp * 1000);
  if (ageMs > ZOOM_SIGNATURE_TOLERANCE_MS) {
    return { ok: false, error: "Zoom signature timestamp expired" };
  }

  const rawBody = req.rawBody ? req.rawBody.toString("utf8") : JSON.stringify(req.body || {});
  const message = `v0:${timestamp}:${rawBody}`;
  const expected = `v0=${crypto.createHmac("sha256", secret).update(message).digest("hex")}`;

  if (!safeEqualHex(expected, signature)) {
    return { ok: false, error: "Zoom signature mismatch" };
  }

  return { ok: true };
};

const memoryQuota = new Map();

function pruneOldCounters(counters = {}) {
  const today = new Date().toISOString().slice(0, 10);
  return Object.fromEntries(Object.entries(counters).filter(([date]) => date === today));
}

async function enforceUserQuota({ uid, category, limit }) {
  const db = getFirestoreSafe();
  const today = new Date().toISOString().slice(0, 10);

  if (db) {
    const ref = db.collection("usageQuotas").doc(uid);
    const now = admin.firestore.Timestamp.now();

    return db.runTransaction(async (tx) => {
      const snap = await tx.get(ref);
      const data = snap.exists ? snap.data() || {} : {};
      const counters = pruneOldCounters(data.counters || {});
      const todayCounters = counters[today] || {};
      const current = Number(todayCounters[category] || 0);

      if (current >= limit) {
        incrementCounter("quota_blocked", category);
        log.warn("quota.limit.hit", { uid, category, limit, remaining: 0 });
        return { allowed: false, remaining: 0 };
      }

      const updatedCounters = {
        ...counters,
        [today]: { ...todayCounters, [category]: current + 1 },
      };

      tx.set(ref, { counters: updatedCounters, updatedAt: now }, { merge: true });

      return { allowed: true, remaining: Math.max(limit - (current + 1), 0) };
    });
  }

  const key = `${uid}:${today}:${category}`;
  const currentEntry = memoryQuota.get(key) || 0;

  if (currentEntry >= limit) {
    incrementCounter("quota_blocked", category);
    log.warn("quota.limit.hit", { uid, category, limit, remaining: 0 });
    return { allowed: false, remaining: 0 };
  }

  memoryQuota.set(key, currentEntry + 1);
  return { allowed: true, remaining: Math.max(limit - (currentEntry + 1), 0) };
}

async function auditAIRequest({ route, uid, email, metadata = {}, success = true }) {
  const db = getFirestoreSafe();
  if (!db) return;

  try {
    await db.collection("aiAuditLogs").add({
      route,
      uid: uid || null,
      email: email ? String(email).toLowerCase() : null,
      success,
      metadata,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  } catch (err) {
    console.warn(`Failed to write audit for ${route}`, err?.message || err);
  }
}

async function requireAuthenticatedUser(req, res, { allowGuest = true } = {}) {
  const authedUser = await getAuthedUser(req);
  if (!authedUser?.uid) {
    if (!allowGuest) {
      res.status(401).json({ error: "Authentication required" });
      return null;
    }
    return { uid: "guest", email: null, isGuest: true };
  }

  return authedUser;
}

function loadScoresModule() {
  if (getScoresForStudent) return getScoresForStudent;

  try {
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

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 25 * 1024 * 1024 },
});

const audioUpload = (req, res, next) => {
  upload.single("audio")(req, res, (err) => {
    if (!err) return next();

    console.error("Multer upload error:", err);

    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        error: err.message,
        code: err.code,
      });
    }

    return res.status(400).json({ error: err?.message || "Upload failed" });
  });
};

const app = express();

app.use(cors({ origin: true }));
app.use(logRequest);
app.use(
  express.json({
    limit: "1mb",
    verify: (req, _res, buf) => {
      req.rawBody = buf;
    },
  })
);

app.get("/", (_req, res) => res.send("OK"));
app.get("/health", (_req, res) =>
  res.json({ ok: true, timestamp: new Date().toISOString(), uptimeSeconds: process.uptime() })
);

app.get("/metrics", (_req, res) => {
  const snapshot = getMetricsSnapshot();
  res.json({
    ok: true,
    timestamp: new Date().toISOString(),
    uptimeSeconds: process.uptime(),
    metrics: snapshot,
    memory: process.memoryUsage(),
  });
});

app.post("/webhooks/zoom", async (req, res) => {
  const requestLog = createLogger({ scope: "zoom_webhook", requestId: req.requestId });
  console.log("ZOOM_WEBHOOK_EVENT:", req.body?.event);
  const secret = process.env.ZOOM_WEBHOOK_SECRET;

  if (!secret) {
    requestLog.warn("zoom.webhook.missing_secret");
    return res.status(503).json({ error: "Zoom webhook secret not configured" });
  }

  const eventType = req.body?.event;
  if (eventType === "endpoint.url_validation") {
    const plainToken = req.body?.payload?.plainToken;
    if (!plainToken) {
      return res.status(400).json({ error: "Missing Zoom plainToken" });
    }

    const encryptedToken = crypto
      .createHmac("sha256", secret)
      .update(plainToken)
      .digest("hex");

    return res.json({ plainToken, encryptedToken });
  }

  const verification = verifyZoomSignature(req, secret);
  if (!verification.ok) {
    requestLog.warn("zoom.webhook.signature_failed", { error: verification.error });
    return res.status(401).json({ error: verification.error });
  }

  if (eventType !== "meeting.participant_joined") {
    return res.json({ ok: true, ignored: true });
  }

  try {
    const payload = req.body?.payload?.object || {};
    const participant = payload.participant || {};
    const email = participant.user_email || participant.email || "";
    const displayName = participant.user_name || participant.name || participant.display_name || "";

    if (!email && !displayName) {
      requestLog.warn("zoom.webhook.missing_email", { participant });
      return res.status(202).json({ ok: true, skipped: "missing_email" });
    }

    const studentResult = await findStudentByCodeOrEmail({
      email: email || null,
      studentCode: displayName || null,
    });
    if (!studentResult) {
      requestLog.warn("zoom.webhook.student_not_found", { email, displayName });
      return res.status(202).json({ ok: true, skipped: "student_not_found" });
    }

    const studentData = studentResult.snap.data() || {};
    const className = studentData.className;
    if (!className) {
      requestLog.warn("zoom.webhook.missing_class", { email, studentId: studentResult.snap.id });
      return res.status(202).json({ ok: true, skipped: "missing_class" });
    }

    const studentCode =
      studentData.studentCode ||
      studentData.studentcode ||
      studentResult.snap.id ||
      email.toLowerCase();

    const joinTimeRaw =
      participant.join_time || payload.start_time || payload.created_at || new Date().toISOString();
    const joinTime = new Date(joinTimeRaw);
    const referenceDate = Number.isNaN(joinTime.getTime()) ? new Date() : joinTime;

    const scheduleInfo = getScheduleSessionForDate({ className, referenceDate });
    if (!scheduleInfo?.sessions?.length) {
      return res.status(202).json({ ok: true, skipped: "no_class_today" });
    }
    const sessionDate =
      scheduleInfo?.date || formatDateInTimeZone(referenceDate, "UTC");

    const summary =
      scheduleInfo?.summary || payload.topic || payload.topic_name || "Session";

    const db = getFirestoreSafe();
    if (!db) {
      return res.status(500).json({ error: "Firestore not available" });
    }

    const sessionRef = db
      .collection("attendance")
      .doc(className)
      .collection("sessions")
      .doc(sessionDate);

    await sessionRef.set(
      {
        date: sessionDate,
        topic: summary,
        sessions: scheduleInfo?.sessions || [],
        meetingId: payload.id || payload.uuid || null,
        meetingTopic: payload.topic || null,
        lastZoomJoinAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        source: "zoom",
        attendance: {
          [studentCode]: true,
        },
      },
      { merge: true }
    );

    return res.json({ ok: true, marked: studentCode, className, sessionDate });
  } catch (err) {
    requestLog.error("zoom.webhook.error", { error: err?.message || err });
    return res.status(500).json({ error: err?.message || "Unknown error" });
  }
});

app.post("/admin/purge-expired-students", async (req, res) => {
  try {
    const secret = req.headers["x-cron-secret"];
    if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
      return res.status(403).json({ error: "Forbidden" });
    }

    const db = getFirestoreSafe();
    if (!db) return res.status(500).json({ error: "Firestore not available" });

    const now = new Date();
    const nowIso = now.toISOString();
    const nowMs = now.getTime();

    let deletedStudents = 0;
    let authDeleted = 0;
    let authMissing = 0;
    let firestoreFailed = 0;
    let scanned = 0;
    let skippedActive = 0;
    let skippedInvalid = 0;
    let skippedNonStudent = 0;
    let skippedFailed = 0;

    let lastDoc = null;
    while (true) {
      let query = db
        .collection("students")
        .where("contractEnd", ">", "")
        .orderBy("contractEnd")
        .limit(25);

      if (lastDoc) {
        query = query.startAfter(lastDoc);
      }

      const snap = await query.get();

      if (snap.empty) break;

      lastDoc = snap.docs[snap.docs.length - 1];

      for (const docSnap of snap.docs) {
        scanned += 1;
        const data = docSnap.data() || {};
        const uid = data.uid;
        const contractEndDate = parseContractEnd(data.contractEnd);

        if (data.purgeStatus === "failed") {
          skippedFailed += 1;
          continue;
        }

        if (data.role && data.role !== "student") {
          skippedNonStudent += 1;
          continue;
        }

        if (!contractEndDate) {
          skippedInvalid += 1;
          continue;
        }

        if (contractEndDate.getTime() >= nowMs) {
          skippedActive += 1;
          continue;
        }

        // Delete Auth user (best effort)
        if (uid) {
          try {
            await admin.auth().deleteUser(uid);
            authDeleted += 1;
          } catch (err) {
            if (err?.code === "auth/user-not-found") authMissing += 1;
            else console.warn("Auth delete failed", docSnap.id, err?.message || err);
          }
        }

        // Delete Firestore doc
        try {
          if (typeof db.recursiveDelete === "function") {
            await db.recursiveDelete(docSnap.ref);
          } else {
            await docSnap.ref.delete(); // NOTE: doesn't delete subcollections
          }
          deletedStudents += 1;
        } catch (err) {
          firestoreFailed += 1;
          console.warn("Firestore delete failed", docSnap.id, err?.message || err);

          // ✅ mark so we don't loop forever
          await docSnap.ref.set(
            {
              purgeStatus: "failed",
              purgeError: String(err?.message || "unknown"),
              purgeFailedAt: admin.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
          );
        }
      }
    }

    return res.json({
      ok: true,
      deletedStudents,
      authDeleted,
      authMissing,
      firestoreFailed,
      scanned,
      skippedActive,
      skippedInvalid,
      skippedNonStudent,
      skippedFailed,
      nowIso,
    });
  } catch (err) {
    return res.status(500).json({ error: err?.message || "Unknown error" });
  }
});


app.get("/scores/summary", scoresSummaryHandler);

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


const isAllowedAudioUrlHost = (host) => {
  const allowedHosts = new Set([
    "firebasestorage.googleapis.com",
    "storage.googleapis.com",
  ]);
  return allowedHosts.has(String(host || "").toLowerCase());
};

const downloadAudioFromUrl = async (audioUrl) => {
  const parsedUrl = new URL(String(audioUrl || ""));
  if (parsedUrl.protocol !== "https:") {
    throw new Error("audioUrl must use https");
  }

  if (!isAllowedAudioUrlHost(parsedUrl.hostname)) {
    throw new Error("audioUrl host is not allowed");
  }

  const response = await fetch(parsedUrl.toString(), {
    method: "GET",
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(`Failed to download audio (${response.status})`);
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (!buffer.length) {
    throw new Error("Downloaded audio is empty");
  }

  const maxBytes = 25 * 1024 * 1024;
  if (buffer.length > maxBytes) {
    throw new Error("Audio file is too large");
  }

  const contentType = response.headers.get("content-type") || "audio/webm";

  return {
    buffer,
    originalname: "speech-trainer-remote.webm",
    mimetype: contentType,
    size: buffer.length,
  };
};

const parseSpeakingQuestionContext = (question) => {
  const source = String(question || "").trim();
  if (!source) return null;

  const levelMatch = source.match(/(?:^|\n|\b)level\s*[:\-]?\s*([A-C][12])/i);
  const teilMatch = source.match(/(?:^|\n|\b)(?:teil|part)\s*[:\-]?\s*(?:teil\s*)?(\d)/i);
  const topicMatch = source.match(/(?:^|\n|\b)(?:topic|prompt|task)\s*[:\-]\s*(.+)/i);
  const keywordMatch = source.match(/(?:^|\n|\b)(?:keyword|subtopic)\s*[:\-]\s*(.+)/i);

  let topic = topicMatch ? String(topicMatch[1]).trim() : "";
  let keyword = keywordMatch ? String(keywordMatch[1]).trim() : "";

  if (!topic && !keyword) {
    const inlineTopic = source.match(/topic\s*[:\-]?\s*([^\n()]+)(?:\(([^)]+)\))?/i);
    if (inlineTopic) {
      topic = String(inlineTopic[1] || "").trim();
      if (!keyword && inlineTopic[2]) {
        keyword = String(inlineTopic[2]).replace(/^keyword\s*[:\-]?/i, "").trim();
      }
    }
  }

  return {
    source,
    level: levelMatch ? String(levelMatch[1]).toUpperCase() : "",
    teil: teilMatch ? String(teilMatch[1]) : "",
    topic,
    keyword,
  };
};

const speakingPrompt = ({ teil, level, contextType, question, interactionMode }) => {
  const targetLevel = String(level || "A2").toUpperCase();
  const parsed = parseSpeakingQuestionContext(question);
  const teilNumber = String(teil || parsed?.teil || "").trim();
  const teilLabel = teilNumber ? `Teil ${teilNumber}` : "the selected speaking task";
  const context = contextType ? `Context: ${contextType}.` : "";
  const interaction =
    typeof interactionMode === "undefined" ? "" : `Interaction mode: ${interactionMode}.`;

  const taskCard = parsed
    ? [
        "EXAM TASK CARD (from sheet prompt):",
        `- Level: ${parsed.level || targetLevel}`,
        `- Teil: ${parsed.teil ? `Teil ${parsed.teil}` : teilLabel}`,
        `- Topic/Prompt: ${parsed.topic || parsed.source}`,
        `- Keyword/Subtopic: ${parsed.keyword || "(none)"}`,
      ].join("\n")
    : question
      ? `EXAM TASK CARD: ${question}`
      : "EXAM TASK CARD: not provided; infer from transcript and Teil.";

  const partRulesByLevel = {
    A1: [
      "A1 GOETHE CHECKS:",
      "- Teil 1: self-introduction (e.g., Name, Alter, Wohnort, Land, Sprache, Familie, Beruf, Hobby) in short simple sentences.",
      "- Teil 2: student should ask and answer their own short question (W-question or Ja/Nein question).",
      "- Teil 3: student should make a request using patterns like 'Verb + Sie + bitte' or 'Können Sie ...' with infinitive at the end.",
    ].join("\n"),
    A2: [
      "A2 GOETHE CHECKS:",
      "- Teil 1: student asks personal questions and answers them themselves (single-candidate simulation).",
      "- Teil 2: student tells about themselves and their life with connected simple sentences.",
      "- Teil 3: student plans something with a partner role and should show proposing + reacting language (single-candidate simulation).",
    ].join("\n"),
    B1: [
      "B1 GOETHE CHECKS:",
      "- Teil 1: student plans something jointly with a partner role (single-candidate simulation accepted).",
      "- Teil 2: student presents a chosen topic with clear structure.",
      "- Teil 3: student discusses both their own topic and the partner's topic (simulate both sides if alone).",
    ].join("\n"),
    B2: [
      "B2 GOETHE CHECKS:",
      "- Teil 1: student gives a short talk on a chosen topic, then responds to follow-up discussion points.",
      "- Teil 2: student exchanges viewpoints in a discussion with reasons, reactions, and contrast markers.",
    ].join("\n"),
    C1: [
      "C1 GOETHE CHECKS:",
      "- Teil 1: student gives a structured, nuanced presentation on a chosen abstract or societal topic and can clarify key points.",
      "- Teil 2: student sustains an argument-driven discussion, comparing perspectives and defending position precisely.",
      "- If student is alone, accept simulated interaction where they ask/anticipate and answer partner viewpoints.",
    ].join("\n"),
  };

  const partRules =
    partRulesByLevel[targetLevel] ||
    "GOETHE CHECKS: judge by exam readiness for task fulfilment, interaction, language range/control, and coherence.";

  return [
    "You are a strict but supportive Goethe speaking examiner.",
    `Target CEFR level: ${targetLevel}. Focus on ${teilLabel}.`,
    context,
    interaction,
    taskCard,
    partRules,
    "OUTPUT FORMAT (plain text, concise):",
    "1) Personal tutor feedback in English (4-6 short lines) speaking directly to the student as 'you'.",
    "2) Keep it human and direct: what you did well, what to fix next, and one clear next step.",
    "3) Add a short corrected German version (1-3 lines) that matches the task card.",
    "4) Do NOT output score tables, rubric labels, criterion checklists, or weighted breakdowns.",
  ]
    .filter(Boolean)
    .join("\n\n");
};

const levelAwareChatRules = ({ level }) => [
  `Target CEFR level: ${level || "B1"}.`,
  "Level rules: A1/A2 = simple English explanation + simple German examples. B1 = correct and help build longer connected sentences. B2 = improve argumentation, connectors and natural expression. C1 = upgrade to advanced, natural, precise German.",
  "Correct only the 1-2 most important mistakes per turn. Keep replies short and phone-friendly.",
  "For C1 useful replies, use this compact pattern: short natural response; 'Besser / C1-Version:' with one upgraded sentence; 'Nützlicher Ausdruck:' with one strong C1 phrase and English meaning; one deeper follow-up question. Do not only correct; upgrade.",
  "Current-info safety: if asked about current politics, current office holders, current government, current prices, latest news, or anything that may change, do not answer with certainty unless live/current data is provided. Say: 'Bei aktuellen Informationen kann ich mich irren. Bitte prüfe eine aktuelle Quelle.' Then continue language practice with a safe sentence frame.",
  "Keep the conversation on the current lesson/topic when provided. If the student goes off topic, gently connect it back to the lesson.",
].join(" ");

const formatSessionPrompt = ({ mode, lessonContext, sessionContext }) => {
  const lesson = lessonContext && typeof lessonContext === "object" ? lessonContext : {};
  const session = sessionContext && typeof sessionContext === "object" ? sessionContext : {};
  return [
    `Selected chat mode: ${mode || "Lesson"}`,
    `Lesson title/topic: ${lesson.lessonTitle || lesson.topic || "Not provided"}`,
    `Session state: ${session.state || "not_started"}`,
    `Approximate minutes left: ${Number.isFinite(Number(session.minutesLeft)) ? Number(session.minutesLeft).toFixed(1) : "unknown"}`,
    "If the session is almost over, guide toward a conclusion. If the session ended, do not continue a long conversation; suggest starting a new session.",
  ].join("\n");
};

const chatBuddyPrompt = ({ level, mode, lessonContext, sessionContext }) =>
  [
    "You are Falowen Chat Buddy, a friendly study partner helping a student practise.",
    levelAwareChatRules({ level }),
    "Respond in clear English so the student is never confused, except German examples/phrases.",
    "Always ask one follow-up question unless the session has ended.",
    formatSessionPrompt({ mode, lessonContext, sessionContext }),
  ].join("\n");

const customSpeakingChatPrompt = ({ level, mode, lessonContext, sessionContext }) =>
  [
    "You are Falowen Custom Speaking Chat, a warm German speaking partner for free conversation practice.",
    levelAwareChatRules({ level }),
    "The student can talk about any safe everyday topic, but if a course lesson/topic is provided, connect the conversation back to it gently. Do not force exam tasks or presentations.",
    "Main goal: improve Sprechen confidence through back-and-forth communication.",
    "Reply mostly in German, with short English support only when it prevents confusion.",
    "Always ask exactly one friendly German follow-up question to keep the speaking flow active unless the session has ended.",
    "Keep concise: maximum 6 short lines.",
    formatSessionPrompt({ mode: mode || "Speaking", lessonContext, sessionContext }),
  ].join("\n");

const PRESENTATION_TURN_LIMIT = 6;

const PRESENTATION_PROMPT_BY_LEVEL = {
  A1: [
    "ROLE: You are Herr Felix, a supportive, motivating German teacher.",
    "INTERACTION RULES (hard constraints):",
    "1) Address the student directly (du/Sie); never mention other students, surveys, or groups.",
    "2) NO third-person summaries, NO meta commentary, NO surveys; never start with 'In our survey' or similar.",
    "3) Ask exactly ONE question in German per turn, based on the student's last answer.",
    "4) Do not generate the final presentation until AFTER six student answers.",
    "5) If the user asks three grammar questions consecutively without attempting answers, pause politely and direct them briefly to the course book, then continue.",
    "6) If the input is a letter task, direct them to the Schreiben tab ideas generator (briefly).",
    "7) Keep tone friendly and concise.",
    "SESSION FLOW:",
    "Start by congratulating them in English for their topic and outline the session (6 turns → short presentation). Share one quick tip for building ideas if stuck. Choose three useful keywords for the topic. For each keyword, ask up to two creative follow-ups over time (one per turn).",
    "After every student answer: give feedback mainly in English PLUS 1–2 very simple German correction lines (A1-safe, short sentences showing exactly what to fix), add one short motivating line in German, explain any difficult words (A1–B2), and remind how many questions remain.",
    "After exactly six total student answers: provide final feedback in English, then a 60-word German presentation composed from the student's own words (no third-person, no surveys), then summarise next steps in German and encourage them.",
    "OUTPUT FORMAT (strict):",
    "<response><question_de>…exactly one German question ending with '?'…</question_de><feedback_en>…2–3 short sentences in English + 1–2 very simple German fix lines…</feedback_en><motivation_de>…one short German line…</motivation_de><vocab_explain>• Wort – EN meaning; • Wort – EN meaning (max 3)</vocab_explain><progress_de>Noch X Frage(n) bis zur Präsentation.</progress_de></response>",
    "For the final turn (after 6 answers), replace <question_de> with <abschluss_de> containing encouragement only (NO external links), and include <praesentation_de> with ~60 words built ONLY from the student's content.",
  ].join("\n"),
  A2: [
    "ROLE: You are Herr Felix, a supportive, motivating German teacher.",
    "INTERACTION RULES (hard constraints):",
    "1) Address the student directly (du/Sie); never mention other students, surveys, or groups.",
    "2) NO third-person summaries, NO meta commentary, NO surveys; never start with 'In our survey' or similar.",
    "3) Ask exactly ONE question in German per turn, based on the student's last answer.",
    "4) Do not generate the final presentation until AFTER six student answers.",
    "5) If the user asks three grammar questions consecutively without attempting answers, pause politely and direct them briefly to the course book, then continue.",
    "6) If the input is a letter task, direct them to the Schreiben tab ideas generator (briefly).",
    "7) Keep tone friendly and concise.",
    "SESSION FLOW:",
    "Start by congratulating them in English for their topic and outline the session (6 turns → short presentation). Share one quick tip for building ideas if stuck. Choose three useful keywords for the topic. For each keyword, ask up to two creative follow-ups over time (one per turn).",
    "After every student answer: give feedback mainly in English PLUS 1–2 very simple German correction lines (A2-safe, short sentences showing exactly what to fix), add one short motivating line in German, explain any difficult words (A1–B2), and remind how many questions remain.",
    "After exactly six total student answers: provide final feedback in English, then a 60-word German presentation composed from the student's own words (no third-person, no surveys), then summarise next steps in German and encourage them.",
    "OUTPUT FORMAT (strict):",
    "<response><question_de>…exactly one German question ending with '?'…</question_de><feedback_en>…2–3 short sentences in English + 1–2 very simple German fix lines…</feedback_en><motivation_de>…one short German line…</motivation_de><vocab_explain>• Wort – EN meaning; • Wort – EN meaning (max 3)</vocab_explain><progress_de>Noch X Frage(n) bis zur Präsentation.</progress_de></response>",
    "For the final turn (after 6 answers), replace <question_de> with <abschluss_de> containing encouragement only (NO external links), and include <praesentation_de> with ~60 words built ONLY from the student's content.",
  ].join("\n"),
  B1: [
    "ROLE: You are Herr Felix, a supportive, motivating German teacher.",
    "INTERACTION RULES (hard constraints):",
    "1) Address the student directly (du/Sie); never mention other students, surveys, or groups.",
    "2) NO third-person summaries, NO meta commentary, NO surveys; never start with 'In our survey' or similar.",
    "3) Ask exactly ONE question in German per turn, based on the student's last answer.",
    "4) Do not generate the final presentation until AFTER six student answers.",
    "5) If the user asks three grammar questions consecutively without attempting answers, pause politely and direct them briefly to the course book, then continue.",
    "6) If the input is a letter task, direct them to the Schreiben tab ideas generator (briefly).",
    "7) Keep tone friendly and concise.",
    "SESSION FLOW:",
    "Start by congratulating them in English for their topic and outline the session (6 turns → short presentation). Share one quick tip for building ideas if stuck. Choose three useful keywords for the topic. For each keyword, ask up to two creative follow-ups over time (one per turn).",
    "After every student answer: give feedback half in English and half in German, add one short motivating line in German, explain any difficult words (A1–B2), and remind how many questions remain.",
    "After exactly six total student answers: provide final feedback in English, then a 60-word German presentation composed from the student's own words (no third-person, no surveys), then summarise next steps in German and encourage them.",
    "OUTPUT FORMAT (strict):",
    "<response><question_de>…exactly one German question ending with '?'…</question_de><feedback_mix>…2–3 sentences…</feedback_mix><motivation_de>…one short German line…</motivation_de><vocab_explain>• Wort – EN meaning; • Wort – EN meaning (max 3)</vocab_explain><progress_de>Noch X Frage(n) bis zur Präsentation.</progress_de></response>",
    "For the final turn (after 6 answers), replace <question_de> with <abschluss_de> containing encouragement only (NO external links), and include <praesentation_de> with ~60 words built ONLY from the student's content.",
  ].join("\n"),
  B2: "Same as B1 (identical behavior and output format with feedback_mix).",
  C1: "Same as B1 (identical behavior and output format with feedback_mix).",
};

const presentationCoachPrompt = ({ level = "A1", answersDone = 0 }) => {
  const normalizedLevel = String(level || "A1").toUpperCase();
  const levelPrompt =
    normalizedLevel === "B2" || normalizedLevel === "C1"
      ? PRESENTATION_PROMPT_BY_LEVEL.B1
      : PRESENTATION_PROMPT_BY_LEVEL[normalizedLevel] || PRESENTATION_PROMPT_BY_LEVEL.A1;

  return [
    levelPrompt,
    `Current completed student answers: ${answersDone}/${PRESENTATION_TURN_LIMIT}.`,
    `When completed answers are fewer than ${PRESENTATION_TURN_LIMIT}, use <question_de>.`,
    `When completed answers are ${PRESENTATION_TURN_LIMIT}, replace <question_de> with <abschluss_de> and include <praesentation_de>.`,
    "Do not output any external recording links in <abschluss_de> or any other tag.",
    "Treat the learner's first message in a new session as the task/topic/question setup, NOT as Answer 1.",
    "If that first message is long, includes bullet points, copied feedback blocks, or mixed languages, extract the core speaking prompt and still ask the first German follow-up question.",
    "On the first learner turn, do not analyse it like a finished answer. Briefly acknowledge the topic, then ask the first question in German.",
    "For every turn also include <error_intel> with three bullets for article/case, verb position, tense slips. Each bullet: short rule + one corrected example.",
    "On final turn include <rubric>Grammar:X/5|Vocabulary:Y/5|Pronunciation readiness:Z/5|Structure:W/5</rubric>.",
    "On final turn include <script_short>, <script_medium>, and <script_long> with speaking-ready German scripts for about 45s, 90s, and 2min.",
    "Never output markdown outside the required XML-like structure.",
  ].join("\n\n");
};

function sanitizePresentationHistory(messages = []) {
  if (!Array.isArray(messages)) return [];
  return messages
    .filter((item) => item && (item.role === "user" || item.role === "assistant"))
    .map((item) => ({
      role: item.role,
      content: String(item.content || "").slice(0, 1200),
    }))
    .filter((item) => item.content.trim())
    .slice(-20);
}

function isLikelyPresentationSetupMessage(text = "") {
  const normalized = String(text || "").toLowerCase();
  if (!normalized) return false;

  const setupMarkers = [
    "coach felix",
    "grammar and feedback",
    "motivation",
    "vocabulary",
    "progress",
    "topic selected:",
    "please start the 6-step coaching flow",
    "please start with easy german",
    "gliederung",
    "noch 5 frage",
    "noch 5 fragen",
    "first choose a context",
    "hallo! i am coach",
  ];

  if (setupMarkers.some((marker) => normalized.includes(marker))) return true;

  const structureLines = [
    "begrüßung + thema nennen",
    "begriff kurz erklären oder definieren",
    "zwei konkrete beispiele nennen",
    "vergleich oder kontrast herstellen",
    "eigene meinung + begründung geben",
    "kurz zusammenfassen und abschließen",
  ];

  const matchedStructureLines = structureLines.filter((line) => normalized.includes(line)).length;
  if (matchedStructureLines >= 2) return true;

  const lineCount = normalized.split(/\n+/).filter(Boolean).length;
  const bulletCount = (normalized.match(/[•\-*]\s/g) || []).length;
  return lineCount >= 8 && bulletCount >= 2;
}

function isCountablePresentationAnswer(text = "") {
  const trimmed = String(text || "").trim();
  if (!trimmed) return false;
  return !isLikelyPresentationSetupMessage(trimmed);
}

function countUserAnswers(messages = []) {
  return messages.reduce(
    (count, item) => (item?.role === "user" && isCountablePresentationAnswer(item?.content) ? count + 1 : count),
    0
  );
}


const presentationUpgradePrompt = ({ level = "A1", mode = "a2-b1" }) => {
  const modes = {
    "a2-b1": "Rewrite the student answer to CEFR A2/B1 German that is natural and exam-ready.",
    formal: "Rewrite the student answer in a more formal register suitable for a class presentation.",
    linking: "Rewrite the student answer and add clear linking words (zuerst, dann, außerdem, deshalb, zum Schluss).",
  };

  return [
    "You are Herr Felix, a German exam coach.",
    `Target level context: ${level}.`,
    modes[mode] || modes["a2-b1"],
    "Return compact XML with <upgrade_de>...</upgrade_de><why_en>...</why_en>.",
    "Keep the upgraded text 2-4 sentences and preserve the student's meaning.",
  ].join(" ");
};


const speechTrainerPrompt = ({ level, note }) =>
  [
    "You are an encouraging German pronunciation coach working from a Whisper transcript.",
    `Aim feedback at CEFR level ${level || "B1"}. Keep the tone warm and concrete.`,
    note ? `The student noted: ${note}.` : "",
    "Return three compact bullets: (1) pronunciation + stress, (2) grammar + vocabulary, (3) one 20-second drill with a short German example.",
    "Stay under 120 words total. If audio seems empty, give a microphone tip instead.",
  ]
    .filter(Boolean)
    .join(" ");

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

async function findStudentByCodeOrEmail({ studentCode, email }) {
  const db = admin.firestore();

  if (studentCode) {
    const normalizedCode = String(studentCode || "").trim();
    const candidates = Array.from(
      new Set([normalizedCode, normalizedCode.toLowerCase(), normalizedCode.toUpperCase()])
    ).filter(Boolean);

    for (const code of candidates) {
      const docRef = db.collection("students").doc(code);
      const docSnap = await docRef.get();
      if (docSnap.exists) return { ref: docRef, snap: docSnap };
    }

    const lookupFields = ["studentCode", "studentcode", "uid"];
    for (const field of lookupFields) {
      const querySnap = await db.collection("students").where(field, "in", candidates).limit(1).get();
      if (!querySnap.empty) {
        const doc = querySnap.docs[0];
        return { ref: doc.ref, snap: doc };
      }
    }
  }

  if (email) {
    const rawEmail = String(email || "").trim();
    const normalizedEmail = rawEmail.toLowerCase();
    const candidates = Array.from(new Set([normalizedEmail, rawEmail])).filter(Boolean);
    const querySnap = await db.collection("students").where("email", "in", candidates).limit(1).get();
    if (!querySnap.empty) {
      const doc = querySnap.docs[0];
      return { ref: doc.ref, snap: doc };
    }
  }

  return null;
}

const normalizeCefrLevel = (rawLevel, fallback = "A1") => {
  const normalizedLevel = String(rawLevel || "")
    .trim()
    .toUpperCase();
  return ["A1", "A2", "B1", "B2", "C1"].includes(normalizedLevel) ? normalizedLevel : fallback;
};

async function resolveStudentLevelForUser({ uid, fallbackLevel = "A1" }) {
  if (!uid) return normalizeCefrLevel(fallbackLevel);
  try {
    const db = admin.firestore();
    const snapshot = await db.collection("students").where("uid", "==", uid).limit(1).get();
    if (snapshot.empty) return normalizeCefrLevel(fallbackLevel);
    const student = snapshot.docs[0]?.data() || {};
    return normalizeCefrLevel(student.level, normalizeCefrLevel(fallbackLevel));
  } catch (error) {
    log.warn("student.level.lookup.failed", { uid, errorMessage: error?.message || "unknown" });
    return normalizeCefrLevel(fallbackLevel);
  }
}

/**
 * =========================
 * PAYSTACK: INITIALIZE
 * =========================
 */
app.post("/paystack/initialize", async (req, res) => {
  const requestLog = createLogger({ scope: "paystack_initialize", requestId: req.requestId });

  try {
    const authedUser = await requireAuthenticatedUser(req, res, { allowGuest: false });
    if (!authedUser) return;

    const secret = process.env.PAYSTACK_SECRET;
    if (!secret) return res.status(500).json({ error: "PAYSTACK_SECRET is missing" });

    const db = getFirestoreSafe();
    if (!db) return res.status(500).json({ error: "Firestore not available" });

    const body = req.body || {};
    const studentCode = String(body.studentCode || body.student_code || body.studentcode || "").trim();
    const redirectUrl = typeof body.redirectUrl === "string" ? body.redirectUrl : "";
    const amountGhs = Number(body.amount);

    if (!studentCode) return res.status(400).json({ error: "Missing studentCode" });
    if (!Number.isFinite(amountGhs) || amountGhs <= 0) return res.status(400).json({ error: "Invalid amount" });

    const studentRef = db.collection("students").doc(studentCode);
    const snap = await studentRef.get();
    if (!snap.exists) return res.status(404).json({ error: "Student not found" });

    const student = snap.data() || {};
    const studentEmail = student?.email ? String(student.email).toLowerCase() : null;
    const authedEmail = authedUser?.email ? String(authedUser.email).toLowerCase() : null;

    // Ownership check: must be same uid OR same email
    if (student?.uid !== authedUser.uid && studentEmail && authedEmail !== studentEmail) {
      return res.status(403).json({ error: "Not authorized for this student" });
    }

    const tuitionFee = Math.max(Number(student.tuitionFee || 0), 0);
    const paidSoFar = Math.max(Number(student.initialPaymentAmount || 0), 0);

    const balanceDue = Number.isFinite(Number(student.balanceDue))
      ? Math.max(Number(student.balanceDue), 0)
      : Math.max(tuitionFee - paidSoFar, 0);

    if (balanceDue <= 0) return res.status(400).json({ error: "No balance due" });

    if (amountGhs > balanceDue * (1 + PAYSTACK_OVERPAY_TOLERANCE_RATE)) {
      return res.status(400).json({ error: "Amount exceeds balance" });
    }

    const amountRounded = Math.round(amountGhs * 100) / 100;

    // Minimum installment unless final balance
    const isFinalPayment = Math.abs(amountRounded - balanceDue) < 0.5;
    if (amountRounded < PAYSTACK_MIN_INSTALLMENT_GHS && !isFinalPayment) {
      return res.status(400).json({
        error: `Minimum payment is GH₵${PAYSTACK_MIN_INSTALLMENT_GHS} (or pay the remaining balance).`,
      });
    }

    const payEmail = studentEmail || authedEmail;
    if (!payEmail) return res.status(400).json({ error: "Missing student email" });

    const metadata = {
      studentCode,
      student_code: studentCode,
      level: student.level || "",
      name: student.name || "",
      phone: student.phone || "",
      emergencyContactPhone: student.emergencyContactPhone || "",
      tuitionFee,
      paidSoFar,
      balanceBefore: balanceDue,
      amountRequested: amountRounded,
      planAfterPayment: paidSoFar + amountRounded >= tuitionFee ? "6-month" : "1-month",
    };

    const custom_fields = [
      { display_name: "Student code", variable_name: "student_code", value: studentCode },
      { display_name: "Paid so far", variable_name: "paid_so_far", value: `GH₵${paidSoFar}` },
      { display_name: "Balance before", variable_name: "balance_before", value: `GH₵${balanceDue}` },
      { display_name: "This payment", variable_name: "payment_now", value: `GH₵${amountRounded}` },
      { display_name: "Plan after payment", variable_name: "plan_after", value: metadata.planAfterPayment },
    ];

    const initializePayload = {
      email: payEmail,
      amount: Math.round(amountRounded * 100), // pesewas
      currency: String(student.tuitionCurrency || DEFAULT_TUITION_CURRENCY).toUpperCase(),
      callback_url: redirectUrl || undefined,
      metadata: { ...metadata, custom_fields },
    };

    const paystackRes = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secret}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(initializePayload),
    });

    const paystackJson = await paystackRes.json().catch(() => ({}));
    if (!paystackRes.ok || !paystackJson?.status) {
      requestLog.error("paystack.initialize.failed", {
        httpStatus: paystackRes.status,
        body: paystackJson,
      });
      return res.status(502).json({
        error: "Failed to initialize Paystack",
        details: paystackJson?.message,
      });
    }

    const authorizationUrl = paystackJson?.data?.authorization_url || "";
    const reference = paystackJson?.data?.reference || "";

    // IMPORTANT: Do NOT store authorization_url (single-use / expires).
    await studentRef.set(
      {
        paymentIntentAmount: amountRounded,
        paystackReference: reference,
        lastPaymentInitAt: admin.firestore.FieldValue.serverTimestamp(),
        updated_at: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    await db.collection("paystackInitRequests").doc(reference || crypto.randomUUID()).set(
      {
        studentCode,
        email: payEmail,
        amount: amountRounded,
        balanceBefore: balanceDue,
        tuitionFee,
        reference,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    );

    // Frontend will redirect to this
    return res.json({ ok: true, authorization_url: authorizationUrl, reference });
  } catch (err) {
    requestLog.error("paystack.initialize.error", { errorMessage: err?.message, stack: err?.stack });
    return res.status(500).json({ error: "Could not initialize payment" });
  }
});

/**
 * =========================
 * PAYSTACK: WEBHOOK
 * =========================
 */
app.post("/paystack/webhook", async (req, res) => {
  let dedupeRef;
  const webhookLog = createLogger({ scope: "paystack_webhook", requestId: req.requestId });

  try {
    const secret = process.env.PAYSTACK_SECRET;
    if (!secret) {
      webhookLog.error("paystack.webhook.missing_secret");
      incrementCounter("webhook_errors", "missing_secret");
      return res.status(500).json({ error: "PAYSTACK_SECRET is missing" });
    }

    const signature = req.headers["x-paystack-signature"];
    if (!signature) {
      incrementCounter("webhook_errors", "missing_signature");
      return res.status(400).json({ error: "Missing Paystack signature" });
    }

    const raw = req.rawBody || Buffer.from(JSON.stringify(req.body || {}));
    const computed = crypto.createHmac("sha512", secret).update(raw).digest("hex");

    // safer compare
    if (!safeEqualHex(computed, signature)) {
      incrementCounter("webhook_errors", "invalid_signature");
      return res.status(401).json({ error: "Invalid signature" });
    }

    const payload = req.body || {};
    const { event, data } = payload;

    if (event !== "charge.success") {
      incrementCounter("webhook_ignored", event || "unknown");
      return res.json({ status: "ignored", event });
    }

    const reference = data?.reference ? String(data.reference) : "";
    if (!reference) return res.status(400).json({ error: "Missing Paystack reference" });

    const payloadHash = crypto.createHash("sha256").update(raw).digest("hex");
    const db = admin.firestore();

    const studentCode =
      data?.metadata?.studentCode ||
      data?.metadata?.student_code ||
      data?.metadata?.studentcode ||
      null;

    const email = data?.customer?.email ? String(data.customer.email).toLowerCase() : "";
    const amountPaid = Number(data?.amount || 0) / 100;

    // Dedup by reference
    dedupeRef = db.collection("paystackWebhookEvents").doc(reference);
    let alreadyProcessed = false;

    await db.runTransaction(async (tx) => {
      const existing = await tx.get(dedupeRef);
      if (existing.exists) {
        alreadyProcessed = true;
        return;
      }

      tx.set(dedupeRef, {
        reference,
        event,
        signature,
        payloadHash,
        studentCode: studentCode || "",
        email,
        amount: amountPaid,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    });

    if (alreadyProcessed) {
      incrementCounter("webhook_duplicates", "paystack");
      return res.json({ status: "duplicate", reference });
    }

    const markRejected = async (reason, extra = {}) => {
      incrementCounter("webhook_rejected", reason);
      webhookLog.warn("paystack.webhook.rejected", { reference, reason, ...extra });

      await dedupeRef.set(
        {
          status: "rejected",
          reason,
          handledAt: admin.firestore.FieldValue.serverTimestamp(),
          ...extra,
        },
        { merge: true }
      );

      return res.status(202).json({ status: "rejected", reason });
    };

    const match = await findStudentByCodeOrEmail({ studentCode, email });

    if (!match) {
      webhookLog.warn("paystack.webhook.no_match", { studentCode, email });
      incrementCounter("webhook_no_match", "paystack");

      await dedupeRef.set(
        { status: "no-match", handledAt: admin.firestore.FieldValue.serverTimestamp() },
        { merge: true }
      );

      return res.status(202).json({ status: "no-match" });
    }

    const { ref, snap } = match;
    const studentData = snap.data() || {};

    const priorPaid = Number(studentData.initialPaymentAmount || 0);
    const tuitionFee = Number(studentData.tuitionFee || 0);

    const priorBalanceDue = Number.isFinite(Number(studentData.balanceDue))
      ? Math.max(Number(studentData.balanceDue), 0)
      : tuitionFee
        ? Math.max(tuitionFee - Math.max(priorPaid, 0), 0)
        : 0;

    const expectedCurrency = String(studentData.tuitionCurrency || DEFAULT_TUITION_CURRENCY).toUpperCase();
    const payloadCurrency = String(data?.currency || "").toUpperCase();

    const paidAtRaw =
      data?.paid_at ||
      data?.paidAt ||
      data?.transaction_date ||
      data?.created_at ||
      data?.createdAt;

    const paidAtMs = paidAtRaw ? Date.parse(paidAtRaw) : NaN;

    if (!payloadCurrency || payloadCurrency !== expectedCurrency) {
      return markRejected("currency_mismatch", { payloadCurrency, expectedCurrency });
    }

    if (!Number.isFinite(amountPaid) || amountPaid < PAYSTACK_MIN_PAYMENT_FLOOR) {
      return markRejected("invalid_amount", { amountPaid });
    }

    // Minimum installment unless final balance
    const isFinalPayment = priorBalanceDue > 0 && Math.abs(amountPaid - priorBalanceDue) < 0.5;
    if (amountPaid < PAYSTACK_MIN_INSTALLMENT_GHS && !isFinalPayment) {
      return markRejected("below_min_installment", { amountPaid, priorBalanceDue });
    }

    if (!Number.isFinite(paidAtMs)) {
      return markRejected("missing_timestamp", { paidAtRaw });
    }

    const ageMinutes = (Date.now() - paidAtMs) / (1000 * 60);
    if (ageMinutes > PAYSTACK_MAX_EVENT_AGE_MINUTES) {
      return markRejected("stale_event", { ageMinutes, paidAtRaw });
    }

    const projectedPaid = priorPaid + amountPaid;

    if (tuitionFee > 0) {
      const allowedCeiling = tuitionFee * (1 + PAYSTACK_OVERPAY_TOLERANCE_RATE);
      if (projectedPaid > allowedCeiling) {
        return markRejected("overpay_exceeds_tolerance", {
          projectedPaid,
          tuitionFee,
          allowedCeiling,
        });
      }
    }

    const totalPaid = projectedPaid;
    const balanceDue = tuitionFee ? Math.max(tuitionFee - totalPaid, 0) : null;
    const paymentStatus = tuitionFee && totalPaid < tuitionFee ? "partial" : "paid";

    /**
     * Contract rule:
     * - Any successful partial payment grants at least 1-month access.
     * - Fully clearing tuition grants 6-month access.
     *
     * Merge rule for level-up during active contract:
     * - If contractMergeMode === "append_after_active_contract", start the new contract
     *   at upgradeCarryoverUntil (or current contract end) so the learner does not lose time.
     */
    const now = new Date();

    const existingStart = studentData.contractStart ? new Date(studentData.contractStart) : null;
    const existingEnd = studentData.contractEnd ? new Date(studentData.contractEnd) : null;
    const carryoverUntil = studentData.upgradeCarryoverUntil
      ? new Date(studentData.upgradeCarryoverUntil)
      : null;

    const startIsValid = existingStart && !Number.isNaN(existingStart.getTime());
    const endIsValid = existingEnd && !Number.isNaN(existingEnd.getTime());
    const carryoverIsValid = carryoverUntil && !Number.isNaN(carryoverUntil.getTime());

    const contractWasActive = endIsValid && existingEnd > now;
    const mergeMode = String(studentData.contractMergeMode || "").toLowerCase();
    const shouldAppendAfterActiveContract =
      mergeMode === "append_after_active_contract" && (contractWasActive || carryoverIsValid);

    const targetMonths = paymentStatus === "paid" ? 6 : 1;
    const currentMonths = Number(studentData.contractTermMonths || 0);

    let contractStartDate;
    let finalMonths;
    let contractEndDate;

    if (shouldAppendAfterActiveContract) {
      const appendStartCandidate = [carryoverIsValid ? carryoverUntil : null, endIsValid ? existingEnd : null]
        .filter(Boolean)
        .sort((a, b) => b.getTime() - a.getTime())[0];

      contractStartDate = appendStartCandidate && appendStartCandidate > now ? appendStartCandidate : now;
      finalMonths = targetMonths;
      contractEndDate = addMonths(contractStartDate, finalMonths);
    } else {
      contractStartDate = contractWasActive && startIsValid ? existingStart : now;

      // Keep the bigger access (never reduce)
      finalMonths = Math.max(currentMonths, targetMonths);

      const proposedEnd = addMonths(contractStartDate, finalMonths);

      // If they already had a later end date, preserve it
      contractEndDate = endIsValid && existingEnd > proposedEnd ? existingEnd : proposedEnd;
    }

    const queuedUpgradeLevel = String(studentData.upgradeToLevel || "").toUpperCase();
    const hasQueuedUpgrade = Boolean(queuedUpgradeLevel);
    const shouldApplyQueuedUpgrade = hasQueuedUpgrade && paymentStatus === "paid";

    const updates = {
      initialPaymentAmount: totalPaid,
      balanceDue,
      paymentStatus,
      contractStart: contractStartDate.toISOString(),
      contractEnd: contractEndDate ? contractEndDate.toISOString() : "",
      contractTermMonths: finalMonths,
      status: "Active",
      paystackReference: data?.reference || studentData.paystackReference || "",
      level: shouldApplyQueuedUpgrade ? queuedUpgradeLevel : studentData.level,
      className: shouldApplyQueuedUpgrade ? "" : studentData.className,
      // clear one-time level-up queue fields only when fully paid.
      contractMergeMode: shouldApplyQueuedUpgrade ? "" : studentData.contractMergeMode || "",
      upgradeCarryoverUntil: shouldApplyQueuedUpgrade ? "" : studentData.upgradeCarryoverUntil || "",
      upgradeFromLevel: shouldApplyQueuedUpgrade ? "" : studentData.upgradeFromLevel || "",
      upgradeToLevel: shouldApplyQueuedUpgrade ? "" : studentData.upgradeToLevel || "",
      upgradeQueuedAt: shouldApplyQueuedUpgrade ? "" : studentData.upgradeQueuedAt || "",
      upgradeSnapshot: shouldApplyQueuedUpgrade ? admin.firestore.FieldValue.delete() : studentData.upgradeSnapshot || null,
      updated_at: admin.firestore.FieldValue.serverTimestamp(),
    };

    await ref.set(updates, { merge: true });

    const mergedStudent = { ...studentData, ...updates };
    await appendStudentToStudentsSheetSafely(mergedStudent);

    await dedupeRef.set(
      {
        status: "handled",
        handledAt: admin.firestore.FieldValue.serverTimestamp(),
        studentId: ref.id,
        paymentStatus,
        balanceDue,
        contractTermMonths: finalMonths,
      },
      { merge: true }
    );

    incrementCounter("webhook_handled", paymentStatus || "handled");
    webhookLog.info("paystack.webhook.success", {
      reference,
      studentId: ref.id,
      paymentStatus,
      balanceDue,
      contractTermMonths: finalMonths,
    });

    return res.json({ status: "synced", paymentStatus, balanceDue, contractTermMonths: finalMonths });
  } catch (err) {
    incrementCounter("webhook_errors", "processing_error");
    webhookLog.error("paystack.webhook.error", {
      errorMessage: err?.message || "unknown",
      stack: err?.stack,
    });

    try {
      if (dedupeRef) {
        await dedupeRef.set(
          {
            status: "error",
            errorMessage: err?.message || "unknown",
            handledAt: admin.firestore.FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      }
    } catch (dedupeErr) {
      console.warn("Failed to update dedupe record", dedupeErr?.message || dedupeErr);
    }

    return res.status(500).json({ error: "Failed to process webhook" });
  }
});


const buildImprovedDraftContext = ({ latestDraftText, latestFeedback, revisedDraftText }) => {
  const parts = ["Current draft to mark:", revisedDraftText];

  if (latestDraftText) {
    parts.push("", "Previous draft:", latestDraftText);
  }

  if (latestFeedback) {
    parts.push("", "Previous AI feedback:", latestFeedback);
  }

  return parts.join("\n");
};

const parseJSONResponse = (raw = "", fallback = {}) => {
  const text = String(raw || "").trim();
  if (!text) return fallback;

  try {
    return JSON.parse(text);
  } catch (err) {
    const start = text.indexOf("{");
    const end = text.lastIndexOf("}");
    if (start < 0 || end <= start) return fallback;
    try {
      return JSON.parse(text.slice(start, end + 1));
    } catch (innerErr) {
      return fallback;
    }
  }
};

const getDominanceAlert = ({ distribution = {}, total = 0, level = "A1", promptType = "unknown" }) => {
  if (!total) return null;
  const entries = Object.entries(distribution);
  if (!entries.length) return null;
  const [score, count] = entries.sort((a, b) => Number(b[1]) - Number(a[1]))[0];
  const ratio = count / total;
  if (ratio < 0.6 || total < 20) return null;
  return {
    level,
    promptType,
    dominantScore: Number(score),
    ratio: Number(ratio.toFixed(3)),
    total,
  };
};

const clampNumber = (value, min, max) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return min;
  return Math.min(max, Math.max(min, numeric));
};

const extractWritingScoreFromText = (raw = "") => {
  const text = String(raw || "");
  const patterns = [
    /score\s*:\s*(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/i,
    /score\s*:\s*(\d+(?:\.\d+)?)\s*\//i,
    /(\d+(?:\.\d+)?)\s*out\s+of\s+(\d+(?:\.\d+)?)/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (!match) continue;
    const score = Number(match[1]);
    const max = match[2] ? Number(match[2]) : 25;
    if (Number.isFinite(score) && Number.isFinite(max) && max > 0) {
      return Math.round(clampNumber((score / max) * 25, 0, 25));
    }
  }

  return null;
};

const normalizeShortStringArray = (value = [], limit = 5) =>
  (Array.isArray(value) ? value : [])
    .map((item) => String(item || "").trim())
    .filter(Boolean)
    .slice(0, limit);

const sanitizeWritingCorrections = (value = []) => {
  if (!Array.isArray(value)) return [];
  const seen = new Set();
  return value
    .map((item) => {
      const wrong = String(item?.wrong || "").trim();
      const correct = String(item?.correct || "").trim();
      const category = String(item?.category || "").trim();
      const reason = String(item?.reason || "").trim();
      return { wrong, correct, category, reason };
    })
    .filter((item) => item.wrong && item.correct)
    .filter((item) => item.wrong.toLocaleLowerCase() !== item.correct.toLocaleLowerCase())
    .filter((item) => {
      const key = `${item.wrong.toLocaleLowerCase()}->${item.correct.toLocaleLowerCase()}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .filter((item) => {
      const wrong = item.wrong.replace(/[.!?]+$/g, "").trim().toLocaleLowerCase();
      const correct = item.correct.replace(/[.!?]+$/g, "").trim().toLocaleLowerCase();
      if (wrong === correct) return false;
      if (wrong === "ich sehe fern" && correct === "ich sehe fern") return false;
      return true;
    })
    .slice(0, 5);
};

const rubricCriterionFromScore = (score) => clampNumber(Math.round(Number(score || 0) / 5), 0, 5);

const normalizeWritingInsights = ({ parsed = {}, feedback = "", promptType = "unknown", source = "backend" }) => {
  const extractedScore = extractWritingScoreFromText(feedback);
  const parsedScore = Number.isFinite(Number(parsed?.score)) ? Number(parsed.score) : null;
  const rubricScore = Number.isFinite(Number(parsed?.rubric?.overall)) ? Number(parsed.rubric.overall) : null;
  const scoreCandidate = parsedScore > 0 ? parsedScore : (rubricScore > 0 ? rubricScore : (extractedScore ?? parsedScore ?? rubricScore ?? 0));
  const score = Math.round(clampNumber(scoreCandidate, 0, 25));
  const fallbackCriterion = rubricCriterionFromScore(score);
  const rubric = {
    task: Math.round(clampNumber(parsed?.rubric?.task ?? fallbackCriterion, 0, 5)),
    coherence: Math.round(clampNumber(parsed?.rubric?.coherence ?? fallbackCriterion, 0, 5)),
    grammar: Math.round(clampNumber(parsed?.rubric?.grammar ?? fallbackCriterion, 0, 5)),
    lexis: Math.round(clampNumber(parsed?.rubric?.lexis ?? fallbackCriterion, 0, 5)),
    overall: score,
    maxScore: 25,
    source,
  };
  const strengths = normalizeShortStringArray(parsed?.strengths, 5);
  const mainIssues = normalizeShortStringArray(parsed?.mainIssues, 5);
  const nextTask = String(parsed?.nextTask || parsed?.simplifiedFeedback?.nextAction || "Fix the top mistakes and submit one improved draft.").trim();
  const corrections = sanitizeWritingCorrections(parsed?.corrections);

  return {
    score,
    maxScore: 25,
    rubric,
    summary: String(parsed?.summary || "").trim(),
    strengths,
    mainIssues,
    corrections,
    improvedVersion: String(parsed?.improvedVersion || "").trim(),
    nextTask,
    simplifiedFeedback: {
      topFixes: corrections.map((item) => `${item.wrong} → ${item.correct}${item.reason ? ` — ${item.reason}` : ""}`),
      strengths,
      nextAction: nextTask,
    },
    trend: parsed?.trend || null,
    promptType: parsed?.promptType || promptType,
    feedbackBody: String(feedback || ""),
  };
};

const buildFallbackWritingInsights = ({ feedback = "", estimatedScore = null, promptType = "unknown" }) => {
  const score = estimatedScore ?? extractWritingScoreFromText(feedback) ?? 0;
  return normalizeWritingInsights({
    parsed: {
      score,
      summary: score > 0 ? `Score extracted from feedback: ${score}/25.` : "Feedback could not be parsed safely.",
      strengths: [],
      mainIssues: [],
      corrections: [],
      nextTask: "Fix the top mistakes and submit one improved draft.",
    },
    feedback,
    promptType,
    source: "heuristic",
  });
};

const deriveWritingInsights = async ({ feedback, promptType = "unknown" }) => {
  const fallback = buildFallbackWritingInsights({ feedback, promptType });
  try {
    const parsed = parseJSONResponse(feedback, null);
    if (!parsed || typeof parsed !== "object") {
      return fallback;
    }
    return normalizeWritingInsights({ parsed, feedback, promptType, source: "backend" });
  } catch (error) {
    console.warn("Failed to derive writing insights", error?.message || error);
    return fallback;
  }
};

const loadLatestCampusMarkContext = async ({ db, uid }) => {
  if (!db || !uid) return { latestDraftText: "", latestFeedback: "" };

  try {
    const snap = await db
      .collection("writingSubmissions")
      .where("uid", "==", uid)
      .where("submissionContext", "in", ["campus-mark", "campus-improved"])
      .orderBy("createdAt", "desc")
      .limit(1)
      .get();

    if (snap.empty) {
      return { latestDraftText: "", latestFeedback: "" };
    }

    const data = snap.docs[0].data() || {};
    return {
      latestDraftText: String(data.text || "").trim(),
      latestFeedback: String(data.feedback || "").trim(),
    };
  } catch (error) {
    console.warn("Failed to load latest campus mark context", error?.message || error);
    return { latestDraftText: "", latestFeedback: "" };
  }
};

/**
 * =========================
 * AI / WRITING ROUTES
 * =========================
 */
app.post("/writing/ideas", async (req, res) => {
  try {
    if (!ensureOpenAIConfigured(res)) return;

    const { level = "A2", messages = [], program } = req.body || {};
    const systemPrompt = getWritingIdeasPrompt({ level, program });

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
    const {
      text,
      level = "A2",
      studentName = "Student",
      program,
      submissionContext,
      promptType = "letter",
      previousText,
      previousFeedback,
    } = req.body || {};

    if (!text || !String(text).trim()) {
      return res.status(400).json({ error: "Letter text is required" });
    }

    if (!ensureOpenAIConfigured(res)) return;

    const authedUser = await requireAuthenticatedUser(req, res, { allowGuest: true });
    if (!authedUser) return;

    const db = getFirestoreSafe();
    const trimmedText = String(text).trim();
    const trimmedPreviousText = String(previousText || "").trim();
    const trimmedPreviousFeedback = String(previousFeedback || "").trim();

    let latestDraftText = trimmedPreviousText;
    let latestFeedback = trimmedPreviousFeedback;

    if (submissionContext === "campus-improved" && (!latestDraftText || !latestFeedback)) {
      const loaded = await loadLatestCampusMarkContext({ db, uid: authedUser.uid });
      latestDraftText = latestDraftText || loaded.latestDraftText;
      latestFeedback = latestFeedback || loaded.latestFeedback;
    }

    const userContent =
      submissionContext === "campus-improved"
        ? buildImprovedDraftContext({
            latestDraftText,
            latestFeedback,
            revisedDraftText: trimmedText,
          })
        : trimmedText;

    const systemPrompt = markPrompt({ schreibenLevel: level, studentName, program, submissionContext });
    const messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: userContent },
    ];

    const feedback = await createChatCompletion(messages, { temperature: 0.1, max_tokens: 1200 });
    const writingInsights = await deriveWritingInsights({
      feedback,
      draftText: trimmedText,
      level,
      firstDraft: submissionContext === "campus-improved" ? latestDraftText : "",
      promptType,
    });

    let submissionSaved = false;
    let submissionId = null;

    if (db) {
      let scoreAlertTriggered = false;
      const docRef = await db.collection("writingSubmissions").add({
        uid: authedUser.uid || null,
        email: authedUser.email ? String(authedUser.email).toLowerCase() : null,
        studentName,
        level,
        program: program || null,
        submissionContext: submissionContext || null,
        promptType: promptType || "letter",
        text: trimmedText,
        feedback,
        score: writingInsights?.score ?? writingInsights?.rubric?.overall ?? 0,
        maxScore: 25,
        rubric: writingInsights?.rubric || null,
        corrections: writingInsights?.corrections || [],
        structuredFeedback: writingInsights || null,
        source: "mark-tab",
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      submissionSaved = true;
      submissionId = docRef.id;

      const overallScore = Number(writingInsights?.rubric?.overall || 0);
      const statsRef = db.collection("writingScoreStats").doc(`${String(level || "A1").toUpperCase()}_${String(promptType || "unknown").toLowerCase()}`);
      await db.runTransaction(async (tx) => {
        const snap = await tx.get(statsRef);
        const current = snap.exists ? snap.data() || {} : {};
        const distribution = { ...(current.distribution || {}) };
        distribution[overallScore] = Number(distribution[overallScore] || 0) + 1;
        const total = Number(current.total || 0) + 1;
        const alert = getDominanceAlert({ distribution, total, level, promptType });
        if (alert) {
          scoreAlertTriggered = true;
        }
        tx.set(
          statsRef,
          {
            level: String(level || "A1").toUpperCase(),
            promptType: String(promptType || "unknown").toLowerCase(),
            total,
            distribution,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            lastAlert: alert
              ? {
                  ...alert,
                  createdAt: admin.firestore.FieldValue.serverTimestamp(),
                }
              : null,
          },
          { merge: true }
        );
      });
      if (scoreAlertTriggered) {
        incrementCounter("writing_score_alert", `${String(level || "A1").toUpperCase()}_${String(promptType || "unknown").toLowerCase()}`);
      }

    }

    await auditAIRequest({
      route: "/writing/mark",
      uid: authedUser.uid,
      email: authedUser.email,
      success: true,
      metadata: {
        level,
        program: program || null,
        submissionSaved,
        submissionId,
      },
    });

    res.json({
      feedback,
      score: writingInsights?.score ?? writingInsights?.rubric?.overall ?? 0,
      maxScore: 25,
      rubric: writingInsights?.rubric || null,
      summary: writingInsights?.summary || "",
      strengths: writingInsights?.strengths || [],
      mainIssues: writingInsights?.mainIssues || [],
      corrections: writingInsights?.corrections || [],
      improvedVersion: writingInsights?.improvedVersion || "",
      nextTask: writingInsights?.nextTask || "",
      structuredFeedback: writingInsights || null,
      simplifiedFeedback: writingInsights?.simplifiedFeedback || null,
      trend: writingInsights?.trend || null,
      submissionSaved,
      submissionId,
    });
  } catch (err) {
    console.error("/writing/mark error", err);
    res.status(500).json({ error: err.message || "Failed to mark letter" });
  }
});

app.post("/discussion/correct", async (req, res) => {
  try {
    const { text, level = "A2" } = req.body || {};
    const input = String(text || "").trim();

    if (!input) return res.status(400).json({ error: "Text is required for correction" });

    if (!ensureOpenAIConfigured(res)) return;

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

app.post("/profile/biography/correct", async (req, res) => {
  try {
    const { text, level = "A2" } = req.body || {};
    const input = String(text || "").trim();

    if (!input) return res.status(400).json({ error: "Biography text is required" });

    if (!ensureOpenAIConfigured(res)) return;

    const messages = [
      {
        role: "system",
        content:
          "You polish short first-person biographies for classmates. " +
          "Keep the voice friendly, 3-4 sentences, and simple for German learners. " +
          `Target level: ${level}. Return only the improved biography text.`,
      },
      { role: "user", content: input },
    ];

    const corrected = await createChatCompletion(messages, { temperature: 0.25, max_tokens: 220 });
    return res.json({ corrected });
  } catch (err) {
    console.error("/profile/biography/correct error", err);
    return res.status(500).json({ error: err.message || "Failed to polish biography" });
  }
});

app.post("/grammar/ask", async (req, res) => {
  let authedUser;
  try {
    authedUser = await requireAuthenticatedUser(req, res);
    if (!authedUser) return;

    const {
      question,
      cleanedPrompt,
      level = "A2",
      studentId,
      program,
      responseLanguage = "de_only",
      responseMode = "short_exam",
      promptTemplate = "",
    } = req.body || {};
    const trimmedQuestion = String(question || "").trim();
    const trimmedCleanedPrompt = String(cleanedPrompt || "").trim();
    const trimmedStudentId = typeof studentId === "string" ? studentId.trim() : "";

    const validationError =
      validateString(trimmedQuestion, { required: true, maxLength: 400, label: "question" }) ||
      validateString(trimmedCleanedPrompt, { maxLength: 500, label: "cleanedPrompt" }) ||
      validateString(level, { maxLength: 10, label: "level" });

    if (validationError) return res.status(400).json({ error: validationError });
    if (!ensureOpenAIConfigured(res)) return;

    const quota = await enforceUserQuota({
      uid: authedUser.uid,
      category: "grammar",
      limit: DAILY_LIMITS.grammar,
    });

    if (!quota.allowed) {
      log.warn("quota.blocked", { route: "/grammar/ask", uid: authedUser.uid, category: "grammar" });
      return res.status(429).json({ error: "Daily grammar question limit reached" });
    }

    const validLanguageModes = ["de_only", "de_gloss", "en_support"];
    const validResponseModes = ["short_exam", "detailed", "correction_only"];
    const selectedResponseLanguage = validLanguageModes.includes(responseLanguage)
      ? responseLanguage
      : "de_only";
    const selectedResponseMode = validResponseModes.includes(responseMode)
      ? responseMode
      : "short_exam";

    const finalQuestion = trimmedCleanedPrompt || trimmedQuestion;

    const messages = [
      {
        role: "system",
        content: grammarPrompt({
          level,
          program,
          responseLanguage: selectedResponseLanguage,
          responseMode: selectedResponseMode,
        }),
      },
      { role: "user", content: finalQuestion },
    ];

    const answer = await createChatCompletion(messages, { temperature: 0.35, max_tokens: 450 });

    const db = getFirestoreSafe();
    const logEntry = {
      question: trimmedQuestion,
      cleanedPrompt: finalQuestion,
      level,
      responseLanguage: selectedResponseLanguage,
      responseMode: selectedResponseMode,
      promptTemplate: String(promptTemplate || "").trim(),
      source: "grammar-tab",
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    if (trimmedStudentId) logEntry.studentId = trimmedStudentId;
    if (authedUser?.uid) logEntry.uid = authedUser.uid;
    if (authedUser?.email) logEntry.email = String(authedUser.email).toLowerCase();

    if (db) {
      db.collection("grammarQuestions")
        .add(logEntry)
        .catch((logErr) => console.warn("Failed to log grammar question", logErr));
    }

    auditAIRequest({
      route: "/grammar/ask",
      uid: authedUser.uid,
      email: authedUser.email,
      metadata: {
        level,
        studentId: trimmedStudentId,
        quotaRemaining: quota.remaining,
        responseLanguage: selectedResponseLanguage,
        responseMode: selectedResponseMode,
      },
    });

    return res.json({
      answer,
      cleanedPrompt: finalQuestion,
      responseLanguage: selectedResponseLanguage,
      responseMode: selectedResponseMode,
      quotaRemaining: quota.remaining,
    });
  } catch (err) {
    console.error("/grammar/ask error", err);
    auditAIRequest({
      route: "/grammar/ask",
      uid: authedUser?.uid,
      email: authedUser?.email,
      success: false,
    });
    return res.status(500).json({ error: err.message || "Failed to answer grammar question" });
  }
});

app.get("/student", async (req, res) => {
  try {
    const authedUser = await requireAuthenticatedUser(req, res, { allowGuest: false });
    if (!authedUser) return;

    const studentCode = String(req.query.studentCode || "").trim();
    if (!studentCode) return res.status(400).json({ error: "studentCode is required" });

    const doc = await admin.firestore().collection("students").doc(studentCode).get();
    if (!doc.exists) return res.status(404).json({ error: "Student not found" });

    const student = doc.data() || {};
    const { password: _hiddenPassword, ...safeStudent } = student;

    return res.json({ id: doc.id, ...safeStudent });
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

    if (!snapshot || !snapshot.exists) return res.status(404).json({ error: "Student not found" });

    const student = snapshot.data() || {};
    const hashedPassword = student.password;

    if (!hashedPassword) {
      return res.status(400).json({ error: "Account has no password; please contact support." });
    }

    const isValid = await bcrypt.compare(providedPassword, hashedPassword);
    if (!isValid) return res.status(401).json({ error: "Invalid credentials" });

    const { password: _hiddenPassword, ...studentSafe } = student;
    return res.json({ id: snapshot.id, ...studentSafe });
  } catch (e) {
    console.error("/legacy/login error", e);
    return res.status(500).json({ error: "Failed to authenticate student" });
  }
});

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

// --- Results history from published sheet (filtered per student) ---
const normalizeHeaderKey = (header = "") =>
  String(header || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "")
    .replace(/[()]/g, "");

const parseCsv = (text) => {
  const rows = [];
  let currentCell = "";
  let currentRow = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === "\"") {
      if (inQuotes && next === "\"") {
        currentCell += "\"";
        i += 1;
        continue;
      }
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      currentRow.push(currentCell);
      currentCell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      currentRow.push(currentCell);
      rows.push(currentRow);
      currentRow = [];
      currentCell = "";
      continue;
    }

    currentCell += char;
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell);
    rows.push(currentRow);
  }

  return rows
    .map((row) => row.map((cell) => String(cell || "").trim()))
    .filter((row) => row.some((cell) => cell.length > 0));
};

const findIndexByHeader = (headers, candidates) => {
  const normalizedHeaders = headers.map(normalizeHeaderKey);
  const normalizedCandidates = candidates.map(normalizeHeaderKey);
  return normalizedHeaders.findIndex((h) => normalizedCandidates.includes(h));
};

const safeLower = (v) => String(v || "").trim().toLowerCase();

app.get("/results/history", async (req, res) => {
  const requestLog = createLogger({ scope: "results_history", requestId: req.requestId });

  try {
    const authedUser = await requireAuthenticatedUser(req, res, { allowGuest: false });
    if (!authedUser) return;

    const publishedCsvUrl = process.env.RESULTS_SHEET_PUBLISHED_CSV_URL;
    if (!publishedCsvUrl) {
      return res.status(500).json({ error: "RESULTS_SHEET_PUBLISHED_CSV_URL is missing" });
    }

    const requestedStudentCode = String(req.query.studentCode || "").trim();
    if (!requestedStudentCode) {
      return res.status(400).json({ error: "studentCode is required" });
    }

    // Ownership check: caller must match student by uid or email
    const db = getFirestoreSafe();
    if (!db) return res.status(500).json({ error: "Firestore not available" });

    const studentRef = db.collection("students").doc(requestedStudentCode);
    const snap = await studentRef.get();
    if (!snap.exists) return res.status(404).json({ error: "Student not found" });

    const student = snap.data() || {};
    const studentEmail = student?.email ? String(student.email).toLowerCase() : null;
    const authedEmail = authedUser?.email ? String(authedUser.email).toLowerCase() : null;

    if (student?.uid !== authedUser.uid && studentEmail && authedEmail !== studentEmail) {
      return res.status(403).json({ error: "Not authorized for this student" });
    }

    // Fetch the published CSV server-side (students will not see the URL)
    const csvRes = await fetch(publishedCsvUrl, { method: "GET" });
    if (!csvRes.ok) {
      requestLog.error("results.sheet.fetch_failed", { status: csvRes.status });
      return res.status(502).json({ error: "Failed to fetch results sheet" });
    }

    const csvText = await csvRes.text();
    const rows = parseCsv(csvText);
    if (!rows.length) return res.json({ studentCode: requestedStudentCode, rows: [] });

    const headerRow = rows[0];

    const idx = {
      assignment: findIndexByHeader(headerRow, ["assignment", "task", "title"]),
      level: findIndexByHeader(headerRow, ["level", "cefr", "lvl"]),
      name: findIndexByHeader(headerRow, ["name"]),
      studentcode: findIndexByHeader(headerRow, ["studentcode", "student code"]),
      uid: findIndexByHeader(headerRow, ["uid"]),
      email: findIndexByHeader(headerRow, ["email"]),
      score: findIndexByHeader(headerRow, ["score", "mark", "marks"]),
      comments: findIndexByHeader(headerRow, ["comments", "feedback", "comment"]),
      link: findIndexByHeader(headerRow, ["link", "url"]),
      date: findIndexByHeader(headerRow, ["date", "createdat", "created_at", "timestamp", "time"]),
    };

    const get = (row, i) => (i >= 0 && i < row.length ? String(row[i] || "").trim() : "");

    const targetCode = requestedStudentCode;
    const targetUid = String(student?.uid || "").trim();
    const targetEmail = String(student?.email || "").trim();

    const filtered = rows.slice(1).filter((row) => {
      const rowCode = get(row, idx.studentcode);
      const rowUid = get(row, idx.uid);
      const rowEmail = get(row, idx.email);

      if (rowCode && rowCode.trim() === targetCode) return true;
      if (rowUid && targetUid && rowUid.trim() === targetUid) return true;
      if (rowEmail && targetEmail && safeLower(rowEmail) === safeLower(targetEmail)) return true;

      return false;
    });

    const mapped = filtered.map((row, n) => ({
      id: `${targetCode}-${n + 1}`,
      assignment: get(row, idx.assignment) || "Feedback",
      level: get(row, idx.level) || "",
      name: get(row, idx.name) || "",
      studentcode: get(row, idx.studentcode) || targetCode,
      score: get(row, idx.score) || "",
      comments: get(row, idx.comments) || "",
      link: get(row, idx.link) || "",
      date: get(row, idx.date) || "",
    }));

    return res.json({ studentCode: requestedStudentCode, rows: mapped });
  } catch (err) {
    requestLog.error("results.history.error", { errorMessage: err?.message, stack: err?.stack });
    return res.status(500).json({ error: "Failed to load results history" });
  }
});

app.post("/speaking/analyze", audioUpload, async (req, res) => {
  let authedUser;
  try {
    authedUser = await requireAuthenticatedUser(req, res);
    if (!authedUser) return;

    const { teil, level = "A2", contextType, question, interactionMode, userId = "guest", audioUrl = "" } = req.body || {};

    const validationError =
      validateString(teil, { maxLength: 20, label: "teil" }) ||
      validateString(level, { maxLength: 10, label: "level" }) ||
      validateString(contextType, { maxLength: 60, label: "context" }) ||
      validateString(question, { maxLength: 400, label: "question" }) ||
      validateString(audioUrl, { maxLength: 3000, label: "audioUrl" });

    if (validationError) return res.status(400).json({ error: validationError });
    if (!ensureOpenAIConfigured(res)) return;

    const quota = await enforceUserQuota({ uid: authedUser.uid, category: "speaking", limit: DAILY_LIMITS.speaking });
    if (!quota.allowed) {
      log.warn("quota.blocked", { route: "/speaking/analyze", uid: authedUser.uid, category: "speaking" });
      return res.status(429).json({ error: "Daily speaking analysis limit reached" });
    }

    let audioFile = req.file;
    if (!audioFile && audioUrl) {
      audioFile = await downloadAudioFromUrl(audioUrl);
    }

    if (!audioFile) return res.status(400).json({ error: "Audio file is required" });

    const transcript = ((await transcribeAudio(audioFile)) || "").slice(0, 1800);
    if (!transcript) return res.status(500).json({ error: "Could not transcribe audio" });

    const messages = [
      { role: "system", content: speakingPrompt({ teil, level, contextType, question, interactionMode }) },
      { role: "user", content: `User ${authedUser.uid || userId} speaking sample transcript: ${transcript}` },
    ];

    const feedback = await createChatCompletion(messages, { temperature: 0.35, max_tokens: 500 });

    auditAIRequest({
      route: "/speaking/analyze",
      uid: authedUser.uid,
      email: authedUser.email,
      metadata: {
        teil,
        level,
        quotaRemaining: quota.remaining,
        audioSource: req.file ? "multipart" : audioUrl ? "firebase_url" : "none",
      },
    });

    return res.json({ transcript, feedback, quotaRemaining: quota.remaining });
  } catch (err) {
    console.error("/speaking/analyze error", err);
    auditAIRequest({ route: "/speaking/analyze", uid: authedUser?.uid, email: authedUser?.email, success: false });
    return res.status(500).json({ error: err.message || "Failed to analyze speaking" });
  }
});

app.post("/speaking/analyze-text", async (req, res) => {
  let authedUser;
  try {
    authedUser = await requireAuthenticatedUser(req, res);
    if (!authedUser) return;

    const { text, teil, level = "A2", targetLevel, question, userId = "guest" } = req.body || {};
    const trimmed = String(text || "").trim();

    const validationError =
      validateString(trimmed, { required: true, maxLength: 2000, label: "transcript" }) ||
      validateString(teil, { maxLength: 20, label: "teil" }) ||
      validateString(level, { maxLength: 10, label: "level" }) ||
      validateString(targetLevel, { maxLength: 10, label: "targetLevel" }) ||
      validateString(question, { maxLength: 500, label: "question" });

    if (validationError) return res.status(400).json({ error: validationError });
    if (!ensureOpenAIConfigured(res)) return;

    const quota = await enforceUserQuota({ uid: authedUser.uid, category: "speaking", limit: DAILY_LIMITS.speaking });
    if (!quota.allowed) {
      log.warn("quota.blocked", { route: "/speaking/analyze-text", uid: authedUser.uid, category: "speaking" });
      return res.status(429).json({ error: "Daily speaking analysis limit reached" });
    }

    const messages = [
      { role: "system", content: speakingPrompt({ teil, level: targetLevel || level, question }) },
      { role: "user", content: `User ${authedUser.uid || userId} transcript: ${trimmed}` },
    ];

    const feedback = await createChatCompletion(messages, { temperature: 0.35, max_tokens: 500 });

    auditAIRequest({
      route: "/speaking/analyze-text",
      uid: authedUser.uid,
      email: authedUser.email,
      metadata: { teil, level, targetLevel, hasQuestion: Boolean(question), quotaRemaining: quota.remaining },
    });

    return res.json({ feedback, quotaRemaining: quota.remaining });
  } catch (err) {
    console.error("/speaking/analyze-text error", err);
    auditAIRequest({ route: "/speaking/analyze-text", uid: authedUser?.uid, email: authedUser?.email, success: false });
    return res.status(500).json({ error: err.message || "Failed to analyze text" });
  }
});

app.post("/speaking/interaction-score", audioUpload, async (req, res) => {
  let authedUser;
  try {
    authedUser = await requireAuthenticatedUser(req, res);
    if (!authedUser) return;

    const { initialTranscript, followUpQuestion, teil, level = "A2", targetLevel, userId = "guest" } = req.body || {};
    let transcript = String(initialTranscript || "").trim();

    if (!transcript && req.file) transcript = (await transcribeAudio(req.file)) || "";

    const validationError =
      validateString(transcript, { required: true, maxLength: 1800, label: "transcript" }) ||
      validateString(followUpQuestion, { maxLength: 400, label: "followUpQuestion" }) ||
      validateString(teil, { maxLength: 20, label: "teil" }) ||
      validateString(level, { maxLength: 10, label: "level" }) ||
      validateString(targetLevel, { maxLength: 10, label: "targetLevel" });

    if (validationError) return res.status(400).json({ error: validationError });
    if (!ensureOpenAIConfigured(res)) return;

    const quota = await enforceUserQuota({ uid: authedUser.uid, category: "speaking", limit: DAILY_LIMITS.speaking });
    if (!quota.allowed) {
      log.warn("quota.blocked", { route: "/speaking/interaction-score", uid: authedUser.uid, category: "speaking" });
      return res.status(429).json({ error: "Daily speaking analysis limit reached" });
    }

    const messages = [
      {
        role: "system",
        content:
          speakingPrompt({ teil, level: targetLevel || level, question: followUpQuestion }) +
          " Return a 3-sentence breakdown and a score out of 10 for interaction quality.",
      },
      {
        role: "user",
        content: `User ${authedUser.uid || userId} follow-up answer to '${
          followUpQuestion || "prompt"
        }': ${transcript}`,
      },
    ];

    const feedback = await createChatCompletion(messages, { temperature: 0.35, max_tokens: 450 });

    auditAIRequest({
      route: "/speaking/interaction-score",
      uid: authedUser.uid,
      email: authedUser.email,
      metadata: { teil, level, targetLevel, hasQuestion: Boolean(followUpQuestion), quotaRemaining: quota.remaining },
    });

    return res.json({ feedback, transcript, quotaRemaining: quota.remaining });
  } catch (err) {
    console.error("/speaking/interaction-score error", err);
    auditAIRequest({ route: "/speaking/interaction-score", uid: authedUser?.uid, email: authedUser?.email, success: false });
    return res.status(500).json({ error: err.message || "Failed to score interaction" });
  }
});

app.post("/speech-trainer/feedback", upload.single("audio"), async (req, res) => {
  let authedUser;
  try {
    authedUser = await requireAuthenticatedUser(req, res);
    if (!authedUser) return;

    const { note = "", level = "B1", userId = "guest", audioUrl = "" } = req.body || {};

    const validationError =
      validateString(note, { maxLength: 300, label: "note" }) ||
      validateString(level, { maxLength: 10, label: "level" }) ||
      validateString(audioUrl, { maxLength: 3000, label: "audioUrl" });

    if (validationError) return res.status(400).json({ error: validationError });
    if (!ensureOpenAIConfigured(res)) return;

    const quota = await enforceUserQuota({
      uid: authedUser.uid,
      category: "speechTrainer",
      limit: DAILY_LIMITS.speechTrainer,
    });

    if (!quota.allowed) {
      log.warn("quota.blocked", { route: "/speech-trainer/feedback", uid: authedUser.uid, category: "speechTrainer" });
      return res.status(429).json({ error: "Daily speech trainer limit reached" });
    }

    let audioFile = req.file;
    if (!audioFile && audioUrl) {
      audioFile = await downloadAudioFromUrl(audioUrl);
    }

    if (!audioFile) {
      return res.status(400).json({ error: "Audio recording is required" });
    }

    const transcript = ((await transcribeAudio(audioFile)) || "").slice(0, 1500);

    const messages = [
      { role: "system", content: speechTrainerPrompt({ level, note: String(note || "").trim() }) },
      { role: "user", content: transcript || "No words detected. Offer a one-line microphone troubleshooting tip in English." },
    ];

    const feedback = await createChatCompletion(messages, { temperature: 0.35, max_tokens: 420 });

    auditAIRequest({
      route: "/speech-trainer/feedback",
      uid: authedUser.uid,
      email: authedUser.email,
      metadata: {
        level,
        userId,
        quotaRemaining: quota.remaining,
        hasTranscript: Boolean(transcript),
        audioSource: req.file ? "multipart" : audioUrl ? "firebase_url" : "none",
      },
    });

    return res.json({ transcript: transcript || null, feedback, quotaRemaining: quota.remaining });
  } catch (err) {
    console.error("/speech-trainer/feedback error", err);
    auditAIRequest({ route: "/speech-trainer/feedback", uid: authedUser?.uid, email: authedUser?.email, success: false });
    return res.status(500).json({ error: err.message || "Failed to run speech trainer" });
  }
});

app.post("/chatbuddy/respond", upload.single("audio"), async (req, res) => {
  let authedUser;
  try {
    authedUser = await requireAuthenticatedUser(req, res);
    if (!authedUser) return;

    const { message, level = "B1", mode = "Lesson", lessonContext = null, sessionContext = null } = req.body || {};
    const requestedLevel = normalizeCefrLevel(level, "B1");

    if (!req.file && (!message || !String(message).trim())) {
      return res.status(400).json({ error: "A message or audio recording is required" });
    }

    const validationError =
      validateString(message, { maxLength: 800, label: "message" }) ||
      validateString(level, { maxLength: 10, label: "level" }) ||
      validateString(mode, { maxLength: 30, label: "mode" });

    if (validationError) return res.status(400).json({ error: validationError });
    if (!ensureOpenAIConfigured(res)) return;

    const effectiveLevel = await resolveStudentLevelForUser({ uid: authedUser.uid, fallbackLevel: requestedLevel });

    const quota = await enforceUserQuota({ uid: authedUser.uid, category: "chatbuddy", limit: DAILY_LIMITS.chatbuddy });
    if (!quota.allowed) {
      log.warn("quota.blocked", { route: "/chatbuddy/respond", uid: authedUser.uid, category: "chatbuddy" });
      return res.status(429).json({ error: "Daily chat buddy limit reached" });
    }

    let transcript = "";
    if (req.file) transcript = ((await transcribeAudio(req.file)) || "").slice(0, 1200);

    const trimmedMessage = String(message || "").trim();
    const combinedMessage = [trimmedMessage, transcript ? `Audio transcript: ${transcript}` : null]
      .filter(Boolean)
      .join("\n\n");

    const chatMessages = [
      { role: "system", content: chatBuddyPrompt({ level: effectiveLevel, mode, lessonContext, sessionContext }) },
      { role: "user", content: combinedMessage || transcript || "Student sent an empty message." },
    ];

    let fallbackUsed = false;
    let reply;

    try {
      reply = await createChatCompletion(chatMessages, { temperature: 0.55, max_tokens: 420 });
    } catch (err) {
      log.error("chatbuddy.completion.failed", { errorMessage: err?.message || "unknown", uid: authedUser.uid });
      fallbackUsed = true;
      reply = "Sorry, the chat buddy is unavailable right now. Please try again in a few moments or send a shorter message.";
    }

    auditAIRequest({
      route: "/chatbuddy/respond",
      uid: authedUser.uid,
      email: authedUser.email,
      metadata: { level: effectiveLevel, requestedLevel, mode, sessionState: sessionContext?.state || null, quotaRemaining: quota.remaining },
      success: !fallbackUsed,
    });

    return res.json({ reply, transcript: transcript || null, quotaRemaining: quota.remaining, degraded: fallbackUsed });
  } catch (err) {
    console.error("/chatbuddy/respond error", err);
    auditAIRequest({ route: "/chatbuddy/respond", uid: authedUser?.uid, email: authedUser?.email, success: false });
    return res.status(500).json({ error: err.message || "Failed to chat with buddy" });
  }
});


app.post("/speaking/custom-chat", async (req, res) => {
  let authedUser;
  try {
    authedUser = await requireAuthenticatedUser(req, res);
    if (!authedUser) return;

    const { message, level = "A1", history = [], mode = "Speaking", lessonContext = null, sessionContext = null } = req.body || {};
    const trimmedMessage = String(message || "").trim();
    const requestedLevel = normalizeCefrLevel(level, "A1");

    const validationError =
      validateString(trimmedMessage, { required: true, maxLength: 800, label: "message" }) ||
      validateString(level, { maxLength: 10, label: "level" }) ||
      validateString(mode, { maxLength: 30, label: "mode" });

    if (validationError) return res.status(400).json({ error: validationError });
    if (!ensureOpenAIConfigured(res)) return;

    const effectiveLevel = await resolveStudentLevelForUser({ uid: authedUser.uid, fallbackLevel: requestedLevel });

    const quota = await enforceUserQuota({ uid: authedUser.uid, category: "chatbuddy", limit: DAILY_LIMITS.chatbuddy });
    if (!quota.allowed) {
      log.warn("quota.blocked", { route: "/speaking/custom-chat", uid: authedUser.uid, category: "chatbuddy" });
      return res.status(429).json({ error: "Daily custom speaking chat limit reached" });
    }

    const safeHistory = sanitizePresentationHistory(history);
    const chatMessages = [
      { role: "system", content: customSpeakingChatPrompt({ level: effectiveLevel, mode, lessonContext, sessionContext }) },
      ...safeHistory,
      { role: "user", content: trimmedMessage },
    ];

    let fallbackUsed = false;
    let reply;

    try {
      reply = await createChatCompletion(chatMessages, { temperature: 0.6, max_tokens: 360 });
    } catch (err) {
      log.error("speaking.custom_chat.failed", { errorMessage: err?.message || "unknown", uid: authedUser.uid });
      fallbackUsed = true;
      reply = "Entschuldigung, der freie Sprechen-Chat ist gerade nicht verfügbar. Bitte versuche es gleich noch einmal.";
    }

    auditAIRequest({
      route: "/speaking/custom-chat",
      uid: authedUser.uid,
      email: authedUser.email,
      metadata: { level: effectiveLevel, requestedLevel, mode, sessionState: sessionContext?.state || null, quotaRemaining: quota.remaining },
      success: !fallbackUsed,
    });

    return res.json({ reply, quotaRemaining: quota.remaining, degraded: fallbackUsed });
  } catch (err) {
    console.error("/speaking/custom-chat error", err);
    auditAIRequest({ route: "/speaking/custom-chat", uid: authedUser?.uid, email: authedUser?.email, success: false });
    return res.status(500).json({ error: err.message || "Failed to run custom speaking chat" });
  }
});

app.post("/speaking/presentation-chat", async (req, res) => {
  let authedUser;
  try {
    authedUser = await requireAuthenticatedUser(req, res);
    if (!authedUser) return;

    const { message, level = "A1", history = [] } = req.body || {};
    const trimmedMessage = String(message || "").trim();
    const requestedLevel = normalizeCefrLevel(level);

    const validationError =
      validateString(trimmedMessage, { required: true, maxLength: 800, label: "message" }) ||
      validateString(level, { maxLength: 10, label: "level" });

    if (validationError) return res.status(400).json({ error: validationError });
    if (!ensureOpenAIConfigured(res)) return;

    const effectiveLevel = await resolveStudentLevelForUser({ uid: authedUser.uid, fallbackLevel: requestedLevel });

    const quota = await enforceUserQuota({ uid: authedUser.uid, category: "chatbuddy", limit: DAILY_LIMITS.chatbuddy });
    if (!quota.allowed) {
      log.warn("quota.blocked", { route: "/speaking/presentation-chat", uid: authedUser.uid, category: "chatbuddy" });
      return res.status(429).json({ error: "Daily presentation chat limit reached" });
    }

    const safeHistory = sanitizePresentationHistory(history);
    const answersDoneBeforeCurrent = countUserAnswers(safeHistory);
    const priorLearnerTurnCount = safeHistory.filter((item) => item?.role === "user").length;
    const isFirstLearnerTurn = priorLearnerTurnCount === 0;
    const currentMessageCountsAsAnswer = !isFirstLearnerTurn && isCountablePresentationAnswer(trimmedMessage);
    const cappedAnswersDone = Math.min(
      answersDoneBeforeCurrent + (currentMessageCountsAsAnswer ? 1 : 0),
      PRESENTATION_TURN_LIMIT
    );

    const chatMessages = [
      { role: "system", content: presentationCoachPrompt({ level: effectiveLevel, answersDone: cappedAnswersDone }) },
      ...safeHistory,
      { role: "user", content: trimmedMessage },
    ];

    let fallbackUsed = false;
    let reply;

    try {
      reply = await createChatCompletion(chatMessages, { temperature: 0.45, max_tokens: 520 });
    } catch (err) {
      log.error("presentation.chat.failed", { errorMessage: err?.message || "unknown", uid: authedUser.uid });
      fallbackUsed = true;
      reply = "Entschuldigung, der Präsentations-Chat ist gerade nicht verfügbar. Bitte versuche es gleich noch einmal.";
    }

    const completed = cappedAnswersDone >= PRESENTATION_TURN_LIMIT && !fallbackUsed;

    auditAIRequest({
      route: "/speaking/presentation-chat",
      uid: authedUser.uid,
      email: authedUser.email,
      metadata: { level: effectiveLevel, requestedLevel, quotaRemaining: quota.remaining, completed },
      success: !fallbackUsed,
    });

    return res.json({
      reply,
      answersDone: cappedAnswersDone,
      turnLimit: PRESENTATION_TURN_LIMIT,
      completed,
      quotaRemaining: quota.remaining,
      degraded: fallbackUsed,
    });
  } catch (err) {
    console.error("/speaking/presentation-chat error", err);
    auditAIRequest({ route: "/speaking/presentation-chat", uid: authedUser?.uid, email: authedUser?.email, success: false });
    return res.status(500).json({ error: err.message || "Failed to run presentation chat" });
  }
});


app.post("/speaking/presentation-upgrade", async (req, res) => {
  let authedUser;
  try {
    authedUser = await requireAuthenticatedUser(req, res);
    if (!authedUser) return;

    const { answer, level = "A1", mode = "a2-b1" } = req.body || {};
    const trimmedAnswer = String(answer || "").trim();
    const requestedLevel = normalizeCefrLevel(level);

    const validationError =
      validateString(trimmedAnswer, { required: true, maxLength: 800, label: "answer" }) ||
      validateString(level, { maxLength: 10, label: "level" }) ||
      validateString(mode, { maxLength: 30, label: "mode" });

    if (validationError) return res.status(400).json({ error: validationError });
    if (!ensureOpenAIConfigured(res)) return;

    const effectiveLevel = await resolveStudentLevelForUser({ uid: authedUser.uid, fallbackLevel: requestedLevel });

    const messages = [
      { role: "system", content: presentationUpgradePrompt({ level: effectiveLevel, mode }) },
      { role: "user", content: trimmedAnswer },
    ];

    const reply = await createChatCompletion(messages, { temperature: 0.35, max_tokens: 260 });

    auditAIRequest({
      route: "/speaking/presentation-upgrade",
      uid: authedUser.uid,
      email: authedUser.email,
      metadata: { level: effectiveLevel, requestedLevel, mode },
      success: true,
    });

    return res.json({ reply });
  } catch (err) {
    console.error("/speaking/presentation-upgrade error", err);
    auditAIRequest({ route: "/speaking/presentation-upgrade", uid: authedUser?.uid, email: authedUser?.email, success: false });
    return res.status(500).json({ error: err.message || "Failed to upgrade presentation answer" });
  }
});

app.post("/speaking/presentation-session", async (req, res) => {
  let authedUser;
  try {
    authedUser = await requireAuthenticatedUser(req, res, { allowGuest: false });
    if (!authedUser) return;

    const {
      sessionId = "",
      topic = "",
      level = "A1",
      finalScript = "",
      chatHistory = [],
      answersDone = 0,
      completionStatus = "in_progress",
      commonErrorTags = [],
      rubric = {},
      studentName = "",
      tutorName = "Sir Felix",
    } = req.body || {};

    const validationError =
      validateString(sessionId, { maxLength: 120, label: "sessionId" }) ||
      validateString(topic, { maxLength: 120, label: "topic" }) ||
      validateString(level, { maxLength: 10, label: "level" }) ||
      validateString(finalScript, { maxLength: 6000, label: "finalScript" }) ||
      validateString(completionStatus, { maxLength: 40, label: "completionStatus" });

    if (validationError) return res.status(400).json({ error: validationError });

    const db = getFirestoreSafe();
    if (!db) return res.status(503).json({ error: "Storage unavailable" });

    const cleanedTags = Array.isArray(commonErrorTags)
      ? Array.from(new Set(commonErrorTags.map((tag) => String(tag || "").trim()).filter(Boolean))).slice(0, 10)
      : [];
    const safeChatHistory = sanitizePresentationHistory(chatHistory).slice(-30);
    const safeAnswersDone = Math.max(0, Math.min(PRESENTATION_TURN_LIMIT, Number(answersDone) || 0));

    const payload = {
      uid: authedUser.uid,
      topic: String(topic || "").trim() || "Custom topic",
      level: String(level || "A1").trim().toUpperCase(),
      finalScript: String(finalScript || "").trim(),
      chatHistory: safeChatHistory,
      answersDone: safeAnswersDone,
      completionStatus: String(completionStatus || "in_progress").trim(),
      commonErrorTags: cleanedTags,
      rubric: {
        grammar: Number(rubric?.grammar || 0),
        vocabulary: Number(rubric?.vocabulary || 0),
        pronunciationReadiness: Number(rubric?.pronunciationReadiness || 0),
        structure: Number(rubric?.structure || 0),
      },
      studentName: String(studentName || "").trim() || null,
      tutorName: String(tutorName || "").trim() || "Sir Felix",
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const trimmedSessionId = String(sessionId || "").trim();
    if (trimmedSessionId) {
      const docRef = db.collection("presentationSessions").doc(trimmedSessionId);
      const snapshot = await docRef.get();

      if (snapshot.exists && snapshot.data()?.uid !== authedUser.uid) {
        return res.status(403).json({ error: "Cannot update this presentation session" });
      }

      if (snapshot.exists) {
        await docRef.set(payload, { merge: true });
      } else {
        await docRef.set({ ...payload, createdAt: admin.firestore.FieldValue.serverTimestamp() }, { merge: true });
      }
      return res.json({ ok: true, id: docRef.id });
    }

    const docRef = await db.collection("presentationSessions").add({ ...payload, createdAt: admin.firestore.FieldValue.serverTimestamp() });
    return res.json({ ok: true, id: docRef.id });
  } catch (err) {
    console.error("/speaking/presentation-session error", err);
    return res.status(500).json({ error: err.message || "Failed to save presentation session" });
  }
});

app.post("/speaking/presentation-session/delete", async (req, res) => {
  let authedUser;
  try {
    authedUser = await requireAuthenticatedUser(req, res, { allowGuest: false });
    if (!authedUser) return;

    const { sessionId = "" } = req.body || {};
    const validationError = validateString(sessionId, { maxLength: 120, label: "sessionId" });
    if (validationError) return res.status(400).json({ error: validationError });

    const db = getFirestoreSafe();
    if (!db) return res.status(503).json({ error: "Storage unavailable" });

    const trimmedSessionId = String(sessionId || "").trim();
    if (!trimmedSessionId) return res.status(400).json({ error: "sessionId is required" });

    const docRef = db.collection("presentationSessions").doc(trimmedSessionId);
    const snapshot = await docRef.get();
    if (!snapshot.exists) return res.json({ ok: true, deleted: false });

    if (snapshot.data()?.uid !== authedUser.uid) {
      return res.status(403).json({ error: "Cannot delete this presentation session" });
    }

    await docRef.delete();
    return res.json({ ok: true, deleted: true, id: trimmedSessionId });
  } catch (err) {
    console.error("/speaking/presentation-session/delete error", err);
    return res.status(500).json({ error: err.message || "Failed to delete presentation session" });
  }
});

app.post("/speaking/presentation-session/history", async (req, res) => {
  let authedUser;
  try {
    authedUser = await requireAuthenticatedUser(req, res, { allowGuest: false });
    if (!authedUser) return;

    const { limit = 10, startAfter = "" } = req.body || {};
    const safeLimit = Math.max(1, Math.min(30, Number(limit) || 10));
    const validationError = validateString(startAfter, { maxLength: 120, label: "startAfter" });
    if (validationError) return res.status(400).json({ error: validationError });

    const db = getFirestoreSafe();
    if (!db) return res.status(503).json({ error: "Storage unavailable" });

    let query = db
      .collection("presentationSessions")
      .where("uid", "==", authedUser.uid)
      .orderBy("createdAt", "desc")
      .limit(safeLimit);

    const trimmedStartAfter = String(startAfter || "").trim();
    if (trimmedStartAfter) {
      const startAfterRef = db.collection("presentationSessions").doc(trimmedStartAfter);
      const startAfterSnap = await startAfterRef.get();
      if (startAfterSnap.exists && startAfterSnap.data()?.uid === authedUser.uid) {
        query = query.startAfter(startAfterSnap);
      }
    }

    const snap = await query.get();

    const sessions = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    const nextCursor = snap.docs.length === safeLimit ? snap.docs[snap.docs.length - 1].id : "";

    return res.json({ sessions, nextCursor, hasMore: Boolean(nextCursor) });
  } catch (err) {
    console.error("/speaking/presentation-session/history error", err);
    return res.status(500).json({ error: err.message || "Failed to load presentation sessions" });
  }
});

app.post("/speaking/presentation-session/delete-all", async (req, res) => {
  let authedUser;
  try {
    authedUser = await requireAuthenticatedUser(req, res, { allowGuest: false });
    if (!authedUser) return;

    const db = getFirestoreSafe();
    if (!db) return res.status(503).json({ error: "Storage unavailable" });

    const snap = await db
      .collection("presentationSessions")
      .where("uid", "==", authedUser.uid)
      .get();

    if (snap.empty) return res.json({ ok: true, deletedCount: 0 });

    const chunks = [];
    let current = [];
    snap.docs.forEach((doc) => {
      current.push(doc.ref);
      if (current.length === 400) {
        chunks.push(current);
        current = [];
      }
    });
    if (current.length) chunks.push(current);

    for (const refs of chunks) {
      const batch = db.batch();
      refs.forEach((ref) => batch.delete(ref));
      // eslint-disable-next-line no-await-in-loop
      await batch.commit();
    }

    return res.json({ ok: true, deletedCount: snap.docs.length });
  } catch (err) {
    console.error("/speaking/presentation-session/delete-all error", err);
    return res.status(500).json({ error: err.message || "Failed to delete all presentation sessions" });
  }
});

app.post("/tutor/placement", async (req, res) => {
  let authedUser;
  try {
    authedUser = await requireAuthenticatedUser(req, res);
    if (!authedUser) return;

    const { answers = [], targetLevel, userId = "guest" } = req.body || {};

    const validationError =
      validateAnswersArray(answers, { maxEntries: 8, maxTextLength: 700 }) ||
      validateString(targetLevel, { maxLength: 10, label: "targetLevel" });

    if (validationError) return res.status(400).json({ error: validationError });
    if (!ensureOpenAIConfigured(res)) return;

    const quota = await enforceUserQuota({ uid: authedUser.uid, category: "placement", limit: DAILY_LIMITS.placement });
    if (!quota.allowed) {
      log.warn("quota.blocked", { route: "/tutor/placement", uid: authedUser.uid, category: "placement" });
      return res.status(429).json({ error: "Daily placement attempts limit reached" });
    }

    const messages = [
      { role: "system", content: placementPrompt({ answers, targetLevel }) },
      {
        role: "user",
        content: `Student id ${authedUser.uid || userId}. Provide JSON with estimated_level, confidence, rationale, next_task_hint.`,
      },
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

    auditAIRequest({
      route: "/tutor/placement",
      uid: authedUser.uid,
      email: authedUser.email,
      metadata: { targetLevel, answersCount: answers.length, quotaRemaining: quota.remaining },
    });

    return res.json({ placement, quotaRemaining: quota.remaining });
  } catch (err) {
    console.error("/tutor/placement error", err);
    auditAIRequest({ route: "/tutor/placement", uid: authedUser?.uid, email: authedUser?.email, success: false });
    return res.status(500).json({ error: err.message || "Failed to run placement" });
  }
});

app.get("/tutor/next-task", async (req, res) => {
  let authedUser;
  try {
    authedUser = await requireAuthenticatedUser(req, res, { allowGuest: false });
    if (!authedUser) return;

    const userId = String(req.query.userId || authedUser.uid || "guest");

    if (!ensureOpenAIConfigured(res)) return;

    const quota = await enforceUserQuota({
      uid: authedUser.uid,
      category: "nextTask",
      limit: DAILY_LIMITS.nextTask,
    });

    if (!quota.allowed) {
      log.warn("quota.blocked", { route: "/tutor/next-task", uid: authedUser.uid, category: "nextTask" });
      return res.status(429).json({ error: "Daily next-task limit reached" });
    }

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

    auditAIRequest({
      route: "/tutor/next-task",
      uid: authedUser.uid,
      email: authedUser.email,
      metadata: { userId, quotaRemaining: quota.remaining },
    });

    return res.json({ nextTask, quotaRemaining: quota.remaining });
  } catch (err) {
    console.error("/tutor/next-task error", err);
    auditAIRequest({ route: "/tutor/next-task", uid: authedUser?.uid, email: authedUser?.email, success: false });
    return res.status(500).json({ error: err.message || "Failed to fetch next task" });
  }
});

app.use((err, req, res, _next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ error: err?.message || "Internal server error" });
});

module.exports = app;
