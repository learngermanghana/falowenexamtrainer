import { useCallback, useEffect, useRef, useState } from "react";
import {
  analyzePrepositionCaseCoach,
  isPrepositionCaseCoachLevel,
} from "../lib/prepositionCaseCoach";

const DEFAULT_DEBOUNCE_MS = 850;
const MAX_HINTS = 5;

const hintsAreEqual = (left, right) =>
  left.length === right.length &&
  left.every((hint, index) => {
    const candidate = right[index];
    return (
      hint.id === candidate?.id &&
      hint.start === candidate.start &&
      hint.end === candidate.end &&
      hint.correction === candidate.correction &&
      hint.hint === candidate.hint
    );
  });

export const usePrepositionCaseHints = ({
  text = "",
  level = "",
  enabled = true,
  debounceMs = DEFAULT_DEBOUNCE_MS,
} = {}) => {
  const [hints, setHints] = useState([]);
  const [dismissVersion, setDismissVersion] = useState(0);
  const dismissedIdsRef = useRef(new Set());
  const sourceText = String(text || "");
  const active = Boolean(enabled) && isPrepositionCaseCoachLevel(level);

  useEffect(() => {
    if (!active || sourceText.trim().length < 8) {
      dismissedIdsRef.current = new Set();
      setHints((current) => (current.length ? [] : current));
      return undefined;
    }

    const timer = window.setTimeout(() => {
      const currentIssues = analyzePrepositionCaseCoach(sourceText, { level });
      const currentIds = new Set(currentIssues.map((issue) => issue.id));
      dismissedIdsRef.current = new Set(
        [...dismissedIdsRef.current].filter((id) => currentIds.has(id)),
      );

      const visibleHints = currentIssues
        .filter((issue) => !dismissedIdsRef.current.has(issue.id))
        .slice(0, MAX_HINTS);
      setHints((current) =>
        hintsAreEqual(current, visibleHints) ? current : visibleHints,
      );
    }, debounceMs);

    return () => window.clearTimeout(timer);
  }, [active, debounceMs, dismissVersion, level, sourceText]);

  const dismissHint = useCallback((id) => {
    if (!id) return;
    dismissedIdsRef.current = new Set([...dismissedIdsRef.current, id]);
    setHints((current) => current.filter((hint) => hint.id !== id));
  }, []);

  const clearDismissedHints = useCallback(() => {
    if (!dismissedIdsRef.current.size) return;
    dismissedIdsRef.current = new Set();
    setDismissVersion((version) => version + 1);
  }, []);

  return { hints, dismissHint, clearDismissedHints };
};

export default usePrepositionCaseHints;
