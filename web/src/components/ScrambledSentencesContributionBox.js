import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  db,
  doc,
  getDocs,
  isFirebaseConfigured,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "../firebase";
import { styles } from "../styles";
import "./MobileWritingTextarea.css";

const DRAFT_STORAGE_KEY = "a1-day5-scrambled-sentences";

const postsCollectionRef = (level, className) =>
  collection(db, "class_board", level, "classes", className, "posts");

const responsesCollectionRef = (threadId) =>
  collection(db, "qa_posts", threadId, "responses");

const toMillis = (value) => {
  if (!value) return 0;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value?.seconds === "number") return value.seconds * 1000;
  if (typeof value === "number") return value;
  const parsed = Date.parse(String(value));
  return Number.isFinite(parsed) ? parsed : 0;
};

const responseTime = (item) =>
  Math.max(
    toMillis(item?.updatedAt),
    toMillis(item?.editedAt),
    toMillis(item?.createdAt),
    Number(item?.createdAtMs || 0)
  );

const pickLatest = (items) =>
  [...items].sort((left, right) => responseTime(right) - responseTime(left))[0] || null;

const dedupeContributions = (items) => {
  const latestByStudent = new Map();

  items.forEach((item) => {
    if (!String(item?.text || "").trim()) return;
    const identity = String(
      item.responderUid || item.responderCode || item.author || item.id
    ).toLowerCase();
    const current = latestByStudent.get(identity);
    if (!current || responseTime(item) >= responseTime(current)) {
      latestByStudent.set(identity, item);
    }
  });

  return Array.from(latestByStudent.values()).sort((left, right) =>
    String(left.author || "Student").localeCompare(String(right.author || "Student"))
  );
};

const safeIdPart = (value, fallback) =>
  String(value || fallback)
    .replace(/[^a-zA-Z0-9._-]/g, "_")
    .slice(0, 220);

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
  const [draft, setDraft] = useState(() => {
    if (typeof window === "undefined") return "";
    return window.localStorage.getItem(DRAFT_STORAGE_KEY) || "";
  });
  const [threadId, setThreadId] = useState("");
  const [responseId, setResponseId] = useState("");
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [contributions, setContributions] = useState([]);
  const [contributionsError, setContributionsError] = useState("");
  const [showAnswers, setShowAnswers] = useState(false);

  const activityLessonId = `${lessonId}-teil6-scrambled-sentences`;
  const responderCode =
    studentProfile?.studentcode ||
    studentProfile?.studentCode ||
    studentProfile?.id ||
    user?.uid ||
    "unknown";
  const displayName =
    studentProfile?.name || user?.displayName || user?.email || "Student";

  const isTutor = useMemo(() => {
    const role = String(studentProfile?.role || "").toLowerCase();
    const email = String(user?.email || studentProfile?.email || "").toLowerCase();
    return role === "tutor" || role === "admin" || studentProfile?.isTutor === true || email === "moxflex@gmail.com";
  }, [studentProfile?.email, studentProfile?.isTutor, studentProfile?.role, user?.email]);

  const canViewClassWork = hasSubmitted || isTutor;
  const completedAttempts = countAttempts(draft);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const timer = window.setTimeout(() => {
      try {
        window.localStorage.setItem(DRAFT_STORAGE_KEY, draft);
      } catch (storageError) {
        console.error("Could not save scrambled-sentence draft on this device", storageError);
      }
    }, 350);
    return () => window.clearTimeout(timer);
  }, [draft]);

  useEffect(() => {
    let cancelled = false;

    const prepareActivity = async () => {
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
        const snapshot = await getDocs(
          query(postsRef, where("lessonId", "==", activityLessonId))
        );
        const threads = snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() }));
        let selectedThread =
          pickLatest(threads.filter((thread) => thread.status !== "archived")) ||
          pickLatest(threads);

        if (!selectedThread) {
          const automaticThreadId = `auto-${safeIdPart(activityLessonId, "day5-teil6")}`;
          await setDoc(
            doc(postsRef, automaticThreadId),
            {
              level: studentProfile.level,
              className: studentProfile.className,
              lessonId: activityLessonId,
              lessonLabel: `${lessonLabel || lessonId} · Teil 6`,
              topic: "Scrambled Sentences",
              questionTitle: "Correct the scrambled sentences",
              instructions: "",
              question: "Rearrange all sentences and identify each one as a statement or question.",
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
            `sentences-${safeIdPart(user?.uid || studentProfile?.id || responderCode, "student")}`
        );
        setHasSubmitted(Boolean(existingResponse));
        if (existingResponse?.text) {
          setDraft(existingResponse.text);
        }
      } catch (loadError) {
        console.error("Failed to prepare scrambled-sentence activity", loadError);
        if (!cancelled) {
          setError("The class writing activity could not be loaded. Please reload and try again.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    prepareActivity();
    return () => {
      cancelled = true;
    };
  }, [activityLessonId, lessonId, lessonLabel, responderCode, studentProfile?.className, studentProfile?.id, studentProfile?.level, user?.uid]);

  useEffect(() => {
    if (!threadId || !db) {
      setContributions([]);
      return undefined;
    }

    return onSnapshot(
      responsesCollectionRef(threadId),
      (snapshot) => {
        setContributions(
          dedupeContributions(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() })))
        );
        setContributionsError("");
      },
      (subscriptionError) => {
        console.error("Failed to subscribe to scrambled-sentence contributions", subscriptionError);
        setContributionsError("Class answers could not be loaded.");
      }
    );
  }, [threadId]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const text = draft.trim();

    if (completedAttempts < expectedCount) {
      setStatus("");
      setError(`Complete all ${expectedCount} sentences before posting. You currently have ${completedAttempts}.`);
      return;
    }

    if (!threadId || !responseId) {
      setStatus("");
      setError("The class activity is still loading. Please try again.");
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
          lessonLabel: `${lessonLabel || lessonId} · Teil 6`,
          activityType: "scrambled-sentences",
          text,
          answerCount: completedAttempts,
          updatedAt: serverTimestamp(),
          editedAt: hasSubmitted ? serverTimestamp() : null,
          ...(!hasSubmitted ? { createdAt: serverTimestamp(), createdAtMs: Date.now() } : {}),
        },
        { merge: true }
      );
      setHasSubmitted(true);
      setDraft(text);
      setStatus("✓ Deine Sätze wurden für die Klasse gespeichert.");
    } catch (saveError) {
      console.error("Failed to save scrambled-sentence contribution", saveError);
      setError("Deine Sätze konnten nicht gespeichert werden. Bitte versuche es erneut.");
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
            {completedAttempts}/{expectedCount} sentences completed
          </span>
          <button
            className="day5-writing-save-button"
            type="submit"
            style={styles.primaryButton}
            disabled={isLoading || isSaving || !threadId}
          >
            {isSaving ? "Posting…" : hasSubmitted ? "Update my answers" : "Post my answers"}
          </button>
        </div>

        {status ? <p role="status" style={{ margin: 0, color: "#166534", fontWeight: 700 }}>{status}</p> : null}
        {error ? <p role="alert" style={{ margin: 0, color: "#b91c1c", fontWeight: 700 }}>{error}</p> : null}
      </form>

      {!canViewClassWork ? (
        <div style={{ border: "1px solid #fde68a", background: "#fffbeb", borderRadius: 14, padding: 14 }}>
          <strong>Post your own answers first.</strong>
          <p style={{ margin: "6px 0 0", lineHeight: 1.6 }}>
            The class contributions and answer key will unlock after you complete and post all {expectedCount} sentences.
          </p>
        </div>
      ) : (
        <>
          <section style={{ display: "grid", gap: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 }}>
              <strong>Class answers</strong>
              <span style={styles.badge}>{contributions.length}</span>
            </div>
            {contributionsError ? <p role="alert" style={{ margin: 0, color: "#b91c1c", fontWeight: 700 }}>{contributionsError}</p> : null}
            {!contributionsError && contributions.length === 0 ? <p style={{ ...styles.helperText, margin: 0 }}>No answers posted yet.</p> : null}
            {contributions.map((contribution) => (
              <article
                key={contribution.id}
                style={{ border: "1px solid #dbeafe", borderRadius: 14, padding: 14, background: "#f8fbff", display: "grid", gap: 8 }}
              >
                <strong>{contribution.author || "Student"} posted</strong>
                <p style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.7, color: "#1f2937" }}>{contribution.text}</p>
              </article>
            ))}
          </section>

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
                {answers.map((answer, index) => <div key={answer}>{index + 1}. {answer}</div>)}
              </div>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
}
