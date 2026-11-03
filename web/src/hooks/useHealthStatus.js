import { useCallback, useEffect, useState } from "react";
import { getBackendUrl } from "../services/backendUrl";

const HEALTH_RETRY_DELAYS_MS = [3000, 10000];

// An online indicator is useful, but remounting it on every student route
// should not start another paid function invocation. Only successful checks
// are reused; failures are never disguised as an online backend.
let latestSuccess = null;
let inFlightCheck = null;

async function probeBackend(url, reuseSuccessMs, force) {
  const now = Date.now();
  if (!force && reuseSuccessMs > 0 && latestSuccess?.url === url &&
      now - latestSuccess.checkedAt < reuseSuccessMs) {
    return { ok: true, timestamp: latestSuccess.timestamp };
  }
  if (inFlightCheck?.url === url) return inFlightCheck.promise;

  const promise = (async () => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Health check failed");
      const data = await response.json();
      const timestamp = data?.timestamp || new Date().toISOString();
      latestSuccess = { url, checkedAt: Date.now(), timestamp };
      return { ok: true, timestamp };
    } catch {
      return { ok: false };
    }
  })();
  inFlightCheck = { url, promise };
  try {
    return await promise;
  } finally {
    if (inFlightCheck?.promise === promise) inFlightCheck = null;
  }
}

export function useHealthStatus({ pollIntervalMs = 30000, reuseSuccessMs = 0 } = {}) {
  const [status, setStatus] = useState("loading");
  const [lastChecked, setLastChecked] = useState(null);

  const checkHealth = useCallback(async ({ force = false } = {}) => {
    if (typeof navigator !== "undefined" && !navigator.onLine) return false;
    const result = await probeBackend(`${getBackendUrl()}/health`, reuseSuccessMs, force);
    if (result.ok) setLastChecked(result.timestamp);
    return result.ok;
  }, [reuseSuccessMs]);

  const refresh = useCallback(async () => {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setStatus("offline");
      return false;
    }
    setStatus("loading");
    const ok = await checkHealth({ force: true });
    setStatus(ok ? "ok" : "offline");
    return ok;
  }, [checkHealth]);

  useEffect(() => {
    let intervalId;
    let retryTimerId;
    let cancelled = false;

    const runCheck = async (attempt = 0) => {
      if (typeof navigator !== "undefined" && !navigator.onLine) {
        if (!cancelled) setStatus("offline");
        return;
      }

      const ok = await checkHealth();
      if (cancelled) return;

      if (ok) {
        setStatus("ok");
        return;
      }

      const retryDelay = HEALTH_RETRY_DELAYS_MS[attempt];
      if (Number.isFinite(retryDelay)) {
        setStatus("retrying");
        retryTimerId = setTimeout(() => runCheck(attempt + 1), retryDelay);
        return;
      }

      setStatus("offline");
    };

    runCheck();

    if (pollIntervalMs) {
      intervalId = setInterval(() => {
        // Hidden tabs should never keep invoking a serverless health route.
        if (typeof document !== "undefined" && document.visibilityState === "hidden") return;
        if (retryTimerId) clearTimeout(retryTimerId);
        runCheck();
      }, pollIntervalMs);
    }

    return () => {
      cancelled = true;
      if (intervalId) clearInterval(intervalId);
      if (retryTimerId) clearTimeout(retryTimerId);
    };
  }, [checkHealth, pollIntervalMs]);

  return { status, lastChecked, refresh };
}

export function __resetHealthCacheForTests() {
  latestSuccess = null;
  inFlightCheck = null;
}
