const RELOAD_KEY = "falowen:vite-preload-reload-at";
const RELOAD_WINDOW_MS = 60_000;

const isDynamicImportError = (value) => {
  const message = String(value?.message || value || "");
  return /Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(message);
};

const recoverOnce = (error, event) => {
  if (typeof window === "undefined") return false;
  if (event && typeof event.preventDefault === "function") event.preventDefault();

  let lastReload = 0;
  try {
    lastReload = Number(window.sessionStorage.getItem(RELOAD_KEY) || 0);
  } catch (_error) {
    // Storage can be unavailable in restricted browsing contexts.
  }

  const now = Date.now();
  if (!lastReload || now - lastReload > RELOAD_WINDOW_MS) {
    try {
      window.sessionStorage.setItem(RELOAD_KEY, String(now));
    } catch (_error) {
      // Reload still works even when sessionStorage is unavailable.
    }
    window.location.reload();
    return true;
  }

  console.error("Falowen could not recover a stale application chunk after one reload.", error);
  return false;
};

if (typeof window !== "undefined") {
  window.addEventListener("vite:preloadError", (event) => {
    recoverOnce(event?.payload, event);
  });

  window.addEventListener("unhandledrejection", (event) => {
    if (isDynamicImportError(event?.reason)) recoverOnce(event.reason, event);
  });

  window.setTimeout(() => {
    try {
      window.sessionStorage.removeItem(RELOAD_KEY);
    } catch (_error) {
      // Nothing to clean up.
    }
  }, 15_000);
}

export { isDynamicImportError, recoverOnce };
