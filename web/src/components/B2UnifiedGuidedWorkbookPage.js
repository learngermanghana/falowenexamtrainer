import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppBackButton from "./navigation/AppBackButton";
import B2TopicIntroduction, { B2_TOPIC_FOUNDATIONS } from "./B2TopicIntroduction";
import B2KnowledgeChoicePractice from "./B2KnowledgeChoicePractice";
import B2SpeakingSupportGuide from "./B2SpeakingSupportGuide";
import { EmbeddedSpeechPracticePanel } from "./selfLearning/EmbeddedPracticePanels";
import GuidedWritingWorkspace from "./GuidedWritingWorkspace";
import WritingCheatSheetTabs from "./WritingCheatSheetTabs";
import WritingTaskPrompt from "./WritingTaskPrompt";
import WorkbookReferenceAnswers from "./WorkbookReferenceAnswers";
import { AdvancedSelfLearningTabNav } from "./StandardWorkbookComponents";
import { getB2LessonContentAlignment } from "../data/b2LessonContentAlignment";
import { getB2ListeningPractice, hasB2ListeningSource } from "../data/b2ListeningPractice";
import { getB2DayTabs, getB2SkillFocus, getB2SkillLabel } from "../data/b2SkillCycle";
import {
  getStandardLessonStorageKey,
  getStandardWritingCloudField,
  getStandardWritingConfig,
} from "../data/standardLessonJourney";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 14, border: "1px solid #e2e8f0", borderRadius: 18, boxShadow: "0 10px 26px rgba(15,23,42,.06)" };
const sub = { border: "1px solid #e2e8f0", borderRadius: 14, padding: 14, background: "#fff", display: "grid", gap: 8 };
const Section = ({ title, children }) => <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>{title}</h2>{children}</section>;

const normalizeVocab = (lesson = {}) => {
  const raw = Array.isArray(lesson.vocabulary) ? lesson.vocabulary : Array.isArray(lesson.keywords) ? lesson.keywords : [];
  return raw
    .map((item) => typeof item === "string" ? item : item?.word || item?.term || item?.de || "")
    .filter(Boolean)
    .slice(0, 6);
};

const getReadingQuestions = (day) => {
  const current = B2_TOPIC_FOUNDATIONS[day];
  const alignment = getB2LessonContentAlignment(day);
  if (!current || !alignment) return [];
  const otherDays = [1, 5, 9, 13, 17, 21, 25].filter((candidate) => candidate !== day);
  const picks = otherDays.slice(0, 3);
  const optionsFrom = (field, correct) => [
    correct,
    ...picks.map((candidate) => B2_TOPIC_FOUNDATIONS[candidate]?.[field]).filter(Boolean),
  ].slice(0, 4);
  return [
    {
      question: "Welches konkrete Beispiel wird im Text genannt?",
      options: optionsFrom("example", current.example),
      answer: current.example,
      explanation: "Das Beispiel steht ausdrücklich im Lesetext und macht das Thema konkret.",
    },
    {
      question: "Welcher Zielkonflikt steht im Mittelpunkt?",
      options: optionsFrom("tension", current.tension),
      answer: current.tension,
      explanation: "Der Text stellt genau diese beiden Interessen einander gegenüber.",
    },
    {
      question: "Welche Leitfrage passt zum Text?",
      options: optionsFrom("question", current.question),
      answer: current.question,
      explanation: "Diese Leitfrage fasst die zentrale Abwägung des Textes zusammen.",
    },
    {
      question: "Welches Lernziel gehört zu diesem Thema?",
      options: [
        alignment.goal,
        ...picks.map((candidate) => getB2LessonContentAlignment(candidate)?.goal).filter(Boolean),
      ].slice(0, 4),
      answer: alignment.goal,
      explanation: "Das Lernziel verbindet Inhalt, Bewertung und die sprachliche Aufgabe des Tages.",
    },
  ];
};

function ReadingPractice({ day, progress, setProgress }) {
  const foundation = B2_TOPIC_FOUNDATIONS[day];
  const alignment = getB2LessonContentAlignment(day);
  const questions = useMemo(() => getReadingQuestions(day), [day]);
  const answers = progress.readingAnswers || {};
  const firstAttempts = progress.readingFirstAttempts || {};
  const answered = questions.filter((_, index) => answers[index]).length;
  const firstCorrect = questions.filter((item, index) => firstAttempts[index] === item.answer).length;

  useEffect(() => {
    if (questions.length && answered === questions.length && !progress.lesenDone) {
      setProgress((old) => ({ ...old, lesenDone: true }));
    }
  }, [answered, progress.lesenDone, questions.length, setProgress]);

  if (!foundation || !alignment) return null;

  const choose = (index, option) => {
    setProgress((old) => ({
      ...old,
      readingAnswers: { ...(old.readingAnswers || {}), [index]: option },
      readingFirstAttempts: old.readingFirstAttempts?.[index]
        ? old.readingFirstAttempts
        : { ...(old.readingFirstAttempts || {}), [index]: option },
    }));
  };

  return <Section title={`Lesen · ${alignment.title}`}>
    <div style={{ ...sub, background: "#f8fafc", lineHeight: 1.75 }}>
      <strong>Lesetext</strong>
      <p style={{ margin: 0 }}>{foundation.intro}</p>
      <p style={{ margin: 0 }}>{foundation.example}</p>
      <p style={{ margin: 0 }}><strong>Abwägung:</strong> {foundation.tension}. {alignment.goal}</p>
    </div>
    <div style={{ ...sub, background: "#eff6ff" }}>
      <strong>Textverständnis</strong>
      <span>Beantworten Sie alle Fragen. Sie erhalten sofort Rückmeldung; der erste Versuch dient nur als Lernstand.</span>
    </div>
    <div style={{ display: "grid", gap: 14 }}>
      {questions.map((item, index) => {
        const selected = answers[index];
        const hasAnswer = Boolean(selected);
        const correct = selected === item.answer;
        return <article key={item.question} style={sub}>
          <strong>{index + 1}. {item.question}</strong>
          <div style={{ display: "grid", gap: 8 }}>
            {item.options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => choose(index, option)}
                style={{
                  ...styles.secondaryButton,
                  textAlign: "left",
                  justifyContent: "flex-start",
                  background: hasAnswer && option === item.answer ? "#f0fdf4" : selected === option ? "#fff7ed" : "#fff",
                  border: hasAnswer && option === item.answer ? "2px solid #86efac" : selected === option ? "2px solid #fdba74" : "1px solid #cbd5e1",
                  color: "#0f172a",
                }}
              >
                {option}
              </button>
            ))}
          </div>
          {hasAnswer ? <div style={{ borderRadius: 12, padding: 10, background: correct ? "#f0fdf4" : "#fff7f7", lineHeight: 1.6 }}><strong>{correct ? "Richtig." : "Noch nicht richtig."}</strong> {!correct ? <>Richtige Antwort: <strong>{item.answer}</strong>. </> : null}{item.explanation}</div> : null}
        </article>;
      })}
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(190px,1fr))", gap: 10 }}>
      <div style={{ ...sub, background: answered === questions.length ? "#f0fdf4" : "#f8fafc" }}><strong>{answered}/{questions.length} beantwortet</strong><span>{answered === questions.length ? "Lesen ist für heute abgeschlossen." : "Beantworten Sie alle Fragen."}</span></div>
      <div style={{ ...sub, background: "#f8fafc" }}><strong>Erster Versuch: {firstCorrect}/{questions.length}</strong><span>Nur Lernstand — kein Blockieren des Kursabschlusses.</span></div>
    </div>
  </Section>;
}

function ListeningPractice({ day }) {
  const practice = getB2ListeningPractice(day);
  const hasSource = hasB2ListeningSource(practice);
  if (!practice) return null;
  return <Section title={`Hören · ${practice.title}`}>
    {!hasSource ? <div style={{ ...sub, background: "#fffbeb", borderColor: "#fde68a" }} data-b2-listening-awaiting-source="true">
      <strong>Hörquelle wird ergänzt</strong>
      <span>Die B2-Hörseite ist vorbereitet. Sobald die echte Aufnahme und das Transkript vorliegen, kommen hier derselbe Falowen-Audioplayer, ein optionales Transkript und Fragen aus dem tatsächlichen Hörtext hinein.</span>
    </div> : null}
  </Section>;
}

function Review({ day, alignment, lesson, skillLabel, ready, progress }) {
  const foundation = B2_TOPIC_FOUNDATIONS[day];
  const vocab = normalizeVocab(lesson);
  const nextDay = day < 28 ? day + 1 : null;
  const nextAlignment = nextDay ? getB2LessonContentAlignment(nextDay) : null;
  const nextSkill = nextDay ? getB2SkillLabel(nextDay)?.label : null;
  return <Section title={`Review · B2 Day ${day}`}>
    <div style={{ ...sub, background: ready ? "#f0fdf4" : "#fffbeb", borderColor: ready ? "#86efac" : "#fde68a" }}>
      <strong>{ready ? "Day complete ✓" : "Day not complete yet"}</strong>
      <span>{ready ? `Grammar/Learn and ${skillLabel?.label} are complete. Review is revision only — no extra assignment.` : `Complete Grammar/Learn and today’s ${skillLabel?.label} task.`}</span>
    </div>
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 12 }}>
      <div style={sub}><strong>Das Wichtigste heute</strong><span><strong>Kernfrage:</strong> {foundation?.question || alignment.goal}</span><span><strong>Konkretes Beispiel:</strong> {foundation?.example || alignment.lessonTopic}</span><span><strong>Abwägung:</strong> {foundation?.tension || alignment.goal}</span></div>
      <div style={sub}><strong>Grammatik merken</strong><span>{alignment.grammar_topic}</span></div>
    </div>
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
        ...JSON.parse(localStorage.getItem(storageKey) || "{}"),
      };
    } catch {
      return { learnDone: false, lesenDone: false, hoerenDone: false, speakDone: false, writeDone: false, readingAnswers: {}, readingFirstAttempts: {} };
    }
  });

  useEffect(() => { try { localStorage.setItem(storageKey, JSON.stringify(progress)); } catch {} }, [progress, storageKey]);
  useEffect(() => setActive(requestedView), [requestedView]);

  const changeView = (next) => {
    if (!allowedViews.has(next)) return;
    setActive(next);
    const params = new URLSearchParams(location.search || "");
    if (next === "learn") params.delete("view"); else params.set("view", next);
    navigate({ pathname: location.pathname, search: params.toString() ? `?${params.toString()}` : "" }, { replace: true });
  };

  if (!day || !alignment || !skillFocus) return null;

  const skillDone = skillFocus === "lesen"
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
        <div style={{ ...sub, background: "#f8fafc" }}><strong>Grammar focus</strong><span>{alignment.grammar_topic}</span><span><strong>Goal:</strong> {alignment.goal}</span></div>
        <B2KnowledgeChoicePractice lesson={lesson} onCompleteChange={(complete) => complete && setProgress((old) => ({ ...old, learnDone: true }))} />
        <label style={{ display: "flex", gap: 9, alignItems: "flex-start", fontWeight: 700, lineHeight: 1.5 }}><input type="checkbox" checked={Boolean(progress.learnDone)} onChange={(event) => setProgress((old) => ({ ...old, learnDone: event.target.checked }))} style={{ marginTop: 4 }} />Ich habe das Thema und den Grammatikfokus verstanden.</label>
      </Section>
    </> : null}

    {active === "lesen" ? <ReadingPractice day={day} progress={progress} setProgress={setProgress} /> : null}
    {active === "hoeren" ? <ListeningPractice day={day} /> : null}
    {active === "speak" ? <Section title="Sprechen"><B2SpeakingSupportGuide lesson={lesson} /><EmbeddedSpeechPracticePanel /><label style={{ display: "flex", gap: 9, alignItems: "flex-start", fontWeight: 700 }}><input type="checkbox" checked={Boolean(progress.speakDone)} onChange={(event) => setProgress((old) => ({ ...old, speakDone: event.target.checked }))} />Ich habe die Sprechaufgabe abgeschlossen.</label></Section> : null}
    {active === "write" ? <Section title="Schreiben"><WritingCheatSheetTabs level="B2" day={day}><WritingTaskPrompt lesson={lesson} /><GuidedWritingWorkspace config={getStandardWritingConfig(lesson)} storageKey={getStandardLessonStorageKey(lesson, "writing")} cloudField={getStandardWritingCloudField(lesson)} onStatusChange={({ complete }) => setProgress((old) => old.writeDone === Boolean(complete) ? old : ({ ...old, writeDone: Boolean(complete) }))} /></WritingCheatSheetTabs></Section> : null}
    {active === "review" ? <Review day={day} alignment={alignment} lesson={lesson} skillLabel={skillLabel} ready={ready} progress={progress} /> : null}
    {active === "references" ? <WorkbookReferenceAnswers level="B2" lesson={lesson} workbookId={`B2-day-${day}`} /> : null}

    <nav aria-label="B2 workbook navigation" style={{ ...card, display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
      <button type="button" onClick={() => navigate("/campus/course")} style={styles.secondaryButton}>Course Book</button>
      <button type="button" onClick={() => day < 28 ? navigate(`/campus/course/lesson/B2/${day + 1}`) : navigate("/campus/course")} style={styles.primaryButton}>{day < 28 ? `Next assignment · Day ${day + 1} · ${getB2SkillLabel(day + 1)?.label} · ${getB2LessonContentAlignment(day + 1)?.title}` : "Back to Course Book"}</button>
    </nav>
  </main>;
}
