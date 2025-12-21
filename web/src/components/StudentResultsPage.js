import React, { useEffect, useMemo, useState } from "react";
import { fetchResults } from "../services/resultsService";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";

const PASS_MARK = 60;

const formatDate = (value) => {
  if (!value) return "";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toLocaleDateString();
};

const buildAssignmentSummaries = (rows = []) => {
  if (!rows.length) return [];

  const toTime = (value) => {
    const parsed = new Date(value);
    const time = parsed.getTime();
    return Number.isNaN(time) ? 0 : time;
  };

  const grouped = {};

  rows.forEach((row) => {
    const assignment = row.assignment || "Assignment";
    const score = row.score;
    const entry = grouped[assignment] || {
      assignment,
      level: row.level || "",
      attempts: [],
      bestScore: null,
      lastDate: null,
    };

    entry.attempts.push({
      score,
      date: row.date,
      comments: row.comments,
      link: row.link,
      attemptNumber: row.attempt,
    });

    if (score !== null && score !== undefined) {
      entry.bestScore = entry.bestScore === null ? score : Math.max(entry.bestScore, score);
    }

    const parsedDate = new Date(row.date || row.created_at);
    if (!Number.isNaN(parsedDate.getTime())) {
      if (!entry.lastDate || parsedDate > new Date(entry.lastDate)) {
        entry.lastDate = parsedDate.toISOString();
      }
    }

    grouped[assignment] = entry;
  });

  return Object.values(grouped)
    .map((entry) => {
      const attempts = entry.attempts
        .slice()
        .sort((a, b) => toTime(b.date) - toTime(a.date))
        .map((attempt, index) => ({
          ...attempt,
          label: `Attempt ${attempt.attemptNumber || index + 1}`,
          isBest: attempt.score === entry.bestScore,
        }));

      const trendPoints = entry.attempts
        .slice()
        .sort((a, b) => toTime(a.date) - toTime(b.date))
        .map((attempt) => (typeof attempt.score === "number" ? attempt.score : null))
        .filter((value) => value !== null && !Number.isNaN(value));

      return {
        ...entry,
        attempts,
        attemptsCount: entry.attempts.length,
        pass: entry.bestScore !== null && entry.bestScore >= PASS_MARK,
        trendPoints,
      };
    })
    .sort((a, b) => toTime(b.lastDate) - toTime(a.lastDate));
};

const ScoreSparkline = ({ points = [] }) => {
  if (!points.length) {
    return <div style={{ fontSize: 12, color: "#6b7280" }}>No scores yet</div>;
  }

  const width = 120;
  const height = 40;
  const minValue = Math.min(...points);
  const maxValue = Math.max(...points);
  const normalize = (value) => {
    if (maxValue === minValue) return height / 2;
    const ratio = (value - minValue) / (maxValue - minValue);
    return height - ratio * (height - 6) - 3;
  };

  const step = points.length > 1 ? width / (points.length - 1) : width;
  const path = points
    .map((value, index) => `${index === 0 ? "M" : "L"}${index * step},${normalize(value)}`)
    .join(" ");

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-label="Score trend sparkline">
      <polyline fill="none" stroke="#2563eb" strokeWidth="2" points={path.replace(/[ML]/g, "")} />
      {points.map((value, index) => (
        <circle key={index} cx={index * step} cy={normalize(value)} r={3} fill="#2563eb" />
      ))}
    </svg>
  );
};

const StatPill = ({ label, value, tone = "default" }) => {
  const backgrounds = {
    default: "#eef2ff",
    success: "#ecfdf3",
    warning: "#fef3c7",
  };

  const colors = {
    default: "#312e81",
    success: "#166534",
    warning: "#92400e",
  };

  return (
    <div
      style={{
        padding: "12px 14px",
        borderRadius: 12,
        background: backgrounds[tone] || backgrounds.default,
        color: colors[tone] || colors.default,
        border: "1px solid #e5e7eb",
        display: "grid",
        gap: 4,
      }}
    >
      <div style={{ fontSize: 12, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</div>
      <div style={{ fontSize: 18, fontWeight: 700 }}>{value}</div>
    </div>
  );
};

const StudentResultsPage = () => {
  const { studentProfile, user } = useAuth();
  const [filters, setFilters] = useState({ assignmentQuery: "" });
  const [state, setState] = useState({ loading: false, error: null, data: [], summary: null, student: null, fetched: false });

  const assignments = useMemo(() => buildAssignmentSummaries(state.data), [state.data]);
  const overallStats = useMemo(() => {
    if (!assignments.length) {
      return { passRate: "0%", bestScore: "Not scored", lastAttempt: "–" };
    }

    const passed = assignments.filter((row) => row.pass).length;
    const passRate = `${Math.round((passed / assignments.length) * 100)}%`;
    const bestScore = assignments.reduce(
      (acc, entry) => (entry.bestScore !== null ? Math.max(acc ?? entry.bestScore, entry.bestScore) : acc),
      null,
    );
    const lastAttemptDate = assignments.reduce((latest, entry) => {
      if (!entry.lastDate) return latest;
      const current = new Date(entry.lastDate);
      if (Number.isNaN(current.getTime())) return latest;
      return !latest || current > latest ? current : latest;
    }, null);

    return {
      passRate,
      bestScore: bestScore !== null ? `${bestScore}/100` : "Not scored",
      lastAttempt: lastAttemptDate ? formatDate(lastAttemptDate) : "–",
    };
  }, [assignments]);
  const studentName = state.student?.name || state.data[0]?.studentName || state.data[0]?.name || "";
  const studentEmail = state.student?.email || user?.email || studentProfile?.email || "";
  const studentCodeLabel =
    state.student?.studentCode || state.student?.studentcode || state.data[0]?.studentCode || studentProfile?.studentcode || "";
  const level = state.data[0]?.level || studentProfile?.level || state.student?.level || "";
  const filteredAssignments = useMemo(() => {
    const query = filters.assignmentQuery.trim().toLowerCase();
    if (!query) return assignments;
    return assignments.filter((entry) => entry.assignment.toLowerCase().includes(query));
  }, [assignments, filters.assignmentQuery]);

  const downloadCsv = () => {
    if (!assignments.length) return;

    const headers = ["Assignment", "Attempt", "Score", "Date", "Comments"];
    const rows = assignments.flatMap((assignment) =>
      assignment.attempts.map((attempt) => [
        assignment.assignment,
        attempt.label,
        typeof attempt.score === "number" ? attempt.score : "",
        formatDate(attempt.date),
        (attempt.comments || "").replace(/\n/g, " ").replace(/"/g, "'"),
      ]),
    );

    const csv = [headers, ...rows]
      .map((row) => row.map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`).join(","))
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "student-results.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const loadResults = ({ showErrors = true } = {}) => {
    const studentCode = (studentProfile?.studentcode || studentProfile?.studentCode || "").trim();
    const levelFromProfile = (studentProfile?.level || "").trim();
    const email = (user?.email || studentProfile?.email || "").trim().toLowerCase();

    if (!studentCode || !email || !levelFromProfile) {
      if (showErrors) {
        setState({
          loading: false,
          error: "Missing student data. Ensure your account has email, level, and student code saved in your profile.",
          data: [],
          summary: null,
          fetched: false,
        });
      }
      return;
    }

    setState((prev) => ({ ...prev, loading: true, error: null, fetched: true }));

    fetchResults({ studentCode, level: levelFromProfile, email })
      .then((payload) => {
        setState({
          loading: false,
          error: null,
          data: payload.results || [],
          summary: payload.summary || null,
          student: payload.student || null,
          fetched: true,
        });
      })
      .catch((error) => {
        setState({ loading: false, error: error.message || "Failed to load results", data: [], summary: null, fetched: true });
      });
  };

  useEffect(() => {
    loadResults({ showErrors: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentProfile?.studentcode, studentProfile?.studentCode, studentProfile?.level, user?.email]);

  return (
    <div style={{ ...styles.card, display: "grid", gap: 16 }}>
      <header style={{ display: "grid", gap: 4 }}>
        <p style={{ ...styles.helperText, margin: 0 }}>
          Your results are loaded automatically when your email, level, and student code match the score sheet.
        </p>
        <h2 style={{ margin: 0 }}>Results {studentName ? `for ${studentName}` : "viewer"}</h2>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center" }}>
          {studentEmail ? <span style={styles.helperText}>Email: {studentEmail}</span> : null}
          {studentCodeLabel ? <span style={styles.helperText}>Student code: {studentCodeLabel}</span> : null}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <p style={{ ...styles.helperText, marginTop: 0, marginBottom: 0 }}>Pass mark: {PASS_MARK}</p>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <span style={{ ...styles.helperText, fontWeight: 600 }}>Score trends</span>
            <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4 }}>
              {filteredAssignments.map((entry) => (
                <div
                  key={`${entry.assignment}-spark`}
                  style={{
                    border: "1px solid #e5e7eb",
                    padding: 8,
                    borderRadius: 10,
                    background: "#f9fafb",
                    minWidth: 180,
                  }}
                >
                  <div style={{ ...styles.helperText, margin: 0, fontWeight: 600 }}>{entry.assignment}</div>
                  <ScoreSparkline points={entry.trendPoints} />
                </div>
              ))}
              {!filteredAssignments.length ? <div style={styles.helperText}>No assignments to chart yet</div> : null}
            </div>
          </div>
        </div>
      </header>

      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ display: "grid", gap: 6, gridTemplateColumns: "minmax(240px, 1fr)", alignItems: "end" }}>
          <label style={{ display: "grid", gap: 4 }}>
            <span style={styles.helperText}>Filter by assignment title</span>
            <input
              type="text"
              value={filters.assignmentQuery}
              onChange={(event) => setFilters((prev) => ({ ...prev, assignmentQuery: event.target.value }))}
              placeholder="Start typing an assignment title"
              style={styles.input}
            />
          </label>
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <button type="button" style={styles.primaryButton} onClick={() => loadResults()}>
            Reload results
          </button>
          <button type="button" style={styles.secondaryButton} onClick={downloadCsv} disabled={!assignments.length}>
            Export CSV
          </button>
          {level ? <span style={styles.helperText}>Level detected from student data: {level}</span> : null}
        </div>
      </div>

      <div style={{ display: "grid", gap: 8 }}>
        <div style={styles.helperText}>
          Each submission is stored as its own document, so retakes are shown separately while the highest score per
          assignment is highlighted.
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
          <StatPill label="Assignments attempted" value={assignments.length} />
          <StatPill
            label="Passed"
            value={`${assignments.filter((row) => row.pass).length} / ${Math.max(assignments.length, 1)}`}
            tone="success"
          />
          <StatPill label="Retakes" value={state.summary?.retakes || 0} tone="warning" />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 8,
          alignItems: "stretch",
        }}
      >
        <div style={{ border: "1px solid #e5e7eb", padding: 12, borderRadius: 10, background: "#f9fafb" }}>
          <div style={{ ...styles.helperText, margin: 0 }}>Overall pass rate</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{overallStats.passRate}</div>
        </div>
        <div style={{ border: "1px solid #e5e7eb", padding: 12, borderRadius: 10, background: "#f9fafb" }}>
          <div style={{ ...styles.helperText, margin: 0 }}>Best score</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{overallStats.bestScore}</div>
        </div>
        <div style={{ border: "1px solid #e5e7eb", padding: 12, borderRadius: 10, background: "#f9fafb" }}>
          <div style={{ ...styles.helperText, margin: 0 }}>Most recent attempt</div>
          <div style={{ fontSize: 18, fontWeight: 700 }}>{overallStats.lastAttempt}</div>
        </div>
      </div>

      {state.loading ? <div style={styles.helperText}>Loading results ...</div> : null}
      {state.error ? <div style={styles.errorBox}>{state.error}</div> : null}
      {!state.loading && !state.error && state.fetched && assignments.length === 0 ? (
        <div style={styles.helperText}>No results available yet for this student.</div>
      ) : null}
      {!state.loading && !state.error && state.fetched && assignments.length > 0 && filteredAssignments.length === 0 ? (
        <div style={styles.helperText}>No assignments match that title filter.</div>
      ) : null}

      <div style={{ display: "grid", gap: 12 }}>
        {filteredAssignments.map((entry) => (
          <article key={entry.assignment} style={styles.resultCard}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <h3 style={{ margin: "0 0 4px 0" }}>{entry.assignment}</h3>
                <p style={{ ...styles.helperText, margin: 0 }}>
                  Last updated {formatDate(entry.lastDate)} · Attempts: {entry.attemptsCount}
                </p>
              </div>
              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: 999,
                  background: entry.pass ? "#dcfce7" : "#fee2e2",
                  color: entry.pass ? "#166534" : "#991b1b",
                  fontWeight: 700,
                  border: "1px solid #e5e7eb",
                }}
              >
                Best score: {entry.bestScore !== null ? `${entry.bestScore}/100` : "Not scored"}
              </div>
            </div>

            <div style={{ marginTop: 12, display: "grid", gap: 8 }}>
              {entry.attempts.map((attempt, index) => (
                <div
                  key={`${entry.assignment}-attempt-${index}`}
                  style={{
                    padding: 12,
                    borderRadius: 10,
                    border: "1px solid #e5e7eb",
                    background: attempt.isBest ? "#f0f9ff" : "#f9fafb",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
                    <div style={{ ...styles.helperText, margin: 0 }}>{attempt.label} · {formatDate(attempt.date) || "Date not set"}</div>
                    {attempt.isBest ? (
                      <span
                        style={{
                          padding: "4px 8px",
                          borderRadius: 999,
                          background: "#dbeafe",
                          color: "#1d4ed8",
                          fontSize: 12,
                          fontWeight: 700,
                        }}
                      >
                        Highest used
                      </span>
                    ) : null}
                  </div>
                  <p style={{ ...styles.resultText, margin: "4px 0" }}>
                    {attempt.isBest ? "Highest score:" : "Score:"} {attempt.score !== null && attempt.score !== undefined ? attempt.score : "Pending"}
                  </p>
                  <p style={{ ...styles.resultText, margin: "4px 0", display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
                    <span>Comments: {attempt.comments || "None"}</span>
                    {attempt.link ? (
                      <a
                        href={attempt.link}
                        target="_blank"
                        rel="noreferrer"
                        style={{ ...styles.resultText, color: "#2563eb" }}
                      >
                        Objectives reference
                      </a>
                    ) : null}
                  </p>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};

export default StudentResultsPage;
