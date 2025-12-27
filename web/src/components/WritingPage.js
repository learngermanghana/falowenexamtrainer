import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";
import { useExam, ALLOWED_LEVELS } from "../context/ExamContext";
import ResultHistory from "./ResultHistory";
import { fetchIdeasFromCoach, fetchWritingLetters, markLetterWithAI } from "../services/coachService";
import { useAuth } from "../context/AuthContext";
import { writingLetters as courseWritingLetters } from "../data/writingLetters";
import { WRITING_PROMPTS } from "../data/writingExamPrompts";
import { loadWritingProgress, saveWritingProgress } from "../services/writingProgressService";

const DEFAULT_EXAM_TIMINGS = {
  A1: 15,
  A2: 20,
  B1: 20,
  B2: 20,
  C1: 40,
};

const IDEA_COACH_INTRO = {
  id: "intro",
  role: "assistant",
  content:
    "Paste your exam question or draft idea, and I'll guide you step by step with Herr Felix's coaching prompts.",
};

const mapExamPromptsToLetters = (prompts) =>
  Object.entries(prompts).flatMap(([level, entries]) =>
    (entries || []).map((item, index) => ({
      id: `${level.toLowerCase()}-${index + 1}`,
      letter: `${level}: ${item.Thema}`,
      level,
      durationMinutes: DEFAULT_EXAM_TIMINGS[level] || 20,
      situation: item.Thema,
      whatToInclude: item.Punkte || [],
    }))
  );

const WritingPage = ({ mode = "course" }) => {
  const {
    level,
    setLevel,
    resultHistory,
    addResultToHistory,
    error,
    setError,
    loading,
    setLoading,
  } = useExam();
  const { user, idToken, studentProfile } = useAuth();
  const userId = user?.uid;
  const studentCode =
    studentProfile?.studentCode || studentProfile?.studentcode || user?.uid || "";
  const isExamMode = mode === "exam";

  const examWritingLetters = useMemo(
    () => mapExamPromptsToLetters(WRITING_PROMPTS),
    []
  );

  const [activeTab, setActiveTab] = useState("practice");
  const [writingTasks, setWritingTasks] = useState(() =>
    isExamMode ? examWritingLetters : courseWritingLetters
  );
  const [writingTasksLoading, setWritingTasksLoading] = useState(!isExamMode);
  const [writingTasksError, setWritingTasksError] = useState("");
  const [typedAnswer, setTypedAnswer] = useState("");
  const [practiceDraft, setPracticeDraft] = useState("");
  const [ideaInput, setIdeaInput] = useState("");
  const [chatMessages, setChatMessages] = useState([IDEA_COACH_INTRO]);
  const [selectedDraftIds, setSelectedDraftIds] = useState([]);
  const [ideasLoading, setIdeasLoading] = useState(false);
  const [ideaError, setIdeaError] = useState("");
  const [ideaSuccess, setIdeaSuccess] = useState("");
  const [markFeedback, setMarkFeedback] = useState("");
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [selectedLetterId, setSelectedLetterId] = useState(() => {
    const initialList = isExamMode
      ? examWritingLetters.filter((task) => task.level === level)
      : courseWritingLetters;
    return initialList[0]?.id || "";
  });
  const visibleWritingTasks = useMemo(() => {
    if (isExamMode) {
      return writingTasks.filter((task) => task.level === level);
    }

    return writingTasks;
  }, [isExamMode, level, writingTasks]);
  const selectedLetter = useMemo(
    () => visibleWritingTasks.find((item) => item.id === selectedLetterId),
    [selectedLetterId, visibleWritingTasks]
  );
  const [remainingSeconds, setRemainingSeconds] = useState(
    (selectedLetter?.durationMinutes || 0) * 60
  );
  const [timerRunning, setTimerRunning] = useState(false);
  const normalizeProfileLevel = (rawLevel) => {
    const normalized = (rawLevel || "").trim().toUpperCase();
    if (ALLOWED_LEVELS.includes(normalized)) {
      return normalized;
    }

    const fuzzyMatch = ALLOWED_LEVELS.find((allowed) =>
      normalized.startsWith(allowed)
    );

    return fuzzyMatch || "";
  };

  const profileLevel = normalizeProfileLevel(studentProfile?.level);
  const isLevelLocked = ALLOWED_LEVELS.includes(profileLevel);
  const progressMode = isExamMode ? "exam" : "course";

  useEffect(() => {
    if (isLevelLocked && profileLevel !== level) {
      setLevel(profileLevel);
    }
  }, [isLevelLocked, level, profileLevel, setLevel]);

  useEffect(() => {
    let isMounted = true;

    if (isExamMode) {
      setWritingTasks(examWritingLetters);
      setWritingTasksError("");
      setWritingTasksLoading(false);
      return () => {
        isMounted = false;
      };
    }

    const loadWritingTasks = async () => {
      setWritingTasksLoading(true);
      try {
        const tasks = await fetchWritingLetters(undefined, idToken);

        if (!isMounted) return;

        if (tasks.length > 0) {
          setWritingTasks(tasks);
          setWritingTasksError("");
        } else {
          setWritingTasks(courseWritingLetters);
          setWritingTasksError(
            "No writing tasks found in the sheet – showing sample prompts instead."
          );
        }
      } catch (err) {
        console.error("Failed to load writing tasks", err);
        if (!isMounted) return;

        setWritingTasks(courseWritingLetters);
        setWritingTasksError(
          "Could not load writing tasks. Showing local example data."
        );
      } finally {
        if (isMounted) setWritingTasksLoading(false);
      }
    };

    loadWritingTasks();

    return () => {
      isMounted = false;
    };
  }, [examWritingLetters, idToken, isExamMode]);

  useEffect(() => {
    if (!visibleWritingTasks.length) return;
    if (
      !selectedLetterId ||
      !visibleWritingTasks.some((item) => item.id === selectedLetterId)
    ) {
      setSelectedLetterId(visibleWritingTasks[0].id);
    }
  }, [selectedLetterId, visibleWritingTasks]);

  useEffect(() => {
    if (selectedLetter) {
      setRemainingSeconds(selectedLetter.durationMinutes * 60);
      setTimerRunning(false);
    }
  }, [selectedLetter]);

  useEffect(() => {
    if (!timerRunning) return;

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          setTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timerRunning]);

  useEffect(() => {
    let isMounted = true;

    const resetProgressState = () => {
      setTypedAnswer("");
      setMarkFeedback("");
      setIdeaInput("");
      setChatMessages([IDEA_COACH_INTRO]);
      setSelectedDraftIds([]);
    };

    const loadProgress = async () => {
      if (!userId) {
        resetProgressState();
        setProgressLoaded(true);
        return;
      }

      setProgressLoaded(false);
      try {
        const saved = await loadWritingProgress({ userId, studentCode, mode: progressMode });
        if (!isMounted) return;

        if (!saved) {
          resetProgressState();
          return;
        }

        if (typeof saved.typedAnswer === "string") setTypedAnswer(saved.typedAnswer);
        if (typeof saved.markFeedback === "string") setMarkFeedback(saved.markFeedback);
        if (typeof saved.ideaInput === "string") setIdeaInput(saved.ideaInput);
        if (Array.isArray(saved.chatMessages) && saved.chatMessages.length > 0) {
          setChatMessages(saved.chatMessages);
        } else {
          setChatMessages([IDEA_COACH_INTRO]);
        }
        if (Array.isArray(saved.selectedDraftIds)) {
          setSelectedDraftIds(saved.selectedDraftIds);
        } else {
          setSelectedDraftIds([]);
        }
      } catch (err) {
        console.error("Failed to load writing progress", err);
      } finally {
        if (isMounted) setProgressLoaded(true);
      }
    };

    loadProgress();

    return () => {
      isMounted = false;
    };
  }, [progressMode, userId]);

  useEffect(() => {
    if (!progressLoaded || (!userId && !studentCode)) return;

    const timeout = setTimeout(() => {
      saveWritingProgress({
        userId,
        studentCode,
        mode: progressMode,
        data: {
          typedAnswer,
          markFeedback,
          ideaInput,
          chatMessages,
          selectedDraftIds,
        },
      }).catch((err) => {
        console.error("Failed to save writing progress", err);
      });
    }, 800);

    return () => clearTimeout(timeout);
  }, [
    chatMessages,
    ideaInput,
    markFeedback,
    progressLoaded,
    progressMode,
    selectedDraftIds,
    typedAnswer,
    userId,
    studentCode,
  ]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = (seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleTabChange = (tabKey) => {
    setActiveTab(tabKey);
    setError("");
    if (tabKey !== "mark") {
      setMarkFeedback("");
    }
    if (tabKey !== "ideas") {
      setIdeaError("");
      setIdeaSuccess("");
    }
  };

  const validateSelections = () => {
    if (!ALLOWED_LEVELS.includes(level)) {
      setError("Please choose a valid level (A1–B2).");
      return false;
    }

    setError("");
    return true;
  };

  const sendTypedAnswerForCorrection = async () => {
    const trimmed = typedAnswer.trim();

    if (!trimmed) {
      alert("Please paste or type your letter before sending.");
      return;
    }

    if (!validateSelections()) {
      return;
    }

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
      const enrichedResult = {
        id: Date.now(),
        mode: "Mark my letter",
        level,
        comments: data.feedback,
        createdAt: new Date().toISOString(),
      };
      setMarkFeedback(data.feedback);
      addResultToHistory(enrichedResult);
    } catch (err) {
      console.error("Falowen frontend error:", err);
      const msg =
        err?.response?.data?.error ||
        err.message ||
        "Falowen Learning Hub: Error sending text for analysis.";
      setError(msg);
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

    setTypedAnswer((prev) => {
      const existing = prev.trim();
      const parts = [existing, combinedDraft].filter(Boolean);
      return parts.join("\n\n");
    });
    setError("");
    setMarkFeedback("");
    setIdeaSuccess("Your selected lines are now pasted into the “Mark my letter” tab.");
    setIdeaError("");
    setSelectedDraftIds([]);
    setActiveTab("mark");
  };

  const handleAskCoach = async () => {
    const trimmed = ideaInput.trim();
    if (!trimmed || ideasLoading) return;

    setIdeaError("");
    setIdeaSuccess("");
    const userMessage = makeChatMessage("user", trimmed);
    const updatedMessages = [...chatMessages, userMessage];
    setChatMessages(updatedMessages);
    setIdeaInput("");
    setIdeasLoading(true);

    try {
      const payloadMessages = updatedMessages.map(({ role, content }) => ({
        role,
        content,
      }));
      const { reply } = await fetchIdeasFromCoach({
        messages: payloadMessages,
        level,
        idToken,
      });
      addChatMessage("assistant", reply);
    } catch (err) {
      console.error("Ideas generator error:", err);
      const msg =
        err?.response?.data?.error ||
        err.message ||
        "Could not fetch ideas from Herr Felix.";
      setIdeaError(msg);
    } finally {
      setIdeasLoading(false);
    }
  };

  const practiceTimerControls = (
    <div style={styles.metaRow}>
      <div>
        <div style={styles.timer}>{formatTime(remainingSeconds)}</div>
        <div style={styles.timerHelp}>
          Time for this task: {selectedLetter?.durationMinutes || 0} minutes
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button
          style={styles.primaryButton}
          onClick={() => setTimerRunning(true)}
          disabled={timerRunning || !remainingSeconds}
        >
          Start
        </button>
        <button
          style={styles.secondaryButton}
          onClick={() => setTimerRunning(false)}
          disabled={!timerRunning}
        >
          Pause
        </button>
        <button
          style={styles.dangerButton}
          onClick={() => {
            setTimerRunning(false);
            setRemainingSeconds((selectedLetter?.durationMinutes || 0) * 60);
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );

  return (
    <>
      <section style={styles.card}>
        <h2 style={styles.sectionTitle}>Writing – Practice exam letters</h2>
        <p style={styles.helperText}>
          Choose a letter, write with the timer, get your text graded, or ask the idea generator for wording help.
        </p>
        <div style={styles.tabList} className="tab-list">
          {[
            { key: "practice", label: "Practice letters" },
            { key: "mark", label: "Mark my letter" },
            { key: "ideas", label: "Idea generator" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className="tab-button"
              style={
                activeTab === tab.key ? styles.tabButtonActive : styles.tabButton
              }
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      {activeTab === "practice" && (
        <>
          <section style={styles.card}>
            <h3 style={styles.sectionTitle}>Your simulation room</h3>
            {practiceTimerControls}
            {selectedLetter && (
              <>
                <div style={styles.badge}>Topic: {selectedLetter.letter}</div>
                <p style={styles.helperText}>{selectedLetter.situation}</p>
                <h4 style={styles.resultHeading}>Checklist</h4>
                <ul style={styles.checklist}>
                  {(selectedLetter.whatToInclude || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            )}
            <div style={{ marginTop: 12 }}>
              <label style={styles.label}>Your draft</label>
              <textarea
                style={styles.textArea}
                placeholder="Write your letter here while the timer is running..."
                value={practiceDraft}
                onChange={(e) => setPracticeDraft(e.target.value)}
                rows={7}
              />
            </div>
          </section>

          <section style={styles.card}>
            <h3 style={styles.sectionTitle}>Letters from the practice set</h3>
            {writingTasksError && (
              <p style={{ ...styles.helperText, color: "#b91c1c" }}>
                {writingTasksError}
              </p>
            )}
            {writingTasksLoading ? (
              <p style={styles.helperText}>Loading writing tasks from the sheet ...</p>
            ) : visibleWritingTasks.length === 0 ? (
              <p style={styles.helperText}>
                No writing tasks are available for this level. Please adjust your level or try again later.
              </p>
            ) : (
              <div style={styles.gridTwo}>
                {visibleWritingTasks.map((item) => (
                  <div
                    key={item.id}
                    style={{
                      border: "1px solid #e5e7eb",
                      borderRadius: 12,
                      padding: 12,
                      background:
                        selectedLetterId === item.id ? "#eff6ff" : "#f9fafb",
                      boxShadow:
                        selectedLetterId === item.id
                          ? "0 8px 18px rgba(37,99,235,0.15)"
                          : "none",
                    }}
                  >
                    <div style={styles.metaRow}>
                      <div style={{ fontWeight: 800 }}>{item.letter}</div>
                      <span style={styles.levelPill}>Level {item.level}</span>
                    </div>
                    <p style={styles.helperText}>{item.situation}</p>
                    <div style={styles.metaRow}>
                      <span style={styles.badge}>
                        ⏱️ {item.durationMinutes} minutes
                      </span>
                      <button
                        style={
                          selectedLetterId === item.id
                            ? styles.primaryButton
                            : styles.secondaryButton
                        }
                        onClick={() => setSelectedLetterId(item.id)}
                      >
                        {selectedLetterId === item.id ? "Selected" : "Practice"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}

      {activeTab === "mark" && (
        <>
          <section style={styles.card}>
            <h3 style={styles.sectionTitle}>Mark my letter</h3>
            <p style={styles.helperText}>
              Paste your finished letter in one box. Herr Felix will score it with the new rubric and highlight what to fix.
            </p>

            <div style={{ display: "grid", gap: 8, marginBottom: 10 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <label style={styles.label}>Level for feedback</label>
                {isLevelLocked && (
                  <span style={styles.badge}>From profile</span>
                )}
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

            <label style={styles.label}>Your letter (single box)</label>
            <textarea
              value={typedAnswer}
              onChange={(e) => {
                setError("");
                setTypedAnswer(e.target.value);
              }}
              placeholder="Paste your finished letter or essay here for marking..."
              style={styles.textArea}
              rows={9}
            />

            <div style={{ marginTop: 12 }}>
              <button
                style={styles.primaryButton}
                onClick={sendTypedAnswerForCorrection}
                disabled={loading}
              >
                {loading ? "Getting feedback..." : "Get AI feedback"}
              </button>
            </div>

            {error && (
              <div style={styles.errorBox}>
                <strong>Note:</strong> {error}
              </div>
            )}
          </section>

          {markFeedback && (
            <section style={styles.card}>
              <h3 style={styles.sectionTitle}>AI feedback</h3>
              <pre style={{ ...styles.pre, whiteSpace: "pre-wrap" }}>{markFeedback}</pre>
            </section>
          )}

          <ResultHistory results={resultHistory} />
        </>
      )}

      {activeTab === "ideas" && (
        <section style={styles.card}>
          <h3 style={styles.sectionTitle}>Idea generator</h3>
          <p style={styles.helperText}>
            Paste your task and chat in a single field. Herr Felix replies step by step with the updated coaching prompt.
          </p>
          <div style={styles.chatLog}>
            {chatMessages.map((msg, idx) => (
              <div
                key={msg.id || `${msg.role}-${idx}`}
                style={
                  msg.role === "assistant"
                    ? styles.chatBubbleCoach
                    : styles.chatBubbleUser
                }
              >
                <strong style={{ display: "block", marginBottom: 4 }}>
                  {msg.role === "assistant" ? "Coach" : "You"}
                </strong>
                <span>{msg.content}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={styles.label}>Your prompt (single box)</label>
            <textarea
              style={styles.textareaSmall}
              value={ideaInput}
              onChange={(e) => {
                setIdeaInput(e.target.value);
                setIdeaError("");
                setIdeaSuccess("");
              }}
              placeholder="Paste your exam question or the part you need help with."
              rows={3}
            />
          </div>
          <div style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}>
            <button
              style={styles.primaryButton}
              onClick={handleAskCoach}
              disabled={ideasLoading}
            >
              {ideasLoading ? "Coach is typing..." : "Send to AI coach"}
            </button>
            <button
              style={styles.secondaryButton}
              onClick={() => {
                setChatMessages([IDEA_COACH_INTRO]);
                setIdeaError("");
                setIdeaInput("");
              }}
            >
              Reset chat
            </button>
          </div>

          {ideaError && (
            <div style={{ ...styles.errorBox, marginTop: 8 }}>
              <strong>Note:</strong> {ideaError}
            </div>
          )}

          <div style={{ marginTop: 16 }}>
            <h4 style={styles.resultHeading}>Preview & quick copy</h4>
            <p style={styles.helperText}>
              Choose parts from your chat messages or use the live preview below.
              We will place them in the “Mark my letter” tab so you can get them graded quickly.
            </p>
            <div style={styles.gridTwo}>
              <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
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
                >
                  {ideaInput.trim() || "No draft typed yet."}
                </div>
              </div>

              <div style={{ border: "1px solid #e5e7eb", borderRadius: 12, padding: 12 }}>
                <div style={styles.metaRow}>
                  <div style={{ fontWeight: 800 }}>Pick from your chat</div>
                  <span style={styles.badge}>{userMessages.length} drafts</span>
                </div>
                {userMessages.length === 0 ? (
                  <p style={styles.helperText}>
                    Send a question in the chat, then you can select your own messages here.
                  </p>
                ) : (
                  <div style={{ display: "grid", gap: 8, maxHeight: 200, overflowY: "auto" }}>
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
    </>
  );
};

export default WritingPage;
