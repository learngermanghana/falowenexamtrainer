const PUBLIC_AUTH_PATHS = new Set(["/signup", "/login"]);

export const normalizePublicPath = (value = "") =>
  String(value || "").replace(/\/+$/, "") || "/";

export const isPublicAuthPath = (value = "") =>
  PUBLIC_AUTH_PATHS.has(normalizePublicPath(value));

export const PUBLIC_AUTH_ROUTE_LIST = Array.from(PUBLIC_AUTH_PATHS);
