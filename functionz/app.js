// app.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const OpenAI = require("openai");
const {
  SPEAKING_FORMATS,
  ALLOWED_LEVELS,
  getAllowedTeile,
} = require("./speakingConfig");
const {
  validationErrorResponse,
  validateSpeakingAnalyzeBody,
  validateSpeakingAnalyzeTextBody,
  validateInteractionScoreBody,
} = require("./validators");

// --- OpenAI client ---
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const app = express();

app.use(cors());
app.use(express.json());

// --- Google Sheets config for practice questions ---
const SHEET_ID = "1zaAT5NjRGKiITV7EpuSHvYMBHHENMs9Piw3pNcyQtho"; // Exams list
const SHEET_GID = "1161508231"; // Exams list tab
const SHEET_EXPORT_URL = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/export?format=csv&gid=${SHEET_GID}`;
const QUESTIONS_CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

// --- Google Sheets config for writing tasks ---
const WRITING_SHEET_ID = "1RnZ_YHhbGNYxlwq0KN2a-31OpLygpOkkMGVmQSbGiVQ"; // Schreiben sheet
const WRITING_SHEET_GID = "0"; // Schreiben tab
const WRITING_SHEET_EXPORT_URL = `https://docs.google.com/spreadsheets/d/${WRITING_SHEET_ID}/export?format=csv&gid=${WRITING_SHEET_GID}`;
const WRITING_CACHE_TTL_MS = 15 * 60 * 1000; // 15 minutes

// --- Google Sheets config for assignment tracking ---
const ASSIGNMENT_SHEET_ID = "1BRb8p3Rq0VpFCLSwL4eS9tSgXBo9hSWzfW_J_7W36NQ";
const ASSIGNMENT_SHEET_GID = "2121051612";
const ASSIGNMENT_SHEET_EXPORT_URL = `https://docs.google.com/spreadsheets/d/${ASSIGNMENT_SHEET_ID}/export?format=csv&gid=${ASSIGNMENT_SHEET_GID}`;
const ASSIGNMENT_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes
const FETCH_TIMEOUT_MS = 8000;
const FETCH_MAX_ATTEMPTS = 3;
const FETCH_BACKOFF_MS = 500;

// --- Google Sheets config for graded results ---
const RESULTS_SHEET_ID = "1BRb8p3Rq0VpFCLSwL4eS9tSgXBo9hSWzfW_J_7W36NQ";
const RESULTS_SHEET_GID = "2121051612";
const RESULTS_SHEET_EXPORT_URL = `https://docs.google.com/spreadsheets/d/${RESULTS_SHEET_ID}/export?format=csv&gid=${RESULTS_SHEET_GID}`;
const RESULTS_CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

class ExternalFetchError extends Error {
  constructor(message, { status, code, retryable } = {}) {
    super(message);
    this.name = "ExternalFetchError";
    this.status = status;
    this.code = code;
    this.retryable = retryable;
  }
}

let cachedQuestions = {
  fetchedAt: 0,
  data: null,
};

let cachedWritingTasks = {
  fetchedAt: 0,
  data: null,
};

let cachedResults = {
  fetchedAt: 0,
  data: null,
};

function assertValidTeilAndLevel(teil, level) {
  if (!ALLOWED_LEVELS.includes(level)) {
    throw new Error("Invalid level provided. Choose A1, A2, B1, or B2.");
  }

  const allowedTeile = getAllowedTeile(level);
  if (teil && !allowedTeile.includes(teil)) {
    throw new Error(
      "Invalid exam teil provided for the selected level. Choose a supported option."
    );
  }
}

// --- Simple user history persistence ---
const historyBaseDir = process.env.VERCEL
  ? path.join("/tmp", "falowen-exam-coach")
  : path.join(__dirname, "data");
const historyFile = path.join(historyBaseDir, "userHistory.json");
fs.mkdirSync(path.dirname(historyFile), { recursive: true });
const sheetCacheDir = historyBaseDir;
const questionsCacheFile = path.join(sheetCacheDir, "questionsCache.json");
const writingTasksCacheFile = path.join(sheetCacheDir, "writingTasksCache.json");
const assignmentsCacheFile = path.join(sheetCacheDir, "assignmentsCache.json");
const resultsCacheFile = path.join(sheetCacheDir, "resultsCache.json");
fs.mkdirSync(sheetCacheDir, { recursive: true });

function loadHistory() {
  try {
    const raw = fs.readFileSync(historyFile, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    return { users: {} };
  }
}

function saveHistory(history) {
  fs.writeFileSync(historyFile, JSON.stringify(history, null, 2));
}

function getUserHistory(userId) {
  if (!userId) return null;
  const history = loadHistory();
  return history.users[userId] || { targetLevel: "A1", entries: [] };
}

function recordHistoryEntry(userId, entry) {
  if (!userId) return;
  const history = loadHistory();
  if (!history.users[userId]) {
    history.users[userId] = { targetLevel: entry.targetLevel || "A1", entries: [] };
  }

  const userHistory = history.users[userId];
  userHistory.targetLevel = entry.targetLevel || userHistory.targetLevel;
  userHistory.entries.unshift({ ...entry, timestamp: new Date().toISOString() });
  userHistory.entries = userHistory.entries.slice(0, 25);
  saveHistory(history);
}

function buildPromptContext(userId, taskType, targetLevel) {
  const history = getUserHistory(userId);
  const recentEntries = history?.entries?.slice(0, 5) || [];

  const scoreSnapshot = recentEntries.map((item) => ({
    taskType: item.taskType,
    level: item.level,
    overall_score: item.overall_score,
    teil: item.teil,
  }));

  return {
    targetLevel: targetLevel || history?.targetLevel || "A1",
    taskType,
    recentScores: scoreSnapshot,
  };
}

// Ensure uploads directory exists before multer writes streamed chunks
const uploadsDir = process.env.VERCEL
  ? path.join("/tmp", "uploads")
  : path.join(__dirname, "uploads");
fs.mkdirSync(uploadsDir, { recursive: true });

// --- Multer config for audio uploads ---
const upload = multer({
  dest: uploadsDir,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB max
  },
  fileFilter: (req, file, cb) => {
    const isAudio = file.mimetype.startsWith("audio/");
    if (!isAudio) {
      return cb(new Error("Only audio files are allowed"));
    }
    cb(null, true);
  },
});

function splitCsvLine(line) {
  const cells = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];

    if (char === '"' && next === '"' && inQuotes) {
      current += '"';
      i += 1; // skip escaped quote
      continue;
    }

    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }

    if (char === "," && !inQuotes) {
      cells.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current.trim());
  return cells;
}

function parseCsv(csvText) {
  const lines = csvText.split(/\r?\n/).filter((line) => line.trim().length > 0);
  if (lines.length === 0) return [];

  const headers = splitCsvLine(lines[0]);

  return lines.slice(1).map((line) => {
    const values = splitCsvLine(line);
    const row = {};

    headers.forEach((header, idx) => {
      row[header] = values[idx] ?? "";
    });

    return row;
  });
}

function normalizeRowKeys(row = {}) {
  return Object.entries(row).reduce((acc, [key, value]) => {
    if (!key) return acc;
    const normalizedKey = key.toString().trim().toLowerCase();
    acc[normalizedKey] = typeof value === "string" ? value.trim() : value;
    return acc;
  }, {});
}

function sortByDateOrIndex(a, b) {
  const dateA = Date.parse(a.date);
  const dateB = Date.parse(b.date);

  const aHasDate = !Number.isNaN(dateA);
  const bHasDate = !Number.isNaN(dateB);

  if (aHasDate && bHasDate) return dateA - dateB;
  if (aHasDate && !bHasDate) return -1;
  if (!aHasDate && bHasDate) return 1;
  return (a.rawIndex || 0) - (b.rawIndex || 0);
}

function computeResultAttempts(rows = []) {
  const grouped = new Map();

  rows.forEach((row) => {
    const key = `${row.studentCode || ""}__${row.assignment || ""}`.toLowerCase();
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key).push(row);
  });

  grouped.forEach((entries) => {
    entries.sort(sortByDateOrIndex);
    entries.forEach((entry, index) => {
      entry.attempt = index + 1;
      entry.isRetake = index > 0;
    });
  });

  return rows
    .slice()
    .sort((a, b) => sortByDateOrIndex(b, a))
    .map(({ rawIndex, ...rest }) => rest);
}

function buildResultsSummary(rows = []) {
  const perLevel = {};
  const studentSets = {};
  const allStudents = new Set();
  let retakes = 0;

  rows.forEach((row) => {
    const level = row.level || "Unknown";
    perLevel[level] = (perLevel[level] || 0) + 1;

    if (!studentSets[level]) studentSets[level] = new Set();
    if (row.studentCode) {
      const normalizedCode = row.studentCode.toLowerCase();
      studentSets[level].add(normalizedCode);
      allStudents.add(normalizedCode);
    }

    if (row.isRetake) retakes += 1;
  });

  const studentsPerLevel = Object.fromEntries(
    Object.entries(studentSets).map(([level, set]) => [level, set.size])
  );

  return {
    total: rows.length,
    perLevel,
    studentsPerLevel,
    uniqueStudents: allStudents.size,
    retakes,
  };
}

function slugifyId(text, fallback = "writing-task") {
  const normalized = (text || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  return normalized || fallback;
}

function parseDurationMinutes(value, fallback = 15) {
  if (typeof value === "number" && !Number.isNaN(value)) {
    return value;
  }

  const numericText = String(value || "")
    .replace(/,/g, ".")
    .match(/\d+(\.\d+)?/);
  if (!numericText) return fallback;

  const parsed = Number.parseFloat(numericText[0]);
  if (Number.isNaN(parsed)) return fallback;

  return Math.max(5, Math.round(parsed));
}

function logStructured(level, message, metadata = {}) {
  const payload = {
    at: new Date().toISOString(),
    level,
    message,
    ...metadata,
  };

  const serialized = JSON.stringify(payload);
  if (level === "error") {
    console.error(serialized);
  } else {
    console.info(serialized);
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function withRetries(fn, { maxAttempts, baseDelayMs, backoffFactor = 2, onRetry } = {}) {
  let attempt = 0;
  let lastError;

  while (attempt < maxAttempts) {
    try {
      attempt += 1;
      return await fn(attempt);
    } catch (error) {
      lastError = error;
      if (attempt >= maxAttempts) break;

      if (typeof onRetry === "function") {
        onRetry(error, attempt);
      }

      const delay = baseDelayMs * backoffFactor ** (attempt - 1);
      await sleep(delay);
    }
  }

  throw lastError;
}

async function fetchWithTimeout(url, timeoutMs) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { signal: controller.signal });
  } catch (error) {
    if (error.name === "AbortError") {
      const timeoutError = new ExternalFetchError(
        `Request timed out after ${timeoutMs}ms`,
        { code: "timeout", retryable: true }
      );
      timeoutError.isTimeout = true;
      throw timeoutError;
    }

    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}

function readFallbackCache(cacheFile) {
  try {
    const raw = fs.readFileSync(cacheFile, "utf-8");
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : null;
  } catch (error) {
    return null;
  }
}

function writeFallbackCache(cacheFile, data) {
  if (process.env.VERCEL) return;

  try {
    fs.writeFileSync(cacheFile, JSON.stringify(data, null, 2));
  } catch (error) {
    logStructured("error", "Failed to persist fallback cache", {
      cacheFile,
      error: error.message,
    });
  }
}

function readFallbackObject(cacheFile) {
  try {
    const raw = fs.readFileSync(cacheFile, "utf-8");
    return JSON.parse(raw);
  } catch (error) {
    return null;
  }
}

function writeFallbackObject(cacheFile, data) {
  if (process.env.VERCEL) return;

  try {
    fs.writeFileSync(cacheFile, JSON.stringify(data, null, 2));
  } catch (error) {
    logStructured("error", "Failed to persist fallback cache", {
      cacheFile,
      error: error.message,
    });
  }
}

function formatExternalError(error, fallbackMessage) {
  const payload = { error: fallbackMessage };

  if (error instanceof ExternalFetchError) {
    payload.code = error.code || "fetch_failed";
    if (error.status) payload.status = error.status;
    if (typeof error.retryable === "boolean") payload.retryable = error.retryable;
  } else {
    payload.code = "internal_error";
  }

  return payload;
}

function extractChecklist(row) {
  const checklistKeys = Object.keys(row || {}).filter((key) =>
    /(bullet|include|item|point|tip|hint)/i.test(key)
  );

  const checklist = checklistKeys
    .map((key) => row[key]?.trim())
    .filter(Boolean);

  return checklist;
}

async function fetchSheetQuestions() {
  const now = Date.now();
  if (cachedQuestions.data && now - cachedQuestions.fetchedAt < QUESTIONS_CACHE_TTL_MS) {
    return cachedQuestions.data;
  }

  if (typeof fetch !== "function") {
    throw new ExternalFetchError("Fetch API is not available in this runtime.", {
      code: "missing_fetch",
    });
  }

  const fetchCsv = async (attempt) => {
    const response = await fetchWithTimeout(SHEET_EXPORT_URL, FETCH_TIMEOUT_MS);
    logStructured("info", "Fetched speaking sheet", {
      event: "sheet_fetch",
      sheet: "questions",
      attempt,
      status: response.status,
    });

    if (!response.ok) {
      throw new ExternalFetchError(
        `Failed to fetch sheet (status ${response.status})`,
        {
          status: response.status,
          code: "sheet_status_error",
          retryable: response.status >= 500,
        }
      );
    }

    return response.text();
  };

  try {
    const csvText = await withRetries(fetchCsv, {
      maxAttempts: FETCH_MAX_ATTEMPTS,
      baseDelayMs: FETCH_BACKOFF_MS,
      onRetry: (error, attempt) => {
        logStructured("error", "Retrying sheet fetch", {
          event: "sheet_fetch_retry",
          sheet: "questions",
          attempt,
          error: error.message,
          status: error.status,
          timeout: error.isTimeout,
        });
      },
    });

    const rows = parseCsv(csvText);

    const normalized = rows
      .map((row) => {
        const level = row.Level?.trim();
        const teil = row.Teil?.trim();
        const topic =
          row["Topic/Prompt"]?.trim() || row["Topic / Prompt"]?.trim() || "";
        const keyword =
          row["Keyword/Subtopic"]?.trim() || row["Keyword / Subtopic"]?.trim() || "";

        if (!level || !teil || !topic) return null;

        return {
          level,
          teil,
          topic,
          keyword,
        };
      })
      .filter(Boolean);

    cachedQuestions = {
      fetchedAt: now,
      data: normalized,
    };

    writeFallbackCache(questionsCacheFile, normalized);

    return normalized;
  } catch (error) {
    logStructured("error", "Failed to refresh speaking questions", {
      event: "sheet_fetch_failed",
      sheet: "questions",
      status: error.status,
      error: error.message,
      timeout: error.isTimeout,
    });

    const fallback = readFallbackCache(questionsCacheFile);
    if (fallback) {
      cachedQuestions = { fetchedAt: now, data: fallback };
      return fallback;
    }

    throw new ExternalFetchError(
      "Unable to load speaking questions right now. Please try again soon.",
      {
        status: error.status,
        code: error.code || "fetch_failed",
        retryable: error.retryable,
      }
    );
  }
}

async function fetchSheetWritingTasks() {
  const now = Date.now();
  if (
    cachedWritingTasks.data &&
    now - cachedWritingTasks.fetchedAt < WRITING_CACHE_TTL_MS
  ) {
    return cachedWritingTasks.data;
  }

  if (typeof fetch !== "function") {
    throw new ExternalFetchError("Fetch API is not available in this runtime.", {
      code: "missing_fetch",
    });
  }

  const fetchCsv = async (attempt) => {
    const response = await fetchWithTimeout(WRITING_SHEET_EXPORT_URL, FETCH_TIMEOUT_MS);
    logStructured("info", "Fetched writing sheet", {
      event: "sheet_fetch",
      sheet: "writing",
      attempt,
      status: response.status,
    });

    if (!response.ok) {
      throw new ExternalFetchError(
        `Failed to fetch writing sheet (status ${response.status})`,
        {
          status: response.status,
          code: "sheet_status_error",
          retryable: response.status >= 500,
        }
      );
    }

    return response.text();
  };

  try {
    const csvText = await withRetries(fetchCsv, {
      maxAttempts: FETCH_MAX_ATTEMPTS,
      baseDelayMs: FETCH_BACKOFF_MS,
      onRetry: (error, attempt) => {
        logStructured("error", "Retrying writing sheet fetch", {
          event: "sheet_fetch_retry",
          sheet: "writing",
          attempt,
          error: error.message,
          status: error.status,
          timeout: error.isTimeout,
        });
      },
    });

    const rows = parseCsv(csvText);

    const normalized = rows
      .map((row) => {
        const letter =
          row.Letter?.trim() ||
          row["Letter Title"]?.trim() ||
          row["Letter/Prompt"]?.trim() ||
          row["Prompt"]?.trim();
        const level = row.Level?.trim();
        const durationMinutes = parseDurationMinutes(
          row.DurationMinutes || row.Duration || row["Duration (min)"] || row.Time
        );
        const situation =
          row.Situation?.trim() ||
          row["Topic/Prompt"]?.trim() ||
          row.Topic?.trim() ||
          row.Context?.trim() ||
          "";

        const whatToInclude = extractChecklist(row);

        if (!letter || !level) return null;

        return {
          id: slugifyId(letter),
          letter,
          level,
          durationMinutes,
          situation,
          whatToInclude,
        };
      })
      .filter(Boolean);

    cachedWritingTasks = {
      fetchedAt: now,
      data: normalized,
    };

    writeFallbackCache(writingTasksCacheFile, normalized);

    return normalized;
  } catch (error) {
    logStructured("error", "Failed to refresh writing tasks", {
      event: "sheet_fetch_failed",
      sheet: "writing",
      status: error.status,
      error: error.message,
      timeout: error.isTimeout,
    });

    const fallback = readFallbackCache(writingTasksCacheFile);
    if (fallback) {
      cachedWritingTasks = { fetchedAt: now, data: fallback };
      return fallback;
    }

    throw new ExternalFetchError(
      "Unable to load writing tasks right now. Please try again soon.",
      {
        status: error.status,
        code: error.code || "fetch_failed",
      retryable: error.retryable,
    }
    );
  }
}

function normalizeScoreValue(value) {
  if (typeof value === "number" && !Number.isNaN(value)) {
    return value;
  }

  const text = (value || "").toString().trim();
  if (!text) return 0;

  const fraction = text.match(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/);
  if (fraction) {
    const top = Number.parseFloat(fraction[1]);
    const bottom = Number.parseFloat(fraction[2]);
    if (!Number.isNaN(top) && !Number.isNaN(bottom) && bottom > 0) {
      return Math.round((top / bottom) * 100);
    }
  }

  const numericMatch = text.match(/-?\d+(?:\.\d+)?/);
  const numeric = numericMatch ? Number.parseFloat(numericMatch[0]) : NaN;
  return Number.isNaN(numeric) ? 0 : numeric;
}

function parseSheetDate(value) {
  if (!value) return null;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

function normalizeAssignmentRow(row) {
  const studentCode =
    row.studentcode?.trim() ||
    row.StudentCode?.trim() ||
    row["Student Code"]?.trim() ||
    row.Code?.trim() ||
    "";
  const assignment =
    row.assignment?.trim() ||
    row.Assignment?.trim() ||
    row.Task?.trim() ||
    row["Assignment Name"]?.trim() ||
    "";
  const name = row.name?.trim() || row.Name?.trim() || "";
  const comments = row.comments?.trim() || row.Comments?.trim() || "";
  const scoreRaw =
    row.score ||
    row.Score ||
    row.Mark ||
    row.mark ||
    row.Result ||
    row.result ||
    "";
  const dateValue = row.date || row.Date || row.timestamp || row.Timestamp;
  const parsedDate = parseSheetDate(dateValue);
  const level = (row.level || row.Level || "Unspecified").toString().trim() || "Unspecified";
  const link = row.link || row.Link || row.URL || row.url || "";

  if (!studentCode || !assignment || !parsedDate) return null;

  return {
    studentCode,
    name: name || studentCode,
    assignment,
    score: normalizeScoreValue(scoreRaw),
    scoreRaw: scoreRaw ? scoreRaw.toString().trim() : "",
    comments,
    date: parsedDate.toISOString(),
    level,
    link,
  };
}

function dedupeAssignments(rows) {
  const byStudentAndAssignment = new Map();

  rows.forEach((entry) => {
    const key = `${entry.studentCode.toLowerCase()}__${entry.assignment.toLowerCase()}`;
    const existing = byStudentAndAssignment.get(key);

    if (!existing) {
      byStudentAndAssignment.set(key, { ...entry, attempts: 1 });
      return;
    }

    const attempts = (existing.attempts || 1) + 1;
    const entryDate = new Date(entry.date).getTime();
    const existingDate = new Date(existing.date).getTime();
    const shouldReplace = entry.score > existing.score || entryDate > existingDate;

    byStudentAndAssignment.set(
      key,
      shouldReplace ? { ...entry, attempts } : { ...existing, attempts }
    );
  });

  return Array.from(byStudentAndAssignment.values());
}

async function fetchAssignmentData() {
  const now = Date.now();
  if (
    cachedAssignments.data &&
    now - cachedAssignments.fetchedAt < ASSIGNMENT_CACHE_TTL_MS
  ) {
    return cachedAssignments.data;
async function fetchSheetResults() {
  const now = Date.now();
  if (cachedResults.data && now - cachedResults.fetchedAt < RESULTS_CACHE_TTL_MS) {
    return cachedResults.data;
  }

  if (typeof fetch !== "function") {
    throw new ExternalFetchError("Fetch API is not available in this runtime.", {
      code: "missing_fetch",
    });
  }

  const fetchCsv = async (attempt) => {
    const response = await fetchWithTimeout(RESULTS_SHEET_EXPORT_URL, FETCH_TIMEOUT_MS);
    logStructured("info", "Fetched results sheet", {
      event: "sheet_fetch",
      sheet: "results",
      attempt,
      status: response.status,
    });

    if (!response.ok) {
      throw new ExternalFetchError(
        `Failed to fetch assignment sheet (status ${response.status})`,
        {
          status: response.status,
          code: "sheet_status_error",
          retryable: response.status >= 500,
        }
      );
      throw new ExternalFetchError(`Failed to fetch results sheet (status ${response.status})`, {
        status: response.status,
        code: "sheet_status_error",
        retryable: response.status >= 500,
      });
    }

    return response.text();
  };

  try {
    const csvText = await withRetries(fetchCsv, {
      maxAttempts: FETCH_MAX_ATTEMPTS,
      baseDelayMs: FETCH_BACKOFF_MS,
      onRetry: (error, attempt) => {
        logStructured("error", "Retrying results sheet fetch", {
          event: "sheet_fetch_retry",
          sheet: "results",
          attempt,
          error: error.message,
          status: error.status,
          timeout: error.isTimeout,
        });
      },
    });

    const rows = parseCsv(csvText).map((row, index) => ({ ...normalizeRowKeys(row), rawIndex: index }));

    const normalized = rows
      .map((row) => {
        const studentCode = row.studentcode || row["student code"] || row.code;
        const assignment = row.assignment || row.task || row["assignment name"];
        const studentName = row.name || row["student name"] || row.student;
        const score = row.score || row.result;
        const comments = row.comments || row.feedback;
        const date = row.date || row["submitted at"];
        const level = (row.level || "").toUpperCase();
        const link = row.link || row.url;

        if (!studentCode || !assignment || !level) return null;

        return {
          studentCode,
          studentName,
          assignment,
          score,
          comments,
          date,
          level,
          link,
          rawIndex: row.rawIndex,
        };
      })
      .filter(Boolean);

    const resultsWithAttempts = computeResultAttempts(normalized);
    const summary = buildResultsSummary(resultsWithAttempts);

    cachedResults = {
      fetchedAt: now,
      data: { results: resultsWithAttempts, summary, fetchedAt: now },
    };

    writeFallbackCache(resultsCacheFile, cachedResults.data);

    return cachedResults.data;
  } catch (error) {
    logStructured("error", "Failed to refresh results", {
      event: "sheet_fetch_failed",
      sheet: "results",
      status: error.status,
      error: error.message,
      timeout: error.isTimeout,
    });

    const fallback = readFallbackCache(resultsCacheFile);
    if (fallback) {
      const patchedFallback = {
        results: fallback.results || [],
        summary: fallback.summary || buildResultsSummary(fallback.results || []),
        fetchedAt: fallback.fetchedAt || now,
      };
      cachedResults = { fetchedAt: patchedFallback.fetchedAt, data: patchedFallback };
      return patchedFallback;
    }

    throw new ExternalFetchError("Unable to load results right now. Please try again soon.", {
      status: error.status,
      code: error.code || "fetch_failed",
      retryable: error.retryable,
    });
  }
}

// Clean up stale uploads (e.g., if process crashes before fs.unlink runs)
async function cleanOldUploads(maxAgeMs = 60 * 60 * 1000) {
  try {
    const now = Date.now();
    const files = await fs.promises.readdir(uploadsDir);

    await Promise.all(
      files.map(async (file) => {
        const fullPath = path.join(uploadsDir, file);
        const stats = await fs.promises.stat(fullPath);
        if (now - stats.mtimeMs > maxAgeMs) {
          await fs.promises.unlink(fullPath);
        }
      })
    );
  } catch (error) {
    console.error("⚠️ Failed to clean uploads directory:", error);
  }
}

// Initial cleanup plus periodic sweep for chunked/partial uploads that were never deleted
cleanOldUploads().catch(() => {});
setInterval(() => cleanOldUploads().catch(() => {}), 30 * 60 * 1000); // every 30 minutes

// --- Test route ---
app.get("/", (req, res) => {
  res.send("Falowen Exam Coach Backend is running ✅");
});

// --- 1. Transcribe audio ---
async function transcribeAudio(filePath) {
  try {
    const fileStream = fs.createReadStream(filePath);

    const transcription = await openai.audio.transcriptions.create({
      model: "gpt-4o-transcribe", // or "whisper-1"
      file: fileStream,
      language: "de", // hint: German
    });

    return transcription.text;
  } catch (error) {
    console.error("❌ Error during transcription:", error.response?.data || error);
    throw new Error("Transcription failed");
  }
}

// --- 2. Analyze speaking with GPT (Goethe-style feedback) ---
function shouldOfferInteraction(teil, level, explicitFlag = false) {
  if (explicitFlag) return true;

  const normalizedTeil = (teil || "").toLowerCase();
  const normalizedLevel = (level || "").toUpperCase();

  const isB1Interaction =
    normalizedLevel === "B1" &&
    (normalizedTeil.includes("präsentation") ||
      normalizedTeil.includes("planung"));

  const isB2OrHigherDiscussion =
    ["B2", "C1", "C2"].includes(normalizedLevel) &&
    normalizedTeil.includes("diskussion");

  return isB1Interaction || isB2OrHigherDiscussion;
}

async function generateInteractionFollowups(transcript, teil, level) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are the AI examiner/partner in a Goethe-style speaking interaction. Level ${level}. Exam part: ${teil}.
Generate 2-3 natural, concise follow-up questions that keep the conversation moving. Mix brief reactions, clarifying questions and polite interruptions where relevant.
Return JSON {"mode": "examiner|partner", "style_tip": "one sentence on tone", "follow_up_questions": [{"prompt": "", "focus": ""}, ...], "closing_prompt": "short wrap-up or summary request"}.`,
      },
      {
        role: "user",
        content: `Learner just said: ${transcript}`,
      },
    ],
  });

  const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");
  const questions = Array.isArray(parsed.follow_up_questions)
    ? parsed.follow_up_questions
    : [];

  return {
    mode: parsed.mode || "examiner",
    style_tip: parsed.style_tip || "Höflich, knapp und fokussiert.",
    closing_prompt:
      parsed.closing_prompt ||
      "Fasse deine Position in zwei Sätzen zusammen und reagiere kurz auf einen Einwand.",
    followUpQuestions: questions
      .map((q, idx) => ({
        prompt: q.prompt || q.question || `Rückfrage ${idx + 1}?`,
        focus: q.focus || "",
      }))
      .slice(0, 3),
  };
}

async function scoreInteractionLoop({
  initialTranscript,
  followUpTranscript,
  followUpQuestion,
  teil,
  level,
}) {
  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You are an interaction examiner. Evaluate the learner's turn-taking, reactions, follow-up quality and politeness for Goethe level ${level}, part ${teil}. Return JSON with keys: overall_score (0-100), overall_level (A1-C2), summary, turn_taking, follow_up_quality, politeness, strengths [..], improvements [..], practice_phrases [..], next_task_hint.`,
      },
      {
        role: "user",
        content: `Initial contribution: ${initialTranscript}\nFollow-up question: ${followUpQuestion}\nLearner follow-up answer: ${followUpTranscript}`,
      },
    ],
  });

  const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");

  return {
    overall_level: parsed.overall_level || level,
    overall_score:
      typeof parsed.overall_score === "number"
        ? Math.min(Math.max(Math.round(parsed.overall_score), 0), 100)
        : 0,
    summary: parsed.summary || "",
    turn_taking: parsed.turn_taking || "",
    follow_up_quality: parsed.follow_up_quality || "",
    politeness: parsed.politeness || "",
    strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
    improvements: Array.isArray(parsed.improvements) ? parsed.improvements : [],
    practice_phrases: Array.isArray(parsed.practice_phrases)
      ? parsed.practice_phrases
      : [],
    next_task_hint: parsed.next_task_hint || "",
  };
}

async function analyzeSpeaking(transcript, teil, level, userContext = {}, options = {}) {
  try {
    assertValidTeilAndLevel(teil, level);

    // Short description per Teil for the prompt
    let teilDescription = "";
    if (teil && teil.startsWith("Teil 1")) {
      teilDescription = `
This is Teil 1 – Vorstellung.
The student should introduce themselves and ideally mention:
- Name
- Age
- Country
- Place of residence
- Languages
- Job / studies
- Hobbies

For A1, short simple sentences are enough.
Score higher if more of these points are included and sentences are clear.
`;
    } else if (teil && teil.startsWith("Teil 2")) {
      teilDescription = `
This is Teil 2 – Fragen.
The student should ask questions about a topic.
For A1/A2 you expect:
- Correct question word order:
  - W-questions: W-word at the beginning (Wo, Wie, Was, Wann, Warum, Welche ...)
  - Yes/No questions: verb at the beginning.
Mention if the student forgets verb position or uses statements instead of questions.
`;
    } else if (teil && teil.startsWith("Teil 3")) {
      teilDescription = `
This is Teil 3 – Bitten / Planen.
The student should make polite requests or suggestions.
Examples for A1:
- "Können Sie bitte ...?"
- "Kannst du bitte ...?"
- Imperative with "bitte": "Mach bitte das Fenster zu."
Check if the form is polite and fits the idea.
`;
    }

    const contextInfo = buildPromptContext(
      userContext.userId,
      userContext.taskType || teil,
      userContext.targetLevel || level
    );

    const systemPrompt = `
You are an experienced German teacher preparing students for the Goethe ${level} Sprechen exam.
You receive the TRANSCRIPT of the student's spoken answer (already transcribed from audio or typed by the student).

Exam part: ${teil}

${teilDescription}

Learner context (use this to tailor the feedback):
- Target level: ${contextInfo.targetLevel}
- Task type: ${contextInfo.taskType}
- Recent scores (most recent first): ${JSON.stringify(contextInfo.recentScores)}

Your task is to become a fully self-contained coach. Give the student everything they need to improve without another tutor.

Do the following:
1) Understand what the student wanted to say and produce a corrected German version at the same idea level.
2) Score their performance by skill (task fulfilment, fluency, grammar, vocabulary) out of 25 each, plus an overall score out of 100.
3) Decide an overall CEFR level label (A1–B2) for this answer only.
4) List clear strengths and concrete improvements (short bullet sentences in English).
5) Add at least one example correction mapping a student sentence to the fixed version.
6) Provide 2–4 practice phrases they can reuse immediately.
7) Suggest one focused next task hint that can be trained now (e.g., "Use 'weil' to give a reason").

Keep the tone encouraging and specific to their errors. If information is missing, make reasonable, level-appropriate suggestions.

You MUST answer in valid JSON with this exact shape:
{
  "overall_level": "A2",
  "overall_score": 72,
  "corrected_text": "string - corrected German version",
  "scores": {
    "task_fulfilment": 18,
    "fluency": 17,
    "grammar": 19,
    "vocabulary": 18
  },
  "strengths": ["..."],
  "improvements": ["..."],
  "example_corrections": [
    {"student": "Ich habe 20 Jahre alt.", "corrected": "Ich bin 20 Jahre alt."}
  ],
  "practice_phrases": ["..."],
  "next_task_hint": "Next time, focus on using 'weil' to give a reason in at least 2 sentences."
}
Do not include any additional keys.
    `.trim();

    const userPrompt = `
Student transcript (already in text form):
${transcript}
    `.trim();

    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
    });

    const raw = completion.choices[0]?.message?.content || "{}";

    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch (e) {
      console.error("⚠️ Failed to parse JSON from model, raw content:", raw);
      throw new Error("Model returned invalid JSON");
    }

    const baseResult = {
      meta: {
        teil,
        level,
        targetLevel: contextInfo.targetLevel,
        taskType: userContext.taskType || teil,
      },
      transcript,
      feedback: {
        corrected_text: parsed.corrected_text || "",
        overall_level: parsed.overall_level || level,
        overall_score:
          typeof parsed.overall_score === "number"
            ? Math.min(Math.max(Math.round(parsed.overall_score), 0), 100)
            : 0,
        scores: {
          task_fulfilment: parsed.scores?.task_fulfilment || 0,
          fluency: parsed.scores?.fluency || 0,
          grammar: parsed.scores?.grammar || 0,
          vocabulary: parsed.scores?.vocabulary || 0,
        },
        strengths: Array.isArray(parsed.strengths) ? parsed.strengths : [],
        improvements: Array.isArray(parsed.improvements)
          ? parsed.improvements
          : [],
        example_corrections: Array.isArray(parsed.example_corrections)
          ? parsed.example_corrections
          : [],
        practice_phrases: Array.isArray(parsed.practice_phrases)
          ? parsed.practice_phrases
          : [],
        next_task_hint: parsed.next_task_hint || "",
      },
      // Legacy fields kept for backwards compatibility
      mistakes:
        parsed.mistakes ||
        (Array.isArray(parsed.improvements)
          ? parsed.improvements.map((item) => `• ${item}`).join("\n")
          : ""),
      pronunciation: parsed.pronunciation || "",
      score:
        typeof parsed.score === "number"
          ? parsed.score
          : typeof parsed.overall_score === "number"
          ? Math.round(parsed.overall_score / 10)
          : 0,
      comment: parsed.comment || parsed.next_task_hint || "",
    };

    if (shouldOfferInteraction(teil, level, options.interactionMode)) {
      baseResult.interaction = await generateInteractionFollowups(
        transcript,
        teil,
        level
      );
    }

    return baseResult;
  } catch (error) {
    console.error("❌ Error during speaking analysis:", error.response?.data || error);
    throw new Error("Speaking analysis failed");
  }
}

// --- 3A. Audio endpoint: upload audio + get feedback ---
app.post(
  "/api/speaking/analyze",
  upload.single("audio"), // field name: "audio"
  async (req, res) => {
    const validation = validateSpeakingAnalyzeBody(req.body);
    if (!validation.success) {
      return validationErrorResponse(res, validation.errors);
    }

    const file = req.file;

    if (!file) {
      return validationErrorResponse(res, [
        { path: ["audio"], message: "Audio file is required (field name: audio)" },
      ]);
    }

    const { teil, level, userId, targetLevel, interactionMode } = validation.data;

    const filePath = file.path || path.join(uploadsDir, file.filename);

    try {
      // 1) Transcribe (currently dummy)
      const transcript = await transcribeAudio(filePath);

      // 2) Analyze
      const analysis = await analyzeSpeaking(
        transcript,
        teil,
        level,
        {
          userId,
          targetLevel,
          taskType: "speaking",
        },
        { interactionMode }
      );

      recordHistoryEntry(userId, {
        taskType: "speaking",
        teil,
        level,
        targetLevel: targetLevel || level,
        overall_score: analysis.feedback?.overall_score,
      });

      // 3) Cleanup temp file
      fs.unlink(filePath, (err) => {
        if (err) console.error("⚠️ Failed to delete temp file:", err);
      });

      return res.json(analysis);
    } catch (error) {
      console.error("❌ Error in /api/speaking/analyze:", error);
      return res.status(500).json({ error: error.message || "Server error" });
    }
  }
);

// --- 3B. Questions endpoint: fetch prompts from Google Sheets ---
app.get("/api/speaking/questions", async (req, res) => {
  const { level, teil } = req.query;

  if (!level || !ALLOWED_LEVELS.includes(level)) {
    return res
      .status(400)
      .json({ error: "Invalid or missing level. Choose A1, A2, B1, or B2." });
  }

  const allowedTeile = getAllowedTeile(level);
  if (teil && !allowedTeile.includes(teil)) {
    return res.status(400).json({ error: "Invalid exam teil provided." });
  }

  try {
    const questions = await fetchSheetQuestions();

    const filtered = questions.filter(
      (q) =>
        q.level?.toUpperCase() === level.toUpperCase() &&
        (!teil || q.teil === teil)
    );

    return res.json({ questions: filtered });
  } catch (error) {
    logStructured("error", "❌ Failed to fetch speaking questions", {
      event: "questions_endpoint_error",
      error: error.message,
      status: error.status,
    });

    return res
      .status(500)
      .json(
        formatExternalError(
          error,
          "Failed to load speaking questions. Please try again."
        )
      );
  }
});

// --- 3C. Writing tasks endpoint: fetch prompts from Google Sheets ---
app.get("/api/writing/tasks", async (req, res) => {
  const { level } = req.query;

  try {
    const tasks = await fetchSheetWritingTasks();
    const filtered = level
      ? tasks.filter((task) => task.level?.toUpperCase() === level.toUpperCase())
      : tasks;

    return res.json({ tasks: filtered });
  } catch (error) {
    logStructured("error", "❌ Failed to fetch writing tasks", {
      event: "writing_endpoint_error",
      error: error.message,
      status: error.status,
    });

    return res
      .status(500)
      .json(formatExternalError(error, "Failed to load writing tasks."));
  }
});

// --- 3D. Results endpoint: fetch graded attempts from Google Sheets ---
app.get("/api/results", async (req, res) => {
  const { level, studentCode } = req.query;

  try {
    const payload = await fetchSheetResults();
    const normalizedLevel = (level || "").toUpperCase();
    const codeFilter = (studentCode || "").toLowerCase();

    const filteredResults = payload.results.filter((row) => {
      const matchesLevel = normalizedLevel ? row.level === normalizedLevel : true;
      const matchesCode = codeFilter
        ? (row.studentCode || "").toLowerCase().includes(codeFilter)
        : true;
      return matchesLevel && matchesCode;
    });

    const summary = buildResultsSummary(filteredResults);

    return res.json({
      results: filteredResults,
      summary,
      source: "google-sheet",
      fetchedAt: payload.fetchedAt,
    });
  } catch (error) {
    logStructured("error", "❌ Failed to fetch results", {
      event: "results_endpoint_error",
      error: error.message,
      status: error.status,
    });

    return res
      .status(500)
      .json(formatExternalError(error, "Failed to load results."));
  }
});

// --- 3E. Text endpoint: send typed answer + get feedback ---
app.post("/api/speaking/analyze-text", async (req, res) => {
  try {
    const validation = validateSpeakingAnalyzeTextBody(req.body);
    if (!validation.success) {
      return validationErrorResponse(res, validation.errors);
    }

    const { text, teil, level, userId, targetLevel } = validation.data;

    const analysis = await analyzeSpeaking(text, teil || "Teil 1", level || "A1", {
      userId,
      targetLevel,
      taskType: "speaking-text",
    });

    recordHistoryEntry(userId, {
      taskType: "speaking-text",
      teil,
      level,
      targetLevel: targetLevel || level,
      overall_score: analysis.feedback?.overall_score,
    });

    return res.json(analysis);
  } catch (error) {
    console.error("❌ Error in /api/speaking/analyze-text:", error);
    return res.status(500).json({ error: error.message || "Server error" });
  }
});

app.post(
  "/api/speaking/interaction-score",
  upload.single("audio"),
  async (req, res) => {
    const validation = validateInteractionScoreBody(req.body);
    if (!validation.success) {
      return validationErrorResponse(res, validation.errors);
    }

    const { initialTranscript, followUpQuestion, teil, level, userId, targetLevel } =
      validation.data;

    const file = req.file;
    if (!file) {
      return validationErrorResponse(res, [
        { path: ["audio"], message: "Audio file is required (field name: audio)" },
      ]);
    }

    const filePath = file.path || path.join(uploadsDir, file.filename);

    try {
      const followUpTranscript = await transcribeAudio(filePath);

      const interactionScore = await scoreInteractionLoop({
        initialTranscript,
        followUpTranscript,
        followUpQuestion,
        teil,
        level,
      });

      const scoreForBars = interactionScore.overall_score || 0;
      const balancedScore = Math.round(scoreForBars / 4);

      const responsePayload = {
        meta: {
          teil,
          level,
          targetLevel: targetLevel || level,
          taskType: "speaking-interaction",
        },
        transcript: followUpTranscript,
        feedback: {
          corrected_text: followUpTranscript,
          overall_level: interactionScore.overall_level,
          overall_score: interactionScore.overall_score,
          scores: {
            task_fulfilment: balancedScore,
            fluency: balancedScore,
            grammar: balancedScore,
            vocabulary: balancedScore,
          },
          strengths: interactionScore.strengths,
          improvements: interactionScore.improvements,
          practice_phrases: interactionScore.practice_phrases,
          next_task_hint: interactionScore.next_task_hint,
        },
        interaction: {
          followUpQuestion,
          initialTranscript,
          followUpTranscript,
          summary: interactionScore.summary,
          turn_taking: interactionScore.turn_taking,
          follow_up_quality: interactionScore.follow_up_quality,
          politeness: interactionScore.politeness,
        },
      };

      recordHistoryEntry(userId, {
        taskType: "speaking-interaction",
        teil,
        level,
        targetLevel: targetLevel || level,
        overall_score: interactionScore.overall_score,
      });

      fs.unlink(filePath, (err) => {
        if (err) console.error("⚠️ Failed to delete temp file:", err);
      });

      return res.json(responsePayload);
    } catch (error) {
      console.error("❌ Error in /api/speaking/interaction-score:", error);
      return res.status(500).json({ error: error.message || "Interaction scoring failed" });
    }
  }
);

// --- Tutor endpoints ---
app.post("/api/tutor/placement", async (req, res) => {
  const { userId = "guest", targetLevel = "A2", answers = [] } = req.body;

  const contextInfo = buildPromptContext(userId, "placement", targetLevel);
  const joinedAnswers = answers
    .map((item) => `- (${item.taskType || "task"}) ${item.text || ""}`)
    .join("\n");

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a placement bot that estimates a learner's CEFR level (A1-B2). Consider previous scores and tasks when available: ${JSON.stringify(
            contextInfo
          )}. Reply with JSON {"estimated_level": "A2", "confidence": 0.72, "rationale": "...", "next_task_hint": "..."}.`,
        },
        {
          role: "user",
          content: `Mini test answers:\n${joinedAnswers || "No answers provided"}`,
        },
      ],
    });

    const raw = completion.choices[0]?.message?.content || "{}";
    const parsed = JSON.parse(raw);

    recordHistoryEntry(userId, {
      taskType: "placement",
      level: parsed.estimated_level || targetLevel,
      targetLevel: parsed.estimated_level || targetLevel,
      overall_score: Math.round((parsed.confidence || 0) * 100),
    });

    return res.json({
      meta: { targetLevel: parsed.estimated_level || targetLevel },
      placement: parsed,
    });
  } catch (error) {
    console.error("❌ Error in /api/tutor/placement:", error.response?.data || error);
    return res.status(500).json({ error: "Placement failed" });
  }
});

app.get("/api/tutor/next-task", async (req, res) => {
  const userId = req.query.userId || "guest";
  const history = getUserHistory(userId);
  const targetLevel = history?.targetLevel || "A2";

  const contextInfo = buildPromptContext(userId, "next-task", targetLevel);
  const recentScores = contextInfo.recentScores || [];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: `You are a concise German tutor. Given a learner profile (target level ${targetLevel}) and recent scores ${JSON.stringify(
            recentScores
          )}, return JSON {"title": "", "prompt": "", "skill": "speaking|writing|vocab", "tip": "short tip"}.`,
        },
        {
          role: "user",
          content: `Task type: ${contextInfo.taskType}. Target level ${targetLevel}. Recent scores: ${JSON.stringify(
            recentScores
          )}. Suggest the next micro-task in 1-2 sentences.`,
        },
      ],
    });

    const parsed = JSON.parse(completion.choices[0]?.message?.content || "{}");
    return res.json({
      meta: { targetLevel },
      nextTask: parsed,
    });
  } catch (error) {
    console.error("❌ Error in /api/tutor/next-task:", error.response?.data || error);
    return res.status(500).json({ error: "Could not generate next task" });
  }
});

app.get("/api/tutor/weekly-summary", async (req, res) => {
  const userId = req.query.userId || "guest";
  const history = getUserHistory(userId);
  const targetLevel = history?.targetLevel || "A2";
  const recentEntries = history?.entries?.slice(0, 7) || [];

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4.1-mini",
      messages: [
        {
          role: "system",
          content: `You summarize weekly language training. Target level: ${targetLevel}. Use bullet points and keep it under 120 words.`,
        },
        {
          role: "user",
          content: `Recent attempts: ${JSON.stringify(recentEntries)}`,
        },
      ],
    });

    const summary = completion.choices[0]?.message?.content || "Summary unavailable.";
    return res.json({ summary, targetLevel });
  } catch (error) {
    console.error("❌ Error in /api/tutor/weekly-summary:", error.response?.data || error);
    return res.status(500).json({ error: "Could not create weekly summary" });
  }
});

// --- Multer / upload error handler ---
app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  }

  if (err?.message === "Only audio files are allowed") {
    return res.status(400).json({ error: err.message });
  }

  next(err);
});

module.exports = app;
module.exports.splitCsvLine = splitCsvLine;
module.exports.parseCsv = parseCsv;
