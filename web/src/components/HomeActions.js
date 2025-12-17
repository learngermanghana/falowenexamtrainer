import React from "react";
import { styles } from "../styles";

const HomeActions = ({ onSelect }) => {
  return (
    <div style={{ ...styles.card, display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
        <h2 style={styles.sectionTitle}>What do you want to do today?</h2>
        <span style={styles.levelPill}>Quick start</span>
      </div>
      <p style={styles.helperText}>
        Choose one of the two main tasks for today: study in the course book or try an exam
        simulation. Simple English helps everyone, especially A1 students.
      </p>
      <div style={{ display: "grid", gap: 10 }}>
        <button
          style={{ ...styles.primaryButton, padding: "14px 16px", fontSize: 16 }}
          onClick={() => onSelect("course")}
        >
          Kursbuch öffnen (open course book)
        </button>
        <button
          style={{ ...styles.secondaryButton, padding: "14px 16px", fontSize: 16 }}
          onClick={() => onSelect("exam")}
        >
          Zur Prüfungssimulation (go to exam practice)
        </button>
        <button
          style={{ ...styles.secondaryButton, padding: "14px 16px", fontSize: 16 }}
          onClick={() => onSelect("discussion")}
        >
          Zur Klassendiskussion (class discussion)
        </button>
        <button
          style={{ ...styles.secondaryButton, padding: "14px 16px", fontSize: 16 }}
          onClick={() => onSelect("account")}
        >
          Konto, Vertrag &amp; Zahlungen (account &amp; payments)
        </button>
      </div>
    </div>
  );
};

export default HomeActions;
