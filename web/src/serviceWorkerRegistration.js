const SERVICE_WORKER_PATH = `${process.env.PUBLIC_URL || ""}/firebase-messaging-sw.js`;
const FORCE_REFRESH_KEY = "app-last-force-refresh-at";
const FORCE_REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000;
const BUILD_MANIFEST_PATH = `${process.env.PUBLIC_URL || ""}/offline-build-assets.json`;
const BUILD_REVISION_KEY = "falowen:loaded-build-revision";
// Keep an active tab up to date without repeatedly contacting the CDN while hidden.
const BUILD_REVISION_CHECK_INTERVAL_MS = 30 * 60 * 1000;
const MIN_BUILD_RECHECK_MS = 15 * 60 * 1000;

let registrationStarted = false;
let buildRevisionTimer = null;
let lastBuildCheckAt = 0;
let inFlightBuildCheck = null;
// Indirection keeps navigation behavior testable in jsdom, where Location.reload
// is read-only. Production still calls the browser's native reload method.
let reloadApp = () => window.location.reload();

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
  const response = await fetch(BUILD_MANIFEST_PATH, { cache: "no-store" });
  if (!response.ok) throw new Error(`Build manifest returned ${response.status}`);
  const payload = await response.json();
  return typeof payload?.revision === "string" ? payload.revision.trim() : "";
};

const shouldCheckForNewBuild = () =>
  typeof window !== "undefined" &&
  (typeof document === "undefined" || document.visibilityState !== "hidden") &&
  (typeof navigator === "undefined" || navigator.onLine !== false) &&
  (!lastBuildCheckAt || Date.now() - lastBuildCheckAt >= MIN_BUILD_RECHECK_MS);

const checkForNewBuild = async ({ reloadOnChange = true } = {}) => {
  if (inFlightBuildCheck) return inFlightBuildCheck;
  if (!shouldCheckForNewBuild()) return false;
  // Throttle attempts as well as successes to avoid repeated requests on
  // rapid tab switching when a student's network is unreliable.
  lastBuildCheckAt = Date.now();
  const job = (async () => {
    const revision = await fetchCurrentBuildRevision();
    if (!revision) return false;

    const loadedRevision = getLoadedBuildRevision();
    if (!loadedRevision) {
      setLoadedBuildRevision(revision);
      return false;
    }
    if (loadedRevision === revision) return false;

    setLoadedBuildRevision(revision);
    if (reloadOnChange) reloadApp();
    return true;
  })();
  inFlightBuildCheck = job;
  try {
    return await job;
  } finally {
    if (inFlightBuildCheck === job) inFlightBuildCheck = null;
  }
};

const startBuildRevisionChecks = () => {
  if (typeof window === "undefined" || buildRevisionTimer) return;
  buildRevisionTimer = window.setInterval(() => {
    checkForNewBuild().catch((error) =>
      console.error("Falowen build revision check failed", error)
    );
  }, BUILD_REVISION_CHECK_INTERVAL_MS);
};

const forcePeriodicRefresh = async (registration) => {
  if (typeof window === "undefined") return;

  const now = Date.now();
  const lastRefreshAt = getLastForceRefreshAt();
  const shouldForceRefresh = !lastRefreshAt || now - lastRefreshAt >= FORCE_REFRESH_INTERVAL_MS;

  if (!shouldForceRefresh) return;

  if (!markForceRefreshAt(now)) {
    return;
  }

  try {
    await registration.update();
  } catch (error) {
    console.error("Failed to refresh service worker assets", error);
  }

  reloadApp();
};

const setupUpdateHandlers = (registration) => {
  let hasRefreshed = false;

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (hasRefreshed || !navigator.serviceWorker.controller) return;
    hasRefreshed = true;
    reloadApp();
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
    // An update check itself sends a CDN request; avoid redundant checks.
    if (!shouldCheckForNewBuild()) return;
    try {
      await registration.update();
      await checkForNewBuild();
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
      await registration.update();
      await checkForNewBuild({ reloadOnChange: false });
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
  shouldCheckForNewBuild,
  setReloadHandlerForTests: handler => { reloadApp = handler || (() => window.location.reload()); },
  resetBuildCheckForTests: () => {
    lastBuildCheckAt = 0;
    inFlightBuildCheck = null;
  },
};
