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
  12: {
    title: "Erweiterte Vergleichs- und Bewertungsstrukturen bei Freizeit und Kultur",
    subtitle: "kulturelle Angebote, Teilhabe und Lebensqualität differenziert beurteilen",
    why: "Freizeit und Kultur sind auf C1 nicht nur persönliche Vorlieben. Du bewertest Zugang, gesellschaftliche Bedeutung, soziale Teilhabe und kulturelle Vielfalt. Dafür brauchst du präzise Vergleichs- und Bewertungsstrukturen.",
    goals: ["kulturelle Angebote differenziert vergleichen", "Bewertungen mit insofern, einerseits … andererseits und im Hinblick auf formulieren", "soziale Teilhabe und Lebensqualität erklären", "eine ausgewogene Stellungnahme schreiben"],
    rows: [["im Hinblick auf + Akkusativ", "Im Hinblick auf gesellschaftliche Teilhabe sind günstige Kulturangebote besonders wichtig."], ["insofern", "Kultur ist insofern relevant, als sie Begegnung und Perspektivwechsel ermöglicht."], ["einerseits … andererseits", "Einerseits fördern Festivals Gemeinschaft, andererseits können sie Lärm und Kosten verursachen."], ["je … desto", "Je leichter kulturelle Angebote zugänglich sind, desto stärker profitieren unterschiedliche Gruppen."]],
    model: "Kulturelle Angebote tragen wesentlich zur Lebensqualität bei, insofern sie Begegnung, Bildung und gesellschaftliche Teilhabe ermöglichen. Im Hinblick auf soziale Gerechtigkeit sollten Museen, Theater und Konzerte nicht nur für wohlhabende Gruppen zugänglich sein. Einerseits benötigen kulturelle Einrichtungen ausreichende Finanzierung, andererseits müssen Eintrittspreise bezahlbar bleiben. Je vielfältiger und niedrigschwelliger das Angebot ist, desto eher wird Kultur zu einem verbindenden Element des öffentlichen Lebens.",
    checks: [["Kultur ist relevant, ___ sie Begegnung ermöglicht.", "insofern, als"], ["Im Hinblick ___ Teilhabe", "auf gesellschaftliche"], ["Je zugänglicher Kultur ist, ___ mehr Menschen profitieren.", "desto / umso"]],
  },
  13: {
    title: "Nominalstil und Relativsätze bei Mehrsprachigkeit",
    subtitle: "sprachliche Vielfalt, Bildung und Identität präzise analysieren",
    why: "Mehrsprachigkeit verlangt eine differenzierte Sprache, weil du Vorteile, Herausforderungen und Identitätsfragen verbinden musst. Nominalstil und Relativsätze helfen dir, komplexe Zusammenhänge kompakt auszudrücken.",
    goals: ["Mehrsprachigkeit mit Nominalisierungen beschreiben", "komplexe Relativsätze sicher bilden", "Bildungschancen und Identität differenziert erklären", "Vor- und Nachteile ausgewogen bewerten"],
    rows: [["Nominalisierung", "mehrere Sprachen erwerben → der Erwerb mehrerer Sprachen"], ["Relativsatz mit deren", "Kinder, deren Alltag mehrsprachig ist, entwickeln oft flexible Sprachstrategien."], ["Präposition + Relativpronomen", "Die Sprache, mit der man aufwächst, prägt das Selbstbild."], ["Abwägung", "Mehrsprachigkeit eröffnet Chancen, kann jedoch auch Unsicherheiten im Bildungssystem sichtbar machen."]],
    model: "Der Erwerb mehrerer Sprachen kann kognitive, berufliche und kulturelle Vorteile mit sich bringen. Kinder, deren Alltag mehrsprachig ist, lernen häufig, zwischen unterschiedlichen Kommunikationssituationen flexibel zu wechseln. Gleichzeitig kann Mehrsprachigkeit im Bildungssystem unterschätzt werden, wenn nur die dominante Sprache als Maßstab gilt. Entscheidend ist daher eine Förderung, die sprachliche Vielfalt nicht als Defizit, sondern als Ressource betrachtet.",
    checks: [["Nominalisierung: mehrere Sprachen erwerben", "der Erwerb mehrerer Sprachen"], ["Kinder, ___ Alltag mehrsprachig ist", "deren"], ["Die Sprache, ___ der man aufwächst", "mit"]],
  },
  14: {
    title: "Zukunftsformen, Modalpassiv und Hypothesen bei Innovation und Zukunft",
    subtitle: "technologischen Wandel, Chancen und Risiken differenziert prognostizieren",
    why: "Innovation und Zukunft erfordern Sprache für Prognosen, Möglichkeiten und notwendige Maßnahmen. Auf C1 solltest du nicht nur sagen, was passieren wird, sondern auch unter welchen Bedingungen Entwicklungen sinnvoll oder problematisch werden.",
    goals: ["Zukunft mit werden + Infinitiv und dürfte/könnte ausdrücken", "Modalpassiv für notwendige Maßnahmen nutzen", "Hypothesen mit falls, sofern und vorausgesetzt dass formulieren", "Chancen und Risiken neuer Technologien abwägen"],
    rows: [["Zukunft", "Künstliche Intelligenz wird viele Arbeitsprozesse verändern."], ["vorsichtige Prognose", "Einige Berufsbilder dürften sich grundlegend wandeln."], ["Modalpassiv", "Datenschutz und Transparenz müssen stärker berücksichtigt werden."], ["Bedingung", "Innovation kann gesellschaftlich nützen, sofern ethische Grenzen beachtet werden."]],
    model: "Technologische Innovationen werden die Gesellschaft in den kommenden Jahren erheblich verändern. Viele Arbeitsprozesse dürften automatisiert werden, während kreative und soziale Kompetenzen an Bedeutung gewinnen. Gleichzeitig müssen Datenschutz, Transparenz und Zugangsgerechtigkeit stärker berücksichtigt werden. Innovation kann nur dann langfristig nützen, sofern sie nicht allein wirtschaftlichen Interessen folgt, sondern auch ethische und soziale Folgen einbezieht.",
    checks: [["Vorsichtige Prognose mit dürfte", "Einige Berufe dürften sich verändern."], ["Man muss Datenschutz beachten. → Modalpassiv", "Datenschutz muss beachtet werden."], ["Innovation nützt, ___ ethische Grenzen beachtet werden.", "sofern / vorausgesetzt dass"]],
  },
};

export default function C1Day12To14GrammarNotes({ day, checked = false, onCheckedChange }) {
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
