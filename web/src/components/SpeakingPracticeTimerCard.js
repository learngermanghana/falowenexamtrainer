import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";
import "./SpeakingPracticeTimerCard.css";

const levelTargets = {
  A2: 45,
  B1: 90,
  B2: 120,
  C1: 120,
};

const formatTimer = (seconds) => {
  const safeSeconds = Math.max(0, Number(seconds) || 0);
  const minutes = String(Math.floor(safeSeconds / 60)).padStart(2, "0");
  const remaining = String(safeSeconds % 60).padStart(2, "0");
  return `${minutes}:${remaining}`;
};

const inferLevelFromPath = () => {
  if (typeof window === "undefined") return "";
  const path = String(window.location?.pathname || "").toUpperCase();
  const match = path.match(/(?:^|\/|-)(A2|B1|B2|C1)(?:\/|-|$)/);
  return match?.[1] || "";
};

const resolveDuration = (targetSeconds, level) => {
  const explicit = Number(targetSeconds);
  if (Number.isFinite(explicit) && explicit > 0) return explicit;
  const resolvedLevel = String(level || inferLevelFromPath()).toUpperCase();
  return levelTargets[resolvedLevel] || 300;
};

const SpeakingPracticeTimerCard = ({ targetSeconds, level }) => {
  const resolvedDuration = useMemo(
    () => resolveDuration(targetSeconds, level),
    [level, targetSeconds],
  );
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(resolvedDuration);
  const [timerRunning, setTimerRunning] = useState(false);

  useEffect(() => {
    setTimerSecondsLeft(resolvedDuration);
    setTimerRunning(false);
  }, [resolvedDuration]);

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

  const toggleTimer = () => {
    if (timerSecondsLeft === 0) {
      setTimerSecondsLeft(resolvedDuration);
      setTimerRunning(true);
      return;
    }
    setTimerRunning((current) => !current);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerSecondsLeft(resolvedDuration);
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
