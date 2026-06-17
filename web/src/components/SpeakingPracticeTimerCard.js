import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";

const defaultTimerOptions = [5, 10, 15].map((minutes) => ({
  label: `${minutes} min`,
  seconds: minutes * 60,
}));

const formatTimer = (seconds) => {
  const safeSeconds = Math.max(0, seconds);
  const minutes = String(Math.floor(safeSeconds / 60)).padStart(2, "0");
  const remaining = String(safeSeconds % 60).padStart(2, "0");
  return `${minutes}:${remaining}`;
};

const targetLabel = (seconds) => {
  if (seconds < 60) return `${seconds} sec`;
  if (seconds % 60 === 0) return `${seconds / 60} min`;
  return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")} min`;
};

const SpeakingPracticeTimerCard = ({
  targetSeconds = 0,
  title = "Teil 1 confidence timer (keep this page open)",
}) => {
  const safeTarget = Number(targetSeconds) > 0 ? Number(targetSeconds) : 0;
  const timerOptions = useMemo(() => {
    if (!safeTarget) return defaultTimerOptions;
    const targetOption = {
      label: `${targetLabel(safeTarget)} target`,
      seconds: safeTarget,
    };
    return [
      targetOption,
      ...defaultTimerOptions.filter((option) => option.seconds !== safeTarget),
    ];
  }, [safeTarget]);
  const initialDuration = safeTarget || timerOptions[0].seconds;
  const [timerDurationSeconds, setTimerDurationSeconds] = useState(initialDuration);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(initialDuration);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    const nextDuration = safeTarget || timerOptions[0].seconds;
    setTimerDurationSeconds(nextDuration);
    setTimerSecondsLeft(nextDuration);
    setTimerRunning(false);
  }, [safeTarget, timerOptions]);

  const timerProgress = useMemo(() => {
    if (!timerDurationSeconds) return 0;
    return (timerSecondsLeft / timerDurationSeconds) * 100;
  }, [timerDurationSeconds, timerSecondsLeft]);

  useEffect(() => {
    if (!timerRunning || timerSecondsLeft <= 0) return undefined;

    const intervalId = window.setInterval(() => {
      setTimerSecondsLeft((prevSeconds) => {
        if (prevSeconds <= 1) {
          window.clearInterval(intervalId);
          setTimerRunning(false);
          return 0;
        }
        return prevSeconds - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [timerRunning, timerSecondsLeft]);

  const handleTimerOptionChange = (nextDurationSeconds) => {
    setTimerDurationSeconds(nextDurationSeconds);
    setTimerSecondsLeft(nextDurationSeconds);
    setTimerRunning(false);
  };

  const startSpeakingTimer = () => {
    if (timerSecondsLeft === 0) {
      setTimerSecondsLeft(timerDurationSeconds);
    }
    setTimerRunning(true);
  };

  const pauseSpeakingTimer = () => setTimerRunning(false);

  const resetSpeakingTimer = () => {
    setTimerRunning(false);
    setTimerSecondsLeft(timerDurationSeconds);
  };

  return (
    <div
      style={{
        border: "1px solid #e5e7eb",
        borderRadius: 10,
        padding: 12,
        background: "#f0f9ff",
        display: "grid",
        gap: 10,
      }}
    >
      <strong>{title}</strong>
      <p style={{ margin: 0, lineHeight: 1.6 }}>
        Open the speaking coach on this page, choose your target time, and practise
        one complete answer without stopping.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {timerOptions.map((option) => (
          <button
            key={option.seconds}
            type="button"
            style={{
              ...styles.secondaryButton,
              background:
                timerDurationSeconds === option.seconds ? "#dbeafe" : "#fff",
              borderColor:
                timerDurationSeconds === option.seconds ? "#2563eb" : "#d1d5db",
              color:
                timerDurationSeconds === option.seconds ? "#1d4ed8" : "#111827",
            }}
            onClick={() => handleTimerOptionChange(option.seconds)}
            disabled={timerRunning}
          >
            {option.label}
          </button>
        ))}
      </div>

      <div aria-live="polite" style={{ fontSize: "2rem", fontWeight: 700 }}>
        {formatTimer(timerSecondsLeft)}
      </div>

      <div
        style={{
          width: "100%",
          height: 10,
          background: "#bfdbfe",
          borderRadius: 999,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${timerProgress}%`,
            height: "100%",
            background: "linear-gradient(90deg,#2563eb,#7c3aed)",
            transition: "width 0.3s ease",
          }}
        />
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        <button
          type="button"
          style={styles.primaryButton}
          onClick={startSpeakingTimer}
          disabled={timerRunning}
        >
          ▶ Start
        </button>
        <button
          type="button"
          style={styles.secondaryButton}
          onClick={pauseSpeakingTimer}
          disabled={!timerRunning}
        >
          ⏸ Pause
        </button>
        <button
          type="button"
          style={styles.secondaryButton}
          onClick={resetSpeakingTimer}
        >
          ↺ Reset
        </button>
      </div>
    </div>
  );
};

export default SpeakingPracticeTimerCard;
