import React, { useEffect, useMemo, useState } from "react";
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

const getAssignmentKey = (assignment, fallback) => safeLower(assignment) || fallback;

const TextBlock = ({ title, text, maxChars = 650 }) => {
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
          {expanded ? "Show less" : "Show more"}
        </button>
      ) : null}
    </div>
  );
};

/**
 * If you pass `sheetCsvUrl`, this component will fetch results from that published sheet.
 * Otherwise, it will use the `results` prop (old behaviour).
 */
const ResultHistory = ({ results = [], sheetCsvUrl = "" }) => {
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
        setSheetError(e?.message || "Failed to load results sheet.");
        setSheetResults([]);
      } finally {
        if (mounted) setSheetLoading(false);
      }
    };

    run();
    return () => {
      mounted = false;
    };
  }, [sheetCsvUrl]);

  const activeResults = sheetCsvUrl ? sheetResults : results;

  const normalized = useMemo(() => {
    const list = (Array.isArray(activeResults) ? activeResults : []).map((entry, idx) => {
      const dateRaw = entry.date || entry.createdAt || entry.created_at || entry.dateIso || "";
      const createdMs = dateRaw ? Date.parse(dateRaw) : NaN;
      const numericScore = toNumericScore(entry.score);
      const key =
        entry.id ||
        `${entry.studentcode || "student"}-${entry.assignment || "assignment"}-${dateRaw || idx}`;

      return {
        key,
        assignment: entry.assignment || "Feedback",
        level: (entry.level || "").toUpperCase(),
        name: entry.name || "",
        studentcode: entry.studentcode || "",
        score: entry.score,
        numericScore,
        comments: entry.comments || "",
        link: entry.link || "",
        dateRaw,
        createdLabel: formatDate(dateRaw),
        createdMs: Number.isNaN(createdMs) ? 0 : createdMs,
        position: idx,
      };
    });

    const chronological = list
      .slice()
      .sort((a, b) => (a.createdMs || 0) - (b.createdMs || 0) || a.position - b.position);

    const attemptsByAssignment = new Map();
    const attemptNumbers = new Map();

    chronological.forEach((entry) => {
      const assignmentKey = getAssignmentKey(entry.assignment, entry.key);
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
      const assignmentKey = getAssignmentKey(entry.assignment, entry.key);
      const summary = attemptSummaries.get(assignmentKey) || {
        totalAttempts: 1,
        bestScore: entry.numericScore,
        passedOverall: typeof entry.numericScore === "number" ? entry.numericScore >= PASS_MARK : null,
      };
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
        totalAttempts: summary.totalAttempts,
        bestScore: summary.bestScore,
        passedOverall: summary.passedOverall,
        attemptStatus,
      };
    });

    return annotated.sort(
      (a, b) => (b.createdMs || 0) - (a.createdMs || 0) || b.position - a.position
    );
  }, [activeResults]);

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

  // Loading/error states for sheet source
  if (sheetCsvUrl && sheetLoading) {
    return (
      <section style={{ ...styles.card, marginTop: 16 }}>
        <SectionHeader title="Past feedback" subtitle="Loading your feedback history…" />
        <SkeletonRow widths={["60%", "85%", "70%"]} />
      </section>
    );
  }

  if (sheetCsvUrl && sheetError) {
    return (
      <section style={{ ...styles.card, marginTop: 16 }}>
        <SectionHeader title="Past feedback" />
        <InfoBox tone="error" title="Could not load sheet">
          {sheetError}
        </InfoBox>
      </section>
    );
  }

  if (!normalized.length) return null;

  return (
    <section style={{ ...styles.card, marginTop: 16 }}>
      <SectionHeader
        title="Past feedback"
        subtitle="Review your previous feedback to track your progress."
      />

      {/* Filters */}
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
            <span style={styles.helperText}>Search (assignment, feedback, name, code)</span>
            <input
              style={{ ...styles.input, width: "100%" }}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g., Pronouns or Prince"
            />
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span style={styles.helperText}>Level</span>
            <select
              style={styles.select}
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
            >
              {availableLevels.map((lvl) => (
                <option key={lvl} value={lvl}>
                  {lvl}
                </option>
              ))}
            </select>
          </label>

          <label style={{ display: "grid", gap: 6 }}>
            <span style={styles.helperText}>Min score</span>
            <input
              type="number"
              style={{ ...styles.input, width: "100%" }}
              value={minScore}
              onChange={(e) => setMinScore(e.target.value)}
              placeholder="e.g., 70"
              min="0"
              max="100"
            />
          </label>

          <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", flexWrap: "wrap" }}>
            <button type="button" style={styles.secondaryButton} onClick={resetFilters}>
              Reset
            </button>
            <PillBadge tone="info">Showing {filtered.length}/{normalized.length}</PillBadge>
          </div>
        </div>
      </div>

      {/* Results */}
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {filtered.map((item) => {
          const meta = [item.level, item.createdLabel].filter(Boolean).join(" · ");
          const statusVariant =
            item.attemptStatus === "failed" || item.passedOverall === false
              ? "fail"
              : item.attemptStatus === "passed"
              ? "pass"
              : "neutral";
          const statusStyles =
            statusVariant === "pass"
              ? { tone: "success", label: "Passed" }
              : statusVariant === "fail"
              ? { tone: "error", label: `Failed (pass mark ${PASS_MARK})` }
              : { tone: "info", label: "Score" };

          const attemptLabel =
            item.totalAttempts > 1
              ? `Try ${item.attempt} of ${item.totalAttempts}`
              : "Try 1";
          const bestScoreText =
            item.totalAttempts > 1 && typeof item.bestScore === "number"
              ? item.passedOverall
                ? `Best: ${item.bestScore} (meets ${PASS_MARK})`
                : `Best so far: ${item.bestScore} of ${PASS_MARK} needed`
              : null;
          const scoreDisplay =
            typeof item.numericScore === "number"
              ? item.numericScore
              : item.score || item.numericScore || "–";

          return (
            <article key={item.key} style={{ ...styles.resultCard, marginTop: 0 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>{item.assignment}</div>
                  <div style={{ ...styles.helperText, marginTop: 4 }}>{meta}</div>
                  {item.name || item.studentcode ? (
                    <div style={{ ...styles.helperText, marginTop: 4 }}>
                      {item.name ? item.name : null}
                      {item.name && item.studentcode ? " · " : null}
                      {item.studentcode ? item.studentcode : null}
                    </div>
                  ) : null}
                </div>

                {scoreDisplay !== undefined && scoreDisplay !== null ? (
                  <div style={{ textAlign: "right", display: "grid", gap: 4, justifyItems: "end" }}>
                    <PillBadge tone={statusStyles.tone}>{statusStyles.label}</PillBadge>
                    <div style={{ fontWeight: 800, fontSize: 18 }}>{scoreDisplay}</div>
                    <div style={{ ...styles.helperText, textAlign: "right" }}>{attemptLabel}</div>
                    {bestScoreText ? (
                      <div
                        style={{
                          ...styles.helperText,
                          textAlign: "right",
                          color: statusVariant === "fail" ? "#b91c1c" : "#065f46",
                        }}
                      >
                        {bestScoreText}
                      </div>
                    ) : statusVariant === "fail" ? (
                      <div style={{ ...styles.helperText, textAlign: "right", color: "#b91c1c" }}>
                        Below the {PASS_MARK} pass mark—retry recommended.
                      </div>
                    ) : null}
                  </div>
                ) : null}
              </div>

              {item.link ? (
                <div style={{ marginTop: 10 }}>
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noreferrer"
                    style={{ ...styles.secondaryButton, textDecoration: "none", width: "fit-content" }}
                  >
                    Open objective link
                  </a>
                </div>
              ) : null}

              <div style={{ marginTop: 12 }}>
                <TextBlock title="Feedback" text={item.comments} />
              </div>
            </article>
          );
        })}

        {!filtered.length ? (
          <EmptyState
            title="No results match your filters"
            description="Try resetting or adjusting the search to see your past feedback."
            action={
              <button type="button" style={styles.secondaryButton} onClick={resetFilters}>
                Reset filters
              </button>
            }
          />
        ) : null}
      </div>
    </section>
  );
};

export default ResultHistory;
