import React from "react";
import { getLessonRadioResource } from "../data/lessonRadioDictionary";
import FalowenRadioTabContent from "./FalowenRadioTabContent";

const SUPPORTED_LEVELS = new Set(["A2", "B1", "B2", "C1"]);

const resolveRouteLesson = () => {
  if (typeof window === "undefined") return { level: "", day: "" };

  const match = String(window.location.pathname || "").match(
    /^\/campus\/course\/lesson\/(A2|B1|B2|C1)\/(\d+)\/?$/i,
  );

  return {
    level: match?.[1]?.toUpperCase() || "",
    day: match?.[2] || "",
  };
};

const FalowenRadioWarmup = ({
  level: explicitLevel = "",
  day: explicitDay = "",
  onContinue,
  actionLabel,
}) => {
  const routeLesson = resolveRouteLesson();
  const level = String(explicitLevel || routeLesson.level || "")
    .trim()
    .toUpperCase();
  const day = Number(explicitDay || routeLesson.day || 0);
  const radio = getLessonRadioResource(level, day);

  if (!SUPPORTED_LEVELS.has(level) || !radio?.youtubeId) return null;

  return (
    <section aria-label={`Falowen Radio warm-up for ${level} Day ${day}`}>
      <FalowenRadioTabContent
        level={level}
        day={day}
        onContinue={onContinue}
        actionLabel={actionLabel}
      />
    </section>
  );
};

export default FalowenRadioWarmup;
