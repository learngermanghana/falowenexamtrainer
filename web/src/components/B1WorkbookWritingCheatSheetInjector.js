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

export default function B1WorkbookWritingCheatSheetInjector() {
  const location = useLocation();

  useEffect(() => {
    if (!isB1WorkbookRoute(location.pathname, location.search)) return undefined;

    const day = getB1WorkbookDay(location.pathname);
    const sections = getWritingCheatSheet("B1", day);
    if (!sections.length) return undefined;

    const run = () => addCheatSheetToWritingSection(document.getElementById("root"), sections);
    run();

    const observer = new MutationObserver(run);
    observer.observe(document.getElementById("root") || document.body, {
      childList: true,
      subtree: true,
    });

    const timer = window.setInterval(run, 500);
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
};
