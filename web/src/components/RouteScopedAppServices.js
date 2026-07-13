import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isPublicAuthPath, normalizePublicPath } from "../lib/publicAuthRoutes";
import LandingPublicLanguageGuard from "./LandingPublicLanguageGuard";
import PublicClassSelectInjector from "./PublicClassSelectInjector";
import MobileHeaderMenuInjector from "./MobileHeaderMenuInjector";
import SubmitPageLevelGuidanceInjector from "./SubmitPageLevelGuidanceInjector";
import SubmitSuccessScreenInjector from "./SubmitSuccessScreenInjector";
import CourseBookTerminologyInjector from "./CourseBookTerminologyInjector";
import CourseCompletionExamGuidanceInjector from "./CourseCompletionExamGuidanceInjector";
import A2CourseBookOrientationVideoInjector from "./A2CourseBookOrientationVideoInjector";
import CourseBookNextClassIndicator from "./CourseBookNextClassIndicator";
import UniversalWorkbookLessonNavigator from "./UniversalWorkbookLessonNavigator";
import LockedSubmissionCardCompactor from "./LockedSubmissionCardCompactor";
import B1WorkbookWritingCheatSheetInjector from "./B1WorkbookWritingCheatSheetInjector";
import ExamQuestionCheatSheetInjector from "./ExamQuestionCheatSheetInjector";
import AutoGrammarStartGuide from "./AutoGrammarStartGuide";
import BookPdfDownloadInjector from "./BookPdfDownloadInjector";
import A1CourseExperienceEnhancer from "./A1CourseExperienceEnhancer";
import A1WorkbookSectionTabs from "./A1WorkbookSectionTabs";
import A1Chapter7SeparableVerbCleaner from "./A1Chapter7SeparableVerbCleaner";
import B2CourseBookContentAlignment from "./B2CourseBookContentAlignment";
import CourseDebugPanel from "./CourseDebugPanel";

const ADSENSE_SCRIPT_ID = "falowen-adsense-script";
const ADSENSE_SRC =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8991390842894141";
const AD_ELIGIBLE_PATHS = new Set(["/"]);
const A1_CHAPTER7_TIME_PATH = "/campus/course/the-12-hour-clock-system-in-german-chapter-7";

const isInstalledApp = () => {
  if (typeof window === "undefined") return false;
  return Boolean(
    window.matchMedia?.("(display-mode: standalone)")?.matches ||
      window.navigator?.standalone === true
  );
};

const removeAdsenseScript = () => {
  if (typeof document === "undefined") return;
  document.getElementById(ADSENSE_SCRIPT_ID)?.remove();
};

const PublicAdsLoader = () => {
  const location = useLocation();
  const { loading, user } = useAuth();

  useEffect(() => {
    const pathname = normalizePublicPath(location.pathname);
    const shouldLoad =
      !loading &&
      !user &&
      AD_ELIGIBLE_PATHS.has(pathname) &&
      !isInstalledApp();

    if (!shouldLoad) {
      removeAdsenseScript();
      return undefined;
    }

    if (document.getElementById(ADSENSE_SCRIPT_ID)) return undefined;

    const script = document.createElement("script");
    script.id = ADSENSE_SCRIPT_ID;
    script.async = true;
    script.crossOrigin = "anonymous";
    script.src = ADSENSE_SRC;
    document.head.appendChild(script);

    return removeAdsenseScript;
  }, [loading, location.pathname, user]);

  return null;
};

const A1CourseBookScopeCleaner = () => {
  const location = useLocation();

  useEffect(() => {
    if ((location.pathname.replace(/\/+$/, "") || "/") !== "/campus/course") return undefined;

    const cleanWhenAnotherLevelIsSelected = () => {
      const levelSelect = Array.from(document.querySelectorAll("select")).find((select) =>
        Array.from(select.options || []).some((option) => /^A1$/i.test(String(option.value || option.textContent || "").trim()))
      );
      if (!levelSelect || String(levelSelect.value || "").trim().toUpperCase() === "A1") return;
      document.querySelectorAll("[data-a1-course-card]").forEach((element) => element.removeAttribute("data-a1-course-card"));
      document.querySelectorAll("[data-a1-course-action]").forEach((element) => element.removeAttribute("data-a1-course-action"));
    };

    let scheduled = false;
    const scheduleClean = () => {
      if (scheduled) return;
      scheduled = true;
      const schedule = window.requestAnimationFrame || ((callback) => window.setTimeout(callback, 0));
      schedule(() => {
        scheduled = false;
        cleanWhenAnotherLevelIsSelected();
      });
    };

    scheduleClean();
    const observer = new MutationObserver(scheduleClean);
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("change", scheduleClean, true);

    return () => {
      observer.disconnect();
      document.removeEventListener("change", scheduleClean, true);
    };
  }, [location.pathname]);

  return null;
};

export default function RouteScopedAppServices() {
  const location = useLocation();

  if (isPublicAuthPath(location.pathname)) return null;

  const normalizedPath = location.pathname.replace(/\/+$/, "") || "/";
  const isCourseBook = normalizedPath === "/campus/course";
  const isA1Chapter7TimePage = normalizedPath === A1_CHAPTER7_TIME_PATH;
  const isA1LessonOrWorkbook =
    /^\/campus\/course\/lesson\/A1\/\d+$/i.test(normalizedPath) ||
    /^\/campus\/course\/a1-day-.*(?:workbook|grammar.*)$/i.test(normalizedPath);
  const shouldEnhanceA1Experience = isCourseBook || isA1LessonOrWorkbook || isA1Chapter7TimePage;

  return (
    <>
      <PublicAdsLoader />
      <LandingPublicLanguageGuard />
      <PublicClassSelectInjector />
      <MobileHeaderMenuInjector />
      <SubmitPageLevelGuidanceInjector />
      <SubmitSuccessScreenInjector />
      <CourseBookTerminologyInjector />
      <CourseCompletionExamGuidanceInjector />
      <A2CourseBookOrientationVideoInjector />
      {isCourseBook ? <CourseBookNextClassIndicator /> : null}
      <UniversalWorkbookLessonNavigator />
      <LockedSubmissionCardCompactor />
      <B1WorkbookWritingCheatSheetInjector />
      <ExamQuestionCheatSheetInjector />
      <AutoGrammarStartGuide />
      <BookPdfDownloadInjector />
      {shouldEnhanceA1Experience ? <A1CourseExperienceEnhancer /> : null}
      {isA1LessonOrWorkbook ? <A1WorkbookSectionTabs /> : null}
      {isA1Chapter7TimePage ? <A1Chapter7SeparableVerbCleaner /> : null}
      {isCourseBook ? <B2CourseBookContentAlignment /> : null}
      {isCourseBook ? <A1CourseBookScopeCleaner /> : null}
      <CourseDebugPanel />
    </>
  );
}

export const __private__ = {
  isInstalledApp,
  removeAdsenseScript,
};
