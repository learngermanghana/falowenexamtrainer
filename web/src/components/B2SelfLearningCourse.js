import React, { useEffect, useMemo, useState } from "react";
import AppBackButton from "./navigation/AppBackButton";
import { useNavigate, useParams } from "react-router-dom";
import { styles } from "../styles";

const SCORE_THRESHOLD = 75;

const B2_SELF_LEARNING_PLAN = [
  {
    day: 1,
    title: "Persönliche Identität und Selbstverständnis",
    topic: "Über sich selbst, Werte und persönliche Entwicklung sprechen",
    grammar: "Adjektivdeklination und klare Satzverbindungen",
    lesson: [
      "Du lernst, dich differenzierter vorzustellen und dein Selbstverständnis zu erklären.",
      "Du sammelst persönliche Beispiele, bevor du mit AI sprichst oder schreibst.",
      "Du nutzt AI-Feedback, um Ausdruck, Struktur und Grammatik zu verbessern.",
    ],
    speakingTask: "Sprich 2–3 Minuten: Wer bist du heute und welche Erfahrungen haben dich geprägt?",
    writingTask: "Schreibe 180–220 Wörter: Wer bin ich online – wer bin ich offline?",
    readingTask: "Lies einen kurzen Text über digitale Identität und markiere 6 Adjektiv-Nomen-Verbindungen.",
    listeningTask: "Höre ein Interview über Selbstbild und Fremdbild. Notiere 3 Hauptaussagen, 2 Beispiele und 1 eigene Reaktion.",
    workbookLink: "/campus/course/b2-day-1-persoenliche-identitaet-und-selbstverstaendnis-workbook",
    grammarLink: "/campus/course/b2-day-1-persoenliche-identitaet-und-selbstverstaendnis-grammar-notes",
    keywords: ["Identität", "Selbstbild", "Erfahrung", "authentisch", "soziale Medien", "Entwicklung"],
  },
  {
    day: 2,
    title: "Alltag und Zeitmanagement",
    topic: "Routinen, Prioritäten und Produktivität beschreiben",
    grammar: "Temporale Konnektoren und Nebensätze",
    speakingTask: "Erkläre, wie du deinen Alltag organisierst und was du verbessern möchtest.",
    writingTask: "Schreibe einen Beitrag über gutes Zeitmanagement im Lernalltag.",
    readingTask: "Finde Tipps, Beispiele und Warnungen in einem Text über Produktivität.",
    listeningTask: "Notiere Zeitangaben und Empfehlungen aus einem kurzen Beitrag.",
    keywords: ["Priorität", "Routine", "Planung", "Ablenkung", "Ziel", "Gewohnheit"],
  },
  {
    day: 3,
    title: "Arbeit und Beruf",
    topic: "Berufliche Erfahrungen, Erwartungen und Zusammenarbeit",
    grammar: "Konjunktiv II für höfliche Vorschläge",
    speakingTask: "Beschreibe eine berufliche Herausforderung und wie du damit umgehen würdest.",
    writingTask: "Schreibe eine formelle E-Mail über ein berufliches Anliegen.",
    readingTask: "Arbeite Anforderungen und Soft Skills aus einer Stellenanzeige heraus.",
    listeningTask: "Fasse ein Gespräch über Arbeitsplatzkultur zusammen.",
    keywords: ["Beruf", "Erfahrung", "Team", "Vorschlag", "Kommunikation", "Verantwortung"],
  },
  {
    day: 4,
    title: "Bildung und Lernen",
    topic: "Lernstrategien, Prüfungen und Weiterbildung",
    grammar: "Finalsätze mit damit / um ... zu",
    speakingTask: "Erkläre, welche Lernstrategie für dich funktioniert und warum.",
    writingTask: "Schreibe eine Erörterung über Online-Lernen und Präsenzunterricht.",
    readingTask: "Markiere Hauptargumente in einem Text über Weiterbildung.",
    listeningTask: "Notiere Tipps aus einem Lernpodcast und bewerte sie.",
    keywords: ["Lernstrategie", "Weiterbildung", "Prüfung", "Motivation", "Fortschritt", "Methode"],
  },
  {
    day: 5,
    title: "Gesundheit und Wohlbefinden",
    topic: "Stress, Balance und gesunde Gewohnheiten",
    grammar: "Kausale Verbindungen mit weil, da, deshalb, daher",
    speakingTask: "Beschreibe, wie Stress entsteht und was dagegen hilft.",
    writingTask: "Schreibe einen Forumsbeitrag über gesunde Routinen.",
    readingTask: "Finde Ursachen, Folgen und Lösungen in einem Gesundheitstext.",
    listeningTask: "Notiere Empfehlungen aus einem Beitrag über Wohlbefinden.",
    keywords: ["Stress", "Balance", "Gewohnheit", "Gesundheit", "Erholung", "Belastung"],
  },
  {
    day: 6,
    title: "Medien und digitale Kommunikation",
    topic: "Soziale Medien, Datenschutz und Online-Verhalten",
    grammar: "Indirekte Fragen und Meinungsformeln",
    speakingTask: "Diskutiere Vor- und Nachteile sozialer Medien.",
    writingTask: "Schreibe einen Meinungsbeitrag über Datenschutz im Alltag.",
    readingTask: "Unterscheide Fakten und Meinungen in einem Medientext.",
    listeningTask: "Fasse eine Diskussion über Online-Kommunikation zusammen.",
    keywords: ["Datenschutz", "Medien", "Kommunikation", "Privatsphäre", "Information", "Nutzung"],
  },
  {
    day: 7,
    title: "Umwelt und Nachhaltigkeit",
    topic: "Klimaschutz, Konsum und Alltagshandeln",
    grammar: "Passiv und sachliche Beschreibung",
    speakingTask: "Erkläre, welche Umweltmaßnahme im Alltag realistisch ist.",
    writingTask: "Schreibe eine Erörterung über nachhaltigen Konsum.",
    readingTask: "Finde Maßnahmen und Kritikpunkte in einem Umwelttext.",
    listeningTask: "Notiere Zahlen, Beispiele und Lösungen aus einem Beitrag.",
    keywords: ["Umwelt", "Nachhaltigkeit", "Konsum", "Maßnahme", "Verantwortung", "Klimaschutz"],
  },
  {
    day: 8,
    title: "Reisen und Mobilität",
    topic: "Transport, Urlaub und nachhaltige Entscheidungen",
    grammar: "Vergleichsformen und abwägende Argumentation",
    speakingTask: "Vergleiche zwei Verkehrsmittel und begründe deine Wahl.",
    writingTask: "Schreibe einen formellen Brief wegen eines Reiseproblems.",
    readingTask: "Analysiere einen Text über moderne Mobilität.",
    listeningTask: "Fasse Hinweise aus einer Reiseinformation zusammen.",
    keywords: ["Mobilität", "Reise", "Verkehr", "Vergleich", "Verspätung", "Entscheidung"],
  },
  {
    day: 9,
    title: "Wohnen und Nachbarschaft",
    topic: "Wohnformen, Mietprobleme und Zusammenleben",
    grammar: "Relativsätze und genaue Beschreibungen",
    speakingTask: "Beschreibe deine ideale Wohnsituation und begründe sie.",
    writingTask: "Schreibe eine Beschwerde oder Anfrage zum Thema Wohnen.",
    readingTask: "Finde Details und Meinungen in einer Wohnungsanzeige oder einem Artikel.",
    listeningTask: "Notiere Problem, Lösung und nächste Schritte aus einem Gespräch.",
    keywords: ["Wohnung", "Nachbarschaft", "Miete", "Lage", "Zusammenleben", "Beschwerde"],
  },
  {
    day: 10,
    title: "Konsum und Geld",
    topic: "Kaufentscheidungen, Budget und Werbung",
    grammar: "Konzessive Verbindungen mit obwohl / trotzdem",
    speakingTask: "Bewerte, wie Werbung Kaufentscheidungen beeinflusst.",
    writingTask: "Schreibe einen Beitrag über bewussten Umgang mit Geld.",
    readingTask: "Finde Argumente in einem Text über Konsumverhalten.",
    listeningTask: "Fasse ein Gespräch über Sparen und Ausgaben zusammen.",
    keywords: ["Konsum", "Budget", "Werbung", "Preis", "Qualität", "Entscheidung"],
  },
  {
    day: 11,
    title: "Gesellschaft und Integration",
    topic: "Sprache, Teilhabe und Zusammenleben",
    grammar: "Argumentationsstruktur mit einerseits / andererseits",
    speakingTask: "Erkläre, warum Sprache für gesellschaftliche Teilhabe wichtig ist.",
    writingTask: "Schreibe eine Erörterung über Integration und Alltag.",
    readingTask: "Notiere Position, Beispiele und Fazit aus einem Gesellschaftstext.",
    listeningTask: "Fasse verschiedene Meinungen aus einer Diskussion zusammen.",
    keywords: ["Integration", "Sprache", "Teilhabe", "Gesellschaft", "Respekt", "Vielfalt"],
  },
  {
    day: 12,
    title: "Kultur und Freizeit",
    topic: "Hobbys, kulturelle Angebote und persönliche Interessen",
    grammar: "Adjektive, Präpositionen und Bewertungen",
    speakingTask: "Stelle ein kulturelles Angebot vor und bewerte es.",
    writingTask: "Schreibe eine Rezension oder Empfehlung.",
    readingTask: "Finde Bewertungen und Begründungen in einem Kulturtext.",
    listeningTask: "Notiere Eindrücke aus einem Beitrag über Freizeit.",
    keywords: ["Kultur", "Freizeit", "Empfehlung", "Interesse", "Bewertung", "Angebot"],
  },
];

const tabs = [
  { id: "lesson", label: "Lernen" },
  { id: "practice", label: "AI Practice" },
  { id: "selfMark", label: "Self-marking" },
  { id: "vocab", label: "Wortschatz" },
];

const emptyDayState = () => ({
  tab: "lesson",
  lessonReady: false,
  speakingScore: "",
  writingScore: "",
  readingScore: "",
  listeningScore: "",
  improvedAfterFeedback: false,
  completed: false,
});

const card = { ...styles.card, display: "grid", gap: 12 };
const miniCard = { border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, background: "#fff" };
const skillRows = ["speakingScore", "writingScore", "readingScore", "listeningScore"];

const numberOrNull = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

const skillLabels = {
  speakingScore: "Sprechen",
  writingScore: "Schreiben",
  readingScore: "Lesen",
  listeningScore: "Hören",
};

const skillRoutes = {
  speakingScore: "/campus/speech",
  writingScore: "/campus/writing",
  readingScore: "/exams/lesen",
  listeningScore: "/exams/horen",
};

export default function B2SelfLearningCourse() {
  const navigate = useNavigate();
  const { dayId } = useParams();
  const [progress, setProgress] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("falowen:b2:self-learning:v1") || "{}");
    } catch (error) {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("falowen:b2:self-learning:v1", JSON.stringify(progress));
  }, [progress]);

  const selectedDay = Number(dayId || 1);
  const visiblePlan = useMemo(() => {
    if (Number.isInteger(selectedDay) && selectedDay > 0) {
      return B2_SELF_LEARNING_PLAN.filter((entry) => entry.day === selectedDay);
    }
    return B2_SELF_LEARNING_PLAN;
  }, [selectedDay]);

  const updateDay = (day, updates) => {
    const key = `day-${day}`;
    setProgress((previous) => ({
      ...previous,
      [key]: { ...emptyDayState(), ...(previous[key] || {}), ...updates },
    }));
  };

  const completedCount = B2_SELF_LEARNING_PLAN.filter((entry) => progress[`day-${entry.day}`]?.completed).length;

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <AppBackButton label="Back to Course Book" fallbackPath="/campus/course" />
        <span style={styles.levelPill}>B2 Self-learning</span>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>B2 Selbstlernkurs · AI Practice & Self-marking</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Kein Tutor-Upload. Du lernst zuerst, übst mit Falowen AI, liest Feedback, verbesserst deine Antwort und markierst dich selbst.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
          <div style={miniCard}><strong>1. Lernen</strong><br />Topic, useful phrases and grammar.</div>
          <div style={miniCard}><strong>2. Practice</strong><br />Use Falowen AI.</div>
          <div style={miniCard}><strong>3. Improve</strong><br />Revise after feedback.</div>
          <div style={miniCard}><strong>4. Self-mark</strong><br />Enter score and mark complete.</div>
        </div>
        <p style={{ margin: 0, color: "#4b5563" }}>
          Fortschritt: {completedCount}/{B2_SELF_LEARNING_PLAN.length} Tage abgeschlossen. Empfohlene AI-Schwelle: {SCORE_THRESHOLD}/100.
        </p>
      </div>

      <div style={card}>
        <strong>B2 Tagesseiten</strong>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button type="button" style={styles.secondaryButton} onClick={() => navigate("/campus/course/b2-self-learning")}>Alle Tage</button>
          {B2_SELF_LEARNING_PLAN.map((entry) => (
            <button key={entry.day} type="button" style={styles.secondaryButton} onClick={() => navigate(`/campus/course/b2-self-learning/day-${entry.day}`)}>
              Tag {entry.day}{progress[`day-${entry.day}`]?.completed ? " ✓" : ""}
            </button>
          ))}
        </div>
      </div>

      {visiblePlan.map((entry) => {
        const key = `day-${entry.day}`;
        const dayState = { ...emptyDayState(), ...(progress[key] || {}) };
        const allScores = skillRows.map((row) => numberOrNull(dayState[row])).filter((score) => score !== null);
        const averageScore = allScores.length ? Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length) : null;
        const canComplete = dayState.lessonReady && dayState.improvedAfterFeedback && allScores.length >= 2;

        return (
          <div key={entry.day} style={card}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div>
                <span style={styles.levelPill}>Tag {entry.day}</span>
                <h2 style={{ margin: "6px 0" }}>{entry.title}</h2>
                <p style={{ margin: 0, color: "#4b5563" }}>{entry.topic}</p>
              </div>
              {dayState.completed ? <span style={styles.badge}>Self-marked complete</span> : null}
            </div>

            <div role="tablist" aria-label={`B2 Tag ${entry.day}`} style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {tabs.map((tab) => (
                <button key={tab.id} type="button" style={dayState.tab === tab.id ? styles.primaryButton : styles.secondaryButton} onClick={() => updateDay(entry.day, { tab: tab.id })}>{tab.label}</button>
              ))}
            </div>

            {dayState.tab === "lesson" ? (
              <section style={{ display: "grid", gap: 10 }}>
                <h3 style={{ margin: 0 }}>1) Lerne zuerst</h3>
                <p style={{ margin: 0 }}><strong>Grammatik/Strategie:</strong> {entry.grammar}</p>
                <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
                  {(entry.lesson || ["Sammle Ideen und Beispiele.", "Plane Einleitung, 2–3 Hauptpunkte und Schluss.", "Achte auf klare Satzverbindungen."]).map((item) => <li key={item}>{item}</li>)}
                </ul>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {entry.grammarLink ? <button type="button" style={styles.secondaryButton} onClick={() => navigate(entry.grammarLink)}>Grammatiknotizen öffnen</button> : null}
                  {entry.workbookLink ? <button type="button" style={styles.secondaryButton} onClick={() => navigate(entry.workbookLink)}>Workbook öffnen</button> : null}
                  <button type="button" style={styles.secondaryButton} onClick={() => navigate("/campus/grammar")}>Falowen Grammar AI öffnen</button>
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="checkbox" checked={dayState.lessonReady} onChange={(event) => updateDay(entry.day, { lessonReady: event.target.checked })} />
                  <span style={styles.label}>Ich habe das Thema verstanden und meine Ideen vorbereitet.</span>
                </label>
              </section>
            ) : null}

            {dayState.tab === "practice" ? (
              <section style={{ display: "grid", gap: 10 }}>
                <h3 style={{ margin: 0 }}>2) Practice with Falowen AI</h3>
                {[
                  ["Sprechen", entry.speakingTask, "/campus/speech"],
                  ["Schreiben", entry.writingTask, "/campus/writing"],
                  ["Lesen", entry.readingTask, "/exams/lesen"],
                  ["Hören", entry.listeningTask, "/exams/horen"],
                ].map(([label, task, route]) => (
                  <div key={label} style={miniCard}>
                    <strong>{label}</strong>
                    <p style={{ margin: "4px 0 8px", color: "#4b5563" }}>{task}</p>
                    <button type="button" style={styles.linkButton} onClick={() => navigate(route)}>{label} AI öffnen</button>
                  </div>
                ))}
              </section>
            ) : null}

            {dayState.tab === "selfMark" ? (
              <section style={{ display: "grid", gap: 10 }}>
                <h3 style={{ margin: 0 }}>3) Self-marking</h3>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10 }}>
                  {skillRows.map((row) => (
                    <label key={row} style={{ ...styles.field, margin: 0 }}>
                      <span style={styles.label}>{skillLabels[row]} score</span>
                      <input type="number" min="0" max="100" value={dayState[row]} onChange={(event) => updateDay(entry.day, { [row]: event.target.value })} style={styles.input} placeholder="0-100" />
                    </label>
                  ))}
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="checkbox" checked={dayState.improvedAfterFeedback} onChange={(event) => updateDay(entry.day, { improvedAfterFeedback: event.target.checked })} />
                  <span style={styles.label}>Ich habe AI-Feedback gelesen und mindestens eine Verbesserung gemacht.</span>
                </label>
                <div style={{ ...miniCard, background: "#f8fafc" }}>
                  <strong>Self-mark result:</strong> {averageScore === null ? "Noch kein Score" : `${averageScore}/100 average`}<br />
                  <span style={{ color: canComplete ? "#047857" : "#92400e" }}>{canComplete ? "Bereit zum Abschließen." : "Übe mindestens 2 Skills mit AI und verbessere nach Feedback."}</span>
                </div>
                <button type="button" style={canComplete ? styles.primaryButton : styles.secondaryButton} disabled={!canComplete} onClick={() => updateDay(entry.day, { completed: true })}>Mark day complete</button>
              </section>
            ) : null}

            {dayState.tab === "vocab" ? (
              <section style={{ display: "grid", gap: 10 }}>
                <h3 style={{ margin: 0 }}>4) Wortschatz für diesen Tag</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {entry.keywords.map((word) => <span key={word} style={{ ...styles.badge, background: "#eef2ff", color: "#3730a3" }}>{word}</span>)}
                </div>
                <p style={{ margin: 0, color: "#4b5563" }}>Bilde mit jedem Wort einen B2-Satz und lasse Falowen AI deine Sätze natürlicher machen.</p>
              </section>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
