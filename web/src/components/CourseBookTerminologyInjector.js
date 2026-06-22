import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const DAY16_WORKBOOK_PATH = "/campus/course/a1-day-16-food-and-negation-kapitel-10-workbook";
const DAY17_LESSON_PATH = "/campus/course/lesson/A1/17";
const DAY17_WORKBOOK_PATH = "/campus/course/a1-day-17-instructions-and-directions-kapitel-11-workbook";
const DAY16_HOREN_VIDEO_ID = "Q5oOWNvZ8X4";
const OLD_DAY17_WORKBOOK_DRIVE_ID = "17FNSfHBxyga9sKxzicT_qkP7PA4vB5-A";

const normalizePath = (value = "") => String(value || "").replace(/\/+$/, "");

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
