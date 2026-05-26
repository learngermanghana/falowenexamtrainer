import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { styles } from "../styles";
import { useExam } from "../context/ExamContext";
import { useToast } from "../context/ToastContext";
import { classCatalog } from "../data/classCatalog";
import { downloadClassCalendar } from "../services/classCalendar";
import { loadPreferredClass } from "../services/classSelectionStorage";
import { normalizeNotificationStatus } from "../utils/notificationStatus";
import { getDay0WorkbookLinkForLevel, normalizeLevel } from "../lib/day0Workbook";

const STORAGE_KEY = "falowen_onboarding_v4";
const DISMISS_HOURS = 24;

const loadState = () => {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
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
            width: 30,
            height: 30,
            borderRadius: "50%",
            background: complete ? "#16a34a" : active ? "#2563eb" : "#e5e7eb",
            color: complete || active ? "#fff" : "#374151",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: 900,
            flex: "0 0 auto",
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
      <span style={statusBadgeStyle(complete, active)}>{complete ? "Done" : active ? "Do now" : "Next"}</span>
    </div>

    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
      <button type="button" style={active ? styles.primaryButton : styles.secondaryButton} onClick={onAction}>
        {complete ? `Open again` : actionLabel}
      </button>
      {secondaryLabel && onSecondary ? (
        <button type="button" style={styles.secondaryButton} onClick={onSecondary}>
          {secondaryLabel}
        </button>
      ) : null}
    </div>
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
      scheduleCheckedByClass: persisted.scheduleCheckedByClass || {},
      notificationsSkipped: Boolean(persisted.notificationsSkipped),
      dismissedUntil: persisted.dismissedUntil || 0,
      completedLocally: Boolean(persisted.completedLocally),
    };
  });

  const [selectedClass, setSelectedClass] = useState(() => loadPreferredClass() || "");
  const [savingOnboarding, setSavingOnboarding] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [localCompletion, setLocalCompletion] = useState(false);

  useEffect(() => persistState(state), [state]);

  const profileLevel = useMemo(() => normalizeLevel(studentProfile?.level), [studentProfile?.level]);
  const preferredLevel = useMemo(() => normalizeLevel(level), [level]);
  const effectiveLevel = profileLevel || preferredLevel;
  const day0WorkbookLink = useMemo(() => getDay0WorkbookLinkForLevel(effectiveLevel), [effectiveLevel]);
  const profileClassName = useMemo(() => (studentProfile?.className || "").trim(), [studentProfile?.className]);
  const fallbackClass = useMemo(() => Object.keys(classCatalog)?.[0] || "", []);
  const currentClass = (selectedClass || profileClassName || fallbackClass).trim();

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
  const notificationsStepComplete = notificationsGranted || state.notificationsSkipped;

  const levelReady = Boolean(effectiveLevel);
  const classReady = Boolean((selectedClass || profileClassName).trim());
  const day0Complete = Boolean(effectiveLevel && state.day0OpenedByLevel?.[effectiveLevel]);
  const scheduleChecked = Boolean(currentClass && state.scheduleCheckedByClass?.[currentClass]);
  const onboardingCompleted = Boolean(studentProfile?.onboardingCompleted) || localCompletion || state.completedLocally;

  const requiredSteps = useMemo(() => {
    const steps = [
      { key: "day0", complete: day0Complete },
      { key: "schedule", complete: classReady && scheduleChecked },
      { key: "notifications", complete: notificationsStepComplete },
    ];
    if (!levelReady) steps.unshift({ key: "level", complete: false });
    if (!classReady) steps.unshift({ key: "class", complete: false });
    return steps;
  }, [classReady, day0Complete, levelReady, notificationsStepComplete, scheduleChecked]);

  const progress = useMemo(() => {
    const done = requiredSteps.filter((step) => step.complete).length;
    return { done, total: requiredSteps.length };
  }, [requiredSteps]);

  const allFinished = progress.done === progress.total;

  const nextStepKey = useMemo(() => {
    if (!levelReady) return "level";
    if (!classReady) return "class";
    if (!day0Complete) return "day0";
    if (!scheduleChecked) return "schedule";
    if (!notificationsStepComplete) return "notifications";
    return "save";
  }, [classReady, day0Complete, levelReady, notificationsStepComplete, scheduleChecked]);

  const shouldHideForNow =
    typeof window !== "undefined" && state.dismissedUntil && Date.now() < Number(state.dismissedUntil);

  const updateState = (updater) => setState((prev) => ({ ...prev, ...updater(prev) }));

  const markDay0Opened = () => {
    if (!effectiveLevel) {
      onSelectLevel?.();
      return;
    }
    updateState((prev) => ({
      day0OpenedByLevel: {
        ...(prev.day0OpenedByLevel || {}),
        [effectiveLevel]: true,
      },
    }));
    showToast("Day 0 opened. Complete it before your first class.", "success");
    if (day0WorkbookLink) navigate(day0WorkbookLink);
  };

  const markScheduleChecked = () => {
    if (!classReady) {
      onConfirmClass?.();
      return;
    }
    updateState((prev) => ({
      scheduleCheckedByClass: {
        ...(prev.scheduleCheckedByClass || {}),
        [currentClass]: true,
      },
    }));
    showToast("Class schedule checked.", "success");
    onConfirmClass?.();
  };

  const handleDownloadCalendar = () => {
    if (!currentClass) return;
    updateState((prev) => ({
      scheduleCheckedByClass: {
        ...(prev.scheduleCheckedByClass || {}),
        [currentClass]: true,
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
      const permission = typeof Notification !== "undefined" ? Notification.permission : "default";
      if (permission !== "granted") handleSkipNotifications();
    } catch (error) {
      console.error("Failed to enable notifications from onboarding", error);
      handleSkipNotifications();
    }
  };

  const handleRemindLater = () => {
    const dismissedUntil = Date.now() + DISMISS_HOURS * 60 * 60 * 1000;
    setState((prev) => ({ ...prev, dismissedUntil }));
  };

  const handleBringBack = () => setState((prev) => ({ ...prev, dismissedUntil: 0 }));

  const handleSaveOnboarding = async () => {
    if (!allFinished) return;
    setSaveError("");
    setSavingOnboarding(true);
    try {
      if (onSaveOnboarding) await onSaveOnboarding();
      showToast("Setup saved. You are ready for class.", "success");
      setLocalCompletion(true);
      setState((prev) => ({ ...prev, completedLocally: true }));
    } catch (error) {
      console.error("Failed to save onboarding", error);
      setSaveError("Could not save setup status. Please try again.");
    } finally {
      setSavingOnboarding(false);
    }
  };

  const handlePrimaryContinue = async () => {
    if (nextStepKey === "level") return onSelectLevel?.();
    if (nextStepKey === "class") return onConfirmClass?.();
    if (nextStepKey === "day0") return markDay0Opened();
    if (nextStepKey === "schedule") return markScheduleChecked();
    if (nextStepKey === "notifications") {
      if (notificationsDenied) return handleSkipNotifications();
      return handleEnableNotifications();
    }
    return handleSaveOnboarding();
  };

  if (onboardingCompleted) return null;

  if (shouldHideForNow) {
    return (
      <div style={{ ...styles.card, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <div>
          <div style={{ fontWeight: 800 }}>Setup hidden for now</div>
          <div style={styles.helperText}>You chose “remind me later”. Bring it back before your first class.</div>
        </div>
        <button style={styles.secondaryButton} onClick={handleBringBack} type="button">
          Show setup
        </button>
      </div>
    );
  }

  const primaryCTA =
    nextStepKey === "level"
      ? "Set my level"
      : nextStepKey === "class"
      ? "Confirm my class"
      : nextStepKey === "day0"
      ? "Start Day 0 Orientation"
      : nextStepKey === "schedule"
      ? "Check class schedule"
      : nextStepKey === "notifications"
      ? notificationsDenied
        ? "Skip notifications"
        : "Turn on notifications"
      : "Save and finish setup";

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
              Complete these 3 steps before your first class
            </h2>
            <p style={{ ...styles.helperText, margin: 0 }}>
              We made this shorter so you do not miss the important part: Day 0 Orientation.
            </p>
          </div>

          <div style={{ display: "grid", justifyItems: "end", gap: 8 }}>
            <span style={{ ...styles.helperText, fontWeight: 900 }}>
              Progress: {progress.done}/{progress.total}
            </span>
            <div style={{ width: 220, height: 12, borderRadius: 999, background: "#dbeafe", overflow: "hidden" }}>
              <div
                style={{
                  height: "100%",
                  width: `${Math.round((progress.done / Math.max(1, progress.total)) * 100)}%`,
                  background: allFinished ? "#16a34a" : "#2563eb",
                }}
              />
            </div>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
              <button type="button" style={styles.secondaryButton} onClick={handleRemindLater}>
                Remind me later
              </button>
              <button type="button" style={styles.primaryButton} onClick={handlePrimaryContinue} disabled={savingOnboarding}>
                {savingOnboarding ? "Saving..." : primaryCTA}
              </button>
            </div>
            {saveError ? <span style={{ ...styles.helperText, color: "#b91c1c" }}>{saveError}</span> : null}
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          <span style={statusBadgeStyle(levelReady)}>Level: {effectiveLevel || "not set"}</span>
          <span style={statusBadgeStyle(classReady)}>Class: {classReady ? currentClass : "not set"}</span>
          <span style={statusBadgeStyle(notificationsStepComplete)}>
            Notifications: {notificationsGranted ? "on" : state.notificationsSkipped ? "skipped" : "not set"}
          </span>
        </div>
      </div>

      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        <OnboardingActionCard
          number="1"
          title={`Day 0 Orientation${effectiveLevel ? ` (${effectiveLevel})` : ""}`}
          description="This is the most important step. It explains how the course works, assignments, attendance, tutor feedback, and what to do before Day 1."
          complete={day0Complete}
          active={nextStepKey === "day0"}
          actionLabel="Start Day 0 Orientation"
          onAction={markDay0Opened}
          helper={day0WorkbookLink ? "Opens the correct Day 0 page for your level." : "Set your level first so we can open the correct Day 0 page."}
        />

        <OnboardingActionCard
          number="2"
          title="Check your class schedule"
          description="Know your class name and where to see class days before orientation starts."
          complete={classReady && scheduleChecked}
          active={nextStepKey === "class" || nextStepKey === "schedule"}
          actionLabel={classReady ? "Open schedule" : "Confirm class"}
          onAction={markScheduleChecked}
          secondaryLabel={classReady ? "Download calendar" : null}
          onSecondary={classReady ? handleDownloadCalendar : null}
          helper={classReady ? `Detected class: ${currentClass}` : "Your class is not set yet."}
        />

        <OnboardingActionCard
          number="3"
          title="Turn on important notifications"
          description="Get class reminders, tutor feedback, and important updates. You may skip if this device blocks notifications."
          complete={notificationsStepComplete}
          active={nextStepKey === "notifications"}
          actionLabel={notificationsDenied ? "Notifications blocked" : "Allow notifications"}
          onAction={notificationsDenied ? handleSkipNotifications : handleEnableNotifications}
          secondaryLabel={notificationsGranted ? null : "Skip for now"}
          onSecondary={notificationsGranted ? null : handleSkipNotifications}
          helper={
            notificationsDenied
              ? "Your browser blocked notifications. You can enable them later in browser settings."
              : notificationsUnknown
              ? "If no popup appears, check the lock/bell icon in your browser bar."
              : null
          }
        />
      </div>

      <div style={{ borderTop: "1px solid #bfdbfe", paddingTop: 10, display: "grid", gap: 6 }}>
        <strong>{allFinished ? "Ready for class." : "Do Step 1 first: Day 0 Orientation."}</strong>
        <p style={{ ...styles.helperText, margin: 0 }}>
          {allFinished
            ? "Click Save and finish setup so this onboarding card disappears."
            : "Students often skip long onboarding, so this setup now focuses only on the actions that matter before the first class."}
        </p>
      </div>
    </section>
  );
};

export default OnboardingChecklist;
