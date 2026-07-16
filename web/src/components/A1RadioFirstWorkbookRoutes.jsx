import React, { useEffect } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { getA1RadioResource } from "../data/a1RadioResources";
import RadioFirstWorkbookGate from "./RadioFirstWorkbookGate";

const RADIO_COMPLETE_PARAM = "radio";
const RADIO_COMPLETE_VALUE = "done";

export const A1_RADIO_FIRST_WORKBOOK_ROUTES = Object.freeze({
  "/campus/course/a1-day-13-revision-numbers-time-and-prices-workbook": Object.freeze({ day: 13 }),
  "/campus/course/letter-writing-intro-german-a1-day-12-3": Object.freeze({ day: 20, chapter: "12.3" }),
  "/campus/course/a1-day-21-weather-workbook": Object.freeze({ day: 21, chapter: "13" }),
});

const normalizePath = (value = "") => String(value || "").replace(/\/+$/, "") || "/";

export const resolveA1RadioFirstWorkbookRoute = (pathname = "") =>
  A1_RADIO_FIRST_WORKBOOK_ROUTES[normalizePath(pathname)] || null;

export const hasCompletedA1RadioFirstStep = (search = "") => {
  try {
    return new URLSearchParams(search || "").get(RADIO_COMPLETE_PARAM) === RADIO_COMPLETE_VALUE;
  } catch (_error) {
    return false;
  }
};

export default function A1RadioFirstWorkbookRoutes() {
  const location = useLocation();
  const route = resolveA1RadioFirstWorkbookRoute(location.pathname);
  const completed = hasCompletedA1RadioFirstStep(location.search);
  const resource = route ? getA1RadioResource(route.day) : null;
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
