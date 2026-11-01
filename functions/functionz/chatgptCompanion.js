"use strict";

// Falowen ChatGPT learning companion: read-only MCP with OAuth 2.1 + PKCE.
// Opaque hashed Firestore tokens keep private student data out of the URL and logs.
const express = require("express");
const crypto = require("crypto");
const { getAssignmentSummary } = require("./routes/scoresSummaryCoursePlan");
const { getCurriculumEntriesForLevel } = require("../data/curriculumManifest");
const { getScoresForStudent } = require("./scoresSheet");

const SITE = "https://www.falowen.app";
const ISSUER = SITE + "/api/chatgpt";
const RESOURCE = ISSUER + "/mcp";
const SCOPE = "falowen:read";
const CLIENT_ID = "https://chatgpt.com/oauth/client.json";
const CALLBACK = "https://chatgpt.com/connector_platform_oauth_redirect";
const AUTH_CODE_MS = 5 * 60 * 1000;
const ACCESS_MS = 60 * 60 * 1000;
const REFRESH_MS = 30 * 24 * 60 * 60 * 1000;
const MAX_RESULT_ROWS = 40;

const sha256 = (v) => crypto.createHash("sha256").update(String(v)).digest("hex");
const randomToken = () => crypto.randomBytes(32).toString("base64url");
const normalize = (v) => String(v || "").trim();
// Keep the student level from the live Falowen record. B2/C1 are self-study courses.
const normalizeLevel = (v) => (normalize(v).toUpperCase().match(/\b(A1|A2|B1|B2|C1|C2)\b/) || [])[1] || "";
const SELF_STUDY_LEVELS = new Set(["B2", "C1", "C2"]);
const numberOrNull = (v) => v === null || v === undefined || v === "" || !Number.isFinite(Number(v)) ? null : Number(v);
const isExpired = (value) => {
  const ms = value && typeof value.toMillis === "function" ? value.toMillis() : new Date(value).getTime();
  return !Number.isFinite(ms) || ms <= Date.now();
};

function oauthParameters(input) {
  const params = {
    response_type: normalize(input.response_type),
    client_id: normalize(input.client_id),
    redirect_uri: normalize(input.redirect_uri),
    code_challenge: normalize(input.code_challenge),
    code_challenge_method: normalize(input.code_challenge_method),
    scope: normalize(input.scope),
    resource: normalize(input.resource),
    state: normalize(input.state),
  };
  if (params.response_type !== "code" || params.client_id !== CLIENT_ID ||
      params.redirect_uri !== CALLBACK || params.code_challenge_method !== "S256" ||
      !/^[A-Za-z0-9_-]{43,128}$/.test(params.code_challenge) ||
      params.resource !== RESOURCE || !params.scope.split(/\s+/).includes(SCOPE) ||
      !params.state || params.state.length > 1024) {
    return null;
  }
  return params;
}

function safeStudentAccess(student) {
  if (!student || normalize(student.accountType).toLowerCase() === "exam_only") return false;
  const role = normalize(student.role || "student").toLowerCase();
  if (role !== "student" || student.isTutor === true) return false;
  const status = normalize(student.status).toLowerCase();
  if (status && !["active", "paid", "partial", "pending", "enrolled", "registered",
    "ongoing", "current", "trial_active"].includes(status)) return false;
  const payment = normalize(student.paymentStatus).toLowerCase();
  if (["failed", "overdue", "rejected", "cancelled", "canceled"].includes(payment)) return false;
  if (student.contractEnd && !isNaN(new Date(student.contractEnd.toDate ? student.contractEnd.toDate() : student.contractEnd).getTime()) &&
      isExpired(student.contractEnd)) return false;
  if (["expired", "ended", "used"].includes(normalize(student.trialStatus).toLowerCase()) &&
      !["paid", "partial"].includes(payment) && !(Number(student.paid || student.paidAmount || 0) > 0)) return false;
  if (student.trialEndsAt && isExpired(student.trialEndsAt) &&
      !["paid", "partial"].includes(payment) && !(Number(student.paid || student.paidAmount || 0) > 0)) return false;
  return true;
}

async function studentForIdentity(admin, identity, boundId) {
  const db = admin.firestore();
  const deletion = await db.collection("accountDeletionRequests").doc(identity.uid).get();
  if (["pending", "processing", "completed"].includes(deletion.data()?.status)) return null;
  const students = db.collection("students");
  let snap;
  if (boundId) {
    snap = await students.doc(boundId).get();
  } else {
    const direct = await students.doc(identity.uid).get();
    if (direct.exists) snap = direct;
    if (!snap) {
      const byUid = await students.where("uid", "==", identity.uid).limit(1).get();
      if (!byUid.empty) snap = byUid.docs[0];
    }
    if (!snap && identity.email && identity.email_verified) {
      const byEmail = await students.where("email", "==", identity.email.toLowerCase()).limit(1).get();
      if (!byEmail.empty) snap = byEmail.docs[0];
    }
  }
  if (!snap?.exists) return null;
  const data = snap.data() || {};
  const linkedUid = normalize(data.uid);
  if (linkedUid && linkedUid !== identity.uid) return null;
  if (!linkedUid) {
    const linkedEmail = normalize(data.authEmail || data.loginEmail || data.email).toLowerCase();
    if (!identity.email_verified || !linkedEmail || linkedEmail !== normalize(identity.email).toLowerCase()) return null;
  }
  if (!safeStudentAccess(data)) return null;
  return { id: snap.id, data };
}

function studentView(student) {
  const data = student.data;
  return {
    name: normalize(data.name || data.fullName || data.displayName) || "Student",
    level: normalizeLevel(data.level || data.course),
    campusUrl: SITE + "/campus",
  };
}

function lessonUrl(level, item) {
  const day = Number(item.dayNumber || item.day || item.displayDay);
  if (!Number.isInteger(day) || day < 1 || day > 50) return SITE + "/campus/course";
  const chapter = normalize(item.displayChapter || item.chapter);
  const suffix = chapter ? "?chapter=" + encodeURIComponent(chapter) : "";
  return SITE + "/campus/course/lesson/" + encodeURIComponent(level) + "/" + day + suffix;
}

function scoreRowsForStudent(rows, level) {
  return (Array.isArray(rows) ? rows : []).filter((row) =>
    !normalizeLevel(row.level) || normalizeLevel(row.level) === level
  ).slice(0, 500).map((row) => ({
    assignmentId: normalize(row.assignment_id || row.assignmentId).toUpperCase(),
    assignment: normalize(row.assignment).slice(0, 150),
    score: numberOrNull(row.score),
    feedback: normalize(row.comments).slice(0, 1200),
    date: normalize(row.date).slice(0, 40),
  }));
}

function summarizeStudentAssignments(student, rows) {
  const level = studentView(student).level;
  if (!level) return { error: "No supported course level is assigned to this account.", campusUrl: SITE + "/campus" };

  if (SELF_STUDY_LEVELS.has(level)) {
    // Do not label B2/C1/C2 lessons "missing assignments" or synthesize a tutor score.
    // These courses use learner-led lesson completion, which can be device-local.
    const source = getCurriculumEntriesForLevel(level) || [];
    const days = new Map();
    source.forEach((entry) => {
      const day = Number(entry.day ?? entry.assignmentDay ?? entry.displayDay);
      if (!Number.isInteger(day) || day < 1 || day > 50) return;
      if (!days.has(day) || (entry.progressionEligible && !days.get(day).progressionEligible)) {
        days.set(day, entry);
      }
    });
    const lessons = [...days.entries()].sort(([a], [b]) => a - b).map(([day, entry]) => ({
      day,
      title: normalize(entry.lessonTitle || entry.topic || entry.title || "Lesson").slice(0, 180),
      goal: normalize(entry.goal).slice(0, 500),
      grammarFocus: normalize(entry.grammar_topic || entry.grammarFocus).slice(0, 250),
      status: "self_study",
      completionVerified: false,
      lessonUrl: lessonUrl(level, { dayNumber: day, displayChapter: entry.displayChapter || entry.chapter }),
    }));
    return {
      level,
      courseMode: "self_study",
      totalCourseItems: lessons.length,
      totalSelfStudyLessons: lessons.length,
      totalTutorAssignments: 0,
      completedCount: null,
      completionAvailable: false,
      clarification: lessons.length
        ? "These are your self-study Course Book lessons, not tutor-submission assignments. ChatGPT cannot verify device-local completion; use Falowen Campus to review actual progress."
        : "The self-study course is recognised, but its lesson catalogue is not yet available to this plugin. Open Falowen Campus for the latest lessons.",
      assignments: lessons,
      campusUrl: SITE + "/campus/course",
    };
  }

  const { lessons, totalCourseItems } = getAssignmentSummary(level);
  const graded = scoreRowsForStudent(rows, level);
  const byId = new Map();
  for (const row of graded) {
    if (!row.assignmentId || row.score === null) continue;
    const prior = byId.get(row.assignmentId);
    if (!prior || row.score > prior.score) byId.set(row.assignmentId, row);
  }
  const required = lessons.filter((lesson) => lesson.submissionRequired && lesson.assignmentId);
  const assignments = required.map((lesson) => {
    const result = byId.get(normalize(lesson.assignmentId).toUpperCase());
    return {
      assignmentId: lesson.assignmentId,
      day: lesson.dayNumber,
      title: lesson.title,
      goal: lesson.goal,
      status: !result ? "no_grade_recorded" : result.score >= 60 ? "passed" : "needs_review",
      bestRecordedScore: result?.score ?? null,
      submissionUrl: lessonUrl(level, lesson),
    };
  });
  const passed = assignments.filter((a) => a.status === "passed").length;
  const needsReview = assignments.filter((a) => a.status === "needs_review").length;
  const noGradeRecorded = assignments.filter((a) => a.status === "no_grade_recorded").length;
  return {
    level, totalCourseItems, totalTutorAssignments: assignments.length,
    passed, needsReview, noGradeRecorded,
    clarification: "No grade recorded does not prove the assignment is unsubmitted. Official submission and marking remain on Falowen Campus.",
    assignments,
  };
}

const toolDefinitions = [
  {
    name: "get_my_falowen_profile",
    description: "Identify my connected Falowen student profile and course level without exposing student numbers or private records.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
    outputSchema: {
      type: "object", properties: {
        id: { type: "string", minLength: 1, pattern: "\\S" },
        name: { type: "string" },
        nickname: { type: "string" },
      },
      required: ["id"], additionalProperties: false,
    },
    _meta: { "openai/profile": true },
  },
  {
    name: "get_my_falowen_assignments",
    description: "List my course work and Campus lesson links. A1–B1 have tutor-marked assignments; B2–C2 show self-study lessons without inventing submission or completion status.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_my_falowen_progress",
    description: "Summarize my recorded A1–B1 tutor-assignment completion; for B2–C2 explain that self-study completion is not verified from this connection.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_my_falowen_feedback",
    description: "Retrieve my most recent tutor-marked assignment scores and feedback, not other students' data.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_my_falowen_lesson",
    description: "Retrieve the topic, learning goal and Campus link for a day in my assigned course. Use to guide practice, not to submit official work.",
    inputSchema: {
      type: "object", properties: { day: { type: "integer", minimum: 1, maximum: 50, description: "Lesson day in the student's enrolled course." } },
      required: ["day"], additionalProperties: false,
    },
  },
].map((tool) => ({
  ...tool, annotations: { readOnlyHint: true, destructiveHint: false, openWorldHint: false },
  securitySchemes: [{ type: "oauth2", scopes: [SCOPE] }],
  _meta: { ...(tool._meta || {}) },
}));

async function callTool(name, args, student) {
  const view = studentView(student);
  if (name === "get_my_falowen_profile") return {
    id: "flw_" + sha256(student.id).slice(0, 32),
    name: view.name,
    nickname: view.level ? "Falowen " + view.level + " student" : "Falowen student",
  };
  if (name === "get_my_falowen_lesson") {
    if (!Number.isInteger(args?.day) || args.day < 1 || args.day > 50) throw new Error("day must be an integer between 1 and 50");
    if (!view.level) return { error: "Course level is not available." };
    const lessons = getCurriculumEntriesForLevel(view.level);
    const matching = lessons.filter((entry) =>
      Number(entry.day ?? entry.assignmentDay ?? entry.displayDay) === args.day);
    const entry = matching.find((x) => x.assignment === true) || matching[0];
    if (!entry) return { error: "Lesson not found for this course and day.", level: view.level };
    return {
      level: view.level, day: args.day,
      title: normalize(entry.topic || entry.title).slice(0, 180),
      goal: normalize(entry.goal).slice(0, 600),
      grammarFocus: normalize(entry.grammar_topic || entry.grammarFocus).slice(0, 200),
      lessonUrl: lessonUrl(view.level, { dayNumber: args.day, displayChapter: entry.displayChapter || entry.chapter }),
      guidance: "Explain concepts and offer short original practice questions. Do not complete graded coursework for the learner.",
    };
  }
  if (!view.level) return { error: "No supported course level is assigned to this account." };

  // Lesson lists and self-study progress should not depend on Google Sheets
  // or incur a scores query for B2/C1/C2.
  if (SELF_STUDY_LEVELS.has(view.level) && name !== "get_my_falowen_feedback") {
    const summary = summarizeStudentAssignments(student, []);
    if (name === "get_my_falowen_progress") {
      const { assignments, ...result } = summary;
      return result;
    }
    if (name === "get_my_falowen_assignments") {
      return { ...summary, assignments: summary.assignments.slice(0, MAX_RESULT_ROWS) };
    }
  }

  const studentCode = normalize(student.data.studentCode || student.data.studentcode || student.id);
  let rows;
  try {
    rows = await getScoresForStudent(studentCode);
  } catch (error) {
    if (!SELF_STUDY_LEVELS.has(view.level)) throw error;
    return {
      level: view.level, recentFeedback: [],
      clarification: "The tutor score sheet is unavailable. This does not mean your self-study lessons are incomplete. Use Falowen Campus for progress.",
      campusUrl: SITE + "/campus",
    };
  }
  if (name === "get_my_falowen_feedback") {
    return {
      level: view.level,
      recentFeedback: scoreRowsForStudent(rows, view.level).reverse().slice(0, 8),
      clarification: "Only officially recorded scores and feedback appear here.",
    };
  }
  const summary = summarizeStudentAssignments(student, rows);
  if (name === "get_my_falowen_progress") {
    const { assignments, ...result } = summary;
    return { ...result, campusUrl: SITE + "/campus" };
  }
  if (name === "get_my_falowen_assignments") return {
    ...summary, assignments: (summary.assignments || []).slice(0, MAX_RESULT_ROWS),
  };
  throw new Error("Unknown tool");
}

function makeRouter(admin) {
  const router = express.Router();
  router.use((_req, res, next) => { res.setHeader("Cache-Control", "no-store"); res.setHeader("X-Content-Type-Options", "nosniff"); next(); });

  router.get("/.well-known/oauth-protected-resource", (_req, res) => res.json({
    resource: RESOURCE, authorization_servers: [ISSUER], scopes_supported: [SCOPE],
    resource_documentation: SITE + "/help",
  }));
  router.get("/.well-known/oauth-authorization-server", (_req, res) => res.json({
    issuer: ISSUER, authorization_endpoint: ISSUER + "/authorize",
    token_endpoint: ISSUER + "/token",
    response_types_supported: ["code"], grant_types_supported: ["authorization_code", "refresh_token"],
    code_challenge_methods_supported: ["S256"], scopes_supported: [SCOPE],
    token_endpoint_auth_methods_supported: ["none"], client_id_metadata_document_supported: true,
    authorization_response_iss_parameter_supported: true,
  }));

  router.get("/authorize", (req, res) => {
    const params = oauthParameters(req.query);
    if (!params) return res.status(400).json({ error: "Invalid OAuth authorization request" });
    const qs = new URLSearchParams(params);
    return res.redirect(302, SITE + "/chatgpt/connect?" + qs.toString());
  });

  router.post("/approve", async (req, res) => {
    const params = oauthParameters(req.body || {});
    const idToken = normalize(req.body?.idToken);
    if (!params || !idToken) return res.status(400).json({ error: "Invalid authorization request" });
    try {
      const user = await admin.auth().verifyIdToken(idToken, true);
      const student = await studentForIdentity(admin, user);
      if (!student) return res.status(403).json({ error: "An active Falowen student account is required." });
      const code = randomToken();
      await admin.firestore().collection("chatgptOauthCodes").doc(sha256(code)).set({
        uid: user.uid, email: normalize(user.email).toLowerCase(),
        emailVerified: user.email_verified === true, studentId: student.id,
        clientId: params.client_id, redirectUri: params.redirect_uri,
        challenge: params.code_challenge, resource: RESOURCE, scope: SCOPE,
        expiresAt: new Date(Date.now() + AUTH_CODE_MS),
      });
      const url = new URL(CALLBACK);
      url.searchParams.set("code", code);
      url.searchParams.set("state", params.state);
      url.searchParams.set("iss", ISSUER);
      return res.json({ redirectUrl: url.toString() });
    } catch (_error) {
      return res.status(401).json({ error: "Please sign in to Falowen again." });
    }
  });

  const issueTokens = async (uid, studentId, email, emailVerified) => {
    const accessToken = randomToken();
    const refreshToken = randomToken();
    const db = admin.firestore();
    const now = Date.now();
    const base = {
      uid, studentId, email, emailVerified: emailVerified === true,
      clientId: CLIENT_ID, resource: RESOURCE, scope: SCOPE,
    };
    const batch = db.batch();
    batch.set(db.collection("chatgptOauthAccessTokens").doc(sha256(accessToken)), { ...base, expiresAt: new Date(now + ACCESS_MS) });
    batch.set(db.collection("chatgptOauthRefreshTokens").doc(sha256(refreshToken)), { ...base, expiresAt: new Date(now + REFRESH_MS) });
    await batch.commit();
    return { access_token: accessToken, refresh_token: refreshToken, token_type: "Bearer", expires_in: ACCESS_MS / 1000, scope: SCOPE };
  };

  router.post("/token", express.urlencoded({ extended: false, limit: "16kb" }), async (req, res) => {
    res.setHeader("Pragma", "no-cache");
    const body = req.body || {};
    if (normalize(body.client_id) !== CLIENT_ID || normalize(body.resource) !== RESOURCE) {
      return res.status(400).json({ error: "invalid_client" });
    }
    const grant = normalize(body.grant_type);
    const collection = grant === "authorization_code" ? "chatgptOauthCodes" :
      grant === "refresh_token" ? "chatgptOauthRefreshTokens" : null;
    const secret = normalize(grant === "authorization_code" ? body.code : body.refresh_token);
    if (!collection || !/^[A-Za-z0-9_-]{43}$/.test(secret)) return res.status(400).json({ error: "invalid_grant" });
    if (grant === "authorization_code") {
      const verifier = normalize(body.code_verifier);
      if (!/^[A-Za-z0-9._~-]{43,128}$/.test(verifier) || normalize(body.redirect_uri) !== CALLBACK) {
        return res.status(400).json({ error: "invalid_grant" });
      }
    }
    const db = admin.firestore();
    const ref = db.collection(collection).doc(sha256(secret));
    try {
      const stored = await db.runTransaction(async (tx) => {
        const snap = await tx.get(ref);
        const item = snap.data();
        if (!item || isExpired(item.expiresAt) || item.clientId !== CLIENT_ID ||
          item.resource !== RESOURCE || item.scope !== SCOPE ||
          (grant === "authorization_code" && (
            item.redirectUri !== CALLBACK ||
            crypto.createHash("sha256").update(body.code_verifier).digest("base64url") !== item.challenge
          ))) return null;
        tx.delete(ref);
        return item;
      });
      if (!stored) return res.status(400).json({ error: "invalid_grant" });
      const student = await studentForIdentity(admin, {
        uid: stored.uid, email: stored.email, email_verified: stored.emailVerified,
      }, stored.studentId);
      if (!student) return res.status(400).json({ error: "invalid_grant" });
      return res.json(await issueTokens(stored.uid, student.id, stored.email, stored.emailVerified));
    } catch (_error) {
      return res.status(503).json({ error: "temporarily_unavailable" });
    }
  });

  const challenge = (res, id) => {
    const description = 'Bearer resource_metadata="' + ISSUER + '/.well-known/oauth-protected-resource", error="insufficient_scope", error_description="Connect your Falowen student account"';
    res.setHeader("WWW-Authenticate", description);
    return res.json({ jsonrpc: "2.0", id, result: {
      isError: true,
      content: [{ type: "text", text: "Please connect your Falowen student account to ChatGPT." }],
      _meta: { "mcp/www_authenticate": [description] },
    } });
  };

  router.post("/mcp", async (req, res) => {
    const message = req.body;
    if (!message || message.jsonrpc !== "2.0" || typeof message.method !== "string") {
      return res.status(400).json({ jsonrpc: "2.0", id: message?.id ?? null, error: { code: -32600, message: "Invalid Request" } });
    }
    const id = message.id ?? null;
    if (message.method === "notifications/initialized" || (message.method.startsWith("notifications/") && id === null)) return res.status(202).end();
    if (message.method === "initialize") {
      return res.json({ jsonrpc: "2.0", id, result: {
        protocolVersion: "2025-06-18", capabilities: { tools: { listChanged: false } },
        serverInfo: { name: "Falowen Learning Companion", version: "1.0.0" },
        instructions: "Read-only learning companion for connected Falowen students. Tutor-marked assignments must be submitted in Campus; do not claim to submit them here. Scores come from officially recorded results only. Never share other students' records.",
      } });
    }
    if (message.method === "ping") return res.json({ jsonrpc: "2.0", id, result: {} });
    if (message.method === "tools/list") {
      return res.json({ jsonrpc: "2.0", id, result: { tools: toolDefinitions } });
    }
    if (message.method !== "tools/call") {
      return res.json({ jsonrpc: "2.0", id, error: { code: -32601, message: "Method not found" } });
    }
    const match = normalize(req.headers.authorization).match(/^Bearer\s+([A-Za-z0-9_-]{43})$/i);
    if (!match) return challenge(res, id);
    try {
      const token = await admin.firestore().collection("chatgptOauthAccessTokens").doc(sha256(match[1])).get();
      const session = token.data();
      if (!session || isExpired(session.expiresAt) || session.scope !== SCOPE ||
          session.resource !== RESOURCE || session.clientId !== CLIENT_ID) return challenge(res, id);
      const student = await studentForIdentity(admin, {
        uid: session.uid, email: session.email, email_verified: session.emailVerified,
      }, session.studentId);
      if (!student) return challenge(res, id);
      const name = normalize(message.params?.name);
      if (!toolDefinitions.some((tool) => tool.name === name)) {
        return res.json({ jsonrpc: "2.0", id, error: { code: -32602, message: "Unknown tool" } });
      }
      const result = await callTool(name, message.params?.arguments || {}, student);
      return res.json({ jsonrpc: "2.0", id, result: {
        content: [{ type: "text", text: JSON.stringify(result) }], structuredContent: result,
      } });
    } catch (error) {
      console.error("Falowen companion tool failed", error?.message || error);
      return res.json({ jsonrpc: "2.0", id, result: {
        isError: true, content: [{ type: "text", text: "Falowen could not retrieve this information right now. Please try again in Campus." }],
      } });
    }
  });

  router.get("/mcp", (_req, res) => res.status(405).set("Allow", "POST").end());
  router.delete("/mcp", (_req, res) => res.status(405).set("Allow", "POST").end());
  return router;
}

module.exports = {
  makeRouter, oauthParameters, safeStudentAccess, scoreRowsForStudent, summarizeStudentAssignments,
  constants: { ISSUER, RESOURCE, SCOPE, CLIENT_ID, CALLBACK },
};
