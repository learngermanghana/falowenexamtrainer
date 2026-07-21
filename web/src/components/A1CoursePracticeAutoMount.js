import React from "react";
import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { useLocation } from "react-router-dom";
import {
  isA1LetterWritingGrammarPath,
  normalizeA1CoursePracticePath,
  shouldAutoMountA1WritingPractice,
} from "../utils/a1CoursePracticeRoutes";
import { styles } from "../styles";
import A1ExamSpeakingPracticePanel from "./A1ExamSpeakingPracticePanel";
import A1SimpleMarkMyLetterPanel from "./A1SimpleMarkMyLetterPanel";
import SelfLearningSupportingMaterials from "./selfLearning/SelfLearningSupportingMaterials";

const A1_DAY_19_LESSON_PATH = "/campus/course/lesson/a1/19";
const A1_DAY_19_NAMED_PATH = "/campus/course/verboten-erlaubt-5-9";
const A1_DAY_19_AI_VIDEO_URL = "https://youtu.be/gprnEZtMUPM";
const A1_DAY_19_TEACHER_VIDEO_URL = "https://youtu.be/ZfXw4fRQ0Tg";
const A1_DAY_19_SUBMIT_URL = "/campus/submit?level=A1&assignmentKey=A1-5.9&assignmentId=A1-5.9";
const A1_DAY_12_TEACHER_VIDEO_URL = "https://youtu.be/qj7IsPqBnfE";

const getPageContainer = () => {
  const main = document.querySelector("main") || document.body;
  return main.querySelector("div[style*='display: grid']") || main.firstElementChild || main;
};

const isA1Day19LessonRoute = (location) => {
  const path = normalizeA1CoursePracticePath(location.pathname);
  const chapter = new URLSearchParams(location.search || "").get("chapter");
  return path === A1_DAY_19_LESSON_PATH && String(chapter || "").trim() === "5.9";
};

const isA1Day19NamedRoute = (location) =>
  normalizeA1CoursePracticePath(location.pathname) === A1_DAY_19_NAMED_PATH;

const getCanonicalLessonArticle = () => {
  const main = document.querySelector("main") || document.body;
  return Array.from(main.querySelectorAll("article")).find((article) => {
    const header = Array.from(article.children).find((child) => child.tagName === "HEADER");
    const headerText = String(header?.textContent || "");
    return Boolean(header && /\bA1\b/i.test(headerText) && /Day\s*19/i.test(headerText));
  });
};

const prepareSpeakingLessonPage = (container) => {
  container?.querySelector('[data-a1-speaking-ai-video="embedded"]')?.remove();
  document.querySelector('[data-a1-workbook-video-header="true"]')?.remove();

  const duplicateVideoLink = Array.from(container?.querySelectorAll?.("a") || []).find((link) =>
    String(link.getAttribute("href") || link.href || "").includes("gprnEZtMUPM"),
  );
  duplicateVideoLink?.closest("article")?.remove();
};

const prepareLetterGrammarPage = () => {
  const teacherVideoLink = Array.from(document.querySelectorAll("a")).find((link) => {
    const href = String(link.getAttribute("href") || link.href || "");
    const label = String(link.textContent || "").trim();
    return href.includes("youtu.be/") && /video öffnen/i.test(label);
  });

  if (teacherVideoLink) teacherVideoLink.setAttribute("href", A1_DAY_12_TEACHER_VIDEO_URL);
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
  const finalSubmissionSection = findSectionByHeading(document, "Next step");

  if (finalSubmissionSection?.parentNode) {
    finalSubmissionSection.parentNode.insertBefore(mount, finalSubmissionSection);
    return;
  }

  container.appendChild(mount);
};

const Day19SelfLearningSupport = () => (
  <div
    data-a1-day19-self-learning-support="true"
    data-radio-first-workbook-gate="true"
    style={{ display: "grid", gap: 12 }}
  >
    <SelfLearningSupportingMaterials
      teacherVideo={{
        url: A1_DAY_19_TEACHER_VIDEO_URL,
        title: "Goethe A1 Speaking Confidence Lab · Teacher lecture",
        description: "Recorded teacher explanation for the Day 19 speaking lesson.",
      }}
      aiVideo={{
        url: A1_DAY_19_AI_VIDEO_URL,
        title: "Goethe A1 Speaking Practice · AI video",
        description: "AI-supported exam practice for Teil 1, Teil 2 and Teil 3.",
      }}
      description="Use the same supporting-materials layout as tutor-marked workbooks. Open the videos first, then complete the self-learning activities below."
    />

    <section
      data-a1-day19-submission-entry="true"
      style={{
        ...styles.card,
        border: "1px solid #bfdbfe",
        background: "linear-gradient(135deg, #eff6ff, #ffffff)",
        display: "grid",
        gap: 9,
      }}
    >
      <span style={{ ...styles.badge, width: "fit-content", background: "#dbeafe", color: "#1d4ed8" }}>
        Final submission
      </span>
      <h2 style={{ margin: 0 }}>Submit your Day 19 speaking assignment</h2>
      <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
        Complete the speaking practice, then submit your final written transcript or final answers for tutor review.
      </p>
      <a href={A1_DAY_19_SUBMIT_URL} style={{ ...styles.primaryButton, textDecoration: "none", width: "fit-content" }}>
        Open Submit assignment
      </a>
    </section>
  </div>
);

const A1CoursePracticeAutoMount = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const pathname = normalizeA1CoursePracticePath(location.pathname);
    const isCanonicalLessonPage = isA1Day19LessonRoute(location);
    const isNamedDay19Page = isA1Day19NamedRoute(location);
    const isWritingPage = shouldAutoMountA1WritingPractice(pathname);
    const isLetterGrammarPage = isA1LetterWritingGrammarPath(pathname);

    if (!isCanonicalLessonPage && !isNamedDay19Page && !isWritingPage && !isLetterGrammarPage) return undefined;

    document.getElementById("falowen-a1-practice-mount")?.remove();

    if (isLetterGrammarPage) {
      prepareLetterGrammarPage();
      return undefined;
    }

    const container =
      (isCanonicalLessonPage ? getCanonicalLessonArticle() : null) || getPageContainer();

    if (isCanonicalLessonPage || isNamedDay19Page) prepareSpeakingLessonPage(container);

    const mount = document.createElement("div");
    mount.id = "falowen-a1-practice-mount";
    mount.style.margin = "16px 0";

    if (isCanonicalLessonPage || isNamedDay19Page) insertSpeakingMount(container, mount);
    else insertWritingMount(container, mount);

    const root = createRoot(mount);
    root.render(
      isNamedDay19Page ? (
        <Day19SelfLearningSupport />
      ) : isCanonicalLessonPage ? (
        <A1ExamSpeakingPracticePanel />
      ) : (
        <A1SimpleMarkMyLetterPanel />
      ),
    );

    const observer = isNamedDay19Page
      ? new MutationObserver(() => prepareSpeakingLessonPage(container))
      : null;
    observer?.observe(container, { childList: true, subtree: true });

    return () => {
      observer?.disconnect();
      root.unmount();
      mount.remove();
    };
  }, [location.pathname, location.search]);

  return null;
};

export default A1CoursePracticeAutoMount;
