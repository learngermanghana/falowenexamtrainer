import { collection, db, doc, getDoc, getDocs, isFirebaseConfigured } from "../firebase";
import { classCatalog } from "../data/classCatalog";

const normalizeValue = (value = "") => String(value || "").trim();
const normalizeLower = (value = "") => normalizeValue(value).toLowerCase();
const ATTENDANCE_TARGET = 80;

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
  getCodeAliases(studentCode).forEach(push);
  return Array.from(unique);
};

const normalizeChapterLabel = (value = "") => {
  const text = normalizeValue(value);
  if (!text) return "";
  if (/^chapter\b/i.test(text)) return text;
  return `Chapter ${text}`;
};

export const resolveSessionLabel = (data = {}) => {
  const sessionLabel = normalizeValue(data.sessionLabel);
  const chapterRaw =
    data.chapter ||
    data.chapterName ||
    data.chapterLabel ||
    data.chapterNumber ||
    "";
  const chapter = normalizeChapterLabel(chapterRaw);
  const topic = normalizeValue(data.topic || data.title || data.meetingTopic);
  const sessionName = normalizeValue(data.session || data.name);
  const titleToken = /^(session|class|lesson)\b/i;

  if (sessionLabel) {
    return { title: sessionLabel, chapter, topic: topic || sessionLabel };
  }
  if (chapter && topic && !titleToken.test(topic)) {
    return { title: `${chapter} · ${topic}`, chapter, topic };
  }
  if (chapter) return { title: chapter, chapter, topic };
  if (topic) return { title: topic, chapter: "", topic };
  if (sessionName) return { title: sessionName, chapter: "", topic: "" };
  return { title: "Session", chapter: "", topic: "" };
};

const toBoolean = (value) => {
  if (typeof value === "boolean") return value;
  if (typeof value === "number") return value > 0;
  if (typeof value === "string") {
    return ["present", "p", "yes", "y", "true", "1", "attended"].includes(
      value.trim().toLowerCase()
    );
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

  for (const map of [data.attendance, data.students, data.participants]) {
    if (!map || typeof map !== "object") continue;
    for (const alias of aliases) {
      if (map[alias] !== undefined) return map[alias];
    }
  }

  for (const alias of aliases) {
    if (data[alias] !== undefined) return data[alias];
  }
  return undefined;
};

const parseDurationToHours = (value) => {
  if (value === null || value === undefined) return 0;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value !== "string") return 0;

  const normalized = value.trim().toLowerCase();
  if (!normalized) return 0;

  if (normalized.includes(":")) {
    const [hoursPart, minutesPart] = normalized.split(":");
    const hours = Number.parseFloat(hoursPart);
    const minutes = Number.parseFloat(minutesPart);
    if (Number.isFinite(hours)) return hours + (Number.isFinite(minutes) ? minutes / 60 : 0);
  }

  const hoursMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(?:h|hr|hour)/);
  const minutesMatch = normalized.match(/(\d+(?:\.\d+)?)\s*(?:m|min|minute)/);
  if (hoursMatch || minutesMatch) {
    const hours = hoursMatch ? Number.parseFloat(hoursMatch[1]) : 0;
    const minutes = minutesMatch ? Number.parseFloat(minutesMatch[1]) : 0;
    return (Number.isFinite(hours) ? hours : 0) + (Number.isFinite(minutes) ? minutes / 60 : 0);
  }

  const numericValue = Number.parseFloat(normalized.replace(/[^0-9.]/g, ""));
  return Number.isFinite(numericValue) ? numericValue : 0;
};

const getDefaultSessionHours = (level = "") => {
  const normalized = normalizeValue(level).toUpperCase();
  if (normalized === "A1") return 1;
  if (normalized === "A2" || normalized === "B1") return 1.5;
  return 0;
};

const getCheckinPresentState = (checkin = {}) => {
  if (!checkin || typeof checkin !== "object") return null;
  if (checkin.present !== undefined) return toBoolean(checkin.present);
  if (checkin.attended !== undefined) return toBoolean(checkin.attended);

  const status = normalizeLower(checkin.status || checkin.attendance);
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

const toMillis = (value, { endOfDay = false } = {}) => {
  if (!value) return Number.NaN;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value?.toDate === "function") {
    const date = value.toDate();
    return date instanceof Date ? date.getTime() : Number.NaN;
  }
  if (value instanceof Date) return value.getTime();
  if (typeof value === "number") return Number.isFinite(value) ? value : Number.NaN;

  const text = normalizeValue(value);
  const isoDateOnly = text.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoDateOnly) {
    const [, year, month, day] = isoDateOnly;
    return Date.UTC(
      Number(year),
      Number(month) - 1,
      Number(day),
      endOfDay ? 23 : 0,
      endOfDay ? 59 : 0,
      endOfDay ? 59 : 0,
      endOfDay ? 999 : 0
    );
  }

  const slashDate = text.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashDate) {
    const [, day, month, year] = slashDate;
    return Date.UTC(
      Number(year),
      Number(month) - 1,
      Number(day),
      endOfDay ? 23 : 0,
      endOfDay ? 59 : 0,
      endOfDay ? 59 : 0,
      endOfDay ? 999 : 0
    );
  }

  const parsed = new Date(text).getTime();
  return Number.isFinite(parsed) ? parsed : Number.NaN;
};

const combineDateAndTime = (dateValue, timeValue) => {
  const date = normalizeValue(dateValue);
  const time = normalizeValue(timeValue);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{1,2}:\d{2}/.test(time)) {
    return Number.NaN;
  }
  return toMillis(`${date}T${time}:00Z`);
};

const getSessionEndMillis = (record = {}) => {
  for (const value of [
    record.endsAt,
    record.endDateTime,
    record.endAt,
    record.openTo,
    record.closesAt,
    record.activeUntil,
  ]) {
    const parsed = toMillis(value);
    if (Number.isFinite(parsed)) return parsed;
  }

  const combined = combineDateAndTime(record.date, record.endTime);
  if (Number.isFinite(combined)) return combined;
  return toMillis(record.date || record.sessionDate || record.id, { endOfDay: true });
};

const getSessionStartMillis = (record = {}) => {
  for (const value of [
    record.startsAt,
    record.startDateTime,
    record.startAt,
    record.openFrom,
  ]) {
    const parsed = toMillis(value);
    if (Number.isFinite(parsed)) return parsed;
  }

  const combined = combineDateAndTime(record.date, record.startTime);
  if (Number.isFinite(combined)) return combined;
  return toMillis(record.date || record.sessionDate || record.id);
};

const isSelfPracticeRecord = (record = {}) => {
  if (record.liveClass === true) return false;
  if (record.selfPractice === true) return true;
  if (normalizeLower(record.assessmentType) === "self-practice") return true;
  const description = normalizeLower(
    [record.sessionLabel, record.title, record.topic, record.note, record.sessionType]
      .filter(Boolean)
      .join(" ")
  );
  return /self[-\s]?practice(?:\s+only)?/.test(description);
};

const getClassReportingWindow = (className = "") => {
  const details = classCatalog?.[className] || {};
  const starts = [details.orientationDate, details.startDate]
    .map((value) => toMillis(value))
    .filter(Number.isFinite);
  return {
    startMs: starts.length ? Math.min(...starts) : Number.NaN,
    endMs: toMillis(details.endDate, { endOfDay: true }),
  };
};

export const filterAttendanceRecordsForReporting = (
  records = [],
  { className = "", now = Date.now(), classStartDate, classEndDate } = {}
) => {
  const nowMs = toMillis(now);
  const catalogWindow = getClassReportingWindow(className);
  const explicitStartMs = toMillis(classStartDate);
  const explicitEndMs = toMillis(classEndDate, { endOfDay: true });
  const startMs = Number.isFinite(explicitStartMs) ? explicitStartMs : catalogWindow.startMs;
  const endMs = Number.isFinite(explicitEndMs) ? explicitEndMs : catalogWindow.endMs;

  return records.filter((record) => {
    if (isSelfPracticeRecord(record)) return false;

    const sessionStartMs = getSessionStartMillis(record);
    const sessionEndMs = getSessionEndMillis(record);
    const scheduleMs = Number.isFinite(sessionEndMs) ? sessionEndMs : sessionStartMs;

    if (Number.isFinite(scheduleMs) && Number.isFinite(nowMs) && scheduleMs > nowMs) {
      return false;
    }
    if (Number.isFinite(startMs) && Number.isFinite(sessionEndMs) && sessionEndMs < startMs) {
      return false;
    }
    if (Number.isFinite(endMs) && Number.isFinite(sessionStartMs) && sessionStartMs > endMs) {
      return false;
    }
    return true;
  });
};

export const formatAttendanceRecord = (id, data = {}, studentCode = "", options = {}) => {
  const { level } = options;
  const studentEntry = getStudentAttendance(data, studentCode);
  const entryIsObject = typeof studentEntry === "object" && studentEntry !== null;
  const rawStatus = entryIsObject
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
  const isLate =
    (entryIsObject && studentEntry.late === true) ||
    data.late === true ||
    /\b(late|tardy)\b/.test(normalizedStatus);
  const hasExplicitPresentFlag =
    entryIsObject && ("present" in studentEntry || "attended" in studentEntry);
  const explicitPresentValue = hasExplicitPresentFlag
    ? toBoolean(studentEntry.present ?? studentEntry.attended)
    : null;
  const statusImpliesPresent =
    normalizedStatus.includes("present") || normalizedStatus.includes("attended");
  const statusImpliesAbsent =
    normalizedStatus.includes("absent") || normalizedStatus.includes("missed");
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
  const resolvedHours = sessionHours || getDefaultSessionHours(level);
  const sessionLabel = resolveSessionLabel(data);

  const record = {
    id,
    date: data.date || data.sessionDate || id,
    sessionDate: data.sessionDate || data.date || id,
    sessionLabel: normalizeValue(data.sessionLabel || sessionLabel.title),
    title: sessionLabel.title,
    chapter: sessionLabel.chapter,
    topic: sessionLabel.topic,
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
    note: (entryIsObject && studentEntry.note) || data.note || "",
    startTime: data.startTime || "",
    endTime: data.endTime || "",
    startsAt: data.startsAt || data.startAt || data.startDateTime || data.openFrom || null,
    endsAt:
      data.endsAt ||
      data.endAt ||
      data.endDateTime ||
      data.openTo ||
      data.closesAt ||
      data.activeUntil ||
      null,
    sessionType: data.type || data.sessionType || "",
    assessmentType: data.assessmentType || "",
    selfPractice: data.selfPractice === true,
    liveClass: data.liveClass === true,
  };

  return { record, sessionHours: resolvedHours, present, hours: resolvedHours };
};

export const fetchAttendanceRecords = async ({
  className,
  studentCode,
  studentUid,
  level,
  now,
} = {}) => {
  const normalizedClassName = normalizeValue(className);
  const normalizedStudentCode = normalizeValue(studentCode);
  const normalizedStudentUid = normalizeValue(studentUid);
  const checkinDocIds = getCheckinDocIds({
    studentUid: normalizedStudentUid,
    studentCode: normalizedStudentCode,
  });

  if (!normalizedClassName || !normalizedStudentCode || !isFirebaseReady()) {
    return { records: [], sessions: 0, hours: 0, excludedSessions: 0 };
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
          if (checkinSnap.exists()) {
            return {
              record: applyCheckinOverride(record, checkinSnap.data() || {}),
              sessionHours,
            };
          }
        }

        return { record, sessionHours };
      })
    );

    const allRecords = entries.map(({ record }) => record);
    const records = filterAttendanceRecordsForReporting(allRecords, {
      className: normalizedClassName,
      now: now ?? Date.now(),
    });
    const allowedIds = new Set(records.map((record) => record.id));
    let sessions = 0;
    let hours = 0;

    entries.forEach(({ record, sessionHours }) => {
      if (!allowedIds.has(record.id) || record.present !== true) return;
      sessions += 1;
      hours += sessionHours || 0;
    });

    return {
      records,
      sessions,
      hours,
      excludedSessions: Math.max(0, allRecords.length - records.length),
    };
  } catch (error) {
    console.error("Failed to fetch attendance records", error);
    return { records: [], sessions: 0, hours: 0, excludedSessions: 0 };
  }
};

const recordTime = (record = {}) => {
  for (const value of [record.markedAt, record.endsAt, record.date, record.id]) {
    const parsed = toMillis(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return 0;
};

export const buildAttendanceSummary = (records = [], hours = 0) => {
  const markedRecords = records.filter((record) => record.marked && record.present !== null);
  const presentRecords = markedRecords.filter((record) => record.present === true);
  const absentRecords = markedRecords.filter((record) => record.present === false);
  const pendingRecords = records.filter((record) => !record.marked || record.present === null);
  const totalSessions = markedRecords.length;
  const presentSessions = presentRecords.length;
  const absentSessions = absentRecords.length;
  const attendanceRate = totalSessions
    ? Math.round((presentSessions / totalSessions) * 100)
    : null;
  const classesNeededFor80 =
    attendanceRate === null || attendanceRate >= ATTENDANCE_TARGET
      ? 0
      : Math.ceil(
          Math.max(
            0,
            ((ATTENDANCE_TARGET / 100) * totalSessions - presentSessions) /
              (1 - ATTENDANCE_TARGET / 100)
          )
        );
  const recentMarked = markedRecords.slice().sort((a, b) => recordTime(b) - recordTime(a));
  const lastAttendance = recentMarked[0] || null;
  let consecutiveAbsences = 0;
  for (const record of recentMarked) {
    if (record.present === false) consecutiveAbsences += 1;
    else break;
  }

  let statusLevel = "empty";
  let statusLabel = "No attendance yet";
  let message = "Attendance will appear here after a completed class is marked by your teacher.";
  if (attendanceRate !== null) {
    if (attendanceRate >= ATTENDANCE_TARGET) {
      statusLevel = "good";
      statusLabel = "Good attendance";
      message = "Great. Keep attending so your progress stays strong.";
    } else if (attendanceRate >= 70) {
      statusLevel = "warning";
      statusLabel = "Improve consistency";
      message = `Attend the next ${classesNeededFor80} class${classesNeededFor80 === 1 ? "" : "es"} to reach ${ATTENDANCE_TARGET}%.`;
    } else if (attendanceRate >= 50) {
      statusLevel = "low";
      statusLabel = "Attendance warning";
      message = `Your attendance is low. Attend the next ${classesNeededFor80} class${classesNeededFor80 === 1 ? "" : "es"} to reach ${ATTENDANCE_TARGET}%.`;
    } else {
      statusLevel = "critical";
      statusLabel = "Critical attendance";
      message = "You are missing too many completed classes. Contact support and attend the next class.";
    }
  }

  return {
    records,
    markedRecords,
    totalSessions,
    presentSessions,
    absentSessions,
    pendingSessions: pendingRecords.length,
    sessions: presentSessions,
    hours,
    attendanceRate,
    classesNeededFor80,
    lastAttendance,
    consecutiveAbsences,
    statusLevel,
    statusLabel,
    message,
    target: ATTENDANCE_TARGET,
  };
};

export const fetchAttendanceSummary = async ({
  className,
  studentCode,
  studentUid,
  level,
  now,
} = {}) => {
  const { records, sessions, hours, excludedSessions } = await fetchAttendanceRecords({
    className,
    studentCode,
    studentUid,
    level,
    now,
  });
  return {
    ...buildAttendanceSummary(records, hours),
    sessions,
    hours,
    excludedSessions,
  };
};
