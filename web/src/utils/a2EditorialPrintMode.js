// Deliberately unavailable in any production Vite build.
// This is a local, authenticated editorial rendering surface for Playwright.
// It never grants account/assessment privileges or sets any Firestore state.
export const isLocalA2EditorialPrintMode = ({
  envDev = import.meta.env?.DEV === true,
  location = typeof window !== "undefined" ? window.location : null,
  marker = typeof window !== "undefined" ? window.__FALOWEN_A2_PDF_EDITORIAL__ : false,
} = {}) => Boolean(
  envDev === true &&
  marker === true &&
  location?.protocol === "http:" &&
  (location?.hostname === "127.0.0.1" || location?.hostname === "localhost")
);
