/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/10.14.0/firebase-app-compat.js");
importScripts(
  "https://www.gstatic.com/firebasejs/10.14.0/firebase-messaging-compat.js"
);

let messaging = null;

const CACHE_PREFIX = "apzla-offline";
const CACHE_NAME = `${CACHE_PREFIX}-v6`;
const OFFLINE_URL = "/offline.html";
const DEFAULT_NOTIFICATION_BODY = "Falowen Learning Hub update";
const DEFAULT_ROUTE = "/";

const STATIC_ASSETS = [
  OFFLINE_URL,
  "/manifest.json",
  "/favicon.ico",
  "/logo192.png",
  "/logo512.png",
];

const buildDiscussionRoute = ({ level = "", className = "", postId = "" } = {}) => {
  const params = new URLSearchParams();
  if (level) params.set("level", level);
  if (className) params.set("className", className);
  if (postId) params.set("postId", postId);
  const query = params.toString();
  return `/campus/discussion${query ? `?${query}` : ""}`;
};

const resolveNotificationRoute = (data = {}) => {
  if (data.route) return data.route;
  const type = String(data.type || "").toLowerCase();
  if (data.postId || type.includes("discussion") || type.includes("class")) {
    return buildDiscussionRoute(data);
  }
  if (type.includes("score") || type.includes("assignment")) {
    return "/campus/results";
  }
  if (type.includes("exam")) {
    return "/exams/speaking";
  }
  return DEFAULT_ROUTE;
};

const normalizeRoute = (route) => {
  if (!route) return DEFAULT_ROUTE;
  try {
    const url = new URL(route, self.location.origin);
    if (url.origin !== self.location.origin) return DEFAULT_ROUTE;
    return `${url.pathname}${url.search}${url.hash}`;
  } catch (error) {
    return DEFAULT_ROUTE;
  }
};

const buildNotificationData = (payload = {}) => {
  const data = { ...(payload.data || {}) };
  data.route = resolveNotificationRoute(data);
  return data;
};

function initializeMessaging(config) {
  if (!config || messaging || !config.apiKey) return;

  firebase.initializeApp(config);
  messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const { title, body } = payload.notification || {};
    if (!title) return;

    self.registration.showNotification(title, {
      body: body || DEFAULT_NOTIFICATION_BODY,
      icon: "/logo192.png",
      data: buildNotificationData(payload),
    });
  });
}

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  event.waitUntil(
    (async () => {
      const data = event.notification?.data || {};
      const route = normalizeRoute(resolveNotificationRoute(data));
      const targetUrl = new URL(route, self.location.origin).toString();
      const clientList = await self.clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      for (const client of clientList) {
        if ("navigate" in client) {
          await client.navigate(targetUrl);
          await client.focus();
          return;
        }
      }

      if (self.clients.openWindow) {
        await self.clients.openWindow(targetUrl);
      }
    })()
  );
});

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
            .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
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
