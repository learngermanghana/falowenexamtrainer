import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useHealthStatus } from "../hooks/useHealthStatus";
import { useOfflineStatus } from "../hooks/useOfflineStatus";
import { styles } from "../styles";
import Day0StudentWorkflowAutoMount from "./Day0StudentWorkflowAutoMount";

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

const isDay0CoursePath = (pathname = "") =>
  pathname.startsWith("/campus/course/") && pathname.includes("day-0");

function HealthIndicator() {
  const { status } = useHealthStatus({ pollIntervalMs: 60000 });
  const { isOffline } = useOfflineStatus();
  const location = useLocation();
  const navigate = useNavigate();
  const label = isOffline ? "Offline mode" : statusCopy[status] || "API status";
  const color = isOffline ? "#f59e0b" : statusColor[status] || statusColor.loading;
  const showDay0Return = isDay0CoursePath(location.pathname);

  return (
    <>
      <Day0StudentWorkflowAutoMount />
      <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }} aria-live="polite">
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
        {showDay0Return ? (
          <button
            type="button"
            onClick={() => navigate("/")}
            style={{
              ...styles.primaryButton,
              padding: "6px 10px",
              fontSize: 12,
              background: "#dcfce7",
              color: "#166534",
              borderColor: "#86efac",
            }}
          >
            I finished Day 0 — continue setup
          </button>
        ) : null}
      </div>
    </>
  );
}

export default HealthIndicator;
