import React from "react";
import { styles } from "../styles";
import { useExam, getTasksForLevel } from "../context/ExamContext";

const SettingsForm = ({ title, helperText }) => {
  const { teil, setTeil, level, setError } = useExam();

  const teilOptions = getTasksForLevel(level);

  return (
    <section style={styles.card}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      {helperText && <p style={styles.helperText}>{helperText}</p>}

      <div style={styles.row}>
        <div style={styles.field}>
          <label style={styles.label}>Teil</label>
          <select
            value={teil}
            onChange={(e) => {
              setError("");
              setTeil(e.target.value);
            }}
            style={styles.select}
          >
            {teilOptions.map((option) => (
              <option key={option.id} value={option.label}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Niveau</label>
          <input
            value={level}
            readOnly
            style={{ ...styles.select, background: "#f3f4f6", cursor: "not-allowed" }}
          />
          <p style={{ ...styles.helperText, margin: "6px 0 0" }}>
            Das Niveau wird nach der Anmeldung automatisch gesetzt.
          </p>
        </div>
      </div>
    </section>
  );
};

export default SettingsForm;
