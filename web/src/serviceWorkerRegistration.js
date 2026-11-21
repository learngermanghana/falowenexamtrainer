const SERVICE_WORKER_PATH = `${process.env.PUBLIC_URL || ""}/firebase-messaging-sw.js`;
const FORCE_REFRESH_KEY = "app-last-force-refresh-at";
const FORCE_REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000;
const BUILD_MANIFEST_PATH = `${process.env.PUBLIC_URL || ""}/offline-build-assets.json`;
const BUILD_REVISION_KEY = "falowen:loaded-build-revision";
// Revisions stay visible after a tab returns, without five-minute background requests.
const BUILD_REVISION_CHECK_INTERVAL_MS = 30 * 60 * 1000;
const BUILD_REVISION_CHECK_MIN_GAP_MS = 10 * 60 * 1000;
const WORKER_UPDATE_MIN_GAP_MS = 30 * 60 * 1000;

let registrationStarted = false;
let buildRevisionTimer = null;
let lastBuildRevisionCheckAt = 0;
let lastWorkerUpdateAt = 0;
let buildRevisionCheckPromise = null;

// Embedded lecture players and workbook drafts can lose their place on reload.
const isLearningPage = () => /^\/(campus|swahili)(\/|$)/i.test(window.location.pathname);

const getLastForceRefreshAt = () => {
  try {
    return Number(window.localStorage.getItem(FORCE_REFRESH_KEY) || 0);
  } catch (error) {
    return 0;
  }
};

const markForceRefreshAt = (timestamp) => {
  try {
    window.localStorage.setItem(FORCE_REFRESH_KEY, String(timestamp));
    return Number(window.localStorage.getItem(FORCE_REFRESH_KEY)) === timestamp;
  } catch (error) {
    return false;
  }
};

const requestSkipWaiting = (worker) => {
  if (!worker || typeof worker.postMessage !== "function") return;
  worker.postMessage({ type: "SKIP_WAITING" });
};

const getLoadedBuildRevision = () => {
  try {
    return window.sessionStorage.getItem(BUILD_REVISION_KEY) || "";
  } catch (error) {
    return "";
  }
};

const setLoadedBuildRevision = (revision) => {
  try {
    window.sessionStorage.setItem(BUILD_REVISION_KEY, revision);
  } catch (error) {
    // Build refresh still works through the service worker if storage is blocked.
  }
};

const fetchCurrentBuildRevision = async () => {
  // A five-minute HTTP cache avoids CDN hits from concurrent browser tabs.
  // Vercel's short max-age still lets a deployed revision become visible.
  const response = await fetch(BUILD_MANIFEST_PATH, { cache: "default" });
  if (!response.ok) throw new Error(`Build manifest returned ${response.status}`);
  const payload = await response.json();
  return typeof payload?.revision === "string" ? payload.revision.trim() : "";
};

const checkForNewBuild = async ({ reloadOnChange = true } = {}) => {
  if (typeof window === "undefined") return false;
  const revision = await fetchCurrentBuildRevision();
  if (!revision) return false;

  const loadedRevision = getLoadedBuildRevision();
  if (!loadedRevision) {
    setLoadedBuildRevision(revision);
    return false;
  }
  if (loadedRevision === revision) return false;

  if (reloadOnChange && isLearningPage()) return false;
  setLoadedBuildRevision(revision);
  if (reloadOnChange) window.location.reload();
  return true;
};

// One update check per active browser window; no requests in background tabs.
// Returning to a visible tab after a ten-minute absence still checks promptly.
const checkForNewBuildWhenDue = ({ reloadOnChange = true, force = false } = {}) => {
  if (typeof window === "undefined" || typeof document === "undefined"
    || document.visibilityState === "hidden"
    || (typeof navigator !== "undefined" && navigator.onLine === false)) {
    return Promise.resolve(false);
  }
  if (buildRevisionCheckPromise) return buildRevisionCheckPromise;
  const now = Date.now();
  if (!force && now - lastBuildRevisionCheckAt < BUILD_REVISION_CHECK_MIN_GAP_MS) {
    return Promise.resolve(false);
  }
  lastBuildRevisionCheckAt = now;
  buildRevisionCheckPromise = checkForNewBuild({ reloadOnChange })
    .catch((error) => {
      // Allow the next focus/reconnect to retry a failed network check.
      lastBuildRevisionCheckAt = 0;
      throw error;
    })
    .finally(() => { buildRevisionCheckPromise = null; });
  return buildRevisionCheckPromise;
};

const updateWorkerWhenDue = async (registration, { force = false } = {}) => {
  if (typeof document === "undefined" || document.visibilityState === "hidden"
    || (typeof navigator !== "undefined" && navigator.onLine === false)) return;
  const now = Date.now();
  if (!force && now - lastWorkerUpdateAt < WORKER_UPDATE_MIN_GAP_MS) return;
  lastWorkerUpdateAt = now;
  try {
    await registration.update();
  } catch (error) {
    lastWorkerUpdateAt = 0;
    throw error;
  }
};

const startBuildRevisionChecks = () => {
  if (typeof window === "undefined" || buildRevisionTimer) return;
  buildRevisionTimer = window.setInterval(() => {
    void checkForNewBuildWhenDue().catch((error) =>
      console.error("Falowen build revision check failed", error)
    );
  }, BUILD_REVISION_CHECK_INTERVAL_MS);
};

const forcePeriodicRefresh = async (registration) => {
  if (typeof window === "undefined") return;

  const now = Date.now();
  const lastRefreshAt = getLastForceRefreshAt();
  const shouldForceRefresh = !lastRefreshAt || now - lastRefreshAt >= FORCE_REFRESH_INTERVAL_MS;

  if (!shouldForceRefresh || isLearningPage()) return;

  if (!markForceRefreshAt(now)) {
    return;
  }

  try {
    await registration.update();
  } catch (error) {
    console.error("Failed to refresh service worker assets", error);
  }

  if (!isLearningPage()) window.location.reload();
};

const setupUpdateHandlers = (registration) => {
  let hasRefreshed = false;

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (hasRefreshed || !navigator.serviceWorker.controller || isLearningPage()) return;
    hasRefreshed = true;
    window.location.reload();
  });

  if (registration.waiting) {
    requestSkipWaiting(registration.waiting);
  }

  registration.addEventListener("updatefound", () => {
    const installingWorker = registration.installing;
    if (!installingWorker) return;

    installingWorker.addEventListener("statechange", () => {
      if (installingWorker.state === "installed") {
        requestSkipWaiting(registration.waiting || installingWorker);
      }
    });
  });
};

const setupUpdateChecks = (registration) => {
  const runUpdate = async () => {
    if (document.visibilityState === "hidden"
      || (typeof navigator !== "undefined" && navigator.onLine === false)) return;
    try {
      await updateWorkerWhenDue(registration);
      await checkForNewBuildWhenDue();
    } catch (error) {
      console.error("Service worker/build update check failed", error);
    }
  };

  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "visible") {
      runUpdate();
    }
  });

  window.addEventListener("online", runUpdate);
};

const startRegistration = () => {
  if (registrationStarted) return;
  registrationStarted = true;

  navigator.serviceWorker
    .register(SERVICE_WORKER_PATH)
    .then(async (registration) => {
      setupUpdateHandlers(registration);
      setupUpdateChecks(registration);
      await updateWorkerWhenDue(registration, { force: true });
      await checkForNewBuildWhenDue({ reloadOnChange: false, force: true });
      startBuildRevisionChecks();
      await forcePeriodicRefresh(registration);
    })
    .catch((error) => {
      registrationStarted = false;
      console.error("Service worker registration failed", error);
    });
};

export const registerOfflineServiceWorker = () => {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return;
  }

  const isLocalhost = Boolean(
    window.location.hostname === "localhost" ||
      window.location.hostname === "[::1]" ||
      window.location.hostname.match(/^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/)
  );

  if (process.env.NODE_ENV !== "production" && !isLocalhost) {
    return;
  }

  if (document.readyState === "complete") {
    startRegistration();
    return;
  }

  window.addEventListener("load", startRegistration, { once: true });
};

export const __private__ = {
  forcePeriodicRefresh,
  setupUpdateHandlers,
  setupUpdateChecks,
  getLastForceRefreshAt,
  markForceRefreshAt,
  startRegistration,
  checkForNewBuild,
  fetchCurrentBuildRevision,
  getLoadedBuildRevision,
  setLoadedBuildRevision,
  startBuildRevisionChecks,
  checkForNewBuildWhenDue,
  updateWorkerWhenDue,
};
