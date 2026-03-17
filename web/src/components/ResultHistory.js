import React, { useEffect, useMemo, useState } from "react";
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

const getAssignmentKey = (entry) => safeLower(entry.assignmentId || entry.assignment_id);

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
      const numericScore = toNumericScore(entry.score);
      const key =
        entry.id ||
        `${entry.studentcode || t("resultHistory.studentFallback")}-${entry.assignment || t("resultHistory.assignmentKeyFallback")}-${dateRaw || idx}`;

      return {
        key,
        assignment: entry.assignment || t("resultHistory.assignmentFallback"),
        assignmentId: entry.assignmentId || entry.assignment_id || "",
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

  // Loading/error states for sheet source
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
        subtitle={t("resultHistory.subtitle")}
      />

      {hasCompletedRetake ? (
        <InfoBox tone="success" title={t("resultHistory.completionGuide.title")}>
          {t("resultHistory.completionGuide.description", { mark: PASS_MARK })}
        </InfoBox>
      ) : null}

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

      {/* Results */}
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

          console.log({
            assignmentId: item.assignmentId || item.assignment_id || null,
            bestScore: item.bestScore,
            attempts: item.totalAttempts,
          });

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
