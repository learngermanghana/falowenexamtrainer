import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";
import { useExam, ALLOWED_LEVELS } from "../context/ExamContext";
import { useAuth } from "../context/AuthContext";
import ResultHistory from "./ResultHistory";
import { fetchIdeasFromCoach, markLetterWithAI } from "../services/coachService";
import { writingLetters } from "../data/writingLetters";

const IDEA_COACH_INTRO = {
  role: "assistant",
  content:
    "Paste your exam prompt or describe the situation. I'll guide you step by step with Herr Felix's coaching prompts until your letter is ready.",
};

const LetterPracticePage = ({ mode = "exams" }) => {
  const { level, setLevel, error, setError, loading, setLoading, resultHistory, addResultToHistory } = useExam();
  const { user, idToken } = useAuth();

  const isExamMode = mode === "exams";

  const availableTabs = useMemo(
    () => {
      const baseTabs = [
        { key: "mark", label: "Mark my letter" },
        { key: "ideas", label: "Ideas generator" },
      ];

      if (isExamMode) {
        baseTabs.unshift({ key: "practice", label: "Practice letters" });
      }

      return baseTabs;
    },
    [isExamMode]
  );

  const [activeTab, setActiveTab] = useState(() => availableTabs[0].key);
  const [letterText, setLetterText] = useState("");
  const [markFeedback, setMarkFeedback] = useState("");
  const [ideaInput, setIdeaInput] = useState("");
  const [chatMessages, setChatMessages] = useState([IDEA_COACH_INTRO]);
  const [ideasLoading, setIdeasLoading] = useState(false);
  const [ideaError, setIdeaError] = useState("");
  const [selectedLetterId, setSelectedLetterId] = useState(writingLetters[0]?.id || "");
  const [timerSeconds, setTimerSeconds] = useState(writingLetters[0]?.durationMinutes * 60 || 0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [practiceLevel, setPracticeLevel] = useState("All");

  const resetErrors = () => {
    setError("");
    setIdeaError("");
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    resetErrors();
  };

  useEffect(() => {
    if (!availableTabs.find((tab) => tab.key === activeTab)) {
      setActiveTab(availableTabs[0].key);
      setError("");
      setIdeaError("");
    }
  }, [activeTab, availableTabs, setError, setIdeaError]);

  const selectedLetter = useMemo(() => writingLetters.find((item) => item.id === selectedLetterId), [selectedLetterId]);

  useEffect(() => {
    if (!selectedLetter) return;
    setLevel(selectedLetter.level);
    setTimerSeconds(selectedLetter.durationMinutes * 60);
  }, [selectedLetter, setLevel]);

  useEffect(() => {
    if (!timerRunning) return;

    const interval = setInterval(() => {
      setTimerSeconds((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return `${mins}:${secs}`;
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
            <p style={{ ...styles.helperText, margin: "0 0 4px 0" }}>Schreiben trainer</p>
            <h2 style={{ ...styles.sectionTitle, margin: 0 }}>
              {isExamMode ? "Timed letters + Herr Felix ideas" : "Mark my letter + Herr Felix ideas"}
            </h2>
            <p style={{ ...styles.helperText, margin: "6px 0 0 0" }}>
              {isExamMode ? (
                <>
                  Start with a timed practice letter, then paste your draft into "Mark my letter". Use the ideas generator
                  (prompts in <code>functions/functionz/prompts.js</code>) to keep moving.
                </>
              ) : (
                "Timed practice lives in the Exams Room. Here you can paste drafts for marking and use the ideas generator to build your letter."
              )}
            </p>
          </div>
          <span style={styles.badge}>Exam writing lab</span>
        </div>

        <div style={styles.tabList} className="tab-list">
          {availableTabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className="tab-button"
              style={activeTab === tab.key ? styles.tabButtonActive : styles.tabButton}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {activeTab === "practice" && isExamMode && (
        <section style={styles.card}>
          <div style={{ display: "grid", gap: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 10 }}>
              <div style={{ display: "grid", gap: 6 }}>
                <label style={styles.label}>Choose a level to browse tasks</label>
                <div style={styles.segmentedControl}>
                  {["All", ...ALLOWED_LEVELS].map((lvl) => (
                    <button
                      key={lvl}
                      style={practiceLevel === lvl ? styles.segmentedActive : styles.segmentedButton}
                      onClick={() => setPracticeLevel(lvl)}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <div style={styles.timer}>{formatTime(timerSeconds)}</div>
                <p style={{ ...styles.timerHelp, margin: 0 }}>
                  Start the timer, write without stopping, then switch to "Mark my letter".
                </p>
              </div>
            </div>

            <div style={{ display: "grid", gap: 10 }}>
              <div style={{ ...styles.promptList, paddingLeft: 0, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))" }}>
                {writingLetters
                  .filter((item) => (practiceLevel === "All" ? true : item.level === practiceLevel))
                  .map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedLetterId(item.id)}
                      style={
                        selectedLetterId === item.id
                          ? { ...styles.tabButtonActive, textAlign: "left" }
                          : { ...styles.tabButton, textAlign: "left" }
                      }
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}>
                        <span>{item.letter}</span>
                        <span style={styles.levelPill}>{item.level}</span>
                      </div>
                      <p style={{ ...styles.helperText, margin: "6px 0 0 0" }}>
                        {item.durationMinutes} min • {item.situation}
                      </p>
                    </button>
                  ))}
              </div>
            </div>

            {selectedLetter && (
              <div style={{ ...styles.uploadCard, border: "1px dashed #cbd5e1", background: "#f8fafc" }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                  <div style={{ display: "grid", gap: 6 }}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <span style={styles.levelPill}>{selectedLetter.level}</span>
                      <strong>{selectedLetter.letter}</strong>
                      <span style={styles.badge}>{selectedLetter.durationMinutes} minute target</span>
                    </div>
                    <p style={{ ...styles.helperText, margin: 0 }}>{selectedLetter.situation}</p>
                    <div>
                      <p style={{ ...styles.helperText, margin: "0 0 4px 0" }}>Checklist</p>
                      <ul style={styles.checklist}>
                        {selectedLetter.whatToInclude.map((item) => (
                          <li key={item}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <div style={{ display: "grid", gap: 8, alignItems: "flex-start" }}>
                    <button
                      style={timerRunning ? styles.secondaryButton : styles.primaryButton}
                      onClick={() => {
                        setTimerSeconds(selectedLetter.durationMinutes * 60);
                        setTimerRunning(true);
                      }}
                    >
                      {timerRunning ? "Restart timer" : "Start timer"}
                    </button>
                    <button
                      style={styles.secondaryButton}
                      onClick={() => {
                        setTimerRunning(false);
                        setTimerSeconds(selectedLetter.durationMinutes * 60);
                      }}
                    >
                      Pause / Reset
                    </button>
                  </div>
                </div>
              </div>
            )}

            <div style={{ ...styles.helperText, marginTop: -4 }}>
              After finishing a draft, switch to <strong>Mark my letter</strong> for feedback.
            </div>
          </div>
        </section>
      )}

      {activeTab === "mark" && (
        <section style={styles.card}>
          <div style={{ display: "grid", gap: 12 }}>
            <h3 style={{ ...styles.sectionTitle, margin: 0 }}>Mark my letter</h3>
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
                <h4 style={styles.sectionTitle}>AI feedback</h4>
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
