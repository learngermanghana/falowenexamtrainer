import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  db,
  isFirebaseConfigured,
  onSnapshot,
  query,
  where,
} from "../firebase";
import { styles } from "../styles";
import "./MobileWritingTextarea.css";

const getClassName = (profile = {}) =>
  String(
    profile.className ||
      profile.class_name ||
      profile.class ||
      profile.cohort ||
      ""
  ).trim();

const getLevel = (profile = {}) =>
  String(profile.level || profile.courseLevel || "").trim().toUpperCase();

const getDisplayName = (profile = {}, user = {}) =>
  String(profile.name || profile.fullName || user.displayName || user.email || "Student").trim();

const getStudentCode = (profile = {}, user = {}) =>
  String(
    profile.studentcode ||
      profile.studentCode ||
      profile.student_id ||
      profile.id ||
      user.uid ||
      ""
  ).trim();

const normalizeMember = (snapshot) => {
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

export default function PersonalInformationContributionBox({ lessonId, lessonLabel }) {
  const { user, studentProfile, saveStudentProfile } = useAuth();
  const [draft, setDraft] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(true);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [members, setMembers] = useState([]);

  const level = useMemo(() => getLevel(studentProfile), [studentProfile]);
  const className = useMemo(() => getClassName(studentProfile), [studentProfile]);
  const currentStudentCode = useMemo(
    () => getStudentCode(studentProfile, user),
    [studentProfile, user]
  );

  useEffect(() => {
    if (!isDirty) setDraft(String(studentProfile?.biography || ""));
  }, [isDirty, studentProfile?.biography]);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setMembers([]);
      setError("Firebase is not configured.");
      setIsLoadingMembers(false);
      return undefined;
    }

    if (!level || !className) {
      setMembers([]);
      setError("Your class details are missing. Please contact support.");
      setIsLoadingMembers(false);
      return undefined;
    }

    setIsLoadingMembers(true);
    setError("");

    // Firestore receives only the exact level-and-class query. A student in
    // Class A never subscribes to the Class B student documents.
    const membersQuery = query(
      collection(db, "students"),
      where("level", "==", level),
      where("className", "==", className)
    );

    return onSnapshot(
      membersQuery,
      (snapshot) => {
        const nextMembers = snapshot.docs
          .map(normalizeMember)
          .filter(
            (member) =>
              member.level === level &&
              member.className === className &&
              Boolean(member.biography)
          )
          .sort((left, right) => left.name.localeCompare(right.name));

        setMembers(nextMembers);
        setIsLoadingMembers(false);
        setError("");
      },
      (subscriptionError) => {
        console.error("Failed to load Day 5 class member introductions", subscriptionError);
        setMembers([]);
        setIsLoadingMembers(false);
        setError("Class member introductions could not be loaded.");
      }
    );
  }, [className, level]);

  const handleSave = async (event) => {
    event.preventDefault();
    const introduction = draft.trim();

    if (!introduction) {
      setStatus("");
      setError("Write your introduction before saving.");
      return;
    }

    if (!level || !className) {
      setStatus("");
      setError("Your class details are missing. Please contact support.");
      return;
    }

    setIsSaving(true);
    setStatus("");
    setError("");

    try {
      // Teil 3 belongs to Class Members. It is deliberately not written to
      // writingSubmissions, assignmentProgress, qa_posts, or any submission path.
      await saveStudentProfile({ biography: introduction });
      setDraft(introduction);
      setIsDirty(false);
      setStatus(`✓ Saved to Class Members for ${className}.`);
    } catch (saveError) {
      console.error("Failed to save Day 5 class member introduction", saveError);
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
          <span style={{ ...styles.helperText, margin: 0 }}>
            Class: {className || "Not assigned"}
          </span>
          <button
            className="day5-writing-save-button"
            type="submit"
            style={styles.primaryButton}
            disabled={isSaving || !level || !className}
          >
            {isSaving ? "Speichern…" : "Save to Class Members"}
          </button>
        </div>

        <p style={{ ...styles.helperText, margin: 0 }}>
          This introduction updates your Class Members profile. It is not submitted for grading.
        </p>

        {status ? (
          <p role="status" style={{ margin: 0, color: "#166534", fontWeight: 700 }}>
            {status}
          </p>
        ) : null}
        {error ? (
          <p role="alert" style={{ margin: 0, color: "#b91c1c", fontWeight: 700 }}>
            {error}
          </p>
        ) : null}
      </form>

      <section style={{ display: "grid", gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
          <strong>{className ? `${className} introductions` : "Class introductions"}</strong>
          <span style={styles.badge}>{members.length}</span>
        </div>

        {isLoadingMembers ? (
          <p style={{ ...styles.helperText, margin: 0 }}>Loading class member introductions…</p>
        ) : null}

        {!isLoadingMembers && !error && members.length === 0 ? (
          <p style={{ ...styles.helperText, margin: 0 }}>No introductions from this class yet.</p>
        ) : null}

        {members.map((member) => {
          const isCurrentStudent =
            member.id === studentProfile?.id ||
            (currentStudentCode && member.studentCode === currentStudentCode);

          return (
            <article
              key={member.id}
              style={{
                border: "1px solid #dbeafe",
                borderRadius: 14,
                padding: 14,
                background: "#f8fbff",
                display: "grid",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
                <strong>{member.name}</strong>
                {isCurrentStudent ? <span style={styles.badge}>You</span> : null}
              </div>
              <p style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.7, color: "#1f2937" }}>
                {member.biography}
              </p>
            </article>
          );
        })}
      </section>
    </div>
  );
}
