import React, { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { useLocation } from "react-router-dom";
import {
  isA1LetterWritingGrammarPath,
  normalizeA1CoursePracticePath,
  shouldAutoMountA1WritingPractice,
} from "../utils/a1CoursePracticeRoutes";
import A1SimpleMarkMyLetterPanel from "./A1SimpleMarkMyLetterPanel";
import SelfLearningJourneyGate from "./selfLearning/SelfLearningJourneyGate";
import { isTeacherLectureResource } from "./selfLearning/TeacherLectureSupportingMaterials";
import { getA1RadioResource } from "../data/a1RadioResources";
import {
  A1_CANONICAL_LESSON_CATALOG,
  getA1CanonicalLessonForLegacyRoute,
} from "../data/a1CanonicalLessonCatalog";
import { courseSchedules } from "../data/courseSchedule";
import { normalizeLesson } from "../data/lessonModel";

const A1_DAY_19_AI_VIDEO_URL = "https://youtu.be/gprnEZtMUPM";
const A1_DAY_19_TEACHER_VIDEO_URL = "https://youtu.be/ZfXw4fRQ0Tg";
const A1_DAY_12_TEACHER_VIDEO_URL = "https://youtu.be/qj7IsPqBnfE";
const A1_SELF_LEARNING_PRACTICES = A1_CANONICAL_LESSON_CATALOG.filter(
  (lesson) => lesson.kind === "practice",
);

const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);
const normalizeChapter = (value = "") => String(value || "").trim().toLowerCase();
const routePath = (value = "") => normalizeA1CoursePracticePath(String(value || "").split(/[?#]/)[0]);

const getPageContainer = () => {
  const main = document.querySelector("main") || document.body;
  return main.querySelector("div[style*='display: grid']") || main.firstElementChild || main;
};

const getCanonicalLessonArticle = (day) => {
  const main = document.querySelector("main") || document.body;
  return Array.from(main.querySelectorAll("article")).find((article) => {
    const header = Array.from(article.children).find((child) => child.tagName === "HEADER");
    const headerText = String(header?.textContent || "");
    return Boolean(header && /\bA1\b/i.test(headerText) && new RegExp(`Day\\s*${Number(day)}`, "i").test(headerText));
  });
};

export const getA1SelfLearningPracticeForLocation = (location = {}) => {
  const pathname = routePath(location.pathname);
  const direct = A1_SELF_LEARNING_PRACTICES.find((lesson) =>
    [lesson.destination, lesson.lessonRoute, lesson.shortLessonRoute]
      .filter(Boolean)
      .some((candidate) => routePath(candidate) === pathname),
  );
  if (direct) return direct;

  const legacy = pathname.match(/^\/campus\/course\/lesson\/a1\/(\d+)$/i);
  if (!legacy) return null;
  const chapter = new URLSearchParams(location.search || "").get("chapter") || "";
  const lesson = getA1CanonicalLessonForLegacyRoute({
    day: Number(legacy[1]),
    identity: chapter,
  });
  return lesson?.kind === "practice" ? lesson : null;
};

const resourceMatchesPractice = (resource = {}, practice = {}) => {
  const resourceChapter = normalizeChapter(resource.chapter || resource.displayChapter);
  if (resourceChapter && resourceChapter === normalizeChapter(practice.chapter)) return true;
  const workbook = routePath(resource.workbook_link || resource.workbookRoute || "");
  return Boolean(workbook && workbook === routePath(practice.destination));
};

const scopeA1PracticeLesson = (practice) => {
  const rawLesson = (courseSchedules.A1 || []).find(
    (lesson) => Number(lesson?.day || lesson?.assignmentDay) === Number(practice.day),
  );
  if (!rawLesson) {
    return {
      level: "A1",
      day: practice.day,
      chapter: practice.chapter,
      topic: practice.title,
      assignment: false,
      progressionEligible: false,
    };
  }

  const schreiben = toArray(rawLesson.schreiben_sprechen);
  const lesen = toArray(rawLesson.lesen_hören);
  const matchingSchreiben = schreiben.find((resource) => resourceMatchesPractice(resource, practice));
  const matchingLesen = lesen.find((resource) => resourceMatchesPractice(resource, practice));

  return {
    ...rawLesson,
    level: "A1",
    day: Number(practice.day),
    chapter: practice.chapter,
    topic: practice.title,
    title: practice.title,
    assignment: false,
    tutorMarked: false,
    selfPractice: true,
    submissionRequired: false,
    progressionEligible: false,
    schreiben_sprechen: matchingSchreiben || null,
    lesen_hören: matchingLesen || null,
  };
};

export const getA1SelfLearningJourneyResources = (practice) => {
  const normalized = normalizeLesson(scopeA1PracticeLesson(practice), "A1");
  const videos = normalized?.resources?.videos || [];
  const teacherVideo = videos.find(isTeacherLectureResource)
    || (Number(practice.day) === 19
      ? {
          url: A1_DAY_19_TEACHER_VIDEO_URL,
          title: "Goethe A1 Speaking Confidence Lab · Teacher lecture",
          description: "Recorded teacher explanation for the Day 19 speaking lesson.",
        }
      : null);
  const aiVideo = videos.find((video) => !isTeacherLectureResource(video))
    || (Number(practice.day) === 19
      ? {
          url: A1_DAY_19_AI_VIDEO_URL,
          title: "Goethe A1 Speaking Practice · AI video",
          description: "AI-supported exam practice for Teil 1, Teil 2 and Teil 3.",
        }
      : null);
  const grammarBook = normalized?.resources?.grammarBook
    || normalized?.resources?.resourceGroups?.find((group) => group?.grammarBook?.url)?.grammarBook
    || null;

  return {
    radio: getA1RadioResource(practice.day, practice.chapter),
    teacherVideo,
    aiVideo,
    grammarBook,
  };
};

const prepareDay19Page = (container) => {
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

const insertPracticeMount = (container, mount) => {
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

const hideSelfLearningContent = (container, mount) => {
  const hidden = Array.from(container?.children || [])
    .filter((child) => child !== mount)
    .map((child) => ({ child, display: child.style.display }));

  hidden.forEach(({ child }) => {
    child.dataset.selfLearningJourneyHidden = "true";
    child.style.display = "none";
  });

  let restored = false;
  return () => {
    if (restored) return;
    restored = true;
    hidden.forEach(({ child, display }) => {
      delete child.dataset.selfLearningJourneyHidden;
      child.style.display = display;
    });
  };
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

const A1PracticeLearningContent = ({ onEnter }) => {
  useEffect(() => {
    onEnter?.();
  }, [onEnter]);
  return null;
};

const mergeJourneyStateIntoDestination = (destination, nextLocation) => {
  const parsed = new URL(destination, "https://www.falowen.app");
  const params = new URLSearchParams(nextLocation?.search || "");
  params.forEach((value, key) => parsed.searchParams.set(key, value));
  parsed.searchParams.set("materials", "done");
  return `${parsed.pathname}${parsed.search}${parsed.hash}`;
};

const A1SelfLearningJourney = ({ practice, onEnter, onOpenWorkbook }) => {
  const resources = getA1SelfLearningJourneyResources(practice);
  return (
    <SelfLearningJourneyGate
      level="A1"
      day={practice.day}
      title={`${practice.title} · Kapitel ${practice.chapter}`}
      radio={resources.radio}
      teacherVideo={resources.teacherVideo}
      aiVideo={resources.aiVideo}
      grammarBook={resources.grammarBook}
      onOpenWorkbook={onOpenWorkbook}
    >
      <A1PracticeLearningContent onEnter={onEnter} />
    </SelfLearningJourneyGate>
  );
};

const A1CoursePracticeAutoMount = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof document === "undefined") return undefined;
    const pathname = normalizeA1CoursePracticePath(location.pathname);
    const practice = getA1SelfLearningPracticeForLocation(location);
    const isWritingPage = shouldAutoMountA1WritingPractice(pathname);
    const isLetterGrammarPage = isA1LetterWritingGrammarPath(pathname);

    if (!practice && !isWritingPage && !isLetterGrammarPage) return undefined;

    document.getElementById("falowen-a1-practice-mount")?.remove();

    if (isLetterGrammarPage && !practice) {
      prepareLetterGrammarPage();
      return undefined;
    }

    const currentIsDestination = practice
      ? routePath(practice.destination) === routePath(location.pathname)
      : false;
    const container = practice
      ? (currentIsDestination ? null : getCanonicalLessonArticle(practice.day)) || getPageContainer()
      : getPageContainer();

    if (practice && Number(practice.day) === 19) prepareDay19Page(container);

    const mount = document.createElement("div");
    mount.id = "falowen-a1-practice-mount";
    mount.style.margin = "16px 0";

    if (practice) insertPracticeMount(container, mount);
    else insertWritingMount(container, mount);

    const restoreContent = practice ? hideSelfLearningContent(container, mount) : () => {};
    const openWorkbook = practice && !currentIsDestination
      ? (nextLocation) => {
          const href = mergeJourneyStateIntoDestination(practice.destination, nextLocation);
          window.location.assign(href);
          return true;
        }
      : null;

    const root = createRoot(mount);
    root.render(
      practice ? (
        <A1SelfLearningJourney
          practice={practice}
          onEnter={restoreContent}
          onOpenWorkbook={openWorkbook}
        />
      ) : (
        <A1SimpleMarkMyLetterPanel />
      ),
    );

    const observer = practice && Number(practice.day) === 19
      ? new MutationObserver(() => prepareDay19Page(container))
      : null;
    observer?.observe(container, { childList: true, subtree: true });

    return () => {
      observer?.disconnect();
      restoreContent();
      root.unmount();
      mount.remove();
    };
  }, [location.pathname, location.search]);

  return null;
};

export default A1CoursePracticeAutoMount;
