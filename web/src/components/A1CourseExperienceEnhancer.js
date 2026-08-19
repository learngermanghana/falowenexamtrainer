import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const COURSE_BOOK_PATH = "/campus/course";
const STYLE_ID = "falowen-a1-course-experience-styles";
const META_ATTRIBUTE = "data-a1-lesson-meta";
const NAV_ATTRIBUTE = "data-a1-teil-navigation";
const HEADER_ATTRIBUTE = "data-a1-lesson-header";
const COURSE_CARD_ATTRIBUTE = "data-a1-course-card";
const COURSE_ACTION_ATTRIBUTE = "data-a1-course-action";
const COURSE_ACTIONS_ATTRIBUTE = "data-a1-course-actions";
const COURSE_DAY_TASK_ATTRIBUTE = "data-a1-day-task";
const COURSE_DAY_TASK_COUNT_ATTRIBUTE = "data-a1-day-task-count";

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
    [${COURSE_CARD_ATTRIBUTE}="true"][${COURSE_DAY_TASK_ATTRIBUTE}="1"] {
      border-left-color: #2563eb !important;
      background: linear-gradient(90deg, rgba(239,246,255,.85), #ffffff 20%) !important;
    }
    [${COURSE_CARD_ATTRIBUTE}="true"][${COURSE_DAY_TASK_ATTRIBUTE}="2"] {
      border-left-color: #8b5cf6 !important;
      background: linear-gradient(90deg, rgba(245,243,255,.9), #ffffff 20%) !important;
    }
    .a1-day-task-chip {
      align-items: center;
      background: #ede9fe;
      border: 1px solid #c4b5fd;
      border-radius: 999px;
      color: #5b21b6;
      display: inline-flex;
      font-size: 12px;
      font-weight: 900;
      margin-top: 6px;
      min-height: 26px;
      padding: 4px 8px;
      white-space: nowrap;
    }
    [${COURSE_ACTIONS_ATTRIBUTE}="true"] {
      align-items: center !important;
      display: flex !important;
      flex-wrap: wrap !important;
      gap: 8px !important;
      justify-content: flex-end !important;
      min-width: 148px;
    }
    [${COURSE_ACTION_ATTRIBUTE}="true"] {
      align-items: center !important;
      background: #2563eb !important;
      border: 1px solid #2563eb !important;
      border-radius: 999px !important;
      box-shadow: 0 8px 18px rgba(37, 99, 235, 0.22) !important;
      box-sizing: border-box !important;
      color: #ffffff !important;
      display: inline-flex !important;
      font-size: 13px !important;
      font-weight: 800 !important;
      justify-content: center !important;
      line-height: 1.2 !important;
      min-height: 44px !important;
      min-width: 132px !important;
      padding: 10px 16px !important;
      text-align: center !important;
      text-decoration: none !important;
      white-space: nowrap !important;
    }
    [${COURSE_ACTION_ATTRIBUTE}="true"]:hover,
    [${COURSE_ACTION_ATTRIBUTE}="true"]:focus-visible {
      background: #1d4ed8 !important;
      border-color: #1d4ed8 !important;
      box-shadow: 0 10px 22px rgba(29, 78, 216, 0.3) !important;
      transform: translateY(-1px);
    }
    [data-a1-coursebook="true"] {
      box-sizing: border-box;
      max-width: 100%;
      min-width: 0;
      overflow-x: clip;
      padding-bottom: max(80px, calc(64px + env(safe-area-inset-bottom))) !important;
      padding-left: env(safe-area-inset-left);
      padding-right: env(safe-area-inset-right);
    }
    [data-a1-coursebook="true"] *,
    [data-a1-coursebook="true"] *::before,
    [data-a1-coursebook="true"] *::after {
      box-sizing: border-box;
      max-width: 100%;
    }
    [data-a1-coursebook="true"] button,
    [data-a1-coursebook="true"] a,
    [data-a1-coursebook="true"] select,
    [data-a1-coursebook="true"] input {
      min-height: 44px;
    }
    [data-a1-coursebook="true"] input[type="checkbox"] {
      min-height: 24px;
      min-width: 24px;
    }
    [data-a1-coursebook="true"] [data-a1-coursebook-tabs="true"] {
      flex-wrap: nowrap !important;
      justify-content: flex-start !important;
      margin-left: -4px;
      margin-right: -4px;
      overflow-x: auto;
      overscroll-behavior-inline: contain;
      padding: 4px;
      scrollbar-width: thin;
      -webkit-overflow-scrolling: touch;
    }
    [data-a1-coursebook="true"] [data-a1-coursebook-tabs="true"] button {
      flex: 0 0 auto;
      white-space: nowrap;
    }
    @media (max-width: 640px) {
      [${NAV_ATTRIBUTE}="true"] { top: 4px; border-radius: 14px; }
      [${COURSE_CARD_ATTRIBUTE}="true"] {
        align-items: stretch !important;
        display: flex !important;
        flex-direction: column !important;
        gap: 12px !important;
        min-width: 0 !important;
        overflow: hidden !important;
        padding: 14px !important;
        width: 100% !important;
      }
      [${COURSE_CARD_ATTRIBUTE}="true"] > * {
        min-width: 0 !important;
        width: 100% !important;
      }
      [${COURSE_ACTIONS_ATTRIBUTE}="true"] {
        align-items: stretch !important;
        flex-direction: column !important;
        min-width: 0;
        width: 100%;
      }
      [${COURSE_ACTION_ATTRIBUTE}="true"] {
        inset: auto !important;
        margin: 0 !important;
        min-width: 0 !important;
        position: static !important;
        transform: none !important;
        width: 100% !important;
      }
      [data-a1-coursebook="true"] { gap: 12px !important; }
      [data-a1-coursebook="true"] [data-a1-coursebook-hero-header="true"],
      [data-a1-coursebook="true"] [data-a1-coursebook-hero-actions="true"],
      [data-a1-coursebook="true"] [data-a1-coursebook-next-card="true"] {
        align-items: stretch !important;
        flex-direction: column !important;
        width: 100%;
      }
      [data-a1-coursebook="true"] [data-a1-coursebook-hero-actions="true"] > *,
      [data-a1-coursebook="true"] [data-a1-coursebook-next-card="true"] > a {
        width: 100%;
      }
      [data-a1-coursebook="true"] [data-a1-course-actions="true"] > * {
        width: 100%;
      }
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

  // The selected header container can be an outer lesson card while the h1
  // lives inside a nested header block. insertBefore requires its reference
  // node to be a direct child, so always mount the metadata beside the title.
  const titleContainer = title.parentElement;
  if (!titleContainer) return;

  let metadata = titleContainer.querySelector(`:scope > [${META_ATTRIBUTE}]`);
  if (!metadata) {
    metadata = root.createElement("div");
    metadata.setAttribute(META_ATTRIBUTE, "true");
    titleContainer.insertBefore(metadata, title);
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

const getActionPathname = (action) => {
  const href = String(action?.getAttribute?.("href") || "").trim();
  if (!href) return "";
  try {
    return new URL(href, "https://falowen.app").pathname;
  } catch {
    return href.split(/[?#]/)[0];
  }
};

const isA1CourseLessonAction = (action) => {
  if (!action) return false;
  if (action.getAttribute(COURSE_ACTION_ATTRIBUTE) === "true") return true;
  const pathname = normalizePath(getActionPathname(action));
  if (/^\/campus\/course\/lesson\/A1\/\d+$/i.test(pathname)) return true;
  return /^(open|start|continue|review) lesson$/i.test(String(action.textContent || "").trim());
};

const clearA1CourseBookAttributes = (root = document, { resetLabels = false } = {}) => {
  root.querySelectorAll(`[${COURSE_ACTION_ATTRIBUTE}="true"]`).forEach((action) => {
    action.removeAttribute(COURSE_ACTION_ATTRIBUTE);
    if (resetLabels) {
      action.textContent = "Open Lesson";
      action.removeAttribute("aria-label");
    }
  });
  root.querySelectorAll(`[${COURSE_ACTIONS_ATTRIBUTE}="true"]`).forEach((element) => element.removeAttribute(COURSE_ACTIONS_ATTRIBUTE));
  root.querySelectorAll(`[${COURSE_CARD_ATTRIBUTE}="true"]`).forEach((element) => {
    element.removeAttribute(COURSE_CARD_ATTRIBUTE);
    element.removeAttribute(COURSE_DAY_TASK_ATTRIBUTE);
    element.removeAttribute(COURSE_DAY_TASK_COUNT_ATTRIBUTE);
  });
  root.querySelectorAll(".a1-day-task-chip").forEach((element) => element.remove());
};

export const applyA1CourseBookFormatting = (root = document, pathname = window.location?.pathname) => {
  if (!root?.querySelectorAll || normalizePath(pathname) !== COURSE_BOOK_PATH) return 0;
  const levelSelect = findCourseLevelSelect(root);
  if (!levelSelect || String(levelSelect.value || "").trim().toUpperCase() !== "A1") {
    clearA1CourseBookAttributes(root, { resetLabels: true });
    return 0;
  }

  let changed = 0;
  const formattedCards = [];
  Array.from(root.querySelectorAll("article a")).forEach((action) => {
    if (!isA1CourseLessonAction(action)) return;
    const card = action.closest("article");
    if (!card) return;

    if (card.getAttribute(COURSE_CARD_ATTRIBUTE) !== "true") changed += 1;
    card.setAttribute(COURSE_CARD_ATTRIBUTE, "true");
    if (!formattedCards.includes(card)) formattedCards.push(card);

    if (action.getAttribute(COURSE_ACTION_ATTRIBUTE) !== "true") changed += 1;
    action.setAttribute(COURSE_ACTION_ATTRIBUTE, "true");
    action.parentElement?.setAttribute(COURSE_ACTIONS_ATTRIBUTE, "true");

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
      changed += 1;
    }
    action.setAttribute("aria-label", `${nextLabel}: ${card.querySelector("h3")?.textContent || "A1 lesson"}`);
  });

  const cardsByDay = new Map();
  formattedCards.forEach((card) => {
    const dayCandidates = Array.from(card.querySelectorAll("*"))
      .filter((element) => /^Day\s+\d+(?:\s|$)/i.test(String(element.textContent || "").trim()))
      .sort((left, right) => {
        const childDifference = left.children.length - right.children.length;
        if (childDifference) return childDifference;
        return String(left.textContent || "").length - String(right.textContent || "").length;
      });
    const dayBadge = dayCandidates[0] || null;
    const day = String(dayBadge?.textContent || "").match(/^Day\s+(\d+)/i)?.[1] || "";
    if (!day) return;
    if (!cardsByDay.has(day)) cardsByDay.set(day, []);
    cardsByDay.get(day).push({ card, dayBadge });
  });

  formattedCards.forEach((card) => {
    const existingChip = card.querySelector(".a1-day-task-chip");
    const groupedEntry = Array.from(cardsByDay.values()).find((entries) => entries.length > 1 && entries.some((entry) => entry.card === card));
    if (!groupedEntry) {
      if (card.hasAttribute(COURSE_DAY_TASK_ATTRIBUTE)) {
        card.removeAttribute(COURSE_DAY_TASK_ATTRIBUTE);
        card.removeAttribute(COURSE_DAY_TASK_COUNT_ATTRIBUTE);
        existingChip?.remove();
        changed += 1;
      }
      return;
    }

    const taskIndex = groupedEntry.findIndex((entry) => entry.card === card) + 1;
    const taskCount = groupedEntry.length;
    const taskLabel = `Task ${taskIndex} of ${taskCount}`;
    if (card.getAttribute(COURSE_DAY_TASK_ATTRIBUTE) !== String(taskIndex)) changed += 1;
    card.setAttribute(COURSE_DAY_TASK_ATTRIBUTE, String(taskIndex));
    card.setAttribute(COURSE_DAY_TASK_COUNT_ATTRIBUTE, String(taskCount));

    let taskChip = existingChip;
    if (!taskChip) {
      taskChip = root.createElement("span");
      taskChip.className = "a1-day-task-chip";
      groupedEntry[taskIndex - 1].dayBadge?.appendChild(taskChip);
      changed += 1;
    }
    if (taskChip.textContent !== taskLabel) {
      taskChip.textContent = taskLabel;
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
  clearA1CourseBookAttributes(root, { resetLabels: true });
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
  getActionPathname,
  isA1CourseLessonAction,
  clearA1CourseBookAttributes,
  cleanupInjectedFormatting,
  ensureStyles,
};
