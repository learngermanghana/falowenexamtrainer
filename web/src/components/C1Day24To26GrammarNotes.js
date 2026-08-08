import React, { useMemo, useState } from "react";
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
    subtitle: "Verkehr, Stadtplanung und öffentlichen Raum präzise analysieren",
    why: "Bei Mobilität reicht es auf C1 nicht, nur zu sagen, dass Busse besser oder Autos schlechter seien. Du solltest Kriterien vergleichen, Maßnahmen sachlich beschreiben und Folgen für Umwelt, Kosten, Platz und soziale Teilhabe erklären.",
    goals: ["Verkehrsformen mit klaren Vergleichskriterien gegenüberstellen", "Infrastrukturmaßnahmen mit Passiv beschreiben", "Verben in sachlichen Nominalstil umformen", "soziale und ökologische Folgen miteinander abwägen"],
    explanation: [
      ["1. Präzise vergleichen", "Im Vergleich zu + Dativ nennt einen klaren Bezugspunkt: Im Vergleich zum Auto benötigt die Straßenbahn pro Person weniger Fläche."],
      ["2. Passiv für Maßnahmen", "Wenn die Handlung wichtiger ist als der Handelnde, passt Passiv: Neue Radwege werden gebaut. Parkflächen werden reduziert."],
      ["3. Nominalstil", "Aus 'Die Stadt baut den Nahverkehr aus' wird 'der Ausbau des Nahverkehrs'. Das wirkt in Stellungnahmen und Sachtexten kompakter und formeller."],
      ["4. C1-Tipp", "Kombiniere Struktur und Bewertung: Der Ausbau des öffentlichen Verkehrs kann Emissionen senken; zugleich muss gewährleistet werden, dass Randgebiete zuverlässig angebunden werden."],
    ],
    rows: [["im Vergleich zu + Dativ", "Im Vergleich zum Auto entlastet der öffentliche Verkehr den innerstädtischen Raum."], ["Passiv", "Radwege werden in vielen Städten ausgebaut."], ["Nominalstil", "Der Ausbau des öffentlichen Verkehrs kann soziale Teilhabe erleichtern."], ["Abwägung", "Neue Infrastruktur verbessert Mobilität, kann jedoch Nutzungskonflikte im öffentlichen Raum verstärken."]],
    model: "Mobilität ist ein zentraler Faktor städtischer Lebensqualität. Im Vergleich zum Auto kann der öffentliche Verkehr Platz sparen und Emissionen reduzieren. Gleichzeitig müssen Angebote zuverlässig und bezahlbar sein, damit sie für unterschiedliche Bevölkerungsgruppen attraktiv werden. Der Ausbau von Radwegen und Bahnverbindungen sollte daher nicht isoliert betrachtet werden, sondern als Teil einer sozialen und ökologischen Stadtplanung.",
    quiz: [
      { q: "Welche Form ist korrekt?", options: ["Im Vergleich mit dem Auto", "Im Vergleich zum Auto", "Im Vergleich von Auto", "Im Vergleich das Auto"], answer: 1, why: "Die feste Struktur lautet im Vergleich zu + Dativ; zu dem wird zu zum." },
      { q: "Welche Passivform ist korrekt? Städte bauen neue Radwege.", options: ["Neue Radwege bauen Städte.", "Neue Radwege werden gebaut.", "Neue Radwege sind bauen.", "Neue Radwege wurden bauen."], answer: 1, why: "Vorgangspassiv: werden + Partizip II." },
      { q: "Welche Nominalisierung passt zu 'den Nahverkehr ausbauen'?", options: ["die Ausbauung Nahverkehr", "der Ausbau des Nahverkehrs", "das Ausbauen von der Nahverkehr", "die ausgebauten Nahverkehr"], answer: 1, why: "Der Ausbau des Nahverkehrs ist die idiomatische Nominalisierung." },
      { q: "Welche Aussage ist am stärksten auf C1?", options: ["Busse sind gut.", "Autos sind schlecht.", "Der Ausbau des ÖPNV kann Emissionen senken, setzt jedoch zuverlässige Verbindungen voraus.", "Alle sollten Fahrrad fahren."], answer: 2, why: "Die Aussage nennt Wirkung und Bedingung und vermeidet absolute Urteile." },
      { q: "Welche Formulierung beschreibt eine Maßnahme sachlich?", options: ["Wir machen mehr Züge.", "Mehr Bahnverbindungen werden eingerichtet.", "Mehr Züge machen besser.", "Man tut Bahn."], answer: 1, why: "Das Passiv stellt die Maßnahme in den Mittelpunkt." },
    ],
  },
  25: {
    title: "Indirekte Rede und Bewertung bei Wissenschaft und Forschung",
    subtitle: "Forschungsergebnisse, Sicherheit und Grenzen glaubwürdig einordnen",
    why: "Bei Forschung musst du unterscheiden zwischen dem, was eine Studie behauptet, dem, was tatsächlich gesichert ist, und deiner eigenen Bewertung. Genau dafür brauchst du Quellenbezug, indirekte Rede und vorsichtige Bewertungsformen.",
    goals: ["Forschungsergebnisse mit Konjunktiv I wiedergeben", "Quellen mit laut, zufolge und nach Angaben von sichtbar machen", "vorläufige Ergebnisse sprachlich relativieren", "Nutzen, Grenzen und ethische Fragen getrennt bewerten"],
    explanation: [
      ["1. Quelle und Aussage trennen", "Laut der Studie ... oder Die Forschenden erklären, ... zeigt klar, woher eine Information stammt."],
      ["2. Konjunktiv I", "Direkt: 'Die Daten sind noch vorläufig.' Indirekt: Die Forschenden erklären, die Daten seien noch vorläufig."],
      ["3. Vorsichtige Bewertung", "Bei Forschung sind absolute Aussagen oft ungeeignet. Nutze könnte, dürfte, deutet darauf hin, lässt vermuten oder die Ergebnisse sind noch nicht eindeutig."],
      ["4. C1-Tipp", "Gib zuerst das Ergebnis wieder, nenne dann eine Grenze: Die Studie kommt zu dem Ergebnis, das Verfahren könne die Diagnose beschleunigen. Allerdings sei die Stichprobe bislang relativ klein."],
    ],
    rows: [["Konjunktiv I", "Forschende erklärten, die Daten seien noch vorläufig."], ["laut / zufolge", "Laut der Untersuchung profitieren besonders Patientinnen und Patienten mit frühem Zugang."], ["vorsichtige Aussage", "Die Ergebnisse deuten darauf hin, dass das Verfahren wirksam sein könnte."], ["Abwägung", "Forschung ermöglicht Fortschritt, setzt jedoch Transparenz und ethische Kontrolle voraus."]],
    model: "Wissenschaftliche Forschung eröffnet große gesellschaftliche Chancen, sollte jedoch nicht unkritisch als automatische Lösung betrachtet werden. Forschende erklären häufig, neue Technologien könnten Krankheiten früher erkennen oder Ressourcen effizienter nutzen. Gleichzeitig bleiben viele Ergebnisse vorläufig, sodass Transparenz über Methoden und Grenzen notwendig ist. Forschung ist daher besonders wertvoll, wenn sie nachvollziehbar, ethisch kontrolliert und gesellschaftlich zugänglich ist.",
    quiz: [
      { q: "Direkt: 'Die Daten sind vorläufig.' Welche indirekte Form passt?", options: ["Die Forschenden sagen, die Daten sind vorläufig.", "Die Forschenden sagen, die Daten seien vorläufig.", "Die Forschenden sagen, die Daten wären vorläufig gewesen.", "Die Forschenden sagen vorläufig Daten."], answer: 1, why: "Seien ist Konjunktiv I von sein im Plural." },
      { q: "Welche Formulierung ist für unsichere Forschungsergebnisse am besten?", options: ["Das Ergebnis beweist alles.", "Das Ergebnis ist sicher wahr.", "Die Ergebnisse deuten darauf hin, dass ...", "Es ist hundertprozentig so."], answer: 2, why: "Deuten darauf hin markiert wissenschaftliche Vorsicht." },
      { q: "Welcher Ausdruck zeigt einen Quellenbezug?", options: ["laut der Studie", "trotzdem", "während", "deshalb"], answer: 0, why: "Laut der Studie nennt ausdrücklich die Informationsquelle." },
      { q: "Welche Aussage trennt Ergebnis und Grenze korrekt?", options: ["Die Studie ist gut, also stimmt alles.", "Die Studie berichtet einen Nutzen; allerdings ist die Stichprobe klein.", "Kleine Stichproben sind immer falsch.", "Forschung braucht keine Grenzen."], answer: 1, why: "So wird ein Ergebnis anerkannt und zugleich methodisch eingeordnet." },
      { q: "Welche Formulierung eignet sich für eine C1-Bewertung?", options: ["Forschung ist immer gut.", "Forschung ist immer schlecht.", "Forschung kann Fortschritt ermöglichen, sofern Transparenz und ethische Kontrolle gewährleistet sind.", "Forschung ist Forschung."], answer: 2, why: "Die Aussage ist differenziert und nennt eine Bedingung." },
    ],
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

function KnowledgeTest({ questions = [] }) {
  const [answers, setAnswers] = useState({});
  const score = useMemo(() => questions.reduce((sum, item, index) => sum + (answers[index] === item.answer ? 1 : 0), 0), [answers, questions]);
  return <section style={card}>
    <div><h2 style={{ margin: 0, fontSize: "1.2rem" }}>Knowledge Test</h2><p style={{ margin: "6px 0 0", lineHeight: 1.7, color: "#475569" }}>Wähle eine Antwort. Du bekommst sofort Feedback.</p></div>
    {questions.map((item, index) => {
      const selected = answers[index];
      return <div key={item.q} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 12, display: "grid", gap: 9 }}>
        <strong>{index + 1}. {item.q}</strong>
        <div style={{ display: "grid", gap: 7 }}>{item.options.map((option, optionIndex) => {
          const chosen = selected === optionIndex;
          const isCorrect = optionIndex === item.answer;
          return <button key={option} type="button" onClick={() => setAnswers((old) => ({ ...old, [index]: optionIndex }))} style={{ ...styles.secondaryButton, justifyContent: "flex-start", textAlign: "left", background: chosen ? (isCorrect ? "#f0fdf4" : "#fef2f2") : "#fff", borderColor: chosen ? (isCorrect ? "#22c55e" : "#ef4444") : "#cbd5e1" }}>{String.fromCharCode(65 + optionIndex)}) {option}</button>;
        })}</div>
        {selected !== undefined ? <NoteBox tone={selected === item.answer ? "green" : "amber"}><strong>{selected === item.answer ? "Richtig." : "Noch nicht."}</strong> {item.why}</NoteBox> : null}
      </div>;
    })}
    <strong>Score: {score}/{questions.length}</strong>
  </section>;
}

export default function C1Day24To26GrammarNotes({ day, checked = false, onCheckedChange }) {
  const lesson = lessons[Number(day)];
  if (!lesson) return null;
  const upgraded = Boolean(lesson.quiz);
  return <div style={{ display: "grid", gap: 16 }}>
    <section style={card}><span style={{ ...styles.badge, width: "fit-content" }}>C1 · Day {day} · Grammar Notes</span><h2 style={{ ...styles.title, margin: 0, fontSize: "clamp(1.7rem,4vw,2.5rem)" }}>{lesson.title}</h2><p style={{ ...styles.subtitle, margin: 0, lineHeight: 1.7 }}>{lesson.subtitle}</p></section>
    <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>{upgraded ? "Was lernst du hier?" : "Warum brauchst du diese Grammatik auf C1?"}</h2><p style={{ margin: 0, lineHeight: 1.75 }}>{lesson.why}</p><NoteBox><strong>Nach dieser Lektion kannst du:</strong><ul style={{ ...listStyle, marginTop: 8 }}>{lesson.goals.map((goal) => <li key={goal}>{goal}</li>)}</ul></NoteBox></section>
    {upgraded ? <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>Grammatik Schritt für Schritt</h2>{lesson.explanation.map(([title, text]) => <div key={title} style={{ display: "grid", gap: 5 }}><strong>{title}</strong><p style={{ margin: 0, lineHeight: 1.75 }}>{text}</p></div>)}</section> : null}
    <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>Kernstrukturen{upgraded ? " auf einen Blick" : ""}</h2><Table rows={lesson.rows} /></section>
    {upgraded ? <KnowledgeTest questions={lesson.quiz} /> : null}
    <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>C1-Modellabsatz</h2><NoteBox tone="green">{lesson.model}</NoteBox></section>
    {!upgraded ? <section style={card}><h2 style={{ margin: 0, fontSize: "1.2rem" }}>Selbstkontrolle</h2><p style={{ margin: 0, lineHeight: 1.7 }}>Löse die Aufgabe zuerst selbst und öffne danach die Antwort.</p>{lesson.checks.map(([question, answer], index) => <CheckAnswer key={question} question={`${index + 1}. ${question}`} answer={answer} />)}</section> : null}
    <section style={card}><label style={{ display: "flex", alignItems: "flex-start", gap: 10, fontWeight: 800, lineHeight: 1.6 }}><input type="checkbox" checked={Boolean(checked)} onChange={(event) => onCheckedChange?.(event.target.checked)} style={{ marginTop: 4 }} /><span>{upgraded ? "Ich habe die Grammatik gelesen und den Knowledge Test bearbeitet." : "Ich habe die vollständigen Grammatiknotizen gelesen und die Beispiele verstanden."}</span></label></section>
  </div>;
}
