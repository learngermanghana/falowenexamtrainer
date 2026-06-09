import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";
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

const asPercent = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return "—";
  return `${Math.round(numeric)}%`;
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

const getScoreBreakdownRows = (item = {}) => {
  const rows = [];
  const objectiveTotal = Number(item.objectiveTotal || 0);
  if (objectiveTotal > 0) {
    rows.push({
      label: "Objective / MCQ",
      score: `${item.objectiveCorrect || 0}/${objectiveTotal}`,
      detail: `${asPercent(item.objectiveScore)} from reading/listening or multiple-choice answers`,
    });
  }

  if (item.writingScore !== null && item.writingScore !== undefined && item.writingScore !== "") {
    rows.push({
      label: "Writing",
      score: formatWritingScore(item),
      detail: "Task completion, grammar, vocabulary, structure, tone and clarity",
    });
  }

  const explicitBreakdown = normalizeArray(item.scoreBreakdown);
  explicitBreakdown.forEach((row) => {
    if (!row?.label) return;
    rows.push({
      label: row.label,
      score: row.score ?? row.value ?? "—",
      detail: row.reason || row.detail || "",
    });
  });

  if (!rows.length) {
    rows.push({
      label: "Overall score",
      score: `${item.numericScore ?? item.score ?? "—"}/100`,
      detail: item.numericScore >= PASS_MARK ? "Passed this task" : "Needs improvement before this task is secure",
    });
  }

  return rows;
};

const getWrongObjectiveRows = (item = {}) => {
  const wrongAnswers = normalizeArray(item.wrongAnswers);
  if (wrongAnswers.length) {
    return wrongAnswers.map((row, index) => ({
      question: row.question || row.label || index + 1,
      student: row.student || row.submitted || row.answer || "blank",
      expected: row.expected || row.correctAnswer || row.correct || "—",
      partId: row.partId || row.part || "",
    }));
  }

  const details = normalizeObject(item.objectiveDetails);
  return Object.entries(details)
    .map(([question, detail]) => ({ question, ...detail }))
    .filter((row) => row && row.correct === false)
    .map((row) => ({
      question: row.question,
      student: row.student || row.submitted || "blank",
      expected: row.expected || row.rawExpected || "—",
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

const getWhyThisScore = (item = {}) => {
  if (item.markingReason) return String(item.markingReason).trim();
  if (item.improvementSummary) return String(item.improvementSummary).trim();
  const sentences = splitSentences(item.comments);
  if (sentences.length <= 2) return item.comments || "Your tutor has marked this work. Review the feedback and improve the weak points.";
  return sentences.slice(0, 2).join(" ");
};

const getNextStep = (item = {}) => {
  if (item.numericScore < PASS_MARK) {
    return "Revise the correction points, practise the weak area, then submit an improved version.";
  }
  return "You passed this task. Still revise the feedback so the same mistakes do not appear in your next work.";
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

const FeedbackDetailCard = ({ item, statusVariant }) => {
  const navigate = useNavigate();
  const breakdownRows = getScoreBreakdownRows(item);
  const wrongObjectiveRows = getWrongObjectiveRows(item);
  const correctionPoints = getCorrectionPoints(item);
  const resubmitTarget = ["B2", "C1"].includes(item.level) ? "/campus/writing" : "/campus/submit";
  const passed = item.numericScore >= PASS_MARK;

  return (
    <div style={{ display: "grid", gap: 12, marginTop: 12 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: 10,
        }}
      >
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, background: "#ffffff" }}>
          <p style={{ ...styles.helperText, margin: 0 }}>Your score</p>
          <strong style={{ fontSize: 24, color: statusVariant === "fail" ? "#b91c1c" : "#065f46" }}>
            {item.numericScore ?? item.score ?? "—"}/100
          </strong>
        </div>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, background: "#ffffff" }}>
          <p style={{ ...styles.helperText, margin: 0 }}>Status</p>
          <strong>{passed ? "Passed" : "Needs improvement"}</strong>
        </div>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, background: "#ffffff" }}>
          <p style={{ ...styles.helperText, margin: 0 }}>Date marked</p>
          <strong>{item.createdLabel || "Not recorded"}</strong>
        </div>
        <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, background: "#ffffff" }}>
          <p style={{ ...styles.helperText, margin: 0 }}>Assignment ID</p>
          <strong>{item.assignmentId || item.assignmentKey || "—"}</strong>
        </div>
      </div>

      <div style={{ border: "1px solid #dbeafe", borderRadius: 12, background: "#eff6ff", padding: 12, display: "grid", gap: 8 }}>
        <h4 style={{ ...styles.resultHeading, margin: 0 }}>Why you got this score</h4>
        <p style={{ ...styles.resultText, margin: 0 }}>{getWhyThisScore(item)}</p>
      </div>

      <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, background: "#ffffff", overflow: "hidden" }}>
        <div style={{ padding: 10, background: "#f8fafc", fontWeight: 800 }}>Score breakdown</div>
        {breakdownRows.map((row, index) => (
          <div
            key={`${row.label}-${index}`}
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(130px, 1fr) minmax(80px, auto) 2fr",
              gap: 8,
              padding: 10,
              borderTop: "1px solid #e5e7eb",
              fontSize: 13,
            }}
          >
            <strong>{row.label}</strong>
            <span>{row.score}</span>
            <span style={{ color: "#4b5563" }}>{row.detail}</span>
          </div>
        ))}
      </div>

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

      {wrongObjectiveRows.length ? (
        <div style={{ border: "1px solid #fecaca", borderRadius: 12, background: "#fff7ed", overflow: "hidden" }}>
          <div style={{ padding: 10, fontWeight: 800, color: "#7f1d1d" }}>Wrong objective answers</div>
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr>
                  <th style={{ textAlign: "left", padding: 8, borderTop: "1px solid #fed7aa", borderBottom: "1px solid #fed7aa" }}>Question</th>
                  <th style={{ textAlign: "left", padding: 8, borderTop: "1px solid #fed7aa", borderBottom: "1px solid #fed7aa" }}>Your answer</th>
                  <th style={{ textAlign: "left", padding: 8, borderTop: "1px solid #fed7aa", borderBottom: "1px solid #fed7aa" }}>Correct answer</th>
                </tr>
              </thead>
              <tbody>
                {wrongObjectiveRows.slice(0, 8).map((row, index) => (
                  <tr key={`${row.partId}-${row.question}-${index}`}>
                    <td style={{ padding: 8, borderBottom: "1px solid #ffedd5" }}>{row.partId ? `${row.partId} ` : ""}{row.question}</td>
                    <td style={{ padding: 8, borderBottom: "1px solid #ffedd5" }}>{row.student}</td>
                    <td style={{ padding: 8, borderBottom: "1px solid #ffedd5" }}>{row.expected}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      <div style={{ border: "1px solid #bbf7d0", borderRadius: 12, background: "#f0fdf4", padding: 12, display: "grid", gap: 8 }}>
        <h4 style={{ ...styles.resultHeading, margin: 0 }}>Next step</h4>
        <p style={{ ...styles.resultText, margin: 0 }}>{getNextStep(item)}</p>
        {!passed ? (
          <button
            type="button"
            style={{ ...styles.primaryButton, width: "fit-content" }}
            onClick={() => navigate(resubmitTarget)}
          >
            Improve and resubmit
          </button>
        ) : null}
      </div>
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
      const numericScore = toNumericScore(entry.score ?? entry.finalScore);
      const key =
        entry.id ||
        `${entry.studentcode || t("resultHistory.studentFallback")}-${entry.assignment || t("resultHistory.assignmentKeyFallback")}-${dateRaw || idx}`;

      return {
        key,
        assignment: entry.assignment || t("resultHistory.assignmentFallback"),
        assignmentId: entry.assignmentId || entry.assignment_id || entry.assignmentKey || "",
        assignmentKey: entry.assignmentKey || entry.canonicalAssignmentKey || "",
        level: (entry.level || "").toUpperCase(),
        name: entry.name || entry.studentName || "",
        studentcode: entry.studentcode || entry.studentCode || "",
        score: entry.score ?? entry.finalScore,
        numericScore,
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
          const meta = [item.level, item.createdLabel].filter(Boolean).join(" · ");
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
            typeof item.bestScore === "number"
              ? item.bestScore
              : item.score || item.numericScore || "–";

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

              {item.link ? (
                <div style={{ marginTop: 12 }}>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    style={{ ...styles.secondaryButton, textDecoration: "none", width: "fit-content" }}
                  >
                    {t("resultHistory.openObjective")}
                  </a>
                </div>
              ) : null}

              <FeedbackDetailCard item={item} statusVariant={statusVariant} />

              <div style={{ marginTop: 12 }}>
                <TextBlock title={t("resultHistory.feedbackTitle")} text={item.comments} />
              </div>
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
