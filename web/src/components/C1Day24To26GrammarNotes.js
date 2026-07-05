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
  24: {
    title: "Vergleiche, Passiv und Nominalstil bei Mobilität und Infrastruktur",
    subtitle: "Verkehr, Stadtplanung und öffentlicher Raum differenziert analysieren",
    why: "Mobilität und Infrastruktur verlangen Vergleiche zwischen Verkehrsmitteln, Stadtplanung und sozialem Zugang. Auf C1 musst du Maßnahmen sachlich beschreiben und ihre Folgen abwägen.",
    goals: ["Verkehrsformen differenziert vergleichen", "Infrastrukturmaßnahmen mit Passiv beschreiben", "Nominalstil für Stadtplanung nutzen", "soziale und ökologische Folgen abwägen"],
    rows: [["im Vergleich zu + Dativ", "Im Vergleich zum Auto entlastet der öffentliche Verkehr den innerstädtischen Raum."], ["Passiv", "Radwege werden in vielen Städten ausgebaut."], ["Nominalstil", "Der Ausbau des öffentlichen Verkehrs kann soziale Teilhabe erleichtern."], ["Abwägung", "Neue Infrastruktur verbessert Mobilität, kann jedoch Nutzungskonflikte im öffentlichen Raum verstärken."]],
    model: "Mobilität ist ein zentraler Faktor städtischer Lebensqualität. Im Vergleich zum Auto kann der öffentliche Verkehr Platz sparen und Emissionen reduzieren. Gleichzeitig müssen Angebote zuverlässig und bezahlbar sein, damit sie für unterschiedliche Bevölkerungsgruppen attraktiv werden. Der Ausbau von Radwegen und Bahnverbindungen sollte daher nicht isoliert betrachtet werden, sondern als Teil einer sozialen und ökologischen Stadtplanung.",
    checks: [["Im Vergleich ___ Auto", "zum"], ["Passiv: Städte bauen Radwege aus", "Radwege werden von Städten ausgebaut."], ["Nominalisierung: Verkehr ausbauen", "der Ausbau des Verkehrs"]],
  },
  25: {
    title: "Indirekte Rede und Bewertung bei Wissenschaft und Forschung",
    subtitle: "Forschungsergebnisse, Nutzen und Grenzen sachlich einordnen",
    why: "Bei Wissenschaft und Forschung musst du Ergebnisse darstellen, ohne sie ungeprüft zu übernehmen. Indirekte Rede, Quellenbezug und Bewertungsstrukturen machen deine C1-Antwort glaubwürdig.",
    goals: ["Forschungsergebnisse indirekt wiedergeben", "Konjunktiv I und Distanzmarker nutzen", "Nutzen und Grenzen von Forschung bewerten", "ethische Fragen sachlich einordnen"],
    rows: [["indirekte Rede", "Die Studie zeigt, neue Verfahren könnten die Behandlung verbessern."], ["Konjunktiv I", "Forschende erklärten, die Daten seien noch vorläufig."], ["laut / demnach", "Laut der Untersuchung profitieren besonders Patientinnen und Patienten mit frühem Zugang."], ["Abwägung", "Forschung ermöglicht Fortschritt, setzt jedoch Transparenz und ethische Kontrolle voraus."]],
    model: "Wissenschaftliche Forschung eröffnet große gesellschaftliche Chancen, sollte jedoch nicht unkritisch als automatische Lösung betrachtet werden. Forschende erklären häufig, neue Technologien könnten Krankheiten früher erkennen oder Ressourcen effizienter nutzen. Gleichzeitig bleiben viele Ergebnisse vorläufig, sodass Transparenz über Methoden und Grenzen notwendig ist. Forschung ist daher besonders wertvoll, wenn sie nachvollziehbar, ethisch kontrolliert und gesellschaftlich zugänglich ist.",
    checks: [["Direkt: Die Daten sind vorläufig. → indirekt", "Forschende erklärten, die Daten seien vorläufig."], ["Distanzmarker", "laut / demnach / angeblich"], ["Forschung bringt Fortschritt, ___ sie braucht Kontrolle.", "jedoch / aber"]],
  },
  26: {
    title: "Adjektivdeklination, Partizipialattribute und Abwägung bei nachhaltigem Konsum",
    subtitle: "Kaufverhalten, Ressourcen und Verantwortung präzise bewerten",
    why: "Nachhaltiger Konsum braucht genaue Beschreibungen: langlebige Produkte, reduzierte Verpackung, fair produzierte Waren. Mit Adjektivdeklination und Partizipialattributen kannst du solche Aspekte präzise formulieren.",
    goals: ["Adjektivdeklination bei Konsumthemen sicher verwenden", "Partizipialattribute bilden", "Kaufentscheidungen differenziert bewerten", "Verantwortung zwischen Individuen, Staat und Unternehmen abwägen"],
    rows: [["Adjektivdeklination", "nachhaltige Produkte; der bewusste Konsum; eine faire Produktion"], ["Partizip I", "steigende Preise; zunehmende Nachfrage"], ["Partizip II", "recycelte Materialien; fair produzierte Waren"], ["Abwägung", "Nachhaltiger Konsum ist wichtig, darf jedoch nicht nur von der Kaufkraft Einzelner abhängen."]],
    model: "Nachhaltiger Konsum setzt voraus, dass Verbraucherinnen und Verbraucher Informationen über Herkunft, Produktion und Umweltfolgen erhalten. Fair produzierte Waren und recycelte Materialien können Ressourcen schonen, sind jedoch oft teurer als konventionelle Produkte. Deshalb darf Verantwortung nicht ausschließlich auf einzelne Käuferinnen und Käufer übertragen werden. Unternehmen und Politik müssen Rahmenbedingungen schaffen, damit nachhaltige Entscheidungen leichter und bezahlbarer werden.",
    checks: [["die ___ Produkte", "nachhaltigen"], ["Partizip II: Waren wurden fair produziert", "fair produzierte Waren"], ["Nachhaltigkeit ist wichtig, ___ sie darf nicht nur teuer sein.", "jedoch / aber"]],
  },
};

export default function C1Day24To26GrammarNotes({ day, checked = false, onCheckedChange }) {
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
