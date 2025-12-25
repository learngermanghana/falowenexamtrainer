/**
 * app.js (FULL FILE) — Paystack installments + better contract handling
 * Key fixes included:
 * 1) DO NOT store authorization_url in students.paystackLink (it expires). Return it only to frontend.
 * 2) Preserve contractStart if already active; extend/upgrade contractEnd instead of resetting each payment.
 * 3) Enforce min installment GH₵1000 unless the payment clears the remaining balance.
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
const PAYSTACK_MIN_INSTALLMENT_GHS = 1000;

function addMonths(date, months) {
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return null;
  d.setMonth(d.getMonth() + Number(months || 0));
  return d;
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
  const interaction =
    typeof interactionMode === "undefined" ? "" : `Interaction mode: ${interactionMode}.`;

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
     * Important: Do NOT reset contractStart every time.
     * - If existing contract is active (contractEnd > now), keep existing start.
     * - If expired or missing, start from now.
     * - If upgrading to 6-month, extend end date.
     */
    const now = new Date();

    const existingStart = studentData.contractStart ? new Date(studentData.contractStart) : null;
    const existingEnd = studentData.contractEnd ? new Date(studentData.contractEnd) : null;

    const startIsValid = existingStart && !Number.isNaN(existingStart.getTime());
    const endIsValid = existingEnd && !Number.isNaN(existingEnd.getTime());

    const contractWasActive = endIsValid && existingEnd > now;

    const contractStartDate = contractWasActive && startIsValid ? existingStart : now;

    const targetMonths = paymentStatus === "paid" ? 6 : 1;
    const currentMonths = Number(studentData.contractTermMonths || 0);

    // Keep the bigger access (never reduce)
    const finalMonths = Math.max(currentMonths, targetMonths);

    const proposedEnd = addMonths(contractStartDate, finalMonths);

    // If they already had a later end date, preserve it
    const contractEndDate = endIsValid && existingEnd > proposedEnd ? existingEnd : proposedEnd;

    const updates = {
      initialPaymentAmount: totalPaid,
      balanceDue,
      paymentStatus,
      contractStart: contractStartDate.toISOString(),
      contractEnd: contractEndDate ? contractEndDate.toISOString() : "",
      contractTermMonths: finalMonths,
      status: "Active",
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

/**
 * =========================
 * AI / WRITING ROUTES
 * =========================
 */
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

    if (!input) return res.status(400).json({ error: "Text is required for correction" });

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

    if (validationError) return res.status(400).json({ error: validationError });

    const quota = await enforceUserQuota({
      uid: authedUser.uid,
      category: "grammar",
      limit: DAILY_LIMITS.grammar,
    });

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

    if (!req.file) return res.status(400).json({ error: "Audio file is required" });

    const { teil, level = "A2", contextType, question, interactionMode, userId = "guest" } = req.body || {};

    const validationError =
      validateString(teil, { maxLength: 20, label: "teil" }) ||
      validateString(level, { maxLength: 10, label: "level" }) ||
      validateString(contextType, { maxLength: 60, label: "context" }) ||
      validateString(question, { maxLength: 400, label: "question" });

    if (validationError) return res.status(400).json({ error: validationError });

    const quota = await enforceUserQuota({ uid: authedUser.uid, category: "speaking", limit: DAILY_LIMITS.speaking });
    if (!quota.allowed) {
      log.warn("quota.blocked", { route: "/speaking/analyze", uid: authedUser.uid, category: "speaking" });
      return res.status(429).json({ error: "Daily speaking analysis limit reached" });
    }

    const transcript = ((await transcribeAudio(req.file)) || "").slice(0, 1800);
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

    if (validationError) return res.status(400).json({ error: validationError });

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
      metadata: { teil, level, targetLevel, quotaRemaining: quota.remaining },
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

    if (!req.file) return res.status(400).json({ error: "Audio recording is required" });

    const { note = "", level = "B1", userId = "guest" } = req.body || {};

    const validationError =
      validateString(note, { maxLength: 300, label: "note" }) ||
      validateString(level, { maxLength: 10, label: "level" });

    if (validationError) return res.status(400).json({ error: validationError });

    const quota = await enforceUserQuota({
      uid: authedUser.uid,
      category: "speechTrainer",
      limit: DAILY_LIMITS.speechTrainer,
    });

    if (!quota.allowed) {
      log.warn("quota.blocked", { route: "/speech-trainer/feedback", uid: authedUser.uid, category: "speechTrainer" });
      return res.status(429).json({ error: "Daily speech trainer limit reached" });
    }

    const transcript = ((await transcribeAudio(req.file)) || "").slice(0, 1500);

    const messages = [
      { role: "system", content: speechTrainerPrompt({ level, note: String(note || "").trim() }) },
      { role: "user", content: transcript || "No words detected. Offer a one-line microphone troubleshooting tip in English." },
    ];

    const feedback = await createChatCompletion(messages, { temperature: 0.35, max_tokens: 420 });

    auditAIRequest({
      route: "/speech-trainer/feedback",
      uid: authedUser.uid,
      email: authedUser.email,
      metadata: { level, userId, quotaRemaining: quota.remaining, hasTranscript: Boolean(transcript) },
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

    const { message, level = "B1" } = req.body || {};

    if (!req.file && (!message || !String(message).trim())) {
      return res.status(400).json({ error: "A message or audio recording is required" });
    }

    const validationError =
      validateString(message, { maxLength: 800, label: "message" }) ||
      validateString(level, { maxLength: 10, label: "level" });

    if (validationError) return res.status(400).json({ error: validationError });

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
      { role: "system", content: chatBuddyPrompt({ level }) },
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
      metadata: { level, quotaRemaining: quota.remaining },
      success: !fallbackUsed,
    });

    return res.json({ reply, transcript: transcript || null, quotaRemaining: quota.remaining, degraded: fallbackUsed });
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

    if (validationError) return res.status(400).json({ error: validationError });

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
