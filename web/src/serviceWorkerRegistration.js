const SERVICE_WORKER_PATH = `${process.env.PUBLIC_URL || ""}/firebase-messaging-sw.js`;

let registrationStarted = false;

const requestSkipWaiting = (worker) => {
  if (!worker || typeof worker.postMessage !== "function") return;
  worker.postMessage({ type: "SKIP_WAITING" });
};

const setupUpdateHandlers = (registration) => {
  // A returning mobile tab may receive a new worker immediately. Let updates
  // activate in the background; reloading here destroys the student's open work.
  // The next page load uses the new app, with stale-chunk recovery as a
  // fallback when a genuinely missing module requires a reload.
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
  setupUpdateHandlers,
  setupUpdateChecks,
  startRegistration,
};
