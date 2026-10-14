/*
 * Falowen Live Speak voice-only pilot. NO PAYMENT INTEGRATION.
 * Access requires BOTH an explicit server feature flag and an approved Firebase UID.
 * Session allowances and provider usage are verified on the server.
 */
const crypto = require("crypto");
const { toFile } = require("openai");
const { getOpenAIClient } = require("./openaiClient");

const PILOT_SESSIONS = 2;
const SESSION_MS = 5 * 60 * 1000;
const PILOT_MS = 7 * 24 * 60 * 60 * 1000;
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
const approvedTester = (uid) => Boolean(uid) && String(process.env.LIVE_SPEAK_TESTER_UIDS || "").split(",").map(x=>x.trim()).filter(Boolean).includes(uid);
const spendingCap = () => {
  const configured = Number(process.env.LIVE_SPEAK_MONTHLY_TURN_CAP);
  return Number.isSafeInteger(configured) && configured >= 1 && configured <= 500 ? configured : 40;
};
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
  remaining: withinWindow(sub) ? Math.max(0, Number(sub.remaining) || 0) : 0,
  expiresAt: withinWindow(sub) ? sub.expiresAt : null,
  pilotClaimed: Boolean(sub?.pilotClaimed),
});

function registerLiveSpeakRoutes(app, { admin, getAuthedUser, findStudentByCodeOrEmail }) {
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
  const requireApprovedTester = (student, res) => {
    if (approvedTester(student.auth.uid)) return true;
    error(res, 403, "not_approved", "This pilot is currently available only to approved testers.");
    return false;
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
      const approved = approvedTester(student.auth.uid);
      const pilot = approved
        ? await db().collection("liveSpeakPilotCredits").doc(student.auth.uid).get()
        : null;
      const usage = approved ? await db().collection("liveSpeakUsage").doc(currentMonth()).get() : null;
      const currentSession = approved
        ? await db().collection("liveSpeakSessions").doc(student.auth.uid).get()
        : null;
      const running = currentSession?.data() || {};
      const active = running.sessionId && !running.endedAt && Date.parse(running.expiresAt || "") > Date.now();
      const info = receiptStatus(pilot?.data());
      return res.json({
        enabled: enabled(), approved, pilotAvailable: approved && enabled() && !info.pilotClaimed,
        sessionMinutes: 5, maxTurns: MAX_TURNS, ...info,
        capReached: (Number(usage?.data()?.turns) || 0) >= spendingCap(),
        activeSession: active && enabled() ? {
          sessionId: running.sessionId, expiresAt: running.expiresAt, resumed: true,
        } : null,
      });
    } catch (err) {
      console.error("Live Speak status error", err?.message);
      return error(res, 503, "status_unavailable", "Could not check Live Speak pilot access.");
    }
  });

  // A single short free allocation for explicitly allowlisted testers. No payments.
  app.post("/live-speak/pilot/claim", async (req, res) => {
    try {
      if (!requireEnabled(res)) return;
      const student = await requireStudent(req, res);
      if (!student || !requireApprovedTester(student, res)) return;
      if (!process.env.OPENAI_API_KEY) return error(res, 503, "voice_unavailable", "The voice service is not configured.");
      const usage = await db().collection("liveSpeakUsage").doc(currentMonth()).get();
      if ((Number(usage.data()?.turns) || 0) + PILOT_SESSIONS * MAX_TURNS > spendingCap()) {
        return error(res, 429, "budget_reached", "The pilot usage limit has been reached.");
      }
      const ref = db().collection("liveSpeakPilotCredits").doc(student.auth.uid);
      let claimed = false;
      await db().runTransaction(async (tx) => {
        const snap = await tx.get(ref);
        if (snap.data()?.pilotClaimed) return;
        tx.set(ref, {
          uid: student.auth.uid, remaining: PILOT_SESSIONS,
          expiresAt: addDays(PILOT_MS), pilotClaimed: true,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
        claimed = true;
      });
      if (!claimed) return error(res, 409, "already_claimed", "Your pilot sessions were already claimed.");
      return res.json({ ok: true, sessions: PILOT_SESSIONS });
    } catch (err) {
      console.error("Live Speak pilot access error", err?.message);
      return error(res, 503, "pilot_unavailable", "Could not activate pilot sessions.");
    }
  });

  app.post("/live-speak/session/start", async (req, res) => {
    try {
      if (!requireEnabled(res)) return;
      const student = await requireStudent(req, res);
      if (!student || !requireApprovedTester(student, res)) return;
      if (!process.env.OPENAI_API_KEY) return error(res, 503, "voice_unavailable", "The natural German voice service is not configured.");
      const level = cleanLevel(req.body?.level);
      const subRef = db().collection("liveSpeakPilotCredits").doc(student.auth.uid);
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
        if (!withinWindow(sub) || Number(sub.remaining) <= 0) throw Object.assign(new Error("No pilot sessions remain. The pilot does not charge students."),{status:402,code:"no_sessions"});
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
      if (!student || !requireApprovedTester(student, res)) return;
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
    let sessionRef, accepted = false, uid = "";
    try {
      if (!requireEnabled(res)) return;
      const student = await requireStudent(req, res);
      if (!student || !requireApprovedTester(student, res)) return;
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
      const globalRef = db().collection("liveSpeakUsage").doc(currentMonth());
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

module.exports = { registerLiveSpeakRoutes, approvedTester, MAX_TURNS, PILOT_SESSIONS };