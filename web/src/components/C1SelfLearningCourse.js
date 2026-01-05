import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { C1_SELF_LEARNING_PLAN } from "../data/c1SelfLearningPlan";
import { loadSelfLearningProgress, saveSelfLearningProgress } from "../services/selfLearningProgressService";
import { fetchVocabularyFromSheet } from "../services/vocabService";
import { styles } from "../styles";

const SCORE_THRESHOLD = 80;
const SKIMMING_CHUNK_SIZE = 8;

const buildEmptyDayState = () => ({
  grammarCheckComplete: false,
  speakingScore: "",
  speakingComplete: false,
  writingScore: "",
  writingComplete: false,
  skimmingComplete: false,
  dayComplete: false,
});

const normalizeScore = (value) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const C1SelfLearningCourse = () => {
  const navigate = useNavigate();
  const { user, studentProfile } = useAuth();
  const userId = user?.uid || "";
  const studentCode = studentProfile?.id || "";

  const [progressByDay, setProgressByDay] = useState({});
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [sheetVocabWords, setSheetVocabWords] = useState([]);
  const [sheetVocabLoaded, setSheetVocabLoaded] = useState(false);
  const [sheetVocabError, setSheetVocabError] = useState("");

  const dayKeys = useMemo(
    () => C1_SELF_LEARNING_PLAN.map((entry) => `day-${entry.day}`),
    []
  );

  useEffect(() => {
    let isMounted = true;

    const loadSheetVocab = async () => {
      setSheetVocabLoaded(false);
      setSheetVocabError("");
      try {
        const vocab = await fetchVocabularyFromSheet();
        if (!isMounted) return;
        const words = vocab
          .filter((entry) => ["C1", "ALL"].includes(entry.level))
          .map((entry) => entry.german)
          .filter(Boolean);
        setSheetVocabWords(Array.from(new Set(words)));
      } catch (err) {
        console.error("Failed to load C1 vocab sheet", err);
        if (!isMounted) return;
        setSheetVocabWords([]);
        setSheetVocabError(err?.message || "C1-Wortschatz konnte nicht geladen werden.");
      } finally {
        if (isMounted) setSheetVocabLoaded(true);
      }
    };

    loadSheetVocab();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let isMounted = true;

    const loadProgress = async () => {
      if (!userId && !studentCode) {
        setProgressLoaded(true);
        return;
      }

      setProgressLoaded(false);
      try {
        const saved = await loadSelfLearningProgress({ userId, studentCode, level: "C1" });
        if (!isMounted) return;
        if (saved?.progressByDay) {
          setProgressByDay(saved.progressByDay);
        }
      } catch (err) {
        console.error("Failed to load C1 self-learning progress", err);
      } finally {
        if (isMounted) setProgressLoaded(true);
      }
    };

    loadProgress();

    return () => {
      isMounted = false;
    };
  }, [studentCode, userId]);

  useEffect(() => {
    if (!progressLoaded || (!userId && !studentCode)) return;

    const timeout = setTimeout(() => {
      saveSelfLearningProgress({
        userId,
        studentCode,
        level: "C1",
        data: { progressByDay },
      }).catch((err) => {
        console.error("Failed to save C1 self-learning progress", err);
      });
    }, 800);

    return () => clearTimeout(timeout);
  }, [progressByDay, progressLoaded, studentCode, userId]);

  const updateDayState = (dayKey, updates) => {
    setProgressByDay((prev) => {
      const current = prev[dayKey] || buildEmptyDayState();
      return {
        ...prev,
        [dayKey]: {
          ...current,
          ...updates,
        },
      };
    });
  };

  const skimmingWordsByDay = useMemo(() => {
    if (!sheetVocabWords.length) return {};
    return C1_SELF_LEARNING_PLAN.reduce((acc, entry, index) => {
      const start = index * SKIMMING_CHUNK_SIZE;
      const chunk = sheetVocabWords.slice(start, start + SKIMMING_CHUNK_SIZE);
      acc[`day-${entry.day}`] = chunk;
      return acc;
    }, {});
  }, [sheetVocabWords]);

  const getSkimmingWords = (entry, index) => {
    const fallbackWords = entry.skimmingWords || [];
    if (!sheetVocabWords.length) return fallbackWords;

    const dayKey = `day-${entry.day}`;
    const chunk =
      skimmingWordsByDay[dayKey] || sheetVocabWords.slice(index * SKIMMING_CHUNK_SIZE, (index + 1) * SKIMMING_CHUNK_SIZE);

    if (!chunk.length) return fallbackWords;
    if (chunk.length >= SKIMMING_CHUNK_SIZE) return chunk;

    const merged = [...chunk, ...fallbackWords.filter((word) => !chunk.includes(word))];
    return merged.slice(0, SKIMMING_CHUNK_SIZE);
  };

  const renderScoreField = ({ label, value, onChange }) => (
    <label style={{ ...styles.field, maxWidth: 200 }}>
      <span style={styles.label}>{label}</span>
      <input
        type="number"
        min={0}
        max={100}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        style={styles.input}
        placeholder="0-100"
      />
    </label>
  );

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={styles.card}>
        <h3 style={{ ...styles.sectionTitle, marginBottom: 6 }}>C1 Selbstlernplan (ohne Tutor)</h3>
        <p style={{ ...styles.helperText, marginTop: 0 }}>
          Jeder Tag hat Kernschritte: Sprechaufnahme, Schreibtraining und Wortschatzüberblick. An manchen Tagen
          kommen Lese- und Hörverstehensaufgaben als optionale Ergänzung dazu. Speichere deine Punktzahlen und
          markiere einen Schritt erst, wenn die KI-Punktzahl mindestens {SCORE_THRESHOLD} beträgt. Die Schreibaufgaben
          folgen den Goethe-C1-Formaten (Meinungsaufsatz oder formeller Brief) und spiegeln das Sprechthema samt
          Grammatikfokus. Nutze die Gedankenkarte, um schnelle Ideen zu sammeln.
        </p>
        <p style={{ ...styles.helperText, marginTop: 0 }}>
          Die Wortschatzliste wird aus dem Vokabel-Google-Sheet geladen; falls es nicht verfügbar ist, wird
          die interne Liste angezeigt.
        </p>
        {sheetVocabError ? (
          <p style={{ ...styles.helperText, marginTop: 0, color: "#b91c1c" }}>
            Wortschatzliste nicht verfügbar: {sheetVocabError}
          </p>
        ) : null}
        {!userId && !studentCode ? (
          <p style={{ ...styles.helperText, color: "#b45309", marginBottom: 0 }}>
            Melde dich an, um deinen Fortschritt geräteübergreifend zu speichern.
          </p>
        ) : null}
      </div>

      {C1_SELF_LEARNING_PLAN.map((entry, index) => {
        const dayKey = `day-${entry.day}`;
        const dayState = progressByDay[dayKey] || buildEmptyDayState();
        const speakingScoreValue = dayState.speakingScore;
        const writingScoreValue = dayState.writingScore;
        const speakingScore = normalizeScore(speakingScoreValue);
        const writingScore = normalizeScore(writingScoreValue);
        const canCompleteSpeaking = speakingScore !== null && speakingScore >= SCORE_THRESHOLD;
        const canCompleteWriting = writingScore !== null && writingScore >= SCORE_THRESHOLD;
        const canCompleteDay = dayState.speakingComplete && dayState.writingComplete && dayState.skimmingComplete;
        const skimmingWords = getSkimmingWords(entry, index);

        return (
          <div key={dayKey} style={{ ...styles.card, display: "grid", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <div>
                <span style={styles.levelPill}>Tag {entry.day}</span>
                <h3 style={{ margin: "6px 0" }}>{entry.title}</h3>
                <p style={{ ...styles.helperText, margin: 0 }}>Thema: {entry.topic}</p>
                {entry.brainMap?.length ? (
                  <div style={{ ...styles.helperText, marginTop: 8 }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>Gedankenkarte (Ideen)</div>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {entry.brainMap.map((idea) => (
                        <li key={idea}>{idea}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
              </div>
              {dayState.dayComplete ? <span style={styles.badge}>Tag abgeschlossen</span> : null}
            </div>

            <div style={{ display: "grid", gap: 12 }}>
              <div style={{ display: "grid", gap: 6 }}>
                {entry.speaking.askGrammarPrompt ? (
                  <span style={{ ...styles.helperText, margin: 0, fontWeight: 600 }}>
                    Schritt 0: Grammatik-Check
                  </span>
                ) : null}
                <strong>1) Sprechaufnahme</strong>
                {entry.speaking.concept ? (
                  <p style={{ ...styles.helperText, margin: 0 }}>{entry.speaking.concept}</p>
                ) : null}
                {entry.speaking.outline?.length ? (
                  <div style={{ ...styles.helperText, margin: 0 }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>Gliederung</div>
                    <ol style={{ margin: 0, paddingLeft: 18 }}>
                      {entry.speaking.outline.map((step) => (
                        <li key={step}>{step}</li>
                      ))}
                    </ol>
                  </div>
                ) : null}
                {entry.speaking.starters?.length ? (
                  <div style={{ ...styles.helperText, margin: 0 }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>Starter-Phrasen</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {entry.speaking.starters.map((starter) => (
                        <span
                          key={starter}
                          style={{ ...styles.badge, background: "#fef3c7", color: "#92400e" }}
                        >
                          {starter}
                        </span>
                      ))}
                    </div>
                  </div>
                ) : null}
                {entry.speaking.grammarNotes?.length ? (
                  <div style={{ ...styles.helperText, margin: 0 }}>
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>Grammatikfokus</div>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {entry.speaking.grammarNotes.map((note) => (
                        <li key={note}>{note}</li>
                      ))}
                    </ul>
                  </div>
                ) : null}
                {entry.speaking.askGrammarPrompt ? (
                  <>
                    <p style={{ ...styles.helperText, margin: 0 }}>
                      {entry.speaking.askGrammarPrompt}{" "}
                      <button
                        type="button"
                        style={styles.linkButton}
                        onClick={() => navigate("/campus/grammar")}
                      >
                        Grammatiktrainer öffnen
                      </button>
                    </p>
                    <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <input
                        type="checkbox"
                        checked={dayState.grammarCheckComplete}
                        onChange={(event) =>
                          updateDayState(dayKey, {
                            grammarCheckComplete: event.target.checked,
                          })
                        }
                      />
                      <span style={styles.label}>Ich habe eine Grammatikfrage gestellt</span>
                    </label>
                  </>
                ) : null}
                <p style={{ ...styles.helperText, margin: 0 }}>{entry.speaking.prompt}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                  <button
                    type="button"
                    style={styles.secondaryButton}
                    onClick={() => navigate("/exams/speaking")}
                  >
                    Aufnahme öffnen
                  </button>
                  {renderScoreField({
                    label: "Punktzahl Sprechen",
                    value: speakingScoreValue,
                    onChange: (value) =>
                      updateDayState(dayKey, {
                        speakingScore: value,
                        speakingComplete: false,
                        dayComplete: false,
                      }),
                  })}
                  <button
                    type="button"
                    style={styles.primaryButton}
                    disabled={!canCompleteSpeaking || dayState.speakingComplete}
                    onClick={() => updateDayState(dayKey, { speakingComplete: true })}
                  >
                    {dayState.speakingComplete ? "Sprechen abgeschlossen" : "Sprechen markieren"}
                  </button>
                  {!canCompleteSpeaking ? (
                    <span style={{ ...styles.helperText, margin: 0 }}>
                      Punktzahl muss {SCORE_THRESHOLD}+ sein.
                    </span>
                  ) : null}
                </div>
              </div>

              <div style={{ display: "grid", gap: 6 }}>
                <strong>2) Schreibtraining</strong>
                <p style={{ ...styles.helperText, margin: 0 }}>{entry.writing.prompt}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                  <button
                    type="button"
                    style={styles.secondaryButton}
                    onClick={() => navigate("/exams/writing")}
                  >
                    Ideen öffnen + Text bewerten
                  </button>
                  {renderScoreField({
                    label: "Punktzahl Schreiben",
                    value: writingScoreValue,
                    onChange: (value) =>
                      updateDayState(dayKey, {
                        writingScore: value,
                        writingComplete: false,
                        dayComplete: false,
                      }),
                  })}
                  <button
                    type="button"
                    style={styles.primaryButton}
                    disabled={!canCompleteWriting || dayState.writingComplete}
                    onClick={() => updateDayState(dayKey, { writingComplete: true })}
                  >
                    {dayState.writingComplete ? "Schreiben abgeschlossen" : "Schreiben markieren"}
                  </button>
                  {!canCompleteWriting ? (
                    <span style={{ ...styles.helperText, margin: 0 }}>
                      Punktzahl muss {SCORE_THRESHOLD}+ sein.
                    </span>
                  ) : null}
                </div>
              </div>

              {entry.reading ? (
                <div style={{ display: "grid", gap: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <strong>Leseaufgabe</strong>
                    {entry.reading.optional ? (
                      <span style={{ ...styles.badge, background: "#ecfeff", color: "#0e7490" }}>
                        Optional
                      </span>
                    ) : null}
                  </div>
                  <p style={{ ...styles.helperText, margin: 0, fontWeight: 600 }}>{entry.reading.title}</p>
                  <p style={{ ...styles.helperText, margin: 0 }}>{entry.reading.text}</p>
                  {entry.reading.tasks?.length ? (
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {entry.reading.tasks.map((task) => (
                        <li key={task} style={styles.helperText}>
                          {task}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {entry.reading.source ? (
                    <p style={{ ...styles.helperText, margin: 0, color: "#6b7280" }}>
                      Quelle: {entry.reading.source}
                    </p>
                  ) : null}
                </div>
              ) : null}

              {entry.listening ? (
                <div style={{ display: "grid", gap: 6 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <strong>Hörverstehen</strong>
                    {entry.listening.optional ? (
                      <span style={{ ...styles.badge, background: "#ecfeff", color: "#0e7490" }}>
                        Optional
                      </span>
                    ) : null}
                  </div>
                  <p style={{ ...styles.helperText, margin: 0, fontWeight: 600 }}>{entry.listening.title}</p>
                  <p style={{ ...styles.helperText, margin: 0 }}>{entry.listening.prompt}</p>
                  {entry.listening.tasks?.length ? (
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {entry.listening.tasks.map((task) => (
                        <li key={task} style={styles.helperText}>
                          {task}
                        </li>
                      ))}
                    </ul>
                  ) : null}
                  {entry.listening.source ? (
                    <p style={{ ...styles.helperText, margin: 0, color: "#6b7280" }}>
                      Quelle: {entry.listening.source}
                    </p>
                  ) : null}
                </div>
              ) : null}

              <div style={{ display: "grid", gap: 6 }}>
                <strong>3) Wortschatzüberblick</strong>
                <p style={{ ...styles.helperText, margin: 0 }}>
                  Lies die Liste kurz durch und bilde zu jedem Wort einen kurzen C1-Satz.
                </p>
                {!sheetVocabLoaded ? (
                  <p style={{ ...styles.helperText, margin: 0 }}>Wortschatz aus dem Sheet wird geladen ...</p>
                ) : null}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {skimmingWords.map((word) => (
                    <span key={word} style={{ ...styles.badge, background: "#eef2ff", color: "#3730a3" }}>
                      {word}
                    </span>
                  ))}
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input
                    type="checkbox"
                    checked={dayState.skimmingComplete}
                    onChange={(event) =>
                      updateDayState(dayKey, {
                        skimmingComplete: event.target.checked,
                        dayComplete: event.target.checked ? dayState.dayComplete : false,
                      })
                    }
                  />
                  <span style={styles.label}>Ich habe die Wortschatzliste geübt</span>
                </label>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
              <span style={{ ...styles.helperText, margin: 0 }}>
                Status: {dayState.speakingComplete ? "Sprechen ✅" : "Sprechen ⏳"} ·{" "}
                {dayState.writingComplete ? "Schreiben ✅" : "Schreiben ⏳"} ·{" "}
                {dayState.skimmingComplete ? "Wortschatz ✅" : "Wortschatz ⏳"}
              </span>
              <button
                type="button"
                style={styles.primaryButton}
                disabled={!canCompleteDay || dayState.dayComplete}
                onClick={() => updateDayState(dayKey, { dayComplete: true })}
              >
                {dayState.dayComplete ? "Tag abgeschlossen" : "Tag abschließen"}
              </button>
            </div>
          </div>
        );
      })}

      {dayKeys.length === 0 ? (
        <div style={styles.card}>
          <p style={{ ...styles.helperText, margin: 0 }}>Noch keine Selbstlerntage konfiguriert.</p>
        </div>
      ) : null}
    </div>
  );
};

export default C1SelfLearningCourse;
