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
import LockedSubmissionCardCompactor from "./LockedSubmissionCardCompactor";
import B1WorkbookWritingCheatSheetInjector from "./B1WorkbookWritingCheatSheetInjector";
import AutoGrammarStartGuide from "./AutoGrammarStartGuide";
import BookPdfDownloadInjector from "./BookPdfDownloadInjector";
import CourseDebugPanel from "./CourseDebugPanel";

const ADSENSE_SCRIPT_ID = "falowen-adsense-script";
const ADSENSE_SRC =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8991390842894141";
const AD_ELIGIBLE_PATHS = new Set(["/"]);

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

export default function RouteScopedAppServices() {
  const location = useLocation();

  if (isPublicAuthPath(location.pathname)) return null;

  return (
    <>
      <PublicAdsLoader />
      <LandingPublicLanguageGuard />
      <PublicClassSelectInjector />
      <MobileHeaderMenuInjector />
      <SubmitPageLevelGuidanceInjector />
      <SubmitSuccessScreenInjector />
      <CourseBookTerminologyInjector />
      <LockedSubmissionCardCompactor />
      <B1WorkbookWritingCheatSheetInjector />
      <AutoGrammarStartGuide />
      <BookPdfDownloadInjector />
      <CourseDebugPanel />
    </>
  );
}

export const __private__ = {
  isInstalledApp,
  removeAdsenseScript,
};
