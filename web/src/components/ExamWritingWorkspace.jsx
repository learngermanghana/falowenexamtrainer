import React, { useEffect, useMemo, useRef, useState } from "react";
import { useExam } from "../context/ExamContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import { markLetterWithAI } from "../services/coachService";
import { saveWritingAttempt } from "../services/writingProgressService";
import { saveExamLetterForTutorReview, isTutorReviewCloudEnabled } from "../services/tutorReviewService";
import { buildWritingHistoryRecord } from "./WritingHistorySection";
import WritingFeedbackCard from "./WritingFeedbackCard";
import { assessPracticeForm, getExamWritingModule } from "../data/examWritingWorkspace";
import "./ExamWritingWorkspace.css";

const CHARACTERS = ["ä", "ö", "ü", "ß", "Ä", "Ö", "Ü"];
const valueOf = (value) => String(value || "");
const wordCount = (value) => valueOf(value).trim().split(/\s+/).filter(Boolean).length;
const minutesDisplay = (s) => [Math.floor(Math.max(0, s) / 60), Math.max(0, s) % 60]
  .map((n) => String(n).padStart(2, "0")).join(":");
const keyFor = (owner, level) => "falowen:exam-writing:v2:" + (owner || "guest") + ":" + level;
const readRecords = (key) => {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(key) || "{}");
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  } catch {
    return {};
  }
};
const writeRecords = (key, records) => {
  try { window.localStorage.setItem(key, JSON.stringify(records)); } catch { /* keep in memory */ }
};
const answeredFormFields = (task, values) =>
  (task.formFields || []).filter((field) => !field.fixed && valueOf(values[field.key]).trim());

export default function ExamWritingWorkspace() {
  const { level, setLevel, accessibleLevels } = useExam();
  const { user, idToken, studentProfile } = useAuth();
  const { showToast } = useToast();
  const config = useMemo(() => getExamWritingModule(level), [level]);
  const [partId, setPartId] = useState(config.parts[0].id);
  const part = config.parts.find((item) => item.id === partId) || config.parts[0];
  const [selectedIds, setSelectedIds] = useState({});
  const taskId = selectedIds[level + ":" + part.id] || part.tasks[0]?.id;
  const task = part.tasks.find((item) => item.id === taskId) || part.tasks[0];
  const owner = user?.uid || studentProfile?.studentCode || "guest";
  const storageKey = keyFor(owner, level);
  const [saved, setSaved] = useState(() => ({ key: storageKey, records: readRecords(storageKey) }));
  const records = saved.key === storageKey ? saved.records : readRecords(storageKey);
  const record = records[task?.id] || {};
  const draft = valueOf(record.text);
  const fieldValues = record.values || {};
  const feedback = record.feedback || null;
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [busy, setBusy] = useState(false);
  const [savingTutor, setSavingTutor] = useState(false);
  const [showMobileTasks, setShowMobileTasks] = useState(false);
  const [timerEnabled, setTimerEnabled] = useState(true);
  const [timerRunning, setTimerRunning] = useState(false);
  const [seconds, setSeconds] = useState(config.minutes * 60);
  const deadlineRef = useRef(0);
  const requestInFlight = useRef(false);
  const inputRef = useRef(null);

  useEffect(() => {
    setSaved({ key: storageKey, records: readRecords(storageKey) });
    setFilter("all");
    setSearch("");
  }, [storageKey]);
  useEffect(() => {
    setPartId(config.parts[0].id);
    setSeconds(config.minutes * 60);
    setTimerRunning(false);
    deadlineRef.current = 0;
  }, [config]);
  useEffect(() => {
    if (!timerEnabled || !timerRunning) return undefined;
    const tick = () => {
      const next = Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000));
      setSeconds(next);
      if (next === 0) setTimerRunning(false);
    };
    const handle = window.setInterval(tick, 250);
    return () => window.clearInterval(handle);
  }, [timerEnabled, timerRunning]);

  const changeRecord = (id, patch) => {
    setSaved((previous) => {
      const old = previous.key === storageKey ? previous.records : readRecords(storageKey);
      const next = { ...old, [id]: { ...(old[id] || {}), ...patch, updatedAt: new Date().toISOString() } };
      writeRecords(storageKey, next);
      return { key: storageKey, records: next };
    });
  };
  const changeDraft = (next) => changeRecord(task.id, {
    text: next, feedback: null, completed: false, tutorSaved: false,
  });
  const changeField = (name, next) => changeRecord(task.id, {
    values: { ...fieldValues, [name]: next }, feedback: null, completed: false,
  });
  const changePart = (next) => {
    setPartId(next);
    setSearch("");
    setFilter("all");
    setShowMobileTasks(false);
  };
  const changeTask = (next) => {
    setSelectedIds((old) => ({ ...old, [level + ":" + part.id]: next }));
    setShowMobileTasks(false);
  };
  const toggleTimer = () => {
    if (timerRunning) {
      setSeconds(Math.max(0, Math.ceil((deadlineRef.current - Date.now()) / 1000)));
      setTimerRunning(false);
    } else {
      deadlineRef.current = Date.now() + seconds * 1000;
      setTimerRunning(true);
    }
  };
  const insertCharacter = (character) => {
    const input = inputRef.current;
    const start = input?.selectionStart ?? draft.length;
    const end = input?.selectionEnd ?? draft.length;
    changeDraft(draft.slice(0, start) + character + draft.slice(end));
    window.requestAnimationFrame(() => {
      input?.focus();
      input?.setSelectionRange(start + character.length, start + character.length);
    });
  };
  const saveAttempt = async (checkedTask, original, result, format, teil) => {
    if (!user?.uid) return;
    const studentCode = studentProfile?.studentCode || studentProfile?.studentcode || user.uid;
    const attempt = buildWritingHistoryRecord({
      userId: user.uid, studentCode, level, lessonId: "exam-room-schreiben",
      workbookId: "exam-writing-" + level, taskId: checkedTask.id,
      taskTitle: teil.label + " · " + checkedTask.title, text: original,
      data: result, context: "exam-room",
    });
    await saveWritingAttempt({ userId: user.uid, studentCode, mode: "exam",
      workspaceKey: "exam-room", attempt: { ...attempt, teil: teil.id, format } });
  };
  const evaluate = async () => {
    if (!task || busy || requestInFlight.current) return;
    const selected = task;
    const selectedPart = part;
    if (part.format === "form") {
      if (!answeredFormFields(selected, fieldValues).length) {
        showToast("Bitte fülle zuerst das Formular aus.", "info");
        return;
      }
      const result = assessPracticeForm(selected, fieldValues);
      const summary = String(result.correct) + " von " + String(result.total) + " Feldern richtig ausgefüllt.";
      changeRecord(selected.id, { feedback: { type: "form", ...result, summary }, completed: result.correct === result.total });
      const response = (selected.formFields || []).filter((f) => !f.fixed)
        .map((f) => String(f.number) + ". " + valueOf(fieldValues[f.key])).join("\n");
      void saveAttempt(selected, response, { score: result.correct, maxScore: result.total,
        feedback: summary }, "form", selectedPart);
      showToast("Formular ausgewertet.", "success");
      return;
    }
    const text = part.format === "transformation"
      ? selected.transformations.map((item, i) => String(i + 1) + ". Ausgangssatz: " + item.source
        + "\nSchlüsselwort: " + item.cue + "\nUmformulierung: " + valueOf(fieldValues["answer-" + i])).join("\n\n")
      : draft.trim();
    const incomplete = part.format === "transformation"
      ? selected.transformations.some((item, i) => !valueOf(fieldValues["answer-" + i]).trim())
      : !text.trim();
    if (incomplete) {
      showToast("Bitte bearbeite zuerst alle erforderlichen Antworten.", "info");
      return;
    }
    requestInFlight.current = true;
    setBusy(true);
    try {
      const result = await markLetterWithAI({
        text, level, idToken, studentName: user?.displayName || studentProfile?.name || "Student",
        program: studentProfile?.program,
        submissionContext: "exam-room", taskId: selected.id,
        taskContext: { situation: selected.situation, whatToInclude: selected.points,
          format: selectedPart.format, teil: selectedPart.id,
          ...(part.format === "transformation" ? {
            instructions: "Prüfen Sie Bedeutungsäquivalenz und Grammatik jeder Umformulierung; keine Briefkriterien."
          } : {}) },
        promptType: selectedPart.format === "argument" ? "argument"
          : selectedPart.format === "message" || selectedPart.format === "transformation"
            ? "note" : "email",
      });
      changeRecord(selected.id, { feedback: { type: "ai", data: result },
        checkedText: text, completed: true });
      void saveAttempt(selected, text, result, selectedPart.format, selectedPart);
      showToast("KI-Feedback ist bereit.", "success");
    } catch (err) {
      showToast(err?.response?.data?.error || err?.message || "Analyse fehlgeschlagen. Dein Entwurf bleibt gespeichert.", "error");
    } finally {
      setBusy(false);
      requestInFlight.current = false;
    }
  };
  const sendToTutor = async () => {
    if (!feedback?.data || savingTutor || record.tutorSaved) return;
    setSavingTutor(true);
    try {
      await saveExamLetterForTutorReview({
        user, studentProfile, level, promptId: task.id,
        promptTitle: part.label + " · " + task.title,
        draft: record.checkedText || draft,
        aiFeedback: feedback.data.feedback || feedback.data.structuredFeedback?.summary || "",
        revisedDraft: "", reflection: "", source: "exam-room-simple-writing",
      });
      changeRecord(task.id, { tutorSaved: true });
      showToast("Text für Tutor gespeichert.", "success");
    } catch (err) {
      showToast(err?.message || "Speichern fehlgeschlagen.", "error");
    } finally {
      setSavingTutor(false);
    }
  };

  if (!task) return <p>Keine Schreibaufgaben für dieses Niveau.</p>;
  const visibleTasks = part.tasks.filter((item) => {
    const matches = (item.title + " " + item.category + " " + item.situation)
      .toLocaleLowerCase("de").includes(search.toLocaleLowerCase("de"));
    return matches && (filter === "all" || (filter === "complete"
      ? Boolean(records[item.id]?.completed) : !records[item.id]?.completed));
  });
  const completed = part.tasks.filter((item) => records[item.id]?.completed).length;
  const progress = part.format === "form"
    ? String(answeredFormFields(task, fieldValues).length) + " / "
      + String(task.formFields.filter((f) => !f.fixed).length) + " Felder"
    : part.format === "transformation"
      ? String(task.transformations.filter((item, i) => valueOf(fieldValues["answer-" + i]).trim()).length)
        + " / " + task.transformations.length + " Sätze" : String(wordCount(draft)) + " Wörter";

  return <main className="few" data-testid="exam-writing-workspace">
    <header className="few-heading">
      <div><p className="few-eyebrow">Falowen · Exams Room</p>
        <h1>Schreiben üben</h1><p>Wähle einen Teil, schreibe deinen Text und prüfe deine Antworten.</p></div>
      <div className="few-heading-meta"><label htmlFor="few-level">Prüfungsniveau</label>
        <select id="few-level" value={level} onChange={(event) => setLevel(event.target.value)}>
          {(accessibleLevels || [level]).map((choice) =>
            <option key={choice} value={choice}>{choice}</option>)}</select>
        <span>{level} · {config.parts.length} Teile · {config.minutes} Minuten</span></div>
    </header>
    <nav className="few-parts" aria-label="Schreiben Prüfungsteile">
      {config.parts.map((section) => <button type="button" key={section.id}
        className={section.id === part.id ? "few-part active" : "few-part"}
        aria-current={section.id === part.id ? "step" : undefined}
        onClick={() => changePart(section.id)}>{section.label}</button>)}
    </nav>
    <div className="few-mobile-list-toggle"><button type="button"
      onClick={() => setShowMobileTasks(!showMobileTasks)}>
      {showMobileTasks ? "Aufgaben schließen" : "Aufgaben auswählen"} · {task.title}
    </button></div>
    <div className="few-columns">
      <aside className={showMobileTasks ? "few-sidebar mobile-open" : "few-sidebar"} aria-label="Aufgaben">
        <div className="few-sidebar-heading"><strong>Aufgaben</strong><span>{completed}/{part.tasks.length} erledigt</span></div>
        <input type="search" aria-label="Thema suchen" placeholder="Thema suchen ..."
          value={search} onChange={(event) => setSearch(event.target.value)} />
        <div className="few-filter" role="group" aria-label="Aufgabenfilter">
          {[["all", "Alle"], ["open", "Offen"], ["complete", "Abgeschlossen"]].map(([id, label]) =>
            <button type="button" key={id} className={filter === id ? "active" : ""}
              onClick={() => setFilter(id)}>{label}</button>)}</div>
        <div className="few-task-list">
          {visibleTasks.map((item) => {
            const current = records[item.id] || {};
            const status = current.completed ? "Abgeschlossen"
              : valueOf(current.text).trim() || Object.values(current.values || {}).some((v) => valueOf(v).trim())
                ? "Entwurf" : "Offen";
            return <button type="button" key={item.id} onClick={() => changeTask(item.id)}
              aria-current={item.id === task.id ? "true" : undefined}
              className={item.id === task.id ? "few-task selected" : "few-task"}>
              <strong>{item.title}</strong><span>{item.category}</span><small>{status}</small></button>;
          })}
          {!visibleTasks.length && <p className="few-muted">Keine passenden Themen.</p>}
        </div>
      </aside>
      <div className="few-center">
        <section className="few-timer">
          <label className="few-toggle"><input type="checkbox" checked={timerEnabled}
            onChange={(event) => { setTimerEnabled(event.target.checked); setTimerRunning(false); }} />
            <span><strong>Mit Zeitlimit · {config.minutes} Min</strong>
              <small>Ausschalten, um ohne Zeitlimit zu üben</small></span></label>
          <div className="few-timer-actions">
            <span role="timer" aria-label="Verbleibende Zeit">{timerEnabled ? minutesDisplay(seconds) : "Ohne Limit"}</span>
            {timerEnabled && <button type="button" onClick={toggleTimer} disabled={seconds === 0}>
              {timerRunning ? "Pause" : seconds < config.minutes * 60 ? "Weiter" : "Start"}</button>}
            <button type="button" aria-label="Timer zurücksetzen" onClick={() => {
              setTimerRunning(false); deadlineRef.current = 0; setSeconds(config.minutes * 60);
            }}>↺</button>
          </div>
        </section>
        <section className="few-prompt">
          <div className="few-prompt-label"><span>{level} · {part.label}</span><span>{task.category}</span></div>
          <h2>{task.title}</h2><p>{task.situation}</p>
          <ol>{task.points.map((point, i) => <li key={i}>{point}</li>)}</ol>
          <p className="few-muted">{part.description || ("Schreibe " + (part.targetWords || "deine Antwort")
            + ". Achte auf die Aufgabenpunkte und einen passenden Aufbau.")}</p>
          {task.example && part.format !== "form" && <details className="few-sample">
            <summary>Beispielantwort ansehen (Übungshilfe)</summary>
            <p>Nutze das Beispiel zum Lernen, nicht als fertige eigene Antwort.</p>
            <pre>{task.example}</pre></details>}
        </section>
        <section className="few-editor" aria-label="Deine Antwort">
          <div className="few-editor-heading"><strong>✎ Deine Antwort</strong><span>Automatisch gespeichert</span></div>
          {part.format === "form" ? <div className="few-form"><h3>{task.category}</h3>
            {task.formFields.map((field) => <label className="few-form-field" key={field.key}>
              <span>{field.label}</span>
              {field.fixed ? <strong>{field.fixed}</strong> : <div>
                <small>({field.number})</small><input type="text" value={valueOf(fieldValues[field.key])}
                  onChange={(event) => changeField(field.key, event.target.value)}
                  aria-label={"(" + field.number + ") " + field.label} autoComplete="off" />
                {feedback?.type === "form" && <span className={
                  feedback.checks?.find((check) => check.key === field.key)?.correct ? "few-correct" : "few-incorrect"
                }>{feedback.checks?.find((check) => check.key === field.key)?.correct ? "Richtig" : "Noch einmal prüfen"}</span>}
              </div>}
            </label>)}</div> : part.format === "transformation" ? <div className="few-transform">
            {task.transformations.map((item, i) => <label key={i}>
              <strong>Satz {i + 1} · {item.cue}</strong><span>{item.source}</span><small>{item.hint}</small>
              <textarea rows={2} value={valueOf(fieldValues["answer-" + i])}
                onChange={(event) => changeField("answer-" + i, event.target.value)}
                placeholder="Umformulierung schreiben ..." /></label>)}</div> :
            <div className={part.format === "message" ? "few-writing-input message" : "few-writing-input"}>
              {part.format === "message" && <span className="few-message-label">SMS · Nachricht</span>}
              <textarea ref={inputRef} value={draft} onChange={(event) => changeDraft(event.target.value)}
                rows={part.format === "message" ? 7 : 13}
                placeholder={part.format === "argument" ? "Formuliere deine Meinung ..." :
                  part.format === "message" ? "Schreibe deine Nachricht ..." : "Beginne mit einer passenden Anrede ..."} />
              <div className="few-keys" aria-label="Deutsche Sonderzeichen">{CHARACTERS.map((char) =>
                <button type="button" key={char} onClick={() => insertCharacter(char)}>{char}</button>)}</div>
            </div>}
          <div className="few-editor-footer">
            <span>{progress}{part.targetWords ? " · Ziel: " + part.targetWords : ""}</span>
            <div className="few-actions">
              <button type="button" className="few-secondary" onClick={() => {
                if (window.confirm("Diesen Entwurf und das Feedback für diese Aufgabe löschen?")) {
                  changeRecord(task.id, { text: "", values: {}, feedback: null, completed: false, tutorSaved: false });
                  showToast("Aufgabe zurückgesetzt.", "info");
                }
              }}>Zurücksetzen</button>
              <button type="button" className="few-primary" onClick={evaluate} disabled={busy}>
                {busy ? "Wird geprüft ..." : part.format === "form" ? "Formular prüfen" : "Text analysieren"}
              </button>
            </div>
          </div>
          {timerEnabled && seconds === 0 && <p className="few-time-finished">
            Die Übungszeit ist vorbei. Dein Entwurf bleibt erhalten und kann weiterhin geprüft werden.</p>}
        </section>
      </div>
      <aside className="few-feedback" aria-label="KI-Schreibcoach">
        <h2>✧ Dein KI-Schreibcoach</h2>
        {feedback ? <>
          {feedback.type === "form" ?
            <div className="few-score"><strong>{feedback.correct}/{feedback.total}</strong>
              <span>Richtige Angaben</span><p>{feedback.summary}</p></div> :
            <WritingFeedbackCard feedback={feedback.data.feedback} level={level}
              draft={record.checkedText} rubric={feedback.data.rubric}
              corrections={feedback.data.corrections}
              structuredFeedback={feedback.data.structuredFeedback} />}
          {part.format === "form" ? <details className="few-answer-key">
            <summary>Lösungen zeigen</summary>
            <ol>{task.formFields.filter((field) => !field.fixed).map((field) =>
              <li key={field.key}><strong>{field.label}:</strong> {field.answer[0]}</li>)}</ol>
          </details> : <>
            <button type="button" className="few-secondary few-tutor-button" disabled={
              savingTutor || record.tutorSaved || !isTutorReviewCloudEnabled()
            } onClick={sendToTutor}>
              {record.tutorSaved ? "Für Tutor gespeichert" : savingTutor ? "Wird gespeichert ..." : "Für Tutor speichern"}
            </button>
            {!isTutorReviewCloudEnabled() && <p className="few-muted">Tutor-Speicherung derzeit nicht verfügbar.</p>}
          </>}
        </> : <>
          <span className="few-waiting">Noch nicht analysiert</span>
          <p>Erst schreiben, dann verfeinern. Dein persönliches Feedback erscheint hier, sobald du deinen Text prüfen lässt.</p>
          <hr /><h3>Darauf achten wir</h3>
          <div className="few-rubric"><strong>✓ Aufgabe erfüllt?</strong><small>Alle Inhaltspunkte richtig bearbeitet.</small></div>
          <div className="few-rubric"><strong>▤ Klar & zusammenhängend?</strong><small>Aufbau, Verbindungen und passender Ton.</small></div>
          <div className="few-rubric"><strong>A Sprachlich sicher?</strong><small>Grammatik, Wortschatz und verständliche Formulierungen.</small></div>
        </>}
        <div className="few-feedback-note"><strong>Dein Übungsfortschritt</strong>
          <p>{completed} von {part.tasks.length} Aufgaben in diesem Teil abgeschlossen.</p>
          <p className="few-muted">Übung · Keine offizielle Goethe-Prüfungsbewertung.</p></div>
      </aside>
    </div>
  </main>;
}
