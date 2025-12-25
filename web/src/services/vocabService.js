const SHEET_ID = "1I1yAnqzSh3DPjwWRh9cdRSfzNSPsi7o4r5Taj9Y36NU";
const SHEET_GID = "0";

// CSV endpoint (works best if the sheet is shared "Anyone with link: Viewer" or published)
const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${SHEET_GID}`;

// Use this for the "Open sheet" button in the UI
export const VOCAB_SOURCE_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/edit?gid=${SHEET_GID}#gid=${SHEET_GID}`;

const normalizeHeaderKey = (header = "") =>
  String(header || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "")     // remove spaces, underscores, hyphens
    .replace(/[()]/g, "");       // remove parentheses

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

export const fetchVocabularyFromSheet = async () => {
  const response = await fetch(SHEET_CSV_URL);

  if (!response.ok) {
    throw new Error(
      `Vocabulary sheet responded with status ${response.status}. Make sure the sheet is shared/published.`
    );
  }

  const csvText = await response.text();
  const rows = parseCsv(csvText);

  if (!rows.length) return [];

  const headerRow = rows[0];
  const indices = {
    level: findIndexByHeader(headerRow, ["level", "cefr", "lvl"]),
    german: findIndexByHeader(headerRow, ["german", "deutsch", "wort", "word"]),
    english: findIndexByHeader(headerRow, ["english", "englisch", "meaning", "translation"]),
    audioNormal: findIndexByHeader(headerRow, ["audionormal", "audio(normal)", "audio normal", "audio_normal", "audio"]),
    audioSlow: findIndexByHeader(headerRow, ["audioslow", "audio(slow)", "audio slow", "audio_slow", "audioslowly"]),
  };

  if (indices.level === -1 || indices.german === -1 || indices.english === -1) {
    throw new Error("Vocabulary sheet is missing Level, German or English columns.");
  }

  const entries = rows
    .slice(1)
    .map((row, idx) => buildEntry(row, { ...indices, rowNumber: idx + 1 }))
    .filter((entry) => entry.german || entry.english);

  return entries;
};
