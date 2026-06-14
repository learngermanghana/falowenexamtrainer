import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import StandardFourStageLessonPage from "./StandardFourStageLessonPage";
import CourseInlinePracticePanel from "./CourseInlinePracticePanel";

const findWritingSection = (root) =>
  Array.from(root?.querySelectorAll?.("section") || []).find((section) => {
    const heading = section.querySelector("h2");
    return heading?.textContent?.trim() === "Guided writing builder";
  }) || null;

export const shouldMountMarkMyLetter = (heading = "") =>
  String(heading || "").trim() === "Guided writing builder";

export default function StandardLessonWritingCoachPage({ lesson, canonicalLesson }) {
  const rootRef = useRef(null);
  const [portalTarget, setPortalTarget] = useState(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return undefined;

    let currentMount = null;

    const scan = () => {
      const writingSection = findWritingSection(root);

      if (!writingSection) {
        if (currentMount && !currentMount.isConnected) {
          currentMount = null;
          setPortalTarget(null);
        }
        return;
      }

      const existing = writingSection.querySelector(
        "[data-standard-mark-my-letter='true']",
      );

      if (existing) {
        if (currentMount !== existing) {
          currentMount = existing;
          setPortalTarget(existing);
        }
        return;
      }

      const mount = document.createElement("div");
      mount.setAttribute("data-standard-mark-my-letter", "true");
      mount.style.borderTop = "1px solid #e2e8f0";
      mount.style.paddingTop = "14px";
      writingSection.appendChild(mount);
      currentMount = mount;
      setPortalTarget(mount);
    };

    scan();
    const observer = new MutationObserver(scan);
    observer.observe(root, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      currentMount?.remove();
      setPortalTarget(null);
    };
  }, []);

  return (
    <div ref={rootRef}>
      <StandardFourStageLessonPage
        lesson={lesson}
        canonicalLesson={canonicalLesson}
      />
      {portalTarget
        ? createPortal(
            <CourseInlinePracticePanel
              type="writing"
              title="Mark my letter"
              description="Paste your completed text here. Falowen AI will mark it, show your score, explain the corrections and help you improve the final version."
              defaultOpen
            />,
            portalTarget,
          )
        : null}
    </div>
  );
}
