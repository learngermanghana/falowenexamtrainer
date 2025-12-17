import React, { useEffect, useMemo, useState } from "react";
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

const Step = ({ title, description, actionLabel, onAction, complete, accent = "#e5e7eb" }) => (
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
          disabled={complete}
        >
          {complete ? "Completed" : actionLabel}
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
}) => {
  const { levelConfirmed } = useExam();
  const [state, setState] = useState(loadState);
  const [selectedClass, setSelectedClass] = useState(loadPreferredClass);

  useEffect(() => {
    persistState(state);
  }, [state]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;

    const syncPreferredClass = (event) => {
      if (event?.key && event.key !== "exam-coach-class") return;
      setSelectedClass(loadPreferredClass());
    };

    window.addEventListener("storage", syncPreferredClass);
    window.addEventListener("class-selection-changed", syncPreferredClass);

    return () => {
      window.removeEventListener("storage", syncPreferredClass);
      window.removeEventListener("class-selection-changed", syncPreferredClass);
    };
  }, []);

  const notificationsReady = notificationStatus === "granted";
  const classConfirmed = Boolean(selectedClass);
  const calendarDownloaded = Boolean(state.calendarDownloaded);
  const fallbackClass = useMemo(() => Object.keys(classCatalog)?.[0], []);
  const currentClass = selectedClass || fallbackClass;

  const progress = useMemo(() => {
    const steps = [levelConfirmed, classConfirmed, calendarDownloaded, notificationsReady];
    const done = steps.filter(Boolean).length;
    return { done, total: steps.length };
  }, [calendarDownloaded, classConfirmed, levelConfirmed, notificationsReady]);

  const handleEnableNotifications = async () => {
    if (!onEnableNotifications) return;
    await onEnableNotifications();
  };

  const handleDownloadCalendar = () => {
    if (!currentClass) return;
    setState((prev) => ({ ...prev, calendarDownloaded: true }));
    downloadClassCalendar(currentClass);
  };

  const allFinished = progress.done === progress.total;

  useEffect(() => {
    if (!allFinished || state.completed) return;
    setState((prev) => ({ ...prev, completed: true }));
  }, [allFinished, state.completed]);

  if (state.completed) return null;

  return (
    <div style={{ ...styles.card, display: "grid", gap: 12 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
        <div>
          <p style={{ ...styles.badge, background: "#e0f2fe", color: "#075985" }}>Onboarding</p>
          <h2 style={{ ...styles.sectionTitle, marginTop: 4, marginBottom: 4 }}>
            Start strong with Exam Coach
          </h2>
          <p style={{ ...styles.helperText, margin: 0 }}>
            Quick guide for new learners: choose your level, confirm your class, save the calendar, and turn on push notifications.
          </p>
        </div>
        <div style={{ display: "grid", justifyItems: "end" }}>
          <span style={{ ...styles.helperText, fontWeight: 600 }}>
            Progress: {progress.done}/{progress.total}
          </span>
          {allFinished ? (
            <span style={{ ...styles.badge, background: "#d1fae5", color: "#065f46" }}>
              Onboarding complete
            </span>
          ) : null}
        </div>
      </div>

      <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
        <Step
          title="Choose your level"
          description="Set your CEFR level to get speaking and writing tasks that fit your skills."
          actionLabel="Set level"
          onAction={onSelectLevel}
          complete={levelConfirmed}
          accent="#e5e7eb"
        />
        <Step
          title="Confirm your class"
          description="Pick your cohort to get the Zoom link, course documents, and the full schedule."
          actionLabel="Open class"
          onAction={onConfirmClass}
          complete={classConfirmed}
          accent="#f3e8ff"
        />
        <Step
          title="Download the calendar"
          description="Add every session to your phone calendar, including the Zoom link."
          actionLabel={currentClass ? `${currentClass} calendar` : "Get calendar"}
          onAction={handleDownloadCalendar}
          complete={calendarDownloaded}
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
    </div>
  );
};

export default OnboardingChecklist;
