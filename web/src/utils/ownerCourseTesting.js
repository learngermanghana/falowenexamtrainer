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

 // Use exact stored class names because the discussion board is keyed by name, not class ID.
export function testingClassOptions(rows,program,level){
  if(!ownerTestingLevels(program).includes(level))return [];
  return (Array.isArray(rows)?rows:[]).map(row=>{
    const language=String(row.language||row.program||"german").trim().toLowerCase().replace(/^kiswahili$/,"swahili");
    return {id:String(row.id||""),name:String(row.name||row.className||row.classId||"").trim(),program:language,level:String(row.levelId||row.level||row.courseLevel||row.languageLevel||"").trim().toUpperCase(),status:String(row.status||"")};
  }).filter(row=>row.id&&row.name&&!row.name.includes("/")&&row.program===program&&row.level===level)
    .sort((a,b)=>a.name.localeCompare(b.name)||a.id.localeCompare(b.id));
}
