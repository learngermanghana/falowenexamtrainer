import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  collection,
  db,
  doc,
  isFirebaseConfigured,
  onSnapshot,
  query,
  serverTimestamp,
  setDoc,
  where,
} from "../firebase";
import { styles } from "../styles";

const clean = (value) => String(value || "").trim();
const safeId = (value) => clean(value).replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 300);

const profileLevel = (profile = {}) => clean(profile.level || profile.courseLevel).toUpperCase();
const profileClass = (profile = {}) => clean(profile.className || profile.class_name || profile.class || profile.cohort);
const profileName = (profile = {}, user = {}) =>
  clean(profile.name || profile.fullName || profile.studentName || user.displayName || user.email || "Student");

export default function LiveClassResponsePanel({
  lessonId,
  questionId,
  selectedOption,
  options = [],
  questionLabel = "",
}) {
  const { user, studentProfile } = useAuth();
  const [responses, setResponses] = useState([]);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [showNames, setShowNames] = useState(false);

  const level = useMemo(() => profileLevel(studentProfile), [studentProfile]);
  const className = useMemo(() => profileClass(studentProfile), [studentProfile]);
  const studentName = useMemo(() => profileName(studentProfile, user), [studentProfile, user]);
  const scopeKey = useMemo(
    () => [level, className, clean(lessonId), clean(questionId)].join("__"),
    [className, lessonId, level, questionId]
  );

  useEffect(() => {
    if (!isFirebaseConfigured || !db || !level || !className || !lessonId || !questionId) return undefined;

    const responseQuery = query(
      collection(db, "classResponses"),
      where("scopeKey", "==", scopeKey)
    );

    return onSnapshot(
      responseQuery,
      (snapshot) => {
        const next = snapshot.docs
          .map((entry) => ({ id: entry.id, ...entry.data() }))
          .filter((entry) => clean(entry.selectedOption))
          .sort((a, b) => clean(a.studentName).localeCompare(clean(b.studentName)));
        setResponses(next);
        setError("");
      },
      (snapshotError) => {
        console.error("Failed to load live class responses", snapshotError);
        setError("Class responses could not be loaded.");
      }
    );
  }, [className, lessonId, level, questionId, scopeKey]);

  useEffect(() => {
    const option = clean(selectedOption);
    if (!option || !user?.uid || !isFirebaseConfigured || !db || !level || !className) return undefined;

    let active = true;
    setStatus("Saving…");
    setError("");

    const responseId = safeId(`${lessonId}__${questionId}__${user.uid}`);
    const responseRef = doc(db, "classResponses", responseId);

    setDoc(
      responseRef,
      {
        studentId: user.uid,
        studentName,
        studentEmail: clean(user.email),
        level,
        className,
        lessonId: clean(lessonId),
        questionId: clean(questionId),
        questionLabel: clean(questionLabel),
        selectedOption: option,
        scopeKey,
        graded: false,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    )
      .then(() => {
        if (active) setStatus("Saved ✓");
      })
      .catch((saveError) => {
        console.error("Failed to save live class response", saveError);
        if (active) {
          setStatus("");
          setError("Your class response could not be saved.");
        }
      });

    return () => {
      active = false;
    };
  }, [className, lessonId, level, questionId, questionLabel, scopeKey, selectedOption, studentName, user?.email, user?.uid]);

  const grouped = useMemo(() => {
    const result = {};
    options.forEach((option) => {
      result[option] = [];
    });
    responses.forEach((response) => {
      const option = clean(response.selectedOption);
      if (!result[option]) result[option] = [];
      result[option].push(response);
    });
    return result;
  }, [options, responses]);

  if (!user?.uid) {
    return (
      <div style={{ ...styles.helperText, margin: "6px 0 0" }}>
        Sign in to join the live class response.
      </div>
    );
  }

  if (!level || !className) {
    return (
      <div style={{ ...styles.helperText, margin: "6px 0 0" }}>
        Your class details are missing, so live class responses are unavailable.
      </div>
    );
  }

  const hasAnswered = Boolean(clean(selectedOption));

  return (
    <div
      data-live-class-response="true"
      style={{
        marginTop: 8,
        border: "1px solid #dbeafe",
        borderRadius: 12,
        padding: 12,
        background: "#f8fbff",
        display: "grid",
        gap: 9,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
        <strong>Class response · not graded</strong>
        <span style={{ ...styles.helperText, margin: 0 }}>{status}</span>
      </div>

      {!hasAnswered ? (
        <p style={{ ...styles.helperText, margin: 0 }}>
          Choose your own answer first. Class choices will appear after you respond.
        </p>
      ) : (
        <>
          <p style={{ margin: 0, fontSize: 14 }}>
            Your answer: <strong>{selectedOption}</strong> · {responses.length} class response{responses.length === 1 ? "" : "s"}
          </p>

          <div style={{ display: "grid", gap: 7 }}>
            {options.map((option) => {
              const names = grouped[option] || [];
              const percent = responses.length ? Math.round((names.length / responses.length) * 100) : 0;
              return (
                <div key={option} style={{ display: "grid", gridTemplateColumns: "minmax(42px, auto) 1fr auto", gap: 8, alignItems: "center" }}>
                  <strong>{option}</strong>
                  <div style={{ height: 8, borderRadius: 999, background: "#e5e7eb", overflow: "hidden" }}>
                    <div style={{ width: `${percent}%`, height: "100%", background: "currentColor" }} />
                  </div>
                  <span style={{ fontSize: 13 }}>{names.length}</span>
                </div>
              );
            })}
          </div>

          <button
            type="button"
            onClick={() => setShowNames((value) => !value)}
            style={{ ...styles.secondaryButton, width: "fit-content" }}
          >
            {showNames ? "Hide classmates" : "View classmates"}
          </button>

          {showNames ? (
            <div style={{ display: "grid", gap: 8 }}>
              {options.map((option) => (
                <div key={option} style={{ fontSize: 13, lineHeight: 1.55 }}>
                  <strong>{option}:</strong>{" "}
                  {(grouped[option] || []).length
                    ? grouped[option].map((entry) => entry.studentId === user.uid ? `${clean(entry.studentName) || "You"} (You)` : clean(entry.studentName) || "Student").join(", ")
                    : "No responses yet"}
                </div>
              ))}
            </div>
          ) : null}
        </>
      )}

      {error ? <p role="alert" style={{ margin: 0, color: "#b91c1c", fontSize: 13 }}>{error}</p> : null}
    </div>
  );
}
