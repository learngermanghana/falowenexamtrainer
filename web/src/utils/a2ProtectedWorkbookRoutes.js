import { getConfiguredInAppWorkbookRoute } from "../data/inAppWorkbookRoutes";

export const A2_DAY20_LEGACY_WORKBOOK_PATH =
  "/campus/course/a2-day-20-typische-reklamationssituationen-workbook";
export const A2_DAY20_DYNAMIC_LESSON_PATH = "/campus/course/lesson/A2/20";

export const PROTECTED_A2_WORKBOOK_DAYS = Object.freeze(
  Array.from({ length: 8 }, (_, index) => 21 + index),
);

const PROTECTED_A2_DAY_SET = new Set(PROTECTED_A2_WORKBOOK_DAYS);
const A2_LESSON_ROUTE_PATTERN = /^\/campus\/course\/lesson\/A2\/(\d+)\/?$/i;

const normalizePath = (value = "") => String(value || "").replace(/\/+$/, "") || "/";

export const resolveProtectedA2WorkbookRedirect = ({ pathname = "", search = "" } = {}) => {
  const normalizedPath = normalizePath(pathname);

  // Day 20 starts on the dynamic lesson hub, but its dedicated workbook must
  // remain directly accessible from the Workbook resource, bookmarks and open
  // browser tabs. Do not redirect the restored workbook back to the lesson hub.
  if (normalizedPath === A2_DAY20_LEGACY_WORKBOOK_PATH) return "";

  const match = normalizedPath.match(A2_LESSON_ROUTE_PATTERN);
  if (!match) return "";

  const day = Number(match[1]);
  if (!PROTECTED_A2_DAY_SET.has(day)) return "";

  const params = new URLSearchParams(search || "");
  const view = String(params.get("view") || "").trim().toLowerCase();
  if (view && view !== "workbook") return "";

  const chapter = String(params.get("chapter") || "").trim();
  return getConfiguredInAppWorkbookRoute({ level: "A2", day, chapter }) || "";
};

const normalizedButtonText = (button) =>
  String(button?.textContent || "")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();

export const isDuplicateFloatingCourseSubmitButton = (button) => {
  if (!button || String(button.tagName || "").toUpperCase() !== "BUTTON") return false;
  if (button.getAttribute("aria-haspopup") !== "dialog") return false;
  if (button.style?.position !== "fixed") return false;

  const text = normalizedButtonText(button);
  return text === "submit" || text.endsWith("submit");
};

export const hideDuplicateFloatingCourseSubmitButton = (root = document) => {
  if (!root?.querySelectorAll) return 0;

  let hiddenCount = 0;
  root.querySelectorAll('button[aria-haspopup="dialog"]').forEach((button) => {
    if (!isDuplicateFloatingCourseSubmitButton(button)) return;
    if (button.getAttribute("data-duplicate-course-submit-hidden") === "true") return;

    button.setAttribute("data-duplicate-course-submit-hidden", "true");
    button.setAttribute("aria-hidden", "true");
    button.tabIndex = -1;
    button.style.setProperty("display", "none", "important");
    hiddenCount += 1;
  });

  return hiddenCount;
};
