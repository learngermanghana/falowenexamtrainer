import React, { useEffect, useState } from "react";
import { getC1Phase2Lesson } from "../data/c1Phase2Lessons.js";
import { styles } from "../styles";

const panel = { ...styles.card, display: "grid", gap: 12, lineHeight: 1.65, border: "1px solid #cbd5e1", borderRadius: 16 };
export function C1AcademicGrammarPractice({ day }) {
  const lesson = getC1Phase2Lesson(day);
  if (!lesson) return null;
  return <section style={panel} data-c1-academic-grammar={day}>
    <h2 style={{ margin: 0 }}>C1-Grammatik im Kontext</h2>
    <strong>{lesson.grammar}</strong><p style={{ margin: 0 }}>{lesson.rule}</p>
    {lesson.grammarChecks.map(([prompt, answer, reason]) => <details key={prompt}><summary>{prompt}</summary><p><strong>Lösung:</strong> {answer}<br />{reason}</p></details>)}
    <details><summary>Wortschatz · {lesson.vocabulary.length} Ausdrücke</summary><dl>{lesson.vocabulary.map(([term, meaning]) => <React.Fragment key={term}><dt><strong>{term}</strong></dt><dd>{meaning}</dd></React.Fragment>)}</dl></details>
  </section>;
}
function ExamExercise({ lesson }) {
  const [answers, setAnswers] = useState({});
  const [checked, setChecked] = useState(false);
  const [showModel, setShowModel] = useState(false);
  const [played, setPlayed] = useState(false);
  const [notice, setNotice] = useState("");
  const [speaking, setSpeaking] = useState(false);
  const audio = lesson.skill === "Hören";
  useEffect(() => () => { if (audio && typeof window !== "undefined" && window.speechSynthesis) window.speechSynthesis.cancel(); }, [audio]);
  const play = () => {
    const engine = typeof window !== "undefined" ? window.speechSynthesis : null;
    const Voice = typeof window !== "undefined" ? window.SpeechSynthesisUtterance : null;
    if (!engine || !Voice) { setNotice("Keine Browserstimme verfügbar. Bitte eine Lehrkraft vorlesen lassen oder das Transkript als Lesetraining nutzen."); return; }
    const voice = engine.getVoices().find(v => v.localService && /^de[-_]/i.test(v.lang));
    if (!voice) { setNotice("Keine lokale deutsche Stimme verfügbar. Bitte eine Lehrkraft vorlesen lassen oder das Transkript als Lesetraining nutzen."); return; }
    const speech = new Voice(lesson.text); speech.lang = "de-DE"; speech.voice = voice; speech.rate = 0.95;
    speech.onend = () => setSpeaking(false);
    speech.onerror = () => { setSpeaking(false); setPlayed(false); setNotice("Wiedergabe fehlgeschlagen. Bitte erneut versuchen oder eine Lehrkraft vorlesen lassen."); };
    setNotice(""); setPlayed(true); setSpeaking(true); engine.speak(speech);
  };
  const reset = () => { if (audio && window.speechSynthesis) window.speechSynthesis.cancel(); setSpeaking(false); setPlayed(false); setChecked(false); setAnswers({}); setNotice(""); };
  const score = lesson.questions?.filter((q,i) => answers[i] === q[2]).length;
  return <section style={panel} data-c1-academic-practice={lesson.day}>
    <h2 style={{ margin: 0 }}>{lesson.skill} · Teil {lesson.part} · Prüfungstraining</h2>
    <strong>{lesson.title}</strong><p style={{ margin: 0 }}>{lesson.instruction}</p>
    {audio ? <><p style={{ margin: 0 }}>Übung mit lokaler Browserstimme oder Lehrkraft, keine offizielle Prüfungsaufnahme. Lesen Sie zuerst die Aufgaben.</p><button type="button" onClick={play} disabled={played || checked} style={styles.primaryButton}>{speaking ? "Wiedergabe läuft" : played ? "Einmal abgespielt" : "Podcast hören"}</button>{notice && <p role="status">{notice}</p>}</> : lesson.text && <p style={{ whiteSpace: "pre-wrap", margin: 0 }}>{lesson.text}</p>}
    {lesson.questions ? <>
      {lesson.questions.map(([question, choices, correct, explanation], i) => <fieldset key={i} style={{ border: "1px solid #e2e8f0", borderRadius: 10, padding: 10 }} disabled={checked}>
        <legend>{question}</legend>{choices.map((choice,j) => <label key={choice} style={{ display: "block", padding: "4px 0" }}><input type="radio" name={`c1-academic-${lesson.day}-${i}`} checked={answers[i] === j} onChange={() => setAnswers(old => ({ ...old, [i]: j }))} /> {choice}</label>)}
        {checked && <p><strong>{answers[i] === correct ? "Richtig" : "Nicht richtig"} · Lösung: {choices[correct]}</strong> — {explanation}</p>}
      </fieldset>)}
      {checked ? <><p role="status"><strong>{score} / {lesson.questions.length} richtig</strong></p>{audio && <details><summary>Transkript und Belege</summary><p>{lesson.text}</p></details>}<button type="button" style={styles.linkButton} onClick={reset}>Erneut üben</button></> : <><button type="button" style={styles.primaryButton} disabled={speaking || Object.keys(answers).length !== lesson.questions.length} onClick={() => setChecked(true)}>Antworten überprüfen</button>{audio && <details><summary>Alternative: Transkript als Lesetraining</summary><p>{lesson.text}</p></details>}</>}
    </> : <>
      <ol>{lesson.prompts.map(p => <li key={p}>{p}</li>)}</ol>
      {lesson.followups && <><strong>Nachfragen</strong><ul>{lesson.followups.map(p => <li key={p}>{p}</li>)}</ul></>}
      <p>Bearbeite die Aufgabe zunächst selbst im bestehenden Falowen {lesson.skill === "Sprechen" ? "Sprechen" : "Schreiben"}-Übungsbereich oder im Unterricht. Diese Zusatzaufgabe wird nicht automatisch bewertet.</p>
      <button type="button" style={styles.linkButton} onClick={() => setShowModel(v => !v)}>{showModel ? "Muster ausblenden" : "Muster und Selbstcheck anzeigen"}</button>
      {showModel && <><p style={{ whiteSpace: "pre-wrap" }}><strong>{lesson.skill === "Sprechen" ? "Modellausschnitt" : "Musterantwort"}</strong>{"\n"}{lesson.model}</p><ul>{lesson.rubric.map(p => <li key={p}>{p}</li>)}</ul></>}
    </>}
  </section>;
}
export default function C1AcademicExamPractice({ day, tab }) {
  const lesson = getC1Phase2Lesson(day);
  const target = lesson?.skill === "Sprechen" ? "speak" : lesson?.skill === "Schreiben" ? "write" : "learn";
  return lesson && target === tab ? <ExamExercise key={day} lesson={lesson} /> : null;
}
