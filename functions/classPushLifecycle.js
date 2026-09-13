const admin = require("firebase-admin");
const { onDocumentUpdated } = require("firebase-functions/v2/firestore");
const { onSchedule } = require("firebase-functions/v2/scheduler");

const REGION = "europe-west1";
const TIME_ZONE = "Africa/Accra";
const APP_ORIGIN = process.env.FRONTEND_URL || "https://www.falowen.app";
const REMINDER_KINDS = ["tomorrow", "one-hour", "fifteen-minutes", "checkin-open"];
const TERMINAL_STATUSES = new Set(["cancelled", "canceled", "completed", "finished", "ended", "deleted"]);

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
  const direct = [
    session.startAt,
    session.startsAt,
    session.startDateTime,
    session.scheduledAt,
    session.dateTime,
    session.sessionStart,
    session.start,
  ];
  for (const value of direct) {
    const parsed = toMillis(value);
    if (parsed) return parsed;
  }
  return combineDateAndTime(session.date || session.sessionDate || session.day, session.startTime || session.time);
};

const getSessionEndMs = (session = {}) => {
  const direct = [session.endAt, session.endsAt, session.endDateTime, session.sessionEnd, session.end];
  for (const value of direct) {
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
  if (TERMINAL_STATUSES.has(getSessionStatus(session))) return false;
  if (session.cancelled === true || session.canceled === true || session.isCancelled === true) return false;
  const endMs = getSessionEndMs(session);
  return !endMs || endMs > nowMs;
};

const getClassName = (session = {}) => String(session.className || session.class || session.groupName || session.courseClass || "").trim();
const getLevel = (session = {}) => String(session.level || session.courseLevel || "").trim().toUpperCase();
const getSessionLabel = (session = {}) => String(session.sessionLabel || session.lessonTitle || session.title || session.topic || "Class").trim();
const isCheckinOpen = (session = {}) => Boolean(session.checkinOpen || session.checkInOpen || session.attendanceOpen || session.checkin?.open || session.attendance?.open);
const getExplicitCheckinUrl = (session = {}) => String(session.checkinUrl || session.checkInUrl || session.attendanceUrl || session.checkin?.url || "").trim();

const classRoute = (session = {}) => {
  const className = getClassName(session);
  return className ? `/campus/course/full-class-calendar/${encode(className)}` : "/campus/course";
};

const checkinRoute = (session = {}) => {
  const explicit = getExplicitCheckinUrl(session);
  if (explicit) return explicit;
  return classRoute(session);
};

const absoluteLink = (route = "/") => {
  try {
    return new URL(route || "/", APP_ORIGIN).toString();
  } catch (_error) {
    return `${APP_ORIGIN}/`;
  }
};

const tokensFromStudent = (student = {}) => {
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
  const level = getLevel(session);
  const snapshots = await Promise.all(
    variants.map((variant) => {
      let query = db().collection("students").where("className", "==", variant);
      if (level) query = query.where("level", "==", level);
      return query.get();
    })
  );
  const targets = new Map();
  snapshots.forEach((snapshot) => snapshot.forEach((docSnap) => targets.set(docSnap.id, { id: docSnap.id, data: docSnap.data() || {} })));
  return [...targets.values()];
};

const toFcmData = (data = {}) => Object.fromEntries(Object.entries(data).map(([key, value]) => [key, value == null ? "" : String(value)]));

const sendToStudent = async ({ target, notificationId, title, body, type, route, data = {} }) => {
  const payloadData = toFcmData({
    ...data,
    notificationId,
    type,
    category: "class",
    route,
    url: absoluteLink(route),
    title,
    body,
    timestamp: Date.now(),
  });

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
  if (!tokens.length) return { tokens: 0, success: 0 };
  const response = await getAdmin().messaging().sendEachForMulticast({
    tokens,
    notification: { title, body },
    data: payloadData,
    webpush: {
      headers: { TTL: "86400", Urgency: "high" },
      notification: {
        icon: "/logo192.png",
        badge: "/favicon.ico",
        actions: [{ action: "open", title: type === "class_checkin_open" ? "Check in" : "Open class" }],
        data: payloadData,
      },
      fcmOptions: { link: absoluteLink(route) },
    },
  });
  return { tokens: tokens.length, success: response.successCount || 0 };
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
    transaction.set(ref, {
      ...payload,
      state: "processing",
      claimedAt: getAdmin().firestore.FieldValue.serverTimestamp(),
      updatedAt: getAdmin().firestore.FieldValue.serverTimestamp(),
    }, { merge: true });
    return true;
  });
};

const markEvent = (eventId, state, extra = {}) => db().collection("classPushReminderEvents").doc(eventId).set({
  state,
  ...extra,
  updatedAt: getAdmin().firestore.FieldValue.serverTimestamp(),
  ...(state === "sent" ? { sentAt: getAdmin().firestore.FieldValue.serverTimestamp() } : {}),
}, { merge: true });

const buildReminder = (kind, session = {}) => {
  const label = getSessionLabel(session);
  const className = getClassName(session);
  const route = kind === "checkin-open" ? checkinRoute(session) : classRoute(session);
  const base = { route, className, level: getLevel(session), sessionLabel: label };
  if (kind === "tomorrow") return { ...base, type: "class_tomorrow", title: "Class tomorrow", body: `${label}${className ? ` · ${className}` : ""}. Open Falowen to see the class details.` };
  if (kind === "one-hour") return { ...base, type: "class_one_hour", title: "Class starts in 1 hour", body: `${label}${className ? ` · ${className}` : ""}. Get ready for class.` };
  if (kind === "fifteen-minutes") return { ...base, type: "class_fifteen_minutes", title: "Class starts in 15 minutes", body: `${label}${className ? ` · ${className}` : ""}. Open the class details now.` };
  if (kind === "checkin-open") return { ...base, type: "class_checkin_open", title: "Check-in is open", body: `${label}${className ? ` · ${className}` : ""}. Open the attendance link now.` };
  return null;
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
        data: {
          sessionId,
          className: reminder.className,
          level: reminder.level,
          sessionLabel: reminder.sessionLabel,
          reminderKind: kind,
          sessionStartMs: getSessionStartMs(session) || "",
        },
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

const markOldReminderNotificationsSuperseded = async ({ sessionId, session, oldSession }) => {
  const targets = await findClassTargets(session || oldSession || {});
  const sessions = [session, oldSession].filter(Boolean);
  const refs = [];
  targets.forEach((target) => {
    sessions.forEach((candidate) => {
      REMINDER_KINDS.forEach((kind) => refs.push(
        db().collection("students").doc(target.id).collection("notifications").doc(notificationIdFor(sessionId, kind, candidate))
      ));
    });
  });
  for (let i = 0; i < refs.length; i += 400) {
    const batch = db().batch();
    refs.slice(i, i + 400).forEach((ref) => batch.set(ref, {
      status: "superseded",
      lifecycleState: "superseded",
      expired: true,
      updatedAt: getAdmin().firestore.FieldValue.serverTimestamp(),
    }, { merge: true }));
    await batch.commit();
  }
};

const sendImmediateClassChange = async ({ sessionId, session, kind, oldSession }) => {
  await markOldReminderNotificationsSuperseded({ sessionId, session, oldSession });
  const className = getClassName(session || oldSession || {});
  const label = getSessionLabel(session || oldSession || {});
  const route = classRoute(session || oldSession || {});
  const isCancelled = kind === "cancelled";
  const title = isCancelled ? "Class cancelled" : "Class rescheduled";
  const body = isCancelled
    ? `${label}${className ? ` · ${className}` : ""} has been cancelled. Previous reminders are no longer active.`
    : `${label}${className ? ` · ${className}` : ""} has a new date or time. Open the updated class details.`;
  const eventId = safeId(`${sessionId}-${startKey(session || oldSession)}-${kind}`);
  const claimed = await claimEvent(eventId, { sessionId, kind, className });
  if (!claimed) return;
  const targets = await findClassTargets(session || oldSession || {});
  const notificationId = safeId(`class-${sessionId}-${startKey(session || oldSession)}-${kind}`);
  let pushes = 0;
  for (const target of targets) {
    const result = await sendToStudent({
      target,
      notificationId,
      title,
      body,
      type: isCancelled ? "class_cancelled" : "class_rescheduled",
      route,
      data: {
        sessionId,
        className,
        level: getLevel(session || oldSession || {}),
        sessionLabel: label,
        previousStartMs: getSessionStartMs(oldSession || {}) || "",
        sessionStartMs: getSessionStartMs(session || {}) || "",
      },
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

const runClassReminderScan = async () => {
  const nowMs = Date.now();
  const snapshot = await db().collection("classSessions").get();
  let considered = 0;
  let sent = 0;
  for (const docSnap of snapshot.docs) {
    const session = docSnap.data() || {};
    const startMs = getSessionStartMs(session);
    if (!startMs || startMs < nowMs - 3 * 60 * 60_000 || startMs > nowMs + 25 * 60 * 60_000) continue;
    if (!isSessionActive(session, nowMs)) continue;
    considered += 1;
    for (const kind of reminderKindDue({ session, nowMs })) {
      const result = await sendClassLifecycleNotification({ sessionId: docSnap.id, session, kind });
      if (result?.sent) sent += result.sent;
    }
  }
  console.log("Class push lifecycle scan complete", { considered, sent });
};

const didStartChange = (before = {}, after = {}) => {
  const left = getSessionStartMs(before);
  const right = getSessionStartMs(after);
  return Boolean(left && right && Math.abs(left - right) >= 60_000);
};
const becameCancelled = (before = {}, after = {}) => isSessionActive(before) && !isSessionActive(after) && (
  TERMINAL_STATUSES.has(getSessionStatus(after)) || after.cancelled === true || after.canceled === true || after.isCancelled === true
);
const becameCheckinOpen = (before = {}, after = {}) => !isCheckinOpen(before) && isCheckinOpen(after) && isSessionActive(after);

const buildExports = () => ({
  sendClassPushLifecycleReminders: onSchedule({ region: REGION, schedule: "every 5 minutes", timeZone: TIME_ZONE }, async () => {
    await runClassReminderScan();
  }),
  onClassSessionPushLifecycleUpdated: onDocumentUpdated({ region: REGION, document: "classSessions/{sessionId}" }, async (event) => {
    const before = event.data?.before?.data() || {};
    const after = event.data?.after?.data() || {};
    const sessionId = event.params.sessionId;
    if (becameCancelled(before, after)) {
      await sendImmediateClassChange({ sessionId, session: after, oldSession: before, kind: "cancelled" });
      return null;
    }
    if (didStartChange(before, after) && isSessionActive(after)) {
      await sendImmediateClassChange({ sessionId, session: after, oldSession: before, kind: "rescheduled" });
    }
    if (becameCheckinOpen(before, after)) {
      await sendClassLifecycleNotification({ sessionId, session: after, kind: "checkin-open" });
    }
    return null;
  }),
});

module.exports = {
  ...buildExports(),
  _classPushLifecycle: {
    classRoute,
    checkinRoute,
    getSessionStartMs,
    isSessionActive,
    reminderKindDue,
    didStartChange,
    becameCancelled,
    becameCheckinOpen,
  },
};
