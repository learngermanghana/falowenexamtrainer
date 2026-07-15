import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const normalizeText = (value = "") => String(value || "").replace(/\s+/g, " ").trim().toLowerCase();
const normalizePath = (value = "") => String(value || "").replace(/\/+$/, "") || "/";
const MANAGED_DISPLAY = "data-falowen-standard-nav-display";
const INJECTED_TAB = "data-falowen-standard-nav-tab";

const rememberDisplay = (element) => {
  if (!element || element.hasAttribute(MANAGED_DISPLAY)) return;
  element.setAttribute(MANAGED_DISPLAY, element.style.display || "");
};

const showElement = (element) => {
  if (!element) return;
  const previous = element.getAttribute(MANAGED_DISPLAY);
  element.style.display = previous || "";
  element.removeAttribute("aria-hidden");
};

const hideElement = (element) => {
  if (!element) return;
  rememberDisplay(element);
  element.style.display = "none";
  element.setAttribute("aria-hidden", "true");
};

const compactCourseBookBanner = (root = document) => {
  if (normalizePath(window.location.pathname) !== "/campus/course") return;
  const heading = Array.from(root.querySelectorAll("h2")).find(
    (element) => normalizeText(element.textContent) === "course book",
  );
  const hero = heading?.closest("section");
  if (!hero) return;

  hero.setAttribute("data-compact-course-book-banner", "true");
  Object.assign(hero.style, {
    borderRadius: "18px",
    boxShadow: "0 12px 28px rgba(37, 99, 235, 0.20)",
    gap: "10px",
    marginInline: "auto",
    maxWidth: "1120px",
    padding: "14px",
    width: "100%",
  });
  Object.assign(heading.style, {
    fontSize: "22px",
    lineHeight: "1.12",
    margin: "2px 0 4px",
  });

  const directDivs = Array.from(hero.children).filter((element) => element.tagName === "DIV");
  const statGrid = directDivs.find((element) => {
    const labels = normalizeText(element.textContent);
    return labels.includes("lessons") && labels.includes("assignments") && labels.includes("progress");
  });
  if (statGrid) {
    Object.assign(statGrid.style, {
      gap: "8px",
      gridTemplateColumns: "repeat(auto-fit, minmax(96px, 1fr))",
    });
    Array.from(statGrid.children).forEach((card) => {
      Object.assign(card.style, { borderRadius: "12px", padding: "8px 10px" });
      Array.from(card.querySelectorAll("p")).forEach((paragraph, index) => {
        if (index === 0) paragraph.style.fontSize = "11px";
        else paragraph.style.fontSize = "16px";
      });
    });
  }
};

const getTeilSections = (root) => {
  const seen = new Set();
  return Array.from(root.querySelectorAll("h2, h3"))
    .map((heading) => {
      const match = String(heading.textContent || "").match(/^\s*Teil\s*(\d+)\b/i);
      if (!match) return null;
      const number = Number(match[1]);
      const section = heading.closest("section") || heading.parentElement;
      if (!section || seen.has(number)) return null;
      seen.add(number);
      return { number, section };
    })
    .filter(Boolean)
    .sort((left, right) => left.number - right.number);
};

const copyTabAppearance = (source, target) => {
  if (source?.style?.cssText) target.style.cssText = source.style.cssText;
  Object.assign(target.style, {
    flex: "0 0 auto",
    fontWeight: "900",
    minHeight: "44px",
    padding: "9px 14px",
  });
};

const markSelected = (tablist, selectedButton) => {
  Array.from(tablist.querySelectorAll("button")).forEach((button) => {
    const selected = button === selectedButton;
    button.setAttribute("aria-selected", selected ? "true" : "false");
    if (selected) {
      button.style.background = "#2563eb";
      button.style.borderColor = "#2563eb";
      button.style.color = "#ffffff";
    } else if (button.getAttribute(INJECTED_TAB) === "true") {
      button.style.background = "#ffffff";
      button.style.borderColor = "#93c5fd";
      button.style.color = "#1d4ed8";
    }
  });
};

const standardizeA1TutorNavigation = (root = document) => {
  const pathname = normalizePath(window.location.pathname);
  if (!/^\/campus\/course\/(?:lesson\/A1\/\d+|a1-day-.*-workbook)$/i.test(pathname)) return;

  const navigation = root.querySelector('[aria-label="Unified A1 tutor-marked workbook navigation"]');
  const tablist = navigation?.querySelector('[aria-label="A1 workbook sections"]');
  if (!navigation || !tablist) return;

  const main = root.querySelector("main.layout-main") || root.querySelector("main");
  if (!main) return;

  const nativeAssignment = Array.from(main.querySelectorAll('button[role="tab"]')).find(
    (button) => normalizeText(button.textContent) === "assignment",
  );
  if (nativeAssignment && nativeAssignment.getAttribute("aria-selected") !== "true") nativeAssignment.click();

  const sections = getTeilSections(main);
  if (!sections.length) return;

  const overviewButton = Array.from(tablist.querySelectorAll("button")).find(
    (button) => normalizeText(button.textContent) === "overview",
  );
  const submitButton = Array.from(tablist.querySelectorAll("button")).find(
    (button) => normalizeText(button.textContent) === "submit",
  );
  if (!overviewButton || !submitButton) return;

  const overviewCard = main.querySelector('[data-a1-unified-overview-card="true"]');
  const showAssignment = (button) => {
    nativeAssignment?.click();
    sections.forEach(({ section }) => showElement(section));
    if (overviewCard) hideElement(overviewCard);
    markSelected(tablist, button);
  };
  const showTeil = (number, button) => {
    nativeAssignment?.click();
    sections.forEach(({ number: sectionNumber, section }) => {
      if (sectionNumber === number) showElement(section);
      else hideElement(section);
    });
    if (overviewCard) hideElement(overviewCard);
    markSelected(tablist, button);
  };

  let assignmentButton = Array.from(tablist.querySelectorAll("button")).find(
    (button) => normalizeText(button.textContent) === "assignment",
  );
  if (!assignmentButton) {
    assignmentButton = document.createElement("button");
    assignmentButton.type = "button";
    assignmentButton.setAttribute("role", "tab");
    assignmentButton.setAttribute(INJECTED_TAB, "true");
    assignmentButton.textContent = "Assignment";
    copyTabAppearance(overviewButton, assignmentButton);
    assignmentButton.addEventListener("click", () => showAssignment(assignmentButton));
    overviewButton.insertAdjacentElement("afterend", assignmentButton);
  }

  sections.forEach(({ number }) => {
    const existing = Array.from(tablist.querySelectorAll("button")).find(
      (button) => normalizeText(button.textContent) === `teil ${number}`,
    );
    if (existing) return;
    const button = document.createElement("button");
    button.type = "button";
    button.setAttribute("role", "tab");
    button.setAttribute(INJECTED_TAB, "true");
    button.textContent = `Teil ${number}`;
    copyTabAppearance(overviewButton, button);
    button.addEventListener("click", () => showTeil(number, button));
    submitButton.insertAdjacentElement("beforebegin", button);
  });

  if (!tablist.hasAttribute("data-falowen-standard-nav-listener")) {
    tablist.setAttribute("data-falowen-standard-nav-listener", "true");
    tablist.addEventListener("click", (event) => {
      const button = event.target?.closest?.("button");
      if (!button || button.getAttribute(INJECTED_TAB) === "true") return;
      if (normalizeText(button.textContent) === "overview") {
        sections.forEach(({ section }) => hideElement(section));
        if (overviewCard) showElement(overviewCard);
      }
    });
  }
};

export default function CourseBookLayoutStandardizer() {
  const location = useLocation();

  useEffect(() => {
    let scheduled = false;
    const apply = () => {
      compactCourseBookBanner(document);
      standardizeA1TutorNavigation(document);
    };
    const schedule = () => {
      if (scheduled) return;
      scheduled = true;
      const run = window.requestAnimationFrame || ((callback) => window.setTimeout(callback, 0));
      run(() => {
        scheduled = false;
        apply();
      });
    };

    apply();
    const timers = [60, 220, 700].map((delay) => window.setTimeout(schedule, delay));
    const observer = new MutationObserver(schedule);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      timers.forEach((timer) => window.clearTimeout(timer));
      observer.disconnect();
    };
  }, [location.pathname, location.search]);

  return null;
}
