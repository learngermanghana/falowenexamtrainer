import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { A1_CANONICAL_LESSON_CATALOG } from "../data/a1CanonicalLessonCatalog";

const NAV_ATTRIBUTE = "data-a1-teil-navigation";
const OVERVIEW_ATTRIBUTE = "data-a1-workbook-overview";
const MANAGED_ATTRIBUTE = "data-a1-tab-managed";
const PREVIOUS_DISPLAY_ATTRIBUTE = "data-a1-tab-previous-display";
const ACTIVE_VIEW_ATTRIBUTE = "data-a1-active-workbook-view";
const LISTENER_ATTRIBUTE = "data-a1-section-tab-listener";

const normalizePath = (value = "") => String(value || "").replace(/\/+$/, "") || "/";
const normalizeText = (value = "") => String(value || "").replace(/\s+/g, " ").trim().toLowerCase();

const SHARED_PRACTICE_PATHS = new Set(
  A1_CANONICAL_LESSON_CATALOG
    .filter((lesson) => lesson.kind === "practice")
    .map((lesson) => normalizePath(lesson.destination)),
);

export const isA1SharedPracticeWorkbookPath = (pathname = "") =>
  SHARED_PRACTICE_PATHS.has(normalizePath(pathname));

export const isA1WorkbookLessonPath = (pathname = "") => {
  const normalized = normalizePath(pathname);
  return (
    /^\/campus\/course\/lesson\/A1\/\d+$/i.test(normalized) ||
    /^\/campus\/course\/a1-day-.*workbook$/i.test(normalized)
  );
};

export const getA1TeilNumber = (value = "") => {
  const match = String(value || "").match(/^\s*Teil\s*(\d+)\b/i);
  return match ? Number(match[1]) : null;
};

const findMainRoot = (root = document) => root.querySelector("main.layout-main") || root.querySelector("main") || root.body;

export const hasNativeTutorMarkedWorkbookTabs = (mainRoot) =>
  Array.from(mainRoot?.querySelectorAll?.('[role="tablist"]') || []).some((tablist) => {
    const labels = Array.from(tablist.querySelectorAll("button")).map((button) => normalizeText(button.textContent));
    return labels.includes("assignment") && labels.includes("submit");
  });

const getTopLevelChild = (mainRoot, element) => {
  let current = element;
  while (current?.parentElement && current.parentElement !== mainRoot) current = current.parentElement;
  return current?.parentElement === mainRoot ? current : null;
};

const isPersistentFooter = (element) => {
  const text = normalizeText(element?.textContent);
  return (
    text.includes("ready for the next lesson") ||
    text.includes("continue directly to") ||
    element?.hasAttribute?.("data-universal-workbook-lesson-navigator")
  );
};

export const findA1WorkbookTeilSections = (mainRoot) => {
  if (!mainRoot?.querySelectorAll) return [];
  const seen = new Set();
  return Array.from(mainRoot.querySelectorAll("h2, h3"))
    .map((heading) => ({ heading, number: getA1TeilNumber(heading.textContent) }))
    .filter(({ number }) => Number.isFinite(number))
    .filter(({ number }) => {
      if (seen.has(number)) return false;
      seen.add(number);
      return true;
    })
    .sort((left, right) => left.number - right.number)
    .map(({ heading, number }) => {
      const suffix = String(heading.textContent || "").replace(/^\s*Teil\s*\d+\s*[·:—-]?\s*/i, "").trim();
      return {
        heading,
        number,
        label: suffix ? `Teil ${number} · ${suffix}` : `Teil ${number}`,
        startElement: getTopLevelChild(mainRoot, heading) || heading.closest("section") || heading.parentElement,
      };
    });
};

export const buildA1WorkbookContentGroups = (mainRoot, sections = []) => {
  if (!mainRoot || !sections.length) return [];
  const children = Array.from(mainRoot.children);
  const starts = sections.map((section) => children.indexOf(section.startElement));
  const uniqueValidStarts = starts.filter((index) => index >= 0);
  const canUseSiblingRanges =
    uniqueValidStarts.length === sections.length && new Set(uniqueValidStarts).size === sections.length;

  if (!canUseSiblingRanges) {
    return sections.map((section) => ({
      ...section,
      elements: [section.heading.closest("section") || section.startElement].filter(Boolean),
    }));
  }

  const lastStart = starts[starts.length - 1];
  let boundary = children.length;
  for (let index = lastStart + 1; index < children.length; index += 1) {
    if (isPersistentFooter(children[index])) {
      boundary = index;
      break;
    }
  }

  return sections.map((section, index) => {
    const start = starts[index];
    const end = index < starts.length - 1 ? starts[index + 1] : boundary;
    return {
      ...section,
      elements: children.slice(start, end).filter((element) => !element.hasAttribute(NAV_ATTRIBUTE)),
    };
  });
};

const hideElement = (element) => {
  if (!element) return;
  if (!element.hasAttribute(MANAGED_ATTRIBUTE)) {
    element.setAttribute(MANAGED_ATTRIBUTE, "true");
    element.setAttribute(PREVIOUS_DISPLAY_ATTRIBUTE, element.style.display || "");
  }
  element.style.display = "none";
  element.setAttribute("aria-hidden", "true");
};

const showElement = (element) => {
  if (!element) return;
  const previousDisplay = element.getAttribute(PREVIOUS_DISPLAY_ATTRIBUTE);
  element.style.display = previousDisplay || "";
  element.removeAttribute("aria-hidden");
};

const setActiveButton = (navigation, activeView) => {
  navigation.querySelectorAll("button").forEach((button) => {
    const label = normalizeText(button.textContent);
    const teilNumber = getA1TeilNumber(button.textContent);
    const isActive =
      (activeView === "overview" && label === "overview") ||
      (activeView === "submit" && label === "submit") ||
      (String(activeView) === String(teilNumber));
    button.setAttribute("data-active", isActive ? "true" : "false");
    button.setAttribute("aria-selected", isActive ? "true" : "false");
  });
};

const createOverviewPanel = (root, groups, activate) => {
  const panel = root.createElement("section");
  panel.setAttribute(OVERVIEW_ATTRIBUTE, "true");
  Object.assign(panel.style, {
    background: "linear-gradient(135deg, #eff6ff, #ffffff)",
    border: "1px solid #bfdbfe",
    borderRadius: "18px",
    boxShadow: "0 10px 26px rgba(37,99,235,.08)",
    display: "grid",
    gap: "12px",
    padding: "16px",
  });

  const heading = root.createElement("h2");
  heading.textContent = "Lesson overview";
  Object.assign(heading.style, { margin: "0", color: "#0f172a", fontSize: "1.2rem" });

  const text = root.createElement("p");
  text.textContent = "Choose one Teil below. Falowen will show only that section so you can focus without scrolling through the full workbook.";
  Object.assign(text.style, { margin: "0", color: "#475569", lineHeight: "1.6" });

  const grid = root.createElement("div");
  Object.assign(grid.style, {
    display: "grid",
    gap: "10px",
    gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))",
  });

  groups.forEach((group) => {
    const button = root.createElement("button");
    button.type = "button";
    button.textContent = group.label;
    button.setAttribute("data-a1-overview-teil", String(group.number));
    Object.assign(button.style, {
      background: "#ffffff",
      border: "1px solid #bfdbfe",
      borderRadius: "14px",
      color: "#1d4ed8",
      cursor: "pointer",
      font: "inherit",
      fontWeight: "800",
      minHeight: "48px",
      padding: "10px 12px",
      textAlign: "left",
    });
    button.addEventListener("click", () => activate(String(group.number)));
    grid.appendChild(button);
  });

  panel.append(heading, text, grid);
  return panel;
};

const findNativeSubmitButton = (mainRoot, navigation) =>
  Array.from(mainRoot.querySelectorAll("button")).find(
    (button) => !navigation.contains(button) && normalizeText(button.textContent) === "submit"
  ) || null;

const restoreManagedElements = (root = document) => {
  root.querySelectorAll(`[${MANAGED_ATTRIBUTE}]`).forEach((element) => {
    showElement(element);
    element.removeAttribute(MANAGED_ATTRIBUTE);
    element.removeAttribute(PREVIOUS_DISPLAY_ATTRIBUTE);
  });
  root.querySelectorAll(`[${OVERVIEW_ATTRIBUTE}]`).forEach((element) => element.remove());
  root.querySelectorAll(`[${ACTIVE_VIEW_ATTRIBUTE}]`).forEach((element) => element.removeAttribute(ACTIVE_VIEW_ATTRIBUTE));
};

export const applyA1WorkbookSectionTabs = (root = document, locationLike = window.location) => {
  if (!isA1WorkbookLessonPath(locationLike?.pathname)) return false;
  if (isA1SharedPracticeWorkbookPath(locationLike?.pathname)) {
    // Shared self-practice pages own their navigation. Keeping this legacy manager off
    // those routes prevents a second overview/nav from hiding the selected practice Teil.
    restoreManagedElements(root);
    return false;
  }
  const mainRoot = findMainRoot(root);

  if (hasNativeTutorMarkedWorkbookTabs(mainRoot)) {
    restoreManagedElements(root);
    return false;
  }

  const navigation = mainRoot.querySelector(`[${NAV_ATTRIBUTE}="true"]`);
  if (!navigation) {
    restoreManagedElements(root);
    return false;
  }

  const sections = findA1WorkbookTeilSections(mainRoot);
  const groups = buildA1WorkbookContentGroups(mainRoot, sections);
  if (!groups.length) {
    // A workbook can change its headings after mount. Never leave content hidden when
    // a practice page removes or replaces the heading that originally created the tabs.
    restoreManagedElements(root);
    return false;
  }

  let overviewPanel = mainRoot.querySelector(`[${OVERVIEW_ATTRIBUTE}="true"]`);

  const activate = (view) => {
    const activeView = String(view || "overview");
    mainRoot.setAttribute(ACTIVE_VIEW_ATTRIBUTE, activeView);

    groups.forEach((group) => {
      group.elements.forEach((element) => {
        if (activeView === String(group.number)) showElement(element);
        else hideElement(element);
      });
    });

    if (overviewPanel) {
      overviewPanel.style.display = activeView === "overview" ? "grid" : "none";
      overviewPanel.setAttribute("aria-hidden", activeView === "overview" ? "false" : "true");
    }
    setActiveButton(navigation, activeView);
  };

  if (!overviewPanel) {
    overviewPanel = createOverviewPanel(root, groups, activate);
    navigation.insertAdjacentElement("afterend", overviewPanel);
  }

  navigation.__a1SectionTabsState = {
    activate,
    mainRoot,
    nativeSubmitButton: findNativeSubmitButton(mainRoot, navigation),
  };

  if (!navigation.hasAttribute(LISTENER_ATTRIBUTE)) {
    navigation.setAttribute(LISTENER_ATTRIBUTE, "true");
    navigation.addEventListener(
      "click",
      (event) => {
        const button = event.target.closest("button");
        if (!button || !navigation.contains(button)) return;
        const state = navigation.__a1SectionTabsState;
        if (!state) return;

        const label = normalizeText(button.textContent);
        const teilNumber = getA1TeilNumber(button.textContent);
        if (label !== "overview" && label !== "submit" && !Number.isFinite(teilNumber)) return;

        event.preventDefault();
        event.stopImmediatePropagation();

        if (label === "submit") {
          state.activate("submit");
          state.nativeSubmitButton?.click();
          return;
        }
        state.activate(label === "overview" ? "overview" : String(teilNumber));
      },
      true
    );
  }

  let activeView = mainRoot.getAttribute(ACTIVE_VIEW_ATTRIBUTE) || "overview";
  if (activeView === "submit") activeView = "overview";
  if (activeView !== "overview" && !groups.some((group) => String(group.number) === activeView)) activeView = "overview";
  activate(activeView);
  return true;
};

export default function A1WorkbookSectionTabs() {
  const location = useLocation();

  useEffect(() => {
    if (!isA1WorkbookLessonPath(location.pathname)) return undefined;
    let scheduled = false;

    const applyTabs = () => {
      scheduled = false;
      applyA1WorkbookSectionTabs(document, location);
    };
    const scheduleTabs = () => {
      if (scheduled) return;
      scheduled = true;
      const schedule = window.requestAnimationFrame || ((callback) => window.setTimeout(callback, 0));
      schedule(applyTabs);
    };

    scheduleTabs();
    const observer = new MutationObserver(scheduleTabs);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      restoreManagedElements(document);
    };
  }, [location.pathname, location.search]);

  return null;
}

export const __TESTING__ = {
  normalizePath,
  normalizeText,
  getTopLevelChild,
  isPersistentFooter,
  restoreManagedElements,
};