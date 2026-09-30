const admin = require("firebase-admin");

const COLLECTION = "admissionsEngagement";
const EVENTS = ["brochure_open", "visitor_guide_open", "registration_click"];

const clean = (value, max = 160) => String(value || "").trim().slice(0, max);
const validRef = (value) => /^[a-zA-Z0-9_-]{8,80}$/.test(clean(value, 80));

function cors(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("Cache-Control", "no-store");
}

function eventDocId(ref, event) {
  return `${ref}__${event}`;
}

function parseBody(req) {
  if (req?.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) return req.body;
  const raw = Buffer.isBuffer(req?.body) ? req.body.toString("utf8") : clean(req?.body, 5000);
  if (!raw) return {};
  try { return JSON.parse(raw); } catch (_error) { return {}; }
}

async function recordEvent(body = {}) {
  const ref = clean(body.ref, 80);
  const event = clean(body.event, 40);
  if (!validRef(ref)) throw Object.assign(new Error("Invalid engagement reference"), { status: 400 });
  if (!EVENTS.includes(event)) throw Object.assign(new Error("Invalid engagement event"), { status: 400 });

  const db = admin.firestore();
  const doc = db.collection(COLLECTION).doc(eventDocId(ref, event));
  const now = admin.firestore.FieldValue.serverTimestamp();
  await db.runTransaction(async (transaction) => {
    const snapshot = await transaction.get(doc);
    const payload = {
      ref,
      event,
      classSlug: clean(body.classSlug, 120),
      source: clean(body.source, 80),
      path: clean(body.path, 240),
      lastSeenAt: now,
      count: admin.firestore.FieldValue.increment(1),
    };
    if (!snapshot.exists) payload.firstSeenAt = now;
    transaction.set(doc, payload, { merge: true });
  });

  return { ok: true, ref, event };
}

async function getStatus(ref) {
  if (!validRef(ref)) throw Object.assign(new Error("Invalid engagement reference"), { status: 400 });
  const db = admin.firestore();
  const snapshots = await Promise.all(EVENTS.map((event) => db.collection(COLLECTION).doc(eventDocId(ref, event)).get()));
  const status = {};
  snapshots.forEach((snapshot, index) => {
    const event = EVENTS[index];
    const data = snapshot.exists ? snapshot.data() || {} : {};
    status[event] = {
      seen: snapshot.exists,
      count: Number(data.count || 0),
      classSlug: clean(data.classSlug, 120),
      lastSeenAt: typeof data.lastSeenAt?.toDate === "function" ? data.lastSeenAt.toDate().toISOString() : null,
    };
  });
  return { ok: true, ref, status };
}

async function admissionsEngagementHandler(req, res) {
  cors(res);
  if (req.method === "OPTIONS") return res.status(204).end();

  try {
    if (req.method === "POST") {
      return res.status(200).json(await recordEvent(parseBody(req)));
    }
    if (req.method === "GET") {
      const ref = clean(req.query?.ref || new URL(req.url, "https://www.falowen.app").searchParams.get("ref"), 80);
      return res.status(200).json(await getStatus(ref));
    }
    return res.status(405).json({ ok: false, error: "Method not allowed" });
  } catch (error) {
    console.error("admissions engagement error", error);
    return res.status(error?.status || 500).json({ ok: false, error: error?.message || "Could not process engagement" });
  }
}

module.exports = {
  admissionsEngagementHandler,
  recordEvent,
  getStatus,
  EVENTS,
  validRef,
  parseBody,
};
