const SHEET_ID = "1I1yAnqzSh3DPjwWRh9cdRSfzNSPsi7o4r5Taj9Y36NU";
const SHEET_GID = "0";

const SHEET_CSV_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${SHEET_GID}`;

const normalizeHeader = (header = "") => header.trim().toLowerCase();

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
      if (char === "\r" && next === "\n") {
        i += 1;
      }

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
    .map((row) => row.map((cell) => cell.trim()))
    .filter((row) => row.some((cell) => cell.length > 0));
};

const findIndexByHeader = (headers, candidates) => {
  const normalized = headers.map(normalizeHeader);
  return normalized.findIndex((value) => candidates.includes(value));
};

const buildEntry = (row, indices) => {
  const getValue = (idx) => (idx >= 0 && idx < row.length ? row[idx].trim() : "");
  const rawLevel = getValue(indices.level);
  const normalizedLevel = rawLevel ? rawLevel.toUpperCase() : "ALL";

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
    throw new Error(`Vocabulary sheet responded with status ${response.status}`);
  }

  const csvText = await response.text();
  const rows = parseCsv(csvText);

  if (!rows.length) return [];

  const headerRow = rows[0];
  const indices = {
    level: findIndexByHeader(headerRow, ["level"]),
    german: findIndexByHeader(headerRow, ["german", "deutsch"]),
    english: findIndexByHeader(headerRow, ["english", "englisch"]),
    audioNormal: findIndexByHeader(headerRow, ["audio (normal)", "audio normal", "audio_normal"]),
    audioSlow: findIndexByHeader(headerRow, ["audio (slow)", "audio slow", "audio_slow"]),
  };

  if (indices.level === -1 || indices.german === -1 || indices.english === -1) {
    throw new Error("Vocabulary sheet is missing Level, German or English columns.");
  }

  const entries = rows.slice(1).map((row, idx) => buildEntry(row, { ...indices, rowNumber: idx + 1 }));

  return entries.filter((entry) => entry.german || entry.english);
};

export const VOCAB_SOURCE_URL = SHEET_CSV_URL;
