import React from "react";
import HomeActions from "./HomeActions";
import { styles } from "../styles";
import ClassCalendarCard from "./ClassCalendarCard";

const PlanPage = ({ onSelect }) => {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <ClassCalendarCard />

      <HomeActions onSelect={onSelect} />

      <div style={{ ...styles.card, display: "grid", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center" }}>
          <h2 style={styles.sectionTitle}>Zwei Wege für heute</h2>
          <span style={styles.badge}>Login nötig</span>
        </div>
        <p style={styles.helperText}>
          Halte die Startseite schlank: Entscheide dich zwischen Kursbuch und Prüfungssimulation. Alle
          weiteren Inhalte erreichst du später innerhalb dieser Bereiche.
        </p>
        <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
          <div style={{ ...styles.card, marginBottom: 0, background: "#f9fafb" }}>
            <h3 style={{ margin: "0 0 6px 0" }}>Kursbuch</h3>
            <p style={{ ...styles.helperText, marginBottom: 10 }}>
              Öffne dein Kursmaterial und arbeite die Lektionen oder Hausaufgaben durch.
            </p>
            <ul style={styles.checklist}>
              <li>Alle PDFs, Videos und Worksheets an einem Ort.</li>
              <li>Roter Faden über die nächsten Aufgaben im Kurs.</li>
              <li>Nach dem Login direkt in das aktuelle Modul springen.</li>
            </ul>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
              <button style={styles.secondaryButton} onClick={() => onSelect("course")}>Zum Kursbuch</button>
            </div>
          </div>

          <div style={{ ...styles.card, marginBottom: 0, background: "#fef3c7", border: "1px solid #f59e0b" }}>
            <h3 style={{ margin: "0 0 6px 0" }}>Prüfungen</h3>
            <p style={{ ...styles.helperText, marginBottom: 10 }}>
              Starte eine Prüfungssimulation mit klaren Aufgaben und Timer.
            </p>
            <ul style={styles.checklist}>
              <li>Direkt in die nächste Speaking- oder Writing-Session springen.</li>
              <li>Fragen und Prompts erscheinen erst nach Login.</li>
              <li>Feedback und Score werden nach jeder Runde gespeichert.</li>
            </ul>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
              <button style={styles.primaryButton} onClick={() => onSelect("exam")}>Zur Prüfung</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanPage;
