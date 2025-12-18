import React, { useEffect, useMemo, useState } from "react";
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
} from "../firebase";
import { correctDiscussionText } from "../services/discussionService";

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
  const { user, studentProfile, idToken } = useAuth();
  const [threads, setThreads] = useState([]);
  const [repliesByThread, setRepliesByThread] = useState({});
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
    if (!db) {
      setError("Firebase ist nicht konfiguriert. Bitte richte Firestore ein, um Diskussionen zu teilen.");
      setIsLoading(false);
      return;
    }

    if (!studentProfile?.level || !studentProfile?.className) {
      setError("Es fehlen Kursangaben aus deinem Profil. Bitte Klasse und Niveau hinterlegen.");
      setIsLoading(false);
      return undefined;
    }

    const threadsQuery = query(
      collection(db, "class_board", studentProfile.level, "classes", studentProfile.className, "posts"),
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
        setError("Diskussionen konnten nicht geladen werden. Versuche es später erneut.");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [studentProfile?.level, studentProfile?.className]);

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
        setError("Antworten konnten nicht geladen werden. Versuche es später erneut.");
      }
    );

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const selectedLesson = lessonOptions.find((option) => option.id === form.lessonId) || lessonOptions[0];

  useEffect(() => {
    if (!form.lessonId && lessonOptions.length > 0) {
      setForm((prev) => ({ ...prev, lessonId: lessonOptions[0].id, topic: lessonOptions[0].topic }));
    }
  }, [lessonOptions]);

  const handleFormChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCreateThread = async (event) => {
    event.preventDefault();
    if (!form.question.trim() || !db) return;
    if (!studentProfile?.level || !studentProfile?.className) {
      setError("Bitte trage dein Kurs-Level und den Klassennamen in den Account-Einstellungen nach.");
      return;
    }

    const lesson = lessonOptions.find((option) => option.id === form.lessonId) || selectedLesson;
    const timerMinutes = Number(form.timerMinutes) || 0;
    const expiresAtMillis = timerMinutes ? Date.now() + timerMinutes * 60000 : null;

    setIsSavingThread(true);
    setError("");

    try {
      await addDoc(
        collection(db, "class_board", studentProfile.level, "classes", studentProfile.className, "posts"),
        {
          level: studentProfile.level,
          className: studentProfile.className,
          lessonId: lesson?.id,
          lessonLabel: lesson?.label,
          topic: form.topic || lesson?.topic,
          question: form.question,
          extraLink: form.extraLink,
          timerMinutes,
          createdAt: serverTimestamp(),
          createdBy: user?.email || "Tutor",
          createdByUid: user?.uid || null,
          expiresAt: expiresAtMillis ? Timestamp.fromMillis(expiresAtMillis) : null,
        }
      );
      setForm({
        lessonId: lesson?.id || "",
        topic: lesson?.topic || "",
        question: "",
        extraLink: "",
        timerMinutes,
      });
    } catch (err) {
      console.error("Failed to create discussion thread", err);
      setError("Thread konnte nicht erstellt werden. Bitte versuche es erneut.");
    } finally {
      setIsSavingThread(false);
    }
  };

  const getResponderCode = () =>
    studentProfile?.studentcode || studentProfile?.id || studentProfile?.className || user?.uid || "unknown";

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
        responder: user?.email || "Student",
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
    } catch (err) {
      console.error("Failed to post reply", err);
      setError("Antwort konnte nicht gespeichert werden. Bitte versuche es erneut.");
    }
  };

  const handleDeleteReply = async (threadId, reply) => {
    if (!db) return;
    if (reply.author && user?.email && reply.author !== user.email) return;

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
      setError("Antwort konnte nicht gelöscht werden.");
    }
  };

  const handleStartEdit = (threadId, reply) => {
    setEditingReply({ threadId, replyId: reply.id, text: reply.text, author: reply.author });
  };

  const handleSaveEdit = async () => {
    if (!editingReply || !editingReply.text.trim() || !db) return;
    if (editingReply.author && user?.email && editingReply.author !== user.email) return;

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
      setError("Antwort konnte nicht bearbeitet werden.");
    }
  };

  const isReplyOwner = (reply) => {
    if (reply.author && user?.email && reply.author === user.email) return true;
    if (reply.responderCode && studentProfile?.studentcode && reply.responderCode === studentProfile.studentcode)
      return true;
    return false;
  };

  const handleCorrectDraft = async (threadId) => {
    const draft = replyDrafts[threadId] || "";
    if (!draft.trim()) {
      setError("Gib zuerst etwas ein – ohne Text kann die KI nichts korrigieren.");
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
      setError("Die KI-Korrektur ist fehlgeschlagen. Bitte versuche es später erneut.");
    } finally {
      setIsCorrectingDraft((prev) => ({ ...prev, [threadId]: false }));
    }
  };

  const threadsWithReplies = useMemo(
    () => threads.map((thread) => ({ ...thread, replies: repliesByThread[thread.id] || [] })),
    [threads, repliesByThread]
  );

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
                        onClick={() => handleDeleteReply(thread.id, reply)}
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
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, flexWrap: "wrap" }}>
            <button
              style={{ ...styles.secondaryButton, padding: "10px 12px" }}
              type="button"
              onClick={() => handleCorrectDraft(thread.id)}
              disabled={isCorrectingDraft[thread.id]}
            >
              {isCorrectingDraft[thread.id] ? "KI korrigiert ..." : "Mit KI korrigieren"}
            </button>
            <button style={styles.primaryButton} onClick={() => handleReply(thread.id)}>
              Antwort posten
            </button>
          </div>
          <p style={{ ...styles.helperText, margin: 0 }}>
            "Mit KI korrigieren" verbessert nur den Text, den du eingibst. Ohne Eingabe kann die KI dir nicht helfen.
          </p>
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

        <div style={{ ...styles.card, background: "#f8fafc", borderColor: "#e2e8f0", marginTop: 12 }}>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>Datenquellen</div>
          <div style={{ display: "grid", gap: 6, color: "#0f172a" }}>
            <p style={{ ...styles.helperText, margin: 0 }}>
              Klassennotizen und Diskussionsbeiträge werden aus <code>class_board/&lt;level&gt;/classes/&lt;class_name&gt;/posts</code>
              geladen <strong>und</strong> direkt dort gespeichert. Level und Klassenname stammen aus der Sitzung der angemeldeten
              Studierenden, und ihre Beiträge erscheinen als einzelne Dokumente in dieser <em>posts</em>-Unterkollektion.
            </p>
            <p style={{ ...styles.helperText, margin: 0 }}>
              Antworten in Q&A-Threads sowie KI-Vorschläge landen in der Sammlung <code>qa_posts</code>. Jedes
              <code>qa_posts/{{post_id}}</code>-Dokument bündelt die Antworten im Feld <code>responses</code> – inklusive Code der
              antwortenden Person und Zeitstempeln.
            </p>
          </div>
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
            <button style={styles.primaryButton} type="submit" disabled={isSavingThread}>
              Diskussion posten
            </button>
          </div>
        </form>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        {error ? (
          <div style={{ ...styles.card, borderColor: "#fca5a5", background: "#fef2f2" }}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Fehler</div>
            <p style={{ ...styles.helperText, margin: 0 }}>{error}</p>
          </div>
        ) : isLoading ? (
          <div style={styles.card}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Lade Diskussionen ...</div>
            <p style={{ ...styles.helperText, margin: 0 }}>Die neuesten Beiträge werden abgerufen.</p>
          </div>
        ) : threadsWithReplies.length === 0 ? (
          <div style={styles.card}>
            <div style={{ fontWeight: 700, marginBottom: 6 }}>Keine Diskussionen gestartet</div>
            <p style={{ ...styles.helperText, margin: 0 }}>
              Erstelle die erste Frage, wähle die passende Lektion und gib deinen Studierenden einen Timer.
            </p>
          </div>
        ) : (
          threadsWithReplies.map((thread) => renderThread(thread))
        )}
      </div>
    </div>
  );
};

export default ClassDiscussionPage;
