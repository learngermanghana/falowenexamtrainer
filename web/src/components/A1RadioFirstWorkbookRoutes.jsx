import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { getA1RadioResource } from "../data/a1RadioResources";
import RadioFirstWorkbookGate from "./RadioFirstWorkbookGate";

const RADIO_COMPLETE_PARAM = "radio";
const RADIO_COMPLETE_VALUE = "done";

export const A1_RADIO_FIRST_WORKBOOK_ROUTES = Object.freeze({
  "/campus/course/a1-day-2-kapitel-1-1-workbook": Object.freeze({ day: 2, chapter: "1.1" }),
  "/campus/course/a1-day-3-schreiben-sprechen-kapitel-1-1-workbook": Object.freeze({ day: 3, chapter: "1.1" }),
  "/campus/course/a1-day-5-introducing-yourself-and-articles-workbook": Object.freeze({ day: 5, chapter: "1.3" }),
  "/campus/course/a1-chapter-5-german-cases-workbook": Object.freeze({ day: 9, chapter: "5" }),
  "/campus/course/a1-day-13-revision-numbers-time-and-prices-workbook": Object.freeze({ day: 13 }),
  "/campus/course/modal-verbs-day-14-3-6": Object.freeze({ day: 14, chapter: "3.6" }),
  "/campus/course/a1-day-16-food-and-negation-food-and-daily-life-workbook": Object.freeze({ day: 16, chapter: "9" }),
  "/campus/course/a1-day-16-food-and-negation-kapitel-10-workbook": Object.freeze({ day: 16, chapter: "10" }),
  "/campus/course/letter-writing-intro-german-a1-day-12-3": Object.freeze({ day: 20, chapter: "12.3" }),
  "/campus/course/a1-day-21-weather-workbook": Object.freeze({ day: 21, chapter: "13" }),
  "/campus/course/a1-day-22-health-and-body-parts-workbook": Object.freeze({ day: 22, chapter: "14.1" }),
});

const A1_DYNAMIC_RADIO_FIRST_LESSONS = Object.freeze({
  1: Object.freeze(["0.1"]),
  2: Object.freeze(["1.1"]),
  3: Object.freeze(["1.1"]),
  4: Object.freeze(["2"]),
  5: Object.freeze(["1.3"]),
  6: Object.freeze(["2.3"]),
  7: Object.freeze(["3"]),
  8: Object.freeze(["4"]),
  9: Object.freeze(["5"]),
  11: Object.freeze(["7"]),
  12: Object.freeze(["8"]),
  14: Object.freeze(["3.6"]),
  16: Object.freeze(["9", "10"]),
  22: Object.freeze(["14.1"]),
});

const normalizePath = (value = "") => String(value || "").replace(/\/+$/, "") || "/";

export const resolveA1RadioFirstWorkbookRoute = (pathname = "", search = "") => {
  const normalizedPath = normalizePath(pathname);
  const namedRoute = A1_RADIO_FIRST_WORKBOOK_ROUTES[normalizedPath];
  if (namedRoute) return namedRoute;

  const dynamicMatch = normalizedPath.match(/^\/campus\/course\/lesson\/A1\/(\d+)$/i);
  if (!dynamicMatch) return null;

  const day = Number(dynamicMatch[1]);
  const configuredChapters = A1_DYNAMIC_RADIO_FIRST_LESSONS[day] || [];
  const requestedChapter = new URLSearchParams(search || "").get("chapter") || "";
  return configuredChapters.includes(requestedChapter) ? { day, chapter: requestedChapter } : null;
};

export const hasCompletedA1RadioFirstStep = (search = "") => {
  try {
    return new URLSearchParams(search || "").get(RADIO_COMPLETE_PARAM) === RADIO_COMPLETE_VALUE;
  } catch (_error) {
    return false;
  }
};

export default function A1RadioFirstWorkbookRoutes() {
  const location = useLocation();
  const route = resolveA1RadioFirstWorkbookRoute(location.pathname, location.search);
  const completed = hasCompletedA1RadioFirstStep(location.search);
  const resource = route ? getA1RadioResource(route.day, route.chapter) : null;
  const shouldShow = Boolean(route && resource && !completed);

  useEffect(() => {
    if (!shouldShow || typeof document === "undefined") return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [shouldShow]);

  if (!shouldShow || typeof document === "undefined") return null;

  return createPortal(
    <div
      data-a1-radio-first-workbook-route="true"
      style={{
        background: "#f8fafc",
        inset: 0,
        overflowY: "auto",
        padding: "18px 12px 40px",
        position: "fixed",
        zIndex: 10000,
      }}
    >
      <RadioFirstWorkbookGate level="A1" day={route.day} resource={resource}>
        {null}
      </RadioFirstWorkbookGate>
    </div>,
    document.body,
  );
}
