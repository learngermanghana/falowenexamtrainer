import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  saveTutorReviewResponse,
  subscribeTutorReviewQueue,
} from "../services/tutorReviewService";
import { styles } from "../styles";

const MISTAKE_TYPE_OPTIONS = [
  "Verb conjugation",
  "Word order",
  "Article / gender",
  "Spelling",
  "Formal / informal",
  "Missing task point",
  "Other",
];

const SEVERITY_OPTIONS = ["minor", "important", "serious"];

const makePhraseMistakeId = () => `pm_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

const getStudentDraft = (review) => review?.draft || review?.studentDraft || review?.revisedDraft || "";

const cardStyle = {
  ...styles.card,
  display: "grid",
  gap: 12,
  padding: 16,
};

const fieldStyle = {
  display: "grid",
  gap: 6,
};

const inputStyle = {
  width: "100%",
  border: "1px solid #d1d5db",
  borderRadius: 10,
  padding: "10px 12px",
  fontSize: 14,
  boxSizing: "border-box",
};

const textareaStyle = {
  ...inputStyle,
  minHeight: 120,
  resize: "vertical",
  fontFamily: "inherit",
  lineHeight: 1.5,
};

const selectionSummaryStyle = {
  border: "1px solid #bfdbfe",
  background: "#eff6ff",
  borderRadius: 12,
  padding: 12,
  color: "#1e3a8a",
};

export default function TutorMarkingPage() {
  const draftRef = useRef(null);
  const [reviews, setReviews] = useState([]);
  const [selectedReviewId, setSelectedReviewId] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [tutorFeedback, setTutorFeedback] = useState("");
  const [phraseMistakes, setPhraseMistakes] = useState([]);
  const [selection, setSelection] = useState({ phrase: "", startOffset: 0, endOffset: 0 });
  const [mistakeDraft, setMistakeDraft] = useState({
    mistakeType: MISTAKE_TYPE_OPTIONS[0],
    correction: "",
    explanation: "",
    severity: "important",
  });

  useEffect(() => {
    const unsubscribe = subscribeTutorReviewQueue(
      (nextReviews) => {
        setReviews(nextReviews);
        setLoading(false);
        setSelectedReviewId((current) => current || nextReviews[0]?.id || "");
      },
      (queueError) => {
        setError(queueError?.message || "Could not load tutor review queue.");
        setLoading(false);
      }
    );

    return unsubscribe;
  }, []);

  const selectedReview = useMemo(
    () => reviews.find((review) => review.id === selectedReviewId) || null,
    [reviews, selectedReviewId]
  );

  const studentDraft = useMemo(() => getStudentDraft(selectedReview), [selectedReview]);

  useEffect(() => {
    setTutorFeedback(selectedReview?.tutorFeedback || "");
    setPhraseMistakes(Array.isArray(selectedReview?.phraseMistakes) ? selectedReview.phraseMistakes : []);
    setSelection({ phrase: "", startOffset: 0, endOffset: 0 });
    setMistakeDraft({
      mistakeType: MISTAKE_TYPE_OPTIONS[0],
      correction: "",
      explanation: "",
      severity: "important",
    });
    setSuccess("");
    setError("");
  }, [selectedReview?.id]);

  const captureSelection = () => {
    const textarea = draftRef.current;
    if (!textarea) return;

    const startOffset = textarea.selectionStart || 0;
    const endOffset = textarea.selectionEnd || 0;
    const phrase = studentDraft.slice(startOffset, endOffset);

    setSelection({ phrase, startOffset, endOffset });
  };

  const handleAddMistake = () => {
    const phrase = selection.phrase.trim();
    const correction = mistakeDraft.correction.trim();
    const explanation = mistakeDraft.explanation.trim();

    if (!phrase || selection.endOffset <= selection.startOffset) {
      setError("Highlight an exact phrase in the student draft first.");
      return;
    }

    if (!correction || !explanation) {
      setError("Add both a correction and an explanation for the selected phrase.");
      return;
    }

    setPhraseMistakes((current) => [
      ...current,
      {
        id: makePhraseMistakeId(),
        source: "studentDraft",
        phrase,
        startOffset: selection.startOffset,
        endOffset: selection.endOffset,
        mistakeType: mistakeDraft.mistakeType,
        correction,
        explanation,
        severity: mistakeDraft.severity,
        createdAt: new Date().toISOString(),
      },
    ]);
    setMistakeDraft((current) => ({ ...current, correction: "", explanation: "" }));
    setSelection({ phrase: "", startOffset: 0, endOffset: 0 });
    setError("");
  };

  const updatePhraseMistake = (id, field, value) => {
    setPhraseMistakes((current) =>
      current.map((mistake) => (mistake.id === id ? { ...mistake, [field]: value } : mistake))
    );
  };

  const removePhraseMistake = (id) => {
    setPhraseMistakes((current) => current.filter((mistake) => mistake.id !== id));
  };

  const handleSave = async (reviewStatus) => {
    if (!selectedReview?.id) return;

    setSaving(true);
    setError("");
    setSuccess("");

    try {
      await saveTutorReviewResponse({
        reviewId: selectedReview.id,
        reviewStatus,
        tutorFeedback,
        phraseMistakes,
      });
      setSuccess(`Review saved as ${reviewStatus}.`);
    } catch (saveError) {
      setError(saveError?.message || "Could not save tutor review.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div style={styles.card}>Loading tutor review queue…</div>;
  }

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <section style={styles.card}>
        <p style={{ margin: 0, color: "#2563eb", fontWeight: 700, textTransform: "uppercase", fontSize: 12 }}>
          Tutor marking
        </p>
        <h1 style={{ ...styles.title, marginBottom: 8 }}>Mark student writing</h1>
        <p style={styles.subtitle}>
          Select exact text in the student draft, attach a focused mistake explanation, then approve or return the work.
        </p>
      </section>

      {error ? <div style={styles.errorBox}>{error}</div> : null}
      {success ? <div style={styles.successBox}>{success}</div> : null}

      <section style={cardStyle}>
        <label style={fieldStyle}>
          <span>Review to mark</span>
          <select
            value={selectedReviewId}
            onChange={(event) => setSelectedReviewId(event.target.value)}
            style={inputStyle}
          >
            {reviews.length ? null : <option value="">No reviews in the queue</option>}
            {reviews.map((review) => (
              <option key={review.id} value={review.id}>
                {review.studentName || review.studentEmail || "Student"} · {review.promptTitle || "Writing task"} · {review.reviewStatus || "pending"}
              </option>
            ))}
          </select>
        </label>
      </section>

      {selectedReview ? (
        <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1.3fr) minmax(280px, 0.7fr)", gap: 16 }}>
          <section style={cardStyle}>
            <div>
              <h2 style={{ marginTop: 0 }}>{selectedReview.promptTitle || "Student draft"}</h2>
              <p style={{ margin: 0, color: "#6b7280" }}>
                {selectedReview.studentName || "Student"} {selectedReview.level ? `· ${selectedReview.level}` : ""}
              </p>
            </div>

            <label style={fieldStyle}>
              <span>Student draft textarea</span>
              <textarea
                ref={draftRef}
                value={studentDraft}
                readOnly
                onSelect={captureSelection}
                onMouseUp={captureSelection}
                onKeyUp={captureSelection}
                style={{ ...textareaStyle, minHeight: 260, background: "#f9fafb" }}
              />
            </label>

            <div style={selectionSummaryStyle}>
              <strong>Selected phrase:</strong>{" "}
              {selection.phrase ? (
                <span>
                  “{selection.phrase}” ({selection.startOffset}–{selection.endOffset})
                </span>
              ) : (
                <span>Highlight text inside the draft to capture offsets.</span>
              )}
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
                <label style={fieldStyle}>
                  <span>Mistake type</span>
                  <select
                    value={mistakeDraft.mistakeType}
                    onChange={(event) => setMistakeDraft((current) => ({ ...current, mistakeType: event.target.value }))}
                    style={inputStyle}
                  >
                    {MISTAKE_TYPE_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
                <label style={fieldStyle}>
                  <span>Severity</span>
                  <select
                    value={mistakeDraft.severity}
                    onChange={(event) => setMistakeDraft((current) => ({ ...current, severity: event.target.value }))}
                    style={inputStyle}
                  >
                    {SEVERITY_OPTIONS.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label style={fieldStyle}>
                <span>Correction</span>
                <input
                  value={mistakeDraft.correction}
                  onChange={(event) => setMistakeDraft((current) => ({ ...current, correction: event.target.value }))}
                  placeholder="Write the corrected phrase or sentence"
                  style={inputStyle}
                />
              </label>
              <label style={fieldStyle}>
                <span>Explanation</span>
                <textarea
                  value={mistakeDraft.explanation}
                  onChange={(event) => setMistakeDraft((current) => ({ ...current, explanation: event.target.value }))}
                  placeholder="Explain why this is a mistake and how to fix it"
                  style={textareaStyle}
                />
              </label>
              <button type="button" onClick={handleAddMistake} style={styles.primaryButton}>
                Add mistake for selected phrase
              </button>
            </div>
          </section>

          <aside style={cardStyle}>
            <h2 style={{ marginTop: 0 }}>Tutor response</h2>
            <label style={fieldStyle}>
              <span>General tutor feedback</span>
              <textarea
                value={tutorFeedback}
                onChange={(event) => setTutorFeedback(event.target.value)}
                placeholder="Overall feedback still works even if no phrase mistakes are added."
                style={textareaStyle}
              />
            </label>

            <div style={{ display: "grid", gap: 12 }}>
              <h3 style={{ margin: 0 }}>Phrase mistakes ({phraseMistakes.length})</h3>
              {phraseMistakes.length ? (
                phraseMistakes.map((mistake, index) => (
                  <div key={mistake.id || index} style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, display: "grid", gap: 10 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                      <strong>Phrase-level mistake</strong>
                      <button type="button" onClick={() => removePhraseMistake(mistake.id)} style={styles.dangerButton}>
                        Remove
                      </button>
                    </div>
                    <small style={{ color: "#6b7280" }}>
                      {mistake.source || "studentDraft"} · offsets {mistake.startOffset}–{mistake.endOffset}
                    </small>
                    <label style={fieldStyle}>
                      <span>Selected phrase</span>
                      <input value={mistake.phrase || ""} onChange={(event) => updatePhraseMistake(mistake.id, "phrase", event.target.value)} style={inputStyle} />
                    </label>
                    <label style={fieldStyle}>
                      <span>Type</span>
                      <select value={mistake.mistakeType || "Other"} onChange={(event) => updatePhraseMistake(mistake.id, "mistakeType", event.target.value)} style={inputStyle}>
                        {MISTAKE_TYPE_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </label>
                    <label style={fieldStyle}>
                      <span>Correction</span>
                      <input value={mistake.correction || ""} onChange={(event) => updatePhraseMistake(mistake.id, "correction", event.target.value)} style={inputStyle} />
                    </label>
                    <label style={fieldStyle}>
                      <span>Explanation</span>
                      <textarea value={mistake.explanation || ""} onChange={(event) => updatePhraseMistake(mistake.id, "explanation", event.target.value)} style={textareaStyle} />
                    </label>
                    <label style={fieldStyle}>
                      <span>Severity</span>
                      <select value={mistake.severity || "important"} onChange={(event) => updatePhraseMistake(mistake.id, "severity", event.target.value)} style={inputStyle}>
                        {SEVERITY_OPTIONS.map((option) => <option key={option} value={option}>{option}</option>)}
                      </select>
                    </label>
                  </div>
                ))
              ) : (
                <p style={{ margin: 0, color: "#6b7280" }}>No phrase-level mistakes yet.</p>
              )}
            </div>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              <button type="button" disabled={saving} onClick={() => handleSave("approved")} style={styles.primaryButton}>
                Save & approve
              </button>
              <button type="button" disabled={saving} onClick={() => handleSave("returned_for_correction")} style={styles.secondaryButton}>
                Return for correction
              </button>
              <button type="button" disabled={saving} onClick={() => handleSave(selectedReview.reviewStatus || "pending")} style={styles.secondaryButton}>
                Save draft feedback
              </button>
            </div>
          </aside>
        </div>
      ) : null}
    </div>
  );
}
