import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";
import ResultHistory from "./ResultHistory";
import { fetchStudentResultsHistory } from "../services/resultsApi";
import { fetchResultsFromPublishedSheet } from "../services/resultsSheetService";
import { fetchResults } from "../services/resultsService";
import { fetchPersonalizedPlan } from "../services/personalizationService";
import ExamReadinessBadge from "./ExamReadinessBadge";

const norm = (v) => String(v || "").trim().toLowerCase();

const StudentResultsPage = () => {
  const { t } = useTranslation();
  const { idToken, studentProfile, user } = useAuth();

  const [results, setResults] = useState([]);
  const [leaderboard, setLeaderboard] = useState(null);
  const [personalization, setPersonalization] = useState(null);
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

  const TOTAL_ASSIGNMENTS = {
    A1: 19,
    A2_B2: 28,
  };

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
          const [rows, leaderboardRows, personalizationResponse] = await Promise.all([
            loadFromResultsStore(),
            loadLeaderboardFromResultsStore(),
            fetchPersonalizedPlan({
              studentCode,
              email: studentProfile?.email,
              className: studentProfile?.className,
              level: studentLevel,
              userId: user?.uid,
            }),
          ]);
          if (!mounted) return;
          setResults(rows);
          setLeaderboard(buildLeaderboard(leaderboardRows));
          setPersonalization(personalizationResponse || null);
          return;
        }

        // Prefer sheet for A1/A2/B1 if configured
        if (useSheetResults && SHEET_CSV_URL) {
          const [sheetResponse, personalizationResponse] = await Promise.all([
            loadFromSheet(),
            fetchPersonalizedPlan({
              studentCode,
              email: studentProfile?.email,
              className: studentProfile?.className,
              level: studentLevel,
              userId: user?.uid,
            }),
          ]);
          const { mine, all } = sheetResponse;
          if (!mounted) return;
          setResults(mine);
          setLeaderboard(buildLeaderboard(all));
          setPersonalization(personalizationResponse || null);
          return;
        }

        // Otherwise fall back to API
        if (idToken) {
          const [rows, personalizationResponse] = await Promise.all([
            loadFromApi(),
            fetchPersonalizedPlan({
              studentCode,
              email: studentProfile?.email,
              className: studentProfile?.className,
              level: studentLevel,
              userId: user?.uid,
            }),
          ]);
          if (!mounted) return;
          setResults(rows);
          setLeaderboard(null);
          setPersonalization(personalizationResponse || null);
          return;
        }

        // Not enough info to load
        if (!mounted) return;
        setResults([]);
        setLeaderboard(null);
        setPersonalization(null);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || "Failed to load results.");
        setResults([]);
        setLeaderboard(null);
        setPersonalization(null);
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
    studentProfile?.className,
    studentProfile?.email,
    user?.uid,
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
    const uniqueAssignments = (levels) => {
      const set = new Set();
      results.forEach((entry) => {
        const level = String(entry.level || "").toUpperCase();
        if (!levels.includes(level)) return;
        const assignmentKey = normalizeAssignment(entry.assignment);
        if (assignmentKey) set.add(assignmentKey);
      });
      return set.size;
    };

    return {
      a1Completed: uniqueAssignments(["A1"]),
      a2b2Completed: uniqueAssignments(["A2", "B1", "B2"]),
    };
  }, [results]);

  const personalizationRecommendations = personalization?.recommendations || [];
  const personalizationHighlights = personalization?.highlights || [];

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={{ ...styles.card, display: "grid", gap: 8 }}>
        <h3 style={{ ...styles.sectionTitle, margin: 0 }}>Certificate readiness</h3>
        <p style={{ ...styles.helperText, margin: 0 }}>
          Always visible with your results so you can confirm certificate progress before course completion.
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
          <p style={{ ...styles.helperText, marginTop: 6 }}>
            Assignments completed · A1 {assignmentProgress.a1Completed}/{TOTAL_ASSIGNMENTS.A1} · A2-B2{" "}
            {assignmentProgress.a2b2Completed}/{TOTAL_ASSIGNMENTS.A2_B2}
          </p>
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

      <section style={{ ...styles.card, border: "1px solid #dbeafe", background: "#eff6ff" }}>
        <h3 style={{ ...styles.sectionTitle, marginBottom: 6 }}>{t("personalization.title")}</h3>
        <p style={{ ...styles.helperText, margin: "0 0 12px 0" }}>{t("personalization.subtitle")}</p>
        {personalizationRecommendations.length ? (
          <div style={{ display: "grid", gap: 10 }}>
            <ol style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8 }}>
              {personalizationRecommendations.map((item) => (
                <li key={item.title}>
                  <strong>{item.title}.</strong>{" "}
                  <span style={{ color: "#4b5563" }}>{item.detail}</span>
                </li>
              ))}
            </ol>
            <div>
              <div style={{ ...styles.helperText, fontWeight: 600, marginBottom: 6 }}>
                {t("personalization.feedbackLabel")}
              </div>
              <div style={{ ...styles.helperText, margin: 0 }}>{personalization?.feedback}</div>
            </div>
            {personalizationHighlights.length ? (
              <div>
                <div style={{ ...styles.helperText, fontWeight: 600, marginBottom: 6 }}>
                  {t("personalization.highlightsLabel")}
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {personalizationHighlights.map((item) => (
                    <span
                      key={`${item.label}-${item.value}`}
                      style={{
                        padding: "6px 10px",
                        background: "#fff",
                        borderRadius: 999,
                        border: "1px solid #bfdbfe",
                        fontSize: 12,
                        color: "#1f2937",
                      }}
                    >
                      <strong>{item.label}:</strong> {item.value}
                    </span>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        ) : (
          <p style={{ ...styles.helperText, margin: 0 }}>{t("personalization.fallback")}</p>
        )}
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
