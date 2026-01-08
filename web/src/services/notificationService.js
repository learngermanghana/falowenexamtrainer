import {
  collection,
  db,
  getDocs,
  isFirebaseConfigured,
  limit,
  orderBy,
  query,
  doc,
  setDoc,
  addDoc,
  serverTimestamp,
} from "../firebase";
import { fetchAttendanceRecords } from "./attendanceService";
import { fetchResults } from "./resultsService";

// -------------------------------------------
// Utility: timestamp parser
// -------------------------------------------
const parseTimestamp = (value) => {
  if (!value) return null;
  if (typeof value === "number") return value;
  if (typeof value === "string") {
    const parsed = new Date(value);
    return Number.isNaN(parsed.getTime()) ? null : parsed.getTime();
  }
  if (value?.toMillis) return value.toMillis();
  if (value?.seconds) return value.seconds * 1000;
  if (value instanceof Date) return value.getTime();
  return null;
};

const parseScoreValue = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

const resolvePushType = (payload = {}) => {
  const raw =
    payload?.data?.type ||
    payload?.data?.category ||
    payload?.data?.kind ||
    payload?.data?.event ||
    "";
  const normalized = String(raw || "").toLowerCase();
  if (normalized.includes("score") || normalized.includes("assignment")) return "Scores";
  if (normalized.includes("attendance")) return "Attendance";
  if (normalized.includes("class") || normalized.includes("discussion") || normalized.includes("board")) {
    return "Class board";
  }
  return "Update";
};

const resolvePushTitle = (payload = {}) =>
  payload?.notification?.title ||
  payload?.data?.title ||
  payload?.data?.subject ||
  payload?.data?.headline ||
  "New update";

const resolvePushBody = (payload = {}) =>
  payload?.notification?.body ||
  payload?.data?.body ||
  payload?.data?.message ||
  payload?.data?.detail ||
  "";

const resolvePushTimestamp = (payload = {}) =>
  parseTimestamp(
    payload?.data?.timestamp ||
      payload?.data?.sentAt ||
      payload?.data?.createdAt ||
      payload?.notification?.timestamp
  ) || payload?.sentTime || Date.now();

const resolvePushId = (payload = {}) =>
  payload?.messageId || payload?.data?.notificationId || payload?.data?.id || null;

// -------------------------------------------
// Student code resolver
// -------------------------------------------
const studentCodeFromProfile = (profile = {}) =>
  profile.studentCode || profile.studentcode || profile.id || "";

// -------------------------------------------
// Helper: Normalize attendance status
// -------------------------------------------
const normalizeAttendanceStatus = (record = {}) => {
  if (record.marked === false) return ""; // not recorded yet
  if (record.present === true) return "present";
  if (record.present === false) return "absent";

  const raw =
    (record.status || record.attendance || record.state || "").toString().toLowerCase();
  if (raw.includes("present")) return "present";
  if (raw.includes("absent")) return "absent";
  return "";
};

// -------------------------------------------
// Scores notification
// -------------------------------------------
const buildScoreNotification = (resultsPayload) => {
  const latestScore = resultsPayload?.results?.[0];
  if (!latestScore) return null;

  const timestamp = parseTimestamp(latestScore.date) || Date.now();
  const headline = latestScore.assignment || "Assignment";
  const scoreValue = parseScoreValue(latestScore.score);
  const scoreText = scoreValue !== null ? `${scoreValue}/100` : "Awaiting score";
  const detail = latestScore.comments
    ? `${scoreText} · ${latestScore.comments}`
    : scoreText;

  return {
    id: `score-${latestScore.assignment}-${timestamp}`,
    type: "Scores",
    title: `${headline} marked`,
    body: detail,
    timestamp,
  };
};

// -------------------------------------------
// Attendance notification (fixed)
// -------------------------------------------
const buildAttendanceNotification = (attendancePayload) => {
  const records = attendancePayload?.records || [];
  if (!records.length) return null;

  // Only include records where the student was explicitly marked
  const markedRecords = records.filter((r) => r && r.marked);
  if (!markedRecords.length) return null;

  const latest = markedRecords
    .slice()
    .sort(
      (a, b) => (parseTimestamp(b.date) || 0) - (parseTimestamp(a.date) || 0)
    )[0];

  const timestamp = parseTimestamp(latest.date) || Date.now();
  const status = normalizeAttendanceStatus(latest) || "present";
  const label = latest.title || "Class session";

  const isPresent = status === "present";

  return {
    id: `attendance-${latest.id || label}-${timestamp}`,
    type: "Attendance",
    title: isPresent ? "Marked present ✅" : "Marked absent ❌",
    body: isPresent
      ? `${label} • Present`
      : `${label} • Absent`,
    timestamp,
  };
};

// -------------------------------------------
// Class board announcements
// -------------------------------------------
const fetchClassBoardAnnouncements = async ({ level, className } = {}) => {
  if (!level || !className || !isFirebaseConfigured || !db) return [];

  const ref = collection(db, "class_board", level, "classes", className, "posts");
  const snapshot = await getDocs(
    query(ref, orderBy("createdAt", "desc"), limit(5))
  );

  return snapshot.docs.map((docSnapshot) => {
    const data = docSnapshot.data() || {};
    const timestamp = parseTimestamp(data.createdAt) || Date.now();
    return {
      id: docSnapshot.id,
      type: "Class board",
      title:
        data.topic ||
        data.questionTitle ||
        data.lessonLabel ||
        "New class post",
      body:
        data.question ||
        data.instructions ||
        "Your tutor posted a new discussion.",
      timestamp,
    };
  });
};

// -------------------------------------------
// Main function: Fetch all notifications
// -------------------------------------------
export const fetchStudentNotifications = async (profile) => {
  if (!profile || !isFirebaseConfigured || !db) return [];

  const studentCode = studentCodeFromProfile(profile);

  const fetchStoredNotifications = async () => {
    if (!profile?.id) return [];
    const ref = collection(db, "students", profile.id, "notifications");
    const snapshot = await getDocs(query(ref, orderBy("timestamp", "desc"), limit(12)));
    return snapshot.docs.map((docSnapshot) => {
      const data = docSnapshot.data() || {};
      const timestamp = parseTimestamp(data.timestamp || data.sentAt || data.createdAt) || Date.now();
      return {
        id: docSnapshot.id,
        type: data.type || "Update",
        title: data.title || "New update",
        body: data.body || "",
        timestamp,
        source: data.source || "push",
      };
    });
  };

  const [resultsPayload, attendancePayload, classBoard, storedNotifications] = await Promise.all([
    fetchResults({ level: profile.level, studentCode, email: profile.email }),
    fetchAttendanceRecords({ className: profile.className, studentCode }),
    fetchClassBoardAnnouncements({ level: profile.level, className: profile.className }),
    fetchStoredNotifications(),
  ]);

  const candidates = [
    ...(storedNotifications || []),
    buildScoreNotification(resultsPayload),
    buildAttendanceNotification(attendancePayload),
    ...classBoard,
  ].filter(Boolean);

  const deduped = candidates.reduce((acc, item) => {
    if (!item) return acc;
    const key = item.id || `${item.type}-${item.title}-${item.timestamp}`;
    if (!acc.map.has(key)) {
      acc.map.set(key, true);
      acc.items.push(item);
    }
    return acc;
  }, { items: [], map: new Map() });

  return deduped.items
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
    .slice(0, 12);
};

export const buildPushNotification = (payload = {}) => {
  if (!payload) return null;
  const timestamp = resolvePushTimestamp(payload);
  return {
    id: resolvePushId(payload) || `push-${timestamp}`,
    type: resolvePushType(payload),
    title: resolvePushTitle(payload),
    body: resolvePushBody(payload),
    timestamp,
    source: "push",
    data: payload?.data || {},
  };
};

export const persistPushNotification = async ({ studentId, payload, notification } = {}) => {
  if (!studentId || !payload || !isFirebaseConfigured || !db) return null;
  const normalized = notification || buildPushNotification(payload);
  if (!normalized) return null;

  const { id, data, ...rest } = normalized;
  const payloadToWrite = {
    ...rest,
    data: data || payload?.data || {},
    createdAt: serverTimestamp(),
  };

  const targetId = resolvePushId(payload);
  if (targetId) {
    const docRef = doc(db, "students", studentId, "notifications", targetId);
    await setDoc(docRef, payloadToWrite, { merge: true });
    return targetId;
  }

  const collectionRef = collection(db, "students", studentId, "notifications");
  const docRef = await addDoc(collectionRef, payloadToWrite);
  return docRef.id;
};

export { fetchClassBoardAnnouncements };
