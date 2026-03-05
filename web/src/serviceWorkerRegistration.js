const SERVICE_WORKER_PATH = `${process.env.PUBLIC_URL || ""}/firebase-messaging-sw.js`;
const FORCE_REFRESH_KEY = "app-last-force-refresh-at";
const FORCE_REFRESH_INTERVAL_MS = 7 * 24 * 60 * 60 * 1000;
const FORCE_REFRESH_QUERY_PARAM = "refresh";

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
  } catch (error) {
    // Ignore storage write failures.
  }
};

const clearOfflineCaches = async () => {
  if (!("caches" in window)) return;
  const cacheKeys = await window.caches.keys();
  await Promise.all(cacheKeys.filter((key) => key.startsWith("apzla-offline")).map((key) => window.caches.delete(key)));
};

const forcePeriodicRefresh = async (registration) => {
  if (typeof window === "undefined") return;

  const now = Date.now();
  const lastRefreshAt = getLastForceRefreshAt();
  const shouldForceRefresh = !lastRefreshAt || now - lastRefreshAt >= FORCE_REFRESH_INTERVAL_MS;

  if (!shouldForceRefresh) return;

  markForceRefreshAt(now);

  try {
    await registration.update();
    await clearOfflineCaches();
  } catch (error) {
    console.error("Failed to refresh service worker assets", error);
  }

  const nextUrl = new URL(window.location.href);
  nextUrl.searchParams.set(FORCE_REFRESH_QUERY_PARAM, String(now));
  window.location.replace(nextUrl.toString());
};

const reloadWithRefreshMarker = () => {
  const nextUrl = new URL(window.location.href);
  nextUrl.searchParams.set(FORCE_REFRESH_QUERY_PARAM, String(Date.now()));
  window.location.replace(nextUrl.toString());
};

const setupUpdateHandlers = (registration) => {
  registration.addEventListener("updatefound", () => {
    const installingWorker = registration.installing;
    if (!installingWorker) return;

    installingWorker.addEventListener("statechange", () => {
      if (installingWorker.state !== "installed") return;

      if (navigator.serviceWorker.controller) {
        reloadWithRefreshMarker();
      }
    });
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

  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register(SERVICE_WORKER_PATH)
      .then(async (registration) => {
        setupUpdateHandlers(registration);
        await registration.update();
        await forcePeriodicRefresh(registration);
      })
      .catch((error) => console.error("Service worker registration failed", error));
  });
};
