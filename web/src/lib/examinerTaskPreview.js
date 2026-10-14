import catalogue from "../data/goetheExaminerPublicFlows.json";
export const examinerTaskPreview = (level,task,mode="guided") => {
  const part=String(task?.teil || "").match(/^(?:teil[-\s]*)?([123])$/i)?.[1];
  const key=`${level}-${part}`, profile=catalogue.profiles[key];
  if (!profile) return null;
  const selected=String(task?.keywords || task?.prompt || "Freizeit").split(/[,;·]/)[0].trim().slice(0,120);
  let cards=[];
  if (key === "A1-2") cards=[selected,catalogue.a1InformationCards[0].word];
  if (key === "A2-1") {
    const first=catalogue.personalCards.find(card=>selected.toLowerCase().includes(card.word.toLowerCase()));
    cards=(first ? [first,...catalogue.personalCards.filter(card=>card !== first)] : catalogue.personalCards).map(card=>card.word);
  }
  const topicEntry=Object.entries(catalogue.a2TopicPoints).find(([topic])=>topic !== "default" && String(task?.prompt || "").toLowerCase().includes(topic.toLowerCase()));
  const supplied=String(task?.keywords || "").split(/[,;·]/).map(value=>value.trim()).filter(Boolean);
  return {key,title:profile.title,mode,topic:key === "B1-3" ? (/fragen|feedback|rückmeldung|präsentation|details/i.test(task?.prompt || "") ? "Freizeit" : task?.prompt || "Freizeit") : "",maxAnswers:profile.maxAnswers,role:profile.role,
    cards,card:key === "A1-3" ? selected : "",studentCalendar:profile.studentCalendar || [],
    points:key === "A1-1" ? ["Name","Alter","Land","Wohnort","Sprachen","Beruf","Hobby"] : key === "B1-2" ? catalogue.presentationPoints : key === "B1-1" ? ["Wann treffen wir uns?","Wo treffen wir uns?","Wie kommen wir hin?","Wer übernimmt was?"] : key === "A2-2" ? (supplied.length>=4 ? supplied.slice(0,4) : topicEntry?.[1] || catalogue.a2TopicPoints.default) : [],
    hints:mode === "guided" ? profile.hints : [],
    scenario:key === "A2-3" ? `Sie möchten gemeinsam folgende Aktivität planen: ${String(task?.prompt || "ein Geschenk für einen Freund kaufen").slice(0,180)}. Finden Sie einen gemeinsamen Termin.` : "",
    preparationSeconds:level === "B1" ? 900 : 0};
};
