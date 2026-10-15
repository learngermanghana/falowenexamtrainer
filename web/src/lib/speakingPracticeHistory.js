// Shared between the original Speaking Coach picker and live examiner.
// Completion is only recorded after the server returns actual task feedback.
export const practiceKey = (level, taskId) => String(level || "").toUpperCase() + ":" + String(taskId || "");
export function recordExamPractice(history={}, {level,taskId,teil,feedback,words=[],completedAt=new Date().toISOString()}) {
  if (!level || !taskId || !String(feedback || "").trim()) return history;
  const key=practiceKey(level,taskId);
  const prior=history[key] || {};
  return {...history,[key]:{
    level:String(level).toUpperCase(),taskId,teil:String(teil || ""),
    completedAt,attempts:Math.max(0,Number(prior.attempts)||0)+1,
    words:[...new Set([...((prior.words)||[]),...words].filter(Boolean))].slice(0,30),
    feedback:String(feedback).slice(0,2200)
  }};
}
export function isPractised(history,level,taskId) {
  return Boolean(history?.[practiceKey(level,taskId)]?.completedAt);
}
export function freshTaskOptions(questions=[],history={},level="") {
  const fresh=questions.filter(q=>!isPractised(history,level,q.id));
  return fresh.length ? fresh : questions;
}
export const nextExamTeil = (level,teil) => {
  const parts={A1:3,A2:3,B1:3};
  const max=parts[String(level||"").toUpperCase()] || 3;
  const current=Number(String(teil||"").match(/\d+/)?.[0]||0);
  return current>=1 && current<max ? String(current+1) : null;
};
export const matchingExamResult = (result,{level,taskId}={}) =>
  Boolean(result?.feedback && result?.examTask?.id && result.examTask.id===taskId &&
    String(result.level || "").toUpperCase()===String(level || "").toUpperCase());
