const fs=require("node:fs");
const path=require("node:path");
const catalogue=require("../functions/data/goetheExaminerFlows.json");
const fields=["stageGuide","title","role","maxAnswers","seconds","criteria","hints","opening","studentCalendar","partnerTopic"];
const profiles=Object.fromEntries(Object.entries(catalogue.profiles).map(([key,value])=>[key,Object.fromEntries(fields.filter(field=>field in value).map(field=>[field,value[field]]))]));
const result={version:catalogue.version,profiles,personalCards:catalogue.personalCards,a1InformationCards:catalogue.a1InformationCards,a1RequestCards:(catalogue.a1RequestCards || []).map(({word,symbol,picture})=>({word,symbol,picture})),presentationPoints:catalogue.presentationPoints,a2TopicPoints:catalogue.a2TopicPoints,b1PlanningTasks:catalogue.b1PlanningTasks,b1PresentationTopics:catalogue.b1PresentationTopics,b1DiscussionTopics:catalogue.b1DiscussionTasks.map(({topic})=>topic),b2Topics:catalogue.b2Topics,b2PresentationPoints:catalogue.b2PresentationPoints,a2TopicCards:catalogue.a2TopicCards,a2PlanningTasks:catalogue.a2PlanningTasks.map(({topic,scenario,day,studentSchedule,studentCalendar})=>({topic,scenario,day,studentSchedule,studentCalendar}))};
fs.writeFileSync(path.join(__dirname,"../web/src/data/goetheExaminerPublicFlows.json"),JSON.stringify(result,null,2)+"\n");
