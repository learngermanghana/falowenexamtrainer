import React, { useState } from "react";
import { styles } from "../styles";
import { useExam, ALLOWED_LEVELS, ALLOWED_TEILE } from "../context/ExamContext";
import SettingsForm from "./SettingsForm";
import Feedback from "./Feedback";
import { analyzeText } from "../services/coachService";

const WritingPage = () => {
  const { teil, level, result, setResult, error, setError, loading, setLoading } =
    useExam();
  const [typedAnswer, setTypedAnswer] = useState("");

  const validateSelections = () => {
    if (!ALLOWED_TEILE.includes(teil)) {
      setError("Bitte wähle einen gültigen Teil aus der Liste.");
      return false;
    }

    if (!ALLOWED_LEVELS.includes(level)) {
      setError("Bitte wähle ein gültiges Niveau (A1–B2).");
      return false;
    }

    setError("");
    return true;
  };

  const sendTypedAnswerForCorrection = async () => {
    const trimmed = typedAnswer.trim();

    if (!trimmed) {
      alert("Please type your answer before sending.");
      return;
    }

    if (!validateSelections()) {
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const data = await analyzeText(trimmed, teil, level);
      setResult(data);
    } catch (err) {
      console.error("Falowen frontend error:", err);
      const msg =
        err?.response?.data?.error ||
        err.message ||
        "Falowen Exam Coach: Error sending text for analysis.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <SettingsForm
        title="Write a practice answer"
        helperText="✍️ Choose the Teil and level, type your response, and get the same AI feedback as the speaking task."
      />

      <section style={styles.card}>
        <textarea
          value={typedAnswer}
          onChange={(e) => {
            setError("");
            setTypedAnswer(e.target.value);
          }}
          placeholder="Schreibe hier deine Antwort auf Deutsch..."
          style={styles.textArea}
          rows={7}
        />

        <div style={{ marginTop: 12 }}>
          <button
            style={styles.primaryButton}
            onClick={sendTypedAnswerForCorrection}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Send Typed Answer"}
          </button>
        </div>

        {error && (
          <div style={styles.errorBox}>
            <strong>Hinweis:</strong> {error}
          </div>
        )}
      </section>

      <section style={styles.card}>
        <h3 style={styles.sectionTitle}>Helpful writing prompts</h3>
        <ul style={styles.promptList}>
          <li>Beschreibe dich selbst mit 5–6 Sätzen (Name, Herkunft, Beruf, Hobbys).</li>
          <li>Stelle drei Fragen zu einem Thema deiner Wahl (z. B. Urlaub, Arbeit, Familie).</li>
          <li>Mache höfliche Bitten für ein Gruppenprojekt (Treffpunkt, Aufgaben, Zeitplan).</li>
        </ul>
      </section>

      <Feedback result={result} />
    </>
  );
};

export default WritingPage;
