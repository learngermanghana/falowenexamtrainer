const admin = require("firebase-admin");

const TUITION = { A1: 3000, A2: 3000, B1: 3000, B2: 3000, C1: 3000 };
const SESSIONS = { A1: 24, A2: 28, B1: 28, B2: 28, C1: 28 };
const MINUTES = { A1: 60, A2: 60, B1: 90, B2: 60, C1: 60 };
const HIGHLIGHTS = {
  A1: ["Beginner German foundation", "Live class plus assignment support", "Falowen app access"],
  A2: ["Everyday German communication", "Speaking, writing, listening, and reading practice", "Falowen app support"],
  B1: ["Exam-focused learning path", "Grammar plus workbook structure", "Tutor guidance"],
  B2: ["Flexible higher-level German", "AI-supported practice", "Tutor support by email"],
  C1: ["Advanced German communication", "Independent practice with support", "Professional-level writing and speaking"],
};
const DAYS = { sun: "Sunday", mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday" };
const CLOSED_STATUSES = new Set(["draft", "graduated", "archived", "inactive", "cancelled", "canceled"]);

function slugify(value) {
  return String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function dateOnly(value) {
  if (!value) return "";
  if (typeof value?.toDate === "function") return value.toDate().toISOString().slice(0, 10);
  if (value instanceof Date) return value.toISOString().slice(0, 10);

  const text = String(value).trim();
  if (/^\d{4}-\d{2}-\d{2}/.test(text)) return text.slice(0, 10);

  const parsed = new Date(text);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toISOString().slice(0, 10);
}

function publicStatus(data, startDate, endDate) {
  const rawStatus = String(data.status || "").trim().toLowerCase();
  const today = new Date().toISOString().slice(0, 10);
  const isRunningNow = Boolean(startDate && startDate <= today && (!endDate || endDate >= today));

  // Falowen Admin uses both "active" and "ongoing" for a class in progress.
  // Older records can also remain "upcoming" after their start date, so use
  // the actual date range as the final source of truth when the record is open.
  if (
    !CLOSED_STATUSES.has(rawStatus) &&
    data.active !== false &&
    (["active", "ongoing"].includes(rawStatus) || isRunningNow)
  ) {
    return "active";
  }

  return rawStatus || "upcoming";
}

function addMinutes(time, duration) {
  const [hour, minute] = String(time || "00:00").split(":").map(Number);
  const total = hour * 60 + minute + Number(duration || 60);
  return `${String(Math.floor((total % 1440) / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function cityFromName(name) {
  return String(name || "").replace(/^\s*(A1|A2|B1|B2|C1|C2)\s+/i, "").replace(/\s+Klasse\s*$/i, "").trim() || "Accra";
}

function meetingDays(data, level) {
  const rules = Array.isArray(data.scheduleRules) ? data.scheduleRules : [];
  return rules.map((rule) => {
    const short = String(rule.day || rule.weekday || "").slice(0, 3).toLowerCase();
    const startTime = String(rule.startTime || rule.time || "");
    const duration = Number(rule.durationMinutes || MINUTES[level] || 60);
    return { day: DAYS[short] || rule.day, startTime, endTime: addMinutes(startTime, duration) };
  }).filter((rule) => rule.day && /^\d{2}:\d{2}$/.test(rule.startTime));
}

function scheduleUrl(data, level, startDate, meetings) {
  if (data.scheduleUrl) return data.scheduleUrl;
  if (!startDate || !meetings.length) return "";
  const params = new URLSearchParams({
    level,
    startDate,
    defaultWeekdays: meetings.map((item) => item.day).join(","),
    holidayDates: "",
    useAdvancedWeekdays: "false",
    weekDaysMap: "{}",
  });
  return `https://admin.falowen.app/course-schedule/public?${params.toString()}`;
}

function publicClass(snapshot) {
  const data = snapshot.data() || {};
  const level = String(data.levelId || data.level || "A1").toUpperCase();
  const title = String(data.name || data.className || data.classId || data.title || `${level} Klasse`).trim();
  const slug = String(data.slug || slugify(title));
  const meetings = meetingDays(data, level);
  const startDate = dateOnly(data.startDate);
  const endDate = dateOnly(data.endDate);
  const firstRuleDuration = Number(data.scheduleRules?.[0]?.durationMinutes || 0);
  return {
    id: snapshot.id,
    slug,
    classUrl: String(data.classUrl || `/classes/${slug}`),
    title,
    language: data.language || "German",
    level,
    city: String(data.city || cityFromName(title)),
    location: data.location || "Ghana, Accra - Awoshie",
    format: data.format || "Live hybrid class in Ghana, Accra - Awoshie with online access, recordings, and Falowen app support",
    startDate,
    orientationDate: dateOnly(data.orientationDate || startDate),
    endDate,
    totalSessions: Number(data.generatedSessionCount || data.totalSessions || SESSIONS[level] || 24),
    sessionMinutes: Number(data.sessionMinutes || firstRuleDuration || MINUTES[level] || 60),
    tuitionGhs: Number(data.tuitionGhs || TUITION[level] || 3000),
    meetingDays: meetings,
    scheduleUrl: scheduleUrl(data, level, startDate, meetings),
    highlights: Array.isArray(data.highlights) && data.highlights.length ? data.highlights : HIGHLIGHTS[level] || [],
    status: publicStatus(data, startDate, endDate),
    publicVisible: data.publicVisible !== false,
    registrationOpen: data.registrationOpen !== false,
  };
}

async function publicClassesHandler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  try {
    const snapshot = await admin.firestore().collection("classes").get();
    const today = new Date().toISOString().slice(0, 10);
    const classes = snapshot.docs
      .map(publicClass)
      .filter((course) => course.publicVisible && course.registrationOpen)
      .filter((course) => !CLOSED_STATUSES.has(course.status))
      .filter((course) => {
        if (!course.startDate) return false;
        if (course.status === "active") return !course.endDate || course.endDate >= today;
        return course.startDate >= today;
      })
      .sort((a, b) => a.startDate.localeCompare(b.startDate));

    // Live Classes updates must appear immediately. Do not allow the browser,
    // Vercel edge cache, or another CDN to serve an older class catalogue.
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0, s-maxage=0");
    res.setHeader("CDN-Cache-Control", "no-store");
    res.setHeader("Vercel-CDN-Cache-Control", "no-store");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");

    return res.status(200).json({ classes, source: "firestore", generatedAt: new Date().toISOString() });
  } catch (error) {
    console.error("public classes error", error);
    return res.status(500).json({ error: "Could not load public classes" });
  }
}

module.exports = { publicClassesHandler, publicClass, publicStatus, dateOnly };
