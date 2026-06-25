import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppBackButton from "./navigation/AppBackButton";
import FalowenRadioTabContent from "./FalowenRadioTabContent";
import { getLessonRadioResource } from "../data/lessonRadioDictionary";
import { styles } from "../styles";

const RADIO_COMPLETE_PARAM = "radio";
const RADIO_COMPLETE_VALUE = "done";

const hasCompletedRadioStep = (search = "") => {
  try {
    return new URLSearchParams(search).get(RADIO_COMPLETE_PARAM) === RADIO_COMPLETE_VALUE;
  } catch (error) {
    return false;
  }
};

export const buildCompletedRadioSearch = (search = "") => {
  const params = new URLSearchParams(search);
  params.set(RADIO_COMPLETE_PARAM, RADIO_COMPLETE_VALUE);
  const query = params.toString();
  return query ? `?${query}` : "";
};

export const shouldShowRadioFirst = (level, day) => Boolean(getLessonRadioResource(level, day));

const RadioFirstWorkbookGate = ({ level, day, children }) => {
  const radio = getLessonRadioResource(level, day);
  const location = useLocation();
  const navigate = useNavigate();
  const [hasEnteredWorkbook, setHasEnteredWorkbook] = useState(
    () => !radio || hasCompletedRadioStep(location.search),
  );
  const [isContinuing, setIsContinuing] = useState(false);

  if (hasEnteredWorkbook) return children;

  const handleContinue = () => {
    if (isContinuing) return;

    setIsContinuing(true);
    setHasEnteredWorkbook(true);
    navigate(
      {
        pathname: location.pathname,
        search: buildCompletedRadioSearch(location.search),
        hash: location.hash,
      },
      { replace: true },
    );

    if (typeof window !== "undefined") {
      const scrollToTop = () => window.scrollTo({ top: 0, behavior: "auto" });

      if (typeof window.requestAnimationFrame === "function") {
        window.requestAnimationFrame(scrollToTop);
      } else {
        scrollToTop();
      }
    }
  };

  return (
    <div style={{ ...styles.container, display: "grid", gap: 18 }}>
      <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
      <header
        style={{
          ...styles.card,
          display: "grid",
          gap: 10,
          border: "1px solid #bfdbfe",
          borderRadius: 20,
          background: "linear-gradient(135deg, #eff6ff, #f8fafc)",
        }}
      >
        <span
          style={{
            ...styles.badge,
            width: "fit-content",
            background: "#dbeafe",
            color: "#1e3a8a",
          }}
        >
          Start here
        </span>
        <h1 style={{ margin: 0 }}>{String(level).toUpperCase()} · Day {day} · Falowen Radio</h1>
        <p style={{ margin: 0, color: "#475569", lineHeight: 1.65 }}>
          Listen to Falowen Radio first. Continue opens the student workbook.
        </p>
      </header>
      <FalowenRadioTabContent
        level={level}
        day={day}
        resource={radio}
        actionLabel={isContinuing ? "Opening workbook…" : "Continue to workbook →"}
        actionDisabled={isContinuing}
        onContinue={handleContinue}
      />
    </div>
  );
};

export default RadioFirstWorkbookGate;
