import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const webRoot = path.resolve(__dirname, "..");
const classCatalogPath = path.join(webRoot, "src", "data", "classCatalog.js");
const outputPath = path.join(webRoot, "public", "classes", "classes-data.json");

const source = fs
  .readFileSync(classCatalogPath, "utf8")
  .replace(/export\s+const\s+/g, "const ");

const classCatalog = new Function(`${source}\nreturn classCatalog;`)();

const LEVEL_PATTERN = /\b(A1|A2|B1|B2|C1|C2)\b/i;
const CITY_PATTERN = /^\s*(A1|A2|B1|B2|C1|C2)\s+(.+?)\s+Klasse\s*$/i;

function extractLevel(className) {
  return String(className || "").match(LEVEL_PATTERN)?.[1]?.toUpperCase() || "A1";
}

function extractCity(className, details) {
  if (details?.availability === "always" || details?.isSelfLearning) return "Online";
  const match = String(className || "").match(CITY_PATTERN);
  return match?.[2] || "Online";
}

function normalizeSchedule(schedule = []) {
  return schedule.map((slot) => ({
    day: slot.day,
    startTime: slot.startTime,
    ...(slot.endTime ? { endTime: slot.endTime } : {}),
  }));
}

function toClassEntry([className, details]) {
  const level = extractLevel(className);
  const isSelfLearning = details?.availability === "always" || details?.isSelfLearning;
  const entry = {
    level,
    ...(isSelfLearning ? { availability: "always" } : { city: extractCity(className, details) }),
    ...(details?.startDate ? { startDate: details.startDate } : {}),
    ...(details?.orientationDate ? { orientationDate: details.orientationDate } : {}),
    ...(details?.endDate ? { endDate: details.endDate } : {}),
    ...(details?.schedule?.length ? { meetingDays: normalizeSchedule(details.schedule) } : {}),
    ...(details?.docUrl ? { scheduleUrl: details.docUrl } : {}),
    ...(isSelfLearning && className ? { title: className } : {}),
  };

  if (!entry.title && /Self-learning/i.test(className)) {
    entry.title = className;
  }

  return entry;
}

const classes = Object.entries(classCatalog)
  .map(toClassEntry)
  .sort((a, b) => {
    if (a.availability === "always" && b.availability !== "always") return 1;
    if (b.availability === "always" && a.availability !== "always") return -1;
    return String(a.startDate || "9999-12-31").localeCompare(String(b.startDate || "9999-12-31"));
  });

const data = {
  brand: "Falowen Classes",
  timezone: "Africa/Accra",
  support: {
    email: "info@falowen.app",
    whatsapp: "https://wa.me/233241113054",
  },
  payment: {
    redirectUrl: "https://www.falowen.app/payment-complete",
    minimumInstallmentGhs: 2000,
    paystackBaseLinks: {
      A1: "https://paystack.shop/pay/yzz468-lbj",
      A2: "https://paystack.shop/pay/1navy7uihs",
      B1: "https://paystack.shop/pay/1navy7uihs",
      B2: "https://paystack.shop/pay/1navy7uihs",
      C1: "https://paystack.shop/pay/1navy7uihs",
    },
  },
  classDefaults: {
    language: "German",
    location: "Hybrid: Awoshie, Ghana or online",
    format: "Live hybrid class with recordings and Falowen app access",
    selfLearningFormat: "Self-learning with AI assistant and tutor support by email",
    selfLearningLocation: "Online",
    scheduleBaseUrl: "https://admin.falowen.app/course-schedule/public",
    tuitionGhsByLevel: {
      A1: 2800,
      A2: 3000,
      B1: 3000,
      B2: 3000,
      C1: 3000,
    },
    totalSessionsByLevel: {
      A1: 24,
      A2: 28,
      B1: 28,
      B2: 28,
      C1: 28,
    },
    sessionMinutesByLevel: {
      A1: 60,
      A2: 60,
      B1: 90,
      B2: 60,
      C1: 60,
    },
    highlightsByLevel: {
      A1: ["Beginner German foundation", "Live class plus assignment support", "Falowen app access"],
      A2: ["Everyday German communication", "Speaking, writing, listening, and reading practice", "Falowen app support"],
      B1: ["Exam-focused learning path", "Grammar plus workbook structure", "Tutor guidance"],
      B2: ["Flexible higher-level German", "AI-supported practice", "Tutor support by email"],
      C1: ["Advanced German communication", "Independent practice with support", "Professional-level writing and speaking"],
    },
  },
  classes,
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(data, null, 2)}\n`);
console.log(`Synced ${classes.length} classes to ${path.relative(webRoot, outputPath)}`);
