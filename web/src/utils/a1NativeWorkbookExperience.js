import { A1_ASSIGNMENT_REGISTRY } from "../data/a1AssignmentRegistry";

const normalizePath = (value = "") => String(value || "").replace(/\/+$/, "") || "/";

export const A1_NATIVE_STABLE_WORKBOOK_PATHS = new Set([
  ...Object.values(A1_ASSIGNMENT_REGISTRY).map(({ workbookRoute }) => workbookRoute),
]);

export const shouldUseNativeA1WorkbookExperience = (pathname = "") =>
  A1_NATIVE_STABLE_WORKBOOK_PATHS.has(normalizePath(pathname));

export const __TESTING__ = { normalizePath };
