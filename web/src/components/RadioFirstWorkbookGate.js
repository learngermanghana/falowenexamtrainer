import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AppBackButton from "./navigation/AppBackButton";
import FalowenRadioTabContent from "./FalowenRadioTabContent";
import { getLessonRadioResource } from "../data/lessonRadioDictionary";
import { getB1Day5RadioResource } from "../data/b1Day5Media";
import { courseDebug } from "../lib/courseDebug";
import { styles } from "../styles";

const RADIO_COMPLETE_PARAM = "radio";
const RADIO_COMPLETE_VALUE = "done";
const completedRadioSteps = new Set();

const radioStepKey = (level, day) => `${String(level || "").trim().toUpperCase()}:${Number(day)}`;

const getRadioResource = (level, day) =>
  getLessonRadioResource(level, day) || getB1Day5RadioResource(level, day);

const hasCompletedRadioStep = (search = "", level = "", day = "") => {
  try {
    return new URLSearchParams(search).get(RADIO_COMPLETE_PARAM) === RADIO_COMPLETE_VALUE
      || completedRadioSteps.has(radioStepKey(level, day));
  } catch (_error) {
    return completedRadioSteps.has(radioStepKey(level, day));
  }
};

export const buildCompletedRadioSearch = (search = "") => {
  const params = new URLSearchParams(search);
  params.set(RADIO_COMPLETE_PARAM, RADIO_COMPLETE_VALUE);
  const query = params.toString();
  return query ? `?${query}` : "";
};

export const buildCompletedRadioHref = ({ pathname = "", search = "", hash = "" } = {}) =>
  `${pathname}${buildCompletedRadioSearch(search)}${hash || ""}`;

export const openCompletedWorkbook = (locationLike, windowRef) => {
  const href = buildCompletedRadioHref(locationLike);
  const browserWindow = windowRef || (typeof window !== "undefined" ? window : null);
  if (!browserWindow || typeof browserWindow.location?.assign !== "function") return false;
  browserWindow.location.assign(href);
  return true;
};

export const shouldShowRadioFirst = (level, day) => Boolean(getRadioResource(level, day));

const RadioFirstWorkbookGate = ({ level, day, children, resource = null }) => {
  const radio = resource || getRadioResource(level, day);
  const location = useLocation();
  const completedAtMount = !radio || hasCompletedRadioStep(location.search, level, day);
  const [hasEnteredWorkbook, setHasEnteredWorkbook] = useState(() => completedAtMount);
  const [isContinuing, setIsContinuing] = useState(false);
  const continueHref = buildCompletedRadioHref(location);

  useEffect(() => {
    if (!hasEnteredWorkbook && hasCompletedRadioStep(location.search, level, day)) {
      setHasEnteredWorkbook(true);
      setIsContinuing(false);
    }
  }, [day, hasEnteredWorkbook, level, location.search]);

  useEffect(() => {
    courseDebug("radioGate:state", {
      level: String(level || "").toUpperCase(),
      day: Number(day),
      hasRadio: Boolean(radio),
      radioKey: radio?.key || "",
      youtubeId: radio?.youtubeId || "",
      search: location.search,
      completedInUrl: new URLSearchParams(location.search || "").get(RADIO_COMPLETE_PARAM),
      completedInMemory: completedRadioSteps.has(radioStepKey(level, day)),
      hasEnteredWorkbook,
      isContinuing,
      continueHref,
    });
  }, [continueHref, day, hasEnteredWorkbook, isContinuing, level, location.search, radio]);

  if (hasEnteredWorkbook) return children;

  const handleContinue = () => {
    courseDebug("radioGate:continueClick", {
      level: String(level || "").toUpperCase(),
      day: Number(day),
      searchBefore: location.search,
      isContinuing,
      continueHref,
    });

    if (isContinuing) return;

    setIsContinuing(true);
    completedRadioSteps.add(radioStepKey(level, day));

    if (openCompletedWorkbook(location)) return;
    setHasEnteredWorkbook(true);
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
        <span style={{ ...styles.badge, width: "fit-content", background: "#dbeafe", color: "#1e3a8a" }}>
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
