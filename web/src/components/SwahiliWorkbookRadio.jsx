import React from "react";
import RadioFirstWorkbookGate from "./RadioFirstWorkbookGate";

export default function SwahiliWorkbookRadio({ lesson, preview, children }) {
  if (!lesson?.radio?.youtubeId) return children;

  return (
    <RadioFirstWorkbookGate
      level="Kiswahili A1"
      day={lesson.day}
      resource={lesson.radio}
      courseBookPath={preview ? "/swahili" : "/campus/course"}
    >
      {children}
    </RadioFirstWorkbookGate>
  );
}
