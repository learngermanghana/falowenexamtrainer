import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const SpeechTrainerPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div
        style={{
          ...styles.card,
          background: "linear-gradient(135deg, #eef2ff 0%, #e0f2fe 100%)",
          borderColor: "#c7d2fe",
          display: "grid",
          gap: 12,
        }}
      >
        <h2 style={{ margin: 0 }}>Speaking practice moved</h2>
        <p style={{ ...styles.helperText, margin: 0 }}>
          Goethe speaking recorder is now available only in the Exams room.
        </p>
        <div>
          <button style={styles.primaryButton} onClick={() => navigate("/exams/speaking")}>
            Open Exams Speaking Room
          </button>
        </div>
      </div>
    </div>
  );
};

export default SpeechTrainerPage;
