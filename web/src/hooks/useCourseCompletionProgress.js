import { useEffect, useMemo, useState } from "react";
import {
  buildCourseCompletionProgress,
  readSelfLearningProgressByDay,
} from "../data/courseCompletionJourney";
import { persistCourseCompletionSnapshot } from "../services/courseCompletionSnapshotService";
import { useLessonProgress } from "./useLessonProgress";

export const COURSE_COMPLETION_PROGRESS_EVENT = "falowen:course-completion-progress";

export const useCourseCompletionProgress = ({ studentProfile, user, level } = {}) => {
  const normalizedLevel = String(level || studentProfile?.level || "").trim().toUpperCase();
  const [revision, setRevision] = useState(0);
  const lessonProgress = useLessonProgress({ studentProfile, user, level: normalizedLevel });

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const refresh = () => setRevision((value) => value + 1);
    window.addEventListener("focus", refresh);
    window.addEventListener("storage", refresh);
    window.addEventListener(COURSE_COMPLETION_PROGRESS_EVENT, refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      window.removeEventListener("storage", refresh);
      window.removeEventListener(COURSE_COMPLETION_PROGRESS_EVENT, refresh);
    };
  }, []);

  const progress = useMemo(
    () =>
      buildCourseCompletionProgress({
        level: normalizedLevel,
        progressByAssignmentId: lessonProgress.progressByAssignmentId,
        selfLearningProgressByDay: readSelfLearningProgressByDay(normalizedLevel),
      }),
    [lessonProgress.progressByAssignmentId, normalizedLevel, revision],
  );

  useEffect(() => {
    if (lessonProgress.loading || !user?.uid || !progress?.total) return undefined;

    const timer = setTimeout(() => {
      persistCourseCompletionSnapshot({
        progress,
        level: normalizedLevel,
        user,
        studentProfile,
      }).catch((error) => {
        console.warn("Could not sync canonical course completion snapshot", error);
      });
    }, 500);

    return () => clearTimeout(timer);
  }, [lessonProgress.loading, normalizedLevel, progress, studentProfile, user]);

  return {
    progress,
    loading: lessonProgress.loading,
    error: lessonProgress.error,
    source: lessonProgress.source,
    refresh: () => setRevision((value) => value + 1),
  };
};

export default useCourseCompletionProgress;
