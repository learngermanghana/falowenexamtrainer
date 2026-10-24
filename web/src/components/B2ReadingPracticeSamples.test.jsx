import tests from "../data/b2ReadingExtractedTests.json";
const allowed=n=>n<=9?["a","b","c","d"]:n<=15?["a","b","c","d","e","f","g","h"]:["a","b","c"];
test("all eight B2 Lesen sets contain five readable parts and thirty graded answers",()=>{
 expect(tests).toHaveLength(8);
 tests.forEach((test,index)=>{
  expect(test.id).toBe("b2-reading-sample-"+String(index+1).padStart(2,"0"));
  expect(test.sectionTexts).toHaveLength(5);
  expect(test.answers).toHaveLength(30);
  test.sectionTexts.forEach((section,i)=>{
   expect(section).toMatch(new RegExp("TEIL\\s+"+(i+1),"i"));
   expect(section.length).toBeGreaterThan(300);
   expect(section).not.toMatch(/Lösungsschlüssel|LÖSUNGSSCHLÜSSEL/i);
  });
  test.answers.forEach((answer,i)=>expect(allowed(i+1)).toContain(answer));
 });
});
