import {freshTaskOptions,isPractised,matchingExamResult,nextExamTeil,recordExamPractice} from "./speakingPracticeHistory";
test("record feedback once per completed task with level and Teil-specific history",()=>{
 const saved=recordExamPractice({}, {level:"A1",taskId:"teil2-wort",teil:"Teil 2",feedback:"Ask complete sentences",words:["Essen"]});
 expect(saved["A1:teil2-wort"].attempts).toBe(1);
 expect(isPractised(saved,"A1","teil2-wort")).toBe(true);
 expect(isPractised(saved,"A2","teil2-wort")).toBe(false);
 expect(recordExamPractice(saved,{level:"A1",taskId:"teil2-wort",teil:"Teil 2",feedback:"",words:[]})).toBe(saved);
 expect(recordExamPractice(saved,{level:"A1",taskId:"teil2-wort",teil:"Teil 2",feedback:"Try again",words:["Trinken"]})["A1:teil2-wort"].words).toEqual(["Essen","Trinken"]);
});
test("prefer unused word or request tasks, but allow retry after the bank is exhausted",()=>{
 const all=[{id:"a"},{id:"b"},{id:"c"}];
 const history=recordExamPractice({}, {level:"A1",taskId:"b",teil:"Teil 2",feedback:"ok"});
 expect(freshTaskOptions(all,history,"A1").map(t=>t.id)).toEqual(["a","c"]);
 const allDone={...history,...recordExamPractice({}, {level:"A1",taskId:"a",teil:"Teil 2",feedback:"ok"}),...recordExamPractice({}, {level:"A1",taskId:"c",teil:"Teil 3",feedback:"ok"})};
 expect(freshTaskOptions(all,allDone,"A1")).toEqual(all);
});
test("never rehydrate feedback belonging to a different Teil or level",()=>{
 const past={level:"A1",examTask:{id:"intro"},feedback:"Previously completed"};
 expect(matchingExamResult(past,{level:"A1",taskId:"intro"})).toBe(true);
 expect(matchingExamResult(past,{level:"A1",taskId:"teil2"})).toBe(false);
 expect(matchingExamResult(past,{level:"A2",taskId:"intro"})).toBe(false);
 expect(nextExamTeil("A1","Teil 1")).toBe("2");
 expect(nextExamTeil("A1","Teil 3")).toBeNull();
});
