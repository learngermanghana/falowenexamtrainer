import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import A2MockSpeakingExaminer from "./A2MockSpeakingExaminer";
import AppBackButton from "./navigation/AppBackButton";
import {
  B1_MOCK3_SPEAKING as SOURCE,
  buildB1Mock3SpeakingTasks,
} from "../data/b1Mock3SpeakingContent";
import "./B1FinalMockExamPage.css";

const STORAGE_PREFIX = "falowen:b1:mock-03:sprechen:practice:v1";
const PREPARATION_MS = SOURCE.preparationMinutes * 60 * 1000;
const EXAM_MS = SOURCE.durationMinutes * 60 * 1000;
const initial = () => ({
  preparationStartedAt: null,
  speakingStartedAt: null,
  submittedAt: null,
  topicChoice: "a",
  notes: "",
  examinerParts: {},
});
const read = (key) => {
  try {
    const value = JSON.parse(window.localStorage.getItem(key) || "null");
    return value && typeof value === "object" ? { ...initial(), ...value } : initial();
  } catch { return initial(); }
};
const remaining = (endsAt, now) => Math.max(0, Math.ceil(((endsAt || now) - now) / 1000));
const clock = (value) => `${String(Math.floor(value / 60)).padStart(2, "0")}:${String(value % 60).padStart(2, "0")}`;
const skills = [
  { key: "teil1", data: SOURCE.teil1 },
  { key: "teil2", data: SOURCE.teil2 },
  { key: "teil3", data: SOURCE.teil3 },
];

function B1Mock3SpeakingAttempt({ storageKey }) {
  const navigate = useNavigate();
  const [state, setState] = useState(() => read(storageKey));
  const [now, setNow] = useState(Date.now());
  const [saveWarning, setSaveWarning] = useState("");
  const topic = SOURCE.teil2.topics.find(item => item.id === state.topicChoice) || SOURCE.teil2.topics[0];
  const tasks = useMemo(() => buildB1Mock3SpeakingTasks(state.topicChoice), [state.topicChoice]);
  const savedParts = state.examinerParts || {};
  const completedCount = ["1","2","3"].filter(id => Boolean(savedParts[id]?.sessionId && savedParts[id]?.assessment)).length;
  const preparationRemaining = remaining(state.preparationStartedAt ? state.preparationStartedAt + PREPARATION_MS : null, now);
  const speakingRemaining = remaining(state.speakingStartedAt ? state.speakingStartedAt + EXAM_MS : null, now);
  const ended = Boolean(state.submittedAt || (state.speakingStartedAt && speakingRemaining <= 0));
  const fullyCompleted = completedCount === 3;

  useEffect(() => {
    try { window.localStorage.setItem(storageKey, JSON.stringify(state)); }
    catch { setSaveWarning("This device could not save the preparation notes. Check available storage."); }
  }, [state, storageKey]);

  useEffect(() => {
    if ((!state.preparationStartedAt && !state.speakingStartedAt) || ended) return undefined;
    const tick = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(tick);
  }, [state.preparationStartedAt, state.speakingStartedAt, ended]);

  const persist = next => {
    // A successful AI examiner part must be durable before advancing to the next one.
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(next));
      setState(next);
      return true;
    } catch {
      setSaveWarning("Unable to save the speaking progress on this device. Retry without re-recording.");
      return false;
    }
  };

  const startPreparation = () => {
    const next = { ...initial(), preparationStartedAt: Date.now() };
    setNow(next.preparationStartedAt);
    persist(next);
  };

  const startSpeaking = () => {
    const startedAt = Date.now();
    setNow(startedAt);
    persist({ ...state, speakingStartedAt: startedAt, notes: state.notes });
  };

  const savePart = (_teil, _result, updated) => {
    if (ended) return false;
    return persist({ ...state, examinerParts: updated });
  };

  const completeSpeaking = async updated => {
    if (!["1", "2", "3"].every(id => updated[id]?.sessionId && updated[id]?.assessment)) return false;
    return persist({ ...state, examinerParts: updated, submittedAt: Date.now() });
  };

  const reset = () => {
    if (!window.confirm("Start a new speaking practice? The old attempt on this device will be replaced.")) return;
    setNow(Date.now());
    setSaveWarning("");
    persist(initial());
  };

  return (
    <main className="b1-final-shell" data-b1-mock3-sprechen>
      <AppBackButton label="Back to B1 Mock Exams" fallbackPath="/exams/mocks" />
      <header className="b1-final-module-header">
        <p>GOETHE-ZERTIFIKAT B1 · MOCK 3 · SPRECHEN</p>
        <h1>Sprechen</h1>
        <span>{SOURCE.preparationMinutes} Minuten Vorbereitungszeit · ca. {SOURCE.durationMinutes} Minuten Paarprüfung · 3 Teile</span>
        <p>Falowen simuliert die zweite Prüfungsperson mit einem deutschsprachigen KI-Gesprächspartner.</p>
      </header>

      {!state.preparationStartedAt ? (
        <section className="b1-final-rules">
          <h2>Prüfungsüberblick</h2>
          <p>In dieser Übung bereiten Sie sich zunächst allein vor und absolvieren anschließend eine interaktive mündliche Prüfung.</p>
          <p><strong>Orientierung:</strong> Das Goethe-B1-Modul Sprechen wird mit maximal {SOURCE.assessment.maxPoints} Punkten bewertet; die Bestehensgrenze liegt bei {SOURCE.assessment.passPoints} Punkten. Die KI-Rückmeldungen hier sind Übungsergebnisse, kein amtlich verifiziertes Gesamtergebnis.</p>
          <ol>{skills.map(({key,data}) => <li key={key}><strong>{data.title}</strong> · {data.durationLabel}</li>)}</ol>
          <button type="button" className="b1-final-primary" onClick={startPreparation}>15 Minuten Vorbereitung starten</button>
        </section>
      ) : !state.speakingStartedAt ? (
        <>
          <section className="b1-final-rules">
            <h2>Vorbereitung · {clock(preparationRemaining)}</h2>
            <p>Notieren Sie Stichpunkte. In der Prüfung sprechen Sie frei. Ihre Notizen bleiben auf diesem Gerät und werden nicht an die KI geschickt.</p>
            <fieldset style={{ border: "1px solid #cbd5e1", padding: 14, borderRadius: 10 }}>
              <legend><strong>Teil 2 · Wählen Sie ein Thema</strong></legend>
              {SOURCE.teil2.topics.map(option => (
                <label key={option.id} style={{ display: "block", margin: "8px 0" }}>
                  <input type="radio" name="b1-mock3-topic" value={option.id}
                    checked={topic.id === option.id}
                    onChange={() => setState(prev => ({ ...prev, topicChoice: option.id }))} />
                  {" "}{option.title}
                </label>
              ))}
            </fieldset>
          </section>

          <section className="b1-final-writing-task" lang="de">
            <h2>Teil 1 · {SOURCE.teil1.title}</h2>
            <p>{SOURCE.teil1.situation}</p>
            <ul>{SOURCE.teil1.points.map(point => <li key={point}>{point}</li>)}</ul>
            <details><summary>Redemittel · Vorschläge und Einigung</summary>
              {SOURCE.teil1.phrases.map(x => <p key={x.label}><strong>{x.label}:</strong> {x.value}</p>)}
            </details>
          </section>

          <section className="b1-final-writing-task" lang="de">
            <h2>Teil 2 · {SOURCE.teil2.title}</h2>
            <p><strong>Gewähltes Thema:</strong> {topic.title}</p>
            <ol>{SOURCE.teil2.slides.map(slide => <li key={slide.number}>
              <strong>Folie {slide.number} – {slide.label}:</strong> {slide.prompt}
              <p style={{ marginTop: 3, fontStyle: "italic" }}>{slide.phrase}</p>
            </li>)}</ol>
          </section>

          <section className="b1-final-writing-task" lang="de">
            <h2>Teil 3 · {SOURCE.teil3.title}</h2>
            <p>{SOURCE.teil3.objective}</p>
            <ol>{SOURCE.teil3.steps.map(item => <li key={item.label}><strong>{item.label}:</strong> {item.phrase}</li>)}</ol>
          </section>

          <section className="b1-final-rules">
            <label htmlFor="b1-mock3-sprechen-notes"><strong>Meine Stichpunkte (freiwillig)</strong></label>
            <textarea id="b1-mock3-sprechen-notes" rows={7} style={{ width: "100%", marginTop: 8 }}
              placeholder="Kurze Stichpunkte zur Planung und zu Ihrer Präsentation …"
              value={state.notes} onChange={e => setState(prev => ({ ...prev, notes: e.target.value }))} />
            <p>Die Vorbereitung endet nach 15 Minuten. Sie können die mündliche Prüfung auch früher beginnen.</p>
            <button type="button" className="b1-final-primary" onClick={startSpeaking}>Mündliche Prüfung beginnen</button>
          </section>
        </>
      ) : ended ? (
        <section className="b1-final-rules" aria-live="polite">
          <h2>{fullyCompleted ? "Sprechen abgeschlossen" : "Sprechzeit beendet"}</h2>
          <p>{completedCount}/3 Teile mit gespeicherter KI-Rückmeldung. {fullyCompleted
            ? "Ihre gesprochenen Antworten wurden mit dem KI-Prüfungspartner geübt."
            : "Unvollständige Teile gelten nicht als abgelegt. Frühere bestätigte KI-Sitzungen bleiben erhalten."}</p>
          {skills.map(({key,data},index) => {
            const part = savedParts[String(index + 1)];
            return <details key={key}>
              <summary>{data.title} · {part?.assessment ? "Rückmeldung verfügbar" : "Nicht abgeschlossen"}</summary>
              {part?.feedback || part?.assessment?.summary
                ? <p>{part.feedback || part.assessment.summary}</p>
                : <p>Für diesen Teil liegt keine vollständige Bewertung vor.</p>}
              {part?.assessment && Number.isFinite(Number(part.assessment.score)) && Number(part.assessment.maxScore) > 0
                ? <p>KI-Teilbewertung: {part.assessment.score}/{part.assessment.maxScore} (Übung)</p> : null}
            </details>;
          })}
          <p><strong>Hinweis:</strong> Die B1-Sprechen-Prüfung hat insgesamt 100 Punkte (Bestehensgrenze 60). Aus einzelnen KI-Teilbewertungen wird hier kein offizielles Gesamtergebnis abgeleitet.</p>
          <div style={{ display:"flex", gap:10, flexWrap:"wrap", marginTop:16 }}>
            <button type="button" onClick={reset}>Neue Sprechübung starten</button>
            <button type="button" onClick={() => navigate("/exams/mocks")}>Zurück zu den Mock Exams</button>
          </div>
        </section>
      ) : (
        <>
          <section className="b1-final-rules" aria-label="Prüfungszeit">
            <strong>Verbleibende Sprechzeit: {clock(speakingRemaining)}</strong>
            <p>Bearbeitet: {completedCount}/3 Teile. Gewähltes Präsentationsthema: {topic.title}</p>
            <p>Die KI übernimmt die Rolle eines Prüfungspartners. Sprechen Sie frei auf Deutsch und reagieren Sie auf die Fragen. Ihre kurzen Vorbereitungsnotizen werden nicht vorgelesen.</p>
          </section>
          <A2MockSpeakingExaminer
            key="b1-mock-03-live-examiner"
            mockId="b1-mock-03"
            level="B1"
            tasks={tasks}
            savedParts={savedParts}
            attemptId=""
            onSavePart={savePart}
            onComplete={completeSpeaking}
          />
        </>
      )}
      {saveWarning ? <p role="alert">{saveWarning}</p> : null}
    </main>
  );
}

export default function B1Mock3Speaking() {
  const { user } = useAuth();
  const storageKey = `${STORAGE_PREFIX}:${user?.uid || "guest"}`;
  return <B1Mock3SpeakingAttempt key={user?.uid || "guest"} storageKey={storageKey} />;
}
