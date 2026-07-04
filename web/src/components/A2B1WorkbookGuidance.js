import React, { useEffect, useMemo, useRef, useState } from "react";
import { styles } from "../styles";
import WorkbookReadAloudInjector from "./WorkbookReadAloudInjector";
import AssignmentSubmissionPage from "./AssignmentSubmissionPage";

const resolveWorkbookLevel = (level) => {
  const explicit = String(level || "").trim().toUpperCase();
  if (["A2", "B1"].includes(explicit)) return explicit;

  if (typeof window === "undefined") return "";
  const path = `${window.location.pathname || ""} ${window.location.href || ""}`.toUpperCase();
  if (/\bB1\b|B1DAY|\/B1\//.test(path)) return "B1";
  if (/\bA2\b|A2DAY|\/A2\//.test(path)) return "A2";
  return "";
};

const normalizeTabText = (value = "") =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const REQUIRED_A2_TAB_KEYS = ["teil1", "teil2", "teil3", "teil4", "ref", "submit"];

const UNIVERSAL_A2_WORKBOOK_TABS = [
  { key: "teil1", label: "Teil 1", match: /\bteil\s*1\b|sprechen|speak/i },
  { key: "teil2", label: "Teil 2", match: /\bteil\s*2\b|schreiben|write/i },
  { key: "teil3", label: "Teil 3", match: /\bteil\s*3\b|lesen|read/i },
  { key: "teil4", label: "Teil 4", match: /\bteil\s*4\b|h[oö]ren|hoeren|listen/i },
  { key: "ref", label: "Ref", match: /\bref\b|reference|answers|antwort/i },
  { key: "submit", label: "Submit", match: /submit|abgeben|send/i },
];

const detectTabKey = (text = "") => {
  const normalized = normalizeTabText(text);
  if (/teil\s*1\b|sprechen|speak/.test(normalized)) return "teil1";
  if (/teil\s*2\b|schreiben|write/.test(normalized)) return "teil2";
  if (/teil\s*3\b|lesen|read/.test(normalized)) return "teil3";
  if (/teil\s*4\b|horen|hoeren|listen/.test(normalized)) return "teil4";
  if (/\bref\b|reference|answers|antwort/.test(normalized)) return "ref";
  if (/submit|abgeben|send/.test(normalized)) return "submit";
  return "";
};

const hasCompleteVisibleWorkbookTabs = () => {
  if (typeof document === "undefined") return false;
  const foundKeys = new Set();
  document.querySelectorAll("button, a").forEach((element) => {
    const style = window.getComputedStyle?.(element);
    if (style && (style.display === "none" || style.visibility === "hidden")) return;
    const key = detectTabKey(element.textContent || "");
    if (key) foundKeys.add(key);
  });
  return REQUIRED_A2_TAB_KEYS.every((key) => foundKeys.has(key));
};

const clickExistingWorkbookTab = (tab) => {
  if (typeof document === "undefined") return false;
  const candidates = Array.from(document.querySelectorAll("button, a"));
  const target = candidates.find((element) => {
    if (element.closest("[data-universal-a2-workbook-tabs]")) return false;
    return tab.match.test(element.textContent || "");
  });

  if (target) {
    target.click();
    target.scrollIntoView?.({ behavior: "smooth", block: "center" });
    return true;
  }

  const heading = Array.from(document.querySelectorAll("h1,h2,h3,h4,summary,strong")).find((element) => tab.match.test(element.textContent || ""));
  if (heading) {
    heading.scrollIntoView?.({ behavior: "smooth", block: "start" });
    return true;
  }

  return false;
};

const UniversalA2WorkbookTabs = ({ level = "" }) => {
  const workbookLevel = useMemo(() => resolveWorkbookLevel(level), [level]);
  const [activeTab, setActiveTab] = useState("teil1");
  const [showFallbackTabs, setShowFallbackTabs] = useState(false);
  const [showSubmit, setShowSubmit] = useState(false);
  const submitRef = useRef(null);

  useEffect(() => {
    if (workbookLevel !== "A2") {
      setShowFallbackTabs(false);
      return undefined;
    }

    const checkTabs = () => setShowFallbackTabs(!hasCompleteVisibleWorkbookTabs());
    const timeoutId = window.setTimeout(checkTabs, 50);
    const secondTimeoutId = window.setTimeout(checkTabs, 500);
    const observer = new MutationObserver(checkTabs);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.clearTimeout(timeoutId);
      window.clearTimeout(secondTimeoutId);
      observer.disconnect();
    };
  }, [workbookLevel]);

  if (workbookLevel !== "A2" || !showFallbackTabs) return null;

  const handleTabClick = (tab) => {
    setActiveTab(tab.key);
    if (tab.key === "submit") {
      setShowSubmit(true);
      window.setTimeout(() => submitRef.current?.scrollIntoView?.({ behavior: "smooth", block: "start" }), 0);
      return;
    }

    setShowSubmit(false);
    clickExistingWorkbookTab(tab);
  };

  return (
    <section
      data-universal-a2-workbook-tabs="true"
      style={{
        ...styles.card,
        margin: 0,
        display: "grid",
        gap: 10,
        border: "1px solid #bfdbfe",
        background: "#f8fbff",
      }}
    >
      <div style={{ display: "grid", gap: 4 }}>
        <strong>A2 workbook navigation</strong>
        <span style={{ color: "#475569", fontSize: 13 }}>
          Use these fallback tabs if the workbook page does not show all parts clearly.
        </span>
      </div>
      <div
        style={{
          position: "sticky",
          top: 0,
          zIndex: 30,
          display: "flex",
          flexWrap: "wrap",
          gap: 8,
          padding: "8px 0",
          background: "rgba(248,251,255,0.96)",
          borderBottom: "1px solid #dbeafe",
        }}
      >
        {UNIVERSAL_A2_WORKBOOK_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => handleTabClick(tab)}
            style={{
              ...styles.secondaryButton,
              minWidth: 86,
              borderColor: activeTab === tab.key ? "#2563eb" : "#d1d5db",
              background: activeTab === tab.key ? "#eff6ff" : "#fff",
              color: activeTab === tab.key ? "#1d4ed8" : "#111827",
              fontWeight: activeTab === tab.key ? 800 : 700,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {showSubmit ? (
        <div ref={submitRef} style={{ border: "1px solid #dbeafe", borderRadius: 14, padding: 10, background: "#fff" }}>
          <h3 style={{ margin: "0 0 8px" }}>Submit workbook</h3>
          <p style={{ margin: "0 0 10px", color: "#475569", lineHeight: 1.6 }}>
            Submit only your final answers here. Include Teil 2 Schreiben, Teil 3 Lesen and Teil 4 Hören where required.
          </p>
          <AssignmentSubmissionPage />
        </div>
      ) : null}
    </section>
  );
};

export const A2B1WorkbookGuidance = ({ level = "" }) => {
  const workbookLevel = useMemo(() => resolveWorkbookLevel(level), [level]);
  const workbookLabel = workbookLevel ? `${workbookLevel} workbook` : "workbook";
  const levelPrefix = workbookLevel || "A2/B1";

  return (
    <>
      <WorkbookReadAloudInjector />
      <UniversalA2WorkbookTabs level={workbookLevel} />
      <details
        style={{
          ...styles.card,
          margin: 0,
          border: "1px solid #bfdbfe",
          background: "#eff6ff",
          color: "#1e3a8a",
          padding: 0,
          overflow: "hidden",
        }}
      >
        <summary
          style={{
            cursor: "pointer",
            padding: 14,
            fontWeight: 800,
            fontSize: "1.02rem",
            listStylePosition: "inside",
          }}
        >
          How this workbook works · open guide
        </summary>

        <div style={{ display: "grid", gap: 10, padding: "0 14px 14px", lineHeight: 1.6 }}>
          <p style={{ margin: 0 }}>
            Use the tabs above to move through the four workbook parts of this {workbookLabel}. Use <strong>Ref</strong> for reflection and the <strong>Submit</strong> tab in the Course Book when your final answers are ready.
          </p>
          <p style={{ margin: 0 }}>
            <strong>{levelPrefix} · Teil 1 · Sprechen:</strong> prepare for class and practise with the AI speaking coach. Teil 1 is not submitted.
          </p>
          <p style={{ margin: 0 }}>
            <strong>Teil 2 · Schreiben, Teil 3 · Lesen and Teil 4 · Hören:</strong> complete the tasks and send only your final answers through the <strong>Submit</strong> tab.
          </p>
          <p style={{ margin: 0 }}>
            <strong>Read aloud:</strong> In Teil 3, use the German voice controls to listen to the reading text, pause, continue, stop and change speed.
          </p>
        </div>
      </details>
    </>
  );
};

export const WorkbookSubmissionReminder = () => {
  const reminderRef = useRef(null);
  const [showDay20Submission, setShowDay20Submission] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const isDay20Workbook = window.location.pathname.includes(
      "/campus/course/a2-day-20-typische-reklamationssituationen-workbook"
    );
    const sectionTitle = reminderRef.current
      ?.closest("section")
      ?.querySelector("h2")
      ?.textContent?.trim()
      ?.toLowerCase();

    setShowDay20Submission(Boolean(isDay20Workbook && sectionTitle?.startsWith("submit workbook")));
  }, []);

  if (showDay20Submission) {
    return (
      <div
        ref={reminderRef}
        className="a2-day20-inline-submission"
        style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 8, background: "#fff" }}
      >
        <style>{`.a2-day20-inline-submission > div > section:first-child { display: none !important; }
        .a2-day20-inline-submission select { display: none !important; }
        .a2-day20-inline-submission ~ a[href="/campus/course?submitWork=1"] { display: none !important; }`}</style>
        <AssignmentSubmissionPage />
      </div>
    );
  }

  return (
    <div
      ref={reminderRef}
      role="note"
      style={{
        border: "1px solid #bfdbfe",
        borderRadius: 10,
        padding: "10px 12px",
        background: "#eff6ff",
        color: "#1e40af",
        fontWeight: 600,
        lineHeight: 1.5,
      }}
    >
      Reminder: Practise here, then submit only your final answers through the Submit tab.
    </div>
  );
};
