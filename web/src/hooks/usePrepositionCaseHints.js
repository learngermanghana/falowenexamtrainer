import { useCallback, useEffect, useRef, useState } from "react";
import {
  analyzePrepositionCaseCoach,
  isPrepositionCaseCoachLevel,
} from "../lib/prepositionCaseCoach";

const DEFAULT_DEBOUNCE_MS = 850;
const MAX_HINTS = 5;
const EMPTY_SUMMARY = { checked: 0, current: 0, cleared: 0, dismissed: 0 };

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

const summariesAreEqual = (left, right) =>
  left.checked === right.checked &&
  left.current === right.current &&
  left.cleared === right.cleared &&
  left.dismissed === right.dismissed;

export const usePrepositionCaseHints = ({
  text = "",
  level = "",
  enabled = true,
  debounceMs = DEFAULT_DEBOUNCE_MS,
} = {}) => {
  const [hints, setHints] = useState([]);
  const [summary, setSummary] = useState(EMPTY_SUMMARY);
  const [dismissVersion, setDismissVersion] = useState(0);
  const dismissedIdsRef = useRef(new Set());
  const seenIdsRef = useRef(new Set());
  const previousIssueIdsRef = useRef(new Set());
  const sourceText = String(text || "");
  const active = Boolean(enabled) && isPrepositionCaseCoachLevel(level);

  const resetCoach = useCallback(() => {
    dismissedIdsRef.current = new Set();
    seenIdsRef.current = new Set();
    previousIssueIdsRef.current = new Set();
    setHints((current) => (current.length ? [] : current));
    setSummary((current) =>
      summariesAreEqual(current, EMPTY_SUMMARY) ? current : EMPTY_SUMMARY,
    );
  }, []);

  useEffect(() => {
    if (!active || sourceText.trim().length < 8) {
      resetCoach();
      return undefined;
    }

    const timer = window.setTimeout(() => {
      const currentIssues = analyzePrepositionCaseCoach(sourceText, { level });
      const currentIds = new Set(currentIssues.map((issue) => issue.id));
      const newlySeen = [...currentIds].filter((id) => !seenIdsRef.current.has(id));
      const cleared = [...previousIssueIdsRef.current].filter(
        (id) => !currentIds.has(id) && !dismissedIdsRef.current.has(id),
      );

      newlySeen.forEach((id) => seenIdsRef.current.add(id));
      dismissedIdsRef.current = new Set(
        [...dismissedIdsRef.current].filter((id) => currentIds.has(id)),
      );

      const visibleHints = currentIssues
        .filter((issue) => !dismissedIdsRef.current.has(issue.id))
        .slice(0, MAX_HINTS);
      previousIssueIdsRef.current = currentIds;

      setHints((current) =>
        hintsAreEqual(current, visibleHints) ? current : visibleHints,
      );
      setSummary((current) => {
        const next = {
          checked: current.checked + newlySeen.length,
          current: visibleHints.length,
          cleared: current.cleared + cleared.length,
          dismissed: current.dismissed,
        };
        return summariesAreEqual(current, next) ? current : next;
      });
    }, debounceMs);

    return () => window.clearTimeout(timer);
  }, [active, debounceMs, dismissVersion, level, resetCoach, sourceText]);

  const dismissHint = useCallback((id) => {
    if (!id || dismissedIdsRef.current.has(id)) return;
    dismissedIdsRef.current = new Set([...dismissedIdsRef.current, id]);
    setHints((current) => current.filter((hint) => hint.id !== id));
    setSummary((current) => ({
      ...current,
      current: Math.max(0, current.current - 1),
      dismissed: current.dismissed + 1,
    }));
  }, []);

  const clearDismissedHints = useCallback(() => {
    if (!dismissedIdsRef.current.size) return;
    dismissedIdsRef.current = new Set();
    setDismissVersion((version) => version + 1);
  }, []);

  return {
    hints,
    summary,
    dismissHint,
    clearDismissedHints,
    resetCoach,
  };
};

export default usePrepositionCaseHints;
