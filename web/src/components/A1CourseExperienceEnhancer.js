import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const COURSE_BOOK_PATH = "/campus/course";
const STYLE_ID = "falowen-a1-course-experience-styles";
const META_ATTRIBUTE = "data-a1-lesson-meta";
const NAV_ATTRIBUTE = "data-a1-teil-navigation";
const HEADER_ATTRIBUTE = "data-a1-lesson-header";
const COURSE_CARD_ATTRIBUTE = "data-a1-course-card";
const COURSE_ACTION_ATTRIBUTE = "data-a1-course-action";

const normalizePath = (value = "") => String(value || "").replace(/\/+$/, "") || "/";
const normalizeText = (value = "") => String(value || "").replace(/\s+/g, " ").trim().toLowerCase();

export const getA1TeilNumber = (value = "") => {
  const match = String(value || "").match(/^\s*Teil\s*(\d+)\b/i);
  return match ? Number(match[1]) : null;
};

export const parseA1LessonRoute = ({ pathname = "", search = "", pageText = "" } = {}) => {
  const normalizedPath = normalizePath(pathname);
  const lessonMatch = normalizedPath.match(/^\/campus\/course\/lesson\/A1\/(\d+)$/i);
  const workbookMatch = normalizedPath.match(/^\/campus\/course\/a1-day-(\d+)-.*(?:workbook|grammar.*)$/i);
  const titleDayMatch = String(pageText || "").match(/\bDay\s*(\d+)\b/i);
  const day = Number(lessonMatch?.[1] || workbookMatch?.[1] || titleDayMatch?.[1] || 0);
  if (!day && !lessonMatch && !workbookMatch) return null;

  const params = new URLSearchParams(String(search || "").replace(/^\?/, ""));
  const chapterFromQuery = params.get("chapter") || "";
  const chapterFromText = String(pageText || "").match(/\b(?:Kapitel|Chapter)\s*([0-9]+(?:\.[0-9]+)?)\b/i)?.[1] || "";

  return {
    day,
    chapter: String(chapterFromQuery || chapterFromText).trim(),
    isWorkbookPath: Boolean(workbookMatch) || params.get("view") === "workbook",
  };
};

export const resolveA1LessonActionLabel = ({ statusText = "", isCurrent = false } = {}) => {
  const normalized = normalizeText(statusText);
  if (/\bpassed\b|self-marked complete|\bcomplete\b/.test(normalized)) return "Review lesson";
  if (/in progress|submitted|resubmitted|needs improvement|awaiting score/.test(normalized)) return "Continue lesson";
  if (isCurrent && !/not started/.test(normalized)) return "Continue lesson";
  return "Start lesson";
};

export const findA1TeilHeadings = (root = document) => {
  if (!root?.querySelectorAll) return [];
  const seen = new Set();
  return Array.from(root.querySelectorAll("h2, h3"))
    .map((heading) => ({ heading, number: getA1TeilNumber(heading.textContent) }))
    .filter(({ number }) => Number.isFinite(number))
    .filter(({ number }) => {
      if (seen.has(number)) return false;
      seen.add(number);
      return true;
    })
    .sort((left, right) => left.number - right.number);
};

const ensureStyles = (root = document) => {
  if (!root?.head || root.getElementById(STYLE_ID)) return;
  const style = root.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    [${HEADER_ATTRIBUTE}="true"] {
      border: 1px solid #bfdbfe !important;
      border-radius: 24px !important;
      background: linear-gradient(135deg, #eff6ff 0%, #ffffff 58%, #f0fdf4 100%) !important;
      box-shadow: 0 18px 38px rgba(37, 99, 235, 0.12) !important;
      padding: clamp(16px, 3vw, 24px) !important;
    }
    [${HEADER_ATTRIBUTE}="true"] h1 {
      color: #0f172a !important;
      font-size: clamp(1.65rem, 4vw, 2.25rem) !important;
      line-height: 1.14 !important;
      letter-spacing: -0.025em !important;
      margin-top: 0 !important;
    }
    [${META_ATTRIBUTE}="true"] {
      display: grid;
      gap: 8px;
      margin: 2px 0 0;
    }
    .a1-lesson-eyebrow {
      color: #1d4ed8;
      font-size: 12px;
      font-weight: 900;
      letter-spacing: .08em;
      margin: 0;
      text-transform: uppercase;
    }
    .a1-lesson-meta-row {
      display: flex;
      flex-wrap: wrap;
      gap: 7px;
    }
    .a1-lesson-meta-chip {
      align-items: center;
      background: rgba(255,255,255,.92);
      border: 1px solid #bfdbfe;
      border-radius: 999px;
      color: #1e3a8a;
      display: inline-flex;
      font-size: 12px;
      font-weight: 800;
      min-height: 30px;
      padding: 5px 10px;
    }
    [${NAV_ATTRIBUTE}="true"] {
      align-items: center;
      background: rgba(255,255,255,.96);
      border: 1px solid #bfdbfe;
      border-radius: 18px;
      box-shadow: 0 12px 28px rgba(15,23,42,.10);
      display: flex;
      gap: 8px;
      margin: 2px 0 4px;
      overflow-x: auto;
      padding: 10px;
      position: sticky;
      scrollbar-width: thin;
      top: 8px;
      z-index: 24;
    }
    [${NAV_ATTRIBUTE}="true"] button {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 999px;
      color: #334155;
      cursor: pointer;
      flex: 0 0 auto;
      font: inherit;
      font-size: 13px;
      font-weight: 800;
      min-height: 40px;
      padding: 8px 13px;
    }
    [${NAV_ATTRIBUTE}="true"] button:hover,
    [${NAV_ATTRIBUTE}="true"] button[data-active="true"] {
      background: #2563eb;
      border-color: #2563eb;
      color: #ffffff;
    }
    [${NAV_ATTRIBUTE}="true"] button[data-submit="true"] {
      background: #ecfdf5;
      border-color: #86efac;
      color: #166534;
    }
    [${COURSE_CARD_ATTRIBUTE}="true"] {
      border-left: 5px solid #93c5fd !important;
      padding: 16px !important;
    }
    [${COURSE_CARD_ATTRIBUTE}="true"] h3 {
      font-size: clamp(1.05rem, 2.8vw, 1.2rem) !important;
      line-height: 1.3 !important;
    }
    [${COURSE_ACTION_ATTRIBUTE}="true"] {
      min-height: 44px !important;
      padding-inline: 16px !important;
    }
    @media (max-width: 640px) {
      [${NAV_ATTRIBUTE}="true"] { top: 4px; border-radius: 14px; }
      [${COURSE_CARD_ATTRIBUTE}="true"] { padding: 14px !important; }
    }
  `;
  root.head.appendChild(style);
};

const findMainRoot = (root = document) => root.querySelector("main.layout-main") || root.querySelector("main") || root.body;

const findLessonHeader = (mainRoot) => {
  const title = mainRoot?.querySelector("h1");
  if (!title) return { title: null, container: null };

  let current = title.parentElement;
  while (current && current !== mainRoot) {
    const hasBackLink = Array.from(current.querySelectorAll("a, button")).some((element) =>
      normalizeText(element.textContent).includes("back to course book")
    );
    if (hasBackLink) return { title, container: current };
    current = current.parentElement;
  }

  return { title, container: title.parentElement };
};

const findNativeSubmitButton = (mainRoot) =>
  Array.from(mainRoot?.querySelectorAll("button") || []).find(
    (button) => normalizeText(button.textContent) === "submit" && !button.closest(`[${NAV_ATTRIBUTE}]`)
  ) || null;

const updateLessonMetadata = ({ root, container, title, routeInfo, sections, submitButton }) => {
  if (!container || !title || !routeInfo) return;
  container.setAttribute(HEADER_ATTRIBUTE, "true");

  let metadata = container.querySelector(`:scope > [${META_ATTRIBUTE}]`);
  if (!metadata) {
    metadata = root.createElement("div");
    metadata.setAttribute(META_ATTRIBUTE, "true");
    container.insertBefore(metadata, title);
  }

  const modeLabel = submitButton ? "Tutor-marked assignment" : sections.length ? "Practice lesson" : "Lesson";
  const eyebrow = `A1 · Day ${routeInfo.day || "–"}${routeInfo.chapter ? ` · Kapitel ${routeInfo.chapter}` : ""}`;
  const signature = `${eyebrow}|${modeLabel}|${sections.length}`;
  if (metadata.getAttribute("data-signature") === signature) return;
  metadata.setAttribute("data-signature", signature);
  metadata.replaceChildren();

  const eyebrowElement = root.createElement("p");
  eyebrowElement.className = "a1-lesson-eyebrow";
  eyebrowElement.textContent = eyebrow;

  const row = root.createElement("div");
  row.className = "a1-lesson-meta-row";
  [modeLabel, sections.length ? `${sections.length} Teil${sections.length === 1 ? "" : "e"}` : "Focused lesson"].forEach((label) => {
    const chip = root.createElement("span");
    chip.className = "a1-lesson-meta-chip";
    chip.textContent = label;
    row.appendChild(chip);
  });

  metadata.append(eyebrowElement, row);
};

const setActiveNavButton = (navigation, activeButton) => {
  navigation.querySelectorAll("button").forEach((button) => {
    button.setAttribute("data-active", button === activeButton ? "true" : "false");
  });
};

const updateTeilNavigation = ({ root, mainRoot, headerContainer, sections, submitButton }) => {
  const existing = mainRoot.querySelector(`[${NAV_ATTRIBUTE}]`);
  if (!sections.length || !headerContainer?.parentElement) {
    existing?.remove();
    return;
  }

  sections.forEach(({ heading, number }) => {
    if (!heading.id) {
      heading.id = `a1-teil-${number}`;
      heading.setAttribute("data-a1-generated-id", "true");
    }
    heading.style.scrollMarginTop = "88px";
  });

  const signature = `${sections.map(({ number, heading }) => `${number}:${normalizeText(heading.textContent)}`).join("|")}|submit:${Boolean(submitButton)}`;
  if (existing?.getAttribute("data-signature") === signature) return;
  existing?.remove();

  const navigation = root.createElement("nav");
  navigation.setAttribute(NAV_ATTRIBUTE, "true");
  navigation.setAttribute("data-signature", signature);
  navigation.setAttribute("aria-label", "A1 lesson sections");

  const addButton = ({ label, onClick, submit = false, active = false }) => {
    const button = root.createElement("button");
    button.type = "button";
    button.textContent = label;
    button.setAttribute("data-active", active ? "true" : "false");
    if (submit) button.setAttribute("data-submit", "true");
    button.addEventListener("click", () => {
      setActiveNavButton(navigation, button);
      onClick();
    });
    navigation.appendChild(button);
  };

  addButton({
    label: "Overview",
    active: true,
    onClick: () => headerContainer.scrollIntoView({ behavior: "smooth", block: "start" }),
  });

  sections.forEach(({ heading, number }) => {
    const suffix = String(heading.textContent || "").replace(/^\s*Teil\s*\d+\s*[·:—-]?\s*/i, "").trim();
    addButton({
      label: suffix ? `Teil ${number} · ${suffix}` : `Teil ${number}`,
      onClick: () => heading.scrollIntoView({ behavior: "smooth", block: "start" }),
    });
  });

  if (submitButton) {
    addButton({ label: "Submit", submit: true, onClick: () => submitButton.click() });
  }

  headerContainer.insertAdjacentElement("afterend", navigation);
};

export const applyA1LessonFormatting = (root = document, locationLike = window.location) => {
  if (!root?.querySelectorAll) return false;
  const mainRoot = findMainRoot(root);
  const { title, container } = findLessonHeader(mainRoot);
  const routeInfo = parseA1LessonRoute({
    pathname: locationLike?.pathname,
    search: locationLike?.search,
    pageText: `${title?.textContent || ""} ${container?.textContent || ""}`,
  });
  if (!routeInfo || !title || !container) return false;

  const sections = findA1TeilHeadings(mainRoot);
  const submitButton = findNativeSubmitButton(mainRoot);
  updateLessonMetadata({ root, container, title, routeInfo, sections, submitButton });
  updateTeilNavigation({ root, mainRoot, headerContainer: container, sections, submitButton });
  return true;
};

const findCourseLevelSelect = (root = document) =>
  Array.from(root.querySelectorAll("select")).find((select) =>
    Array.from(select.options || []).some((option) => /^A1$/i.test(String(option.value || option.textContent || "").trim()))
  ) || null;

export const applyA1CourseBookFormatting = (root = document, pathname = window.location?.pathname) => {
  if (!root?.querySelectorAll || normalizePath(pathname) !== COURSE_BOOK_PATH) return 0;
  const levelSelect = findCourseLevelSelect(root);
  if (!levelSelect || String(levelSelect.value || "").trim().toUpperCase() !== "A1") return 0;

  let changed = 0;
  Array.from(root.querySelectorAll("a")).forEach((action) => {
    const currentLabel = normalizeText(action.textContent);
    if (currentLabel !== "open lesson" && action.getAttribute(COURSE_ACTION_ATTRIBUTE) !== "true") return;
    const card = action.closest("article");
    if (!card) return;

    card.setAttribute(COURSE_CARD_ATTRIBUTE, "true");
    action.setAttribute(COURSE_ACTION_ATTRIBUTE, "true");

    Array.from(card.querySelectorAll("span")).forEach((chip) => {
      const text = String(chip.textContent || "").trim();
      if (/^Chapter\s+/i.test(text)) {
        chip.textContent = text.replace(/^Chapter\s+/i, "Kapitel ");
        changed += 1;
      } else if (/^(Tutor-marked|Tutor Marked Assignment)$/i.test(text)) {
        chip.textContent = "Assignment";
        changed += 1;
      } else if (/^Self-learning$/i.test(text)) {
        chip.textContent = "Practice";
        changed += 1;
      }
    });

    const cardText = normalizeText(card.textContent);
    const isCurrent = Array.from(card.querySelectorAll("span")).some((chip) => normalizeText(chip.textContent) === "current");
    const nextLabel = resolveA1LessonActionLabel({ statusText: cardText, isCurrent });
    if (action.textContent !== nextLabel) {
      action.textContent = nextLabel;
      action.setAttribute("aria-label", `${nextLabel}: ${card.querySelector("h3")?.textContent || "A1 lesson"}`);
      changed += 1;
    }
  });

  return changed;
};

const cleanupInjectedFormatting = (root = document) => {
  root.querySelectorAll(`[${NAV_ATTRIBUTE}], [${META_ATTRIBUTE}]`).forEach((element) => element.remove());
  root.querySelectorAll(`[${HEADER_ATTRIBUTE}]`).forEach((element) => element.removeAttribute(HEADER_ATTRIBUTE));
  root.querySelectorAll('[data-a1-generated-id="true"]').forEach((element) => {
    element.removeAttribute("id");
    element.removeAttribute("data-a1-generated-id");
  });
};

export default function A1CourseExperienceEnhancer() {
  const location = useLocation();

  useEffect(() => {
    ensureStyles(document);
    let scheduled = false;

    const applyFormatting = () => {
      scheduled = false;
      applyA1LessonFormatting(document, location);
      applyA1CourseBookFormatting(document, location.pathname);
    };

    const scheduleFormatting = () => {
      if (scheduled) return;
      scheduled = true;
      const schedule = window.requestAnimationFrame || ((callback) => window.setTimeout(callback, 0));
      schedule(applyFormatting);
    };

    scheduleFormatting();
    const observer = new MutationObserver(scheduleFormatting);
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("change", scheduleFormatting, true);

    return () => {
      observer.disconnect();
      document.removeEventListener("change", scheduleFormatting, true);
      cleanupInjectedFormatting(document);
    };
  }, [location.pathname, location.search]);

  return null;
}

export const __TESTING__ = {
  normalizePath,
  normalizeText,
  findCourseLevelSelect,
  cleanupInjectedFormatting,
};
