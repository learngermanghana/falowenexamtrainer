import React,{useCallback,useMemo,useState} from "react";
import {useAuth} from "../context/AuthContext";
import {scoreA2MockSpeaking} from "../services/coachService";
import {A2_KOMBI_MOCK_CONTENT} from "../data/a2KombiMockContent";
import A2MockSpeakingExaminer from "./A2MockSpeakingExaminer";

// Reuse A2 Mock 1's single-tab examiner, 3 speaking Teile and server-verified receipts.
export default function A2KombiMockSpeaking({mockNumber,attemptId,initialAttempts={},initialResult,
 externalSecondsLeft=0,onProgress,onComplete}){
 const mock=A2_KOMBI_MOCK_CONTENT[mockNumber],{idToken}=useAuth();
 const [parts,setParts]=useState(()=>initialAttempts?.examinerParts||{});
 const tasks=useMemo(()=>mock?[
  {teil:"1",title:"Sich vorstellen",english:"Introduce yourself in German, then answer two follow-up questions.",
   prompt:mock.speaking.teil1.prompt,hint:"Give your name, age, home, languages, profession and hobbies; spell your surname and give a phone number."},
  {teil:"2",title:"Von sich erzählen",english:"Speak about the assigned topic, then answer an examiner follow-up.",
   prompt:`Thema: ${mock.speaking.teil2.theme}. ${mock.speaking.teil2.questions.join(" ")}`,
   keywords:mock.speaking.teil2.questions.join(", "),hint:"Respond in German and give connected A2-level sentences."},
  {teil:"3",title:"Etwas gemeinsam planen",english:"Agree with your AI partner on the shared plan.",
   prompt:`Planen Sie gemeinsam: ${mock.speaking.teil3.plan}. Besprechen Sie: ${mock.speaking.teil3.points.join("; ")}`,
   keywords:mock.speaking.teil3.points.join(", "),hint:"Take turns, suggest a date/time, react and agree on a plan."},
 ]:[],[mock]);
 const save=useCallback((_teil,_result,updated)=>{
  setParts(updated);onProgress?.({attempts:{...initialAttempts,examinerParts:updated},completedCount:Object.keys(updated).length});return true;
 },[initialAttempts,onProgress]);
 const complete=useCallback(async updated=>{
  if(!idToken||!attemptId)throw new Error("Sign in to verify this A2 mock speaking attempt.");
  const sessionIds=["1","2","3"].map(teil=>updated[teil]?.sessionId||null);
  const result=await scoreA2MockSpeaking({idToken,attemptId,mockId:mock.id,examinerSessionIds:sessionIds});
  if(result?.assessmentIdentity!==`${mock.id}-examiner-verified`||!Number.isFinite(Number(result.score))||result.maxScore!==25)
   throw new Error("The three A2 speaking parts are not yet server-verified. Retry verification.");
  onComplete?.(result);return true;
 },[idToken,attemptId,idToken,mock,onComplete]);
 if(!mock)return <p role="alert">Unknown A2 mock.</p>;
 if(initialResult)return <p role="status">A2 speaking exam completed. Review the verified result.</p>;
 return <A2MockSpeakingExaminer mockId={mock.id} attemptId={attemptId}
  tasks={tasks} savedParts={parts} externalSecondsLeft={externalSecondsLeft}
  onSavePart={save} onComplete={complete}/>;
}
