import React, { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { styles } from "../styles";
import TuitionStatusCard from "./TuitionStatusCard";
import { isPaymentsEnabled } from "../lib/featureFlags";

const SetupCheckpoint = () => {
  const { studentProfile, refreshUser, logout } = useAuth();
  const [status, setStatus] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const paymentsEnabled = isPaymentsEnabled();

  const checkpoints = useMemo(() => {
    const paymentStatus = (studentProfile?.paymentStatus || "pending").toLowerCase();
    return {
      paymentStatus,
      paymentReady: paymentStatus === "paid",
    };
  }, [studentProfile?.paymentStatus]);

  const checkoutAmountOverride = useMemo(() => {
    const intended = Number(studentProfile?.paymentIntentAmount);
    const alreadyPaid = Number(studentProfile?.initialPaymentAmount || 0) > 0;
    if (alreadyPaid) return undefined;
    if (!Number.isFinite(intended) || intended <= 0) return undefined;
    // If the student selected an amount during signup, charge that amount on first checkout.
    return intended;
  }, [studentProfile?.initialPaymentAmount, studentProfile?.paymentIntentAmount]);

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

  return (
    <div style={{ ...styles.container, display: "grid", placeItems: "center" }}>
      <div style={{ ...styles.card, width: "100%", maxWidth: 920, display: "grid", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <div>
            <h2 style={{ ...styles.sectionTitle, marginBottom: 6 }}>Finish setting up your account</h2>
            <p style={{ ...styles.helperText, margin: 0 }}>
              You're signed in with limited access until your tuition payment is confirmed.
              Pay at least GH₵2000 to unlock 1-month access, or clear the full balance to unlock 6 months.
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

        <div
          style={{
            display: "grid",
            gap: 12,
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          <TuitionStatusCard
            level={studentProfile?.level}
            paidAmount={studentProfile?.initialPaymentAmount}
            balanceDue={studentProfile?.balanceDue}
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
            While you finish payment, live classes and community features stay locked. Account & Billing remains available
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
