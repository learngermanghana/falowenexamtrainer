import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  db,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
} from "../firebase";
import { styles } from "../styles";

const MAX_POST_LENGTH = 4000;

const postsCollectionRef = (level, className, lessonId) =>
  collection(
    db,
    "class_board",
    level,
    "classes",
    className,
    "workbook_shares",
    lessonId,
    "posts"
  );

const toMillis = (value) => {
  if (!value) return 0;
  if (typeof value === "number") return value;
  if (typeof value?.toMillis === "function") return value.toMillis();
  if (typeof value?.seconds === "number") return value.seconds * 1000;
  const parsed = Date.parse(String(value));
  return Number.isNaN(parsed) ? 0 : parsed;
};

const getFirstName = (value) => {
  const clean = String(value || "Student").trim();
  return clean.split(/\s+/)[0] || "Student";
};

const formatRelativeTime = (value, now) => {
  const timestamp = toMillis(value);
  if (!timestamp) return "just now";

  const diffSeconds = Math.round((timestamp - now) / 1000);
  const absoluteSeconds = Math.abs(diffSeconds);
  if (absoluteSeconds < 10) return "just now";

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (absoluteSeconds < 60) return formatter.format(diffSeconds, "second");
  if (absoluteSeconds < 3600) return formatter.format(Math.round(diffSeconds / 60), "minute");
  if (absoluteSeconds < 86400) return formatter.format(Math.round(diffSeconds / 3600), "hour");
  return formatter.format(Math.round(diffSeconds / 86400), "day");
};

const cleanPostText = (value) =>
  String(value || "")
    .replace(/\u0000/g, "")
    .trim()
    .slice(0, MAX_POST_LENGTH);

const ClassWorkbookShareBox = ({
  lessonId,
  prompt = "Write your answer and share it with your class.",
}) => {
  const { user, studentProfile } = useAuth();
  const [posts, setPosts] = useState([]);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [now, setNow] = useState(Date.now());
  const textareaRef = useRef(null);
  const draftTouchedRef = useRef(false);

  const level = String(studentProfile?.level || "").trim();
  const className = String(studentProfile?.className || "").trim();
  const studentId =
    studentProfile?.id || studentProfile?.studentCode || studentProfile?.studentcode || user?.uid || "";
  const studentCode = studentProfile?.studentCode || studentProfile?.studentcode || studentId;
  const displayName =
    studentProfile?.name || studentProfile?.fullName || user?.displayName || user?.email || "Student";
  const firstName = getFirstName(displayName);

  const isStaff = useMemo(() => {
    const role = String(studentProfile?.role || "").toLowerCase();
    const email = String(user?.email || studentProfile?.email || "").toLowerCase();
    return role === "admin" || role === "tutor" || studentProfile?.isTutor === true || email === "moxflex@gmail.com";
  }, [studentProfile?.email, studentProfile?.isTutor, studentProfile?.role, user?.email]);

  const ownPost = useMemo(
    () => posts.find((post) => post.id === user?.uid || post.uid === user?.uid) || null,
    [posts, user?.uid]
  );

  const getPostsRef = useCallback(() => {
    if (!db || !level || !className || !lessonId) return null;
    return postsCollectionRef(level, className, lessonId);
  }, [className, lessonId, level]);

  useEffect(() => {
    const timerId = window.setInterval(() => setNow(Date.now()), 60000);
    return () => window.clearInterval(timerId);
  }, []);

  useEffect(() => {
    const postsRef = getPostsRef();

    if (!db) {
      setError("Class sharing is unavailable because Firebase is not configured.");
      setIsLoading(false);
      return undefined;
    }

    if (!user?.uid || !level || !className) {
      setError("Your class details are missing. Please contact support before sharing this answer.");
      setIsLoading(false);
      return undefined;
    }

    if (!postsRef) {
      setError("This workbook sharing box could not be opened.");
      setIsLoading(false);
      return undefined;
    }

    setIsLoading(true);
    setError("");

    const postsQuery = query(postsRef, orderBy("updatedAtMs", "desc"));
    return onSnapshot(
      postsQuery,
      (snapshot) => {
        const nextPosts = snapshot.docs.map((postSnapshot) => ({
          id: postSnapshot.id,
          ...postSnapshot.data(),
        }));
        setPosts(nextPosts);
        setIsLoading(false);
      },
      (snapshotError) => {
        console.error("Failed to load workbook class posts", snapshotError);
        setError("Your classmates’ posts could not be loaded. Please refresh and try again.");
        setIsLoading(false);
      }
    );
  }, [className, getPostsRef, level, user?.uid]);

  useEffect(() => {
    if (isLoading || draftTouchedRef.current) return;
    setDraft(ownPost?.text || "");
  }, [isLoading, ownPost?.text]);

  const handleSave = async () => {
    const text = cleanPostText(draft);
    const postsRef = getPostsRef();

    if (!text) {
      setMessage("");
      setError("Write your answer before saving it.");
      textareaRef.current?.focus();
      return;
    }

    if (!user?.uid || !postsRef) {
      setMessage("");
      setError("Your class sharing box is not ready. Please refresh the page.");
      return;
    }

    setIsSaving(true);
    setError("");
    setMessage("");

    const timestamp = Date.now();
    const payload = {
      uid: user.uid,
      studentId,
      studentCode,
      authorFirstName: firstName,
      text,
      level,
      className,
      lessonId,
      updatedAt: serverTimestamp(),
      updatedAtMs: timestamp,
    };

    if (!ownPost) {
      payload.createdAt = serverTimestamp();
      payload.createdAtMs = timestamp;
    }

    try {
      await setDoc(doc(postsRef, user.uid), payload, { merge: true });
      setDraft(text);
      draftTouchedRef.current = true;
      setMessage(ownPost ? "Your shared answer has been updated." : "Your answer has been shared with your class.");
    } catch (saveError) {
      console.error("Failed to save workbook class post", saveError);
      setError("Your answer could not be saved. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (post) => {
    setDraft(post.text || "");
    draftTouchedRef.current = true;
    setMessage("Edit your answer above, then select Update Shared Answer.");
    setError("");
    window.setTimeout(() => {
      textareaRef.current?.focus();
      textareaRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 0);
  };

  const handleDelete = async (post) => {
    const postsRef = getPostsRef();
    const isOwn = post.id === user?.uid || post.uid === user?.uid;
    if (!postsRef || (!isOwn && !isStaff)) return;

    setError("");
    setMessage("");

    try {
      await deleteDoc(doc(postsRef, post.id));
      if (isOwn) {
        setDraft("");
        draftTouchedRef.current = false;
        setMessage("Your shared answer has been removed.");
      }
    } catch (deleteError) {
      console.error("Failed to delete workbook class post", deleteError);
      setError("The shared answer could not be removed. Please try again.");
    }
  };

  return (
    <div
      style={{
        border: "1px solid #c7d2fe",
        borderRadius: 14,
        background: "#f8fafc",
        padding: 16,
        display: "grid",
        gap: 16,
      }}
    >
      <div style={{ display: "grid", gap: 6 }}>
        <strong style={{ fontSize: "1.05rem" }}>Write and share with your class</strong>
        <p style={{ margin: 0, lineHeight: 1.6 }}>{prompt}</p>
        <div style={{ color: "#475569", fontSize: "0.9rem" }}>
          Only students in <strong>{className || "your class"}</strong> see this list.
        </div>
      </div>

      <div style={{ display: "grid", gap: 10 }}>
        <label htmlFor={`workbook-share-${lessonId}`} style={{ fontWeight: 700 }}>
          Your 6–8 sentence paragraph
        </label>
        <textarea
          ref={textareaRef}
          id={`workbook-share-${lessonId}`}
          value={draft}
          maxLength={MAX_POST_LENGTH}
          rows={7}
          placeholder="Mein Name ist ..."
          onChange={(event) => {
            draftTouchedRef.current = true;
            setDraft(event.target.value);
            setMessage("");
            setError("");
          }}
          style={{
            width: "100%",
            resize: "vertical",
            minHeight: 150,
            padding: "12px 14px",
            border: "1px solid #cbd5e1",
            borderRadius: 10,
            font: "inherit",
            lineHeight: 1.6,
            boxSizing: "border-box",
          }}
        />

        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
          <button type="button" style={styles.primaryButton} onClick={handleSave} disabled={isSaving}>
            {isSaving ? "Saving..." : ownPost ? "Update Shared Answer" : "Save and Share with Class"}
          </button>
          <span style={{ color: "#64748b", fontSize: "0.85rem" }}>
            {draft.length}/{MAX_POST_LENGTH}
          </span>
        </div>

        {message ? (
          <div role="status" style={{ color: "#166534", fontWeight: 600 }}>
            ✓ {message}
          </div>
        ) : null}
        {error ? (
          <div role="alert" style={{ color: "#b91c1c", fontWeight: 600 }}>
            {error}
          </div>
        ) : null}
      </div>

      <div style={{ borderTop: "1px solid #dbeafe", paddingTop: 16, display: "grid", gap: 12 }}>
        <div>
          <strong style={{ fontSize: "1.05rem" }}>What Your Classmates Shared</strong>
          <div style={{ color: "#64748b", fontSize: "0.9rem", marginTop: 3 }}>
            Answers appear here immediately after they are saved.
          </div>
        </div>

        {isLoading ? <div style={{ color: "#64748b" }}>Loading class posts...</div> : null}

        {!isLoading && posts.length === 0 ? (
          <div
            style={{
              border: "1px dashed #cbd5e1",
              borderRadius: 10,
              padding: 14,
              color: "#475569",
              background: "#fff",
            }}
          >
            No classmates have shared an answer yet. Be the first!
          </div>
        ) : null}

        {!isLoading && posts.length > 0 ? (
          <div style={{ display: "grid", gap: 10 }}>
            {posts.map((post, index) => {
              const isOwn = post.id === user?.uid || post.uid === user?.uid;
              const canDelete = isOwn || isStaff;
              const postedAt = post.updatedAt || post.updatedAtMs || post.createdAt || post.createdAtMs;

              return (
                <article
                  key={post.id}
                  style={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 12,
                    background: "#fff",
                    padding: 14,
                    display: "grid",
                    gap: 10,
                  }}
                >
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 6, alignItems: "baseline" }}>
                    <span style={{ color: "#64748b", fontWeight: 700 }}>{index + 1}.</span>
                    <strong>{getFirstName(post.authorFirstName)} posted</strong>
                    <span style={{ color: "#64748b", fontSize: "0.85rem" }}>· {formatRelativeTime(postedAt, now)}</span>
                    {isOwn ? (
                      <span
                        style={{
                          marginLeft: "auto",
                          borderRadius: 999,
                          padding: "3px 8px",
                          background: "#eef2ff",
                          color: "#3730a3",
                          fontSize: "0.75rem",
                          fontWeight: 700,
                        }}
                      >
                        Your post
                      </span>
                    ) : null}
                  </div>

                  <p style={{ margin: 0, whiteSpace: "pre-wrap", lineHeight: 1.65, overflowWrap: "anywhere" }}>
                    {post.text}
                  </p>

                  {isOwn || canDelete ? (
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {isOwn ? (
                        <button type="button" style={styles.secondaryButton} onClick={() => handleEdit(post)}>
                          Edit
                        </button>
                      ) : null}
                      {canDelete ? (
                        <button
                          type="button"
                          style={{ ...styles.secondaryButton, color: "#b91c1c", borderColor: "#fecaca" }}
                          onClick={() => handleDelete(post)}
                        >
                          Delete
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </article>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ClassWorkbookShareBox;
