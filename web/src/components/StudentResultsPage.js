import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";
import ResultHistory from "./ResultHistory";
import { fetchStudentResultsHistory } from "../services/resultsApi";
import { fetchResultsFromPublishedSheet } from "../services/resultsSheetService";
import { fetchResults } from "../services/resultsService";
import ExamReadinessBadge from "./ExamReadinessBadge";
import { resolveAssignmentCanonicalKey } from "../utils/assignmentIdentity";

const norm = (v) => String(v || "").trim().toLowerCase();
const PASS_MARK = 60;
const TOTAL_ASSIGNMENTS = {
  A1: 19,
  A2: 28,
  B1: 28,
  B2: 28,
};
const TRACKED_LEVELS = Object.keys(TOTAL_ASSIGNMENTS);

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
  const trackedLevel = TRACKED_LEVELS.includes(studentLevel) ? studentLevel : "A1";
  const studentEmail = studentProfile?.email || "";
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
      const level = String(row.level || "").trim().toUpperCase();
      const assignmentKey = resolveAssignmentCanonicalKey({
        level,
        assignmentId:
          row.assignmentKey ||
          row.canonicalAssignmentKey ||
          row.assignmentId ||
          row.assignment_id,
        assignmentTitle: row.assignment || row.assignmentTitle || row.title,
      });

      if (!scoresByStudent.has(code)) {
        scoresByStudent.set(code, {
          totalScore: 0,
          assignmentCount: 0,
          bestByAssignment: new Map(),
        });
      }

      const student = scoresByStudent.get(code);
      if (!assignmentKey) {
        student.totalScore += score;
        student.assignmentCount += 1;
        return;
      }

      const previous = student.bestByAssignment.get(assignmentKey);
      if (!Number.isFinite(previous) || score > previous) {
        if (Number.isFinite(previous)) student.totalScore -= previous;
        student.totalScore += score;
        student.bestByAssignment.set(assignmentKey, score);
      }
      student.assignmentCount = student.bestByAssignment.size;
    });

    if (!scoresByStudent.size) return null;

    const totals = Array.from(scoresByStudent.entries())
      .map(([code, stats]) => ({
        code,
        totalScore: stats.totalScore,
        assignmentCount: stats.assignmentCount,
      }))
      .sort((a, b) => {
        if (b.totalScore !== a.totalScore) return b.totalScore - a.totalScore;
        if (b.assignmentCount !== a.assignmentCount) return b.assignmentCount - a.assignmentCount;
        return a.code.localeCompare(b.code);
      });

    const studentEntry = totals.find((entry) => entry.code === norm(studentCode));
    const totalStudents = totals.length;

    if (!studentEntry) {
      return {
        totalStudents,
        rank: null,
        totalScore: null,
        assignmentCount: 0,
        level: levelFilter || "All levels",
      };
    }

    const higherCount = totals.filter(
      (entry) =>
        entry.totalScore > studentEntry.totalScore ||
        (entry.totalScore === studentEntry.totalScore &&
          entry.assignmentCount > studentEntry.assignmentCount)
    ).length;

    return {
      totalStudents,
      rank: higherCount + 1,
      totalScore: studentEntry.totalScore,
      assignmentCount: studentEntry.assignmentCount,
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
      const response = await fetchResults({ studentCode, email: studentEmail });
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
    studentEmail,
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
      const unresolvedEntries = [];
      results.forEach((entry) => {
        const level = String(entry.level || "").toUpperCase();
        if (!levels.includes(level)) return;
        const assignmentKey = resolveAssignmentCanonicalKey({
          level,
          assignmentId: entry.assignmentKey || entry.canonicalAssignmentKey || entry.assignmentId || entry.assignment_id,
          assignmentTitle: entry.assignment || entry.assignmentTitle || entry.title,
        });
        if (!assignmentKey) {
          unresolvedEntries.push(entry);
          return;
        }
        const score = toNumericScore(entry.score);
        const currentBest = bestByAssignment.get(assignmentKey);
        if (score !== null && (typeof currentBest !== "number" || score > currentBest)) {
          bestByAssignment.set(assignmentKey, score);
        } else if (currentBest === undefined) {
          bestByAssignment.set(assignmentKey, null);
        }
      });

      if (unresolvedEntries.length) {
        console.warn("Unresolved assignment keys in results rows", {
          count: unresolvedEntries.length,
          sample: unresolvedEntries.slice(0, 5),
        });
      }

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

    return {
      ...buildAssignmentStatus([trackedLevel]),
    };
  }, [results, trackedLevel]);

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
      buildProgress(
        trackedLevel,
        assignmentProgress.completed,
        TOTAL_ASSIGNMENTS[trackedLevel],
        assignmentProgress.failed
      ),
    ];
  }, [assignmentProgress, trackedLevel]);


  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section
        style={{
          ...styles.card,
          display: "grid",
          gap: 10,
          padding: 0,
          overflow: "hidden",
          border: "1px solid #dbeafe",
        }}
      >
        <div
          style={{
            minHeight: 200,
            padding: 18,
            display: "grid",
            alignContent: "end",
            gap: 8,
            backgroundImage:
              "linear-gradient(120deg, rgba(15,23,42,0.7), rgba(37,99,235,0.45)), url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=1600&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >
          <h3 style={{ ...styles.sectionTitle, margin: 0, color: "#eff6ff" }}>
            {t("examReadiness.certificate.title")}
          </h3>
          <p style={{ ...styles.helperText, margin: 0, color: "#dbeafe" }}>
            Track your readiness while you complete your level.
          </p>
        </div>
        <div style={{ padding: "0 18px 16px" }}>
          <ExamReadinessBadge studentProfile={studentProfile} variant="button" />
        </div>
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
                ? `This compares your total score${
                    leaderboard.totalScore !== null ? ` (${leaderboard.totalScore})` : ""
                  } and completed assignments (${leaderboard.assignmentCount || 0}) with ${leaderboard.totalStudents} students. We total each student's best score per assignment, then rank by total score (highest first) and use assignment count as a tie-breaker.`
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
