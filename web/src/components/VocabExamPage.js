// web/src/pages/VocabExamPage.jsx
import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";
import { useExam, ALLOWED_LEVELS } from "../context/ExamContext";
import { useAuth } from "../context/AuthContext";
import { fetchVocabularyFromSheet } from "../services/vocabService";

const PAGE_SIZE = 40;

const normalizeProfileLevel = (rawLevel) => {
  const normalized = (rawLevel || "").trim().toUpperCase();
  if (ALLOWED_LEVELS.includes(normalized)) return normalized;
  const fuzzyMatch = ALLOWED_LEVELS.find((allowed) => normalized.startsWith(allowed));
  return fuzzyMatch || "";
};

const shuffle = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

const pickRandom = (arr, count) => shuffle(arr).slice(0, count);

const VocabExamPage = () => {
  const { level, setLevel, setError } = useExam();
  const { studentProfile } = useAuth();

  const profileLevel = normalizeProfileLevel(studentProfile?.level);
  const isLevelLocked = ALLOWED_LEVELS.includes(profileLevel);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setLocalError] = useState("");

  // UI controls
  const [mode, setMode] = useState("cards"); // "cards" | "quiz" | "browse"
  const [queryText, setQueryText] = useState("");
  const [page, setPage] = useState(1);
  const [cardIndex, setCardIndex] = useState(0);

  // quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizScore, setQuizScore] = useState({ correct: 0, total: 0 });
  const [quizFeedback, setQuizFeedback] = useState("");
  const [quizOptions, setQuizOptions] = useState([]);

  useEffect(() => {
    if (isLevelLocked && level !== profileLevel) {
      setLevel(profileLevel);
    }
  }, [isLevelLocked, level, profileLevel, setLevel]);

  useEffect(() => {
    let isMounted = true;

    const load = async () => {
      setLoading(true);
      setLocalError("");
      try {
        const vocab = await fetchVocabularyFromSheet();
        if (!isMounted) return;
        setItems(vocab);
      } catch (err) {
        console.error("Failed to load vocab sheet", err);
        if (!isMounted) return;
        setLocalError(err?.message || "Konnte Vokabeln nicht laden.");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  const levelItems = useMemo(
    () => items.filter((item) => item.level === level || item.level === "ALL"),
    [items, level]
  );

  const filtered = useMemo(() => {
    const q = queryText.trim().toLowerCase();
    if (!q) return levelItems;
    return levelItems.filter((x) => `${x.german} ${x.english}`.toLowerCase().includes(q));
  }, [levelItems, queryText]);

  const totalPages = useMemo(() => Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)), [filtered.length]);

  useEffect(() => {
    setPage(1);
    setCardIndex(0);
    setQuizIndex(0);
    setQuizScore({ correct: 0, total: 0 });
    setQuizFeedback("");
  }, [level, queryText, mode]);

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return filtered.slice(start, start + PAGE_SIZE);
  }, [filtered, page]);

  const currentCard = pageItems[cardIndex] || null;

  // Build quiz question from filtered pool (not only current page)
  const quizPool = filtered;

  const currentQuizItem = quizPool[quizIndex] || null;

  useEffect(() => {
    if (!currentQuizItem) {
      setQuizOptions([]);
      return;
    }
    // Build 4 choices: 1 correct + 3 wrong
    const wrong = pickRandom(
      quizPool.filter((x) => x.id !== currentQuizItem.id && x.english),
      3
    ).map((x) => x.english);

    const options = shuffle([currentQuizItem.english, ...wrong]).filter(Boolean);
    setQuizOptions(options);
    setQuizFeedback("");
  }, [quizIndex, currentQuizItem, quizPool]);

  const playModeLabel =
    mode === "cards" ? "Flashcards" : mode === "quiz" ? "Quiz" : "Browse";

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={styles.card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
          <div>
            <p style={{ ...styles.helperText, margin: 0 }}>Exam Room</p>
            <h2 style={{ ...styles.sectionTitle, margin: "4px 0 2px" }}>Vocabulary Practice</h2>
            <p style={{ ...styles.helperText, margin: 0 }}>
              Mode: <strong>{playModeLabel}</strong> • Filtered by your level.
            </p>
          </div>

          <div style={{ display: "grid", gap: 8, minWidth: 220 }}>
            <label style={{ ...styles.label, margin: 0 }}>
              Level {isLevelLocked ? "(from profile)" : ""}
            </label>
            <select
              value={level}
              onChange={(e) => {
                setLevel(e.target.value);
                setError("");
              }}
              style={styles.select}
              disabled={isLevelLocked}
            >
              {ALLOWED_LEVELS.map((option) => (
                <option key={option}>{option}</option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Controls */}
      <section style={styles.card}>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap", alignItems: "center" }}>
          <input
            style={{ ...styles.textArea, minHeight: "auto", height: 44, flex: 1 }}
            placeholder="Search German or English..."
            value={queryText}
            onChange={(e) => setQueryText(e.target.value)}
          />

          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            style={{ ...styles.select, height: 44, minWidth: 180 }}
          >
            <option value="cards">Flashcards</option>
            <option value="quiz">Quiz (MCQ)</option>
            <option value="browse">Browse / Scan list</option>
          </select>

          {/* Pagination only for browse + cards (page based) */}
          {(mode === "browse" || mode === "cards") && (
            <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
              <button
                type="button"
                style={styles.secondaryButton}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                Prev page
              </button>

              <span style={{ fontSize: 13, color: "#4b5563" }}>
                Page {page}/{totalPages} • {filtered.length} words
              </span>

              <button
                type="button"
                style={styles.secondaryButton}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                Next page
              </button>
            </div>
          )}

          {/* Quiz progress */}
          {mode === "quiz" && (
            <span style={{ fontSize: 13, color: "#4b5563" }}>
              Progress: {quizIndex + 1}/{quizPool.length || 0} • Score: {quizScore.correct}/{quizScore.total}
            </span>
          )}
        </div>
      </section>

      {loading ? (
        <section style={styles.card}>
          <p style={{ ...styles.helperText, margin: 0 }}>Loading vocabulary ...</p>
        </section>
      ) : error ? (
        <section style={styles.card}>
          <div style={styles.errorBox}>
            <strong>Note:</strong> {error}
          </div>
        </section>
      ) : filtered.length === 0 ? (
        <section style={styles.card}>
          <p style={{ ...styles.helperText, margin: 0 }}>
            No vocabulary found for level <strong>{level}</strong>. Try removing the search text.
          </p>
        </section>
      ) : mode === "cards" ? (
        // Flashcards
        <section style={styles.card}>
          {!currentCard ? (
            <p style={{ ...styles.helperText, margin: 0 }}>No items on this page.</p>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 900, fontSize: 20 }}>{currentCard.german}</div>
                  <div style={{ ...styles.helperText, marginTop: 4 }}>{currentCard.english}</div>
                </div>
                <span style={styles.levelPill}>{currentCard.level}</span>
              </div>

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  type="button"
                  style={styles.secondaryButton}
                  onClick={() => setCardIndex((i) => Math.max(0, i - 1))}
                  disabled={cardIndex <= 0}
                >
                  Back
                </button>
                <button
                  type="button"
                  style={styles.primaryButton}
                  onClick={() => setCardIndex((i) => Math.min(pageItems.length - 1, i + 1))}
                  disabled={cardIndex >= pageItems.length - 1}
                >
                  Next card
                </button>
                <button
                  type="button"
                  style={styles.secondaryButton}
                  onClick={() => setCardIndex(Math.floor(Math.random() * pageItems.length))}
                >
                  Random
                </button>
              </div>

              <p style={{ ...styles.helperText, margin: 0 }}>
                Card {cardIndex + 1}/{pageItems.length} on this page
              </p>
            </div>
          )}
        </section>
      ) : mode === "quiz" ? (
        // Quiz (MCQ)
        <section style={styles.card}>
          {!currentQuizItem ? (
            <p style={{ ...styles.helperText, margin: 0 }}>No quiz items available.</p>
          ) : (
            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div>
                  <p style={{ ...styles.helperText, margin: 0 }}>Choose the correct English meaning:</p>
                  <div style={{ fontWeight: 900, fontSize: 20, marginTop: 6 }}>{currentQuizItem.german}</div>
                </div>
                <span style={styles.levelPill}>{currentQuizItem.level}</span>
              </div>

              <div style={{ display: "grid", gap: 8 }}>
                {quizOptions.map((opt) => (
                  <button
                    key={opt}
                    type="button"
                    style={styles.secondaryButton}
                    onClick={() => {
                      const isCorrect = opt === currentQuizItem.english;
                      setQuizScore((s) => ({
                        correct: s.correct + (isCorrect ? 1 : 0),
                        total: s.total + 1,
                      }));
                      setQuizFeedback(
                        isCorrect ? "✅ Correct!" : `❌ Not quite. Correct answer: ${currentQuizItem.english}`
                      );

                      // move next after short delay
                      setTimeout(() => {
                        setQuizIndex((i) => Math.min(quizPool.length - 1, i + 1));
                      }, 600);
                    }}
                  >
                    {opt}
                  </button>
                ))}
              </div>

              {quizFeedback ? (
                <div style={{ ...styles.errorBox, background: "#f8fafc", borderColor: "#e5e7eb", color: "#111827" }}>
                  {quizFeedback}
                </div>
              ) : null}

              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                <button
                  type="button"
                  style={styles.secondaryButton}
                  onClick={() => setQuizIndex((i) => Math.max(0, i - 1))}
                  disabled={quizIndex <= 0}
                >
                  Previous
                </button>

                <button
                  type="button"
                  style={styles.primaryButton}
                  onClick={() => setQuizIndex((i) => Math.min(quizPool.length - 1, i + 1))}
                  disabled={quizIndex >= quizPool.length - 1}
                >
                  Skip / Next
                </button>

                <button
                  type="button"
                  style={styles.secondaryButton}
                  onClick={() => {
                    setQuizIndex(0);
                    setQuizScore({ correct: 0, total: 0 });
                    setQuizFeedback("");
                  }}
                >
                  Restart quiz
                </button>
              </div>
            </div>
          )}
        </section>
      ) : (
        // Browse / Scan list
        <section style={styles.card}>
          <div style={{ ...styles.vocabGrid, marginTop: 0 }}>
            {pageItems.map((entry) => (
              <div key={entry.id} style={{ ...styles.vocabCard, background: "#fff" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 6 }}>
                  <div style={{ fontWeight: 800, fontSize: 15 }}>{entry.german || "—"}</div>
                  <span style={styles.levelPill}>{entry.level}</span>
                </div>
                <p style={{ ...styles.helperText, margin: "4px 0 8px" }}>{entry.english || "—"}</p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default VocabExamPage;
