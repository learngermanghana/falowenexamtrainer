import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { courseSchedules } from "../data/courseSchedule";
import { resolveStrictInAppWorkbookRoute } from "../data/strictInAppWorkbookRoutes";
import { styles } from "../styles";

const LEVELS = ["A1", "A2", "B1", "B2", "C1"];
const HOST_ID = "falowen-universal-workbook-navigation";

const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

const normalizeCourseDestination = (value = "") => {
  const raw = String(value || "").trim();
  if (!raw) return "";

  try {
    const url = new URL(raw, "https://www.falowen.app");
    if (!["falowen.app", "www.falowen.app"].includes(url.hostname)) return "";
    if (!url.pathname.startsWith("/campus/course/")) return "";
    return `${url.pathname.replace(/\/+$/, "") || "/"}${url.search}`;
  } catch {
    return "";
  }
};

const destinationParts = (destination = "") => {
  try {
    const url = new URL(destination, "https://www.falowen.app");
    return {
      pathname: url.pathname.replace(/\/+$/, "") || "/",
      view: url.searchParams.get("view") || "",
      chapter: url.searchParams.get("chapter") || "",
    };
  } catch {
    return { pathname: "", view: "", chapter: "" };
  }
};

const lessonResources = (entry = {}) => [
  entry,
  ...toArray(entry.lesen_hören),
  ...toArray(entry.schreiben_sprechen),
];

const resolveEntryDestination = (level, entry = {}) => {
  for (const resource of lessonResources(entry)) {
    const chapter = resource?.chapter || entry?.chapter || "";
    const fallback = resource?.workbook_link || resource?.workbookRoute || "";
    const resolved = resolveStrictInAppWorkbookRoute({
      level,
      day: entry?.day,
      chapter,
      fallback,
    });
    const destination = normalizeCourseDestination(resolved);
    if (destination) return destination;
  }

  const day = Number(entry?.day);
  if (["B1", "B2", "C1"].includes(level) && Number.isFinite(day)) {
    return `/campus/course/lesson/${level}/${day}?view=workbook`;
  }

  return "";
};

export const buildWorkbookNavigationEntries = (schedules = courseSchedules) => {
  const byLevel = {};

  LEVELS.forEach((level) => {
    const seenDestinations = new Set();
    byLevel[level] = toArray(schedules?.[level])
      .map((entry, index) => {
        const destination = resolveEntryDestination(level, entry);
        const destinationKey = destination.toLowerCase();
        if (!destination || seenDestinations.has(destinationKey)) return null;
        seenDestinations.add(destinationKey);

        return {
          level,
          index,
          day: Number(entry?.day),
          chapter: String(entry?.chapter || "").trim(),
          title: String(entry?.topic || entry?.title || `Day ${entry?.day}`).trim(),
          destination,
        };
      })
      .filter(Boolean);
  });

  return byLevel;
};

const routeMatches = ({ destination }, pathname, search) => {
  const currentPath = String(pathname || "").replace(/\/+$/, "") || "/";
  const currentParams = new URLSearchParams(search || "");
  const target = destinationParts(destination);
  if (!target.pathname || target.pathname.toLowerCase() !== currentPath.toLowerCase()) return false;
  if (target.view && currentParams.get("view") !== target.view) return false;
  if (target.chapter && currentParams.get("chapter") !== target.chapter) return false;
  return true;
};

export const resolveWorkbookNavigation = ({ pathname = "", search = "", schedules = courseSchedules } = {}) => {
  const entriesByLevel = buildWorkbookNavigationEntries(schedules);
  let currentLevel = "";
  let currentIndex = -1;

  for (const level of LEVELS) {
    const index = entriesByLevel[level].findIndex((entry) => routeMatches(entry, pathname, search));
    if (index >= 0) {
      currentLevel = level;
      currentIndex = index;
      break;
    }
  }

  if (!currentLevel) {
    const genericMatch = String(pathname || "").match(/^\/campus\/course\/lesson\/(A1|A2|B1|B2|C1)\/(\d+)\/?$/i);
    if (genericMatch) {
      currentLevel = genericMatch[1].toUpperCase();
      const day = Number(genericMatch[2]);
      currentIndex = entriesByLevel[currentLevel].findIndex((entry) => entry.day === day);
    }
  }

  if (!currentLevel || currentIndex < 0) return null;

  const entries = entriesByLevel[currentLevel];
  return {
    level: currentLevel,
    current: entries[currentIndex] || null,
    previous: entries[currentIndex - 1] || null,
    next: entries[currentIndex + 1] || null,
    isFinalLesson: currentIndex === entries.length - 1,
  };
};

const lessonLabel = (lesson) => {
  if (!lesson) return "";
  const parts = [`${lesson.level} · Day ${lesson.day}`];
  if (lesson.chapter) parts.push(`Kapitel ${lesson.chapter}`);
  return parts.join(" · ");
};

const NavigationCard = ({ navigation }) => (
  <section
    data-universal-workbook-navigation-card="true"
    aria-label="Workbook lesson navigation"
    style={{
      ...styles.card,
      width: "min(100%, 980px)",
      margin: "0 auto",
      display: "grid",
      gap: 14,
      border: "2px solid #2563eb",
      background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 65%, #eef2ff 100%)",
      boxShadow: "0 18px 38px rgba(37, 99, 235, 0.16)",
    }}
  >
    <div style={{ display: "grid", gap: 5 }}>
      <span style={{ ...styles.badge, width: "fit-content", background: "#dbeafe", color: "#1e40af" }}>
        Continue learning
      </span>
      <h2 style={{ margin: 0, color: "#0f172a", fontSize: "clamp(1.2rem, 3.5vw, 1.6rem)" }}>
        {navigation.next ? "Ready for the next lesson?" : `${navigation.level} Course Book complete`}
      </h2>
      <p style={{ margin: 0, color: "#475569", lineHeight: 1.65 }}>
        {navigation.next
          ? `Continue directly to ${lessonLabel(navigation.next)} · ${navigation.next.title}. You do not need to return to the Course Book first.`
          : "You have reached the final lesson in this level. Return to the Course Book or continue to the Exams Room."}
      </p>
    </div>

    <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "stretch" }}>
      {navigation.previous ? (
        <a
          href={navigation.previous.destination}
          style={{ ...styles.secondaryButton, textDecoration: "none", minHeight: 46, display: "inline-flex", alignItems: "center" }}
        >
          ← Previous lesson
        </a>
      ) : null}

      <a
        href="/campus/course"
        style={{ ...styles.secondaryButton, textDecoration: "none", minHeight: 46, display: "inline-flex", alignItems: "center" }}
      >
        Course Book
      </a>

      {navigation.next ? (
        <a
          href={navigation.next.destination}
          style={{
            ...styles.primaryButton,
            textDecoration: "none",
            minHeight: 46,
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            fontWeight: 900,
          }}
        >
          Next lesson →
        </a>
      ) : (
        <a
          href="/exams/overview"
          style={{ ...styles.primaryButton, textDecoration: "none", minHeight: 46, display: "inline-flex", alignItems: "center" }}
        >
          Open Exams Room
        </a>
      )}
    </div>
  </section>
);

export default function UniversalWorkbookLessonNavigator() {
  const location = useLocation();
  const [portalHost, setPortalHost] = useState(null);
  const navigation = useMemo(
    () => resolveWorkbookNavigation({ pathname: location.pathname, search: location.search }),
    [location.pathname, location.search]
  );

  useEffect(() => {
    if (!navigation || typeof document === "undefined") {
      setPortalHost(null);
      document.getElementById(HOST_ID)?.remove();
      return undefined;
    }

    let observer = null;
    let host = null;

    const install = () => {
      const main = document.querySelector("main.layout-main") || document.querySelector("main");
      if (!main) return false;

      host = document.getElementById(HOST_ID);
      if (!host) {
        host = document.createElement("div");
        host.id = HOST_ID;
        host.setAttribute("data-universal-workbook-navigation-host", "true");
        host.style.width = "100%";
        host.style.boxSizing = "border-box";
        host.style.padding = "18px 16px 34px";
        main.appendChild(host);
      }

      setPortalHost(host);
      return true;
    };

    if (!install()) {
      observer = new MutationObserver(() => {
        if (install()) observer?.disconnect();
      });
      observer.observe(document.body, { childList: true, subtree: true });
    }

    return () => {
      observer?.disconnect();
      setPortalHost(null);
      if (host?.parentNode) host.parentNode.removeChild(host);
    };
  }, [navigation]);

  if (!navigation || !portalHost) return null;
  return createPortal(<NavigationCard navigation={navigation} />, portalHost);
}
