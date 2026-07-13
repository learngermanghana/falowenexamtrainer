import React, { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { styles } from "../styles";
import { getInlineCourseAssignments } from "../utils/courseLessonAssignments";
import ContextualAssignmentSubmissionPage from "./ContextualAssignmentSubmissionPage";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";

export const A2_LEGACY_WORKBOOK_COMPLETION_BY_PATH = {
  "/campus/course/a2-day-16-wohlbefinden-und-entspannung-workbook": {
    day: 16,
    fallbackChapter: "6.16",
    title: "Wohlbefinden und Entspannung",
    workbookId: "A2Day16WohlbefindenUndEntspannung",
  },
  "/campus/course/a2-day-18-die-bank-anrufen-workbook": {
    day: 18,
    fallbackChapter: "7.18",
    title: "Die Bank anrufen",
    workbookId: "A2Day18DieBankAnrufen",
  },
  "/campus/course/a2-day-19-einkaufen-wo-und-wie-workbook": {
    day: 19,
    fallbackChapter: "7.19",
    title: "Einkaufen? Wo und wie?",
    workbookId: "A2Day19EinkaufenWoUndWie",
  },
  "/campus/course/a2-day-20-typische-reklamationssituationen-workbook": {
    day: 20,
    fallbackChapter: "7.20",
    title: "Typische Reklamationssituationen",
    workbookId: "A2Day20TypischeReklamationssituationen",
  },
  "/campus/course/a2-day-21-ein-wochenende-planen-workbook": {
    day: 21,
    fallbackChapter: "8.21",
    title: "Ein Wochenende planen",
    workbookId: "A2Day21EinWochenendePlanen",
  },
  "/campus/course/a2-day-26-gefuehle-in-verschiedenen-situationen-workbook": {
    day: 26,
    fallbackChapter: "10.26",
    title: "Gefühle in verschiedenen Situationen",
    workbookId: "A2Day26GefuehleInVerschiedenenSituationen",
  },
};

const normalizePath = (value = "") => String(value || "").replace(/\/+$/, "") || "/";
const normalizeText = (value = "") =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

export const getA2LegacyWorkbookTabKey = (value = "") => {
  const text = normalizeText(value);
  if (/teil\s*1\b|sprechen|speak/.test(text)) return "teil1";
  if (/teil\s*2\b|schreiben|write/.test(text)) return "teil2";
  if (/teil\s*3\b|lesen|read/.test(text)) return "teil3";
  if (/teil\s*4\b|horen|hoeren|listen/.test(text)) return "teil4";
  if (/\bref\b|reference|answers|antwort/.test(text)) return "references";
  if (/submit|abgeben|send/.test(text)) return "submit";
  return "";
};

export const findA2LegacyWorkbookTabRow = (root = document) => {
  if (!root?.querySelectorAll) return null;
  return (
    Array.from(root.querySelectorAll("nav, div"))
      .map((container) => {
        const buttons = Array.from(container.children || []).filter(
          (child) => child.tagName === "BUTTON",
        );
        const keys = new Set(buttons.map((button) => getA2LegacyWorkbookTabKey(button.textContent)));
        return { container, buttons, keys };
      })
      .filter(({ buttons }) => buttons.length >= 4 && buttons.length <= 8)
      .find(({ keys }) => ["teil1", "teil2", "teil3", "teil4"].every((key) => keys.has(key)))
      ?.container || null
  );
};

const makeInjectedButton = ({ label, key, onClick }) => {
  const button = document.createElement("button");
  button.type = "button";
  button.textContent = label;
  button.setAttribute("data-a2-legacy-completion-tab", key);
  button.setAttribute("aria-pressed", "false");
  Object.assign(button.style, {
    background: "#ffffff",
    border: "1px solid #d1d5db",
    borderRadius: "8px",
    color: "#111827",
    cursor: "pointer",
    font: "inherit",
    fontWeight: "700",
    minHeight: "40px",
    padding: "8px 12px",
  });
  button.addEventListener("click", onClick);
  return button;
};

const setInjectedButtonState = (root, activePanel) => {
  root?.querySelectorAll?.("[data-a2-legacy-completion-tab]").forEach((button) => {
    const selected = button.getAttribute("data-a2-legacy-completion-tab") === activePanel;
    button.setAttribute("aria-pressed", selected ? "true" : "false");
    button.style.background = selected ? "#eff6ff" : "#ffffff";
    button.style.borderColor = selected ? "#2563eb" : "#d1d5db";
    button.style.color = selected ? "#1d4ed8" : "#111827";
  });
};

export default function A2LegacyWorkbookCompletionTabs() {
  const location = useLocation();
  const normalizedPath = normalizePath(location.pathname);
  const config = A2_LEGACY_WORKBOOK_COMPLETION_BY_PATH[normalizedPath] || null;
  const [activePanel, setActivePanel] = useState("");
  const [portalRoot, setPortalRoot] = useState(null);
  const panelRef = useRef(null);

  const assignment = useMemo(() => {
    if (!config) return null;
    return getInlineCourseAssignments("A2", config.day)[0] || null;
  }, [config]);

  const chapter = assignment?.chapter || config?.fallbackChapter || "";
  const assignmentKey = assignment?.assignmentKey || `A2-${chapter}`;

  useEffect(() => {
    setActivePanel("");
  }, [normalizedPath]);

  useEffect(() => {
    if (!config) return undefined;
    const cleanup = [];
    let scheduled = false;

    const bindNativeReset = (button) => {
      if (button.getAttribute("data-a2-completion-reset-bound") === "true") return;
      const handler = () => setActivePanel("");
      button.setAttribute("data-a2-completion-reset-bound", "true");
      button.addEventListener("click", handler);
      cleanup.push(() => {
        button.removeEventListener("click", handler);
        button.removeAttribute("data-a2-completion-reset-bound");
      });
    };

    const decorate = () => {
      scheduled = false;
      const main = document.querySelector("main.layout-main") || document.querySelector("main");
      const row = findA2LegacyWorkbookTabRow(main || document);
      if (!main || !row) return;
      setPortalRoot(main);

      Array.from(row.children || [])
        .filter((child) => child.tagName === "BUTTON" && !child.hasAttribute("data-a2-legacy-completion-tab"))
        .forEach(bindNativeReset);

      const keys = new Set(
        Array.from(row.children || [])
          .filter((child) => child.tagName === "BUTTON")
          .map((button) => getA2LegacyWorkbookTabKey(button.textContent)),
      );

      if (!keys.has("references")) {
        const button = makeInjectedButton({
          key: "references",
          label: "5. Ref",
          onClick: () => setActivePanel("references"),
        });
        row.appendChild(button);
        cleanup.push(() => button.remove());
      }

      if (!keys.has("submit")) {
        const button = makeInjectedButton({
          key: "submit",
          label: "Submit",
          onClick: () => setActivePanel("submit"),
        });
        row.appendChild(button);
        cleanup.push(() => button.remove());
      }

      setInjectedButtonState(row, activePanel);
    };

    const scheduleDecorate = () => {
      if (scheduled) return;
      scheduled = true;
      const schedule = window.requestAnimationFrame || ((callback) => window.setTimeout(callback, 0));
      schedule(decorate);
    };

    scheduleDecorate();
    const observer = new MutationObserver(scheduleDecorate);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      cleanup.splice(0).forEach((remove) => remove());
      document
        .querySelectorAll("[data-a2-legacy-completion-tab]")
        .forEach((button) => button.remove());
      setPortalRoot(null);
    };
  }, [activePanel, config]);

  useEffect(() => {
    if (!activePanel) return;
    const timer = window.setTimeout(
      () => panelRef.current?.scrollIntoView?.({ behavior: "smooth", block: "start" }),
      0,
    );
    return () => window.clearTimeout(timer);
  }, [activePanel]);

  if (!config || !portalRoot || !activePanel) return null;

  const panel = (
    <section
      ref={panelRef}
      data-a2-legacy-completion-panel={activePanel}
      style={{ ...styles.card, display: "grid", gap: 12, border: "1px solid #bfdbfe" }}
    >
      {activePanel === "references" ? (
        <WorkbookReferenceAnswers
          level="A2"
          lesson={{
            title: config.workbookId,
            level: "A2",
            day: config.day,
            chapter,
            workbookId: config.workbookId,
          }}
          workbookId={config.workbookId}
        />
      ) : (
        <>
          <div>
            <p style={{ margin: 0, color: "#1d4ed8", fontSize: 13, fontWeight: 900 }}>
              Tutor-marked assignment
            </p>
            <h2 style={{ margin: "4px 0" }}>
              Submit A2 · Day {config.day} · Kapitel {chapter}
            </h2>
            <p style={{ margin: 0, color: "#475569" }}>
              Submit your final answers for <strong>{config.title}</strong>. This box is locked to {assignmentKey}.
            </p>
          </div>
          <div
            className={`a2-legacy-day-${config.day}-submission`}
            style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 8, background: "#fff" }}
          >
            <style>{`.a2-legacy-day-${config.day}-submission > div > section:first-child { display: none !important; }
            .a2-legacy-day-${config.day}-submission select { display: none !important; }`}</style>
            <ContextualAssignmentSubmissionPage
              submissionContext={{
                level: "A2",
                day: config.day,
                chapter,
                assignmentKey,
                canonicalAssignmentKey: assignmentKey,
                workbookId: config.workbookId,
              }}
            />
          </div>
        </>
      )}
    </section>
  );

  return createPortal(panel, portalRoot);
}
