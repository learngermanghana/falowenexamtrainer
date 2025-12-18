import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";
import { fetchResults } from "../services/resultsService";
import { useAuth } from "../context/AuthContext";

const formatDate = (value) => {
  if (!value) return "";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? "" : parsed.toLocaleDateString();
};

const average = (numbers = []) => {
  const valid = numbers.filter((value) => typeof value === "number" && Number.isFinite(value));
  if (!valid.length) return 0;
  const sum = valid.reduce((acc, value) => acc + value, 0);
  return Math.round((sum / valid.length) * 10) / 10;
};

const toScore = (entry) => {
  if (typeof entry?.overall_score === "number") return entry.overall_score;
  if (typeof entry?.score === "number") return entry.score;
  return null;
};

const buildSparklinePath = (points = [], height = 72, step = 32) => {
  if (!points.length) return "";

  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max === min ? 1 : max - min;

  const coords = points.map((value, index) => {
    const x = index * step;
    const normalized = (value - min) / range;
    const y = height - normalized * height;
    return `${x},${y}`;
  });

  return `M ${coords.join(" L ")}`;
};

const exportCsv = (rows = []) => {
  const headers = [
    "date",
    "assignment",
    "level",
    "score",
    "task_fulfilment",
    "fluency",
    "grammar",
    "vocabulary",
    "comments",
  ];

  const csvRows = rows.map((row) => [
    formatDate(row.date || row.dateIso || row.created_at || row.createdAt),
    row.assignment || row.assignmentText || "",
    row.level || row.overall_level || "",
    toScore(row),
    row?.scores?.task_fulfilment ?? "",
    row?.scores?.fluency ?? "",
    row?.scores?.grammar ?? "",
    row?.scores?.vocabulary ?? "",
    (row.comments || "").replace(/\n/g, " "),
  ]);

  const content = [headers, ...csvRows]
    .map((cells) => cells.map((cell) => `"${cell ?? ""}"`).join(","))
    .join("\n");

  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "falowen-progress.csv";
  link.click();
  URL.revokeObjectURL(url);
};

const shareSummary = async (summaryText) => {
  if (!summaryText) return;
  if (navigator.share) {
    try {
      await navigator.share({ title: "Falowen Exam Coach progress", text: summaryText });
      return;
    } catch (error) {
      // Swallow share cancellation and fallback to clipboard
    }
  }

  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(summaryText);
  }
};

const ProgressPage = () => {
  const { studentProfile } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  useEffect(() => {
    let cancelled = false;

    const loadResults = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetchResults({
          studentCode: studentProfile?.studentcode,
        });
        if (cancelled) return;
        setResults(response.results || []);
      } catch (err) {
        if (cancelled) return;
        setError(
          err?.response?.data?.error || err?.message || "Fortschrittsdaten konnten nicht geladen werden."
        );
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadResults();
    return () => {
      cancelled = true;
    };
  }, [studentProfile?.studentcode]);

  const sortedResults = useMemo(() => {
    return results
      .slice()
      .sort((a, b) => {
        const dateA = new Date(a.date || a.dateIso || a.created_at || a.createdAt || 0).getTime();
        const dateB = new Date(b.date || b.dateIso || b.created_at || b.createdAt || 0).getTime();
        return dateB - dateA;
      })
      .map((row, index) => ({ ...row, _position: index + 1 }));
  }, [results]);

  const scoredAttempts = useMemo(
    () => sortedResults.filter((row) => typeof toScore(row) === "number"),
    [sortedResults]
  );

  const skillAverages = useMemo(() => {
    const tasks = scoredAttempts.map((row) => row?.scores?.task_fulfilment).filter((v) => v !== undefined);
    const fluency = scoredAttempts.map((row) => row?.scores?.fluency).filter((v) => v !== undefined);
    const grammar = scoredAttempts.map((row) => row?.scores?.grammar).filter((v) => v !== undefined);
    const vocabulary = scoredAttempts.map((row) => row?.scores?.vocabulary).filter((v) => v !== undefined);

    return {
      overall: average(scoredAttempts.map((row) => toScore(row)).filter((v) => v !== null)),
      task: average(tasks),
      fluency: average(fluency),
      grammar: average(grammar),
      vocabulary: average(vocabulary),
    };
  }, [scoredAttempts]);

  const trendPoints = useMemo(() => {
    const chronological = scoredAttempts
      .slice()
      .sort((a, b) => {
        const dateA = new Date(a.date || a.dateIso || a.created_at || a.createdAt || 0).getTime();
        const dateB = new Date(b.date || b.dateIso || b.created_at || b.createdAt || 0).getTime();
        return dateA - dateB;
      });
    return chronological.map((row) => ({
      label: formatDate(row.date || row.dateIso || row.created_at || row.createdAt) || `Run ${row._position}`,
      score: toScore(row),
    }));
  }, [scoredAttempts]);

  const heatmap = useMemo(() => {
    const buckets = {};
    scoredAttempts.forEach((row) => {
      const level = (row.level || row.overall_level || "Level").toUpperCase();
      const teil = row.teil || row.assignment || "General";
      const key = `${level}::${teil}`;
      if (!buckets[key]) {
        buckets[key] = { level, teil, scores: [] };
      }
      const value = typeof toScore(row) === "number" ? toScore(row) : null;
      if (value !== null) buckets[key].scores.push(value);
    });
    return Object.values(buckets)
      .map((bucket) => ({
        ...bucket,
        average: average(bucket.scores),
        count: bucket.scores.length,
      }))
      .sort((a, b) => b.count - a.count || b.average - a.average);
  }, [scoredAttempts]);

  const actionItems = useMemo(() => {
    const items = [];
    const lowSkill = Object.entries({
      "Aufgabenbewältigung": skillAverages.task,
      "Fluency & Aussprache": skillAverages.fluency,
      Grammatik: skillAverages.grammar,
      Wortschatz: skillAverages.vocabulary,
    })
      .sort(([, a], [, b]) => a - b)
      .filter(([, value]) => value > 0);

    if (lowSkill.length) {
      const [label, value] = lowSkill[0];
      items.push(
        `${label} ist dein schwächstes Feld (Ø ${value}/25). Füge in den nächsten Sessions 5 Minuten gezielte Drills ein.`
      );
    }

    if (trendPoints.length >= 4) {
      const recent = trendPoints.slice(-4);
      const delta = recent[recent.length - 1].score - recent[0].score;
      if (delta < 0) {
        items.push(
          "Die letzten Durchläufe zeigen einen kleinen Dip. Starte mit einem Warm-up oder wiederhole das letzte starke Assignment."
        );
      } else {
        items.push(
          "Stetiger Aufwärtstrend – plane eine Challenge-Aufgabe oder bitte um Coach-Feedback zu deiner besten Aufnahme."
        );
      }
    }

    if (heatmap[0]?.teil) {
      items.push(
        `Fokussiere ${heatmap[0].teil} (${heatmap[0].level}) für schnelle Punkte. Nutze die zugehörigen Übungssets im Kursbuch.`
      );
    }

    return items.slice(0, 3);
  }, [heatmap, skillAverages, trendPoints]);

  const summaryText = useMemo(() => {
    if (!scoredAttempts.length) return "";
    const latest = scoredAttempts[0];
    const latestScore = toScore(latest);
    return [
      "Falowen Exam Coach Fortschritts-Update:",
      `Aktueller Schnitt: ${skillAverages.overall || "-"}/100`,
      latestScore !== null ? `Letzter Versuch: ${latestScore}/100 (${formatDate(latest.date)})` : "",
      actionItems[0] ? `Nächster Schritt: ${actionItems[0]}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  }, [actionItems, scoredAttempts, skillAverages.overall]);

  const renderSkillBar = (label, value, max = 25, accent = "#6366f1") => {
    const percent = Math.min(100, Math.max(0, (value / max) * 100));
    return (
      <div style={{ display: "grid", gap: 6 }} key={label}>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 13 }}>
          <span style={{ fontWeight: 600 }}>{label}</span>
          <span style={{ color: "#374151" }}>{value ? `${value}/${max}` : "–"}</span>
        </div>
        <div style={{ background: "#e5e7eb", borderRadius: 12, height: 10, overflow: "hidden" }}>
          <div style={{ width: `${percent}%`, background: accent, height: "100%" }} />
        </div>
      </div>
    );
  };

  const renderHeatCell = (bucket) => {
    const colorStops = [
      { threshold: 85, color: "#22c55e" },
      { threshold: 70, color: "#84cc16" },
      { threshold: 50, color: "#facc15" },
      { threshold: 30, color: "#fb923c" },
      { threshold: 0, color: "#f97316" },
    ];
    const color = (colorStops.find((stop) => bucket.average >= stop.threshold) || colorStops[colorStops.length - 1]).color;

    return (
      <div
        key={`${bucket.level}-${bucket.teil}`}
        style={{
          background: color,
          color: "#0b1223",
          borderRadius: 12,
          padding: 12,
          boxShadow: "0 8px 16px rgba(0,0,0,0.08)",
        }}
      >
        <div style={{ fontWeight: 700 }}>{bucket.teil}</div>
        <div style={{ fontSize: 13 }}>{bucket.level}</div>
        <div style={{ fontSize: 13, marginTop: 4 }}>Ø {bucket.average}/100 · {bucket.count} Versuche</div>
      </div>
    );
  };

  const renderTrendChart = () => {
    if (!trendPoints.length) {
      return <div style={styles.helperText}>Noch keine Scores vorhanden.</div>;
    }

    const values = trendPoints.map((point) => point.score ?? 0);
    const path = buildSparklinePath(values);
    const viewWidth = Math.max(1, (values.length - 1) * 32);

    return (
      <div>
        <svg viewBox={`0 0 ${viewWidth} 72`} role="img" aria-label="Score trend" style={{ width: "100%" }}>
          <path d={path} fill="none" stroke="#2563eb" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#374151" }}>
          <span>{trendPoints[0]?.label}</span>
          <span>{trendPoints[trendPoints.length - 1]?.label}</span>
        </div>
      </div>
    );
  };

  const renderHistory = () => {
    if (!sortedResults.length) return null;
    const recent = sortedResults.slice(0, 6);

    return (
      <div style={{ ...styles.card, marginBottom: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <div>
            <h3 style={{ margin: "0 0 6px 0" }}>Letzte Bewertungen</h3>
            <p style={{ ...styles.helperText, margin: 0 }}>
              Kurzüberblick über die letzten Feedbacks mit Score, Level und Assignment.
            </p>
          </div>
          <button style={styles.secondaryButton} onClick={() => exportCsv(sortedResults)}>
            CSV exportieren
          </button>
        </div>
        <div style={{ display: "grid", gap: 10, marginTop: 10 }}>
          {recent.map((row) => (
            <div
              key={row.id || row._position}
              style={{
                display: "grid",
                gridTemplateColumns: "1fr auto",
                gap: 8,
                alignItems: "center",
                border: "1px solid #e5e7eb",
                borderRadius: 10,
                padding: 12,
              }}
            >
              <div style={{ display: "grid", gap: 4 }}>
                <div style={{ fontWeight: 700 }}>{row.assignment || row.assignmentText || "Feedback"}</div>
                <div style={{ ...styles.helperText, margin: 0 }}>
                  {formatDate(row.date || row.dateIso || row.created_at || row.createdAt)} · {row.level || row.overall_level || "Level"}
                </div>
                {row.comments ? <div style={{ fontSize: 13 }}>{row.comments}</div> : null}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 24, fontWeight: 800 }}>{toScore(row) ?? "–"}</div>
                <div style={{ ...styles.helperText, margin: 0 }}>Score</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div style={{ ...styles.card, display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
        <div>
          <h2 style={styles.sectionTitle}>Fortschritt</h2>
          <p style={styles.helperText}>
            Live-Analytics aus deinen Scores und Feedbacks. Nutze die Trends, um nächste Schritte gezielt zu planen.
          </p>
        </div>
        <span style={styles.badge}>Aktive Daten</span>
      </div>

      {loading ? (
        <div style={styles.helperText}>Lade Scores ...</div>
      ) : error ? (
        <div style={styles.errorBox}>{error}</div>
      ) : (
        <>
          <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            <div style={{ ...styles.card, marginBottom: 0 }}>
              <h3 style={{ margin: "0 0 6px 0" }}>Score-Trend</h3>
              <p style={{ ...styles.helperText, margin: 0 }}>Verlauf deiner Gesamtpunkte pro Abgabe.</p>
              {renderTrendChart()}
            </div>

            <div style={{ ...styles.card, marginBottom: 0, display: "grid", gap: 10 }}>
              <h3 style={{ margin: "0 0 6px 0" }}>Skill-Breakdown</h3>
              <p style={{ ...styles.helperText, margin: 0 }}>
                Durchschnittswerte aus deinen letzten Bewertungen. Fokusfelder sind hervorgehoben.
              </p>
              {renderSkillBar("Gesamt", skillAverages.overall, 100, "#2563eb")}
              {renderSkillBar("Aufgabenbewältigung", skillAverages.task, 25, "#7c3aed")}
              {renderSkillBar("Fluency & Aussprache", skillAverages.fluency, 25, "#22c55e")}
              {renderSkillBar("Grammatik", skillAverages.grammar, 25, "#f97316")}
              {renderSkillBar("Wortschatz", skillAverages.vocabulary, 25, "#0ea5e9")}
            </div>

            <div style={{ ...styles.card, marginBottom: 0 }}>
              <h3 style={{ margin: "0 0 6px 0" }}>Action-Liste</h3>
              <p style={{ ...styles.helperText, margin: 0 }}>
                Automatisch generierte To-Dos aus deinen Schwachstellen und Trends.
              </p>
              <ul style={{ margin: "8px 0 0 18px", display: "grid", gap: 8 }}>
                {actionItems.length ? (
                  actionItems.map((item, index) => (
                    <li key={index} style={{ fontSize: 14 }}>{item}</li>
                  ))
                ) : (
                  <li style={{ ...styles.helperText, margin: 0 }}>Noch keine Vorschläge – mache zuerst eine Übung.</li>
                )}
              </ul>
            </div>
          </div>

          <div style={{ ...styles.card, margin: 0 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
              <div>
                <h3 style={{ margin: "0 0 6px 0" }}>Heatmap</h3>
                <p style={{ ...styles.helperText, margin: 0 }}>
                  Level- und Aufgabenmix. Dunklere Karten = mehr Bewertungen.
                </p>
              </div>
              <button
                style={styles.secondaryButton}
                onClick={() => shareSummary(summaryText)}
                disabled={!summaryText}
              >
                Export / Teilen
              </button>
            </div>
            <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", marginTop: 12 }}>
              {heatmap.length ? heatmap.map((bucket) => renderHeatCell(bucket)) : (
                <div style={styles.helperText}>Noch keine Daten für Heatmap.</div>
              )}
            </div>
          </div>

          {renderHistory()}
        </>
      )}
    </div>
  );
};

export default ProgressPage;
