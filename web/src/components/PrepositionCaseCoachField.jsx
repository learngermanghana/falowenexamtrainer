import React, { useEffect, useRef } from "react";
import { usePrepositionCaseHints } from "../hooks/usePrepositionCaseHints";
import PrepositionCaseHints, {
  prepositionCaseTextareaWarningStyle,
} from "./PrepositionCaseHints";

export const isFrenchWritingProfile = (studentProfile) =>
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

export const resolveCoachTextarea = ({ textareaRef, getTextarea } = {}) => {
  if (typeof getTextarea === "function") return getTextarea() || null;
  return textareaRef?.current || null;
};

export const selectCoachPhrase = (textarea, hint) => {
  if (!textarea || !hint) return false;
  const start = Number.isInteger(hint.fullStart) ? hint.fullStart : hint.start;
  const end = hint.end;
  if (!Number.isInteger(start) || !Number.isInteger(end) || end <= start) {
    return false;
  }

  textarea.focus({ preventScroll: true });
  textarea.setSelectionRange(start, end);
  textarea.scrollIntoView?.({ behavior: "smooth", block: "center" });
  return true;
};

const PrepositionCaseCoachField = ({
  text = "",
  level = "",
  textareaRef,
  getTextarea,
  studentProfile,
  enabled = true,
}) => {
  const originalStyleRef = useRef(null);
  const active = Boolean(enabled) && !isFrenchWritingProfile(studentProfile);
  const { hints, summary, dismissHint } = usePrepositionCaseHints({
    text,
    level,
    enabled: active,
  });

  useEffect(() => {
    const textarea = resolveCoachTextarea({ textareaRef, getTextarea });
    if (!textarea) return undefined;

    if (!originalStyleRef.current || originalStyleRef.current.textarea !== textarea) {
      originalStyleRef.current = {
        textarea,
        borderColor: textarea.style.borderColor,
        boxShadow: textarea.style.boxShadow,
      };
    }

    const original = originalStyleRef.current;
    if (hints.length) {
      textarea.style.borderColor = prepositionCaseTextareaWarningStyle.borderColor;
      textarea.style.boxShadow = prepositionCaseTextareaWarningStyle.boxShadow;
      textarea.dataset.prepositionCaseHint = "true";
    } else {
      textarea.style.borderColor = original.borderColor;
      textarea.style.boxShadow = original.boxShadow;
      delete textarea.dataset.prepositionCaseHint;
    }

    return () => {
      if (original.textarea !== textarea) return;
      textarea.style.borderColor = original.borderColor;
      textarea.style.boxShadow = original.boxShadow;
      delete textarea.dataset.prepositionCaseHint;
    };
  }, [getTextarea, hints.length, textareaRef]);

  if (!active) return null;

  return (
    <PrepositionCaseHints
      hints={hints}
      summary={summary}
      onDismiss={dismissHint}
      onSelectHint={(hint) =>
        selectCoachPhrase(
          resolveCoachTextarea({ textareaRef, getTextarea }),
          hint,
        )
      }
    />
  );
};

export default PrepositionCaseCoachField;
