import React, { useCallback, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { scoreB1MockSpeaking } from "../services/coachService";
import A2MockSpeakingExaminer from "./A2MockSpeakingExaminer";
import { B1_SPEAKING } from "../data/b1FinalMockData";
import { B1_MOCK2_SPEAKING } from "../data/b1Mock2ExamContent";

// Shared A2/B1 LiveSpeak examiner: real German turns, one immutable session
// receipt per Teil, resumable progress and server-verified /25 speaking score.
// Mock 1 and Mock 2 retain their own task cards, attempts, and marking identities.
export function makeB1MockSpeakingTasks(mockId, topicChoice = "a") {
  const data = mockId === "b1-mock-02" ? B1_MOCK2_SPEAKING : B1_SPEAKING;
  const selectedTopic = topicChoice === "b" && data.teil2.alternativeTopic
    ? data.teil2.alternativeTopic : data.teil2.topic;
  const points = data.teil2.points.join(" ");
  const plan = data.teil1;
  return [
    {
      teil:"1",title:"Gemeinsam etwas planen",
      english:"Discuss every planning point with your live AI partner and reach an agreement.",
      prompt:`${plan.situation} ${plan.instruction} Planen Sie gemeinsam: ${plan.points.join(" / ")}`,
      keywords:plan.points.join(", "),
      hint:"Make proposals, respond naturally, disagree when needed, negotiate and assign responsibilities.",
    },
    {
      teil:"2",title:"Ein Thema präsentieren",
      english:"Give a structured presentation without interruption, covering your experiences, home country, pros and cons, opinion and conclusion.",
      prompt:`Thema: ${selectedTopic}. ${points} Halten Sie eine zusammenhängende Präsentation, ca. 3–4 Minuten.`,
      keywords:selectedTopic,
      hint:"Introduction, experience, home country, advantages and disadvantages, opinion and closing.",
    },
    {
      teil:"3",title:"Feedback und Fragen",
      english:"Listen to your AI partner's short presentation, give feedback, ask a question, then answer a question about your own presentation.",
      prompt:`${data.teil3.prompt} Thema Ihrer eigenen Präsentation: ${selectedTopic}.`,
      keywords:selectedTopic,
      hint:"First give helpful feedback and ask a relevant question. Then answer your partner's question about your own topic.",
    },
  ];
}

export default function B1MockConversationalSpeaking({
  mockId = "b1-mock-02", attemptId = "", initialAttempts = {},
  externalSecondsLeft = 0, onProgress, onComplete,
}) {
  const {idToken} = useAuth();
  const [parts,setParts] = useState(() => initialAttempts?.examinerParts || {});
  const [topicChoice,setTopicChoice] = useState(() => initialAttempts?.examinerTopic || "a");
  const [error,setError] = useState("");
  const isSecond = mockId === "b1-mock-02";
  const data = isSecond ? B1_MOCK2_SPEAKING : B1_SPEAKING;
  const tasks = useMemo(() => makeB1MockSpeakingTasks(mockId,topicChoice),[mockId,topicChoice]);
  const completed = ["1","2","3"].filter(k=>parts[k]?.sessionId && parts[k]?.assessment).length;

  const selectTopic = value => {
    if (completed) return;
    setTopicChoice(value);
    onProgress?.({attempts:{...initialAttempts,examinerParts:parts,examinerTopic:value}});
  };
  const savePart = useCallback((_teil,_result,updated)=>{
    onProgress?.({attempts:{...initialAttempts,examinerParts:updated,examinerTopic:topicChoice},
      completedCount:Object.values(updated).filter(p=>p?.sessionId && p?.assessment).length});
    setParts(updated);
    return true;
  },[initialAttempts,onProgress,topicChoice]);
  const finalize = useCallback(async updated=>{
    if (!idToken || !attemptId) throw new Error("A verified B1 mock attempt is required to save speaking.");
    setError("");
    try {
      const examinerSessionIds=["1","2","3"].map(k=>updated[k]?.sessionId || null);
      const scored=await scoreB1MockSpeaking({
        idToken,attemptId,mockId,examinerSessionIds,
      });
      if (scored?.assessmentIdentity !== `${mockId}-examiner-verified` ||
          Number(scored.maxScore)!==25 || !Number.isFinite(Number(scored.score))) {
        throw new Error("The server could not verify the B1 speaking result. Retry without re-recording.");
      }
      onComplete?.(scored);
      return true;
    } catch(err) {
      setError(err?.response?.data?.error || err.message || "Speaking verification failed.");
      throw err;
    }
  },[attemptId,idToken,mockId,onComplete]);

  if (!attemptId || !idToken) return <p role="status">Connecting your B1 speaking session to its saved mock attempt …</p>;
  return <section data-b1-mock-live-examiner={mockId}>
    <header className="b1-final-module-header">
      <p>GOETHE-ZERTIFIKAT B1 · Mock {isSecond ? 2 : 1}</p>
      <h1>Sprechen mit KI-Prüfungspartner</h1>
      <p>Three interactive parts. Falowen saves each examiner session; the score remains private until verified.</p>
    </header>
    {data.teil2.alternativeTopic ? <fieldset style={{display:"grid",gap:10,padding:16,borderRadius:12,border:"1px solid #cbd5e1"}}>
      <legend><strong>Teil 2 · Präsentationsthema wählen</strong></legend>
      <label><input type="radio" name={`${mockId}-presentation-topic`} checked={topicChoice==="a"}
        disabled={Boolean(completed)} onChange={()=>selectTopic("a")}/> Thema A: {data.teil2.topic}</label>
      <label><input type="radio" name={`${mockId}-presentation-topic`} checked={topicChoice==="b"}
        disabled={Boolean(completed)} onChange={()=>selectTopic("b")}/> Thema B: {data.teil2.alternativeTopic}</label>
    </fieldset> : null}
    {error ? <p role="alert">{error}</p> : null}
    <A2MockSpeakingExaminer key={`${mockId}:${attemptId}`}
      level="B1" mockId={mockId} tasks={tasks}
      attemptId={attemptId} savedParts={parts}
      externalSecondsLeft={externalSecondsLeft}
      onSavePart={savePart} onComplete={finalize}/>
  </section>;
}
