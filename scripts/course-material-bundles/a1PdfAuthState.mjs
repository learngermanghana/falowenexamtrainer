// Pure status classifier shared by the A1 PDF renderer diagnostics and tests.
// A rendered public landing screen is not evidence that the lesson is ready.
const PUBLIC_SHELL = /German and French learning in one place|Ready to start learning\?|Create your Falowen account|Connect with your account|Returning Falowen student|Email or student code/i;
const LOADING_SHELL = /^(?:Loading the app[.…]*|Please wait[.…]*|Connecting to Falowen[.…]*)$/i;
const ERROR_SHELL = /Unexpected Application Error|404 Not Found|Page not found|Loading failed/i;

export const classifyA1PdfCoursePage = ({ url = "", expectedUrl = "", text = "", mainText = "" } = {}) => {
  const body = String(text).replace(/\s+/g, " ").trim();
  const main = String(mainText).replace(/\s+/g, " ").trim();
  if (ERROR_SHELL.test(body)) return "app-error";
  if (PUBLIC_SHELL.test(body)) return "public-shell";
  if (!main || LOADING_SHELL.test(main) || main.length < 120) return "loading";
  try {
    const current = new URL(url);
    const expected = new URL(expectedUrl);
    if (current.origin !== expected.origin || current.pathname !== expected.pathname) {
      return "wrong-route";
    }
  } catch {
    return "wrong-route";
  }
  return "ready";
};

export const isRetryableA1PdfCoursePage = (state) =>
  state === "loading" || state === "public-shell";
