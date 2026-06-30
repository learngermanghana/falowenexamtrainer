import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useLocation, useNavigate } from "react-router-dom";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";
import CourseCompletionHandoff from "./CourseCompletionHandoff";
import { getCourseCompletionJourney } from "../data/courseCompletionJourney";

const YOUTUBE_SUBSCRIBE_URL = "https://www.youtube.com/@LLEAGhana?sub_confirmation=1";
const COURSE_HANDOFF_HOST = "data-course-completion-handoff-host";

const normalizeLevel = (value = "") => {
  const match = String(value || "").toUpperCase().match(/\b(A1|A2|B1|B2|C1)\b/);
  return match?.[1] || "A1";
};

const readCourseState = (root, fallbackLevel) => {
  const levelSelect = Array.from(root?.querySelectorAll("select") || []).find((select) =>
    String(select.parentElement?.textContent || "").includes("Level")
  );
  const level = normalizeLevel(levelSelect?.value || fallbackLevel);

  const progressLabel = Array.from(root?.querySelectorAll("p") || []).find(
    (node) => String(node.textContent || "").trim() === "Progress"
  );
  const progressText = progressLabel?.parentElement?.querySelectorAll("p")?.[1]?.textContent || "0";
  const progressPercent = Math.max(0, Math.min(Number(String(progressText).replace(/[^0-9]/g, "")) || 0, 100));
  const isComplete = progressPercent >= 100 || String(root?.textContent || "").includes("Course Book complete");

  const lessonArticles = Array.from(root?.querySelectorAll("article") || []);
  const finalLesson = lessonArticles[lessonArticles.length - 1] || null;
  const finalLessonTitle = String(finalLesson?.querySelector("h3")?.textContent || "").trim();

  return { level, progressPercent, isComplete, finalLesson, finalLessonTitle };
};

const YouTubeSubscribeButton = ({ label = "Subscribe on YouTube" }) => {
  const anchorRef = useRef(null);
  const courseRootRef = useRef(null);
  const finalLessonRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { studentProfile } = useAuth();
  const [portalHost, setPortalHost] = useState(null);
  const [courseState, setCourseState] = useState(() => ({
    level: normalizeLevel(studentProfile?.level || studentProfile?.className),
    progressPercent: 0,
    isComplete: false,
    finalLessonTitle: "",
  }));

  useEffect(() => {
    if (location.pathname !== "/campus/course") {
      setPortalHost(null);
      return undefined;
    }

    const root = anchorRef.current?.parentElement?.parentElement;
    if (!root) return undefined;
    courseRootRef.current = root;

    let host = root.querySelector(`[${COURSE_HANDOFF_HOST}]`);
    if (!host) {
      host = document.createElement("div");
      host.setAttribute(COURSE_HANDOFF_HOST, "true");
      host.style.display = "grid";
      host.style.gap = "14px";
      root.appendChild(host);
    }
    setPortalHost(host);

    const syncCourseState = () => {
      const nextState = readCourseState(
        root,
        studentProfile?.level || studentProfile?.className
      );
      finalLessonRef.current = nextState.finalLesson;
      setCourseState({
        level: nextState.level,
        progressPercent: nextState.progressPercent,
        isComplete: nextState.isComplete,
        finalLessonTitle: nextState.finalLessonTitle,
      });
    };

    const handleChange = () => syncCourseState();
    syncCourseState();
    root.addEventListener("change", handleChange);
    const observer = new MutationObserver(syncCourseState);
    observer.observe(root, { childList: true, subtree: true, characterData: true });

    return () => {
      observer.disconnect();
      root.removeEventListener("change", handleChange);
      host?.remove();
      courseRootRef.current = null;
      finalLessonRef.current = null;
    };
  }, [location.pathname, studentProfile?.className, studentProfile?.level]);

  const reviewFinalLesson = () => {
    const finalLesson = finalLessonRef.current;
    const openButton = Array.from(finalLesson?.querySelectorAll("button") || []).find((button) =>
      String(button.textContent || "").includes("Open Lesson")
    );
    if (openButton) {
      openButton.click();
      return;
    }
    finalLesson?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <>
      <a
        ref={anchorRef}
        href={YOUTUBE_SUBSCRIBE_URL}
        target="_blank"
        rel="noreferrer"
        style={{
          ...styles.secondaryButton,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          textDecoration: "none",
          background: "#dc2626",
          borderColor: "#dc2626",
          color: "#ffffff",
          fontWeight: 600,
        }}
        aria-label={label}
      >
        {label}
      </a>

      {portalHost && location.pathname === "/campus/course"
        ? createPortal(
            <CourseCompletionHandoff
              level={courseState.level}
              isComplete={courseState.isComplete}
              progressPercent={courseState.progressPercent}
              finalLessonTitle={courseState.finalLessonTitle}
              journey={getCourseCompletionJourney(courseState.level)}
              onOpenExamsRoom={() => navigate("/exams/overview")}
              onReviewFinalLesson={courseState.finalLessonTitle ? reviewFinalLesson : null}
            />,
            portalHost
          )
        : null}
    </>
  );
};

export default YouTubeSubscribeButton;
