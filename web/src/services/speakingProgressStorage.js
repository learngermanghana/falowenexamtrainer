const STORAGE_PREFIX = "falowen:speaking-progress:v1:";

const canUseStorage = () =>
  typeof window !== "undefined" && Boolean(window.localStorage);

const normalizeScope = (scope) => {
  const explicit = String(scope || "").trim();
  if (explicit) return explicit;
  if (typeof window !== "undefined") {
    const pathname = String(window.location?.pathname || "").trim();
    if (pathname) return pathname;
  }
  return "global";
};

export const getSpeakingProgressStorageKey = (scope) =>
  `${STORAGE_PREFIX}${encodeURIComponent(normalizeScope(scope))}`;

export const readSpeakingProgress = (scope) => {
  if (!canUseStorage()) return {};
  try {
    const raw = window.localStorage.getItem(
      getSpeakingProgressStorageKey(scope),
    );
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

export const writeSpeakingProgress = (scope, patch) => {
  if (!canUseStorage() || !patch || typeof patch !== "object") return {};
  const next = {
    ...readSpeakingProgress(scope),
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(
      getSpeakingProgressStorageKey(scope),
      JSON.stringify(next),
    );
  } catch {
    // Storage can be unavailable in private mode or when device storage is full.
  }
  return next;
};

export const clearSpeakingProgress = (scope) => {
  if (!canUseStorage()) return;
  try {
    window.localStorage.removeItem(getSpeakingProgressStorageKey(scope));
  } catch {
    // Ignore unavailable storage.
  }
};

export const resolveSpeakingProgressScope = (config = {}, explicitScope) => {
  if (explicitScope) return explicitScope;
  if (typeof window !== "undefined") {
    const pathname = String(window.location?.pathname || "").trim();
    if (pathname) return pathname;
  }
  return (
    config.lessonId ||
    [config.level, config.day].filter(Boolean).join("-day-") ||
    config.title ||
    "global"
  );
};
