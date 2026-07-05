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
  27: {
    title: "Formelle Sprache, Passiv und Nominalstil bei Digitalisierung und Verwaltung",
    subtitle: "Online-Services, Bürokratie und digitalen Zugang sachlich bewerten",
    why: "Bei Verwaltung und Digitalisierung brauchst du eine sachliche, formelle Sprache. Du erklärst, welche Prozesse vereinfacht werden können, wo Hürden bestehen und wie digitale Teilhabe gesichert werden sollte.",
    goals: ["formelle Anliegen präzise formulieren", "Verwaltungsprozesse mit Passiv beschreiben", "Nominalstil für bürokratische Themen nutzen", "digitalen Zugang und Datenschutz abwägen"],
    rows: [["Passiv", "Anträge können online eingereicht werden."], ["Modalpassiv", "Digitale Formulare müssen barrierefrei gestaltet werden."], ["Nominalstil", "Die Vereinfachung bürokratischer Abläufe spart Zeit und Ressourcen."], ["formelle Einschränkung", "Digitale Verwaltung ist effizient, setzt jedoch Zugang und Datenschutz voraus."]],
    model: "Digitale Verwaltung kann bürokratische Abläufe erheblich vereinfachen, sofern Online-Dienste verständlich und barrierefrei gestaltet werden. Anträge können schneller eingereicht und Informationen zentral bereitgestellt werden. Gleichzeitig dürfen Menschen ohne stabile Internetverbindung oder digitale Kompetenzen nicht ausgeschlossen werden. Die Digitalisierung der Verwaltung ist daher nur dann erfolgreich, wenn Effizienz, Datenschutz und sozialer Zugang gemeinsam berücksichtigt werden.",
    checks: [["Passiv: Bürger reichen Anträge online ein", "Anträge werden online eingereicht."], ["Man muss Formulare barrierefrei gestalten. → Modalpassiv", "Formulare müssen barrierefrei gestaltet werden."], ["Nominalisierung: Abläufe vereinfachen", "die Vereinfachung von Abläufen"]],
  },
  28: {
    title: "Review: Verknüpfungen, Wortstellung und Selbstkorrektur auf C1",
    subtitle: "C1-Themen übertragen, Fehler erkennen und Antworten verbessern",
    why: "Am Ende des Kurses geht es darum, Strukturen flexibel zu übertragen. Du solltest Argumente klar verbinden, Wortstellung kontrollieren und deine Antwort selbstständig verbessern können.",
    goals: ["Argumente logisch mit jedoch, folglich, insofern und dennoch verbinden", "Nebensatz-Wortstellung sicher prüfen", "Nominalstil und Passiv gezielt einsetzen", "eigene C1-Texte systematisch korrigieren"],
    rows: [["Gegensatz", "Die Maßnahme ist sinnvoll; dennoch bleiben offene Fragen."], ["Folge", "Die Nachfrage steigt; folglich müssen Angebote ausgebaut werden."], ["Nebensatz", "…, weil digitale Teilhabe nicht selbstverständlich ist."], ["Selbstkorrektur", "Prüfe nach dem Schreiben: Struktur, Verbposition, Artikel, Präzision und roter Faden."]],
    model: "Eine überzeugende C1-Antwort entsteht nicht nur durch schwierige Wörter, sondern durch klare Struktur und präzise Verknüpfung. Zuerst sollte das Problem eingeordnet werden, danach folgen Ursachen, Folgen, Gegenpositionen und konkrete Lösungen. Obwohl komplexe Strukturen wichtig sind, müssen sie verständlich bleiben. Wer am Ende Verbposition, Artikel und logische Übergänge überprüft, verbessert die Qualität seiner Antwort deutlich.",
    checks: [["Gegensatz mit dennoch", "Die Idee ist gut; dennoch gibt es Risiken."], ["Folge mit folglich", "Die Nachfrage steigt; folglich braucht man mehr Angebote."], ["Was prüfst du am Ende?", "Struktur, Verbposition, Artikel, Präzision und roter Faden."]],
  },
};

export default function C1Day27To28GrammarNotes({ day, checked = false, onCheckedChange }) {
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
