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
const { LETTER_COACH_PROMPTS, grammarPrompt, markPrompt } = require("./prompts");
const { createChatCompletion, getOpenAIClient } = require("./openaiClient");
const { appendStudentToStudentsSheetSafely } = require("./studentsSheet");
const { createLogger, logRequest } = require("./logger");
const { incrementCounter, getMetricsSnapshot } = require("./metrics");

let getScoresForStudent;

const log = createLogger({ scope: "app" });

function initFirebaseAdmin() {
  if (admin.apps.length) return;

  const b64 =
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON_B64 ||
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON_B64;

  const raw =
    process.env.GOOGLE_SERVICE_ACCOUNT_JSON || process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

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

function validateString(value, { required = false, maxLength = 500, label = "field" } = {}) {
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

async function requireAuthenticatedUser(req, res) {
  const authedUser = await getAuthedUser(req);
  if (!authedUser?.uid) {
    return { uid: "guest", email: null, isGuest: true };
  }

  return authedUser;
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

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

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

const chatBuddyPrompt = ({ level }) =>
  [
    "You are Falowen Chat Buddy, a friendly German speaking partner helping a student practise.",
    `Match the CEFR level ${level || "B1"} and keep answers short (max 4 sentences).`,
    "Blend simple German with brief English guidance so the learner understands.",
    "Always ask one follow-up question in German to keep the conversation going.",
    "If you notice pronunciation or grammar issues, include one quick tip using a short German example.",
  ].join(" ");

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
    const docRef = db.collection("students").doc(studentCode);
    const docSnap = await docRef.get();
    if (docSnap.exists) return { ref: docRef, snap: docSnap };
  }

  if (email) {
    const normalizedEmail = email.toLowerCase();
    const querySnap = await db
      .collection("students")
      .where("email", "==", normalizedEmail)
      .limit(1)
      .get();
    if (!querySnap.empty) {
      const doc = querySnap.docs[0];
      return { ref: doc.ref, snap: doc };
    }
  }

  return null;
}

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
    if (computed !== signature) {
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
    if (!reference) {
      return res.status(400).json({ error: "Missing Paystack reference" });
    }

    const payloadHash = crypto.createHash("sha256").update(raw).digest("hex");
    const db = admin.firestore();

    const studentCode =
      data?.metadata?.studentCode ||
      data?.metadata?.student_code ||
      data?.metadata?.studentcode ||
      null;
    const email = data?.customer?.email ? String(data.customer.email).toLowerCase() : "";

    const amountPaid = Number(data?.amount || 0) / 100;
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

    const match = await findStudentByCodeOrEmail({ studentCode, email });

    if (!match) {
      webhookLog.warn("paystack.webhook.no_match", { studentCode, email });
      incrementCounter("webhook_no_match", "paystack");
      await dedupeRef.set(
        {
          status: "no-match",
          handledAt: admin.firestore.FieldValue.serverTimestamp(),
        },
        { merge: true }
      );
      return res.status(202).json({ status: "no-match" });
    }

    const { ref, snap } = match;
    const studentData = snap.data() || {};
    const priorPaid = Number(studentData.initialPaymentAmount || 0);
    const tuitionFee = Number(studentData.tuitionFee || 0);
    const totalPaid = priorPaid + amountPaid;
    const balanceDue = tuitionFee ? Math.max(tuitionFee - totalPaid, 0) : null;
    const paymentStatus = tuitionFee && totalPaid < tuitionFee ? "partial" : "paid";

    const updates = {
      initialPaymentAmount: totalPaid,
      balanceDue,
      paymentStatus,
      paystackReference: data?.reference || studentData.paystackReference || "",
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
      },
      { merge: true }
    );

    incrementCounter("webhook_handled", paymentStatus || "handled");
    webhookLog.info("paystack.webhook.success", { reference, studentId: ref.id, paymentStatus, balanceDue });

    return res.json({ status: "synced", paymentStatus, balanceDue });
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

app.post("/profile/biography/correct", async (req, res) => {
  try {
    const { text, level = "A2" } = req.body || {};
    const input = String(text || "").trim();

    if (!input) {
      return res.status(400).json({ error: "Biography text is required" });
    }

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

    const { question, level = "A2", studentId } = req.body || {};
    const trimmedQuestion = String(question || "").trim();
    const trimmedStudentId = typeof studentId === "string" ? studentId.trim() : "";

    const validationError =
      validateString(trimmedQuestion, { required: true, maxLength: 400, label: "question" }) ||
      validateString(level, { maxLength: 10, label: "level" });

    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const quota = await enforceUserQuota({ uid: authedUser.uid, category: "grammar", limit: DAILY_LIMITS.grammar });
    if (!quota.allowed) {
      log.warn("quota.blocked", { route: "/grammar/ask", uid: authedUser.uid, category: "grammar" });
      return res.status(429).json({ error: "Daily grammar question limit reached" });
    }

    const messages = [
      { role: "system", content: grammarPrompt({ level }) },
      { role: "user", content: trimmedQuestion },
    ];

    const answer = await createChatCompletion(messages, { temperature: 0.35, max_tokens: 450 });

    const db = getFirestoreSafe();
    const logEntry = {
      question: trimmedQuestion,
      level,
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
      metadata: { level, studentId: trimmedStudentId, quotaRemaining: quota.remaining },
    });

    return res.json({ answer, quotaRemaining: quota.remaining });
  } catch (err) {
    console.error("/grammar/ask error", err);
    auditAIRequest({ route: "/grammar/ask", uid: authedUser?.uid, email: authedUser?.email, success: false });
    return res.status(500).json({ error: err.message || "Failed to answer grammar question" });
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
    if (!studentCode) return res.status(400).json({ error: "studentCode is required" });

    const rows = await loadScoresModule()(studentCode);
    return res.json({ studentCode, rows });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ error: "Failed to fetch scores" });
  }
});

app.post("/speaking/analyze", upload.single("audio"), async (req, res) => {
  let authedUser;
  try {
    authedUser = await requireAuthenticatedUser(req, res);
    if (!authedUser) return;

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

    const validationError =
      validateString(teil, { maxLength: 20, label: "teil" }) ||
      validateString(level, { maxLength: 10, label: "level" }) ||
      validateString(contextType, { maxLength: 60, label: "context" }) ||
      validateString(question, { maxLength: 400, label: "question" });

    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const quota = await enforceUserQuota({ uid: authedUser.uid, category: "speaking", limit: DAILY_LIMITS.speaking });
    if (!quota.allowed) {
      log.warn("quota.blocked", { route: "/speaking/analyze", uid: authedUser.uid, category: "speaking" });
      return res.status(429).json({ error: "Daily speaking analysis limit reached" });
    }

    const transcript = ((await transcribeAudio(req.file)) || "").slice(0, 1800);

    if (!transcript) {
      return res.status(500).json({ error: "Could not transcribe audio" });
    }

    const messages = [
      { role: "system", content: speakingPrompt({ teil, level, contextType, question, interactionMode }) },
      {
        role: "user",
        content: `User ${authedUser.uid || userId} speaking sample transcript: ${transcript}`,
      },
    ];

    const feedback = await createChatCompletion(messages, { temperature: 0.35, max_tokens: 500 });

    auditAIRequest({
      route: "/speaking/analyze",
      uid: authedUser.uid,
      email: authedUser.email,
      metadata: { teil, level, quotaRemaining: quota.remaining },
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

    const { text, teil, level = "A2", targetLevel, userId = "guest" } = req.body || {};
    const trimmed = String(text || "").trim();

    const validationError =
      validateString(trimmed, { required: true, maxLength: 2000, label: "transcript" }) ||
      validateString(teil, { maxLength: 20, label: "teil" }) ||
      validateString(level, { maxLength: 10, label: "level" }) ||
      validateString(targetLevel, { maxLength: 10, label: "targetLevel" });

    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const quota = await enforceUserQuota({ uid: authedUser.uid, category: "speaking", limit: DAILY_LIMITS.speaking });
    if (!quota.allowed) {
      log.warn("quota.blocked", { route: "/speaking/analyze-text", uid: authedUser.uid, category: "speaking" });
      return res.status(429).json({ error: "Daily speaking analysis limit reached" });
    }

    const messages = [
      { role: "system", content: speakingPrompt({ teil, level: targetLevel || level }) },
      { role: "user", content: `User ${authedUser.uid || userId} transcript: ${trimmed}` },
    ];

    const feedback = await createChatCompletion(messages, { temperature: 0.35, max_tokens: 500 });

    auditAIRequest({
      route: "/speaking/analyze-text",
      uid: authedUser.uid,
      email: authedUser.email,
      metadata: { teil, level, targetLevel, quotaRemaining: quota.remaining },
    });

    return res.json({ feedback, quotaRemaining: quota.remaining });
  } catch (err) {
    console.error("/speaking/analyze-text error", err);
    auditAIRequest({ route: "/speaking/analyze-text", uid: authedUser?.uid, email: authedUser?.email, success: false });
    return res.status(500).json({ error: err.message || "Failed to analyze text" });
  }
});

app.post("/speaking/interaction-score", upload.single("audio"), async (req, res) => {
  let authedUser;
  try {
    authedUser = await requireAuthenticatedUser(req, res);
    if (!authedUser) return;

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

    const validationError =
      validateString(transcript, { required: true, maxLength: 1800, label: "transcript" }) ||
      validateString(followUpQuestion, { maxLength: 400, label: "followUpQuestion" }) ||
      validateString(teil, { maxLength: 20, label: "teil" }) ||
      validateString(level, { maxLength: 10, label: "level" }) ||
      validateString(targetLevel, { maxLength: 10, label: "targetLevel" });

    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const quota = await enforceUserQuota({ uid: authedUser.uid, category: "speaking", limit: DAILY_LIMITS.speaking });
    if (!quota.allowed) {
      log.warn("quota.blocked", { route: "/speaking/interaction-score", uid: authedUser.uid, category: "speaking" });
      return res.status(429).json({ error: "Daily speaking analysis limit reached" });
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
        content: `User ${authedUser.uid || userId} follow-up answer to '${followUpQuestion || "prompt"}': ${transcript}`,
      },
    ];

    const feedback = await createChatCompletion(messages, { temperature: 0.35, max_tokens: 450 });

    auditAIRequest({
      route: "/speaking/interaction-score",
      uid: authedUser.uid,
      email: authedUser.email,
      metadata: { teil, level, targetLevel, quotaRemaining: quota.remaining },
    });

    return res.json({ feedback, transcript, quotaRemaining: quota.remaining });
  } catch (err) {
    console.error("/speaking/interaction-score error", err);
    auditAIRequest({ route: "/speaking/interaction-score", uid: authedUser?.uid, email: authedUser?.email, success: false });
    return res.status(500).json({ error: err.message || "Failed to score interaction" });
  }
});

app.post("/chatbuddy/respond", upload.single("audio"), async (req, res) => {
  let authedUser;
  try {
    authedUser = await requireAuthenticatedUser(req, res);
    if (!authedUser) return;

    const { message, level = "B1" } = req.body || {};

    if (!req.file && (!message || !String(message).trim())) {
      return res.status(400).json({ error: "A message or audio recording is required" });
    }

    const validationError =
      validateString(message, { maxLength: 800, label: "message" }) ||
      validateString(level, { maxLength: 10, label: "level" });

    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const quota = await enforceUserQuota({ uid: authedUser.uid, category: "chatbuddy", limit: DAILY_LIMITS.chatbuddy });
    if (!quota.allowed) {
      log.warn("quota.blocked", { route: "/chatbuddy/respond", uid: authedUser.uid, category: "chatbuddy" });
      return res.status(429).json({ error: "Daily chat buddy limit reached" });
    }

    let transcript = "";

    if (req.file) {
      transcript = ((await transcribeAudio(req.file)) || "").slice(0, 1200);
    }

    const trimmedMessage = String(message || "").trim();
    const combinedMessage = [trimmedMessage, transcript ? `Audio transcript: ${transcript}` : null]
      .filter(Boolean)
      .join("\n\n");

    const chatMessages = [
      { role: "system", content: chatBuddyPrompt({ level }) },
      { role: "user", content: combinedMessage || transcript || "Student sent an empty message." },
    ];

    const reply = await createChatCompletion(chatMessages, { temperature: 0.55, max_tokens: 420 });

    auditAIRequest({
      route: "/chatbuddy/respond",
      uid: authedUser.uid,
      email: authedUser.email,
      metadata: { level, quotaRemaining: quota.remaining },
    });

    return res.json({ reply, transcript: transcript || null, quotaRemaining: quota.remaining });
  } catch (err) {
    console.error("/chatbuddy/respond error", err);
    auditAIRequest({ route: "/chatbuddy/respond", uid: authedUser?.uid, email: authedUser?.email, success: false });
    return res.status(500).json({ error: err.message || "Failed to chat with buddy" });
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

    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

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

module.exports = app;
