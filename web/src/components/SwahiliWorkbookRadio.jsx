import React from "react";
import RadioFirstWorkbookGate, { isFalowenRadioResource } from "./RadioFirstWorkbookGate";

export default function SwahiliWorkbookRadio({ lesson, level = "A1", preview, radioActivities, children }) {
  if (!isFalowenRadioResource(lesson?.radio)) return children;

  return (
    <RadioFirstWorkbookGate
      level={`Kiswahili ${level}`}
      day={lesson.day}
      resource={lesson.radio}
      radioActivities={radioActivities}
      courseBookPath={preview ? "/swahili" : "/campus/course"}
    >
      {children}
    </RadioFirstWorkbookGate>
  );
}
