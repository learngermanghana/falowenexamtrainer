function blockedEnrollmentLevels(rows,program,now=Date.now()){
 const today=new Date(now).toISOString().slice(0,10);
 const language=String(program||"german").toLowerCase().replace(/^kiswahili$/,"swahili");
 const validDate=d=>typeof d==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&Number.isFinite(Date.parse(d))&&new Date(d).toISOString().slice(0,10)===d;
 return [...new Set((Array.isArray(rows)?rows:[]).filter(r=>{
  if(!r||r.program!==language||!["A1","A2","B1","B2","C1","C2"].includes(r.level)||!["active","expired","completed"].includes(r.status))return false;
  if(validDate(r.contractEnd)&&r.contractEnd<today)return true;
  return r.status!=="completed"&&typeof r.balanceDue==="number"&&Number.isFinite(r.balanceDue)&&r.balanceDue>0&&validDate(r.paymentDeadline)&&r.paymentDeadline<today;
 }).map(r=>r.level))];
}
export {blockedEnrollmentLevels};
export function routeEnrollmentLevel(path,search,profile){const s=String(path||"");if(!/^\/(?:campus\/course\/|exams\/|attendance\/)/i.test(s))return "";if(s==="/exams/overview"||s==="/exams/mocks")return "";const direct=s.match(/(?:^|[\/-])([abc][12])(?=[\/-]|$)/i)?.[1];const params=new URLSearchParams(search||"");const hint=[params.get("level"),params.get("assignmentId"),params.get("assignmentKey")].map(v=>String(v||"").match(/^([abc][12])(?=[\s-]|$)/i)?.[1]).find(Boolean);return String(direct||hint||(s.startsWith("/campus/course/")?profile?.level:"")||"").toUpperCase();}
