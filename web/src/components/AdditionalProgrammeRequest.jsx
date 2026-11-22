import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { enrolledCourses } from "../utils/courseEnrollment";

/**
 * This is an admissions request, not a second enrollment or a payment.
 * Staff must verify the requested programme and write secondaryProgram plus a
 * separate coursePlacements entry before the course switcher grants access.
 */
export default function AdditionalProgrammeRequest() {
  const { studentProfile, courseOptions, saveStudentProfile } = useAuth();
  const { t } = useTranslation();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const allowed = Array.isArray(courseOptions) ? courseOptions : enrolledCourses(studentProfile);
  const missingCourse = ["german", "swahili"].find(program => !allowed.includes(program));
  const alreadyRequested = String(studentProfile?.additionalProgrammeInterest || "").toLowerCase();
  if (!studentProfile || !missingCourse || ["admin", "tutor"].includes(String(studentProfile.role || "").toLowerCase())) {
    return null;
  }
  const pending = alreadyRequested === missingCourse || submitted;
  const courseName = t(`signup.programs.${missingCourse}`);
  const request = async () => {
    if (saving || pending) return;
    setSaving(true);
    setError("");
    try {
      await saveStudentProfile({ additionalProgrammeInterest: missingCourse });
      setSubmitted(true);
    } catch {
      setError(t("enrollmentRequest.error"));
    } finally {
      setSaving(false);
    }
  };
  return (
    <section aria-label={t("enrollmentRequest.title")} style={{
      padding: 14, margin: "8px 0 16px", border: "1px solid #cbd5e1",
      borderRadius: 12, display: "grid", gap: 9, background: "#f8fafc",
    }}>
      <strong>{t("enrollmentRequest.title")}</strong>
      <p style={{ margin: 0, lineHeight: 1.5 }}>
        {t(pending ? "enrollmentRequest.pending" : "enrollmentRequest.description", { course: courseName })}
      </p>
      {!pending && (
        <button type="button" disabled={saving} onClick={request}
          style={{ alignSelf: "start", borderRadius: 8, padding: "9px 12px",
            border: "1px solid #2563eb", color: "#1d4ed8", background: "#fff", fontWeight: 700 }}>
          {saving ? t("enrollmentRequest.saving") : t("enrollmentRequest.action", { course: courseName })}
        </button>
      )}
      {error && <p role="alert" style={{ color: "#991b1b", margin: 0 }}>{error}</p>}
      <small>{t("enrollmentRequest.notice")}</small>
    </section>
  );
}
