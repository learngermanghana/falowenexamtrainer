import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";
import { useExam, ALLOWED_LEVELS } from "../context/ExamContext";
import ResultHistory from "./ResultHistory";
import { fetchIdeasFromCoach, fetchWritingLetters, markLetterWithAI } from "../services/coachService";
import { useAuth } from "../context/AuthContext";
import { writingLetters as courseWritingLetters } from "../data/writingLetters";
import { WRITING_PROMPTS } from "../data/writingExamPrompts";

const DEFAULT_EXAM_TIMINGS = {
  A1: 20,
  A2: 25,
  B1: 30,
  B2: 35,
  C1: 40,
};

const IDEA_COACH_INTRO = {
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
  const [ideasLoading, setIdeasLoading] = useState(false);
  const [ideaError, setIdeaError] = useState("");
  const [markFeedback, setMarkFeedback] = useState("");
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
            "Keine Schreibaufgaben aus dem Sheet gefunden – zeige Beispiele."
          );
        }
      } catch (err) {
        console.error("Failed to load writing tasks", err);
        if (!isMounted) return;

        setWritingTasks(courseWritingLetters);
        setWritingTasksError(
          "Konnte Schreibaufgaben nicht laden. Zeige lokale Beispieldaten."
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
    }
  };

  const validateSelections = () => {
    if (!ALLOWED_LEVELS.includes(level)) {
      setError("Bitte wähle ein gültiges Niveau (A1–B2).");
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

  const addChatMessage = (role, content) => {
    setChatMessages((prev) => [...prev, { role, content }]);
  };

  const handleAskCoach = async () => {
    const trimmed = ideaInput.trim();
    if (!trimmed || ideasLoading) return;

    setIdeaError("");
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
          Zeit für diese Aufgabe: {selectedLetter?.durationMinutes || 0} Minuten
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
        <h2 style={styles.sectionTitle}>Schreiben – Prüfungsbriefe trainieren</h2>
        <p style={styles.helperText}>
          Wähle einen Brief, schreibe mit Timer, lass deinen Text bewerten oder
          frag den Ideen-Generator nach Formulierungen.
        </p>
        <div style={styles.tabList} className="tab-list">
          {[
            { key: "practice", label: "Übungsbriefe" },
            { key: "mark", label: "Mark my letter" },
            { key: "ideas", label: "Ideen-Generator" },
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
            <h3 style={styles.sectionTitle}>Briefe aus der Übungsvorlage</h3>
            {writingTasksError && (
              <p style={{ ...styles.helperText, color: "#b91c1c" }}>
                {writingTasksError}
              </p>
            )}
            {writingTasksLoading ? (
              <p style={styles.helperText}>Lade Schreibaufgaben aus dem Sheet ...</p>
            ) : visibleWritingTasks.length === 0 ? (
              <p style={styles.helperText}>
                Keine Schreibaufgaben für dieses Niveau verfügbar. Bitte passe dein
                Level an oder versuche es später erneut.
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
                      <span style={styles.levelPill}>Niveau {item.level}</span>
                    </div>
                    <p style={styles.helperText}>{item.situation}</p>
                    <div style={styles.metaRow}>
                      <span style={styles.badge}>
                        ⏱️ {item.durationMinutes} Minuten
                      </span>
                      <button
                        style={
                          selectedLetterId === item.id
                            ? styles.primaryButton
                            : styles.secondaryButton
                        }
                        onClick={() => setSelectedLetterId(item.id)}
                      >
                        {selectedLetterId === item.id ? "Gewählt" : "Üben"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>

          <section style={styles.card}>
            <h3 style={styles.sectionTitle}>Dein Simulationsraum</h3>
            {practiceTimerControls}
            {selectedLetter && (
              <>
                <div style={styles.badge}>Thema: {selectedLetter.letter}</div>
                <p style={styles.helperText}>{selectedLetter.situation}</p>
                <h4 style={styles.resultHeading}>Checkliste</h4>
                <ul style={styles.checklist}>
                  {(selectedLetter.whatToInclude || []).map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </>
            )}
            <div style={{ marginTop: 12 }}>
              <label style={styles.label}>Dein Entwurf</label>
              <textarea
                style={styles.textArea}
                placeholder="Schreibe deinen Brief hier, während der Timer läuft..."
                value={practiceDraft}
                onChange={(e) => setPracticeDraft(e.target.value)}
                rows={7}
              />
            </div>
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
                  <span style={styles.badge}>Aus Profil</span>
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
                <strong>Hinweis:</strong> {error}
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
          <h3 style={styles.sectionTitle}>Ideen-Generator</h3>
          <p style={styles.helperText}>
            Füge deine Aufgabenstellung ein und chatte nur in einem Feld. Herr
            Felix antwortet Schritt für Schritt mit dem neuen Coaching-Prompt.
          </p>
          <div style={styles.chatLog}>
            {chatMessages.map((msg, idx) => (
              <div
                key={`${msg.role}-${idx}`}
                style={
                  msg.role === "assistant"
                    ? styles.chatBubbleCoach
                    : styles.chatBubbleUser
                }
              >
                <strong style={{ display: "block", marginBottom: 4 }}>
                  {msg.role === "assistant" ? "Coach" : "Du"}
                </strong>
                <span>{msg.content}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={styles.label}>Deine Frage (ein Feld)</label>
            <textarea
              style={styles.textareaSmall}
              value={ideaInput}
              onChange={(e) => setIdeaInput(e.target.value)}
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
              Chat zurücksetzen
            </button>
          </div>

          {ideaError && (
            <div style={{ ...styles.errorBox, marginTop: 8 }}>
              <strong>Hinweis:</strong> {ideaError}
            </div>
          )}
        </section>
      )}
    </>
  );
};

export default WritingPage;
