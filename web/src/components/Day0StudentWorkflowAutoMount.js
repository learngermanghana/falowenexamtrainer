import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const DAY0_LESSON_REDIRECTS = Object.freeze({
  "/campus/course/lesson/a1/0": "/campus/course/a1-day-0-orientation-and-knowledge-test-workbook",
  "/campus/course/lesson/a2/0": "/campus/course/a2-day-0-orientation-and-knowledge-test-workbook",
  "/campus/course/lesson/b1/0": "/campus/course/b1-day-0-orientation-and-knowledge-test-workbook",
  "/campus/course/lesson/b2/0": "/campus/course/b2-day-0-self-learning-orientation-workbook",
  "/campus/course/lesson/c1/0": "/campus/course/c1-day-0-progression-workbook",
});

const Day0StudentWorkflowAutoMount = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const normalizedPath = String(location.pathname || "").replace(/\/+$/, "").toLowerCase();
    const directOrientationPath = DAY0_LESSON_REDIRECTS[normalizedPath];

    if (directOrientationPath) {
      navigate(directOrientationPath, { replace: true });
    }
  }, [location.pathname, navigate]);

  return null;
};

export default Day0StudentWorkflowAutoMount;

export const __private__ = {
  DAY0_LESSON_REDIRECTS,
};
