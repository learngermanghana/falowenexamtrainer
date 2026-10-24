import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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

const personalInformationTranslations = [
  { german: "Familienname", english: "Surname / family name", example: "Mein Familienname ist …", meaning: "My surname is …" },
  { german: "Vorname", english: "First name", example: "Mein Vorname ist …", meaning: "My first name is …" },
  { german: "Herkunft", english: "Country of origin", example: "Ich komme aus …", meaning: "I come from …" },
  { german: "Geburtsort", english: "Place of birth", example: "Ich bin in … geboren.", meaning: "I was born in …" },
  { german: "Adresse", english: "Address", example: "Meine Adresse ist …", meaning: "My address is …" },
  { german: "Postleitzahl", english: "Postal code", example: "Meine Postleitzahl ist …", meaning: "My postal code is …" },
  { german: "Telefonnummer", english: "Telephone number", example: "Meine Telefonnummer ist …", meaning: "My telephone number is …" },
  { german: "Familienstand", english: "Marital status", example: "Ich bin ledig / verheiratet / geschieden / verwitwet.", meaning: "I am single / married / divorced / widowed." },
  { german: "Kinder", english: "Children", example: "Ich habe … Kinder. / Ich habe keine Kinder.", meaning: "I have … children. / I have no children." },
  { german: "Alter", english: "Age", example: "Ich bin … Jahre alt.", meaning: "I am … years old." },
];

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

export default function PersonalInformationContributionBox({
  autoSave = false,
  showReference = true,
  placeholder = "Example: Mein Vorname ist Ama. Ich komme aus Ghana. Ich bin 24 Jahre alt.",
}) {
  const { user, studentProfile, saveStudentProfile } = useAuth();
  const [draft, setDraft] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [members, setMembers] = useState([]);
  const draftRef = useRef("");
  const lastSavedRef = useRef("");

  const level = useMemo(() => levelFrom(studentProfile), [studentProfile]);
  const className = useMemo(() => classNameFrom(studentProfile), [studentProfile]);
  const studentCode = useMemo(() => studentCodeFrom(studentProfile, user), [studentProfile, user]);

  useEffect(() => {
    draftRef.current = draft;
  }, [draft]);

  useEffect(() => {
    if (!isDirty) {
      const biography = String(studentProfile?.biography || "");
      setDraft(biography);
      lastSavedRef.current = biography.trim();
    }
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

  const saveBiography = useCallback(
    async (biography, automatic = false) => {
      const nextBiography = biography.trim();
      if (!nextBiography) {
        if (!automatic) {
          setError("Write your introduction before saving.");
          setStatus("");
        }
        return false;
      }
      if (!level || !className) {
        setError("Your class details are missing. Please contact support.");
        setStatus("");
        return false;
      }
      if (nextBiography === lastSavedRef.current) {
        if (draftRef.current.trim() === nextBiography) setIsDirty(false);
        return true;
      }

      setIsSaving(true);
      setError("");
      setStatus(automatic ? "Saving to Class Members…" : "");
      try {
        await saveStudentProfile({ biography: nextBiography });
        lastSavedRef.current = nextBiography;
        if (draftRef.current.trim() === nextBiography) setIsDirty(false);
        setStatus(automatic ? "✓ Saved automatically to Class Members." : `✓ Saved to Class Members for ${className}.`);
        return true;
      } catch (saveError) {
        console.error("Failed to save class member introduction", saveError);
        setError("Your introduction could not be saved. Please try again.");
        setStatus("");
        return false;
      } finally {
        setIsSaving(false);
      }
    },
    [className, level, saveStudentProfile]
  );

  useEffect(() => {
    if (!autoSave || !isDirty || !draft.trim() || !level || !className) return undefined;

    const timer = window.setTimeout(() => {
      saveBiography(draft, true);
    }, 900);

    return () => window.clearTimeout(timer);
  }, [autoSave, className, draft, isDirty, level, saveBiography]);

  const handleSave = async (event) => {
    event.preventDefault();
    await saveBiography(draft, false);
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      {showReference ? (
        <div
          style={{
            border: "1px solid #bfdbfe",
            borderRadius: 14,
            background: "#eff6ff",
            padding: 14,
            display: "grid",
            gap: 10,
          }}
        >
          <strong>English meaning and German sentence starters</strong>
          <p style={{ ...styles.helperText, margin: 0 }}>
            Use the English meaning to understand each item, then write your answer in German.
          </p>
          <div style={{ display: "grid", gap: 9 }}>
            {personalInformationTranslations.map((item, index) => (
              <div key={item.german} style={{ display: "grid", gap: 3, lineHeight: 1.55 }}>
                <div>
                  <strong>{index + 1}. {item.german}</strong> — {item.english}
                </div>
                <div><strong>German:</strong> {item.example}</div>
                <div style={{ color: "#475569" }}><strong>English:</strong> {item.meaning}</div>
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <form onSubmit={handleSave} style={{ display: "grid", gap: 12 }}>
        <textarea
          className="day5-mobile-writing-box"
          aria-label="Meine Vorstellung"
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
            setIsDirty(true);
            setStatus(autoSave ? "Changes will save automatically…" : "");
            setError("");
          }}
          placeholder={placeholder}
          autoCapitalize="sentences"
          autoCorrect="on"
          spellCheck
          inputMode="text"
          rows={8}
          disabled={!autoSave && isSaving}
        />
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ ...styles.helperText, margin: 0 }}>Class: {className || "Not assigned"}</span>
          {!autoSave ? (
            <button className="day5-writing-save-button" type="submit" style={styles.primaryButton} disabled={isSaving || !level || !className}>
              {isSaving ? "Speichern…" : "Save to Class Members"}
            </button>
          ) : (
            <span style={{ ...styles.helperText, margin: 0 }}>{isSaving ? "Saving…" : "Auto-save on"}</span>
          )}
        </div>
        <p style={{ ...styles.helperText, margin: 0 }}>
          This updates the same biography shown on the Class Members page and is not submitted for grading.
        </p>
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
