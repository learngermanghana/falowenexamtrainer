import React, { useEffect, useMemo, useRef, useState } from "react";
import { styles } from "../styles";
import { useExam } from "../context/ExamContext";
import { classCatalog } from "../data/classCatalog";
import { downloadClassCalendar } from "../services/classCalendar";
import { loadPreferredClass } from "../services/classSelectionStorage";

const STORAGE_KEY = "falowen_onboarding_v3";
const DISMISS_HOURS = 24;

const normalizeLevel = (level) => (level || "").toUpperCase().trim();

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

const Step = ({
  title,
  description,
  actionLabel,
  onAction,
  complete,
  accent = "#e5e7eb",
  highlight = false,
  secondaryActionLabel,
  onSecondaryAction,
  disableSecondaryWhenComplete = true,
  footnote,
  stepRef,
}) => {
  const borderColor = complete ? "#10b981" : highlight ? "#0ea5e9" : accent;
  const background = complete ? "#ecfdf3" : highlight ? "#ecfeff" : "#ffffff";

  return (
    <div
      ref={stepRef}
      style={{
        ...styles.uploadCard,
        display: "grid",
        gap: 6,
        alignItems: "start",
        borderColor,
        background,
        boxShadow: highlight ? "0 0 0 3px rgba(14,165,233,0.12)" : "none",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <div>
          <div style={{ fontWeight: 800, color: "#111827" }}>{title}</div>
          <p style={{ ...styles.helperText, margin: "4px 0 0 0" }}>{description}</p>
          {footnote ? (
            <p style={{ ...styles.helperText, margin: "6px 0 0 0", color: "#0f172a" }}>{footnote}</p>
          ) : null}
        </div>

        <span
          style={{
            ...styles.badge,
            background: complete ? "#d1fae5" : highlight ? "#bae6fd" : accent,
            color: complete ? "#065f46" : "#0f172a",
            whiteSpace: "nowrap",
            alignSelf: "start",
          }}
        >
          {complete ? "Done" : highlight ? "Next" : "Open"}
        </span>
      </div>

      {(onAction || onSecondaryAction) ? (
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
          {onAction ? (
            <button
              style={complete ? styles.secondaryButton : styles.primaryButton}
              onClick={onAction}
              disabled={complete}
              type="button"
            >
              {complete ? "Completed" : actionLabel}
            </button>
          ) : null}

          {onSecondaryAction ? (
            <button
              style={{ ...styles.secondaryButton, padding: "10px 12px" }}
              onClick={onSecondaryAction}
              type="button"
              disabled={disableSecondaryWhenComplete ? complete : false}
            >
              {secondaryActionLabel}
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

const OnboardingChecklist = ({
  notificationStatus,
  onEnableNotifications,
  onSelectLevel,
  onConfirmClass,
  studentProfile,
  onSaveOnboarding,
}) => {
  const { levelConfirmed } = useExam();

  const [state, setState] = useState(() => {
    const persisted = loadState();
    return {
      calendarDownloadedByClass: persisted.calendarDownloadedByClass || {},
      notificationsSkipped: Boolean(persisted.notificationsSkipped),
      dismissedUntil: persisted.dismissedUntil || 0,
      guidedMode: Boolean(persisted.guidedMode),
    };
  });

  const profileLevel = useMemo(() => normalizeLevel(studentProfile?.level), [studentProfile?.level]);
  const profileClassName = useMemo(() => (studentProfile?.className || "").trim(), [studentProfile?.className]);

  const [selectedClass, setSelectedClass] = useState(() => loadPreferredClass() || "");

  const [savingOnboarding, setSavingOnboarding] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [localCompletion, setLocalCompletion] = useState(false);

  const levelRef = useRef(null);
  const classRef = useRef(null);
  const calendarRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => persistState(state), [state]);

  // ✅ Auto-detect class from student profile if no class is stored yet.
  useEffect(() => {
    if (!profileClassName) return;
    if (selectedClass) return;
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

  const notificationsGranted = notificationStatus === "granted";
  const notificationsDenied = notificationStatus === "denied";
  const notificationsUnknown = !notificationStatus || notificationStatus === "default";

  // ✅ Auto-detect level/class and mark done instantly.
  const levelStepComplete = Boolean(levelConfirmed || profileLevel);
  const classStepComplete = Boolean((selectedClass || profileClassName).trim());

  const fallbackClass = useMemo(() => Object.keys(classCatalog)?.[0] || "", []);
  const currentClass = (selectedClass || profileClassName || fallbackClass).trim();

  const calendarDownloaded = useMemo(() => {
    if (!currentClass) return false;
    return Boolean(state.calendarDownloadedByClass?.[currentClass]);
  }, [currentClass, state.calendarDownloadedByClass]);

  const notificationsStepComplete = notificationsGranted || state.notificationsSkipped;

  const onboardingCompleted = Boolean(studentProfile?.onboardingCompleted) || localCompletion;

  const progress = useMemo(() => {
    const steps = [levelStepComplete, classStepComplete, calendarDownloaded, notificationsStepComplete];
    const done = steps.filter(Boolean).length;
    return { done, total: steps.length };
  }, [calendarDownloaded, classStepComplete, levelStepComplete, notificationsStepComplete]);

  const allFinished = progress.done === progress.total;

  const nextStepKey = useMemo(() => {
    if (!levelStepComplete) return "level";
    if (!classStepComplete) return "class";
    if (!calendarDownloaded) return "calendar";
    if (!notificationsStepComplete) return "notifications";
    return "save";
  }, [calendarDownloaded, classStepComplete, levelStepComplete, notificationsStepComplete]);

  // Auto-scroll to next step in guided mode
  useEffect(() => {
    if (!state.guidedMode) return;
    const map = {
      level: levelRef,
      class: classRef,
      calendar: calendarRef,
      notifications: notifRef,
    };
    const ref = map[nextStepKey]?.current;
    if (!ref) return;
    const id = setTimeout(() => {
      try {
        ref.scrollIntoView({ behavior: "smooth", block: "center" });
      } catch (_e) {}
    }, 150);
    return () => clearTimeout(id);
  }, [nextStepKey, state.guidedMode]);

  const shouldHideForNow =
    typeof window !== "undefined" && state.dismissedUntil && Date.now() < Number(state.dismissedUntil);

  const handleDownloadCalendar = () => {
    if (!currentClass) return;
    setState((prev) => ({
      ...prev,
      calendarDownloadedByClass: {
        ...(prev.calendarDownloadedByClass || {}),
        [currentClass]: true,
      },
    }));
    downloadClassCalendar(currentClass);
  };

  const handleSkipNotifications = () => setState((prev) => ({ ...prev, notificationsSkipped: true }));

  const handleRemindLater = () => {
    const dismissedUntil = Date.now() + DISMISS_HOURS * 60 * 60 * 1000;
    setState((prev) => ({ ...prev, dismissedUntil }));
  };

  const handleBringBack = () => setState((prev) => ({ ...prev, dismissedUntil: 0 }));

  const handleSaveOnboarding = async () => {
    if (!allFinished || !onSaveOnboarding) return;

    setSaveError("");
    setSavingOnboarding(true);
    try {
      await onSaveOnboarding();
      setLocalCompletion(true);
    } catch (error) {
      console.error("Failed to save onboarding", error);
      setSaveError("Could not save onboarding status. Please try again.");
    } finally {
      setSavingOnboarding(false);
    }
  };

  const handleContinue = async () => {
    setSaveError("");
    try {
      if (nextStepKey === "level") {
        onSelectLevel?.();
        return;
      }
      if (nextStepKey === "class") {
        onConfirmClass?.();
        return;
      }
      if (nextStepKey === "calendar") {
        handleDownloadCalendar();
        return;
      }
      if (nextStepKey === "notifications") {
        if (notificationsDenied) {
          handleSkipNotifications();
          return;
        }
        await onEnableNotifications?.();
        return;
      }
      if (nextStepKey === "save") {
        await handleSaveOnboarding();
      }
    } catch (e) {
      console.error("Onboarding continue failed", e);
      setSaveError("Something went wrong. Please try again.");
    }
  };

  const toggleGuidedMode = () => setState((prev) => ({ ...prev, guidedMode: !prev.guidedMode }));

  if (onboardingCompleted) return null;

  if (shouldHideForNow) {
    return (
      <div style={{ ...styles.card, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
        <div>
          <div style={{ fontWeight: 800 }}>Onboarding hidden</div>
          <div style={styles.helperText}>You chose “remind me later”. You can bring it back anytime.</div>
        </div>
        <button style={styles.secondaryButton} onClick={handleBringBack} type="button">
          Show onboarding
        </button>
      </div>
    );
  }

  const primaryCTA =
    nextStepKey === "save"
      ? "Save onboarding"
      : nextStepKey === "notifications" && notificationsDenied
      ? "Skip notifications"
      : "Continue";

  return (
    <div style={{ ...styles.card, display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <div>
          <p style={{ ...styles.badge, background: "#e0f2fe", color: "#075985" }}>Onboarding</p>
          <h2 style={{ ...styles.sectionTitle, marginTop: 6, marginBottom: 4 }}>Finish setup in 60 seconds</h2>
          <p style={{ ...styles.helperText, margin: 0 }}>
            We auto-detect your saved level/class. Use “Continue” to complete anything missing.
          </p>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
            <span style={styles.badge}>Level: {profileLevel || "(not set)"}</span>
            <span style={styles.badge}>Class: {currentClass || "(not set)"}</span>
            <button type="button" onClick={toggleGuidedMode} style={{ ...styles.secondaryButton, padding: "6px 10px" }}>
              {state.guidedMode ? "Guided: ON" : "Guided: OFF"}
            </button>
          </div>
        </div>

        <div style={{ display: "grid", justifyItems: "end", gap: 8 }}>
          <span style={{ ...styles.helperText, fontWeight: 800 }}>
            Progress: {progress.done}/{progress.total}
          </span>

          <div style={{ width: 190, height: 10, borderRadius: 999, background: "#e5e7eb", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${Math.round((progress.done / Math.max(1, progress.total)) * 100)}%`,
                background: allFinished ? "#10b981" : "#0ea5e9",
              }}
            />
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", justifyContent: "flex-end" }}>
            <button type="button" style={styles.secondaryButton} onClick={handleRemindLater}>
              Remind me later
            </button>
            <button type="button" style={styles.primaryButton} onClick={handleContinue} disabled={savingOnboarding}>
              {savingOnboarding ? "Saving..." : primaryCTA}
            </button>
          </div>

          {saveError ? <span style={{ ...styles.helperText, color: "#b91c1c" }}>{saveError}</span> : null}
        </div>
      </div>

      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        <Step
          stepRef={levelRef}
          title="Choose your level"
          description="Set your CEFR level so tasks match your ability."
          actionLabel="Set level"
          onAction={onSelectLevel}
          complete={levelStepComplete}
          accent="#e5e7eb"
          highlight={nextStepKey === "level" && state.guidedMode}
          secondaryActionLabel={levelStepComplete ? "Change level" : null}
          onSecondaryAction={levelStepComplete ? onSelectLevel : null}
          disableSecondaryWhenComplete={false}
          footnote={profileLevel ? `Detected from profile: ${profileLevel}` : "Not saved yet."}
        />

        <Step
          stepRef={classRef}
          title="Confirm your class"
          description="Pick your cohort to get the right Zoom link and documents."
          actionLabel="Open class"
          onAction={onConfirmClass}
          complete={classStepComplete}
          accent="#f3e8ff"
          highlight={nextStepKey === "class" && state.guidedMode}
          secondaryActionLabel={classStepComplete ? "Change class" : null}
          onSecondaryAction={classStepComplete ? onConfirmClass : null}
          disableSecondaryWhenComplete={false}
          footnote={currentClass ? `Detected from profile/storage: ${currentClass}` : "Not saved yet."}
        />

        <Step
          stepRef={calendarRef}
          title="Download the calendar"
          description="Save scheduled sessions to your calendar (ICS file). Breaks or cancellations may not be reflected."
          actionLabel={currentClass ? `${currentClass} calendar` : "Get calendar"}
          onAction={handleDownloadCalendar}
          complete={calendarDownloaded}
          accent="#fef3c7"
          highlight={nextStepKey === "calendar" && state.guidedMode}
          footnote={currentClass ? "If you change class later, download the new class calendar too." : null}
        />

        <Step
          stepRef={notifRef}
          title="Enable push notifications"
          description="Get reminders for study sessions and new tasks."
          actionLabel={notificationsDenied ? "Notifications blocked" : "Allow push"}
          onAction={notificationsDenied ? null : onEnableNotifications}
          complete={notificationsStepComplete}
          accent="#e0f2fe"
          highlight={nextStepKey === "notifications" && state.guidedMode}
          secondaryActionLabel={notificationsGranted ? null : "Skip for now"}
          onSecondaryAction={notificationsGranted ? null : handleSkipNotifications}
          disableSecondaryWhenComplete={true}
          footnote={
            notificationsDenied
              ? "Your browser blocked notifications. You can enable them later in browser settings."
              : notificationsUnknown
              ? "If you don’t see a popup, check the address bar for the bell/lock icon."
              : state.notificationsSkipped
              ? "Skipped — enable later in Settings."
              : null
          }
        />
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
          paddingTop: 4,
          borderTop: "1px solid #e5e7eb",
        }}
      >
        <p style={{ ...styles.helperText, margin: 0 }}>
          {allFinished
            ? "All set! Use “Save onboarding” above to lock in reminders and class setup."
            : "Complete each step to unlock “Save onboarding” above."}
        </p>
      </div>
    </div>
  );
};

export default OnboardingChecklist;
