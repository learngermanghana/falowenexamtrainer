import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { askGrammarQuestion } from "../services/grammarService";
import { styles } from "../styles";

const levelOptions = ["A1", "A2", "B1", "B2", "C1", "C2"];

const GrammarQuestionTab = () => {
  const { studentProfile, idToken } = useAuth();
  const [question, setQuestion] = useState("");
  const [level, setLevel] = useState(studentProfile?.level || "A2");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (studentProfile?.level) {
      setLevel(studentProfile.level);
    }
  }, [studentProfile?.level]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion) {
      setError("Please enter a grammar question to ask the coach.");
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setAnswer("");
      const { answer: reply } = await askGrammarQuestion({
        question: trimmedQuestion,
        level,
        idToken,
        studentId: studentProfile?.id,
      });
      setAnswer(reply);
    } catch (err) {
      setError(err.message || "Failed to reach the grammar coach.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ ...styles.card, marginTop: 12 }}>
      <h2 style={styles.sectionTitle}>Ask a Grammar Question</h2>
      <p style={styles.helperText}>
        The grammar coach now gives a quick explanation plus 1–2 short German examples with English glosses. Keep questions
        specific (e.g., "When do I use seit vs. für?" or "How do I form the Perfekt with modal verbs?").
      </p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <div style={styles.row}>
          <label style={styles.field}>
            <span style={styles.label}>Level (optional)</span>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value)}
              style={{ ...styles.select, maxWidth: 200 }}
            >
              {levelOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div style={styles.field}>
          <span style={styles.label}>Your question</span>
          <textarea
            style={styles.textArea}
            placeholder="Ask about word order, cases, tenses, or other grammar points..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button type="submit" style={styles.primaryButton} disabled={isLoading}>
            {isLoading ? "Asking..." : "Ask the coach"}
          </button>
          {isLoading ? <span style={{ fontSize: 13, color: "#4b5563" }}>Waiting for AI reply...</span> : null}
        </div>
      </form>

      {error ? <div style={styles.errorBox}>{error}</div> : null}

      {answer ? (
        <div style={styles.resultCard}>
          <h3 style={styles.resultHeading}>Coach answer</h3>
          <p style={styles.resultText}>{answer}</p>
        </div>
      ) : null}
    </div>
  );
};

export default GrammarQuestionTab;
