import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  db,
  doc,
  isFirebaseConfigured,
  onSnapshot,
  serverTimestamp,
  setDoc,
} from "../firebase";
import { styles } from "../styles";
import "./MobileWritingTextarea.css";

const safeDocKey = (value, fallback = "unknown") =>
  String(value || fallback)
    .trim()
    .replace(/[\\/]+/g, "-")
    .replace(/\s+/g, "-")
    .replace(/[^a-zA-Z0-9._-]/g, "-")
    .toLowerCase()
    .slice(0, 180) || fallback;

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

const getStudentCode = (profile = {}, user = {}) =>
  String(
    profile.studentcode ||
      profile.studentCode ||
      profile.student_id ||
      profile.id ||
      user.uid ||
      "unknown"
  ).trim();

const getDisplayName = (profile = {}, user = {}) =>
  String(profile.name || profile.fullName || user.displayName || user.email || "Student").trim();

const contributionsCollectionRef = (level, classKey, activityLessonId) =>
  collection(
    db,
    "group_discussion",
    level,
    "classes",
    classKey,
    "lessons",
    activityLessonId,
    "contributions"
  );

const toMillis = (value) => {
  if (!value) return 0;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value?.seconds === "number") return value.seconds * 1000;
  if (typeof value === "number") return value;
  const parsed = Date.parse(String(value));
  return Number.isFinite(parsed) ? parsed : 0;
};

const contributionTime = (item) =>
  Math.max(
    toMillis(item?.updatedAt),
    toMillis(item?.editedAt),
    toMillis(item?.createdAt),
    Number(item?.createdAtMs || 0)
  );

const countAttempts = (text) => {
  const nonEmptyLines = String(text || "")
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean).length;
  const sentenceEndings = (String(text || "").match(/[.!?](?:\s|$)/g) || []).length;
  return Math.max(nonEmptyLines, sentenceEndings);
};

export default function ScrambledSentencesContributionBox({
  lessonId,
  lessonLabel,
  answers = [],
  expectedCount = 11,
}) {
  const { user, studentProfile } = useAuth();
  const level = useMemo(() => getLevel(studentProfile), [studentProfile]);
  const className = useMemo(() => getClassName(studentProfile), [studentProfile]);
  const classKey = useMemo(() => safeDocKey(className, "unknown-class"), [className]);
  const activityLessonId = `${lessonId}-teil6-scrambled-sentences`;
  const studentCode = useMemo(
    () => getStudentCode(studentProfile, user),
    [studentProfile, user]
  );
  const contributionId = useMemo(
    () => safeDocKey(user?.uid || studentProfile?.id || studentCode, "student"),
    [studentCode, studentProfile?.id, user?.uid]
  );
  const draftStorageKey = useMemo(
    () => `day5-scrambled:${level}:${classKey}:${contributionId}`,
    [classKey, contributionId, level]
  );

  const [draft, setDraft] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [contributions, setContributions] = useState([]);
  const [showAnswers, setShowAnswers] = useState(false);

  const isTutor = useMemo(() => {
    const role = String(studentProfile?.role || "").toLowerCase();
    const email = String(user?.email || studentProfile?.email || "").toLowerCase();
    return (
      role === "tutor" ||
      role === "admin" ||
      studentProfile?.isTutor === true ||
      email === "moxflex@gmail.com"
    );
  }, [studentProfile?.email, studentProfile?.isTutor, studentProfile?.role, user?.email]);

  const canViewAnswers = hasSubmitted || isTutor;
  const completedAttempts = countAttempts(draft);

  useEffect(() => {
    if (typeof window === "undefined" || isDirty) return;
    try {
      setDraft(window.localStorage.getItem(draftStorageKey) || "");
    } catch (storageError) {
      console.error("Could not load the class-scoped Day 5 draft", storageError);
    }
  }, [draftStorageKey, isDirty]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(draftStorageKey, draft);
      } catch (storageError) {
        console.error("Could not save the class-scoped Day 5 draft", storageError);
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [draft, draftStorageKey]);

  useEffect(() => {
    if (!isFirebaseConfigured || !db) {
      setContributions([]);
      setError("Firebase is not configured.");
      setIsLoading(false);
      return undefined;
    }

    if (!level || !className) {
      setContributions([]);
      setError("Your class details are missing. Please contact support.");
      setIsLoading(false);
      return undefined;
    }

    setIsLoading(true);
    setError("");

    const contributionsRef = contributionsCollectionRef(level, classKey, activityLessonId);

    // The subscription points to one exact level, class, and lesson. We also
    // validate stored metadata before displaying it to guard against a class-key collision.
    return onSnapshot(
      contributionsRef,
      (snapshot) => {
        const nextContributions = snapshot.docs
          .map((entry) => ({ id: entry.id, ...entry.data() }))
          .filter(
            (entry) =>
              String(entry.level || "").toUpperCase() === level &&
              String(entry.className || "") === className &&
              String(entry.lessonId || "") === activityLessonId &&
              Boolean(String(entry.text || "").trim())
          )
          .sort((left, right) => contributionTime(right) - contributionTime(left));

        setContributions(nextContributions);
        setError("");
        setIsLoading(false);

        const mine = nextContributions.find(
          (entry) =>
            entry.id === contributionId ||
            (user?.uid && entry.studentUid === user.uid) ||
            String(entry.studentCode || "").toLowerCase() === studentCode.toLowerCase()
        );

        setHasSubmitted(Boolean(mine));
        if (mine?.text && !isDirty) setDraft(mine.text);
      },
      (subscriptionError) => {
        console.error("Failed to load class-scoped scrambled-sentence contributions", subscriptionError);
        setContributions([]);
        setError("Class answers could not be loaded.");
        setIsLoading(false);
      }
    );
  }, [activityLessonId, classKey, className, contributionId, isDirty, level, studentCode, user?.uid]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const text = draft.trim();

    if (completedAttempts < expectedCount) {
      setStatus("");
      setError(`Complete all ${expectedCount} sentences before posting. You currently have ${completedAttempts}.`);
      return;
    }

    if (!level || !className || !db) {
      setStatus("");
      setError("Your class discussion is not ready. Please refresh and try again.");
      return;
    }

    setIsSaving(true);
    setStatus("");
    setError("");

    try {
      const contributionRef = doc(
        contributionsCollectionRef(level, classKey, activityLessonId),
        contributionId
      );

      await setDoc(
        contributionRef,
        {
          level,
          className,
          classKey,
          lessonId: activityLessonId,
          lessonLabel: `${lessonLabel || lessonId} · Teil 6`,
          contributionType: "scrambled-sentences",
          authorName: getDisplayName(studentProfile, user),
          studentCode,
          studentUid: user?.uid || null,
          text,
          answerCount: completedAttempts,
          updatedAt: serverTimestamp(),
          editedAt: hasSubmitted ? serverTimestamp() : null,
          ...(!hasSubmitted
            ? { createdAt: serverTimestamp(), createdAtMs: Date.now() }
            : {}),
        },
        { merge: true }
      );

      setHasSubmitted(true);
      setDraft(text);
      setIsDirty(false);
      setStatus(`✓ Saved to the ${className} group discussion.`);
    } catch (saveError) {
      console.error("Failed to save class-scoped scrambled-sentence contribution", saveError);
      setError("Your sentences could not be saved. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <label style={{ display: "grid", gap: 8 }}>
          <strong>Your corrected sentences</strong>
          <textarea
            className="day5-mobile-writing-box"
            value={draft}
            onChange={(event) => {
              setDraft(event.target.value);
              setIsDirty(true);
              setStatus("");
              setError("");
            }}
            placeholder={"1. Ich heiße Anna. (Statement)\n2. Woher kommen Sie? (Question)\n..."}
            autoCapitalize="sentences"
            autoCorrect="on"
            spellCheck
            inputMode="text"
            rows={12}
            disabled={isLoading || isSaving}
          />
        </label>

        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ ...styles.helperText, margin: 0 }}>
            {completedAttempts}/{expectedCount} sentences · Class: {className || "Not assigned"}
          </span>
          <button
            className="day5-writing-save-button"
            type="submit"
            style={styles.primaryButton}
            disabled={isLoading || isSaving || !level || !className}
          >
            {isSaving ? "Posting…" : hasSubmitted ? "Update my answers" : "Post to group discussion"}
          </button>
        </div>

        <p style={{ ...styles.helperText, margin: 0 }}>
          This is a class discussion activity, not a graded submission.
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
          <strong>{className ? `${className} answers` : "Class answers"}</strong>
          <span style={styles.badge}>{contributions.length}</span>
        </div>

        {isLoading ? <p style={{ ...styles.helperText, margin: 0 }}>Loading class answers…</p> : null}
        {!isLoading && !error && contributions.length === 0 ? (
          <p style={{ ...styles.helperText, margin: 0 }}>No answers posted in this class yet.</p>
        ) : null}

        {contributions.map((contribution) => (
          <article
            key={contribution.id}
            style={{
              border: "1px solid #dbeafe",
              borderRadius: 14,
              padding: 14,
              background: "#f8fbff",
              display: "grid",
              gap: 8,
            }}
          >
            <strong>{contribution.authorName || "Student"} posted</strong>
            <p style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.7, color: "#1f2937" }}>
              {contribution.text}
            </p>
          </article>
        ))}
      </section>

      {!canViewAnswers ? (
        <div style={{ border: "1px solid #fde68a", background: "#fffbeb", borderRadius: 14, padding: 14 }}>
          <strong>Post your own answers to unlock the answer key.</strong>
          <p style={{ margin: "6px 0 0", lineHeight: 1.6 }}>
            You can read posts from {className || "your class"} now. Complete and post all {expectedCount} sentences to view the official answers.
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gap: 10 }}>
          <button
            type="button"
            style={{ ...styles.secondaryButton, width: "100%", minHeight: 50, borderRadius: 12 }}
            onClick={() => setShowAnswers((current) => !current)}
          >
            {showAnswers ? "Hide scrambled sentence answers" : "Show scrambled sentence answers"}
          </button>
          {showAnswers ? (
            <div style={{ border: "1px solid #bbf7d0", background: "#f0fdf4", borderRadius: 14, padding: 14, display: "grid", gap: 7 }}>
              {answers.map((answer, index) => (
                <div key={answer}>{index + 1}. {answer}</div>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
