/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/10.14.0/firebase-app-compat.js");
importScripts(
  "https://www.gstatic.com/firebasejs/10.14.0/firebase-messaging-compat.js"
);

let messaging = null;

const CACHE_NAME = "falowen-offline-v1";
const OFFLINE_URL = "/offline.html";

const STATIC_ASSETS = [
  "/",
  "/index.html",
  OFFLINE_URL,
  "/manifest.json",
  "/favicon.ico",
  "/Logo-192x192.png",
  "/Logo 512.png",
];

function initializeMessaging(config) {
  if (!config || messaging || !config.apiKey) return;

  firebase.initializeApp(config);
  messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const { title, body } = payload.notification || {};
    if (!title) return;

    self.registration.showNotification(title, {
      body: body || "Falowen Learning Hub update",
      icon: "/logo192.png",
    });
  });
}

self.addEventListener("message", (event) => {
  if (event?.data?.type === "INIT_FIREBASE") {
    initializeMessaging(event.data.payload);
  }
});

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(STATIC_ASSETS))
      .catch((error) => console.error("Failed to precache offline assets", error))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key.startsWith("falowen-offline") && key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

const cacheNetworkResponse = async (request, response) => {
  const cache = await caches.open(CACHE_NAME);
  cache.put(request, response.clone());
  return response;
};

const handleNavigationRequest = async (request) => {
  try {
    const networkResponse = await fetch(request);
    return cacheNetworkResponse(request, networkResponse);
  } catch (error) {
    const cachedPage = await caches.match(request);
    if (cachedPage) {
      return cachedPage;
    }

    const offlineFallback = await caches.match(OFFLINE_URL);
    if (offlineFallback) {
      return offlineFallback;
    }

    throw error;
  }
};

const handleStaticRequest = (request) =>
  caches.match(request).then(
    (cached) =>
      cached ||
      fetch(request)
        .then((response) => cacheNetworkResponse(request, response))
        .catch(() => caches.match(OFFLINE_URL)),
    () => caches.match(OFFLINE_URL)
  );

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const requestUrl = new URL(request.url);

  if (request.mode === "navigate") {
    event.respondWith(handleNavigationRequest(request));
    return;
  }

  if (requestUrl.origin === self.location.origin) {
    const cacheableDestinations = ["style", "script", "image", "font"];
    if (cacheableDestinations.includes(request.destination)) {
      event.respondWith(handleStaticRequest(request));
    }
  }
});
