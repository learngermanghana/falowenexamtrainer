import { getBackendUrl } from "./backendUrl";

const backendUrl = getBackendUrl();

const normalizeBaseUrl = (value = "") => String(value || "").trim().replace(/\/+$/, "");
const normalizePath = (path = "") => {
  const value = String(path || "").trim();
  return value.startsWith("/") ? value : `/${value}`;
};

const currentOrigin = () => {
  if (typeof window === "undefined") return "";
  return normalizeBaseUrl(window.location?.origin || "");
};

const sameOriginApiUrl = (path, origin = currentOrigin()) => {
  const normalizedOrigin = normalizeBaseUrl(origin);
  if (!normalizedOrigin) return "";
  const normalizedPath = normalizePath(path);
  const apiPath = normalizedPath === "/api" || normalizedPath.startsWith("/api/")
    ? normalizedPath
    : `/api${normalizedPath}`;
  return `${normalizedOrigin}${apiPath}`;
};

export const buildApiCandidates = (
  path,
  { baseUrl = backendUrl, origin = currentOrigin() } = {},
) => {
  const normalizedPath = normalizePath(path);
  const normalizedBase = normalizeBaseUrl(baseUrl);
  const normalizedOrigin = normalizeBaseUrl(origin);
  const fallbackUrl = sameOriginApiUrl(normalizedPath, normalizedOrigin);
  const candidates = [];

  if (normalizedBase) {
    candidates.push(
      normalizedOrigin && normalizedBase === normalizedOrigin
        ? fallbackUrl
        : `${normalizedBase}${normalizedPath}`,
    );
  }

  if (fallbackUrl) candidates.push(fallbackUrl);
  if (!candidates.length) candidates.push(normalizedPath);

  return [...new Set(candidates.filter(Boolean))];
};

const parseResponse = async (response) => {
  const raw = await response.text();
  let data = null;

  try {
    data = raw ? JSON.parse(raw) : null;
  } catch {
    data = null;
  }

  return { raw, data };
};

const responseMessage = ({ response, raw, data }) =>
  data?.error ||
  data?.message ||
  raw ||
  `Failed to reach the AI coach (HTTP ${response.status})`;

const looksLikeHtml = (raw = "") => /^\s*<!doctype html|^\s*<html/i.test(String(raw || ""));
const isNetworkFailure = (error) =>
  error instanceof TypeError ||
  /networkerror|failed to fetch|load failed|network request failed/i.test(String(error?.message || ""));

export async function callAI({ path, payload, idToken, timeoutMs = 20000 }) {
  const candidates = buildApiCandidates(path);
  const attemptTimeout = Math.max(3000, Math.floor(timeoutMs / Math.max(candidates.length, 1)));
  let lastError = null;

  for (let index = 0; index < candidates.length; index += 1) {
    const candidate = candidates[index];
    const hasFallback = index < candidates.length - 1;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), attemptTimeout);

    try {
      const response = await fetch(candidate, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(idToken ? { Authorization: `Bearer ${idToken}` } : {}),
        },
        body: JSON.stringify(payload || {}),
        signal: controller.signal,
      });

      const { raw, data } = await parseResponse(response);

      if (response.ok && data !== null) return data;
      if (response.ok && !raw) return {};

      if (hasFallback && (response.status === 404 || response.status === 405 || looksLikeHtml(raw))) {
        lastError = new Error(responseMessage({ response, raw, data }));
        continue;
      }

      if (!response.ok) {
        throw new Error(responseMessage({ response, raw, data }));
      }

      throw new Error("The AI service returned an invalid response. Please try again.");
    } catch (error) {
      lastError = error;
      if (hasFallback && (error?.name === "AbortError" || isNetworkFailure(error))) continue;

      if (error?.name === "AbortError") {
        throw new Error("The AI service took too long to respond. Please try again.");
      }
      if (isNetworkFailure(error)) {
        throw new Error("Unable to reach Study Buddy. Check your connection and try again.");
      }
      throw error;
    } finally {
      clearTimeout(timer);
    }
  }

  if (lastError?.name === "AbortError") {
    throw new Error("The AI service took too long to respond. Please try again.");
  }
  if (isNetworkFailure(lastError)) {
    throw new Error("Unable to reach Study Buddy. Check your connection and try again.");
  }
  throw lastError || new Error("Unable to reach Study Buddy. Please try again.");
}

export { backendUrl };
