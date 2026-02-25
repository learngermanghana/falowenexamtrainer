import { collection, db, doc, getDoc, getDocs, isFirebaseConfigured } from "../firebase";

const normalizeValue = (value = "") => String(value || "").trim();

const isFirebaseReady = () => {
  const configured =
    typeof isFirebaseConfigured === "function"
      ? isFirebaseConfigured()
      : isFirebaseConfigured;
  return Boolean(configured && db);
};

const getCodeAliases = (studentCode = "") => {
  const trimmed = normalizeValue(studentCode);
  return [trimmed, trimmed.toLowerCase(), trimmed.toUpperCase()].filter(Boolean);
};

const getCheckinDocIds = ({ studentUid = "", studentCode = "" } = {}) => {
  const unique = new Set();
  const push = (value) => {
    const normalized = normalizeValue(value);
    if (normalized) unique.add(normalized);
  };

  push(studentUid);
  getCodeAliases(studentCode).forEach((alias) => push(alias));

  return Array.from(unique);
};

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
  const aliases = getCodeAliases(studentCode);
  if (!aliases.length) return data.present ?? data.attended ?? data.status;

  const maps = [data.attendance, data.students, data.participants];

  for (const map of maps) {
    if (map && typeof map === "object") {
      for (const alias of aliases) {
        if (map[alias] !== undefined) return map[alias];
      }
    }
  }

  for (const alias of aliases) {
    if (data[alias] !== undefined) return data[alias];
  }

  return undefined;
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

const getCheckinPresentState = (checkin = {}) => {
  if (!checkin || typeof checkin !== "object") return null;

  if (checkin.present !== undefined) {
    return toBoolean(checkin.present);
  }
  if (checkin.attended !== undefined) {
    return toBoolean(checkin.attended);
  }

  const status = String(checkin.status || checkin.attendance || "").trim().toLowerCase();
  if (!status) return null;
  if (status.includes("present") || status.includes("attended")) return true;
  if (status.includes("absent") || status.includes("missed")) return false;
  return null;
};

const applyCheckinOverride = (record, checkin = {}) => {
  const checkinPresent = getCheckinPresentState(checkin);
  if (checkinPresent === null) return record;

  return {
    ...record,
    present: checkinPresent,
    status: checkinPresent ? "Present" : "Absent",
    marked: true,
    markedAt:
      checkin.checkedInAt ||
      checkin.submittedAt ||
      checkin.updatedAt ||
      checkin.createdAt ||
      record.markedAt,
    note: record.note || checkin.note || "",
  };
};

export const formatAttendanceRecord = (id, data = {}, studentCode = "", options = {}) => {
  const { level } = options;
  const studentEntry = getStudentAttendance(data, studentCode);
  const entryIsObject = typeof studentEntry === "object" && studentEntry !== null;
  const rawStatus =
    entryIsObject
      ? studentEntry.status ?? studentEntry.attendance ?? studentEntry.state
      : studentEntry;
  const normalizedStatus = typeof rawStatus === "string" ? rawStatus.trim().toLowerCase() : "";
  const hasExplicitStatus =
    normalizedStatus.length > 0 ||
    (entryIsObject &&
      ("present" in studentEntry || "attended" in studentEntry || "status" in studentEntry));
  const hasMark = entryIsObject
    ? hasExplicitStatus
    : studentEntry !== undefined && studentEntry !== null && studentEntry !== "";
  const isPending =
    !hasMark ||
    normalizedStatus.includes("pending") ||
    normalizedStatus.includes("await") ||
    normalizedStatus.includes("unconfirmed");
  const hasLateFlag =
    (entryIsObject && studentEntry.late === true) || data.late === true;
  const isLate = hasLateFlag || /\b(late|tardy)\b/.test(normalizedStatus);
  const hasExplicitPresentFlag =
    entryIsObject && ("present" in studentEntry || "attended" in studentEntry);
  const explicitPresentValue = hasExplicitPresentFlag
    ? toBoolean(studentEntry.present ?? studentEntry.attended)
    : null;
  const statusImpliesPresent = normalizedStatus.includes("present") || normalizedStatus.includes("attended");
  const statusImpliesAbsent = normalizedStatus.includes("absent") || normalizedStatus.includes("missed");
  const present = isPending
    ? null
    : isLate
    ? true
    : explicitPresentValue !== null
    ? explicitPresentValue
    : statusImpliesPresent
    ? true
    : statusImpliesAbsent
    ? false
    : toBoolean(studentEntry);
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
      (entryIsObject &&
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

export const fetchAttendanceRecords = async ({ className, studentCode, studentUid, level } = {}) => {
  const normalizedClassName = normalizeValue(className);
  const normalizedStudentCode = normalizeValue(studentCode);
  const normalizedStudentUid = normalizeValue(studentUid);
  const checkinDocIds = getCheckinDocIds({
    studentUid: normalizedStudentUid,
    studentCode: normalizedStudentCode,
  });

  if (!normalizedClassName || !normalizedStudentCode || !isFirebaseReady()) {
    return { records: [], sessions: 0, hours: 0 };
  }

  try {
    const snap = await getDocs(collection(db, "attendance", normalizedClassName, "sessions"));
    const entries = await Promise.all(
      snap.docs.map(async (sessionDoc) => {
        const data = sessionDoc.data() || {};
        const { record, sessionHours } = formatAttendanceRecord(
          sessionDoc.id,
          data,
          normalizedStudentCode,
          { level }
        );

        if (!checkinDocIds.length) {
          return { record, sessionHours };
        }

        for (const checkinDocId of checkinDocIds) {
          const checkinRef = doc(
            db,
            "attendance",
            normalizedClassName,
            "sessions",
            sessionDoc.id,
            "checkins",
            checkinDocId
          );
          const checkinSnap = await getDoc(checkinRef);
          if (!checkinSnap.exists()) {
            continue;
          }

          const overriddenRecord = applyCheckinOverride(record, checkinSnap.data() || {});
          return { record: overriddenRecord, sessionHours };
        }

        return { record, sessionHours };
      })
    );

    const records = [];
    let sessions = 0;
    let hours = 0;

    entries.forEach(({ record, sessionHours }) => {
      records.push(record);
      if (record.present) {
        sessions += 1;
        hours += sessionHours || 0;
      }
    });

    return { records, sessions, hours };
  } catch (error) {
    console.error("Failed to fetch attendance records", error);
    return { records: [], sessions: 0, hours: 0 };
  }
};

export const fetchAttendanceSummary = async ({ className, studentCode, level } = {}) => {
  const { sessions, hours } = await fetchAttendanceRecords({ className, studentCode, level });
  return { sessions, hours };
};
