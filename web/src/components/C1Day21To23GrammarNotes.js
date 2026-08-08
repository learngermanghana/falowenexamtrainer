import React, { useMemo, useState } from "react";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 14, border: "1px solid #e2e8f0", borderRadius: 18, boxShadow: "0 10px 26px rgba(15,23,42,.06)" };
const listStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const tableStyle = { width: "100%", borderCollapse: "collapse", fontSize: ".95rem" };
const cellStyle = { border: "1px solid #e5e7eb", padding: "10px 12px", textAlign: "left", verticalAlign: "top", lineHeight: 1.6 };
const NoteBox = ({ children, tone = "blue" }) => {
  const tones = { blue: ["#bfdbfe", "#eff6ff", "#1e3a8a"], green: ["#bbf7d0", "#f0fdf4", "#14532d"], amber: ["#fde68a", "#fffbeb", "#92400e"] };
  const [border, background, color] = tones[tone] || tones.blue;
  return <div style={{ border: `1px solid ${border}`, borderRadius: 14, padding: 14, background, color, lineHeight: 1.7 }}>{children}</div>;
};
const Table = ({ rows }) => <div style={{ overflowX: "auto" }}><table style={tableStyle}><thead><tr><th style={cellStyle}>Struktur</th><th style={cellStyle}>C1-Beispiel</th></tr></thead><tbody>{rows.map(([a, b]) => <tr key={a + b}><td style={cellStyle}><strong>{a}</strong></td><td style={cellStyle}>{b}</td></tr>)}</tbody></table></div>;

const lessons = {
  21: {
    title: "Temporale und kausale Strukturen bei Migration und Teilhabe",
    subtitle: "Migrationserfahrungen, Sprache und Chancen als Prozess beschreiben",
    why: "Bei Migration und Teilhabe geht es fast immer um Entwicklungen: zuerst ankommen, dann Sprache lernen, Qualifikationen anerkennen lassen, Arbeit finden und soziale Kontakte aufbauen. Auf C1 solltest du diese Schritte nicht einfach aufzählen, sondern zeitlich und logisch miteinander verbinden.",
    goals: ["zeitliche Abläufe mit nachdem, sobald und während strukturieren", "Gründe mit da, zumal und aufgrund ausdrücken", "zwischen Ursache, Folge und Zeitpunkt unterscheiden", "Teilhabe als mehrstufigen Prozess erklären"],
    explanation: [
      ["1. Zeitpunkt und Reihenfolge", "Mit nachdem beschreibst du, was zuerst passiert ist. Im Nebensatz steht das frühere Ereignis: Nachdem die Anerkennung abgeschlossen wurde, konnte sie eine qualifizierte Stelle antreten."],
      ["2. Sobald = ab dem Moment, in dem", "Sobald betont einen klaren Startpunkt: Sobald Sprachkurse zugänglich sind, verbessern sich die Chancen auf gesellschaftliche Teilhabe."],
      ["3. Ursache sachlich ausdrücken", "Da und zumal leiten Nebensätze ein. Aufgrund steht mit einem Nomen: aufgrund fehlender Sprachkenntnisse / aufgrund der langen Wartezeit."],
      ["4. C1-Tipp", "Verbinde Zeit und Ursache: Nachdem ein Abschluss anerkannt wurde, steigen die Berufschancen deutlich, zumal Arbeitgeber die Qualifikation nun besser einordnen können."],
    ],
    rows: [["nachdem", "Nachdem Zugewanderte Sprachkenntnisse aufgebaut haben, verbessern sich ihre Chancen auf dem Arbeitsmarkt."], ["sobald", "Sobald Beratung zugänglich ist, können bürokratische Hürden schneller überwunden werden."], ["aufgrund + Genitiv", "Aufgrund fehlender Anerkennung bleiben manche Qualifikationen ungenutzt."], ["zumal", "Sprachförderung ist zentral, zumal sie soziale Kontakte und berufliche Teilhabe erleichtert."]],
    model: "Migration ist nicht nur ein Ortswechsel, sondern ein längerer Prozess gesellschaftlicher Teilhabe. Nachdem Menschen angekommen sind, benötigen sie Sprache, Beratung und Zugang zu Bildung oder Arbeit. Aufgrund bürokratischer Hürden bleiben vorhandene Qualifikationen jedoch häufig ungenutzt. Sprachförderung ist daher besonders wichtig, zumal sie nicht nur berufliche Chancen verbessert, sondern auch soziale Kontakte ermöglicht.",
    quiz: [
      { q: "Welche Form zeigt, dass ein Ereignis vor einem anderen abgeschlossen ist?", options: ["obwohl", "nachdem", "damit", "währenddessen"], answer: 1, why: "Nach nachdem wird ein früheres Ereignis beschrieben." },
      { q: "Welche Formulierung ist korrekt?", options: ["Aufgrund die Wartezeit", "Aufgrund der Wartezeit", "Aufgrund von der Wartezeit", "Aufgrund dass die Wartezeit"], answer: 1, why: "Aufgrund wird in formeller Standardsprache typischerweise mit Genitiv verwendet." },
      { q: "Welche Konjunktion bedeutet ungefähr 'besonders weil'?", options: ["zumal", "sobald", "während", "obgleich"], answer: 0, why: "Zumal nennt einen zusätzlichen, besonders wichtigen Grund." },
      { q: "Sobald die Beratung beginnt, ...", options: ["wird der Zugang leichter.", "würde der Zugang leichter gewesen.", "der Zugang leichter wird.", "ist leichter der Zugang."], answer: 0, why: "Der sobald-Nebensatz steht zuerst; im Hauptsatz folgt Verbposition 2." },
      { q: "Welche Aussage beschreibt Teilhabe am differenziertesten?", options: ["Migration endet mit der Ankunft.", "Teilhabe hängt nur von der Person ab.", "Teilhabe entwickelt sich durch Sprache, Anerkennung, Arbeit und soziale Kontakte.", "Teilhabe bedeutet nur einen Arbeitsplatz zu haben."], answer: 2, why: "C1 verlangt eine mehrdimensionale Beschreibung des Prozesses." },
    ],
  },
  22: {
    title: "Indirekte Rede und argumentative Distanz bei Politik und Mitbestimmung",
    subtitle: "Aussagen wiedergeben, ohne sie als eigene Meinung darzustellen",
    why: "In politischen Texten musst du deutlich machen, wer etwas behauptet. Indirekte Rede und Distanzmarker helfen dir, fremde Aussagen sachlich wiederzugeben und anschließend selbst zu bewerten.",
    goals: ["Konjunktiv I für indirekte Rede erkennen und bilden", "Aussagen mit laut, demnach und nach Angaben von zuordnen", "fremde Position und eigene Bewertung trennen", "politische Argumente sachlich einordnen"],
    explanation: [
      ["1. Warum Konjunktiv I?", "Er markiert: Das ist eine fremde Aussage. Direkt: Der Bericht sagt: 'Politische Bildung ist wichtig.' Indirekt: Der Bericht erklärt, politische Bildung sei wichtig."],
      ["2. Typische Formen", "sein → sei/seien, haben → habe/hätten je nach Form, können → könne/könnten. Wenn Konjunktiv I mit Indikativ identisch ist, wird oft Konjunktiv II verwendet."],
      ["3. Distanzmarker", "Laut der Studie ..., dem Bericht zufolge ..., nach Angaben der Initiative ... machen die Quelle sichtbar, auch ohne vollständige indirekte Rede."],
      ["4. C1-Tipp", "Gib zuerst die Position wieder und bewerte sie danach: Laut der Initiative seien Bürgerräte besonders wirksam. Diese Einschätzung überzeugt jedoch nur teilweise, weil ..."],
    ],
    rows: [["Konjunktiv I", "Der Bericht erklärt, politische Bildung sei eine Voraussetzung für Mitbestimmung."], ["laut + Dativ", "Laut der Studie fühlen sich viele junge Menschen politisch nicht ausreichend vertreten."], ["demnach", "Demnach müssten Beteiligungsangebote leichter zugänglich sein."], ["eigene Bewertung", "Diese Forderung erscheint sinnvoll, setzt jedoch ausreichende Information voraus."]],
    model: "Politische Mitbestimmung ist ein zentraler Bestandteil demokratischer Gesellschaften. Laut aktuellen Diskussionen fühlen sich jedoch viele Bürger nicht ausreichend gehört. Eine Initiative erklärt, Beteiligungsformate sollten niedrigschwelliger gestaltet werden. Gleichzeitig setzt Mitbestimmung voraus, dass Menschen informiert sind und Verantwortung für gemeinsame Entscheidungen übernehmen. Demokratie lebt daher nicht nur von Rechten, sondern auch von politischer Bildung und aktiver Beteiligung.",
    quiz: [
      { q: "Direkt: 'Politische Bildung ist wichtig.' Welche indirekte Form ist passend?", options: ["Der Bericht sagt, politische Bildung ist wichtig.", "Der Bericht sagt, politische Bildung sei wichtig.", "Der Bericht sagt, politische Bildung wäre wichtig gewesen.", "Der Bericht sagt politische Bildung wichtig."], answer: 1, why: "Sei ist Konjunktiv I von sein." },
      { q: "Welcher Ausdruck nennt ausdrücklich eine Quelle?", options: ["trotzdem", "laut der Studie", "dennoch", "infolgedessen"], answer: 1, why: "Laut der Studie ordnet die Aussage einer Quelle zu." },
      { q: "Warum verwendet man argumentative Distanz?", options: ["Um jede Aussage abzulehnen", "Um fremde Positionen von der eigenen Bewertung zu trennen", "Um keine Quelle nennen zu müssen", "Um Sätze kürzer zu machen"], answer: 1, why: "Distanz zeigt, dass eine Aussage berichtet und nicht automatisch übernommen wird." },
      { q: "Welche Form passt? Forschende erklären, die Beteiligung ___ zunehmen.", options: ["werde", "wird", "würde gewesen", "worden"], answer: 0, why: "Werde ist Konjunktiv I von werden." },
      { q: "Welche Reihenfolge ist für eine C1-Argumentation am stärksten?", options: ["Eigene Meinung → Quelle erfinden", "Quelle/Position → Einordnung → eigene Bewertung", "Nur direkte Zitate", "Nur eigene Meinung"], answer: 1, why: "So bleiben Quelle und eigene Analyse klar getrennt." },
    ],
  },
  23: {
    title: "Konzessive und finale Strukturen bei Freizeit und Work-Life-Balance",
    subtitle: "Einwände und Ziele präzise miteinander verbinden",
    why: "Work-Life-Balance enthält typische Gegensätze: Flexibilität kann hilfreich sein, aber auch Grenzen verwischen. C1-Sprache zeigt diese Spannung und erklärt zugleich, wozu Maßnahmen dienen.",
    goals: ["Einwände mit obgleich, wenngleich und selbst wenn formulieren", "Ziele mit damit und um ... zu ausdrücken", "damit und um ... zu korrekt unterscheiden", "Chancen und Risiken flexibler Arbeit abwägen"],
    explanation: [
      ["1. Konzession = trotz eines Gegenarguments", "Obgleich flexible Arbeit mehr Freiheit bietet, kann ständige Erreichbarkeit belastend sein. Der Nebensatz nennt einen Punkt, der die Hauptaussage eigentlich infrage stellen könnte."],
      ["2. Selbst wenn", "Selbst wenn verstärkt die Konzession: Selbst wenn jemand gern arbeitet, braucht er Erholung."],
      ["3. damit oder um ... zu?", "Um ... zu verwendest du meist bei gleichem Subjekt: Beschäftigte machen Pausen, um sich zu erholen. Damit ist nötig, wenn die Subjekte verschieden sind: Unternehmen schaffen Regeln, damit Beschäftigte abschalten können."],
      ["4. C1-Tipp", "Verbinde Einwand und Lösung: Obgleich Homeoffice mehr Flexibilität schafft, sollten klare Erreichbarkeitsregeln gelten, damit Freizeit tatsächlich geschützt bleibt."],
    ],
    rows: [["obgleich", "Obgleich viele Menschen flexible Arbeit schätzen, verschwimmen dadurch oft Grenzen."], ["selbst wenn", "Selbst wenn jemand gern arbeitet, braucht er regelmäßige Erholung."], ["damit", "Unternehmen sollten klare Erreichbarkeitsregeln schaffen, damit Freizeit geschützt bleibt."], ["um ... zu", "Viele Beschäftigte planen bewusste Pausen, um langfristig leistungsfähig zu bleiben."]],
    model: "Work-Life-Balance ist mehr als ein persönliches Zeitmanagementproblem. Obgleich flexible Arbeitsmodelle mehr Freiheit ermöglichen, können sie auch dazu führen, dass berufliche Aufgaben ständig präsent bleiben. Unternehmen sollten klare Regeln zur Erreichbarkeit schaffen, damit Erholung wirklich geschützt wird. Gleichzeitig müssen Beschäftigte lernen, Grenzen zu setzen, um langfristig gesund und leistungsfähig zu bleiben.",
    quiz: [
      { q: "Welches Wort ist ein gehobenes Synonym für obwohl?", options: ["damit", "obgleich", "sobald", "zumal"], answer: 1, why: "Obgleich ist eine formellere konzessive Konjunktion." },
      { q: "Unternehmen schaffen Regeln, ___ Beschäftigte abschalten können.", options: ["um", "damit", "obgleich", "nachdem"], answer: 1, why: "Die Subjekte sind verschieden: Unternehmen / Beschäftigte. Deshalb passt damit." },
      { q: "Beschäftigte machen Pausen, ___ sich zu erholen.", options: ["damit", "um", "obwohl", "sobald"], answer: 1, why: "Das Subjekt bleibt gleich, daher passt um ... zu." },
      { q: "Welche Aussage enthält eine Konzession?", options: ["Weil Homeoffice flexibel ist, ist es beliebt.", "Obgleich Homeoffice flexibel ist, kann es belastend sein.", "Damit Homeoffice flexibel ist, arbeitet man.", "Nachdem Homeoffice flexibel ist, arbeitet man."], answer: 1, why: "Obgleich stellt zwei gegensätzliche Aspekte gegenüber." },
      { q: "Welche C1-Aussage ist am ausgewogensten?", options: ["Homeoffice ist immer gut.", "Homeoffice ist immer schlecht.", "Flexible Arbeit bietet Chancen, erfordert jedoch klare Grenzen zum Schutz der Erholung.", "Arbeit und Freizeit sind dasselbe."], answer: 2, why: "Die Aussage wägt Vorteil und notwendige Bedingung gegeneinander ab." },
    ],
  },
};

function KnowledgeTest({ questions = [] }) {
  const [answers, setAnswers] = useState({});
  const score = useMemo(() => questions.reduce((sum, item, index) => sum + (answers[index] === item.answer ? 1 : 0), 0), [answers, questions]);
  return <section style={card}>
    <div><h2 style={{ margin: 0, fontSize: "1.2rem" }}>Knowledge Test</h2><p style={{ margin: "6px 0 0", lineHeight: 1.7, color: "#475569" }}>Klicke auf eine Antwort. Du siehst sofort, ob sie richtig ist.</p></div>
    {questions.map((item, index) => {
      const selected = answers[index];
      return <div key={item.q} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 12, display: "grid", gap: 9 }}>
        <strong>{index + 1}. {item.q}</strong>
        <div style={{ display: "grid", gap: 7 }}>{item.options.map((option, optionIndex) => {
          const chosen = selected === optionIndex;
          const isCorrect = optionIndex === item.answer;
          const background = chosen ? (isCorrect ? "#f0fdf4" : "#fef2f2") : "#fff";
          const borderColor = chosen ? (isCorrect ? "#22c55e" : "#ef4444") : "#cbd5e1";
          return <button key={option} type="button" onClick={() => setAnswers((old) => ({ ...old, [index]: optionIndex }))} style={{ ...styles.secondaryButton, justifyContent: "flex-start", textAlign: "left", background, borderColor }}>{String.fromCharCode(65 + optionIndex)}) {option}</button>;
        })}</div>
        {selected !== undefined ? <NoteBox tone={selected === item.answer ? "green" : "amber"}><strong>{selected === item.answer ? "Richtig." : "Noch nicht."}</strong> {item.why}</NoteBox> : null}
      </div>;
    })}
    <strong>Score: {score}/{questions.length}</strong>
  </section>;
}

export default function C1Day21To23GrammarNotes({ day, checked = false, onCheckedChange }) {
  const lesson = lessons[Number(day)];
  if (!lesson) return null;
  return <div style={{ display: "grid", gap: 16 }}>
    <section style={card}><span style={{ ...styles.badge, width: "fit-content" }}>C1 · Day {day} · Grammar Notes</span><h2 style={{ ...styles.title, margin: 0, fontSize: "clamp(1.7rem,4vw,2.5rem)" }}>{lesson.title}</h2><p style={{ ...styles.subtitle, margin: 0, lineHeight: 1.7 }}>{lesson.subtitle}</p></section>
    <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>Was lernst du hier?</h2><p style={{ margin: 0, lineHeight: 1.75 }}>{lesson.why}</p><NoteBox><strong>Nach dieser Lektion kannst du:</strong><ul style={{ ...listStyle, marginTop: 8 }}>{lesson.goals.map((goal) => <li key={goal}>{goal}</li>)}</ul></NoteBox></section>
    <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>Grammatik Schritt für Schritt</h2>{lesson.explanation.map(([title, text]) => <div key={title} style={{ display: "grid", gap: 5 }}><strong>{title}</strong><p style={{ margin: 0, lineHeight: 1.75 }}>{text}</p></div>)}</section>
    <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>Kernstrukturen auf einen Blick</h2><Table rows={lesson.rows} /></section>
    <KnowledgeTest questions={lesson.quiz} />
    <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>C1-Modellabsatz</h2><NoteBox tone="green">{lesson.model}</NoteBox></section>
    <section style={card}><label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontWeight: 800, lineHeight: 1.6 }}><input type="checkbox" checked={Boolean(checked)} onChange={(event) => onCheckedChange?.(event.target.checked)} style={{ marginTop: 4 }} /><span>Ich habe die Grammatik gelesen und den Knowledge Test bearbeitet.</span></label></section>
  </div>;
}
