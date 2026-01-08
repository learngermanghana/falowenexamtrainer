const { setGlobalOptions } = require("firebase-functions/v2");
const { onRequest } = require("firebase-functions/v2/https");
const {
  onDocumentCreated,
  onDocumentUpdated,
} = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const { defineSecret } = require("firebase-functions/params");
const admin = require("firebase-admin");
const { FieldValue, FieldPath } = require("firebase-admin/firestore");

const getAdmin = () => {
  if (!admin.apps.length) {
    admin.initializeApp();
  }
  return admin;
};

setGlobalOptions({ maxInstances: 10 });

const GOOGLE_SERVICE_ACCOUNT_JSON_B64 = defineSecret("GOOGLE_SERVICE_ACCOUNT_JSON_B64");
const STUDENTS_SHEET_ID = defineSecret("STUDENTS_SHEET_ID");
const STUDENTS_SHEET_TAB = defineSecret("STUDENTS_SHEET_TAB");
const RESULTS_SHEET_PUBLISHED_CSV_URL = defineSecret("RESULTS_SHEET_PUBLISHED_CSV_URL");
const ZOOM_WEBHOOK_SECRET = defineSecret("ZOOM_WEBHOOK_SECRET");

let appInstance;
let appendStudentToStudentsSheetSafely;

const getApp = () => {
  if (!appInstance) {
    // Lazy-load the Express app so deployment initialization stays fast.
    appInstance = require("./functionz/app");
  }
  return appInstance;
};

const getStudentAppender = () => {
  if (!appendStudentToStudentsSheetSafely) {
    // Lazy-load the Sheets helper to avoid importing googleapis during cold start.
    ({ appendStudentToStudentsSheetSafely } = require("./functionz/studentsSheet"));
  }
  return appendStudentToStudentsSheetSafely;
};

const THIRTY_DAYS_IN_MS = 30 * 24 * 60 * 60 * 1000;
const NOTIFICATION_BATCH_SIZE = 500;

const safeTruncate = (text = "", maxLength = 140) => {
  const str = String(text || "").trim();
  if (str.length <= maxLength) return str;
  return `${str.slice(0, Math.max(1, maxLength - 1))}…`;
};

const getFirestore = () => getAdmin().firestore();

const getTokensFromStudentData = (data = {}) => {
  const tokens = new Set();
  if (data.messagingToken) {
    tokens.add(data.messagingToken);
  }
  if (Array.isArray(data.messagingTokens)) {
    data.messagingTokens.forEach((entry) => {
      if (entry?.token) {
        tokens.add(entry.token);
      }
    });
  }
  return Array.from(tokens);
};

const fetchStudentMessagingToken = async (studentCode) => {
  if (!studentCode) return null;

  const db = getFirestore();
  const normalized = String(studentCode).trim();
  const candidates = Array.from(
    new Set([normalized, normalized.toLowerCase(), normalized.toUpperCase()])
  ).filter(Boolean);

  for (const id of candidates) {
    const snap = await db.collection("students").doc(id).get();
    if (!snap.exists) continue;

    const data = snap.data() || {};
    const tokens = getTokensFromStudentData(data);
    if (!tokens.length) continue;

    return { tokens, data, docId: snap.id };
  }

  const lookupFields = ["studentCode", "studentcode", "uid"];

  for (const field of lookupFields) {
    const snapshot = await db
      .collection("students")
      .where(field, "in", candidates)
      .limit(1)
      .get();

    if (snapshot.empty) continue;

    const docSnap = snapshot.docs[0];
    const data = docSnap.data() || {};
    const tokens = getTokensFromStudentData(data);
    if (!tokens.length) continue;

    return { tokens, data, docId: docSnap.id };
  }

  return null;
};

const fetchClassMessagingTokens = async ({ level, className, excludeCodes = new Set() }) => {
  const db = getFirestore();
  const snapshot = await db
    .collection("students")
    .where("level", "==", level)
    .where("className", "==", className)
    .get();

  const tokens = new Set();
  const tokenOwners = new Map();

  snapshot.forEach((docSnap) => {
    const data = docSnap.data() || {};
    const studentCode = String(data.studentcode || docSnap.id || "").toLowerCase();

    if (excludeCodes.has(studentCode)) return;

    const docTokens = getTokensFromStudentData(data);
    docTokens.forEach((token) => {
      if (!token) return;
      tokens.add(token);
      tokenOwners.set(token, docSnap.id);
    });
  });

  return { tokens: Array.from(tokens), tokenOwners };
};

const getInvalidTokenReason = (code = "") => {
  return [
    "messaging/invalid-registration-token",
    "messaging/registration-token-not-registered",
  ].includes(code)
    ? code
    : null;
};

const cleanupInvalidTokens = async (tokenOwners, invalidTokens) => {
  if (!invalidTokens.length) return null;
  const db = getFirestore();
  const updates = new Map();

  invalidTokens.forEach((token) => {
    const docId = tokenOwners.get(token);
    if (!docId) return;
    if (!updates.has(docId)) {
      updates.set(docId, new Set());
    }
    updates.get(docId).add(token);
  });

  if (!updates.size) return null;

  await Promise.all(
    Array.from(updates.entries()).map(async ([docId, tokensToRemove]) => {
      const docRef = db.collection("students").doc(docId);
      const snap = await docRef.get();
      if (!snap.exists) return;
      const data = snap.data() || {};
      const existing = Array.isArray(data.messagingTokens) ? data.messagingTokens : [];
      const filtered = existing.filter((entry) => !tokensToRemove.has(entry?.token));
      const updatesPayload = { messagingTokens: filtered };
      if (data.messagingToken && tokensToRemove.has(data.messagingToken)) {
        updatesPayload.messagingToken = FieldValue.delete();
      }
      await docRef.set(updatesPayload, { merge: true });
    })
  );

  return null;
};

const sendNotifications = async ({
  tokens = [],
  notification = {},
  data = {},
  tokenOwners = new Map(),
}) => {
  if (!tokens.length) return null;

  const messaging = getAdmin().messaging();
  const chunks = [];
  const invalidTokens = new Set();

  for (let i = 0; i < tokens.length; i += NOTIFICATION_BATCH_SIZE) {
    chunks.push(tokens.slice(i, i + NOTIFICATION_BATCH_SIZE));
  }

  for (const chunk of chunks) {
    const response = await messaging.sendEachForMulticast({
      tokens: chunk,
      notification,
      data,
    });
    response.responses.forEach((result, index) => {
      if (result.success) return;
      const reason = getInvalidTokenReason(result.error?.code);
      if (!reason) return;
      invalidTokens.add(chunk[index]);
    });
  }

  if (invalidTokens.size) {
    await cleanupInvalidTokens(tokenOwners, Array.from(invalidTokens));
  }

  return null;
};

const getThreadMetadata = async (threadId) => {
  const db = getFirestore();

  const snapshot = await db
    .collectionGroup("posts")
    .where(FieldPath.documentId(), "==", threadId)
    .limit(1)
    .get();

  if (snapshot.empty) return null;

  const docSnap = snapshot.docs[0];
  const data = docSnap.data() || {};
  const classDocRef = docSnap.ref.parent.parent;
  const levelDocRef = classDocRef?.parent?.parent;

  return {
    ...data,
    level: levelDocRef?.id || data.level,
    className: classDocRef?.id || data.className,
  };
};

exports.api = onRequest(
  {
    region: "europe-west1",
    cors: true,
    secrets: [
      "OPENAI_API_KEY",
      GOOGLE_SERVICE_ACCOUNT_JSON_B64,
      "PAYSTACK_SECRET",
      STUDENTS_SHEET_ID,
      STUDENTS_SHEET_TAB,
      RESULTS_SHEET_PUBLISHED_CSV_URL,
      ZOOM_WEBHOOK_SECRET,
    ],
  },
  (req, res) => {
    process.env.RESULTS_SHEET_PUBLISHED_CSV_URL = RESULTS_SHEET_PUBLISHED_CSV_URL.value();
    process.env.SCORES_SHEET_PUBLISHED_CSV_URL = RESULTS_SHEET_PUBLISHED_CSV_URL.value();
    return getApp()(req, res);
  }
);

// When a student doc is created in Firestore, append to Students sheet (safe header-mapped append)
exports.onStudentCreated = onDocumentCreated(
  {
    region: "europe-west1",
    document: "students/{studentCode}",
    secrets: [
      GOOGLE_SERVICE_ACCOUNT_JSON_B64,
      STUDENTS_SHEET_ID,
      STUDENTS_SHEET_TAB,
    ],
  },
  async (event) => {
    console.log("onStudentCreated fired for", event.params.studentCode);

    const snap = event.data;
    if (!snap) return;

    const student = snap.data();
    if (!student) return;

    process.env.GOOGLE_SERVICE_ACCOUNT_JSON_B64 = GOOGLE_SERVICE_ACCOUNT_JSON_B64.value();
    process.env.STUDENTS_SHEET_ID = STUDENTS_SHEET_ID.value();
    process.env.STUDENTS_SHEET_TAB = STUDENTS_SHEET_TAB.value();

    const studentCode = String(student.studentCode || event.params.studentCode || "").trim();

    const result = await getStudentAppender()({
      ...student,
      studentCode,
    });

    console.log("onStudentCreated -> sheet sync result:", result);
  }
);

exports.archiveOldThreads = onSchedule(
  {
    region: "europe-west1",
    schedule: "every 24 hours",
    timeZone: "Etc/UTC",
  },
  async () => {
    const db = getFirestore();
    const cutoff = getAdmin().firestore.Timestamp.fromMillis(Date.now() - THIRTY_DAYS_IN_MS);
    const snapshot = await db.collectionGroup("posts").where("createdAt", "<", cutoff).get();

    if (snapshot.empty) {
      console.log("archiveOldThreads: no threads older than cutoff");
      return null;
    }

    const batches = [];
    let batch = db.batch();
    let batchWriteCount = 0;

    snapshot.forEach((docSnap) => {
      const data = docSnap.data();
      const level = data.level;
      const className = data.className;

      if (!level || !className) {
        console.warn(`archiveOldThreads: missing class metadata for post ${docSnap.id}`);
        return;
      }

      const archiveRef = db
        .collection("class_board")
        .doc(level)
        .collection("classes")
        .doc(className)
        .collection("archived")
        .doc(docSnap.id);

      batch.set(archiveRef, {
        ...data,
        status: "archived",
        archivedAt: FieldValue.serverTimestamp(),
      });
      batch.delete(docSnap.ref);
      batchWriteCount += 2;

      if (batchWriteCount >= 400) {
        batches.push(batch.commit());
        batch = db.batch();
        batchWriteCount = 0;
      }
    });

    if (batchWriteCount > 0) {
      batches.push(batch.commit());
    }

    await Promise.all(batches);
    console.log(`archiveOldThreads: archived ${snapshot.size} threads`);

    return null;
  }
);

const getNewResponses = (beforeData = {}, afterData = {}) => {
  const beforeResponses = Array.isArray(beforeData.responses)
    ? beforeData.responses
    : [];
  const afterResponses = Array.isArray(afterData.responses) ? afterData.responses : [];

  if (afterResponses.length <= beforeResponses.length) {
    return [];
  }

  return afterResponses.slice(beforeResponses.length);
};

const notifyNewReply = async ({ threadId, beforeData = {}, afterData = {} }) => {
  const newResponses = getNewResponses(beforeData, afterData);
  if (!newResponses.length) return null;

  const latest = newResponses[newResponses.length - 1];
  const thread = await getThreadMetadata(threadId);

  if (!thread?.level || !thread?.className) {
    console.warn(`notifyNewReply: missing thread metadata for ${threadId}`);
    return null;
  }

  const excludeCodes = new Set();
  if (latest.responderCode) {
    excludeCodes.add(String(latest.responderCode).toLowerCase());
  }

  const { tokens, tokenOwners } = await fetchClassMessagingTokens({
    level: thread.level,
    className: thread.className,
    excludeCodes,
  });

  if (!tokens.length) {
    console.log(`notifyNewReply: no tokens for ${thread.level}/${thread.className}`);
    return null;
  }

  const notification = {
    title: `New reply from ${latest.responder || "a classmate"}`,
    body:
      safeTruncate(latest.text, 140) ||
      safeTruncate(thread.question || thread.questionTitle || "There's a new reply."),
  };

  const data = {
    level: thread.level || "",
    className: thread.className || "",
    postId: threadId,
    responseId: String(latest.id || latest.responderCode || latest.responder || ""),
  };

  await sendNotifications({ tokens, notification, data, tokenOwners });
  return null;
};

const notifyAssignmentScore = async ({ attemptId, attempt }) => {
  const studentCode =
    attempt.studentCode || attempt.studentcode || attempt.student_code || attempt.student || "";

  const tokenInfo = await fetchStudentMessagingToken(studentCode);
  if (!tokenInfo?.tokens?.length) {
    console.log(`notifyAssignmentScore: no messaging token for ${studentCode}`);
    return null;
  }

  const assignmentLabel =
    attempt.assignmentText || attempt.assignment || attempt.assignmentId || "your assignment";

  const notification = {
    title: "Your assignment has been marked",
    body: safeTruncate(
      typeof attempt.score === "number"
        ? `${assignmentLabel}: you scored ${attempt.score}`
        : `${assignmentLabel} has new feedback.`,
      140
    ),
  };

  const data = {
    type: "score_update",
    studentCode: String(studentCode || ""),
    assignmentId: String(attempt.assignmentId || ""),
    attemptId: attemptId || "",
    level: attempt.level || "",
  };

  const tokenOwners = tokenInfo.docId
    ? new Map(tokenInfo.tokens.map((token) => [token, tokenInfo.docId]))
    : new Map();
  await sendNotifications({
    tokens: tokenInfo.tokens,
    notification,
    data,
    tokenOwners,
  });
  return null;
};

exports.onClassBoardPostCreated = onDocumentCreated(
  {
    region: "europe-west1",
    document: "class_board/{level}/classes/{className}/posts/{postId}",
  },
  async (event) => {
    const snap = event.data;
    if (!snap) return null;

    const data = snap.data();
    const { level, className, postId } = event.params;

    if (!data || !level || !className) return null;

    const { tokens, tokenOwners } = await fetchClassMessagingTokens({ level, className });

    if (!tokens.length) {
      console.log(`onClassBoardPostCreated: no tokens for ${level}/${className}`);
      return null;
    }

    const notification = {
      title: data.questionTitle || data.topic || "New class discussion",
      body:
        safeTruncate(data.question, 140) ||
        safeTruncate(data.instructions, 140) ||
        "A new class discussion thread was posted.",
    };

    const payload = {
      level: level || "",
      className: className || "",
      postId: postId || "",
    };

    await sendNotifications({ tokens, notification, data: payload, tokenOwners });
    return null;
  }
);

exports.onQaPostCreated = onDocumentCreated(
  {
    region: "europe-west1",
    document: "qa_posts/{threadId}",
  },
  async (event) => {
    const afterData = event.data?.data() || {};
    await notifyNewReply({ threadId: event.params.threadId, beforeData: {}, afterData });
  }
);

exports.onQaPostUpdated = onDocumentUpdated(
  {
    region: "europe-west1",
    document: "qa_posts/{threadId}",
  },
  async (event) => {
    const beforeData = event.data?.before?.data() || {};
    const afterData = event.data?.after?.data() || {};

    await notifyNewReply({ threadId: event.params.threadId, beforeData, afterData });
  }
);

exports.onScoreCreated = onDocumentCreated(
  {
    region: "europe-west1",
    document: "scores/{attemptId}",
  },
  async (event) => {
    const snap = event.data;
    if (!snap) return null;

    const attempt = snap.data() || {};
    await notifyAssignmentScore({ attemptId: event.params.attemptId, attempt });
  }
);
