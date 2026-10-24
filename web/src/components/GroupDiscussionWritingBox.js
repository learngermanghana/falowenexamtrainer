import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  db,
  doc,
  getDocs,
  isFirebaseConfigured,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "../firebase";
import { styles } from "../styles";
import "./MobileWritingTextarea.css";

const postsCollectionRef = (level, className) =>
  collection(db, "class_board", level, "classes", className, "posts");

const responsesCollectionRef = (threadId) =>
  collection(db, "qa_posts", threadId, "responses");

const safeIdPart = (value, fallback) =>
  String(value || fallback)
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 220);

const toMillis = (value) => {
  if (!value) return 0;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value?.seconds === "number") return value.seconds * 1000;
  if (typeof value === "number") return value;
  const parsed = Date.parse(String(value));
  return Number.isFinite(parsed) ? parsed : 0;
};

const pickLatest = (items) =>
  [...items].sort((left, right) => {
    const leftTime = Math.max(toMillis(left.updatedAt), toMillis(left.createdAt), Number(left.createdAtMs || 0));
    const rightTime = Math.max(toMillis(right.updatedAt), toMillis(right.createdAt), Number(right.createdAtMs || 0));
    return rightTime - leftTime;
  })[0] || null;

const countSentences = (text) => {
  const clean = String(text || "").trim();
  if (!clean) return 0;
  const punctuationCount = (clean.match(/[.!?](?:\s|$)/g) || []).length;
  const lineCount = clean.split(/\n+/).map((line) => line.trim()).filter(Boolean).length;
  return Math.max(punctuationCount, lineCount);
};

export default function GroupDiscussionWritingBox({
  lessonId,
  lessonLabel,
  activityKey = "writing",
  topic = "Writing activity",
  questionTitle = "Write your response",
  question = "Write your answer in German.",
  placeholder = "Write here…",
  rows = 10,
  saveLabel = "Save to Group Discussion",
}) {
  const { user, studentProfile } = useAuth();
  const [draft, setDraft] = useState("");
  const [threadId, setThreadId] = useState("");
  const [responseId, setResponseId] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const responderCode = useMemo(
    () =>
      studentProfile?.studentcode ||
      studentProfile?.studentCode ||
      studentProfile?.id ||
      user?.uid ||
      "unknown",
    [studentProfile?.id, studentProfile?.studentCode, studentProfile?.studentcode, user?.uid]
  );

  const displayName = studentProfile?.name || user?.displayName || user?.email || "Student";
  const activityLessonId = `${lessonId}-${activityKey}`;
  const draftStorageKey = `falowen:discussion-draft:${activityLessonId}:${responderCode}`;
  const sentenceCount = countSentences(draft);

  useEffect(() => {
    let cancelled = false;

    const prepare = async () => {
      setIsLoading(true);
      setError("");

      if (!isFirebaseConfigured || !db) {
        setError("Firebase is not configured.");
        setIsLoading(false);
        return;
      }

      if (!studentProfile?.level || !studentProfile?.className) {
        setError("Your class details are missing. Please contact support.");
        setIsLoading(false);
        return;
      }

      try {
        const postsRef = postsCollectionRef(studentProfile.level, studentProfile.className);
        const threadSnapshot = await getDocs(
          query(postsRef, where("lessonId", "==", activityLessonId))
        );
        const threads = threadSnapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
        let selectedThread =
          pickLatest(threads.filter((thread) => thread.status !== "archived")) || pickLatest(threads);

        if (!selectedThread) {
          const automaticThreadId = `auto-${safeIdPart(activityLessonId, "group-writing")}`;
          await setDoc(
            doc(postsRef, automaticThreadId),
            {
              level: studentProfile.level,
              className: studentProfile.className,
              lessonId: activityLessonId,
              lessonLabel: lessonLabel || lessonId,
              topic,
              questionTitle,
              instructions: "",
              question,
              extraLink: "",
              timerDurationMinutes: 0,
              timerExpiresAt: null,
              createdAtMs: Date.now(),
              createdAt: serverTimestamp(),
              createdBy: "Falowen",
              createdByUid: null,
              status: "open",
              autoCreated: true,
            },
            { merge: true }
          );
          selectedThread = { id: automaticThreadId, status: "open" };
        } else if (selectedThread.status === "archived") {
          await setDoc(
            doc(postsRef, selectedThread.id),
            { status: "open", reopenedAt: serverTimestamp() },
            { merge: true }
          );
        }

        if (cancelled) return;
        setThreadId(selectedThread.id);

        let ownResponses = [];
        if (user?.uid) {
          const ownSnapshot = await getDocs(
            query(
              responsesCollectionRef(selectedThread.id),
              where("responderUid", "==", user.uid)
            )
          );
          ownResponses = ownSnapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
        }

        if (ownResponses.length === 0 && responderCode) {
          const legacySnapshot = await getDocs(
            query(
              responsesCollectionRef(selectedThread.id),
              where("responderCode", "==", responderCode)
            )
          );
          ownResponses = legacySnapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
        }

        if (cancelled) return;
        const existingResponse = pickLatest(ownResponses);
        setResponseId(
          existingResponse?.id ||
            `${safeIdPart(activityKey, "writing")}-${safeIdPart(user?.uid || responderCode, "student")}`
        );
        setHasSubmitted(Boolean(existingResponse));

        if (existingResponse?.text) {
          setDraft(existingResponse.text);
        } else if (typeof window !== "undefined") {
          setDraft(window.localStorage.getItem(draftStorageKey) || "");
        }
      } catch (loadError) {
        console.error("Failed to prepare group discussion writing box", loadError);
        if (!cancelled) setError("The writing box could not be prepared. Please reload and try again.");
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    prepare();
    return () => {
      cancelled = true;
    };
  }, [activityKey, activityLessonId, draftStorageKey, lessonId, lessonLabel, question, questionTitle, responderCode, studentProfile?.className, studentProfile?.level, topic, user?.uid]);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(draftStorageKey, draft);
      } catch (storageError) {
        console.error("Could not save the discussion draft on this device", storageError);
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [draft, draftStorageKey]);

  const handleSave = async (event) => {
    event.preventDefault();
    const text = draft.trim();

    if (!text) {
      setStatus("");
      setError("Write your paragraph before saving.");
      return;
    }

    if (!threadId || !responseId) {
      setStatus("");
      setError("The writing box is still loading. Please try again.");
      return;
    }

    setIsSaving(true);
    setStatus("");
    setError("");

    try {
      await setDoc(
        doc(responsesCollectionRef(threadId), responseId),
        {
          author: displayName,
          responderCode,
          responderUid: user?.uid || null,
          lessonId: activityLessonId,
          lessonLabel: lessonLabel || lessonId,
          activityType: activityKey,
          text,
          answerCount: sentenceCount,
          updatedAt: serverTimestamp(),
          editedAt: hasSubmitted ? serverTimestamp() : null,
          ...(!hasSubmitted ? { createdAt: serverTimestamp(), createdAtMs: Date.now() } : {}),
        },
        { merge: true }
      );

      setDraft(text);
      setHasSubmitted(true);
      if (typeof window !== "undefined") window.localStorage.setItem(draftStorageKey, text);
      setStatus("✓ Saved to Group Discussion.");
    } catch (saveError) {
      console.error("Failed to save group discussion writing", saveError);
      setError("Your paragraph could not be saved. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section style={{ border: "1px solid #bfdbfe", borderRadius: 14, background: "#eff6ff", padding: 14, display: "grid", gap: 12 }}>
      <div style={{ display: "grid", gap: 4 }}>
        <strong style={{ color: "#1d4ed8" }}>Write your paragraph here</strong>
        <span style={{ color: "#475569", fontSize: 14 }}>
          This saves to Group Discussion only. It is not sent as an assignment submission.
        </span>
      </div>
      <form onSubmit={handleSave} style={{ display: "grid", gap: 10 }}>
        <textarea
          className="day5-mobile-writing-box"
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
            setStatus("");
            setError("");
          }}
          placeholder={placeholder}
          rows={rows}
          autoCapitalize="sentences"
          autoCorrect="on"
          spellCheck
          inputMode="text"
          disabled={isLoading || isSaving}
        />
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <span style={{ ...styles.helperText, margin: 0 }}>{sentenceCount} sentence{sentenceCount === 1 ? "" : "s"}</span>
          <button type="submit" style={styles.primaryButton} disabled={isLoading || isSaving || !threadId}>
            {isSaving ? "Saving…" : hasSubmitted ? "Update in Group Discussion" : saveLabel}
          </button>
        </div>
        {status ? <p role="status" style={{ margin: 0, color: "#166534", fontWeight: 700 }}>{status}</p> : null}
        {error ? <p role="alert" style={{ margin: 0, color: "#b91c1c", fontWeight: 700 }}>{error}</p> : null}
      </form>
    </section>
  );
}
