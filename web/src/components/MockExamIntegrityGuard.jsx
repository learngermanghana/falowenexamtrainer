import React, { useCallback, useEffect, useRef, useState } from "react";
import { getBackendUrl } from "../services/backendUrl";

const MESSAGES = {
  tab_hidden: "You left the exam tab. The event was recorded for teacher review.",
  window_blur: "The exam window lost focus. This event was recorded for review.",
  fullscreen_exit: "Fullscreen ended. Return to fullscreen when your browser supports it.",
  paste_attempt: "Pasting is disabled. Write the answer yourself.",
  copy_attempt: "Copying exam content is disabled.",
};

export function requestExamFullscreen() {
  if (typeof document === "undefined" || document.fullscreenElement) return;
  const promise = document.documentElement?.requestFullscreen?.();
  // iOS Safari and other browsers may not support fullscreen requests.
  if (promise?.catch) promise.catch(() => {});
}

export default function MockExamIntegrityGuard({
  active = false, level, mockId, attemptId, section, idToken,
}) {
  const [notice, setNotice] = useState("");
  const [count, setCount] = useState(0);
  const lastFocusRef = useRef(0);
  const fullscreenRef = useRef(false);

  const record = useCallback(type => {
    if (!active || !MESSAGES[type]) return;
    const now = Date.now();
    if (type === "window_blur" && document.hidden) return;
    if (["tab_hidden", "window_blur"].includes(type) &&
      now - lastFocusRef.current < 1500) return;
    if (["tab_hidden", "window_blur"].includes(type)) lastFocusRef.current = now;
    setCount(value => value + 1);
    setNotice(MESSAGES[type]);
    if (!idToken || !attemptId) return;
    // Only the event category, exam section and authenticated session ID are sent.
    // Browser signals are review flags, not evidence of external assistance.
    try {
      const request = fetch(getBackendUrl() + "/mock/attempt/integrity-event", {
        method: "POST",
        headers: { Authorization: "Bearer " + idToken, "Content-Type": "application/json" },
        body: JSON.stringify({ level, mockId, attemptId, section, type }),
        keepalive: true,
      });
      if (request?.catch) request.catch(() => {});
    } catch (_) { /* Logging failure must never interrupt the exam. */ }
  }, [active, idToken, attemptId, level, mockId, section]);

  useEffect(() => {
    if (!active) return undefined;
    fullscreenRef.current = Boolean(document.fullscreenElement);
    const onVisibility = () => { if (document.hidden) record("tab_hidden"); };
    const onBlur = () => record("window_blur");
    const onFullscreen = () => {
      if (fullscreenRef.current && !document.fullscreenElement) record("fullscreen_exit");
      fullscreenRef.current = Boolean(document.fullscreenElement);
    };
    const blockCopy = event => { event.preventDefault(); record("copy_attempt"); };
    const blockPaste = event => { event.preventDefault(); record("paste_attempt"); };
    const onLeave = event => { event.preventDefault(); event.returnValue = ""; };
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("blur", onBlur);
    document.addEventListener("fullscreenchange", onFullscreen);
    document.addEventListener("copy", blockCopy, true);
    document.addEventListener("paste", blockPaste, true);
    window.addEventListener("beforeunload", onLeave);
    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("blur", onBlur);
      document.removeEventListener("fullscreenchange", onFullscreen);
      document.removeEventListener("copy", blockCopy, true);
      document.removeEventListener("paste", blockPaste, true);
      window.removeEventListener("beforeunload", onLeave);
    };
  }, [active, record]);

  if (!active) return null;
  return <aside data-testid="shared-mock-integrity" aria-live="polite"
    style={{ margin: "12px 0", padding: 14, border: "1px solid #d4c2a3",
      borderRadius: 12, background: "#fff9ed", color: "#563b20",
      display: "flex", gap: 12, justifyContent: "space-between", flexWrap: "wrap" }}>
    <div>
      <strong>{level} exam integrity · {count} activity flags this visit</strong>
      <p style={{ margin: "5px 0" }}>
        Use your own knowledge—no ChatGPT or outside assistance. Tab changes,
        fullscreen exits and copy/paste attempts are logged for teacher review, not automatic penalties.
      </p>
      {notice ? <p role="status" style={{ margin: 0, fontWeight: 700 }}>{notice}</p> : null}
    </div>
    <button type="button" onClick={requestExamFullscreen}
      style={{ border: "1px solid #a88a63", borderRadius: 9, background: "#fff",
        padding: "9px 12px", color: "#563b20", alignSelf: "center", cursor: "pointer" }}>
      Enter fullscreen
    </button>
  </aside>;
}
