import React, { useMemo } from "react";
import { styles } from "../styles";

const passwordRules = [
  {
    label: "Use at least 8 characters",
    check: (value) => value.length >= 8,
  },
  {
    label: "Include a letter",
    check: (value) => /[A-Za-z]/.test(value),
  },
  {
    label: "Include a number",
    check: (value) => /\d/.test(value),
  },
  {
    label: "Add a symbol for extra strength",
    check: (value) => /[^A-Za-z0-9]/.test(value),
  },
];

const strengthLevels = [
  { label: "Add a password", color: "#d1d5db" },
  { label: "Weak", color: "#fca5a5" },
  { label: "Fair", color: "#fbbf24" },
  { label: "Good", color: "#34d399" },
  { label: "Strong", color: "#22c55e" },
];

const PasswordGuidance = ({ password }) => {
  const { metRules, score, label, color } = useMemo(() => {
    const metRules = passwordRules.map((rule) => ({
      label: rule.label,
      met: rule.check(password),
    }));
    const metCount = metRules.filter((rule) => rule.met).length;
    const score = Math.min(metCount, strengthLevels.length - 1);
    const { label, color } = strengthLevels[score];

    return { metRules, score, label, color };
  }, [password]);

  const barWidth = `${(score / (strengthLevels.length - 1)) * 100}%`;

  return (
    <div style={{ background: "#f9fafb", border: "1px solid #e5e7eb", borderRadius: 10, padding: 10 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ ...styles.helperText, marginBottom: 0, fontWeight: 600, color: "#111827" }}>
          Password tips
        </span>
        <span style={{ fontSize: 12, color: "#111827", fontWeight: 600 }}>{label}</span>
      </div>
      <div style={{ height: 8, background: "#e5e7eb", borderRadius: 999, marginBottom: 8 }}>
        <div
          style={{
            height: "100%",
            width: barWidth,
            background: color,
            borderRadius: 999,
            transition: "width 120ms ease-out",
          }}
        />
      </div>
      <ul style={{ ...styles.checklist, margin: 0 }}>
        {metRules.map((rule) => (
          <li key={rule.label} style={{ color: rule.met ? "#166534" : styles.helperText.color }}>
            {rule.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PasswordGuidance;
