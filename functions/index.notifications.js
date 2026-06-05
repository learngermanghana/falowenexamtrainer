const exportedFunctions = require("./index");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");
const admin = require("firebase-admin");

const NOTIFICATION_BATCH_SIZE = 500;
const PAYMENT_REMINDER_DAYS = new Set([15, 7, 3, 1, 0]);

const getAdmin = () => {
  if (!admin.apps.length) admin.initializeApp();
  return admin;
};

const db = () => getAdmin().firestore();
const normalize = (value) => String(value || "").trim().toLowerCase();
const truncate = (value = "", max = 140) => {
  const text = String(value || "").trim();
  return text.length <= max ? text : `${text.slice(0, max - 1)}…`;
};

const chunksOf = (items, size) => {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
};

const toDateMs = (value) => {
  if (!value) return null;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value?.seconds === "number") return value.seconds * 1000;
  if (value instanceof Date) return value.getTime();
  const parsed = Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatGhs = (value) => {
  const amount = Math.max(Number(value) || 0, 0);
  return `GHS ${amount.toFixed(2)}`;
};

const tokensFromStudent = (student = {}) => {
  const tokens = new Set();
  if (student.messagingToken) tokens.add(student.messagingToken);
  if (Array.isArray(student.messagingTokens)) {
    student.messagingTokens.forEach((entry) => {
      if (entry?.token) tokens.add(entry.token);
    });
  }
  return Array.from(tokens).filter(Boolean);
};

const findClassTargets = async ({ level, className, excludeUid = "" } = {}) => {
  const normalizedLevel = String(level || "").trim().toUpperCase();
  const normalizedClassName = String(className || "").trim();
  if (!normalizedLevel || !normalizedClassName) return [];

  const variants = Array.from(new Set([normalizedClassName, normalizedClassName.toLowerCase(), normalizedClassName.toUpperCase()])).filter(Boolean);
  const snapshots = await Promise.all(
    variants.map((variant) => db().collection("students").where("level", "==", normalizedLevel).where("className", "==", variant).get())
  );

  const targets = new Map();
  snapshots.forEach((snapshot) => {
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() || {};
      if (excludeUid && data.uid === excludeUid) return;
      targets.set(docSnap.id, { docId: docSnap.id, data, tokens: tokensFromStudent(data) });
    });
  });
  return Array.from(targets.values());
};

const toFcmData = (data = {}) =>
  Object.fromEntries(Object.entries(data).map(([key, value]) => [key, value == null ? "" : String(value)]));

const persistInAppNotification = async ({ studentDocId, notificationId, notification, data, type = "Update" }) => {
  await db().collection("students").doc(studentDocId).collection("notifications").doc(notificationId).set(
    {
      type,
      title: notification.title,
      body: notification.body,
      source: "server",
      timestamp: getAdmin().firestore.Timestamp.now(),
      data,
      createdAt: getAdmin().firestore.FieldValue.serverTimestamp(),
    },
    { merge: true }
  );
};

const cleanupInvalidTokens = async (tokenOwners, invalidTokens) => {
  if (!invalidTokens.length) return;
  const grouped = new Map();
  invalidTokens.forEach((token) => {
    const docId = tokenOwners.get(token);
    if (!docId) return;
    if (!grouped.has(docId)) grouped.set(docId, new Set());
    grouped.get(docId).add(token);
  });

  await Promise.all(
    Array.from(grouped.entries()).map(async ([docId, tokensToRemove]) => {
      const ref = db().collection("students").doc(docId);
      const snap = await ref.get();
      if (!snap.exists) return;
      const data = snap.data() || {};
      const existing = Array.isArray(data.messagingTokens) ? data.messagingTokens : [];
      const payload = { messagingTokens: existing.filter((entry) => !tokensToRemove.has(entry?.token)) };
      if (data.messagingToken && tokensToRemove.has(data.messagingToken)) {
        payload.messagingToken = getAdmin().firestore.FieldValue.delete();
      }
      await ref.set(payload, { merge: true });
    })
  );
};

const sendPush = async ({ tokens, notification, data, tokenOwners }) => {
  if (!tokens.length) return;
  const invalidTokens = new Set();
  for (const chunk of chunksOf(tokens, NOTIFICATION_BATCH_SIZE)) {
    const response = await getAdmin().messaging().sendEachForMulticast({
      tokens: chunk,
      notification,
      data,
      webpush: {
        headers: { TTL: "86400", Urgency: "high" },
        notification: { actions: [{ action: "open", title: "Open" }], data },
        fcmOptions: data.route ? { link: data.route } : undefined,
      },
    });
    response.responses.forEach((result, index) => {
      if (result.success) return;
      const code = result.error?.code || "";
      if (["messaging/invalid-registration-token", "messaging/registration-token-not-registered"].includes(code)) {
        invalidTokens.add(chunk[index]);
      }
    });
  }
  await cleanupInvalidTokens(tokenOwners, Array.from(invalidTokens));
};

const notifyClassNoteCreated = async ({ level, className, lessonId, noteId, note = {} }) => {
  const targets = await findClassTargets({ level, className, excludeUid: note.createdByUid || "" });
  if (!targets.length) return null;

  const isTutorPost = ["tutor", "admin"].includes(normalize(note.createdByRole));
  const title = note.title || "Class update";
  const notification = {
    title: isTutorPost ? `New class note: ${truncate(title, 48)}` : `New class question: ${truncate(title, 48)}`,
    body: truncate(note.body || `${note.createdBy || "Someone"} added an update for ${note.lessonTitle || "this lesson"}.`, 140),
  };
  const data = toFcmData({
    type: "class_note",
    category: "class_notes",
    level,
    className,
    lessonId,
    noteId,
    authorName: note.createdBy || "",
    authorRole: note.createdByRole || "student",
    route: note.route || "/campus/course",
    title: notification.title,
    body: notification.body,
  });

  await Promise.all(targets.map((target) => persistInAppNotification({ studentDocId: target.docId, notificationId: `class-note-${noteId}`, notification, data, type: "Class notes" })));

  const tokens = new Set();
  const tokenOwners = new Map();
  targets.forEach((target) => {
    target.tokens.forEach((token) => {
      tokens.add(token);
      tokenOwners.set(token, target.docId);
    });
  });

  if (tokens.size) {
    await sendPush({ tokens: Array.from(tokens), notification, data, tokenOwners });
  }
  return null;
};

const getStudentBalanceDue = (student = {}) => {
  const explicitBalance = student.balanceDue ?? student.balance;
  if (explicitBalance !== undefined && explicitBalance !== null && explicitBalance !== "") {
    return Math.max(Number(explicitBalance) || 0, 0);
  }

  const tuition = Math.max(Number(student.tuitionFee) || 0, 0);
  const paid = Math.max(Number(student.paid ?? student.initialPaymentAmount) || 0, 0);
  return Math.max(tuition - paid, 0);
};

const getPaymentReminderCandidate = ({ docId, student, nowMs }) => {
  const balanceDue = getStudentBalanceDue(student);
  if (balanceDue <= 0) return null;

  const contractEndMs = toDateMs(student.contractEnd);
  if (!contractEndMs) return null;

  const dayMs = 24 * 60 * 60 * 1000;
  const daysLeft = Math.ceil((contractEndMs - nowMs) / dayMs);
  if (!PAYMENT_REMINDER_DAYS.has(daysLeft)) return null;

  return { docId, student, balanceDue, contractEndMs, daysLeft };
};

const buildPaymentReminderPayload = ({ student, balanceDue, daysLeft }) => {
  const amount = formatGhs(balanceDue);
  const title = daysLeft === 0 ? "Payment reminder: contract ends today" : `Payment reminder: ${daysLeft} day${daysLeft === 1 ? "" : "s"} left`;
  const body = daysLeft === 0
    ? `Your Falowen contract ends today. Please clear your balance of ${amount}.`
    : `Your Falowen contract ends in ${daysLeft} day${daysLeft === 1 ? "" : "s"}. Please clear your balance of ${amount}.`;
  const data = toFcmData({
    type: "payment_reminder",
    category: "billing",
    route: "/campus/account",
    studentCode: student.studentCode || student.studentcode || "",
    level: student.level || "",
    balanceDue,
    daysLeft,
    title,
    body,
  });
  return { notification: { title, body }, data };
};

const sendPaymentReminderToStudent = async ({ candidate, runDateKey }) => {
  const { docId, student, balanceDue, daysLeft } = candidate;
  const { notification, data } = buildPaymentReminderPayload({ student, balanceDue, daysLeft });
  const notificationId = `payment-reminder-${runDateKey}-${daysLeft}`;

  await persistInAppNotification({
    studentDocId: docId,
    notificationId,
    notification,
    data,
    type: "Payment reminder",
  });

  const tokens = tokensFromStudent(student);
  if (!tokens.length) return;

  const tokenOwners = new Map(tokens.map((token) => [token, docId]));
  await sendPush({ tokens, notification, data, tokenOwners });
};

const runPaymentReminderScan = async () => {
  const now = new Date();
  const nowMs = now.getTime();
  const runDateKey = now.toISOString().slice(0, 10);
  const snapshot = await db().collection("students").get();
  const candidates = [];

  snapshot.forEach((docSnap) => {
    const candidate = getPaymentReminderCandidate({ docId: docSnap.id, student: docSnap.data() || {}, nowMs });
    if (candidate) candidates.push(candidate);
  });

  for (const chunk of chunksOf(candidates, 50)) {
    await Promise.all(chunk.map((candidate) => sendPaymentReminderToStudent({ candidate, runDateKey })));
  }

  console.log("sendPaymentReminders completed", { candidates: candidates.length, runDateKey });
};

exportedFunctions.onClassLessonNoteCreated = onDocumentCreated(
  {
    region: "europe-west1",
    document: "class_lesson_notes/{level}/classes/{className}/lessons/{lessonId}/notes/{noteId}",
  },
  async (event) => {
    await notifyClassNoteCreated({
      level: event.params.level,
      className: event.params.className,
      lessonId: event.params.lessonId,
      noteId: event.params.noteId,
      note: event.data?.data() || {},
    });
    return null;
  }
);

exportedFunctions.sendPaymentReminders = onSchedule(
  {
    region: "europe-west1",
    schedule: "every day 08:00",
    timeZone: "Africa/Accra",
  },
  async () => {
    await runPaymentReminderScan();
    return null;
  }
);

module.exports = exportedFunctions;
