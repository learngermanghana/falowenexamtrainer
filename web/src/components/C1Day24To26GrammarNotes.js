import React, { useMemo, useState } from "react";
import { styles } from "../styles";

const card = { ...styles.card, display: "grid", gap: 14, border: "1px solid #e2e8f0", borderRadius: 18, boxShadow: "0 10px 26px rgba(15,23,42,.06)" };
const listStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const tableStyle = { width: "100%", borderCollapse: "collapse", fontSize: ".95rem" };
const cellStyle = { border: "1px solid #e5e7eb", padding: "10px 12px", textAlign: "left", verticalAlign: "top", lineHeight: 1.6 };
const NoteBox = ({ children, tone = "blue" }) => { const tones = { blue: ["#bfdbfe", "#eff6ff", "#1e3a8a"], green: ["#bbf7d0", "#f0fdf4", "#14532d"], amber: ["#fde68a", "#fffbeb", "#92400e"] }; const [border, background, color] = tones[tone] || tones.blue; return <div style={{ border: `1px solid ${border}`, borderRadius: 14, padding: 14, background, color, lineHeight: 1.7 }}>{children}</div>; };
const Table = ({ rows }) => <div style={{ overflowX: "auto" }}><table style={tableStyle}><thead><tr><th style={cellStyle}>Struktur</th><th style={cellStyle}>C1-Beispiel</th></tr></thead><tbody>{rows.map(([a, b]) => <tr key={a + b}><td style={cellStyle}><strong>{a}</strong></td><td style={cellStyle}>{b}</td></tr>)}</tbody></table></div>;

const lessons = {
  24: {
    title: "Vergleiche, Passiv und Nominalstil bei Mobilität und Infrastruktur",
    subtitle: "Verkehr, Stadtplanung und öffentlichen Raum präzise analysieren",
    why: "Bei Mobilität reicht es auf C1 nicht, nur zu sagen, dass Busse besser oder Autos schlechter seien. Du solltest Kriterien vergleichen, Maßnahmen sachlich beschreiben und Folgen für Umwelt, Kosten, Platz und soziale Teilhabe erklären.",
    goals: ["Verkehrsformen mit klaren Vergleichskriterien gegenüberstellen", "Infrastrukturmaßnahmen mit Passiv beschreiben", "Verben in sachlichen Nominalstil umformen", "soziale und ökologische Folgen miteinander abwägen"],
    explanation: [["Präzise vergleichen", "Im Vergleich zu + Dativ nennt einen klaren Bezugspunkt: Im Vergleich zum Auto benötigt die Straßenbahn pro Person weniger Fläche."], ["Passiv für Maßnahmen", "Wenn die Handlung wichtiger ist als der Handelnde, passt Passiv: Neue Radwege werden gebaut. Parkflächen werden reduziert."], ["Nominalstil", "Aus 'Die Stadt baut den Nahverkehr aus' wird 'der Ausbau des Nahverkehrs'."], ["Abwägung", "Verbinde Wirkung und Bedingung: Der Ausbau des öffentlichen Verkehrs kann Emissionen senken; zugleich müssen Randgebiete zuverlässig angebunden werden."]],
    rows: [["im Vergleich zu + Dativ", "Im Vergleich zum Auto entlastet der öffentliche Verkehr den innerstädtischen Raum."], ["Passiv", "Radwege werden in vielen Städten ausgebaut."], ["Nominalstil", "Der Ausbau des öffentlichen Verkehrs kann soziale Teilhabe erleichtern."], ["Abwägung", "Neue Infrastruktur verbessert Mobilität, kann jedoch Nutzungskonflikte verstärken."]],
    model: "Mobilität ist ein zentraler Faktor städtischer Lebensqualität. Im Vergleich zum Auto kann der öffentliche Verkehr Platz sparen und Emissionen reduzieren. Gleichzeitig müssen Angebote zuverlässig und bezahlbar sein. Der Ausbau von Radwegen und Bahnverbindungen sollte daher als Teil einer sozialen und ökologischen Stadtplanung betrachtet werden.",
    quiz: [
      { q: "Welche Form ist korrekt?", options: ["Im Vergleich mit dem Auto", "Im Vergleich zum Auto", "Im Vergleich von Auto", "Im Vergleich das Auto"], answer: 1, why: "Die feste Struktur lautet im Vergleich zu + Dativ; zu dem wird zu zum." },
      { q: "Welche Passivform ist korrekt? Städte bauen neue Radwege.", options: ["Neue Radwege bauen Städte.", "Neue Radwege werden gebaut.", "Neue Radwege sind bauen.", "Neue Radwege wurden bauen."], answer: 1, why: "Vorgangspassiv: werden + Partizip II." },
      { q: "Welche Nominalisierung passt zu 'den Nahverkehr ausbauen'?", options: ["die Ausbauung Nahverkehr", "der Ausbau des Nahverkehrs", "das Ausbauen von der Nahverkehr", "die ausgebauten Nahverkehr"], answer: 1, why: "Der Ausbau des Nahverkehrs ist die idiomatische Nominalisierung." },
    ],
  },
  25: {
    title: "Wissenschaftlich argumentieren: Quellenbezug, Konjunktiv I und vorsichtige Bewertung",
    subtitle: "Forschungsergebnisse wiedergeben, Grenzen benennen und ethische Verantwortung sprachlich abwägen",
    why: "In C1-Aufgaben zu Wissenschaft und Forschung musst du drei Ebenen auseinanderhalten: Was behauptet eine Quelle? Wie sicher ist das Ergebnis? Wie bewertest du es selbst? Wer diese Ebenen sprachlich trennt, argumentiert präziser und vermeidet unbegründete absolute Aussagen.",
    goals: ["Aussagen von Forschenden mit Konjunktiv I wiedergeben", "Quellen mit laut, zufolge und nach Angaben von kennzeichnen", "Unsicherheit und vorläufige Ergebnisse angemessen ausdrücken", "Forschungsfreiheit und ethische Grenzen differenziert gegeneinander abwägen", "Nominalisierungen wie der Erwerb, die Durchführung, die Auswertung und die Einschränkung sicher einsetzen"],
    explanation: [
      ["1. Quellenbezug", "Kennzeichne fremde Informationen: Laut der Studie ..., Der Untersuchung zufolge ... oder Nach Angaben des Forschungsteams .... So wird deutlich, dass du nicht deine eigene Meinung als Tatsache präsentierst."],
      ["2. Konjunktiv I", "Direkt: 'Die Ergebnisse sind noch vorläufig.' Indirekt: Das Forschungsteam erklärt, die Ergebnisse seien noch vorläufig. Weitere nützliche Formen: er habe, sie könne, das Verfahren ermögliche."],
      ["3. Wissenschaftliche Vorsicht", "Vermeide 'Die Studie beweist, dass ...', wenn die Daten begrenzt sind. Nutze: Die Ergebnisse deuten darauf hin, dass ..., Es lässt sich vermuten, dass ..., Das Verfahren könnte ..., Die Daten reichen noch nicht aus, um ..."],
      ["4. Ergebnis + Grenze", "Eine starke C1-Aussage nennt nicht nur einen Vorteil: Die Studie kommt zu dem Ergebnis, das Verfahren könne Diagnosen beschleunigen. Allerdings sei die Stichprobe bislang zu klein, um allgemeingültige Schlussfolgerungen zu ziehen."],
      ["5. Ethische Abwägung", "Formuliere nicht nur 'Forschung ist gut/schlecht'. Nutze Bedingungen: Forschungsfreiheit ist für Innovation wesentlich, sofern Menschenwürde, Datenschutz und unabhängige Kontrolle gewährleistet sind."],
      ["6. Nominalstil", "Verben lassen sich verdichten: Daten auswerten → die Auswertung der Daten; Forschung einschränken → die Einschränkung der Forschung; Versuche durchführen → die Durchführung von Versuchen; Ergebnisse veröffentlichen → die Veröffentlichung der Ergebnisse."],
    ],
    rows: [
      ["laut + Dativ", "Laut der Studie könnte das Verfahren die Diagnose beschleunigen."],
      ["zufolge", "Der Untersuchung zufolge profitieren bestimmte Patientengruppen besonders."],
      ["Konjunktiv I", "Die Forschenden erklären, die Ergebnisse seien noch vorläufig."],
      ["vorsichtige Bewertung", "Die Daten deuten darauf hin, dass die Methode wirksam sein könnte."],
      ["Nominalisierung", "Die sorgfältige Auswertung der Daten ist Voraussetzung für belastbare Schlussfolgerungen."],
      ["Bedingung", "Forschungsfreiheit sollte geschützt werden, sofern ethische Mindeststandards eingehalten werden."],
      ["Gegenposition", "Zu strenge Einschränkungen könnten dazu führen, dass wichtige Innovationen verzögert werden."],
    ],
    model: "Forschungsfreiheit ist eine wesentliche Voraussetzung für wissenschaftlichen Fortschritt, darf jedoch nicht losgelöst von gesellschaftlicher Verantwortung betrachtet werden. Forschende erklären häufig, neue Verfahren könnten Krankheiten früher erkennen oder Ressourcen effizienter nutzen. Solche Ergebnisse sind jedoch sorgfältig einzuordnen, da kleine Stichproben oder fehlende Langzeitdaten ihre Aussagekraft begrenzen können. Ein ausgewogener Umgang mit Forschung setzt daher Transparenz, unabhängige Kontrolle und klar begründete ethische Grenzen voraus.",
    quiz: [
      { q: "Direkt: 'Die Ergebnisse sind noch vorläufig.' Welche indirekte Form ist korrekt?", options: ["Die Forschenden erklären, die Ergebnisse sind noch vorläufig.", "Die Forschenden erklären, die Ergebnisse seien noch vorläufig.", "Die Forschenden erklären, die Ergebnisse wären vorläufig sein.", "Die Forschenden erklären vorläufige Ergebnisse seien."], answer: 1, why: "Seien ist Konjunktiv I von sein im Plural und markiert die wiedergegebene Aussage." },
      { q: "Welche Formulierung zeigt wissenschaftliche Vorsicht?", options: ["Die Studie beweist endgültig alles.", "Die Ergebnisse deuten darauf hin, dass die Methode wirksam sein könnte.", "Das Ergebnis ist hundertprozentig richtig.", "Die Forschung hat immer recht."], answer: 1, why: "Deuten darauf hin und könnte begrenzen die Aussage angemessen." },
      { q: "Welche Formulierung kennzeichnet eine Quelle korrekt?", options: ["Laut der Studie könnte ...", "Trotzdem der Studie ...", "Während die Studie laut ...", "Deshalb zufolge Studie ..."], answer: 0, why: "Laut + Dativ ist eine klare und formelle Struktur für Quellenbezug." },
      { q: "Welche Nominalisierung ist korrekt? 'Die Forschenden werten die Daten aus.'", options: ["die Auswertung der Daten", "die Auswerten der Daten", "der Auswertung die Daten", "die ausgewert Daten"], answer: 0, why: "Auswerten wird zu die Auswertung; der Gegenstand kann im Genitiv folgen: der Daten." },
      { q: "Welche Aussage wägt Forschungsfreiheit und Verantwortung am besten ab?", options: ["Forschung sollte alles dürfen.", "Forschung sollte verboten werden.", "Forschungsfreiheit sollte geschützt werden, sofern Menschenwürde, Datenschutz und unabhängige Kontrolle gewährleistet sind.", "Ethik und Forschung haben nichts miteinander zu tun."], answer: 2, why: "Die Aussage nennt eine Position und zugleich konkrete Bedingungen." },
      { q: "Welche Formulierung beschreibt eine mögliche Folge zu strenger Regeln?", options: ["Zu strenge Einschränkungen könnten wichtige Innovationen verzögern.", "Regeln machen Forschung immer unmöglich.", "Forschung ist wegen Regeln schlecht.", "Einschränkungen forschen Innovation."], answer: 0, why: "Könnten + Infinitiv formuliert eine mögliche Folge vorsichtig und grammatisch korrekt." },
    ],
  },
  26: {
    title: "Adjektivdeklination, Partizipialattribute und Abwägung bei nachhaltigem Konsum",
    subtitle: "Kaufverhalten, Ressourcen und Verantwortung präzise bewerten",
    why: "Nachhaltiger Konsum braucht genaue Beschreibungen: langlebige Produkte, reduzierte Verpackung, fair produzierte Waren. Mit Adjektivdeklination und Partizipialattributen kannst du solche Aspekte präzise formulieren.",
    goals: ["Adjektivdeklination bei Konsumthemen sicher verwenden", "Partizipialattribute bilden", "Kaufentscheidungen differenziert bewerten", "Verantwortung zwischen Individuen, Staat und Unternehmen abwägen"],
    explanation: [["Adjektivdeklination", "Achte auf Artikel, Kasus und Numerus: nachhaltige Produkte, mit nachhaltigen Produkten, der bewusste Konsum."], ["Partizip I", "Steigende Preise oder zunehmende Nachfrage beschreiben laufende Entwicklungen."], ["Partizip II", "Fair produzierte Waren und recycelte Materialien beschreiben ein Ergebnis oder einen Zustand."], ["Abwägung", "Nachhaltiger Konsum ist wichtig, darf jedoch nicht ausschließlich von der Kaufkraft Einzelner abhängen."]],
    rows: [["Adjektivdeklination", "nachhaltige Produkte; der bewusste Konsum; eine faire Produktion"], ["Partizip I", "steigende Preise; zunehmende Nachfrage"], ["Partizip II", "recycelte Materialien; fair produzierte Waren"], ["Abwägung", "Nachhaltiger Konsum ist wichtig, darf jedoch nicht nur von der Kaufkraft Einzelner abhängen."]],
    model: "Nachhaltiger Konsum setzt voraus, dass Verbraucherinnen und Verbraucher Informationen über Herkunft, Produktion und Umweltfolgen erhalten. Fair produzierte Waren und recycelte Materialien können Ressourcen schonen, sind jedoch oft teurer als konventionelle Produkte. Deshalb darf Verantwortung nicht ausschließlich auf einzelne Käuferinnen und Käufer übertragen werden.",
    quiz: [
      { q: "Welche Form ist korrekt?", options: ["die nachhaltige Produkte", "die nachhaltigen Produkte", "die nachhaltiger Produkte", "die nachhaltig Produkten"], answer: 1, why: "Nach dem bestimmten Artikel die erhält das Adjektiv im Nominativ/Akkusativ Plural -en." },
      { q: "Welche Form ist ein Partizip-II-Attribut?", options: ["steigende Preise", "fair produzierte Waren", "bewusst kaufen", "mehr Nachhaltigkeit"], answer: 1, why: "Produzierte ist Partizip II und beschreibt die Waren attributiv." },
      { q: "Welche Aussage ist differenziert?", options: ["Alle müssen nur teuer nachhaltig kaufen.", "Nachhaltiger Konsum ist wichtig, darf jedoch nicht ausschließlich von der Kaufkraft Einzelner abhängen.", "Unternehmen tragen keine Verantwortung.", "Nachhaltigkeit ist immer einfach."], answer: 1, why: "Die Aussage verbindet Ziel und soziale Grenze." },
    ],
  },
};

function KnowledgeTest({ questions = [] }) {
  const [answers, setAnswers] = useState({});
  const score = useMemo(() => questions.reduce((sum, item, index) => sum + (answers[index] === item.answer ? 1 : 0), 0), [answers, questions]);
  return <section style={card}>
    <div><h2 style={{ margin: 0, fontSize: "1.2rem" }}>Knowledge Test</h2><p style={{ margin: "6px 0 0", lineHeight: 1.7, color: "#475569" }}>Wähle eine Antwort. Du bekommst sofort Feedback und kannst deine Antwort ändern.</p></div>
    {questions.map((item, index) => { const selected = answers[index]; return <div key={item.q} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 12, display: "grid", gap: 9 }}><strong>{index + 1}. {item.q}</strong><div style={{ display: "grid", gap: 7 }}>{item.options.map((option, optionIndex) => { const chosen = selected === optionIndex; const isCorrect = optionIndex === item.answer; return <button key={option} type="button" onClick={() => setAnswers((old) => ({ ...old, [index]: optionIndex }))} style={{ ...styles.secondaryButton, justifyContent: "flex-start", textAlign: "left", background: chosen ? (isCorrect ? "#f0fdf4" : "#fef2f2") : "#fff", borderColor: chosen ? (isCorrect ? "#22c55e" : "#ef4444") : "#cbd5e1" }}>{String.fromCharCode(65 + optionIndex)}) {option}</button>; })}</div>{selected !== undefined ? <NoteBox tone={selected === item.answer ? "green" : "amber"}><strong>{selected === item.answer ? "Richtig." : "Noch nicht."}</strong> {item.why}</NoteBox> : null}</div>; })}
    <strong>Score: {score}/{questions.length}</strong>
  </section>;
}

export default function C1Day24To26GrammarNotes({ day, checked = false, onCheckedChange }) {
  const lesson = lessons[Number(day)];
  if (!lesson) return null;
  return <>
    <section style={card}><div><span style={{ ...styles.badge, width: "fit-content" }}>C1 Grammar Lab</span><h2 style={{ margin: "8px 0 4px" }}>{lesson.title}</h2><p style={{ margin: 0, color: "#475569", lineHeight: 1.7 }}>{lesson.subtitle}</p></div><NoteBox tone="amber"><strong>Warum brauchst du das?</strong> {lesson.why}</NoteBox><div><h3>Lernziele</h3><ul style={listStyle}>{lesson.goals.map((goal) => <li key={goal}>{goal}</li>)}</ul></div></section>
    <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>Grammar notes</h2><div style={{ display: "grid", gap: 10 }}>{lesson.explanation.map(([title, text]) => <NoteBox key={title}><strong>{title}</strong><br />{text}</NoteBox>)}</div><Table rows={lesson.rows} /><div><h3>Modellabsatz</h3><p style={{ margin: 0, lineHeight: 1.8 }}>{lesson.model}</p></div></section>
    <KnowledgeTest questions={lesson.quiz} />
    <label style={{ ...card, display: "flex", gap: 10, alignItems: "center", fontWeight: 800 }}><input type="checkbox" checked={checked} onChange={(event) => onCheckedChange?.(event.target.checked)} />Ich habe die Grammatiknotizen gelesen und den Knowledge Test bearbeitet.</label>
  </>;
}