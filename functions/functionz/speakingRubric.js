// All scoring is informal CEFR speaking PRACTICE, never a certified exam grade.
// The server computes the final percentage; the model can only supply bounded
// 0..4 evidence-based judgements for dimensions relevant to the task.
const labels={
  taskCompletion:"Task completion",
  languageAccuracy:"Grammar and accuracy",
  vocabulary:"Vocabulary and appropriateness",
  interaction:"Interaction and response",
  organization:"Coherence and organization",
};
const byLevel={
  A1:[40,20,15,25,0],
  A2:[35,20,20,20,5],
  B1:[30,20,20,15,15],
  B2:[25,20,20,15,20],
  C1:[20,20,20,15,25],
  C2:[20,20,20,20,20],
};
const presentation = new Set(["A2-2","B1-2","B2-1","C1-1","C2-1"]);
const dimensions=Object.keys(labels);

function rubricWeights(level,teil) {
  const key=String(level||"").toUpperCase()+"-"+String(teil||"").match(/\d+/)?.[0];
  const values=[...(byLevel[String(level||"").toUpperCase()] || byLevel.A2)];
  if (presentation.has(key)) {
    // A continuous presentation has no peer interaction requirement.
    const removed=values[3];values[3]=0;values[4]+=removed;
  }
  const total=values.reduce((sum,n)=>sum+n,0);
  return Object.fromEntries(dimensions.map((key,index)=>[key,Math.round(values[index]*100/total)/100]));
}

function assessRubric(input,{level,teil,answers=[]}={}) {
  if (!input || typeof input !== "object") return null;
  const weights=rubricWeights(level,teil), sections={}, entries=[];
  for (const key of dimensions) {
    const weight=weights[key];
    if (!weight) continue;
    const part=input[key];
    const score=Number(typeof part === "object" ? part?.score : part);
    if (!Number.isInteger(score) || score<0 || score>4) return null;
    const evidence=String(typeof part === "object" ? part?.evidence||"" : "").trim().slice(0,240);
    sections[key]={label:labels[key],score,maxScore:4,weight,evidence};
    entries.push([weight,score]);
  }
  if (!entries.length || !answers.length) return null;
  const percent=Math.max(0,Math.min(100,Math.round(entries.reduce((sum,[weight,score])=>sum+weight*score/4,0)*100)));
  return {version:1,percent,dimensions:sections,transcriptOnly:true,practiceOnly:true};
}

function verifiedCorrections(input,answers=[]) {
  const text=answers.join("\n");
  if (!Array.isArray(input)) return [];
  return input.slice(0,3).map(item=>({
    original:String(item?.original||"").trim().slice(0,200),
    corrected:String(item?.corrected||"").trim().slice(0,250),
    explanation:String(item?.explanation||"").trim().slice(0,250),
  })).filter(item=>item.original.length>=2 && text.includes(item.original) && item.corrected && item.corrected!==item.original);
}
module.exports={rubricWeights,assessRubric,verifiedCorrections,dimensions};
