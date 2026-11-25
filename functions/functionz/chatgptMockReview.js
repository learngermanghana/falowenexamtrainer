"use strict";
const {germanEnrollment}=require("./chatgptAssignmentSubmission");
const {courseExpiry,resolveEntitlements}=require("./entitlementService");
const {activeSubscriptionsFor}=require("./mockCommerce");
const {enrollmentRows,blockedEnrollmentLevels}=require("./levelEnrollmentAccess");
const {campusMockLinks,listMyExamMocks,getMyExamDictionary}=require("./chatgptExamLibrary");
const {getExamPractice}=require("./chatgptExamPractice");
const {listMockHistory,getMockHistoryReview}=require("./mockAttemptHistory");
const trialExams=require("./trialExams.json");
const TOOLS=new Set(["get_my_falowen_exam_mocks","get_my_falowen_exam_dictionary","get_my_falowen_exam_practice","get_my_falowen_mock_history","get_my_falowen_mock_review"]);
const engineId=m=>m?.mockId?.replace(/^([ab][12])-final-01$/,"$1-mock-01");
const deny=message=>({available:false,message,campusUrl:"https://www.falowen.app/exams/mocks"});

// An exam-only connection may never call any course read/write tools.
function isExamOnlyProfile(p){
  return String(p?.accountType||"").toLowerCase()==="exam_only";
}
function validExamOnlyProfile(p){
  return isExamOnlyProfile(p)&&String(p.role||"student").toLowerCase()==="student"&&p.isTutor!==true&&
    ["registered","active","pending","paid","trial_active","trial_expired","enrolled"].includes(String(p.status||"").toLowerCase())&&
    String(p.program||"german").toLowerCase()==="german"&&["A1","A2","B1","B2","C1","C2"].includes(p.level);
}
function examPolicy({profile,grants=[],policy={},blocked=[],now=Date.now()}){
  const german=germanEnrollment({data:profile});
  const level=german.germanLevel;
  if(!german.enrolledInGerman||!level)return null;
  // A secondary German placement is not equivalent to paid exam access.
  const examOnly=isExamOnlyProfile(profile)||policy.examOnly===true;
  const primary=german.primaryProgram==="german";
  const validGrants=grants.filter(g=>g.level===level&&g.status==="active"&&Number(g.expiresAtMs)>now);
  if(validGrants.some(g=>g.scope==="level"))return {level,full:true,source:"paid_exam_subscription"};
  if(!examOnly&&primary&&!blocked.includes(level)){
    const entitlement=resolveEntitlements({profile,grants:[],now});
    if(courseExpiry(profile)===null&&entitlement.course.day2Plus===true)
      return {level,full:true,source:"full_course"};
    if(entitlement.course.trial&&trialExams[level])return {level,full:false,trial:trialExams[level],source:"course_trial"};
  }
  if(validGrants.some(g=>g.scope==="trial")&&trialExams[level])
    return {level,full:false,trial:trialExams[level],source:"exam_trial"};
  return null;
}
function allowedMock(access,mock){
  return !!mock&&mock.level===access.level&&(access.full||mock.id===access.trial?.catalogId||engineId(mock)===access.trial?.engineId);
}
function revisionGuidance(attempt){
  const labels={lesen:"Lesen",hoeren:"Hören",schreiben:"Schreiben",sprechen:"Sprechen"};
  const sections=Object.entries(attempt.sectionScores||{}).map(([key,points])=>({skill:labels[key]||key,points,maxPoints:25})).sort((a,b)=>a.points-b.points);
  return {basis:"Selected verified attempt only",sections,priorities:sections.slice(0,2).map(s=>s.skill),
    guidance:"Use the lowest recorded sections to plan revision. A missing module is not a zero. This is not a prediction or guarantee of exam success."};
}
async function examTool({name,args,student,admin,uid}){
  const db=admin.firestore();
  if(student?.data?.uid&&student.data.uid!==uid)return deny("Student identity could not be verified.");
  const [policyDoc,grants,rows]=await Promise.all([
    db.collection("courseAccountAccess").doc(uid).get(),
    activeSubscriptionsFor(db,uid),
    enrollmentRows(db.collection("students").doc(student.id)),
  ]);
  const access=examPolicy({profile:student.data,policy:policyDoc.data()||{},grants,
    blocked:blockedEnrollmentLevels(rows,"german")});
  if(!access)return deny("No verified current German exam entitlement. Check your Falowen account or subscription.");
  const links=campusMockLinks(access.level).filter(m=>allowedMock(access,m));
  const published=listMyExamMocks(access.level);
  if(name==="get_my_falowen_exam_mocks"){
    const mocks=published.mocks.filter(m=>allowedMock(access,m));
    return {...published,available:links.length>0||mocks.length>0,mocks,
      campusPractice:links,access:access.source,
      clarification:"Practice Mode can be repeated without creating an official exam attempt. Preview papers remain Campus-only. Timed mode and verified scoring stay in Campus."};
  }
  if(name==="get_my_falowen_exam_dictionary"){
    if(!access.full)return deny("Your trial includes only its designated mock. Open that paper in Practice Mode.");
    return getMyExamDictionary(access.level,args.category,args);
  }
  const requested=String(args.mockId||"");
  const mock=links.find(m=>m.mockId===requested||m.id===requested||engineId(m)===requested);
  if(!mock)return deny("This paper is not included in your current exam access.");
  if(name==="get_my_falowen_exam_practice"){
    if(mock.status!=="ready")return {...deny("This paper is currently a Campus preview, not a published ChatGPT question export."),practiceUrl:mock.practiceUrl};
    const result=getExamPractice(access.level,mock.mockId,args.skill,args.part,args.questionNumber);
    return {...result,practiceUrl:mock.practiceUrl};
  }
  const id=engineId(mock);
  if(name==="get_my_falowen_mock_history"){
    const history=await listMockHistory({db,uid,mockId:id,cursor:args.cursor,
      documentId:admin.firestore.FieldPath.documentId()});
    return {available:true,mockId:id,...history,practiceUrl:mock.practiceUrl,
      clarification:"Verified results only are official; pending attempts do not imply failure. The list is paginated."};
  }
  if(name==="get_my_falowen_mock_review"){
    try{
      const result=await getMockHistoryReview({db,uid,mockId:id,attemptId:args.attemptId});
      // Only the learner's answered mistakes from a verified attempt. Do not
      // emit all correct choices or the key for unanswered questions.
      const objective=Object.fromEntries(Object.entries(result.objective||{}).map(([skill,entry])=>[skill,{
        mistakes:entry.rows.filter(r=>r.status==="incorrect"&&r.submitted).map(r=>({number:r.number,part:r.part,submitted:r.submitted,expected:r.expected})),
        unanswered:entry.rows.filter(r=>r.status==="unanswered").map(r=>({number:r.number,part:r.part})),
        ...(entry.reason?{reason:entry.reason}:{}),
      }]));
      return {available:true,mockId:id,attempt:result.attempt,objective,feedback:result.feedback,
        readiness:revisionGuidance(result.attempt),practiceUrl:mock.practiceUrl,
        clarification:"These corrections are from your verified historical result, not a live exam answer key. For listening, do not invent a transcript or explanation of audio you have not heard."};
    }catch(error){if([400,404,409].includes(error.status))return deny(error.message);throw error;}
  }
  return deny("Unsupported exam tool.");
}
module.exports={TOOLS,isExamOnlyProfile,validExamOnlyProfile,examPolicy,allowedMock,revisionGuidance,examTool};
