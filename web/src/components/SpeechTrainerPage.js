import React from "react";
import { styles } from "../styles";

const CAMPUS_SPEAKING_LINK =
  "https://script.google.com/macros/s/AKfycbzMIhHuWKqM2ODaOCgtS7uZCikiZJRBhpqv2p6OyBmK1yAVba8HlmVC1zgTcGWSTfrsHA/exec";

const SpeechTrainerPage = () => {
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
        <h2 style={{ margin: 0 }}>Campus Speaking Practice</h2>
        <p style={{ ...styles.helperText, margin: 0 }}>
          Open the dedicated campus speaking practice page.
        </p>
        <div>
          <a href={CAMPUS_SPEAKING_LINK} target="_blank" rel="noreferrer" style={{ ...styles.primaryButton, textDecoration: "none" }}>
            Open Campus Speaking Page
          </a>
        </div>
      </div>
    </div>
  );
};

export default SpeechTrainerPage;
