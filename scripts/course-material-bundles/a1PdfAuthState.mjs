// Pure status classifier shared by the A1 PDF renderer diagnostics and tests.
// A rendered public landing screen is not evidence that the lesson is ready.
const PUBLIC_SHELL = /German and French learning in one place|Ready to start learning\?|Create your Falowen account|Connect with your account|Returning Falowen student|Email or student code/i;
const LOADING_SHELL = /^(?:Loading the app[.…]*|Please wait[.…]*|Connecting to Falowen[.…]*)$/i;
const ERROR_SHELL = /Unexpected Application Error|404 Not Found|Page not found|Loading failed/i;

const normalizePath = (pathname = "") =>
  String(pathname || "/").replace(/\/+$/, "") || "/";

// These are the only interchangeable public hosts for the same Falowen app.
// Do not treat arbitrary redirects or unrelated origins as course content.
export const matchesA1PdfCourseRoute = (actualUrl, requestedUrl) => {
  try {
    const actual = new URL(actualUrl);
    const expected = new URL(requestedUrl);
    const sameOrigin = actual.origin === expected.origin;
    const canonicalHosts = new Set(["falowen.app", "www.falowen.app"]);
    const canonicalAlias = actual.protocol === "https:"
      && expected.protocol === "https:"
      && canonicalHosts.has(actual.hostname)
      && canonicalHosts.has(expected.hostname);
    return (sameOrigin || canonicalAlias)
      && normalizePath(actual.pathname) === normalizePath(expected.pathname);
  } catch {
    return false;
  }
};

export const classifyA1PdfCoursePage = ({ url = "", expectedUrl = "", text = "", mainText = "" } = {}) => {
  const body = String(text).replace(/\s+/g, " ").trim();
  const main = String(mainText).replace(/\s+/g, " ").trim();
  if (ERROR_SHELL.test(body)) return "app-error";
  if (PUBLIC_SHELL.test(body)) return "public-shell";
  if (!main || LOADING_SHELL.test(main) || main.length < 120) return "loading";
  if (!matchesA1PdfCourseRoute(url, expectedUrl)) return "wrong-route";
  return "ready";
};

export const isRetryableA1PdfCoursePage = (state) =>
  state === "loading" || state === "public-shell";
