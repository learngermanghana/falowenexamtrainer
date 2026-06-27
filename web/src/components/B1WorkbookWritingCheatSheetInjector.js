import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { getWritingCheatSheet } from "../data/writingCheatSheets";

const TABS = [
  ["sprechen", "Teil 1 · Sprechen", /^Teil\s*1\b/i],
  ["schreiben", "Teil 2 · Schreiben", /^Teil\s*2\b/i],
  ["lesen", "Teil 3 · Lesen", /^Teil\s*3\b/i],
  ["hoeren", "Teil 4 · Hören", /^Teil\s*4\b/i],
  ["references", "Ref", /Reference answers|Referenz/i],
  ["submit", "Submit", /Submit workbook answers/i],
];

const isB1WorkbookRoute = (pathname = "", search = "") => {
  const path = String(pathname || "").replace(/\/+$/, "");
  if (/^\/campus\/course\/lesson\/B1\/\d+$/i.test(path)) {
    return new URLSearchParams(search || "").get("view") === "workbook";
  }
  return /^\/campus\/course\/b1-day-\d+-.*-workbook$/i.test(path);
};

const getB1WorkbookDay = (pathname = "") => {
  const match = String(pathname).match(/\/lesson\/B1\/(\d+)/i)
    || String(pathname).match(/\/b1-day-(\d+)-/i);
  return match ? Number(match[1]) : 1;
};

const createCheatSheet = (sections = []) => {
  const details = document.createElement("details");
  details.dataset.b1WritingCheatSheet = "true";
  Object.assign(details.style, {
    border: "1px solid #dbeafe",
    borderRadius: "14px",
    padding: "12px",
    background: "#eff6ff",
    marginTop: "4px",
  });

  const summary = document.createElement("summary");
  summary.textContent = "Cheat Sheet";
  Object.assign(summary.style, { cursor: "pointer", fontWeight: "800", color: "#1e3a8a" });
  details.appendChild(summary);

  const content = document.createElement("div");
  Object.assign(content.style, { display: "grid", gap: "14px", marginTop: "12px" });

  sections.forEach((section) => {
    const block = document.createElement("section");
    const title = document.createElement("h3");
    const grid = document.createElement("div");
    title.textContent = section.title;
    Object.assign(title.style, { margin: "0", fontSize: "1rem", color: "#1e3a8a" });
    Object.assign(grid.style, {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,240px),1fr))",
      gap: "8px",
    });

    section.items.forEach((item) => {
      const row = document.createElement("div");
      const phrase = document.createElement("strong");
      const meaning = document.createElement("span");
      phrase.textContent = item.phrase;
      meaning.textContent = item.meaning;
      Object.assign(row.style, {
        display: "grid",
        gap: "5px",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "10px",
        background: "#fff",
      });
      Object.assign(meaning.style, { color: "#475569", fontSize: "0.92rem" });
      row.append(phrase, meaning);
      grid.appendChild(row);
    });

    block.append(title, grid);
    content.appendChild(block);
  });

  details.appendChild(content);
  return details;
};

const addCheatSheet = (root, sections) => {
  if (!sections.length) return;
  Array.from(root.querySelectorAll("h1,h2,h3,strong")).forEach((heading) => {
    if (!/Teil\s*2.*Schreiben|Schreiben.*Assignment|Assignment.*Schreiben/i.test(heading.textContent || "")) return;
    const container = heading.closest("section,article,div");
    if (!container || container.querySelector("[data-b1-writing-cheat-sheet='true']")) return;
    heading.insertAdjacentElement("afterend", createCheatSheet(sections));
  });
};

const setSectionInUrl = (key) => {
  const url = new URL(window.location.href);
  url.searchParams.set("section", key);
  window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`);
};

const connectPanel = (root, list) => {
  const selected = list.querySelector('[role="tab"][aria-selected="true"]');
  const definition = TABS.find(([key]) => key === selected?.dataset.b1TabKey);
  if (!definition) return;

  root.querySelectorAll("[data-b1-tab-panel='true']").forEach((panel) => {
    panel.removeAttribute("role");
    panel.removeAttribute("aria-labelledby");
    panel.removeAttribute("data-b1-tab-panel");
  });

  const heading = Array.from(root.querySelectorAll("h1,h2,h3,strong"))
    .find((node) => definition[2].test(String(node.textContent || "").trim()));
  const panel = heading?.closest("section");
  if (!panel) return;
  panel.id = `b1-workbook-panel-${definition[0]}`;
  panel.dataset.b1TabPanel = "true";
  panel.setAttribute("role", "tabpanel");
  panel.setAttribute("aria-labelledby", `b1-workbook-tab-${definition[0]}`);
};

const enhanceTabs = (root) => {
  const list = root.querySelector('[role="tablist"][aria-label*="B1 Day"]');
  if (!list) return;
  const buttons = Array.from(list.querySelectorAll('[role="tab"]'));

  TABS.forEach(([key, label], index) => {
    const button = buttons[index];
    if (!button) return;
    button.id = `b1-workbook-tab-${key}`;
    button.dataset.b1TabKey = key;
    button.setAttribute("aria-label", label);
    button.setAttribute("aria-controls", `b1-workbook-panel-${key}`);
    if (button.textContent !== label) button.textContent = label;
    const selected = button.getAttribute("aria-selected") === "true";
    button.tabIndex = selected ? 0 : -1;
    if (selected) button.setAttribute("aria-current", "page");
    else button.removeAttribute("aria-current");

    if (!button.dataset.b1ClickBound) {
      button.dataset.b1ClickBound = "true";
      button.addEventListener("click", () => {
        setSectionInUrl(key);
        window.setTimeout(() => connectPanel(root, list), 0);
      });
    }
  });

  if (!list.dataset.b1KeysBound) {
    list.dataset.b1KeysBound = "true";
    list.addEventListener("keydown", (event) => {
      if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
      const current = Math.max(0, buttons.indexOf(document.activeElement));
      let next = current;
      if (event.key === "ArrowRight") next = (current + 1) % buttons.length;
      if (event.key === "ArrowLeft") next = (current - 1 + buttons.length) % buttons.length;
      if (event.key === "Home") next = 0;
      if (event.key === "End") next = buttons.length - 1;
      event.preventDefault();
      buttons[next]?.focus();
      buttons[next]?.click();
    });
  }

  const requested = new URLSearchParams(window.location.search).get("section");
  const requestedButton = buttons.find((button) => button.dataset.b1TabKey === requested);
  if (requestedButton && requestedButton.getAttribute("aria-selected") !== "true") {
    requestedButton.click();
    return;
  }
  connectPanel(root, list);
};

export default function B1WorkbookWritingCheatSheetInjector() {
  const location = useLocation();

  useEffect(() => {
    if (!isB1WorkbookRoute(location.pathname, location.search)) return undefined;
    const root = document.getElementById("root") || document.body;
    const sections = getWritingCheatSheet("B1", getB1WorkbookDay(location.pathname));
    const run = () => {
      enhanceTabs(root);
      addCheatSheet(root, sections);
    };

    run();
    const observer = new MutationObserver(run);
    observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["aria-selected"],
    });
    const timer = window.setInterval(run, 500);
    const stop = window.setTimeout(() => window.clearInterval(timer), 10000);

    return () => {
      observer.disconnect();
      window.clearInterval(timer);
      window.clearTimeout(stop);
    };
  }, [location.pathname, location.search]);

  return null;
}

export const __TESTING__ = { getB1WorkbookDay, isB1WorkbookRoute, TABS };
