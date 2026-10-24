import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const DAY16_WORKBOOK_PATH = "/campus/course/a1-day-16-food-and-negation-kapitel-10-workbook";
const DAY17_LESSON_PATH = "/campus/course/lesson/A1/17";
const DAY17_WORKBOOK_PATH = "/campus/course/a1-day-17-instructions-and-directions-kapitel-11-workbook";
const DAY16_HOREN_VIDEO_ID = "Q5oOWNvZ8X4";
const OLD_DAY17_WORKBOOK_DRIVE_ID = "17FNSfHBxyga9sKxzicT_qkP7PA4vB5-A";

const normalizePath = (value = "") => String(value || "").replace(/\/+$/, "");

const updateDay16ListeningVideo = () => {
  if (normalizePath(window.location.pathname) !== DAY16_WORKBOOK_PATH) return;

  Array.from(document.querySelectorAll("iframe")).forEach((frame) => {
    const title = String(frame.getAttribute("title") || "").toLowerCase();
    const src = String(frame.getAttribute("src") || "");
    if (!title.includes("hören") && !src.includes("8xybaJbs89I")) return;

    const nextSrc = `https://www.youtube.com/embed/${DAY16_HOREN_VIDEO_ID}`;
    if (frame.getAttribute("src") !== nextSrc) frame.setAttribute("src", nextSrc);
    frame.setAttribute("title", "A1 Day 16 Hören: Einkaufen im Supermarkt");
  });

  Array.from(document.querySelectorAll("a")).forEach((link) => {
    const text = String(link.textContent || "").trim().toLowerCase();
    const href = String(link.getAttribute("href") || "");
    if (text !== "open hören video on youtube" && !href.includes("8xybaJbs89I")) return;
    link.setAttribute("href", `https://youtu.be/${DAY16_HOREN_VIDEO_ID}`);
  });
};

const updateDay17WorkbookLink = () => {
  if (normalizePath(window.location.pathname) !== DAY17_LESSON_PATH) return;

  Array.from(document.querySelectorAll("a")).forEach((link) => {
    const href = String(link.getAttribute("href") || "");
    const text = String(link.textContent || "").trim().toLowerCase();
    const isOldDriveWorkbook = href.includes(OLD_DAY17_WORKBOOK_DRIVE_ID);
    const isChapter11WorkbookAction = text.includes("open workbook") &&
      String(link.closest("article")?.textContent || "").includes("Kapitel 11");

    if (!isOldDriveWorkbook && !isChapter11WorkbookAction) return;

    link.setAttribute("href", DAY17_WORKBOOK_PATH);
    link.removeAttribute("target");
    link.removeAttribute("rel");
  });
};

const applyA1LessonResourceFixes = () => {
  if (typeof document === "undefined" || typeof window === "undefined") return;
  updateDay16ListeningVideo();
  updateDay17WorkbookLink();
};

export const __TESTING__ = {
  applyA1LessonResourceFixes,
  updateDay16ListeningVideo,
  updateDay17WorkbookLink,
};

const A1LessonResourceFixesInjector = () => {
  const location = useLocation();

  useEffect(() => {
    let timeoutId = null;
    const scheduleUpdate = () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      timeoutId = window.setTimeout(applyA1LessonResourceFixes, 80);
    };

    scheduleUpdate();
    const observer = new MutationObserver(scheduleUpdate);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true,
      attributes: true,
      attributeFilter: ["href", "src"],
    });

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId);
      observer.disconnect();
    };
  }, [location.pathname, location.search]);

  return null;
};

export default A1LessonResourceFixesInjector;
