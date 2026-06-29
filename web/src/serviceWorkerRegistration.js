const SERVICE_WORKER_PATH = `${process.env.PUBLIC_URL || ""}/firebase-messaging-sw.js`;
const FORCE_REFRESH_KEY = "app-last-force-refresh-at";
const FORCE_REFRESH_INTERVAL_MS = 24 * 60 * 60 * 1000;

let registrationStarted = false;

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

  window.location.reload();
};

const setupUpdateHandlers = (registration) => {
  let hasRefreshed = false;

  navigator.serviceWorker.addEventListener("controllerchange", () => {
    if (hasRefreshed || !navigator.serviceWorker.controller) return;
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
  const runUpdate = () => registration.update().catch((error) => console.error("Service worker update check failed", error));

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
};
