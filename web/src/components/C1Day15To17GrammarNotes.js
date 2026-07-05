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
  15: {
    title: "Konzessive und kausale Strukturen bei Bildung und lebenslangem Lernen",
    subtitle: "Weiterbildung, Zugang und Eigenverantwortung differenziert bewerten",
    why: "Beim Thema Bildung musst du erklären, warum lebenslanges Lernen nötig ist, obwohl Zeit, Geld und Zugang ungleich verteilt sind. C1 verlangt eine ausgewogene Argumentation mit Ursachen, Einwänden und Folgen.",
    goals: ["Einwände mit obgleich, wenngleich und zwar … jedoch formulieren", "Gründe mit da, zumal und angesichts ausdrücken", "Bildungschancen differenziert bewerten", "eine klare C1-Stellungnahme schreiben"],
    rows: [["obgleich / wenngleich", "Obgleich Weiterbildung wichtig ist, fehlt vielen Berufstätigen die Zeit dafür."], ["angesichts + Genitiv", "Angesichts des digitalen Wandels wird lebenslanges Lernen unverzichtbar."], ["zwar … jedoch", "Onlinekurse sind zwar flexibel, jedoch nicht für alle Lernenden gleich geeignet."], ["zumal", "Förderprogramme sind sinnvoll, zumal Bildung soziale Mobilität erleichtern kann."]],
    model: "Lebenslanges Lernen gewinnt angesichts des digitalen Wandels zunehmend an Bedeutung. Obgleich viele Menschen Weiterbildung als notwendig erkennen, scheitert sie oft an Zeit, Geld oder fehlender Beratung. Onlinekurse sind zwar flexibel, jedoch ersetzen sie nicht immer persönliche Begleitung. Deshalb sollte Bildungspolitik nicht nur Eigenverantwortung fordern, sondern auch faire Zugänge schaffen.",
    checks: [["Synonym für obwohl", "obgleich / wenngleich"], ["Angesichts ___ digitalen Wandels", "des"], ["Onlinekurse sind zwar flexibel, ___ nicht für alle passend.", "jedoch / aber"]],
  },
  16: {
    title: "Passiv, Zustandspassiv und Einschränkungen bei Technologie im Alltag",
    subtitle: "digitale Dienste, Datenschutz und Abhängigkeit sachlich analysieren",
    why: "Technologie im Alltag wird oft über Prozesse beschrieben: Daten werden gespeichert, Dienste werden genutzt, Systeme sind vernetzt. Passivformen und einschränkende Strukturen helfen dir, sachlich und kritisch zu argumentieren.",
    goals: ["Vorgangspassiv und Zustandspassiv unterscheiden", "digitale Prozesse sachlich beschreiben", "Einschränkungen mit allerdings, jedoch und sofern formulieren", "Chancen und Risiken digitaler Alltagsdienste abwägen"],
    rows: [["Vorgangspassiv", "Persönliche Daten werden täglich verarbeitet."], ["Zustandspassiv", "Viele Geräte sind dauerhaft vernetzt."], ["Einschränkung", "Digitale Dienste erleichtern den Alltag, allerdings entstehen neue Abhängigkeiten."], ["Bedingung", "Technologie ist hilfreich, sofern Datenschutz und Transparenz gewährleistet sind."]],
    model: "Digitale Technologien erleichtern viele Alltagssituationen, weil Informationen schneller verfügbar sind und Prozesse automatisiert werden. Gleichzeitig werden persönliche Daten in großem Umfang verarbeitet. Viele Geräte sind inzwischen dauerhaft vernetzt, wodurch Komfort entsteht, aber auch neue Abhängigkeiten. Technologie ist daher nur dann gesellschaftlich sinnvoll, sofern Datenschutz, Transparenz und digitale Bildung ernst genommen werden.",
    checks: [["Passiv: Firmen verarbeiten Daten", "Daten werden von Firmen verarbeitet."], ["Zustand: Geräte sind vernetzt", "Viele Geräte sind dauerhaft vernetzt."], ["Technologie hilft, ___ Datenschutz beachtet wird.", "sofern"]],
  },
  17: {
    title: "Argumentationsstruktur und Nominalstil bei Umwelt und Verantwortung",
    subtitle: "Nachhaltigkeit, Klima und persönliches Handeln systematisch analysieren",
    why: "Umwelt und Verantwortung verlangen eine klare Struktur: Problem, Ursache, Folge, Gegenposition und Lösung. Auf C1 brauchst du Nominalstil und logische Verknüpfungen, um komplexe Umweltfragen differenziert darzustellen.",
    goals: ["Umweltprobleme mit Nominalstil verdichten", "Argumente mit folglich, demnach und dennoch strukturieren", "individuelle und politische Verantwortung unterscheiden", "eine differenzierte Schlussfolgerung formulieren"],
    rows: [["Nominalstil", "die Reduzierung von Emissionen; die Förderung nachhaltiger Mobilität"], ["folglich / demnach", "Der Ressourcenverbrauch steigt; folglich müssen Konsummuster überdacht werden."], ["dennoch", "Individuelles Verhalten reicht nicht aus; dennoch bleibt es ein wichtiger Beitrag."], ["Abwägung", "Klimaschutz erfordert sowohl politische Rahmenbedingungen als auch persönliche Verantwortung."]],
    model: "Die Reduzierung von Emissionen gehört zu den zentralen Herausforderungen moderner Gesellschaften. Zwar kann persönliches Verhalten allein die Klimakrise nicht lösen, dennoch beeinflussen Konsum, Mobilität und Energieverbrauch die Nachfrage. Folglich braucht es politische Rahmenbedingungen, die nachhaltige Entscheidungen erleichtern. Verantwortung sollte daher weder nur individualisiert noch vollständig an den Staat abgegeben werden.",
    checks: [["Nominalisierung: Emissionen reduzieren", "die Reduzierung von Emissionen"], ["Synonym für deshalb", "folglich / demnach"], ["Persönliches Handeln reicht nicht aus; ___ ist es wichtig.", "dennoch"]],
  },
};

export default function C1Day15To17GrammarNotes({ day, checked = false, onCheckedChange }) {
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
