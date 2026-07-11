import React, { useEffect, useRef, useState } from "react";

const emptyDiagnostics = {
  textareaFound: false,
  textareaDisabled: null,
  textareaReadOnly: null,
  textareaFocused: false,
  valueLength: 0,
  inputEvents: 0,
  beforeInputEvents: 0,
  pointerEvents: 0,
  touchEvents: 0,
  computedPointerEvents: null,
  elementAtTextareaCenter: null,
  selectValues: [],
  draftSaveState: null,
  draftDocId: null,
  draftCloudError: null,
  draftLoaded: null,
  draftWriteCount: null,
  draftLastSavedAt: null,
  draftConflict: null,
  draftLocalDirty: null,
  draftRemoteUpdatedAt: null,
  draftRemoteSource: null,
};

const describeElement = (element) => {
  if (!element) return null;
  const tag = String(element.tagName || "").toLowerCase();
  const id = element.id ? `#${element.id}` : "";
  const className = typeof element.className === "string"
    ? element.className
        .trim()
        .split(/\s+/)
        .filter(Boolean)
        .slice(0, 3)
        .map((name) => `.${name}`)
        .join("")
    : "";
  return `${tag}${id}${className}` || null;
};

const AssignmentSubmissionDebugPanel = ({
  rootRef,
  assignmentKey = "",
  level = "A1",
  day = null,
  contextReady = true,
}) => {
  const eventCountsRef = useRef({ input: 0, beforeinput: 0, pointerdown: 0, touchstart: 0 });
  const [diagnostics, setDiagnostics] = useState(emptyDiagnostics);

  useEffect(() => {
    const root = rootRef?.current;
    if (!root || typeof document === "undefined") return undefined;

    const inspect = () => {
      const textarea = root.querySelector("textarea");
      const selectValues = Array.from(root.querySelectorAll("select")).map((select) => select.value || "");
      const cloudDraftRoot = root.querySelector("[data-cloud-draft-persistence]");
      let computedPointerEvents = null;
      let elementAtTextareaCenter = null;

      if (textarea) {
        computedPointerEvents = window.getComputedStyle(textarea).pointerEvents;
        const rect = textarea.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const centerX = Math.max(0, Math.min(window.innerWidth - 1, rect.left + rect.width / 2));
          const centerY = Math.max(0, Math.min(window.innerHeight - 1, rect.top + Math.min(rect.height / 2, 40)));
          elementAtTextareaCenter = describeElement(document.elementFromPoint(centerX, centerY));
        }
      }

      setDiagnostics({
        textareaFound: Boolean(textarea),
        textareaDisabled: textarea ? Boolean(textarea.disabled) : null,
        textareaReadOnly: textarea ? Boolean(textarea.readOnly) : null,
        textareaFocused: textarea ? document.activeElement === textarea : false,
        valueLength: textarea ? String(textarea.value || "").length : 0,
        inputEvents: eventCountsRef.current.input,
        beforeInputEvents: eventCountsRef.current.beforeinput,
        pointerEvents: eventCountsRef.current.pointerdown,
        touchEvents: eventCountsRef.current.touchstart,
        computedPointerEvents,
        elementAtTextareaCenter,
        selectValues,
        draftSaveState: cloudDraftRoot?.getAttribute("data-draft-save-state") || null,
        draftDocId: cloudDraftRoot?.getAttribute("data-draft-doc-id") || null,
        draftCloudError: cloudDraftRoot?.getAttribute("data-draft-cloud-error") || null,
        draftLoaded: cloudDraftRoot?.getAttribute("data-draft-loaded") || null,
        draftWriteCount: cloudDraftRoot?.getAttribute("data-draft-write-count") || null,
        draftLastSavedAt: cloudDraftRoot?.getAttribute("data-draft-last-saved-at") || null,
        draftConflict: cloudDraftRoot?.getAttribute("data-draft-conflict") || null,
        draftLocalDirty: cloudDraftRoot?.getAttribute("data-draft-local-dirty") || null,
        draftRemoteUpdatedAt: cloudDraftRoot?.getAttribute("data-draft-remote-updated-at") || null,
        draftRemoteSource: cloudDraftRoot?.getAttribute("data-draft-remote-source") || null,
      });
    };

    const countEvent = (key) => () => {
      eventCountsRef.current[key] += 1;
      window.setTimeout(inspect, 0);
    };

    const handlers = {
      input: countEvent("input"),
      beforeinput: countEvent("beforeinput"),
      pointerdown: countEvent("pointerdown"),
      touchstart: countEvent("touchstart"),
    };

    inspect();
    const observer = new MutationObserver(inspect);
    observer.observe(root, { childList: true, subtree: true, attributes: true });
    const timer = window.setInterval(inspect, 750);

    Object.entries(handlers).forEach(([eventName, handler]) => root.addEventListener(eventName, handler, true));
    root.addEventListener("focusin", inspect, true);
    root.addEventListener("focusout", inspect, true);

    return () => {
      observer.disconnect();
      window.clearInterval(timer);
      Object.entries(handlers).forEach(([eventName, handler]) => root.removeEventListener(eventName, handler, true));
      root.removeEventListener("focusin", inspect, true);
      root.removeEventListener("focusout", inspect, true);
    };
  }, [rootRef]);

  return (
    <aside
      data-assignment-submit-debug
      style={{
        background: "#fff7ed",
        border: "1px solid #fdba74",
        borderRadius: 12,
        color: "#7c2d12",
        fontSize: 12,
        margin: "8px 0",
        overflowWrap: "anywhere",
        padding: 10,
      }}
    >
      <strong>A1 Submit Debug</strong>
      <pre style={{ margin: "6px 0 0", whiteSpace: "pre-wrap" }}>
        {JSON.stringify(
          {
            assignmentKey,
            contextReady,
            day,
            level,
            path: typeof window !== "undefined" ? `${window.location.pathname}${window.location.search}` : "",
            userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "",
            ...diagnostics,
          },
          null,
          2
        )}
      </pre>
    </aside>
  );
};

export default AssignmentSubmissionDebugPanel;
