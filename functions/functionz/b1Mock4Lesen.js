"use strict";
// Private answer key for the user-supplied B1 Mock 04 Goethe-style Lesen paper.
// No learner-facing JS module imports these answers.
// The submitted Mock 04 Teil 2 question 9 differs from Mock 03: answer C.
const ANSWERS=Object.freeze({
  "1": "richtig",
  "2": "richtig",
  "3": "falsch",
  "4": "falsch",
  "5": "richtig",
  "6": "falsch",
  "7": "b",
  "8": "a",
  "9": "c",
  "10": "b",
  "11": "b",
  "12": "c",
  "13": "d",
  "14": "0",
  "15": "f",
  "16": "b",
  "17": "a",
  "18": "c",
  "19": "h",
  "20": "nein",
  "21": "nein",
  "22": "ja",
  "23": "nein",
  "24": "ja",
  "25": "nein",
  "26": "ja",
  "27": "c",
  "28": "a",
  "29": "c",
  "30": "a"
});
const VALID=Object.freeze(Object.fromEntries(Array.from({length:30},(_,i)=>{
  const n=i+1;
  return [String(n),n<=6?["richtig","falsch"]:n<=12?["a","b","c"]:n<=19?["0","a","b","c","d","e","f","g","h","j"]:n<=26?["ja","nein"]:["a","b","c"]];
})));
function gradeB1Mock4Lesen(answers){
  if(!answers||typeof answers!=="object"||Array.isArray(answers))throw Error("Invalid answers");
  const keys=Object.keys(answers);
  if(keys.length!==30 || keys.some(k=>!Object.hasOwn(ANSWERS,k)))throw Error("Submit 30 valid reading answers");
  for(const [number,answer] of Object.entries(answers)){
    if(typeof answer!=="string"||!VALID[number].includes(answer))throw Error("Invalid reading option");
  }
  const selected=Array.from({length:7},(_,i)=>answers[String(13+i)]).filter(v=>v!=="0");
  if(new Set(selected).size!==selected.length)throw Error("Each advertisement may be used only once");
  const parts=[{teil:1,start:1,end:6},{teil:2,start:7,end:12},{teil:3,start:13,end:19},{teil:4,start:20,end:26},{teil:5,start:27,end:30}];
  const perPart=parts.map(({teil,start,end})=>({teil,total:end-start+1,correct:Array.from({length:end-start+1},(_,i)=>start+i).filter(n=>answers[String(n)]===ANSWERS[String(n)]).length}));
  const correct=perPart.reduce((sum,p)=>sum+p.correct,0);
  return {correct,total:30,percentage:Number((correct/30*100).toFixed(1)),perPart,practiceOnly:true};
}
module.exports={ANSWERS,VALID,gradeB1Mock4Lesen};
