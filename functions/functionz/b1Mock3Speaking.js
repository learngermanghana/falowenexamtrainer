"use strict";
// B1 Mock 3 speaking draft. Three original Goethe-style tasks, shared B1
// LiveSpeak examiner, and immutable backend-owned score verification.
const MOCK_ID="b1-mock-03";
const PART_MAX=Object.freeze([9,10,6]);
const TOPICS=Object.freeze({
  a:"Sollten Jugendliche neben der Schule einen Nebenjob haben?",
  b:"Ist Sport im Verein besser als Sport allein?"
});
const PARTNER_PRESENTATION="Ich möchte über das Thema „Digitale Bücher oder gedruckte Bücher?“ sprechen. Digitale Bücher kann ich unterwegs bequem auf dem Handy lesen. Das spart Platz, und ich finde viele Titel schnell. Gedruckte Bücher mag ich aber auch, weil ich mich ohne Bildschirm besser konzentriere. In meinem Heimatland sind gedruckte Bücher in vielen Bibliotheken kostenlos verfügbar. Meiner Meinung nach haben beide Formen Vorteile; persönlich lese ich abends lieber ein richtiges Buch.";
const PLAN_POINTS=Object.freeze([
  {id:"time_place",text:"Wann und wo soll der internationale Sprachabend stattfinden?"},
  {id:"guests",text:"Wen laden wir ein und wie informieren wir die Teilnehmenden?"},
  {id:"program",text:"Welche Aktivitäten und Sprachen bieten wir an?"},
  {id:"responsibilities",text:"Wer besorgt Getränke und Material und wer übernimmt welche Aufgabe?"},
]);
const PLAN="Ihr Deutschkurs möchte in der Stadtbibliothek einen internationalen Sprachabend veranstalten. Planen Sie gemeinsam mit Ihrem Prüfungspartner. Vereinbaren Sie Zeit und Ort, Einladungen, Programm und die Verteilung der Aufgaben.";
const POINTS="Erzählen Sie von Ihren Erfahrungen, beschreiben Sie die Situation in Ihrem Heimatland, nennen Sie Vorteile und Nachteile, äußern Sie Ihre Meinung und schließen Sie mit einem Fazit.";
const DISCUSS="Feedback und Fragen: Ihr Prüfungspartner präsentiert das Thema „Digitale Bücher oder gedruckte Bücher?“. Hören Sie die Präsentation, geben Sie freundliches Feedback und stellen Sie eine Frage. Beantworten Sie anschließend eine Frage zu Ihrer eigenen Präsentation.";
function speakingTasks(choice="a"){
  if(!Object.hasOwn(TOPICS,choice))throw Object.assign(new Error("Unknown B1 presentation topic"),{status:400});
  const topic=TOPICS[choice];
  return [
    {teil:"1",title:"Gemeinsam etwas planen",english:"Plan an international language evening with your live AI partner.",prompt:PLAN+" "+PLAN_POINTS.map(p=>p.text).join(" "),keywords:"Sprachabend, Stadtbibliothek, Gäste, Programm",hint:"Negotiate the decisions together and assign responsibilities."},
    {teil:"2",title:"Ein Thema präsentieren",english:"Give a B1 presentation including experience, home country, pros and cons, opinion and conclusion.",prompt:"Präsentationsthema: "+topic+" "+POINTS,keywords:topic,hint:"Speak coherently; introduce your theme and conclude naturally."},
    {teil:"3",title:"Feedback und Fragen",english:"Listen to a partner presentation, give feedback and a question, then answer a question about your own topic.",prompt:DISCUSS+" Ihr Präsentationsthema: "+topic,keywords:topic,hint:"First respond to the partner's talk and ask one question; then answer their question."},
  ];
}
const err=(message,code="B1_MOCK3_SPEAKING_UNVERIFIED",status=409)=>
  Object.assign(new Error(message),{code,status});
function verifyReceipt(receipt,{uid,attemptId,teil,choice="a",sessionId}){
  const expected=speakingTasks(choice)[Number(teil)-1];
  if(!expected)throw err("Unexpected B1 Mock 3 speaking Teil","B1_MOCK3_SPEAKING_PART_INVALID",400);
  const score=Number(receipt?.assessment?.score),max=Number(receipt?.assessment?.maxScore);
  if(!receipt || receipt.uid!==uid || receipt.sessionId!==sessionId ||
    receipt.mockAttemptId!==attemptId || receipt.level!=="B1" ||
    receipt.task?.id!==MOCK_ID+"-speaking-teil-"+teil ||
    receipt.task?.prompt!==expected.prompt ||
    receipt.examFlowKey!=="B1-"+teil ||
    String(receipt.teil||"").match(/\d+/)?.[0]!==String(teil) ||
    receipt.source!=="exam-speaking-practice" || receipt.completed!==true ||
    !Number.isFinite(score) || !Number.isFinite(max) || max<=0 || score<0 || score>max)
    throw err("B1 Mock 3 Teil "+teil+" has no saved, verified examiner assessment.");
  return {sessionId,score:Number((score/max*PART_MAX[Number(teil)-1]).toFixed(2)),maxScore:PART_MAX[Number(teil)-1],
    feedback_en:String(receipt.feedback||receipt.assessment?.summary||"").slice(0,1800)};
}
function gradeParts(parts,{expired=false}={}){
  if(!Array.isArray(parts)||parts.length!==3)throw err("Exactly 3 parts are required.");
  if(!expired&&parts.some(p=>!p))throw err("Complete all 3 parts before scoring.");
  const score=Number(parts.reduce((sum,p)=>sum+(p?.score||0),0).toFixed(1));
  return {score,maxScore:25,passed:score>=15,parts:Object.fromEntries(parts.map((p,i)=>
      ["teil"+(i+1),p||{score:0,maxScore:PART_MAX[i],feedback_en:"No confirmed answer before the deadline."}])),
    verifiedBy:"immutable-live-speak-results",mockId:MOCK_ID,practiceOnly:true,
    overall_feedback_en:"Falowen B1 conversational speaking practice — not an official Goethe certificate."};
}
module.exports={MOCK_ID,PART_MAX,TOPICS,PARTNER_PRESENTATION,PLAN_POINTS,speakingTasks,verifyReceipt,gradeParts};
