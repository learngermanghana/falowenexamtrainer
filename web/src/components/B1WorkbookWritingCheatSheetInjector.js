import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getWritingCheatSheet } from "../data/writingCheatSheets";

const isB1WorkbookRoute = (pathname = "", search = "") => {
  const normalizedPath = String(pathname || "").replace(/\/+$/, "");
  if (/^\/campus\/course\/lesson\/B1\/\d+$/i.test(normalizedPath)) {
    return new URLSearchParams(search || "").get("view") === "workbook";
  }
  return /^\/campus\/course\/b1-day-\d+-.*-workbook$/i.test(normalizedPath);
};

const getB1WorkbookDay = (pathname = "") => {
  const lessonMatch = String(pathname).match(/\/lesson\/B1\/(\d+)/i);
  if (lessonMatch) return Number(lessonMatch[1]);
  const workbookMatch = String(pathname).match(/\/b1-day-(\d+)-/i);
  return workbookMatch ? Number(workbookMatch[1]) : 1;
};

const TAB_DEFINITIONS = [
  { key: "sprechen", label: "Teil 1 · Sprechen", panelPattern: /^Teil\s*1\b/i },
  { key: "schreiben", label: "Teil 2 · Schreiben", panelPattern: /^Teil\s*2\b/i },
  { key: "lesen", label: "Teil 3 · Lesen", panelPattern: /^Teil\s*3\b/i },
  { key: "hoeren", label: "Teil 4 · Hören", panelPattern: /^Teil\s*4\b/i },
  { key: "references", label: "Ref", panelPattern: /Reference answers|Referenz/i },
  { key: "submit", label: "Submit", panelPattern: /Submit workbook answers/i },
];

const createCheatSheet = (sections = []) => {
  const details = document.createElement("details");
  details.dataset.b1WritingCheatSheet = "true";
  details.style.border = "1px solid #dbeafe";
  details.style.borderRadius = "14px";
  details.style.padding = "12px";
  details.style.background = "#eff6ff";
  details.style.marginTop = "4px";

  const summary = document.createElement("summary");
  summary.textContent = "Cheat Sheet";
  summary.style.cursor = "pointer";
  summary.style.fontWeight = "800";
  summary.style.color = "#1e3a8a";
  details.appendChild(summary);

  const content = document.createElement("div");
  content.style.display = "grid";
  content.style.gap = "14px";
  content.style.marginTop = "12px";

  sections.forEach((section) => {
    const block = document.createElement("section");
    block.style.display = "grid";
    block.style.gap = "8px";

    const title = document.createElement("h3");
    title.textContent = section.title;
    title.style.margin = "0";
    title.style.fontSize = "1rem";
    title.style.color = "#1e3a8a";
    block.appendChild(title);

    const grid = document.createElement("div");
    grid.style.display = "grid";
    grid.style.gridTemplateColumns = "repeat(auto-fit,minmax(min(100%,240px),1fr))";
    grid.style.gap = "8px";

    section.items.forEach((item) => {
      const row = document.createElement("div");
      row.style.display = "grid";
      row.style.gap = "5px";
      row.style.border = "1px solid #e2e8f0";
      row.style.borderRadius = "12px";
      row.style.padding = "10px";
      row.style.background = "#fff";

      const phrase = document.createElement("strong");
      phrase.textContent = item.phrase;
      phrase.style.color = "#0f172a";
      const meaning = document.createElement("span");
      meaning.textContent = item.meaning;
      meaning.style.color = "#475569";
      meaning.style.fontSize = "0.92rem";

      row.appendChild(phrase);
      row.appendChild(meaning);
      grid.appendChild(row);
    });

    block.appendChild(grid);
    content.appendChild(block);
  });

  details.appendChild(content);
  return details;
};

const addCheatSheetToWritingSection = (root, sections) => {
  if (!root || !sections.length) return;

  Array.from(root.querySelectorAll("h1,h2,h3,strong")).forEach((heading) => {
    if (!/Teil\s*2.*Schreiben|Schreiben.*Assignment|Assignment.*Schreiben/i.test(heading.textContent || "")) return;
    const container = heading.closest("section, article, div");
    if (!container || container.querySelector("[data-b1-writing-cheat-sheet='true']")) return;
    heading.insertAdjacentElement("afterend", createCheatSheet(sections));
  });
};

const setSectionInAddress = (key) => {
  const url = new URL(window.location.href);
  url.searchParams.set("section", key);
  window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
};

const findPanel = (root, definition) =>
  Array.from(root.querySelectorAll("h1,h2,h3,strong"))
    .find((heading) => definition.panelPattern.test(String(heading.textContent || "").trim()))
    ?.closest("section") || null;

const connectActivePanel = (root, tablist) => {
  const selectedButton = tablist.querySelector('[role="tab"][aria-selected="true"]');
  const key = selectedButton?.dataset.b1WorkbookTabKey;
  const definition = TAB_DEFINITIONS.find((item) => item.key === key);
  if (!definition) return;

  root.querySelectorAll("[data-b1-workbook-tab-panel='true']").forEach((panel) => {
    panel.removeAttribute("role");
    panel.removeAttribute("aria-labelledby");
    panel.removeAttribute("data-b1-workbook-tab-panel");
  });

  const panel = findPanel(root, definition);
  if (!panel) return;
  panel.id = `b1-workbook-panel-${definition.key}`;
  panel.dataset.b1WorkbookTabPanel = "true";
  panel.setAttribute("role", "tabpanel");
  panel.setAttribute("aria-labelledby", `b1-workbook-tab-${definition.key}`);
  panel.style.scrollMarginTop = "92px";
};

const addKeyboardNavigation = (tablist) => {
  if (tablist.dataset.b1KeyboardNavigation === "true") return;
  tablist.dataset.b1KeyboardNavigation = "true";

  tablist.addEventListener("keydown", (event) => {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
    const buttons = Array.from(tablist.querySelectorAll('[role="tab"]'));
    if (!buttons.length) return;

    const currentIndex = Math.max(0, buttons.indexOf(document.activeElement));
    let nextIndex = currentIndex;
    if (event.key === "ArrowRight") nextIndex = (currentIndex + 1) % buttons.length;
    if (event.key === "ArrowLeft") nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
    if (event.key === "Home") nextIndex = 0;
    if (event.key === "End") nextIndex = buttons.length - 1;

    event.preventDefault();
    buttons[nextIndex].focus();
    buttons[nextIndex].click();
  });
};

const enhanceWorkbookTabs = (root) => {
  const tablist = root?.querySelector('[role="tablist"][aria-label*="B1 Day"]');
  if (!tablist) return;

  tablist.style.scrollBehavior = "smooth";
  addKeyboardNavigation(tablist);

  const buttons = Array.from(tablist.querySelectorAll('[role="tab"]'));
  TAB_DEFINITIONS.forEach((definition, index) => {
    const button = buttons[index];
    if (!button) return;

    button.id = `b1-workbook-tab-${definition.key}`;
    button.dataset.b1WorkbookTabKey = definition.key;
    button.setAttribute("aria-label", definition.label);
    button.setAttribute("aria-controls", `b1-workbook-panel-${definition.key}`);
    button.textContent = definition.label;
    button.tabIndex = button.getAttribute("aria-selected") === "true" ? 0 : -1;

    if (button.dataset.b1TabClickBound !== "true") {
      button.dataset.b1TabClickBound = "true";
      button.addEventListener("click", () => {
        setSectionInAddress(definition.key);
        window.setTimeout(() => connectActivePanel(root, tablist), 0);
      });
    }
  });

  const requestedSection = new URLSearchParams(window.location.search).get("section");
  const requestedButton = buttons.find((button) => button.dataset.b1WorkbookTabKey === requestedSection);
  if (requestedButton && requestedButton.getAttribute("aria-selected") !== "true") {
    requestedButton.click();
    return;
  }

  buttons.forEach((button) => {
    const selected = button.getAttribute("aria-selected") === "true";
    button.tabIndex = selected ? 0 : -1;
    if (selected) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");
  });
  connectActivePanel(root, tablist);
};

export default function B1WorkbookWritingCheatSheetInjector() {
  const location = useLocation();

  useEffect(() => {
    if (!isB1WorkbookRoute(location.pathname, location.search)) return undefined;

    const root = document.getElementById("root") || document.body;
    const day = getB1WorkbookDay(location.pathname);
    const sections = getWritingCheatSheet("B1", day);
    const run = () => {
      enhanceWorkbookTabs(root);
      addCheatSheetToWritingSection(root, sections);
    };

    run();
    const observer = new MutationObserver(run);
    observer.observe(root, { childList: true, subtree: true, attributes: true, attributeFilter: ["aria-selected"] });

    const timer = window.setInterval(run, 400);
    const stopTimer = window.setTimeout(() => window.clearInterval(timer), 10000);

    return () => {
      observer.disconnect();
      window.clearInterval(timer);
      window.clearTimeout(stopTimer);
    };
  }, [location.pathname, location.search]);

  return null;
}

export const __TESTING__ = {
  getB1WorkbookDay,
  isB1WorkbookRoute,
  TAB_DEFINITIONS,
};
