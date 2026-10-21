import React, { useCallback, useMemo, useState } from "react";
import { A2_GOETHE_SPEAKING_TEIL1 } from "./A2GoetheSpeakingMockTeil1Preview";
import { A2_GOETHE_SPEAKING_TEIL2 } from "./A2GoetheSpeakingMockTeil2Preview";
import { A2_GOETHE_SPEAKING_TEIL3 } from "./A2GoetheSpeakingMockTeil3Preview";
import A2MockSpeakingExaminer from "./A2MockSpeakingExaminer";

const MOCK_ONE_TASKS = [
  {
    teil:"1", title:"Fragen zur Person",
    english:"Ask and answer personal questions using the cards.",
    prompt:`Stellen Sie zu den folgenden Wörtern passende Fragen: ${A2_GOETHE_SPEAKING_TEIL1.keywords.join(", ")}. Beantworten Sie danach die Fragen Ihres Partners: ${A2_GOETHE_SPEAKING_TEIL1.partnerQuestions.join(" / ")}.`,
    keywords:A2_GOETHE_SPEAKING_TEIL1.keywords.join(", "),
    hint:"Ask four questions, then respond to the AI examiner's questions in German.",
  },
  {
    teil:"2", title:"Von sich erzählen",
    english:"Speak about the assigned topic without interruption, then answer a relevant follow-up.",
    prompt:`${A2_GOETHE_SPEAKING_TEIL2.prompt} Stichwörter: ${A2_GOETHE_SPEAKING_TEIL2.keywords.map(item=>item.label).join(", ")}. Nach dem Vortrag: ${A2_GOETHE_SPEAKING_TEIL2.followUp}`,
    keywords:A2_GOETHE_SPEAKING_TEIL2.keywords.map(item=>item.label).join(", "),
    hint:"Speak for around one to two minutes; answer the examiner's follow-up in German.",
  },
  {
    teil:"3", title:"Gemeinsam planen",
    english:"Discuss the situation with your AI partner and agree on a plan.",
    prompt:`${A2_GOETHE_SPEAKING_TEIL3.situation} ${A2_GOETHE_SPEAKING_TEIL3.prompt} ${A2_GOETHE_SPEAKING_TEIL3.partner} Besprechen Sie: ${A2_GOETHE_SPEAKING_TEIL3.points.join(", ")}.`,
    keywords:A2_GOETHE_SPEAKING_TEIL3.points.join(", "),
    hint:"Take turns with your AI partner: suggest, react, agree or disagree, and reach a plan.",
  },
];

const scoreFromVerifiedParts = (parts) => {
  const rows = ["1","2","3"].map((number) => {
    const result=parts[number];
    const raw=Number(result?.assessment?.score);
    const max=Number(result?.assessment?.maxScore);
    if (!Number.isFinite(raw) || !Number.isFinite(max) || max<=0) return null;
    return {number,score:raw/max*25/3,feedback_en:result.feedback||result.assessment?.summary||""};
  });
  if (rows.some(row => !row)) return null;
  const score=Number(rows.reduce((sum,row)=>sum+row.score,0).toFixed(2));
  return {
    score,maxScore:25,
    passed:score>=15,
    overall_feedback_en:"AI examiner practice feedback based on three completed speaking parts. This is a Falowen practice estimate, not an official Goethe result.",
    parts:Object.fromEntries(rows.map(row=>["teil"+row.number,{score:Number(row.score.toFixed(2)),maxScore:25/3,feedback_en:row.feedback_en}])),
  };
};

export default function A2Mock1ConversationalSpeaking({
  initialAttempts = {}, attemptId = "", onProgress, onComplete, initialResult = null,
}) {
  const [parts, setParts] = useState(() => initialAttempts?.examinerParts || {});
  const tasks=useMemo(()=>MOCK_ONE_TASKS,[]);
  const save = useCallback((_teil,_result,updated)=>{
    // The parent mock persists this alongside Lesen, Hören and Schreiben, so
    // a reload resumes the exact completed Teils without a second AI call.
    onProgress?.({attempts:{...initialAttempts,examinerParts:updated},completedCount:Object.keys(updated).length});
    setParts(updated);
    return true;
  },[initialAttempts,onProgress]);
  const complete = useCallback(updated=>{
    const total=scoreFromVerifiedParts(updated);
    if (total) onComplete?.(total);
  },[onComplete]);
  if(initialResult) return <p role="status">The A2 speaking mock is complete. Review your saved results below.</p>;
  return <A2MockSpeakingExaminer mockId="a2-mock-01" attemptId={attemptId}
    tasks={tasks} savedParts={parts} onSavePart={save} onComplete={complete}/>;
}
