import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";
import ResultHistory from "./ResultHistory";
import { fetchStudentResultsHistory } from "../services/resultsApi";
import { fetchResultsFromPublishedSheet } from "../services/resultsSheetService";
import { fetchResults } from "../services/resultsService";
import ExamReadinessBadge from "./ExamReadinessBadge";

const norm = (v) => String(v || "").trim().toLowerCase();
const PASS_MARK = 60;
const TOTAL_ASSIGNMENTS = {
  A1: 19,
  A2_B2: 28,
};

const StudentResultsPage = () => {
  const { t } = useTranslation();
  const { idToken, studentProfile } = useAuth();

  const [results, setResults] = useState([]);
  const [leaderboard, setLeaderboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const studentCode =
    studentProfile?.studentCode ||
    studentProfile?.studentcode ||
    studentProfile?.id ||
    "";
  const studentLevel = String(studentProfile?.level || studentProfile?.course || "")
    .trim()
    .toUpperCase();
  const useSheetResults = ["A1", "A2", "B1"].includes(studentLevel);
  const useFirestoreResults = ["B2", "C1"].includes(studentLevel);

  // Put your sheet URL here via env (CSV or edit URL):
  // REACT_APP_RESULTS_SHEET_CSV_URL=https://docs.google.com/spreadsheets/d/e/.../pub?output=csv
  // REACT_APP_RESULTS_SHEET_CSV_URL=https://docs.google.com/spreadsheets/d/<sheetId>/edit
  const SHEET_CSV_URL = process.env.REACT_APP_RESULTS_SHEET_CSV_URL || "";

  const buildLeaderboard = useCallback((rows = []) => {
    if (!rows.length || !studentCode) return null;

    const levelFilter = studentLevel ? studentLevel : "";
    const relevantRows = levelFilter
      ? rows.filter(
          (row) => String(row.level || "").trim().toUpperCase() === levelFilter
        )
      : rows;
    const scoresByStudent = new Map();

    relevantRows.forEach((row) => {
      const code = norm(row.studentcode || row.studentCode);
      const score = Number(row.score);
      if (!code || !Number.isFinite(score)) return;
      if (!scoresByStudent.has(code)) scoresByStudent.set(code, []);
      scoresByStudent.get(code).push(score);
    });

    if (!scoresByStudent.size) return null;

    const averages = Array.from(scoresByStudent.entries()).map(([code, scores]) => {
      const avg =
        Math.round((scores.reduce((sum, value) => sum + value, 0) / scores.length) * 10) /
        10;
      return { code, avg };
    });

    const studentEntry = averages.find((entry) => entry.code === norm(studentCode));
    const totalStudents = averages.length;

    if (!studentEntry) {
      return { totalStudents, rank: null, average: null, level: levelFilter || "All levels" };
    }

    const higherCount = averages.filter((entry) => entry.avg > studentEntry.avg).length;

    return {
      totalStudents,
      rank: higherCount + 1,
      average: studentEntry.avg,
      level: levelFilter || "All levels",
    };
  }, [studentCode, studentLevel]);

  useEffect(() => {
    let mounted = true;

    const loadFromSheet = async () => {
      const all = await fetchResultsFromPublishedSheet(SHEET_CSV_URL);

      // Filter ONLY this student’s rows (privacy + correctness)
      const mine = all.filter((r) => norm(r.studentcode) === norm(studentCode));

      return { mine, all };
    };

    const loadFromApi = async () => {
      const rows = await fetchStudentResultsHistory({ idToken, studentCode });
      return Array.isArray(rows) ? rows : [];
    };

    const loadFromResultsStore = async () => {
      const response = await fetchResults({ studentCode, email: studentProfile?.email });
      if (!Array.isArray(response?.results)) return [];
      return response.results.map((entry) => ({
        ...entry,
        studentcode: entry.studentcode || entry.studentCode || "",
        name: entry.name || entry.studentName || "",
      }));
    };

    const loadLeaderboardFromResultsStore = async () => {
      const response = await fetchResults({ level: studentLevel });
      if (!Array.isArray(response?.results)) return [];
      return response.results;
    };

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        if (!studentCode) {
          if (!mounted) return;
          setResults([]);
          setLeaderboard(null);
          return;
        }

        if (useFirestoreResults) {
          const [rows, leaderboardRows] = await Promise.all([
            loadFromResultsStore(),
            loadLeaderboardFromResultsStore(),
          ]);
          if (!mounted) return;
          setResults(rows);
          setLeaderboard(buildLeaderboard(leaderboardRows));
          return;
        }

        // Prefer sheet for A1/A2/B1 if configured
        if (useSheetResults && SHEET_CSV_URL) {
          const sheetResponse = await loadFromSheet();
          const { mine, all } = sheetResponse;
          if (!mounted) return;
          setResults(mine);
          setLeaderboard(buildLeaderboard(all));
          return;
        }

        // Otherwise fall back to API
        if (idToken) {
          const rows = await loadFromApi();
          if (!mounted) return;
          setResults(rows);
          setLeaderboard(null);
          return;
        }

        // Not enough info to load
        if (!mounted) return;
        setResults([]);
        setLeaderboard(null);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || "Failed to load results.");
        setResults([]);
        setLeaderboard(null);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [
    idToken,
    studentCode,
    studentLevel,
    useFirestoreResults,
    useSheetResults,
    SHEET_CSV_URL,
    buildLeaderboard,
  ]);

  const summary = useMemo(() => {
    const scores = results
      .map((r) => Number(r.score))
      .filter((n) => Number.isFinite(n));

    if (!scores.length) return { count: results.length, avg: null };
    const avg =
      Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
    return { count: results.length, avg };
  }, [results]);

  const assignmentProgress = useMemo(() => {
    const normalizeAssignment = (value) => String(value || "").trim().toLowerCase();
    const toNumericScore = (value) => {
      if (typeof value === "number") return Number.isFinite(value) ? value : null;
      if (typeof value === "string") {
        const parsed = Number(value.replace(/[^\d.+-]+/g, ""));
        return Number.isFinite(parsed) ? parsed : null;
      }
      return null;
    };

    const buildAssignmentStatus = (levels) => {
      const bestByAssignment = new Map();
      results.forEach((entry) => {
        const level = String(entry.level || "").toUpperCase();
        if (!levels.includes(level)) return;
        const assignmentKey = normalizeAssignment(entry.assignment);
        if (!assignmentKey) return;
        const score = toNumericScore(entry.score);
        const currentBest = bestByAssignment.get(assignmentKey);
        if (score !== null && (typeof currentBest !== "number" || score > currentBest)) {
          bestByAssignment.set(assignmentKey, score);
        } else if (currentBest === undefined) {
          bestByAssignment.set(assignmentKey, null);
        }
      });

      let completed = 0;
      let failed = 0;
      bestByAssignment.forEach((bestScore) => {
        if (typeof bestScore === "number" && bestScore >= PASS_MARK) completed += 1;
        else failed += 1;
      });

      return {
        completed,
        failed,
      };
    };

    const a1 = buildAssignmentStatus(["A1"]);
    const a2b2 = buildAssignmentStatus(["A2", "B1", "B2"]);

    return {
      a1Completed: a1.completed,
      a1Failed: a1.failed,
      a2b2Completed: a2b2.completed,
      a2b2Failed: a2b2.failed,
    };
  }, [results]);

  const progressInsights = useMemo(() => {
    const buildProgress = (label, completed, total, failed = 0) => {
      const safeCompleted = Math.max(0, Math.min(completed, total));
      const percent = total > 0 ? Math.round((safeCompleted / total) * 100) : 0;
      const remaining = Math.max(total - safeCompleted, 0);

      let milestoneCopy;
      if (remaining === 0) {
        milestoneCopy = "Milestone reached: this level is complete 🎉";
      } else if (safeCompleted === 0) {
        milestoneCopy = "Next milestone: complete your first assignment.";
      } else if (remaining <= 3) {
        milestoneCopy = `Next milestone: ${remaining} more assignment${remaining === 1 ? "" : "s"} to finish ${label}.`;
      } else {
        milestoneCopy = `Next milestone: complete ${Math.min(5, remaining)} more assignment${Math.min(5, remaining) === 1 ? "" : "s"} in ${label}.`;
      }

      if (failed > 0) {
        milestoneCopy += ` Retry ${failed} assignment${failed === 1 ? "" : "s"} below ${PASS_MARK}%.`;
      }

      return {
        label,
        completed: safeCompleted,
        total,
        percent,
        failed,
        milestoneCopy,
      };
    };

    return [
      buildProgress("A1", assignmentProgress.a1Completed, TOTAL_ASSIGNMENTS.A1, assignmentProgress.a1Failed),
      buildProgress("A2-B2", assignmentProgress.a2b2Completed, TOTAL_ASSIGNMENTS.A2_B2, assignmentProgress.a2b2Failed),
    ];
  }, [assignmentProgress]);


  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={{ ...styles.card, display: "grid", gap: 8 }}>
        <h3 style={{ ...styles.sectionTitle, margin: 0 }}>{t("examReadiness.certificate.title")}</h3>
        <p style={{ ...styles.helperText, margin: 0 }}>
          {t("examReadiness.certificate.resultsHelper")}
        </p>
        <ExamReadinessBadge studentProfile={studentProfile} variant="button" />
      </section>
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Results</h2>

        <p style={styles.helperText}>
          {loading
            ? "Loading your results..."
            : error
            ? "Could not load results."
            : summary.count === 0
            ? "No results found yet."
            : `Loaded ${summary.count} results${
                summary.avg !== null ? ` · Avg score: ${summary.avg}` : ""
              }`}
        </p>

        {!loading && !error ? (
          <div style={{ display: "grid", gap: 10, marginTop: 6 }}>
            {progressInsights.map((item) => (
              <div
                key={item.label}
                style={{
                  border: "1px solid #e5e7eb",
                  borderRadius: 10,
                  padding: "10px 12px",
                  background: "#f9fafb",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <p style={{ ...styles.helperText, margin: 0, fontWeight: 600 }}>
                    {item.label}
                  </p>
                  <p style={{ ...styles.helperText, margin: 0 }}>
                    {item.completed}/{item.total}
                  </p>
                </div>
                <div
                  aria-hidden="true"
                  style={{
                    marginTop: 8,
                    width: "100%",
                    height: 8,
                    borderRadius: 999,
                    overflow: "hidden",
                    background: "#e5e7eb",
                  }}
                >
                  <div
                    style={{
                      width: `${item.percent}%`,
                      height: "100%",
                      background: "linear-gradient(90deg, #2563eb 0%, #14b8a6 100%)",
                    }}
                  />
                </div>
                <p style={{ ...styles.helperText, margin: "8px 0 0 0" }}>
                  {item.percent}% complete · {item.milestoneCopy}
                </p>
                <p style={{ ...styles.helperText, margin: "6px 0 0 0", color: "#6b7280" }}>
                  Completion counts passed assignments (score ≥ {PASS_MARK}%).
                  {item.failed > 0 ? ` ${item.failed} need${item.failed === 1 ? "s" : ""} a retry.` : ""}
                </p>
              </div>
            ))}
          </div>
        ) : null}

        {!loading && !error ? (
          <>
            <p style={{ ...styles.helperText, marginTop: 12 }}>
              <strong>Leaderboard position:</strong>{" "}
              {leaderboard?.rank
                ? `${leaderboard.rank} of ${leaderboard.totalStudents} (${leaderboard.level})`
                : leaderboard
                ? `Not ranked yet (${leaderboard.level})`
                : "Not available yet"}
            </p>
            <p style={{ ...styles.helperText, marginTop: 4 }}>
              {leaderboard
                ? `This compares your average score${
                    leaderboard.average !== null ? ` (${leaderboard.average})` : ""
                  } with ${leaderboard.totalStudents} students. We average all recorded scores per student, then order from highest to lowest. Students with the same average share a rank.`
                : "We’ll show your leaderboard position once we have enough class scores to compare."}
            </p>
          </>
        ) : null}

        {error ? <div style={styles.errorBox}>{error}</div> : null}
      </section>


      {loading ? (
        <section style={styles.card}>
          <p style={{ margin: 0 }}>Loading...</p>
        </section>
      ) : summary.count === 0 ? (
        <section style={styles.card}>
          <p style={{ margin: 0 }}>
            No feedback has been recorded for your student code yet.
          </p>
        </section>
      ) : (
        <ResultHistory results={results} />
      )}
    </div>
  );
};

export default StudentResultsPage;
