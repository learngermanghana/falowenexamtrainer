// Event-based placement monitoring, no cloud timer or per-second server updates.
const API_PATH="/api/placement-attempts";
const SENT_PREFIX="falowen.placementMonitor.sent.";
export const makePlacementAttemptId=()=>{
  const uuid=typeof crypto!=="undefined"&&typeof crypto.randomUUID==="function"
    ? crypto.randomUUID()
    : Date.now().toString(36)+"-"+Math.random().toString(36).slice(2)+"-"+Math.random().toString(36).slice(2);
  return "pt_"+uuid;
};
const readSent=(key)=>{try{return localStorage.getItem(SENT_PREFIX+key)==="1";}catch(_){return false;}};
const markSent=(key)=>{try{localStorage.setItem(SENT_PREFIX+key,"1");}catch(_){}};
export async function postPlacementEvent(payload){
  const response=await fetch(API_PATH,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(payload),cache:"no-store"});
  const result=await response.json().catch(()=>({}));
  if(!response.ok||result.ok!==true){
    const error=new Error(result.error||"Could not save your placement record");
    error.status=response.status;
    throw error;
  }
  return result;
}
export async function sendPlacementEventOnce(payload){
  const key=payload.id+":"+payload.action;
  if(readSent(key))return {ok:true,duplicate:true};
  const result=await postPlacementEvent(payload);
  markSent(key);
  return result;
}
export function answersToIndices(answers,questions){
  return questions.map(q=>{
    const index=q.options.indexOf(answers[q.id]);
    return Object.prototype.hasOwnProperty.call(answers,q.id)&&index>=0?index:null;
  });
}
