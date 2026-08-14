import fs from"node:fs";import path from"node:path";import{fileURLToPath}from"node:url";
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),".."),file=path.join(root,"web/src/components/C2Day8To14MasteryPage.js");let s=fs.readFileSync(file,"utf8");
const imp='import C2Days12To18GuidedWorkbookPage from "./C2Days12To18GuidedWorkbookPage";';
if(!s.includes(imp)){const a='import C2Days6To11GuidedWorkbookPage from "./C2Days6To11GuidedWorkbookPage";';if(!s.includes(a))throw new Error("C2 Days 12-18 import anchor missing");s=s.replace(a,`${a}\n${imp}`)}
const route=' if(day>=12&&day<=18)return <C2Days12To18GuidedWorkbookPage lesson={lesson}/>;';
if(!s.includes(route)){const a=' const day=Number(lesson?.day||0);';if(!s.includes(a))throw new Error("C2 Days 12-18 route anchor missing");s=s.replace(a,`${a}\n${route}`)}
if(!s.includes("C2Days12To18GuidedWorkbookPage"))throw new Error("C2 Days 12-18 guided workbook missing");fs.writeFileSync(file,s,"utf8");console.log("C2 Days 12-18 now use the tabbed German-first guided workbook.");
