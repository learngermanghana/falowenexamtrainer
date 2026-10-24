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

test("Eight distinct B2 sets are available; revised originals are identified",()=>{
 expect(tests.filter(x=>x.availability==="ready")).toHaveLength(8);
 expect(tests.slice(1,4).map(x=>x.sourceType)).toEqual(Array(3).fill("falowen-revised-original"));
 const textSignatures=tests.map(x=>x.sectionTexts.join("\\n").replace(/\\s+/g," ").trim());
 expect(new Set(textSignatures).size).toBe(8);
});
