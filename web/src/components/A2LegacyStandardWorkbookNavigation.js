import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { styles } from "../styles";
import { getInlineCourseAssignments } from "../utils/courseLessonAssignments";
import ContextualAssignmentSubmissionPage from "./ContextualAssignmentSubmissionPage";
import { STANDARD_WORKBOOK_TABS, WorkbookTabNav } from "./StandardWorkbookComponents";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";

export const A2_LEGACY_STANDARD_NAV_BY_PATH = {
  "/campus/course/a2-day-21-ein-wochenende-planen-workbook": {
    day: 21,
    fallbackChapter: "8.21",
    title: "Ein Wochenende planen",
    workbookId: "A2Day21EinWochenendePlanen",
  },
  "/campus/course/a2-day-22-die-woche-planung-workbook": {
    day: 22,
    fallbackChapter: "8.22",
    title: "Die Woche Planung",
    workbookId: "A2Day22DieWochePlanung",
  },
  "/campus/course/a2-day-23-wie-kommst-du-zur-schule-oder-zur-arbeit-workbook": {
    day: 23,
    fallbackChapter: "9.23",
    title: "Wie kommst du zur Schule oder zur Arbeit?",
    workbookId: "A2Day23WieKommstDuZurSchuleOderZurArbeit",
  },
  "/campus/course/a2-day-24-einen-urlaub-planen-workbook": {
    day: 24,
    fallbackChapter: "9.24",
    title: "Einen Urlaub planen",
    workbookId: "A2Day24EinenUrlaubPlanen",
  },
  "/campus/course/a2-day-25-tagesablauf-workbook": {
    day: 25,
    fallbackChapter: "9.25",
    title: "Tagesablauf",
    workbookId: "A2Day25Tagesablauf",
  },
  "/campus/course/a2-day-26-gefuehle-in-verschiedenen-situationen-workbook": {
    day: 26,
    fallbackChapter: "10.26",
    title: "Gefühle in verschiedenen Situationen",
    workbookId: "A2Day26GefuehleInVerschiedenenSituationen",
  },
};

const STANDARD_TO_LEGACY_KEY = {
  sprechen: "teil1",
  schreiben: "teil2",
  lesen: "teil3",
  hoeren: "teil4",
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
  if (/teil\s*3\b/.test(text)) return "teil3";
  if (/teil\s*4\b/.test(text)) return "teil4";
  if (/\bref\b|reference|answers|antwort/.test(text)) return "references";
  if (/submit|abgeben|send/.test(text)) return "submit";
  return "";
};

export const findA2LegacyWorkbookTabRow = (root = document) => {
  if (!root?.querySelectorAll) return null;

  return (
    Array.from(root.querySelectorAll("nav, div"))
      .filter(
        (container) =>
          !container.closest?.("[data-a2-standard-legacy-nav-root]") &&
          !container.hasAttribute?.("data-workbook-tab-navigation"),
      )
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

const findNativeTabButton = (row, standardKey) => {
  const legacyKey = STANDARD_TO_LEGACY_KEY[standardKey];
  if (!row || !legacyKey) return null;

  return (
    Array.from(row.children || []).find(
      (child) =>
        child.tagName === "BUTTON" &&
        getA2LegacyWorkbookTabKey(child.textContent) === legacyKey,
    ) || null
  );
};

export default function A2LegacyStandardWorkbookNavigation() {
  const location = useLocation();
  const normalizedPath = normalizePath(location.pathname);
  const config = A2_LEGACY_STANDARD_NAV_BY_PATH[normalizedPath] || null;
  const [activeTab, setActiveTab] = useState("sprechen");
  const [navRoot, setNavRoot] = useState(null);
  const [panelRoot, setPanelRoot] = useState(null);
  const nativeRowRef = useRef(null);
  const navMountRef = useRef(null);
  const panelRef = useRef(null);

  const assignment = useMemo(() => {
    if (!config) return null;
    return getInlineCourseAssignments("A2", config.day)[0] || null;
  }, [config]);

  const chapter = assignment?.chapter || config?.fallbackChapter || "";
  const assignmentKey = assignment?.assignmentKey || `A2-${chapter}`;

  useEffect(() => {
    setActiveTab("sprechen");
  }, [normalizedPath]);

  useEffect(() => {
    if (!config) return undefined;

    let scheduled = false;
    let disposed = false;

    const restoreNativeRow = () => {
      const row = nativeRowRef.current;
      if (!row) return;
      row.style.display = row.getAttribute("data-a2-standard-nav-original-display") || "";
      row.removeAttribute("data-a2-standard-nav-original-display");
      nativeRowRef.current = null;
    };

    const removeMount = () => {
      navMountRef.current?.remove();
      navMountRef.current = null;
      setNavRoot(null);
    };

    const decorate = () => {
      scheduled = false;
      if (disposed) return;

      const main = document.querySelector("main.layout-main") || document.querySelector("main");
      const row = findA2LegacyWorkbookTabRow(main || document);
      if (!main || !row || !row.parentNode) return;

      if (nativeRowRef.current && nativeRowRef.current !== row) {
        restoreNativeRow();
        removeMount();
      }

      nativeRowRef.current = row;
      setPanelRoot(main);

      if (!row.hasAttribute("data-a2-standard-nav-original-display")) {
        row.setAttribute("data-a2-standard-nav-original-display", row.style.display || "");
      }
      row.style.display = "none";

      let mount = row.parentNode.querySelector(":scope > [data-a2-standard-legacy-nav-root]");
      if (!mount) {
        mount = document.createElement("div");
        mount.setAttribute("data-a2-standard-legacy-nav-root", `day-${config.day}`);
        mount.style.width = "100%";
        mount.style.marginTop = "8px";
        row.parentNode.insertBefore(mount, row);
      }

      navMountRef.current = mount;
      setNavRoot(mount);
    };

    const scheduleDecorate = () => {
      if (scheduled || disposed) return;
      scheduled = true;
      const schedule = window.requestAnimationFrame || ((callback) => window.setTimeout(callback, 0));
      schedule(decorate);
    };

    scheduleDecorate();
    const observer = new MutationObserver(scheduleDecorate);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      disposed = true;
      observer.disconnect();
      restoreNativeRow();
      removeMount();
      setPanelRoot(null);
    };
  }, [config]);

  const selectTab = useCallback((tabKey) => {
    setActiveTab(tabKey);

    if (tabKey === "references" || tabKey === "submit") return;

    const nativeButton = findNativeTabButton(nativeRowRef.current, tabKey);
    nativeButton?.click();
  }, []);

  useEffect(() => {
    if (activeTab !== "references" && activeTab !== "submit") return undefined;
    const timer = window.setTimeout(
      () => panelRef.current?.scrollIntoView?.({ behavior: "smooth", block: "start" }),
      0,
    );
    return () => window.clearTimeout(timer);
  }, [activeTab]);

  if (!config) return null;

  const navigation = navRoot
    ? createPortal(
        <WorkbookTabNav
          activeTab={activeTab}
          onChange={selectTab}
          tabs={STANDARD_WORKBOOK_TABS}
          ariaLabel={`A2 Day ${config.day} workbook sections`}
        />,
        navRoot,
      )
    : null;

  const completionPanel =
    panelRoot && (activeTab === "references" || activeTab === "submit")
      ? createPortal(
          <section
            ref={panelRef}
            data-a2-standard-legacy-panel={activeTab}
            style={{ ...styles.card, display: "grid", gap: 12, border: "2px solid #2563eb" }}
          >
            {activeTab === "references" ? (
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
                  className={`a2-standard-legacy-day-${config.day}-submission`}
                  style={{ border: "1px solid #bfdbfe", borderRadius: 14, padding: 8, background: "#fff" }}
                >
                  <style>{`.a2-standard-legacy-day-${config.day}-submission > div > section:first-child { display: none !important; }
                  .a2-standard-legacy-day-${config.day}-submission select { display: none !important; }`}</style>
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
          </section>,
          panelRoot,
        )
      : null;

  return (
    <>
      {navigation}
      {completionPanel}
    </>
  );
}
