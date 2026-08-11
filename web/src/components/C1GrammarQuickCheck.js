import React, { useMemo, useState } from "react";
import { styles } from "../styles";

const itemsByDay = {
  17: [
    ["Welche Nominalisierung ist korrekt?", ["die Reduzierung von Emissionen", "die reduzieren von Emissionen", "das reduzierte Emissionen"], "die Reduzierung von Emissionen"],
    ["Welcher Konnektor drückt eine Folge aus?", ["folglich", "obgleich", "während"], "folglich"],
    ["Welche Formulierung ist ausgewogen?", ["Individuelles Verhalten reicht nicht aus; dennoch bleibt es wichtig.", "Nur Einzelne sind verantwortlich.", "Nur der Staat ist verantwortlich."], "Individuelles Verhalten reicht nicht aus; dennoch bleibt es wichtig."],
    ["Welche Struktur passt zu geteilter Verantwortung?", ["sowohl ... als auch", "weder ... weil", "nachdem ... deshalb"], "sowohl ... als auch"],
  ],
  18: [
    ["Welcher Ausdruck ist konzessiv?", ["obgleich", "folglich", "darüber hinaus"], "obgleich"],
    ["Welche Formulierung stellt einen Gegensatz korrekt dar?", ["Während einige profitieren, fühlen sich andere ausgeschlossen.", "Während einige profitieren, andere fühlen ausgeschlossen.", "Während einige profitieren deshalb andere."], "Während einige profitieren, fühlen sich andere ausgeschlossen."],
    ["Welcher Ausdruck markiert einen direkten Gegensatz?", ["dagegen", "infolge", "damit"], "dagegen"],
    ["Welche Aussage ist differenziert?", ["Vielfalt kann bereichern, sofern faire Teilhabe gewährleistet ist.", "Vielfalt löst immer alle Probleme.", "Vielfalt verursacht immer Konflikte."], "Vielfalt kann bereichern, sofern faire Teilhabe gewährleistet ist."],
  ],
  19: [
    ["Welche Formulierung ist eine vorsichtige Prognose?", ["Einige Tätigkeiten dürften automatisiert werden.", "Alle Berufe verschwinden sicher.", "Alle Menschen werden ersetzt."], "Einige Tätigkeiten dürften automatisiert werden."],
    ["Welche Form ist korrektes Modalpassiv?", ["Digitale Kompetenzen müssen gefördert werden.", "Digitale Kompetenzen müssen fördern.", "Digitale Kompetenzen werden müssen fördern."], "Digitale Kompetenzen müssen gefördert werden."],
    ["Welcher Ausdruck schränkt eine Aussage ein?", ["allerdings", "folglich", "deshalb"], "allerdings"],
    ["Welche Struktur beschreibt zwei parallele Entwicklungen?", ["je ... desto", "obwohl ... deshalb", "nachdem ... trotzdem"], "je ... desto"],
  ],
  20: [
    ["Welche Passivform ist korrekt?", ["Gesundheitsdaten werden digital gespeichert.", "Gesundheitsdaten werden digital speichern.", "Gesundheitsdaten digital werden gespeichert."], "Gesundheitsdaten werden digital gespeichert."],
    ["Welche Nominalisierung ist korrekt?", ["die digitale Speicherung von Daten", "das digital speichern von Daten", "die gespeichert Daten"], "die digitale Speicherung von Daten"],
    ["Welche Bedingung ist sprachlich korrekt?", ["Digitale Gesundheit ist sinnvoll, sofern Datenschutz gewährleistet ist.", "Digitale Gesundheit ist sinnvoll, sofern Datenschutz ist gewährleistet.", "Sofern digitale Gesundheit, Datenschutz sinnvoll."], "Digitale Gesundheit ist sinnvoll, sofern Datenschutz gewährleistet ist."],
    ["Welche Aussage ist ausgewogen?", ["Digitale Angebote sollten ärztliche Betreuung ergänzen, aber nicht vollständig ersetzen.", "Apps sollten Ärzte vollständig ersetzen.", "Digitale Gesundheit hat keine Risiken."], "Digitale Angebote sollten ärztliche Betreuung ergänzen, aber nicht vollständig ersetzen."],
  ],
};

export default function C1GrammarQuickCheck({ day, completed = false, onCompleteChange }) {
  const items = useMemo(() => itemsByDay[Number(day)] || [], [day]);
  const [answers, setAnswers] = useState({});
  if (!items.length) return null;
  const correct = items.filter((item, index) => answers[index] === item[2]).length;
  const done = correct === items.length;
  if (done && !completed) onCompleteChange?.(true);
  return <section style={{ ...styles.card, display: "grid", gap: 14, border: "1px solid #c7d2fe", borderRadius: 18 }}>
    <div><span style={{ ...styles.badge, background: "#eef2ff", color: "#3730a3" }}>Learn by choosing</span><h2 style={{ marginBottom: 4 }}>Grammar knowledge check</h2><p style={{ margin: 0, color: "#475569" }}>Answer the real multiple-choice questions after reading the grammar notes.</p></div>
    {items.map(([question, options, answer], index) => <div key={question} style={{ border: "1px solid #e2e8f0", borderRadius: 14, padding: 12, display: "grid", gap: 8 }}>
      <strong>{index + 1}. {question}</strong>
      {options.map((option) => { const selected = answers[index] === option; const isCorrect = option === answer; return <button key={option} type="button" onClick={() => setAnswers((old) => ({ ...old, [index]: option }))} style={{ ...styles.secondaryButton, textAlign: "left", background: selected ? (isCorrect ? "#f0fdf4" : "#fef2f2") : undefined }}>{option}</button>; })}
      {answers[index] ? <div style={{ color: answers[index] === answer ? "#166534" : "#991b1b", fontWeight: 700 }}>{answers[index] === answer ? "Correct." : `Try again. Correct form: ${answer}`}</div> : null}
    </div>)}
    <strong>{correct}/{items.length} correct</strong>
  </section>;
}
