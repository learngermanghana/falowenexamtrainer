import React from "react";
import { Link } from "react-router-dom";
import { styles } from "../styles";

export default function OnboardingStudyBuddyStart({ orientationPath = "/campus/course" }) {
  return (
    <section aria-label="Your next step in Falowen" style={{ ...styles.card, display: "grid", gap: 12, border: "1px solid #93c5fd", background: "#eff6ff" }}>
      <h2 style={{ margin: 0 }}>Ready to start learning?</h2>
      <p style={{ margin: 0, lineHeight: 1.6 }}>Your lessons are in Course Book. You can hide Study Buddy at any time and use these buttons to continue.</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
        <Link to="/campus/course" style={{ ...styles.primaryButton, textDecoration: "none" }}>Open Course Book</Link>
        <Link to={orientationPath} style={{ ...styles.secondaryButton, textDecoration: "none" }}>Start Orientation</Link>
      </div>
    </section>
  );
}
