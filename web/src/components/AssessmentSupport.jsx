import React from "react";
import { useAssessmentRestricted } from "../hooks/useAssessmentRestriction";
import { ASSESSMENT_RULES } from "../utils/assessmentRestrictions";

export function AssessmentStudySupport({ restricted = false, children }) {
  return useAssessmentRestricted(restricted) ? null : children;
}

export function AssessmentRulesNotice({ restricted = false }) {
  const visible = useAssessmentRestricted(restricted);
  if (!visible) return null;
  return (
    <section aria-label="Assessment rules" style={{ border: "1px solid #cbd5e1", borderRadius: 12, padding: 12, marginBottom: 16, background: "#f8fafc", color: "#1e293b", lineHeight: 1.5 }}>
      <strong>Independent assessment</strong>
      <p style={{ margin: "6px 0 0" }}>{ASSESSMENT_RULES}</p>
    </section>
  );
}
