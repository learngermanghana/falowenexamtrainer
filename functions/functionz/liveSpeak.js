/*
 * Falowen Live Speak: opt-in, metered voice practice.
 * Never mix these payment intents with tuition and never trust client-side credits.
 * LIVE_SPEAK_ENABLED must be explicitly true before checkout or AI spending is possible.
 */
const crypto = require("crypto");
const { toFile } = require("openai");
const { getOpenAIClient } = require("./openaiClient");

const PRICE_GHS = 40;
const BASIC_SESSIONS = 8;
const TRIAL_SESSIONS = 2;
const SESSION_MS = 5 * 60 * 1000;
const PERIOD_MS = 30 * 24 * 60 * 60 * 1000;
const TRIAL_MS = 7 * 24 * 60 * 60 * 1000;
const MAX_TURNS = 10;
const MAX_AUDIO_BYTES = 350000;
const LEVELS = new Set(["A1", "A2", "B1", "B2", "C1", "C2"]);
const VALID_AUDIO = new Set(["audio/webm", "audio/mp4", "audio/mpeg", "audio/wav", "audio/ogg"]);
const GERMAN_OPENINGS = {
  A1: "Hallo! Wie heißt du, und woher kommst du?",
  A2: "Hallo! Schön, dass du da bist. Was hast du heute gemacht?",
  B1: "Hallo! Was möchtest du diese Woche lernen, und warum?",
  B2: "Guten Tag! Welche Entwicklung in deiner Stadt findest du besonders interessant?",
  C1: "Guten Tag! Welches aktuelle gesellschaftliche Thema beschäftigt dich besonders?",
  C2: "Guten Tag! Über welche komplexe Fragestellung würdest du heute gern diskutieren?",
};
const enabled = () => process.env.LIVE_SPEAK_ENABLED === "true";
const trialEnabled = () => process.env.LIVE_SPEAK_TRIAL_ENABLED === "true";
const spendingCap = () => {
  const configured = Number(process.env.LIVE_SPEAK_MONTHLY_TURN_CAP);
  return Number.isSafeInteger(configured) && configured >= 1 && configured <= 100000 ? configured : 800;
};
const isValidReference = (value) => /^[a-zA-Z0-9_.-]{5,120}$/.test(String(value || ""));
const asMoney = (value) => Math.round((Number(value) + Number.EPSILON) * 100) / 100;
const normalizeEmail = (value) => String(value || "").trim().toLowerCase();
const currentMonth = () => new Date().toISOString().slice(0, 7);
const cleanLevel = (value) => {
  const level = String(value || "").trim().toUpperCase();
  return LEVELS.has(level) ? level : "A2";
};
const error = (res, status, code, message) => res.status(status).json({ error: message, code });
const addDays = (milliseconds) => new Date(Date.now() + milliseconds).toISOString();
const withinWindow = (sub) => Boolean(sub && Date.parse(sub.expiresAt || "") > Date.now());
const receiptStatus = (sub) => ({
  plan: withinWindow(sub) ? sub.plan || "" : "",
  remaining: withinWindow(sub) ? Math.max(0, Number(sub.remaining) || 0) : 0,
  expiresAt: withinWindow(sub) ? sub.expiresAt : null,
  trialGranted: Boolean(sub?.trialGranted),
});

async function applyVerifiedPayment({ db, admin, reference, payment }) {
  if (!isValidReference(reference)) return { handled: false };
  const intentRef = db.collection("liveSpeakPaymentIntents").doc(reference);
  const intentSnap = await intentRef.get();
  if (!intentSnap.exists) return { handled: false };

  const intent = intentSnap.data() || {};
  const email = normalizeEmail(payment?.customer?.email);
  const paidAmount = Number(payment?.amount);
  const valid =
    String(payment?.status || "").toLowerCase() === "success" &&
    String(payment?.currency || "").toUpperCase() === "GHS" &&
    Number.isSafeInteger(paidAmount) &&
    paidAmount === Number(intent.checkoutPesewas) &&
    Boolean(email) && email === normalizeEmail(intent.email) &&
    String(payment?.reference || "") === reference;

  if (!valid) return { handled: true, success: false, reason: "payment_mismatch" };
  const subRef = db.collection("liveSpeakSubscriptions").doc(intent.uid);
  let duplicate = false;
  await db.runTransaction(async (tx) => {
    const [latestIntent, oldSubscription] = await Promise.all([tx.get(intentRef), tx.get(subRef)]);
    if (latestIntent.data()?.status === "paid") { duplicate = true; return; }
    if (latestIntent.data()?.status !== "pending") throw new Error("Payment intent is not pending.");
    const previous = oldSubscription.data() || {};
    const now = new Date();
    // If two independently paid checkouts complete, never discard the first package.
    const carry = withinWindow(previous) ? Math.max(0, Number(previous.remaining) || 0) : 0;
    const start = withinWindow(previous) ? Math.max(now.getTime(), Date.parse(previous.expiresAt)) : now.getTime();
    tx.set(subRef, {
      uid: intent.uid, plan: "basic", remaining: carry + BASIC_SESSIONS,
      expiresAt: new Date(start + PERIOD_MS).toISOString(),
      trialGranted: Boolean(previous.trialGranted),
      purchased: true,
      lastPaymentReference: reference,
      lastPaymentAmountGhs: PRICE_GHS,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    tx.update(intentRef, {
      status: "paid", confirmedAt: admin.firestore.FieldValue.serverTimestamp(),
    });
  });
  return { handled: true, success: true, duplicate };
}

function registerLiveSpeakRoutes(app, { admin, getAuthedUser, findStudentByCodeOrEmail, calculateSharedPaystackFee }) {
  const db = () => admin.firestore();
  const requireStudent = async (req, res) => {
    const auth = await getAuthedUser(req);
    if (!auth) { error(res, 401, "unauthenticated", "Sign in to use Live Speak."); return null; }
    const match = await findStudentByCodeOrEmail({ email: auth.email, uid: auth.uid });
    if (!match) { error(res, 403, "student_required", "A Falowen student account is required."); return null; }
    const profile = match.snap.data() || {};
    const profileEmail = normalizeEmail(profile.email);
    if ((profile.uid && profile.uid !== auth.uid) ||
      (profileEmail && profileEmail !== normalizeEmail(auth.email))) {
      error(res, 403, "student_mismatch", "This student profile does not belong to your account.");
      return null;
    }
    return { auth, profile };
  };
  const requireEnabled = (res) => {
    if (enabled()) return true;
    error(res, 503, "pilot_disabled", "Live Speak is not enabled yet. Existing free speaking practice is still available.");
    return false;
  };

  app.get("/live-speak/status", async (req, res) => {
    try {
      const student = await requireStudent(req, res);
      if (!student) return;
      const sub = await db().collection("liveSpeakSubscriptions").doc(student.auth.uid).get();
      const usage = await db().collection("liveSpeakUsage").doc(currentMonth()).get();
      const data = sub.data() || {};
      return res.json({
        enabled: enabled(), trialEnabled: trialEnabled(), priceGhs: PRICE_GHS,
        sessionsPerPurchase: BASIC_SESSIONS, sessionMinutes: 5, recurring: false,
        ...receiptStatus(data),
        trialAvailable: enabled() && trialEnabled() && !data.trialGranted && !data.purchased,
        capReached: (Number(usage.data()?.turns) || 0) >= spendingCap(),
      });
    } catch (err) {
      console.error("Live Speak status error", err?.message);
      return error(res, 503, "status_unavailable", "Could not check Live Speak access.");
    }
  });

  app.post("/live-speak/trial", async (req, res) => {
    try {
      if (!requireEnabled(res)) return;
      if (!trialEnabled()) return error(res, 403, "trial_closed", "The Live Speak free trial is not available.");
      const student = await requireStudent(req, res);
      if (!student) return;
      const ref = db().collection("liveSpeakSubscriptions").doc(student.auth.uid);
      let claimed = false;
      await db().runTransaction(async (tx) => {
        const snap = await tx.get(ref);
        const current = snap.data() || {};
        if (current.trialGranted || current.purchased) return;
        tx.set(ref, {
          uid: student.auth.uid, plan: "trial", remaining: TRIAL_SESSIONS,
          expiresAt: addDays(TRIAL_MS), trialGranted: true, purchased: false,
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        }, { merge: true });
        claimed = true;
      });
      if (!claimed) return error(res, 409, "already_claimed", "Your trial has already been claimed.");
      return res.json({ ok: true, sessions: TRIAL_SESSIONS });
    } catch (err) {
      console.error("Live Speak trial error", err?.message);
      return error(res, 503, "trial_unavailable", "Could not activate your trial.");
    }
  });

  app.post("/live-speak/checkout", async (req, res) => {
    try {
      if (!requireEnabled(res)) return;
      const student = await requireStudent(req, res);
      if (!student) return;
      const secret = process.env.PAYSTACK_SECRET;
      if (!secret) return error(res, 503, "payment_unavailable", "Live Speak payments are not configured.");
      if (!student.auth.email) return error(res, 400, "missing_email", "A verified student email is required.");
      const usage = await db().collection("liveSpeakUsage").doc(currentMonth()).get();
      if ((Number(usage.data()?.turns) || 0) + BASIC_SESSIONS * MAX_TURNS > spendingCap()) {
        return error(res, 429, "budget_reached", "The speaking pilot has reached its current capacity. No payment has been taken.");
      }
      if (!process.env.OPENAI_API_KEY) return error(res, 503, "voice_unavailable", "The natural German voice service is not configured.");
      const subscription = await db().collection("liveSpeakSubscriptions").doc(student.auth.uid).get();
      if (withinWindow(subscription.data()) && Number(subscription.data()?.remaining) > 0) {
        return error(res, 409, "sessions_remaining", "Please use your remaining sessions before purchasing another package.");
      }
      const fee = calculateSharedPaystackFee(PRICE_GHS);
      // Persist our reference before opening checkout: an immediate webhook cannot
      // be mistaken for a tuition payment while the browser is redirecting.
      const reference = "fsl_" + crypto.randomUUID().replace(/-/g, "");
      await db().collection("liveSpeakPaymentIntents").doc(reference).create({
        uid: student.auth.uid, email: normalizeEmail(student.auth.email),
        status: "pending", product: "falowen_live_speak_basic",
        checkoutPesewas: Math.round(fee.checkoutAmount * 100),
        basePriceGhs: PRICE_GHS, studentFeeGhs: fee.studentFeeContribution,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      // Callback destination is fixed on the server, never accepted from browser input.
      const callback = "https://www.falowen.app/campus/live-speak";
      const pay = await fetch("https://api.paystack.co/transaction/initialize", {
        method: "POST",
        headers: { Authorization: "Bearer " + secret, "Content-Type": "application/json" },
        body: JSON.stringify({
          email: normalizeEmail(student.auth.email), currency: "GHS",
          amount: Math.round(fee.checkoutAmount * 100), callback_url: callback,
          reference,
          metadata: {
            product: "falowen_live_speak_basic", studentUid: student.auth.uid,
            sessions: BASIC_SESSIONS, planPriceGhs: PRICE_GHS,
          },
        }),
        signal: AbortSignal.timeout(12000),
      });
      const response = await pay.json().catch(() => ({}));
      const responseReference = String(response?.data?.reference || "");
      const checkoutUrl = String(response?.data?.authorization_url || "");
      if (!pay.ok || !response?.status || responseReference !== reference ||
        !/^https:\/\/(checkout\.)?paystack\.com\//i.test(checkoutUrl)) {
        return error(res, 502, "checkout_failed", "Could not create the Live Speak checkout.");
      }
      return res.json({
        authorization_url: checkoutUrl, reference,
        priceGhs: PRICE_GHS, feeGhs: fee.studentFeeContribution,
        checkoutAmountGhs: fee.checkoutAmount,
      });
    } catch (err) {
      console.error("Live Speak checkout error", err?.message);
      return error(res, 503, "checkout_unavailable", "Live Speak checkout is temporarily unavailable.");
    }
  });

  app.post("/live-speak/payment/verify", async (req, res) => {
    try {
      const student = await requireStudent(req, res);
      if (!student) return;
      const reference = String(req.body?.reference || "");
      if (!isValidReference(reference)) return error(res, 400, "invalid_reference", "Invalid payment reference.");
      const intent = await db().collection("liveSpeakPaymentIntents").doc(reference).get();
      if (!intent.exists || intent.data()?.uid !== student.auth.uid) {
        return error(res, 404, "not_found", "Payment reference does not belong to this account.");
      }
      const secret = process.env.PAYSTACK_SECRET;
      if (!secret) return error(res, 503, "payment_unavailable", "Payment verification is unavailable.");
      const check = await fetch("https://api.paystack.co/transaction/verify/" + encodeURIComponent(reference), {
        headers: { Authorization: "Bearer " + secret },
        signal: AbortSignal.timeout(12000),
      });
      const result = await check.json().catch(() => ({}));
      if (!check.ok || !result?.status) return error(res, 503, "verification_failed", "Paystack verification is temporarily unavailable.");
      if (result.data?.status !== "success") return res.json({ ok: false, pending: true });
      const applied = await applyVerifiedPayment({ db: db(), admin, reference, payment: result.data });
      if (!applied.success) return error(res, 409, "payment_mismatch", "Payment information did not match the checkout.");
      return res.json({ ok: true, paid: true, duplicate: Boolean(applied.duplicate) });
    } catch (err) {
      console.error("Live Speak verify error", err?.message);
      return error(res, 503, "verification_unavailable", "Could not verify this payment yet.");
    }
  });

  app.post("/live-speak/session/start", async (req, res) => {
    try {
      if (!requireEnabled(res)) return;
      const student = await requireStudent(req, res);
      if (!student) return;
      if (!process.env.OPENAI_API_KEY) return error(res, 503, "voice_unavailable", "The natural German voice service is not configured.");
      const level = cleanLevel(req.body?.level);
      const subRef = db().collection("liveSpeakSubscriptions").doc(student.auth.uid);
      const sessionRef = db().collection("liveSpeakSessions").doc(student.auth.uid);
      const globalRef = db().collection("liveSpeakUsage").doc(currentMonth());
      let result;
      await db().runTransaction(async (tx) => {
        const [subSnap, sessionSnap, usageSnap] = await Promise.all([
          tx.get(subRef), tx.get(sessionRef), tx.get(globalRef),
        ]);
        if ((Number(usageSnap.data()?.turns) || 0) >= spendingCap()) throw Object.assign(new Error("Pilot spending cap reached."),{status:429,code:"budget_reached"});
        const existing = sessionSnap.data() || {};
        if (existing.sessionId && !existing.endedAt && Date.parse(existing.expiresAt || "") > Date.now()) {
          result = { sessionId: existing.sessionId, expiresAt: existing.expiresAt, resumed: true };
          return;
        }
        const sub = subSnap.data() || {};
        if (!withinWindow(sub) || Number(sub.remaining) <= 0) throw Object.assign(new Error("No active speaking sessions. Purchase a package or use your trial."),{status:402,code:"no_sessions"});
        const sessionId = crypto.randomUUID();
        const expiresAt = addDays(SESSION_MS);
        tx.update(subRef, { remaining: admin.firestore.FieldValue.increment(-1), updatedAt: admin.firestore.FieldValue.serverTimestamp() });
        tx.set(sessionRef, { uid: student.auth.uid, sessionId, level, expiresAt, turnsUsed: 0, inFlight: false, endedAt: null, startedAt: admin.firestore.FieldValue.serverTimestamp() });
        result = { sessionId, expiresAt, resumed: false };
      });
      return res.json({ ok: true, ...result, maxTurns: MAX_TURNS });
    } catch (err) {
      if (err?.status) return error(res, err.status, err.code, err.message);
      console.error("Live Speak session error", err?.message);
      return error(res, 503, "session_unavailable", "Could not start this speaking session.");
    }
  });

  app.post("/live-speak/session/end", async (req, res) => {
    try {
      const student = await requireStudent(req, res);
      if (!student) return;
      const ref = db().collection("liveSpeakSessions").doc(student.auth.uid);
      const snap = await ref.get();
      if (!snap.exists || snap.data()?.sessionId !== req.body?.sessionId) return error(res, 404, "session_missing", "Session not found.");
      await ref.update({ endedAt: admin.firestore.FieldValue.serverTimestamp() });
      return res.json({ ok: true });
    } catch (err) {
      return error(res, 503, "end_unavailable", "Could not end the session.");
    }
  });

  app.post("/live-speak/session/turn", async (req, res) => {
    let sessionRef, globalRef, accepted = false, uid = "";
    try {
      if (!requireEnabled(res)) return;
      const student = await requireStudent(req, res);
      if (!student) return;
      uid = student.auth.uid;
      const sessionId = String(req.body?.sessionId || "");
      const intro = req.body?.intro === true;
      const mime = String(req.body?.mimeType || "").split(";")[0].toLowerCase().trim();
      const payload = String(req.body?.audioBase64 || "");
      if (!intro) {
        if (!VALID_AUDIO.has(mime) || !/^[A-Za-z0-9+/]*={0,2}$/.test(payload) ||
          payload.length < 1000 || payload.length > Math.ceil(MAX_AUDIO_BYTES * 4 / 3) + 4) {
          return error(res, 400, "invalid_audio", "Record a clear German response of up to 20 seconds.");
        }
      } else if (payload) return error(res, 400, "unexpected_audio", "The greeting does not require a recording.");
      const audioBytes = intro ? null : Buffer.from(payload, "base64");
      if (audioBytes && audioBytes.length > MAX_AUDIO_BYTES) return error(res, 413, "audio_too_large", "Recording is too large.");
      sessionRef = db().collection("liveSpeakSessions").doc(uid);
      globalRef = db().collection("liveSpeakUsage").doc(currentMonth());
      let level = "A2";
      await db().runTransaction(async (tx) => {
        const [sessionSnap, usageSnap] = await Promise.all([tx.get(sessionRef), tx.get(globalRef)]);
        const session = sessionSnap.data() || {};
        if (session.sessionId !== sessionId || !sessionId || session.endedAt ||
          Date.parse(session.expiresAt || "") <= Date.now()) {
          throw Object.assign(new Error("Speaking session has ended."), {status:409,code:"session_ended"});
        }
        if (session.inFlight) throw Object.assign(new Error("Finish the current reply first."), {status:409,code:"turn_in_progress"});
        if (Number(session.turnsUsed) >= MAX_TURNS) throw Object.assign(new Error("Maximum turns reached for this session."), {status:429,code:"turn_limit"});
        if ((Number(usageSnap.data()?.turns) || 0) >= spendingCap()) throw Object.assign(new Error("Pilot spending limit reached."), {status:429,code:"budget_reached"});
        level = cleanLevel(session.level);
        tx.update(sessionRef, { inFlight: true, turnsUsed: admin.firestore.FieldValue.increment(1) });
        tx.set(globalRef, { turns: admin.firestore.FieldValue.increment(1), updatedAt: admin.firestore.FieldValue.serverTimestamp() }, {merge:true});
        accepted = true;
      });

      if (!process.env.OPENAI_API_KEY) throw new Error("Live Speak AI is not configured.");
      const client = getOpenAIClient();
      let transcript = "", reply = "";
      if (intro) {
        reply = GERMAN_OPENINGS[level];
      } else {
        const ext = mime === "audio/mp4" ? "m4a" : mime === "audio/ogg" ? "ogg" : mime === "audio/wav" ? "wav" : mime === "audio/mpeg" ? "mp3" : "webm";
        const file = await toFile(audioBytes, "student." + ext, {type:mime});
        const recognition = await client.audio.transcriptions.create({
          file, model: process.env.LIVE_SPEAK_TRANSCRIBE_MODEL || "gpt-4o-mini-transcribe", language: "de",
        });
        transcript = String(recognition?.text || "").trim().slice(0, 600);
        if (!transcript) throw Object.assign(new Error("Could not hear your German clearly. Please try again."),{status:422,code:"transcript_empty"});
        const history = (Array.isArray(req.body?.history) ? req.body.history : [])
          .slice(-6)
          .filter(x => (x?.role === "assistant" || x?.role === "user") && typeof x.text === "string")
          .map(x => ({role:x.role,content:x.text.slice(0,450)}));
        const system = "You are an encouraging native Standard German conversation tutor for CEFR " + level +
          ". Respond ONLY in clear, idiomatic German. After each learner answer, briefly correct at most ONE important grammar or word-choice error; otherwise acknowledge naturally. Then ask exactly ONE relevant follow-up question. Keep replies to 1–3 short sentences, fewer than 280 characters. Remain on the current topic. Do not output markdown or assessment scores.";
        const answer = await client.chat.completions.create({
          model: process.env.LIVE_SPEAK_CHAT_MODEL || "gpt-4o-mini",
          messages: [{role:"system",content:system}, ...history, {role:"user",content:transcript}],
          max_tokens: 160, temperature:0.5,
        });
        reply = String(answer?.choices?.[0]?.message?.content || "").trim().slice(0, 420);
        if (!reply) throw new Error("The speaking tutor could not reply.");
      }
      const audio = await client.audio.speech.create({
        model: process.env.LIVE_SPEAK_TTS_MODEL || "gpt-4o-mini-tts",
        voice: process.env.LIVE_SPEAK_TTS_VOICE || "marin",
        input: reply,
        response_format: "mp3",
        instructions: "Speak as a warm, fluent native speaker of Standard German (Hochdeutsch). Natural intonation and clear, authentic pronunciation. Speak a little slower for beginners, without sounding robotic.",
      });
      const mp3 = Buffer.from(await audio.arrayBuffer());
      if (!mp3.length || mp3.length > 1500000) throw new Error("The voice response is too large.");
      await sessionRef.update({ inFlight: false });
      return res.json({ ok:true, transcript, reply, audioBase64: mp3.toString("base64"), mimeType:"audio/mpeg" });
    } catch (err) {
      // Provider calls may already have incurred costs. Keep the metered turn and
      // global spend counter, even on provider errors, to prevent unlimited retries.
      if (accepted && sessionRef) {
        try { await sessionRef.update({ inFlight: false }); }
        catch (releaseError) { console.error("Live Speak lock release failed", releaseError?.message); }
      }
      if (err?.status) return error(res, err.status, err.code, err.message);
      console.error("Live Speak turn error", err?.message);
      return error(res, 503, "voice_unavailable", "Live Speak could not complete this turn. Please try again.");
    }
  });
}

async function handleLiveSpeakWebhook({ db, admin, data }) {
  // Only signed, already-validated Paystack webhooks reach this handler.
  if (data?.metadata?.product !== "falowen_live_speak_basic") return {handled:false};
  return applyVerifiedPayment({db,admin,reference:String(data.reference || ""),payment:data});
}
module.exports = {
  registerLiveSpeakRoutes,
  handleLiveSpeakWebhook,
  applyVerifiedPayment,
  PRICE_GHS, BASIC_SESSIONS, MAX_TURNS,
};
