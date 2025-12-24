import React from "react";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";

const practiceLink =
  "https://script.google.com/macros/s/AKfycbzMIhHuWKqM2ODaOCgtS7uZCikiZJRBhpqv2p6OyBmK1yAVba8HlmVC1zgTcGWSTfrsHA/exec";

const SpeechTrainerPage = () => {
  const { studentProfile } = useAuth();
  const studentCode =
    studentProfile?.studentCode || studentProfile?.studentcode || studentProfile?.id || "";
  const displayStudentCode = studentCode || "FelixAsadu579";
  const profileLevel = (studentProfile?.level || "A2").toUpperCase();

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
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div style={{ display: "grid", gap: 6 }}>
            <p style={{ ...styles.helperText, margin: 0 }}>Speech Trainer</p>
            <h2 style={{ margin: 0 }}>Practice with the new online coach</h2>
            <p style={{ ...styles.helperText, margin: 0 }}>
              Open the updated practice tool, enter your student code, pick your level, and let the AI listen to your
              spoken answer. You will get an instant transcript, pronunciation notes, and level-targeted feedback.
            </p>
          </div>
          <div style={{ ...styles.badge, alignSelf: "start", background: "#fef3c7", color: "#92400e" }}>
            Student code: {displayStudentCode}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gap: 8,
            padding: 16,
            borderRadius: 12,
            background: "white",
            border: "1px solid #e5e7eb",
          }}
        >
          <h3 style={{ ...styles.sectionTitle, margin: 0 }}>How to use it</h3>
          <ul style={{ margin: 0, paddingLeft: 18, color: "#374151", fontSize: 13, lineHeight: 1.5 }}>
            <li>Click the button below to open the speech trainer.</li>
            <li>Type your student code so the coach saves your progress.</li>
            <li>Select your Goethe level (profile level: {profileLevel}).</li>
            <li>Record your answer and follow the on-page tips for clearer Sprechen.</li>
          </ul>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
            <a
              href={practiceLink}
              target="_blank"
              rel="noreferrer"
              style={{
                ...styles.primaryButton,
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <span role="img" aria-label="sparkles">
                ✨
              </span>
              Open Speech Trainer
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SpeechTrainerPage;
