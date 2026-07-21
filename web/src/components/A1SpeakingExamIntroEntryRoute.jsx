import React from "react";
import { Navigate, useLocation } from "react-router-dom";

export const A1_SPEAKING_EXAM_INTRO_ENTRY_PATH =
  "/campus/course/speaking-exams-intro-4-7";
export const A1_SPEAKING_EXAM_INTRO_HUB_PATH =
  "/campus/course/lesson/A1/15?chapter=4.7&hub=1";

export const buildA1SpeakingExamIntroHubDestination = (search = "") => {
  const params = new URLSearchParams(String(search || "").replace(/^\?/, ""));
  params.delete("view");
  params.set("chapter", "4.7");
  params.set("hub", "1");
  const query = params.toString();
  return `/campus/course/lesson/A1/15${query ? `?${query}` : ""}`;
};

export default function A1SpeakingExamIntroEntryRoute({ workbookElement = null }) {
  const location = useLocation();
  const query = new URLSearchParams(location.search || "");

  if (query.get("view") === "workbook") return workbookElement;

  return (
    <Navigate
      replace
      state={null}
      to={buildA1SpeakingExamIntroHubDestination(location.search)}
    />
  );
}
