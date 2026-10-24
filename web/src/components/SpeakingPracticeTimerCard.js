import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";
import "./SpeakingPracticeTimerCard.css";

const PRESET_MINUTES = [5, 10, 15, 20];
const MIN_CUSTOM_MINUTES = 1;
const MAX_CUSTOM_MINUTES = 120;

const formatTimer = (seconds) => {
  const safeSeconds = Math.max(0, Number(seconds) || 0);
  const minutes = String(Math.floor(safeSeconds / 60)).padStart(2, "0");
  const remaining = String(safeSeconds % 60).padStart(2, "0");
  return `${minutes}:${remaining}`;
};

const resolveInitialMinutes = (targetSeconds) => {
  const explicitMinutes = Math.round(Number(targetSeconds) / 60);
  return PRESET_MINUTES.includes(explicitMinutes) ? explicitMinutes : 5;
};

const clampMinutes = (value) => {
  const parsed = Math.round(Number(value));
  if (!Number.isFinite(parsed)) return 5;
  return Math.min(MAX_CUSTOM_MINUTES, Math.max(MIN_CUSTOM_MINUTES, parsed));
};

const SpeakingPracticeTimerCard = ({ targetSeconds }) => {
  const initialMinutes = useMemo(
    () => resolveInitialMinutes(targetSeconds),
    [targetSeconds],
  );
  const [durationMinutes, setDurationMinutes] = useState(initialMinutes);
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(initialMinutes * 60);
  const [timerRunning, setTimerRunning] = useState(false);
  const [durationChoice, setDurationChoice] = useState(String(initialMinutes));
  const [customMinutes, setCustomMinutes] = useState(25);

  useEffect(() => {
    setDurationMinutes(initialMinutes);
    setTimerSecondsLeft(initialMinutes * 60);
    setDurationChoice(String(initialMinutes));
    setTimerRunning(false);
  }, [initialMinutes]);

  useEffect(() => {
    if (!timerRunning || timerSecondsLeft <= 0) return undefined;

    const intervalId = window.setInterval(() => {
      setTimerSecondsLeft((previous) => {
        if (previous <= 1) {
          window.clearInterval(intervalId);
          setTimerRunning(false);
          return 0;
        }
        return previous - 1;
      });
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [timerRunning, timerSecondsLeft]);

  const applyDuration = (minutes, nextChoice = String(minutes)) => {
    const safeMinutes = clampMinutes(minutes);
    setDurationMinutes(safeMinutes);
    setTimerSecondsLeft(safeMinutes * 60);
    setTimerRunning(false);
    setDurationChoice(nextChoice);
  };

  const handleDurationChoice = (event) => {
    const nextChoice = event.target.value;
    setDurationChoice(nextChoice);
    if (nextChoice !== "custom") {
      applyDuration(Number(nextChoice), nextChoice);
    }
  };

  const applyCustomDuration = () => {
    const safeMinutes = clampMinutes(customMinutes);
    setCustomMinutes(safeMinutes);
    applyDuration(safeMinutes, "custom");
  };

  const handleCustomKeyDown = (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      applyCustomDuration();
    }
  };

  const toggleTimer = () => {
    if (timerSecondsLeft === 0) {
      setTimerSecondsLeft(durationMinutes * 60);
      setTimerRunning(true);
      return;
    }
    setTimerRunning((current) => !current);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerSecondsLeft(durationMinutes * 60);
  };

  return (
    <div
      className="speaking-compact-timer"
      data-compact-speaking-timer
      aria-label="Teil 1 speaking timer"
    >
      <span className="speaking-compact-timer__icon" aria-hidden="true">
        ⏱
      </span>
      <span className="speaking-compact-timer__time" aria-live="polite">
        {formatTimer(timerSecondsLeft)}
      </span>

      <label className="speaking-compact-timer__duration">
        <span className="sr-only">Timer duration</span>
        <select
          value={durationChoice}
          onChange={handleDurationChoice}
          disabled={timerRunning}
          aria-label="Timer duration"
        >
          {PRESET_MINUTES.map((minutes) => (
            <option key={minutes} value={minutes}>
              {minutes} min
            </option>
          ))}
          <option value="custom">Custom</option>
        </select>
      </label>

      {durationChoice === "custom" ? (
        <span className="speaking-compact-timer__custom">
          <input
            type="number"
            min={MIN_CUSTOM_MINUTES}
            max={MAX_CUSTOM_MINUTES}
            step="1"
            value={customMinutes}
            onChange={(event) => setCustomMinutes(event.target.value)}
            onKeyDown={handleCustomKeyDown}
            disabled={timerRunning}
            aria-label="Custom timer minutes"
          />
          <span>min</span>
          <button
            type="button"
            className="speaking-compact-timer__button"
            style={styles.secondaryButton}
            onClick={applyCustomDuration}
            disabled={timerRunning}
            aria-label="Set custom timer duration"
          >
            Set
          </button>
        </span>
      ) : null}

      <button
        type="button"
        className="speaking-compact-timer__button speaking-compact-timer__button--primary"
        style={styles.primaryButton}
        onClick={toggleTimer}
        aria-label={timerRunning ? "Pause speaking timer" : "Start speaking timer"}
      >
        {timerRunning ? "Pause" : timerSecondsLeft === 0 ? "Again" : "Start"}
      </button>
      <button
        type="button"
        className="speaking-compact-timer__button"
        style={styles.secondaryButton}
        onClick={resetTimer}
        aria-label="Reset speaking timer"
      >
        Reset
      </button>
    </div>
  );
};

export default SpeakingPracticeTimerCard;
