// Staged A1 Kombipruefung exam contracts. Do not publish until backend/UI/AI grading is wired.
export const A1_KOMBI_MOCK_IDS = Object.freeze([4,5,6,7,8]);
export const A1_KOMBI_SECTIONS = Object.freeze(["lesen","schreiben","sprechen"]);
export const A1_KOMBI_DURATIONS = Object.freeze({lesen:25,schreiben:15,sprechen:15});
export const A1_KOMBI_SOURCE_MAPPING = Object.freeze({4:1,5:2,6:3,7:4,8:5});
export const A1_KOMBI_MOCKS = Object.freeze(A1_KOMBI_MOCK_IDS.map(number => Object.freeze({
  id: `a1-final-${String(number).padStart(2,"0")}`,
  questionSetId: `a1-mock-${String(number).padStart(2,"0")}`,
  level:"A1",mockNumber:number,sourceTestNumber:A1_KOMBI_SOURCE_MAPPING[number],
  title:`A1 Mock ${number} · Kombiprüfung`,version:"three-module-v1",
  status:"preview",requiredSections:A1_KOMBI_SECTIONS,futureOptionalSection:"hoeren",
  sourceHasHoeren:false,minutes:A1_KOMBI_DURATIONS,scoreMax:75
})));
export function getA1KombiMock(number){
  return A1_KOMBI_MOCKS.find(mock=>mock.mockNumber===Number(number))||null;
}
export function buildA1KombiAttemptContract(mockNumber,options={}){
  const mock=getA1KombiMock(mockNumber);
  if(!mock) throw new Error("Unknown A1 Kombipruefung mock");
  const withHoeren=options.hoerenPublished===true;
  const sections=withHoeren?["lesen","hoeren","schreiben","sprechen"]:[...A1_KOMBI_SECTIONS];
  return {mockId:mock.id,questionSetId:mock.questionSetId,
    assessmentVersion:withHoeren?"four-module-v2":mock.version,sections,
    maxScore:sections.length*25,
    resultsLabel:withHoeren?"Full mock · 4 modules":"Kombiprüfung · 3 modules"};
}
// Historical /75 results stay immutable when new /100 attempts become available.
export function calculateA1KombiResult(attempt,verifiedScores){
  const sections=attempt?.sections;
  if(!Array.isArray(sections)||!sections.length||new Set(sections).size!==sections.length)
    throw new Error("Missing or duplicated attempt sections");
  if(!sections.every(section=>["lesen","hoeren","schreiben","sprechen"].includes(section)))
    throw new Error("Unknown attempt section");
  const values=sections.map(section=>{
    const score=verifiedScores?.[section];
    if(typeof score!=="number"||!Number.isFinite(score)||score<0||score>25)
      throw new Error(`${section} does not have a verified score out of 25`);
    return score;
  });
  const earned=values.reduce((sum,value)=>sum+value,0),maximum=sections.length*25;
  return {mockId:attempt.mockId,assessmentVersion:attempt.assessmentVersion,
    sections:[...sections],scores:Object.fromEntries(sections.map((section,i)=>[section,values[i]])),
    earned,maximum,percentage:Number((earned*100/maximum).toFixed(1)),verified:true};
}
