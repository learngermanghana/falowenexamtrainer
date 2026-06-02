import React from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";

const STORAGE_KEY = "falowen_onboarding_v4";

const markDay0Finished = (level) => {
  if (typeof window === "undefined" || !level) return;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const saved = raw ? JSON.parse(raw) : {};
    const next = {
      ...saved,
      day0OpenedByLevel: {
        ...(saved.day0OpenedByLevel || {}),
        [level]: true,
      },
      day0FinishedByLevel: {
        ...(saved.day0FinishedByLevel || {}),
        [level]: true,
      },
    };
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch (error) {
    console.warn("Could not update Day 0 onboarding status", error);
  }
};

const OnboardingResumeBanner = ({ level, title = "Finished Day 0?", subtitle }) => {
  const navigate = useNavigate();

  const handleContinue = () => {
    markDay0Finished(level);
    navigate("/");
  };

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
            {subtitle || "Tap the button after you finish Day 0. We will mark Day 0 complete and take you back to finish setup."}
          </p>
        </div>
        <button type="button" style={styles.primaryButton} onClick={handleContinue}>
          I finished Day 0 — continue setup
        </button>
      </div>
    </section>
  );
};

export default OnboardingResumeBanner;
