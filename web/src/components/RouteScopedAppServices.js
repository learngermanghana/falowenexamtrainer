import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { isPublicAuthPath, normalizePublicPath } from "../lib/publicAuthRoutes";
import {
  getA1CorrectedChapterSpecificLessonSearch,
  shouldResetA1ChapterSpecificLessonState,
} from "../utils/a1ChapterSpecificLessonState";
import { resolveA1WorkbookServiceScope } from "../utils/a1WorkbookServiceScope";
import LandingPublicLanguageGuard from "./LandingPublicLanguageGuard";
import PublicClassSelectInjector from "./PublicClassSelectInjector";
import MobileHeaderMenuInjector from "./MobileHeaderMenuInjector";
import SubmitPageLevelGuidanceInjector from "./SubmitPageLevelGuidanceInjector";
import SubmitSuccessScreenInjector from "./SubmitSuccessScreenInjector";
import CourseBookTerminologyInjector from "./CourseBookTerminologyInjector";
import CourseCompletionExamGuidanceInjector from "./CourseCompletionExamGuidanceInjector";
import A2CourseBookOrientationVideoInjector from "./A2CourseBookOrientationVideoInjector";
import A2LegacyStandardWorkbookNavigation from "./A2LegacyStandardWorkbookNavigation";
import A2ProtectedWorkbookRouteGuard from "./A2ProtectedWorkbookRouteGuard";
import CourseBookNextClassIndicator from "./CourseBookNextClassIndicator";
import UniversalWorkbookLessonNavigator from "./UniversalWorkbookLessonNavigator";
import LockedSubmissionCardCompactor from "./LockedSubmissionCardCompactor";
import B1WorkbookWritingCheatSheetInjector from "./B1WorkbookWritingCheatSheetInjector";
import B1WorkbookSubmissionContextSync from "./B1WorkbookSubmissionContextSync";
import ExamQuestionCheatSheetInjector from "./ExamQuestionCheatSheetInjector";
import AutoGrammarStartGuide from "./AutoGrammarStartGuide";
import BookPdfDownloadInjector from "./BookPdfDownloadInjector";
import A1CourseExperienceEnhancer from "./A1CourseExperienceEnhancer";
import A1WorkbookSectionTabs from "./A1WorkbookSectionTabs";
import A1UnifiedTutorWorkbookNavigation from "./A1UnifiedTutorWorkbookNavigation";
import A1WorkbookVideoHeader from "./A1WorkbookVideoHeader";
import CourseBookLayoutStandardizer from "./CourseBookLayoutStandardizer";
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

const AutoOpenFirstA1WorkbookTeil = () => {
  const location = useLocation();

  useEffect(() => {
    let cancelled = false;
    const openFirstTeil = () => {
      if (cancelled) return true;
      const main = document.querySelector("main.layout-main") || document.querySelector("main");
      if (!main) return false;
      if (main.querySelector('[data-a1-unified-tutor-workbook-nav="true"]')) return true;
      const activeView = main.getAttribute("data-a1-active-workbook-view");
      if (activeView && activeView !== "overview") return true;
      const firstTeil = Array.from(main.querySelectorAll('[data-a1-teil-navigation="true"] button')).find((button) =>
        /^\s*Teil\s*1\b/i.test(String(button.textContent || ""))
      );
      if (!firstTeil) return false;
      firstTeil.click();
      return true;
    };

    const timers = [0, 80, 250, 700].map((delay) =>
      window.setTimeout(openFirstTeil, delay)
    );
    const observer = new MutationObserver(() => {
      if (openFirstTeil()) observer.disconnect();
    });
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      cancelled = true;
      timers.forEach((timer) => window.clearTimeout(timer));
      observer.disconnect();
    };
  }, [location.pathname, location.search]);

  return null;
};

const A1ChapterSpecificLessonStateReset = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const correctedSearch = getA1CorrectedChapterSpecificLessonSearch({
      pathname: location.pathname,
      search: location.search,
      state: location.state,
    });

    if (correctedSearch && correctedSearch !== location.search) {
      navigate(
        { pathname: location.pathname, search: correctedSearch },
        { replace: true, state: location.state },
      );
      return;
    }

    if (
      !shouldResetA1ChapterSpecificLessonState({
        pathname: location.pathname,
        search: location.search,
        state: location.state,
      })
    ) {
      return;
    }

    navigate(
      { pathname: location.pathname, search: location.search },
      { replace: true, state: null },
    );
  }, [location.pathname, location.search, location.state, navigate]);

  return null;
};

export default function RouteScopedAppServices() {
  const location = useLocation();

  if (isPublicAuthPath(location.pathname)) return null;

  const normalizedPath = location.pathname.replace(/\/+$/, "") || "/";
  const isCourseBook = normalizedPath === "/campus/course";
  const isA1Chapter7TimePage = normalizedPath === A1_CHAPTER7_TIME_PATH;
  const a1WorkbookScope = resolveA1WorkbookServiceScope({
    pathname: location.pathname,
    search: location.search,
  });
  const isA1DynamicLesson = a1WorkbookScope.isDynamicLesson;
  const isA1NamedGrammar = /^\/campus\/course\/a1-day-.*grammar.*$/i.test(normalizedPath);
  const isA1LessonOrWorkbook =
    isA1DynamicLesson || a1WorkbookScope.isWorkbookView || isA1NamedGrammar;
  const isA1WorkbookView = a1WorkbookScope.isWorkbookView;
  const shouldMountA1WorkbookServices = a1WorkbookScope.shouldMountWorkbookServices;
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
      <A2LegacyStandardWorkbookNavigation />
      <A2ProtectedWorkbookRouteGuard />
      <B1WorkbookSubmissionContextSync />
      {shouldMountA1WorkbookServices ? <A1UnifiedTutorWorkbookNavigation /> : null}
      {shouldMountA1WorkbookServices ? <A1WorkbookVideoHeader /> : null}
      <CourseBookLayoutStandardizer />
      {isCourseBook ? <CourseBookNextClassIndicator /> : null}
      <UniversalWorkbookLessonNavigator />
      <LockedSubmissionCardCompactor />
      <B1WorkbookWritingCheatSheetInjector />
      <ExamQuestionCheatSheetInjector />
      <AutoGrammarStartGuide />
      <BookPdfDownloadInjector />
      {isA1DynamicLesson ? <A1ChapterSpecificLessonStateReset /> : null}
      {shouldEnhanceA1Experience ? <A1CourseExperienceEnhancer /> : null}
      {isA1WorkbookView ? <A1WorkbookSectionTabs /> : null}
      {isA1WorkbookView ? <AutoOpenFirstA1WorkbookTeil /> : null}
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
