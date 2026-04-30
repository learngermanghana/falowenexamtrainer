import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
const C1_SELF_LEARNING_PLAN = [];
import { fetchSelfLearningResources } from "../services/selfLearningResourcesService";
import { loadSelfLearningProgress, saveSelfLearningProgress } from "../services/selfLearningProgressService";
import { fetchVocabularyFromSheet } from "../services/vocabService";
import { styles } from "../styles";
import { describeGrammarFocusItem } from "../lib/grammarFocusNotes";
import { DayTabs, OverviewPanel, ResourcePanel, WeeklyReviewPanel } from "./SelfLearningSharedComponents";

const DEFAULT_SCORE_THRESHOLD = 80;
const DEFAULT_SKIMMING_CHUNK_SIZE = 8;
const COURSE_TABS = [
  { id: "overview", label: "Überblick" },
  { id: "grammar", label: "Grammatik" },
  { id: "speaking", label: "Sprechen" },
  { id: "writing", label: "Schreiben" },
  { id: "resources", label: "Ressourcen" },
  { id: "review", label: "Review" },
];

const buildEmptyDayState = () => ({
  grammarCheckComplete: false,
  speakingScore: "",
  speakingComplete: false,
  writingScore: "",
  writingComplete: false,
  skimmingComplete: false,
  dayComplete: false,
  selectedTab: "overview",
});

const normalizeScore = (value) => {
  const parsed = Number(value);
  return Number.isNaN(parsed) ? null : parsed;
};

const C1SelfLearningCourse = () => {
  const navigate = useNavigate();
  const { dayId } = useParams();
  const { user, studentProfile } = useAuth();
  const userId = user?.uid || "";
  const studentCode = studentProfile?.id || "";

  const [progressByDay, setProgressByDay] = useState({});
  const [progressLoaded, setProgressLoaded] = useState(false);
  const [sheetVocabWords, setSheetVocabWords] = useState([]);
  const [sheetVocabLoaded, setSheetVocabLoaded] = useState(false);
  const [sheetVocabError, setSheetVocabError] = useState("");
  const [scoreThreshold, setScoreThreshold] = useState(DEFAULT_SCORE_THRESHOLD);
  const [requireScoreThreshold, setRequireScoreThreshold] = useState(true);
  const [vocabChunkSize, setVocabChunkSize] = useState(DEFAULT_SKIMMING_CHUNK_SIZE);
  const [resources, setResources] = useState(null);
  const [resourcesLoaded, setResourcesLoaded] = useState(false);
  const [resourcesError, setResourcesError] = useState("");
  const [flashcardIndexByDay, setFlashcardIndexByDay] = useState({});

  const dayKeys = useMemo(
    () => C1_SELF_LEARNING_PLAN.map((entry) => `day-${entry.day}`),
    []
  );
  const selectedDayNumber = dayId ? Number(dayId) : null;
  const hasDayRoute = Number.isInteger(selectedDayNumber) && selectedDayNumber > 0;
  const visiblePlanEntries = hasDayRoute
    ? C1_SELF_LEARNING_PLAN.filter((entry) => entry.day === selectedDayNumber)
    : C1_SELF_LEARNING_PLAN;

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

    const loadResources = async () => {
      setResourcesLoaded(false);
      setResourcesError("");
      try {
        const data = await fetchSelfLearningResources("C1");
        if (!isMounted) return;
        setResources(data);
      } catch (err) {
        console.error("Failed to load C1 resources", err);
        if (!isMounted) return;
        setResources(null);
        setResourcesError(err?.message || "C1-Ressourcen konnten nicht geladen werden.");
      } finally {
        if (isMounted) setResourcesLoaded(true);
      }
    };

    loadResources();

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
    const chunkSize = Math.max(1, vocabChunkSize);
    return C1_SELF_LEARNING_PLAN.reduce((acc, entry, index) => {
      const start = index * chunkSize;
      const chunk = sheetVocabWords.slice(start, start + chunkSize);
      acc[`day-${entry.day}`] = chunk;
      return acc;
    }, {});
  }, [sheetVocabWords, vocabChunkSize]);

  const getSkimmingWords = (entry, index) => {
    const fallbackWords = entry.skimmingWords || [];
    if (!sheetVocabWords.length) return fallbackWords;

    const dayKey = `day-${entry.day}`;
    const chunkSize = Math.max(1, vocabChunkSize);
    const chunk =
      skimmingWordsByDay[dayKey] || sheetVocabWords.slice(index * chunkSize, (index + 1) * chunkSize);

    if (!chunk.length) return fallbackWords;
    if (chunk.length >= chunkSize) return chunk;

    const merged = [...chunk, ...fallbackWords.filter((word) => !chunk.includes(word))];
    return merged.slice(0, chunkSize);
  };

  const getResourceEntry = (collection, resourceId) => {
    if (!resourceId || !resources?.[collection]) return null;
    return resources[collection][resourceId] || null;
  };

  const getFlashcardIndex = (dayKey, length) => {
    if (!length) return 0;
    const current = flashcardIndexByDay[dayKey] ?? 0;
    return current % length;
  };

  const updateFlashcardIndex = (dayKey, updater) => {
    setFlashcardIndexByDay((prev) => {
      const current = prev[dayKey] ?? 0;
      return { ...prev, [dayKey]: updater(current) };
    });
  };

  const getActiveTab = (dayState) => dayState?.selectedTab || "overview";

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

  const sharedLabels = {
    overview: {
      learningObjectives: "Lernziele",
      grammarFocus: "Grammatikfokus",
      brainMap: "Gedankenkarte (Ideen)",
      emptyOverview: "Für diesen Tag sind noch keine Überblicksinhalte hinterlegt.",
    },
    resources: {
      activitiesTitle: "2.5) Abwechslung & Aktivitäten",
      quizTitle: "Mini-Quiz",
      discussionLabel: "Diskussionsimpuls:",
      reflectionLabel: "Reflexion:",
      readingTitle: "Leseaufgabe",
      listeningTitle: "Hörverstehen",
      optionalBadge: "Optional",
      openReading: "Quelle öffnen",
      openListening: "Quelle öffnen",
      sourcePrefix: "Quelle:",
      skimmingTitle: "3) Wortschatzüberblick",
      skimmingHelper: "Lies die Liste kurz durch und bilde zu jedem Wort einen kurzen C1-Satz.",
      loadingVocab: "Wortschatz aus dem Sheet wird geladen ...",
      flashcardTitle: "Flashcard-Übung",
      prevCard: "Zurück",
      nextCard: "Weiter",
      randomCard: "Zufallskarte",
      skimmingCompleteLabel: "Ich habe die Wortschatzliste geübt",
    },
    review: {
      reviewTitle: "Wöchentliche Wiederholung & Reflexion",
      practiceLabel: "Übung:",
      emptyReview: "Für diesen Tag gibt es noch keine Wochenreflexion.",
    },
  };

  return (
    <div style={{ display: "grid", gap: 16 }}>
      <div style={styles.card}>
        <h3 style={{ ...styles.sectionTitle, marginBottom: 6 }}>C1 Selbstlernplan (ohne Tutor)</h3>
        <p style={{ ...styles.helperText, marginTop: 0 }}>
          Jeder Tag hat Kernschritte: Sprechaufnahme, Schreibtraining und Wortschatzüberblick. Zusätzlich gibt es
          kuratierte Lese- und Hörverstehensaufgaben mit Verständnisfragen. Speichere deine Punktzahlen und markiere
          einen Schritt erst, wenn die KI-Punktzahl mindestens {scoreThreshold} beträgt. Die Schreibaufgaben folgen
          den Goethe-C1-Formaten (Meinungsaufsatz oder formeller Brief) und spiegeln das Sprechthema samt
          Grammatikfokus. Nutze die Gedankenkarte, um schnelle Ideen zu sammeln.
        </p>
        <p style={{ ...styles.helperText, marginTop: 0 }}>
          Die Wortschatzliste wird aus dem Vokabel-Google-Sheet geladen; falls es nicht verfügbar ist, wird
          die interne Liste angezeigt.
        </p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
          <label style={{ ...styles.field, maxWidth: 220 }}>
            <span style={styles.label}>Wortschatz-Chunkgröße</span>
            <select
              value={vocabChunkSize}
              onChange={(event) => setVocabChunkSize(Number(event.target.value))}
              style={styles.input}
            >
              {[6, 8, 10, 12].map((size) => (
                <option key={size} value={size}>
                  {size} Wörter
                </option>
              ))}
            </select>
          </label>
          <label style={{ ...styles.field, maxWidth: 220 }}>
            <span style={styles.label}>Punkteschwelle</span>
            <input
              type="number"
              min={0}
              max={100}
              value={scoreThreshold}
              onChange={(event) => setScoreThreshold(Number(event.target.value) || 0)}
              style={styles.input}
              placeholder="0-100"
            />
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <input
              type="checkbox"
              checked={requireScoreThreshold}
              onChange={(event) => setRequireScoreThreshold(event.target.checked)}
            />
            <span style={styles.label}>Schwelle für Abschluss erforderlich</span>
          </label>
        </div>
        {!resourcesLoaded ? (
          <p style={{ ...styles.helperText, marginTop: 8 }}>Lade kuratierte Ressourcen...</p>
        ) : null}
        {resourcesError ? (
          <p style={{ ...styles.helperText, marginTop: 8, color: "#b91c1c" }}>
            Kuratierte Ressourcen nicht verfügbar: {resourcesError}
          </p>
        ) : null}
        {resources ? (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 8 }}>
            {resources.sampleAnswers?.speaking ? (
              <details style={{ ...styles.card, padding: 12 }}>
                <summary style={{ cursor: "pointer", fontWeight: 600 }}>
                  {resources.sampleAnswers.speaking.title}
                </summary>
                <p style={{ ...styles.helperText, margin: "8px 0 0" }}>
                  {resources.sampleAnswers.speaking.text}
                </p>
              </details>
            ) : null}
            {resources.sampleAnswers?.writing ? (
              <details style={{ ...styles.card, padding: 12 }}>
                <summary style={{ cursor: "pointer", fontWeight: 600 }}>
                  {resources.sampleAnswers.writing.title}
                </summary>
                <p style={{ ...styles.helperText, margin: "8px 0 0" }}>
                  {resources.sampleAnswers.writing.text}
                </p>
              </details>
            ) : null}
            {resources.sampleRecordings?.length ? (
              <div style={{ ...styles.card, padding: 12 }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>Musteraufnahmen</div>
                <ul style={{ margin: 0, paddingLeft: 18 }}>
                  {resources.sampleRecordings.map((recording) => (
                    <li key={recording.url} style={styles.helperText}>
                      <a href={recording.url} target="_blank" rel="noreferrer">
                        {recording.title}
                      </a>{" "}
                      <span style={{ color: "#6b7280" }}>({recording.source})</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            {(resources.rubrics?.speaking || resources.rubrics?.writing) ? (
              <div style={{ ...styles.card, padding: 12 }}>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>Selbsteinschätzungsraster</div>
                {resources.rubrics?.speaking ? (
                  <>
                    <div style={{ ...styles.helperText, fontWeight: 600, margin: "6px 0" }}>Sprechen</div>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {resources.rubrics.speaking.map((item) => (
                        <li key={item} style={styles.helperText}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
                {resources.rubrics?.writing ? (
                  <>
                    <div style={{ ...styles.helperText, fontWeight: 600, margin: "6px 0" }}>Schreiben</div>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {resources.rubrics.writing.map((item) => (
                        <li key={item} style={styles.helperText}>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : null}
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

      <div style={styles.card}>
        <strong style={{ display: "block", marginBottom: 8 }}>C1 Tagesseiten (eigene URL je Tag)</strong>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button type="button" style={styles.secondaryButton} onClick={() => navigate("/campus/course/c1-self-learning")}>
            Alle Tage
          </button>
          {C1_SELF_LEARNING_PLAN.map((entry) => (
            <button
              key={`jump-day-${entry.day}`}
              type="button"
              style={styles.secondaryButton}
              onClick={() => navigate(`/campus/course/c1-self-learning/day-${entry.day}`)}
            >
              Tag {entry.day}
            </button>
          ))}
          <button
            type="button"
            style={styles.secondaryButton}
            onClick={() => navigate("/campus/course/c1-day-1-willkommen-selbstlernstart-workbook")}
          >
            Tag 1 Workbook (neu)
          </button>
        </div>
      </div>

      {visiblePlanEntries.map((entry) => {
        const planIndex = C1_SELF_LEARNING_PLAN.findIndex((planEntry) => planEntry.day === entry.day);
        const dayKey = `day-${entry.day}`;
        const dayState = progressByDay[dayKey] || buildEmptyDayState();
        const speakingScoreValue = dayState.speakingScore;
        const writingScoreValue = dayState.writingScore;
        const speakingScore = normalizeScore(speakingScoreValue);
        const writingScore = normalizeScore(writingScoreValue);
        const canCompleteSpeaking = !requireScoreThreshold || (speakingScore !== null && speakingScore >= scoreThreshold);
        const canCompleteWriting = !requireScoreThreshold || (writingScore !== null && writingScore >= scoreThreshold);
        const canCompleteDay = dayState.speakingComplete && dayState.writingComplete && dayState.skimmingComplete;
        const skimmingWords = getSkimmingWords(entry, planIndex >= 0 ? planIndex : 0);
        const readingResource = getResourceEntry("reading", entry.reading?.resourceId);
        const listeningResource = getResourceEntry("listening", entry.listening?.resourceId);
        const flashcardIndex = getFlashcardIndex(dayKey, skimmingWords.length);

        return (
          <div key={dayKey} style={{ ...styles.card, display: "grid", gap: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <div>
                <span style={styles.levelPill}>Tag {entry.day}</span>
                <h3 style={{ margin: "6px 0" }}>{entry.title}</h3>
                <p style={{ ...styles.helperText, margin: 0 }}>Thema: {entry.topic}</p>
              </div>
              {dayState.dayComplete ? <span style={styles.badge}>Tag abgeschlossen</span> : null}
            </div>

            <DayTabs
              dayKey={dayKey}
              activeTab={getActiveTab(dayState)}
              onChange={(tabId) => updateDayState(dayKey, { selectedTab: tabId })}
              tablistLabel={`Tag ${entry.day} Tabs`}
              tabs={COURSE_TABS.map((tab) =>
                tab.id === "review" && entry.weeklyReview
                  ? { ...tab, badge: `${entry.weeklyReview.reflectionQuestions?.length || 1}` }
                  : tab
              )}
            />

            <div style={{ display: "grid", gap: 12 }}>
              {getActiveTab(dayState) === "overview" ? (
                <OverviewPanel dayKey={dayKey} entry={entry} grammarLanguage="de" labels={sharedLabels.overview} />
              ) : null}

              {getActiveTab(dayState) === "grammar" ? (
                <div style={{ display: "grid", gap: 6 }}>
                  <strong>Grammatiktraining</strong>
                  {entry.grammarFocus?.items?.length ? (
                    <ul style={{ margin: 0, paddingLeft: 18, display: "grid", gap: 8 }}>
                      {entry.grammarFocus.items.map((item) => {
                        const grammarItem = describeGrammarFocusItem(item, "de");
                        return (
                          <li key={grammarItem.title}>
                            <strong>{grammarItem.title}</strong>
                            <div style={styles.helperText}>{grammarItem.note}</div>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p style={{ ...styles.helperText, margin: 0 }}>
                      Für diesen Tag sind noch keine Grammatikpunkte hinterlegt.
                    </p>
                  )}
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
                  {entry.grammarbook_link ? (
                    <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                      <button type="button" style={styles.secondaryButton} onClick={() => navigate(entry.grammarbook_link)}>
                        In-App Grammatiknotizen öffnen
                      </button>
                      {entry.knowledge_test_link ? (
                        <button type="button" style={styles.secondaryButton} onClick={() => navigate(entry.knowledge_test_link)}>
                          Knowledge test öffnen
                        </button>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ) : null}

              {getActiveTab(dayState) === "speaking" ? (
                <div style={{ display: "grid", gap: 6 }}>
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
                      Punktzahl muss {scoreThreshold}+ sein.
                    </span>
                  ) : null}
                </div>
                </div>
              ) : null}

              {getActiveTab(dayState) === "writing" ? (
                <div style={{ display: "grid", gap: 6 }}>
                  <strong>2) Schreibtraining</strong>
                  {entry.writing?.headerImage?.url ? (
                    <img
                      src={entry.writing.headerImage.url}
                      alt={entry.writing.headerImage.alt || `Schreiben Tag ${entry.day}`}
                      style={{
                        width: "100%",
                        maxHeight: 180,
                        objectFit: "cover",
                        borderRadius: 10,
                        border: "1px solid #e5e7eb",
                      }}
                      loading="lazy"
                    />
                  ) : null}
                  {entry.writing?.formatLabel ? (
                    <p style={{ ...styles.helperText, margin: 0, fontWeight: 700 }}>{entry.writing.formatLabel}</p>
                  ) : null}
                  <p style={{ ...styles.helperText, margin: 0 }}>{entry.writing.prompt}</p>
                  {entry.writing?.examStyleTask ? (
                    <div style={{ ...styles.card, margin: 0, border: "1px solid #e5e7eb", background: "#fff" }}>
                      {entry.writing.examStyleTask.timeHint ? (
                        <p style={{ ...styles.helperText, marginTop: 0 }}>
                          <strong>{entry.writing.examStyleTask.timeHint}</strong>
                        </p>
                      ) : null}
                      <p style={{ ...styles.helperText, marginTop: 0, marginBottom: 6 }}>
                        {entry.writing.examStyleTask.contextPrefix}
                      </p>
                      <p style={{ ...styles.helperText, marginTop: 0, marginBottom: 6 }}>
                        <strong>{entry.writing.examStyleTask.topicLine}</strong>
                      </p>
                      <ul style={{ margin: 0, paddingLeft: 18 }}>
                        {entry.writing.examStyleTask.points?.map((point) => (
                          <li key={point} style={styles.helperText}>
                            {point}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : null}
                  <div style={{ display: "flex", flexWrap: "wrap", gap: 10, alignItems: "center" }}>
                    <button
                      type="button"
                      style={styles.secondaryButton}
                      onClick={() => navigate("/campus/writing?tab=ideas")}
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
                        Punktzahl muss {scoreThreshold}+ sein.
                      </span>
                    ) : null}
                  </div>
                </div>
              ) : null}

              {getActiveTab(dayState) === "resources" ? (
                <ResourcePanel
                  dayKey={dayKey}
                  entry={entry}
                  readingResource={readingResource}
                  listeningResource={listeningResource}
                  sheetVocabLoaded={sheetVocabLoaded}
                  skimmingWords={skimmingWords}
                  flashcardIndex={flashcardIndex}
                  dayState={dayState}
                  onPrevCard={() =>
                    updateFlashcardIndex(dayKey, (current) => (current === 0 ? skimmingWords.length - 1 : current - 1))
                  }
                  onNextCard={() =>
                    updateFlashcardIndex(dayKey, (current) => (current + 1) % skimmingWords.length)
                  }
                  onRandomCard={() =>
                    updateFlashcardIndex(dayKey, () => Math.floor(Math.random() * skimmingWords.length))
                  }
                  onToggleSkimming={(checked) =>
                    updateDayState(dayKey, {
                      skimmingComplete: checked,
                      dayComplete: checked ? dayState.dayComplete : false,
                    })
                  }
                  labels={sharedLabels.resources}
                />
              ) : null}
              {getActiveTab(dayState) === "review" ? (
                <WeeklyReviewPanel dayKey={dayKey} weeklyReview={entry.weeklyReview} labels={sharedLabels.review} />
              ) : null}
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

      {hasDayRoute && !visiblePlanEntries.length ? (
        <div style={styles.card}>
          <p style={{ ...styles.helperText, margin: 0 }}>
            Diese Tagesseite existiert nicht. Nutze z. B. <code>/campus/course/c1-self-learning/day-1</code>.
          </p>
        </div>
      ) : null}

      {dayKeys.length === 0 ? (
        <div style={styles.card}>
          <p style={{ ...styles.helperText, margin: 0 }}>Noch keine Selbstlerntage konfiguriert.</p>
        </div>
      ) : null}
    </div>
  );
};

export default C1SelfLearningCourse;
