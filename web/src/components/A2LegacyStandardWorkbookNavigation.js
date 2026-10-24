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
const A2_DAY22_PATH = "/campus/course/a2-day-22-die-woche-planung-workbook";
const DAY22_SELF_CHECK_NOTE =
  "Watch the Goethe past-paper video and check your answers there. Teil 4 is self-check practice and is not submitted. The school evaluates only Teil 2 · Schreiben and Teil 3 · Lesen for this workbook.";
const DAY22_READING_QUESTION_STEMS = [
  "Gülcan schreibt Sonja, dass ...",
  "In der ersten Woche haben andere Studierende ...",
  "In der Wohngemeinschaft ...",
  "Gülcan findet es wichtig, ...",
  "Während Sonjas Besuch ...",
];

A2_LEGACY_STANDARD_NAV_BY_PATH[A2_DAY20_PATH] = {
  day: 20,
  fallbackChapter: "7.20",
  title: "Typische Reklamationssituationen üben",
  workbookId: "A2Day20TypischeReklamationssituationen",
};

export const A2_DAYS_22_TO_26_PATHS = new Set([
  A2_DAY22_PATH,
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
const normalizeText = (value = "") =>
  String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();

const hideWithoutDetaching = (element) => {
  if (!element) return false;
  const alreadyHidden = element.hidden && element.style.display === "none";
  element.hidden = true;
  element.style.display = "none";
  element.setAttribute("data-a2-day22-safely-hidden", "true");
  return !alreadyHidden;
};

const restoreDay22ReadingQuestionStems = (main) => {
  const readingHeading = Array.from(main.querySelectorAll("h2, h3")).find(
    (heading) => normalizeText(heading.textContent) === "aufgaben teil 3",
  );
  const readingPanel = readingHeading?.closest("section") || readingHeading?.parentElement;
  if (!readingPanel) return false;

  let changed = false;
  Array.from(readingPanel.querySelectorAll("strong")).forEach((label) => {
    const match = normalizeText(label.textContent).match(/^aufgabe ([1-5])/);
    if (!match) return;
    const questionNumber = Number(match[1]);
    const stem = DAY22_READING_QUESTION_STEMS[questionNumber - 1];
    if (!stem) return;
    const completeLabel = `Aufgabe ${questionNumber} · ${stem}`;
    if (label.textContent === completeLabel) return;
    label.textContent = completeLabel;
    label.setAttribute("data-a2-day22-reading-question", String(questionNumber));
    changed = true;
  });

  return changed;
};

export const safelyCleanA2Day22Presentation = (root = document) => {
  const main = root?.querySelector?.("main.layout-main") || root?.querySelector?.("main") || root?.body;
  if (!main) return false;

  let changed = restoreDay22ReadingQuestionStems(main);

  Array.from(main.querySelectorAll('[role="note"]')).forEach((note) => {
    const text = normalizeText(note.textContent);
    if (!text.includes("reminder practise here then submit only your final answers through the submit tab")) return;
    changed = hideWithoutDetaching(note) || changed;
  });

  const finalHeading = Array.from(main.querySelectorAll("h2, h3")).find(
    (heading) => normalizeText(heading.textContent) === "final submission",
  );
  const finalPanel = finalHeading?.closest("section") || finalHeading?.parentElement;
  changed = hideWithoutDetaching(finalPanel) || changed;

  const listeningHeading = Array.from(main.querySelectorAll("h1, h2, h3")).find((heading) => {
    const text = normalizeText(heading.textContent);
    return /teil\s*4\b/.test(text) && /(horen|hoeren|listening)/.test(text);
  });
  const listeningPanel = listeningHeading?.closest("section") || listeningHeading?.parentElement;

  if (listeningHeading && listeningHeading.textContent !== "Teil 4 · Hören · Goethe Self-Check") {
    listeningHeading.textContent = "Teil 4 · Hören · Goethe Self-Check";
    changed = true;
  }

  if (listeningPanel) {
    const paragraphs = Array.from(listeningPanel.querySelectorAll("p"));
    const oldCopy = paragraphs.filter((paragraph) => {
      const text = normalizeText(paragraph.textContent);
      return (
        text.includes("please be aware that this is a goethe standard horverstehen") ||
        text.includes("the only parts that will be officially evaluated") ||
        text.includes("this process will require significant motivation")
      );
    });

    const note = oldCopy[0] || paragraphs[0] || null;
    if (note && note.textContent !== DAY22_SELF_CHECK_NOTE) {
      note.textContent = DAY22_SELF_CHECK_NOTE;
      note.style.margin = "0";
      note.style.lineHeight = "1.7";
      note.style.fontWeight = "700";
      note.style.color = "#1e3a8a";
      note.style.background = "#eff6ff";
      note.style.border = "1px solid #bfdbfe";
      note.style.borderRadius = "10px";
      note.style.padding = "10px 12px";
      note.setAttribute("data-a2-day22-goethe-note", "true");
      changed = true;
    }

    oldCopy.slice(1).forEach((paragraph) => {
      changed = hideWithoutDetaching(paragraph) || changed;
    });
  }

  return changed;
};

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
      if (normalizedPath === A2_DAY22_PATH) {
        safelyCleanA2Day22Presentation(document);
        return;
      }
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
