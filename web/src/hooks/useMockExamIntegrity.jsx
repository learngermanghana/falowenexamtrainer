import { useCallback, useEffect, useRef, useState } from "react";
import { getBackendUrl } from "../services/backendUrl";
import "../components/A1FinalMockExamPage.css";

const INCIDENT_LABELS = {
  tab_hidden: "You left the exam tab.",
  window_blur: "The exam window lost focus.",
  fullscreen_exit: "You exited fullscreen.",
  paste_attempt: "Pasting is disabled. Please write your own answers.",
  copy_attempt: "Copying exam text is disabled.",
};

/**
 * Shared safeguards for A2/B1/B2/C1 and A2 Mock 2.
 * Browser-reported incidents are not proof of misconduct or AI use.
 * Normal exam state and server-side timers are never reset by this hook.
 */
export function useMockExamIntegrity({ level, mockId, idToken, attemptId, section, active }) {
  const [notice, setNotice] = useState("");
  const [total, setTotal] = useState(0);
  const lastFocusRef = useRef(0);
  const fullscreenRef = useRef(false);
  const record = useCallback((type) => {
    if (!active) return;
    const now = Date.now();
    if (type === "window_blur" && document.hidden) return;
    if ((type === "window_blur" || type === "tab_hidden") &&
      now - lastFocusRef.current < 1500) return;
    if (type === "window_blur" || type === "tab_hidden") lastFocusRef.current = now;
    setNotice(INCIDENT_LABELS[type] || "Exam activity recorded.");
    setTotal(n => n + 1);
    if (idToken) {
      fetch(getBackendUrl() + "/mock/attempt/integrity-event", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: "Bearer " + idToken },
        body: JSON.stringify({ level, mockId, attemptId: attemptId || "", section, type }),
        keepalive: true,
      }).catch(() => {});
    }
  }, [active, idToken, level, mockId, attemptId, section]);

  useEffect(() => {
    if (!active || typeof document === "undefined") return undefined;
    fullscreenRef.current = Boolean(document.fullscreenElement);
    const visibility = () => { if (document.hidden) record("tab_hidden"); };
    const blur = () => record("window_blur");
    const fullscreen = () => {
      if (fullscreenRef.current && !document.fullscreenElement) record("fullscreen_exit");
      fullscreenRef.current = Boolean(document.fullscreenElement);
    };
    const unload = event => { event.preventDefault(); event.returnValue = ""; };
    document.addEventListener("visibilitychange", visibility);
    document.addEventListener("fullscreenchange", fullscreen);
    window.addEventListener("blur", blur);
    window.addEventListener("beforeunload", unload);
    return () => {
      document.removeEventListener("visibilitychange", visibility);
      document.removeEventListener("fullscreenchange", fullscreen);
      window.removeEventListener("blur", blur);
      window.removeEventListener("beforeunload", unload);
    };
  }, [active, record]);

  const requestFullscreen = () => {
    if (typeof document !== "undefined" && !document.fullscreenElement &&
      typeof document.documentElement?.requestFullscreen === "function") {
      try {
        const request = document.documentElement.requestFullscreen();
        if (request && typeof request.catch === "function") request.catch(() => {});
      } catch (_) {
        // Fullscreen is optional and unsupported on some mobile browsers.
      }
    }
  };
  return {
    active,
    notice,
    total,
    requestFullscreen,
    onPasteCapture: event => { if (active) { event.preventDefault(); record("paste_attempt"); } },
    onCopyCapture: event => { if (active) { event.preventDefault(); record("copy_attempt"); } },
  };
}

export function MockExamIntegrityNotice({ guard }) {
  if (!guard.active) return null;
  return <aside className="a1-final-mock-integrity" aria-live="polite">
    <div>
      <strong>Exam integrity · {guard.total} activity flags this session</strong>
      <p>Do not use ChatGPT or other outside help. Tab exits and blocked copy/paste attempts are logged for teacher review, not automatic failure.</p>
      {guard.notice ? <p className="a1-final-mock-integrity-warning" role="status">{guard.notice}</p> : null}
    </div>
    <button type="button" onClick={guard.requestFullscreen}>Enter fullscreen</button>
  </aside>;
}
