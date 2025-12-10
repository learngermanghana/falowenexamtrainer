import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";
import { useExam, ALLOWED_LEVELS, ALLOWED_TEILE } from "../context/ExamContext";
import SettingsForm from "./SettingsForm";
import Feedback from "./Feedback";
import ResultHistory from "./ResultHistory";
import { analyzeText } from "../services/coachService";
import { useAuth } from "../context/AuthContext";
import { writingLetters } from "../data/writingLetters";

const WritingPage = () => {
  const {
    teil,
    level,
    result,
    setResult,
    resultHistory,
    addResultToHistory,
    error,
    setError,
    loading,
    setLoading,
  } = useExam();
  const { user, idToken } = useAuth();
  const userId = user?.uid;

  const [activeTab, setActiveTab] = useState("practice");
  const [typedAnswer, setTypedAnswer] = useState("");
  const [practiceDraft, setPracticeDraft] = useState("");
  const [question, setQuestion] = useState("");
  const [chatMessages, setChatMessages] = useState([
    {
      role: "coach",
      text: "Frag mich nach Formulierungen, Struktur oder Beispielsätzen für deine Prüfung.",
    },
  ]);
  const [selectedLetterId, setSelectedLetterId] = useState(
    writingLetters[0]?.id || ""
  );
  const selectedLetter = useMemo(
    () => writingLetters.find((item) => item.id === selectedLetterId),
    [selectedLetterId]
  );
  const [remainingSeconds, setRemainingSeconds] = useState(
    (selectedLetter?.durationMinutes || 0) * 60
  );
  const [timerRunning, setTimerRunning] = useState(false);

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
      setResult(null);
    }
  };

  const validateSelections = () => {
    if (!ALLOWED_TEILE.includes(teil)) {
      setError("Bitte wähle einen gültigen Teil aus der Liste.");
      return false;
    }

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
    setResult(null);

    try {
      const data = await analyzeText({
        text: trimmed,
        teil,
        level,
        targetLevel: level,
        userId,
        idToken,
      });
      const enrichedResult = { ...data, teil, level, mode: "Writing" };
      setResult(enrichedResult);
      addResultToHistory(enrichedResult);
    } catch (err) {
      console.error("Falowen frontend error:", err);
      const msg =
        err?.response?.data?.error ||
        err.message ||
        "Falowen Exam Coach: Error sending text for analysis.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const addChatMessage = (role, text) => {
    setChatMessages((prev) => [...prev, { role, text }]);
  };

  const coachReply = (userQuestion) => {
    const scaffolds = [
      "Starte mit einem klaren Betreff und nenne den Grund im ersten Satz.",
      "Schließe mit einer höflichen Bitte um Rückmeldung und deiner Signatur.",
      "Verbinde deine Punkte mit Konnektoren wie 'außerdem', 'deshalb', 'daher'.",
      "Nutze mindestens einen Nebensatz mit 'weil' oder 'dass', um dein Niveau zu zeigen.",
      "Halte Absätze kurz: Situation beschreiben, Wunsch formulieren, Abschluss.",
    ];

    const levelHint = selectedLetter
      ? `Passe deine Sprache an Niveau ${selectedLetter.level} an und bleibe beim Thema "${selectedLetter.letter}".`
      : "Bleib beim Prüfungsthema und verwende höfliche Strukturen.";

    const tip = scaffolds[chatMessages.length % scaffolds.length];

    return `${levelHint} ${tip} Meine Empfehlung: ${
      userQuestion || "Schreibe klare Sätze und vermeide sehr lange Schachtelungen."
    }`;
  };

  const handleAskCoach = () => {
    const trimmed = question.trim();
    if (!trimmed) return;
    addChatMessage("user", trimmed);
    const reply = coachReply(trimmed);
    addChatMessage("coach", reply);
    setQuestion("");
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
        <div style={styles.tabList}>
          {[
            { key: "practice", label: "Übungsbriefe" },
            { key: "mark", label: "Mark my letter" },
            { key: "ideas", label: "Ideen-Generator" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => handleTabChange(tab.key)}
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
            <div style={styles.gridTwo}>
              {writingLetters.map((item) => (
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
                  {selectedLetter.whatToInclude.map((item) => (
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
          <SettingsForm
            title="Mark my letter"
            helperText="Wähle Teil und Niveau, füge deinen Brief ein und erhalte sofort Feedback."
          />

          <section style={styles.card}>
            <label style={styles.label}>Dein Brief</label>
            <textarea
              value={typedAnswer}
              onChange={(e) => {
                setError("");
                setTypedAnswer(e.target.value);
              }}
              placeholder="Füge deinen Text hier ein oder schreibe direkt..."
              style={styles.textArea}
              rows={7}
            />

            <div style={{ marginTop: 12 }}>
              <button
                style={styles.primaryButton}
                onClick={sendTypedAnswerForCorrection}
                disabled={loading}
              >
                {loading ? "Analyzing..." : "Jetzt bewerten"}
              </button>
            </div>

            {error && (
              <div style={styles.errorBox}>
                <strong>Hinweis:</strong> {error}
              </div>
            )}
          </section>

          <Feedback result={result} />
          <ResultHistory results={resultHistory} />
        </>
      )}

      {activeTab === "ideas" && (
        <section style={styles.card}>
          <h3 style={styles.sectionTitle}>Ideen-Generator</h3>
          <p style={styles.helperText}>
            Frag nach Beispielsätzen, Formulierungen oder Strukturen. Der Coach
            antwortet mit kompakten Tipps, damit du den Brief bestehst.
          </p>
          <div style={styles.chatLog}>
            {chatMessages.map((msg, idx) => (
              <div
                key={`${msg.role}-${idx}`}
                style={
                  msg.role === "coach"
                    ? styles.chatBubbleCoach
                    : styles.chatBubbleUser
                }
              >
                <strong style={{ display: "block", marginBottom: 4 }}>
                  {msg.role === "coach" ? "Coach" : "Du"}
                </strong>
                <span>{msg.text}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 12 }}>
            <label style={styles.label}>Deine Frage</label>
            <textarea
              style={styles.textareaSmall}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Z. B. Wie beginne ich höflich? Wie bitte ich um Rückerstattung?"
              rows={3}
            />
          </div>
          <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
            <button style={styles.primaryButton} onClick={handleAskCoach}>
              Frage stellen
            </button>
            <button
              style={styles.secondaryButton}
              onClick={() => setChatMessages(chatMessages.slice(0, 1))}
            >
              Chat zurücksetzen
            </button>
          </div>
        </section>
      )}
    </>
  );
};

export default WritingPage;
