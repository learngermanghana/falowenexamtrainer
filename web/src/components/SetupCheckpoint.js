import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { styles } from "../styles";
import TuitionStatusCard from "./TuitionStatusCard";
import { isPaymentsEnabled } from "../lib/featureFlags";
import { hasClearedBalance, normalizePaymentStatus } from "../lib/paymentStatus";
import { formatCurrency } from "../lib/formatters";
import { getTrialLifecycleState, TRIAL_LENGTH_MS, TRIAL_RETENTION_MS } from "../lib/trialAccess";


const SetupCheckpoint = () => {
  const { studentProfile, refreshStudentProfile, saveStudentProfile, logout } = useAuth();
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

  const trialState = useMemo(
    () => getTrialLifecycleState(studentProfile),
    [studentProfile]
  );
  const trialWasUsed = trialState.key !== "unused";

  const handleStartTrial = async () => {
    if (trialWasUsed || startingTrial) return;
    setStartingTrial(true);
    setStatus("");
    try {
      const startedAt = new Date();
      const endsAt = new Date(startedAt.getTime() + TRIAL_LENGTH_MS);
      const purgeAt = new Date(endsAt.getTime() + TRIAL_RETENTION_MS);
      await saveStudentProfile({
        trialStartedAt: startedAt.toISOString(),
        trialEndsAt: endsAt.toISOString(),
        trialUsedAt: startedAt.toISOString(),
        trialPurgeAt: purgeAt.toISOString(),
        trialStatus: "active",
        status: "trial_active",
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
      await refreshStudentProfile?.();
      setStatus("Status refreshed from your Falowen student record.");
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
  const trialPurgeLabel = Number.isFinite(trialState.purgeAtMs)
    ? new Intl.DateTimeFormat(locale || "en", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(new Date(trialState.purgeAtMs))
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
            borderColor: trialWasUsed ? "#e2e8f0" : "#93c5fd",
            background: trialWasUsed ? "#f8fafc" : "#eff6ff",
            display: "grid",
            gap: 12,
          }}
        >
          <div>
            <span style={{ ...styles.badge, background: "#dbeafe", color: "#1e40af" }}>
              Choose how you want to continue
            </span>
            <h3 style={{ margin: "10px 0 4px" }}>
              {trialWasUsed ? "Continue with tuition payment" : "Start free or pay now"}
            </h3>
            <p style={{ ...styles.helperText, margin: 0, lineHeight: 1.6 }}>
              {trialState.key === "expired_retained"
                ? `Your free trial has ended. Your progress and scores are still retained${trialPurgeLabel ? ` until ${trialPurgeLabel}` : " for the 30-day recovery window"}. Pay now to restore access with the same student code and progress.`
                : trialState.key === "retention_ending_soon"
                  ? `Your trial has ended and the recovery window is nearly over. Your saved progress is due for removal${trialPurgeLabel ? ` on ${trialPurgeLabel}` : " soon"}. Pay now to restore access before then.`
                  : trialState.key === "purge_due"
                    ? "Your trial recovery window has ended. Contact Falowen support if you need help restoring access."
                    : trialWasUsed
                      ? `Your one-time free trial${trialEndLabel ? ` ended on ${trialEndLabel}` : " has already been used"}. Complete tuition payment to continue with the same account.`
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
            {!trialWasUsed ? (
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
