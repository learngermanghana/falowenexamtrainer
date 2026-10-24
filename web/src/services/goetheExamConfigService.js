import { defaultGoetheExamConfig } from "../data/goetheExamSchedule";

export const GOETHE_EXAM_CONFIG_URL = String(
  process.env.REACT_APP_GOETHE_EXAM_CONFIG_URL
    || "https://us-central1-falowen-examiner-trainer.cloudfunctions.net/api/exam-file/config"
).trim();

const CACHE_KEY = "falowen_goethe_exam_config_v1";
const CACHE_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function validConfig(value) {
  return Boolean(value && Array.isArray(value.levels) && value.levels.length && value.reminder);
}

export function readCachedGoetheExamConfig() {
  try {
    const parsed = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
    if (!parsed || !validConfig(parsed.config)) return null;
    if (Date.now() - Number(parsed.savedAt || 0) > CACHE_MAX_AGE_MS) return null;
    return parsed.config;
  } catch {
    return null;
  }
}

function cacheConfig(config) {
  try {
    localStorage.setItem(CACHE_KEY, JSON.stringify({ config, savedAt: Date.now() }));
  } catch {
    // Local storage is optional. The static fallback remains available.
  }
}

export async function loadGoetheExamConfig() {
  const response = await fetch(GOETHE_EXAM_CONFIG_URL, {
    method: "GET",
    headers: { Accept: "application/json" },
    cache: "no-store",
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok || body?.ok === false || !validConfig(body?.config)) {
    throw new Error(String(body?.error || "Could not load the shared Goethe exam schedule."));
  }
  cacheConfig(body.config);
  return {
    config: body.config,
    source: body.source === "firestore" ? "admin" : "default",
    updatedAt: body.updatedAt || "",
  };
}

export function fallbackGoetheExamConfig() {
  return readCachedGoetheExamConfig() || defaultGoetheExamConfig;
}
