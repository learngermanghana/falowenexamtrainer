import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const DAY16_WORKBOOK_PATH = "/campus/course/a1-day-16-food-and-negation-kapitel-10-workbook";
const DAY17_LESSON_PATH = "/campus/course/lesson/A1/17";
const DAY17_WORKBOOK_PATH = "/campus/course/a1-day-17-instructions-and-directions-kapitel-11-workbook";
const DAY16_HOREN_VIDEO_ID = "Q5oOWNvZ8X4";
const OLD_DAY17_WORKBOOK_DRIVE_ID = "17FNSfHBxyga9sKxzicT_qkP7PA4vB5-A";
const WORKBOOK_NAV_SELECTOR = '[aria-label="Workbook assignment navigation"]';
const OFFICIAL_SUBMIT_ATTRIBUTE = "data-falowen-workbook-submit-tab";
const SYNTHETIC_SUBMIT_ATTRIBUTE = "data-falowen-workbook-submit-proxy";
const BACK_TO_WORKBOOK_ATTRIBUTE = "data-falowen-back-to-workbook";

const normalizePath = (value = "") => String(value || "").replace(/\/+$/, "");
const normalizeText = (value = "") => String(value || "").replace(/\s+/g, " ").trim().toLowerCase();

const getWorkbookTabKey = (label = "") => {
  const normalized = normalizeText(label);
  if (/teil\s*1\b/.test(normalized)) return "teil1";
  if (/teil\s*2\b/.test(normalized)) return "teil2";
  if (/teil\s*3\b/.test(normalized)) return "teil3";
  if (/teil\s*4\b/.test(normalized)) return "teil4";
  if (/\bref\b/.test(normalized) || /reference/.test(normalized)) return "ref";
  if (normalized === "submit") return "submit";
  return "";
};

const findNativeWorkbookTabRow = (root, injectedNavigation) => {
  const counts = new Map();

  root.querySelectorAll("button").forEach((button) => {
    if (!getWorkbookTabKey(button.textContent)) return;
    if (injectedNavigation?.contains(button)) return;
    const parent = button.parentElement;
    if (!parent) return;
    const keys = counts.get(parent) || new Set();
    keys.add(getWorkbookTabKey(button.textContent));
    counts.set(parent, keys);
  });

  return [...counts.entries()]
    .sort((left, right) => right[1].size - left[1].size)
    .find(([, keys]) => keys.size >= 4)?.[0] || null;
};

const copyButtonAppearance = (source, target) => {
  if (source?.style?.cssText) target.style.cssText = source.style.cssText;
  Object.assign(target.style, {
    flex: "0 0 auto",
    fontWeight: "800",
  });
};

const applyWorkbookTabDeduplication = (root = document) => {
  if (!root?.querySelectorAll || typeof window === "undefined") return;
  const pathname = normalizePath(window.location.pathname);
  if (!/^\/campus\/course\/(a2|b1)-day-.*-workbook$/i.test(pathname)) return;

  const injectedNavigation = root.querySelector(WORKBOOK_NAV_SELECTOR);
  if (!injectedNavigation) return;

  const nativeRow = findNativeWorkbookTabRow(root, injectedNavigation);
  if (!nativeRow) return;

  const fallbackButtons = Array.from(injectedNavigation.querySelectorAll("button"));
  const fallbackSubmit = fallbackButtons.find((button) => getWorkbookTabKey(button.textContent) === "submit");
  const fallbackFirstTab = fallbackButtons.find((button) => getWorkbookTabKey(button.textContent) === "teil1");

  const officialSubmitButtons = Array.from(
    nativeRow.querySelectorAll(`[${OFFICIAL_SUBMIT_ATTRIBUTE}]`)
  );
  officialSubmitButtons.slice(1).forEach((button) => button.remove());

  const syntheticSubmitButtons = Array.from(
    nativeRow.querySelectorAll(`[${SYNTHETIC_SUBMIT_ATTRIBUTE}]`)
  );

  if (officialSubmitButtons.length) {
    syntheticSubmitButtons.forEach((button) => button.remove());
  } else if (!syntheticSubmitButtons.length && fallbackSubmit) {
    const submitProxy = document.createElement("button");
    submitProxy.type = "button";
    submitProxy.textContent = "Submit";
    submitProxy.setAttribute(SYNTHETIC_SUBMIT_ATTRIBUTE, "true");
    submitProxy.setAttribute("aria-label", "Submit workbook assignment");
    copyButtonAppearance(fallbackSubmit, submitProxy);
    submitProxy.addEventListener("click", () => fallbackSubmit.click());
    nativeRow.appendChild(submitProxy);
  }

  const navigationHeader = injectedNavigation.firstElementChild;
  if (navigationHeader) navigationHeader.style.display = "none";

  const submissionPanel = Array.from(injectedNavigation.children).slice(1)[0] || null;
  if (!submissionPanel) {
    injectedNavigation.style.display = "none";
    return;
  }

  injectedNavigation.style.display = "grid";
  injectedNavigation.style.margin = "0";
  injectedNavigation.style.padding = "0";
  injectedNavigation.style.border = "0";
  injectedNavigation.style.background = "transparent";

  if (!submissionPanel.querySelector(`[${BACK_TO_WORKBOOK_ATTRIBUTE}]`)) {
    const backButton = document.createElement("button");
    backButton.type = "button";
    backButton.textContent = "← Back to workbook";
    backButton.setAttribute(BACK_TO_WORKBOOK_ATTRIBUTE, "true");
    Object.assign(backButton.style, {
      border: "1px solid #93c5fd",
      borderRadius: "999px",
      background: "#ffffff",
      color: "#1d4ed8",
      cursor: "pointer",
      fontWeight: "800",
      margin: "0 0 8px",
      padding: "8px 12px",
      width: "fit-content",
    });
    backButton.addEventListener("click", () => {
      fallbackFirstTab?.click();
      window.setTimeout(() => {
        const nativeFirstTab = Array.from(nativeRow.querySelectorAll("button")).find(
          (button) => getWorkbookTabKey(button.textContent) === "teil1"
        );
        nativeFirstTab?.click();
      }, 30);
    });
    submissionPanel.insertBefore(backButton, submissionPanel.firstChild);
  }
};

const applyA1ResourceFixes = (root = document) => {
  if (!root?.querySelectorAll || typeof window === "undefined") return;
  const pathname = normalizePath(window.location.pathname);

  if (pathname === DAY16_WORKBOOK_PATH) {
    root.querySelectorAll("iframe").forEach((frame) => {
      const title = String(frame.getAttribute("title") || "").toLowerCase();
      const src = String(frame.getAttribute("src") || "");
      if (!title.includes("hören") && !src.includes("8xybaJbs89I")) return;
      frame.setAttribute("src", `https://www.youtube.com/embed/${DAY16_HOREN_VIDEO_ID}`);
      frame.setAttribute("title", "A1 Day 16 Hören: Einkaufen im Supermarkt");
    });

    root.querySelectorAll("a").forEach((link) => {
      const text = String(link.textContent || "").trim().toLowerCase();
      const href = String(link.getAttribute("href") || "");
      if (text !== "open hören video on youtube" && !href.includes("8xybaJbs89I")) return;
      link.setAttribute("href", `https://youtu.be/${DAY16_HOREN_VIDEO_ID}`);
    });
  }

  if (pathname === DAY17_LESSON_PATH) {
    root.querySelectorAll("a").forEach((link) => {
      const href = String(link.getAttribute("href") || "");
      const text = String(link.textContent || "").trim().toLowerCase();
      const cardText = String(link.closest("article")?.textContent || "");
      const isOldDriveWorkbook = href.includes(OLD_DAY17_WORKBOOK_DRIVE_ID);
      const isChapter11WorkbookAction = text.includes("open workbook") && cardText.includes("Kapitel 11");
      if (!isOldDriveWorkbook && !isChapter11WorkbookAction) return;
      link.setAttribute("href", DAY17_WORKBOOK_PATH);
      link.removeAttribute("target");
      link.removeAttribute("rel");
    });
  }
};

export const replaceCourseBookTerminology = (root = document) => {
  if (!root?.querySelectorAll) return 0;

  let replacements = 0;
  root.querySelectorAll("span").forEach((element) => {
    if (element.textContent?.trim() !== "Tutor-marked") return;
    element.textContent = "Tutor Marked Assignment";
    replacements += 1;
  });
  applyA1ResourceFixes(root);
  applyWorkbookTabDeduplication(root);

  return replacements;
};

export default function CourseBookTerminologyInjector() {
  const location = useLocation();

  useEffect(() => {
    replaceCourseBookTerminology(document);

    const observer = new MutationObserver(() => {
      replaceCourseBookTerminology(document);
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["href", "src"],
    });
    return () => observer.disconnect();
  }, [location.pathname, location.search]);

  return null;
}
