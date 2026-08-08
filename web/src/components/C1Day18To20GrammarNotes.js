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
  18: {
    title: "Adversative und konzessive Strukturen bei Gesellschaft und Zusammenhalt",
    subtitle: "soziale Konflikte, Solidarität und Gemeinschaft differenziert bewerten",
    why: "Gesellschaftlicher Zusammenhalt entsteht nicht automatisch. Du musst Gegensätze, Spannungen und mögliche Lösungen sprachlich präzise verbinden. Dafür brauchst du adversative und konzessive Strukturen auf C1-Niveau.",
    goals: ["Gegensätze mit während, wohingegen und dagegen formulieren", "Einwände mit obgleich, wenngleich und selbst wenn einbauen", "soziale Konflikte differenziert analysieren", "Solidarität und Verantwortung ausgewogen bewerten"],
    rows: [["während / wohingegen", "Während einige Gruppen von Wohlstand profitieren, fühlen sich andere zunehmend ausgeschlossen."], ["obgleich", "Obgleich Vielfalt gesellschaftlich bereichern kann, entstehen ohne Dialog leicht Missverständnisse."], ["selbst wenn", "Selbst wenn Solidarität gefordert wird, müssen konkrete Strukturen geschaffen werden."], ["dagegen", "Gemeinschaft stärkt Vertrauen; dagegen führen soziale Spaltungen zu Unsicherheit."]],
    model: "Gesellschaftlicher Zusammenhalt setzt voraus, dass unterschiedliche Interessen ernst genommen werden. Während manche Menschen von wirtschaftlicher Entwicklung profitieren, fühlen sich andere sozial abgehängt. Obgleich Vielfalt ein großes Potenzial bietet, kann sie ohne faire Teilhabe auch Spannungen verstärken. Deshalb braucht eine stabile Gesellschaft nicht nur Appelle an Solidarität, sondern konkrete Räume für Begegnung, Bildung und Mitbestimmung.",
    quiz: [
      { question: "Welcher Konnektor bedeutet ungefähr dasselbe wie ‚obwohl‘?", options: ["obgleich", "deshalb", "dadurch", "folglich"], answer: 0, explanation: "‚Obgleich‘ ist ein gehobenes konzessives Synonym zu ‚obwohl‘." },
      { question: "Welche Formulierung stellt einen direkten Gegensatz her?", options: ["Selbst wenn alle zustimmen ...", "Während einige profitieren, werden andere ausgeschlossen.", "Da alle profitieren ...", "Damit alle profitieren ..."], answer: 1, explanation: "‚Während‘ kann auf C1 zwei gegensätzliche Entwicklungen gegenüberstellen." },
      { question: "Welche Fortsetzung passt? Gemeinschaft stärkt Vertrauen; ___ kann soziale Spaltung Unsicherheit erzeugen.", options: ["dagegen", "deswegen", "damit", "infolge"], answer: 0, explanation: "‚Dagegen‘ markiert hier den Gegensatz." },
    ],
  },
  19: {
    title: "Futur, Modalverben und Einschränkungen bei Arbeit der Zukunft",
    subtitle: "Digitalisierung, neue Kompetenzen und Arbeitsmodelle prognostizieren",
    why: "Bei Arbeit der Zukunft musst du über Entwicklungen sprechen, ohne zu absolut zu klingen. C1 verlangt vorsichtige Prognosen, notwendige Maßnahmen und klare Einschränkungen.",
    goals: ["Prognosen mit werden, dürfte und könnte formulieren", "Notwendigkeit mit müssen/sollen im Passiv ausdrücken", "Risiken und Chancen differenziert abwägen", "Arbeitsmodelle sachlich vergleichen"],
    rows: [["werden + Infinitiv", "Flexible Arbeitsmodelle werden weiter an Bedeutung gewinnen."], ["dürfte / könnte", "Einige Tätigkeiten dürften automatisiert werden."], ["Modalpassiv", "Digitale Kompetenzen müssen kontinuierlich gefördert werden."], ["Einschränkung", "Homeoffice erhöht Flexibilität, allerdings kann die Trennung von Arbeit und Freizeit schwieriger werden."]],
    model: "Die Arbeitswelt wird sich durch Digitalisierung und Automatisierung weiter verändern. Einige Tätigkeiten dürften verschwinden, während andere Berufsfelder entstehen. Digitale Kompetenzen müssen deshalb frühzeitig gefördert werden, damit Beschäftigte nicht abgehängt werden. Gleichzeitig sollte die Zukunft der Arbeit nicht nur unter Effizienzgesichtspunkten betrachtet werden, denn flexible Modelle können sowohl Freiheit als auch neue Belastungen schaffen.",
    quiz: [
      { question: "Welche Formulierung ist eine vorsichtige Prognose?", options: ["Alle Berufe verschwinden.", "Einige Tätigkeiten dürften automatisiert werden.", "Automatisierung ist immer schlecht.", "Niemand wird mehr arbeiten."], answer: 1, explanation: "‚dürften‘ signalisiert eine begründete, aber nicht absolute Prognose." },
      { question: "Welche Form ist korrektes Modalpassiv?", options: ["Kompetenzen fördern müssen.", "Kompetenzen müssen gefördert werden.", "Kompetenzen werden müssen fördern.", "Kompetenzen müssen gefördert."], answer: 1, explanation: "Modalverb + Partizip II + werden bildet das Modalpassiv." },
      { question: "Welcher Ausdruck schränkt eine positive Aussage ein?", options: ["allerdings", "deshalb", "dadurch", "folglich"], answer: 0, explanation: "‚allerdings‘ signalisiert eine Einschränkung oder einen Einwand." },
    ],
  },
  20: {
    title: "Digitale Gesundheit klar erklären: Passiv und Nominalisierung",
    subtitle: "Wie du Prozesse, Risiken und Bedingungen auf C1 sachlich formulierst",
    why: "Beim Thema digitale Gesundheit sprichst du oft nicht darüber, wer etwas tut, sondern darüber, was mit Daten, Diagnosen oder Behandlungen passiert. Genau dafür ist das Passiv nützlich. Mit Nominalisierungen kannst du anschließend ganze Vorgänge kompakt benennen und deine Argumentation sachlicher gestalten.",
    goals: ["Vorgänge mit werden + Partizip II ins Passiv setzen", "Handlungen in Nomen umformen, ohne den Satz unnötig kompliziert zu machen", "Passiv und Nominalstil sinnvoll kombinieren", "Chancen digitaler Gesundheit an klare Bedingungen knüpfen"],
    rows: [
      ["Aktiv → Vorgangspassiv", "Apps speichern Gesundheitsdaten. → Gesundheitsdaten werden von Apps gespeichert."],
      ["Passiv ohne Täter", "Gesundheitsdaten werden digital gespeichert. Der Vorgang ist wichtiger als die handelnde Person."],
      ["Verb → Nominalisierung", "Daten digital speichern → die digitale Speicherung von Daten"],
      ["Verb → Nominalisierung", "Patienten medizinisch beraten → die medizinische Beratung von Patienten"],
      ["Bedingung mit sofern", "Digitale Angebote sind sinnvoll, sofern Datenschutz und medizinische Qualität gewährleistet sind."],
      ["Abwägung mit jedoch", "Die digitale Speicherung erleichtert den Zugriff, sie birgt jedoch auch Missbrauchsrisiken."],
    ],
    model: "Digitale Gesundheitsangebote können die medizinische Versorgung erleichtern, besonders wenn Termine knapp oder Wege lang sind. Dabei werden jedoch sensible Gesundheitsdaten verarbeitet und gespeichert. Die sichere Speicherung dieser Informationen ist deshalb eine zentrale Voraussetzung für das Vertrauen der Nutzerinnen und Nutzer. Gleichzeitig kann die digitale Beratung den Zugang zur Versorgung verbessern, sofern die medizinische Qualität gewährleistet bleibt. Digitale Angebote sollten ärztliche Betreuung daher sinnvoll ergänzen, sie jedoch nicht pauschal ersetzen.",
    quiz: [
      { question: "Welche Passivform ist korrekt? Apps speichern Gesundheitsdaten.", options: ["Gesundheitsdaten speichern von Apps.", "Gesundheitsdaten werden von Apps gespeichert.", "Gesundheitsdaten sind von Apps speichern.", "Gesundheitsdaten wurden von Apps speichern."], answer: 1, explanation: "Vorgangspassiv im Präsens: werden + Partizip II → werden gespeichert." },
      { question: "Welche Nominalisierung passt zu ‚Daten digital speichern‘?", options: ["das digitale Speichern Daten", "die digitale Speicherung von Daten", "die Daten speichern digital", "das gespeicherte digital"], answer: 1, explanation: "Aus ‚speichern‘ wird ‚die Speicherung‘; die Ergänzung steht hier mit ‚von Daten‘." },
      { question: "Warum ist das Passiv bei digitaler Gesundheit nützlich?", options: ["Weil man dadurch immer kürzere Sätze schreibt.", "Weil der Vorgang oder das Ergebnis im Mittelpunkt stehen kann.", "Weil man damit nur über die Vergangenheit spricht.", "Weil das Passiv den Dativ ersetzt."], answer: 1, explanation: "Bei Prozessen wie Speicherung, Verarbeitung oder Prüfung ist oft wichtiger, was geschieht, als wer handelt." },
      { question: "Welche Formulierung ist für eine C1-Abwägung am stärksten?", options: ["Gesundheitsapps sind gut.", "Gesundheitsapps sind schlecht.", "Digitale Angebote können den Zugang verbessern, sofern Datenschutz und medizinische Qualität gewährleistet sind.", "Apps machen alles einfacher."], answer: 2, explanation: "Die Aussage bewertet einen Vorteil und nennt gleichzeitig eine klare Bedingung." },
      { question: "Welche Formulierung verbindet Nominalstil und Risiko sinnvoll?", options: ["Daten speichern und Risiko.", "Die digitale Speicherung sensibler Daten kann Missbrauchsrisiken erhöhen.", "Gespeichert Daten Risiko haben.", "Die Speicherung ist Daten und Risiko."], answer: 1, explanation: "‚die digitale Speicherung sensibler Daten‘ ist eine präzise Nominalgruppe und lässt sich direkt bewerten." },
    ],
  },
};

const MiniLesson = ({ day }) => {
  if (Number(day) !== 20) return null;
  return (
    <section style={card}>
      <h2 style={{ margin: 0, fontSize: "1.2rem" }}>So baust du die Grammatik auf</h2>
      <div style={{ display: "grid", gap: 12 }}>
        <NoteBox>
          <strong>1. Passiv: Was passiert?</strong><br />
          Aktiv: <em>Ärzte prüfen die Daten.</em><br />
          Passiv: <em>Die Daten werden von Ärzten geprüft.</em><br />
          Ohne Täter: <em>Die Daten werden geprüft.</em>
        </NoteBox>
        <NoteBox tone="amber">
          <strong>2. Nominalisierung: Wie nenne ich den Vorgang?</strong><br />
          <em>Daten speichern</em> → <strong>die Speicherung von Daten</strong><br />
          <em>Daten verarbeiten</em> → <strong>die Verarbeitung von Daten</strong><br />
          <em>Patienten beraten</em> → <strong>die Beratung von Patienten</strong>
        </NoteBox>
        <NoteBox tone="green">
          <strong>3. C1: Form + Bewertung verbinden</strong><br />
          <em>Gesundheitsdaten werden digital verarbeitet. Die Verarbeitung kann Behandlungen beschleunigen, sofern Datenschutz und Qualität gewährleistet sind.</em>
        </NoteBox>
      </div>
      <p style={{ margin: 0, lineHeight: 1.75 }}><strong>Merksatz:</strong> Nutze Passiv für den Vorgang. Nutze Nominalisierung, wenn du diesen Vorgang anschließend als Thema, Chance, Risiko oder Voraussetzung bewerten möchtest.</p>
    </section>
  );
};

const KnowledgeTest = ({ questions = [] }) => {
  const [answers, setAnswers] = useState({});
  const score = useMemo(() => questions.reduce((total, question, index) => total + (answers[index] === question.answer ? 1 : 0), 0), [answers, questions]);
  const answered = Object.keys(answers).length;

  return (
    <section style={{ ...card, border: "2px solid #2563eb", background: "linear-gradient(135deg,#eff6ff,#ffffff)" }}>
      <div>
        <span style={{ ...styles.badge, width: "fit-content", background: "#dbeafe", color: "#1e3a8a" }}>Knowledge Test</span>
        <h2 style={{ margin: "8px 0 0", fontSize: "1.25rem" }}>Teste die Grammatik direkt</h2>
        <p style={{ margin: "6px 0 0", color: "#475569", lineHeight: 1.65 }}>Klicke auf eine Antwort. Du siehst sofort, ob sie richtig ist und warum.</p>
      </div>

      {questions.map((question, questionIndex) => {
        const selected = answers[questionIndex];
        return (
          <div key={question.question} style={{ border: "1px solid #cbd5e1", borderRadius: 14, padding: 14, background: "#fff", display: "grid", gap: 10 }}>
            <strong>{questionIndex + 1}. {question.question}</strong>
            <div style={{ display: "grid", gap: 8 }}>
              {question.options.map((option, optionIndex) => {
                const isSelected = selected === optionIndex;
                const isCorrect = optionIndex === question.answer;
                const answeredQuestion = selected !== undefined;
                const background = answeredQuestion && isCorrect ? "#f0fdf4" : answeredQuestion && isSelected ? "#fef2f2" : "#fff";
                const borderColor = answeredQuestion && isCorrect ? "#22c55e" : answeredQuestion && isSelected ? "#ef4444" : "#cbd5e1";
                return (
                  <button
                    key={option}
                    type="button"
                    onClick={() => setAnswers((old) => ({ ...old, [questionIndex]: optionIndex }))}
                    style={{ textAlign: "left", border: `1px solid ${borderColor}`, borderRadius: 12, padding: "11px 12px", background, cursor: "pointer", font: "inherit", lineHeight: 1.55 }}
                  >
                    {String.fromCharCode(65 + optionIndex)}) {option}
                  </button>
                );
              })}
            </div>
            {selected !== undefined ? (
              <NoteBox tone={selected === question.answer ? "green" : "amber"}>
                <strong>{selected === question.answer ? "Richtig." : "Noch nicht."}</strong> {question.explanation}
              </NoteBox>
            ) : null}
          </div>
        );
      })}

      <NoteBox tone={answered === questions.length && score === questions.length ? "green" : "blue"}>
        <strong>Ergebnis:</strong> {score}/{questions.length} richtig{answered < questions.length ? ` · ${questions.length - answered} noch offen` : ""}
      </NoteBox>
    </section>
  );
};

export default function C1Day18To20GrammarNotes({ day, checked = false, onCheckedChange }) {
  const lesson = lessons[Number(day)];
  if (!lesson) return null;
  return <div style={{ display: "grid", gap: 16 }}>
    <section style={card}><span style={{ ...styles.badge, width: "fit-content" }}>C1 · Day {day} · Grammar Notes</span><h2 style={{ ...styles.title, margin: 0, fontSize: "clamp(1.7rem,4vw,2.5rem)" }}>{lesson.title}</h2><p style={{ ...styles.subtitle, margin: 0, lineHeight: 1.7 }}>{lesson.subtitle}</p></section>
    <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>Warum brauchst du diese Grammatik auf C1?</h2><p style={{ margin: 0, lineHeight: 1.75 }}>{lesson.why}</p><NoteBox><strong>Nach dieser Lektion kannst du:</strong><ul style={{ ...listStyle, marginTop: 8 }}>{lesson.goals.map((goal) => <li key={goal}>{goal}</li>)}</ul></NoteBox></section>
    <MiniLesson day={day} />
    <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>Kernstrukturen mit Beispielen</h2><Table rows={lesson.rows} /></section>
    <KnowledgeTest questions={lesson.quiz} />
    <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>C1-Modellabsatz: So klingt es im Zusammenhang</h2><NoteBox tone="green">{lesson.model}</NoteBox></section>
    <section style={card}><label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontWeight: 800, lineHeight: 1.6 }}><input type="checkbox" checked={Boolean(checked)} onChange={(event) => onCheckedChange?.(event.target.checked)} style={{ marginTop: 4 }} /><span>Ich habe die Grammatiknotizen gelesen und den Knowledge Test bearbeitet.</span></label></section>
  </div>;
}
