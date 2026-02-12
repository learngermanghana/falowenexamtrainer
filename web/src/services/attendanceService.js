import { collection, db, getDocs, isFirebaseConfigured } from "../firebase";

const toBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value > 0;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return ["present", "p", "yes", "y", "true", "1", "attended"].includes(normalized);
  }
  if (value && typeof value === "object") {
    if ("attended" in value) return toBoolean(value.attended);
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

const parseDurationToHours = (value) => {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number" && !Number.isNaN(value)) return value;
  if (typeof value !== "string") return 0;

  const normalized = value.trim().toLowerCase();
  if (!normalized) return 0;

  const numericOnly = normalized.replace(/[^0-9.]/g, "");
  const hasHourToken = /h|hr|hour/.test(normalized);
  const hasMinuteToken = /m|min|minute/.test(normalized);

  if (normalized.includes(":")) {
    const [hoursPart, minutesPart] = normalized.split(":");
    const hours = Number.parseFloat(hoursPart);
    const minutes = Number.parseFloat(minutesPart);
    if (!Number.isNaN(hours)) {
      return hours + (!Number.isNaN(minutes) ? minutes / 60 : 0);
    }
  }

  if (hasHourToken || hasMinuteToken) {
    const hoursMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(?:h|hr|hour)/);
    const minutesMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(?:m|min|minute)/);
    const hours = hoursMatch ? Number.parseFloat(hoursMatch[1]) : 0;
    const minutes = minutesMatch ? Number.parseFloat(minutesMatch[1]) : 0;
    if (!Number.isNaN(hours) || !Number.isNaN(minutes)) {
      return (Number.isNaN(hours) ? 0 : hours) + (Number.isNaN(minutes) ? 0 : minutes / 60);
    }
  }

  const spacedParts = normalized.split(/\s+/).filter(Boolean);
  if (spacedParts.length === 2) {
    const [hoursPart, minutesPart] = spacedParts;
    const hours = Number.parseFloat(hoursPart);
    const minutes = Number.parseFloat(minutesPart);
    if (!Number.isNaN(hours) && !Number.isNaN(minutes)) {
      return hours + minutes / 60;
    }
  }

  if (numericOnly) {
    const numericValue = Number.parseFloat(numericOnly);
    if (!Number.isNaN(numericValue)) {
      if (hasMinuteToken && !hasHourToken) {
        return numericValue / 60;
      }
      return numericValue;
    }
  }

  return 0;
};

const getDefaultSessionHours = (level = "") => {
  const normalized = String(level || "").trim().toUpperCase();
  if (normalized === "A1") return 1;
  if (normalized === "A2" || normalized === "B1") return 1.5;
  return 0;
};

export const formatAttendanceRecord = (id, data = {}, studentCode = "", options = {}) => {
  const { level } = options;
  const studentEntry = getStudentAttendance(data, studentCode);
  const hasMark = studentEntry !== undefined && studentEntry !== null && studentEntry !== "";
  const rawStatus =
    typeof studentEntry === "object" && studentEntry !== null
      ? studentEntry.status ?? studentEntry.attendance ?? studentEntry.state
      : studentEntry;
  const normalizedStatus = typeof rawStatus === "string" ? rawStatus.trim().toLowerCase() : "";
  const isPending =
    !hasMark ||
    normalizedStatus.includes("pending") ||
    normalizedStatus.includes("await") ||
    normalizedStatus.includes("unconfirmed");
  const hasLateFlag =
    (studentEntry && typeof studentEntry === "object" && studentEntry.late === true) || data.late === true;
  const isLate = hasLateFlag || /\b(late|tardy)\b/.test(normalizedStatus);
  const present = isPending ? null : isLate ? true : toBoolean(studentEntry);
  const status = isPending ? "Pending" : isLate ? "Late" : present ? "Present" : "Absent";
  const rawDuration = data.hours ?? data.durationHours ?? data.duration ?? data.length;
  const sessionHours = parseDurationToHours(rawDuration);
  const defaultHours = sessionHours ? 0 : getDefaultSessionHours(level);
  const resolvedHours = sessionHours || defaultHours;

  const record = {
    id,
    date: data.date || data.sessionDate || id,
    title: data.topic || data.chapter || data.title || "Session",
    present,
    status,
    marked: !isPending,
    markedAt:
      (studentEntry && typeof studentEntry === "object" &&
        (studentEntry.markedAt || studentEntry.updatedAt || studentEntry.timestamp)) ||
      data.markedAt ||
      data.updatedAt ||
      data.timestamp ||
      null,
    hours: resolvedHours,
    creditedHours: present ? resolvedHours : 0,
    note: (studentEntry && typeof studentEntry === "object" && studentEntry.note) || data.note || "",
  };

  return { record, sessionHours: resolvedHours, present, hours: resolvedHours };
};

export const fetchAttendanceRecords = async ({ className, studentCode, level } = {}) => {
  if (!className || !studentCode || !isFirebaseConfigured || !db) {
    return { records: [], sessions: 0, hours: 0 };
  }

  const snap = await getDocs(collection(db, "attendance", className, "sessions"));
  const records = [];
  let sessions = 0;
  let hours = 0;

  snap.forEach((doc) => {
    const data = doc.data() || {};
    const { record, sessionHours } = formatAttendanceRecord(doc.id, data, studentCode, { level });
    records.push(record);
    if (record.present) {
      sessions += 1;
      hours += sessionHours || 0;
    }
  });

  return { records, sessions, hours };
};

export const fetchAttendanceSummary = async ({ className, studentCode, level } = {}) => {
  if (!className || !studentCode || !isFirebaseConfigured || !db) {
    return { sessions: 0, hours: 0 };
  }

  const snap = await getDocs(collection(db, "attendance", className, "sessions"));
  let sessions = 0;
  let hours = 0;

  snap.forEach((doc) => {
    const { present, hours: h } = formatAttendanceRecord(doc.id, doc.data() || {}, studentCode, { level });
    if (present) {
      sessions += 1;
      hours += h || 0;
    }
  });

  return { sessions, hours };
};
