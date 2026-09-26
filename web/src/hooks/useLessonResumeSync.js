import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  mergeResumeSectionsIntoProgress,
  normalizeLessonSections,
  recordLessonResumeActivity,
  subscribeLatestLessonResume,
  subscribeLessonResume,
} from "../services/lessonResumeService";

const SAVE_DELAY_MS = 450;

export const useLessonResumeSync = ({
  level,
  day,
  chapter = "",
  title = "",
  activeView = "learn",
  route = "",
  radioDone,
  progress,
  setProgress,
  completed,
  source = "lesson",
} = {}) => {
  const { user, studentProfile } = useAuth();
  const [cloudReady, setCloudReady] = useState(false);
  const saveTimerRef = useRef(null);
  const hydratedRef = useRef(false);
  const progressRef = useRef(progress);

  progressRef.current = progress;

  const stableSections = useMemo(
    () => normalizeLessonSections(progress || {}),
    [progress],
  );

  useEffect(() => {
    hydratedRef.current = false;
    setCloudReady(false);

    if (!user?.uid || !level || !Number.isInteger(Number(day))) {
      setCloudReady(true);
      return undefined;
    }

    return subscribeLessonResume({
      userId: user.uid,
      level,
      day,
      onChange: (remote) => {
        if (remote?.sections && typeof setProgress === "function") {
          setProgress((current) => {
            const merged = mergeResumeSectionsIntoProgress(current, remote.sections);
            return JSON.stringify(merged) === JSON.stringify(current) ? current : merged;
          });
        }
        hydratedRef.current = true;
        setCloudReady(true);
      },
      onError: () => {
        hydratedRef.current = true;
        setCloudReady(true);
      },
    });
  }, [day, level, setProgress, user?.uid]);

  useEffect(() => {
    if (!cloudReady || !user?.uid || !level || !Number.isInteger(Number(day))) return undefined;

    if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);

    saveTimerRef.current = window.setTimeout(() => {
      const currentRoute =
        route ||
        (typeof window !== "undefined"
          ? `${window.location.pathname || ""}${window.location.search || ""}`
          : "");

      recordLessonResumeActivity({
        userId: user.uid,
        studentCode:
          studentProfile?.studentCode ||
          studentProfile?.studentcode ||
          studentProfile?.id ||
          "",
        level,
        day,
        chapter,
        title,
        activeView,
        route: currentRoute,
        radioDone,
        progress: progressRef.current || {},
        sections: stableSections,
        completed,
        source,
      }).catch((error) => {
        console.warn("Could not sync lesson resume state", error);
      });
    }, SAVE_DELAY_MS);

    return () => {
      if (saveTimerRef.current) {
        window.clearTimeout(saveTimerRef.current);
        saveTimerRef.current = null;
      }
    };
  }, [
    activeView,
    chapter,
    cloudReady,
    completed,
    day,
    level,
    radioDone,
    route,
    source,
    stableSections,
    studentProfile?.id,
    studentProfile?.studentCode,
    studentProfile?.studentcode,
    title,
    user?.uid,
  ]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const flush = () => {
      if (!user?.uid || !level || !Number.isInteger(Number(day))) return;
      recordLessonResumeActivity({
        userId: user.uid,
        studentCode:
          studentProfile?.studentCode ||
          studentProfile?.studentcode ||
          studentProfile?.id ||
          "",
        level,
        day,
        chapter,
        title,
        activeView,
        route:
          route ||
          `${window.location.pathname || ""}${window.location.search || ""}`,
        radioDone,
        progress: progressRef.current || {},
        completed,
        source,
      }).catch(() => {});
    };

    window.addEventListener("pagehide", flush);
    return () => window.removeEventListener("pagehide", flush);
  }, [
    activeView,
    chapter,
    completed,
    day,
    level,
    radioDone,
    route,
    source,
    studentProfile?.id,
    studentProfile?.studentCode,
    studentProfile?.studentcode,
    title,
    user?.uid,
  ]);

  return {
    cloudReady,
    hydrated: hydratedRef.current,
  };
};

export const useLatestLessonResume = () => {
  const { user } = useAuth();
  const [state, setState] = useState({
    loading: Boolean(user?.uid),
    resume: null,
    error: "",
  });

  useEffect(() => {
    if (!user?.uid) {
      setState({ loading: false, resume: null, error: "" });
      return undefined;
    }

    setState((current) => ({ ...current, loading: true, error: "" }));
    return subscribeLatestLessonResume({
      userId: user.uid,
      onChange: (resume) => setState({ loading: false, resume, error: "" }),
      onError: (error) =>
        setState({
          loading: false,
          resume: null,
          error: error?.message || "Could not load your last lesson.",
        }),
    });
  }, [user?.uid]);

  return state;
};

export default useLessonResumeSync;
