import React, { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { styles } from "../styles";
import { useExam, ALLOWED_LEVELS } from "../context/ExamContext";
import { useAuth } from "../context/AuthContext";
import ResultHistory from "./ResultHistory";
import { fetchIdeasFromCoach, markLetterWithAI } from "../services/coachService";
import { writingLetters } from "../data/writingLetters";

const IDEAS_COACHING_PROMPTS = [
  "Start with the task and ask: What is unclear to me?",
  "Request a short explanation and one example sentence.",
  "End by summarizing the idea in your own words.",
];
const IDEAS_SESSION_TURN_LIMIT = 2;

const LetterPracticePage = ({ mode = "exams" }) => {
  const { i18n, t } = useTranslation();
  const numberFormatter = useMemo(() => new Intl.NumberFormat(i18n.language), [i18n.language]);
  const formatTimeUnit = (unit, count) =>
    t(`common.${unit}`, { count, formattedCount: numberFormatter.format(count) });
  const { level, setLevel, error, setError, loading, setLoading, resultHistory, addResultToHistory } = useExam();
  const { user, idToken, studentProfile } = useAuth();
  const location = useLocation();

  const isExamMode = mode === "exams";
  const isFrenchProgram = studentProfile?.program === "french";
  const coachDisplayName = isFrenchProgram ? "the French coach" : "Herr Felix";
  const ideaCoachIntro = useMemo(
    () => ({
      id: "intro",
      role: "assistant",
      content: `This is a chat between you and the ideas generator. Paste your exam prompt or describe the situation, and I'll guide you step by step with ${coachDisplayName}'s coaching prompts until your letter is ready.`,
    }),
    [coachDisplayName]
  );

  const requestedTab = useMemo(() => new URLSearchParams(location.search).get("tab"), [location.search]);
  const [activeTab, setActiveTab] = useState("mark");
  const [letterText, setLetterText] = useState("");
  const [markFeedback, setMarkFeedback] = useState("");
  const [ideaInput, setIdeaInput] = useState("");
  const [chatMessages, setChatMessages] = useState([ideaCoachIntro]);
  const [ideasLoading, setIdeasLoading] = useState(false);
  const [ideaError, setIdeaError] = useState("");
  const [ideaSuccess, setIdeaSuccess] = useState("");
  const [ideaSessionActive, setIdeaSessionActive] = useState(false);
  const [ideaTurnCount, setIdeaTurnCount] = useState(0);
  const [selectedDraftIds, setSelectedDraftIds] = useState([]);
  const [selectedLetterId, setSelectedLetterId] = useState(writingLetters[0]?.id || "");
  const [timerSeconds, setTimerSeconds] = useState(writingLetters[0]?.durationMinutes * 60 || 0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [practiceLevel, setPracticeLevel] = useState("All");

  const normalizeProfileLevel = (rawLevel) => {
    const normalized = (rawLevel || "").trim().toUpperCase();

    if (ALLOWED_LEVELS.includes(normalized)) {
      return normalized;
    }

    const fuzzyMatch = ALLOWED_LEVELS.find((allowed) => normalized.startsWith(allowed));

    return fuzzyMatch || "";
  };

  const profileLevel = normalizeProfileLevel(studentProfile?.level);
  const isLevelLocked = ALLOWED_LEVELS.includes(profileLevel);
  const isA1Student = isLevelLocked && profileLevel === "A1";
  const canUseIdeasGenerator = !isA1Student;
  const canUsePracticeLetters = isExamMode && !isFrenchProgram && !isA1Student;

  const availableTabs = useMemo(
    () => {
      const baseTabs = [{ key: "mark", label: "Mark my letter" }];

      if (canUseIdeasGenerator) {
        baseTabs.push({ key: "ideas", label: "Ideas generator" });
      }

      if (canUsePracticeLetters) {
        baseTabs.unshift({ key: "practice", label: "Practice letters" });
      }

      return baseTabs;
    },
    [canUseIdeasGenerator, canUsePracticeLetters]
  );

  const resetErrors = () => {
    setError("");
    setIdeaError("");
    setIdeaSuccess("");
  };

  const formatLetterPrompt = (letter) => {
    if (!letter) return "";
    const tagLine = letter.tags?.length ? `Tags: ${letter.tags.join(", ")}` : "";
    const checklist = letter.whatToInclude.map((item) => `- ${item}`).join("\n");

    return [
      `Prompt: ${letter.letter}`,
      tagLine,
      `Situation: ${letter.situation}`,
      "Checklist:",
      checklist,
    ]
      .filter(Boolean)
      .join("\n");
  };

  const sendLetterToMarkTab = () => {
    if (!selectedLetter) return;
    const prompt = formatLetterPrompt(selectedLetter);
    setLetterText((prev) => (prev.trim() ? prev : `${prompt}\n\n`));
    setMarkFeedback("");
    setActiveTab("mark");
  };

  const sendLetterToIdeasTab = () => {
    if (!selectedLetter) return;
    const prompt = formatLetterPrompt(selectedLetter);
    setIdeaInput(prompt);
    setIdeaSuccess("");
    setIdeaError("");
    setActiveTab("ideas");
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
      setIdeaSuccess("");
    }
  }, [activeTab, availableTabs, setError, setIdeaError]);

  useEffect(() => {
    if (requestedTab && availableTabs.some((tab) => tab.key === requestedTab)) {
      setActiveTab(requestedTab);
    }
  }, [availableTabs, requestedTab]);

  useEffect(() => {
    setChatMessages([ideaCoachIntro]);
  }, [ideaCoachIntro]);

  const selectedLetter = useMemo(() => writingLetters.find((item) => item.id === selectedLetterId), [selectedLetterId]);

  useEffect(() => {
    if (!selectedLetter) return;

    if (!isLevelLocked) {
      setLevel(selectedLetter.level);
    }

    setTimerSeconds(selectedLetter.durationMinutes * 60);
  }, [isLevelLocked, selectedLetter, setLevel]);

  useEffect(() => {
    if (isLevelLocked && profileLevel !== level) {
      setLevel(profileLevel);
    }
  }, [isLevelLocked, level, profileLevel, setLevel]);

  useEffect(() => {
    if (isLevelLocked && practiceLevel !== profileLevel) {
      setPracticeLevel(profileLevel);
    }
  }, [isLevelLocked, practiceLevel, profileLevel]);

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
      setError(
        isFrenchProgram
          ? "Please choose a valid level (A1–B2) for French feedback."
          : "Bitte wähle ein gültiges Niveau (A1–B2) für das Feedback."
      );
      return false;
    }

    return true;
  };

  const handleMarkSubmit = async () => {
    const trimmed = letterText.trim();
    if (!trimmed) {
      setError(`Please paste your letter so ${coachDisplayName} can mark it.`);
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
        program: studentProfile?.program,
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

  const makeChatMessage = (role, content) => ({
    id: `${Date.now()}-${Math.random().toString(16).slice(2)}`,
    role,
    content,
  });

  const addChatMessage = (role, content) => {
    setChatMessages((prev) => [...prev, makeChatMessage(role, content)]);
  };

  const userMessages = useMemo(
    () => chatMessages.filter((msg) => msg.role === "user"),
    [chatMessages]
  );

  const toggleDraftSelection = (id) => {
    setIdeaSuccess("");
    setIdeaError("");
    setSelectedDraftIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const selectedDraftText = useMemo(() => {
    return userMessages
      .filter((msg) => selectedDraftIds.includes(msg.id))
      .map((msg) => msg.content.trim())
      .filter(Boolean)
      .join("\n\n");
  }, [selectedDraftIds, userMessages]);

  const sendDraftsToMarkTab = () => {
    const livePreview = ideaInput.trim();
    const combinedDraft = [selectedDraftText, livePreview]
      .filter(Boolean)
      .join("\n\n");

    if (!combinedDraft) {
      setIdeaError(
        "Select at least one draft or type something in the live preview before sending it for marking."
      );
      setIdeaSuccess("");
      return;
    }

    setLetterText((prev) => {
      const existing = prev.trim();
      const parts = [existing, combinedDraft].filter(Boolean);
      return parts.join("\n\n");
    });
    setMarkFeedback("");
    setIdeaSuccess("Your selected lines are now pasted into the “Mark my letter” tab.");
    setIdeaError("");
    setSelectedDraftIds([]);
    setIdeaSessionActive(false);
    setActiveTab("mark");
  };

  const startIdeasSession = () => {
    setChatMessages([ideaCoachIntro]);
    setIdeaInput("");
    setIdeaError("");
    setIdeaSuccess(`Ideas session started. Ask up to ${IDEAS_SESSION_TURN_LIMIT} focused questions, then move your final draft to Mark my letter.`);
    setSelectedDraftIds([]);
    setIdeaTurnCount(0);
    setIdeaSessionActive(true);
  };

  const endIdeasSession = () => {
    setIdeaSessionActive(false);
    setIdeaSuccess("Ideas session ended. Use your best draft in Mark my letter for final feedback.");
  };

  const handleAskForIdeas = async () => {
    const trimmed = ideaInput.trim();
    if (!trimmed || ideasLoading) return;

    if (!ideaSessionActive) {
      setIdeaError("Start an ideas session first, then send your question.");
      return;
    }

    if (ideaTurnCount >= IDEAS_SESSION_TURN_LIMIT) {
      setIdeaSessionActive(false);
      setIdeaError("This ideas session is complete. Start a new session or move your draft to Mark my letter.");
      return;
    }

    resetErrors();

    const updatedMessages = [...chatMessages, makeChatMessage("user", trimmed)];
    setChatMessages(updatedMessages);
    setIdeaInput("");
    setIdeasLoading(true);

    try {
      const { reply } = await fetchIdeasFromCoach({
        messages: updatedMessages,
        level,
        idToken,
        program: studentProfile?.program,
      });
      addChatMessage("assistant", reply);
      setIdeaTurnCount((prev) => {
        const next = prev + 1;
        if (next >= IDEAS_SESSION_TURN_LIMIT) {
          setIdeaSessionActive(false);
          setIdeaSuccess("Ideas session complete. You can now send your best draft to Mark my letter.");
        }
        return next;
      });
    } catch (err) {
      const message =
        err?.response?.data?.error || err.message || `Could not fetch ideas from ${coachDisplayName}.`;
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
            <p style={{ ...styles.helperText, margin: "0 0 4px 0" }}>
              {isFrenchProgram ? "French writing coach" : "Schreiben trainer"}
            </p>
            <h2 style={{ ...styles.sectionTitle, margin: 0 }}>
              {canUseIdeasGenerator
                ? isExamMode
                  ? isFrenchProgram
                    ? "French writing help + ideas"
                    : "Timed letters + Herr Felix ideas"
                  : isFrenchProgram
                    ? "Mark my letter + French ideas"
                    : "Mark my letter + Herr Felix ideas"
                : "Mark my letter"}
            </h2>
            <p style={{ ...styles.helperText, margin: "6px 0 0 0" }}>
              {canUseIdeasGenerator ? (
                isExamMode ? (
                  <>
                    {isFrenchProgram
                      ? "Start with a draft in French, then paste it into “Mark my letter”. Use the ideas generator to stay organized."
                      : 'Start with a timed practice letter, then paste your draft into "Mark my letter". Use the ideas generator (prompts in '}
                    {isFrenchProgram ? null : <code>functions/functionz/prompts.js</code>}
                    {isFrenchProgram ? null : ") to keep moving."}
                  </>
                ) : (
                  isFrenchProgram
                    ? "Timed practice lives in the Exams Room. Here you can paste French drafts for marking and use the ideas generator to build your letter."
                    : "Timed practice lives in the Exams Room. Here you can paste drafts for marking and use the ideas generator to build your letter."
                )
              ) : (
                "A1 students use Mark my letter only."
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

      {activeTab === "practice" && canUsePracticeLetters && (
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
                        {formatTimeUnit("minute", item.durationMinutes)} • {item.situation}
                      </p>
                      {item.tags?.length ? (
                        <div style={styles.tagRow}>
                          {item.tags.map((tag) => (
                            <span key={`${item.id}-${tag}`} style={styles.tagPill}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
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
                      <span style={styles.badge}>
                        {t("letterPractice.minuteTarget", {
                          time: formatTimeUnit("minute", selectedLetter.durationMinutes),
                        })}
                      </span>
                      {selectedLetter.tags?.length ? (
                        <div style={styles.tagRow}>
                          {selectedLetter.tags.map((tag) => (
                            <span key={`${selectedLetter.id}-${tag}`} style={styles.tagPill}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
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
                      style={styles.primaryButton}
                      onClick={sendLetterToIdeasTab}
                    >
                      Send prompt to ideas
                    </button>
                    <button
                      style={styles.secondaryButton}
                      onClick={sendLetterToMarkTab}
                    >
                      Send prompt to marking
                    </button>
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
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <label style={styles.label}>Level for feedback</label>
                {isLevelLocked && <span style={styles.badge}>From student profile</span>}
              </div>
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
                <strong>{isFrenchProgram ? "Note" : "Hinweis"}:</strong> {error}
              </div>
            )}

            {markFeedback && (
              <div style={{ display: "grid", gap: 10 }}>
                <div>
                  <h4 style={styles.sectionTitle}>AI feedback</h4>
                  <pre style={{ ...styles.pre, whiteSpace: "pre-wrap" }}>{markFeedback}</pre>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {activeTab === "ideas" && canUseIdeasGenerator && (
        <section style={styles.card} className="idea-generator-card">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, flexWrap: "wrap" }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <label style={styles.label}>Level for coaching</label>
                {isLevelLocked && <span style={styles.badge}>From student profile</span>}
              </div>
              <select
                value={level}
                onChange={(e) => {
                  setLevel(e.target.value);
                  resetErrors();
                }}
                style={styles.select}
                disabled={isLevelLocked}
              >
                {ALLOWED_LEVELS.map((option) => (
                  <option key={option}>{option}</option>
                ))}
              </select>
            </div>
            <span style={styles.levelPill}>Prompt bank in /functions/functionz/prompts.js</span>
          </div>
          <div style={styles.infoBox}>
            <strong>Use the coach to learn from your ideas:</strong>
            <ul style={styles.promptList}>
              {IDEAS_COACHING_PROMPTS.map((prompt) => (
                <li key={prompt}>{prompt}</li>
              ))}
            </ul>
            <p style={{ ...styles.helperText, margin: "6px 0 0 0" }}>
              Session status: <strong>{ideaSessionActive ? "Active" : "Ended"}</strong> · Turns used: {ideaTurnCount}/{IDEAS_SESSION_TURN_LIMIT}
            </p>
          </div>

          <div style={{ ...styles.chatLog, marginTop: 12 }} className="idea-generator-chat">
            {chatMessages.map((msg, idx) => (
              <div
                key={msg.id || `${msg.role}-${idx}`}
                style={msg.role === "assistant" ? styles.chatBubbleCoach : styles.chatBubbleUser}
                className={`idea-generator-bubble ${msg.role === "assistant" ? "idea-generator-bubble--coach" : "idea-generator-bubble--user"}`}
              >
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

          <div
            style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}
            className="idea-generator-actions"
          >
            <button style={styles.primaryButton} onClick={handleAskForIdeas} disabled={ideasLoading}>
              {ideasLoading ? "Coach is typing..." : "Send to ideas coach"}
            </button>
            <button style={styles.secondaryButton} onClick={startIdeasSession}>
              {ideaSessionActive ? "Restart ideas session" : "Start ideas session"}
            </button>
            <button style={styles.secondaryButton} onClick={endIdeasSession} disabled={!ideaSessionActive}>
              End ideas session
            </button>
            <button
              style={styles.secondaryButton}
              onClick={() => {
                setChatMessages([ideaCoachIntro]);
                setIdeaInput("");
                resetErrors();
                setSelectedDraftIds([]);
                setIdeaSessionActive(false);
                setIdeaTurnCount(0);
              }}
            >
              Reset chat
            </button>
          </div>

          {ideaError && (
            <div style={{ ...styles.errorBox, marginTop: 8 }}>
              <strong>{isFrenchProgram ? "Note" : "Hinweis"}:</strong> {ideaError}
            </div>
          )}

          <div style={{ marginTop: 16 }}>
            <h4 style={styles.resultHeading}>Preview & quick copy</h4>
            <p style={styles.helperText}>
              Choose parts from your chat messages or use the live preview below.
              We will place them in the “Mark my letter” tab so you can get them graded quickly.
            </p>
            <div style={styles.gridTwo} className="idea-generator-grid">
              <div
                style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}
                className="idea-generator-panel"
              >
                <div style={styles.metaRow}>
                  <div style={{ fontWeight: 800 }}>Live preview</div>
                  <span style={styles.badge}>Visible only to you</span>
                </div>
                <p style={styles.helperText}>
                  See what you're typing before you send it.
                </p>
                <div
                  style={{
                    border: "1px dashed #d1d5db",
                    borderRadius: 10,
                    padding: 10,
                    minHeight: 80,
                    background: "#f8fafc",
                    whiteSpace: "pre-wrap",
                  }}
                  className="idea-generator-preview"
                >
                  {ideaInput.trim() || "No draft typed yet."}
                </div>
              </div>

              <div
                style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}
                className="idea-generator-panel"
              >
                <div style={styles.metaRow}>
                  <div style={{ fontWeight: 800 }}>Pick from your chat</div>
                  <span style={styles.badge}>{userMessages.length} drafts</span>
                </div>
                {userMessages.length === 0 ? (
                  <p style={styles.helperText}>
                    Send a question in the chat, then you can select your own messages here.
                  </p>
                ) : (
                  <div
                    style={{ display: "grid", gap: 8, maxHeight: 200, overflowY: "auto" }}
                    className="idea-generator-drafts"
                  >
                    {userMessages.map((msg) => (
                      <label
                        key={msg.id}
                        style={{
                          display: "flex",
                          gap: 10,
                          alignItems: "flex-start",
                          border: "1px solid #e5e7eb",
                          borderRadius: 10,
                          padding: 10,
                          background: selectedDraftIds.includes(msg.id) ? "#eef2ff" : "#f9fafb",
                          cursor: "pointer",
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedDraftIds.includes(msg.id)}
                          onChange={() => toggleDraftSelection(msg.id)}
                          style={{ marginTop: 4 }}
                        />
                        <div>
                          <div style={{ fontWeight: 700, fontSize: 13, color: "#1f2937" }}>Your chat entry</div>
                          <p style={{ ...styles.helperText, marginBottom: 0, whiteSpace: "pre-wrap" }}>
                            {msg.content}
                          </p>
                        </div>
                      </label>
                    ))}
                  </div>
                )}
                <button
                  style={{ ...styles.primaryButton, marginTop: 10 }}
                  onClick={sendDraftsToMarkTab}
                >
                  Send to “Mark my letter”
                </button>
                {ideaSuccess && (
                  <div style={{ ...styles.successBox, marginTop: 8 }}>
                    {ideaSuccess}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <ResultHistory results={resultHistory} />
    </div>
  );
};

export default LetterPracticePage;
