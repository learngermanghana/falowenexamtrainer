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

const pickLatest = (items) =>
  [...items].sort(
    (left, right) =>
      Math.max(toMillis(right.updatedAt), toMillis(right.editedAt), toMillis(right.createdAt), right.createdAtMs || 0) -
      Math.max(toMillis(left.updatedAt), toMillis(left.editedAt), toMillis(left.createdAt), left.createdAtMs || 0)
  )[0] || null;

const makeResponseId = (value) =>
  `profile-${String(value || "student").replace(/[^a-zA-Z0-9._-]/g, "_")}`.slice(0, 300);

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
        const threadSnapshot = await getDocs(
          query(
            postsCollectionRef(studentProfile.level, studentProfile.className),
            where("lessonId", "==", lessonId)
          )
        );

        if (cancelled) return;

        const threads = threadSnapshot.docs.map((entry) => ({
          id: entry.id,
          ...entry.data(),
        }));
        const selectedThread =
          pickLatest(threads.filter((thread) => thread.status !== "archived")) ||
          pickLatest(threads);

        if (!selectedThread) {
          setThreadId("");
          setError("This class contribution is not open yet.");
          setIsLoading(false);
          return;
        }

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
        console.error("Failed to load personal information contribution", loadError);
        if (!cancelled) {
          setError("Your saved introduction could not be loaded. Please try again.");
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
    lessonId,
    responderCode,
    studentProfile?.className,
    studentProfile?.id,
    studentProfile?.level,
    user?.uid,
  ]);

  const handleSave = async (event) => {
    event.preventDefault();
    const introduction = draft.trim();

    if (!introduction) {
      setError("Write your introduction before saving.");
      setStatus("");
      return;
    }

    if (!threadId || !responseId) {
      setError("This class contribution is not open yet.");
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
    <form onSubmit={handleSave} style={{ display: "grid", gap: 10 }}>
      <textarea
        aria-label="Meine Vorstellung"
        value={draft}
        onChange={(event) => {
          setDraft(event.target.value);
          setIsDirty(true);
          setStatus("");
        }}
        placeholder="Mein Vorname ist … Ich komme aus …"
        style={{ ...styles.textArea, minHeight: 180, width: "100%", boxSizing: "border-box" }}
        disabled={isLoading || isSaving}
      />
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button
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
  );
}
