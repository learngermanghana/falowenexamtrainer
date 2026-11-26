import {activeOwnerTestingLevel,isCourseTestingOwner,isOwnerTestingCoursePath,ownerTestingLevels,testingClassOptions} from "./ownerCourseTesting";
const owner={uid:"owner-uid",email:"moxflex@gmail.com",emailVerified:true};
const selection={uid:owner.uid,program:"german",level:"C2"};
const input={user:owner,program:"german",selection,studentProfile:{level:"A2",paid:2800}};
test("verified owner may inspect any German level without modifying the profile",()=>{
  expect(activeOwnerTestingLevel(input)).toBe("C2");
  expect(ownerTestingLevels("german")).toEqual(["A1","A2","B1","B2","C1","C2"]);
  expect(ownerTestingLevels("swahili")).toEqual(["A1","A2","B1"]);
  expect(input.studentProfile).toEqual({level:"A2",paid:2800});
});
test("non-owner, unverified user, other session, other language and exam-only or browse accounts cannot enable testing",()=>{
  for(const user of [null,{...owner,emailVerified:false},{...owner,email:"someone@example.com"},{...owner,uid:"different"}]){
    expect(activeOwnerTestingLevel({...input,user})).toBe("");
  }
  expect(isCourseTestingOwner({email:owner.email,emailVerified:true})).toBe(false);
  expect(activeOwnerTestingLevel({...input,program:"swahili"})).toBe("");
  expect(activeOwnerTestingLevel({...input,studentProfile:{accountType:"exam_only"}})).toBe("");
  expect(activeOwnerTestingLevel({...input,browseOnly:true})).toBe("");
  expect(activeOwnerTestingLevel({...input,selection:{...selection,level:"X9"}})).toBe("");
  expect(activeOwnerTestingLevel({...input,selection:null})).toBe("");
});
test("route exception is limited to chosen language and level of Course Book, not Exams or Account",()=>{
  expect(isOwnerTestingCoursePath("/campus/course","B2","german")).toBe(true);
  expect(isOwnerTestingCoursePath("/campus/course/lesson/B2/4","B2","german")).toBe(true);
  expect(isOwnerTestingCoursePath("/campus/course/lesson/A1/4","B2","german")).toBe(false);
  expect(isOwnerTestingCoursePath("/campus/course/b2-final-mock-exam","B2","german")).toBe(false);
  expect(isOwnerTestingCoursePath("/campus/course/preview/B2","B2","german")).toBe(false);
  expect(isOwnerTestingCoursePath("/exams/mocks","B2","german")).toBe(false);
  expect(isOwnerTestingCoursePath("/campus/account","B2","german")).toBe(false);
  expect(isOwnerTestingCoursePath("/campus/course/swahili/b1/day-28","B1","swahili")).toBe(true);
  expect(isOwnerTestingCoursePath("/campus/course/swahili/b1/day-28","B1","german")).toBe(false);
  expect(isOwnerTestingCoursePath("/campus/course/swahili/day-5","A1","swahili")).toBe(true);
  expect(isOwnerTestingCoursePath("/campus/course/swahili/day-5","B1","swahili")).toBe(false);
});

test("class selector uses exact stored class names and excludes other languages and levels",()=>{
  const rows=[{id:"a",name:"A1 Leipzig Klasse",language:"German",levelId:"A1"},{id:"b",name:"A2 Dortmund Klasse",language:"German",levelId:"A2"},{id:"c",name:"Kiswahili A1 – Arusha",language:"Swahili",levelId:"A1"},{id:"d",name:"A1 Previous Klasse",language:"German",levelId:"A1",status:"archived"},{id:"e",name:"bad/path",level:"A1"}];
  expect(testingClassOptions(rows,"german","A1").map(row=>row.name)).toEqual(["A1 Leipzig Klasse","A1 Previous Klasse"]);
  expect(testingClassOptions(rows,"swahili","A1").map(row=>row.id)).toEqual(["c"]);
  expect(testingClassOptions(rows,"german","A2").map(row=>row.id)).toEqual(["b"]);
  expect(testingClassOptions(rows,"german","C2")).toEqual([]);
});
