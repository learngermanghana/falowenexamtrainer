import data from "../data/b1ReadingPdfTests1to8.json";
const choicesFor=(n)=>n<=6?["richtig","falsch"]:n<=12||n>=27?["a","b","c"]:n<=19?["a","b","c","d","e","f","g","h","i","j","X"]:["ja","nein"];
test("eight uploaded B1 reading tests contain the five parts and verified answer sheet",()=>{
 expect(data).toHaveLength(8);
 const uniqueIds=new Set(data.map(x=>x.id));
 expect(uniqueIds.size).toBe(8);
 data.forEach((set,index)=>{
  expect(set.id).toBe("b1-reading-pdf-"+String(index+1).padStart(2,"0"));
  expect(set.sections).toHaveLength(6);
  expect(set.answerKey).toHaveLength(30);
  set.sections.slice(1).forEach((text,index)=>expect(text).toMatch(new RegExp("TEIL\\s+"+(index+1))));
  set.answerKey.forEach((answer,i)=>expect(choicesFor(i+1)).toContain(answer));
 });
});
