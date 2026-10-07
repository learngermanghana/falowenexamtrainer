import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";
import { CURRICULUM_ENTRIES } from "../data/curriculumManifest";
import { getConfiguredInAppWorkbookResourceRoute, normalizeFalowenCourseRoute } from "../data/inAppWorkbookRoutes";
import { resolveAssignmentCanonicalKey } from "../utils/assignmentIdentity";
import { fetchResultsFromPublishedSheet } from "../services/resultsSheetService";
import { EmptyState, InfoBox, PillBadge, SectionHeader, SkeletonRow } from "./ui";

const PASS_MARK = 60;

const formatDate = (value) => {
  if (!value) return "";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? String(value) : parsed.toLocaleString();
};

const safeLower = (value) => String(value || "").toLowerCase();

const toNumericScore = (value) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }
  if (typeof value === "string") {
    const cleaned = value.replace(/[^\d.+-]+/g, "");
    const parsed = Number(cleaned);
    return Number.isFinite(parsed) ? parsed : null;
  }
  return null;
};

const getAssignmentKey = (entry) => safeLower(entry.assignmentId || entry.assignment_id || entry.assignmentKey);

const GENERAL_RESUBMIT_TARGET = "/campus/course?submitWork=1";

const appendSubmissionParams = (route, { level, assignmentKey }) => {
  const parsed = new URL(route, "https://www.falowen.app");
  parsed.searchParams.set("view", "submit");
  parsed.searchParams.set("assignmentKey", assignmentKey);
  parsed.searchParams.set("assignmentId", assignmentKey);
  parsed.searchParams.set("level", level);
  if (level === "A1") parsed.searchParams.set("workbookTab", "submit");
  if (level === "A1" || level === "A2") parsed.searchParams.set("radio", "done");
  return `${parsed.pathname}?${parsed.searchParams.toString()}${parsed.hash || ""}`;
};

export const buildResultResubmitTarget = (item = {}) => {
  const level = String(item.level || "").trim().toUpperCase();
  if (["B2", "C1"].includes(level)) return "/campus/writing";
  if (!["A1", "A2", "B1"].includes(level)) return GENERAL_RESUBMIT_TARGET;

  const assignmentKey = resolveAssignmentCanonicalKey({
    level,
    assignmentId: item.assignmentKey || item.assignmentId || item.assignment_id,
    assignmentTitle: item.assignment,
  });
  if (!assignmentKey) return GENERAL_RESUBMIT_TARGET;

  const curriculumEntry = CURRICULUM_ENTRIES.find((entry) => {
    if (String(entry?.level || "").trim().toUpperCase() !== level) return false;
    const candidates = [
      entry?.canonicalAssignmentId,
      entry?.assignmentId,
      entry?.assignment_id,
      entry?.id,
    ]
      .map((value) => String(value || "").trim().toUpperCase())
      .filter(Boolean);
    return candidates.includes(assignmentKey);
  });
  if (!curriculumEntry) return GENERAL_RESUBMIT_TARGET;

  const workbookRoute =
    getConfiguredInAppWorkbookResourceRoute({
      level,
      day: curriculumEntry.day,
      chapter: curriculumEntry.chapter,
    }) || normalizeFalowenCourseRoute(curriculumEntry.workbookRoute || curriculumEntry.workbook_link);

  if (!workbookRoute) return GENERAL_RESUBMIT_TARGET;
  return appendSubmissionParams(workbookRoute, { level, assignmentKey });
};

const normalizeArray = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  return [];
};

const normalizeObject = (value) => {
  if (value && typeof value === "object" && !Array.isArray(value)) return value;
  if (typeof value === "string" && value.trim()) {
    try {
      const parsed = JSON.parse(value);
      return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
    } catch {
      return {};
    }
  }
  return {};
};

const normalizeBreakdownLabel = (value = "") =>
  String(value || "").trim().toLowerCase().replace(/[^a-zäöüß0-9]+/gi, " ").trim();

const scoreBreakdownCategory = (label = "") => {
  const normalized = normalizeBreakdownLabel(label);
  if (/objective|mcq|reading|listening|lesen|hören|hoeren/.test(normalized)) return "objective";
  if (/writing|schreiben/.test(normalized)) return "writing";
  return normalized || "other";
};

const hasValue = (value) => value !== null && value !== undefined && value !== "";

export const resolveResultScore = (item = {}) => {
  const storedScore = toNumericScore(item.numericScore ?? item.score ?? item.finalScore);
  const objectiveTotal = Number(item.objectiveTotal || 0);
  const objectiveCorrect = Number(item.objectiveCorrect || 0);
  const explicitBreakdown = normalizeArray(item.scoreBreakdown);
  const hasWritingScore = hasValue(item.writingScore);
  const hasNonObjectiveComponent = explicitBreakdown.some(
    (row) => row?.label && scoreBreakdownCategory(row.label) !== "objective",
  );

  if (objectiveTotal > 0 && !hasWritingScore && !hasNonObjectiveComponent) {
    const recordedObjectivePercent = toNumericScore(item.objectiveScore);
    const calculatedObjectivePercent =
      Number.isFinite(objectiveCorrect) && objectiveTotal > 0
        ? Math.round((objectiveCorrect / objectiveTotal) * 100)
        : null;
    const objectivePercent =
      recordedObjectivePercent !== null ? Math.round(recordedObjectivePercent) : calculatedObjectivePercent;
    if (objectivePercent !== null && Number.isFinite(objectivePercent)) {
      return Math.max(0, Math.min(100, objectivePercent));
    }
  }

  return storedScore;
};

const isPlaceholderAssignmentTitle = (value = "") =>
  !String(value || "").trim() ||
  /^(true|false|feedback|result|null|undefined)$/i.test(String(value || "").trim());

export const resolveResultAssignmentTitle = (entry = {}) => {
  const rawTitle = String(entry.assignment || "").trim();
  if (!isPlaceholderAssignmentTitle(rawTitle)) return rawTitle;

  const level = String(entry.level || "").trim().toUpperCase();
  const assignmentKey = String(
    entry.assignmentKey || entry.assignmentId || entry.assignment_id || "",
  ).trim().toUpperCase();

  const curriculumEntry = CURRICULUM_ENTRIES.find((candidate) => {
    if (level && String(candidate?.level || "").trim().toUpperCase() !== level) return false;
    const ids = [
      candidate?.canonicalAssignmentId,
      candidate?.assignmentId,
      candidate?.assignment_id,
      candidate?.id,
    ]
      .map((value) => String(value || "").trim().toUpperCase())
      .filter(Boolean);
    return assignmentKey && ids.includes(assignmentKey);
  });

  if (curriculumEntry) {
    const prefix = [
      curriculumEntry.level,
      Number.isFinite(Number(curriculumEntry.day)) ? `Day ${curriculumEntry.day}` : "",
    ].filter(Boolean).join(" · ");
    const chapter = curriculumEntry.chapter ? ` · Chapter ${curriculumEntry.chapter}` : "";
    return `${prefix}: ${curriculumEntry.title || assignmentKey}${chapter}`;
  }

  if (assignmentKey) return [level, assignmentKey].filter(Boolean).join(" · ");
  return "Result";
};

const splitSentences = (text = "") =>
  String(text || "")
    .replace(/\s+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .map((item) => item.trim())
    .filter(Boolean);

const getMaxWritingScore = (item = {}) => {
  const max = Number(item.maxWritingScore || item.writingMaxScore || item.writingMaxPoints || 0);
  if (Number.isFinite(max) && max > 0) return max;
  const writing = Number(item.writingScore);
  if (Number.isFinite(writing) && writing > 0 && writing <= 50) return 50;
  return 100;
};

const writingScoreToPercent = (writingScore, maxWritingScore = 100) => {
  const score = Number(writingScore);
  const max = Number(maxWritingScore);
  if (!Number.isFinite(score)) return null;
  if (!Number.isFinite(max) || max <= 0) return Math.round(score);
  return Math.max(0, Math.min(100, Math.round((score / max) * 100)));
};

const formatWritingScore = (item = {}) => {
  if (item.writingScore === null || item.writingScore === undefined || item.writingScore === "") return "—";
  const max = getMaxWritingScore(item);
  const percent = writingScoreToPercent(item.writingScore, max);
  if (max && max !== 100) return `${item.writingScore}/${max} → ${percent}%`;
  return `${percent}%`;
};

export const getScoreBreakdownRows = (item = {}) => {
  const rows = [];
  const seenCategories = new Set();
  const addRow = (row) => {
    if (!row?.label) return;
    const category = scoreBreakdownCategory(row.label);
    if (seenCategories.has(category)) return;
    seenCategories.add(category);
    rows.push(row);
  };

  const objectiveTotal = Number(item.objectiveTotal || 0);
  const objectiveCorrect = Number(item.objectiveCorrect || 0);
  if (objectiveTotal > 0) {
    const objectivePercent =
      toNumericScore(item.objectiveScore) ??
      (Number.isFinite(objectiveCorrect) ? Math.round((objectiveCorrect / objectiveTotal) * 100) : null);
    addRow({
      label: "Objective / MCQ",
      score: `${objectiveCorrect || 0}/${objectiveTotal}`,
      detail: `${objectivePercent === null ? "—" : `${Math.round(objectivePercent)}%`} objective score`,
    });
  }

  if (hasValue(item.writingScore)) {
    addRow({
      label: "Writing",
      score: formatWritingScore(item),
      detail: "Task completion, grammar, vocabulary, structure, tone and clarity",
    });
  }

  normalizeArray(item.scoreBreakdown).forEach((row) => {
    addRow({
      label: row?.label,
      score: row?.score ?? row?.value ?? "—",
      detail: row?.reason || row?.detail || "",
    });
  });

  if (!rows.length) {
    const score = resolveResultScore(item);
    addRow({
      label: "Overall score",
      score: `${score ?? "—"}/100`,
      detail: score >= PASS_MARK ? "Passed this task" : "Needs improvement before this task is secure",
    });
  }

  return rows;
};

const formatObjectiveAnswer = (value) => {
  const cleaned = String(value ?? "").trim();
  if (!cleaned || /^blank$/i.test(cleaned) || /^null$/i.test(cleaned) || /^undefined$/i.test(cleaned)) {
    return "No answer";
  }
  return cleaned;
};

const formatObjectiveQuestion = (question, partId = "") => {
  const questionText = String(question ?? "").trim();
  const partText = String(partId ?? "").trim();
  const combined = [partText, questionText].filter(Boolean).join(" ");

  const teilTokens = combined.match(/teil\s*\d+(?:[._-]\d+)?/gi) || [];
  const detailedTeil = teilTokens.find((token) => /[._-]\d+\s*$/i.test(token));
  if (detailedTeil) {
    const match = detailedTeil.match(/teil\s*(\d+)[._-](\d+)/i);
    if (match) return `Teil ${match[1]} – Question ${match[2]}`;
  }

  const dottedQuestion = questionText.match(/^(\d+)[._-](\d+)$/);
  const partMatch = partText.match(/teil\s*(\d+)/i);
  if (dottedQuestion) return `Teil ${dottedQuestion[1]} – Question ${dottedQuestion[2]}`;
  if (partMatch && /^\d+$/.test(questionText)) return `Teil ${partMatch[1]} – Question ${questionText}`;

  const simpleTeil = combined.match(/teil\s*(\d+)/i);
  if (simpleTeil && questionText) {
    const trailingQuestion = questionText.match(/(?:[._-]|\s)(\d+)$/);
    if (trailingQuestion) return `Teil ${simpleTeil[1]} – Question ${trailingQuestion[1]}`;
  }

  return questionText || partText || "Question";
};

const getWrongObjectiveRows = (item = {}) => {
  const wrongAnswers = normalizeArray(item.wrongAnswers);
  if (wrongAnswers.length) {
    return wrongAnswers.map((row, index) => ({
      question: formatObjectiveQuestion(row.question || row.label || index + 1, row.partId || row.part || ""),
      student: formatObjectiveAnswer(row.student || row.submitted || row.answer),
      expected: formatObjectiveAnswer(row.expected || row.correctAnswer || row.correct || "—"),
      partId: row.partId || row.part || "",
    }));
  }

  const details = normalizeObject(item.objectiveDetails);
  return Object.entries(details)
    .map(([question, detail]) => ({ question, ...detail }))
    .filter((row) => row && row.correct === false)
    .map((row) => ({
      question: formatObjectiveQuestion(row.question, row.partId || ""),
      student: formatObjectiveAnswer(row.student || row.submitted),
      expected: formatObjectiveAnswer(row.expected || row.rawExpected || "—"),
      partId: row.partId || "",
    }));
};

const getCorrectionPoints = (item = {}) => {
  const corrections = normalizeArray(item.corrections)
    .map((row) => {
      if (typeof row === "string") return row;
      const from = row.from || row.original || row.student || row.error || "";
      const to = row.to || row.corrected || row.improved || row.correction || "";
      const reason = row.reason || row.note || row.explanation || "";
      if (from && to) return `${from} → ${to}${reason ? ` (${reason})` : ""}`;
      return reason || to || from;
    })
    .filter(Boolean);

  if (corrections.length) return corrections.slice(0, 4);

  const sentences = splitSentences(item.comments);
  const useful = sentences.filter((sentence) => /grammar|verb|word order|article|structure|spelling|correct|improve|missing|task|vocabulary|tone|formal|informal|wrong|revise/i.test(sentence));
  return useful.slice(0, 4);
};

const isGenericFeedbackText = (value = "") =>
  /^(good|great|excellent|ok|okay|passed|true|false|well done)[.!]?$/i.test(
    String(value || "").trim(),
  );

const getWhyThisScore = (item = {}) => {
  const comments = String(item.comments || "").trim().toLowerCase();
  const candidates = [item.markingReason, item.improvementSummary]
    .map((value) => String(value || "").trim())
    .filter(Boolean);

  return (
    candidates.find(
      (value) => !isGenericFeedbackText(value) && value.toLowerCase() !== comments,
    ) || ""
  );
};

const getDistinctFeedbackText = (item = {}) => {
  const feedback = String(item.comments || "").trim();
  if (!feedback || isGenericFeedbackText(feedback)) return "";
  const why = getWhyThisScore(item);
  if (why && feedback.toLowerCase() === why.toLowerCase()) return "";
  return feedback;
};

const getNextStep = () =>
  "Revise the correction points and questions to review, then submit an improved version.";

export const hasStructuredResultFeedback = (item = {}) => {
  const objectiveDetails = normalizeObject(item.objectiveDetails);
  const hasWritingScore =
    item.writingScore !== null && item.writingScore !== undefined && item.writingScore !== "";

  return Boolean(
    String(item.markingReason || "").trim() ||
      String(item.improvementSummary || "").trim() ||
      normalizeArray(item.corrections).length ||
      normalizeArray(item.wrongAnswers).length ||
      normalizeArray(item.scoreBreakdown).length ||
      Object.keys(objectiveDetails).length ||
      Number(item.objectiveTotal || 0) > 0 ||
      hasWritingScore
  );
};

const TextBlock = ({ title, text, maxChars = 650 }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const safeText = String(text || "").trim();
  if (!safeText) return null;

  const isLong = safeText.length > maxChars;
  const visible = expanded || !isLong ? safeText : `${safeText.slice(0, maxChars)}…`;

  return (
    <div style={{ display: "grid", gap: 6 }}>
      <h4 style={styles.resultHeading}>{title}</h4>
      <p style={styles.resultText}>{visible}</p>
      {isLong ? (
        <button
          type="button"
          style={{ ...styles.secondaryButton, padding: "8px 10px", width: "fit-content" }}
          onClick={() => setExpanded((p) => !p)}
        >
          {expanded ? t("resultHistory.showLess") : t("resultHistory.showMore")}
        </button>
      ) : null}
    </div>
  );
};

const FeedbackDetailCard = ({ item }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const breakdownRows = getScoreBreakdownRows(item);
  const wrongObjectiveRows = getWrongObjectiveRows(item);
  const hasStructuredFeedback = hasStructuredResultFeedback(item);
  const correctionPoints = hasStructuredFeedback ? getCorrectionPoints(item) : [];
  const resubmitTarget = buildResultResubmitTarget(item);
  const passed = item.numericScore >= PASS_MARK;
  const objectiveTotal = Number(item.objectiveTotal || 0);
  const objectiveCorrect = Number(item.objectiveCorrect || 0);
  const objectiveNeedsReview = wrongObjectiveRows.length;
  const whyThisScore = getWhyThisScore(item);
  const distinctFeedback = getDistinctFeedbackText(item);
  const shouldShowScoreBreakdown =
    breakdownRows.length > 1 ||
    (breakdownRows.length === 1 && scoreBreakdownCategory(breakdownRows[0].label) !== "objective");
  const objectiveShownInBreakdown =
    shouldShowScoreBreakdown &&
    breakdownRows.some((row) => scoreBreakdownCategory(row.label) === "objective");

  return (
    <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
      {item.scoreWasReconciled ? (
        <div style={{ border: "1px solid #fde68a", borderRadius: 12, background: "#fffbeb", padding: 12 }}>
          <strong>Score corrected from the marked components</strong>
          <p style={{ ...styles.helperText, margin: "6px 0 0", color: "#78350f" }}>
            The saved total ({item.storedNumericScore}/100) did not match the objective result. This page now uses {item.numericScore}/100 from {objectiveCorrect}/{objectiveTotal} correct.
          </p>
        </div>
      ) : null}

      {whyThisScore ? (
        <div style={{ border: "1px solid #dbeafe", borderRadius: 12, background: "#eff6ff", padding: 12, display: "grid", gap: 8 }}>
          <h4 style={{ ...styles.resultHeading, margin: 0 }}>Why you got this score</h4>
          <p style={{ ...styles.resultText, margin: 0 }}>{whyThisScore}</p>
        </div>
      ) : null}

      {shouldShowScoreBreakdown ? (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, background: "#ffffff", overflow: "hidden" }}>
          <div style={{ padding: 10, background: "#f8fafc", fontWeight: 800 }}>Score breakdown</div>
          {breakdownRows.map((row, index) => (
            <div
              key={`${row.label}-${index}`}
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(110px, 1fr) minmax(70px, auto) minmax(0, 1.6fr)",
                gap: 8,
                padding: 10,
                borderTop: "1px solid #e5e7eb",
                fontSize: 13,
              }}
            >
              <strong>{row.label}</strong>
              <span>{row.score}</span>
              <span style={{ color: "#4b5563", overflowWrap: "anywhere" }}>{row.detail}</span>
            </div>
          ))}
        </div>
      ) : null}

      {correctionPoints.length ? (
        <div style={{ border: "1px solid #fde68a", borderRadius: 12, background: "#fffbeb", padding: 12 }}>
          <h4 style={{ ...styles.resultHeading, marginTop: 0 }}>Correction points</h4>
          <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 6 }}>
            {correctionPoints.map((point, index) => (
              <li key={`${point}-${index}`}>{point}</li>
            ))}
          </ul>
        </div>
      ) : null}

      {objectiveTotal > 0 ? (
        <div style={{ border: "1px solid #dbeafe", borderRadius: 12, background: "#eff6ff", padding: 12, display: "grid", gap: 8 }}>
          <div style={{ fontWeight: 800 }}>Reading & Listening summary</div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            {!objectiveShownInBreakdown ? <strong>{objectiveCorrect}/{objectiveTotal} correct</strong> : null}
            <span style={{ color: objectiveNeedsReview ? "#b91c1c" : "#065f46", fontWeight: 700 }}>
              {objectiveNeedsReview
                ? `${objectiveNeedsReview} question${objectiveNeedsReview === 1 ? "" : "s"} need review`
                : "No questions need review"}
            </span>
          </div>
          {item.link ? (
            <div
              style={{
                marginTop: 2,
                borderTop: "1px solid #bfdbfe",
                paddingTop: 10,
                display: "grid",
                gap: 7,
              }}
            >
              <strong>{t("resultHistory.objectiveReviewTitle")}</strong>
              <p style={{ ...styles.helperText, margin: 0, color: "#334155" }}>
                {t("resultHistory.objectiveReviewHelp")}
              </p>
              <a
                href={item.link}
                target="_blank"
                rel="noreferrer"
                style={{ ...styles.primaryButton, textDecoration: "none", width: "fit-content" }}
              >
                {t("resultHistory.openObjective")}
              </a>
            </div>
          ) : null}
        </div>
      ) : null}

      {wrongObjectiveRows.length ? (
        <div style={{ border: "1px solid #fecaca", borderRadius: 12, background: "#fff7ed", overflow: "hidden" }}>
          <div style={{ padding: 10, display: "grid", gap: 4 }}>
            <div style={{ fontWeight: 800, color: "#7f1d1d" }}>Questions to review</div>
            <p style={{ ...styles.helperText, margin: 0, color: "#7c2d12" }}>
              These are the reading/listening or multiple-choice questions you answered incorrectly or left unanswered. Compare your answer with the correct answer and review that question in the exercise.
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gap: 10,
              padding: 10,
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            }}
          >
            {wrongObjectiveRows.slice(0, 8).map((row, index) => (
              <div
                key={`${row.partId}-${row.question}-${index}`}
                style={{
                  background: "#ffffff",
                  border: "1px solid #fed7aa",
                  borderRadius: 10,
                  padding: 10,
                  display: "grid",
                  gap: 8,
                  minWidth: 0,
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8, alignItems: "flex-start", flexWrap: "wrap" }}>
                  <strong style={{ fontSize: 14 }}>{row.question}</strong>
                  <span style={{ color: "#b91c1c", fontWeight: 700, fontSize: 12 }}>Incorrect</span>
                </div>
                <div style={{ display: "grid", gap: 4 }}>
                  <span style={{ ...styles.helperText, margin: 0 }}>Your answer</span>
                  <strong style={{ overflowWrap: "anywhere" }}>{row.student}</strong>
                </div>
                <div style={{ display: "grid", gap: 4 }}>
                  <span style={{ ...styles.helperText, margin: 0 }}>Correct answer</span>
                  <strong style={{ color: "#065f46", overflowWrap: "anywhere" }}>{row.expected}</strong>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      {!passed ? (
        <div style={{ border: "1px solid #fde68a", borderRadius: 12, background: "#fffbeb", padding: 12, display: "grid", gap: 8 }}>
          <h4 style={{ ...styles.resultHeading, margin: 0 }}>Next step</h4>
          <p style={{ ...styles.resultText, margin: 0 }}>{getNextStep(item)}</p>
          <button
            type="button"
            style={{ ...styles.primaryButton, width: "fit-content" }}
            onClick={() => navigate(resubmitTarget)}
          >
            Improve and resubmit
          </button>
        </div>
      ) : null}

      {distinctFeedback ? (
        <TextBlock title={t("resultHistory.feedbackTitle")} text={distinctFeedback} />
      ) : null}
    </div>
  );
};

/**
 * If you pass `sheetCsvUrl`, this component will fetch results from that published sheet.
 * Otherwise, it will use the `results` prop (old behaviour).
 */
const ResultHistory = ({ results = [], sheetCsvUrl = "" }) => {
  const { t } = useTranslation();
  const [sheetResults, setSheetResults] = useState([]);
  const [sheetLoading, setSheetLoading] = useState(false);
  const [sheetError, setSheetError] = useState("");

  const [search, setSearch] = useState("");
  const [levelFilter, setLevelFilter] = useState("ALL");
  const [minScore, setMinScore] = useState("");
  const [expandedResultKeys, setExpandedResultKeys] = useState(() => new Set());

  useEffect(() => {
    if (!sheetCsvUrl) return;

    let mounted = true;
    const run = async () => {
      setSheetLoading(true);
      setSheetError("");
      try {
        const data = await fetchResultsFromPublishedSheet(sheetCsvUrl);
        if (!mounted) return;
        setSheetResults(data);
      } catch (e) {
        if (!mounted) return;
        setSheetError(e?.message || t("resultHistory.errors.load"));
        setSheetResults([]);
      } finally {
        if (mounted) setSheetLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [sheetCsvUrl, t]);

  const activeResults = sheetCsvUrl ? sheetResults : results;

  const normalized = useMemo(() => {
    const list = (Array.isArray(activeResults) ? activeResults : []).map((entry, idx) => {
      const dateRaw = entry.date || entry.createdAt || entry.created_at || entry.dateIso || "";
      const createdMs = dateRaw ? Date.parse(dateRaw) : NaN;
      const storedNumericScore = toNumericScore(entry.score ?? entry.finalScore);
      const numericScore = resolveResultScore({ ...entry, numericScore: storedNumericScore });
      const assignment = resolveResultAssignmentTitle(entry);
      const key =
        entry.id ||
        `${entry.studentcode || t("resultHistory.studentFallback")}-${assignment || t("resultHistory.assignmentKeyFallback")}-${dateRaw || idx}`;

      return {
        key,
        assignment,
        assignmentId: entry.assignmentId || entry.assignment_id || entry.assignmentKey || "",
        assignmentKey: entry.assignmentKey || entry.canonicalAssignmentKey || "",
        level: (entry.level || "").toUpperCase(),
        name: entry.name || entry.studentName || "",
        studentcode: entry.studentcode || entry.studentCode || "",
        score: entry.score ?? entry.finalScore,
        numericScore,
        storedNumericScore,
        scoreWasReconciled:
          storedNumericScore !== null &&
          numericScore !== null &&
          Math.round(storedNumericScore) !== Math.round(numericScore),
        comments: entry.comments || entry.feedback || entry.aiFeedback || "",
        link: entry.link || "",
        dateRaw,
        createdLabel: formatDate(dateRaw),
        createdMs: Number.isNaN(createdMs) ? 0 : createdMs,
        position: idx,
        objectiveScore: entry.objectiveScore ?? null,
        objectiveCorrect: entry.objectiveCorrect ?? null,
        objectiveTotal: entry.objectiveTotal ?? null,
        objectiveDetails: entry.objectiveDetails ?? null,
        wrongAnswers: entry.wrongAnswers ?? [],
        writingScore: entry.writingScore ?? null,
        writingScorePercent: entry.writingScorePercent ?? null,
        maxWritingScore: entry.maxWritingScore ?? null,
        scoreBreakdown: entry.scoreBreakdown ?? [],
        corrections: entry.corrections ?? [],
        improvementSummary: entry.improvementSummary || "",
        markingReason: entry.markingReason || entry.rawAiReason || entry.aiReason || "",
      };
    });

    const chronological = list
      .slice()
      .sort((a, b) => (a.createdMs || 0) - (b.createdMs || 0) || a.position - b.position);

    const attemptsByAssignment = new Map();
    const attemptNumbers = new Map();

    chronological.forEach((entry) => {
      const assignmentKey = getAssignmentKey(entry);
      if (!assignmentKey) return;
      const aggregate = attemptsByAssignment.get(assignmentKey) || { total: 0, scores: [] };
      aggregate.total += 1;
      aggregate.scores.push(entry.numericScore);
      attemptsByAssignment.set(assignmentKey, aggregate);
      attemptNumbers.set(entry.key, aggregate.total);
    });

    const attemptSummaries = new Map();
    attemptsByAssignment.forEach((value, assignmentKey) => {
      const bestScore = value.scores.reduce((best, score) => {
        if (typeof score !== "number" || Number.isNaN(score)) return best;
        return Math.max(best, score);
      }, -Infinity);
      const cleanBest = Number.isFinite(bestScore) ? bestScore : null;
      attemptSummaries.set(assignmentKey, {
        totalAttempts: value.total,
        bestScore: cleanBest,
        passedOverall: typeof cleanBest === "number" ? cleanBest >= PASS_MARK : null,
      });
    });

    const annotated = list.map((entry) => {
      const assignmentKey = getAssignmentKey(entry);
      const summary = assignmentKey ? attemptSummaries.get(assignmentKey) : null;
      const attempt = attemptNumbers.get(entry.key) || 1;
      const attemptStatus =
        typeof entry.numericScore === "number"
          ? entry.numericScore >= PASS_MARK
            ? "passed"
            : "failed"
          : null;

      return {
        ...entry,
        attempt,
        totalAttempts: summary?.totalAttempts || 1,
        bestScore: typeof summary?.bestScore === "number" ? summary.bestScore : entry.numericScore,
        passedOverall: typeof summary?.bestScore === "number" ? summary.bestScore >= PASS_MARK : typeof entry.numericScore === "number" ? entry.numericScore >= PASS_MARK : null,
        attemptStatus,
      };
    });

    return annotated.sort(
      (a, b) => (b.createdMs || 0) - (a.createdMs || 0) || b.position - a.position
    );
  }, [activeResults, t]);

  const newestResultKey = normalized[0]?.key || "";
  useEffect(() => {
    if (!newestResultKey) {
      setExpandedResultKeys(new Set());
      return;
    }
    setExpandedResultKeys(new Set([newestResultKey]));
  }, [newestResultKey]);

  const toggleResultDetails = (key) => {
    setExpandedResultKeys((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const availableLevels = useMemo(() => {
    const set = new Set();
    normalized.forEach((r) => {
      if (r.level) set.add(r.level);
    });
    return ["ALL", ...Array.from(set).sort((a, b) => a.localeCompare(b))];
  }, [normalized]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    const min = minScore === "" ? null : Number(minScore);

    return normalized.filter((r) => {
      const matchesLevel = levelFilter === "ALL" ? true : r.level === levelFilter;

      const matchesSearch =
        !q ||
        safeLower(r.assignment).includes(q) ||
        safeLower(r.comments).includes(q) ||
        safeLower(r.name).includes(q) ||
        safeLower(r.studentcode).includes(q);

      const matchesScore =
        min === null || !Number.isFinite(min) ? true : Number(r.numericScore || 0) >= min;

      return matchesLevel && matchesSearch && matchesScore;
    });
  }, [levelFilter, minScore, normalized, search]);

  const resetFilters = () => {
    setSearch("");
    setLevelFilter("ALL");
    setMinScore("");
  };

  if (sheetCsvUrl && sheetLoading) {
    return (
      <section style={{ ...styles.card, marginTop: 16 }}>
        <SectionHeader title={t("resultHistory.title")} subtitle={t("resultHistory.loading")} />
        <SkeletonRow widths={["60%", "85%", "70%"]} />
      </section>
    );
  }

  if (sheetCsvUrl && sheetError) {
    return (
      <section style={{ ...styles.card, marginTop: 16 }}>
        <SectionHeader title={t("resultHistory.title")} />
        <InfoBox tone="error" title={t("resultHistory.errors.title")}>
          {sheetError}
        </InfoBox>
      </section>
    );
  }

  if (!normalized.length) return null;

  const hasCompletedRetake = normalized.some(
    (item) => item.totalAttempts > 1 && item.passedOverall === true
  );

  return (
    <section style={{ ...styles.card, marginTop: 16 }}>
      <SectionHeader
        title={t("resultHistory.title")}
        subtitle="Review your marks, understand why you received the score, then improve the weak points before moving on."
      />

      {hasCompletedRetake ? (
        <InfoBox tone="success" title={t("resultHistory.completionGuide.title")}>
          {t("resultHistory.completionGuide.description", { mark: PASS_MARK })}
        </InfoBox>
      ) : null}

      <div
        style={{
          ...styles.card,
          marginTop: 10,
          marginBottom: 12,
          padding: 12,
          display: "grid",
          gap: 10,
        }}
      >
        <div
          style={{
            display: "grid",
            gap: 10,
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            alignItems: "end",
          }}
        >
          <label style={{ display: "grid", gap: 6 }}>
            <span style={styles.helperText}>{t("resultHistory.filters.searchLabel")}</span>
            <input
              style={{ ...styles.input, width: "100%" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("resultHistory.filters.searchPlaceholder")}
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span style={styles.helperText}>{t("resultHistory.filters.levelLabel")}</span>
            <select
              style={styles.select}
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
            >
              {availableLevels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl === "ALL" ? t("resultHistory.filters.allLevels") : lvl}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span style={styles.helperText}>{t("resultHistory.filters.minScoreLabel")}</span>
            <input
              type="number"
              style={{ ...styles.input, width: "100%" }}
              value={minScore}
              onChange={(e) => setMinScore(e.target.value)}
              placeholder={t("resultHistory.filters.minScorePlaceholder")}
              min="0"
              max="100"
            />
          </label>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
            <button type="button" style={styles.secondaryButton} onClick={resetFilters}>
              {t("resultHistory.filters.reset")}
            </button>
            <PillBadge tone="info">
              {t("resultHistory.filters.showing", {
                filtered: filtered.length,
                total: normalized.length,
              })}
            </PillBadge>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map((item) => {
          const isExpanded = expandedResultKeys.has(item.key);
          const detailsId = `result-details-${String(item.key).replace(/[^a-zA-Z0-9_-]+/g, "-")}`;
          const meta = [item.level, item.assignmentId || item.assignmentKey, item.createdLabel].filter(Boolean).join(" · ");
          const studentMeta = [item.name, item.studentcode].filter(Boolean).join(" · ");
          const statusVariant =
            item.passedOverall === true
              ? "pass"
              : item.attemptStatus === "failed" || item.passedOverall === false
              ? "fail"
              : item.attemptStatus === "passed"
              ? "pass"
              : "neutral";
          const statusStyles =
            statusVariant === "pass"
              ? {
                  tone: "success",
                  label:
                    item.totalAttempts > 1
                      ? t("resultHistory.status.completedByRetake")
                      : t("resultHistory.status.passed"),
                }
              : statusVariant === "fail"
              ? { tone: "error", label: t("resultHistory.status.failed", { mark: PASS_MARK }) }
              : { tone: "info", label: t("resultHistory.status.score") };

          const attemptLabel =
            item.totalAttempts > 1
              ? t("resultHistory.attempt", { attempt: item.attempt, total: item.totalAttempts })
              : t("resultHistory.attemptSingle");
          const bestScoreText =
            item.totalAttempts > 1 && typeof item.bestScore === "number"
              ? item.passedOverall
                ? t("resultHistory.bestScoreMet", { score: item.bestScore, mark: PASS_MARK })
                : t("resultHistory.bestScoreNeeded", { score: item.bestScore, mark: PASS_MARK })
              : null;
          const scoreDisplay =
            typeof item.numericScore === "number"
              ? item.numericScore
              : item.score || "–";

          return (
            <article key={item.key} style={{ ...styles.resultCard, marginTop: 0 }}>
              <div
                style={{
                  display: "grid",
                  gap: 12,
                  gridTemplateColumns: "minmax(0, 1fr) auto",
                  alignItems: "start",
                }}
              >
                <div style={{ display: "grid", gap: 6 }}>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>{item.assignment}</div>
                  {meta ? (
                    <div style={{ ...styles.helperText, margin: 0 }}>{meta}</div>
                  ) : null}
                  {studentMeta ? (
                    <div style={{ ...styles.helperText, margin: 0 }}>{studentMeta}</div>
                  ) : null}
                </div>

                {scoreDisplay !== undefined && scoreDisplay !== null ? (
                  <div style={{ textAlign: "right", display: "grid", gap: 6, justifyItems: "end" }}>
                    <PillBadge tone={statusStyles.tone}>{statusStyles.label}</PillBadge>
                    <div style={{ fontWeight: 800, fontSize: 20 }}>{scoreDisplay}</div>
                    <div style={{ ...styles.helperText, margin: 0, textAlign: "right" }}>{attemptLabel}</div>
                    {bestScoreText ? (
                      <div
                        style={{
                          ...styles.helperText,
                          margin: 0,
                          textAlign: "right",
                          color: statusVariant === "fail" ? "#b91c1c" : "#065f46",
                        }}
                      >
                        {bestScoreText}
                      </div>
                    ) : statusVariant === "fail" ? (
                      <div style={{ ...styles.helperText, margin: 0, textAlign: "right", color: "#b91c1c" }}>
                        {t("resultHistory.belowPassMark", { mark: PASS_MARK })}
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>

              <div style={{ marginTop: 10, display: "flex", justifyContent: "flex-start" }}>
                <button
                  type="button"
                  aria-expanded={isExpanded}
                  aria-controls={detailsId}
                  style={{ ...styles.secondaryButton, width: "fit-content" }}
                  onClick={() => toggleResultDetails(item.key)}
                >
                  {isExpanded ? t("resultHistory.hideDetails") : t("resultHistory.showDetails")}
                </button>
              </div>

              {isExpanded ? (
                <div id={detailsId}>
              {item.link && !Number(item.objectiveTotal || 0) ? (
                <div
                  style={{
                    marginTop: 12,
                    border: "1px solid #dbeafe",
                    borderRadius: 12,
                    background: "#eff6ff",
                    padding: 12,
                    display: "grid",
                    gap: 7,
                  }}
                >
                  <strong>{t("resultHistory.objectiveReviewTitle")}</strong>
                  <p style={{ ...styles.helperText, margin: 0, color: "#334155" }}>
                    {t("resultHistory.objectiveReviewHelp")}
                  </p>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    style={{ ...styles.primaryButton, textDecoration: "none", width: "fit-content" }}
                  >
                    {t("resultHistory.openObjective")}
                  </a>
                </div>
              ) : null}

              <FeedbackDetailCard item={item} />
                </div>
              ) : null}
            </article>
          );
        })}

        {!filtered.length ? (
          <EmptyState
            title={t("resultHistory.empty.title")}
            description={t("resultHistory.empty.description")}
            action={
              <button type="button" style={styles.secondaryButton} onClick={resetFilters}>
                {t("resultHistory.empty.reset")}
              </button>
            }
          />
        ) : null}
      </div>
    </section>
  );
};

export default ResultHistory;