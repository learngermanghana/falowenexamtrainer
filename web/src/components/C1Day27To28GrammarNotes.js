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
    title: "Ursache, Folge und Abwägung beim demografischen Wandel",
    subtitle: "Demografische Entwicklungen präzise erklären und Generationengerechtigkeit differenziert bewerten",
    why: "Beim Thema demografischer Wandel musst du langfristige Ursachen und Folgen miteinander verknüpfen und politische Maßnahmen abwägen. Auf C1-Niveau helfen dir Nominalstil, Ursache-Folge-Strukturen und konzessive Formulierungen dabei, Renten, Pflege, Fachkräftemangel und Generationengerechtigkeit sachlich zu beurteilen.",
    goals: ["Ursachen mit aufgrund, infolge und angesichts präzise ausdrücken", "Folgen mit führen zu, zur Folge haben und sich auswirken auf beschreiben", "Nominalstil für demografische Entwicklungen einsetzen", "Maßnahmen mit obwohl, während und wohingegen ausgewogen bewerten"],
    rows: [["Ursache mit aufgrund + Genitiv", "Aufgrund der steigenden Lebenserwartung wächst der langfristige Pflegebedarf."], ["Folge", "Der Rückgang der Erwerbsbevölkerung kann zu einem zunehmenden Fachkräftemangel führen."], ["Nominalstil", "Die Alterung der Bevölkerung erhöht den Finanzierungsdruck auf das Rentensystem."], ["Abwägung / Konzession", "Obwohl ein höheres Renteneintrittsalter die Finanzierung entlasten kann, ist es für körperlich belastende Berufe nur eingeschränkt geeignet."], ["Gegenüberstellung", "Während jüngere Generationen steigende Sozialbeiträge tragen könnten, sind viele ältere Menschen auf eine verlässliche Absicherung angewiesen."]],
    model: "Der demografische Wandel stellt viele Gesellschaften vor langfristige Herausforderungen. Aufgrund niedriger Geburtenraten und einer steigenden Lebenserwartung wächst der Anteil älterer Menschen, während die Zahl der Erwerbstätigen in einigen Bereichen zurückgeht. Diese Entwicklung kann zu Fachkräftemangel, höherem Pflegebedarf und zusätzlichem Finanzierungsdruck auf das Rentensystem führen. Obwohl Maßnahmen wie Fachkräftezuwanderung oder ein späterer Renteneintritt zur Entlastung beitragen können, müssen gesundheitliche Unterschiede und die Belastung jüngerer Generationen berücksichtigt werden. Generationengerechtigkeit setzt daher voraus, dass Kosten und Chancen möglichst ausgewogen verteilt werden.",
    checks: [["Formuliere eine Ursache mit aufgrund: Die Lebenserwartung steigt.", "Aufgrund der steigenden Lebenserwartung wächst der Pflegebedarf."], ["Nominalisierung: Die Bevölkerung altert.", "die Alterung der Bevölkerung"], ["Formuliere eine ausgewogene Einschränkung zum höheren Rentenalter.", "Obwohl ein höheres Renteneintrittsalter das Rentensystem entlasten kann, ist es nicht für alle Berufsgruppen gleichermaßen geeignet."]],
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
