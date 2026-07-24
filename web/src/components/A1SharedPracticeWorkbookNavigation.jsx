import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { A1_CANONICAL_LESSON_CATALOG } from "../data/a1CanonicalLessonCatalog";
import { styles } from "../styles";

const NAV_ATTRIBUTE = "data-a1-shared-practice-navigation";
const MANAGED_ATTRIBUTE = "data-a1-practice-nav-managed";
const PREVIOUS_DISPLAY_ATTRIBUTE = "data-a1-practice-nav-previous-display";
const LEGACY_NAV_HIDDEN_ATTRIBUTE = "data-a1-practice-legacy-nav-hidden";
const LEGACY_NAV_DISPLAY_ATTRIBUTE = "data-a1-practice-legacy-nav-display";
const SHARED_VIEW_PARAM = "workbookTab";

const normalizePath = (value = "") => String(value || "").replace(/\/+$/, "") || "/";
const normalizeText = (value = "") => String(value || "").replace(/\s+/g, " ").trim();

export const A1_SHARED_PRACTICE_LESSONS = Object.freeze(
  A1_CANONICAL_LESSON_CATALOG.filter((lesson) => lesson.kind === "practice"),
);

export const resolveA1SharedPracticeLesson = ({ pathname = "" } = {}) => {
  const normalizedPath = normalizePath(pathname);
  return A1_SHARED_PRACTICE_LESSONS.find(
    (lesson) => normalizePath(lesson.destination) === normalizedPath,
  ) || null;
};

export const hasCompletedA1PracticeMaterials = (search = "") => {
  try {
    return new URLSearchParams(search || "").get("materials") === "done";
  } catch (_error) {
    return false;
  }
};

const firstSectionHeading = (section) =>
  Array.from(section?.querySelectorAll?.("h2, h3") || []).find((heading) => normalizeText(heading.textContent)) || null;

const getTopLevelPracticeChild = (root, element) => {
  let current = element;
  while (current?.parentElement && current.parentElement !== root) current = current.parentElement;
  return current?.parentElement === root ? current : null;
};

const topLevelPracticeSections = (root) => {
  if (!root?.querySelectorAll) return [];
  const seen = new Set();
  return Array.from(root.querySelectorAll("h2, h3"))
    .filter((heading) => /^\s*(Teil|Section)\s*\d+\b/i.test(normalizeText(heading.textContent)))
    .map((heading) => getTopLevelPracticeChild(root, heading) || heading.closest("section") || heading.parentElement)
    .filter(Boolean)
    .filter((element) => {
      if (seen.has(element)) return false;
      seen.add(element);
      return true;
    });
};

const makeSectionLabel = (headingText, index) => {
  const text = normalizeText(headingText);
  const teil = text.match(/^Teil\s*(\d+)\b/i);
  if (teil) return `Teil ${teil[1]}`;
  const section = text.match(/^Section\s*(\d+)\b/i);
  if (section) return `Section ${section[1]}`;
  const numbered = text.match(/^(\d+)\s*[).:-]/);
  if (numbered) return `Part ${numbered[1]}`;
  return `Section ${index + 1}`;
};

export const findA1PracticeSections = (root) =>
  topLevelPracticeSections(root)
    .map((element, index) => {
      const heading = firstSectionHeading(element);
      const title = normalizeText(heading?.textContent);
      if (!heading || !title) return null;
      return {
        key: `section-${index + 1}`,
        label: makeSectionLabel(title, index),
        title,
        element,
      };
    })
    .filter(Boolean);

const findPracticePageRoot = (main) => {
  if (!main) return null;
  const candidates = Array.from(main.children || []).filter(
    (element) =>
      !element.hasAttribute?.(NAV_ATTRIBUTE) &&
      !element.hasAttribute?.("data-a1-radio-first-workbook-route") &&
      !element.hasAttribute?.("data-a1-self-learning-destination-overlay"),
  );

  const ranked = candidates
    .map((element) => ({ element, count: findA1PracticeSections(element).length }))
    .filter(({ count }) => count > 0)
    .sort((left, right) => right.count - left.count);

  if (ranked[0]?.element) return ranked[0].element;
  return findA1PracticeSections(main).length ? main : null;
};

const rememberDisplay = (element) => {
  if (!element || element.hasAttribute(MANAGED_ATTRIBUTE)) return;
  element.setAttribute(MANAGED_ATTRIBUTE, "true");
  element.setAttribute(PREVIOUS_DISPLAY_ATTRIBUTE, element.style.display || "");
};

const hideElement = (element) => {
  rememberDisplay(element);
  element.style.display = "none";
  element.setAttribute("aria-hidden", "true");
};

const showElement = (element) => {
  if (!element) return;
  const previous = element.getAttribute(PREVIOUS_DISPLAY_ATTRIBUTE);
  element.style.display = previous || "";
  element.removeAttribute("aria-hidden");
};

const restorePracticeSections = (root = document) => {
  Array.from(root.querySelectorAll?.(`[${MANAGED_ATTRIBUTE}]`) || []).forEach((element) => {
    showElement(element);
    element.removeAttribute(MANAGED_ATTRIBUTE);
    element.removeAttribute(PREVIOUS_DISPLAY_ATTRIBUTE);
  });
};

const hideLegacyPracticeNavigation = (root) => {
  Array.from(root?.querySelectorAll?.('[data-a1-teil-navigation="true"]') || []).forEach((element) => {
    if (element.hasAttribute(LEGACY_NAV_HIDDEN_ATTRIBUTE)) return;
    element.setAttribute(LEGACY_NAV_HIDDEN_ATTRIBUTE, "true");
    element.setAttribute(LEGACY_NAV_DISPLAY_ATTRIBUTE, element.style.display || "");
    element.style.display = "none";
  });
};

const restoreLegacyPracticeNavigation = (root = document) => {
  Array.from(root.querySelectorAll?.(`[${LEGACY_NAV_HIDDEN_ATTRIBUTE}]`) || []).forEach((element) => {
    element.style.display = element.getAttribute(LEGACY_NAV_DISPLAY_ATTRIBUTE) || "";
    element.removeAttribute(LEGACY_NAV_HIDDEN_ATTRIBUTE);
    element.removeAttribute(LEGACY_NAV_DISPLAY_ATTRIBUTE);
  });
};

const requestedPracticeView = (search = "") => {
  const value = String(new URLSearchParams(search || "").get(SHARED_VIEW_PARAM) || "").trim().toLowerCase();
  // Older links used "overview". The simplified navigator now opens the first
  // real workbook section instead of showing a second, duplicated menu.
  if (value === "overview") return "section-1";
  return /^section-\d+$/.test(value) ? value : "";
};

const sameSectionList = (left = [], right = []) =>
  left.length === right.length &&
  left.every(
    (section, index) =>
      section.key === right[index]?.key &&
      section.title === right[index]?.title &&
      section.element === right[index]?.element,
  );

const navButtonStyle = (selected) => ({
  ...styles.secondaryButton,
  background: selected ? "#2563eb" : "#ffffff",
  borderColor: selected ? "#2563eb" : "#93c5fd",
  color: selected ? "#ffffff" : "#1d4ed8",
  flex: "1 1 110px",
  fontWeight: 900,
  minHeight: 46,
  padding: "10px 14px",
});

export default function A1SharedPracticeWorkbookNavigation() {
  const location = useLocation();
  const navigate = useNavigate();
  const practice = useMemo(
    () => resolveA1SharedPracticeLesson({ pathname: location.pathname }),
    [location.pathname],
  );
  const materialsDone = hasCompletedA1PracticeMaterials(location.search);
  const requestedView = requestedPracticeView(location.search);
  const [activeView, setActiveView] = useState(requestedView || "section-1");
  const [navMount, setNavMount] = useState(null);
  const [sections, setSections] = useState([]);
  const pageRootRef = useRef(null);
  const sectionElementsRef = useRef([]);
  const createdHostRef = useRef(null);

  useEffect(() => {
    setActiveView(requestedView || "section-1");
  }, [location.pathname, requestedView]);

  useEffect(() => {
    if (!practice || !materialsDone || typeof document === "undefined") return undefined;

    let disposed = false;
    let frame = null;
    const install = () => {
      frame = null;
      if (disposed) return;
      const main = document.querySelector("main.layout-main") || document.querySelector("main");
      const pageRoot = findPracticePageRoot(main);
      const nextSections = findA1PracticeSections(pageRoot);
      if (!main || !pageRoot || !nextSections.length) return;

      pageRootRef.current = pageRoot;
      sectionElementsRef.current = nextSections;
      hideLegacyPracticeNavigation(pageRoot);

      let host = main.querySelector(`[${NAV_ATTRIBUTE}="true"]`);
      if (!host) {
        host = document.createElement("div");
        host.setAttribute(NAV_ATTRIBUTE, "true");
        host.setAttribute("data-practice-day", String(practice.day));
        host.setAttribute("data-practice-chapter", String(practice.chapter));
        pageRoot.parentElement?.insertBefore(host, pageRoot);
        createdHostRef.current = host;
      }

      setNavMount((current) => (current === host ? current : host));
      // Include DOM identity in the comparison. Route/search updates can replace
      // workbook nodes while keeping identical headings; stale element refs were
      // the reason a clicked Teil could remain hidden in production.
      setSections((current) => (sameSectionList(current, nextSections) ? current : nextSections));
    };

    const scheduleInstall = () => {
      if (disposed || frame !== null) return;
      const schedule = window.requestAnimationFrame || ((callback) => window.setTimeout(callback, 0));
      frame = schedule(install);
    };

    scheduleInstall();
    const observer = new MutationObserver(scheduleInstall);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      disposed = true;
      observer.disconnect();
      if (frame !== null && window.cancelAnimationFrame) window.cancelAnimationFrame(frame);
      restorePracticeSections(document);
      restoreLegacyPracticeNavigation(document);
      createdHostRef.current?.remove?.();
      createdHostRef.current = null;
      pageRootRef.current = null;
      sectionElementsRef.current = [];
      setNavMount(null);
      setSections([]);
    };
  }, [materialsDone, practice]);

  const syncLocation = useCallback(
    (view) => {
      const next = new URLSearchParams(location.search || "");
      next.set(SHARED_VIEW_PARAM, view);
      // Self-practice deliberately does not write assignmentKey/assignmentId.
      next.delete("assignmentKey");
      next.delete("assignmentId");
      const nextSearch = `?${next.toString()}`;
      if (nextSearch === location.search) return;
      navigate(
        { pathname: location.pathname, search: nextSearch, hash: location.hash },
        { replace: true, state: location.state },
      );
    },
    [location.hash, location.pathname, location.search, location.state, navigate],
  );

  useEffect(() => {
    if (!practice || !materialsDone || !navMount || !sections.length) return;
    const validView = sections.some((section) => section.key === activeView)
      ? activeView
      : sections[0].key;
    if (validView !== activeView) {
      setActiveView(validView);
      return;
    }

    sections.forEach((section) => {
      if (validView === section.key) showElement(section.element);
      else hideElement(section.element);
    });
    hideLegacyPracticeNavigation(pageRootRef.current);
    syncLocation(validView);
  }, [activeView, materialsDone, navMount, practice, sections, syncLocation]);

  const selectView = useCallback((view) => {
    setActiveView(view);
    window.scrollTo?.({ top: 0, behavior: "smooth" });
  }, []);

  if (!practice || !materialsDone || !navMount || !sections.length) return null;

  return createPortal(
    <section
      aria-label="A1 self-practice workbook navigation"
      style={{
        ...styles.card,
        position: "sticky",
        top: 8,
        zIndex: 35,
        border: "2px solid #2563eb",
        background: "linear-gradient(135deg, #dbeafe 0%, #ffffff 74%)",
        margin: "0 0 12px",
        padding: 12,
      }}
    >
      <div style={{ display: "grid", gap: 4, marginBottom: 10 }}>
        <strong>A1 Self-practice · Day {practice.day} · Kapitel {practice.chapter}</strong>
        <span style={{ color: "#475569", lineHeight: 1.5 }}>
          Practice only. Nothing on this page is sent for tutor marking.
        </span>
      </div>
      <div
        role="tablist"
        aria-label="A1 shared self-practice sections"
        style={{ display: "flex", gap: 8, flexWrap: "wrap" }}
      >
        {sections.map((section) => (
          <button
            key={section.key}
            type="button"
            role="tab"
            aria-selected={activeView === section.key}
            style={navButtonStyle(activeView === section.key)}
            onClick={() => selectView(section.key)}
            title={section.title}
          >
            {section.label}
          </button>
        ))}
      </div>
    </section>,
    navMount,
  );
}

export const __TESTING__ = {
  findPracticePageRoot,
  makeSectionLabel,
  normalizePath,
  requestedPracticeView,
  restoreLegacyPracticeNavigation,
  restorePracticeSections,
};
