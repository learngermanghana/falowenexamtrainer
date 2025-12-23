import React from "react";
import { styles } from "../styles";

const SPEAKING_LINK =
  "https://script.google.com/macros/s/AKfycbyJ5lTeXUgaGw-rejDuh_2ex7El_28JgKLurOOsO1c8LWfVE-Em2-vuWuMn1hC5-_IN/exec";

const SpeakingPage = () => {
  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <div style={{ marginBottom: 12 }}>
          <h1 style={{ ...styles.title, marginBottom: 8 }}>Speaking Exams</h1>
          <p style={styles.subtitle}>
            Bitte nutze den folgenden Link, um zur Goethe Speaking Exams Seite zu
            gelangen.
          </p>
        </div>

        <div style={{ display: "grid", gap: 12 }}>
          <p style={{ fontSize: 16, color: "#111827", lineHeight: 1.5 }}>
            Klicke auf den Button unten, gib deinen Student Code ein und folge
            den Anweisungen, um deine Goethe Speaking Exams zu starten.
          </p>
          <a
            href={SPEAKING_LINK}
            target="_blank"
            rel="noreferrer"
            style={{
              ...styles.buttonPrimary,
              textDecoration: "none",
              textAlign: "center",
            }}
          >
            Goethe Speaking Exams öffnen
          </a>
        </div>
      </div>
    </div>
  );
};

export default SpeakingPage;
