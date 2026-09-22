const KEY_PREFIX = "falowen:learning-session:";
const MAX_AGE_MS = 24 * 60 * 60 * 1000;
const LOCAL_ORIGIN = "https://www.falowen.app";

// Store navigation only, never authentication, answers, or arbitrary external URLs.
export const normalizeLearningHref = (href) => {
  if (typeof href !== "string" || href.length > 4096 || !href.startsWith("/") ||
      href.startsWith("//") || /[\\\s]/.test(href)) return null;
  try {
    const url = new URL(href, LOCAL_ORIGIN);
    if (url.origin !== LOCAL_ORIGIN ||
        !/^(?:\/|\/campus(?:\/.*)?|\/exams(?:\/.*)?)$/.test(url.pathname)) return null;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch (_error) {
    return null;
  }
};

export const isStandaloneApp = () => Boolean(
  window.navigator.standalone === true ||
  window.matchMedia?.("(display-mode: standalone)")?.matches
);

export const canResumeLearningLaunch = (href, standalone = isStandaloneApp()) => {
  // Explicit lesson links, query parameters, and anchors always win.
  if (!["/", "/campus", "/campus/"].includes(href)) return false;
  const navigationType = window.performance?.getEntriesByType?.("navigation")?.[0]?.type;
  return standalone || navigationType === "reload" || navigationType === "back_forward";
};

export const saveLearningSession = (uid, href) => {
  const safeHref = normalizeLearningHref(href);
  if (!uid || !safeHref) return;
  const value = JSON.stringify({ version: 1, href: safeHref, savedAt: Date.now() });
  for (const storageName of ["sessionStorage", "localStorage"]) {
    try {
      window[storageName].setItem(`${KEY_PREFIX}${uid}`, value);
    } catch (_error) {
      // Private browsing/storage limits must not interrupt the lesson.
    }
  }
};

export const readLearningSession = (uid, { standalone = isStandaloneApp() } = {}) => {
  if (!uid) return null;
  // A regular browser tab must never resume another tab's page. Installed apps
  // can fall back to durable storage if iOS has discarded their tab session.
  const storageNames = standalone ? ["sessionStorage", "localStorage"] : ["sessionStorage"];
  for (const storageName of storageNames) {
    try {
      const raw = window[storageName].getItem(`${KEY_PREFIX}${uid}`);
      if (!raw) continue;
      const saved = JSON.parse(raw);
      const age = Date.now() - saved.savedAt;
      const href = normalizeLearningHref(saved.href);
      return saved.version === 1 && Number.isFinite(saved.savedAt) &&
        age >= 0 && age <= MAX_AGE_MS && href ? { ...saved, href } : null;
    } catch (_error) {
      // Try the installed-app fallback if session storage is inaccessible.
    }
  }
  return null;
};

export const clearLearningSession = (uid) => {
  if (!uid) return;
  for (const storageName of ["sessionStorage", "localStorage"]) {
    try {
      window[storageName].removeItem(`${KEY_PREFIX}${uid}`);
    } catch (_error) {}
  }
};
