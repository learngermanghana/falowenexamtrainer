import { collection, db, getDocs, isFirebaseConfigured } from "../firebase";
import { firestoreCollections } from "../lib/firestorePaths";

const toBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value > 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return ["present", "p", "yes", "y", "true", "1", "attended"].includes(normalized);
  }
  if (value && typeof value === "object") {
    if ("present" in value) return toBoolean(value.present);
    if ("status" in value) return toBoolean(value.status);
  }
  return false;
};

const getStudentAttendance = (data = {}, studentCode = "") => {
  if (!studentCode) return data.present ?? data.attended ?? data.status;

  const normalizedCode = studentCode.toLowerCase();
  const maps = [data.attendance, data.students, data.participants];

  for (const map of maps) {
    if (map && typeof map === "object") {
      const match =
        map[studentCode] ??
        map[normalizedCode] ??
        map[studentCode.toUpperCase()];
      if (match !== undefined) return match;
    }
  }

  return data[studentCode] ?? data[normalizedCode] ?? data[studentCode.toUpperCase()];
};

export const formatAttendanceRecord = (id, data = {}, studentCode = "") => {
  const studentEntry = getStudentAttendance(data, studentCode);
  const present = toBoolean(studentEntry);
  const sessionHours = Number(data.hours ?? data.durationHours ?? data.duration ?? data.length) || 0;

  const record = {
    id,
    date: data.date || data.sessionDate || id,
    title: data.topic || data.chapter || data.title || "Session",
    present,
    status: present ? "Present" : "Absent",
    hours: sessionHours,
    creditedHours: present ? sessionHours : 0,
    note: (studentEntry && typeof studentEntry === "object" && studentEntry.note) || data.note || "",
  };

  return { record, sessionHours, present, hours: sessionHours };
};

export const fetchAttendanceRecords = async ({ className, studentCode } = {}) => {
  if (!className || !studentCode || !isFirebaseConfigured || !db) {
    return { records: [], sessions: 0, hours: 0 };
  }

  const snap = await getDocs(collection(db, ...firestoreCollections.attendanceSessions(className)));
  const records = [];
  let sessions = 0;
  let hours = 0;

  snap.forEach((doc) => {
    const data = doc.data() || {};
    const { record, sessionHours } = formatAttendanceRecord(doc.id, data, studentCode);
    records.push(record);
    if (record.present) {
      sessions += 1;
      hours += sessionHours || 0;
    }
  });

  return { records, sessions, hours };
};

export const fetchAttendanceSummary = async ({ className, studentCode } = {}) => {
  if (!className || !studentCode || !isFirebaseConfigured || !db) {
    return { sessions: 0, hours: 0 };
  }

  const snap = await getDocs(collection(db, ...firestoreCollections.attendanceSessions(className)));
  let sessions = 0;
  let hours = 0;

  snap.forEach((doc) => {
    const { present, hours: h } = formatAttendanceRecord(doc.id, doc.data() || {}, studentCode);
    if (present) {
      sessions += 1;
      hours += h || 0;
    }
  });

  return { sessions, hours };
};
