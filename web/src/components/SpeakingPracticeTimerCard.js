import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";

const timerOptions = [5, 10, 15].map((minutes) => ({
  label: `${minutes} min`,
  seconds: minutes * 60,
}));

const formatTimer = (seconds) => {
  const safeSeconds = Math.max(0, seconds);
  const minutes = String(Math.floor(safeSeconds / 60)).padStart(2, "0");
  const remaining = String(safeSeconds % 60).padStart(2, "0");
  return `${minutes}:${remaining}`;
};

const SpeakingPracticeTimerCard = () => {
  const [timerDurationSeconds, setTimerDurationSeconds] = useState(timerOptions[0].seconds);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(timerOptions[0].seconds);
  const [timerRunning, setTimerRunning] = useState(false);

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
    <div style={{ border: "1px solid #e5e7eb", borderRadius: 10, padding: 12, background: "#f0f9ff", display: "grid", gap: 10 }}>
      <strong>Teil 1 confidence timer (keep this page open)</strong>
      <p style={{ margin: 0, lineHeight: 1.6 }}>
        Start this timer, then open the speaking self-practice link in a new tab to continue your timed practice.
      </p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
        {timerOptions.map((option) => (
          <button
            key={option.seconds}
            type="button"
            style={{
              ...styles.secondaryButton,
              background: timerDurationSeconds === option.seconds ? "#dbeafe" : "#fff",
              borderColor: timerDurationSeconds === option.seconds ? "#2563eb" : "#d1d5db",
              color: timerDurationSeconds === option.seconds ? "#1d4ed8" : "#111827",
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

      <div style={{ width: "100%", height: 10, background: "#bfdbfe", borderRadius: 999, overflow: "hidden" }}>
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
        <button type="button" style={styles.primaryButton} onClick={startSpeakingTimer} disabled={timerRunning}>
          ▶ Start
        </button>
        <button type="button" style={styles.secondaryButton} onClick={pauseSpeakingTimer} disabled={!timerRunning}>
          ⏸ Pause
        </button>
        <button type="button" style={styles.secondaryButton} onClick={resetSpeakingTimer}>
          ↺ Reset
        </button>
      </div>
    </div>
  );
};

export default SpeakingPracticeTimerCard;
