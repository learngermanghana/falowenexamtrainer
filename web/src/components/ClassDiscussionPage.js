import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { courseSchedules } from "../data/courseSchedule";
import { styles } from "../styles";

const STORAGE_KEY = "class-discussion-threads";
const isBrowser = typeof window !== "undefined";

const createId = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : Math.random().toString(36).slice(2);

const loadThreads = () => {
  if (!isBrowser) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.warn("Failed to load discussion threads", error);
    return [];
  }
};

const persistThreads = (threads) => {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(threads));
  } catch (error) {
    console.warn("Failed to persist discussion threads", error);
  }
};

const formatTimeRemaining = (expiresAt, now) => {
  if (!expiresAt) return "Kein Timer";
  const diff = Math.max(0, expiresAt - now);
  const minutes = Math.floor(diff / 60000);
  const seconds = Math.floor((diff % 60000) / 1000)
    .toString()
    .padStart(2, "0");
  return diff > 0 ? `${minutes}:${seconds}` : "Abgelaufen";
};

const ClassDiscussionPage = () => {
  const { user } = useAuth();
  const [threads, setThreads] = useState([]);
  const [now, setNow] = useState(Date.now());
  const [replyDrafts, setReplyDrafts] = useState({});
  const [editingReply, setEditingReply] = useState(null);
  const [form, setForm] = useState({
    lessonId: "",
    topic: "",
    question: "",
    extraLink: "",
    timerMinutes: 15,
  });

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
    setThreads(loadThreads());
  }, []);

  useEffect(() => {
    const handleStorage = (event) => {
      if (event.key === STORAGE_KEY) {
        setThreads(loadThreads());
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const updateThreads = (updater) => {
    setThreads((prev) => {
      const next = typeof updater === "function" ? updater(prev) : updater;
      persistThreads(next);
      return next;
    });
  };

  const selectedLesson = lessonOptions.find((option) => option.id === form.lessonId) || lessonOptions[0];

  useEffect(() => {
    if (!form.lessonId && lessonOptions.length > 0) {
      setForm((prev) => ({ ...prev, lessonId: lessonOptions[0].id, topic: lessonOptions[0].topic }));
    }
  }, [lessonOptions]);

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateThread = (event) => {
    event.preventDefault();
    if (!form.question.trim()) return;

    const lesson = lessonOptions.find((option) => option.id === form.lessonId) || selectedLesson;
    const newThread = {
      id: createId(),
      lessonId: lesson?.id,
      lessonLabel: lesson?.label,
      topic: form.topic || lesson?.topic,
      question: form.question,
      extraLink: form.extraLink,
      timerMinutes: Number(form.timerMinutes) || 0,
      createdAt: Date.now(),
      createdBy: user?.email || "Tutor",
      expiresAt: form.timerMinutes ? Date.now() + Number(form.timerMinutes) * 60000 : null,
      replies: [],
    };

    updateThreads((prev) => [newThread, ...prev]);
    setForm({
      lessonId: lesson?.id || "",
      topic: lesson?.topic || "",
      question: "",
      extraLink: "",
      timerMinutes: form.timerMinutes,
    });
  };

  const handleReply = (threadId) => {
    const draft = replyDrafts[threadId] || "";
    if (!draft.trim()) return;

    const reply = {
      id: createId(),
      author: user?.email || "Student", 
      text: draft,
      createdAt: Date.now(),
    };

    updateThreads((prev) =>
      prev.map((thread) =>
        thread.id === threadId
          ? { ...thread, replies: [...thread.replies, reply] }
          : thread
      )
    );
    setReplyDrafts((prev) => ({ ...prev, [threadId]: "" }));
  };

  const handleDeleteReply = (threadId, replyId) => {
    updateThreads((prev) =>
      prev.map((thread) =>
        thread.id === threadId
          ? { ...thread, replies: thread.replies.filter((reply) => reply.id !== replyId) }
          : thread
      )
    );
    if (editingReply?.replyId === replyId) {
      setEditingReply(null);
    }
  };

  const handleStartEdit = (threadId, reply) => {
    setEditingReply({ threadId, replyId: reply.id, text: reply.text });
  };

  const handleSaveEdit = () => {
    if (!editingReply || !editingReply.text.trim()) return;
    updateThreads((prev) =>
      prev.map((thread) =>
        thread.id === editingReply.threadId
          ? {
              ...thread,
              replies: thread.replies.map((reply) =>
                reply.id === editingReply.replyId ? { ...reply, text: editingReply.text, editedAt: Date.now() } : reply
              ),
            }
          : thread
      )
    );
    setEditingReply(null);
  };

  const isReplyOwner = (reply) => reply.author && user?.email && reply.author === user.email;

  const renderThread = (thread) => (
    <div key={thread.id} style={{ ...styles.card, display: "grid", gap: 10 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, justifyContent: "space-between", flexWrap: "wrap" }}>
        <div style={{ display: "grid", gap: 4 }}>
          <div style={{ fontWeight: 800, fontSize: 16 }}>{thread.topic}</div>
          <div style={{ fontSize: 13, color: "#4b5563" }}>{thread.lessonLabel}</div>
          {thread.extraLink ? (
            <a href={thread.extraLink} target="_blank" rel="noreferrer" style={{ fontSize: 13 }}>
              Externer Link öffnen
            </a>
          ) : null}
        </div>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <span style={styles.badge}>Frage von {thread.createdBy}</span>
          <span style={{ ...styles.badge, background: "#eef2ff", borderColor: "#c7d2fe", color: "#3730a3" }}>
            Timer {formatTimeRemaining(thread.expiresAt, now)}
          </span>
        </div>
      </div>

      <div style={{ ...styles.helperText, margin: 0, fontSize: 14 }}>{thread.question}</div>

      <div style={{ display: "grid", gap: 8 }}>
        <div style={{ fontWeight: 700, fontSize: 14 }}>Antworten ({thread.replies.length})</div>
        <div style={{ display: "grid", gap: 10 }}>
          {thread.replies.map((reply) => (
            <div key={reply.id} style={{ ...styles.card, marginBottom: 0, background: "#f9fafb" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{reply.author || "Student"}</div>
                <div style={{ display: "flex", gap: 8 }}>
                  {isReplyOwner(reply) && (
                    <>
                      <button
                        style={{ ...styles.secondaryButton, padding: "6px 10px" }}
                        onClick={() => handleStartEdit(thread.id, reply)}
                      >
                        Bearbeiten
                      </button>
                      <button
                        style={{ ...styles.dangerButton, padding: "6px 10px" }}
                        onClick={() => handleDeleteReply(thread.id, reply.id)}
                      >
                        Löschen
                      </button>
                    </>
                  )}
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
                      Abbrechen
                    </button>
                    <button style={{ ...styles.primaryButton, padding: "6px 10px" }} onClick={handleSaveEdit}>
                      Speichern
                    </button>
                  </div>
                </>
              ) : (
                <p style={{ ...styles.helperText, margin: "6px 0 0", color: "#111827" }}>
                  {reply.text}
                  {reply.editedAt ? " · bearbeitet" : ""}
                </p>
              )}
            </div>
          ))}
          {thread.replies.length === 0 && (
            <div style={{ ...styles.helperText, margin: 0 }}>Noch keine Antworten – starte die Diskussion!</div>
          )}
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          <textarea
            style={styles.textareaSmall}
            placeholder="Teile deine Meinung oder gib Feedback ..."
            value={replyDrafts[thread.id] || ""}
            onChange={(e) => setReplyDrafts((prev) => ({ ...prev, [thread.id]: e.target.value }))}
          />
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button style={styles.primaryButton} onClick={() => handleReply(thread.id)}>
              Antwort posten
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div style={styles.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <div>
            <h2 style={styles.sectionTitle}>Klassen-Diskussion</h2>
            <p style={{ ...styles.helperText, marginBottom: 0 }}>
              Tutor:innen erstellen eine Frage mit Timer, Thema und Link. Studierende sehen neue Beiträge sofort und können ihre Antworten
              bearbeiten oder löschen.
            </p>
          </div>
          <span style={{ ...styles.badge, background: "#ecfeff", borderColor: "#a5f3fc", color: "#0ea5e9" }}>
            Live aktualisiert
          </span>
        </div>

        <form onSubmit={handleCreateThread} style={{ display: "grid", gap: 10, marginTop: 12 }}>
          <div style={{ display: "grid", gap: 10, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
            <div style={styles.field}>
              <label style={styles.label}>Lektion auswählen</label>
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
                <div style={{ ...styles.helperText, margin: 0 }}>Ziel: {selectedLesson.goal}</div>
              ) : null}
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Thema / Überschrift</label>
              <input
                type="text"
                style={styles.select}
                value={form.topic}
                onChange={(e) => handleFormChange("topic", e.target.value)}
                placeholder="z. B. Redemittel für Beschwerden"
              />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>Timer (Minuten)</label>
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
              <label style={styles.label}>Zusätzlicher Link (optional)</label>
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
            <label style={styles.label}>Leitfrage für die Klasse</label>
            <textarea
              style={styles.textArea}
              value={form.question}
              onChange={(e) => handleFormChange("question", e.target.value)}
              placeholder="Welche Frage sollen die Lernenden beantworten?"
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <button style={styles.primaryButton} type="submit">
              Diskussion posten
            </button>
          </div>
        </form>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {threads.length === 0 ? (
          <div style={styles.card}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Keine Diskussionen gestartet</div>
            <p style={{ ...styles.helperText, margin: 0 }}>
              Erstelle die erste Frage, wähle die passende Lektion und gib deinen Studierenden einen Timer.
            </p>
          </div>
        ) : (
          threads.map((thread) => renderThread(thread))
        )}
      </div>
    </div>
  );
};

export default ClassDiscussionPage;
