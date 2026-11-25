function enrollmentDecision(rows,program,now=Date.now()){
 const today=new Date(now).toISOString().slice(0,10);
 const language=String(program||"german").toLowerCase().replace(/^kiswahili$/,"swahili");
 const validDate=d=>typeof d==="string"&&/^\d{4}-\d{2}-\d{2}$/.test(d)&&Number.isFinite(Date.parse(d))&&new Date(d).toISOString().slice(0,10)===d;
 const validMoney=n=>typeof n==="number"&&Number.isFinite(n)&&n>=0;
 const blocked=[],granted=[],managed=[],versions={};
 for(const r of Array.isArray(rows)?rows:[]){
  if(!r||r.program!==language||!["A1","A2","B1","B2","C1","C2"].includes(r.level))continue;
  managed.push(r.level);versions[r.level]=Number(r.sheetVersion||1);
  if(["cancelled","expired"].includes(r.status)){blocked.push(r.level);continue;}
  if(!["active","completed"].includes(r.status))continue;
  if((validDate(r.contractStart)&&r.contractStart>today)||(validDate(r.contractEnd)&&r.contractEnd<today)||(validMoney(r.balanceDue)&&r.balanceDue>0&&validDate(r.paymentDeadline)&&r.paymentDeadline<today)){blocked.push(r.level);continue;}
  if(validDate(r.contractStart)&&validDate(r.contractEnd)&&r.contractStart<=today&&r.contractEnd>=today&&validMoney(r.tuitionFee)&&validMoney(r.paid)&&validMoney(r.balanceDue)&&Math.abs(r.paid+r.balanceDue-r.tuitionFee)<.011&&(r.balanceDue===0||(r.status==="active"&&validDate(r.paymentDeadline)&&r.paymentDeadline>=today)))granted.push(r.level);
 }
 return {blocked:[...new Set(blocked)],granted:[...new Set(granted)].filter(l=>!blocked.includes(l)),managed:[...new Set(managed)],versions};
}
function blockedEnrollmentLevels(rows,program,now){return enrollmentDecision(rows,program,now).blocked;}
export {enrollmentDecision,blockedEnrollmentLevels};
export function routeEnrollmentLevel(path,search,profile){const s=String(path||"");if(!/^\/(?:campus\/course\/|exams\/|attendance\/)/i.test(s))return "";if(s==="/exams/overview"||s==="/exams/mocks")return "";const direct=s.match(/(?:^|[\/-])([abc][12])(?=[\/-]|$)/i)?.[1];const params=new URLSearchParams(search||"");const hint=[params.get("level"),params.get("assignmentId"),params.get("assignmentKey")].map(v=>String(v||"").match(/^([abc][12])(?=[\s-]|$)/i)?.[1]).find(Boolean);return String(direct||hint||(s.startsWith("/campus/course/")?profile?.level:"")||"").toUpperCase();}
