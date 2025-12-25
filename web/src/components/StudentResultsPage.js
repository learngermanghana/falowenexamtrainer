import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";
import ResultHistory from "./ResultHistory"; // or wherever it lives
import { fetchStudentResultsHistory } from "../services/resultsApi";

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

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError("");
      try {
        const rows = await fetchStudentResultsHistory({ idToken, studentCode });
        if (!mounted) return;
        setResults(rows);
      } catch (e) {
        if (!mounted) return;
        setError(e?.message || "Failed to load results.");
        setResults([]);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    if (idToken && studentCode) load();
    else {
      setLoading(false);
      setResults([]);
    }

    return () => {
      mounted = false;
    };
  }, [idToken, studentCode]);

  // optional: summaries (if you already had them, keep yours)
  const summary = useMemo(() => {
    const scores = results
      .map((r) => Number(r.score))
      .filter((n) => Number.isFinite(n));

    if (!scores.length) return { count: results.length, avg: null };
    const avg = Math.round((scores.reduce((a, b) => a + b, 0) / scores.length) * 10) / 10;
    return { count: results.length, avg };
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
            : `Loaded ${summary.count} results${summary.avg !== null ? ` · Avg score: ${summary.avg}` : ""}`}
        </p>
        {error ? <div style={styles.errorBox}>{error}</div> : null}
      </section>

      {loading ? (
        <section style={styles.card}>
          <p style={{ margin: 0 }}>Loading...</p>
        </section>
      ) : (
        <ResultHistory results={results} />
      )}
    </div>
  );
};

export default StudentResultsPage;
