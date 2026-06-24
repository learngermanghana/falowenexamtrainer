import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { useLocation } from "react-router-dom";
import A1ExamSpeakingPracticePanel from "./A1ExamSpeakingPracticePanel";
import A1SimpleMarkMyLetterPanel from "./A1SimpleMarkMyLetterPanel";

const SPEAKING_PATHS = new Set(["/campus/course/verboten-erlaubt-5-9"]);

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

const A1CoursePracticeAutoMount = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const isSpeakingPage = SPEAKING_PATHS.has(location.pathname);
    const isWritingPage = WRITING_PATHS.has(location.pathname);
    if (!isSpeakingPage && !isWritingPage) return undefined;

    document.getElementById("falowen-a1-practice-mount")?.remove();

    const container = getPageContainer();
    if (isSpeakingPage) prepareSpeakingLessonPage(container);

    const mount = document.createElement("div");
    mount.id = "falowen-a1-practice-mount";
    mount.style.margin = "16px 0";

    if (isSpeakingPage && container.firstElementChild?.nextSibling) {
      container.insertBefore(mount, container.firstElementChild.nextSibling);
    } else {
      container.appendChild(mount);
    }

    const root = createRoot(mount);
    root.render(isSpeakingPage ? <A1ExamSpeakingPracticePanel /> : <A1SimpleMarkMyLetterPanel />);

    return () => {
      root.unmount();
      mount.remove();
    };
  }, [location.pathname]);

  return null;
};

export default A1CoursePracticeAutoMount;
