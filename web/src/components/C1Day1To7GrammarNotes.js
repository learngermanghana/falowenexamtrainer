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
  1: {
    title: "Zielsetzung und strukturierte C1-Argumentation",
    subtitle: "Lernweg, Ziele und Erwartungen präzise formulieren",
    why: "Auf C1 musst du Ziele nicht nur nennen, sondern reflektiert begründen: Warum lernst du, welche Strategie passt zu dir und woran misst du Fortschritt? Dafür brauchst du klare Argumentationsstruktur und präzise Verknüpfungen.",
    goals: ["Ziele differenziert formulieren", "Begründungen mit da, zumal und insofern verknüpfen", "Kontraste mit jedoch und dennoch ausdrücken", "einen persönlichen Lernweg reflektiert beschreiben"],
    rows: [["da / zumal", "Ich setze mir klare Ziele, zumal regelmäßige Kontrolle den Fortschritt sichtbar macht."], ["insofern", "Der Lernplan ist sinnvoll, insofern er realistische Etappen enthält."], ["jedoch / dennoch", "C1 ist anspruchsvoll; dennoch lässt sich Fortschritt durch Routinen sichern."], ["Nominalstil", "Die regelmäßige Reflexion des Lernprozesses erhöht die Eigenverantwortung."]],
    model: "Ein erfolgreicher C1-Lernweg setzt voraus, dass Ziele konkret und überprüfbar formuliert werden. Dabei reicht es nicht, allgemein besser sprechen zu wollen; vielmehr sollte man festlegen, welche Kompetenzen systematisch ausgebaut werden. Regelmäßige Reflexion ist wichtig, zumal sie Schwächen sichtbar macht. Zwar bleibt C1 anspruchsvoll, dennoch kann ein realistischer Plan die Motivation langfristig stabilisieren.",
    checks: [["Synonym für weil auf gehobenem Niveau", "da / zumal"], ["C1 ist schwierig; ___ ist Fortschritt möglich.", "dennoch"], ["Nominalisierung: den Lernprozess reflektieren", "die Reflexion des Lernprozesses"]],
  },
  2: {
    title: "Relativsätze und Nominalisierung bei Kultur und Identität",
    subtitle: "Zugehörigkeit, Herkunft und kulturelle Prägung differenziert beschreiben",
    why: "Kultur und Identität sind vielschichtig. C1 verlangt, dass du Personen, Gruppen und Erfahrungen genau beschreibst, ohne zu vereinfachen. Relativsätze und Nominalisierungen helfen dir, Zusammenhänge präzise darzustellen.",
    goals: ["komplexe Relativsätze bilden", "Identität mit Nominalisierungen ausdrücken", "Zugehörigkeit und Abgrenzung sprachlich differenzieren", "kulturelle Prägung reflektiert bewerten"],
    rows: [["Relativsatz", "Menschen, deren Biografie von mehreren Kulturen geprägt ist, entwickeln oft flexible Perspektiven."], ["Präposition + Relativpronomen", "Die Werte, mit denen man aufwächst, beeinflussen das Selbstbild."], ["Nominalisierung", "die Auseinandersetzung mit Herkunft und Zugehörigkeit"], ["Abwägung", "Identität ist weder völlig frei wählbar noch ausschließlich durch Herkunft bestimmt."]],
    model: "Identität entsteht durch Erfahrungen, Sprache, Familie und gesellschaftliche Erwartungen. Menschen, deren Alltag von mehreren Kulturen geprägt ist, erleben Zugehörigkeit oft vielschichtig. Die Auseinandersetzung mit der eigenen Herkunft kann das Selbstbild stärken, aber auch Konflikte sichtbar machen. Entscheidend ist daher ein offenes Verständnis von Identität, das Unterschiede anerkennt, ohne Menschen auf Herkunft zu reduzieren.",
    checks: [["Relativpronomen: Menschen, ___ Biografie vielfältig ist", "deren"], ["Nominalisierung: sich mit Herkunft auseinandersetzen", "die Auseinandersetzung mit Herkunft"], ["Präposition: Werte, ___ denen man aufwächst", "mit"]],
  },
  3: {
    title: "Indirekte Rede und Quellenbewertung bei Medienkompetenz",
    subtitle: "Informationen, Fake News und digitale Quellen sachlich einordnen",
    why: "Bei Medienkompetenz musst du Aussagen wiedergeben, Quellen bewerten und Distanz zur Information zeigen. Indirekte Rede, Konjunktiv I und präzise Bewertungswörter sind dafür zentral.",
    goals: ["Aussagen indirekt wiedergeben", "Konjunktiv I in Nachrichtensprache erkennen", "Quellen seriös bewerten", "Unsicherheit und Distanz sprachlich markieren"],
    rows: [["indirekte Rede", "Der Bericht erklärt, die Zahlen seien noch nicht vollständig geprüft."], ["Konjunktiv I", "Die Behörde teilte mit, es gebe neue Hinweise."], ["Distanz", "Angeblich soll die Meldung aus einer offiziellen Quelle stammen."], ["Bewertung", "Die Quelle wirkt glaubwürdig, sofern Herkunft und Datum überprüfbar sind."]],
    model: "Medienkompetenz bedeutet, Informationen nicht nur zu konsumieren, sondern kritisch einzuordnen. Wenn ein Artikel behauptet, eine Studie belege eine bestimmte These, sollte geprüft werden, wer die Studie veröffentlicht hat und welche Daten verwendet wurden. Seriöse Quellen machen Herkunft, Datum und Autorenschaft transparent. Besonders bei emotionalen Meldungen ist Vorsicht nötig, da sie häufig schneller geteilt als überprüft werden.",
    checks: [["Direkt: Die Zahlen sind unsicher. → indirekt", "Der Bericht erklärt, die Zahlen seien unsicher."], ["Distanzmarker", "angeblich / laut Bericht / offenbar"], ["Seriös prüfen: Quelle, Datum, Autor", "Quelle, Datum und Autorenschaft überprüfen"]],
  },
  4: {
    title: "Konzessive Strukturen bei Beziehungen und Teamarbeit",
    subtitle: "Konflikte, Kooperation und Rollen differenziert erklären",
    why: "In Beziehungen und Teams gibt es oft Spannungen: Nähe und Distanz, Harmonie und Konflikt, individuelle Interessen und gemeinsame Ziele. C1 braucht dafür präzise Einschränkungen und Gegensätze.",
    goals: ["obgleich, wenngleich und selbst wenn verwenden", "Gegensätze mit während und wohingegen formulieren", "Teamkonflikte ausgewogen erklären", "Lösungen mit Bedingungen verbinden"],
    rows: [["obgleich / wenngleich", "Obgleich Konflikte unangenehm sind, können sie Entwicklung ermöglichen."], ["selbst wenn", "Selbst wenn ein Team gut funktioniert, bleiben klare Rollen wichtig."], ["während", "Während einige Mitarbeitende Struktur brauchen, arbeiten andere kreativer mit Freiraum."], ["zwar … jedoch", "Teamarbeit ist zwar effizient, jedoch nur bei klarer Kommunikation." ]],
    model: "Teamarbeit gelingt nicht automatisch, selbst wenn alle Beteiligten motiviert sind. Während manche Konflikte auf Missverständnissen beruhen, entstehen andere durch unklare Rollen. Obgleich Kritik unangenehm sein kann, ist sie für Entwicklung notwendig, sofern sie respektvoll formuliert wird. Entscheidend ist eine Kommunikationskultur, in der Verantwortung geteilt und Probleme früh angesprochen werden.",
    checks: [["C1-Synonym für obwohl", "obgleich / wenngleich"], ["Teamarbeit ist zwar effizient, ___ braucht klare Kommunikation.", "jedoch"], ["Selbst ___ ein Team gut ist, braucht es Rollen.", "wenn"]],
  },
  5: {
    title: "Modalpassiv und Nominalstil bei beruflicher Entwicklung",
    subtitle: "Karriere, Weiterbildung und Kompetenzen sachlich analysieren",
    why: "Berufliche Entwicklung wird auf C1 oft als Prozess betrachtet: Kompetenzen müssen aufgebaut, Chancen genutzt und Hindernisse abgebaut werden. Modalpassiv und Nominalstil machen diese Analyse sachlich und präzise.",
    goals: ["Modalpassiv mit müssen/sollen/können bilden", "berufliche Prozesse im Passiv beschreiben", "Nominalstil für Karriereargumente nutzen", "Weiterbildung differenziert bewerten"],
    rows: [["Modalpassiv", "Digitale Kompetenzen müssen kontinuierlich erweitert werden."], ["Vorgangspassiv", "Neue Arbeitsmodelle werden zunehmend diskutiert."], ["Nominalstil", "Die Förderung beruflicher Mobilität ist langfristig entscheidend."], ["Abwägung", "Weiterbildung eröffnet Chancen, setzt jedoch Zeit und Eigeninitiative voraus."]],
    model: "Berufliche Entwicklung kann nicht mehr als einmalige Ausbildungsphase verstanden werden. Kompetenzen müssen regelmäßig erweitert werden, da sich Arbeitsmärkte durch Digitalisierung und Migration verändern. Die Förderung von Weiterbildung ist daher sowohl individuell als auch gesellschaftlich relevant. Allerdings setzt beruflicher Aufstieg nicht nur Motivation voraus, sondern auch Zugang zu Beratung, Zeit und finanziellen Ressourcen.",
    checks: [["Man muss Kompetenzen erweitern. → Modalpassiv", "Kompetenzen müssen erweitert werden."], ["Nominalisierung: Weiterbildung fördern", "die Förderung von Weiterbildung"], ["Passiv: Arbeitsmodelle diskutieren", "Arbeitsmodelle werden diskutiert."]],
  },
  6: {
    title: "Kausale und konsekutive Verknüpfungen bei Gesundheit und Lebensstil",
    subtitle: "Ursachen, Folgen und Prävention differenziert erklären",
    why: "Gesundheit und Lebensstil verlangen eine klare Ursachen-Folgen-Logik: Warum entsteht Stress, welche Folgen hat er und welche Maßnahmen wirken? Auf C1 brauchst du präzise kausale und konsekutive Strukturen.",
    goals: ["Ursachen mit da, zumal und aufgrund ausdrücken", "Folgen mit sodass, folglich und infolgedessen formulieren", "Prävention sachlich beschreiben", "Gesundheitsverhalten differenziert bewerten"],
    rows: [["aufgrund + Genitiv", "Aufgrund hoher Arbeitsbelastung nehmen Stresssymptome zu."], ["sodass", "Viele Menschen schlafen zu wenig, sodass ihre Leistungsfähigkeit sinkt."], ["folglich / infolgedessen", "Bewegungsmangel nimmt zu; folglich steigt das Risiko chronischer Beschwerden."], ["Prävention", "Die Förderung gesunder Routinen kann langfristige Belastungen reduzieren."]],
    model: "Gesundheit hängt nicht nur von individueller Disziplin ab, sondern auch von Arbeitsbedingungen, sozialem Umfeld und Präventionsangeboten. Aufgrund hoher Belastung entwickeln viele Menschen Stresssymptome, sodass Erholung und Bewegung wichtiger werden. Folglich sollte Gesundheitsförderung nicht erst beginnen, wenn Beschwerden auftreten. Entscheidend ist ein Lebensstil, der realistisch, regelmäßig und sozial unterstützbar ist.",
    checks: [["wegen hoher Belastung → gehoben", "aufgrund hoher Belastung"], ["Folge: sodass", "Viele schlafen wenig, sodass sie erschöpft sind."], ["Synonym für deshalb auf C1", "folglich / infolgedessen"]],
  },
  7: {
    title: "Erweiterte Vergleichsformen bei Reisen und Nachhaltigkeit",
    subtitle: "Mobilität, Tourismus und Verantwortung differenziert vergleichen",
    why: "Bei Reisen und Nachhaltigkeit musst du mehrere Kriterien vergleichen: Kosten, Zeit, Komfort, Emissionen und soziale Folgen. C1 verlangt differenzierte Vergleiche und abwägende Formulierungen.",
    goals: ["Vergleiche mit im Vergleich zu, gegenüber und verglichen mit bilden", "je … desto/umso für Entwicklungen nutzen", "Einschränkungen mit zwar … jedoch formulieren", "Reiseformen differenziert bewerten"],
    rows: [["im Vergleich zu + Dativ", "Im Vergleich zum Flugzeug verursacht die Bahn meist weniger Emissionen."], ["gegenüber + Dativ", "Gegenüber Kurzstreckenflügen bietet der Zug ökologische Vorteile."], ["je … desto/umso", "Je günstiger nachhaltige Angebote sind, desto eher werden sie genutzt."], ["zwar … jedoch", "Reisen erweitert zwar den Horizont, jedoch verursacht Massentourismus ökologische Belastungen." ]],
    model: "Nachhaltiges Reisen erfordert eine Abwägung zwischen persönlicher Freiheit, wirtschaftlichen Interessen und ökologischer Verantwortung. Im Vergleich zum Flugzeug ist die Bahn auf vielen Strecken klimafreundlicher, jedoch nicht immer günstiger oder schneller. Je besser nachhaltige Alternativen ausgebaut werden, desto eher verändern Menschen ihr Reiseverhalten. Entscheidend ist daher nicht der Verzicht auf Reisen, sondern ein bewussterer Umgang mit Mobilität.",
    checks: [["Im Vergleich ___ Flugzeug", "zum"], ["Je besser das Angebot ist, ___ eher nutzen es Menschen.", "desto / umso"], ["Reisen ist bereichernd, ___ es belastet die Umwelt.", "jedoch / aber"]],
  },
};

export default function C1Day1To7GrammarNotes({ day, checked = false, onCheckedChange }) {
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
