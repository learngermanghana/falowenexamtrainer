import { useCallback, useEffect, useState } from "react";
import { getBackendUrl } from "../services/backendUrl";

export function useHealthStatus({ pollIntervalMs = 30000 } = {}) {
  const [status, setStatus] = useState("loading");
  const [lastChecked, setLastChecked] = useState(null);

  const refresh = useCallback(async () => {
    if (typeof navigator !== "undefined" && !navigator.onLine) {
      setStatus("offline");
      return;
    }

    const url = `${getBackendUrl()}/health`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Health check failed");
      }

      const data = await response.json();
      setStatus("ok");
      setLastChecked(data?.timestamp || new Date().toISOString());
    } catch (error) {
      setStatus("offline");
    }
  }, []);

  useEffect(() => {
    let timerId;

    refresh();

    if (pollIntervalMs) {
      timerId = setInterval(refresh, pollIntervalMs);
    }

    return () => {
      if (timerId) clearInterval(timerId);
    };
  }, [pollIntervalMs, refresh]);

  return { status, lastChecked, refresh };
}
