import React, { useEffect, useMemo, useRef, useState } from "react";
import { styles } from "../styles";
import { useExam } from "../context/ExamContext";
import { classCatalog } from "../data/classCatalog";
import { downloadClassCalendar } from "../services/classCalendar";
import { loadPreferredClass } from "../services/classSelectionStorage";

const STORAGE_KEY = "falowen_onboarding";

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

const formatDate = (value) => {
  if (!value) return "";
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

const normalizeClassName = (value) => String(value || "").trim();

const Step = ({
  title,
  description,
  actionLabel,
  onAction,
  complete,
  accent = "#e5e7eb",
  allowRepeatAction = false,
  completionNote,
  warningNote,
}) => (
  <div
    style={{
      ...styles.uploadCard,
      display: "grid",
      gap: 6,
      alignItems: "start",
      borderColor: complete ? "#10b981" : accent,
      background: complete ? "#ecfdf3" : "#ffffff",
    }}
  >
    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
      <div>
        <div style={{ fontWeight: 700, color: "#111827" }}>{title}</div>
        <p style={{ ...styles.helperText, margin: "4px 0 0 0" }}>{description}</p>

        {warningNote ? (
          <p style={{ ...styles.helperText, margin: "8px 0 0 0", color: "#92400e" }}>
            {warningNote}
          </p>
        ) : null}

        {complete && completionNote ? (
          <p style={{ ...styles.helperText, margin: "6px 0 0 0" }}>{completionNote}</p>
        ) : null}
      </div>

      <span
        style={{
          ...styles.badge,
          background: complete ? "#d1fae5" : accent,
          color: complete ? "#065f46" : "#374151",
          whiteSpace: "nowrap",
        }}
      >
        {complete ? "Done" : "Open"}
      </span>
    </div>

    {onAction ? (
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          style={complete ? styles.secondaryButton : styles.primaryButton}
          onClick={onAction}
          disabled={complete && !allowRepeatAction}
        >
          {complete ? (allowRepeatAction ? "Download again" : "Completed") : actionLabel}
        </button>
      </div>
    ) : null}
  </div>
);

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
      calendarDownloaded: Boolean(persisted.calendarDownloaded),
      calendarDownloadedFor: persisted.calendarDownloadedFor || "",
      calendarDownloadedAt: persisted.calendarDownloadedAt || "",
    };
  });

  const [selectedClass, setSelectedClass] = useState(loadPreferredClass);
  const [savingOnboarding, setSavingOnboarding] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [localCompletion, setLocalCompletion] = useState(false);

  // ✅ Auto-detect class from profile
  const autoAppliedClassRef = useRef(false);

  const profileClass = useMemo(
    () => normalizeClassName(studentProfile?.className),
    [studentProfile?.className]
  );
  const profileHasClass = useMemo(() => Boolean(profileClass), [profileClass]);

  useEffect(() => {
    if (!profileHasClass) return;
    if (autoAppliedClassRef.current) return;

    autoAppliedClassRef.current = true;
    setSelectedClass(profileClass);
  }, [profileClass, profileHasClass]);

  useEffect(() => {
    persistState(state);
  }, [state]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const syncPreferredClass = (event) => {
      if (event?.key && event.key !== "exam-coach-class") return;

      // Don’t override profile class with localStorage class
      if (profileHasClass) return;

      setSelectedClass(loadPreferredClass());
    };

    window.addEventListener("storage", syncPreferredClass);
    window.addEventListener("class-selection-changed", syncPreferredClass);

    return () => {
      window.removeEventListener("storage", syncPreferredClass);
      window.removeEventListener("class-selection-changed", syncPreferredClass);
    };
  }, [profileHasClass]);

  const notificationsReady = notificationStatus === "granted";
  const classConfirmed = profileHasClass || Boolean(selectedClass);

  const fallbackClass = useMemo(() => Object.keys(classCatalog)?.[0], []);
  const currentClass = profileClass || selectedClass || fallbackClass;

  // ✅ Calendar completion is per class
  const calendarDownloadedForThisClass = useMemo(() => {
    if (!state.calendarDownloaded) return false;
    if (!currentClass) return Boolean(state.calendarDownloaded); // fallback
    if (!state.calendarDownloadedFor) return Boolean(state.calendarDownloaded); // backward compat
    return normalizeClassName(state.calendarDownloadedFor) === normalizeClassName(currentClass);
  }, [currentClass, state.calendarDownloaded, state.calendarDownloadedFor]);

  const calendarDownloadedAtLabel = useMemo(() => {
    if (!calendarDownloadedForThisClass) return "";
    return formatDate(state.calendarDownloadedAt);
  }, [calendarDownloadedForThisClass, state.calendarDownloadedAt]);

  // ✅ NEW UX: detect a class switch vs the last downloaded calendar
  const showClassChangeCalendarWarning = useMemo(() => {
    if (!currentClass) return false;
    if (!state.calendarDownloadedFor) return false; // no record yet -> no warning
    const prev = normalizeClassName(state.calendarDownloadedFor);
    const cur = normalizeClassName(currentClass);
    return Boolean(prev && cur && prev !== cur);
  }, [currentClass, state.calendarDownloadedFor]);

  const calendarWarningNote = useMemo(() => {
    if (!showClassChangeCalendarWarning) return "";
    return `New class detected — you downloaded the calendar for “${state.calendarDownloadedFor}”. Please download again for “${currentClass}”.`;
  }, [currentClass, showClassChangeCalendarWarning, state.calendarDownloadedFor]);

  const onboardingCompleted = Boolean(studentProfile?.onboardingCompleted) || localCompletion;

  const progress = useMemo(() => {
    const steps = [levelConfirmed, classConfirmed, calendarDownloadedForThisClass, notificationsReady];
    const done = steps.filter(Boolean).length;
    return { done, total: steps.length };
  }, [calendarDownloadedForThisClass, classConfirmed, levelConfirmed, notificationsReady]);

  const handleEnableNotifications = async () => {
    if (!onEnableNotifications) return;
    await onEnableNotifications();
  };

  const handleDownloadCalendar = () => {
    if (!currentClass) return;

    const nowIso = new Date().toISOString();
    setState((prev) => ({
      ...prev,
      calendarDownloaded: true,
      calendarDownloadedFor: currentClass,
      calendarDownloadedAt: nowIso,
    }));

    downloadClassCalendar(currentClass);
  };

  const allFinished = progress.done === progress.total;

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

  if (onboardingCompleted) return null;

  return (
    <div style={{ ...styles.card, display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <div>
          <p style={{ ...styles.badge, background: "#e0f2fe", color: "#075985" }}>Onboarding</p>
          <h2 style={{ ...styles.sectionTitle, marginTop: 4, marginBottom: 4 }}>Start strong with Falowen</h2>
          <p style={{ ...styles.helperText, margin: 0 }}>
            Quick guide: choose your level, confirm your class, download the calendar, and turn on push notifications.
          </p>
        </div>

        <div style={{ display: "grid", justifyItems: "end" }}>
          <span style={{ ...styles.helperText, fontWeight: 600 }}>
            Progress: {progress.done}/{progress.total}
          </span>
          {allFinished ? (
            <span style={{ ...styles.badge, background: "#d1fae5", color: "#065f46" }}>Ready to save</span>
          ) : null}
        </div>
      </div>

      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        <Step
          title="Choose your level"
          description="Set your CEFR level to get tasks that fit your skills."
          actionLabel="Set level"
          onAction={onSelectLevel}
          complete={levelConfirmed}
          accent="#e5e7eb"
        />

        <Step
          title="Confirm your class"
          description="Pick your cohort to get the Zoom link, course documents, and the full schedule."
          actionLabel={currentClass ? `Class: ${currentClass}` : "Open class"}
          onAction={onConfirmClass}
          complete={classConfirmed}
          accent="#f3e8ff"
        />

        <Step
          title="Download the calendar"
          description="Save every session to your calendar with the Zoom link (ICS file)."
          actionLabel={currentClass ? `${currentClass} calendar` : "Get calendar"}
          onAction={handleDownloadCalendar}
          complete={calendarDownloadedForThisClass}
          allowRepeatAction={true}
          warningNote={calendarWarningNote}
          completionNote={
            calendarDownloadedForThisClass
              ? `Downloaded for ${currentClass}${calendarDownloadedAtLabel ? ` · ${calendarDownloadedAtLabel}` : ""}`
              : ""
          }
          accent="#fef3c7"
        />

        <Step
          title="Enable push notifications"
          description="Turn on browser push to get study reminders and new tasks."
          actionLabel="Allow push"
          onAction={handleEnableNotifications}
          complete={notificationsReady}
          accent="#e0f2fe"
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
          Finish every step and tap save to mark onboarding as done.
        </p>

        {saveError ? <span style={{ ...styles.helperText, color: "#b91c1c" }}>{saveError}</span> : null}

        <button
          style={{
            ...(allFinished ? styles.primaryButton : styles.secondaryButton),
            opacity: allFinished ? 1 : 0.6,
            cursor: allFinished && !savingOnboarding ? "pointer" : "not-allowed",
          }}
          disabled={!allFinished || savingOnboarding}
          onClick={handleSaveOnboarding}
        >
          {savingOnboarding ? "Saving..." : "Save onboarding"}
        </button>
      </div>
    </div>
  );
};

export default OnboardingChecklist;
