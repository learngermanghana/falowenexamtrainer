const exportedFunctions = require("./index");
const { onDocumentUpdated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");

const REVIEW_NOTIFICATION_TYPE = "assignment_tutor_review";
const NOTIFICATION_BATCH_SIZE = 500;

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

const normalizeStatus = (value) => {
  const status = normalize(value);
  if (["approved", "approve", "done", "pass"].includes(status)) return "approved";
  if (["needs_improvement", "needs-improvement", "needs revision", "improve", "revision"].includes(status)) {
    return "needs_improvement";
  }
  if (["pending", "pending_review", "awaiting_review", "queued", "new"].includes(status)) return "pending";
  return status || "pending";
};

const timestampKey = (value) => {
  if (!value) return "";
  if (typeof value?.toMillis === "function") return String(value.toMillis());
  if (typeof value?.seconds === "number") return `${value.seconds}.${value.nanoseconds || 0}`;
  if (value instanceof Date) return String(value.getTime());
  return String(value);
};

const uniqueCandidates = (data = {}) => {
  const raw = [
    data.studentCode,
    data.studentcode,
    data.student_code,
    data.ownerKey,
    data.studentId,
    data.uid,
    data.studentEmail,
    data.email,
  ];
  const values = raw.flatMap((item) => {
    const text = String(item || "").trim();
    return text ? [text, text.toLowerCase(), text.toUpperCase()] : [];
  });
  return Array.from(new Set(values)).filter(Boolean).slice(0, 30);
};

const chunksOf = (items, size) => {
  const chunks = [];
  for (let i = 0; i < items.length; i += size) chunks.push(items.slice(i, i + size));
  return chunks;
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

const findStudentTarget = async (review = {}) => {
  const candidates = uniqueCandidates(review);
  if (!candidates.length) return null;

  for (const id of candidates) {
    const snap = await db().collection("students").doc(id).get();
    if (snap.exists) {
      const data = snap.data() || {};
      return { docId: snap.id, data, tokens: tokensFromStudent(data) };
    }
  }

  for (const field of ["studentCode", "studentcode", "student_code", "uid", "email"]) {
    for (const chunk of chunksOf(candidates, 10)) {
      const snapshot = await db().collection("students").where(field, "in", chunk).limit(1).get();
      if (!snapshot.empty) {
        const docSnap = snapshot.docs[0];
        const data = docSnap.data() || {};
        return { docId: docSnap.id, data, tokens: tokensFromStudent(data) };
      }
    }
  }

  return null;
};

const toFcmData = (data = {}) =>
  Object.fromEntries(Object.entries(data).map(([key, value]) => [key, value == null ? "" : String(value)]));

const shouldNotify = (before = {}, after = {}) => {
  const beforeStatus = normalizeStatus(before.reviewStatus || before.status);
  const afterStatus = normalizeStatus(after.reviewStatus || after.status);
  const beforeFeedback = String(before.tutorFeedback || before.reviewComment || "").trim();
  const afterFeedback = String(after.tutorFeedback || after.reviewComment || "").trim();
  const actor = normalize(after.lastActorRole || after.lastMessageRole);

  if (actor && actor !== "tutor") return false;

  return (
    (afterStatus !== "pending" && afterStatus !== beforeStatus) ||
    Boolean(afterFeedback && afterFeedback !== beforeFeedback) ||
    (after.unreadByStudent === true && before.unreadByStudent !== true) ||
    Boolean(timestampKey(after.lastTutorReplyAt) && timestampKey(after.lastTutorReplyAt) !== timestampKey(before.lastTutorReplyAt))
  );
};

const buildPayload = ({ reviewId, after = {} }) => {
  const status = normalizeStatus(after.reviewStatus || after.status);
  const feedback = String(after.tutorFeedback || after.reviewComment || "").trim();
  const label = after.promptTitle || after.assignmentTitle || after.assignment || "your exam letter";
  const title =
    status === "approved"
      ? "Tutor approved your work"
      : status === "needs_improvement"
        ? "Tutor returned comments"
        : "New tutor feedback";
  const body = truncate(
    feedback ||
      (status === "approved"
        ? `${label} is approved. Great work!`
        : `${label} has tutor comments. Please review and revise.`),
    140
  );
  const route = after.source === "campus-writing" ? "/campus/writing" : "/exams/writing";
  const data = toFcmData({
    type: REVIEW_NOTIFICATION_TYPE,
    category: "assignment",
    reviewId,
    reviewStatus: status,
    studentCode: after.studentCode || after.studentcode || after.ownerKey || "",
    level: after.level || "",
    route,
    title,
    body,
  });
  return { notification: { title, body }, data };
};

const persistInAppNotification = async ({ studentDocId, notificationId, notification, data }) => {
  await db()
    .collection("students")
    .doc(studentDocId)
    .collection("notifications")
    .doc(notificationId)
    .set(
      {
        type: "Tutor feedback",
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

const sendPush = async ({ tokens, notification, data }) => {
  if (!tokens.length) return;
  const messaging = getAdmin().messaging();
  for (const chunk of chunksOf(tokens, NOTIFICATION_BATCH_SIZE)) {
    await messaging.sendEachForMulticast({
      tokens: chunk,
      notification,
      data,
      webpush: {
        headers: { TTL: "86400", Urgency: "high" },
        notification: { actions: [{ action: "open", title: "Open" }], data },
        fcmOptions: data.route ? { link: data.route } : undefined,
      },
    });
  }
};

const notifyTutorReview = async ({ reviewId, before = {}, after = {} }) => {
  if (!shouldNotify(before, after)) return null;

  const target = await findStudentTarget(after);
  if (!target?.docId) {
    console.log("notifyTutorReview: no matching student", { reviewId });
    return null;
  }

  const { notification, data } = buildPayload({ reviewId, after });
  await persistInAppNotification({
    studentDocId: target.docId,
    notificationId: `tutor-review-${reviewId || Date.now()}`,
    notification,
    data,
  });

  if (!target.tokens.length) {
    console.log("notifyTutorReview: in-app only; no push token", { reviewId, studentDocId: target.docId });
    return null;
  }

  await sendPush({ tokens: target.tokens, notification, data });
  return null;
};

exportedFunctions.onExamTutorReviewUpdated = onDocumentUpdated(
  {
    region: "europe-west1",
    document: "examTutorReviewQueue/{reviewId}",
  },
  async (event) => {
    await notifyTutorReview({
      reviewId: event.params.reviewId,
      before: event.data?.before?.data() || {},
      after: event.data?.after?.data() || {},
    });
    return null;
  }
);

module.exports = exportedFunctions;
