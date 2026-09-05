import React, { useEffect, useMemo, useState } from "react";
import { toDateMs } from "../lib/dateUtils";
import { hasClearedBalance, normalizePaymentStatus } from "../lib/paymentStatus";
import { styles } from "../styles";
import { PrimaryActionBar } from "./ui";

const DAY_MS = 24 * 60 * 60 * 1000;
const MINUTE_MS = 60 * 1000;

export const getTrialCountdown = (trialEndsAt, nowMs = Date.now()) => {
  const trialEndMs = toDateMs(trialEndsAt);
  if (!Number.isFinite(trialEndMs) || trialEndMs <= nowMs) return null;

  const remainingMs = trialEndMs - nowMs;
  return {
    trialEndMs,
    remainingMs,
    daysRemaining: Math.ceil(remainingMs / DAY_MS),
  };
};

const TrialCountdownBanner = ({ studentProfile, onCompletePayment }) => {
  const [nowMs, setNowMs] = useState(() => Date.now());
  const trialEndsAt = studentProfile?.trialEndsAt;
  const countdown = useMemo(() => getTrialCountdown(trialEndsAt, nowMs), [nowMs, trialEndsAt]);
  const paymentStatus = normalizePaymentStatus(studentProfile?.paymentStatus);
  const balanceDue = studentProfile?.balanceDue ?? studentProfile?.balance;
  const paymentComplete = paymentStatus === "paid" || hasClearedBalance(balanceDue);

  useEffect(() => {
    setNowMs(Date.now());
    if (!trialEndsAt) return undefined;

    const interval = window.setInterval(() => setNowMs(Date.now()), MINUTE_MS);
    return () => window.clearInterval(interval);
  }, [trialEndsAt]);

  if (!countdown || paymentComplete) return null;

  const { daysRemaining, trialEndMs, remainingMs } = countdown;
  const title =
    remainingMs <= DAY_MS
      ? "Free trial — less than 1 day remaining"
      : `Free trial — ${daysRemaining} days remaining`;
  const endLabel = new Date(trialEndMs).toLocaleString(undefined, {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <section
      aria-live="polite"
      style={{
        ...styles.card,
        display: "grid",
        gap: 9,
        background: "linear-gradient(135deg, #ecfdf5 0%, #f0fdf4 55%, #ffffff 100%)",
        border: "2px solid #22c55e",
        boxShadow: "0 12px 28px rgba(34, 197, 94, 0.14)",
      }}
    >
      <span
        style={{
          ...styles.badge,
          width: "fit-content",
          background: "#15803d",
          color: "#ffffff",
        }}
      >
        7-day free trial
      </span>
      <strong style={{ fontSize: 18, color: "#14532d" }}>{title}</strong>
      <p style={{ ...styles.helperText, margin: 0, color: "#166534", lineHeight: 1.6 }}>
        Your learning progress is being saved. Complete your tuition payment before {endLabel} to continue without interruption.
      </p>
      <PrimaryActionBar align="start">
        <button type="button" style={styles.primaryButton} onClick={onCompletePayment}>
          Complete Payment
        </button>
      </PrimaryActionBar>
    </section>
  );
};

export default TrialCountdownBanner;
