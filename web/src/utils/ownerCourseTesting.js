// Owner-only, browser-memory course navigation. Never use this as a payment or server entitlement.
const LEVELS = Object.freeze({german:Object.freeze(["A1","A2","B1","B2","C1","C2"]),swahili:Object.freeze(["A1","A2","B1"])});
export const ownerTestingLevels = program => LEVELS[program] || [];
export const isCourseTestingOwner = user => Boolean(user?.uid && user.emailVerified === true && String(user.email||"").trim().toLowerCase()==="moxflex@gmail.com");
export function activeOwnerTestingLevel({user,program,selection,studentProfile,browseOnly=false}){
  if(!isCourseTestingOwner(user)||!studentProfile||browseOnly||studentProfile.accountType==="exam_only"||selection?.uid!==user.uid||selection.program!==program)return "";
  return ownerTestingLevels(program).includes(selection.level)?selection.level:"";
}
export function isOwnerTestingCoursePath(path,level,program){
  if(!ownerTestingLevels(program).includes(level))return false;
  const value=String(path||"").replace(/\/+$/,"");
  if(value==="/campus/course")return true;
  if(!value.startsWith("/campus/course/")||/(?:mock|exam|preview|\/submit)(?:[-/]|$)/i.test(value))return false;
  const swahili=value.startsWith("/campus/course/swahili/");
  if(swahili !== (program==="swahili"))return false;
  const explicit=value.match(/(?:^|[/-])([abc][12])(?=[/-]|$)/i)?.[1]?.toUpperCase();
  return (explicit || (swahili?"A1":level))===level;
}
