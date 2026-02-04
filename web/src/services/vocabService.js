/**
 * web/src/services/vocabService.js
 *
 * Works in the browser.
 * Best reliability: publish the sheet to the web, then use PUBLISHED_ID.
 *
 * If the normal export endpoint fails (CORS/permissions), we fall back to the published endpoint.
 */

// Option A (normal sheet) - works if the sheet is "Anyone with link: Viewer" AND CSV response allows CORS
const SHEET_ID = "1I1yAnqzSh3DPjwWRh9cdRSfzNSPsi7o4r5Taj9Y36NU";
const SHEET_GID = "0";
const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${SHEET_GID}`;

// Option B (published-to-web) - most reliable in-browser
// Example from your published link:
// https://docs.google.com/spreadsheets/d/e/<PUBLISHED_ID>/pubhtml
const PUBLISHED_ID =
  "2PACX-1vRSRGvV3i6dtdnl-n3QBj0j0frbCooUlEGRG_l_6XsJlc_OU-DlivYaw2XESuhHNkIxkOiy-ivBdiYc";

const PUBLISHED_CSV_URL = `https://docs.google.com/spreadsheets/d/e/${PUBLISHED_ID}/pub?output=csv`;
const PUBLISHED_HTML_URL = `https://docs.google.com/spreadsheets/d/e/${PUBLISHED_ID}/pubhtml`;

// Use this for the "Open sheet" button in the UI
// If you want staff/editors to open the real sheet, keep the edit URL.
// If you want students to open the published view, use PUBLISHED_HTML_URL.
export const VOCAB_SOURCE_URL = PUBLISHED_ID ? PUBLISHED_HTML_URL : `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit?gid=${SHEET_GID}#gid=${SHEET_GID}`;

const normalizeHeaderKey = (header = "") =>
  String(header || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "") // remove spaces, underscores, hyphens
    .replace(/[()]/g, ""); // remove parentheses

const parseCsv = (text) => {
  const rows = [];
  let currentCell = "";
  let currentRow = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === "\"") {
      if (inQuotes && next === "\"") {
        currentCell += "\"";
        i += 1;
        continue;
      }
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      currentRow.push(currentCell);
      currentCell = "";
      continue;
    }

    if ((char === "\n" || char === "\r") && !inQuotes) {
      if (char === "\r" && next === "\n") i += 1;
      currentRow.push(currentCell);
      rows.push(currentRow);
      currentRow = [];
      currentCell = "";
      continue;
    }

    currentCell += char;
  }

  if (currentCell.length > 0 || currentRow.length > 0) {
    currentRow.push(currentCell);
    rows.push(currentRow);
  }

  return rows
    .map((row) => row.map((cell) => String(cell || "").trim()))
    .filter((row) => row.some((cell) => cell.length > 0));
};

const findIndexByHeader = (headers, candidates) => {
  const normalizedHeaders = headers.map(normalizeHeaderKey);
  const normalizedCandidates = candidates.map(normalizeHeaderKey);
  return normalizedHeaders.findIndex((value) => normalizedCandidates.includes(value));
};

const buildEntry = (row, indices) => {
  const getValue = (idx) => (idx >= 0 && idx < row.length ? String(row[idx] || "").trim() : "");
  const rawLevel = getValue(indices.level);
  const normalizedLevel = rawLevel ? rawLevel.trim().toUpperCase() : "ALL";

  return {
    id: `${normalizedLevel || "ROW"}-${indices.rowNumber}`,
    level: normalizedLevel,
    german: getValue(indices.german),
    english: getValue(indices.english),
    audioNormal: getValue(indices.audioNormal),
    audioSlow: getValue(indices.audioSlow),
  };
};

const fetchCsv = async (url) => {
  // cache-bust so Google doesn't sometimes serve a cached redirect response
  const withBust = url.includes("?") ? `${url}&t=${Date.now()}` : `${url}?t=${Date.now()}`;
  const response = await fetch(withBust);

  if (!response.ok) {
    throw new Error(`CSV responded with status ${response.status}`);
  }

  return response.text();
};

export const fetchVocabularyFromSheet = async () => {
  let csvText = "";

  // Try normal CSV first, then fall back to published CSV (more reliable)
  try {
    csvText = await fetchCsv(SHEET_CSV_URL);
  } catch (err) {
    if (!PUBLISHED_ID) {
      throw new Error(
        `Vocabulary sheet fetch failed. ${err?.message || ""} Make sure the sheet is shared/published.`
      );
    }
    csvText = await fetchCsv(PUBLISHED_CSV_URL);
  }

  const rows = parseCsv(csvText);
  if (!rows.length) return [];

  const headerRow = rows[0];
  const indices = {
    level: findIndexByHeader(headerRow, ["level", "cefr", "lvl"]),
    german: findIndexByHeader(headerRow, ["german", "deutsch", "wort", "word"]),
    english: findIndexByHeader(headerRow, ["english", "englisch", "meaning", "translation"]),
    audioNormal: findIndexByHeader(headerRow, ["audio(normal)", "audionormal", "audio normal", "audio_normal"]),
    audioSlow: findIndexByHeader(headerRow, ["audio(slow)", "audioslow", "audio slow", "audio_slow"]),
  };

  if (indices.level === -1 || indices.german === -1 || indices.english === -1) {
    throw new Error("Vocabulary sheet is missing Level, German or English columns.");
  }

  return rows
    .slice(1)
    .map((row, idx) => buildEntry(row, { ...indices, rowNumber: idx + 1 }))
    .filter((entry) => entry.german || entry.english);
};
