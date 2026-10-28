"use strict";
// Private course-listening publishing. MP3 transfer and marking do not call Gemini.
const crypto = require("node:crypto");
const { getR2AudioConfig } = require("./r2CourseAudio");
const { lessonCatalog } = require("../data/lessonCatalog");

const OWNER_SHA256 = "e8bc09aac410e86216e384ab4c612d6ac6551273085f8344206b23f4004f90a1";
const LEVELS = new Set(["A1", "A2", "B1"]);
const KINDS = new Set(["richtig-falsch", "multiple-choice"]);
const MAX_AUDIO_BYTES = 6 * 1024 * 1024;
const normalizeEvidence = value => String(value || "").normalize("NFKC").replace(/\s+/g, " ").trim().toLocaleLowerCase("de-DE");

function isPublisherOwner(uid, env = process.env) {
  const configured = String(env.HOEREN_STUDIO_OWNER_UID || "").trim();
  if (configured) return uid === configured;
  const digest = crypto.createHash("sha256").update(String(uid || "")).digest();
  return crypto.timingSafeEqual(digest, Buffer.from(OWNER_SHA256, "hex"));
}

function getPublishableLessons() {
  const byKey = new Map();
  for (const entry of lessonCatalog) {
    const level = String(entry.level || "").toUpperCase();
    const assignmentKey = String(entry.assignmentId || "").toUpperCase();
    const day = Number(entry.day);
    if (!LEVELS.has(level) || !new RegExp("^" + level + "-[0-9]{1,2}(?:\\.[0-9]{1,2})?$").test(assignmentKey)
      || !Number.isInteger(day) || day < 1 || day > 60 ||
      !entry.workbookRoute || entry.contentStatus !== "published") continue;
    const item = { level, day, assignmentKey, title: String(entry.title || ""), route: String(entry.workbookRoute || "") };
    byKey.set(assignmentKey, item);
  }
  return [...byKey.values()].sort((a, b) => a.level.localeCompare(b.level) || a.day - b.day || a.assignmentKey.localeCompare(b.assignmentKey));
}

function normaliseAssignmentId(id) {
  const raw = String(id || "").trim().toUpperCase();
  if (!/^(A1|A2|B1|B2)-[0-9]{1,2}(?:\.[0-9]{1,2})?$/.test(raw)) {
    throw new Error("Choose a valid existing Falowen assignment ID.");
  }
  return raw;
}

function validateQuestions(questions, kind, script) {
  if (!KINDS.has(kind)) throw new Error("Select Richtig/Falsch or multiple choice.");
  if (!Array.isArray(questions) || questions.length !== 5) throw new Error("Review exactly five listening questions.");
  const fullScript = normalizeEvidence(script);
  if (fullScript.length < 35 || fullScript.length > 7500) throw new Error("A reviewed dialogue script is required.");
  return questions.map((item, index) => {
    const question = String(item?.question || "").trim();
    const evidence = String(item?.evidence || "").trim();
    if (question.length < 8 || question.length > 320 || evidence.length < 6 || evidence.length > 320 ||
        !fullScript.includes(normalizeEvidence(evidence))) {
      throw new Error(`Question ${index + 1}: provide a question and an exact supporting quote from the script.`);
    }
    if (kind === "richtig-falsch") {
      const answer = String(item.answer || "").trim();
      if (!["Richtig", "Falsch"].includes(answer)) throw new Error(`Question ${index + 1}: choose Richtig or Falsch.`);
      return { question, evidence, answer };
    }
    const options = Array.isArray(item.options) ? item.options.map(v => String(v || "").trim()) : [];
    const correctIndex = Number(item.correctIndex);
    if (options.length !== 3 || options.some(v => v.length < 1 || v.length > 140) ||
        new Set(options.map(v => v.toLowerCase())).size !== 3 ||
        !Number.isInteger(correctIndex) || correctIndex < 0 || correctIndex > 2) {
      throw new Error(`Question ${index + 1}: choose three distinct answers and one correct answer.`);
    }
    return { question, evidence, options, correctIndex };
  });
}

function validatePublication(input, audio) {
  const assignmentKey = normaliseAssignmentId(input.assignmentKey);
  const level = String(input.level || "").trim().toUpperCase();
  if (!LEVELS.has(level) || !assignmentKey.startsWith(`${level}-`)) throw new Error("Assignment and level must match.");
  const day = Number(input.day);
  if (!Number.isInteger(day) || day < 1 || day > 60) throw new Error("Choose a valid Course Book day.");
  if (!getPublishableLessons().some(item => item.level === level && item.day === day && item.assignmentKey === assignmentKey)) {
    throw new Error("Select an existing published Falowen Course Book assignment and its correct day.");
  }
  const title = String(input.title || "").trim();
  const script = String(input.script || "").trim();
  const kind = String(input.kind || "").trim();
  if (title.length < 5 || title.length > 180) throw new Error("Add a short lesson title.");
  if (input.teacherApproved !== true) throw new Error("Listen to the MP3 and approve every question before publishing.");
  if (!Buffer.isBuffer(audio) || audio.length < 1024 || audio.length > MAX_AUDIO_BYTES ||
      !(audio.subarray(0, 3).toString("ascii") === "ID3" || (audio[0] === 0xff && (audio[1] & 0xe0) === 0xe0))) {
    throw new Error("Upload a valid MP3 under 6 MB.");
  }
  return { assignmentKey, level, day, title, script, kind, questions: validateQuestions(input.questions, kind, script) };
}

const awsEncode = v => encodeURIComponent(String(v)).replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16).toUpperCase()}`);
const encodePath = value => value.split("/").map(awsEncode).join("/");
const hmac = (key, value) => crypto.createHmac("sha256", key).update(value).digest();
function signedStudioUrl({ method = "GET", key, env = process.env, now = new Date(), expires = 900 }) {
  // Only two approved music files can be signed for public GET playback.
  // Keep studio uploads and all private Hören key patterns restricted.
  const approvedMusic = method === "GET" && (
    key === "music/a1/day-22/mein-kopf-tut-weh.mp3"
    || key === "music/a2/die-karte-funktioniert-nicht.mp3"
  );
  const isStudioKey = /^(a1|a2|b1)\/studio\/[a-z0-9.-]+\/[a-f0-9-]{36}\.mp3$/.test(key);
  if ((!isStudioKey && !approvedMusic) || !["GET", "PUT"].includes(method)) {
    throw new Error("Invalid private studio or approved music object path.");
  }
  const { accountId, accessKeyId, secretAccessKey, bucket } = getR2AudioConfig(env);
  const stamp = now.toISOString().replace(/[:-]|\.\d{3}/g, "");
  const date = stamp.slice(0, 8);
  const host = `${bucket}.${accountId}.r2.cloudflarestorage.com`;
  const scope = `${date}/auto/s3/aws4_request`;
  const query = [
    ["X-Amz-Algorithm", "AWS4-HMAC-SHA256"],
    ["X-Amz-Content-Sha256", "UNSIGNED-PAYLOAD"],
    ["X-Amz-Credential", `${accessKeyId}/${scope}`],
    ["X-Amz-Date", stamp],
    ["X-Amz-Expires", String(expires)],
    ["X-Amz-SignedHeaders", "host"],
  ].map(([k,v]) => [awsEncode(k), awsEncode(v)]).sort((a,b) => a[0].localeCompare(b[0])).map(([k,v]) => `${k}=${v}`).join("&");
  const canonical = [method, `/${encodePath(key)}`, query, `host:${host}\n`, "host", "UNSIGNED-PAYLOAD"].join("\n");
  const stringToSign = ["AWS4-HMAC-SHA256", stamp, scope, crypto.createHash("sha256").update(canonical).digest("hex")].join("\n");
  const signingKey = hmac(hmac(hmac(hmac(`AWS4${secretAccessKey}`, date), "auto"), "s3"), "aws4_request");
  const signature = crypto.createHmac("sha256", signingKey).update(stringToSign).digest("hex");
  return `https://${host}/${encodePath(key)}?${query}&X-Amz-Signature=${signature}`;
}

async function publishHoerenLesson({ db, metadata, audio, uid, env = process.env, fetchImpl = fetch }) {
  if (!isPublisherOwner(uid, env)) throw new Error("Owner access required.");
  const data = validatePublication(metadata, audio);
  const revision = crypto.randomUUID();
  const objectKey = `${data.level.toLowerCase()}/studio/${data.assignmentKey.toLowerCase()}/${revision}.mp3`;
  const url = signedStudioUrl({ method: "PUT", key: objectKey, env });
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25000);
  try {
    const uploaded = await fetchImpl(url, {
      method: "PUT", headers: { "Content-Type": "audio/mpeg" }, body: audio, signal: controller.signal,
    });
    if (!uploaded.ok) throw new Error(`Cloudflare R2 upload failed (${uploaded.status}). Nothing was published.`);
  } finally { clearTimeout(timeout); }
  const document = {
    ...data, revision, objectKey,
    audioSha256: crypto.createHash("sha256").update(audio).digest("hex"),
    publishedBy: uid, publishedAt: new Date().toISOString(), status: "published",
  };
  const root = db.collection("publishedHoerenLessons").doc(data.assignmentKey);
  // Save a recoverable immutable revision before updating the active lesson.
  await root.collection("revisions").doc(revision).create(document);
  await root.set(document);
  return { assignmentKey: data.assignmentKey, revision, objectKey, day: data.day, level: data.level };
}

const toStudentLesson = (data, url) => ({
  assignmentKey: data.assignmentKey, title: data.title, level: data.level,
  day: data.day, kind: data.kind, revision: data.revision, audioUrl: url,
  questions: data.questions.map(({ question, options }, index) => ({
    id: index + 1, question, ...(options ? { options } : {}),
  })),
});

function scoreHoerenLesson(lesson, submitted) {
  if (!Array.isArray(submitted) || submitted.length !== 5) throw new Error("Answer all five questions.");
  const normalized = lesson.questions.map((q, index) => {
    const answer = submitted[index];
    if (lesson.kind === "richtig-falsch") {
      if (!["Richtig", "Falsch"].includes(answer)) throw new Error("Select Richtig or Falsch for each question.");
      return answer === q.answer;
    }
    if (!Number.isInteger(answer) || answer < 0 || answer > 2) throw new Error("Select one of the three choices.");
    return answer === q.correctIndex;
  });
  return { correct: normalized.filter(Boolean).length, total: 5, score: normalized.filter(Boolean).length * 20 };
}

module.exports = { getPublishableLessons, isPublisherOwner, normaliseAssignmentId, validateQuestions, validatePublication, signedStudioUrl, publishHoerenLesson, toStudentLesson, scoreHoerenLesson };
