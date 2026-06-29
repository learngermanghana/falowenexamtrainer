import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const PUBLIC_AUTH_PATHS = new Set(["/signup", "/login"]);

const normalizePath = (value) => String(value || "").replace(/\/+$/, "") || "/";

const clearCachedPublicAuthPages = async () => {
  if (typeof window === "undefined" || !("caches" in window)) return;

  try {
    const cacheNames = await window.caches.keys();
    await Promise.all(
      cacheNames.map(async (cacheName) => {
        const cache = await window.caches.open(cacheName);
        const requests = await cache.keys();
        await Promise.all(
          requests
            .filter((request) => {
              try {
                return PUBLIC_AUTH_PATHS.has(normalizePath(new URL(request.url).pathname));
              } catch (_error) {
                return false;
              }
            })
            .map((request) => cache.delete(request))
        );
      })
    );
  } catch (error) {
    console.warn("Could not clear cached public auth pages", error);
  }
};

export default function PublicAuthMobileRecovery() {
  const location = useLocation();

  useEffect(() => {
    const pathname = normalizePath(location.pathname);
    if (!PUBLIC_AUTH_PATHS.has(pathname)) return undefined;

    const resetScroll = () => {
      try {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      } catch (_error) {
        window.scrollTo(0, 0);
      }
    };

    resetScroll();
    const frame = window.requestAnimationFrame(resetScroll);
    clearCachedPublicAuthPages();

    return () => window.cancelAnimationFrame(frame);
  }, [location.pathname, location.search]);

  return null;
}

export const __private__ = {
  clearCachedPublicAuthPages,
  normalizePath,
};
