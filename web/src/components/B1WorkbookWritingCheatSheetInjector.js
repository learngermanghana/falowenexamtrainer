import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { courseDebug } from "../lib/courseDebug";

const isB1WorkbookRoute = (pathname = "", search = "") => {
  const path = String(pathname || "").replace(/\/+$/, "");
  const lessonMatch = path.match(/^\/campus\/course\/lesson\/B1\/(\d+)$/i);
  if (lessonMatch) {
    const lessonDay = Number(lessonMatch[1]);
    return (lessonDay < 21 || lessonDay > 28) && new URLSearchParams(search || "").get("view") === "workbook";
  }
  const standaloneMatch = path.match(/^\/campus\/course\/b1-day-(\d+)-.*-workbook$/i);
  if (!standaloneMatch) return false;

  const standaloneDay = Number(standaloneMatch[1]);
  return standaloneDay < 21 || standaloneDay > 28;
};

const getB1WorkbookDay = (pathname = "") => {
  const match = String(pathname).match(/\/lesson\/B1\/(\d+)/i)
    || String(pathname).match(/\/b1-day-(\d+)-/i);
  return match ? Number(match[1]) : 1;
};

const readTabs = (root) => {
  const tablist = root.querySelector('[role="tablist"][aria-label*="B1 Day"]');
  if (!tablist) return { found: false, tabs: [] };

  return {
    found: true,
    label: tablist.getAttribute("aria-label") || "",
    tabs: Array.from(tablist.querySelectorAll('[role="tab"]')).map((tab, index) => ({
      index,
      text: String(tab.textContent || "").trim(),
      selected: tab.getAttribute("aria-selected"),
      controls: tab.getAttribute("aria-controls") || "",
      id: tab.id || "",
      disabled: Boolean(tab.disabled),
    })),
  };
};

export default function B1WorkbookWritingCheatSheetInjector() {
  const location = useLocation();

  useEffect(() => {
    if (!isB1WorkbookRoute(location.pathname, location.search)) return undefined;

    const root = document.getElementById("root") || document.body;
    const day = getB1WorkbookDay(location.pathname);
    let lastSnapshot = "";

    const report = (reason) => {
      const snapshot = readTabs(root);
      const serialized = JSON.stringify(snapshot);
      if (reason !== "click" && serialized === lastSnapshot) return;
      lastSnapshot = serialized;
      courseDebug("b1Workbook:tabs", {
        reason,
        day,
        query: location.search,
        ...snapshot,
      });
    };

    const handleClick = (event) => {
      const tab = event.target?.closest?.('[role="tab"]');
      if (!tab) return;
      courseDebug("b1Workbook:tabClick", {
        day,
        text: String(tab.textContent || "").trim(),
        selectedBeforeClick: tab.getAttribute("aria-selected"),
        disabled: Boolean(tab.disabled),
      });
      window.setTimeout(() => report("click"), 0);
    };

    report("mounted");
    document.addEventListener("click", handleClick, true);

    const observer = new MutationObserver(() => report("react-update"));
    observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["aria-selected", "disabled"],
    });

    const timers = [300, 1000, 2500].map((delay) =>
      window.setTimeout(() => report(`timer-${delay}`), delay)
    );

    return () => {
      document.removeEventListener("click", handleClick, true);
      observer.disconnect();
      timers.forEach((timer) => window.clearTimeout(timer));
      courseDebug("b1Workbook:unmounted", { day });
    };
  }, [location.pathname, location.search]);

  return null;
}

export const __TESTING__ = { getB1WorkbookDay, isB1WorkbookRoute, readTabs };
