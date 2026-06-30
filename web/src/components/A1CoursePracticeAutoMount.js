import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { useLocation } from "react-router-dom";
import A1ExamSpeakingPracticePanel from "./A1ExamSpeakingPracticePanel";
import A1SimpleMarkMyLetterPanel from "./A1SimpleMarkMyLetterPanel";

const A1_DAY_19_LESSON_PATH = "/campus/course/lesson/a1/19";
const A1_DAY_19_VIDEO_ID = "gprnEZtMUPM";

const WRITING_PATHS = new Set([
  "/campus/course/letter-writing-intro-12-3",
  "/campus/course/letter-writing-intro-german-a1-day-12-3",
  "/campus/course/a1-day-21-weather-workbook",
  "/campus/course/a1-day-22-health-and-body-parts-workbook",
]);

const normalizePath = (pathname = "") =>
  String(pathname || "")
    .toLowerCase()
    .replace(/\/+$/, "") || "/";

const getPageContainer = () => {
  const main = document.querySelector("main") || document.body;
  return main.querySelector("div[style*='display: grid']") || main.firstElementChild || main;
};

const isA1Day19LessonRoute = (location) => {
  const path = normalizePath(location.pathname);
  const chapter = new URLSearchParams(location.search || "").get("chapter");
  return path === A1_DAY_19_LESSON_PATH && String(chapter || "").trim() === "5.9";
};

const getCanonicalLessonArticle = () => {
  const main = document.querySelector("main") || document.body;
  return Array.from(main.querySelectorAll("article")).find((article) => {
    const header = Array.from(article.children).find((child) => child.tagName === "HEADER");
    const headerText = String(header?.textContent || "");
    return Boolean(header && /\bA1\b/i.test(headerText) && /Day\s*19/i.test(headerText));
  });
};

const prepareSpeakingLessonPage = (container) => {
  const duplicateVideoLink = Array.from(container.querySelectorAll("a")).find((link) =>
    String(link.getAttribute("href") || link.href || "").includes(A1_DAY_19_VIDEO_ID),
  );
  duplicateVideoLink?.closest("article")?.remove();
};

const insertSpeakingMount = (container, mount) => {
  if (container?.tagName === "ARTICLE") {
    const header = Array.from(container.children).find((child) => child.tagName === "HEADER");
    if (header) {
      container.insertBefore(mount, header.nextSibling);
      return;
    }
  }

  if (container.firstElementChild?.nextSibling) {
    container.insertBefore(mount, container.firstElementChild.nextSibling);
  } else {
    container.appendChild(mount);
  }
};

const findSectionByHeading = (container, headingText) =>
  Array.from(container.querySelectorAll("section")).find((section) => {
    const heading = section.querySelector("h2");
    return String(heading?.textContent || "").trim().toLowerCase() === headingText.toLowerCase();
  });

const insertWritingMount = (container, mount) => {
  const finalSubmissionSection = findSectionByHeading(container, "Next step");

  if (finalSubmissionSection?.parentNode) {
    finalSubmissionSection.parentNode.insertBefore(mount, finalSubmissionSection);
    return;
  }

  container.appendChild(mount);
};

const A1CoursePracticeAutoMount = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const pathname = normalizePath(location.pathname);
    const isCanonicalLessonPage = isA1Day19LessonRoute(location);
    const isWritingPage = WRITING_PATHS.has(pathname);
    if (!isCanonicalLessonPage && !isWritingPage) return undefined;

    document.getElementById("falowen-a1-practice-mount")?.remove();

    const container =
      (isCanonicalLessonPage ? getCanonicalLessonArticle() : null) || getPageContainer();
    if (isCanonicalLessonPage) prepareSpeakingLessonPage(container);

    const mount = document.createElement("div");
    mount.id = "falowen-a1-practice-mount";
    mount.style.margin = "16px 0";

    if (isCanonicalLessonPage) {
      insertSpeakingMount(container, mount);
    } else {
      insertWritingMount(container, mount);
    }

    const root = createRoot(mount);
    root.render(
      isCanonicalLessonPage ? <A1ExamSpeakingPracticePanel /> : <A1SimpleMarkMyLetterPanel />,
    );

    return () => {
      root.unmount();
      mount.remove();
    };
  }, [location.pathname, location.search]);

  return null;
};

export default A1CoursePracticeAutoMount;
