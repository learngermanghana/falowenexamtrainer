const DAY_NAMES = { sun: "Sunday", mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", sat: "Saturday" };

export const slugifyPublicClass = (value) =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function addMinutes(time, duration) {
  const [hour, minute] = String(time || "00:00").split(":").map(Number);
  const total = hour * 60 + minute + Number(duration || 60);
  return `${String(Math.floor((total % 1440) / 60)).padStart(2, "0")}:${String(total % 60).padStart(2, "0")}`;
}

function normalizeClass(course = {}, defaults = {}) {
  const level = String(course.level || course.levelId || "A1").toUpperCase();
  const title = course.title || course.name || `${level} Klasse`;
  const isSelfLearning = course.availability === "always" || course.isSelfLearning === true;
  const defaultMinutes = defaults.sessionMinutesByLevel?.[level] || 60;
  const meetingDays = Array.isArray(course.meetingDays)
    ? course.meetingDays
    : Array.isArray(course.scheduleRules)
      ? course.scheduleRules.map((rule) => {
          const short = String(rule.day || "").slice(0, 3).toLowerCase();
          const startTime = rule.startTime || "";
          return {
            day: DAY_NAMES[short] || rule.day,
            startTime,
            endTime: addMinutes(startTime, rule.durationMinutes || defaultMinutes),
          };
        })
      : [];
  return {
    ...course,
    id: course.id || slugifyPublicClass(title),
    slug: course.slug || slugifyPublicClass(title),
    title,
    name: title,
    level,
    city: course.city || (isSelfLearning ? "Online" : ""),
    startDate: String(course.startDate || "").slice(0, 10),
    endDate: String(course.endDate || "").slice(0, 10),
    meetingDays,
    tuitionGhs: Number(course.tuitionGhs || defaults.tuitionGhsByLevel?.[level] || 3000),
    registrationOpen: course.registrationOpen !== false,
    publicVisible: course.publicVisible !== false,
  };
}

export function isPublicClassOpen(course, now = new Date()) {
  if (!course || course.publicVisible === false || course.registrationOpen === false) return false;
  if (course.availability === "always") return true;
  if (!course.startDate) return false;
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const start = new Date(`${course.startDate}T00:00:00`);
  const end = course.endDate ? new Date(`${course.endDate}T23:59:59`) : null;
  if (course.status === "active" && (!end || end >= today)) return true;
  return start >= today;
}

async function fetchJson(url) {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`${url} returned ${response.status}`);
  return response.json();
}

export async function loadPublicClasses() {
  let fallback = { classes: [], classDefaults: {} };
  try {
    fallback = await fetchJson("/classes/classes-data.json");
  } catch (_error) {}

  try {
    const live = await fetchJson("/api/public/classes");
    const liveClasses = (live.classes || []).map((course) => normalizeClass(course, fallback.classDefaults || {}));
    const alwaysOpen = (fallback.classes || [])
      .map((course) => normalizeClass(course, fallback.classDefaults || {}))
      .filter((course) => course.availability === "always");
    const liveTokens = new Set(liveClasses.flatMap((course) => [course.id, course.slug, course.title]));
    return [...liveClasses, ...alwaysOpen.filter((course) => ![course.id, course.slug, course.title].some((token) => liveTokens.has(token)))]
      .filter(isPublicClassOpen);
  } catch (_error) {
    return (fallback.classes || [])
      .map((course) => normalizeClass(course, fallback.classDefaults || {}))
      .filter(isPublicClassOpen);
  }
}

export function publicClassLabel(course) {
  if (course.availability === "always") return `${course.title} — self-learning (always available)`;
  const start = course.startDate
    ? new Date(`${course.startDate}T00:00:00`).toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
    : "Schedule";
  const times = (course.meetingDays || [])
    .map((slot) => `${slot.day} ${slot.startTime || ""}${slot.endTime ? `-${slot.endTime}` : ""}`)
    .join(" · ");
  return times ? `${course.title} — starts ${start} — ${times}` : `${course.title} — starts ${start}`;
}

export function findPublicClassName(classes, value) {
  const token = slugifyPublicClass(value);
  return (classes || []).find((course) =>
    [course.id, course.slug, course.title, course.name].some((item) => slugifyPublicClass(item) === token),
  )?.title || "";
}
