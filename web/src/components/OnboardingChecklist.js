import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import { detectLevelKey } from "../lib/day0Workbook";
import { hasClearedBalance, normalizePaymentStatus } from "../lib/paymentStatus";
import { getTrialLifecycleState } from "../lib/trialAccess";
import {
  getRecommendedTuitionAmount,
  initializeOnboardingPaystackCheckout,
  redirectToPaystackCheckout,
} from "../lib/onboardingPaystackCheckout";
import { isPaymentsEnabled } from "../lib/featureFlags";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

const SELF_LEARNING_LEVELS = new Set(["B2", "C1", "C2"]);

const OnboardingChecklist = ({ studentProfile, onSaveOnboarding }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { logout, idToken, user } = useAuth();
  const [savingAction, setSavingAction] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const paymentsEnabled = isPaymentsEnabled();
  const proposedTuitionAmount = getRecommendedTuitionAmount(studentProfile);

  const level = detectLevelKey(studentProfile);
  const isSelfLearning = SELF_LEARNING_LEVELS.has(level);
  const paymentStatus = normalizePaymentStatus(studentProfile?.paymentStatus);
  const balanceDue = studentProfile?.balanceDue ?? studentProfile?.balance;
  const paymentComplete = paymentStatus === "paid" || hasClearedBalance(balanceDue);
  const trialLifecycle = getTrialLifecycleState(studentProfile);
  const hasTrialAccess = trialLifecycle.active;
  const learnerFirstName = String(
    studentProfile?.firstName || studentProfile?.name || studentProfile?.fullName || ""
  ).trim().split(/\s+/)[0];

  // Finish the existing one-time onboarding flag before navigating away.
  // Starting a trial here does not reset its dates; the account's original
  // trial and Paystack confirmation rules remain authoritative.
  const finishAndGo = async (destination, actionName) => {
    if (savingAction) return;
    setSavingAction(actionName);
    try {
      await onSaveOnboarding?.();
      navigate(destination, { replace: true });
    } catch (error) {
      console.error("Failed to complete onboarding", error);
      showToast("We could not finish setup. Please try again.", "error");
    } finally {
      setSavingAction("");
    }
  };

  const handlePayNow = async () => {
    if (savingAction) return;
    setPaymentError("");
    setSavingAction("payment");
    try {
      if (!paymentsEnabled) {
        throw new Error("Online payments are temporarily unavailable. Please try Account & Billing.");
      }
      const checkoutUrl = await initializeOnboardingPaystackCheckout({
        studentProfile, idToken, user,
      });
      await onSaveOnboarding?.();
      redirectToPaystackCheckout(checkoutUrl);
    } catch (error) {
      console.error("Could not open Paystack checkout", error);
      setPaymentError(error?.message || "Could not open Paystack checkout. Please try again.");
    } finally {
      setSavingAction("");
    }
  };

  return (
    <div className="onboarding-page">
      <section
        className="onboarding-focus-card"
        aria-label="Welcome to Falowen"
        style={{ display: "grid", gap: 18, maxWidth: 660, margin: "0 auto" }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <span style={{ ...styles.badge, background: "#dbeafe", color: "#1e40af" }}>
            Welcome to Falowen
          </span>
          <button type="button" onClick={logout} disabled={Boolean(savingAction)} style={styles.secondaryButton}>
            Sign out
          </button>
        </div>

        <div style={{ display: "grid", gap: 8 }}>
          <h1 style={{ margin: 0, fontSize: "clamp(26px, 5vw, 34px)", lineHeight: 1.2 }}>
            Hallo{learnerFirstName ? `, ${learnerFirstName}` : ""}! Your account is ready.
          </h1>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
            Choose how you would like to continue.
          </p>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
          {!paymentComplete ? (
            <button
              type="button"
              data-testid="onboarding-pay-now"
              style={{ ...styles.primaryButton, padding: "14px 22px", minHeight: 50, flex: "1 1 220px", fontSize: 16 }}
              onClick={handlePayNow}
              disabled={Boolean(savingAction)}
            >
              {savingAction === "payment" ? "Opening Paystack…" : "Pay now"}
            </button>
          ) : null}
          <button
            type="button"
            style={{ ...styles.secondaryButton, padding: "14px 22px", minHeight: 50, flex: "1 1 220px", fontSize: 15 }}
            onClick={() => finishAndGo("/", "campus")}
            disabled={Boolean(savingAction)}
          >
            {savingAction === "campus"
              ? "Opening Falowen…"
              : paymentComplete
                ? "Continue to Falowen"
                : hasTrialAccess
                  ? "Start 7-day trial"
                  : "Continue to Falowen"}
          </button>
        </div>

        {!paymentComplete ? (
          <div style={{ marginTop: -8, display: "grid", gap: 8 }}>
            <p style={{ margin: 0, fontSize: 13, color: "#475569", lineHeight: 1.5 }}>
              Pay securely with Paystack{proposedTuitionAmount > 0
                ? " · Tuition amount GH₵" + proposedTuitionAmount.toLocaleString("en-GH")
                : ""}. Payment is recorded only after confirmation.
            </p>
            {paymentError ? (
              <div role="alert" style={{ ...styles.errorBox, margin: 0 }}>
                <strong>Paystack checkout could not open.</strong>
                <p style={{ margin: "6px 0" }}>{paymentError}</p>
                <button
                  type="button"
                  style={styles.secondaryButton}
                  disabled={Boolean(savingAction)}
                  onClick={() => finishAndGo("/campus/account?tab=billing", "billing")}
                >
                  Open Account &amp; Billing
                </button>
              </div>
            ) : null}
          </div>
        ) : null}

        <section
          aria-label="Where to go after signup"
          style={{
            display: "grid",
            gap: 12,
            padding: "18px 20px",
            border: "1px solid #bfdbfe",
            borderRadius: 14,
            background: "#eff6ff",
            color: "#1e293b",
            lineHeight: 1.65,
          }}
        >
          <p style={{ margin: 0 }}>
            When you open <a href="https://www.falowen.app" style={{ color: "#1d4ed8", fontWeight: 700 }}>Falowen</a>,
            you'll see two main options: <strong>Campus</strong> and <strong>Exams Room</strong>.
          </p>
          <p style={{ margin: 0 }}>
            For now, select <strong>Campus</strong> on the home page. On a phone,
            you can also tap <strong>Course Book</strong> directly in the bottom navigation.
            This is where you'll find your course materials, lessons and learning activities.
          </p>
          <p style={{ margin: 0 }}>
            Open <strong>Course Book</strong>, scroll down to find your course lessons,
            and select <strong>Day 1</strong> to begin.
          </p>
          {isSelfLearning ? (
            <p style={{ margin: 0 }}>
              <strong>Start when you're ready.</strong> This is a self-learning course,
              so you can begin at a time that suits you.
            </p>
          ) : (
            <p style={{ margin: 0 }}>
              <strong>Starting early is optional.</strong> You can begin learning immediately
              or wait until your official class start date. Both are perfectly fine.
            </p>
          )}
        </section>
      </section>
    </div>
  );
};

export default OnboardingChecklist;
