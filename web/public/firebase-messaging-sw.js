/* eslint-disable no-undef */
importScripts("https://www.gstatic.com/firebasejs/10.14.0/firebase-app-compat.js");
importScripts(
  "https://www.gstatic.com/firebasejs/10.14.0/firebase-messaging-compat.js"
);

let messaging = null;

const CACHE_PREFIX = "apzla-offline";
const CACHE_NAME = `${CACHE_PREFIX}-v14`;
const OFFLINE_URL = "/offline.html";
const VERSIONED_ASSET_PREFIX = "/assets/";
const BUILD_ASSET_MANIFEST_URL = "/offline-build-assets.json";
const BUILD_PRECACHE_BATCH_SIZE = 8;
const DEFAULT_NOTIFICATION_BODY = "Falowen Learning Hub update";
const DEFAULT_ROUTE = "/";
const PUBLIC_AUTH_PATHS = [
  "/signup",
  "/login",
  "/onboarding",
  "/forgot-password",
  "/password-reset",
  "/reset-password",
];

const STATIC_ASSETS = [
  OFFLINE_URL,
  "/manifest.json",
  "/favicon.ico",
  "/logo192.png",
  "/logo512.png",
];

const normalizePathname = (value = "") => String(value || "").replace(/\/+$/, "") || "/";
const isPublicAuthPath = (pathname = "") => {
  const normalized = normalizePathname(pathname);
  return PUBLIC_AUTH_PATHS.some(
    (path) => normalized === path || normalized.startsWith(`${path}/`)
  );
};
const isVersionedBuildAsset = (url) =>
  url?.origin === self.location.origin && url.pathname.startsWith(VERSIONED_ASSET_PREFIX);

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
    return "/exams/overview";
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

const resolveNotificationContent = (payload = {}) => {
  const data = payload.data || {};
  const type = String(data.type || "").toLowerCase();
  const status = String(data.status || data.attendanceStatus || "").toLowerCase();
  const presentFlag = String(data.present || "").toLowerCase();

  const title =
    payload.notification?.title ||
    data.title ||
    data.subject ||
    data.headline ||
    (type.includes("attendance")
      ? status.includes("present") || presentFlag === "true"
        ? "Marked present ✅"
        : status.includes("absent") || presentFlag === "false"
        ? "Marked absent ❌"
        : "Attendance update"
      : "") ||
    "New update";

  const body =
    payload.notification?.body ||
    data.body ||
    data.message ||
    data.detail ||
    DEFAULT_NOTIFICATION_BODY;

  return { title, body };
};

function initializeMessaging(config) {
  if (!config || messaging || !config.apiKey) return;

  firebase.initializeApp(config);
  messaging = firebase.messaging();

  messaging.onBackgroundMessage((payload) => {
    const { title, body } = resolveNotificationContent(payload);

    self.registration.showNotification(title, {
      body,
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
    return;
  }
  if (event?.data?.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

const normalizeBuildPrecacheManifest = (payload = {}) => {
  const revision = typeof payload?.revision === "string" ? payload.revision.trim() : "";
  const assets = Array.isArray(payload?.assets)
    ? [...new Set(
        payload.assets.filter(
          (asset) => typeof asset === "string" && asset.startsWith(VERSIONED_ASSET_PREFIX)
        )
      )].sort()
    : [];
  const previousAssets = Array.isArray(payload?.previousAssets)
    ? [...new Set(
        payload.previousAssets.filter(
          (asset) => typeof asset === "string" && asset.startsWith(VERSIONED_ASSET_PREFIX)
        )
      )].sort()
    : [];

  if (!revision || !assets.length) {
    throw new Error("Build asset manifest is missing a revision or assets");
  }

  return { revision, assets, previousAssets };
};

const readBuildPrecacheManifest = async () => {
  const response = await fetch(BUILD_ASSET_MANIFEST_URL, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`Build asset manifest returned ${response.status}`);
  }

  return normalizeBuildPrecacheManifest(await response.json());
};

const readCachedBuildPrecacheManifest = async (cache) => {
  const response = await cache.match(BUILD_ASSET_MANIFEST_URL);
  if (!response) return null;

  try {
    return normalizeBuildPrecacheManifest(await response.json());
  } catch (error) {
    return null;
  }
};

const precacheBuildAssets = async (cache, assets) => {
  for (let index = 0; index < assets.length; index += BUILD_PRECACHE_BATCH_SIZE) {
    const batch = assets.slice(index, index + BUILD_PRECACHE_BATCH_SIZE);
    await Promise.all(
      batch.map(async (asset) => {
        const cached = await cache.match(asset);
        if (cached) return;

        const response = await fetch(asset, { cache: "reload" });
        if (!response.ok) {
          throw new Error(`Build asset ${asset} returned ${response.status}`);
        }
        await cache.put(asset, response);
      })
    );
  }
};

const pruneObsoleteBuildAssets = async (cache, retainedAssets) => {
  const retainedAssetSet = new Set(retainedAssets);
  const cachedRequests = await cache.keys();
  const obsoleteRequests = cachedRequests.filter((request) => {
    const url = new URL(request.url);
    return (
      isVersionedBuildAsset(url) &&
      /\.(?:js|css)$/.test(url.pathname) &&
      !retainedAssetSet.has(url.pathname)
    );
  });

  await Promise.all(obsoleteRequests.map((request) => cache.delete(request)));
};

let buildPrecacheRefreshPromise = null;

const refreshBuildAssetPrecache = ({ force = false } = {}) => {
  if (buildPrecacheRefreshPromise) return buildPrecacheRefreshPromise;

  buildPrecacheRefreshPromise = (async () => {
    const cache = await caches.open(CACHE_NAME);
    const manifest = await readBuildPrecacheManifest();
    const cachedManifest = await readCachedBuildPrecacheManifest(cache);

    if (!force && cachedManifest?.revision === manifest.revision) {
      return false;
    }

    await precacheBuildAssets(cache, manifest.assets);

    const previousAssets =
      cachedManifest?.revision === manifest.revision
        ? cachedManifest.previousAssets
        : (cachedManifest?.assets || []);
    const retainedAssets = [
      ...new Set([
        ...manifest.assets,
        ...previousAssets,
      ]),
    ];
    await pruneObsoleteBuildAssets(cache, retainedAssets);

    await cache.put(
      BUILD_ASSET_MANIFEST_URL,
      new Response(JSON.stringify({ ...manifest, previousAssets }), {
        headers: { "Content-Type": "application/json" },
      })
    );
    return true;
  })().finally(() => {
    buildPrecacheRefreshPromise = null;
  });

  return buildPrecacheRefreshPromise;
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      await cache.addAll(STATIC_ASSETS);
      await refreshBuildAssetPrecache({ force: true });
      await self.skipWaiting();
    })()
  );
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
  const requestUrl = new URL(request.url);
  if (isPublicAuthPath(requestUrl.pathname) || !response?.ok) return response;

  try {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(request, response.clone());
  } catch (error) {
    console.warn(`Failed to cache network response for ${requestUrl.pathname}`, error);
  }

  return response;
};

const handleAuthNavigationRequest = async (request) => {
  try {
    return await fetch(request, { cache: "no-store" });
  } catch (error) {
    const offlineFallback = await caches.match(OFFLINE_URL);
    if (offlineFallback) return offlineFallback;
    throw error;
  }
};

const handleNavigationRequest = async (request) => {
  try {
    const networkResponse = await fetch(request, { cache: "no-store" });
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

const handleStaticRequest = async (request) => {
  try {
    const response = await fetch(request, { cache: "no-store" });
    return await cacheNetworkResponse(request, response);
  } catch (error) {
    const cached = await caches.match(request);
    if (cached) {
      return cached;
    }
    return Response.error();
  }
};

const handleVersionedBuildAssetRequest = async (request) => {
  const cached = await caches.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    return await cacheNetworkResponse(request, response);
  } catch (error) {
    return Response.error();
  }
};

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const requestUrl = new URL(request.url);

  if (request.mode === "navigate") {
    const isAuthNavigation = isPublicAuthPath(requestUrl.pathname);
    if (!isAuthNavigation) {
      event.waitUntil(
        refreshBuildAssetPrecache().catch((error) => {
          console.error("Failed to refresh build asset precache", error);
        })
      );
    }

    event.respondWith(
      isAuthNavigation
        ? handleAuthNavigationRequest(request)
        : handleNavigationRequest(request)
    );
    return;
  }

  if (requestUrl.origin !== self.location.origin) return;

  // Vite build assets are content-hashed, so an exact cache hit is safe. The
  // install step precaches the current build chunks to keep lazy routes offline.
  if (isVersionedBuildAsset(requestUrl)) {
    event.respondWith(handleVersionedBuildAssetRequest(request));
    return;
  }

  const cacheableDestinations = ["image", "font"];
  if (cacheableDestinations.includes(request.destination)) {
    event.respondWith(handleStaticRequest(request));
  }
});
