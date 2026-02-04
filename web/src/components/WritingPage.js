import React, { useCallback, useEffect, useMemo, useState } from "react";
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
    "This is a chat between you and the ideas generator. Paste your exam question or draft idea, and I'll guide you step by step with Herr Felix's coaching prompts.",
};

const WORD_TARGETS = {
  A1: "30–50 words",
  A2: "50–80 words",
  B1: "80–120 words",
  B2: "120–180 words",
  C1: "180–220 words",
};

const WORD_TARGET_RANGES = {
  A1: { min: 30, max: 50 },
  A2: { min: 50, max: 80 },
  B1: { min: 80, max: 120 },
  B2: { min: 120, max: 180 },
  C1: { min: 180, max: 220 },
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

const WordCountMeter = ({ count, range }) => {
  if (!range) return null;
  const progress = Math.min((count / range.max) * 100, 100);
  const isBelow = count < range.min;
  const isAbove = count > range.max;
  const status = isBelow
    ? `Add ${range.min - count} words to reach ${range.min}.`
    : isAbove
      ? `Above target by ${count - range.max} words.`
      : "On target for your level.";

  return (
    <div style={{ marginTop: 8 }}>
      <div
        style={{
          height: 10,
          borderRadius: 999,
          background: "#e5e7eb",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${progress}%`,
            background: isAbove ? "#f97316" : "#2563eb",
            transition: "width 0.2s ease",
          }}
        />
      </div>
      <p style={{ ...styles.helperText, margin: "6px 0 0 0" }}>
        Target: {range.min}–{range.max} words. {status}
      </p>
    </div>
  );
};

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
  const [mockExamMode, setMockExamMode] = useState(false);
  const [rubricChecklist, setRubricChecklist] = useState({
    task: false,
    coherence: false,
    grammar: false,
  });
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
  const activeTargetLevel = selectedLetter?.level || level;
  const wordTarget = WORD_TARGETS[activeTargetLevel];
  const wordRange = WORD_TARGET_RANGES[activeTargetLevel];
  const mockHintsLocked = mockExamMode && remainingSeconds > 0;

  useEffect(() => {
    if (isLevelLocked && profileLevel !== level) {
      setLevel(profileLevel);
    }
  }, [isLevelLocked, level, profileLevel, setLevel]);

  const loadWritingTasks = useCallback(async () => {
    setWritingTasksLoading(true);
    setWritingTasksError("");
    try {
      const tasks = await fetchWritingLetters(undefined, idToken);

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
      setWritingTasks(courseWritingLetters);
      setWritingTasksError(
        "Could not load writing tasks. Showing local example data."
      );
    } finally {
      setWritingTasksLoading(false);
    }
  }, [idToken]);

  useEffect(() => {
    if (isExamMode) {
      setWritingTasks(examWritingLetters);
      setWritingTasksError("");
      setWritingTasksLoading(false);
      return;
    }

    loadWritingTasks();
  }, [examWritingLetters, isExamMode, loadWritingTasks]);

  useEffect(() => {
    if (!visibleWritingTasks.length) return;
    if (
      !selectedLetterId ||
      !visibleWritingTasks.some((item) => item.id === selectedLetterId)
    ) {
      setSelectedLetterId(visibleWritingTasks[0].id);
    }
  }, [selectedLetterId, visibleWritingTasks]);

  const selectedDurationMinutes = selectedLetter?.durationMinutes;

  useEffect(() => {
    if (typeof selectedDurationMinutes === "number") {
      setRemainingSeconds(selectedDurationMinutes * 60);
      setTimerRunning(false);
    }
  }, [selectedDurationMinutes]);

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
      setPracticeDraft("");
      setMarkFeedback("");
      setIdeaInput("");
      setChatMessages([IDEA_COACH_INTRO]);
      setSelectedDraftIds([]);
      setIdeaSuccess("");
      setRemainingSeconds((selectedDurationMinutes || 0) * 60);
      setTimerRunning(false);
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
        if (typeof saved.practiceDraft === "string") setPracticeDraft(saved.practiceDraft);
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
        if (typeof saved.remainingSeconds === "number") {
          setRemainingSeconds(saved.remainingSeconds);
        }
        if (typeof saved.timerRunning === "boolean") {
          setTimerRunning(saved.timerRunning);
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
  }, [progressMode, selectedDurationMinutes, studentCode, userId]);

  useEffect(() => {
    if (!progressLoaded || (!userId && !studentCode)) return;

    const timeout = setTimeout(() => {
      saveWritingProgress({
        userId,
        studentCode,
        mode: progressMode,
        data: {
          typedAnswer,
          practiceDraft,
          markFeedback,
          ideaInput,
          chatMessages,
          selectedDraftIds,
          remainingSeconds,
          timerRunning,
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
    practiceDraft,
    progressLoaded,
    progressMode,
    remainingSeconds,
    selectedDraftIds,
    timerRunning,
    typedAnswer,
    userId,
    studentCode,
  ]);

  const countWords = (value) => {
    const trimmed = value.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  };

  const handleExportDraft = () => {
    const trimmed = typedAnswer.trim();
    if (!trimmed) {
      alert("Please add your final draft before exporting.");
      return;
    }
    const exportWindow = window.open("", "_blank");
    if (!exportWindow) {
      alert("Pop-up blocked. Please allow pop-ups to export your draft.");
      return;
    }
    const title = `Writing Draft – ${level}`;
    exportWindow.document.write(`
      <html>
        <head>
          <title>${title}</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 24px; line-height: 1.6; color: #111827; }
            h1 { font-size: 20px; margin-bottom: 12px; }
            pre { white-space: pre-wrap; font-size: 14px; }
          </style>
        </head>
        <body>
          <h1>${title}</h1>
          <pre>${trimmed.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</pre>
        </body>
      </html>
    `);
    exportWindow.document.close();
    exportWindow.focus();
    exportWindow.print();
  };

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
        program: studentProfile?.program,
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

  const sendPracticeDraftToMarkTab = () => {
    const trimmed = practiceDraft.trim();

    if (!trimmed) {
      alert("Please write your practice draft before sending it to be marked.");
      return;
    }

    setTypedAnswer((prev) => {
      const existing = prev.trim();
      const parts = [existing, trimmed].filter(Boolean);
      return parts.join("\n\n");
    });
    setError("");
    setMarkFeedback("");
    setActiveTab("mark");
  };

  const practiceWordCount = countWords(practiceDraft);
  const typedWordCount = countWords(typedAnswer);
  const typedWordRange = WORD_TARGET_RANGES[level];

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
        program: studentProfile?.program,
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
        <div style={styles.tabList} className="tab-list" role="tablist" aria-label="Writing workflow tabs">
          {[
            { key: "practice", label: "Practice letters" },
            { key: "mark", label: "Mark my letter" },
            { key: "ideas", label: "Idea generator" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
              className="tab-button"
              role="tab"
              aria-selected={activeTab === tab.key}
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
            <div style={{ marginTop: 12, display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
              <label style={{ display: "flex", gap: 8, alignItems: "center", fontSize: 14 }}>
                <input
                  type="checkbox"
                  checked={mockExamMode}
                  onChange={(event) => setMockExamMode(event.target.checked)}
                />
                Mock exam mode (hide hints until timer ends)
              </label>
              {mockExamMode ? (
                <span style={{ ...styles.badge, background: "#fee2e2", color: "#991b1b" }}>
                  Hints locked while timer is running
                </span>
              ) : null}
            </div>
            {selectedLetter && (
              <>
                <div style={styles.badge}>Topic: {selectedLetter.letter}</div>
                <p style={styles.helperText}>{selectedLetter.situation}</p>
                {mockHintsLocked ? (
                  <p style={{ ...styles.helperText, marginTop: 6 }}>
                    Checklist and hints unlock once the timer reaches 00:00.
                  </p>
                ) : (
                  <>
                    <h4 style={styles.resultHeading}>Checklist</h4>
                    <ul style={styles.checklist}>
                      {(selectedLetter.whatToInclude || []).map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </>
                )}
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
              <p style={styles.helperText}>
                Words: {practiceWordCount} · Characters: {practiceDraft.length}
                {!mockHintsLocked && wordTarget ? ` · Target: ${wordTarget}` : ""}
              </p>
              {!mockHintsLocked ? <WordCountMeter count={practiceWordCount} range={wordRange} /> : null}
              <div style={{ marginTop: 10 }}>
                <button
                  style={styles.secondaryButton}
                  onClick={sendPracticeDraftToMarkTab}
                  disabled={!practiceDraft.trim()}
                >
                  Send practice draft to “Mark my letter”
                </button>
              </div>
            </div>
          </section>

          <section style={styles.card}>
            <h3 style={styles.sectionTitle}>Letters from the practice set</h3>
            {writingTasksError && (
              <div style={{ ...styles.helperText, color: "#b91c1c" }}>
                <p style={{ marginBottom: 8 }}>{writingTasksError}</p>
                <button
                  style={styles.secondaryButton}
                  onClick={loadWritingTasks}
                  disabled={writingTasksLoading}
                >
                  {writingTasksLoading ? "Retrying..." : "Retry load"}
                </button>
              </div>
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
            <p style={styles.helperText}>
              Words: {typedWordCount} · Characters: {typedAnswer.length}
              {WORD_TARGETS[level] ? ` · Target: ${WORD_TARGETS[level]}` : ""}
            </p>
            <WordCountMeter count={typedWordCount} range={typedWordRange} />

            <div style={{ marginTop: 12 }}>
              <h4 style={styles.resultHeading}>Final draft rubric checklist</h4>
              <div style={{ display: "grid", gap: 8 }}>
                {[
                  { key: "task", label: "Task completion: all bullet points answered" },
                  { key: "coherence", label: "Coherence: logical order + connectors" },
                  { key: "grammar", label: "Grammar & spelling: quick proofread done" },
                ].map((item) => (
                  <label key={item.key} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input
                      type="checkbox"
                      checked={rubricChecklist[item.key]}
                      onChange={() =>
                        setRubricChecklist((prev) => ({ ...prev, [item.key]: !prev[item.key] }))
                      }
                    />
                    <span>{item.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginTop: 12 }}>
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <button
                  style={styles.primaryButton}
                  onClick={sendTypedAnswerForCorrection}
                  disabled={loading}
                >
                  {loading ? "Getting feedback..." : "Get AI feedback"}
                </button>
                <button style={styles.secondaryButton} type="button" onClick={handleExportDraft}>
                  Export final draft (PDF/print)
                </button>
              </div>
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
        <section style={styles.card} className="idea-generator-card">
          <h3 style={styles.sectionTitle}>Idea generator</h3>
          <p style={styles.helperText}>
            Paste your task and chat in a single field. Herr Felix replies step by step with the updated coaching prompt.
          </p>
          <div style={styles.chatLog} className="idea-generator-chat">
            {chatMessages.map((msg, idx) => (
              <div
                key={msg.id || `${msg.role}-${idx}`}
                style={
                  msg.role === "assistant"
                    ? styles.chatBubbleCoach
                    : styles.chatBubbleUser
                }
                className={`idea-generator-bubble ${msg.role === "assistant" ? "idea-generator-bubble--coach" : "idea-generator-bubble--user"}`}
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
          <div
            style={{ marginTop: 10, display: "flex", gap: 8, flexWrap: "wrap" }}
            className="idea-generator-actions"
          >
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
                setSelectedDraftIds([]);
                setIdeaSuccess("");
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
    </>
  );
};

export default WritingPage;
