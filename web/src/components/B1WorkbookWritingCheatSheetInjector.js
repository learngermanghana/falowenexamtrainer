import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { courseDebug } from "../lib/courseDebug";
import {
  getWritingVideoResource,
  getYouTubeEmbedUrl,
} from "../data/writingVideoResources";
import { getWritingCheatSheet } from "../data/writingCheatSheets";

const WRITING_VIDEO_CARD_ATTRIBUTE = "data-b1-writing-video-support";
const WRITING_CHEAT_SHEET_ATTRIBUTE = "data-b1-writing-cheat-sheet-fallback";
const REACT_WRITING_VIDEO_SELECTOR = '[data-writing-video-support="true"]';
const REACT_WRITING_CHEAT_SHEET_SELECTOR = '[data-b1-writing-cheat-sheet="always-visible"]';

const isB1WorkbookRoute = (pathname = "", search = "") => {
  const path = String(pathname || "").replace(/\/+$/, "");
  const lessonMatch = path.match(/^\/campus\/course\/lesson\/B1\/(\d+)$/i);
  if (lessonMatch) {
    const lessonDay = Number(lessonMatch[1]);
    return lessonDay >= 1
      && lessonDay <= 28
      && new URLSearchParams(search || "").get("view") === "workbook";
  }
  const standaloneMatch = path.match(/^\/campus\/course\/b1-day-(\d+)-.*-workbook$/i);
  if (!standaloneMatch) return false;

  const standaloneDay = Number(standaloneMatch[1]);
  return standaloneDay >= 1 && standaloneDay <= 28;
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

const findWritingSection = (root) => Array.from(root.querySelectorAll("section")).find((section) => {
  const heading = String(section.querySelector("h2")?.textContent || "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
  return /^teil\s*2\b/.test(heading) && heading.includes("schreiben");
}) || null;

const findWritingInsertAnchor = (section) => {
  const inlineWritingPanel = section.querySelector('[data-course-inline-practice="writing"]');
  if (inlineWritingPanel) return inlineWritingPanel;

  return Array.from(section.querySelectorAll("div")).find((candidate) => {
    const labels = Array.from(candidate.children)
      .filter((child) => child.tagName === "BUTTON")
      .map((button) => String(button.textContent || "").trim().toLowerCase());
    return labels.includes("schreiben") && labels.some((label) => label.includes("cheat sheet"));
  }) || null;
};

const createWritingVideoCard = ({ resource, embedUrl, day }) => {
  const card = document.createElement("div");
  card.setAttribute(WRITING_VIDEO_CARD_ATTRIBUTE, String(day));
  card.dataset.writingVideoKey = resource.key || `B1-day-${day}`;
  card.setAttribute("aria-label", "B1 writing explanation video");
  Object.assign(card.style, {
    display: "grid",
    gap: "12px",
    border: "1px solid #bfdbfe",
    borderRadius: "16px",
    padding: "14px",
    background: "#eff6ff",
  });

  const badge = document.createElement("span");
  badge.textContent = "Writing Video · Essay Ideas";
  Object.assign(badge.style, {
    width: "fit-content",
    borderRadius: "999px",
    padding: "5px 10px",
    background: "#dbeafe",
    color: "#1e3a8a",
    fontSize: ".82rem",
    fontWeight: "800",
  });
  card.appendChild(badge);

  const heading = document.createElement("h3");
  heading.textContent = resource.title || "Writing explanation video";
  Object.assign(heading.style, { margin: "0", color: "#1e3a8a" });
  card.appendChild(heading);

  if (resource.description) {
    const description = document.createElement("p");
    description.textContent = resource.description;
    Object.assign(description.style, {
      margin: "0",
      color: "#475569",
      lineHeight: "1.7",
    });
    card.appendChild(description);
  }

  if (embedUrl) {
    const frameWrap = document.createElement("div");
    Object.assign(frameWrap.style, {
      position: "relative",
      width: "100%",
      paddingTop: "56.25%",
      borderRadius: "14px",
      overflow: "hidden",
      background: "#0f172a",
    });

    const iframe = document.createElement("iframe");
    iframe.title = resource.title || "Writing explanation video";
    iframe.src = embedUrl;
    iframe.loading = "lazy";
    iframe.allow = "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share";
    iframe.allowFullscreen = true;
    Object.assign(iframe.style, {
      position: "absolute",
      inset: "0",
      width: "100%",
      height: "100%",
      border: "0",
    });
    frameWrap.appendChild(iframe);
    card.appendChild(frameWrap);
  } else {
    const link = document.createElement("a");
    link.href = resource.url;
    link.target = "_blank";
    link.rel = "noreferrer";
    link.textContent = "Open writing video";
    Object.assign(link.style, {
      width: "fit-content",
      fontWeight: "800",
      color: "#1d4ed8",
    });
    card.appendChild(link);
  }

  return card;
};

const ensureWritingVideoCard = (root, day) => {
  const existing = root.querySelector(`[${WRITING_VIDEO_CARD_ATTRIBUTE}]`);
  const resource = getWritingVideoResource("B1", day);

  if (!resource) {
    existing?.remove();
    return { mounted: false, reason: "unmapped", day };
  }

  const writingSection = findWritingSection(root);
  if (!writingSection) {
    return { mounted: false, reason: "writing-section-not-mounted", day };
  }

  // The restored B1 React writing workspace owns its Schreiben video now.
  // The legacy DOM injector is kept only as a compatibility fallback for older
  // workbook layouts. If the React-owned card exists, remove any legacy card
  // and do not mount a second iframe.
  if (writingSection.querySelector(REACT_WRITING_VIDEO_SELECTOR)) {
    existing?.remove();
    return { mounted: true, reason: "react-owned", day, key: resource.key };
  }

  if (
    existing
    && writingSection.contains(existing)
    && existing.dataset.writingVideoKey === resource.key
  ) {
    return { mounted: true, reason: "already-mounted", day, key: resource.key };
  }

  existing?.remove();
  const card = createWritingVideoCard({
    resource,
    embedUrl: getYouTubeEmbedUrl(resource.url),
    day,
  });
  const anchor = findWritingInsertAnchor(writingSection);
  if (anchor) writingSection.insertBefore(card, anchor);
  else writingSection.appendChild(card);

  return { mounted: true, reason: "inserted", day, key: resource.key };
};

const templateButtonLabels = {
  "b1-opinion-text-template": "Insert Opinion Essay Template",
  "b1-formal-letter-template": "Insert Formal Letter Template",
  "b1-informal-letter-template": "Insert Informal Letter Template",
};

const templateToText = (template) => template.items
  .map((item) => `${item.phrase}:\n${item.meaning}`)
  .join("\n\n");

const insertTemplateIntoWritingBox = (section, template) => {
  const textareas = Array.from(section.querySelectorAll("textarea"));
  const textarea = textareas.at(-1);
  if (!textarea) return false;

  const templateText = templateToText(template);
  const currentText = String(textarea.value || "").trimEnd();
  const nextText = currentText ? `${currentText}\n\n${templateText}` : templateText;
  const valueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLTextAreaElement.prototype,
    "value",
  )?.set;
  valueSetter?.call(textarea, nextText);
  textarea.dispatchEvent(new Event("input", { bubbles: true }));
  textarea.focus();
  return true;
};

const createWritingCheatSheetCard = (section) => {
  const card = document.createElement("div");
  card.setAttribute(WRITING_CHEAT_SHEET_ATTRIBUTE, "true");
  Object.assign(card.style, {
    display: "grid",
    gap: "12px",
    border: "1px solid #bfdbfe",
    borderRadius: "16px",
    padding: "14px",
    background: "#eff6ff",
  });

  const heading = document.createElement("strong");
  heading.textContent = "B1 Writing Cheat Sheet";
  heading.style.color = "#1e3a8a";
  card.appendChild(heading);

  const description = document.createElement("p");
  description.textContent = "Use these connectors while writing, or insert the template that matches your task into the German text box.";
  Object.assign(description.style, { margin: "0", color: "#475569", lineHeight: "1.6" });
  card.appendChild(description);

  const sheets = getWritingCheatSheet("B1", 1);
  const quickList = document.createElement("div");
  quickList.textContent = sheets
    .filter((item) => ["b1-connectors", "b1-message-phrases"].includes(item.id))
    .flatMap((item) => item.items.map((entry) => entry.phrase))
    .join(" · ");
  Object.assign(quickList.style, { lineHeight: "1.7", color: "#1e3a8a" });
  card.appendChild(quickList);

  const controls = document.createElement("div");
  Object.assign(controls.style, { display: "flex", flexWrap: "wrap", gap: "8px" });
  sheets.filter((item) => templateButtonLabels[item.id]).forEach((template) => {
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = templateButtonLabels[template.id];
    Object.assign(button.style, {
      border: "1px solid #93c5fd",
      borderRadius: "999px",
      padding: "9px 12px",
      background: "#fff",
      color: "#1d4ed8",
      fontWeight: "800",
      cursor: "pointer",
    });
    button.addEventListener("click", () => insertTemplateIntoWritingBox(section, template));
    controls.appendChild(button);
  });
  card.appendChild(controls);
  return card;
};

const ensureWritingCheatSheet = (root) => {
  const existing = root.querySelector(`[${WRITING_CHEAT_SHEET_ATTRIBUTE}]`);
  const writingSection = findWritingSection(root);
  if (!writingSection) return { mounted: false, reason: "writing-section-not-mounted" };

  if (writingSection.querySelector(REACT_WRITING_CHEAT_SHEET_SELECTOR)) {
    existing?.remove();
    return { mounted: true, reason: "react-owned" };
  }
  if (existing && writingSection.contains(existing)) {
    return { mounted: true, reason: "already-mounted" };
  }

  existing?.remove();
  const card = createWritingCheatSheetCard(writingSection);
  const textBox = Array.from(writingSection.querySelectorAll("textarea")).at(-1);
  if (textBox) textBox.parentElement?.insertBefore(card, textBox);
  else writingSection.appendChild(card);
  return { mounted: true, reason: "inserted" };
};

export default function B1WorkbookWritingCheatSheetInjector() {
  const location = useLocation();

  useEffect(() => {
    if (!isB1WorkbookRoute(location.pathname, location.search)) return undefined;

    const root = document.getElementById("root") || document.body;
    const day = getB1WorkbookDay(location.pathname);
    let lastTabSnapshot = "";
    let lastVideoSnapshot = "";
    let lastCheatSheetSnapshot = "";

    const reportTabs = (reason) => {
      const snapshot = readTabs(root);
      const serialized = JSON.stringify(snapshot);
      if (reason !== "click" && serialized === lastTabSnapshot) return;
      lastTabSnapshot = serialized;
      courseDebug("b1Workbook:tabs", {
        reason,
        day,
        query: location.search,
        ...snapshot,
      });
    };

    const syncWritingVideo = (reason) => {
      const result = ensureWritingVideoCard(root, day);
      const serialized = JSON.stringify(result);
      if (reason !== "click" && serialized === lastVideoSnapshot) return;
      lastVideoSnapshot = serialized;
      courseDebug("b1Workbook:writingVideo", { reason, ...result });
    };

    const sync = (reason) => {
      reportTabs(reason);
      syncWritingVideo(reason);
      const cheatSheetResult = ensureWritingCheatSheet(root);
      const serialized = JSON.stringify(cheatSheetResult);
      if (reason === "click" || serialized !== lastCheatSheetSnapshot) {
        lastCheatSheetSnapshot = serialized;
        courseDebug("b1Workbook:writingCheatSheet", { reason, ...cheatSheetResult });
      }
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
      window.setTimeout(() => sync("click"), 0);
    };

    sync("mounted");
    document.addEventListener("click", handleClick, true);

    const observer = new MutationObserver(() => sync("react-update"));
    observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["aria-selected", "disabled"],
    });

    const timers = [300, 1000, 2500].map((delay) =>
      window.setTimeout(() => sync(`timer-${delay}`), delay)
    );

    return () => {
      document.removeEventListener("click", handleClick, true);
      observer.disconnect();
      timers.forEach((timer) => window.clearTimeout(timer));
      root.querySelector(`[${WRITING_VIDEO_CARD_ATTRIBUTE}]`)?.remove();
      root.querySelector(`[${WRITING_CHEAT_SHEET_ATTRIBUTE}]`)?.remove();
      courseDebug("b1Workbook:unmounted", { day });
    };
  }, [location.pathname, location.search]);

  return null;
}

export const __TESTING__ = {
  WRITING_VIDEO_CARD_ATTRIBUTE,
  WRITING_CHEAT_SHEET_ATTRIBUTE,
  REACT_WRITING_VIDEO_SELECTOR,
  createWritingVideoCard,
  ensureWritingVideoCard,
  ensureWritingCheatSheet,
  insertTemplateIntoWritingBox,
  findWritingInsertAnchor,
  findWritingSection,
  getB1WorkbookDay,
  isB1WorkbookRoute,
  readTabs,
};
