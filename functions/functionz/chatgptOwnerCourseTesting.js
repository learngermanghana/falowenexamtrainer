"use strict";
// Mirrors the existing Campus owner-only browser preview identity, but uses
// the server-verified OAuth subject and a fresh Firebase Auth record.
const OWNER_EMAIL="moxflex@gmail.com";
const TEST_LEVELS=Object.freeze(["A1","A2","B1","B2","C1","C2"]);
const READ_TOOLS=new Set(["get_my_falowen_revision_levels","get_my_falowen_revision_lesson","get_my_falowen_lesson_content","get_my_falowen_practice_guide"]);
function ownerPreviewRequest(name,args={}){
  if(!READ_TOOLS.has(name))return false;
  if(name==="get_my_falowen_revision_levels")return true;
  return TEST_LEVELS.includes(args.level)&&Number.isInteger(args.day)&&args.day>=1&&args.day<=50&&
    (name!=="get_my_falowen_revision_lesson"||args.program==="german");
}
async function verifiedOwnerPreview({session,student,admin,name,args}){
  if(!ownerPreviewRequest(name,args)||!session?.uid||session.emailVerified!==true||
    String(session.email||"").trim().toLowerCase()!==OWNER_EMAIL||
    !student?.id||String(student.data?.accountType||"").toLowerCase()==="exam_only"||
    (student.data?.uid&&student.data.uid!==session.uid))return false;
  try{
    const [user,policy]=await Promise.all([admin.auth().getUser(session.uid),admin.firestore().collection("courseAccountAccess").doc(session.uid).get()]);
    return user?.uid===session.uid&&user.emailVerified===true&&user.disabled!==true&&
      String(user.email||"").trim().toLowerCase()===OWNER_EMAIL&&policy.data()?.examOnly!==true;
  }catch{return false;}
}
const previewInfo=()=>({enabled:true,program:"german",levels:[...TEST_LEVELS],readOnly:true,officialSubmission:false,
  guidance:"Developer Testing Access: explicitly request a German level with get_my_falowen_revision_lesson, get_my_falowen_lesson_content or get_my_falowen_practice_guide. This previews learner-facing course content only. Recorded enrolments, grades, exam access, payments and submissions remain unchanged."});
module.exports={verifiedOwnerPreview,ownerPreviewRequest,previewInfo};
