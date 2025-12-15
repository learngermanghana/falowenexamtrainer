import React from "react";
import { styles } from "../styles";
import {
  useExam,
  ALLOWED_LEVELS,
  getTasksForLevel,
} from "../context/ExamContext";

const SettingsForm = ({ title, helperText }) => {
  const { teil, setTeil, level, setLevel, setError } = useExam();

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
          <select
            value={level}
            onChange={(e) => {
              setError("");
              setLevel(e.target.value);
            }}
            style={styles.select}
          >
            {ALLOWED_LEVELS.map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>
    </section>
  );
};

export default SettingsForm;
