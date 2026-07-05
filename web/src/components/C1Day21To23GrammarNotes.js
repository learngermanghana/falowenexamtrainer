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
  21: {
    title: "Temporale und kausale Strukturen bei Migration und Teilhabe",
    subtitle: "Migrationserfahrungen, Sprache und Chancen differenziert beschreiben",
    why: "Migration und Teilhabe sind Prozess-Themen: Menschen kommen an, lernen Sprache, suchen Arbeit und bauen soziale Kontakte auf. Dafür brauchst du temporale und kausale Strukturen, um Entwicklungen und Gründe klar darzustellen.",
    goals: ["zeitliche Abläufe mit nachdem, sobald und während strukturieren", "Gründe mit da, zumal und aufgrund ausdrücken", "Teilhabe als Prozess beschreiben", "Chancen und Hürden differenziert bewerten"],
    rows: [["nachdem", "Nachdem Zugewanderte Sprachkenntnisse aufgebaut haben, verbessern sich ihre Chancen auf dem Arbeitsmarkt."], ["sobald", "Sobald Beratung zugänglich ist, können bürokratische Hürden schneller überwunden werden."], ["aufgrund + Genitiv", "Aufgrund fehlender Anerkennung bleiben manche Qualifikationen ungenutzt."], ["zumal", "Sprachförderung ist zentral, zumal sie soziale Kontakte und berufliche Teilhabe erleichtert."]],
    model: "Migration ist nicht nur ein Ortswechsel, sondern ein längerer Prozess gesellschaftlicher Teilhabe. Nachdem Menschen angekommen sind, benötigen sie Sprache, Beratung und Zugang zu Bildung oder Arbeit. Aufgrund bürokratischer Hürden bleiben vorhandene Qualifikationen jedoch häufig ungenutzt. Sprachförderung ist daher besonders wichtig, zumal sie nicht nur berufliche Chancen verbessert, sondern auch soziale Kontakte ermöglicht.",
    checks: [["Zeitlich: ___ Menschen angekommen sind, brauchen sie Beratung.", "Nachdem"], ["Aufgrund ___ fehlenden Anerkennung", "der"], ["Synonym für weil auf C1", "da / zumal / aufgrund"]],
  },
  22: {
    title: "Indirekte Rede und argumentative Distanz bei Politik und Mitbestimmung",
    subtitle: "Demokratie, Verantwortung und Beteiligung sachlich diskutieren",
    why: "Bei Politik und Mitbestimmung musst du Aussagen, Forderungen und Positionen sachlich wiedergeben, ohne sie automatisch zu übernehmen. Indirekte Rede und Distanzmarker machen deine Argumentation reifer.",
    goals: ["politische Aussagen indirekt wiedergeben", "Konjunktiv I in formeller Sprache nutzen", "Distanzmarker wie laut, angeblich und demnach verwenden", "Beteiligung und Verantwortung differenziert bewerten"],
    rows: [["indirekte Rede", "Die Initiative fordert, Bürger sollten stärker beteiligt werden."], ["Konjunktiv I", "Der Bericht erklärt, politische Bildung sei eine Voraussetzung für Mitbestimmung."], ["laut / demnach", "Laut der Studie fühlen sich viele junge Menschen politisch nicht ausreichend vertreten."], ["Abwägung", "Mitbestimmung stärkt Demokratie, setzt jedoch Information und Verantwortungsbewusstsein voraus."]],
    model: "Politische Mitbestimmung ist ein zentraler Bestandteil demokratischer Gesellschaften. Laut aktuellen Diskussionen fühlen sich jedoch viele Bürger nicht ausreichend gehört. Eine Initiative fordert, Beteiligungsformate sollten niedrigschwelliger gestaltet werden. Gleichzeitig setzt Mitbestimmung voraus, dass Menschen informiert sind und Verantwortung für gemeinsame Entscheidungen übernehmen. Demokratie lebt daher nicht nur von Rechten, sondern auch von politischer Bildung und aktiver Beteiligung.",
    checks: [["Direkt: Politische Bildung ist wichtig. → indirekt", "Der Bericht erklärt, politische Bildung sei wichtig."], ["Distanzmarker", "laut / demnach / angeblich"], ["Mitbestimmung stärkt Demokratie, ___ sie braucht Information.", "jedoch / aber"]],
  },
  23: {
    title: "Konzessive und finale Strukturen bei Freizeit und Work-Life-Balance",
    subtitle: "Erholung, Grenzen und Lebensqualität ausgewogen bewerten",
    why: "Work-Life-Balance verlangt, dass du gegensätzliche Erwartungen verbindest: beruflicher Erfolg ist wichtig, Erholung aber auch. Mit konzessiven und finalen Strukturen kannst du diese Balance präzise darstellen.",
    goals: ["Einwände mit obwohl, obgleich und selbst wenn formulieren", "Zwecke mit damit und um … zu ausdrücken", "Grenzen zwischen Arbeit und Freizeit differenziert erklären", "Lebensqualität ausgewogen bewerten"],
    rows: [["obgleich", "Obgleich viele Menschen flexible Arbeit schätzen, verschwimmen dadurch oft Grenzen."], ["selbst wenn", "Selbst wenn jemand gern arbeitet, braucht er regelmäßige Erholung."], ["damit", "Unternehmen sollten klare Erreichbarkeitsregeln schaffen, damit Freizeit geschützt bleibt."], ["um … zu", "Viele Beschäftigte planen bewusste Pausen, um langfristig leistungsfähig zu bleiben."]],
    model: "Work-Life-Balance ist mehr als ein persönliches Zeitmanagementproblem. Obgleich flexible Arbeitsmodelle mehr Freiheit ermöglichen, können sie auch dazu führen, dass berufliche Aufgaben ständig präsent bleiben. Unternehmen sollten klare Regeln zur Erreichbarkeit schaffen, damit Erholung wirklich geschützt wird. Gleichzeitig müssen Beschäftigte lernen, Grenzen zu setzen, um langfristig gesund und leistungsfähig zu bleiben.",
    checks: [["C1-Synonym für obwohl", "obgleich / wenngleich"], ["Zweck: Regeln schaffen, ___ Freizeit geschützt bleibt.", "damit"], ["Pausen planen, ___ gesund zu bleiben.", "um"]],
  },
};

export default function C1Day21To23GrammarNotes({ day, checked = false, onCheckedChange }) {
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
