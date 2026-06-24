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
    .slice(0, 240);

const makeResponseId = (value) => `profile-${safeIdPart(value, "student")}`;
const makeThreadId = (lessonId) => `auto-${safeIdPart(lessonId, "day5-personal-information")}`;

export default function PersonalInformationContributionBox({ lessonId, lessonLabel }) {
  const { user, studentProfile, saveStudentProfile } = useAuth();
  const [draft, setDraft] = useState("");
  const [isDirty, setIsDirty] = useState(false);
  const [threadId, setThreadId] = useState("");
  const [responseId, setResponseId] = useState("");
  const [hasExistingResponse, setHasExistingResponse] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [contributions, setContributions] = useState([]);
  const [areContributionsLoading, setAreContributionsLoading] = useState(false);
  const [contributionsError, setContributionsError] = useState("");

  const responderCode = useMemo(
    () =>
      studentProfile?.studentcode ||
      studentProfile?.studentCode ||
      studentProfile?.id ||
      user?.uid ||
      "unknown",
    [studentProfile?.id, studentProfile?.studentCode, studentProfile?.studentcode, user?.uid]
  );

  const displayName =
    studentProfile?.name || user?.displayName || user?.email || "Student";

  useEffect(() => {
    if (!isDirty) {
      setDraft(studentProfile?.biography || "");
    }
  }, [isDirty, studentProfile?.biography]);

  useEffect(() => {
    let cancelled = false;

    const loadContribution = async () => {
      setIsLoading(true);
      setError("");
      setStatus("");

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
          query(postsRef, where("lessonId", "==", lessonId))
        );

        if (cancelled) return;

        const threads = threadSnapshot.docs.map((entry) => ({
          id: entry.id,
          ...entry.data(),
        }));
        let selectedThread =
          pickLatest(threads.filter((thread) => thread.status !== "archived")) ||
          pickLatest(threads);

        if (!selectedThread) {
          const automaticThreadId = makeThreadId(lessonId);
          const nowMs = Date.now();
          await setDoc(
            doc(postsRef, automaticThreadId),
            {
              level: studentProfile.level,
              className: studentProfile.className,
              lessonId,
              lessonLabel: lessonLabel || lessonId,
              topic: "Personal Information",
              questionTitle: "Write about yourself",
              instructions: "",
              question: "Write a short German introduction with 6–8 sentences.",
              extraLink: "",
              timerDurationMinutes: 0,
              timerExpiresAt: null,
              createdAtMs: nowMs,
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
          selectedThread = { ...selectedThread, status: "open" };
        }

        if (cancelled) return;
        setThreadId(selectedThread.id);

        let existingResponses = [];
        if (user?.uid) {
          const responseSnapshot = await getDocs(
            query(
              responsesCollectionRef(selectedThread.id),
              where("responderUid", "==", user.uid)
            )
          );
          existingResponses = responseSnapshot.docs.map((entry) => ({
            id: entry.id,
            ...entry.data(),
          }));
        }

        if (existingResponses.length === 0 && responderCode) {
          const legacyResponseSnapshot = await getDocs(
            query(
              responsesCollectionRef(selectedThread.id),
              where("responderCode", "==", responderCode)
            )
          );
          existingResponses = legacyResponseSnapshot.docs.map((entry) => ({
            id: entry.id,
            ...entry.data(),
          }));
        }

        if (cancelled) return;

        const existingResponse = pickLatest(existingResponses);
        const nextResponseId =
          existingResponse?.id || makeResponseId(user?.uid || studentProfile?.id || responderCode);
        setResponseId(nextResponseId);
        setHasExistingResponse(Boolean(existingResponse));

        if (!isDirty && !studentProfile?.biography && existingResponse?.text) {
          setDraft(existingResponse.text);
        }
      } catch (loadError) {
        console.error("Failed to prepare personal information contribution", loadError);
        if (!cancelled) {
          setError("The writing box could not be prepared. Please reload and try again.");
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    };

    loadContribution();
    return () => {
      cancelled = true;
    };
  }, [
    isDirty,
    lessonId,
    lessonLabel,
    responderCode,
    studentProfile?.biography,
    studentProfile?.className,
    studentProfile?.id,
    studentProfile?.level,
    user?.uid,
  ]);

  useEffect(() => {
    if (!threadId || !db) {
      setContributions([]);
      setAreContributionsLoading(false);
      return undefined;
    }

    setAreContributionsLoading(true);
    setContributionsError("");

    return onSnapshot(
      responsesCollectionRef(threadId),
      (snapshot) => {
        const nextContributions = snapshot.docs.map((entry) => ({
          id: entry.id,
          ...entry.data(),
        }));
        setContributions(dedupeContributions(nextContributions));
        setAreContributionsLoading(false);
        setContributionsError("");
      },
      (subscriptionError) => {
        console.error("Failed to load class contributions", subscriptionError);
        setAreContributionsLoading(false);
        setContributionsError("Class contributions could not be loaded.");
      }
    );
  }, [threadId]);

  const handleSave = async (event) => {
    event.preventDefault();
    const introduction = draft.trim();

    if (!introduction) {
      setError("Write your introduction before saving.");
      setStatus("");
      return;
    }

    if (!threadId || !responseId) {
      setError("The writing box is still loading. Please try again.");
      setStatus("");
      return;
    }

    setIsSaving(true);
    setError("");
    setStatus("");

    try {
      const responseRef = doc(responsesCollectionRef(threadId), responseId);

      await Promise.all([
        saveStudentProfile({ biography: introduction }),
        setDoc(
          responseRef,
          {
            author: displayName,
            responderCode,
            responderUid: user?.uid || null,
            lessonId,
            lessonLabel: lessonLabel || lessonId,
            text: introduction,
            updatedAt: serverTimestamp(),
            editedAt: hasExistingResponse ? serverTimestamp() : null,
            ...(!hasExistingResponse
              ? { createdAt: serverTimestamp(), createdAtMs: Date.now() }
              : {}),
          },
          { merge: true }
        ),
      ]);

      setDraft(introduction);
      setHasExistingResponse(true);
      setIsDirty(false);
      setStatus("✓ Deine Vorstellung wurde gespeichert.");
    } catch (saveError) {
      console.error("Failed to save personal information contribution", saveError);
      setError("Deine Vorstellung konnte nicht gespeichert werden. Bitte versuche es erneut.");
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
          }}
          placeholder="Mein Vorname ist … Ich komme aus …"
          autoCapitalize="sentences"
          autoCorrect="on"
          spellCheck
          inputMode="text"
          rows={10}
          disabled={isLoading || isSaving}
        />
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button
            className="day5-writing-save-button"
            type="submit"
            style={styles.primaryButton}
            disabled={isLoading || isSaving || !threadId}
          >
            {isSaving ? "Speichern…" : "Vorstellung speichern"}
          </button>
        </div>
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
          <strong>Class contributions</strong>
          <span style={styles.badge}>{contributions.length}</span>
        </div>

        {areContributionsLoading ? (
          <p style={{ ...styles.helperText, margin: 0 }}>Loading contributions…</p>
        ) : null}

        {contributionsError ? (
          <p role="alert" style={{ margin: 0, color: "#b91c1c", fontWeight: 700 }}>
            {contributionsError}
          </p>
        ) : null}

        {!areContributionsLoading && !contributionsError && contributions.length === 0 ? (
          <p style={{ ...styles.helperText, margin: 0 }}>No introductions yet.</p>
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
            <strong style={{ fontSize: 15 }}>{contribution.author || "Student"}</strong>
            <p style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.7, color: "#1f2937" }}>
              {contribution.text}
            </p>
          </article>
        ))}
      </section>
    </div>
  );
}
