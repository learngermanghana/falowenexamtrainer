import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import { useExam } from "../context/ExamContext";
import { useToast } from "../context/ToastContext";
import { downloadClassCalendar } from "../services/classCalendar";
import { loadPreferredClass } from "../services/classSelectionStorage";
import { normalizeNotificationStatus } from "../utils/notificationStatus";
import { getDay0WorkbookLinkForLevel, normalizeLevel } from "../lib/day0Workbook";

const STORAGE_KEY = "falowen_onboarding_v5";
const LIVE_CLASS_ACCESS_KEY = "live-class-access";

const loadState = () => {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY) || localStorage.getItem("falowen_onboarding_v4");
    return raw ? JSON.parse(raw) : {};
  } catch (error) {
    console.warn("Could not load onboarding state", error);
    return {};
  }
};

const persistState = (value) => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
  } catch (error) {
    console.warn("Could not persist onboarding state", error);
  }
};

const statusBadgeStyle = (complete, active = false) => ({
  ...styles.badge,
  background: complete ? "#dcfce7" : active ? "#dbeafe" : "#f3f4f6",
  color: complete ? "#166534" : active ? "#1e40af" : "#374151",
  border: `1px solid ${complete ? "#86efac" : active ? "#93c5fd" : "#e5e7eb"}`,
});

const StepGuide = ({ day0Complete }) => {
  const steps = [
    { label: "Complete Day 0 Orientation", done: day0Complete, active: !day0Complete },
    { label: "Open your dashboard", done: false, active: day0Complete },
  ];

  return (
    <section style={{ ...styles.card, background: "#ffffff", display: "grid", gap: 10 }}>
      <h3 style={{ margin: 0, fontSize: 18 }}>What you should do now</h3>
      <div style={{ display: "grid", gap: 8 }}>
        {steps.map((step, index) => (
          <div
            key={step.label}
            style={{
              display: "flex",
              gap: 10,
              alignItems: "center",
              padding: 10,
              borderRadius: 12,
              border: `1px solid ${step.active ? "#2563eb" : step.done ? "#86efac" : "#e5e7eb"}`,
              background: step.active ? "#eff6ff" : step.done ? "#f0fdf4" : "#f9fafb",
            }}
          >
            <span
              style={{
                width: 28,
                height: 28,
                borderRadius: "50%",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: 900,
                background: step.done ? "#16a34a" : step.active ? "#2563eb" : "#e5e7eb",
                color: step.done || step.active ? "#ffffff" : "#374151",
                flex: "0 0 auto",
              }}
            >
              {step.done ? "✓" : index + 1}
            </span>
            <strong>{step.label}</strong>
          </div>
        ))}
      </div>
      <p style={{ ...styles.helperText, margin: 0 }}>
        Live class access and notifications are helpful, but they will not block your dashboard.
      </p>
    </section>
  );
};

const OnboardingActionCard = ({
  number,
  title,
  description,
  complete,
  active,
  actionLabel,
  onAction,
  secondaryLabel,
  onSecondary,
  helper,
}) => (
  <section
    style={{
      ...styles.uploadCard,
      display: "grid",
      gap: 10,
      borderColor: complete ? "#86efac" : active ? "#2563eb" : "#e5e7eb",
      background: complete ? "#f0fdf4" : active ? "#eff6ff" : "#fff",
      boxShadow: active ? "0 14px 30px rgba(37, 99, 235, 0.16)" : "none",
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "flex-start" }}>
      <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span
          style={{
            minWidth: 30,
            height: 30,
            padding: number === "Optional" ? "0 8px" : 0,
            borderRadius: number === "Optional" ? 999 : "50%",
            background: complete ? "#16a34a" : active ? "#2563eb" : "#e5e7eb",
            color: complete || active ? "#fff" : "#374151",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900,
            flex: "0 0 auto",
            fontSize: number === "Optional" ? 12 : 14,
          }}
        >
          {complete ? "✓" : number}
        </span>
        <div>
          <h3 style={{ margin: 0, fontSize: 17 }}>{title}</h3>
          <p style={{ ...styles.helperText, margin: "4px 0 0" }}>{description}</p>
          {helper ? <p style={{ ...styles.helperText, margin: "6px 0 0", color: "#0f172a" }}>{helper}</p> : null}
        </div>
      </div>
      <span style={statusBadgeStyle(complete, active)}>{complete ? "Done" : active ? "Do now" : "Optional"}</span>
    </div>

    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <button type="button" style={active ? styles.primaryButton : styles.secondaryButton} onClick={onAction}>
        {complete ? "Open again" : actionLabel}
      </button>
      {secondaryLabel && onSecondary ? (
        <button type="button" style={styles.secondaryButton} onClick={onSecondary}>
          {secondaryLabel}
        </button>
      ) : null}
    </div>
  </section>
);

const SetupCompleteCelebration = ({ onOpenDashboard, saving, error }) => (
  <section
    style={{
      ...styles.card,
      display: "grid",
      gap: 14,
      border: "2px solid #22c55e",
      background: "linear-gradient(135deg, #f0fdf4, #ffffff)",
      textAlign: "center",
      justifyItems: "center",
    }}
  >
    <div style={{ fontSize: 42 }} aria-hidden>
      🎉
    </div>
    <p style={{ ...styles.badge, width: "fit-content", background: "#dcfce7", color: "#166534", margin: 0 }}>
      Day 0 complete
    </p>
    <h2 style={{ ...styles.sectionTitle, margin: 0 }}>You can now open your dashboard</h2>
    <p style={{ ...styles.helperText, maxWidth: 620, margin: 0, lineHeight: 1.6 }}>
      Your dashboard is unlocked. You can check Zoom/class access and enable notifications later from the dashboard.
    </p>
    <button type="button" style={styles.primaryButton} onClick={onOpenDashboard} disabled={saving}>
      {saving ? "Saving..." : "Open my dashboard"}
    </button>
    {error ? <span style={{ ...styles.helperText, color: "#b91c1c" }}>{error}</span> : null}
  </section>
);

const OnboardingChecklist = ({
  notificationStatus,
  onEnableNotifications,
  onSelectLevel,
  onConfirmClass,
  studentProfile,
  onSaveOnboarding,
}) => {
  const { level } = useExam();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [state, setState] = useState(() => {
    const persisted = loadState();
    return {
      day0OpenedByLevel: persisted.day0OpenedByLevel || {},
      day0FinishedByLevel: persisted.day0FinishedByLevel || {},
      scheduleCheckedByClass: persisted.scheduleCheckedByClass || {},
      notificationsSkipped: Boolean(persisted.notificationsSkipped),
      completedLocally: Boolean(persisted.completedLocally),
    };
  });

  const [selectedClass, setSelectedClass] = useState(() => loadPreferredClass() || "");
  const [savingOnboarding, setSavingOnboarding] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [showCompletionCelebration, setShowCompletionCelebration] = useState(false);

  useEffect(() => persistState(state), [state]);

  const profileLevel = useMemo(() => normalizeLevel(studentProfile?.level), [studentProfile?.level]);
  const preferredLevel = useMemo(() => normalizeLevel(level), [level]);
  const effectiveLevel = profileLevel || preferredLevel;
  const day0WorkbookLink = useMemo(() => getDay0WorkbookLinkForLevel(effectiveLevel), [effectiveLevel]);
  const profileClassName = useMemo(() => (studentProfile?.className || "").trim(), [studentProfile?.className]);
  const currentClass = (selectedClass || profileClassName).trim();
  const scheduleKey = currentClass || LIVE_CLASS_ACCESS_KEY;

  useEffect(() => {
    if (!profileClassName || selectedClass) return;
    setSelectedClass(profileClassName);
  }, [profileClassName, selectedClass]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const syncPreferredClass = (event) => {
      if (event?.key && event.key !== "exam-coach-class") return;
      setSelectedClass(loadPreferredClass() || "");
    };
    window.addEventListener("storage", syncPreferredClass);
    window.addEventListener("class-selection-changed", syncPreferredClass);
    return () => {
      window.removeEventListener("storage", syncPreferredClass);
      window.removeEventListener("class-selection-changed", syncPreferredClass);
    };
  }, []);

  const normalizedNotificationStatus = useMemo(
    () => normalizeNotificationStatus(notificationStatus),
    [notificationStatus]
  );
  const notificationsGranted = normalizedNotificationStatus === "granted";
  const notificationsDenied = normalizedNotificationStatus === "blocked";
  const notificationsUnknown = normalizedNotificationStatus === "idle";

  const day0Opened = Boolean(effectiveLevel && state.day0OpenedByLevel?.[effectiveLevel]);
  const day0Complete = Boolean(effectiveLevel && state.day0FinishedByLevel?.[effectiveLevel]);
  const liveClassAccessChecked = Boolean(state.scheduleCheckedByClass?.[scheduleKey]);
  const onboardingCompleted = Boolean(studentProfile?.onboardingCompleted) || state.completedLocally;
  const progressDone = day0Complete ? 1 : 0;

  const updateState = (updater) => setState((prev) => ({ ...prev, ...updater(prev) }));

  const markDay0Opened = () => {
    if (!effectiveLevel) {
      showToast("We could not detect your level yet. Please check your account setup.", "info");
      onSelectLevel?.();
      return;
    }
    updateState((prev) => ({
      day0OpenedByLevel: {
        ...(prev.day0OpenedByLevel || {}),
        [effectiveLevel]: true,
      },
    }));
    showToast("Day 0 opened. When you finish reading it, come back and tap I finished Day 0.", "success");
    if (day0WorkbookLink) navigate(day0WorkbookLink);
  };

  const markDay0FinishedManually = () => {
    if (!effectiveLevel) {
      showToast("We could not detect your level yet. Please check your account setup.", "info");
      onSelectLevel?.();
      return;
    }
    updateState((prev) => ({
      day0OpenedByLevel: {
        ...(prev.day0OpenedByLevel || {}),
        [effectiveLevel]: true,
      },
      day0FinishedByLevel: {
        ...(prev.day0FinishedByLevel || {}),
        [effectiveLevel]: true,
      },
    }));
    showToast("Day 0 completed. You can now open your dashboard.", "success");
    setShowCompletionCelebration(true);
  };

  const markLiveClassAccessChecked = () => {
    updateState((prev) => ({
      scheduleCheckedByClass: {
        ...(prev.scheduleCheckedByClass || {}),
        [scheduleKey]: true,
      },
    }));
    showToast("Live class access opened. Check your Zoom and calendar details below.", "success");
    onConfirmClass?.();
    setTimeout(() => {
      const calendar = document.getElementById("class-calendar-card");
      if (calendar) calendar.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
  };

  const handleDownloadCalendar = () => {
    if (!currentClass) {
      markLiveClassAccessChecked();
      return;
    }
    updateState((prev) => ({
      scheduleCheckedByClass: {
        ...(prev.scheduleCheckedByClass || {}),
        [scheduleKey]: true,
      },
    }));
    downloadClassCalendar(currentClass);
  };

  const handleSkipNotifications = () => {
    setState((prev) => ({ ...prev, notificationsSkipped: true }));
    showToast("Notifications skipped for now. You can enable them later.", "info");
  };

  const handleEnableNotifications = async () => {
    try {
      const token = await onEnableNotifications?.();
      if (token) {
        setState((prev) => ({ ...prev, notificationsSkipped: false }));
        showToast("Notifications enabled.", "success");
        return;
      }
      handleSkipNotifications();
    } catch (error) {
      console.error("Failed to enable notifications from onboarding", error);
      handleSkipNotifications();
    }
  };

  const handleSaveOnboarding = async () => {
    if (!day0Complete) {
      showToast("Please complete Day 0 first. Then your dashboard will open.", "info");
      return;
    }
    setSaveError("");
    setSavingOnboarding(true);
    try {
      if (onSaveOnboarding) await onSaveOnboarding();
      showToast("Opening your dashboard.", "success");
      setState((prev) => ({ ...prev, completedLocally: true }));
      navigate("/");
    } catch (error) {
      console.error("Failed to save onboarding", error);
      setSaveError("Could not save setup status. Please try again.");
    } finally {
      setSavingOnboarding(false);
    }
  };

  const handlePrimaryContinue = () => {
    if (!day0Complete) return markDay0Opened();
    return handleSaveOnboarding();
  };

  if (onboardingCompleted) return null;

  if (showCompletionCelebration) {
    return <SetupCompleteCelebration onOpenDashboard={handleSaveOnboarding} saving={savingOnboarding} error={saveError} />;
  }

  const primaryCTA = !day0Complete ? "1. Open Day 0 Orientation" : "Open my dashboard";

  return (
    <section
      style={{
        ...styles.card,
        display: "grid",
        gap: 14,
        border: "2px solid #2563eb",
        background: "linear-gradient(135deg, #eff6ff, #ffffff)",
      }}
    >
      <div style={{ display: "grid", gap: 12 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
          <div>
            <p style={{ ...styles.badge, background: "#dbeafe", color: "#1e40af" }}>Start here after signup</p>
            <h2 style={{ ...styles.sectionTitle, marginTop: 6, marginBottom: 4 }}>
              Complete Day 0, then open your dashboard
            </h2>
            <p style={{ ...styles.helperText, margin: 0, lineHeight: 1.6 }}>
              Day 0 explains how Falowen works. After Day 0, your dashboard will unlock. Zoom/class access and notifications are optional and can be checked later.
            </p>
          </div>

          <div style={{ display: "grid", justifyItems: "end", gap: 8 }}>
            <span style={{ ...styles.helperText, fontWeight: 900 }}>Progress: {progressDone}/1</span>
            <div style={{ width: 220, height: 12, borderRadius: 999, background: "#dbeafe", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${progressDone * 100}%`,
                  background: day0Complete ? "#16a34a" : "#2563eb",
                }}
              />
            </div>
            <button type="button" style={styles.primaryButton} onClick={handlePrimaryContinue} disabled={savingOnboarding}>
              {savingOnboarding ? "Saving..." : primaryCTA}
            </button>
            {saveError ? <span style={{ ...styles.helperText, color: "#b91c1c" }}>{saveError}</span> : null}
          </div>
        </div>

        <StepGuide day0Complete={day0Complete} />

        {day0Opened && !day0Complete ? (
          <div style={{ ...styles.card, background: "#fffbeb", border: "1px solid #f59e0b", display: "grid", gap: 8 }}>
            <strong>Already finished Day 0?</strong>
            <p style={{ ...styles.helperText, margin: 0 }}>
              Tap this after you have read Day 0. This will unlock your dashboard.
            </p>
            <button type="button" style={styles.primaryButton} onClick={markDay0FinishedManually}>
              I finished Day 0 — open dashboard
            </button>
          </div>
        ) : null}

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={statusBadgeStyle(day0Complete)}>Day 0: {day0Complete ? "done" : "not done"}</span>
          <span style={statusBadgeStyle(liveClassAccessChecked)}>Live class access: {liveClassAccessChecked ? "checked" : "optional"}</span>
          <span style={statusBadgeStyle(notificationsGranted || state.notificationsSkipped)}>
            Notifications: {notificationsGranted ? "on" : state.notificationsSkipped ? "skipped" : "optional"}
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        <OnboardingActionCard
          number="1"
          title={`Day 0 Orientation${effectiveLevel ? ` (${effectiveLevel})` : ""}`}
          description="Open Day 0 first. It explains how Falowen works, assignments, attendance, tutor feedback, and what to do before Day 1."
          complete={day0Complete}
          active={!day0Complete}
          actionLabel="Open Day 0 Orientation"
          onAction={markDay0Opened}
          secondaryLabel={day0Opened && !day0Complete ? "I finished Day 0" : null}
          onSecondary={day0Opened && !day0Complete ? markDay0FinishedManually : null}
          helper="After reading Day 0, come back and tap I finished Day 0 to unlock your dashboard."
        />

        <OnboardingActionCard
          number="Optional"
          title="Live class access"
          description="Open this to see where your Zoom link, class days, and calendar are located. This does not block your dashboard."
          complete={liveClassAccessChecked}
          active={false}
          actionLabel="Open live class access"
          onAction={markLiveClassAccessChecked}
          secondaryLabel={currentClass ? "Download calendar" : null}
          onSecondary={currentClass ? handleDownloadCalendar : null}
          helper={currentClass ? `Class from signup: ${currentClass}` : "Your class is normally selected during signup."}
        />

        <OnboardingActionCard
          number="Optional"
          title="Notifications"
          description="Phone notifications may not work on every browser. This is optional and will not stop you from opening your dashboard."
          complete={notificationsGranted || state.notificationsSkipped}
          active={false}
          actionLabel={notificationsDenied ? "Skip notifications" : "Try notifications"}
          onAction={notificationsDenied ? handleSkipNotifications : handleEnableNotifications}
          secondaryLabel={notificationsGranted ? null : "Skip for now"}
          onSecondary={notificationsGranted ? null : handleSkipNotifications}
          helper={
            notificationsDenied
              ? "Your browser blocked notifications. You can enable them later."
              : notificationsUnknown
              ? "On iPhone, notifications may not appear here. Skip for now if it does not work."
              : null
          }
        />
      </div>

      <div style={{ borderTop: "1px solid #bfdbfe", paddingTop: 10, display: "grid", gap: 6 }}>
        <strong>{day0Complete ? "You can open your dashboard now." : "Start with Day 0 Orientation."}</strong>
        <p style={{ ...styles.helperText, margin: 0 }}>
          {day0Complete
            ? "Click Open my dashboard. You can check Zoom and notifications later."
            : "Only Day 0 is required. Live class access and notifications are optional helper steps."}
        </p>
      </div>
    </section>
  );
};

export default OnboardingChecklist;
