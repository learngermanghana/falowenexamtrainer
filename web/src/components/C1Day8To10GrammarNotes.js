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
  8: {
    title: "Partizipialattribute und Nominalstil bei Wohnen und Stadtentwicklung",
    subtitle: "Wohnraum, Stadtplanung und soziale Folgen präzise verdichten",
    why: "Auf C1 musst du städtische Entwicklungen nicht nur beschreiben, sondern verdichtet analysieren: steigende Mieten, fehlender Wohnraum, geplante Quartiere und sozial verdrängte Gruppen. Partizipialattribute und Nominalstil helfen dir, komplexe Informationen elegant in einen Satz einzubauen.",
    goals: ["Partizip I und Partizip II als Attribute verwenden", "Nominalstil für sachliche C1-Analyse nutzen", "Ursachen und Folgen von Stadtentwicklung präzise formulieren", "Wohnprobleme differenziert bewerten"],
    rows: [["Partizip I", "die steigenden Mieten; die wachsende Nachfrage"], ["Partizip II", "der geplante Wohnungsbau; die verdrängten Bewohner"], ["Nominalstil", "Die Verdichtung der Innenstädte führt zu neuen Nutzungskonflikten."], ["C1-Abwägung", "Zwar schafft Neubau Entlastung, jedoch kann er soziale Spannungen verschärfen."]],
    model: "Die zunehmende Verdichtung vieler Städte führt zu konkurrierenden Interessen zwischen Wohnraum, Verkehr und Grünflächen. Besonders problematisch sind steigende Mieten und verdrängte Bewohner, weil dadurch soziale Durchmischung verloren gehen kann. Gleichzeitig ist geplanter Wohnungsbau notwendig, um dem Mangel an bezahlbaren Wohnungen zu begegnen. Entscheidend ist daher eine Stadtentwicklung, die ökologische, soziale und wirtschaftliche Aspekte zusammenführt.",
    checks: [["Partizip I: Mieten steigen → die ___ Mieten", "steigenden"], ["Partizip II: Bewohner wurden verdrängt → die ___ Bewohner", "verdrängten"], ["Nominalisierung: Städte werden verdichtet", "die Verdichtung der Städte"]],
  },
  9: {
    title: "Konzessive und adversative Strukturen bei Konsum und Werbung",
    subtitle: "Werbung, Kaufverhalten und Manipulation differenziert bewerten",
    why: "Beim Thema Konsum und Werbung musst du widersprüchliche Positionen abwägen: Werbung informiert, beeinflusst aber auch; Konsum schafft Auswahl, erzeugt aber Druck. C1 braucht präzise Gegensätze und Einschränkungen.",
    goals: ["Gegensätze mit während, wohingegen und dagegen formulieren", "Einschränkungen mit obwohl, obgleich und auch wenn ausdrücken", "Werbewirkung differenziert analysieren", "Argumente mit zwar … jedoch verdichten"],
    rows: [["während / wohingegen", "Während Werbung Orientierung bieten kann, erzeugt sie zugleich künstliche Bedürfnisse."], ["obgleich", "Obgleich Konsumenten informiert wirken, werden viele Entscheidungen emotional gesteuert."], ["zwar … jedoch", "Werbung ist zwar ein Teil der Marktwirtschaft, jedoch sollte ihre Wirkung kritisch reflektiert werden."], ["dagegen", "Preisvergleiche wirken rational; dagegen sprechen impulsive Käufe eher für emotionale Steuerung."]],
    model: "Werbung ist zwar ein wichtiger Bestandteil moderner Märkte, jedoch beeinflusst sie Kaufentscheidungen oft stärker, als Konsumenten wahrhaben möchten. Während sie über Produkte informiert, erzeugt sie zugleich Bedürfnisse, die vorher kaum vorhanden waren. Obgleich viele Menschen glauben, frei zu entscheiden, werden ihre Wünsche durch Bilder, Sprache und soziale Trends gelenkt. Daher sollte Medien- und Konsumkompetenz stärker gefördert werden.",
    checks: [["Werbung informiert. Sie beeinflusst aber auch. → während", "Während Werbung informiert, beeinflusst sie auch."], ["Synonym für obwohl auf C1", "obgleich / wenngleich"], ["zwar …", "zwar … jedoch / aber"]],
  },
  10: {
    title: "Passiv, Modalpassiv und differenzierte Bewertung bei Integration und Gesellschaft",
    subtitle: "Teilhabe, Verantwortung und gesellschaftlichen Zusammenhalt sachlich analysieren",
    why: "Integration und Gesellschaft sind C1-Themen, bei denen Prozesse und Verantwortung oft wichtiger sind als einzelne Personen. Passiv, Modalpassiv und abwägende Formulierungen machen deine Analyse sachlicher und reifer.",
    goals: ["Vorgangspassiv und Modalpassiv sicher nutzen", "gesellschaftliche Prozesse sachlich beschreiben", "Verantwortung differenziert zuordnen", "Integration mit Chancen und Grenzen bewerten"],
    rows: [["Vorgangspassiv", "Integrationsangebote werden in vielen Kommunen ausgebaut."], ["Modalpassiv", "Sprachbarrieren müssen systematisch abgebaut werden."], ["von / durch", "Teilhabe wird durch Bildung, Arbeit und Sprache erleichtert."], ["abwägend", "Integration kann nur gelingen, wenn individuelle Anstrengung und institutionelle Unterstützung zusammengedacht werden."]],
    model: "Integration darf nicht allein als individuelle Anpassungsleistung verstanden werden. Sprachbarrieren müssen abgebaut, Bildungswege geöffnet und Diskriminierung ernst genommen werden. Gleichzeitig kann Teilhabe nur entstehen, wenn Zugewanderte aktiv Möglichkeiten nutzen und gesellschaftliche Institutionen verlässliche Strukturen bereitstellen. Entscheidend ist daher ein Verständnis von Integration, das Rechte, Pflichten und soziale Anerkennung miteinander verbindet.",
    checks: [["Aktiv: Kommunen bauen Angebote aus. → Passiv", "Angebote werden von Kommunen ausgebaut."], ["Modalpassiv: Man muss Barrieren abbauen.", "Barrieren müssen abgebaut werden."], ["Teilhabe wird ___ Bildung erleichtert.", "durch"]],
  },
};

export default function C1Day8To10GrammarNotes({ day, checked = false, onCheckedChange }) {
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
