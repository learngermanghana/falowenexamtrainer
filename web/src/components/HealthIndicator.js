import React from "react";
import { useHealthStatus } from "../hooks/useHealthStatus";
import { styles } from "../styles";

const statusCopy = {
  ok: "API online",
  offline: "API offline",
  loading: "Checking API...",
};

const statusColor = {
  ok: "#16a34a",
  offline: "#dc2626",
  loading: "#6b7280",
};

function HealthIndicator() {
  const { status } = useHealthStatus({ pollIntervalMs: 60000 });
  const label = statusCopy[status] || "API status";
  const color = statusColor[status] || statusColor.loading;

  return (
    <div style={{ display: "flex", gap: 8, alignItems: "center" }} aria-live="polite">
      <span
        aria-label={label}
        title={label}
        style={{
          width: 12,
          height: 12,
          borderRadius: "50%",
          backgroundColor: color,
          display: "inline-block",
          boxShadow: "0 0 0 3px rgba(0,0,0,0.05)",
        }}
      />
      <span style={{ ...styles.helperText, margin: 0, color: "#111827" }}>{label}</span>
    </div>
  );
}

export default HealthIndicator;
