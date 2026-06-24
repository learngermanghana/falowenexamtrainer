import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { useLocation } from "react-router-dom";
import A1ExamSpeakingPracticePanel from "./A1ExamSpeakingPracticePanel";
import A1SimpleMarkMyLetterPanel from "./A1SimpleMarkMyLetterPanel";
import LessonDiscussionPanel from "./LessonDiscussionPanel";

const SPEAKING_PATHS = new Set(["/campus/course/verboten-erlaubt-5-9"]);

const WRITING_PATHS = new Set([
  "/campus/course/letter-writing-intro-12-3",
  "/campus/course/letter-writing-intro-german-a1-day-12-3",
  "/campus/course/a1-day-21-weather-workbook",
  "/campus/course/a1-day-22-health-and-body-parts-workbook",
]);

const DISCUSSION_CONFIG_BY_PATH = {
  "/campus/course/a1-day-3-schreiben-sprechen-kapitel-1-1-workbook": {
    lessonId: "A1-DAY-3-SCHREIBEN-SPRECHEN-KAPITEL-1-1",
    lessonLabel: "A1 · Day 3: Schreiben und Sprechen · Kapitel 1.1",
    title: "Introduce yourself to your class",
    instructions:
      "Write four complete German sentences. Include your name, country, age, and city. Read your classmates’ introductions and respond respectfully.",
    question:
      "Stell dich deiner Klasse vor. Wie heißt du, woher kommst du, wie alt bist du und wo wohnst du?",
    example: "Ich heiße Ama. Ich komme aus Ghana. Ich bin 24 Jahre alt. Ich wohne in Accra.",
  },
};

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
    const discussionConfig = DISCUSSION_CONFIG_BY_PATH[location.pathname];

    if (!isSpeakingPage && !isWritingPage && !discussionConfig) return undefined;

    document.getElementById("falowen-a1-practice-mount")?.remove();

    const container = getPageContainer();
    if (isSpeakingPage) prepareSpeakingLessonPage(container);

    const mount = document.createElement("div");
    mount.id = "falowen-a1-practice-mount";
    mount.style.margin = "16px 0";

    let hiddenDiscussionSection = null;

    if (discussionConfig) {
      const discussionLink = container.querySelector('a[href*="/campus/discussion"]');
      hiddenDiscussionSection = discussionLink?.closest("section") || null;

      if (hiddenDiscussionSection) {
        hiddenDiscussionSection.style.display = "none";
        hiddenDiscussionSection.insertAdjacentElement("afterend", mount);
      } else {
        container.appendChild(mount);
      }
    } else if (isSpeakingPage && container.firstElementChild?.nextSibling) {
      container.insertBefore(mount, container.firstElementChild.nextSibling);
    } else {
      container.appendChild(mount);
    }

    const root = createRoot(mount);

    if (discussionConfig) {
      root.render(<LessonDiscussionPanel {...discussionConfig} />);
    } else {
      root.render(isSpeakingPage ? <A1ExamSpeakingPracticePanel /> : <A1SimpleMarkMyLetterPanel />);
    }

    return () => {
      root.unmount();
      mount.remove();
      if (hiddenDiscussionSection) hiddenDiscussionSection.style.display = "";
    };
  }, [location.pathname]);

  return null;
};

export default A1CoursePracticeAutoMount;
