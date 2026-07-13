import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import A2LegacyStandardWorkbookNavigationImpl, {
  findA2LegacyWorkbookTabRow,
} from "./A2LegacyStandardWorkbookNavigationImpl";
import {
  A2_GOETHE_LISTENING_ONLY_PATHS,
  cleanA2GoetheListeningOnlyWorkbook,
} from "./a2GoetheListeningOnlyCleanup";

export const A2_DAYS_22_TO_26_PATHS = new Set([
  "/campus/course/a2-day-22-die-woche-planung-workbook",
  "/campus/course/a2-day-23-wie-kommst-du-zur-schule-oder-zur-arbeit-workbook",
  "/campus/course/a2-day-24-einen-urlaub-planen-workbook",
  "/campus/course/a2-day-25-tagesablauf-workbook",
  "/campus/course/a2-day-26-gefuehle-in-verschiedenen-situationen-workbook",
]);

const normalizePath = (value = "") => String(value || "").replace(/\/+$/, "") || "/";

export default function A2LegacyStandardWorkbookNavigation() {
  const location = useLocation();
  const normalizedPath = normalizePath(location.pathname);
  const isSupportedRoute = A2_DAYS_22_TO_26_PATHS.has(normalizedPath);
  const isGoetheListeningOnlyRoute = A2_GOETHE_LISTENING_ONLY_PATHS.has(normalizedPath);

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
    if (!isGoetheListeningOnlyRoute) return undefined;

    let scheduled = false;
    const applyListeningOnlyCleanup = () => {
      scheduled = false;
      cleanA2GoetheListeningOnlyWorkbook(document, normalizedPath);
    };

    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      const enqueue = window.requestAnimationFrame || ((callback) => window.setTimeout(callback, 0));
      enqueue(applyListeningOnlyCleanup);
    };

    schedule();
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [isGoetheListeningOnlyRoute, normalizedPath]);

  if (!isSupportedRoute) return null;
  return <A2LegacyStandardWorkbookNavigationImpl />;
}
