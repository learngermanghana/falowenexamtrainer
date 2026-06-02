import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { styles } from "../styles";

const SCORE_THRESHOLD = 80;

const C1_SELF_LEARNING_PLAN = [
  {
    day: 1,
    title: "Ziele und Lernweg",
    topic: "C1-Selbstlernen verstehen und realistische Ziele setzen",
    grammar: "Strukturgeber, Begründungen, formelle Zielsetzung",
    lesson: [
      "Verstehe zuerst den Lernweg: Lernen → Ideen sammeln → mit Falowen AI üben → Feedback lesen → verbessern → selbst markieren.",
      "Formuliere dein persönliches C1-Ziel klar und messbar.",
      "Lerne, wie du AI-Feedback ehrlich nutzt, statt eine Aufgabe nur schnell abzuhaken.",
    ],
    speakingTask: "Sprich 90–120 Sekunden: Warum lernst du Deutsch auf C1-Niveau und was soll sich in den nächsten 4 Wochen verbessern?",
    writingTask: "Schreibe 180–220 Wörter: Mein C1-Lernweg: Ausgangspunkt, Motivation und konkreter Plan.",
    readingTask: "Lies einen kurzen Text über Lernstrategien und notiere 5 Strategien, die zu deinem Alltag passen.",
    listeningTask: "Höre einen kurzen Beitrag und fasse die Kernaussage in 4 Sätzen zusammen.",
    workbookLink: "/campus/course/c1-day-1-willkommen-selbstlernstart-workbook",
    keywords: ["Lernziel", "Lernweg", "Selbstreflexion", "Fortschritt", "Feedback", "realistisch"],
  },
  {
    day: 2,
    title: "Kultur und Identität",
    topic: "Kulturelle Prägung, Zugehörigkeit und persönliches Selbstverständnis",
    grammar: "Relativsätze und präzise Nominalgruppen",
    speakingTask: "Erkläre, wie Kultur das persönliche Verhalten beeinflusst.",
    writingTask: "Schreibe einen Meinungsaufsatz über kulturelle Identität in einer globalisierten Gesellschaft.",
    readingTask: "Markiere Hauptthese, Gegenargument und Fazit in einem Text über Kulturwandel.",
    listeningTask: "Notiere Position, Beispiel und Schlussfolgerung aus einem Interview zum Thema Identität.",
    keywords: ["Identität", "Zugehörigkeit", "Werte", "Prägung", "Herkunft", "Perspektive"],
  },
  {
    day: 3,
    title: "Medien und Informationskompetenz",
    topic: "Nachrichten, Quellenkritik und digitale Verantwortung",
    grammar: "Indirekte Rede und Quellenwiedergabe",
    speakingTask: "Bewerte, wie soziale Medien die öffentliche Meinung beeinflussen.",
    writingTask: "Verfasse eine Erörterung über Chancen und Risiken digitaler Nachrichtenquellen.",
    readingTask: "Unterscheide Fakten, Meinungen und unbelegte Behauptungen in einem Kommentar.",
    listeningTask: "Fasse die wichtigsten Argumente eines Medienbeitrags strukturiert zusammen.",
    keywords: ["Quelle", "Glaubwürdigkeit", "Debatte", "Meinung", "Fakten", "Desinformation"],
  },
  {
    day: 4,
    title: "Beziehungen und Teamarbeit",
    topic: "Kommunikation, Konflikte und Zusammenarbeit",
    grammar: "Kontrastformen und diplomatische Formulierungen",
    speakingTask: "Beschreibe, was erfolgreiche Teamarbeit ausmacht.",
    writingTask: "Schreibe einen formellen Beitrag über Konfliktlösung am Arbeitsplatz.",
    readingTask: "Arbeite Ursachen, Folgen und Lösungsvorschläge aus einem Text heraus.",
    listeningTask: "Notiere bei einem Gespräch: Problem, Reaktion und Kompromiss.",
    keywords: ["Zusammenarbeit", "Konflikt", "Kommunikation", "Kompromiss", "Vertrauen", "Rolle"],
  },
  {
    day: 5,
    title: "Berufliche Entwicklung",
    topic: "Karriere, Weiterbildung und berufliche Ziele",
    grammar: "Finalsätze mit damit / um ... zu und Nominalisierungen",
    speakingTask: "Erkläre deine beruflichen Ziele und begründe konkrete nächste Schritte.",
    writingTask: "Schreibe einen formellen Brief zur beruflichen Weiterbildung.",
    readingTask: "Finde in einem Text Argumente für lebenslanges Lernen.",
    listeningTask: "Fasse Empfehlungen aus einem Karriere-Podcast zusammen.",
    keywords: ["Weiterbildung", "Karriere", "Kompetenz", "Bewerbung", "Entwicklung", "Ziel"],
  },
  {
    day: 6,
    title: "Gesundheit und Lebensstil",
    topic: "Balance, Prävention und gesellschaftliche Gesundheit",
    grammar: "Kausale und konsekutive Verbindungen",
    speakingTask: "Diskutiere, wie Alltag, Arbeit und Gesundheit zusammenhängen.",
    writingTask: "Verfasse einen Meinungsaufsatz über gesunde Routinen in modernen Gesellschaften.",
    readingTask: "Extrahiere Ursache-Folge-Beziehungen aus einem Gesundheitstext.",
    listeningTask: "Notiere Ratschläge, Begründungen und Beispiele aus einem Expertenbeitrag.",
    keywords: ["Prävention", "Belastung", "Routine", "Wohlbefinden", "Stress", "Ausgleich"],
  },
  {
    day: 7,
    title: "Reisen und Nachhaltigkeit",
    topic: "Mobilität, Tourismus und Verantwortung",
    grammar: "Vergleichsformen und abwägende Argumentation",
    speakingTask: "Vergleiche nachhaltige und klassische Reiseformen.",
    writingTask: "Schreibe eine Erörterung: Soll Tourismus stärker reguliert werden?",
    readingTask: "Finde Pro- und Contra-Argumente in einem Text über Massentourismus.",
    listeningTask: "Fasse einen Beitrag über nachhaltiges Reisen zusammen.",
    keywords: ["Nachhaltigkeit", "Tourismus", "Mobilität", "Emissionen", "Verantwortung", "Reiseziel"],
  },
  {
    day: 8,
    title: "Wohnen und Stadtentwicklung",
    topic: "Wohnraum, Infrastruktur und Lebensqualität",
    grammar: "Passiv und formelle Sachbeschreibung",
    speakingTask: "Beschreibe ein Wohnproblem in Städten und schlage Lösungen vor.",
    writingTask: "Schreibe einen formellen Beschwerde- oder Vorschlagstext zur Wohnsituation.",
    readingTask: "Arbeite Problem, Ursache und Lösung aus einem Stadtentwicklungstext heraus.",
    listeningTask: "Notiere Zahlen, Maßnahmen und Kritikpunkte aus einem Bericht.",
    keywords: ["Wohnraum", "Miete", "Infrastruktur", "Stadt", "Lebensqualität", "Planung"],
  },
  {
    day: 9,
    title: "Konsum und Werbung",
    topic: "Kaufentscheidungen, Werbung und Verantwortung",
    grammar: "Konjunktiv II für Empfehlungen und Kritik",
    speakingTask: "Bewerte, wie Werbung unser Konsumverhalten beeinflusst.",
    writingTask: "Schreibe einen Meinungsaufsatz über bewussten Konsum.",
    readingTask: "Analysiere Werbeargumente und sprachliche Wirkung in einem Text.",
    listeningTask: "Fasse ein Interview über Konsumtrends zusammen.",
    keywords: ["Konsum", "Werbung", "Bedürfnis", "Trend", "Marke", "Entscheidung"],
  },
  {
    day: 10,
    title: "Integration und Gesellschaft",
    topic: "Teilhabe, Sprache und gesellschaftlicher Zusammenhalt",
    grammar: "Genitiv, Nominalstil und präzise Argumentation",
    speakingTask: "Erkläre, welche Rolle Sprache für Integration spielt.",
    writingTask: "Verfasse eine Erörterung über gesellschaftliche Teilhabe.",
    readingTask: "Finde zentrale Begriffe und Argumentationsstruktur in einem Integrationstext.",
    listeningTask: "Notiere Positionen aus einem Gespräch über gesellschaftlichen Zusammenhalt.",
    workbookLink: "/campus/course/c1-day-10-integration-und-gesellschaft-workbook",
    grammarLink: "/campus/course/c1-day-10-integration-und-gesellschaft-grammar-notes",
    keywords: ["Integration", "Teilhabe", "Sprache", "Zusammenhalt", "Vielfalt", "Chancen"],
  },
  {
    day: 11,
    title: "Engagement und Ehrenamt",
    topic: "Freiwilligenarbeit und soziale Verantwortung",
    grammar: "Infinitivkonstruktionen und Zweckangaben",
    speakingTask: "Beschreibe, warum Menschen sich ehrenamtlich engagieren.",
    writingTask: "Schreibe einen formellen Brief zur Teilnahme an einem sozialen Projekt.",
    readingTask: "Notiere Motive, Herausforderungen und Wirkung aus einem Text.",
    listeningTask: "Fasse Erfahrungen aus einem Interview über Ehrenamt zusammen.",
    workbookLink: "/campus/course/c1-day-11-engagement-und-ehrenamt-workbook",
    grammarLink: "/campus/course/c1-day-11-engagement-und-ehrenamt-grammar-notes",
    keywords: ["Ehrenamt", "Engagement", "Verantwortung", "Gemeinschaft", "Unterstützung", "Projekt"],
  },
  {
    day: 12,
    title: "Freizeit und Kultur",
    topic: "Kulturelle Angebote, Erholung und gesellschaftliche Bedeutung",
    grammar: "Erweiterte Vergleichsformen",
    speakingTask: "Vergleiche zwei Freizeit- oder Kulturangebote und bewerte ihren Nutzen.",
    writingTask: "Schreibe einen Beitrag über die Rolle von Kultur im Alltag.",
    readingTask: "Analysiere einen Text über Kulturförderung.",
    listeningTask: "Notiere Beispiele und Bewertungen aus einem Kulturbeitrag.",
    workbookLink: "/campus/course/c1-day-12-freizeit-und-kultur-workbook",
    grammarLink: "/campus/course/c1-day-12-freizeit-und-kultur-grammar-notes",
    keywords: ["Kultur", "Freizeit", "Erholung", "Angebot", "Vergleich", "Bedeutung"],
  },
  {
    day: 13,
    title: "Mehrsprachigkeit",
    topic: "Sprachenlernen, Identität und Kommunikation",
    grammar: "Konzessive Strukturen und differenzierte Begründungen",
    speakingTask: "Erkläre Vor- und Nachteile von Mehrsprachigkeit.",
    writingTask: "Schreibe eine Erörterung über Mehrsprachigkeit in Schule und Beruf.",
    readingTask: "Finde Argumente und Beispiele in einem Text über Sprachenlernen.",
    listeningTask: "Fasse ein Interview über mehrsprachige Biografien zusammen.",
    workbookLink: "/campus/course/c1-day-13-mehrsprachigkeit-workbook",
    grammarLink: "/campus/course/c1-day-13-mehrsprachigkeit-grammar-notes",
    keywords: ["Mehrsprachigkeit", "Kommunikation", "Identität", "Spracherwerb", "Vorteil", "Herausforderung"],
  },
  {
    day: 14,
    title: "Innovation und Zukunft",
    topic: "Technologische Entwicklung und gesellschaftlicher Wandel",
    grammar: "Futurformen, Prognosen und Bedingungen",
    speakingTask: "Bewerte eine Innovation und erkläre mögliche Folgen.",
    writingTask: "Schreibe eine Erörterung über Chancen und Risiken neuer Technologien.",
    readingTask: "Notiere Prognosen, Begründungen und Einschränkungen aus einem Zukunftstext.",
    listeningTask: "Fasse einen Beitrag über Innovationen zusammen.",
    workbookLink: "/campus/course/c1-day-14-innovation-und-zukunft-workbook",
    grammarLink: "/campus/course/c1-day-14-innovation-und-zukunft-grammar-notes",
    keywords: ["Innovation", "Zukunft", "Technologie", "Wandel", "Risiko", "Chance"],
  },
  {
    day: 15,
    title: "Bildung und lebenslanges Lernen",
    topic: "Lernen, Weiterbildung und Chancengleichheit",
    grammar: "Nominalisierungen und formelle Textlogik",
    speakingTask: "Diskutiere, warum lebenslanges Lernen wichtig ist.",
    writingTask: "Schreibe einen formellen Text über Weiterbildungsmöglichkeiten.",
    readingTask: "Arbeite zentrale Argumente aus einem Bildungstext heraus.",
    listeningTask: "Notiere Empfehlungen aus einem Beitrag über Lernstrategien.",
    workbookLink: "/campus/course/c1-day-15-bildung-und-lebenslanges-lernen-workbook",
    grammarLink: "/campus/course/c1-day-15-bildung-und-lebenslanges-lernen-grammar-notes",
    keywords: ["Bildung", "Weiterbildung", "Chancengleichheit", "Lernen", "Kompetenz", "Zugang"],
  },
  {
    day: 16,
    title: "Technologie im Alltag",
    topic: "Digitale Werkzeuge, Abhängigkeit und praktische Nutzung",
    grammar: "Zusammenfassung, Transfer und Prüfungssprache",
    speakingTask: "Erkläre, wie Technologie deinen Alltag verändert hat.",
    writingTask: "Schreibe eine abschließende Erörterung über digitale Abhängigkeit.",
    readingTask: "Fasse einen Text über digitale Gewohnheiten kritisch zusammen.",
    listeningTask: "Notiere Hauptaussagen und eigene Bewertung aus einem Technikbeitrag.",
    workbookLink: "/campus/course/c1-day-16-technologie-im-alltag-workbook",
    grammarLink: "/campus/course/c1-day-16-technologie-im-alltag-grammar-notes",
    keywords: ["Technologie", "Alltag", "Digitalisierung", "Abhängigkeit", "Werkzeug", "Verhalten"],
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
  grammarReady: false,
  speakingScore: "",
  writingScore: "",
  readingScore: "",
  listeningScore: "",
  improvedAfterFeedback: false,
  completed: false,
});

const card = { ...styles.card, display: "grid", gap: 12 };
const miniCard = { border: "1px solid #e5e7eb", borderRadius: 12, padding: 12, background: "#fff" };

const numberOrNull = (value) => {
  const numeric = Number(value);
  return Number.isFinite(numeric) ? numeric : null;
};

const skillRows = [
  { key: "speakingScore", label: "Sprechen", route: "/campus/speech" },
  { key: "writingScore", label: "Schreiben", route: "/campus/writing" },
  { key: "readingScore", label: "Lesen", route: "/exams/lesen" },
  { key: "listeningScore", label: "Hören", route: "/exams/horen" },
];

export default function C1SelfLearningCourse() {
  const navigate = useNavigate();
  const { dayId } = useParams();
  const [progress, setProgress] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("falowen:c1:self-learning:v2") || "{}");
    } catch (error) {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem("falowen:c1:self-learning:v2", JSON.stringify(progress));
  }, [progress]);

  const selectedDay = Number(dayId || 1);
  const visiblePlan = useMemo(() => {
    if (Number.isInteger(selectedDay) && selectedDay > 0) {
      return C1_SELF_LEARNING_PLAN.filter((entry) => entry.day === selectedDay);
    }
    return C1_SELF_LEARNING_PLAN;
  }, [selectedDay]);

  const updateDay = (day, updates) => {
    const key = `day-${day}`;
    setProgress((previous) => ({
      ...previous,
      [key]: { ...emptyDayState(), ...(previous[key] || {}), ...updates },
    }));
  };

  const completedCount = C1_SELF_LEARNING_PLAN.filter((entry) => progress[`day-${entry.day}`]?.completed).length;

  return (
    <div style={{ ...styles.container, display: "grid", gap: 16 }}>
      <div style={card}>
        <button type="button" style={{ ...styles.secondaryButton, width: "fit-content" }} onClick={() => navigate("/campus/course")}>
          Back to Course
        </button>
        <span style={styles.levelPill}>C1 Self-learning</span>
        <h1 style={{ ...styles.title, marginBottom: 0 }}>C1 Selbstlernkurs · AI Practice & Self-marking</h1>
        <p style={{ ...styles.subtitle, margin: 0 }}>
          Kein Tutor-Upload. Du lernst zuerst, übst mit Falowen AI, liest dein Feedback, verbesserst die Antwort und markierst dich selbst.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10 }}>
          <div style={miniCard}><strong>1. Lernen</strong><br />Thema, Sprache und Beispiele verstehen.</div>
          <div style={miniCard}><strong>2. AI üben</strong><br />Antwort in Speech/Writing/Exam AI testen.</div>
          <div style={miniCard}><strong>3. Verbessern</strong><br />Feedback lesen und Antwort überarbeiten.</div>
          <div style={miniCard}><strong>4. Self-mark</strong><br />Score eintragen und ehrlich abschließen.</div>
        </div>
        <p style={{ margin: 0, color: "#4b5563" }}>
          Fortschritt: {completedCount}/{C1_SELF_LEARNING_PLAN.length} Tage abgeschlossen. Empfohlene AI-Schwelle: {SCORE_THRESHOLD}/100.
        </p>
      </div>

      <div style={card}>
        <strong>C1 Tagesseiten</strong>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <button type="button" style={styles.secondaryButton} onClick={() => navigate("/campus/course/c1-self-learning")}>Alle Tage</button>
          {C1_SELF_LEARNING_PLAN.map((entry) => (
            <button key={entry.day} type="button" style={styles.secondaryButton} onClick={() => navigate(`/campus/course/c1-self-learning/day-${entry.day}`)}>
              Tag {entry.day}{progress[`day-${entry.day}`]?.completed ? " ✓" : ""}
            </button>
          ))}
        </div>
      </div>

      {visiblePlan.map((entry) => {
        const key = `day-${entry.day}`;
        const dayState = { ...emptyDayState(), ...(progress[key] || {}) };
        const allScores = skillRows.map((row) => numberOrNull(dayState[row.key])).filter((score) => score !== null);
        const averageScore = allScores.length ? Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length) : null;
        const canComplete = dayState.grammarReady && dayState.improvedAfterFeedback && allScores.length >= 2;

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

            <div role="tablist" aria-label={`C1 Tag ${entry.day}`} style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  style={dayState.tab === tab.id ? styles.primaryButton : styles.secondaryButton}
                  onClick={() => updateDay(entry.day, { tab: tab.id })}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {dayState.tab === "lesson" ? (
              <section style={{ display: "grid", gap: 10 }}>
                <h3 style={{ margin: 0 }}>1) Lerne zuerst</h3>
                <p style={{ margin: 0 }}><strong>Grammatik/Strategie:</strong> {entry.grammar}</p>
                <ul style={{ margin: 0, paddingLeft: 20, lineHeight: 1.7 }}>
                  {(entry.lesson || [
                    "Kläre die wichtigsten Ideen zum Thema, bevor du sprichst oder schreibst.",
                    "Sammle Beispiele aus Alltag, Arbeit, Studium oder Gesellschaft.",
                    "Plane deine Antwort mit Einleitung, Hauptteil und Schluss.",
                  ]).map((item) => <li key={item}>{item}</li>)}
                </ul>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {entry.grammarLink ? <button type="button" style={styles.secondaryButton} onClick={() => navigate(entry.grammarLink)}>Grammatiknotizen öffnen</button> : null}
                  {entry.workbookLink ? <button type="button" style={styles.secondaryButton} onClick={() => navigate(entry.workbookLink)}>Workbook öffnen</button> : null}
                  <button type="button" style={styles.secondaryButton} onClick={() => navigate("/campus/grammar")}>Falowen Grammar AI öffnen</button>
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="checkbox" checked={dayState.grammarReady} onChange={(event) => updateDay(entry.day, { grammarReady: event.target.checked })} />
                  <span style={styles.label}>Ich verstehe das Thema und habe meine Ideen vorbereitet.</span>
                </label>
              </section>
            ) : null}

            {dayState.tab === "practice" ? (
              <section style={{ display: "grid", gap: 10 }}>
                <h3 style={{ margin: 0 }}>2) Practice with Falowen AI</h3>
                <div style={{ display: "grid", gap: 8 }}>
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
                </div>
              </section>
            ) : null}

            {dayState.tab === "selfMark" ? (
              <section style={{ display: "grid", gap: 10 }}>
                <h3 style={{ margin: 0 }}>3) Self-marking</h3>
                <p style={{ margin: 0, color: "#4b5563" }}>
                  Trage deine AI-Scores ein. Du musst nicht alles perfekt machen; wichtig ist, dass du Feedback gelesen und verbessert hast.
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: 10 }}>
                  {skillRows.map((row) => (
                    <label key={row.key} style={{ ...styles.field, margin: 0 }}>
                      <span style={styles.label}>{row.label} score</span>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        value={dayState[row.key]}
                        onChange={(event) => updateDay(entry.day, { [row.key]: event.target.value })}
                        style={styles.input}
                        placeholder="0-100"
                      />
                    </label>
                  ))}
                </div>
                <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <input type="checkbox" checked={dayState.improvedAfterFeedback} onChange={(event) => updateDay(entry.day, { improvedAfterFeedback: event.target.checked })} />
                  <span style={styles.label}>Ich habe AI-Feedback gelesen und mindestens eine Verbesserung gemacht.</span>
                </label>
                <div style={{ ...miniCard, background: "#f8fafc" }}>
                  <strong>Self-mark result:</strong> {averageScore === null ? "Noch kein Score" : `${averageScore}/100 average`}<br />
                  <span style={{ color: canComplete ? "#047857" : "#92400e" }}>
                    {canComplete ? "Bereit zum Abschließen." : "Bereite das Thema vor, übe mindestens 2 Skills mit AI und verbessere nach Feedback."}
                  </span>
                </div>
                <button
                  type="button"
                  style={canComplete ? styles.primaryButton : styles.secondaryButton}
                  disabled={!canComplete}
                  onClick={() => updateDay(entry.day, { completed: true })}
                >
                  Mark day complete
                </button>
              </section>
            ) : null}

            {dayState.tab === "vocab" ? (
              <section style={{ display: "grid", gap: 10 }}>
                <h3 style={{ margin: 0 }}>4) Wortschatz für diesen Tag</h3>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  {entry.keywords.map((word) => <span key={word} style={{ ...styles.badge, background: "#eef2ff", color: "#3730a3" }}>{word}</span>)}
                </div>
                <p style={{ margin: 0, color: "#4b5563" }}>
                  Aufgabe: Bilde mit jedem Wort einen eigenen C1-Satz. Nutze danach Falowen AI und frage: “Verbessere meine Sätze auf C1-Niveau.”
                </p>
              </section>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
