const admin = require("firebase-admin");

function initFirebaseAdmin() {
  if (admin.apps.length) return;
  const raw = process.env.GOOGLE_SERVICE_ACCOUNT_JSON || process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  const b64 = process.env.GOOGLE_SERVICE_ACCOUNT_JSON_B64 || process.env.FIREBASE_SERVICE_ACCOUNT_JSON_B64;
  let serviceAccount = null;
  if (raw) serviceAccount = JSON.parse(raw);
  else if (b64) serviceAccount = JSON.parse(Buffer.from(b64, "base64").toString("utf8"));
  if (serviceAccount?.private_key) serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");
  const projectId = process.env.FIREBASE_PROJECT_ID || process.env.GOOGLE_CLOUD_PROJECT || process.env.GCLOUD_PROJECT || serviceAccount?.project_id;
  if (serviceAccount?.client_email && serviceAccount?.private_key) {
    admin.initializeApp({ credential: admin.credential.cert(serviceAccount), projectId });
  } else {
    admin.initializeApp({ projectId });
  }
}

const TUITION = { A1: 2800, A2: 3000, B1: 3000, B2: 3000, C1: 3000 };
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

function slugify(value) {
  return String(value || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
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
  const title = String(data.name || data.title || `${level} Klasse`).trim();
  const slug = String(data.slug || slugify(title));
  const meetings = meetingDays(data, level);
  const startDate = String(data.startDate || "").slice(0, 10);
  const endDate = String(data.endDate || "").slice(0, 10);
  return {
    id: snapshot.id,
    slug,
    title,
    language: data.language || "German",
    level,
    city: String(data.city || cityFromName(title)),
    location: data.location || "Ghana, Accra - Awoshie",
    format: data.format || "Live hybrid class in Ghana, Accra - Awoshie with online access, recordings, and Falowen app support",
    startDate,
    orientationDate: String(data.orientationDate || startDate).slice(0, 10),
    endDate,
    totalSessions: Number(data.generatedSessionCount || data.totalSessions || SESSIONS[level] || 24),
    sessionMinutes: Number(data.sessionMinutes || meetings[0] && data.scheduleRules?.[0]?.durationMinutes || MINUTES[level] || 60),
    tuitionGhs: Number(data.tuitionGhs || TUITION[level] || 3000),
    meetingDays: meetings,
    scheduleUrl: scheduleUrl(data, level, startDate, meetings),
    highlights: Array.isArray(data.highlights) && data.highlights.length ? data.highlights : HIGHLIGHTS[level] || [],
    status: String(data.status || "upcoming").toLowerCase(),
    publicVisible: data.publicVisible !== false,
    registrationOpen: data.registrationOpen !== false,
  };
}

module.exports = async function publicClasses(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });
  try {
    initFirebaseAdmin();
    const snapshot = await admin.firestore().collection("classes").get();
    const today = new Date().toISOString().slice(0, 10);
    const classes = snapshot.docs
      .map(publicClass)
      .filter((course) => course.publicVisible && course.registrationOpen)
      .filter((course) => !["draft", "graduated", "archived"].includes(course.status))
      .filter((course) => course.startDate && (course.startDate >= today || (course.status === "active" && (!course.endDate || course.endDate >= today))))
      .sort((a, b) => a.startDate.localeCompare(b.startDate));

    res.setHeader("Cache-Control", "public, s-maxage=60, stale-while-revalidate=300");
    return res.status(200).json({ classes, source: "firestore", generatedAt: new Date().toISOString() });
  } catch (error) {
    console.error("/api/public/classes error", error);
    return res.status(500).json({ error: "Could not load public classes" });
  }
};
