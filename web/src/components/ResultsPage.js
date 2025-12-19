import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";
import { fetchResults } from "../services/resultsService";

const formatDate = (value) => {
  if (!value) return "";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toLocaleString();
};

const scoreLabel = (value) => {
  if (value === null || value === undefined) return "pending";
  const numeric = Number(value);
  return Number.isFinite(numeric) ? `${numeric}%` : "pending";
};

const ResultsPage = () => {
  const { studentProfile, user } = useAuth();
  const [studentCode, setStudentCode] = useState(studentProfile?.studentcode || "");
  const [level, setLevel] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [results, setResults] = useState([]);
  const [fetchedAt, setFetchedAt] = useState(null);

  useEffect(() => {
    setStudentCode(studentProfile?.studentcode || "");
  }, [studentProfile?.studentcode]);

  useEffect(() => {
    let cancelled = false;

    const loadResults = async () => {
      if (!studentCode) {
        setResults([]);
        setFetchedAt(null);
        return;
      }
      setLoading(true);
      setError("");
      try {
        const response = await fetchResults({ level, studentCode, email: user?.email });
        if (cancelled) return;
        setResults(response.results || []);
        setFetchedAt(response.fetchedAt || new Date().toISOString());
      } catch (err) {
        if (cancelled) return;
        setError(err?.message || "Results could not be loaded. Bitte versuche es erneut.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadResults();

    return () => {
      cancelled = true;
    };
  }, [level, studentCode, user?.email]);

  const averageScore = useMemo(() => {
    const numeric = results
      .map((row) => Number(row.score))
      .filter((value) => Number.isFinite(value));
    if (!numeric.length) return null;
    const sum = numeric.reduce((total, value) => total + value, 0);
    return Math.round((sum / numeric.length) * 10) / 10;
  }, [results]);

  const bestScore = useMemo(() => {
    const numeric = results
      .map((row) => Number(row.score))
      .filter((value) => Number.isFinite(value));
    if (!numeric.length) return null;
    return Math.max(...numeric);
  }, [results]);

  const latestSync = useMemo(() => {
    return fetchedAt ? formatDate(fetchedAt) : "";
  }, [fetchedAt]);

  const sortedResults = useMemo(() => {
    return results
      .slice()
      .sort((a, b) => {
        const aDate = new Date(a.date || a.created_at || a.syncedAt || 0).getTime();
        const bDate = new Date(b.date || b.created_at || b.syncedAt || 0).getTime();
        return bDate - aDate;
      })
      .map((row, index) => ({ ...row, _id: row.id || `${row.assignment}-${index}` }));
  }, [results]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={{ ...styles.card, display: "grid", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ ...styles.sectionTitle, marginBottom: 4 }}>Results</h2>
            <p style={{ ...styles.helperText, margin: 0 }}>
              Übersicht deiner benoteten Aufgaben aus dem Firestore-Backup (scores) und der Google-Sheet-Synchronisierung.
            </p>
          </div>
          {latestSync ? <span style={styles.badge}>Sync: {latestSync}</span> : null}
        </div>

        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))" }}>
          <div>
            <label style={styles.label}>Student code</label>
            <input
              style={{ ...styles.textArea, minHeight: "auto", height: 44 }}
              value={studentCode}
              onChange={(e) => setStudentCode(e.target.value)}
              placeholder="z.B. yawa1974"
            />
            <p style={styles.helperText}>Wir suchen nach diesem Code in scores.</p>
          </div>
          <div>
            <label style={styles.label}>Level</label>
            <select
              style={styles.select}
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="all">Alle Level</option>
              <option value="A1">A1</option>
              <option value="A2">A2</option>
              <option value="B1">B1</option>
              <option value="B2">B2</option>
            </select>
            <p style={styles.helperText}>Filtere Ergebnisse nach Kurslevel.</p>
          </div>
          <div>
            <label style={styles.label}>E-Mail</label>
            <input
              style={{ ...styles.textArea, minHeight: "auto", height: 44, background: "#f9fafb" }}
              value={user?.email || ""}
              readOnly
            />
            <p style={styles.helperText}>Wird an die Suche angehängt, falls hinterlegt.</p>
          </div>
        </div>

        {error ? <div style={styles.errorBox}>{error}</div> : null}
        {loading ? <div style={styles.helperText}>Lade Ergebnisse ...</div> : null}

        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))" }}>
          <div style={styles.card}>
            <div style={{ ...styles.helperText, margin: 0 }}>Gefundene Ergebnisse</div>
            <div style={{ fontSize: 32, fontWeight: 800 }}>{results.length}</div>
          </div>
          <div style={styles.card}>
            <div style={{ ...styles.helperText, margin: 0 }}>Durchschnitt</div>
            <div style={{ fontSize: 32, fontWeight: 800 }}>
              {averageScore !== null ? `${averageScore}%` : "–"}
            </div>
          </div>
          <div style={styles.card}>
            <div style={{ ...styles.helperText, margin: 0 }}>Bester Score</div>
            <div style={{ fontSize: 32, fontWeight: 800 }}>{bestScore !== null ? `${bestScore}%` : "–"}</div>
          </div>
        </div>
      </section>

      <section style={{ ...styles.card, display: "grid", gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8 }}>
          <h3 style={{ margin: 0 }}>Ergebnisse</h3>
          <span style={styles.badge}>Quelle: /scores</span>
        </div>

        {!loading && !sortedResults.length ? (
          <p style={{ margin: 0 }}>Keine Ergebnisse gefunden. Prüfe deinen Student Code.</p>
        ) : null}

        <div style={{ display: "grid", gap: 10 }}>
          {sortedResults.map((row) => (
            <article
              key={row._id}
              style={{
                ...styles.resultCard,
                display: "grid",
                gap: 6,
                background: "#fff",
                border: row.isRetake ? "1px solid #f97316" : "1px solid #e5e7eb",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                <div>
                  <div style={{ fontWeight: 800 }}>{row.assignment || "Assignment"}</div>
                  <div style={{ ...styles.helperText, margin: 0 }}>
                    {formatDate(row.date || row.syncedAt || row.created_at) || "Datum fehlt"}
                    {row.attempt ? ` · Versuch ${row.attempt}` : ""}
                    {row.isRetake ? " · Retake" : ""}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6, flexWrap: "wrap", justifyContent: "flex-end" }}>
                  <span style={styles.badge}>{(row.level || "").toUpperCase() || "?"}</span>
                  <span style={styles.badge}>{scoreLabel(row.score)}</span>
                </div>
              </div>

              {row.comments ? <p style={{ margin: "0 0 4px 0" }}>{row.comments}</p> : null}
              {row.link ? (
                <a href={row.link} target="_blank" rel="noreferrer" style={{ fontWeight: 600 }}>
                  Link öffnen
                </a>
              ) : null}
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ResultsPage;
