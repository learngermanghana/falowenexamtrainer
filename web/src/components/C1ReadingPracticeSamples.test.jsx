import tests from "../data/c1ReadingPdfTests1to8.json";
const bounds=[[1,8],[9,15],[16,23],[24,30]];
const choices=n=>n<=15?"abc":n<=23?"abcdefghij":"abcd";
test("C1 Lesen eight imported tests have four parts and valid thirty-answer keys",()=>{
 expect(tests).toHaveLength(8);
 tests.forEach((exam,index)=>{
  expect(exam.id).toBe("c1-reading-sample-"+String(index+1).padStart(2,"0"));
  expect(exam.sectionTexts).toHaveLength(4);
  expect(exam.answers).toHaveLength(30);
  for(const [section,part] of exam.sectionTexts.entries()){
   expect(part.length).toBeGreaterThan(800);
   expect(part).toMatch(new RegExp("(?:TEIL|Teil)\\s+"+(section+1)));
  }
  exam.answers.forEach((answer,index)=>expect(choices(index+1)).toContain(answer));
 });
});
