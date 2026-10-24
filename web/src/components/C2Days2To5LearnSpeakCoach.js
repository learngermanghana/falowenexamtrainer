import React, { useEffect, useMemo, useState } from "react";
import { styles } from "../styles";

const panel = { border: "1px solid #c7d2fe", borderRadius: 14, padding: 14, background: "#eef2ff", display: "grid", gap: 10 };
const card = { ...styles.card, display: "grid", gap: 12, border: "1px solid #dbeafe", borderRadius: 16 };
const list = { margin: 0, paddingLeft: 22, lineHeight: 1.75 };
const optionStyle = ({ selected, correct, reveal }) => ({ width: "100%", textAlign: "left", padding: "12px 14px", borderRadius: 14, border: `1px solid ${selected ? (correct ? "#22c55e" : "#ef4444") : reveal ? "#86efac" : "#dbe3ef"}`, background: selected ? (correct ? "#dcfce7" : "#fee2e2") : reveal ? "#f0fdf4" : "#fff", color: "#0f172a", cursor: "pointer", font: "inherit", fontWeight: selected || reveal ? 800 : 650 });

const DATA = {
  2: {
    title: "Informationsstruktur bewusst steuern",
    intro: "Auf C2-Niveau entscheidet nicht nur die Grammatik, sondern auch die Informationsführung darüber, wie klar und überzeugend ein Satz wirkt. Entscheide zuerst, was bekannt ist, was neu ist und worauf du den Fokus legen willst.",
    patterns: [
      ["Neutraler Ausgangssatz", "Studierende brauchen für erfolgreiches Lernen gute Betreuung.", "Subjekt + Verb + Ergänzungen"],
      ["Fokus im Vorfeld", "Für erfolgreiches Lernen brauchen Studierende vor allem gute Betreuung.", "Fokus + Verb + Subjekt + Rest"],
      ["Voraussetzung ausdrücklich markieren", "Voraussetzung für erfolgreiches Lernen ist eine Betreuung, die Schwierigkeiten früh erkennt.", "Voraussetzung für + Nominalgruppe + sein + Kernaussage"],
    ],
    build: ["Kernaussage zuerst einfach formulieren.", "Bestimmen, welche Information bereits bekannt ist.", "Die wichtigste neue Information auswählen.", "Diese Information ins Vorfeld oder in eine Fokusstruktur setzen.", "Prüfen, ob der Satz noch natürlich und leicht erfassbar bleibt."],
    substitutions: ["Entscheidend für ... ist ...", "Im Mittelpunkt steht ...", "Besonders relevant ist ...", "Voraussetzung für ... ist ..."],
    questions: [
      { q: "Welche Version hebt die Voraussetzung am stärksten hervor?", o: ["Studierende lernen mit guter Betreuung erfolgreich.", "Mit guter Betreuung lernen Studierende erfolgreich.", "Voraussetzung für erfolgreiches Lernen ist eine Betreuung, die Schwierigkeiten früh erkennt."], a: 2, e: "Die dritte Version benennt die Voraussetzung ausdrücklich und macht sie zum Informationsfokus." },
      { q: "Was sollte vor der Umstellung des Vorfelds geklärt werden?", o: ["Welche Information im Satz am längsten ist.", "Welche Information bekannt, neu oder besonders wichtig ist.", "Ob möglichst viele Wörter vor dem Verb stehen."], a: 1, e: "Informationsstruktur beginnt mit Bedeutung und Gewichtung, nicht mit bloßer Umstellung." },
      { q: "Welche Formulierung klingt kontrolliert statt künstlich hervorgehoben?", o: ["Ganz besonders und ausschließlich entscheidend ist nur die Betreuung.", "Entscheidend für den Lernerfolg ist eine verlässliche Betreuung.", "Die Betreuung, die ist für den Lernerfolg entscheidend."], a: 1, e: "Die Struktur ist klar, idiomatisch und setzt einen präzisen Fokus." },
    ],
    speakQuestion: "Soll Bildung vor allem Faktenwissen vermitteln oder selbstständiges Lernen fördern?",
    branches: [
      ["Faktenwissen als Grundlage", ["Orientierung", "Grundwissen", "fachliche Basis", "gemeinsamer Wissensstand"], "Welche Rolle spielt solides Faktenwissen?", "Faktenwissen bildet eine unverzichtbare Grundlage, weil ...", "Als notwendige Grundlage lässt sich zunächst festhalten, dass ..."],
      ["Selbstständiges Lernen", ["Problemlösung", "Eigenverantwortung", "Transfer", "lebenslanges Lernen"], "Warum reicht reines Faktenwissen nicht aus?", "Selbstständiges Lernen gewinnt an Bedeutung, sobald Lernende Wissen auf neue Situationen übertragen müssen.", "Darüber hinaus kommt der Fähigkeit, selbstständig zu lernen, eine zentrale Bedeutung zu, weil ..."],
      ["Rolle der Lehrkraft", ["Orientierung", "Feedback", "Lernstrategien", "Begleitung"], "Wie verändert sich die Rolle der Lehrkraft?", "Lehrkräfte vermitteln nicht nur Inhalte, sondern helfen auch dabei, Lernprozesse zu strukturieren.", "Die Aufgabe der Lehrkraft beschränkt sich folglich nicht auf ..., sondern umfasst ebenso ..."],
      ["Ungleichheit und Zugang", ["digitale Ressourcen", "Betreuung", "soziale Unterschiede", "Chancengleichheit"], "Welche Lernenden profitieren nicht automatisch von Selbstständigkeit?", "Selbstständiges Lernen setzt Ressourcen und Unterstützung voraus, die nicht allen gleichermaßen zur Verfügung stehen.", "Zu berücksichtigen ist allerdings, dass ..."],
      ["Ausgewogene Position", ["Kombination", "Grundlagen + Transfer", "altersgerecht", "Kontext"], "Wie könnte ein ausgewogener Ansatz aussehen?", "Sinnvoll erscheint eine Verbindung aus verbindlichem Grundwissen und zunehmender Selbstständigkeit.", "Ein tragfähiger Ansatz bestünde meines Erachtens darin, ..."],
    ],
  },
  3: {
    title: "Nominalstil gezielt aufbauen",
    intro: "C2 bedeutet nicht, möglichst viele Nomen zu verwenden. Entscheidend ist, ob eine Nominalisierung Information sinnvoll verdichtet oder nur verschleiert, wer was tut.",
    patterns: [
      ["Verbalstil", "Die Forschenden überprüften die Ergebnisse.", "Akteur + Verb + Objekt"],
      ["Nominalisierung des Vorgangs", "Die Überprüfung der Ergebnisse erfolgte erneut.", "Artikel + nominalisiertes Verb + Genitiv/Ergänzung"],
      ["Verdichtete Folgerung", "Die Überprüfung der Ergebnisse ermöglichte die Widerlegung der ursprünglichen Annahme.", "Nominalisierung + Funktionsverb + weitere Nominalisierung"],
    ],
    build: ["Zuerst klären: Ist der Handelnde wichtig?", "Den Vorgang als Verb formulieren.", "Nur den zentralen Vorgang nominalisieren.", "Akteure sichtbar lassen, wenn Verantwortung relevant ist.", "Nominalketten wieder auflösen, sobald die Lesbarkeit leidet."],
    substitutions: ["die Untersuchung von ...", "die Auswertung von ...", "die Überprüfung von ...", "die Widerlegung einer Annahme"],
    questions: [
      { q: "Wann ist Verbalstil meist besser?", o: ["Wenn der Handelnde oder der Ablauf wichtig ist.", "Wenn der Satz wissenschaftlich klingen soll.", "Wenn möglichst viele Genitive vorkommen sollen."], a: 0, e: "Verbalstil hält Akteur und Handlung sichtbar und ist oft leichter zu verarbeiten." },
      { q: "Welche Formulierung vermeidet eine unnötige Nominalkette?", o: ["Die Durchführung der Auswertung der Untersuchung erfolgte gestern.", "Die Daten der Untersuchung wurden gestern ausgewertet.", "Die Datenauswertungsuntersuchungsdurchführung erfolgte gestern."], a: 1, e: "Die Verbalstruktur ist klarer und präziser." },
      { q: "Was ist eine sinnvolle C2-Strategie?", o: ["Jedes Verb nominalisieren.", "Gezielt verdichten und anschließend auf Lesbarkeit prüfen.", "Nominalstil grundsätzlich vermeiden."], a: 1, e: "C2 zeigt Kontrolle über beide Stile und die Fähigkeit, passend zu wählen." },
    ],
    speakQuestion: "Warum klingt wissenschaftliche Sprache oft nominaler, und wann wird dieser Stil unnötig schwer?",
    branches: [
      ["Vorteil der Verdichtung", ["Kompaktheit", "Begriffsbildung", "Sachlichkeit", "Wiederaufnahme"], "Wann hilft Nominalstil?", "Nominalisierungen können bekannte Prozesse kompakt als Begriffe weiterführen.", "Nominalstil erweist sich insbesondere dann als sinnvoll, wenn ..."],
      ["Akteure sichtbar halten", ["Verantwortung", "Urheberschaft", "Transparenz", "Handlung"], "Wann sollte man lieber verbal formulieren?", "Wenn Verantwortung wichtig ist, sollte deutlich bleiben, wer handelt.", "Sobald die Frage der Verantwortlichkeit eine Rolle spielt, empfiehlt es sich, ..."],
      ["Überladene Nominalketten", ["Lesbarkeit", "Genitivketten", "Abstraktion", "Verständlichkeit"], "Wodurch wird Nominalstil problematisch?", "Zu viele Nominalisierungen erschweren die Verarbeitung und können Beziehungen im Satz verschleiern.", "Problematisch wird diese Verdichtung dort, wo ..."],
      ["Wissenschaft und Öffentlichkeit", ["Wissensvermittlung", "Verständlichkeit", "Fachsprache", "Adressaten"], "Soll Wissenschaft einfacher schreiben?", "Fachliche Präzision und Verständlichkeit schließen einander nicht aus.", "Gerade in der öffentlichen Wissenschaftskommunikation sollte ..."],
      ["Eigene Regel", ["Funktion", "Lesbarkeit", "Adressat", "Variation"], "Nach welcher Regel würdest du entscheiden?", "Ich würde Nominalstil nur dort einsetzen, wo er einen klaren funktionalen Vorteil hat.", "Als Faustregel ließe sich formulieren, dass ..."],
    ],
  },
  4: {
    title: "Fremdaussagen und Evidenzstatus trennen",
    intro: "Bevor du Konjunktiv I verwendest, musst du wissen, wessen Aussage du wiedergibst und welchen Status sie hat: bestätigt, berichtet, bestritten oder unklar.",
    patterns: [
      ["Gesicherte Information", "Die Behörde veröffentlichte die Zahlen am Montag.", "Quelle + Indikativ bei bestätigter Information"],
      ["Fremdaussage", "Die Sprecherin erklärt, die Maßnahmen seien erfolgreich.", "Berichtsverb + Konjunktiv I"],
      ["Distanzierte Einordnung", "Nach Angaben des Unternehmens seien die Maßnahmen erfolgreich; unabhängig bestätigt ist dies bislang nicht.", "Quellenmarkierung + Konjunktiv I + Evidenzhinweis"],
    ],
    build: ["Quelle bestimmen.", "Aussage als fremd oder eigen markieren.", "Evidenzstatus festlegen.", "Konjunktiv I oder Berichtsverb wählen.", "Eigene Bewertung erst danach und klar getrennt formulieren."],
    substitutions: ["laut Angaben von ...", "nach Darstellung von ...", "X erklärt, ... sei ...", "unabhängig bestätigt ist ... bislang nicht"],
    questions: [
      { q: "Welche Formulierung stellt eine Behauptung nicht als gesicherte Tatsache dar?", o: ["Die Firma hat Nutzerdaten verkauft.", "Die Zeitung berichtet, die Firma habe Nutzerdaten weitergegeben.", "Die Firma verkaufte definitiv Nutzerdaten."], a: 1, e: "Berichtsverb und Konjunktiv I markieren Quelle und Distanz." },
      { q: "Was muss vor dem Konjunktiv I geklärt sein?", o: ["Wie lang der Satz werden soll.", "Wer die Aussage macht und welchen Evidenzstatus sie hat.", "Ob das Verb besonders selten ist."], a: 1, e: "Die grammatische Form folgt der Quellenbeziehung und dem Evidenzstatus." },
      { q: "Welche Reihenfolge ist am saubersten?", o: ["Eigene Meinung → fremde Behauptung ohne Quelle.", "Quelle → Fremdaussage → Evidenzstatus → eigene Bewertung.", "Konjunktiv I → Quelle später ergänzen."], a: 1, e: "Diese Reihenfolge trennt Bericht und Bewertung transparent." },
    ],
    speakQuestion: "Wie sollten Medien mit umstrittenen Aussagen umgehen, ohne sie als gesicherte Tatsachen darzustellen?",
    branches: [
      ["Quelle sichtbar machen", ["Urheber", "Berichtsverb", "Kontext", "Transparenz"], "Warum muss die Quelle genannt werden?", "Lesende müssen erkennen können, ob eine Aussage von der Redaktion oder von einer zitierten Person stammt.", "Eine zentrale Voraussetzung glaubwürdiger Berichterstattung besteht darin, dass ..."],
      ["Evidenzstatus", ["bestätigt", "unbestätigt", "umstritten", "widerlegt"], "Wie kann man Unsicherheit sprachlich markieren?", "Nicht bestätigte Informationen sollten ausdrücklich als vorläufig oder strittig gekennzeichnet werden.", "Sofern eine Aussage nicht unabhängig bestätigt ist, sollte ..."],
      ["Konjunktiv I", ["indirekte Rede", "Distanz", "Fremdaussage", "Neutralität"], "Welche Funktion hat der Konjunktiv I?", "Er zeigt, dass die Redaktion eine Aussage wiedergibt, ohne sie automatisch zu übernehmen.", "Der Konjunktiv I dient hier weniger der Höflichkeit als vielmehr dazu, ..."],
      ["Eigene Einordnung", ["Faktencheck", "Kontext", "Widersprüche", "Bewertung"], "Dürfen Medien Behauptungen bewerten?", "Ja, sofern Fakten und redaktionelle Einordnung klar voneinander getrennt bleiben.", "Eine journalistische Einordnung ist durchaus legitim, vorausgesetzt, ..."],
      ["Risiko falscher Ausgewogenheit", ["Desinformation", "Gewichtung", "Belege", "Verantwortung"], "Muss jede Behauptung gleich viel Raum bekommen?", "Nicht jede unbelegte Behauptung verdient dasselbe Gewicht wie gut belegte Informationen.", "Ausgewogenheit darf nicht damit verwechselt werden, dass ..."],
    ],
  },
  5: {
    title: "Subjektive Modalität nach Evidenz wählen",
    intro: "Sollen, wollen, dürfte, muss und kann drücken nicht einfach nur Möglichkeit aus. Sie markieren Quelle, Selbstaussage oder den Grad einer Schlussfolgerung. Entscheide deshalb zuerst, wie sicher die Information ist.",
    patterns: [
      ["Fremdbericht", "Der Politiker soll von dem Treffen gewusst haben.", "sollen + Infinitiv Perfekt = berichtete Information"],
      ["Selbstaussage", "Der Politiker will davon nichts gewusst haben.", "wollen + Infinitiv Perfekt = eigene Behauptung des Subjekts"],
      ["Schlussfolgerung", "Diese Darstellung dürfte schwer haltbar sein.", "dürfte + Infinitiv = vorsichtige Wahrscheinlichkeit"],
    ],
    build: ["Quelle der Information bestimmen.", "Zwischen Fremdbericht, Selbstaussage und eigener Schlussfolgerung unterscheiden.", "Grad der Sicherheit festlegen.", "Passendes Modalverb wählen.", "Bei vergangenen Behauptungen Infinitiv Perfekt bilden."],
    substitutions: ["soll ... getan haben", "will ... getan haben", "dürfte ... sein", "muss ... gewesen sein", "kann ... gewesen sein"],
    questions: [
      { q: "Was bedeutet: Der Abgeordnete will davon nichts gewusst haben?", o: ["Er wollte es nicht wissen.", "Er behauptet, nichts davon gewusst zu haben.", "Es ist bewiesen, dass er nichts wusste."], a: 1, e: "wollen + Infinitiv Perfekt kann eine Selbstaussage markieren." },
      { q: "Welche Form passt zu einem Fremdbericht über die Vergangenheit?", o: ["Er soll davon gewusst haben.", "Er will davon wissen.", "Er dürfte davon wissen müssen."], a: 0, e: "sollen + Infinitiv Perfekt markiert berichtete Information über Vergangenes." },
      { q: "Welche Formulierung ist eine vorsichtige Schlussfolgerung?", o: ["Das ist sicher falsch.", "Diese Darstellung dürfte nur schwer haltbar sein.", "Man sagt irgendetwas dazu."], a: 1, e: "dürfte markiert eine begründete, aber nicht absolute Wahrscheinlichkeit." },
    ],
    speakQuestion: "Wie kann man über politische Behauptungen sprechen, ohne unbelegte Aussagen als Fakten zu präsentieren?",
    branches: [
      ["Fremdberichte kennzeichnen", ["sollen", "Medienberichte", "Quellen", "Distanz"], "Wie gibst du einen Bericht wieder?", "Bei nicht selbst überprüften Informationen sollte die Quelle sprachlich erkennbar bleiben.", "Nach übereinstimmenden Medienberichten soll ..."],
      ["Selbstaussagen", ["wollen", "zurückweisen", "behaupten", "Darstellung"], "Wie gibst du die Position einer Person wieder?", "Mit wollen kann deutlich werden, dass die Aussage vom Betroffenen selbst stammt.", "Der Betroffene will von ... nichts gewusst haben; damit handelt es sich zunächst um ..."],
      ["Wahrscheinlichkeit", ["dürfte", "muss", "kann", "Indizien"], "Wie stark ist deine Schlussfolgerung?", "Je nach Beleglage kann die Schlussfolgerung vorsichtig oder sehr wahrscheinlich formuliert werden.", "Aufgrund der vorliegenden Indizien dürfte ..."],
      ["Grenze zwischen Analyse und Spekulation", ["Belege", "Vorsicht", "Transparenz", "Unsicherheit"], "Wann wird eine Analyse unseriös?", "Problematisch wird sie, wenn Vermutungen sprachlich wie gesicherte Tatsachen erscheinen.", "Die Grenze zur Spekulation ist dort überschritten, wo ..."],
      ["Verantwortungsvolle Schlussposition", ["Quellenprüfung", "Evidenz", "Kennzeichnung", "Zurückhaltung"], "Welche Regel sollte gelten?", "Je schwächer die Belege, desto vorsichtiger sollte die Formulierung ausfallen.", "Als Grundsatz sollte gelten: Je geringer die Evidenz, desto ..."],
    ],
  },
};

const KnowledgeCheck = ({ day, items, completed, onCompleteChange }) => {
  const storageKey = `falowen:c2:learn-choice:${day}`;
  const [answers, setAnswers] = useState(() => { try { return JSON.parse(window.localStorage.getItem(storageKey) || "{}"); } catch { return {}; } });
  const [index, setIndex] = useState(0);
  useEffect(() => { if (typeof window !== "undefined") window.localStorage.setItem(storageKey, JSON.stringify(answers)); }, [answers, storageKey]);
  const correct = items.filter((item, i) => answers[i] === item.o[item.a]).length;
  const allCorrect = correct === items.length;
  useEffect(() => { if (allCorrect && !completed) onCompleteChange?.(true); }, [allCorrect, completed, onCompleteChange]);
  const item = items[Math.min(index, items.length - 1)], selected = answers[index] || "";
  return <section style={card}><div><span style={{ ...styles.badge, background: "#eef2ff", color: "#3730a3" }}>Lernen durch Entscheiden</span><h2>Wissens-Check</h2><strong>{correct}/{items.length} richtig</strong></div><div style={{ display: "flex", gap: 8 }}>{items.map((x, i) => <button key={x.q} type="button" style={i === index ? styles.primaryButton : styles.secondaryButton} onClick={() => setIndex(i)}>{answers[i] === x.o[x.a] ? "✓ " : ""}{i + 1}</button>)}</div><div style={{ display: "grid", gap: 10 }}><h3 style={{ margin: 0 }}>{item.q}</h3>{item.o.map((o) => <button key={o} type="button" onClick={() => setAnswers((prev) => ({ ...prev, [index]: o }))} style={optionStyle({ selected: selected === o, correct: o === item.o[item.a], reveal: Boolean(selected) && o === item.o[item.a] && selected !== o })}>{o}</button>)}{selected ? <div><strong>{selected === item.o[item.a] ? "Richtig." : "Noch nicht richtig."}</strong> {item.e}</div> : null}</div><div style={{ display: "flex", justifyContent: "space-between", gap: 8 }}><button type="button" style={styles.secondaryButton} disabled={index === 0} onClick={() => setIndex((i) => Math.max(0, i - 1))}>Zurück</button>{index < items.length - 1 ? <button type="button" style={styles.primaryButton} disabled={selected !== item.o[item.a]} onClick={() => setIndex((i) => i + 1)}>Nächste Frage</button> : null}</div>{allCorrect ? <div style={{ border: "1px solid #86efac", borderRadius: 12, padding: 10, background: "#f0fdf4" }}><strong>Learn abgeschlossen.</strong> Du hast alle Entscheidungen richtig begründet.</div> : null}</section>;
};

export const C2Days2To5LearnCoach = ({ day, mastery, completed, onCompleteChange }) => {
  const d = DATA[Number(day)];
  if (!d) return null;
  return <div style={{ display: "grid", gap: 14 }}><section style={card}><span style={{ ...styles.badge, width: "fit-content", background: "#dbeafe", color: "#1e3a8a" }}>C2-Denklogik</span><h2 style={{ margin: 0 }}>{d.title}</h2><p style={{ margin: 0, lineHeight: 1.7 }}>{d.intro}</p><div><strong>So baust du die Form selbst auf</strong><ol style={list}>{d.build.map((x) => <li key={x}>{x}</li>)}</ol></div></section><section style={card}><h2 style={{ margin: 0 }}>Vom einfachen Satz zur kontrollierten C2-Form</h2>{d.patterns.map(([label, sentence, formula]) => <div key={label} style={{ border: "1px solid #e2e8f0", borderRadius: 12, padding: 12, display: "grid", gap: 5 }}><strong>{label}</strong><div style={{ fontSize: "1.03rem" }}>{sentence}</div><div style={{ color: "#475569" }}><strong>Bauplan:</strong> {formula}</div></div>)}<div><strong>Bausteine zum Variieren</strong><div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 8 }}>{d.substitutions.map((x) => <span key={x} style={{ border: "1px solid #cbd5e1", borderRadius: 999, padding: "6px 10px", background: "#f8fafc" }}>{x}</span>)}</div></div></section><section style={card}><h2 style={{ margin: 0 }}>Kollokationen im Kontext</h2>{mastery.collocations.map(([phrase, meaning, example]) => <div key={phrase} style={{ borderLeft: "4px solid #60a5fa", paddingLeft: 10 }}><strong>{phrase}</strong>{meaning ? <span style={{ color: "#64748b" }}> · {meaning}</span> : null}<div>{example}</div></div>)}</section><KnowledgeCheck day={day} items={d.questions} completed={completed} onCompleteChange={onCompleteChange} /></div>;
};

export const C2Days2To5SpeakCoach = ({ day }) => {
  const d = DATA[Number(day)];
  const [support, setSupport] = useState("full");
  if (!d) return null;
  return <div style={{ display: "grid", gap: 12 }}><div style={{ ...panel, background: "#fffbeb", borderColor: "#fde68a" }}><strong>Sprechfrage:</strong> {d.speakQuestion}</div><div style={{ ...panel, background: "#fff" }}><strong>Trainiere bis du ohne Hilfe sprechen kannst</strong><p style={{ margin: 0, color: "#475569" }}>1. Mit Hilfe: Ideen, Leitfragen, Beispiele und Satzanfänge. 2. Weniger Hilfe: nur Ideen und Leitfragen. 3. Prüfungsmodus: nur die Aufgabe.</p><div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>{[["full","1. Mit Hilfe"],["keywords","2. Weniger Hilfe"],["exam","3. Prüfungsmodus"]].map(([value,label]) => <button key={value} type="button" onClick={() => setSupport(value)} style={support === value ? styles.primaryButton : styles.secondaryButton}>{label}</button>)}</div></div>{support !== "exam" ? <div style={panel}><h3 style={{ margin: 0 }}>Fragen und echte Punkte für deine Antwort</h3><p style={{ margin: 0, color: "#475569" }}>Wähle 2–4 Bereiche und entwickle jeden Punkt als Aussage → Begründung → Beispiel → Einordnung.</p>{d.branches.map(([title, ideas, prompt, example, starter]) => <div key={title} style={{ border: "1px solid #c7d2fe", borderRadius: 12, padding: 12, background: "#fff", display: "grid", gap: 5 }}><strong>{title}</strong><div><strong>Ideen:</strong> {ideas.join(" · ")}</div><div><strong>Leitfrage:</strong> {prompt}</div>{support === "full" ? <><div><strong>So kannst du den Punkt entwickeln:</strong> {example}</div><div style={{ color: "#1e3a8a" }}><strong>C2-Satzanfang:</strong> {starter}</div></> : null}</div>)}</div> : <div style={{ ...panel, background: "#f0fdf4", borderColor: "#86efac" }}><strong>Prüfungsmodus:</strong> Entwickle deine Position ohne Ideenbank. Begründe, konkretisiere, relativiere und schließe mit einer differenzierten Bewertung.</div>}</div>;
};

export default DATA;
