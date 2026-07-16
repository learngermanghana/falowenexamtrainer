import { A1_ASSIGNMENT_REGISTRY, getA1AssignmentByRoute } from "../data/a1AssignmentRegistry";

const normalizePath = (value = "") => String(value || "").replace(/\/+$/, "") || "/";

export const A1_NATIVE_STABLE_WORKBOOK_PATHS = new Set(
  Object.values(A1_ASSIGNMENT_REGISTRY)
    .filter(({ layoutMode }) => layoutMode === "native")
    .map(({ workbookPath }) => workbookPath),
);

export const shouldUseNativeA1WorkbookExperience = (pathname = "", search = "") =>
  getA1AssignmentByRoute(normalizePath(pathname), search)?.layoutMode === "native";

export const shouldUseCanonicalA1WorkbookExperience = (pathname = "", search = "") =>
  Boolean(getA1AssignmentByRoute(normalizePath(pathname), search));

export const __TESTING__ = { normalizePath };
