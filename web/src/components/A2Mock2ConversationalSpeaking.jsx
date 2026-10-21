import React, { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { getStudentMockStorageKey } from "../utils/mockReviewAccess";
import A2MockSpeakingExaminer from "./A2MockSpeakingExaminer";
import { A2_MOCK_2_SPEAKING as CONTENT } from "../data/a2Mock2Speaking";
import "./A2Mock2Sprechen.css";

const STORAGE_KEY = "falowen:a2:mock-02:sprechen:v1";
const read = (key) => {
  try { return JSON.parse(localStorage.getItem(key) || "{}") || {}; }
  catch { return {}; }
};

// Keep Mock 2's original content: Mock 1 has different cards and situations.
const TASKS = [
  { teil:"1",title:"Fragen zur Person", english:"Ask questions with the topic cards, then answer your AI partner.",
    prompt:`Stellen Sie zu jedem Stichwort eine Frage: ${CONTENT.cards.map(c=>c.keyword).join(", ")}. Antworten Sie danach auf die Fragen Ihres Partners: ${CONTENT.cards.map(c=>c.samplePartnerQuestion).join(" / ")}.`,
    keywords:CONTENT.cards.map(c=>c.keyword).join(", "),
    hint:"Use all four topic cards; take turns asking and answering in German." },
  { teil:"2",title:"Von sich erzählen", english:"Talk about your free afternoon, then answer the examiner's follow-up questions.",
    prompt:`${CONTENT.teil2.topic} ${CONTENT.teil2.instruction} Stichwörter: ${CONTENT.teil2.points.join(" / ")}. Danach beantworten Sie: ${CONTENT.teil2.followups.join(" / ")}`,
    keywords:CONTENT.teil2.points.join(" / "),
    hint:"Speak for one to two minutes, then answer the examiner's follow-ups in German." },
  { teil:"3",title:"Gemeinsam planen", english:"Plan Thomas's surprise party together with your AI partner.",
    prompt:`${CONTENT.teil3.situation} ${CONTENT.teil3.partnerOpening} ${CONTENT.teil3.partnerFollowup} ${CONTENT.teil3.partnerLast} Besprechen Sie: ${CONTENT.teil3.points.join(" / ")}.`,
    keywords:CONTENT.teil3.points.join(" / "),
    hint:"Discuss time, place, gift, food and invitations with the German-speaking examiner." },
];

function A2Mock2ConversationalSpeakingAttempt({embedded=false,onComplete,reviewReleased=false,attemptId=""}) {
  const {user} = useAuth();
  const storageKey = getStudentMockStorageKey(STORAGE_KEY,user?.uid);
  const [data,setData] = useState(() => read(storageKey));
  const savedParts = data._examinerParts || {};
  const tasks = useMemo(() => TASKS,[]);
  const completeParts = tasks.filter(task => savedParts[task.teil]?.sessionId && savedParts[task.teil]?.assessment).length;
  const legacyComplete = ["t1_questions", "t1_answers", "t2_main", "t2_followups", "t3_plan"]
    .every(key => Boolean(data[key]?.transcript));
  useEffect(() => {
    // Older completed five-recording attempts must still advance to the mock
    // result. Never force a completed student to sit a new examiner exam.
    if (embedded && !reviewReleased && (legacyComplete || completeParts === tasks.length)) onComplete?.();
  }, [embedded, reviewReleased, legacyComplete, completeParts, onComplete, tasks.length]);
  const save = (_teil,_result,parts) => {
    const next = {...read(storageKey),...data,_examinerParts:parts};
    // Persist immediately, before the parent reads section completion.
    localStorage.setItem(storageKey,JSON.stringify(next));
    setData(next);
    return true;
  };

  if (reviewReleased) return (
    <section aria-label="Mock 2 speaking feedback">
      <h2>Speaking · AI examiner feedback</h2>
      <p>{completeParts}/3 speaking parts completed. The AI practice feedback is not a verified official examination grade.</p>
      {tasks.map(task=>savedParts[task.teil] ? <details key={task.teil}>
        <summary>Teil {task.teil} · {task.title}</summary>
        <p>{savedParts[task.teil].feedback || savedParts[task.teil].assessment?.summary || "Feedback saved."}</p>
      </details> : null)}
      {data._mock2Assessment ? <p>{data._mock2Assessment.overall_feedback_en || data._mock2Assessment.feedback}</p> : null}
    </section>
  );

  if (embedded && !attemptId) return <p role="status">Connecting your speaking exam to the verified mock attempt. Your previous answers are safe.</p>;

  return (
    <section data-a2-mock2-sprechen>
      {!embedded ? <h1>A2 Mock 2 · Speaking Exam</h1> : null}
      <header className="a2-mock2-progress">
        <strong>Speaking · A2 Mock 2</strong>
        <span>{completeParts}/3 speaking parts completed · AI examiner speaks in German</span>
      </header>
      {Object.keys(data).some(key=>["t1_questions","t1_answers","t2_main","t2_followups","t3_plan"].includes(key) && data[key]?.transcript) &&
        <details><summary>Earlier saved recordings from the previous speaking format</summary>
          <p>Your earlier transcripts remain on this device. They are not counted as new AI examiner results.</p>
          {["t1_questions","t1_answers","t2_main","t2_followups","t3_plan"].filter(key=>data[key]?.transcript).map(key=>
            <p key={key}><strong>{key}:</strong> {data[key].transcript}</p>)}
        </details>}
      <A2MockSpeakingExaminer mockId="a2-mock-02" tasks={tasks}
        attemptId={attemptId || ""}
        savedParts={savedParts} onSavePart={save}/>
    </section>
  );
}
export default function A2Mock2ConversationalSpeaking(props) {
  const {user}=useAuth();
  return <A2Mock2ConversationalSpeakingAttempt key={user?.uid || "guest"} {...props}/>;
}
