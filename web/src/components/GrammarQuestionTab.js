import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import { askGrammarQuestion, fetchGrammarHistory } from "../services/grammarService";
import { styles } from "../styles";

const levelOptions = ["A1", "A2", "B1", "B2", "C1", "C2"];

const GrammarQuestionTab = () => {
  const { t } = useTranslation();
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
  const isFrenchProgram = studentProfile?.program === "french";
  const languageLabel = isFrenchProgram ? t("programLanguages.french") : t("programLanguages.german");
  const examplePrompt = isFrenchProgram
    ? t("grammarQuestionTab.examplePrompt.french")
    : t("grammarQuestionTab.examplePrompt.german");

  useEffect(() => {
    if (studentProfile?.level) {
      setLevel(studentProfile.level);
    }
  }, [studentProfile?.level]);

  const formatDate = (value) => {
    if (!value) return t("grammarQuestionTab.time.justNow");
    const asNumber = value?.toMillis ? value.toMillis() : Number(value);
    return Number.isNaN(asNumber) ? "" : new Date(asNumber).toLocaleString();
  };

  const loadHistoryPage = useCallback(
    async (cursor = null) => {
      if (!studentProfile?.id || !idToken) {
        setHistoryError(t("grammarQuestionTab.errors.signInToViewHistory"));
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
        setHistoryError(t("grammarQuestionTab.errors.historyLoad"));
      } finally {
        setHistoryLoading(false);
      }
    },
    [idToken, studentProfile?.id, t]
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
      setError(t("grammarQuestionTab.errors.missingQuestion"));
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
        program: studentProfile?.program,
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
      setError(err.message || t("grammarQuestionTab.errors.askFailed"));
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
      <h2 style={styles.sectionTitle}>{t("grammarQuestionTab.title", { language: languageLabel })}</h2>
      <p style={styles.helperText}>
        {t("grammarQuestionTab.description", { language: languageLabel, examplePrompt })}
      </p>

      <form onSubmit={handleSubmit} style={{ display: "grid", gap: 12 }}>
        <div style={styles.row}>
          <label style={styles.field}>
            <span style={styles.label}>{t("grammarQuestionTab.levelLabel")}</span>
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
          <span style={styles.label}>{t("grammarQuestionTab.questionLabel")}</span>
          <textarea
            style={styles.textArea}
            placeholder={t("grammarQuestionTab.questionPlaceholder", { language: languageLabel.toLowerCase() })}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button type="submit" style={styles.primaryButton} disabled={isLoading}>
            {isLoading ? t("grammarQuestionTab.submitLoading") : t("grammarQuestionTab.submit")}
          </button>
          {isLoading ? (
            <span style={{ fontSize: 13, color: "#4b5563" }}>{t("grammarQuestionTab.waiting")}</span>
          ) : null}
        </div>
      </form>

      {error ? <div style={styles.errorBox}>{error}</div> : null}

      {answer ? (
        <div style={styles.resultCard}>
          <h3 style={styles.resultHeading}>{t("grammarQuestionTab.answerHeading")}</h3>
          <p style={styles.resultText}>{answer}</p>
        </div>
      ) : null}

      <div style={{ marginTop: 16 }}>
        <h3 style={styles.sectionTitle}>{t("grammarQuestionTab.previousHeading")}</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginBottom: 8 }}>
          <label style={{ ...styles.field, flex: "1 1 180px" }}>
            <span style={styles.label}>{t("grammarQuestionTab.filterLevelLabel")}</span>
            <select
              value={levelFilter}
              onChange={(e) => setLevelFilter(e.target.value)}
              style={{ ...styles.select, width: "100%" }}
            >
              <option value="all">{t("grammarQuestionTab.filterLevelAll")}</option>
              {levelOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label style={{ ...styles.field, flex: "1 1 220px" }}>
            <span style={styles.label}>{t("grammarQuestionTab.searchLabel")}</span>
            <input
              value={keywordFilter}
              onChange={(e) => setKeywordFilter(e.target.value)}
              placeholder={t("grammarQuestionTab.searchPlaceholder")}
              style={{ ...styles.input, width: "100%" }}
            />
          </label>

          <label style={{ ...styles.field, flex: "1 1 160px" }}>
            <span style={styles.label}>{t("grammarQuestionTab.sortLabel")}</span>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              style={{ ...styles.select, width: "100%" }}
            >
              <option value="newest">{t("grammarQuestionTab.sortNewest")}</option>
              <option value="oldest">{t("grammarQuestionTab.sortOldest")}</option>
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
                    {t("grammarQuestionTab.entryLevel", {
                      level: (entry.level || "").toUpperCase() || t("grammarQuestionTab.notAvailable"),
                    })}
                  </p>
                  <p style={{ fontWeight: 600, margin: 0 }}>
                    {t("grammarQuestionTab.entryQuestion", { question: entry.question })}
                  </p>
                </div>
                <button
                  type="button"
                  style={{ ...styles.secondaryButton, height: "fit-content" }}
                  onClick={() => handleReask(entry)}
                  disabled={isLoading}
                >
                  {t("grammarQuestionTab.reask")}
                </button>
              </div>
              <p style={{ ...styles.resultText, marginTop: 8 }}>
                <strong>{t("grammarQuestionTab.entryAnswerPrefix")}:</strong>{" "}
                {entry.answer || t("grammarQuestionTab.pendingResponse")}
              </p>
              <p style={{ ...styles.helperText, marginTop: 6 }}>
                {t("grammarQuestionTab.askedAt", { date: formatDate(entry.createdAt) })}
              </p>
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
              {historyLoading ? t("grammarQuestionTab.loadingMore") : t("grammarQuestionTab.loadMore")}
            </button>
          ) : null}
          {!historyLoading && !filteredHistory.length ? (
            <span style={styles.helperText}>{t("grammarQuestionTab.noHistory")}</span>
          ) : null}
          {historyLoading ? (
            <span style={styles.helperText}>{t("grammarQuestionTab.fetchingHistory")}</span>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default GrammarQuestionTab;
