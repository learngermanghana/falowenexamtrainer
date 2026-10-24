import React, { useMemo, useState } from "react";
import { styles } from "../styles";

const MODE = {
  FULL: "full",
  LIGHT: "light",
  EXAM: "exam",
};

const box = { border: "1px solid #c7d2fe", borderRadius: 14, padding: 14, background: "#f8fafc", display: "grid", gap: 8 };
const listStyle = { margin: 0, paddingLeft: 22, lineHeight: 1.7 };

const normalizeQuestion = (lesson) =>
  lesson?.speakingBuilder?.question || String(lesson?.speakingTopic || lesson?.topic || "").replace(/^Sprechen:\s*/i, "");

const fallbackBranches = (lesson) => {
  const questions = Array.isArray(lesson?.topicQuestions) ? lesson.topicQuestions : [];
  const phrases = Array.isArray(lesson?.phrases) ? lesson.phrases : [];
  const vocabulary = Array.isArray(lesson?.vocabulary) ? lesson.vocabulary : [];
  return questions.slice(0, 5).map((question, index) => ({
    id: `fallback-${index}`,
    title: `Punkt ${index + 1}`,
    prompt: question,
    keywords: vocabulary.slice(index, index + 4),
    example: `Entwickle diesen Punkt mit einem Grund und einem konkreten Beispiel aus Alltag, Schule, Beruf oder Gesellschaft.`,
    starter: phrases[index] || "Ein wichtiger Punkt ist, dass ...",
  }));
};

const normalizeBranches = (lesson) => {
  const raw = lesson?.speakingBuilder?.branches;
  const branches = Array.isArray(raw) && raw.length ? raw : fallbackBranches(lesson);
  return branches.map((branch, index) => ({
    ...branch,
    id: branch.id || `${index}-${branch.title || "punkt"}`,
    title: branch.title || `Punkt ${index + 1}`,
    prompt: branch.prompt || branch.question || branch.leitfrage || `Was kannst du zu „${branch.title || `Punkt ${index + 1}`}“ sagen?`,
    example: branch.example || branch.model || branch.development || "Erkläre zuerst deine Aussage, begründe sie und gib danach ein konkretes Beispiel.",
    starter: branch.starter || branch.sentenceStarter || "Ein wichtiger Aspekt besteht darin, dass ...",
  }));
};

export default function B2SpeakingSupportGuide({ lesson }) {
  const [mode, setMode] = useState(MODE.FULL);
  const question = normalizeQuestion(lesson);
  const branches = useMemo(() => normalizeBranches(lesson), [lesson]);
  const plan = lesson?.speakingBuilder?.plan || [];
  const starters = lesson?.speakingBuilder?.starters || [];

  return (
    <div style={{ display: "grid", gap: 14 }}>
      <div style={{ border: "1px solid #fde68a", borderRadius: 14, padding: 12, background: "#fffbeb", color: "#92400e", lineHeight: 1.65 }}>
        <strong>Sprechfrage:</strong> {question}
      </div>

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        <button type="button" onClick={() => setMode(MODE.FULL)} style={mode === MODE.FULL ? styles.primaryButton : styles.secondaryButton}>Mit Hilfe</button>
        <button type="button" onClick={() => setMode(MODE.LIGHT)} style={mode === MODE.LIGHT ? styles.primaryButton : styles.secondaryButton}>Weniger Hilfe</button>
        <button type="button" onClick={() => setMode(MODE.EXAM)} style={mode === MODE.EXAM ? styles.primaryButton : styles.secondaryButton}>Prüfungsmodus</button>
      </div>

      {mode !== MODE.EXAM ? (
        <div style={box}>
          <strong>So baust du einen B2-Punkt:</strong>
          <div>Aussage → Grund → konkretes Beispiel → Folge / Bewertung</div>
        </div>
      ) : null}

      {mode !== MODE.EXAM ? branches.map((branch) => (
        <div key={branch.id} style={box}>
          <h3 style={{ margin: 0 }}>{branch.title}</h3>
          <div><strong>Leitfrage:</strong> {branch.prompt}</div>
          {(branch.keywords || []).length ? <div><strong>Ideen:</strong> {(branch.keywords || []).join(" · ")}</div> : null}
          {mode === MODE.FULL ? <>
            <div><strong>So kannst du den Punkt entwickeln:</strong> {branch.example}</div>
            <div><strong>Satzanfang:</strong> {branch.starter}</div>
          </> : null}
        </div>
      )) : (
        <div style={box}>
          <strong>Jetzt ohne Hilfe:</strong>
          <p style={{ margin: 0 }}>Sprich 2–3 Minuten. Beantworte die Aufgabe selbstständig und entwickle mindestens drei Punkte mit Gründen und Beispielen.</p>
        </div>
      )}

      {mode === MODE.FULL && plan.length ? (
        <div style={box}><strong>Aufbau deiner Antwort</strong><ol style={listStyle}>{plan.map((item) => <li key={item}>{item}</li>)}</ol></div>
      ) : null}
      {mode === MODE.FULL && starters.length ? (
        <div style={box}><strong>Nützliche Satzanfänge</strong><ul style={listStyle}>{starters.map((item) => <li key={item}>{item}</li>)}</ul></div>
      ) : null}
    </div>
  );
}
