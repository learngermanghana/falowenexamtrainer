import {MOCK_FACTORY_LEVELS, MOCK_FACTORY_SECTIONS, makeMockDraft, validateMockDraft, assertFullMockReady, missingMockRuntimeCapabilities} from "./mockFactoryContract";
import {MOCK_EXAM_CATALOG, buildPracticeMockConfig} from "./mockExamCatalog";

describe("one mock-factory publication contract for A1–C2",()=>{
 test.each(MOCK_FACTORY_LEVELS)("%s starts as a draft and is never auto-published",level=>{
  const draft=makeMockDraft(level,3);
  expect(draft.id).toBe(`${level.toLowerCase()}-mock-03`);
  expect(Object.keys(draft.sections)).toEqual(MOCK_FACTORY_SECTIONS);
  expect(draft.status).toBe("draft");
  expect(validateMockDraft(draft).length).toBeGreaterThan(0);
  const full={id:draft.id,level,title:draft.title,mode:"full",status:"ready",sections:["Lesen","Hören","Schreiben","Sprechen"]};
  expect(missingMockRuntimeCapabilities(full.id)).toContain("completedResultSync");
  expect(()=>assertFullMockReady(full)).toThrow(/cannot be published/);
  expect(buildPracticeMockConfig({id:full.id,level,title:full.title}).status).toBe("preview");
  expect(()=>buildPracticeMockConfig({...full})).toThrow(/cannot be published/);
 });
 test("existing live mocks retain their routes and original status",()=>{
  for(const mock of Object.values(MOCK_EXAM_CATALOG).filter(x=>x.mode==="full"&&x.status==="ready")){
   expect(()=>assertFullMockReady(mock)).not.toThrow();
  }
 });
 test("draft validation detects audio, answer key, rubric, retries and dual deployment",()=>{
  const draft=makeMockDraft("A2",3);
  let errs=validateMockDraft(draft);
  expect(errs.join(" ")).toMatch(/protected audio playback/);
  expect(errs.join(" ")).toMatch(/answer key count/);
  expect(errs.join(" ")).toMatch(/scoring rubric/);
  expect(errs.join(" ")).toMatch(/submission recovery/);
  expect(errs.join(" ")).toMatch(/Backend production/);
  for(const part of MOCK_FACTORY_SECTIONS) {
   draft.sections[part]={ready:true,questionCount:part==="sprechen"?3:part==="schreiben"?2:20,answerKeyCount:20,
    serverAnswerKeyVerified:true,audioAccessVerified:true,rubricVerified:true};
  }
  draft.endToEnd={scoreSavedInAdmin:true,scoreVisibleToStudent:true,idempotentRetry:true,backendDeployed:true,frontendDeployed:true};
  expect(validateMockDraft(draft)).toEqual([]);
  // The QA checklist is advisory. Without a server-backed runtime, publishing stays forbidden.
  expect(()=>assertFullMockReady({...draft,status:"ready",mode:"full",sections:["Lesen","Hören","Schreiben","Sprechen"]})).toThrow();
 });
});
