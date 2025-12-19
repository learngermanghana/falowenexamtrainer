import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";
import { fetchExamEntries } from "../services/sheetContentService";

const SpeakingPage = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [level, setLevel] = useState("all");
  const [teil, setTeil] = useState("all");

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const data = await fetchExamEntries();
        if (mounted) setEntries(data);
      } catch (e) {
        console.error(e);
        if (mounted) setError("Exams konnten nicht geladen werden.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const levels = useMemo(
    () => ["all", ...Array.from(new Set(entries.map(e => e.level).filter(Boolean))).sort()],
    [entries]
  );
  const teile = useMemo(
    () => ["all", ...Array.from(new Set(entries.map(e => e.teil).filter(Boolean))).sort()],
    [entries]
  );

  const filtered = useMemo(() => {
    return entries.filter(e =>
      (level === "all" || e.level === level) &&
      (teil === "all" || e.teil === teil)
    );
  }, [entries, level, teil]);

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={styles.card}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ ...styles.sectionTitle, margin: 0 }}>Sprechen – Prüfungsaufgaben</h2>
            <p style={{ ...styles.helperText, margin: "6px 0 0" }}>
              Diese Liste wird direkt aus Google Sheets geladen (<code>/api/exams</code>).
            </p>
          </div>

          <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
            <label style={{ fontSize: 13, color: "#374151" }}>
              Level:
              <select value={level} onChange={(e) => setLevel(e.target.value)} style={{ ...styles.input, marginLeft: 8 }}>
                {levels.map(l => <option key={l} value={l}>{l === "all" ? "Alle" : l}</option>)}
              </select>
            </label>

            <label style={{ fontSize: 13, color: "#374151" }}>
              Teil:
              <select value={teil} onChange={(e) => setTeil(e.target.value)} style={{ ...styles.input, marginLeft: 8 }}>
                {teile.map(t => <option key={t} value={t}>{t === "all" ? "Alle" : t}</option>)}
              </select>
            </label>
          </div>
        </div>

        {loading && <p>Exams werden geladen ...</p>}
        {error && <p style={{ color: "var(--color-error)" }}>{error}</p>}

        {!loading && !error && filtered.length === 0 && (
          <p style={styles.helperText}>Keine Einträge gefunden.</p>
        )}

        <div style={styles.vocabGrid}>
          {filtered.map((e) => (
            <div key={e.id} style={styles.vocabCard}>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <span style={styles.badge}>{e.level || "Level"}</span>
                <span style={styles.badge}>{e.teil || "Teil"}</span>
                {e.keyword ? <span style={styles.badge}>{e.keyword}</span> : null}
              </div>
              <p style={{ ...styles.vocabTitle, margin: "8px 0 0" }}>{e.prompt}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SpeakingPage;
