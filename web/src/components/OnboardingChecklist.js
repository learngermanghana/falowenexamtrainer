import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import { detectLevelKey } from "../lib/day0Workbook";
import { hasClearedBalance, normalizePaymentStatus } from "../lib/paymentStatus";
import { getTrialLifecycleState } from "../lib/trialAccess";
import { useToast } from "../context/ToastContext";
import { useAuth } from "../context/AuthContext";

const day0WorkbookByLevel = {
  A1: "/campus/course/a1-day-0-orientation-and-knowledge-test-workbook",
  A2: "/campus/course/a2-day-0-orientation-and-knowledge-test-workbook",
  B1: "/campus/course/b1-day-0-orientation-and-knowledge-test-workbook",
  B2: "/campus/course/lesson/B2/0",
  C1: "/campus/course/lesson/C1/0",
};

const OnboardingChecklist = ({ studentProfile, onSaveOnboarding }) => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { logout } = useAuth();
  const [savingAction, setSavingAction] = useState("");

  const level = detectLevelKey(studentProfile);
  const className = studentProfile?.className || "Not assigned yet";
  const paymentStatus = normalizePaymentStatus(studentProfile?.paymentStatus);
  const balanceDue = Math.max(Number(studentProfile?.balanceDue ?? studentProfile?.balance) || 0, 0);
  const paymentComplete = paymentStatus === "paid" || hasClearedBalance(balanceDue);
  const trialLifecycle = useMemo(() => getTrialLifecycleState(studentProfile), [studentProfile]);
  const firstLessonPath = day0WorkbookByLevel[level] || "/campus/course";
  // Reuse the authenticated profile and existing routes. No extra database
  // reads, AI calls, Firestore listeners, or scheduled functions on login.
  const learnerFirstName = String(studentProfile?.firstName || studentProfile?.name || studentProfile?.fullName || "").trim().split(/\s+/)[0];

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
      <section className="onboarding-focus-card" aria-label="Welcome to your course" style={{ display: "grid", gap: 20, maxWidth: 660, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
          <span style={{ ...styles.badge, background: "#dbeafe", color: "#1e40af" }}>Welcome to your course</span>
          <button type="button" style={styles.secondaryButton} onClick={logout} disabled={Boolean(savingAction)}>Sign out</button>
        </div>
        <div style={{ display: "grid", gap: 10 }}>
          <h1 style={{ margin: 0, fontSize: "clamp(28px, 5vw, 38px)", lineHeight: 1.18 }}>Hallo{learnerFirstName ? `, ${learnerFirstName}` : ""}. Let’s get you started.</h1>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.7 }}>Your account is ready. Begin with the teacher’s orientation so you know where to find lessons and submit your work.</p>
        </div>
        <div aria-label="Your course details" style={{ display: "flex", gap: 8, flexWrap: "wrap", color: "#475569", fontSize: 13 }}>
          <span style={{ background: "#f1f5f9", padding: "7px 10px", borderRadius: 8 }}>{level ? `${level} German` : "German course"}</span>
          <span style={{ background: "#f1f5f9", padding: "7px 10px", borderRadius: 8 }}>{accessLabel}</span>
        </div>
        <section aria-label="Start here" style={{ display: "grid", gap: 12, padding: 22, borderRadius: 14, background: "#eff6ff", border: "1px solid #bfdbfe" }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: "#1e40af" }}>START HERE · DAY 0</span>
          <h2 style={{ margin: 0, fontSize: 22 }}>Get to know Falowen</h2>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.7 }}>Meet your course, learn the navigation and get ready for your first lesson.</p>
          <button type="button" style={{ ...styles.primaryButton, padding: 15 }} disabled={Boolean(savingAction)} onClick={() => finishAndGo(firstLessonPath, "orientation")}>
            {savingAction === "orientation" ? "Opening…" : "Start orientation →"}
          </button>
        </section>
        <button type="button" style={{ border: 0, background: "transparent", color: "#1d4ed8", textAlign: "left", padding: "8px 0", cursor: "pointer", justifySelf: "start", minHeight: 44 }} disabled={Boolean(savingAction)} onClick={() => finishAndGo("/campus/course", "course")}>
          {savingAction === "course" ? "Opening…" : "Already familiar? Go to Course Book"}
        </button>
        <details style={{ borderTop: "1px solid #e2e8f0", paddingTop: 16 }}>
          <summary style={{ cursor: "pointer", color: "#475569", minHeight: 36 }}>Where can I get help?</summary>
          <div style={{ display: "grid", gap: 12, paddingTop: 8 }}>
            <p style={{ margin: 0, color: "#475569", lineHeight: 1.7 }}>Study Buddy is your AI assistant for German practice and finding things in Falowen. Your tutor leads your class and reviews assigned work.</p>
            <button type="button" style={{ ...styles.secondaryButton, justifySelf: "start" }} disabled={Boolean(savingAction)} onClick={() => finishAndGo("/?studyBuddy=open&welcome=1", "ask")}>
              {savingAction === "ask" ? "Opening…" : "Ask Study Buddy"}
            </button>
            <p style={{ ...styles.helperText, margin: 0 }}>Your class: {className}</p>
            <button type="button" style={{ ...styles.secondaryButton, justifySelf: "start" }} disabled={Boolean(savingAction)} onClick={() => finishAndGo("/campus/account", "account")}>
              {savingAction === "account" ? "Opening…" : "View class and account details"}
            </button>
          </div>
        </details>
        {!trialLifecycle.active && !paymentComplete ? <div role="status" style={{ display: "grid", gap: 10, color: "#92400e" }}>
          <p style={{ margin: 0, lineHeight: 1.6 }}>Your trial is not currently active. Open billing to restore access. Your normal course access rules still apply.</p>
          <button type="button" style={{ ...styles.secondaryButton, justifySelf: "start" }} disabled={Boolean(savingAction)} onClick={() => finishAndGo("/campus/account?tab=billing", "payment")}>
            {savingAction === "payment" ? "Opening…" : "Open billing"}
          </button>
        </div> : null}
      </section>
    </div>
  );
};

export default OnboardingChecklist;
