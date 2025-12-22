import { useCallback, useEffect, useState } from "react";
import { getBackendUrl } from "../services/backendUrl";

export function useHealthStatus({ pollIntervalMs = 30000 } = {}) {
  const [status, setStatus] = useState("loading");
  const [lastChecked, setLastChecked] = useState(null);

  const refresh = useCallback(async () => {
    const url = `${getBackendUrl()}/api/health`;

    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Health check failed");
      }

      await response.json();
      setStatus("ok");
      setLastChecked(new Date().toISOString());
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
