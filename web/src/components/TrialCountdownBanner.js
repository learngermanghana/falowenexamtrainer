import React, { useEffect, useMemo, useState } from "react";
import { getTrialLifecycleState } from "../lib/trialAccess";
import { styles } from "../styles";
import { PrimaryActionBar } from "./ui";

const MINUTE_MS = 60 * 1000;

const TrialCountdownBanner = ({ studentProfile, onCompletePayment }) => {
  const [nowMs, setNowMs] = useState(() => Date.now());
  const lifecycle = useMemo(
    () => getTrialLifecycleState(studentProfile, nowMs),
    [nowMs, studentProfile]
  );

  useEffect(() => {
    setNowMs(Date.now());
    const interval = window.setInterval(() => setNowMs(Date.now()), MINUTE_MS);
    return () => window.clearInterval(interval);
  }, []);

  if (!["active", "ending_soon"].includes(lifecycle.key)) return null;

  const endingSoon = lifecycle.key === "ending_soon";
  const endLabel = Number.isFinite(lifecycle.endsAtMs)
    ? new Date(lifecycle.endsAtMs).toLocaleString(undefined, {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  return (
    <section
      aria-live="polite"
      style={{
        ...styles.card,
        display: "grid",
        gap: 9,
        background: endingSoon
          ? "linear-gradient(135deg, #fff7ed 0%, #fffbeb 55%, #ffffff 100%)"
          : "linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 55%, #ffffff 100%)",
        border: endingSoon ? "2px solid #f59e0b" : "2px solid #22c55e",
      }}
    >
      <span
        style={{
          ...styles.badge,
          width: "fit-content",
          background: endingSoon ? "#b45309" : "#15803d",
          color: "#ffffff",
        }}
      >
        {endingSoon ? "Trial ending soon" : "7-day free trial"}
      </span>
      <strong style={{ fontSize: 18, color: endingSoon ? "#92400e" : "#14532d" }}>
        {lifecycle.daysRemaining} day{lifecycle.daysRemaining === 1 ? "" : "s"} remaining
      </strong>
      <p style={{ ...styles.helperText, margin: 0, color: endingSoon ? "#92400e" : "#166534", lineHeight: 1.6 }}>
        Your progress is saved. {endLabel ? `Trial access ends on ${endLabel}. ` : ""}
        Complete payment before the trial ends to continue without interruption.
      </p>
      <PrimaryActionBar align="start">
        <button type="button" style={styles.primaryButton} onClick={onCompletePayment}>
          Pay now
        </button>
      </PrimaryActionBar>
    </section>
  );
};

export default TrialCountdownBanner;
