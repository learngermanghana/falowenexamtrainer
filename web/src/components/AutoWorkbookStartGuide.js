import React, { useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { courseSchedules } from "../data/courseSchedule";
import { styles } from "../styles";
import CourseWorkbookSubmissionTabs from "./CourseWorkbookSubmissionTabs";
import WorkbookStartGuide from "./WorkbookStartGuide";

const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

export const normalizeInAppPath = (link = "") => {
  const value = String(link || "").trim();
  if (!value) return "";

  try {
    const url = new URL(value, "https://www.falowen.app");
    if (!["falowen.app", "www.falowen.app"].includes(url.hostname)) return "";
    return url.pathname.replace(/\/+$/, "") || "/";
  } catch {
    return "";
  }
};

const getWorkbookResources = (entry = {}) => [
  entry,
  ...toArray(entry.lesen_hören),
  ...toArray(entry.schreiben_sprechen),
];

export const buildWorkbookRouteIndex = (schedules = courseSchedules) => {
  const index = new Map();

  Object.entries(schedules).forEach(([level, entries]) => {
    toArray(entries).forEach((entry) => {
      getWorkbookResources(entry).forEach((resource) => {
        const pathname = normalizeInAppPath(resource?.workbook_link);
        if (!pathname || index.has(pathname)) return;
        index.set(pathname, { level, day: entry?.day, entry, resource });
      });
    });
  });

  return index;
};

const workbookRouteIndex = buildWorkbookRouteIndex();

const AutoWorkbookStartGuide = () => {
  const { pathname } = useLocation();
  const hostRef = useRef(null);
  const match = useMemo(() => workbookRouteIndex.get(normalizeInAppPath(pathname)), [pathname]);

  if (!match) return null;

  return (
    <div
      ref={hostRef}
      data-auto-workbook-start-guide="true"
      style={{
        ...styles.container,
        display: "grid",
        width: "100%",
        minHeight: 0,
        padding: "0 16px",
        marginBottom: 12,
        boxSizing: "border-box",
      }}
    >
      <WorkbookStartGuide level={match.level} day={match.day} entry={match.entry} />
      <CourseWorkbookSubmissionTabs hostRef={hostRef} match={match} />
    </div>
  );
};

export default AutoWorkbookStartGuide;
