import axios from "axios";
import { getBackendUrl } from "./backendUrl";
import { db, doc, getDoc, isFirebaseConfigured, serverTimestamp, setDoc } from "../firebase";

export const getExamDayKey = (now = new Date()) => now.toISOString().slice(0, 10);
const dayDocumentId = (level, day) => `${day}-${String(level || "").toUpperCase()}`;

export const loadExamRoomResults = async ({ idToken, level }) => {
  if (!idToken) return { results: [], limited: false };
  const response = await axios.get(`${getBackendUrl()}/exam-room/results`, {
    headers: { Authorization: `Bearer ${idToken}` },
    params: { level: String(level || "").toUpperCase() },
  });
  return {
    results: Array.isArray(response.data?.results) ? response.data.results : [],
    limited: Boolean(response.data?.limited),
  };
};

export const loadDailyWarmupProgress = async ({ userId, level, day = getExamDayKey() }) => {
  if (!userId || !level || !isFirebaseConfigured || !db) return null;
  const snapshot = await getDoc(doc(db, "users", userId, "examRoomDaily", dayDocumentId(level, day)));
  return snapshot.exists() ? snapshot.data() : null;
};

export const saveDailyWarmupProgress = async ({
  userId,
  level,
  taskType,
  submittedToTutor = false,
  day = getExamDayKey(),
}) => {
  if (!userId || !level || !isFirebaseConfigured || !db) return false;
  try {
    await setDoc(
      doc(db, "users", userId, "examRoomDaily", dayDocumentId(level, day)),
      {
        userId,
        level: String(level).toUpperCase(),
        day,
        taskType: taskType || "warm-up",
        practised: true,
        submittedToTutor: Boolean(submittedToTutor),
        updatedAt: serverTimestamp(),
      },
      { merge: true },
    );
    return true;
  } catch (error) {
    console.warn("Could not sync exam warm-up progress", error);
    return false;
  }
};

// The existing daily warm-up stores use a UTC day seed. Read them so students
// keep their current-day progress when moving to the new dashboard.
export const getLocalDailyWarmup = (level, now = new Date()) => {
  const utcDay = Math.floor(Date.UTC(
    now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(),
  ) / 86400000);
  const key = `${utcDay}-${String(level || "").toUpperCase()}`;
  if (typeof window === "undefined") return { practised: false, hasDraft: false };
  try {
    const progress = JSON.parse(window.localStorage.getItem("falowen_exam_warmup_progress") || "{}");
    const legacy = JSON.parse(window.localStorage.getItem("falowen_question_of_day_progress") || "{}");
    const answers = JSON.parse(window.localStorage.getItem("falowen_exam_warmup_answers") || "{}");
    return {
      practised: Boolean(progress[key] || legacy[key]),
      hasDraft: Boolean(answers[key]?.answer?.trim()),
      submittedToTutor: Boolean((progress[key] || legacy[key])?.submittedToTutor),
    };
  } catch {
    return { practised: false, hasDraft: false };
  }
};
