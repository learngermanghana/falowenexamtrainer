import { useCallback, useEffect, useMemo, useState } from "react";

export function useHealthStatus({ pollIntervalMs = 30000 } = {}) {
  const apiBase = useMemo(() => process.env.REACT_APP_API_BASE || "", []);
  const [status, setStatus] = useState("loading");
  const [lastChecked, setLastChecked] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const response = await fetch(`${apiBase}/api/health`);
      if (!response.ok) {
        throw new Error(`Healthcheck failed with status ${response.status}`);
      }

      const body = await response.json();
      setStatus(body.status || "ok");
      setLastChecked(body.timestamp || new Date().toISOString());
    } catch (error) {
      setStatus("offline");
    }
  }, [apiBase]);

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
