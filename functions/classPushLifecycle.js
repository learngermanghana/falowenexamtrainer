const { notificationsPaused, currentNotificationStudent } = require("./deletionNotifications");
const admin = require("firebase-admin");
const { languageForStudent, classCopy, classActionLabel } = require("./classNotificationCopy");

const REGION = "europe-west1";
const TIME_ZONE = "Africa/Accra";
const APP_ORIGIN = process.env.FRONTEND_URL || "https://www.falowen.app";
const REMINDER_KINDS = ["tomorrow", "one-hour", "fifteen-minutes", "checkin-open"];
const INACTIVE_STATUSES = new Set(["cancelled", "canceled", "completed", "finished", "ended", "deleted"]);
const CANCELLED_STATUSES = new Set(["cancelled", "canceled", "deleted"]);

const getAdmin = () => {
  if (!admin.apps.length) admin.initializeApp();
  return admin;
};
const db = () => getAdmin().firestore();
const normalize = (value) => String(value || "").trim().toLowerCase();
const encode = (value) => encodeURIComponent(String(value || "").trim());

const toMillis = (value) => {
  if (!value) return null;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value?.seconds === "number") return value.seconds * 1000;
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number" && Number.isFinite(value)) return value < 10_000_000_000 ? value * 1000 : value;
  const parsed = Date.parse(String(value));
  return Number.isFinite(parsed) ? parsed : null;
};

const combineDateAndTime = (dateValue, timeValue) => {
  if (!dateValue || !timeValue) return null;
  const date = String(dateValue).slice(0, 10);
  const time = String(timeValue).trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{1,2}:\d{2}/.test(time)) return null;
  const parsed = Date.parse(`${date}T${time.padStart(5, "0")}:00+00:00`);
  return Number.isFinite(parsed) ? parsed : null;
};

const getSessionStartMs = (session = {}) => {
  for (const value of [session.startAt, session.startsAt, session.startDateTime, session.scheduledAt, session.dateTime, session.sessionStart, session.start]) {
    const parsed = toMillis(value);
    if (parsed) return parsed;
  }
  return combineDateAndTime(session.date || session.sessionDate || session.day, session.startTime || session.time);
};

const getSessionEndMs = (session = {}) => {
  for (const value of [session.endAt, session.endsAt, session.endDateTime, session.sessionEnd, session.end]) {
    const parsed = toMillis(value);
    if (parsed) return parsed;
  }
  const combined = combineDateAndTime(session.date || session.sessionDate || session.day, session.endTime);
  if (combined) return combined;
  const start = getSessionStartMs(session);
  const duration = Number(session.durationMinutes || session.duration || 90);
  return start ? start + Math.max(duration, 30) * 60_000 : null;
};

const getSessionStatus = (session = {}) => normalize(session.status || session.state || session.sessionStatus || "scheduled");
const isSessionActive = (session = {}, nowMs = Date.now()) => {
  if (INACTIVE_STATUSES.has(getSessionStatus(session))) return false;
  if (session.cancelled === true || session.canceled === true || session.isCancelled === true) return false;
  const endMs = getSessionEndMs(session);
  return !endMs || endMs > nowMs;
};

const getClassName = (session = {}) => String(session.className || session.class || session.groupName || session.courseClass || "").trim();
const getLevel = (session = {}) => String(session.level || session.courseLevel || "").trim().toUpperCase();
const getSessionLabel = (session = {}) => String(session.sessionLabel || session.lessonTitle || session.title || session.topic || "Class").trim();
const isCheckinOpen = (session = {}) => Boolean(session.checkinOpen || session.checkInOpen || session.attendanceOpen || session.checkin?.open || session.attendance?.open);

const classRoute = (session = {}) => {
  const className = getClassName(session);
  return className ? `/campus/course/full-class-calendar/${encode(className)}` : "/campus/course";
};

const checkinRoute = (session = {}) => {
  const explicit = String(session.checkinRoute || session.checkInRoute || session.attendanceRoute || "").trim();
  return explicit.startsWith("/") ? explicit : classRoute(session);
};

const absoluteLink = (route = "/") => {
  try {
    return new URL(route || "/", APP_ORIGIN).toString();
  } catch (_error) {
    return `${APP_ORIGIN}/`;
  }
};

const tokensFromStudent = (student = {}) => {
  if (notificationsPaused(student)) return [];
  const tokens = new Set();
  if (student.messagingToken) tokens.add(student.messagingToken);
  if (Array.isArray(student.messagingTokens)) {
    student.messagingTokens.forEach((entry) => {
      const token = typeof entry === "string" ? entry : entry?.token;
      if (token) tokens.add(token);
    });
  }
  return [...tokens];
};

const findClassTargets = async (session = {}) => {
  const className = getClassName(session);
  if (!className) return [];
  const variants = [...new Set([className, className.toLowerCase(), className.toUpperCase()])];
  const level = String(getLevel(session) || "").toUpperCase();
  const program = normalize(session.program || session.courseProgram || session.language);
  const supportedProgram = ["german", "swahili"].includes(program) ? program : "";
  // A single-field query for secondary placements avoids a new composite index.
  // Filter both level and authorised programme in memory before sending.
  const queries = variants.flatMap((variant) => {
    const primary = db().collection("students").where("className", "==", variant).get();
    return supportedProgram
      ? [primary, db().collection("students").where(`coursePlacements.${supportedProgram}.className`, "==", variant).get()]
      : [primary];
  });
  const snapshots = await Promise.all(queries);
  const targets = new Map();
  snapshots.forEach((snapshot) => snapshot.forEach((docSnap) => {
    const data = docSnap.data() || {};
    const primary = normalize(data.program || "german");
    const placement = supportedProgram && data.coursePlacements?.[supportedProgram] || {};
    const primaryMatch = (!supportedProgram || primary === supportedProgram)
      && variants.includes(String(data.className || ""))
      && (!level || String(data.level || "").toUpperCase() === level);
    const secondaryMatch = supportedProgram && normalize(data.secondaryProgram) === supportedProgram
      && variants.includes(String(placement.className || ""))
      && (!level || String(placement.level || "").toUpperCase() === level);
    if (primaryMatch || secondaryMatch) targets.set(docSnap.id, { id: docSnap.id, data });
  }));
  return [...targets.values()];
};

const toFcmData = (data = {}) => Object.fromEntries(Object.entries(data).map(([key, value]) => [key, value == null ? "" : String(value)]));

const sendToStudent = async ({ target, notificationId, title, body, type, route, data = {}, copyForLanguage }) => {
  const current = await currentNotificationStudent(db(), target.id);
  if (!current) return { success: 0 };
  target = { ...target, data: current };
  const language = languageForStudent(current.preferredInterfaceLanguage);
  const localized = typeof copyForLanguage === "function" ? copyForLanguage(language) : null;
  title = localized?.title || title;
  body = localized?.body || body;
  const payloadData = toFcmData({ ...data, notificationId, type, category: "class", route, url: absoluteLink(route), title, body, timestamp: Date.now() });
  await db().collection("students").doc(target.id).collection("notifications").doc(notificationId).set({
    type: "Class",
    title,
    body,
    source: "push",
    route,
    url: absoluteLink(route),
    status: "unread",
    lifecycleState: "active",
    timestamp: getAdmin().firestore.Timestamp.now(),
    data: payloadData,
    createdAt: getAdmin().firestore.FieldValue.serverTimestamp(),
  }, { merge: true });

  const tokens = tokensFromStudent(target.data);
  if (!tokens.length) return { success: 0 };
  const response = await getAdmin().messaging().sendEachForMulticast({
    tokens,
    notification: { title, body },
    data: payloadData,
    webpush: {
      headers: { TTL: "86400", Urgency: "high" },
      notification: {
        icon: "/logo192.png",
        badge: "/favicon.ico",
        actions: [{ action: "open", title: classActionLabel(type, language) }],
        data: payloadData,
      },
      fcmOptions: { link: absoluteLink(route) },
    },
  });
  return { success: response.successCount || 0 };
};

const startKey = (session = {}) => String(getSessionStartMs(session) || "unscheduled");
const safeId = (value) => String(value || "").replace(/[^a-zA-Z0-9_-]/g, "_").slice(0, 480);
const eventIdFor = (sessionId, kind, session = {}) => safeId(`${sessionId}-${startKey(session)}-${kind}`);
const notificationIdFor = (sessionId, kind, session = {}) => safeId(`class-${sessionId}-${startKey(session)}-${kind}`);

const claimEvent = async (eventId, payload = {}) => {
  const ref = db().collection("classPushReminderEvents").doc(eventId);
  return db().runTransaction(async (transaction) => {
    const snap = await transaction.get(ref);
    if (snap.exists && snap.data()?.state === "sent") return false;
    if (snap.exists && snap.data()?.state === "processing") {
      const claimedAt = toMillis(snap.data()?.claimedAt);
      if (claimedAt && Date.now() - claimedAt < 10 * 60_000) return false;
    }
    transaction.set(ref, { ...payload, state: "processing", claimedAt: getAdmin().firestore.FieldValue.serverTimestamp(), updatedAt: getAdmin().firestore.FieldValue.serverTimestamp() }, { merge: true });
    return true;
  });
};

const markEvent = (eventId, state, extra = {}) => db().collection("classPushReminderEvents").doc(eventId).set({
  state,
  ...extra,
  updatedAt: getAdmin().firestore.FieldValue.serverTimestamp(),
  ...(state === "sent" ? { sentAt: getAdmin().firestore.FieldValue.serverTimestamp() } : {}),
}, { merge: true });

const buildReminder = (kind, session = {}, language = "en") => {
  const copy = classCopy({ kind, sessionLabel: getSessionLabel(session), className: getClassName(session), language });
  if (!copy) return null;
  const route = kind === "checkin-open" ? checkinRoute(session) : classRoute(session);
  const types = { tomorrow: "class_tomorrow", "one-hour": "class_one_hour", "fifteen-minutes": "class_fifteen_minutes", "checkin-open": "class_checkin_open" };
  return { route, type: types[kind], ...copy };
};

const deleteOldReminderNotifications = async ({ sessionId, session, oldSession }) => {
  const targets = await findClassTargets(session || oldSession || {});
  const versions = [session, oldSession].filter(Boolean);
  const refs = [];
  targets.forEach((target) => versions.forEach((candidate) => REMINDER_KINDS.forEach((kind) => refs.push(
    db().collection("students").doc(target.id).collection("notifications").doc(notificationIdFor(sessionId, kind, candidate))
  ))));
  for (let index = 0; index < refs.length; index += 400) {
    const batch = db().batch();
    refs.slice(index, index + 400).forEach((ref) => batch.delete(ref));
    await batch.commit();
  }
};

const sendClassLifecycleNotification = async ({ sessionId, session, kind }) => {
  if (!sessionId || !session || !isSessionActive(session)) return { skipped: true };
  const reminder = buildReminder(kind, session);
  if (!reminder) return { skipped: true };
  const eventId = eventIdFor(sessionId, kind, session);
  const claimed = await claimEvent(eventId, { sessionId, kind, className: getClassName(session), startMs: getSessionStartMs(session) });
  if (!claimed) return { deduped: true };
  try {
    const targets = await findClassTargets(session);
    const notificationId = notificationIdFor(sessionId, kind, session);
    let pushes = 0;
    for (const target of targets) {
      const result = await sendToStudent({
        target,
        notificationId,
        title: reminder.title,
        body: reminder.body,
        type: reminder.type,
        route: reminder.route,
        copyForLanguage: (language) => buildReminder(kind, session, language),
        data: { sessionId, className: getClassName(session), level: getLevel(session), sessionLabel: getSessionLabel(session), reminderKind: kind, sessionStartMs: getSessionStartMs(session) || "" },
      });
      pushes += result.success;
    }
    await markEvent(eventId, "sent", { studentCount: targets.length, pushSuccessCount: pushes });
    return { sent: targets.length, pushes };
  } catch (error) {
    await markEvent(eventId, "failed", { error: String(error?.message || error) });
    throw error;
  }
};

const sendImmediateClassChange = async ({ sessionId, session, oldSession, kind }) => {
  await deleteOldReminderNotifications({ sessionId, session, oldSession });
  const current = session || oldSession || {};
  const className = getClassName(current);
  const label = getSessionLabel(current);
  const route = classRoute(current);
  const cancelled = kind === "cancelled";
  const { title, body } = classCopy({ kind, sessionLabel: label, className, language: "en" });
  const eventId = safeId(`${sessionId}-${startKey(current)}-${kind}`);
  if (!await claimEvent(eventId, { sessionId, kind, className })) return;
  const targets = await findClassTargets(current);
  let pushes = 0;
  for (const target of targets) {
    const result = await sendToStudent({
      target,
      notificationId: safeId(`class-${sessionId}-${startKey(current)}-${kind}`),
      title,
      body,
      type: cancelled ? "class_cancelled" : "class_rescheduled",
      route,
      copyForLanguage: (language) => classCopy({ kind, sessionLabel: label, className, language }),
      data: { sessionId, className, level: getLevel(current), sessionLabel: label, previousStartMs: getSessionStartMs(oldSession || {}) || "", sessionStartMs: getSessionStartMs(session || {}) || "" },
    });
    pushes += result.success;
  }
  await markEvent(eventId, "sent", { studentCount: targets.length, pushSuccessCount: pushes });
};

const reminderKindDue = ({ session, nowMs }) => {
  const startMs = getSessionStartMs(session);
  if (!startMs) return [];
  const minutes = (startMs - nowMs) / 60_000;
  const due = [];
  if (minutes >= 1435 && minutes < 1445) due.push("tomorrow");
  if (minutes >= 55 && minutes < 65) due.push("one-hour");
  if (minutes >= 10 && minutes < 20) due.push("fifteen-minutes");
  if (isCheckinOpen(session)) due.push("checkin-open");
  return due;
};

const didStartChange = (before = {}, after = {}) => {
  const left = getSessionStartMs(before);
  const right = getSessionStartMs(after);
  return Boolean(left && right && Math.abs(left - right) >= 60_000);
};
const becameCancelled = (before = {}, after = {}) => {
  const afterStatus = getSessionStatus(after);
  const explicitlyCancelled = CANCELLED_STATUSES.has(afterStatus) || after.cancelled === true || after.canceled === true || after.isCancelled === true;
  return isSessionActive(before) && explicitlyCancelled;
};
const becameCheckinOpen = (before = {}, after = {}) => !isCheckinOpen(before) && isCheckinOpen(after) && isSessionActive(after);

module.exports = {
  _classPushLifecycle: { classRoute, checkinRoute, getSessionStartMs, isSessionActive, reminderKindDue, didStartChange, becameCancelled, becameCheckinOpen },
};
