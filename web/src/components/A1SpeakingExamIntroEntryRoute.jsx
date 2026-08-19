import React from "react";
import SpeakingExamIntroPage from "./SpeakingExamIntroPage";
import { ExamProvider } from "../context/ExamContext";

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

export default function A1SpeakingExamIntroEntryRoute() {
  // Day 15 was originally a stable dedicated page. Keep it outside the
  // generic chapter hub and its DOM injectors. The route-scoped A1 Radio
  // service owns the one-time Radio gate; this component owns only the page.
  return (
    <ExamProvider>
      <SpeakingExamIntroPage />
    </ExamProvider>
  );
}
