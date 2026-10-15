import catalogue from "../data/goetheExaminerPublicFlows.json";
export const examinerTaskPreview = (level,task,mode="guided") => {
  const part=String(task?.teil || "").match(/^(?:teil[-\s]*)?([123])$/i)?.[1];
  const key=`${level}-${part}`, profile=catalogue.profiles[key];
  if (!profile) return null;
  const selected=String(task?.keywords || task?.prompt || "Freizeit").split(/[,;·]/)[0].trim().slice(0,120);
  let cards=[],cardThemes=[];
  if (key === "A1-2" || key === "A2-1") {
    let defaults=key === "A1-2" ? catalogue.a1InformationCards : catalogue.personalCards;
    const match=defaults.find(card=>card.word.toLocaleLowerCase("de-DE") === selected.toLocaleLowerCase("de-DE"));
    const first=match?.word || selected;
    if (key === "A2-1" && match) {const index=defaults.indexOf(match);defaults=[...defaults.slice(index),...defaults.slice(0,index)];}
    // A1 information exchange must cover two different topics.
    const position=defaults.indexOf(match);
    const rotated=position < 0 ? defaults : [...defaults.slice(position+1),...defaults.slice(0,position)];
    const otherTheme=key === "A1-2" && match?.theme ? rotated.filter(card=>card.theme !== match.theme) : defaults;
    cards=[...new Map([first,...otherTheme.map(card=>card.word),...defaults.map(card=>card.word)].map(word=>[word.toLocaleLowerCase("de-DE"),word])).values()].slice(0,key === "A1-2" ? 2 : 4);
    if (key === "A1-2" && (!match || (!String(task?.prompt || "").trim() && selected))) cards=cards.slice(0,1);
  }
  cardThemes=cards.map(word=>key === "A1-2" ? catalogue.a1InformationCards.find(card=>card.word === word)?.theme || "" : "");
  const requestCards = key === "A1-3" ? (() => {
    const all = catalogue.a1RequestCards;
    const first = all.find(card => card.word.toLocaleLowerCase("de-DE") === selected.toLocaleLowerCase("de-DE")) || {word:selected || "Buch bringen",symbol:"🗂️"};
    return [first,...all.filter(card => card.word.toLocaleLowerCase("de-DE") !== first.word.toLocaleLowerCase("de-DE"))].slice(0,2)
      .map(card => ({word:card.word,symbol:card.symbol,...(card.picture ? {picture:card.picture} : {})}));
  })() : [];
  const topicEntry=Object.entries(catalogue.a2TopicPoints).find(([topic])=>topic !== "default" && String(task?.prompt || "").toLowerCase().includes(topic.toLowerCase()));
  const supplied=String(task?.keywords || "").split(/[,;·]/).map(value=>value.trim()).filter(Boolean);
  const calendar=key === "A2-3" ? catalogue.a2PlanningTasks.find(item=>item.topic === task?.prompt) : null;
  const planningPoints=key === "B1-1" ? catalogue.b1PlanningTasks.find(item=>String(task?.prompt || "").toLowerCase().includes(item.match.toLowerCase()))?.points : null;
const planningTopic = task => {
  const prompt=String(task?.prompt || "").trim(), keywords=String(task?.keywords || "").trim();
  return prompt.includes("(") && !prompt.includes(")") && keywords.includes(")") ? `${prompt}, ${keywords}` : prompt;
};
  const displayTopic=key === "B1-1" ? planningTopic(task) : String(task?.prompt || "").slice(0,180);
  const b2Question=key.startsWith("B2-") ? catalogue.b2Topics[part].find(item=>item.topic === task?.prompt)?.question || task?.hint || "" : "";
  return {key,stageGuide:profile.stageGuide || "",title:profile.title,mode,topic:key === "B1-3" ? (/fragen|feedback|rückmeldung|präsentation|details/i.test(task?.prompt || "") ? "Freizeit" : task?.prompt || "Freizeit") : ["A2-2","B1-1","B1-2","B2-1","B2-2","C1-1","C1-2","C2-1","C2-2"].includes(key) ? displayTopic : "",presentationQuestion:b2Question || (key === "B1-2" ? catalogue.b1PresentationTopics.find(item=>item.topic === task?.prompt)?.question || "" : ""),maxAnswers:key === "A1-2" ? cards.length*2 : profile.maxAnswers,role:profile.role,
    cards,cardThemes,card:"",requestCards,studentCalendar:calendar?.studentCalendar || profile.studentCalendar || [],calendarDay:calendar?.day || "",studentSchedule:calendar?.studentSchedule || [],
    points:key === "A1-1" ? ["Name","Alter","Land","Wohnort","Sprachen","Beruf","Hobby"] : key === "B2-1" ? catalogue.b2PresentationPoints : key === "B1-2" ? catalogue.presentationPoints : key === "B1-1" ? planningPoints?.map(point=>point.text) || ["Wann treffen wir uns?","Wo treffen wir uns?","Wie kommen wir hin?","Wer übernimmt was?"] : key === "A2-2" ? (supplied.length>=4 ? supplied.slice(0,4) : catalogue.a2TopicCards.find(card=>card.topic === task?.prompt)?.points || topicEntry?.[1] || catalogue.a2TopicPoints.default) : [],
    hints:mode === "guided" ? profile.hints : [],
    scenario:key === "A2-3" ? calendar?.scenario || `Sie möchten gemeinsam folgende Aktivität planen: ${String(task?.prompt || "ein Geschenk für einen Freund kaufen").slice(0,180)}. Finden Sie einen gemeinsamen Termin.` : "",
    preparationSeconds:profile.preparationSeconds ?? (["B1","B2"].includes(level) ? 900 : 0)};
};
