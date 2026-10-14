const fs=require("node:fs");
const path=require("node:path");
const catalogue=require("../functions/data/goetheExaminerFlows.json");
const fields=["title","role","maxAnswers","seconds","criteria","hints","opening","studentCalendar","partnerTopic"];
const profiles=Object.fromEntries(Object.entries(catalogue.profiles).map(([key,value])=>[key,Object.fromEntries(fields.filter(field=>field in value).map(field=>[field,value[field]]))]));
const result={version:catalogue.version,profiles,personalCards:catalogue.personalCards,a1InformationCards:catalogue.a1InformationCards,presentationPoints:catalogue.presentationPoints,a2TopicPoints:catalogue.a2TopicPoints};
fs.writeFileSync(path.join(__dirname,"../web/src/data/goetheExaminerPublicFlows.json"),JSON.stringify(result,null,2)+"\n");
