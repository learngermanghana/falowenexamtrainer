import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../context/AuthContext";
import { usePrepositionCaseHints } from "../hooks/usePrepositionCaseHints";
import PrepositionCaseHints, {
  prepositionCaseTextareaWarningStyle,
} from "./PrepositionCaseHints";

const LEVEL_PATTERN = /\b(A1|A2|B1|B2|C1)\b/i;
const MAIN_WRITING_PLACEHOLDERS = [
  "Combine what you wrote today",
  "Paste your finished letter or essay",
  "Rewrite your improved letter or essay",
];
let targetCounter = 0;

const isFrenchWritingProfile = (studentProfile) =>
  /french|français|francais/i.test(
    [
      studentProfile?.program,
      studentProfile?.course,
      studentProfile?.language,
      studentProfile?.courseLanguage,
    ]
      .filter(Boolean)
      .join(" "),
  );

export const isPrepositionCoachTextarea = (textarea) => {
  if (!(textarea instanceof HTMLTextAreaElement)) return false;

  const guidedWorkspace = textarea.closest("[data-guided-writing-workspace]");
  const ariaLabel = textarea.getAttribute("aria-label") || "";
  if (
    guidedWorkspace &&
    (ariaLabel === "Your combined text" || /^Question \d+$/i.test(ariaLabel))
  ) {
    return true;
  }

  const placeholder = textarea.getAttribute("placeholder") || "";
  return MAIN_WRITING_PLACEHOLDERS.some((prefix) =>
    placeholder.startsWith(prefix),
  );
};

export const resolvePrepositionCoachLevel = (textarea, profileLevel = "") => {
  const guidedWorkspace = textarea.closest("[data-guided-writing-workspace]");
  if (guidedWorkspace) {
    const guidedMatch = guidedWorkspace.textContent?.match(/Guided\s+(A1|A2|B1|B2|C1)\s+Writing/i);
    if (guidedMatch) return guidedMatch[1].toUpperCase();
  }

  const writingSection = textarea.closest("section");
  const levelSelect = [...(writingSection?.querySelectorAll("select") || [])].find(
    (select) => {
      const values = [...select.options].map((option) => option.value || option.textContent);
      return ["A1", "A2", "B1", "B2", "C1"].every((level) =>
        values.includes(level),
      );
    },
  );
  const selectedLevel = levelSelect?.value?.match(LEVEL_PATTERN)?.[1];
  if (selectedLevel) return selectedLevel.toUpperCase();

  return String(profileLevel || "").trim().toUpperCase();
};

const TextareaCoach = ({ textarea, anchor, studentProfile }) => {
  const [snapshot, setSnapshot] = useState(() => ({
    text: textarea.value || "",
    level: resolvePrepositionCoachLevel(textarea, studentProfile?.level),
  }));
  const originalStyleRef = useRef({
    borderColor: textarea.style.borderColor,
    boxShadow: textarea.style.boxShadow,
  });
  const enabled = !isFrenchWritingProfile(studentProfile);
  const { hints, dismissHint } = usePrepositionCaseHints({
    text: snapshot.text,
    level: snapshot.level,
    enabled,
  });

  useEffect(() => {
    const syncFromTextarea = () => {
      const nextText = textarea.value || "";
      const nextLevel = resolvePrepositionCoachLevel(
        textarea,
        studentProfile?.level,
      );
      setSnapshot((current) =>
        current.text === nextText && current.level === nextLevel
          ? current
          : { text: nextText, level: nextLevel },
      );
    };

    textarea.addEventListener("input", syncFromTextarea);
    textarea.addEventListener("change", syncFromTextarea);
    const interval = window.setInterval(syncFromTextarea, 350);
    syncFromTextarea();

    return () => {
      textarea.removeEventListener("input", syncFromTextarea);
      textarea.removeEventListener("change", syncFromTextarea);
      window.clearInterval(interval);
    };
  }, [studentProfile?.level, textarea]);

  useEffect(() => {
    if (hints.length) {
      textarea.style.borderColor = prepositionCaseTextareaWarningStyle.borderColor;
      textarea.style.boxShadow = prepositionCaseTextareaWarningStyle.boxShadow;
      textarea.dataset.prepositionCaseHint = "true";
    } else {
      textarea.style.borderColor = originalStyleRef.current.borderColor;
      textarea.style.boxShadow = originalStyleRef.current.boxShadow;
      delete textarea.dataset.prepositionCaseHint;
    }

    return () => {
      textarea.style.borderColor = originalStyleRef.current.borderColor;
      textarea.style.boxShadow = originalStyleRef.current.boxShadow;
      delete textarea.dataset.prepositionCaseHint;
    };
  }, [hints.length, textarea]);

  return createPortal(
    <PrepositionCaseHints hints={hints} onDismiss={dismissHint} />,
    anchor,
  );
};

export default function PrepositionCaseCoachInjector() {
  const { studentProfile } = useAuth();
  const managedAnchorsRef = useRef(new Map());
  const [targets, setTargets] = useState([]);

  useEffect(() => {
    const managedAnchors = managedAnchorsRef.current;

    const scan = () => {
      const textareas = [...document.querySelectorAll("textarea")].filter(
        isPrepositionCoachTextarea,
      );
      const activeTextareas = new Set(textareas);

      managedAnchors.forEach((anchor, textarea) => {
        if (!activeTextareas.has(textarea) || !textarea.isConnected) {
          anchor.remove();
          managedAnchors.delete(textarea);
        }
      });

      const nextTargets = textareas.map((textarea) => {
        let anchor = managedAnchors.get(textarea);
        if (!anchor || !anchor.isConnected) {
          anchor = document.createElement("div");
          anchor.dataset.prepositionCaseCoachAnchor = "true";
          anchor.dataset.prepositionCaseCoachId = String(++targetCounter);
          textarea.insertAdjacentElement("afterend", anchor);
          managedAnchors.set(textarea, anchor);
        }

        return {
          id: anchor.dataset.prepositionCaseCoachId,
          textarea,
          anchor,
        };
      });

      setTargets((current) => {
        const unchanged =
          current.length === nextTargets.length &&
          current.every(
            (target, index) =>
              target.textarea === nextTargets[index].textarea &&
              target.anchor === nextTargets[index].anchor,
          );
        return unchanged ? current : nextTargets;
      });
    };

    scan();
    const observer = new MutationObserver(scan);
    observer.observe(document.body, { childList: true, subtree: true });
    document.addEventListener("change", scan, true);

    return () => {
      observer.disconnect();
      document.removeEventListener("change", scan, true);
      managedAnchors.forEach((anchor) => anchor.remove());
      managedAnchors.clear();
    };
  }, []);

  return targets.map((target) => (
    <TextareaCoach
      key={target.id}
      textarea={target.textarea}
      anchor={target.anchor}
      studentProfile={studentProfile}
    />
  ));
}
