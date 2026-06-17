import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { detectLevelKey } from "../lib/day0Workbook";
import { styles } from "../styles";

const selfLearningLevels = new Set(["B2", "C1"]);

const CourseClassMembersShortcut = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { studentProfile } = useAuth();
  const level = detectLevelKey(studentProfile);
  const isCourseBook = location.pathname === "/campus/course";
  const shouldShow =
    isCourseBook &&
    Boolean(studentProfile?.className) &&
    Boolean(level) &&
    !selfLearningLevels.has(level);

  useEffect(() => {
    if (!isCourseBook || typeof document === "undefined") return undefined;
    const classMembersTab = Array.from(document.querySelectorAll("button")).find(
      (button) => String(button.textContent || "").trim() === "Class Members",
    );
    if (!classMembersTab) return undefined;

    const previousDisplay = classMembersTab.style.display;
    classMembersTab.style.display = "none";
    classMembersTab.setAttribute("aria-hidden", "true");
    classMembersTab.tabIndex = -1;

    return () => {
      classMembersTab.style.display = previousDisplay;
      classMembersTab.removeAttribute("aria-hidden");
      classMembersTab.removeAttribute("tabindex");
    };
  }, [isCourseBook]);

  if (!shouldShow) return null;

  return (
    <button
      type="button"
      style={{ ...styles.secondaryButton, background: "rgba(255,255,255,0.95)", fontWeight: 800 }}
      onClick={() => navigate("/campus/discussion?tab=members")}
    >
      View classmates
    </button>
  );
};

export default CourseClassMembersShortcut;
