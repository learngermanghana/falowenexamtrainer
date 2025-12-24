import React, { useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { styles } from "../styles";
import TuitionStatusCard from "./TuitionStatusCard";
import { paystackLinkForLevel } from "../data/levelFees";
import { isPaymentsEnabled } from "../lib/featureFlags";

const SetupCheckpoint = () => {
  const { user, studentProfile, resendVerificationEmail, refreshUser, logout } = useAuth();
  const [status, setStatus] = useState("");
  const [sendingVerification, setSendingVerification] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const paymentsEnabled = isPaymentsEnabled();

  const checkpoints = useMemo(() => {
    const emailVerified = Boolean(user?.emailVerified);
    const paymentStatus = (studentProfile?.paymentStatus || "pending").toLowerCase();
    return {
      emailVerified,
      paymentStatus,
      paymentReady: paymentStatus === "paid",
    };
  }, [studentProfile?.paymentStatus, user?.emailVerified]);

  const paystackLink = useMemo(
    () => studentProfile?.paystackLink || paystackLinkForLevel(studentProfile?.level),
    [studentProfile?.level, studentProfile?.paystackLink]
  );

  const checkoutAmountOverride = useMemo(() => {
    const intended = Number(studentProfile?.paymentIntentAmount);
    const alreadyPaid = Number(studentProfile?.initialPaymentAmount || 0) > 0;
    if (alreadyPaid) return undefined;
    if (!Number.isFinite(intended) || intended <= 0) return undefined;
    // If the student selected an amount during signup, charge that amount on first checkout.
    return intended;
  }, [studentProfile?.initialPaymentAmount, studentProfile?.paymentIntentAmount]);

  const handleResendVerification = async () => {
    setSendingVerification(true);
    setStatus("");
    try {
      await resendVerificationEmail();
      setStatus("Verification email sent. Please check your inbox.");
    } catch (error) {
      const message = error instanceof Error ? error.message : "Could not send verification email.";
      setStatus(message);
    } finally {
      setSendingVerification(false);
    }
  };

  const handleRefreshStatus = async () => {
    setRefreshing(true);
    setStatus("");
    try {
      await refreshUser();
      setStatus("Status refreshed. If you've verified your email, you'll unlock full access.");
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
              You're signed in with limited access until you verify your email and complete your tuition. Your student code
              and payment link are always available here.
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
          <div style={{ ...styles.card, margin: 0 }}>
            <div style={styles.metaRow}>
              <h3 style={{ margin: 0 }}>Verify your email</h3>
              <span style={styles.badge}>{checkpoints.emailVerified ? "Verified" : "Required"}</span>
            </div>
            <p style={{ ...styles.helperText, margin: "4px 0 8px" }}>
              Confirm {user?.email} to unlock classes and community spaces. We'll also use this email for receipts.
            </p>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button
                style={styles.primaryButton}
                onClick={handleResendVerification}
                disabled={sendingVerification}
              >
                {sendingVerification ? "Sending..." : "Send verification email"}
              </button>
              <button
                style={styles.secondaryButton}
                onClick={handleRefreshStatus}
                disabled={refreshing}
              >
                {refreshing ? "Refreshing..." : "I've verified my email"}
              </button>
            </div>

            <div style={{ ...styles.card, margin: "10px 0 0", background: "#f1f5f9", borderColor: "#e2e8f0" }}>
              <p style={{ ...styles.helperText, margin: 0 }}>
                We'll auto-refresh this page once your email is verified. You stay signed in while finishing these steps.
              </p>
            </div>
          </div>

          <TuitionStatusCard
            level={studentProfile?.level}
            paidAmount={studentProfile?.initialPaymentAmount}
            balanceDue={studentProfile?.balanceDue}
            tuitionFee={studentProfile?.tuitionFee}
            paystackLink={paystackLink}
            checkoutAmountOverride={checkoutAmountOverride}
            title="Pay your tuition"
            description={
              paymentsEnabled
                ? "Finish your secure checkout to unlock full access. You can return to this link anytime."
                : "Payments are available on the web app. Use the link below when you're ready."
            }
          />
        </div>

        <div style={{ ...styles.card, margin: 0, background: "#fef3c7", border: "1px solid #f59e0b" }}>
          <h3 style={{ margin: "0 0 4px" }}>Limited access active</h3>
          <p style={{ ...styles.helperText, margin: 0 }}>
            While you finish verification and payment, live classes and community features stay locked. Account & Billing
            remains available so you can return to your student code and payment link anytime.
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
