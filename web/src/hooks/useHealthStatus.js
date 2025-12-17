import { useCallback, useEffect, useState } from "react";
import { collection, db, getDocs, limit, query } from "../firebase";

export function useHealthStatus({ pollIntervalMs = 30000 } = {}) {
  const [status, setStatus] = useState("loading");
  const [lastChecked, setLastChecked] = useState(null);

  const refresh = useCallback(async () => {
    try {
      const pingRef = collection(db, "scores");
      await getDocs(query(pingRef, limit(1)));
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
