import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";
import ResultHistory from "./ResultHistory";
import { fetchStudentResultsHistory } from "../services/resultsApi";
import { fetchResultsFromPublishedSheet } from "../services/resultsSheetService";

const StudentResultsPage = () => {
  const { idToken, studentProfile } = useAuth();

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const studentCode =
    studentProfile?.studentCode ||
    studentProfile?.studentcode ||
    studentProfile?.id ||
    "";

  const TOTAL_ASSIGNMENTS = {
    A1: 19,
    A2_B2: 28,
  };

  // Put your published CSV URL here via env:
  // REACT_APP_RESULTS_SHEET_CSV_URL=https://docs.google.com/spreadsheets/d/e/.../pub?output=csv
  const SHEET_CSV_URL = process.env.REACT_APP_RESULTS_SHEET_CSV_URL || "";

  const norm = (v) => String(v || "").trim().toLowerCase();

  useEffect(() => {
    let mounted = true;

    const loadFromSheet = async () => {
      const all = await fetchResultsFromPublishedSheet(SHEET_CSV_URL);

      // Filter ONLY this student’s rows (privacy + correctness)
      const mine = all.filter((r) => norm(r.studentcode) === norm(studentCode));

      return mine;
    };

    const loadFromApi = async () => {
      const rows = await fetchStudentResultsHistory({ idToken, studentCode });
      return Array.isArray(rows) ? rows : [];
    };

    const load = async () => {
      setLoading(true);
      setError("");

      try {
        if (!studentCode) {
          if (!mounted) return;
          setResults([]);
          return;
        }

        // Prefer sheet if configured
        if (SHEET_CSV_URL) {
          const rows = await loadFromSheet();
          if (!mounted) return;
          setResults(rows);
          return;
        }

        // Otherwise fall back to API
        if (idToken) {
          const rows = await loadFromApi();
          if (!mounted) return;
          setResults(rows);
          return;
        }

        // Not enough info to load
        if (!mounted) return;
        setResults([]);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || "Failed to load results.");
        setResults([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    load();
    return () => {
      mounted = false;
    };
  }, [idToken, studentCode, SHEET_CSV_URL]);

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

  return (
    <div style={{ display: "grid", gap: 12 }}>
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
