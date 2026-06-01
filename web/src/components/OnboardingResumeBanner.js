import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const OnboardingResumeBanner = ({ title = "Finished Day 0?", subtitle }) => {
  const navigate = useNavigate();

  return (
    <section
      style={{
        ...styles.card,
        display: "grid",
        gap: 10,
        border: "2px solid #22c55e",
        background: "linear-gradient(135deg, #f0fdf4, #ffffff)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <div>
          <p style={{ ...styles.badge, width: "fit-content", background: "#dcfce7", color: "#166534", margin: 0 }}>
            Onboarding setup
          </p>
          <h2 style={{ margin: "6px 0 4px", fontSize: 20 }}>{title}</h2>
          <p style={{ ...styles.helperText, margin: 0 }}>
            {subtitle || "Return to onboarding to continue with live class access, notifications, and then open your dashboard."}
          </p>
        </div>
        <button type="button" style={styles.primaryButton} onClick={() => navigate("/")}>
          I finished Day 0 — continue setup
        </button>
      </div>
    </section>
  );
};

export default OnboardingResumeBanner;
