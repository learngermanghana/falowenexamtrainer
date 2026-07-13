import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import A2LegacyStandardWorkbookNavigationImpl, {
  A2_LEGACY_STANDARD_NAV_BY_PATH,
  findA2LegacyWorkbookTabRow,
} from "./A2LegacyStandardWorkbookNavigationImpl";
import {
  A2_GOETHE_LISTENING_ONLY_PATHS,
  A2_LEGACY_SUBMISSION_CLEANUP_PATHS,
  cleanA2WorkbookPresentation,
} from "./a2GoetheListeningOnlyCleanup";

const A2_DAY20_PATH = "/campus/course/a2-day-20-typische-reklamationssituationen-workbook";

A2_LEGACY_STANDARD_NAV_BY_PATH[A2_DAY20_PATH] = {
  day: 20,
  fallbackChapter: "7.20",
  title: "Typische Reklamationssituationen üben",
  workbookId: "A2Day20TypischeReklamationssituationen",
};

export const A2_DAYS_22_TO_26_PATHS = new Set([
  "/campus/course/a2-day-22-die-woche-planung-workbook",
  "/campus/course/a2-day-23-wie-kommst-du-zur-schule-oder-zur-arbeit-workbook",
  "/campus/course/a2-day-24-einen-urlaub-planen-workbook",
  "/campus/course/a2-day-25-tagesablauf-workbook",
  "/campus/course/a2-day-26-gefuehle-in-verschiedenen-situationen-workbook",
]);

export const A2_LEGACY_STANDARD_NAV_PATHS = new Set([
  A2_DAY20_PATH,
  ...A2_DAYS_22_TO_26_PATHS,
]);

const normalizePath = (value = "") => String(value || "").replace(/\/+$/, "") || "/";

export default function A2LegacyStandardWorkbookNavigation() {
  const location = useLocation();
  const normalizedPath = normalizePath(location.pathname);
  const isSupportedRoute = A2_LEGACY_STANDARD_NAV_PATHS.has(normalizedPath);
  const shouldCleanPresentation =
    A2_GOETHE_LISTENING_ONLY_PATHS.has(normalizedPath) ||
    A2_LEGACY_SUBMISSION_CLEANUP_PATHS.has(normalizedPath);

  useEffect(() => {
    if (!isSupportedRoute) return undefined;

    let scheduled = false;
    const makeLegacyTabsSafe = () => {
      scheduled = false;
      const main = document.querySelector("main.layout-main") || document.querySelector("main");
      const row = findA2LegacyWorkbookTabRow(main || document);
      if (!row) return;

      Array.from(row.querySelectorAll("button")).forEach((button) => {
        button.type = "button";
      });
    };

    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      const enqueue = window.requestAnimationFrame || ((callback) => window.setTimeout(callback, 0));
      enqueue(makeLegacyTabsSafe);
    };

    schedule();
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [isSupportedRoute, normalizedPath]);

  useEffect(() => {
    if (!shouldCleanPresentation) return undefined;

    let scheduled = false;
    const applyWorkbookCleanup = () => {
      scheduled = false;
      cleanA2WorkbookPresentation(document, normalizedPath);
    };

    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      const enqueue = window.requestAnimationFrame || ((callback) => window.setTimeout(callback, 0));
      enqueue(applyWorkbookCleanup);
    };

    schedule();
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [normalizedPath, shouldCleanPresentation]);

  if (!isSupportedRoute) return null;
  return <A2LegacyStandardWorkbookNavigationImpl />;
}
