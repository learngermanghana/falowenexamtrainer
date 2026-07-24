import { useCallback, useEffect, useState } from "react";
import { getBackendUrl } from "../services/backendUrl";

const HEALTH_RETRY_DELAYS_MS = [3000, 10000];

export function useHealthStatus({ pollIntervalMs = 30000 } = {}) {
  const [status, setStatus] = useState("loading");
  const [lastChecked, setLastChecked] = useState(null);

  const checkHealth = useCallback(async () => {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      return false;
    }

    const url = `${getBackendUrl()}/health`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Health check failed");
      }

      const data = await response.json();
      setLastChecked(data?.timestamp || new Date().toISOString());
      return true;
    } catch (error) {
      return false;
    }
  }, []);

  const refresh = useCallback(async () => {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setStatus("offline");
      return false;
    }

    setStatus("loading");
    const ok = await checkHealth();
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
