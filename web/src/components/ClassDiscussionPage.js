import React, { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { courseSchedules } from "../data/courseSchedule";
import { styles } from "../styles";
import {
  addDoc,
  collection,
  db,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  Timestamp,
  setDoc,
  deleteField,
} from "../firebase";
import { correctDiscussionText } from "../services/discussionService";

const postsCollectionRef = (level, className) =>
  collection(db, "class_board", level, "classes", className, "posts");
const presenceCollectionRef = (level, className) =>
  collection(db, "class_board", level, "classes", className, "presence");

const formatTimeRemaining = (expiresAt, now) => {
  if (!expiresAt) return "No timer";
  const diff = Math.max(0, expiresAt - now);
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000)
    .toString()
    .padStart(2, "0");
  return diff > 0 ? `${minutes}:${seconds}` : "Expired";
};

const ClassDiscussionPage = () => {
  const { user, studentProfile, idToken } = useAuth();
  const [threads, setThreads] = useState([]);
  const [repliesByThread, setRepliesByThread] = useState({});
  const [typingByThread, setTypingByThread] = useState({});
  const [now, setNow] = useState(Date.now());
  const [replyDrafts, setReplyDrafts] = useState({});
  const [isCorrectingDraft, setIsCorrectingDraft] = useState({});
  const [editingReply, setEditingReply] = useState(null);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingThread, setIsSavingThread] = useState(false);
  const [form, setForm] = useState({
    lessonId: "",
    topic: "",
    question: "",
    instructions: "",
    extraLink: "",
    timerMinutes: 15,
  });
  const typingTimeouts = useRef({});

  const lessonOptions = useMemo(() => {
    const options = [];
    Object.entries(courseSchedules).forEach(([level, sessions]) => {
      sessions.forEach((session) => {
        const label = `${level} · Tag ${session.day}: ${session.topic}`;
        options.push({
          id: `${level}-${session.day}-${session.chapter || session.topic}`,
          label,
          level,
          topic: session.topic,
          goal: session.goal,
          chapter: session.chapter,
        });
      });
    });
    return options;
  }, []);

  useEffect(() => {
    if (!db) {
      setError("Firebase is not configured. Please set up Firestore to share discussions.");
      setIsLoading(false);
      return;
    }

    if (!studentProfile?.level || !studentProfile?.className) {
      setError("Missing course details in your profile. Please set your class and level.");
      setIsLoading(false);
      return undefined;
    }

    const threadsQuery = query(
      postsCollectionRef(studentProfile.level, studentProfile.className),
      orderBy("createdAt", "desc")
    );
    const unsubscribe = onSnapshot(
      threadsQuery,
      (snapshot) => {
        const nextThreads = snapshot.docs.map((docSnapshot) => {
          const data = docSnapshot.data();
          return {
            id: docSnapshot.id,
            lessonId: data.lessonId || "",
            lessonLabel: data.lessonLabel || "",
            topic: data.topic || "",
            question: data.question || "",
            questionTitle: data.questionTitle || data.topic || "",
            instructions: data.instructions || "",
            extraLink: data.extraLink || "",
            timerMinutes: data.timerMinutes || 0,
            createdAt: data.createdAt?.toMillis ? data.createdAt.toMillis() : data.createdAt || Date.now(),
            createdBy: data.createdBy || "Tutor",
            createdByUid: data.createdByUid || null,
            expiresAt: data.expiresAt?.toMillis ? data.expiresAt.toMillis() : data.expiresAt || null,
          };
        });
        setError("");
        setThreads(nextThreads);
        setIsLoading(false);
      },
      (err) => {
        console.error("Failed to subscribe to discussion threads", err);
        setError("Discussions could not be loaded. Please try again later.");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [db, studentProfile?.level, studentProfile?.className]);

  useEffect(() => {
    if (!db) return undefined;

    const repliesQuery = collection(db, "qa_posts");
    const unsubscribe = onSnapshot(
      repliesQuery,
      (snapshot) => {
        const grouped = {};
        snapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          const responses = Array.isArray(data?.responses) ? data.responses : [];
          const replies = responses
            .map((response, index) => ({
              id: response.id || `${docSnapshot.id}-${index}`,
              author: response.responder || response.author || "Student",
              responderCode: response.responderCode || response.studentCode || null,
              text: response.text || "",
              createdAt: response.createdAt?.toMillis
                ? response.createdAt.toMillis()
                : response.createdAt || Date.now(),
              editedAt: response.editedAt?.toMillis ? response.editedAt.toMillis() : response.editedAt || null,
            }))
            .sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
          grouped[docSnapshot.id] = replies;
        });
        setError("");
        setRepliesByThread(grouped);
      },
      (err) => {
        console.error("Failed to subscribe to replies", err);
        setError("Responses could not be loaded. Please try again later.");
      }
    );

    return () => unsubscribe();
  }, [db]);

  useEffect(() => {
    if (!db || !studentProfile?.level || !studentProfile?.className) return undefined;

    const presenceRef = presenceCollectionRef(studentProfile.level, studentProfile.className);
    const unsubscribe = onSnapshot(
      presenceRef,
      (snapshot) => {
        const nowTs = Date.now();
        const grouped = {};

        snapshot.forEach((docSnapshot) => {
          const data = docSnapshot.data();
          const typingFor = data.typingFor;
          const typedAt = data.typingAt?.toMillis ? data.typingAt.toMillis() : data.typingAt || 0;
          if (!typingFor || !typedAt || nowTs - typedAt > 15000) return;

          const name = data.displayName || data.responder || data.author || "Student";
          const existing = new Set(grouped[typingFor] || []);
          existing.add(name);
          grouped[typingFor] = Array.from(existing);
        });

        setTypingByThread(grouped);
      },
      (err) => {
        console.error("Failed to subscribe to typing indicators", err);
      }
    );

    return () => unsubscribe();
  }, [db, studentProfile?.level, studentProfile?.className]);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => () => {
    Object.values(typingTimeouts.current).forEach((timeoutId) => clearTimeout(timeoutId));
  }, []);

  const selectedLesson = lessonOptions.find((option) => option.id === form.lessonId) || lessonOptions[0];

  useEffect(() => {
    if (!form.lessonId && lessonOptions.length > 0) {
      setForm((prev) => ({ ...prev, lessonId: lessonOptions[0].id, topic: lessonOptions[0].topic }));
    }
  }, [form.lessonId, lessonOptions]);

  const getDisplayName = () =>
    studentProfile?.name || user?.displayName || user?.email || "Student";

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateThread = async (event) => {
    event.preventDefault();
    if (!form.question.trim() || !db) return;
    if (!studentProfile?.level || !studentProfile?.className) {
      setError("Please add your course level and class name in your account settings.");
      return;
    }

    const lesson = lessonOptions.find((option) => option.id === form.lessonId) || selectedLesson;
    const timerMinutes = Number(form.timerMinutes) || 0;
    const expiresAtMillis = timerMinutes ? Date.now() + timerMinutes * 60000 : null;

    setIsSavingThread(true);
    setError("");

    try {
      await addDoc(postsCollectionRef(studentProfile.level, studentProfile.className), {
        level: studentProfile.level,
        className: studentProfile.className,
        lessonId: lesson?.id,
        lessonLabel: lesson?.label,
        topic: form.topic || lesson?.topic,
        questionTitle: form.topic || lesson?.topic,
        instructions: form.instructions || "",
        question: form.question,
        extraLink: form.extraLink,
        timerMinutes,
        createdAt: serverTimestamp(),
        createdBy: getDisplayName() || "Tutor",
        createdByUid: user?.uid || null,
        expiresAt: expiresAtMillis ? Timestamp.fromMillis(expiresAtMillis) : null,
      });
      setForm({
        lessonId: lesson?.id || "",
        topic: lesson?.topic || "",
        question: "",
        instructions: "",
        extraLink: "",
        timerMinutes,
      });
    } catch (err) {
      console.error("Failed to create discussion thread", err);
      setError("Thread could not be created. Please try again.");
    } finally {
      setIsSavingThread(false);
    }
  };

  const getResponderCode = () =>
    studentProfile?.studentcode || studentProfile?.id || studentProfile?.className || user?.uid || "unknown";

  const getPresenceDocRef = () => {
    if (!db || !studentProfile?.level || !studentProfile?.className) return null;
    return doc(
      presenceCollectionRef(studentProfile.level, studentProfile.className),
      user?.uid || studentProfile?.id || studentProfile?.studentcode || "anonymous"
    );
  };

  const stopTypingIndicator = async (threadId) => {
    const presenceDocRef = getPresenceDocRef();
    if (!presenceDocRef) return;

    if (typingTimeouts.current[threadId]) {
      clearTimeout(typingTimeouts.current[threadId]);
      delete typingTimeouts.current[threadId];
    }

    try {
      await setDoc(
        presenceDocRef,
        { typingFor: deleteField(), typingAt: serverTimestamp() },
        { merge: true }
      );
    } catch (err) {
      console.error("Failed to clear typing indicator", err);
    }
  };

  const markTypingForThread = async (threadId) => {
    const presenceDocRef = getPresenceDocRef();
    if (!presenceDocRef) return;

    if (typingTimeouts.current[threadId]) {
      clearTimeout(typingTimeouts.current[threadId]);
    }

    try {
      await setDoc(
        presenceDocRef,
        {
          displayName: studentProfile?.name || user?.email || "Student",
          typingFor: threadId,
          typingAt: serverTimestamp(),
        },
        { merge: true }
      );

      typingTimeouts.current[threadId] = setTimeout(() => {
        stopTypingIndicator(threadId);
      }, 8000);
    } catch (err) {
      console.error("Failed to write typing indicator", err);
    }
  };

  const handleReply = async (threadId) => {
    const draft = replyDrafts[threadId] || "";
    if (!draft.trim() || !db) return;

    setError("");

    try {
      const qaDocRef = doc(db, "qa_posts", threadId);
      const existingSnap = await getDoc(qaDocRef);
      const responses = Array.isArray(existingSnap.data()?.responses) ? existingSnap.data().responses : [];

      const replyId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`;
        const payload = {
          id: replyId,
          responder: getDisplayName(),
          responderCode: getResponderCode(),
          text: draft,
          createdAt: serverTimestamp(),
        };

      await setDoc(
        qaDocRef,
        {
          responses: [...responses, payload],
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
      setReplyDrafts((prev) => ({ ...prev, [threadId]: "" }));
      stopTypingIndicator(threadId);
    } catch (err) {
      console.error("Failed to post reply", err);
      setError("Response could not be saved. Please try again.");
    }
  };

  const handleDeleteReply = async (threadId, reply) => {
    if (!db) return;

    try {
      const qaDocRef = doc(db, "qa_posts", threadId);
      const existingSnap = await getDoc(qaDocRef);
      const responses = Array.isArray(existingSnap.data()?.responses) ? existingSnap.data().responses : [];
      const nextResponses = responses.filter((response) => response.id !== reply.id);

      await setDoc(
        qaDocRef,
        { responses: nextResponses, updatedAt: serverTimestamp() },
        { merge: true }
      );
      if (editingReply?.replyId === reply.id) {
        setEditingReply(null);
      }
    } catch (err) {
      console.error("Failed to delete reply", err);
      setError("Response could not be deleted.");
    }
  };

  const handleStartEdit = (threadId, reply) => {
    setEditingReply({ threadId, replyId: reply.id, text: reply.text, author: reply.author });
  };

  const handleSaveEdit = async () => {
    if (!editingReply || !editingReply.text.trim() || !db) return;

    try {
      const qaDocRef = doc(db, "qa_posts", editingReply.threadId);
      const existingSnap = await getDoc(qaDocRef);
      const responses = Array.isArray(existingSnap.data()?.responses) ? existingSnap.data().responses : [];
      const updatedResponses = responses.map((response) =>
        response.id === editingReply.replyId
          ? { ...response, text: editingReply.text, editedAt: serverTimestamp() }
          : response
      );

      await setDoc(
        qaDocRef,
        { responses: updatedResponses, updatedAt: serverTimestamp() },
        { merge: true }
      );
      setEditingReply(null);
    } catch (err) {
      console.error("Failed to edit reply", err);
      setError("Response could not be edited.");
    }
  };

  const handleCorrectDraft = async (threadId) => {
    const draft = replyDrafts[threadId] || "";
    if (!draft.trim()) {
      setError("Enter text first — the AI needs content to correct.");
      return;
    }

    setIsCorrectingDraft((prev) => ({ ...prev, [threadId]: true }));
    setError("");

    try {
      const { corrected } = await correctDiscussionText({
        text: draft,
        level: studentProfile?.level,
        idToken,
      });

      if (corrected) {
        setReplyDrafts((prev) => ({ ...prev, [threadId]: corrected }));
      }
    } catch (err) {
      console.error("Failed to correct draft", err);
      setError("The AI correction failed. Please try again later.");
    } finally {
      setIsCorrectingDraft((prev) => ({ ...prev, [threadId]: false }));
    }
  };

  const threadsWithReplies = useMemo(
    () => threads.map((thread) => ({ ...thread, replies: repliesByThread[thread.id] || [] })),
    [threads, repliesByThread]
  );

  const renderThread = (thread) => {
    return (
      <div key={thread.id} style={{ ...styles.card, display: "grid", gap: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "space-between", flexWrap: "wrap" }}>
          <div style={{ display: "grid", gap: 4 }}>
            <div style={{ fontWeight: 800, fontSize: 16 }}>{thread.questionTitle || thread.topic}</div>
            <div style={{ fontSize: 13, color: "#4b5563" }}>{thread.lessonLabel}</div>
            {thread.extraLink ? (
              <a href={thread.extraLink} target="_blank" rel="noreferrer" style={{ fontSize: 13 }}>
                Open external link
              </a>
            ) : null}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap", justifyContent: "flex-end" }}>
            <span style={styles.badge}>Question by {thread.createdBy}</span>
            <span style={{ ...styles.badge, background: "#eef2ff", borderColor: "#c7d2fe", color: "#3730a3" }}>
              Timer {formatTimeRemaining(thread.expiresAt, now)}
            </span>
          </div>
        </div>

        <div style={{ display: "grid", gap: 6 }}>
          <div style={{ ...styles.helperText, margin: 0, fontSize: 14 }}>
            <strong>Question:</strong> {thread.question}
          </div>
          {thread.instructions ? (
            <div
              style={{
                ...styles.helperText,
                margin: 0,
                background: "#f8fafc",
                padding: 10,
                borderRadius: 10,
              }}
            >
              <strong>Instructions (English):</strong> {thread.instructions} — Refer to chapter "Tutorial" in the course book.
            </div>
          ) : null}
        </div>

      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>Responses ({thread.replies.length})</div>
        <div style={{ display: "grid", gap: 10 }}>
          {thread.replies.map((reply) => (
            <div key={reply.id} style={{ ...styles.card, marginBottom: 0, background: "#f9fafb" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{reply.author || "Student"}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  <button
                    style={{ ...styles.secondaryButton, padding: "6px 10px" }}
                    onClick={() => handleStartEdit(thread.id, reply)}
                  >
                    Edit
                  </button>
                  <button
                    style={{ ...styles.dangerButton, padding: "6px 10px" }}
                    onClick={() => handleDeleteReply(thread.id, reply)}
                  >
                    Delete
                  </button>
                </div>
              </div>
              {editingReply && editingReply.replyId === reply.id ? (
                <>
                  <textarea
                    style={{ ...styles.textareaSmall, marginTop: 8 }}
                    value={editingReply.text}
                    onChange={(e) => setEditingReply((prev) => ({ ...prev, text: e.target.value }))}
                  />
                  <div style={{ display: "flex", gap: 8, marginTop: 8, justifyContent: "flex-end" }}>
                    <button style={{ ...styles.secondaryButton, padding: "6px 10px" }} onClick={() => setEditingReply(null)}>
                      Cancel
                    </button>
                    <button style={{ ...styles.primaryButton, padding: "6px 10px" }} onClick={handleSaveEdit}>
                      Save
                    </button>
                  </div>
                </>
              ) : (
                <p style={{ ...styles.helperText, margin: "6px 0 0", color: "#111827" }}>
                  {reply.text}
                  {reply.editedAt ? " · edited" : ""}
                </p>
              )}
            </div>
          ))}
          {thread.replies.length === 0 && (
            <div style={{ ...styles.helperText, margin: 0 }}>No responses yet — start the discussion!</div>
          )}
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          <textarea
            style={styles.textareaSmall}
            placeholder="Share your opinion or give feedback ..."
            value={replyDrafts[thread.id] || ""}
            onChange={(e) => {
              setReplyDrafts((prev) => ({ ...prev, [thread.id]: e.target.value }));
              markTypingForThread(thread.id);
            }}
            onBlur={() => stopTypingIndicator(thread.id)}
          />
          {typingByThread[thread.id]?.length ? (
            <div style={{ ...styles.helperText, margin: 0, color: "#0ea5e9" }}>
              {typingByThread[thread.id].join(", ")} is typing ...
            </div>
          ) : null}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, flexWrap: "wrap" }}>
            <button
              style={{ ...styles.secondaryButton, padding: "10px 12px" }}
              type="button"
              onClick={() => handleCorrectDraft(thread.id)}
              disabled={isCorrectingDraft[thread.id]}
            >
              {isCorrectingDraft[thread.id] ? "AI is correcting ..." : "Correct with AI"}
            </button>
            <button style={styles.primaryButton} onClick={() => handleReply(thread.id)}>
              Post response
            </button>
          </div>
          <p style={{ ...styles.helperText, margin: 0 }}>
            "Correct with AI" improves only what you type. Without text, the AI cannot help.
          </p>
        </div>
      </div>
    </div>
  );

  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={styles.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <div>
            <h2 style={styles.sectionTitle}>Class discussion</h2>
            <p style={{ ...styles.helperText, marginBottom: 0 }}>
              Tutors create a timed question with a topic and link. Students see new posts instantly and can edit or delete their own
              responses.
            </p>
            <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 6 }}>
              <span style={styles.badge}>Level: {studentProfile?.level || "(missing)"}</span>
              <span style={styles.badge}>Class: {studentProfile?.className || "(missing)"}</span>
              <span style={{ ...styles.badge, background: "#f8fafc", borderColor: "#cbd5e1", color: "#0f172a" }}>
                Only members of your class can view and post here.
              </span>
            </div>
          </div>
          <span style={{ ...styles.badge, background: "#ecfeff", borderColor: "#a5f3fc", color: "#0ea5e9" }}>
            Live updates
          </span>
        </div>

        <form onSubmit={handleCreateThread} style={{ display: "grid", gap: 10, marginTop: 12 }}>
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            <div style={styles.field}>
              <label style={styles.label}>Select lesson</label>
              <select
                value={form.lessonId}
                onChange={(e) => handleFormChange("lessonId", e.target.value)}
                style={styles.select}
              >
                {lessonOptions.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              {selectedLesson?.goal ? (
                <div style={{ ...styles.helperText, margin: 0 }}>Goal: {selectedLesson.goal}</div>
              ) : null}
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Topic / headline</label>
              <input
                type="text"
                style={styles.select}
                value={form.topic}
                onChange={(e) => handleFormChange("topic", e.target.value)}
                placeholder="e.g. Phrases for complaints"
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Timer (minutes)</label>
              <input
                type="number"
                min="0"
                step="5"
                style={styles.select}
                value={form.timerMinutes}
                onChange={(e) => handleFormChange("timerMinutes", e.target.value)}
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Additional link (optional)</label>
              <input
                type="url"
                style={styles.select}
                value={form.extraLink}
                onChange={(e) => handleFormChange("extraLink", e.target.value)}
                placeholder="https://..."
              />
            </div>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Instructions for everyone (English)</label>
            <textarea
              style={styles.textArea}
              value={form.instructions}
              onChange={(e) => handleFormChange("instructions", e.target.value)}
              placeholder="Share house rules, materials, or answer format in English so everyone can follow along. Refer to chapter 'Tutorial' in the course book."
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>Guiding question for the class</label>
            <textarea
              style={styles.textArea}
              value={form.question}
              onChange={(e) => handleFormChange("question", e.target.value)}
              placeholder="Which question should learners answer?"
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button style={styles.primaryButton} type="submit" disabled={isSavingThread}>
              Post discussion
            </button>
          </div>
        </form>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {error ? (
          <div style={{ ...styles.card, borderColor: "#fca5a5", background: "#fef2f2" }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Error</div>
            <p style={{ ...styles.helperText, margin: 0 }}>{error}</p>
          </div>
        ) : isLoading ? (
          <div style={styles.card}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Loading discussions ...</div>
            <p style={{ ...styles.helperText, margin: 0 }}>Fetching the latest posts.</p>
          </div>
        ) : threadsWithReplies.length === 0 ? (
          <div style={styles.card}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>No discussions started</div>
            <p style={{ ...styles.helperText, margin: 0 }}>Create the first question, pick the right lesson, and set a timer for your students.</p>
          </div>
        ) : (
          threadsWithReplies.map((thread) => renderThread(thread))
        )}
      </div>
    </div>
  );
};

export default ClassDiscussionPage;
