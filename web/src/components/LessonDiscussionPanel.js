import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  db,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "../firebase";
import { correctDiscussionText } from "../services/discussionService";
import { styles } from "../styles";

const GERMAN_KEYS = ["ä", "ö", "ü", "ß"];

const safeId = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 180);

const toMillis = (value) => {
  if (!value) return null;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value?.seconds === "number") return value.seconds * 1000;
  const parsed = typeof value === "number" ? value : Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const formatDate = (value) => {
  const millis = toMillis(value);
  if (!millis) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Africa/Accra",
  }).format(new Date(millis));
};

const LessonDiscussionPanel = ({
  lessonId,
  lessonLabel,
  title = "Class discussion",
  instructions = "",
  question = "",
  example = "",
}) => {
  const { user, studentProfile, idToken } = useAuth();
  const [responses, setResponses] = useState([]);
  const [draft, setDraft] = useState("");
  const [isPreparing, setIsPreparing] = useState(true);
  const [isThreadReady, setIsThreadReady] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isCorrecting, setIsCorrecting] = useState(false);
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");

  const level = String(studentProfile?.level || studentProfile?.course || "").trim();
  const className = String(studentProfile?.className || "").trim();
  const studentCode = String(
    studentProfile?.studentcode || studentProfile?.studentCode || studentProfile?.id || user?.uid || ""
  ).trim();
  const displayName =
    studentProfile?.name || studentProfile?.fullName || user?.displayName || user?.email || "Student";
  const identity = user?.uid || studentCode || studentProfile?.email || "";

  const threadId = useMemo(() => {
    if (!level || !className || !lessonId) return "";
    return `workbook_${safeId(level)}_${safeId(className)}_${safeId(lessonId)}`;
  }, [className, lessonId, level]);

  const responseId = useMemo(
    () => (identity ? `student_${safeId(identity)}` : ""),
    [identity]
  );

  const myResponse = useMemo(() => {
    const uid = String(user?.uid || "");
    const code = studentCode.toLowerCase();
    return (
      responses.find((item) => uid && item.responderUid === uid) ||
      responses.find(
        (item) => code && String(item.responderCode || "").toLowerCase() === code
      ) ||
      null
    );
  }, [responses, studentCode, user?.uid]);

  const participantCount = useMemo(() => {
    const participants = new Set();
    responses.forEach((item) => {
      participants.add(
        item.responderUid ||
          String(item.responderCode || "").toLowerCase() ||
          String(item.author || "").toLowerCase()
      );
    });
    participants.delete("");
    return participants.size;
  }, [responses]);

  useEffect(() => {
    let active = true;

    const prepareThread = async () => {
      setIsPreparing(true);
      setIsThreadReady(false);
      setError("");

      if (!db || !level || !className || !threadId) {
        if (active) {
          setError("Your account needs a class and course level before this discussion can load.");
          setIsPreparing(false);
        }
        return;
      }

      try {
        const posts = collection(db, "class_board", level, "classes", className, "posts");
        const threadRef = doc(posts, threadId);
        const snapshot = await getDoc(threadRef);

        if (!snapshot.exists()) {
          await setDoc(threadRef, {
            level,
            className,
            lessonId,
            lessonLabel,
            topic: title,
            questionTitle: title,
            question,
            instructions,
            createdAtMs: Date.now(),
            createdAt: serverTimestamp(),
            createdBy: "Falowen workbook",
            createdByUid: null,
            status: "open",
            source: "embedded-workbook",
          });
        }

        if (active) setIsThreadReady(true);
      } catch (threadError) {
        console.error("Failed to prepare workbook discussion", threadError);
        if (active) setError("The class discussion could not be prepared. Please reload this lesson.");
      } finally {
        if (active) setIsPreparing(false);
      }
    };

    prepareThread();
    return () => {
      active = false;
    };
  }, [className, instructions, lessonId, lessonLabel, level, question, threadId, title]);

  useEffect(() => {
    if (!db || !threadId || !isThreadReady) {
      setIsLoading(false);
      return undefined;
    }

    setIsLoading(true);
    const responsesQuery = query(
      collection(db, "qa_posts", threadId, "responses"),
      orderBy("createdAt", "asc")
    );

    const unsubscribe = onSnapshot(
      responsesQuery,
      (snapshot) => {
        setResponses(
          snapshot.docs.map((item) => {
            const data = item.data();
            return {
              id: item.id,
              author: data.author || data.responder || "Student",
              responderCode: data.responderCode || data.studentCode || "",
              responderUid: data.responderUid || "",
              text: data.text || "",
              createdAt: data.createdAt || null,
              editedAt: data.editedAt || null,
            };
          })
        );
        setIsLoading(false);
      },
      (responseError) => {
        console.error("Failed to load workbook discussion", responseError);
        setError("Class responses could not be loaded. Please try again.");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [isThreadReady, threadId]);

  useEffect(() => {
    if (myResponse && !draft) setDraft(myResponse.text);
  }, [draft, myResponse]);

  const handlePost = async () => {
    const text = draft.trim();
    if (!text || !db || !threadId || !responseId || !isThreadReady) return;

    setIsSaving(true);
    setError("");
    setNotice("");

    try {
      await setDoc(
        doc(collection(db, "qa_posts", threadId, "responses"), myResponse?.id || responseId),
        {
          author: displayName,
          responderCode: studentCode,
          responderUid: user?.uid || null,
          text,
          ...(myResponse ? { editedAt: serverTimestamp() } : { createdAt: serverTimestamp() }),
        },
        { merge: true }
      );
      setNotice(myResponse ? "Your response was updated." : "Your response was posted.");
    } catch (saveError) {
      console.error("Failed to save workbook discussion response", saveError);
      setError("Your response could not be saved. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCorrect = async () => {
    if (!draft.trim()) return;

    setIsCorrecting(true);
    setError("");
    setNotice("");

    try {
      const { corrected } = await correctDiscussionText({
        text: draft,
        level,
        idToken,
      });
      if (corrected) setDraft(corrected);
    } catch (correctionError) {
      console.error("Failed to correct workbook discussion response", correctionError);
      setError("The AI correction failed. Please try again.");
    } finally {
      setIsCorrecting(false);
    }
  };

  return (
    <section
      style={{
        ...styles.card,
        display: "grid",
        gap: 14,
        border: "1px solid #bfdbfe",
        background: "linear-gradient(135deg, #eff6ff 0%, #ffffff 62%, #f0fdf4 100%)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
        <div>
          <p style={{ ...styles.helperText, margin: 0, color: "#1d4ed8", fontWeight: 900 }}>
            Live workbook activity
          </p>
          <h2 style={{ margin: "4px 0" }}>{title}</h2>
          <p style={{ ...styles.helperText, margin: 0 }}>{lessonLabel}</p>
        </div>
        <span
          style={{
            ...styles.badge,
            alignSelf: "flex-start",
            background: myResponse ? "#ecfdf5" : "#fff7ed",
            borderColor: myResponse ? "#86efac" : "#fed7aa",
            color: myResponse ? "#166534" : "#9a3412",
          }}
        >
          {myResponse ? "Participated" : "Not yet posted"}
        </span>
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <span style={styles.badge}>Level: {level || "(missing)"}</span>
        <span style={styles.badge}>Class: {className || "(missing)"}</span>
        <span style={styles.badge}>
          {participantCount} participant{participantCount === 1 ? "" : "s"}
        </span>
      </div>

      {instructions ? (
        <div style={{ border: "1px solid #93c5fd", borderRadius: 12, padding: 12, background: "#eff6ff", lineHeight: 1.7 }}>
          <strong>Instructions:</strong> {instructions}
        </div>
      ) : null}

      {question ? (
        <div style={{ borderLeft: "4px solid #2563eb", paddingLeft: 12, lineHeight: 1.7 }}>
          <strong>Discussion question:</strong> {question}
        </div>
      ) : null}

      {example ? (
        <div style={{ border: "1px dashed #86efac", borderRadius: 12, padding: 12, background: "#f0fdf4", lineHeight: 1.7 }}>
          <strong>Example:</strong> {example}
        </div>
      ) : null}

      <div style={{ display: "grid", gap: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
          <strong>Class responses ({responses.length})</strong>
          <span style={{ ...styles.helperText, margin: 0 }}>Visible only to your class.</span>
        </div>

        {isPreparing || isLoading ? (
          <p style={{ ...styles.helperText, margin: 0 }}>Loading the live discussion...</p>
        ) : responses.length === 0 ? (
          <p style={{ ...styles.helperText, margin: 0 }}>No responses yet. Be the first to introduce yourself.</p>
        ) : (
          <div style={{ display: "grid", gap: 9 }}>
            {responses.map((item) => {
              const isMine =
                (user?.uid && item.responderUid === user.uid) ||
                (studentCode &&
                  String(item.responderCode || "").toLowerCase() === studentCode.toLowerCase());

              return (
                <article
                  key={item.id}
                  style={{
                    border: isMine ? "1px solid #86efac" : "1px solid #e5e7eb",
                    borderRadius: 12,
                    padding: 12,
                    background: isMine ? "#f0fdf4" : "#ffffff",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                    <strong>
                      {item.author}
                      {isMine ? " · You" : ""}
                    </strong>
                    <span style={{ ...styles.helperText, margin: 0 }}>
                      {formatDate(item.editedAt || item.createdAt)}
                      {item.editedAt ? " · edited" : ""}
                    </span>
                  </div>
                  <p style={{ margin: "8px 0 0", lineHeight: 1.7, whiteSpace: "pre-wrap" }}>{item.text}</p>
                </article>
              );
            })}
          </div>
        )}
      </div>

      <div style={{ display: "grid", gap: 9, borderTop: "1px solid #dbeafe", paddingTop: 14 }}>
        <label style={{ fontWeight: 800 }} htmlFor={`${threadId}-response`}>
          {myResponse ? "Update your introduction" : "Write your introduction"}
        </label>
        <textarea
          id={`${threadId}-response`}
          style={{ ...styles.textArea, minHeight: 120 }}
          value={draft}
          onChange={(event) => {
            setDraft(event.target.value);
            setNotice("");
          }}
          placeholder="Ich heiße ... Ich komme aus ... Ich bin ... Jahre alt. Ich wohne in ..."
          disabled={isPreparing || isSaving}
        />

        <div style={{ display: "flex", gap: 7, alignItems: "center", flexWrap: "wrap" }}>
          <span style={{ ...styles.helperText, margin: 0 }}>German keys:</span>
          {GERMAN_KEYS.map((character) => (
            <button
              key={character}
              type="button"
              style={{ ...styles.secondaryButton, padding: "5px 9px" }}
              onClick={() => setDraft((current) => `${current}${character}`)}
            >
              {character}
            </button>
          ))}
        </div>

        {error ? (
          <div style={{ border: "1px solid #fca5a5", borderRadius: 10, padding: 10, background: "#fef2f2", color: "#b91c1c" }}>
            {error}
          </div>
        ) : null}

        {notice ? (
          <div style={{ border: "1px solid #86efac", borderRadius: 10, padding: 10, background: "#f0fdf4", color: "#166534" }}>
            {notice}
          </div>
        ) : null}

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, flexWrap: "wrap" }}>
          <button
            type="button"
            style={styles.secondaryButton}
            onClick={handleCorrect}
            disabled={!draft.trim() || isCorrecting || isSaving}
          >
            {isCorrecting ? "AI is correcting..." : "Correct with AI"}
          </button>
          <button
            type="button"
            style={styles.primaryButton}
            onClick={handlePost}
            disabled={!draft.trim() || isPreparing || isSaving || !isThreadReady}
          >
            {isSaving ? "Saving..." : myResponse ? "Update my response" : "Post response"}
          </button>
        </div>

        <p style={{ ...styles.helperText, margin: 0 }}>
          This saves directly to your class discussion. It does not submit an assignment.
        </p>
      </div>
    </section>
  );
};

export default LessonDiscussionPanel;
