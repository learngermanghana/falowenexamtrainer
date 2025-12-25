import {
  collection,
  db,
  getDocs,
  isFirebaseConfigured,
  limit,
  orderBy,
  query,
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
  const scoreText =
    typeof latestScore.score === "number" ? `${latestScore.score}/100` : "Awaiting score";
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

  const [resultsPayload, attendancePayload, classBoard] = await Promise.all([
    fetchResults({ level: profile.level, studentCode, email: profile.email }),
    fetchAttendanceRecords({ className: profile.className, studentCode }),
    fetchClassBoardAnnouncements({ level: profile.level, className: profile.className }),
  ]);

  const candidates = [
    buildScoreNotification(resultsPayload),
    buildAttendanceNotification(attendancePayload),
    ...classBoard,
  ].filter(Boolean);

  return candidates
    .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0))
    .slice(0, 12);
};

export { fetchClassBoardAnnouncements };
