import { useEffect, useState } from "react";
import {
  fallbackGoetheExamConfig,
  loadGoetheExamConfig,
  readCachedGoetheExamConfig,
} from "../services/goetheExamConfigService";

export function useGoetheExamConfig() {
  const cached = readCachedGoetheExamConfig();
  const [state, setState] = useState(() => ({
    config: cached || fallbackGoetheExamConfig(),
    loading: true,
    source: cached ? "cache" : "fallback",
    updatedAt: "",
    error: "",
  }));

  useEffect(() => {
    let active = true;
    loadGoetheExamConfig()
      .then((result) => {
        if (active) setState({ ...result, loading: false, error: "" });
      })
      .catch((error) => {
        if (active) setState((current) => ({ ...current, loading: false, error: error?.message || "Schedule update unavailable." }));
      });
    return () => { active = false; };
  }, []);

  return state;
}
