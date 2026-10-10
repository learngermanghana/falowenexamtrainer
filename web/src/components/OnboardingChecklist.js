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
  const { logout } = useAuth();
  const [savingAction, setSavingAction] = useState("");
  const [showWorkbookGuide, setShowWorkbookGuide] = useState(false);
  const [showGettingStarted, setShowGettingStarted] = useState(false);

  const level = detectLevelKey(studentProfile);
  const className = studentProfile?.className || "Not assigned yet";
  const paymentStatus = normalizePaymentStatus(studentProfile?.paymentStatus);
  const balanceDue = Math.max(Number(studentProfile?.balanceDue ?? studentProfile?.balance) || 0, 0);
  const paymentComplete = paymentStatus === "paid" || hasClearedBalance(balanceDue);
  const trialLifecycle = useMemo(() => getTrialLifecycleState(studentProfile), [studentProfile]);
  const firstLessonPath = day0WorkbookByLevel[level] || "/campus/course";
  const dayOnePath = level ? `/campus/course/lesson/${level}/1?view=workbook` : "/campus/course";
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
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <span style={{ ...styles.badge, width: "fit-content", background: "#dbeafe", color: "#1e40af" }}>
              Study Buddy · Welcome to Falowen{level ? ` · ${level}` : ""}
            </span>
            <button
              type="button"
              style={styles.secondaryButton}
              onClick={logout}
              disabled={Boolean(savingAction)}
            >
              Sign out
            </button>
          </div>
          <h1 style={{ margin: 0, fontSize: "clamp(28px, 5vw, 40px)", lineHeight: 1.12 }}>
            Hallo{learnerFirstName ? `, ${learnerFirstName}` : ""}! I’m Study Buddy, your learning partner 👋
          </h1>
          <p style={{ margin: 0, color: "#475569", lineHeight: 1.7, fontSize: 16 }}>
            Welcome to Falowen! I’ll be here whenever your tutor isn’t around. Ask me about your lessons, German practice, assignments, results, or where to find something in Falowen. Your tutor leads your classes, and I help between lessons. Where should we begin?
          </p>
        </div>

        <div role="group" aria-label="Choose your Falowen starting point" style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))" }}>
          <button type="button" style={{ ...styles.primaryButton, padding: 18, textAlign: "left" }} disabled={Boolean(savingAction)} onClick={() => finishAndGo(firstLessonPath, "orientation")}>
            {savingAction === "orientation" ? "Opening..." : "🎬 Start Orientation · See how Falowen works"}
          </button>
          <button type="button" style={{ ...styles.secondaryButton, padding: 18, textAlign: "left" }} disabled={Boolean(savingAction)} onClick={() => setShowWorkbookGuide(true)}>
            📘 Day 1 Workbook · Begin your first lesson
          </button>
        </div>
        {showWorkbookGuide ? (
          <section aria-label="Day 1 navigation guide" style={{ ...styles.card, display: "grid", gap: 12, margin: 0, border: "1px solid #93c5fd", background: "#eff6ff" }}>
            <h2 style={{ margin: 0, fontSize: 19 }}>Study Buddy · Before your first workbook</h2>
            <p style={{ margin: 0, lineHeight: 1.6 }}>Your teacher's Day 0 orientation includes the navigation introduction. See how to open Course Book, find lessons and submit work, or go straight to your {level || "course"} Day 1 lesson. Your normal course access rules still apply.</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
              <button type="button" style={styles.secondaryButton} disabled={Boolean(savingAction)} onClick={() => finishAndGo(firstLessonPath, "video")}>
                {savingAction === "video" ? "Opening..." : "Watch teacher navigation video"}
              </button>
              <button type="button" style={styles.primaryButton} disabled={Boolean(savingAction)} onClick={() => finishAndGo(dayOnePath, "day1")}>
                {savingAction === "day1" ? "Opening..." : "Open my Day 1 workbook"}
              </button>
              <button type="button" style={styles.secondaryButton} onClick={() => setShowWorkbookGuide(false)}>Back</button>
            </div>
          </section>
        ) : null}
        <button type="button" style={{ ...styles.secondaryButton, justifySelf: "start" }} aria-expanded={showGettingStarted} onClick={() => setShowGettingStarted((open) => !open)}>
          {showGettingStarted ? "Hide getting started guide" : "Show my getting started guide"}
        </button>
        {showGettingStarted ? (
          <section aria-label="Getting started guide" style={{ ...styles.card, margin: 0, background: "#f8fafc", display: "grid", gap: 10 }}>
            <h2 style={{ margin: 0, fontSize: 19 }}>Your first steps{level ? ` · ${level}` : ""}</h2>
            <p style={{ margin: 0 }}>1. Watch the teacher's Day 0 orientation to learn the navigation.</p>
            <p style={{ margin: 0 }}>2. Open Day 1 from your Course Book.</p>
            <p style={{ margin: 0 }}>3. Practise and submit activities when requested.</p>
            <p style={{ margin: 0 }}>4. Review your tutor's feedback in Results, then continue.</p>
            <small>This is a guide, not a completion tracker. Falowen uses your real lesson and assignment records for progress.</small>
          </section>
        ) : null}
        <button type="button" style={{ ...styles.secondaryButton, justifySelf: "start" }} disabled={Boolean(savingAction)} onClick={() => finishAndGo("/campus?studyBuddy=open", "ask")}>
          {savingAction === "ask" ? "Opening..." : "💬 Ask Study Buddy anything"}
        </button>
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
            Orientation explains Falowen navigation and classroom expectations. If you prefer to start Day 1, you can watch the teacher navigation guide first. Your progress and account access rules stay in place.
          </p>
        </section>

        <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(190px, 1fr))" }}>
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
