import React from "react";
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
const CheckAnswer = ({ question, answer }) => <details style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, background: "#fff" }}><summary style={{ cursor: "pointer", fontWeight: 800 }}>{question}</summary><div style={{ marginTop: 10, lineHeight: 1.7 }}><strong>Lösung:</strong> {answer}</div></details>;

const lessons = {
  18: {
    title: "Adversative und konzessive Strukturen bei Gesellschaft und Zusammenhalt",
    subtitle: "soziale Konflikte, Solidarität und Gemeinschaft differenziert bewerten",
    why: "Gesellschaftlicher Zusammenhalt entsteht nicht automatisch. Du musst Gegensätze, Spannungen und mögliche Lösungen sprachlich präzise verbinden. Dafür brauchst du adversative und konzessive Strukturen auf C1-Niveau.",
    goals: ["Gegensätze mit während, wohingegen und dagegen formulieren", "Einwände mit obgleich, wenngleich und selbst wenn einbauen", "soziale Konflikte differenziert analysieren", "Solidarität und Verantwortung ausgewogen bewerten"],
    rows: [["während / wohingegen", "Während einige Gruppen von Wohlstand profitieren, fühlen sich andere zunehmend ausgeschlossen."], ["obgleich", "Obgleich Vielfalt gesellschaftlich bereichern kann, entstehen ohne Dialog leicht Missverständnisse."], ["selbst wenn", "Selbst wenn Solidarität gefordert wird, müssen konkrete Strukturen geschaffen werden."], ["dagegen", "Gemeinschaft stärkt Vertrauen; dagegen führen soziale Spaltungen zu Unsicherheit."]],
    model: "Gesellschaftlicher Zusammenhalt setzt voraus, dass unterschiedliche Interessen ernst genommen werden. Während manche Menschen von wirtschaftlicher Entwicklung profitieren, fühlen sich andere sozial abgehängt. Obgleich Vielfalt ein großes Potenzial bietet, kann sie ohne faire Teilhabe auch Spannungen verstärken. Deshalb braucht eine stabile Gesellschaft nicht nur Appelle an Solidarität, sondern konkrete Räume für Begegnung, Bildung und Mitbestimmung.",
    checks: [["Synonym für obwohl", "obgleich / wenngleich"], ["Während einige profitieren, ___ andere ausgeschlossen werden.", "wohningegen / während"], ["Gemeinschaft stärkt Vertrauen; ___ soziale Spaltung verunsichert.", "dagegen"]],
  },
  19: {
    title: "Futur, Modalverben und Einschränkungen bei Arbeit der Zukunft",
    subtitle: "Digitalisierung, neue Kompetenzen und Arbeitsmodelle prognostizieren",
    why: "Bei Arbeit der Zukunft musst du über Entwicklungen sprechen, ohne zu absolut zu klingen. C1 verlangt vorsichtige Prognosen, notwendige Maßnahmen und klare Einschränkungen.",
    goals: ["Prognosen mit werden, dürfte und könnte formulieren", "Notwendigkeit mit müssen/sollen im Passiv ausdrücken", "Risiken und Chancen differenziert abwägen", "Arbeitsmodelle sachlich vergleichen"],
    rows: [["werden + Infinitiv", "Flexible Arbeitsmodelle werden weiter an Bedeutung gewinnen."], ["dürfte / könnte", "Einige Tätigkeiten dürften automatisiert werden."], ["Modalpassiv", "Digitale Kompetenzen müssen kontinuierlich gefördert werden."], ["Einschränkung", "Homeoffice erhöht Flexibilität, allerdings kann die Trennung von Arbeit und Freizeit schwieriger werden."]],
    model: "Die Arbeitswelt wird sich durch Digitalisierung und Automatisierung weiter verändern. Einige Tätigkeiten dürften verschwinden, während andere Berufsfelder entstehen. Digitale Kompetenzen müssen deshalb frühzeitig gefördert werden, damit Beschäftigte nicht abgehängt werden. Gleichzeitig sollte die Zukunft der Arbeit nicht nur unter Effizienzgesichtspunkten betrachtet werden, denn flexible Modelle können sowohl Freiheit als auch neue Belastungen schaffen.",
    checks: [["Vorsichtige Prognose", "Einige Tätigkeiten dürften automatisiert werden."], ["Man muss Kompetenzen fördern. → Modalpassiv", "Kompetenzen müssen gefördert werden."], ["Homeoffice ist flexibel, ___ es kann belasten.", "allerdings / jedoch"]],
  },
  20: {
    title: "Nominalisierung und Passiv bei digitaler Gesundheit",
    subtitle: "Gesundheitsapps, Datenschutz und Chancen sachlich analysieren",
    why: "Digitale Gesundheit verbindet Medizin, Technologie und Datenschutz. C1-Antworten sollten Prozesse sachlich beschreiben und Chancen sowie Risiken abwägen. Nominalisierung und Passiv helfen dir dabei.",
    goals: ["Gesundheitsprozesse mit Passiv beschreiben", "Nominalstil für sachliche Analyse nutzen", "Datenschutz und Zugangsgerechtigkeit erklären", "Chancen und Grenzen digitaler Gesundheit differenziert bewerten"],
    rows: [["Vorgangspassiv", "Gesundheitsdaten werden zunehmend digital gespeichert."], ["Nominalisierung", "die digitale Speicherung sensibler Daten"], ["durch + Akkusativ", "Diagnosen können durch digitale Anwendungen unterstützt werden."], ["Abwägung", "Digitale Gesundheit bietet Chancen, sofern Datenschutz und medizinische Qualität gewährleistet sind."]],
    model: "Digitale Gesundheit kann den Zugang zu medizinischer Beratung erleichtern, insbesondere wenn Wege lang oder Termine knapp sind. Gleichzeitig werden sensible Gesundheitsdaten verarbeitet, sodass Datenschutz und Transparenz besonders wichtig sind. Die digitale Speicherung medizinischer Informationen kann Behandlungen effizienter machen, birgt jedoch auch Missbrauchsrisiken. Deshalb sollten digitale Angebote ärztliche Betreuung ergänzen, aber nicht unkritisch ersetzen.",
    checks: [["Passiv: Apps speichern Daten", "Daten werden von Apps gespeichert."], ["Nominalisierung: Daten digital speichern", "die digitale Speicherung von Daten"], ["Digitale Gesundheit hilft, ___ Qualität gesichert ist.", "sofern"]],
  },
};

export default function C1Day18To20GrammarNotes({ day, checked = false, onCheckedChange }) {
  const lesson = lessons[Number(day)];
  if (!lesson) return null;
  return <div style={{ display: "grid", gap: 16 }}>
    <section style={card}><span style={{ ...styles.badge, width: "fit-content" }}>C1 · Day {day} · Grammar Notes</span><h2 style={{ ...styles.title, margin: 0, fontSize: "clamp(1.7rem,4vw,2.5rem)" }}>{lesson.title}</h2><p style={{ ...styles.subtitle, margin: 0, lineHeight: 1.7 }}>{lesson.subtitle}</p></section>
    <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>Warum brauchst du diese Grammatik auf C1?</h2><p style={{ margin: 0, lineHeight: 1.75 }}>{lesson.why}</p><NoteBox><strong>Nach dieser Lektion kannst du:</strong><ul style={{ ...listStyle, marginTop: 8 }}>{lesson.goals.map((goal) => <li key={goal}>{goal}</li>)}</ul></NoteBox></section>
    <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>Kernstrukturen</h2><Table rows={lesson.rows} /></section>
    <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>C1-Modellabsatz</h2><NoteBox tone="green">{lesson.model}</NoteBox></section>
    <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>Selbstkontrolle</h2><p style={{ margin: 0, lineHeight: 1.7 }}>Löse die Aufgabe zuerst selbst und öffne danach die Antwort.</p>{lesson.checks.map(([question, answer], index) => <CheckAnswer key={question} question={`${index + 1}. ${question}`} answer={answer} />)}</section>
    <section style={card}><label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontWeight: 800, lineHeight: 1.6 }}><input type="checkbox" checked={Boolean(checked)} onChange={(event) => onCheckedChange?.(event.target.checked)} style={{ marginTop: 4 }} /><span>Ich habe die vollständigen Grammatiknotizen gelesen und die Beispiele verstanden.</span></label></section>
  </div>;
}
