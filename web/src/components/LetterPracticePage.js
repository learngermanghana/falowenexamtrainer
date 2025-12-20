import React, { useState } from "react";
import { styles } from "../styles";
import { useExam, ALLOWED_LEVELS } from "../context/ExamContext";
import { useAuth } from "../context/AuthContext";
import ResultHistory from "./ResultHistory";
import { fetchIdeasFromCoach, markLetterWithAI } from "../services/coachService";

const IDEA_COACH_INTRO = {
  role: "assistant",
  content:
    "Paste your exam prompt or describe the situation. I'll guide you step by step with Herr Felix's coaching prompts until your letter is ready.",
};

const LetterPracticePage = () => {
  const { level, setLevel, error, setError, loading, setLoading, resultHistory, addResultToHistory } = useExam();
  const { user, idToken } = useAuth();

  const [activeTab, setActiveTab] = useState("mark");
  const [letterText, setLetterText] = useState("");
  const [markFeedback, setMarkFeedback] = useState("");
  const [ideaInput, setIdeaInput] = useState("");
  const [chatMessages, setChatMessages] = useState([IDEA_COACH_INTRO]);
  const [ideasLoading, setIdeasLoading] = useState(false);
  const [ideaError, setIdeaError] = useState("");

  const resetErrors = () => {
    setError("");
    setIdeaError("");
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    resetErrors();
  };

  const validateLevel = () => {
    if (!ALLOWED_LEVELS.includes(level)) {
      setError("Bitte wähle ein gültiges Niveau (A1–B2) für das Feedback.");
      return false;
    }

    return true;
  };

  const handleMarkSubmit = async () => {
    const trimmed = letterText.trim();
    if (!trimmed) {
      setError("Please paste your letter so Herr Felix can mark it.");
      return;
    }

    if (!validateLevel()) return;

    setLoading(true);
    setMarkFeedback("");

    try {
      const studentName = user?.displayName || user?.email || "Student";
      const data = await markLetterWithAI({
        text: trimmed,
        level,
        studentName,
        idToken,
      });

      setMarkFeedback(data.feedback);
      addResultToHistory({
        id: Date.now(),
        mode: "Mark my letter",
        level,
        comments: data.feedback,
        createdAt: new Date().toISOString(),
      });
    } catch (err) {
      const message =
        err?.response?.data?.error || err.message || "Falowen Coach: Could not mark your letter right now.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const addChatMessage = (role, content) => {
    setChatMessages((prev) => [...prev, { role, content }]);
  };

  const handleAskForIdeas = async () => {
    const trimmed = ideaInput.trim();
    if (!trimmed || ideasLoading) return;

    resetErrors();

    const updatedMessages = [...chatMessages, { role: "user", content: trimmed }];
    setChatMessages(updatedMessages);
    setIdeaInput("");
    setIdeasLoading(true);

    try {
      const { reply } = await fetchIdeasFromCoach({
        messages: updatedMessages,
        level,
        idToken,
      });
      addChatMessage("assistant", reply);
    } catch (err) {
      const message = err?.response?.data?.error || err.message || "Could not fetch ideas from Herr Felix.";
      setIdeaError(message);
    } finally {
      setIdeasLoading(false);
    }
  };

  return (
    <div style={{ display: "grid", gap: 12 }}>
      <section style={styles.card}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div>
            <p style={{ ...styles.helperText, margin: "0 0 4px 0" }}>Writing lab</p>
            <h2 style={{ ...styles.sectionTitle, margin: 0 }}>Practice letter writing</h2>
            <p style={{ ...styles.helperText, margin: "6px 0 0 0" }}>
              Two focused tools: paste a finished letter for instant marking, or chat with the ideas generator to build your letter step by step.
            </p>
          </div>
          <span style={styles.badge}>Herr Felix prompts</span>
        </div>

        <div style={styles.tabList}>
          {[{ key: "mark", label: "Mark my letter" }, { key: "ideas", label: "Ideas generator" }].map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              style={activeTab === tab.key ? styles.tabButtonActive : styles.tabButton}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {activeTab === "mark" && (
        <section style={styles.card}>
          <div style={{ display: "grid", gap: 12 }}>
            <div style={{ display: "grid", gap: 6 }}>
              <label style={styles.label}>Level for feedback</label>
              <select
                value={level}
                onChange={(e) => {
                  setLevel(e.target.value);
                  setError("");
                }}
                style={styles.select}
              >
                {ALLOWED_LEVELS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>

            <div style={{ display: "grid", gap: 6 }}>
              <label style={styles.label}>Your letter</label>
              <textarea
                style={styles.textArea}
                placeholder="Paste your finished letter or essay here for marking."
                value={letterText}
                onChange={(e) => setLetterText(e.target.value)}
                rows={10}
              />
            </div>

            <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <button style={styles.primaryButton} onClick={handleMarkSubmit} disabled={loading}>
                {loading ? "Marking your letter..." : "Get AI marking"}
              </button>
              <button
                style={styles.secondaryButton}
                onClick={() => {
                  setLetterText("");
                  setMarkFeedback("");
                  resetErrors();
                }}
              >
                Clear
              </button>
            </div>

            {error && (
              <div style={styles.errorBox}>
                <strong>Hinweis:</strong> {error}
              </div>
            )}

            {markFeedback && (
              <div>
                <h3 style={styles.sectionTitle}>AI feedback</h3>
                <pre style={{ ...styles.pre, whiteSpace: "pre-wrap" }}>{markFeedback}</pre>
              </div>
            )}
          </div>
        </section>
      )}

      {activeTab === "ideas" && (
        <section style={styles.card}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <label style={styles.label}>Level for coaching</label>
              <select
                value={level}
                onChange={(e) => {
                  setLevel(e.target.value);
                  resetErrors();
                }}
                style={styles.select}
              >
                {ALLOWED_LEVELS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <span style={styles.levelPill}>Prompt bank in /functions/functionz/prompts.js</span>
          </div>

          <div style={{ ...styles.chatLog, marginTop: 12 }}>
            {chatMessages.map((msg, idx) => (
              <div key={`${msg.role}-${idx}`} style={msg.role === "assistant" ? styles.chatBubbleCoach : styles.chatBubbleUser}>
                <strong style={{ display: "block", marginBottom: 4 }}>{msg.role === "assistant" ? "Coach" : "You"}</strong>
                <span>{msg.content}</span>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 12 }}>
            <label style={styles.label}>Your next question or idea</label>
            <textarea
              style={styles.textareaSmall}
              value={ideaInput}
              onChange={(e) => setIdeaInput(e.target.value)}
              placeholder="Paste the exam question or describe the part you want help drafting."
              rows={3}
            />
          </div>

          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button style={styles.primaryButton} onClick={handleAskForIdeas} disabled={ideasLoading}>
              {ideasLoading ? "Coach is typing..." : "Send to ideas coach"}
            </button>
            <button
              style={styles.secondaryButton}
              onClick={() => {
                setChatMessages([IDEA_COACH_INTRO]);
                setIdeaInput("");
                resetErrors();
              }}
            >
              Reset chat
            </button>
          </div>

          {ideaError && (
            <div style={{ ...styles.errorBox, marginTop: 8 }}>
              <strong>Hinweis:</strong> {ideaError}
            </div>
          )}
        </section>
      )}

      <ResultHistory results={resultHistory} />
    </div>
  );
};

export default LetterPracticePage;
