import React, { useState } from "react";
import { styles } from "../styles";
import { startPlacement } from "../services/coachService";

const PlacementCheck = () => {
  const [answers, setAnswers] = useState(["", ""]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (idx, value) => {
    setAnswers((prev) => prev.map((val, i) => (i === idx ? value : val)));
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    setResult(null);
    try {
      const payload = answers
        .filter((text) => text.trim())
        .map((text, idx) => ({ text, taskType: idx === 0 ? "intro" : "story" }));
      const data = await startPlacement(payload);
      setResult(data?.placement || null);
    } catch (e) {
      setError(e?.response?.data?.error || "Could not run placement.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section style={styles.card}>
      <h2 style={styles.sectionTitle}>Mini Level Check</h2>
      <p style={styles.helperText}>
        Answer two quick prompts. The AI will estimate your level and propose a
        next drill.
      </p>
      <label style={styles.label}>Introduce yourself in 3 sentences</label>
      <textarea
        style={styles.textArea}
        value={answers[0]}
        onChange={(e) => handleChange(0, e.target.value)}
      />
      <label style={{ ...styles.label, marginTop: 10 }}>
        Describe your last weekend in German
      </label>
      <textarea
        style={styles.textArea}
        value={answers[1]}
        onChange={(e) => handleChange(1, e.target.value)}
      />
      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button
          style={styles.primaryButton}
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Checking..." : "Check level"}
        </button>
        {error && <div style={styles.errorBox}>{error}</div>}
      </div>

      {result && (
        <div style={{ ...styles.resultCard, marginTop: 12 }}>
          <h3 style={styles.resultHeading}>Estimated level</h3>
          <p style={styles.resultText}>
            {result.estimated_level} · Confidence {Math.round((result.confidence || 0) * 100)}%
          </p>
          <p style={styles.resultText}>{result.rationale}</p>
          <div style={{ marginTop: 8 }}>
            <strong>Next step:</strong> {result.next_task_hint}
          </div>
        </div>
      )}
    </section>
  );
};

export default PlacementCheck;
