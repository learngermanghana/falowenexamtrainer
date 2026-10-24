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

const lesson = {
  title: "Finale, kausale und konditionale Strukturen bei Engagement und Ehrenamt",
  subtitle: "gesellschaftliches Engagement differenziert begründen und bewerten",
  why: "Beim Thema Engagement und Ehrenamt musst du erklären, warum Menschen sich beteiligen, wozu Projekte dienen und unter welchen Bedingungen freiwilliges Engagement langfristig funktioniert. Auf C1 brauchst du dafür präzise Zweck-, Grund- und Bedingungssätze.",
  goals: ["Ziele mit damit, dazu und zu diesem Zweck formulieren", "Gründe mit da, zumal und aufgrund ausdrücken", "Bedingungen mit sofern, vorausgesetzt dass und falls nennen", "gesellschaftlichen Nutzen und Grenzen von Ehrenamt differenziert bewerten"],
  rows: [
    ["damit / dazu", "Viele Vereine bieten flexible Aufgaben an, damit mehr Menschen sich engagieren können."],
    ["zu diesem Zweck", "Zu diesem Zweck sollten lokale Initiativen besser finanziert werden."],
    ["da / zumal", "Ehrenamt ist gesellschaftlich wertvoll, zumal es Vertrauen und Zusammenhalt stärkt."],
    ["sofern", "Engagement kann langfristig wirken, sofern Freiwillige gut begleitet werden."],
    ["vorausgesetzt dass", "Projekte bleiben stabil, vorausgesetzt dass Verantwortung fair verteilt wird."],
  ],
  model: "Ehrenamtliches Engagement kann den gesellschaftlichen Zusammenhalt erheblich stärken, sofern es gut organisiert und langfristig unterstützt wird. Viele Menschen beteiligen sich, da sie Verantwortung übernehmen oder konkrete Probleme in ihrer Umgebung lösen möchten. Vereine sollten niedrigschwellige Angebote schaffen, damit auch Berufstätige oder ältere Menschen teilnehmen können. Zu diesem Zweck wären flexible Zeiten und klare Aufgaben sinnvoll. Ehrenamt darf jedoch staatliche Verantwortung nicht ersetzen; vielmehr sollte es professionelle Strukturen ergänzen.",
  checks: [
    ["Formuliere einen Zweck mit damit", "Vereine bieten flexible Aufgaben an, damit mehr Menschen teilnehmen können."],
    ["Synonym für weil auf C1", "da / zumal / aufgrund"],
    ["Bedingung: Engagement wirkt langfristig, ___ Freiwillige begleitet werden.", "sofern / vorausgesetzt dass"],
  ],
};

export default function C1Day11GrammarNotes({ checked = false, onCheckedChange }) {
  return <div style={{ display: "grid", gap: 16 }}>
    <section style={card}><span style={{ ...styles.badge, width: "fit-content" }}>C1 · Day 11 · Grammar Notes</span><h2 style={{ ...styles.title, margin: 0, fontSize: "clamp(1.7rem,4vw,2.5rem)" }}>{lesson.title}</h2><p style={{ ...styles.subtitle, margin: 0, lineHeight: 1.7 }}>{lesson.subtitle}</p></section>
    <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>Warum brauchst du diese Grammatik auf C1?</h2><p style={{ margin: 0, lineHeight: 1.75 }}>{lesson.why}</p><NoteBox><strong>Nach dieser Lektion kannst du:</strong><ul style={{ ...listStyle, marginTop: 8 }}>{lesson.goals.map((goal) => <li key={goal}>{goal}</li>)}</ul></NoteBox></section>
    <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>Kernstrukturen</h2><Table rows={lesson.rows} /></section>
    <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>C1-Modellabsatz</h2><NoteBox tone="green">{lesson.model}</NoteBox></section>
    <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>Selbstkontrolle</h2><p style={{ margin: 0, lineHeight: 1.7 }}>Löse die Aufgabe zuerst selbst und öffne danach die Antwort.</p>{lesson.checks.map(([question, answer], index) => <CheckAnswer key={question} question={`${index + 1}. ${question}`} answer={answer} />)}</section>
    <section style={card}><label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontWeight: 800, lineHeight: 1.6 }}><input type="checkbox" checked={Boolean(checked)} onChange={(event) => onCheckedChange?.(event.target.checked)} style={{ marginTop: 4 }} /><span>Ich habe die vollständigen Grammatiknotizen gelesen und die Beispiele verstanden.</span></label></section>
  </div>;
}
