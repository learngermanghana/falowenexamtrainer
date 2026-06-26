import React, { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation } from "react-router-dom";
import { styles } from "../styles";
import { courseSchedules } from "../data/courseSchedule";
import { A1_GRAMMAR_ROUTE_ENTRIES } from "../data/a1GrammarRoutes";
import { A2_GRAMMAR_ROUTE_ENTRIES } from "../data/a2GrammarRoutes";
import { normalizeInAppPath } from "../utils/courseWorkbookRoutes";
import WorkbookStartGuide from "./WorkbookStartGuide";

const toArray = (value) => (Array.isArray(value) ? value : value ? [value] : []);

const findLesson = (level, day) =>
  toArray(courseSchedules[String(level || "").toUpperCase()]).find(
    (lesson) => String(lesson?.day) === String(day)
  ) || null;

const buildGrammarRouteIndex = () => {
  const index = new Map();

  Object.entries(courseSchedules || {}).forEach(([level, lessons]) => {
    toArray(lessons).forEach((lesson) => {
      const resources = [
        lesson,
        ...toArray(lesson?.lesen_hören),
        ...toArray(lesson?.schreiben_sprechen),
      ];

      resources.forEach((resource) => {
        [resource?.grammarbook_link, resource?.grammar_link, resource?.grammarPage].forEach((link) => {
          const pathname = normalizeInAppPath(link);
          if (!pathname || index.has(pathname)) return;
          index.set(pathname, { level, day: lesson?.day, entry: lesson });
        });
      });
    });
  });

  [...A1_GRAMMAR_ROUTE_ENTRIES.map((entry) => ({ ...entry, level: "A1" })),
    ...A2_GRAMMAR_ROUTE_ENTRIES.map((entry) => ({ ...entry, level: "A2" }))]
    .forEach(({ level, day, route }) => {
      const pathname = normalizeInAppPath(route);
      if (!pathname) return;
      index.set(pathname, { level, day, entry: findLesson(level, day) });
    });

  return index;
};

const grammarRouteIndex = buildGrammarRouteIndex();

const resolveGrammarMatch = (pathname, search) => {
  const normalizedPathname = normalizeInAppPath(pathname);
  const requestedView = new URLSearchParams(search || "").get("view");

  if (requestedView === "workbook") return null;

  const lessonMatch = normalizedPathname.match(/^\/campus\/course\/lesson\/(A1|A2|B1|B2|C1|C2)\/(\d+)$/i);
  if (lessonMatch) {
    if (requestedView !== "grammar") return null;
    const level = lessonMatch[1].toUpperCase();
    const day = Number(lessonMatch[2]);
    return { level, day, entry: findLesson(level, day) };
  }

  return grammarRouteIndex.get(normalizedPathname) || null;
};

export default function AutoGrammarStartGuide() {
  const { pathname, search } = useLocation();
  const match = useMemo(() => resolveGrammarMatch(pathname, search), [pathname, search]);
  const [mountNode, setMountNode] = useState(null);

  useEffect(() => {
    if (!match || typeof document === "undefined") {
      setMountNode(null);
      return undefined;
    }

    let frameId = null;
    let node = null;
    let attempts = 0;

    const install = () => {
      const main = document.querySelector("main.layout-main");
      if (!main) {
        attempts += 1;
        if (attempts < 40) frameId = window.requestAnimationFrame(install);
        return;
      }

      node = document.createElement("div");
      node.setAttribute("data-auto-grammar-start-guide", "true");
      main.insertBefore(node, main.firstChild);
      setMountNode(node);
    };

    install();

    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      if (node?.parentNode) node.parentNode.removeChild(node);
    };
  }, [match]);

  if (!match || !mountNode) return null;

  return createPortal(
    <div
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
      <WorkbookStartGuide mode="grammar" level={match.level} day={match.day} entry={match.entry} />
    </div>,
    mountNode
  );
}

export const __TESTING__ = { resolveGrammarMatch, buildGrammarRouteIndex };
