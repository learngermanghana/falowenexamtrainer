import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import { detectLevelKey } from "../lib/day0Workbook";
import { hasClearedBalance, normalizePaymentStatus } from "../lib/paymentStatus";
import { getTrialLifecycleState } from "../lib/trialAccess";
import { useToast } from "../context/ToastContext";

const day0WorkbookByLevel = {
  A1: "/campus/course/a1-day-0-orientation-and-knowledge-test-workbook",
  A2: "/campus/course/a2-day-0-orientation-and-knowledge-test-workbook",
  B1: "/campus/course/b1-day-0-orientation-and-knowledge-test-workbook",
  B2: "/campus/course/lesson/B2/0",
  C1: "/campus/course/lesson/C1/0",
};

const StatusItem = ({ label, value }) => (
  <div
    style={{
      border: "1px solid #e2e8f0",
      borderRadius: 14,
      padding: 14,
      background: "#ffffff",
      display: "grid",
      gap: 4,
    }}
  >
    <span style={{ ...styles.helperText, margin: 0, fontSize: 12 }}>{label}</span>
    <strong style={{ color: "#0f172a" }}>{value || "Not available"}</strong>
  </div>
);

const OnboardingChecklist = ({ studentProfile, onSaveOnboarding }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [savingAction, setSavingAction] = useState("");

  const level = detectLevelKey(studentProfile);
  const className = studentProfile?.className || "Not assigned yet";
  const paymentStatus = normalizePaymentStatus(studentProfile?.paymentStatus);
  const balanceDue = Math.max(Number(studentProfile?.balanceDue ?? studentProfile?.balance) || 0, 0);
  const paymentComplete = paymentStatus === "paid" || hasClearedBalance(balanceDue);
  const trialLifecycle = useMemo(() => getTrialLifecycleState(studentProfile), [studentProfile]);
  const firstLessonPath = day0WorkbookByLevel[level] || "/campus/course";

  const accessLabel = paymentComplete
    ? "Paid access active"
    : trialLifecycle.key === "ending_soon"
      ? `Trial ending soon · ${trialLifecycle.daysRemaining} day${trialLifecycle.daysRemaining === 1 ? "" : "s"} remaining`
      : trialLifecycle.key === "active"
        ? `7-day trial · ${trialLifecycle.daysRemaining} day${trialLifecycle.daysRemaining === 1 ? "" : "s"} remaining`
        : trialLifecycle.key === "expired_retained"
          ? `Trial expired · progress retained ${trialLifecycle.retentionDaysRemaining} more day${trialLifecycle.retentionDaysRemaining === 1 ? "" : "s"}`
          : trialLifecycle.key === "retention_ending_soon"
            ? `Recovery window ending · ${trialLifecycle.retentionDaysRemaining} day${trialLifecycle.retentionDaysRemaining === 1 ? "" : "s"} left`
            : "Access setup required";

  const paymentLabel = paymentComplete
    ? "Paid"
    : paymentStatus === "partial"
      ? "Part payment received"
      : "Not paid yet";

  const finishAndGo = async (destination, actionName) => {
    setSavingAction(actionName);
    try {
      await onSaveOnboarding?.();
      showToast("Your Falowen setup is ready.", "success");
      navigate(destination, { replace: true });
    } catch (error) {
      console.error("Failed to complete onboarding", error);
      showToast("We could not finish setup. Please try again.", "error");
    } finally {
      setSavingAction("");
    }
  };

  return (
    <div className="onboarding-page">
      <section
        className="onboarding-focus-card"
        style={{ display: "grid", gap: 18, maxWidth: 860, margin: "0 auto" }}
      >
        <div style={{ display: "grid", gap: 8 }}>
          <span style={{ ...styles.badge, width: "fit-content", background: "#dbeafe", color: "#1e40af" }}>
            Welcome to Falowen{level ? ` · ${level}` : ""}
          </span>
          <h1 style={{ margin: 0, fontSize: "clamp(28px, 5vw, 40px)", lineHeight: 1.12 }}>
            Your learning account is ready
          </h1>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.7, fontSize: 16 }}>
            We already have what we need from signup. Review your course details below, then choose what you want to do next.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
          <StatusItem label="Level" value={level || studentProfile?.level || "Not selected"} />
          <StatusItem label="Class" value={className} />
          <StatusItem label="Access" value={accessLabel} />
          <StatusItem label="Payment" value={paymentLabel} />
          <StatusItem label="Start point" value={level ? `${level} Day 0` : "Course start"} />
        </div>

        <section
          style={{
            ...styles.card,
            margin: 0,
            display: "grid",
            gap: 8,
            background: "#f8fafc",
            border: "1px solid #cbd5e1",
          }}
        >
          <h2 style={{ margin: 0, fontSize: 18 }}>What happens next?</h2>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.6 }}>
            Your progress is saved automatically. Start from Day 0 so Falowen can prepare you for the course structure. You can review your class details anytime, and if you started with the free trial you can complete payment from Account & Billing without losing your progress.
          </p>
        </section>

        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}>
          <button
            type="button"
            style={styles.primaryButton}
            disabled={Boolean(savingAction)}
            onClick={() => finishAndGo(firstLessonPath, "start")}
          >
            {savingAction === "start" ? "Opening..." : "Start learning"}
          </button>

          <button
            type="button"
            style={styles.secondaryButton}
            disabled={Boolean(savingAction)}
            onClick={() => finishAndGo("/campus/account", "class")}
          >
            {savingAction === "class" ? "Opening..." : "View class details"}
          </button>

          {!paymentComplete ? (
            <button
              type="button"
              style={styles.secondaryButton}
              disabled={Boolean(savingAction)}
              onClick={() => finishAndGo("/campus/account?tab=billing", "payment")}
            >
              {savingAction === "payment" ? "Opening..." : "Pay now"}
            </button>
          ) : null}
        </div>

        {!trialLifecycle.active && !paymentComplete ? (
          <p style={{ ...styles.helperText, margin: 0, color: "#92400e" }}>
            Your trial is not currently active. Open billing to restore access with the same account while your retained data is still available.
          </p>
        ) : null}
      </section>
    </div>
  );
};

export default OnboardingChecklist;
