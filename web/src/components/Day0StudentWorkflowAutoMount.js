import { useEffect } from "react";
import { createRoot } from "react-dom/client";
import { useLocation, useNavigate } from "react-router-dom";
import Day0StudentWorkflowUpgrade from "./Day0StudentWorkflowUpgrade";

const DAY0_LESSON_REDIRECTS = Object.freeze({
  "/campus/course/lesson/a1/0": "/campus/course/a1-day-0-orientation-and-knowledge-test-workbook",
  "/campus/course/lesson/a2/0": "/campus/course/a2-day-0-orientation-and-knowledge-test-workbook",
  "/campus/course/lesson/b1/0": "/campus/course/b1-day-0-orientation-and-knowledge-test-workbook",
  "/campus/course/lesson/b2/0": "/campus/course/b2-day-0-self-learning-orientation-workbook",
  "/campus/course/lesson/c1/0": "/campus/course/c1-day-0-progression-workbook",
});

const SUPPORTED_DAY0_PATHS = new Set([
  "/campus/course/c1-day-0-progression-workbook",
]);

const Day0StudentWorkflowAutoMount = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const normalizedPath = String(location.pathname || "").replace(/\/+$/, "").toLowerCase();
    const directOrientationPath = DAY0_LESSON_REDIRECTS[normalizedPath];

    if (directOrientationPath) {
      navigate(directOrientationPath, { replace: true });
      return undefined;
    }

    if (typeof document === "undefined") return undefined;
    if (!SUPPORTED_DAY0_PATHS.has(location.pathname)) return undefined;

    const existing = document.getElementById("falowen-day0-workflow-upgrade");
    if (existing) existing.remove();

    const pageContainer = document.querySelector("main .layout-main") || document.querySelector("main") || document.body;
    const lessonContainer = pageContainer.querySelector("div[style*='display: grid']") || pageContainer.firstElementChild || pageContainer;

    const mount = document.createElement("div");
    mount.id = "falowen-day0-workflow-upgrade";
    mount.style.margin = "16px 0";

    if (lessonContainer.firstElementChild?.nextSibling) {
      lessonContainer.insertBefore(mount, lessonContainer.firstElementChild.nextSibling);
    } else {
      lessonContainer.prepend(mount);
    }

    const root = createRoot(mount);
    root.render(<Day0StudentWorkflowUpgrade />);

    return () => {
      root.unmount();
      mount.remove();
    };
  }, [location.pathname, navigate]);

  return null;
};

export default Day0StudentWorkflowAutoMount;

export const __private__ = {
  DAY0_LESSON_REDIRECTS,
  SUPPORTED_DAY0_PATHS,
};
