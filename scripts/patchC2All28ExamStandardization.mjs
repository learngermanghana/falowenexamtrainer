import fs from"node:fs";
import path from"node:path";
import{fileURLToPath}from"node:url";

const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),"..");
const targets=[
 ["web/src/components/C2Day1GuidedWorkbookPage.js","1"],
 ["web/src/components/C2Days2To5GuidedWorkbookPage.js","day"],
 ["web/src/components/C2Days6To11GuidedWorkbookPage.js","day"],
 ["web/src/components/C2Days12To18GuidedWorkbookPage.js","day"],
 ["web/src/components/C2Days19To24GuidedWorkbookPage.js","day"],
 ["web/src/components/C2Days25To28GuidedWorkbookPage.js","day"],
];
const standardImport='import{C2StandardGrammarPanel,C2StandardSpeakPanel,C2StandardWritePanel}from"./C2StandardExamPanels";';

function replaceTab(source,tab,next,replacement,file){
 const pattern=new RegExp(`\\{active\\s*===\\s*"${tab}"\\s*\\?[\\s\\S]*?(?=\\{active\\s*===\\s*"${next}"\\s*\\?)`);
 if(!pattern.test(source))throw new Error(`C2 standardization could not find ${tab} → ${next} block in ${file}`);
 return source.replace(pattern,replacement);
}

for(const[relative,dayExpr]of targets){
 const file=path.join(root,relative);
 let source=fs.readFileSync(file,"utf8");
 if(!source.includes(standardImport))source=`${standardImport}\n${source}`;
 const learn=`{active === "learn" ? <C2StandardGrammarPanel day={${dayExpr}} completed={progress.learnDone} onCompleteChange={(learnDone)=>setProgress(p=>({...p,learnDone}))}/> : null}`;
 const speak=`{active === "speak" ? <C2StandardSpeakPanel day={${dayExpr}} completed={progress.speakDone} onCompleteChange={(speakDone)=>setProgress(p=>({...p,speakDone}))}/> : null}`;
 const write=`{active === "write" ? <C2StandardWritePanel day={${dayExpr}} completed={progress.writeDone} onCompleteChange={(writeDone)=>setProgress(p=>({...p,writeDone}))}/> : null}`;
 source=replaceTab(source,"learn","speak",learn,file);
 source=replaceTab(source,"speak","write",speak,file);
 source=replaceTab(source,"write","finish",write,file);
 fs.writeFileSync(file,source,"utf8");
}

for(const[relative]of targets){
 const source=fs.readFileSync(path.join(root,relative),"utf8");
 if(!source.includes("C2StandardGrammarPanel"))throw new Error(`${relative}: standard Grammar panel missing`);
 if(!source.includes("C2StandardSpeakPanel"))throw new Error(`${relative}: standard Speak panel missing`);
 if(!source.includes("C2StandardWritePanel"))throw new Error(`${relative}: standard Write panel missing`);
}
console.log("C2 Days 1-28 standardized: Grammar teaches; Speak uses five-minute Goethe-style presentation; Write alternates opinion and Umformung tasks.");
