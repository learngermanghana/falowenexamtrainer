import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { askGrammarQuestion, fetchGrammarHistory } from "../services/grammarService";
import { styles } from "../styles";

const levelOptions = ["A1", "A2", "B1", "B2", "C1", "C2"];

const GrammarQuestionTab = () => {
  const { studentProfile, idToken } = useAuth();
  const [question, setQuestion] = useState("");
  const [level, setLevel] = useState(studentProfile?.level || "A2");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState([]);
  const [historyError, setHistoryError] = useState("");
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyCursor, setHistoryCursor] = useState(null);
  const [hasMore, setHasMore] = useState(false);
  const [sortOrder, setSortOrder] = useState("newest");
  const [levelFilter, setLevelFilter] = useState("all");
  const [keywordFilter, setKeywordFilter] = useState("");

  useEffect(() => {
    if (studentProfile?.level) {
      setLevel(studentProfile.level);
    }
  }, [studentProfile?.level]);

  const formatDate = (value) => {
    if (!value) return "Just now";
    const asNumber = value?.toMillis ? value.toMillis() : Number(value);
    return Number.isNaN(asNumber) ? "" : new Date(asNumber).toLocaleString();
  };

  const loadHistoryPage = useCallback(
    async (cursor = null) => {
      if (!studentProfile?.id || !idToken) {
        setHistoryError("Please sign in to view your previous grammar questions.");
        return;
      }

      setHistoryLoading(true);
      try {
        const { entries, nextCursor } = await fetchGrammarHistory({
          studentId: studentProfile.id,
          cursor,
          idToken,
          pageSize: 10,
        });
        setHistory((prev) => (cursor ? [...prev, ...entries] : entries));
        setHistoryCursor(nextCursor);
        setHasMore(Boolean(nextCursor));
        setHistoryError("");
      } catch (err) {
        console.error("Failed to load grammar history", err);
        setHistoryError("Could not load your previous grammar questions.");
      } finally {
        setHistoryLoading(false);
      }
    },
    [idToken, studentProfile?.id]
  );

  useEffect(() => {
    setHistory([]);
    setHistoryCursor(null);
    setHasMore(false);
    if (studentProfile?.id && idToken) {
      loadHistoryPage();
    }
  }, [studentProfile?.id, idToken, loadHistoryPage]);

  const filteredHistory = useMemo(() => {
    const keyword = keywordFilter.trim().toLowerCase();
    const filtered = history
      .filter((entry) =>
        levelFilter === "all"
          ? true
          : (entry.level || "").toUpperCase() === levelFilter.toUpperCase()
      )
      .filter((entry) =>
        !keyword
          ? true
          : entry.question?.toLowerCase().includes(keyword) ||
            entry.answer?.toLowerCase().includes(keyword)
      );

    return filtered
      .slice()
      .sort((a, b) => {
        const aTime = a.createdAt || 0;
        const bTime = b.createdAt || 0;
        return sortOrder === "newest" ? bTime - aTime : aTime - bTime;
      });
  }, [history, keywordFilter, levelFilter, sortOrder]);

  const submitQuestion = async ({ questionText, levelValue }) => {
    const trimmedQuestion = questionText.trim();
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
        level: levelValue,
        idToken,
        studentId: studentProfile?.id,
      });
      setAnswer(reply);
      setHistory((prev) => [
        {
          id: `local-${Date.now()}`,
          question: trimmedQuestion,
          level: levelValue,
          answer: reply,
          createdAt: Date.now(),
        },
        ...prev,
      ]);
    } catch (err) {
      setError(err.message || "Failed to reach the grammar coach.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    submitQuestion({ questionText: question, levelValue: level });
  };

  const handleReask = (entry) => {
    setQuestion(entry.question || "");
    if (entry.level) setLevel(entry.level);
    submitQuestion({ questionText: entry.question || "", levelValue: entry.level || level });
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

      <div style={{ marginTop: 16 }}>
        <h3 style={styles.sectionTitle}>Previous questions</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
          <label style={{ ...styles.field, flex: "1 1 180px" }}>
            <span style={styles.label}>Filter by level</span>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              style={{ ...styles.select, width: "100%" }}
            >
              <option value="all">All levels</option>
              {levelOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label style={{ ...styles.field, flex: "1 1 220px" }}>
            <span style={styles.label}>Search</span>
            <input
              value={keywordFilter}
              onChange={(e) => setKeywordFilter(e.target.value)}
              placeholder="Keyword in question or answer"
              style={{ ...styles.input, width: "100%" }}
            />
          </label>

          <label style={{ ...styles.field, flex: "1 1 160px" }}>
            <span style={styles.label}>Sort</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{ ...styles.select, width: "100%" }}
            >
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
          </label>
        </div>

        {historyError ? <div style={styles.errorBox}>{historyError}</div> : null}

        <div style={{ display: "grid", gap: 12 }}>
          {filteredHistory.map((entry) => (
            <div key={entry.id} style={styles.resultCard}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                <div>
                  <p style={{ ...styles.label, marginBottom: 4 }}>
                    Level: {(entry.level || "").toUpperCase() || "N/A"}
                  </p>
                  <p style={{ fontWeight: 600, margin: 0 }}>Q: {entry.question}</p>
                </div>
                <button
                  type="button"
                  style={{ ...styles.secondaryButton, height: "fit-content" }}
                  onClick={() => handleReask(entry)}
                  disabled={isLoading}
                >
                  Re-ask
                </button>
              </div>
              <p style={{ ...styles.resultText, marginTop: 8 }}>
                <strong>A:</strong> {entry.answer || "(Pending response)"}
              </p>
              <p style={{ ...styles.helperText, marginTop: 6 }}>Asked {formatDate(entry.createdAt)}</p>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 12 }}>
          {hasMore ? (
            <button
              type="button"
              style={styles.secondaryButton}
              onClick={() => loadHistoryPage(historyCursor)}
              disabled={historyLoading}
            >
              {historyLoading ? "Loading..." : "Load more"}
            </button>
          ) : null}
          {!historyLoading && !filteredHistory.length ? (
            <span style={styles.helperText}>No previous questions yet.</span>
          ) : null}
          {historyLoading ? (
            <span style={styles.helperText}>Fetching your history...</span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default GrammarQuestionTab;
