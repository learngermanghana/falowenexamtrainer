import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { collection, db, isFirebaseConfigured, onSnapshot, query, where } from "../firebase";
import { styles } from "../styles";
import "./MobileWritingTextarea.css";

const classNameFrom = (profile = {}) =>
  String(profile.className || profile.class_name || profile.class || profile.cohort || "").trim();

const levelFrom = (profile = {}) =>
  String(profile.level || profile.courseLevel || "").trim().toUpperCase();

const studentCodeFrom = (profile = {}, user = {}) =>
  String(profile.studentcode || profile.studentCode || profile.student_id || profile.id || user.uid || "").trim();

const memberFrom = (snapshot) => {
  const data = snapshot.data() || {};
  return {
    id: snapshot.id,
    name: String(data.name || data.fullName || data.email || "Student").trim(),
    biography: String(data.biography || "").trim(),
    level: String(data.level || "").trim().toUpperCase(),
    className: String(data.className || "").trim(),
    studentCode: String(data.studentCode || data.studentcode || snapshot.id).trim(),
  };
};

export default function PersonalInformationContributionBox() {
  const { user, studentProfile, saveStudentProfile } = useAuth();
  const [draft, setDraft] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [members, setMembers] = useState([]);

  const level = useMemo(() => levelFrom(studentProfile), [studentProfile]);
  const className = useMemo(() => classNameFrom(studentProfile), [studentProfile]);
  const studentCode = useMemo(() => studentCodeFrom(studentProfile, user), [studentProfile, user]);

  useEffect(() => {
    if (!isDirty) setDraft(String(studentProfile?.biography || ""));
  }, [isDirty, studentProfile?.biography]);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setError("Firebase is not configured.");
      setIsLoading(false);
      return undefined;
    }
    if (!level || !className) {
      setError("Your class details are missing. Please contact support.");
      setIsLoading(false);
      return undefined;
    }

    setIsLoading(true);
    const classMembersQuery = query(
      collection(db, "students"),
      where("level", "==", level),
      where("className", "==", className)
    );

    return onSnapshot(
      classMembersQuery,
      (snapshot) => {
        const next = snapshot.docs
          .map(memberFrom)
          .filter((member) => member.level === level && member.className === className && member.biography)
          .sort((a, b) => a.name.localeCompare(b.name));
        setMembers(next);
        setError("");
        setIsLoading(false);
      },
      (snapshotError) => {
        console.error("Failed to load class member introductions", snapshotError);
        setMembers([]);
        setError("Class member introductions could not be loaded.");
        setIsLoading(false);
      }
    );
  }, [className, level]);

  const handleSave = async (event) => {
    event.preventDefault();
    const biography = draft.trim();
    if (!biography) {
      setError("Write your introduction before saving.");
      setStatus("");
      return;
    }
    if (!level || !className) {
      setError("Your class details are missing. Please contact support.");
      setStatus("");
      return;
    }

    setIsSaving(true);
    setError("");
    setStatus("");
    try {
      await saveStudentProfile({ biography });
      setDraft(biography);
      setIsDirty(false);
      setStatus(`✓ Saved to Class Members for ${className}.`);
    } catch (saveError) {
      console.error("Failed to save class member introduction", saveError);
      setError("Your introduction could not be saved. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <form onSubmit={handleSave} style={{ display: "grid", gap: 12 }}>
        <textarea
          className="day5-mobile-writing-box"
          aria-label="Meine Vorstellung"
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
            setIsDirty(true);
            setStatus("");
            setError("");
          }}
          placeholder="Mein Vorname ist … Ich komme aus …"
          autoCapitalize="sentences"
          autoCorrect="on"
          spellCheck
          inputMode="text"
          rows={10}
          disabled={isSaving}
        />
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ ...styles.helperText, margin: 0 }}>Class: {className || "Not assigned"}</span>
          <button className="day5-writing-save-button" type="submit" style={styles.primaryButton} disabled={isSaving || !level || !className}>
            {isSaving ? "Speichern…" : "Save to Class Members"}
          </button>
        </div>
        <p style={{ ...styles.helperText, margin: 0 }}>This updates your Class Members profile and is not submitted for grading.</p>
        {status ? <p role="status" style={{ margin: 0, color: "#166534", fontWeight: 700 }}>{status}</p> : null}
        {error ? <p role="alert" style={{ margin: 0, color: "#b91c1c", fontWeight: 700 }}>{error}</p> : null}
      </form>

      <section style={{ display: "grid", gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
          <strong>{className ? `${className} introductions` : "Class introductions"}</strong>
          <span style={styles.badge}>{members.length}</span>
        </div>
        {isLoading ? <p style={{ ...styles.helperText, margin: 0 }}>Loading class member introductions…</p> : null}
        {!isLoading && !error && members.length === 0 ? <p style={{ ...styles.helperText, margin: 0 }}>No introductions from this class yet.</p> : null}
        {members.map((member) => {
          const mine = member.id === studentProfile?.id || (studentCode && member.studentCode === studentCode);
          return (
            <article key={member.id} style={{ border: "1px solid #dbeafe", borderRadius: 14, padding: 14, background: "#f8fbff", display: "grid", gap: 8 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <strong>{member.name}</strong>
                {mine ? <span style={styles.badge}>You</span> : null}
              </div>
              <p style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.7, color: "#1f2937" }}>{member.biography}</p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
