import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";

const panel = { ...styles.card, display: "grid", gap: 14, border: "1px solid #c7d2fe", borderRadius: 18, background: "linear-gradient(180deg,#fff,#f8fafc)" };
const listStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };

const NoteBox = ({ children, tone = "blue" }) => {
  const tones = {
    blue: ["#bfdbfe", "#eff6ff", "#1e3a8a"],
    green: ["#bbf7d0", "#f0fdf4", "#14532d"],
    amber: ["#fde68a", "#fffbeb", "#92400e"],
  };
  const [border, background, color] = tones[tone] || tones.blue;
  return <div style={{ border: `1px solid ${border}`, borderRadius: 14, padding: 12, background, color, lineHeight: 1.65 }}>{children}</div>;
};

const BuildCard = ({ title, formula, purpose, examples }) => (
  <div style={{ border: "1px solid #dbeafe", borderRadius: 14, padding: 14, background: "#fff", display: "grid", gap: 8 }}>
    <strong>{title}</strong>
    <div style={{ borderLeft: "4px solid #6366f1", paddingLeft: 10, fontWeight: 800 }}>{formula}</div>
    <div style={{ color: "#475569" }}>{purpose}</div>
    <ul style={listStyle}>{examples.map((example) => <li key={example}>{example}</li>)}</ul>
  </div>
);

const knowledgeItems = [
  {
    question: "Welche Struktur eignet sich für eine kontrollierte, aber klare Bewertung?",
    options: [
      "Ich halte diese Position für wenig überzeugend.",
      "Diese Position ist total daneben.",
      "Ich finde die Position irgendwie nicht gut.",
    ],
    answer: "Ich halte diese Position für wenig überzeugend.",
    explanation: "„halten + Akkusativ + für + Adjektiv“ ermöglicht eine klare Bewertung, ohne umgangssprachlich oder unnötig emotional zu wirken.",
  },
  {
    question: "Welche Formulierung schafft die größte argumentative Distanz?",
    options: [
      "Das finde ich echt problematisch.",
      "Diese Position erscheint nur bedingt überzeugend.",
      "Ich mag diese Position nicht.",
    ],
    answer: "Diese Position erscheint nur bedingt überzeugend.",
    explanation: "„erscheinen + graduierende Formulierung + Adjektiv“ wirkt distanzierter und eignet sich gut für akademische Diskussionen.",
  },
  {
    question: "Welche Funktion hat „nur bedingt“ in „nur bedingt überzeugend“?",
    options: [
      "Es verstärkt die Kritik maximal.",
      "Es schwächt und präzisiert die Kritik.",
      "Es macht die Aussage umgangssprachlich.",
    ],
    answer: "Es schwächt und präzisiert die Kritik.",
    explanation: "C2 bedeutet häufig, eine Bewertung genau zu dosieren. „nur bedingt“ vermeidet eine pauschale Ablehnung.",
  },
  {
    question: "Welche Kollokation passt, wenn Sprache ein Gefühl von Gruppenzugehörigkeit erzeugt?",
    options: ["Zugehörigkeit vermitteln", "Zugehörigkeit machen", "Zugehörigkeit setzen"],
    answer: "Zugehörigkeit vermitteln",
    explanation: "„Zugehörigkeit vermitteln“ ist die natürliche feste Verbindung. Auf C2-Niveau ist Kollokationssicherheit wichtiger als künstlich komplizierte Wörter.",
  },
];

const speakingBranches = [
  {
    title: "Sprachliche Anpassung als soziale Kompetenz",
    ideas: ["Rücksicht auf den Adressaten", "professioneller Kontext", "Höflichkeit", "Verständlichkeit"],
    prompt: "Wann zeigt sprachliche Anpassung Respekt oder kommunikative Kompetenz?",
    example: "Wer in einem beruflichen Gespräch auf einen sachlichen und präzisen Ton achtet, passt sich nicht zwangsläufig aus Unsicherheit an, sondern berücksichtigt die Erwartungen des Gesprächspartners.",
    starter: "Als Ausdruck sozialer Kompetenz lässt sich sprachliche Anpassung insbesondere dann verstehen, wenn ...",
  },
  {
    title: "Zugehörigkeit und Identität",
    ideas: ["Dialekt", "Gruppensprache", "gemeinsame Codes", "soziale Identität"],
    prompt: "Wie kann Sprache Zugehörigkeit vermitteln, ohne andere Gruppen abzuwerten?",
    example: "Gemeinsame sprachliche Codes können Nähe schaffen und Zugehörigkeit signalisieren; problematisch wird dies erst, wenn daraus bewusste Abgrenzung oder Ausschluss entsteht.",
    starter: "Sprache erfüllt dabei nicht nur eine kommunikative, sondern auch eine identitätsstiftende Funktion, indem ...",
  },
  {
    title: "Konformität und sozialer Druck",
    ideas: ["Anpassungsdruck", "Angst vor Ausgrenzung", "Selbstzensur", "Erwartungen einer Gruppe"],
    prompt: "Ab welchem Punkt wird Anpassung zu problematischer Konformität?",
    example: "Wenn Menschen ihre Ausdrucksweise ausschließlich ändern, um Sanktionen oder Ausgrenzung zu vermeiden, ist die Anpassung weniger freiwillige Kompetenz als vielmehr Ergebnis sozialen Drucks.",
    starter: "Von bloßer Konformität wäre hingegen zu sprechen, wenn ...",
  },
  {
    title: "Authentizität und Grenzen der Anpassung",
    ideas: ["eigene Haltung", "Glaubwürdigkeit", "Selbstbild", "situative Angemessenheit"],
    prompt: "Wie viel Anpassung ist möglich, ohne die eigene Identität zu verleugnen?",
    example: "Registerwechsel muss nicht bedeuten, die eigene Persönlichkeit aufzugeben. Entscheidend ist, ob sich nur die sprachliche Form verändert oder auch die eigene Position verborgen wird.",
    starter: "Die Grenze sinnvoller Anpassung ist meines Erachtens dort erreicht, wo ...",
  },
  {
    title: "Differenzierte Schlussposition",
    ideas: ["Kontextabhängigkeit", "bewusster Registerwechsel", "Freiwilligkeit", "Balance"],
    prompt: "Wie lässt sich soziale Kompetenz von Konformität unterscheiden?",
    example: "Eine pauschale Bewertung greift zu kurz: Derselbe Registerwechsel kann je nach Motivation und Situation entweder kommunikative Sensibilität oder sozialen Anpassungsdruck widerspiegeln.",
    starter: "Zusammenfassend erscheint mir weniger die Anpassung an sich entscheidend als vielmehr ...",
  },
];

export function C2Day1LearnCoach({ completed = false, onCompleteChange }) {
  const storageKey = "falowen:c2:day1:learn-choice:v2";
  const [answers, setAnswers] = useState(() => {
    if (typeof window === "undefined") return {};
    try { return JSON.parse(window.localStorage.getItem(storageKey) || "{}"); } catch { return {}; }
  });
  const [current, setCurrent] = useState(0);
  useEffect(() => { if (typeof window !== "undefined") window.localStorage.setItem(storageKey, JSON.stringify(answers)); }, [answers]);
  const correctCount = useMemo(() => knowledgeItems.filter((item, index) => answers[index] === item.answer).length, [answers]);
  const allCorrect = correctCount === knowledgeItems.length;
  useEffect(() => { if (allCorrect && !completed) onCompleteChange?.(true); }, [allCorrect, completed, onCompleteChange]);
  const item = knowledgeItems[current];
  const selected = answers[current] || "";

  return <div style={{ display: "grid", gap: 14 }}>
    <section style={panel}>
      <span style={{ ...styles.badge, width: "fit-content", background: "#eef2ff", color: "#3730a3" }}>C2 · Denken und formulieren</span>
      <h2 style={{ margin: 0 }}>Register nicht auswendig lernen – bewusst aufbauen</h2>
      <p style={{ margin: 0, lineHeight: 1.75, color: "#334155" }}>Auf C2-Niveau reicht es nicht, formelle Beispielsätze zu erkennen. Du solltest entscheiden können, <strong>wie stark</strong> du bewertest, <strong>wie viel Distanz</strong> du brauchst und <strong>welche Struktur</strong> diese Wirkung erzeugt.</p>
      <NoteBox tone="amber"><strong>Denkregel:</strong> Aussagekern → Haltung → Stärke der Bewertung → Adressat/Kontext → passende Struktur.</NoteBox>
      <div style={{ display: "grid", gap: 10 }}>
        <BuildCard title="1. Persönlich und direkt" formula="Ich finde + Akkusativ + Adjektiv." purpose="Für persönliche Gespräche; die eigene Reaktion steht im Vordergrund." examples={["Ich finde diese Entscheidung problematisch.", "Ich finde den Vorschlag sinnvoll."]} />
        <BuildCard title="2. Kontrolliert bewerten" formula="Ich halte + Akkusativ + für + Adjektiv." purpose="Für Diskussionen und professionelle Kontexte; klar, aber weniger spontan." examples={["Ich halte diese Entwicklung für problematisch.", "Ich halte den Einwand für durchaus berechtigt."]} />
        <BuildCard title="3. Distanz schaffen" formula="Subjekt + erscheint + Graduierung + Adjektiv." purpose="Für analytische oder akademische Argumentation; die Bewertung wird sprachlich distanziert." examples={["Diese Position erscheint nur bedingt überzeugend.", "Der vorgeschlagene Ansatz erscheint grundsätzlich nachvollziehbar."]} />
        <BuildCard title="4. Sachlich evaluieren" formula="Subjekt + ist + Bewertung + zu + Infinitiv." purpose="Für formellere Bewertung, wenn die Sache und nicht die sprechende Person im Mittelpunkt stehen soll." examples={["Diese Entwicklung ist kritisch zu beurteilen.", "Der Vorschlag ist differenziert zu betrachten."]} />
      </div>
    </section>

    <section style={panel}>
      <h2 style={{ margin: 0 }}>Vom einfachen Satz zur C2-Formulierung</h2>
      <div style={{ display: "grid", gap: 10 }}>
        <div><strong>Ausgangsgedanke:</strong> Ich bin mit dieser Position nicht ganz einverstanden.</div>
        <div><strong>Schritt 1 – Haltung präzisieren:</strong> nicht ganz einverstanden → wenig überzeugend / nur bedingt nachvollziehbar</div>
        <div><strong>Schritt 2 – Distanz wählen:</strong> Ich finde ... → Ich halte ... für ... → Diese Position erscheint ...</div>
        <div><strong>Schritt 3 – Stärke dosieren:</strong> problematisch → teilweise problematisch → nur bedingt überzeugend → kaum tragfähig</div>
        <NoteBox tone="green"><strong>Ergebnis:</strong> Diese Position erscheint unter den genannten Voraussetzungen nur bedingt überzeugend.</NoteBox>
      </div>
    </section>

    <section style={panel}>
      <h2 style={{ margin: 0 }}>Kollokationen funktional einsetzen</h2>
      <p style={{ margin: 0, color: "#475569" }}>Lerne nicht nur die Bedeutung, sondern auch, welche argumentative Funktion die Verbindung erfüllt.</p>
      <div style={{ display: "grid", gap: 9 }}>
        <div><strong>Zugehörigkeit vermitteln</strong> → Wirkung von Sprache beschreiben: „Gemeinsame sprachliche Codes können Zugehörigkeit vermitteln.“</div>
        <div><strong>sich von etwas abgrenzen</strong> → Gegensatz/Identität markieren: „Jugendliche grenzen sich sprachlich häufig von älteren Generationen ab.“</div>
        <div><strong>einen Eindruck erwecken</strong> → Wirkung einer Formulierung analysieren: „Übertrieben formelle Sprache kann den Eindruck unnötiger Distanz erwecken.“</div>
        <div><strong>Rücksicht nehmen auf + Akk.</strong> → kommunikative Angemessenheit begründen: „Adressatengerechte Sprache nimmt auf Vorwissen und Situation des Gegenübers Rücksicht.“</div>
      </div>
    </section>

    <section style={panel} aria-label="C2 Day 1 knowledge practice">
      <div><span style={{ ...styles.badge, background: "#eef2ff", color: "#3730a3" }}>Lernen durch Entscheiden</span><h2>Wissens-Check</h2><strong>{correctCount}/{knowledgeItems.length} richtig</strong></div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{knowledgeItems.map((q, index) => <button key={q.question} type="button" onClick={() => setCurrent(index)} style={index === current ? styles.primaryButton : styles.secondaryButton}>{answers[index] === q.answer ? "✓ " : ""}{index + 1}</button>)}</div>
      <div style={{ border: "1px solid #e2e8f0", borderRadius: 16, padding: 16, display: "grid", gap: 12 }}>
        <strong>Frage {current + 1} von {knowledgeItems.length}</strong>
        <h3 style={{ margin: 0 }}>{item.question}</h3>
        {item.options.map((option) => {
          const isSelected = selected === option;
          const isCorrect = option === item.answer;
          const reveal = Boolean(selected) && isCorrect;
          return <button key={option} type="button" onClick={() => setAnswers((old) => ({ ...old, [current]: option }))} style={{ width: "100%", textAlign: "left", padding: "12px 14px", borderRadius: 14, border: `1px solid ${isSelected ? (isCorrect ? "#22c55e" : "#ef4444") : reveal ? "#86efac" : "#dbe3ef"}`, background: isSelected ? (isCorrect ? "#dcfce7" : "#fee2e2") : reveal ? "#f0fdf4" : "#fff", color: "#0f172a", cursor: "pointer", font: "inherit", fontWeight: isSelected || reveal ? 800 : 650 }}>{option}</button>;
        })}
        {selected ? <div><strong>{selected === item.answer ? "Richtig." : "Noch nicht richtig."}</strong> {item.explanation}</div> : null}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
          <button type="button" style={styles.secondaryButton} disabled={current === 0} onClick={() => setCurrent((i) => Math.max(0, i - 1))}>Zurück</button>
          {current < knowledgeItems.length - 1 ? <button type="button" style={styles.primaryButton} disabled={selected !== item.answer} onClick={() => setCurrent((i) => Math.min(knowledgeItems.length - 1, i + 1))}>Nächste Frage</button> : null}
        </div>
      </div>
      {allCorrect || completed ? <NoteBox tone="green"><strong>Learn abgeschlossen.</strong> Du kannst Registerentscheidungen nicht nur erkennen, sondern begründen.</NoteBox> : null}
      <button type="button" style={styles.secondaryButton} onClick={() => { setAnswers({}); setCurrent(0); onCompleteChange?.(false); }}>Wissens-Check neu starten</button>
    </section>
  </div>;
}

export function C2Day1SpeakCoach() {
  const [support, setSupport] = useState("full");
  const question = "Passt du deine Sprache an unterschiedliche Menschen oder Situationen an? Ist das soziale Kompetenz, Konformität oder beides?";

  return <div style={{ display: "grid", gap: 12 }}>
    <NoteBox tone="amber"><strong>Sprechfrage:</strong> {question}</NoteBox>
    <section style={panel}>
      <div><strong>Trainiere bis du ohne Hilfe sprechen kannst</strong><p style={{ margin: "5px 0 0", color: "#475569", lineHeight: 1.6 }}>1. Mit Hilfe: Ideen, Leitfragen, Beispielentwicklung und C2-Satzanfänge. 2. Weniger Hilfe: nur Ideen und Leitfragen. 3. Prüfungsmodus: nur die Aufgabe.</p></div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{[["full","1. Mit Hilfe"],["keywords","2. Weniger Hilfe"],["exam","3. Prüfungsmodus"]].map(([value,label]) => <button key={value} type="button" onClick={() => setSupport(value)} style={support === value ? styles.primaryButton : styles.secondaryButton}>{label}</button>)}</div>
    </section>

    {support !== "exam" ? <section style={{ ...panel, background: "#eef2ff" }}>
      <h3 style={{ margin: 0 }}>Punkte, aus denen du deine eigene Antwort baust</h3>
      <p style={{ margin: 0, color: "#475569" }}>Wähle 3–4 Bereiche. Entwickle jeden Punkt als <strong>Aussage → Begründung → Beispiel → Einordnung</strong>. Du musst nicht alle Ideen verwenden.</p>
      <div style={{ display: "grid", gap: 10 }}>{speakingBranches.map((branch) => <div key={branch.title} style={{ border: "1px solid #c7d2fe", borderRadius: 12, padding: 12, background: "#fff", display: "grid", gap: 6 }}>
        <strong>{branch.title}</strong>
        <div><strong>Ideen:</strong> {branch.ideas.join(" · ")}</div>
        <div><strong>Leitfrage:</strong> {branch.prompt}</div>
        {support === "full" ? <><div style={{ color: "#334155" }}><strong>So kannst du den Gedanken entwickeln:</strong> {branch.example}</div><div style={{ color: "#1e3a8a" }}><strong>C2-Satzanfang:</strong> {branch.starter}</div></> : null}
      </div>)}</div>
    </section> : null}

    {support === "full" ? <section style={panel}>
      <h3 style={{ margin: 0 }}>Möglicher Aufbau deiner Antwort</h3>
      <ol style={listStyle}>
        <li>Formuliere eine differenzierte Grundposition: nicht nur „ja“ oder „nein“.</li>
        <li>Erkläre, wann sprachliche Anpassung soziale Kompetenz darstellt.</li>
        <li>Nenne ein konkretes Beispiel für Zugehörigkeit oder Registerwechsel.</li>
        <li>Zeige die Grenze: Wann entsteht Anpassungsdruck oder Konformität?</li>
        <li>Schließe mit einem Kriterium, nach dem du beide Fälle unterscheidest.</li>
      </ol>
      <NoteBox><strong>C2-Kontrolle:</strong> Nutze präzise Abstufungen wie „weitgehend“, „nur bedingt“, „unter bestimmten Voraussetzungen“, „hingegen“ oder „weniger ... als vielmehr ...“ statt pauschaler Aussagen.</NoteBox>
    </section> : null}

    {support === "exam" ? <NoteBox tone="green"><strong>Prüfungsmodus:</strong> Bereite die Antwort ohne Ideenbank vor. Formuliere eine klare, aber differenzierte Position, entwickle mindestens zwei Argumente, ein konkretes Beispiel, eine Einschränkung oder Gegenposition und ein begründetes Fazit.</NoteBox> : null}
  </div>;
}
