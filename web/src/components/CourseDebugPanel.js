import React, { useEffect, useMemo, useState } from "react";
import {
  COURSE_DEBUG_EVENT,
  clearCourseDebugEntries,
  courseDebug,
  getCourseDebugEntries,
  isCourseDebugEnabled,
} from "../lib/courseDebug";

const compactText = (value = "", limit = 120) => {
  const text = String(value || "").replace(/\s+/g, " ").trim();
  return text.length > limit ? `${text.slice(0, limit)}…` : text;
};

const readDomSnapshot = () => {
  if (typeof document === "undefined") return {};
  const tablists = Array.from(document.querySelectorAll('[role="tablist"]')).map((list) => ({
    label: list.getAttribute("aria-label") || "",
    tabs: Array.from(list.querySelectorAll('[role="tab"]')).map((tab) => ({
      text: compactText(tab.textContent, 70),
      selected: tab.getAttribute("aria-selected"),
      controls: tab.getAttribute("aria-controls") || "",
      id: tab.id || "",
    })),
  }));

  return {
    title: document.title,
    heading: compactText(document.querySelector("h1")?.textContent, 160),
    tablists,
    iframes: Array.from(document.querySelectorAll("iframe")).map((frame) => ({
      title: frame.title || "",
      src: frame.getAttribute("src") || "",
    })),
    continueControls: Array.from(document.querySelectorAll("button,a"))
      .filter((node) => /continue|workbook|falowen radio/i.test(node.textContent || ""))
      .map((node) => ({
        tag: node.tagName,
        text: compactText(node.textContent, 100),
        href: node.getAttribute("href") || "",
        disabled: Boolean(node.disabled),
      }))
      .slice(0, 20),
  };
};

const describeError = (value) => {
  if (!value) return "Unknown error";
  if (value instanceof Error) return value.stack || value.message || String(value);
  return String(value);
};

export default function CourseDebugPanel() {
  const enabled = useMemo(() => isCourseDebugEnabled(), []);
  const [entries, setEntries] = useState(() => getCourseDebugEntries());
  const [collapsed, setCollapsed] = useState(false);
  const [copyStatus, setCopyStatus] = useState("");

  useEffect(() => {
    if (!enabled || typeof window === "undefined") return undefined;

    courseDebug("debugPanel:mounted", {
      userAgent: window.navigator.userAgent,
      viewport: `${window.innerWidth}x${window.innerHeight}`,
      dom: readDomSnapshot(),
    });
    setEntries(getCourseDebugEntries());

    const refresh = () => setEntries(getCourseDebugEntries());
    const snapshot = (reason) => {
      window.setTimeout(() => {
        courseDebug("dom:snapshot", { reason, dom: readDomSnapshot() });
      }, 120);
    };
    const onClick = (event) => {
      const control = event.target?.closest?.("button,a");
      if (!control || control.closest?.('[aria-label="Falowen course debug panel"]')) return;
      courseDebug("ui:click", {
        tag: control.tagName,
        text: compactText(control.textContent, 120),
        href: control.getAttribute("href") || "",
        disabled: Boolean(control.disabled),
      });
      snapshot("after-click");
    };
    const onPopState = () => snapshot("popstate");
    const onError = (event) => {
      courseDebug("window:error", {
        message: event.message || describeError(event.error),
        filename: event.filename || "",
        line: event.lineno || 0,
        column: event.colno || 0,
        stack: describeError(event.error),
        dom: readDomSnapshot(),
      });
    };
    const onUnhandledRejection = (event) => {
      courseDebug("window:unhandledRejection", {
        reason: describeError(event.reason),
        dom: readDomSnapshot(),
      });
    };

    window.addEventListener(COURSE_DEBUG_EVENT, refresh);
    window.addEventListener("popstate", onPopState);
    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onUnhandledRejection);
    document.addEventListener("click", onClick, true);

    const initialTimers = [400, 1200, 2500].map((delay) =>
      window.setTimeout(() => snapshot(`initial-${delay}`), delay)
    );

    return () => {
      window.removeEventListener(COURSE_DEBUG_EVENT, refresh);
      window.removeEventListener("popstate", onPopState);
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onUnhandledRejection);
      document.removeEventListener("click", onClick, true);
      initialTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, [enabled]);

  if (!enabled) return null;

  const copyLogs = async () => {
    const payload = JSON.stringify(getCourseDebugEntries(), null, 2);
    try {
      await navigator.clipboard.writeText(payload);
      setCopyStatus("Copied");
    } catch (_error) {
      setCopyStatus("Copy failed");
    }
  };

  const clearLogs = () => {
    clearCourseDebugEntries();
    setEntries([]);
    setCopyStatus("");
  };

  return (
    <aside
      aria-label="Falowen course debug panel"
      style={{
        position: "fixed",
        left: 8,
        right: 8,
        bottom: 8,
        zIndex: 2147483647,
        border: "2px solid #f59e0b",
        borderRadius: 12,
        background: "#111827",
        color: "#f9fafb",
        boxShadow: "0 12px 35px rgba(0,0,0,.38)",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        fontSize: 11,
      }}
    >
      <div style={{ display: "flex", gap: 8, alignItems: "center", padding: 8, flexWrap: "wrap" }}>
        <strong style={{ marginRight: "auto" }}>Falowen course debug · {entries.length} events</strong>
        <button type="button" onClick={() => setCollapsed((value) => !value)}>
          {collapsed ? "Open" : "Minimize"}
        </button>
        <button type="button" onClick={copyLogs}>Copy logs</button>
        <button type="button" onClick={clearLogs}>Clear</button>
        {copyStatus ? <span>{copyStatus}</span> : null}
      </div>

      {!collapsed ? (
        <pre
          style={{
            margin: 0,
            padding: 10,
            maxHeight: "38vh",
            overflow: "auto",
            whiteSpace: "pre-wrap",
            borderTop: "1px solid #374151",
          }}
        >
          {entries.length
            ? entries.map((entry) => JSON.stringify(entry)).join("\n")
            : "Waiting for debug events…"}
        </pre>
      ) : null}
    </aside>
  );
}
