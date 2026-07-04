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

const Table = ({ rows }) => <div style={{ overflowX: "auto" }}><table style={tableStyle}><thead><tr><th style={cellStyle}>Struktur</th><th style={cellStyle}>Beispiel</th></tr></thead><tbody>{rows.map(([a, b]) => <tr key={a + b}><td style={cellStyle}><strong>{a}</strong></td><td style={cellStyle}>{b}</td></tr>)}</tbody></table></div>;
const CheckAnswer = ({ question, answer }) => <details style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, background: "#fff" }}><summary style={{ cursor: "pointer", fontWeight: 800 }}>{question}</summary><div style={{ marginTop: 10, lineHeight: 1.7 }}><strong>Lösung:</strong> {answer}</div></details>;

const lessons = {
  25: {
    title: "Adjektivdeklination und Vergleichsformen bei nachhaltigem Konsum",
    subtitle: "Kaufverhalten, Ressourcen und Verantwortung präzise beschreiben",
    why: "Bei nachhaltigem Konsum beschreibst du Produkte und vergleichst Entscheidungen. Dafür brauchst du genaue Adjektive und Vergleichsformen.",
    goals: ["Adjektive nach Artikeln verwenden", "Komparativ und Superlativ nutzen", "Produkte nach Preis, Qualität und Nachhaltigkeit vergleichen", "Konsumverhalten differenziert bewerten"],
    rows: [["bestimmter Artikel", "die nachhaltige Entscheidung; das regionale Produkt"], ["unbestimmter Artikel", "eine nachhaltige Entscheidung; ein regionales Produkt"], ["Komparativ", "Regionale Produkte sind oft umweltfreundlicher als importierte Waren."], ["Superlativ", "Die beste Lösung ist nicht immer die billigste Lösung."]],
    model: "Nachhaltiger Konsum bedeutet, bewusste Entscheidungen zu treffen. Ein regionales Produkt ist oft umweltfreundlicher als ein importiertes Produkt. Trotzdem ist die nachhaltigste Lösung nicht immer die günstigste. Viele Menschen achten auf einen fairen Preis, gute Qualität und umweltfreundliche Verpackung.",
    checks: [["eine ___ Entscheidung", "nachhaltige"], ["ein ___ Produkt", "regionales"], ["Regionale Produkte sind oft ___ als importierte Waren.", "umweltfreundlicher"]],
  },
  26: {
    title: "Formelle Sprache und indirekte Fragen bei Behörden und Terminen",
    subtitle: "Anliegen, Termine und schriftliche Kommunikation höflich formulieren",
    why: "Bei Behörden und Terminen musst du höflich, klar und strukturiert schreiben. Indirekte Fragen und formelle Bitten helfen dir dabei.",
    goals: ["indirekte Fragen mit ob und W-Fragen bilden", "höfliche Bitten mit könnten und würden formulieren", "formelle E-Mails strukturieren", "Anliegen klar erklären"],
    rows: [["indirekte Ja/Nein-Frage", "Könnten Sie mir mitteilen, ob noch ein Termin frei ist?"], ["indirekte W-Frage", "Ich möchte wissen, welche Unterlagen ich mitbringen muss."], ["höfliche Bitte", "Würden Sie mir bitte eine Bestätigung senden?"], ["formeller Einstieg", "Ich wende mich an Sie, weil ich einen Termin vereinbaren möchte."]],
    model: "Ich wende mich an Sie, weil ich einen Termin vereinbaren möchte. Könnten Sie mir bitte mitteilen, ob nächste Woche noch ein Termin frei ist? Außerdem möchte ich wissen, welche Unterlagen ich mitbringen muss. Es wäre hilfreich, wenn Sie mir eine kurze Bestätigung senden könnten.",
    checks: [["Haben Sie einen Termin? → indirekt", "Könnten Sie mir mitteilen, ob Sie einen Termin haben?"], ["Welche Unterlagen brauche ich? → indirekt", "Ich möchte wissen, welche Unterlagen ich brauche."], ["Bitte höflich: Senden Sie mir eine Bestätigung.", "Würden Sie mir bitte eine Bestätigung senden?"]],
  },
  27: {
    title: "Argumentieren und Reagieren mit Redemitteln für die B2-Prüfung",
    subtitle: "Mündliche und schriftliche B2-Prüfungsstrategien anwenden",
    why: "In der B2-Prüfung musst du Meinungen klar einleiten, auf andere reagieren und Beispiele geben. Redemittel machen deine Antwort sicherer.",
    goals: ["Meinungen klar einleiten", "Zustimmung und Widerspruch höflich ausdrücken", "Argumente mit Beispielen stützen", "auf andere Aussagen reagieren"],
    rows: [["Meinung", "Meiner Meinung nach sollte man dieses Problem ernst nehmen."], ["zustimmen", "Da stimme ich Ihnen zu, weil …"], ["widersprechen", "Ich verstehe Ihren Punkt, aber ich sehe das etwas anders."], ["Beispiel", "Ein gutes Beispiel dafür ist …"]],
    model: "Meiner Meinung nach ist es wichtig, ein Thema von mehreren Seiten zu betrachten. Ich verstehe den Punkt, dass schnelle Lösungen praktisch wirken. Trotzdem sollte man auch langfristige Folgen beachten. Ein gutes Beispiel dafür ist die Digitalisierung: Sie spart Zeit, aber sie kann auch neue Probleme schaffen.",
    checks: [["Redemittel für Meinung", "Meiner Meinung nach …"], ["Höflich widersprechen", "Ich verstehe Ihren Punkt, aber …"], ["Beispiel einleiten", "Ein gutes Beispiel dafür ist …"]],
  },
  28: {
    title: "Review: Verknüpfungen, Wortstellung und Selbstkorrektur",
    subtitle: "B2-Themen wiederholen, Schwächen erkennen und den nächsten Lernplan erstellen",
    why: "Am Ende der B2-Einheit kontrollierst du deine Sprache: Verbposition, Konnektoren, Artikel, Kasus und klare Argumentation.",
    goals: ["wichtige B2-Konnektoren wiederholen", "Verbposition kontrollieren", "Argumente strukturiert schreiben", "eigene Fehler erkennen"],
    rows: [["Hauptsatz", "Deshalb sollte man klare Regeln einführen."], ["Nebensatz", "…, weil klare Regeln Orientierung geben."], ["Abwägung", "Einerseits ist das praktisch, andererseits entstehen neue Risiken."], ["Selbstkorrektur", "Prüfe Verb, Artikel, Kasus, Konnektor und Satzende."]],
    model: "In den letzten B2-Themen habe ich gelernt, Argumente klarer zu strukturieren. Ich kann Gründe mit weil nennen, Folgen mit deshalb ausdrücken und Gegensätze mit obwohl erklären. Besonders wichtig ist die Wortstellung, weil das Verb im Nebensatz am Ende steht.",
    checks: [["Nebensatz mit weil", "Ich lerne B2, weil ich meine Sprache verbessern möchte."], ["Hauptsatz mit deshalb", "Deshalb übe ich regelmäßig."], ["Abwägung", "Einerseits ist es schwierig, andererseits hilft es mir sehr."]],
  },
};

export default function B2Day25To28GrammarNotes({ day, checked = false, onCheckedChange }) {
  const lesson = lessons[Number(day)];
  if (!lesson) return null;
  return <div style={{ display: "grid", gap: 16 }}>
    <section style={card}><span style={{ ...styles.badge, width: "fit-content" }}>B2 · Day {day} · Grammar Notes</span><h2 style={{ ...styles.title, margin: 0, fontSize: "clamp(1.7rem,4vw,2.5rem)" }}>{lesson.title}</h2><p style={{ ...styles.subtitle, margin: 0, lineHeight: 1.7 }}>{lesson.subtitle}</p></section>
    <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>Warum brauchst du diese Grammatik auf B2?</h2><p style={{ margin: 0, lineHeight: 1.75 }}>{lesson.why}</p><NoteBox><strong>Nach dieser Lektion kannst du:</strong><ul style={{ ...listStyle, marginTop: 8 }}>{lesson.goals.map((goal) => <li key={goal}>{goal}</li>)}</ul></NoteBox></section>
    <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>Kernstrukturen</h2><Table rows={lesson.rows} /></section>
    <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>B2-Modellabsatz</h2><NoteBox tone="green">{lesson.model}</NoteBox></section>
    <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>Selbstkontrolle</h2><p style={{ margin: 0, lineHeight: 1.7 }}>Löse die Aufgabe zuerst selbst und öffne danach die Antwort.</p>{lesson.checks.map(([question, answer], index) => <CheckAnswer key={question} question={`${index + 1}. ${question}`} answer={answer} />)}</section>
    <section style={card}><label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontWeight: 800, lineHeight: 1.6 }}><input type="checkbox" checked={Boolean(checked)} onChange={(event) => onCheckedChange?.(event.target.checked)} style={{ marginTop: 4 }} /><span>Ich habe die vollständigen Grammatiknotizen gelesen und die Beispiele verstanden.</span></label></section>
  </div>;
}
