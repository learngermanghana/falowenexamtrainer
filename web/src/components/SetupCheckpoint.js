import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { styles } from "../styles";
import TuitionStatusCard from "./TuitionStatusCard";
import { isPaymentsEnabled } from "../lib/featureFlags";
import { hasClearedBalance, normalizePaymentStatus } from "../lib/paymentStatus";
import { formatCurrency } from "../lib/formatters";
import { toDateMs } from "../lib/dateUtils";

const TRIAL_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

const SetupCheckpoint = () => {
  const { studentProfile, refreshUser, saveStudentProfile, logout } = useAuth();
  const { i18n } = useTranslation();
  const locale = i18n.language;
  const [status, setStatus] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [startingTrial, setStartingTrial] = useState(false);
  const paymentsEnabled = isPaymentsEnabled();

  const paidAmount = useMemo(() => {
    const paid = studentProfile?.paid ?? studentProfile?.initialPaymentAmount ?? 0;
    return Math.max(Number(paid) || 0, 0);
  }, [studentProfile?.initialPaymentAmount, studentProfile?.paid]);

  const balanceDue = useMemo(() => {
    const balance = studentProfile?.balanceDue ?? studentProfile?.balance;
    if (balance === null || balance === undefined) return undefined;
    return Math.max(Number(balance) || 0, 0);
  }, [studentProfile?.balance, studentProfile?.balanceDue]);

  const checkpoints = useMemo(() => {
    const paymentStatus = normalizePaymentStatus(studentProfile?.paymentStatus);
    const balanceCleared = hasClearedBalance(balanceDue);
    return {
      paymentStatus,
      paymentReady: paymentStatus === "paid" || balanceCleared,
    };
  }, [balanceDue, studentProfile?.paymentStatus]);

  const checkoutAmountOverride = useMemo(() => {
    const intended = Number(studentProfile?.paymentIntentAmount);
    const alreadyPaid = paidAmount > 0;
    if (alreadyPaid) return undefined;
    if (!Number.isFinite(intended) || intended <= 0) return undefined;
    // If the student selected an amount during signup, charge that amount on first checkout.
    return intended;
  }, [paidAmount, studentProfile?.paymentIntentAmount]);

  const trialState = useMemo(() => {
    const endsAtMs = toDateMs(studentProfile?.trialEndsAt);
    const startedAtMs = toDateMs(studentProfile?.trialStartedAt);
    const usedAtMs = toDateMs(studentProfile?.trialUsedAt);
    const wasUsed =
      Number.isFinite(startedAtMs) ||
      Number.isFinite(endsAtMs) ||
      Number.isFinite(usedAtMs);
    const active = Number.isFinite(endsAtMs) && endsAtMs > Date.now();
    return { active, endsAtMs, wasUsed };
  }, [studentProfile?.trialEndsAt, studentProfile?.trialStartedAt, studentProfile?.trialUsedAt]);

  const handleStartTrial = async () => {
    if (trialState.wasUsed || startingTrial) return;
    setStartingTrial(true);
    setStatus("");
    try {
      const startedAt = new Date();
      const endsAt = new Date(startedAt.getTime() + TRIAL_DURATION_MS);
      await saveStudentProfile({
        trialStartedAt: startedAt.toISOString(),
        trialEndsAt: endsAt.toISOString(),
        trialUsedAt: startedAt.toISOString(),
      });
      setStatus("Your 7-day free trial is active. Opening your Falowen campus...");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not start your free trial.";
      setStatus(message);
      setStartingTrial(false);
    }
  };

  const handlePayTuition = () => {
    document.getElementById("tuition-payment")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleRefreshStatus = async () => {
    setRefreshing(true);
    setStatus("");
    try {
      await refreshUser();
      setStatus("Status refreshed. If your payment is confirmed, you'll unlock full access.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not refresh status.";
      setStatus(message);
    } finally {
      setRefreshing(false);
    }
  };

  const trialEndLabel = Number.isFinite(trialState.endsAtMs)
    ? new Intl.DateTimeFormat(locale || "en", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(trialState.endsAtMs))
    : "";

  return (
    <div style={{ ...styles.container, display: "grid", placeItems: "center" }}>
      <div style={{ ...styles.card, width: "100%", maxWidth: 920, display: "grid", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <div>
            <h2 style={{ ...styles.sectionTitle, marginBottom: 6 }}>Finish setting up your account</h2>
            <p style={{ ...styles.helperText, margin: 0 }}>
              Choose a 7-day free trial or complete your tuition payment to continue into Falowen.
            </p>
          </div>
          <button style={styles.secondaryButton} onClick={logout}>
            Logout
          </button>
        </div>

        <div
          style={{
            ...styles.card,
            margin: 0,
            borderColor: trialState.wasUsed ? "#e2e8f0" : "#93c5fd",
            background: trialState.wasUsed ? "#f8fafc" : "#eff6ff",
            display: "grid",
            gap: 12,
          }}
        >
          <div>
            <span style={{ ...styles.badge, background: "#dbeafe", color: "#1e40af" }}>
              Choose how you want to continue
            </span>
            <h3 style={{ margin: "10px 0 4px" }}>
              {trialState.wasUsed ? "Continue with tuition payment" : "Start free or pay now"}
            </h3>
            <p style={{ ...styles.helperText, margin: 0, lineHeight: 1.6 }}>
              {trialState.wasUsed
                ? `Your one-time free trial${trialEndLabel ? ` ended on ${trialEndLabel}` : " has already been used"}. Your progress is saved. Complete your tuition payment to continue.`
                : "Start your one-time 7-day free trial for full student access, or pay your tuition now. Starting the trial does not count as a payment or reduce your tuition balance."}
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 10,
            }}
          >
            {!trialState.wasUsed ? (
              <button
                type="button"
                style={{ ...styles.primaryButton, width: "100%" }}
                onClick={handleStartTrial}
                disabled={startingTrial}
              >
                {startingTrial ? "Starting your trial..." : "Start 7-day free trial"}
              </button>
            ) : null}

            <button
              type="button"
              style={{ ...styles.secondaryButton, width: "100%" }}
              onClick={handlePayTuition}
            >
              Pay tuition
            </button>
          </div>
        </div>

        <div
          style={{
            ...styles.card,
            margin: 0,
            background: "#f8fafc",
            borderColor: "#e2e8f0",
            display: "grid",
            gap: 6,
          }}
        >
          <div style={styles.metaRow}>
            <span>Student code</span>
            <span style={styles.badge}>{studentProfile?.level || "–"}</span>
          </div>
          <strong style={{ fontSize: 24 }}>{studentProfile?.studentCode || "Loading..."}</strong>
          <p style={{ ...styles.helperText, margin: 0 }}>
            Share this code with your instructor or use it when submitting assignments and practice drills.
          </p>
        </div>

        <div id="tuition-payment" style={{ scrollMarginTop: 16 }}>
          <TuitionStatusCard
            level={studentProfile?.level}
            paidAmount={paidAmount}
            balanceDue={balanceDue}
            tuitionFee={studentProfile?.tuitionFee}
            checkoutAmountOverride={checkoutAmountOverride}
            title="Pay your tuition"
            description={
              paymentsEnabled
                ? "Choose how much to pay now. We'll show Paystack your paid-so-far and remaining balance for clarity."
                : "Payments are available on the web app. Sign in on the website to complete your tuition."
            }
          />
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <button
            style={styles.secondaryButton}
            onClick={handleRefreshStatus}
            disabled={refreshing}
          >
            {refreshing ? "Refreshing..." : "Refresh payment status"}
          </button>
        </div>

        <div style={{ ...styles.card, margin: 0, background: "#fef3c7", border: "1px solid #f59e0b" }}>
          <h3 style={{ margin: "0 0 4px" }}>Limited access active</h3>
          <p style={{ ...styles.helperText, margin: 0 }}>
            Until you start the free trial or complete payment, live classes and community features stay locked. Account & Billing remains available
            so you can return to your student code and payment link anytime.
          </p>
          {!checkpoints.paymentReady && (
            <p style={{ ...styles.helperText, margin: "6px 0 0" }}>
              Current payment status: <strong>{checkpoints.paymentStatus}</strong>
            </p>
          )}
        </div>

        {status && (
          <div style={{ ...styles.card, margin: 0, background: "#ecfdf3", borderColor: "#22c55e" }}>
            <strong>{status}</strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default SetupCheckpoint;
