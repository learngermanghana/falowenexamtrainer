import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { useAuth } from "../context/AuthContext";
import {
  askGrammarQuestion,
  fetchGrammarHistory,
  updateGrammarHistoryEntry,
} from "../services/grammarService";
import { styles } from "../styles";

const levelOptions = ["A1", "A2", "B1", "B2", "C1", "C2"];
const buildLanguageOptions = (languageLabel) => [
  { value: "de_only", label: `${languageLabel} only` },
  { value: "de_gloss", label: `${languageLabel} + gloss` },
  { value: "en_support", label: "English support" },
];
const responseModes = [
  { value: "short_exam", label: "Short (exam style)" },
  { value: "detailed", label: "Detailed explanation" },
  { value: "correction_only", label: "Only correction" },
];
const templateActions = [
  { key: "correct_sentence", label: "Correct this sentence", prefix: "Correct this sentence:" },
  {
    key: "grammar_simple",
    label: "Explain this grammar rule simply",
    prefix: "Explain this grammar rule simply:",
  },
  { key: "a1_examples", label: "Give 5 A1 examples", prefix: "Give 5 A1 examples for:" },
  { key: "mini_quiz", label: "Make a mini quiz", prefix: "Make a mini quiz about:" },
];
const topicTags = ["verbs", "cases", "word order"];

const typoMap = {
  conjuagte: "conjugate",
  conjuagtion: "conjugation",
  grammer: "grammar",
  sentense: "sentence",
  articel: "article",
  detials: "details",
};

const normalizePrompt = (text = "") =>
  text.replace(/\b([a-zA-Z]+)\b/g, (token) => typoMap[token.toLowerCase()] || token);

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
  const [responseLanguage, setResponseLanguage] = useState("de_only");
  const [responseMode, setResponseMode] = useState("short_exam");
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [lastPayload, setLastPayload] = useState(null);
  const isFrenchProgram = studentProfile?.program === "french";
  const languageLabel = isFrenchProgram ? t("programLanguages.french") : t("programLanguages.german");
  const languageOptions = useMemo(() => buildLanguageOptions(languageLabel), [languageLabel]);
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
        if (Boolean(a.pinned) !== Boolean(b.pinned)) return a.pinned ? -1 : 1;
        const aTime = a.createdAt || 0;
        const bTime = b.createdAt || 0;
        return sortOrder === "newest" ? bTime - aTime : aTime - bTime;
      });
  }, [history, keywordFilter, levelFilter, sortOrder]);

  const cleanedPrompt = useMemo(() => normalizePrompt(question).trim(), [question]);
  const hasPromptCleanup = question.trim() && cleanedPrompt !== question.trim();

  const submitQuestion = async ({ questionText, levelValue, template = "" }) => {
    const trimmedQuestion = questionText.trim();
    const normalizedQuestion = normalizePrompt(trimmedQuestion).trim();
    if (!trimmedQuestion) {
      setError(t("grammarQuestionTab.errors.missingQuestion"));
      return;
    }

    try {
      setIsLoading(true);
      setError("");
      setAnswer("");
      const payload = {
        question: trimmedQuestion,
        cleanedPrompt: normalizedQuestion,
        level: levelValue,
        idToken,
        studentId: studentProfile?.id,
        program: studentProfile?.program,
        responseLanguage,
        responseMode,
        promptTemplate: template,
      };
      setLastPayload(payload);
      const { answer: reply } = await askGrammarQuestion({
        ...payload,
      });
      setAnswer(reply);
      setHistory((prev) => [
        {
          id: `local-${Date.now()}`,
          question: trimmedQuestion,
          cleanedPrompt: normalizedQuestion,
          level: levelValue,
          answer: reply,
          responseLanguage,
          responseMode,
          promptTemplate: template,
          pinned: false,
          practiced: false,
          issueReported: false,
          tags: [],
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
    submitQuestion({ questionText: question, levelValue: level, template: selectedTemplate });
  };

  const handleReask = (entry) => {
    setQuestion(entry.question || "");
    if (entry.level) setLevel(entry.level);
    submitQuestion({
      questionText: entry.question || "",
      levelValue: entry.level || level,
      template: entry.promptTemplate || "",
    });
  };

  const handleRetry = async () => {
    if (!lastPayload) return;
    submitQuestion({
      questionText: lastPayload.question,
      levelValue: lastPayload.level,
      template: lastPayload.promptTemplate,
    });
  };

  const patchHistoryEntry = async (entryId, patch) => {
    setHistory((prev) => prev.map((entry) => (entry.id === entryId ? { ...entry, ...patch } : entry)));
    if (!studentProfile?.id || String(entryId).startsWith("local-")) return;
    try {
      await updateGrammarHistoryEntry({ studentId: studentProfile.id, entryId, patch });
    } catch (err) {
      console.error("Failed to update grammar history entry", err);
    }
  };

  const applyTemplate = (templateConfig) => {
    setSelectedTemplate(templateConfig.key);
    setQuestion((prev) => {
      const trimmed = prev.trim();
      if (!trimmed) return `${templateConfig.prefix} `;
      if (trimmed.toLowerCase().startsWith(templateConfig.prefix.toLowerCase())) return prev;
      return `${templateConfig.prefix} ${trimmed}`;
    });
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section
        style={{
          ...styles.card,
          minHeight: 200,
          display: "grid",
          alignContent: "end",
          gap: 8,
          border: "none",
          boxShadow: "0 14px 40px rgba(15, 23, 42, 0.18)",
          backgroundImage:
            "linear-gradient(120deg, rgba(15,23,42,0.72), rgba(20,184,166,0.35)), url('https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1600&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <h2 style={{ ...styles.sectionTitle, margin: 0, color: "#f8fafc" }}>
          {t("grammarQuestionTab.title", { language: languageLabel })}
        </h2>
        <p style={{ ...styles.helperText, margin: 0, color: "#d1fae5" }}>
          Ask targeted questions and get guided examples for faster grammar progress.
        </p>
      </section>

      <div style={{ ...styles.card, marginTop: 0 }}>
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
          <label style={styles.field}>
            <span style={styles.label}>Response language</span>
            <select
              value={responseLanguage}
              onChange={(e) => setResponseLanguage(e.target.value)}
              style={{ ...styles.select, maxWidth: 240 }}
            >
              {languageOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>
          <label style={styles.field}>
            <span style={styles.label}>Answer quality</span>
            <select
              value={responseMode}
              onChange={(e) => setResponseMode(e.target.value)}
              style={{ ...styles.select, maxWidth: 240 }}
            >
              {responseModes.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
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

        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {templateActions.map((templateConfig) => (
            <button
              key={templateConfig.key}
              type="button"
              style={{
                ...styles.secondaryButton,
                borderColor: selectedTemplate === templateConfig.key ? "#2563eb" : "#d1d5db",
                color: selectedTemplate === templateConfig.key ? "#1d4ed8" : "#111827",
              }}
              onClick={() => applyTemplate(templateConfig)}
            >
              {templateConfig.label}
            </button>
          ))}
        </div>

        {hasPromptCleanup ? (
          <div style={{ ...styles.resultCard, background: "#f8fafc" }}>
            <p style={{ ...styles.label, marginBottom: 4 }}>Cleaned prompt preview</p>
            <p style={{ ...styles.resultText, margin: 0 }}>{cleanedPrompt}</p>
          </div>
        ) : null}

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button type="submit" style={styles.primaryButton} disabled={isLoading}>
            {isLoading ? t("grammarQuestionTab.submitLoading") : t("grammarQuestionTab.submit")}
          </button>
          {isLoading ? (
            <span style={{ fontSize: 13, color: "#4b5563" }}>Coach is thinking…</span>
          ) : null}
          {!isLoading && error ? (
            <button type="button" style={styles.secondaryButton} onClick={handleRetry}>
              Retry
            </button>
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
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>
                <button
                  type="button"
                  style={styles.secondaryButton}
                  onClick={() => navigator.clipboard?.writeText(entry.answer || "")}
                >
                  Copy corrected answer
                </button>
                <button
                  type="button"
                  style={styles.secondaryButton}
                  onClick={() => patchHistoryEntry(entry.id, { pinned: !entry.pinned })}
                >
                  {entry.pinned ? "Unpin" : "Pin/Save"}
                </button>
                <button
                  type="button"
                  style={styles.secondaryButton}
                  onClick={() => patchHistoryEntry(entry.id, { practiced: !entry.practiced })}
                >
                  {entry.practiced ? "Practiced" : "Mark as practiced"}
                </button>
                <button
                  type="button"
                  style={styles.secondaryButton}
                  onClick={() => patchHistoryEntry(entry.id, { issueReported: true })}
                  disabled={Boolean(entry.issueReported)}
                >
                  {entry.issueReported ? "Issue reported" : "Report answer issue"}
                </button>
              </div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginTop: 8 }}>
                {topicTags.map((tag) => {
                  const tags = Array.isArray(entry.tags) ? entry.tags : [];
                  const isActive = tags.includes(tag);
                  const nextTags = isActive ? tags.filter((value) => value !== tag) : [...tags, tag];
                  return (
                    <button
                      key={`${entry.id}-${tag}`}
                      type="button"
                      style={{
                        ...styles.secondaryButton,
                        borderColor: isActive ? "#2563eb" : "#d1d5db",
                        color: isActive ? "#1d4ed8" : "#374151",
                      }}
                      onClick={() => patchHistoryEntry(entry.id, { tags: nextTags })}
                    >
                      #{tag}
                    </button>
                  );
                })}
              </div>
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
    </div>
  );
};

export default GrammarQuestionTab;
