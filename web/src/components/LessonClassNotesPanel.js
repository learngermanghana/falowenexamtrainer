import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { addDoc, collection, db, deleteDoc, doc, onSnapshot, orderBy, query, serverTimestamp } from "../firebase";
import { styles } from "../styles";

const normalizeKey = (value = "") =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9äöüß]+/gi, "-")
    .replace(/^-+|-+$/g, "") || "lesson";

const formatDateTime = (value) => {
  if (!value) return "";
  const ms = typeof value === "number" ? value : value?.toMillis ? value.toMillis() : Date.parse(value);
  if (!ms || Number.isNaN(ms)) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Africa/Accra",
  }).format(new Date(ms));
};

const getLessonIdFromLocation = () => {
  if (typeof window === "undefined") return "lesson";
  return normalizeKey(window.location.pathname || "lesson");
};

const getLessonTitleFromDocument = () => {
  if (typeof document === "undefined") return "Current lesson";
  const heading = document.querySelector("h1")?.textContent;
  return heading || document.title || "Current lesson";
};

const notesCollectionRef = (level, className, lessonId) =>
  collection(db, "class_lesson_notes", level, "classes", className, "lessons", lessonId, "notes");

const LessonClassNotesPanel = ({ lessonId, lessonTitle, compact = false }) => {
  const { user, studentProfile } = useAuth();
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [draft, setDraft] = useState({ title: "", body: "", type: "question" });

  const level = String(studentProfile?.level || "").toUpperCase();
  const className = String(studentProfile?.className || studentProfile?.class || "").trim();
  const resolvedLessonId = normalizeKey(lessonId || getLessonIdFromLocation());
  const resolvedLessonTitle = lessonTitle || getLessonTitleFromDocument();

  const isTutor = useMemo(() => {
    const role = String(studentProfile?.role || "").toLowerCase();
    const email = String(user?.email || studentProfile?.email || "").toLowerCase().trim();
    const name = String(studentProfile?.name || user?.displayName || "").toLowerCase().trim();
    return role === "tutor" || role === "admin" || studentProfile?.isTutor === true || email === "moxflex@gmail.com" || name === "felix asadu";
  }, [studentProfile, user]);

  useEffect(() => {
    if (!db) {
      setError("Class notes need Firebase to be configured.");
      setIsLoading(false);
      return undefined;
    }

    if (!level || !className) {
      setError("Missing level or class name in your account profile.");
      setIsLoading(false);
      return undefined;
    }

    setIsLoading(true);
    setError("");

    const notesQuery = query(notesCollectionRef(level, className, resolvedLessonId), orderBy("createdAtMs", "desc"));
    const unsubscribe = onSnapshot(
      notesQuery,
      (snapshot) => {
        setNotes(snapshot.docs.map((entry) => ({ id: entry.id, ...entry.data() })));
        setIsLoading(false);
      },
      (err) => {
        console.error("Failed to load class lesson notes", err);
        setError("Class notes could not be loaded. Please try again later.");
        setIsLoading(false);
      }
    );

    return () => unsubscribe();
  }, [className, level, resolvedLessonId]);

  const displayName = studentProfile?.name || user?.displayName || user?.email || "Student";
  const filteredNotes = notes.filter((note) => activeFilter === "all" || note.type === activeFilter);

  const handleSave = async (event) => {
    event.preventDefault();
    if (!draft.title.trim() && !draft.body.trim()) return;
    if (!db || !level || !className) return;

    const now = Date.now();
    setIsSaving(true);
    setError("");

    try {
      await addDoc(notesCollectionRef(level, className, resolvedLessonId), {
        level,
        className,
        lessonId: resolvedLessonId,
        lessonTitle: resolvedLessonTitle,
        type: isTutor ? draft.type : "question",
        title: draft.title.trim() || (isTutor && draft.type === "note" ? "Class note" : "Student question"),
        body: draft.body.trim(),
        createdAt: serverTimestamp(),
        createdAtMs: now,
        createdBy: displayName,
        createdByUid: user?.uid || null,
      });
      setDraft({ title: "", body: "", type: isTutor ? draft.type : "question" });
    } catch (err) {
      console.error("Failed to save class note", err);
      setError("Class note could not be saved. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const canDelete = (note) => isTutor || (user?.uid && note.createdByUid === user.uid);

  const handleDelete = async (note) => {
    if (!note?.id || !db || !canDelete(note)) return;
    const confirmed = window.confirm("Delete this class note?");
    if (!confirmed) return;

    try {
      await deleteDoc(doc(notesCollectionRef(level, className, resolvedLessonId), note.id));
    } catch (err) {
      console.error("Failed to delete class note", err);
      setError("Class note could not be deleted. Please try again.");
    }
  };

  return (
    <section
      aria-label="Class notes"
      style={{
        ...styles.card,
        margin: 0,
        display: "grid",
        gap: compact ? 12 : 16,
        border: "1px solid #c7d2fe",
        background: "linear-gradient(180deg, #ffffff 0%, #f8fbff 100%)",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "flex-start" }}>
        <div>
          <p style={{ ...styles.helperText, margin: 0, color: "#4f46e5", fontWeight: 700 }}>Class board</p>
          <h2 style={{ margin: "4px 0", fontSize: compact ? "1.05rem" : "1.25rem" }}>Class Notes</h2>
          <p style={{ ...styles.helperText, margin: 0 }}>
            Saved notes for this lesson and this class only. Use it for Zoom vocabulary, corrections, reminders and follow-up questions.
          </p>
        </div>
        <span style={{ ...styles.badge, background: "#eef2ff", color: "#3730a3" }}>{level || "Level"} · {className || "Class"}</span>
      </div>

      <form onSubmit={handleSave} style={{ display: "grid", gap: 10 }}>
        {isTutor ? (
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button type="button" style={draft.type === "note" ? styles.primaryButton : styles.secondaryButton} onClick={() => setDraft((prev) => ({ ...prev, type: "note" }))}>
              Tutor note
            </button>
            <button type="button" style={draft.type === "question" ? styles.primaryButton : styles.secondaryButton} onClick={() => setDraft((prev) => ({ ...prev, type: "question" }))}>
              Question / answer
            </button>
          </div>
        ) : null}

        <input
          style={styles.input}
          value={draft.title}
          placeholder={isTutor && draft.type === "note" ? "Title e.g. Vocabulary from today" : "Question title e.g. Beruf vs Arbeit"}
          onChange={(event) => setDraft((prev) => ({ ...prev, title: event.target.value }))}
        />
        <textarea
          style={styles.textareaSmall}
          rows={compact ? 4 : 6}
          value={draft.body}
          placeholder={isTutor ? "Paste Zoom notes, vocabulary, corrections, homework reminders or class explanation here." : "Ask your question about today’s lesson. Your class and tutor can see it."}
          onChange={(event) => setDraft((prev) => ({ ...prev, body: event.target.value }))}
        />
        <button type="submit" style={styles.primaryButton} disabled={isSaving || (!draft.title.trim() && !draft.body.trim())}>
          {isSaving ? "Saving..." : isTutor ? "Save to class notes" : "Ask question"}
        </button>
      </form>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {["all", "note", "question"].map((filter) => (
          <button
            key={filter}
            type="button"
            style={activeFilter === filter ? styles.primaryButton : styles.secondaryButton}
            onClick={() => setActiveFilter(filter)}
          >
            {filter === "all" ? "All" : filter === "note" ? "Tutor notes" : "Questions"}
          </button>
        ))}
      </div>

      {error ? <div style={styles.errorBox}>{error}</div> : null}
      {isLoading ? <p style={styles.helperText}>Loading class notes...</p> : null}

      {!isLoading && filteredNotes.length === 0 ? (
        <div style={{ border: "1px dashed #c7d2fe", borderRadius: 12, padding: 14, background: "#f8fafc", color: "#475569" }}>
          No class notes yet. After class, the tutor can paste Zoom vocabulary and corrections here.
        </div>
      ) : null}

      <div style={{ display: "grid", gap: 10 }}>
        {filteredNotes.map((note) => (
          <article key={note.id} style={{ border: "1px solid #e5e7eb", borderRadius: 14, padding: 14, background: "#fff", display: "grid", gap: 8 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
              <div style={{ display: "grid", gap: 4 }}>
                <span style={{ ...styles.badge, justifySelf: "start", background: note.type === "note" ? "#dcfce7" : "#fef3c7", color: note.type === "note" ? "#166534" : "#92400e" }}>
                  {note.type === "note" ? "Tutor note" : "Question"}
                </span>
                <strong>{note.title}</strong>
                <span style={styles.helperText}>By {note.createdBy || "Student"} · {formatDateTime(note.createdAtMs || note.createdAt)}</span>
              </div>
              {canDelete(note) ? (
                <button type="button" style={styles.dangerButton} onClick={() => handleDelete(note)}>
                  Delete
                </button>
              ) : null}
            </div>
            {note.body ? <p style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.7 }}>{note.body}</p> : null}
          </article>
        ))}
      </div>
    </section>
  );
};

export default LessonClassNotesPanel;
