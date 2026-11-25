"use strict";
const LEVELS=["A1","A2","B1"];
const MODULES=["reading","listening","writing","speaking"];
// Server-owned release gate. No question packs or answer keys approved yet.
// Never put an unreviewed pack into the published registry.
const REGISTRY=Object.freeze(LEVELS.map(level=>Object.freeze({
 id:"swahili-"+level.toLowerCase()+"-mock-01",program:"swahili",level,
 title:"Kiswahili "+level+" Mock 1",status:"draft",version:1,
 modules:Object.freeze(["reading","listening","writing"]),speakingEnabled:false
})));
function listExamCatalog(level){
 const index=LEVELS.indexOf(level);
 return REGISTRY.filter(exam=>LEVELS.indexOf(exam.level)<=index).map(({id,program,level,title,status,version,modules,speakingEnabled})=>({id,program,level,title,status,version,modules,speakingEnabled}));
}
function getPublishedExam(id,registry=REGISTRY){
 return registry.find(exam=>exam.id===id&&exam.program==="swahili"&&exam.status==="published"&&exam.approved===true&&validPack(exam))||null;
}
function validPack(exam){
 if(!LEVELS.includes(exam.level)||!Number.isInteger(exam.version)||exam.version<1||exam.speakingEnabled!==false||!Array.isArray(exam.modules)||exam.modules.join(",")!=="reading,listening,writing")return false;
 if(!Array.isArray(exam.questions)||!exam.questions.length||exam.questions.length>100)return false;
 const ids=new Set();
 for(const q of exam.questions){
  if(typeof q.id!=="string"||!/^[a-zA-Z0-9_-]{1,80}$/.test(q.id)||ids.has(q.id)||!MODULES.includes(q.module)||q.module==="speaking"||typeof q.prompt!=="string"||!q.prompt.trim()||!Number.isFinite(q.points)||q.points<=0)return false;
  ids.add(q.id);
  if(q.module==="writing"){if(!q.rubric||typeof q.rubric!=="string")return false;}
  else if(!Array.isArray(q.options)||q.options.length<2||q.options.some(o=>typeof o!=="string"||!o.trim())||new Set(q.options).size!==q.options.length||!Number.isInteger(q.correctIndex)||q.correctIndex<0||q.correctIndex>=q.options.length)return false;
  // Protected listening playback requires a separate verified signer integration.
  if(q.module==="listening"&&(!q.audioId||typeof q.audioId!=="string"))return false;
 }
 return exam.modules.every(module=>exam.questions.some(q=>q.module===module));
}
function normalizeAnswers(exam,input,complete=false){
 if(!input||typeof input!=="object"||Array.isArray(input))return null;
 const questions=new Map(exam.questions.map(q=>[q.id,q]));
 const output={};
 for(const [id,value] of Object.entries(input)){
  const q=questions.get(id);
  if(!q)return null;
  if(q.module==="writing"){if(typeof value!=="string"||value.length>12000||(complete&&!value.trim()))return null;}
  else if(!Number.isInteger(value)||value<0||value>=q.options.length)return null;
  output[id]=value;
 }
 if(complete&&Object.keys(output).length!==questions.size)return null;
 return output;
}
function scoreObjective(exam,answers){
 const sections={};
 for(const q of exam.questions){
  if(q.module==="writing")continue;
  const section=sections[q.module]||(sections[q.module]={score:0,maxScore:0});
  section.maxScore+=q.points;
  if(answers[q.id]===q.correctIndex)section.score+=q.points;
 }
 return sections;
}
function publicQuestions(exam){
 return exam.questions.map(({id,module,prompt,options,audioId,points})=>({id,module,prompt,points,...(options?{options}:{}),...(audioId?{audioId}:{})}));
}
module.exports={LEVELS,REGISTRY,listExamCatalog,getPublishedExam,validPack,normalizeAnswers,scoreObjective,publicQuestions};
