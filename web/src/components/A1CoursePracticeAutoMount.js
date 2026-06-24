import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { useLocation } from "react-router-dom";
import A1ExamSpeakingPracticePanel from "./A1ExamSpeakingPracticePanel";
import A1SimpleMarkMyLetterPanel from "./A1SimpleMarkMyLetterPanel";

const SPEAKING_PATHS = new Set(["/campus/course/verboten-erlaubt-5-9"]);
const A1_DAY_19_LESSON_PATH = "/campus/course/lesson/a1/19";
const A1_DAY_19_VIDEO_ID = "gprnEZtMUPM";

const WRITING_PATHS = new Set([
  "/campus/course/letter-writing-intro-12-3",
  "/campus/course/letter-writing-intro-german-a1-day-12-3",
  "/campus/course/a1-day-21-weather-workbook",
  "/campus/course/a1-day-22-health-and-body-parts-workbook",
]);

const getPageContainer = () => {
  const main = document.querySelector("main") || document.body;
  return main.querySelector("div[style*='display: grid']") || main.firstElementChild || main;
};

const isA1Day19LessonRoute = (location) => {
  const path = String(location.pathname || "").toLowerCase();
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

const replaceExactText = (root, selector, currentText, nextText) => {
  Array.from(root.querySelectorAll(selector)).forEach((node) => {
    if (String(node.textContent || "").trim() === currentText) {
      node.textContent = nextText;
    }
  });
};

const prepareSpeakingLessonPage = (container) => {
  const timerHeading = Array.from(container.querySelectorAll("h2")).find(
    (heading) => String(heading.textContent || "").trim() === "Confidence Timer",
  );
  timerHeading?.closest("section")?.remove();

  const duplicateVideoLink = Array.from(container.querySelectorAll("a")).find((link) =>
    String(link.getAttribute("href") || link.href || "").includes(A1_DAY_19_VIDEO_ID),
  );
  duplicateVideoLink?.closest("article")?.remove();

  replaceExactText(container, "strong", "Timed Practice", "Exam Practice");
  replaceExactText(container, "p", "30s / 60s / 90s", "practise directly here");
  replaceExactText(container, "strong", "Real Exam Mode", "Full Exams Room");
  replaceExactText(container, "p", "open Falowen", "available anytime");

  Array.from(container.querySelectorAll("p")).forEach((paragraph) => {
    const text = String(paragraph.textContent || "").trim();
    if (
      text ===
      "Train with random speaking prompts, build confidence with a timed speaking drill, and move straight into Falowen real speaking practice."
    ) {
      paragraph.textContent =
        "Watch the AI speaking lesson, revise the exam language, and practise the full Goethe A1 speaking flow directly on this page.";
    }
  });
};

const insertSpeakingMount = (container, mount, isCanonicalLessonPage) => {
  if (isCanonicalLessonPage && container?.tagName === "ARTICLE") {
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

const A1CoursePracticeAutoMount = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const isCanonicalLessonPage = isA1Day19LessonRoute(location);
    const isSpeakingPage = SPEAKING_PATHS.has(location.pathname) || isCanonicalLessonPage;
    const isWritingPage = WRITING_PATHS.has(location.pathname);
    if (!isSpeakingPage && !isWritingPage) return undefined;

    document.getElementById("falowen-a1-practice-mount")?.remove();

    const container =
      (isCanonicalLessonPage ? getCanonicalLessonArticle() : null) || getPageContainer();
    if (isSpeakingPage) prepareSpeakingLessonPage(container);

    const mount = document.createElement("div");
    mount.id = "falowen-a1-practice-mount";
    mount.style.margin = "16px 0";

    if (isSpeakingPage) {
      insertSpeakingMount(container, mount, isCanonicalLessonPage);
    } else {
      container.appendChild(mount);
    }

    const root = createRoot(mount);
    root.render(isSpeakingPage ? <A1ExamSpeakingPracticePanel /> : <A1SimpleMarkMyLetterPanel />);

    return () => {
      root.unmount();
      mount.remove();
    };
  }, [location.pathname, location.search]);

  return null;
};

export default A1CoursePracticeAutoMount;
