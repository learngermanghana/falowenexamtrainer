const { currentNotificationStudent } = require("./deletionNotifications");
const exportedFunctions = require("./index");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const admin = require("firebase-admin");
const { markedAssignmentCopy, classNoteCopy } = require("./studentNotificationCopy");

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

const findClassTargets = async ({ level, className, excludeUid = "", program = "" } = {}) => {
  const normalizedLevel = String(level || "").trim().toUpperCase();
  const normalizedClassName = String(className || "").trim();
  if (!normalizedLevel || !normalizedClassName) return [];

  const variants = [...new Set([normalizedClassName, normalizedClassName.toLowerCase(), normalizedClassName.toUpperCase()])];
  const normalizedProgram = ["german", "swahili"].includes(normalize(program)) ? normalize(program) : "";
  const snapshots = await Promise.all(variants.flatMap((variant) => [
    db().collection("students").where("level", "==", normalizedLevel).where("className", "==", variant).get(),
    ...(normalizedProgram
      ? [db().collection("students").where(`coursePlacements.${normalizedProgram}.className`, "==", variant).get()]
      : []),
  ]));
  const targets = new Map();
  snapshots.forEach((snapshot) => snapshot.forEach((docSnap) => {
    const data = docSnap.data() || {};
    if (excludeUid && data.uid === excludeUid) return;
    const primaryMatch = (!normalizedProgram || normalize(data.program || "german") === normalizedProgram)
      && variants.includes(String(data.className || ""))
      && String(data.level || "").trim().toUpperCase() === normalizedLevel;
    const placement = normalizedProgram ? data.coursePlacements?.[normalizedProgram] || {} : {};
    const secondaryMatch = normalizedProgram && normalize(data.secondaryProgram) === normalizedProgram
      && variants.includes(String(placement.className || ""))
      && String(placement.level || "").trim().toUpperCase() === normalizedLevel;
    if (primaryMatch || secondaryMatch) {
      targets.set(docSnap.id, { docId: docSnap.id, data });
    }
  }));
  return [...targets.values()];
};

const toNotificationData = (data = {}) =>
  Object.fromEntries(Object.entries(data).map(([key, value]) => [key, value == null ? "" : String(value)]));

const persistInAppNotification = async ({ studentDocId, notificationId, notification, data, type = "Update" }) => {
  if (!await currentNotificationStudent(db(), studentDocId)) return;
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

const studentCodeVariants = (value = "") => {
  const trimmed = String(value || "").trim();
  return Array.from(new Set([trimmed, trimmed.toLowerCase(), trimmed.toUpperCase()].filter(Boolean)));
};

const findStudentTargetsByCode = async (studentCode = "") => {
  const variants = studentCodeVariants(studentCode);
  if (!variants.length) return [];

  const targets = new Map();
  await Promise.all(
    variants.map(async (variant) => {
      const direct = await db().collection("students").doc(variant).get();
      if (direct.exists) {
        const data = direct.data() || {};
        targets.set(direct.id, { docId: direct.id, data });
      }
    })
  );

  const snapshots = await Promise.all([
    ...variants.map((variant) => db().collection("students").where("studentCode", "==", variant).get()),
    ...variants.map((variant) => db().collection("students").where("studentcode", "==", variant).get()),
  ]);

  snapshots.forEach((snapshot) => {
    snapshot.forEach((docSnap) => {
      const data = docSnap.data() || {};
      targets.set(docSnap.id, { docId: docSnap.id, data });
    });
  });

  return Array.from(targets.values());
};

const buildMarkedAssignmentPayload = (notificationDoc = {}, language = "en") => {
  const score = Number(notificationDoc.score);
  const scoreLabel = Number.isFinite(score) ? `${score}/100` : "marked";
  const passed = Number.isFinite(score) ? score >= 60 : notificationDoc.status === "passed";
  const fallback = markedAssignmentCopy({ scoreLabel, passed, language });
  const title = notificationDoc.title || fallback.title;
  const body = notificationDoc.body || notificationDoc.message || fallback.body;
  const data = toNotificationData({
    ...(notificationDoc.data || {}),
    type: "marked_assignment",
    category: "feedback",
    route: notificationDoc.route || notificationDoc.data?.route || "/campus/results",
    studentCode: notificationDoc.studentCode || notificationDoc.studentCodeOriginal || "",
    assignment: notificationDoc.assignment || "",
    assignmentId: notificationDoc.assignmentId || "",
    level: notificationDoc.level || "",
    score: Number.isFinite(score) ? score : notificationDoc.score || "",
    status: notificationDoc.status || (passed ? "passed" : "needs_improvement"),
    title,
    body,
  });
  return { notification: { title, body }, data };
};

const notifyMarkedAssignmentCreated = async ({ notificationId, notificationDoc = {} }) => {
  const studentCode = notificationDoc.studentCode || notificationDoc.studentCodeOriginal || notificationDoc.data?.studentCode || "";
  const targets = await findStudentTargetsByCode(studentCode);
  if (!targets.length) {
    console.log("No inbox target found for marked assignment", { notificationId, studentCode });
    return null;
  }

  // Do not broadcast a single student's preferred language to other accounts.
  await Promise.all(targets.map(async (target) => {
    const { notification, data } = buildMarkedAssignmentPayload(notificationDoc, target.data?.preferredInterfaceLanguage);
    await persistInAppNotification({
      studentDocId: target.docId,
      notificationId, notification, data, type: "Scores",
    });
  }));
  return null;
};

const notifyClassNoteCreated = async ({ level, className, lessonId, noteId, note = {} }) => {
  const targets = await findClassTargets({ level, className, excludeUid: note.createdByUid || "", program: note.program });
  if (!targets.length) return null;

  const isTutorPost = ["tutor", "admin"].includes(normalize(note.createdByRole));
  await Promise.all(targets.map(async (target) => {
    const notification = classNoteCopy({
      note, isTutorPost, language: target.data?.preferredInterfaceLanguage, truncate,
    });
    const data = toNotificationData({
      type: "class_note", category: "class_notes", level, className, lessonId, noteId,
      authorName: note.createdBy || "", authorRole: note.createdByRole || "student",
      route: note.route || "/campus/course",
      title: notification.title, body: notification.body,
    });
    await persistInAppNotification({
      studentDocId: target.docId, notificationId: `class-note-${noteId}`,
      notification, data, type: "Class notes",
    });
  }));
  return null;
};

exportedFunctions.onMarkedAssignmentNotificationCreated = onDocumentCreated(
  {
    region: "europe-west1",
    document: "studentNotifications/{notificationId}",
  },
  async (event) => {
    const data = event.data?.data() || {};
    const category = normalize(data.category || data.type || data.data?.type || "");
    const route = normalize(data.route || data.data?.route || "");
    if (!category.includes("feedback") && !category.includes("scores") && !category.includes("marked_assignment") && !route.includes("results")) {
      return null;
    }
    await notifyMarkedAssignmentCreated({
      notificationId: event.params.notificationId,
      notificationDoc: data,
    });
    return null;
  }
);

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

module.exports = exportedFunctions;
