import React, { useCallback, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { scoreA2MockSpeaking } from "../services/coachService";
import { A2_GOETHE_SPEAKING_TEIL1 } from "./A2GoetheSpeakingMockTeil1Preview";
import { A2_GOETHE_SPEAKING_TEIL2 } from "./A2GoetheSpeakingMockTeil2Preview";
import { A2_GOETHE_SPEAKING_TEIL3 } from "./A2GoetheSpeakingMockTeil3Preview";
import A2MockSpeakingExaminer from "./A2MockSpeakingExaminer";
import LegacyA2FinalMockSpeaking from "./A2FinalMockSpeaking";

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


export default function A2Mock1ConversationalSpeaking({
  initialAttempts = {}, attemptId = "", onProgress, onComplete, initialResult = null,
  externalSecondsLeft = 0,
}) {
  const {idToken} = useAuth();
  const [parts, setParts] = useState(() => initialAttempts?.examinerParts || {});
  const tasks=useMemo(()=>MOCK_ONE_TASKS,[]);
  const save = useCallback((_teil,_result,updated)=>{
    // The parent saves the immutable session IDs with this exact Mock 1 attempt.
    onProgress?.({attempts:{...initialAttempts,examinerParts:updated},completedCount:Object.keys(updated).length});
    setParts(updated);
    return true;
  },[initialAttempts,onProgress]);
  const complete = useCallback(async updated=>{
    if (!attemptId || !idToken) throw new Error("Sign in to verify your speaking result for this A2 Mock 1 attempt.");
    // Score only the actual saved examiner sessions on the backend. Missing
    // Teils are zero, not fabricated transcripts or client-awarded points.
    const examinerSessionIds=["1","2","3"].map(part=>updated[part]?.sessionId || null);
    const total=await scoreA2MockSpeaking({
      idToken,attemptId,mockId:"a2-mock-01",examinerSessionIds,
    });
    if (total?.assessmentIdentity !== "a2-mock-01-examiner-verified" ||
      total?.maxScore !== 25 || !Number.isFinite(Number(total?.score))) {
      throw new Error("The server has not verified the final A2 speaking score. Retry verification without recording again.");
    }
    onComplete?.(total);
    return true;
  },[attemptId,idToken,onComplete]);
  // Preserve in-progress five-recording attempts created before this redesign.
  // Their verified scoring endpoint still supports those original task IDs.
  const priorRecordingIds = ["teil1_questions","teil1_answers","teil2_main","teil2_followup","teil3"];
  const hasLegacyResponses = !initialAttempts?.examinerParts &&
    priorRecordingIds.some(id=>initialAttempts?.[id]?.transcript || initialAttempts?.[id]?.submitted);
  if (hasLegacyResponses) return <LegacyA2FinalMockSpeaking
    externalSecondsLeft={externalSecondsLeft}
    initialAttempts={initialAttempts} attemptId={attemptId}
    onProgress={onProgress} onComplete={onComplete}/>;
  if(initialResult) return <p role="status">The A2 speaking mock is complete. Review your saved results below.</p>;
  return <A2MockSpeakingExaminer mockId="a2-mock-01" attemptId={attemptId}
    externalSecondsLeft={externalSecondsLeft}
    tasks={tasks} savedParts={parts} onSavePart={save} onComplete={complete}/>;
}
