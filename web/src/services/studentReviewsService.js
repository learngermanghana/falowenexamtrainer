const normalizeHeaderKey = (header = "") =>
  String(header || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]+/g, "")
    .replace(/[()]/g, "");

const findIndexByHeader = (headers, candidates) => {
  const normalizedHeaders = headers.map(normalizeHeaderKey);
  const normalizedCandidates = candidates.map(normalizeHeaderKey);
  return normalizedHeaders.findIndex((value) => normalizedCandidates.includes(value));
};

const parseCsv = (text) => {
  const rows = [];
  let currentCell = "";
  let currentRow = [];
  let inQuotes = false;

  for (let i = 0; i < text.length; i += 1) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"') {
      if (inQuotes && next === '"') {
        currentCell += '"';
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

const normalizeSheetCsvUrl = (sheetUrl = "") => {
  const trimmed = String(sheetUrl || "").trim();
  if (!trimmed) return "";

  if (trimmed.includes("output=csv") || trimmed.includes("format=csv")) {
    return trimmed;
  }

  try {
    const parsed = new URL(trimmed);
    const publishedMatch = parsed.pathname.match(/\/spreadsheets\/d\/e\/([^/]+)/);
    if (publishedMatch) {
      return `https://docs.google.com/spreadsheets/d/e/${publishedMatch[1]}/pub?output=csv`;
    }

    const sheetMatch = parsed.pathname.match(/\/spreadsheets\/d\/([^/]+)/);
    if (sheetMatch) {
      return `https://docs.google.com/spreadsheets/d/${sheetMatch[1]}/export?format=csv`;
    }
  } catch (error) {
    return trimmed;
  }

  return trimmed;
};

const toStars = (value) => {
  const num = Number(String(value || "").replace(/[^\d.]/g, ""));
  if (!Number.isFinite(num)) return 5;
  return Math.max(1, Math.min(5, Math.round(num)));
};

export const fetchStudentReviewsFromPublishedSheet = async (sheetCsvUrl) => {
  const normalizedUrl = normalizeSheetCsvUrl(sheetCsvUrl);
  if (!normalizedUrl) throw new Error("Student reviews sheet CSV URL is required.");

  const response = await fetch(normalizedUrl.includes("?") ? `${normalizedUrl}&t=${Date.now()}` : `${normalizedUrl}?t=${Date.now()}`);
  if (!response.ok) {
    throw new Error(`Student reviews sheet responded with status ${response.status}`);
  }

  const csvText = await response.text();
  const rows = parseCsv(csvText);
  if (!rows.length) return [];

  const headerRow = rows[0];
  const idx = {
    name: findIndexByHeader(headerRow, ["name", "student", "student name"]),
    country: findIndexByHeader(headerRow, ["country", "location"]),
    level: findIndexByHeader(headerRow, ["level", "cefr", "class"]),
    text: findIndexByHeader(headerRow, ["text", "comment", "comments", "review", "testimonial", "feedback"]),
    stars: findIndexByHeader(headerRow, ["stars", "rating", "score"]),
  };

  const getValue = (row, index) => (index >= 0 && index < row.length ? String(row[index] || "").trim() : "");

  return rows
    .slice(1)
    .map((row, rowIndex) => ({
      id: `sheet-review-${rowIndex + 1}`,
      name: getValue(row, idx.name) || "Falowen student",
      country: getValue(row, idx.country) || "",
      level: getValue(row, idx.level) || "",
      text: getValue(row, idx.text),
      stars: toStars(getValue(row, idx.stars)),
    }))
    .filter((review) => review.text);
};

