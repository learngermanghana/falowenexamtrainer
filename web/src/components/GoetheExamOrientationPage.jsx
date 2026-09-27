import React, { useEffect, useMemo, useState } from "react";
import AppPageShell from "./layout/AppPageShell";
import { styles } from "../styles";
import { getGoetheExamOrientationConfig } from "../data/goetheExamOrientation";

const cardStyle = {
  ...styles.card,
  borderRadius: 18,
  display: "grid",
  gap: 12,
};

const emptyProgress = (sections = []) =>
  Object.fromEntries(sections.map((section) => [section.key, false]));

const readProgress = (storageKey, sections) => {
  try {
    const saved = JSON.parse(window.localStorage.getItem(storageKey) || "null");
    if (!saved || typeof saved !== "object" || Array.isArray(saved)) return emptyProgress(sections);
    return Object.fromEntries(sections.map((section) => [section.key, saved[section.key] === true]));
  } catch {
    return emptyProgress(sections);
  }
};

const GoetheExamOrientationPage = ({ level }) => {
  const config = getGoetheExamOrientationConfig(level);
  const storageKey = config
    ? `falowen:goethe-exam-orientation:${config.level.toLowerCase()}:day${config.day}`
    : "";
  const [progress, setProgress] = useState({});

  useEffect(() => {
    if (!config || typeof window === "undefined") return;
    setProgress(readProgress(storageKey, config.sections));
  }, [config, storageKey]);

  const completedCount = useMemo(
    () => (config?.sections || []).filter((section) => progress[section.key] === true).length,
    [config, progress],
  );

  if (!config) {
    return (
      <AppPageShell
        title="Goethe Exam Orientation"
        subtitle="Für dieses Kursniveau ist noch keine Goethe-Prüfungsorientierung konfiguriert."
        backLabel="Back to Course Book"
        backTo="/campus/course"
      >
        <section style={cardStyle}>
          <p style={{ margin: 0, color: "#475569" }}>Bitte öffne die Prüfungsorientierung aus deinem aktuellen Course Book.</p>
        </section>
      </AppPageShell>
    );
  }

  const updateSection = (sectionKey, checked) => {
    const next = { ...progress, [sectionKey]: checked };
    setProgress(next);
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
    } catch {
      // Progress tracking is optional and must never block official exam practice.
    }
  };

  const allComplete = completedCount === config.sections.length;

  return (
    <AppPageShell
      title={`${config.level} · Day ${config.day} · Goethe Exam Orientation`}
      subtitle={`Kein neuer Lernstoff und keine neue Abgabe. Heute wechselst du direkt vom Falowen Course Book zur offiziellen Goethe-${config.level}-Prüfungsvorbereitung.`}
      backLabel={`Back to ${config.level} Course Book`}
      backTo="/campus/course"
    >
      <div style={{ display: "grid", gap: 16 }}>
        <section style={{ ...cardStyle, border: "1px solid #bfdbfe", background: "#eff6ff" }}>
          <span style={{ color: "#1d4ed8", fontSize: 12, fontWeight: 900, textTransform: "uppercase", letterSpacing: ".06em" }}>
            Übergang zur Prüfung
          </span>
          <h2 style={{ margin: 0, color: "#0f172a" }}>Jetzt mit dem offiziellen Goethe-Material arbeiten</h2>
          <p style={{ margin: 0, color: "#334155", lineHeight: 1.7 }}>{config.intro}</p>
          <div style={{ borderRadius: 14, padding: 12, background: "#ffffff", border: "1px solid #dbeafe", color: "#334155", lineHeight: 1.6 }}>
            <strong>Wichtig:</strong> Day {config.day} ist Prüfungsvorbereitung, keine zusätzliche Falowen-Aufgabe.
            Deine Kursanforderung bleibt bei {config.requiredAssignments} Pflichtaufgaben.
          </div>
        </section>

        <section style={{ ...cardStyle, border: "1px solid #bbf7d0", background: "#f0fdf4" }}>
          <div style={{ display: "grid", gap: 6 }}>
            <h2 style={{ margin: 0, color: "#14532d" }}>Offizielle Goethe-{config.level}-Prüfungsvorbereitung</h2>
            <p style={{ margin: 0, color: "#365314", lineHeight: 1.7 }}>{config.practiceDescription}</p>
          </div>
          <a
            href={config.practiceUrl}
            target="_blank"
            rel="noreferrer"
            style={{ ...styles.primaryButton, textDecoration: "none", width: "fit-content" }}
          >
            {config.practiceLabel}
          </a>
          <small style={{ color: "#4d7c0f" }}>Quelle: {config.source}</small>
        </section>

        <section style={cardStyle}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline", flexWrap: "wrap" }}>
            <div>
              <h2 style={{ margin: 0, color: "#0f172a" }}>Die vier Prüfungsteile</h2>
              <p style={{ margin: "5px 0 0", color: "#64748b", lineHeight: 1.6 }}>
                Bearbeite die Teile unter Prüfungsbedingungen. Setze den Haken erst nach einem echten Versuch.
              </p>
            </div>
            <strong style={{ color: allComplete ? "#047857" : "#1d4ed8" }}>
              {completedCount}/{config.sections.length} abgeschlossen
            </strong>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
            {config.sections.map((section) => {
              const checked = progress[section.key] === true;
              return (
                <article
                  key={section.key}
                  data-goethe-exam-section={section.key}
                  style={{
                    border: checked ? "1px solid #86efac" : "1px solid #e2e8f0",
                    borderRadius: 14,
                    padding: 13,
                    display: "grid",
                    gap: 9,
                    background: checked ? "#f0fdf4" : "#ffffff",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
                    <strong style={{ color: "#0f172a", fontSize: 17 }}>{section.name}</strong>
                    <span style={{ color: "#1d4ed8", fontWeight: 900, fontSize: 13 }}>{section.duration}</span>
                  </div>
                  <p style={{ margin: 0, color: "#475569", lineHeight: 1.6, fontSize: 14 }}>{section.description}</p>
                  {section.url ? (
                    <a
                      href={section.url}
                      target="_blank"
                      rel="noreferrer"
                      style={{ ...styles.secondaryButton, textDecoration: "none", width: "fit-content" }}
                    >
                      {section.name} direkt öffnen
                    </a>
                  ) : null}
                  <label style={{ display: "inline-flex", alignItems: "center", gap: 8, color: "#334155", fontWeight: 800, cursor: "pointer" }}>
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) => updateSection(section.key, event.target.checked)}
                    />
                    {section.name} versucht
                  </label>
                </article>
              );
            })}
          </div>

          {allComplete ? (
            <div style={{ borderRadius: 12, padding: 12, background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#065f46", lineHeight: 1.6 }}>
              <strong>Alle vier Prüfungsteile bearbeitet.</strong> Wiederhole jetzt nur die Bereiche, in denen du noch unsicher bist.
            </div>
          ) : null}
        </section>

        <section style={cardStyle}>
          <h2 style={{ margin: 0, color: "#0f172a" }}>So arbeitest du heute</h2>
          <ol style={{ margin: 0, paddingLeft: 22, color: "#334155", lineHeight: 1.8 }}>
            <li>Öffne zuerst das offizielle Goethe-Material{config.startSection ? ` und starte mit ${config.startSection}` : ""}.</li>
            <li>Arbeite einen Prüfungsteil nach dem anderen möglichst unter der angegebenen Zeit.</li>
            <li>Benutze während des Versuchs kein Wörterbuch und keine KI-Hilfe.</li>
            <li>Kontrolliere Lösungen oder Modelle erst nach deinem Versuch und setze dann den Haken.</li>
            <li>Notiere deine schwächsten Bereiche und wiederhole gezielt nur diese Teile.</li>
          </ol>
        </section>
      </div>
    </AppPageShell>
  );
};

export default GoetheExamOrientationPage;
