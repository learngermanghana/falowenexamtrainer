const normalizeHeaderKey = (header = "") =>
  String(header || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "")
    .replace(/[()]/g, "");

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

const fetchCsv = async (url) => {
  const withBust = url.includes("?") ? `${url}&t=${Date.now()}` : `${url}?t=${Date.now()}`;
  const response = await fetch(withBust);

  if (!response.ok) {
    throw new Error(`Results sheet responded with status ${response.status}`);
  }

  return response.text();
};

/**
 * Fetches a published Google Sheet (CSV) containing results.
 * The sheet should include columns like: assignment, level, name, studentcode, score, comments, link, date.
 */
export const fetchResultsFromPublishedSheet = async (sheetCsvUrl) => {
  if (!sheetCsvUrl) throw new Error("Results sheet CSV URL is required.");

  const csvText = await fetchCsv(sheetCsvUrl);
  const rows = parseCsv(csvText);
  if (!rows.length) return [];

  const headerRow = rows[0];
  const indices = {
    assignment: findIndexByHeader(headerRow, ["assignment", "task", "title"]),
    level: findIndexByHeader(headerRow, ["level", "cefr", "lvl"]),
    name: findIndexByHeader(headerRow, ["name", "student", "student name"]),
    studentcode: findIndexByHeader(headerRow, ["studentcode", "student code", "code"]),
    email: findIndexByHeader(headerRow, ["email", "student email"]),
    score: findIndexByHeader(headerRow, ["score", "mark", "marks"]),
    comments: findIndexByHeader(headerRow, ["comments", "feedback", "comment"]),
    link: findIndexByHeader(headerRow, ["link", "url"]),
    date: findIndexByHeader(headerRow, ["date", "createdat", "created_at", "timestamp", "time"]),
  };

  const getValue = (row, idx) => (idx >= 0 && idx < row.length ? String(row[idx] || "").trim() : "");

  return rows.slice(1).map((row, idx) => ({
    id: `${getValue(row, indices.studentcode) || "row"}-${idx + 1}`,
    assignment: getValue(row, indices.assignment) || "Feedback",
    level: (getValue(row, indices.level) || "").toUpperCase(),
    name: getValue(row, indices.name),
    studentcode: getValue(row, indices.studentcode),
    email: getValue(row, indices.email),
    score: (() => {
      const raw = getValue(row, indices.score);
      const asNumber = Number(raw);
      return Number.isFinite(asNumber) ? asNumber : raw;
    })(),
    comments: getValue(row, indices.comments),
    link: getValue(row, indices.link),
    date: getValue(row, indices.date),
  }));
};
