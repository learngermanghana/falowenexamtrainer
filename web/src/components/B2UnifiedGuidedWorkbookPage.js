import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppBackButton from "./navigation/AppBackButton";
import B2TopicIntroduction, { B2_TOPIC_FOUNDATIONS } from "./B2TopicIntroduction";
import { getB2ReviewKeyPoints } from "../data/b2ReviewKeyPoints";
import B2SpeakingSupportGuide from "./B2SpeakingSupportGuide";
import { EmbeddedSpeechPracticePanel } from "./selfLearning/EmbeddedPracticePanels";
import GuidedWritingWorkspace from "./GuidedWritingWorkspace";
import WritingCheatSheetTabs from "./WritingCheatSheetTabs";
import WritingTaskPrompt from "./WritingTaskPrompt";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import { AdvancedSelfLearningTabNav } from "./StandardWorkbookComponents";
import { getB2LessonContentAlignment } from "../data/b2LessonContentAlignment";
import { getB2GrammarLesson } from "../data/b2GrammarLessons";
import { getB2ListeningPractice, hasB2ListeningSource } from "../data/b2ListeningPractice";
import { getB2ReadingPractice } from "../data/b2ReadingPractice";
import { getB2DayTabs, getB2SkillFocus, getB2SkillLabel } from "../data/b2SkillCycle";
import {
  getStandardLessonStorageKey,
  getStandardWritingCloudField,
  getStandardWritingConfig,
} from "../data/standardLessonJourney";
import { styles } from "../styles";
import { useAuth } from "../context/AuthContext";
import fetchB2AudioPlaybackUrl from "../services/b2AudioService";
import { useB2CloudDraftField } from "../utils/b2CloudDraftSync";

const card = { ...styles.card, display: "grid", gap: 14, border: "1px solid #e2e8f0", borderRadius: 18, boxShadow: "0 10px 26px rgba(15,23,42,.06)" };
const sub = { border: "1px solid #e2e8f0", borderRadius: 14, padding: 14, background: "#fff", display: "grid", gap: 8 };
const Section = ({ title, children }) => <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>{title}</h2>{children}</section>;

const GrammarLessonContent = ({ day }) => {
  const grammar = getB2GrammarLesson(day);
  if (!grammar) return null;

  return <div data-b2-grammar-content={day} style={{ display: "grid", gap: 14 }}>
    <div style={{ ...sub, background: "#eff6ff", borderColor: "#bfdbfe" }}>
      <strong>{grammar.title}</strong>
      <span><strong>Heute im Kontext:</strong> {grammar.context}</span>
      <span><strong>Lernziel:</strong> {grammar.goal}</span>
      <span data-b2-grammar-relevance="true"><strong>Warum diese Grammatik?</strong> {grammar.whyThisGrammar}</span>
    </div>

    <div style={{ display: "grid", gap: 12 }}>
      {grammar.focuses.map((item) => <article key={item.title} style={sub}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap", alignItems: "baseline" }}>
          <strong style={{ fontSize: "1.03rem" }}>{item.title}</strong>
          <span style={{ color: "#64748b", fontSize: 13 }}>{item.english}</span>
        </div>
        <p style={{ margin: 0, lineHeight: 1.7 }}>{item.explanation}</p>
        <div style={{ borderRadius: 10, padding: 10, background: "#f8fafc", fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", lineHeight: 1.6 }}>
          {item.pattern}
        </div>
        <div>
          <strong>Regeln</strong>
          <ul style={{ margin: "8px 0 0", paddingLeft: 22, lineHeight: 1.65 }}>
            {item.rules.map((rule) => <li key={rule}>{rule}</li>)}
          </ul>
        </div>
        <div>
          <strong>Beispiele</strong>
          <ul style={{ margin: "8px 0 0", paddingLeft: 22, lineHeight: 1.65 }}>
            {item.examples.map((example) => <li key={example}>{example}</li>)}
          </ul>
        </div>
      </article>)}
    </div>

    <div style={{ ...sub, background: "#f0fdf4", borderColor: "#bbf7d0" }}>
      <strong>Modellsatz für heute</strong>
      <span>{grammar.modelSentence}</span>
    </div>
    <div style={{ ...sub, background: "#fff7ed", borderColor: "#fed7aa" }}>
      <strong>Mini-Übung</strong>
      <span>{grammar.miniExercise}</span>
    </div>
  </div>;
};


const normalizeVocab = (lesson = {}) => {
  const raw = Array.isArray(lesson.vocabulary) ? lesson.vocabulary : Array.isArray(lesson.keywords) ? lesson.keywords : [];
  return raw
    .map((item) => typeof item === "string" ? item : item?.word || item?.term || item?.de || "")
    .filter(Boolean)
    .slice(0, 6);
};

function ReadingPractice({ day, progress, setProgress }) {
  const practice = getB2ReadingPractice(day);
  const questions = Array.isArray(practice?.questions) ? practice.questions : [];
  const answers = progress.readingAnswers || {};
  const firstAttempts = progress.readingFirstAttempts || {};
  const answered = questions.filter((_, index) => Number.isInteger(answers[index])).length;
  const firstCorrect = questions.filter((item, index) => firstAttempts[index] === item.answerIndex).length;

  useEffect(() => {
    if (questions.length && answered === questions.length && !progress.lesenDone) {
      setProgress((old) => ({ ...old, lesenDone: true }));
    }
  }, [answered, progress.lesenDone, questions.length, setProgress]);

  if (!practice) return null;

  const choose = (index, optionIndex) => {
    setProgress((old) => ({
      ...old,
      readingAnswers: { ...(old.readingAnswers || {}), [index]: optionIndex },
      readingFirstAttempts: Number.isInteger(old.readingFirstAttempts?.[index])
        ? old.readingFirstAttempts
        : { ...(old.readingFirstAttempts || {}), [index]: optionIndex },
    }));
  };

  return <Section title={`Lesen · ${practice.title}`}>
    <article style={{ ...sub, background: "#f8fafc", lineHeight: 1.8 }} data-b2-reading-text="true">
      <strong>Lesetext</strong>
      {practice.paragraphs.map((paragraph, index) => <p key={index} style={{ margin: 0 }}>{paragraph}</p>)}
    </article>
    <div style={{ ...sub, background: "#eff6ff" }}>
      <strong>Textverständnis</strong>
      <span>Lesen Sie den vollständigen Text und beantworten Sie alle fünf Fragen. Sie erhalten sofort Rückmeldung; der erste Versuch dient nur als Lernstand.</span>
    </div>
    <div style={{ display: "grid", gap: 14 }}>
      {questions.map((item, index) => {
        const selected = answers[index];
        const hasAnswer = Number.isInteger(selected);
        const correct = selected === item.answerIndex;
        return <article key={item.question} style={sub}>
          <strong>{index + 1}. {item.question}</strong>
          <div style={{ display: "grid", gap: 8 }}>
            {item.options.map((option, optionIndex) => {
              const isCorrectOption = hasAnswer && optionIndex === item.answerIndex;
              const isSelected = selected === optionIndex;
              return <button
                key={option}
                type="button"
                onClick={() => choose(index, optionIndex)}
                style={{
                  ...styles.secondaryButton,
                  textAlign: "left",
                  justifyContent: "flex-start",
                  background: isCorrectOption ? "#f0fdf4" : isSelected ? "#fff7ed" : "#fff",
                  border: isCorrectOption ? "2px solid #86efac" : isSelected ? "2px solid #fdba74" : "1px solid #cbd5e1",
                  color: "#0f172a",
                }}
              >
                {String.fromCharCode(65 + optionIndex)}. {option}
              </button>;
            })}
          </div>
          {hasAnswer ? <div style={{ borderRadius: 12, padding: 10, background: correct ? "#f0fdf4" : "#fff7f7", lineHeight: 1.6 }}><strong>{correct ? "Richtig." : "Noch nicht richtig."}</strong> {!correct ? <>Richtige Antwort: <strong>{String.fromCharCode(65 + item.answerIndex)}. {item.options[item.answerIndex]}</strong>. </> : null}{item.explanation}</div> : null}
        </article>;
      })}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 10 }}>
      <div style={{ ...sub, background: answered === questions.length ? "#f0fdf4" : "#f8fafc" }}><strong>{answered}/{questions.length} beantwortet</strong><span>{answered === questions.length ? "Lesen ist für heute abgeschlossen." : "Beantworten Sie alle Fragen."}</span></div>
      <div style={{ ...sub, background: "#f8fafc" }}><strong>Erster Versuch: {firstCorrect}/{questions.length}</strong><span>Nur Lernstand — kein Blockieren des Kursabschlusses.</span></div>
    </div>
  </Section>;
}

function ListeningPractice({ day, progress, setProgress }) {
  const { idToken } = useAuth();
  const practice = getB2ListeningPractice(day);
  const audioKey = String(practice?.audioKey || "").trim();
  const hasSource = hasB2ListeningSource(practice);
  const transcriptParagraphs = Array.isArray(practice?.transcript)
    ? practice.transcript.filter(Boolean)
    : String(practice?.transcript || "").split(/\n\s*\n/).map((value) => value.trim()).filter(Boolean);
  const questions = Array.isArray(practice?.questions) ? practice.questions : [];
  const answers = progress.listeningAnswers || {};
  const firstAttempts = progress.listeningFirstAttempts || {};
  const [showTranscript, setShowTranscript] = useState(false);
  const [signedAudioUrl, setSignedAudioUrl] = useState("");
  const [audioState, setAudioState] = useState(audioKey ? "loading" : "idle");
  const [audioError, setAudioError] = useState("");
  const [refreshNonce, setRefreshNonce] = useState(0);
  const retryRef = useRef(0);

  const answered = questions.filter((_, index) => Number.isInteger(answers[index])).length;
  const firstCorrect = questions.filter((item, index) => firstAttempts[index] === item.answerIndex).length;

  useEffect(() => {
    if (questions.length && answered === questions.length && !progress.hoerenDone) {
      setProgress((old) => ({ ...old, hoerenDone: true }));
    }
  }, [answered, progress.hoerenDone, questions.length, setProgress]);

  useEffect(() => {
    let cancelled = false;
    if (!audioKey) {
      setSignedAudioUrl("");
      setAudioState("idle");
      setAudioError("");
      return () => { cancelled = true; };
    }
    if (!idToken) {
      setSignedAudioUrl("");
      setAudioState("error");
      setAudioError("Bitte melden Sie sich erneut an, um das Audio abzuspielen.");
      return () => { cancelled = true; };
    }

    setAudioState("loading");
    setAudioError("");
    fetchB2AudioPlaybackUrl({ day, key: audioKey, idToken })
      .then(({ url }) => {
        if (cancelled) return;
        setSignedAudioUrl(url);
        setAudioState("ready");
      })
      .catch((error) => {
        if (cancelled) return;
        setSignedAudioUrl("");
        setAudioState("error");
        setAudioError(error?.response?.data?.error || error?.message || "Das Audio konnte nicht geladen werden.");
      });
    return () => { cancelled = true; };
  }, [audioKey, day, idToken, refreshNonce]);

  const choose = (index, optionIndex) => {
    setProgress((old) => ({
      ...old,
      listeningAnswers: { ...(old.listeningAnswers || {}), [index]: optionIndex },
      listeningFirstAttempts: Number.isInteger(old.listeningFirstAttempts?.[index])
        ? old.listeningFirstAttempts
        : { ...(old.listeningFirstAttempts || {}), [index]: optionIndex },
    }));
  };

  const handleAudioError = () => {
    if (!audioKey) return;
    if (retryRef.current < 1) {
      retryRef.current += 1;
      setRefreshNonce((value) => value + 1);
      return;
    }
    setAudioState("error");
    setAudioError("Das Audio konnte nicht abgespielt werden. Bitte laden Sie es erneut.");
  };

  if (!practice) return null;

  return <Section title={`Hören · ${practice.title}`}>
    {Array.isArray(practice.vocabulary) && practice.vocabulary.length ? <div data-b2-listening-vocabulary="true" style={{ ...sub, background: "#f8fafc", borderColor: "#cbd5e1" }}>
      <strong>Vor dem Hören · wichtige Wörter</strong>
      <span style={{ color: "#64748b", fontSize: 13 }}>Diese Hilfe erklärt nur die schwierigsten Begriffe. Versuchen Sie trotzdem, den Hörtext zuerst als Ganzes zu verstehen.</span>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))", gap: 8 }}>
        {practice.vocabulary.map((item) => <div key={item.de} style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 10, background: "#fff" }}><strong>{item.de}</strong><div style={{ color: "#475569", marginTop: 3 }}>{item.en}</div></div>)}
      </div>
    </div> : null}
    {!hasSource ? <div style={{ ...sub, background: "#fffbeb", borderColor: "#fde68a" }} data-b2-listening-awaiting-source="true">
      <strong>Hörquelle wird ergänzt</strong>
      <span>Für diesen neuen B2-Hörtag ist noch keine endgültige Aufnahme eingetragen. Es werden keine alten Falowen-Radio- oder AI-Video-Inhalte wiederverwendet.</span>
    </div> : <>
      {audioState === "loading" ? <div style={{ ...sub, background: "#eff6ff" }}><strong>Audio wird geladen …</strong><span>Falowen bereitet die geschützte Aufnahme vor.</span></div> : null}
      {signedAudioUrl ? <div style={sub}><strong>Hörtext</strong><audio data-b2-r2-audio="true" controls preload="metadata" src={signedAudioUrl} onError={handleAudioError} onCanPlay={() => { retryRef.current = 0; setAudioState("ready"); setAudioError(""); }} style={{ width: "100%" }}>Ihr Browser unterstützt die Audiowiedergabe nicht.</audio><span style={{ color: "#64748b", fontSize: 13 }}>Die Aufnahme wird direkt hier in Falowen abgespielt.</span></div> : null}
      {audioState === "error" ? <div style={{ ...sub, background: "#fff7f7", borderColor: "#fecaca" }}><strong>Audio momentan nicht verfügbar</strong><span>{audioError}</span><div><button type="button" onClick={() => { retryRef.current = 0; setRefreshNonce((value) => value + 1); }} style={styles.secondaryButton}>Audio erneut laden</button></div></div> : null}

      {transcriptParagraphs.length ? <div style={{ ...sub, background: "#f8fafc" }}>
        <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
          <div><strong>Transkript</strong><div style={{ color: "#64748b", fontSize: 13, marginTop: 3 }}>Versuchen Sie den ersten Durchgang ohne Transkript. Danach können Sie es zum Mitlesen oder Überprüfen einblenden.</div></div>
          <button type="button" onClick={() => setShowTranscript((value) => !value)} aria-expanded={showTranscript} style={styles.secondaryButton}>{showTranscript ? "Transkript ausblenden" : "Transkript anzeigen"}</button>
        </div>
        {showTranscript ? <article data-b2-listening-transcript="true" style={{ display: "grid", gap: 12, lineHeight: 1.8 }}>{transcriptParagraphs.map((paragraph, index) => <p key={index} style={{ margin: 0 }}>{paragraph}</p>)}</article> : null}
      </div> : null}

      {questions.length ? <div style={{ display: "grid", gap: 14 }}>
        {questions.map((item, index) => {
          const selected = answers[index];
          const hasAnswer = Number.isInteger(selected);
          const correct = selected === item.answerIndex;
          return <article key={item.question} style={sub}>
            <strong>{index + 1}. {item.question}</strong>
            <div style={{ display: "grid", gap: 8 }}>{item.options.map((option, optionIndex) => {
              const isCorrectOption = hasAnswer && optionIndex === item.answerIndex;
              const isSelected = selected === optionIndex;
              return <button key={option} type="button" onClick={() => choose(index, optionIndex)} style={{ ...styles.secondaryButton, textAlign: "left", justifyContent: "flex-start", background: isCorrectOption ? "#f0fdf4" : isSelected ? "#fff7ed" : "#fff", border: isCorrectOption ? "2px solid #86efac" : isSelected ? "2px solid #fdba74" : "1px solid #cbd5e1", color: "#0f172a" }}>{String.fromCharCode(65 + optionIndex)}. {option}</button>;
            })}</div>
            {hasAnswer ? <div style={{ borderRadius: 12, padding: 10, background: correct ? "#f0fdf4" : "#fff7f7", lineHeight: 1.6 }}><strong>{correct ? "Richtig." : "Noch nicht richtig."}</strong> {!correct ? <>Richtige Antwort: <strong>{String.fromCharCode(65 + item.answerIndex)}. {item.options[item.answerIndex]}</strong>. </> : null}{item.explanation}</div> : null}
          </article>;
        })}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 10 }}>
          <div style={{ ...sub, background: answered === questions.length ? "#f0fdf4" : "#f8fafc" }}><strong>{answered}/{questions.length} beantwortet</strong><span>{answered === questions.length ? "Hören ist für heute abgeschlossen." : "Beantworten Sie alle Fragen."}</span></div>
          <div style={{ ...sub, background: "#f8fafc" }}><strong>Erster Versuch: {firstCorrect}/{questions.length}</strong><span>Nur Lernstand — kein Blockieren des Kursabschlusses.</span></div>
        </div>
      </div> : <div style={{ ...sub, background: "#eff6ff" }}><strong>Fragen folgen mit dem endgültigen Transkript</strong><span>Die Fragen werden erst aus der tatsächlichen Aufnahme erstellt, damit sie exakt zum Hörtext passen.</span></div>}
    </>}
  </Section>;
}

function Review({ day, alignment, lesson, skillLabel, ready, progress }) {
  const foundation = B2_TOPIC_FOUNDATIONS[day];
  const vocab = normalizeVocab(lesson);
  const nextDay = day < 28 ? day + 1 : null;
  const nextAlignment = nextDay ? getB2LessonContentAlignment(nextDay) : null;
  const nextSkill = nextDay ? getB2SkillLabel(nextDay)?.label : null;
  const reviewKeyPoints = getB2ReviewKeyPoints(day);
  return <Section title={`Review · B2 Day ${day}`}>
    <div style={{ ...sub, background: ready ? "#f0fdf4" : "#fffbeb", borderColor: ready ? "#86efac" : "#fde68a" }}>
      <strong>{ready ? "Day complete ✓" : "Day not complete yet"}</strong>
      <span>{ready ? `Grammar/Learn and ${skillLabel?.label} are complete. Review is revision only — no extra assignment.` : `Complete Grammar/Learn and today’s ${skillLabel?.label} task.`}</span>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12 }}>
      <div style={sub}><strong>Das Wichtigste heute</strong><span><strong>Kernfrage:</strong> {foundation?.question || alignment.goal}</span><span><strong>Konkretes Beispiel:</strong> {foundation?.example || alignment.lessonTopic}</span><span><strong>Abwägung:</strong> {foundation?.tension || alignment.goal}</span></div>
      <div style={sub}><strong>Grammatik merken</strong><span>{alignment.grammar_topic}</span></div>
    </div>
    {reviewKeyPoints.length ? <div data-b2-review-key-points="true" style={{ ...sub, background: "#f8fafc", borderColor: "#cbd5e1" }}><strong>Kernantwort · 3 Punkte</strong>{reviewKeyPoints.map((point, index) => <span key={point}>{index + 1}. {point}</span>)}</div> : null}
    {vocab.length ? <div style={sub}><strong>Wortschatz · wichtige Ausdrücke</strong><div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>{vocab.map((word) => <span key={word} style={{ ...styles.badge, background: "#eef2ff", color: "#3730a3" }}>{word}</span>)}</div></div> : null}
    <div style={{ ...sub, background: "#eff6ff", borderColor: "#bfdbfe" }}><strong>Next up</strong>{nextDay ? <span>Day {nextDay} · {nextSkill}: {nextAlignment?.title}</span> : <span>You have reached Day 28. Use the Course Book to review your full B2 progress.</span>}</div>
    {progress.completedAt ? <div style={{ ...sub, background: "#f0fdf4" }}><strong>Saved complete</strong><span>{progress.completedAt}</span></div> : null}
  </Section>;
}

export default function B2UnifiedGuidedWorkbookPage({ lesson, canonicalLesson = null }) {
  const location = useLocation();
  const navigate = useNavigate();
  const day = Number(lesson?.day || 0);
  const alignment = getB2LessonContentAlignment(day);
  const skillFocus = getB2SkillFocus(day);
  const skillLabel = getB2SkillLabel(day);
  const listeningAvailable = hasB2ListeningSource(getB2ListeningPractice(day));
  const allowedViews = useMemo(() => new Set(getB2DayTabs(day).map(({ key }) => key)), [day]);
  const requestedView = useMemo(() => {
    const raw = new URLSearchParams(location.search || "").get("view") || "";
    const value = raw === "finish" ? "review" : raw;
    return allowedViews.has(value) ? value : "learn";
  }, [allowedViews, location.search]);
  const [active, setActive] = useState(requestedView);
  const storageKey = getStandardLessonStorageKey(lesson, "progress-v2");
  const [progress, setProgress] = useState(() => {
    try {
      return {
        learnDone: false,
        lesenDone: false,
        hoerenDone: false,
        speakDone: false,
        writeDone: false,
        readingAnswers: {},
        readingFirstAttempts: {},
        listeningAnswers: {},
        listeningFirstAttempts: {},
        ...JSON.parse(localStorage.getItem(storageKey) || "{}"),
      };
    } catch {
      return { learnDone: false, lesenDone: false, hoerenDone: false, speakDone: false, writeDone: false, readingAnswers: {}, readingFirstAttempts: {}, listeningAnswers: {}, listeningFirstAttempts: {} };
    }
  });

  useEffect(() => { try { localStorage.setItem(storageKey, JSON.stringify(progress)); } catch {} }, [progress, storageKey]);
  useB2CloudDraftField({ day, field: "progress", value: progress, setValue: setProgress, seedCloudWhenMissing: true, defaultValue: { learnDone: false, lesenDone: false, hoerenDone: false, speakDone: false, writeDone: false, readingAnswers: {}, readingFirstAttempts: {}, listeningAnswers: {}, listeningFirstAttempts: {} } });
  useEffect(() => setActive(requestedView), [requestedView]);

  const changeView = (next) => {
    if (!allowedViews.has(next)) return;
    setActive(next);
    const params = new URLSearchParams(location.search || "");
    if (next === "learn") params.delete("view"); else params.set("view", next);
    navigate({ pathname: location.pathname, search: params.toString() ? `?${params.toString()}` : "" }, { replace: true });
  };

  const skillDone = !skillFocus
    ? false
    : skillFocus === "lesen"
      ? Boolean(progress.lesenDone)
      : skillFocus === "hoeren"
        ? (listeningAvailable ? Boolean(progress.hoerenDone) : true)
        : skillFocus === "speak"
          ? Boolean(progress.speakDone)
          : Boolean(progress.writeDone);
  const ready = Boolean(progress.learnDone && skillDone);

  useEffect(() => {
    if (ready && !progress.completedAt) {
      setProgress((old) => ({ ...old, completedAt: new Date().toISOString() }));
    }
  }, [progress.completedAt, ready]);

  if (!day || !alignment || !skillFocus) return null;

  return <main style={{ ...styles.container, display: "grid", gap: 18 }} data-b2-unified-day={day} data-b2-skill-focus={skillFocus}>
    <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
    <header style={{ ...card, padding: "clamp(20px,4vw,34px)", background: "linear-gradient(135deg,#0f172a,#1e3a8a 58%,#2563eb)", color: "#fff" }}>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <span style={{ ...styles.badge, background: "rgba(255,255,255,.14)", color: "#fff" }}>B2</span>
        <span style={{ ...styles.badge, background: "rgba(255,255,255,.14)", color: "#fff" }}>Day {day}</span>
        <span style={{ ...styles.badge, background: "rgba(37,99,235,.9)", color: "#fff" }}>Chapter {alignment.chapter}</span>
        <span style={{ ...styles.badge, background: "rgba(250,204,21,.18)", color: "#fef3c7" }}>Main skill: {skillLabel?.label}</span>
      </div>
      <h1 style={{ margin: 0, fontSize: "clamp(2rem,5vw,3.1rem)" }}>{alignment.title}</h1>
      <p style={{ margin: 0, color: "#dbeafe", lineHeight: 1.7 }}>{alignment.lessonTopic}</p>
      <div style={{ border: "1px solid rgba(255,255,255,.2)", borderRadius: 14, padding: 13, background: "rgba(255,255,255,.08)" }}><strong>Today’s B2 control:</strong> {alignment.grammar_topic}</div>
      <div style={{ color: "#dbeafe", fontWeight: 700 }}>Today: Grammar/Learn + {skillLabel?.label} + Review. Review is revision only; it does not add another assignment.</div>
    </header>

    <AdvancedSelfLearningTabNav level="B2" day={day} activeTab={active} onChange={changeView} />

    {active === "learn" ? <>
      <B2TopicIntroduction day={day} />
      <Section title="Grammar / Learn">
        <GrammarLessonContent day={day} />
        <div data-b2-grammar-video-status="missing" style={{ ...sub, background: "#fffbeb", borderColor: "#fde68a" }}>
          <strong>Grammar video not added yet</strong>
          <span>Für diesen B2-Tag wurde noch kein passendes Grammatikvideo hinzugefügt. Falowen zeigt bewusst kein altes oder themenfremdes Video.</span>
        </div>
        <label style={{ display: "flex", gap: 9, alignItems: "flex-start", fontWeight: 700, lineHeight: 1.5 }}><input type="checkbox" checked={Boolean(progress.learnDone)} onChange={(event) => setProgress((old) => ({ ...old, learnDone: event.target.checked }))} style={{ marginTop: 4 }} />Ich habe das Thema und den Grammatikfokus verstanden.</label>
      </Section>
    </> : null}

    {active === "lesen" ? <ReadingPractice day={day} progress={progress} setProgress={setProgress} /> : null}
    {active === "hoeren" ? <ListeningPractice day={day} progress={progress} setProgress={setProgress} /> : null}
    {active === "speak" ? <Section title="Sprechen"><B2SpeakingSupportGuide lesson={lesson} /><EmbeddedSpeechPracticePanel /><label style={{ display: "flex", gap: 9, alignItems: "flex-start", fontWeight: 700 }}><input type="checkbox" checked={Boolean(progress.speakDone)} onChange={(event) => setProgress((old) => ({ ...old, speakDone: event.target.checked }))} />Ich habe die Sprechaufgabe abgeschlossen.</label></Section> : null}
    {active === "write" ? <Section title="Schreiben"><WritingCheatSheetTabs level="B2" day={day}><WritingTaskPrompt lesson={lesson} /><GuidedWritingWorkspace config={getStandardWritingConfig(lesson)} storageKey={getStandardLessonStorageKey(lesson, "writing")} cloudField={getStandardWritingCloudField(lesson)} onStatusChange={({ complete }) => setProgress((old) => old.writeDone === Boolean(complete) ? old : ({ ...old, writeDone: Boolean(complete) }))} /></WritingCheatSheetTabs></Section> : null}
    {active === "review" ? <Review day={day} alignment={alignment} lesson={lesson} skillLabel={skillLabel} ready={ready} progress={progress} /> : null}
    {active === "references" ? <WorkbookReferenceAnswers level="B2" lesson={lesson} workbookId={`B2-day-${day}`} /> : null}

    <nav aria-label="B2 workbook navigation" style={{ ...card, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
        {day > 1 ? <button type="button" onClick={() => navigate(`/campus/course/lesson/B2/${day - 1}?radio=done`)} style={styles.secondaryButton}>← Previous lesson</button> : null}
        <button type="button" onClick={() => navigate("/campus/course")} style={styles.secondaryButton}>Course Book</button>
      </div>
      <button type="button" onClick={() => day < 28 ? navigate(`/campus/course/lesson/B2/${day + 1}?radio=done`) : navigate("/campus/course")} style={styles.primaryButton}>{day < 28 ? `Next assignment · Day ${day + 1} · ${getB2SkillLabel(day + 1)?.label} · ${getB2LessonContentAlignment(day + 1)?.title}` : "Back to Course Book"}</button>
    </nav>
  </main>;
}
