import React, { useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import FalowenRadioTabContent from "./FalowenRadioTabContent";
import { getLessonRadioResource } from "../data/lessonRadioDictionary";
import { styles } from "../styles";

export const shouldShowRadioFirst = (level, day) => Boolean(getLessonRadioResource(level, day));

const RadioFirstWorkbookGate = ({ level, day, children }) => {
  const radio = getLessonRadioResource(level, day);
  const [hasEnteredWorkbook, setHasEnteredWorkbook] = useState(() => !radio);

  if (hasEnteredWorkbook) return children;

  return (
    <div style={{ ...styles.container, display: "grid", gap: 18 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <header style={{ ...styles.card, display: "grid", gap: 10, border: "1px solid #bfdbfe", borderRadius: 20, background: "linear-gradient(135deg, #eff6ff, #f8fafc)" }}>
        <span style={{ ...styles.badge, width: "fit-content", background: "#dbeafe", color: "#1e3a8a" }}>Start here</span>
        <h1 style={{ margin: 0 }}>{String(level).toUpperCase()} · Day {day} · Falowen Radio</h1>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.65 }}>
          Listen to Falowen Radio first. Continue opens the student workbook.
        </p>
      </header>
      <FalowenRadioTabContent
        level={level}
        day={day}
        resource={radio}
        actionLabel="Continue to workbook →"
        onContinue={() => {
          setHasEnteredWorkbook(true);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
      />
    </div>
  );
};

export default RadioFirstWorkbookGate;
