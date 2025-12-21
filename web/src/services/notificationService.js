import { collection, db, getDocs, isFirebaseConfigured, limit, orderBy, query } from "../firebase";
import { fetchAttendanceRecords } from "./attendanceService";
import { fetchResults } from "./resultsService";

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

const studentCodeFromProfile = (profile = {}) => profile.studentCode || profile.studentcode || profile.id || "";

const buildScoreNotification = (resultsPayload) => {
  const latestScore = resultsPayload?.results?.[0];
  if (!latestScore) return null;

  const timestamp = parseTimestamp(latestScore.date) || Date.now();
  const headline = latestScore.assignment || "Assignment";
  const scoreText = typeof latestScore.score === "number" ? `${latestScore.score}/100` : "Awaiting score";
  const detail = latestScore.comments ? `${scoreText} · ${latestScore.comments}` : scoreText;

  return {
    id: `score-${latestScore.assignment}-${timestamp}`,
    type: "Scores",
    title: `${headline} marked`,
    body: detail,
    timestamp,
  };
};

const buildAttendanceNotification = (attendancePayload) => {
  const records = attendancePayload?.records || [];
  if (!records.length) return null;

  const latest = records
    .slice()
    .sort((a, b) => (parseTimestamp(b.date) || 0) - (parseTimestamp(a.date) || 0))[0];

  const timestamp = parseTimestamp(latest.date) || Date.now();
  const status = latest.present ? "Present" : "Absent";
  const label = latest.title || "Class session";

  return {
    id: `attendance-${latest.id || label}-${timestamp}`,
    type: "Attendance",
    title: `${status} marked`,
    body: `${label} • ${status}`,
    timestamp,
  };
};

const fetchClassBoardAnnouncements = async ({ level, className } = {}) => {
  if (!level || !className || !isFirebaseConfigured || !db) return [];

  const ref = collection(db, "class_board", level, "classes", className, "posts");
  const snapshot = await getDocs(query(ref, orderBy("createdAt", "desc"), limit(5)));
  return snapshot.docs.map((docSnapshot) => {
    const data = docSnapshot.data() || {};
    const timestamp = parseTimestamp(data.createdAt) || Date.now();
    return {
      id: docSnapshot.id,
      type: "Class board",
      title: data.topic || data.questionTitle || data.lessonLabel || "New class post",
      body: data.question || data.instructions || "Your tutor posted a new discussion.",
      timestamp,
    };
  });
};

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

  return candidates.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0)).slice(0, 12);
};

export { fetchClassBoardAnnouncements };
